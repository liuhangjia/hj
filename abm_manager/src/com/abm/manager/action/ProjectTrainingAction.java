package com.abm.manager.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.abm.common.dao.ProjectDao;
import com.abm.common.dao.ProjectTrainingDao;
import com.abm.common.dao.ProjectTrainingEmpDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.ProjectModel;
import com.abm.common.model.ProjectTrainingEmpModel;
import com.abm.common.model.ProjectTrainingModel;
import com.abm.common.service.ProjectTrainingService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ProjectTrainingAction extends BaseAction{

	private String project_id;
	private String ids;
	private String train_id;
	
	public void empList(){
		JSONObject result = new JSONObject();
		result.element(TOTAL, 0);
		result.element(ROWS, "[]");
		
		List<ProjectTrainingEmpModel> list = ProjectTrainingEmpDao.getSingle().queryByPage("and PROJECT_TRAINING_ID=?", new String[]{train_id}, page, rows, "SCORE", "desc");
		if(null!=list && !list.isEmpty()){
			int total=ProjectTrainingEmpDao.getSingle().getTotal("and PROJECT_TRAINING_ID=?", new String[]{train_id});
			result.element(TOTAL, total);
			result.element(ROWS, JSONArray.fromObject(list));
		}
	
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
			
			flag = ProjectTrainingService.getSingle().del(ids);
			if(flag){
				result.element(MSG, "删除成功");
				log(Constants.SysLog.TYPE_DELETE_PROJECTTRAINING, "", Constants.SysLog.RESULT_SUCCESS);
			}else{
				log(Constants.SysLog.TYPE_DELETE_PROJECTTRAINING, "", Constants.SysLog.RESULT_SUCCESS);
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
		condition.append(" and exists(select * from project where project.id=PROJECT_TRAINING.project_id and project.is_delete='0') ");
		
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.isNotEmpty(value)){
					if(StringUtil.eq(key, "project_name")){
						condition.append(" and exists(select * from project a where a.id=PROJECT_TRAINING.project_id and a.name like ?) ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "start_time")){
						condition.append(" and PROJECT_TRAINING.start_time >= str_to_date(?, '%Y-%m-%d') ");
						params.add( value );
					}
					if(StringUtil.eq(key, "end_time")){
						condition.append(" and PROJECT_TRAINING.end_time <= str_to_date(?, '%Y-%m-%d') ");
						params.add( value );
					}
					if(StringUtil.eq(key, "teacher")){
						condition.append(" and PROJECT_TRAINING.teacher like ? ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "type")){
						condition.append(" and PROJECT_TRAINING.type like ? ");
						params.add("%" + value + "%");
					}
				}
			}
		}
		
		if(StringUtil.isNotEmpty(project_id)){
			condition.append(" and PROJECT_ID=? ");
			params.add(project_id);
		}else{
			condition.append(PrivUtil.getConditionForProject(user,"PROJECT_TRAINING_LIST"));
		}
		
		List<ProjectTrainingModel> list = ProjectTrainingDao.getSingle().queryByPage(condition.toString(), params.toArray(new String[0]), page, rows, "PROJECT_ID asc,start_time", "desc");
		if(null!=list && !list.isEmpty()){
			Set<String> project_id_set = new HashSet<String>();
			for (ProjectTrainingModel model : list) {
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
			for (ProjectTrainingModel model : list) {
				ProjectModel pm = id_project_map.get(model.getProject_id());
				if(null!=pm){
					model.setProject_name(pm.getName());
					model.setProjectModel(pm);
				}
			}
			int total=ProjectTrainingDao.getSingle().getTotal(condition.toString(), params.toArray(new String[0]));
			result.element(TOTAL, total);
			result.element(ROWS, JSONArray.fromObject(list));
		}
	
		sendResult(result);
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

	public String getTrain_id() {
		return train_id;
	}

	public void setTrain_id(String train_id) {
		this.train_id = train_id;
	}
	
}
