package com.abm.manager.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.abm.common.dao.ProjectDao;
import com.abm.common.dao.ProjectEventDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.ProjectEventModel;
import com.abm.common.model.ProjectModel;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.mw.common.utils.Common;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ProjectEventAction extends BaseAction{

	private String project_id;
	private String ids;
	private ProjectEventModel event;

	public void modify(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "保存失败");
		try {
			if(null==event){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			String logType="";
			if(StringUtil.isEmpty(event.getId())){
				event.setId(Common.uuid());
				flag = ProjectEventDao.getSingle().add(event);
				logType = Constants.SysLog.TYPE_ADD_PROJECTEVENT;
			}else{
				flag = ProjectEventDao.getSingle().update(event, false);
				logType = Constants.SysLog.TYPE_UPDATE_PROJECTEVENT;
			}
			
			if(flag){
				result.element(MSG, "保存成功");
				log(logType, "", Constants.SysLog.RESULT_SUCCESS);
			}else{
				log(logType, "", Constants.SysLog.RESULT_FAIL);
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
			
			flag = ProjectEventDao.getSingle().delete(ss);
			if(flag){
				result.element(MSG, "删除成功");
				log(Constants.SysLog.TYPE_DELETE_PROJECTEVENT, "", Constants.SysLog.RESULT_SUCCESS);
			}else{
				log(Constants.SysLog.TYPE_DELETE_PROJECTEVENT, "", Constants.SysLog.RESULT_FAIL);
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
		condition.append(" and exists(select * from project where project.id=PROJECT_EVENT.project_id and project.is_delete='0') ");
		
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.isNotEmpty(value)){
					if(StringUtil.eq(key, "project_name")){
						condition.append(" and exists(select * from project a where a.id=PROJECT_EVENT.project_id and a.name like ?) ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "start")){
						condition.append(" and PROJECT_EVENT.OCCUR_TIME >= str_to_date(?, '%Y-%m-%d') ");
						params.add( value );
					}
					if(StringUtil.eq(key, "end")){
						condition.append(" and PROJECT_EVENT.OCCUR_TIME <= str_to_date(?, '%Y-%m-%d') ");
						params.add( value );
					}
					if(StringUtil.eq(key, "record_name")){
						condition.append(" and PROJECT_EVENT.record_name like ? ");
						params.add("%" + value + "%");
					}
				}
			}
		}
		
		if(StringUtil.isNotEmpty(project_id)){
			condition.append(" and PROJECT_ID=? ");
			params.add(project_id);
		}else{
			condition.append(PrivUtil.getConditionForProject(user,"PROJECT_EVENT_LIST"));
		}
		
		List<ProjectEventModel> list = ProjectEventDao.getSingle().queryByPage(condition.toString(), params.toArray(new String[0]), page, rows, "PROJECT_ID asc,OCCUR_TIME", "desc");
		if(null!=list && !list.isEmpty()){
			Set<String> project_id_set = new HashSet<String>();
			for (ProjectEventModel model : list) {
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
			for (ProjectEventModel model : list) {
				ProjectModel pm = id_project_map.get(model.getProject_id());
				if(null!=pm){
					model.setProject_name(pm.getName());
					model.setProjectModel(pm);
				}
			}
			int total=ProjectEventDao.getSingle().getTotal(condition.toString(), params.toArray(new String[0]));
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

	public ProjectEventModel getEvent() {
		return event;
	}

	public void setEvent(ProjectEventModel event) {
		this.event = event;
	}
	
}
