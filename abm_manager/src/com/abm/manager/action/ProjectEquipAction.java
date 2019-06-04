package com.abm.manager.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.abm.common.dao.ProjectDao;
import com.abm.common.dao.ProjectEquipDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.ProjectEquipModel;
import com.abm.common.model.ProjectModel;
import com.abm.common.service.ProjectEquipService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ProjectEquipAction extends BaseAction{

	private String param;
	private String project_id;
	private String ids;
	
	public void update(){
		JSONObject param_json = isTrueFromJSONObjectParam(param);
		if(!param_json.optBoolean(SUCCESS)){
			return;
		}
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "保存失败");
		try {
			JSONObject json = param_json.optJSONObject("param");
			ProjectEquipModel model = (ProjectEquipModel) JSONObject.toBean(json, ProjectEquipModel.class);
			flag = ProjectEquipDao.getSingle().update(model, false);
			if(flag){
				result.element(MSG, "保存成功");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void delete(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "删除失败");
		try {
			if(StringUtil.isEmpty(ids)){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			
			String[] ss = ids.split(",");
			if(null == ss || ss.length==0){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			
			flag = ProjectEquipDao.getSingle().delete(ss);
			if(flag){
				result.element(MSG, "删除成功");
				log(Constants.SysLog.TYPE_DELETE_PROJECTEQUIP, "", Constants.SysLog.RESULT_SUCCESS);
			}else{
				log(Constants.SysLog.TYPE_DELETE_PROJECTEQUIP, "", Constants.SysLog.RESULT_SUCCESS);
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void add(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "保存失败");
		try {
			if(StringUtil.isEmpty(param)){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			JSONObject param_json=null;
			try {
				param_json=JSONObject.fromObject(param);
			} catch (Exception e) {
				e.printStackTrace();
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			String project_id=param_json.optString("project_id");
			JSONArray array=param_json.optJSONArray("equips");
			List<ProjectEquipModel> equipList=new ArrayList<ProjectEquipModel>();
			for (int i = 0; i < array.size(); i++) {
				JSONObject json=array.optJSONObject(i);
				json.remove("ct");
				ProjectEquipModel pEquip=(ProjectEquipModel) JSONObject.toBean(json, ProjectEquipModel.class);
				pEquip.setProject_id(project_id);
				equipList.add(pEquip);
			}
			flag=ProjectEquipService.getSingle().add(equipList);
			if(flag){
				result.element(MSG, "保存成功");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void list(){
		JSONObject result = new JSONObject();
		result.element(TOTAL, 0);
		result.element(ROWS, "[]");
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);

		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		condition.append(" and exists(select * from project where project.id=PROJECT_EQUIP.project_id and project.is_delete='0') ");
		
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.isNotEmpty(value)){
					if(StringUtil.eq(key, "project_name")){
						condition.append(" and exists(select * from project a where a.id=PROJECT_EQUIP.project_id and a.name like ?) ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "category")){
						condition.append(" and PROJECT_EQUIP.category like ? ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "name")){
						condition.append(" and PROJECT_EQUIP.name like ? ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "factory")){
						condition.append(" and PROJECT_EQUIP.factory like ? ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "model")){
						condition.append(" and PROJECT_EQUIP.model like ? ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "quantity_min")){
						condition.append(" and PROJECT_EQUIP.quantity >= ? ");
						params.add(value);
					}
					if(StringUtil.eq(key, "quantity_max")){
						condition.append(" and PROJECT_EQUIP.quantity <= ? ");
						params.add(value);
					}
				}
			}
		}
		
		if(StringUtil.isNotEmpty(project_id)){
			condition.append(" and PROJECT_ID=? ");
			params.add(project_id);
		}else{
			condition.append(PrivUtil.getConditionForProject(user,"PROJECT_EQUIP_LIST"));
		}
		
		List<ProjectEquipModel> list = ProjectEquipDao.getSingle().queryByPage(condition.toString(), params.toArray(new String[0]), page, rows, "PROJECT_ID asc,category", "asc");
		if(null!=list && !list.isEmpty()){
			Set<String> project_id_set = new HashSet<String>();
			for (ProjectEquipModel model : list) {
				project_id_set.add(model.getProject_id());
			}
			String project_ids_str="";
			for (String id : project_id_set) {
				project_ids_str+=",'"+id+"'";
			}
			List<ProjectModel> projectList = ProjectDao.getSingle().executeQuery("and project.id in ("+project_ids_str.substring(1)+")");
			Map<String,ProjectModel> id_project_map = new HashMap<String,ProjectModel>();
			for (ProjectModel pm : projectList) {
				id_project_map.put(pm.getId(), pm);
			}
			for (ProjectEquipModel model : list) {
				ProjectModel pm = id_project_map.get(model.getProject_id());
				if(null!=pm){
					model.setProject_name(pm.getName());
					model.setProjectModel(pm);
				}
			}
			int total=ProjectEquipDao.getSingle().getTotal(condition.toString(), params.toArray(new String[0]));
			result.element(TOTAL, total);
			result.element(ROWS, JSONArray.fromObject(list));
		}
	
		sendResult(result);
	}

	public String getParam() {
		return param;
	}

	public void setParam(String param) {
		this.param = param;
	}

	public String getProject_id() {
		return project_id;
	}

	public void setProject_id(String project_id) {
		this.project_id = project_id;
	}

	public String getIds() {
		return ids;
	}

	public void setIds(String ids) {
		this.ids = ids;
	}
	
}
