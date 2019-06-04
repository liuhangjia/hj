package com.abm.manager.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.abm.common.dao.ProjectCommunicationDao;
import com.abm.common.dao.ProjectDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.ProjectCommunicationModel;
import com.abm.common.model.ProjectModel;
import com.abm.common.service.ProjectCommunicationService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ProjectCommunicationAction extends BaseAction{

	private ProjectCommunicationModel pcm;
	private String project_id;
	private String ids;
	
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
			
			flag = ProjectCommunicationDao.getSingle().delete(ss);
			if(flag){
				result.element(MSG, "删除成功");
				log(Constants.SysLog.TYPE_DELETE_PROJECTCOMMUNICATION, "", Constants.SysLog.RESULT_SUCCESS);
			}else{
				log(Constants.SysLog.TYPE_DELETE_PROJECTCOMMUNICATION, "", Constants.SysLog.RESULT_SUCCESS);
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void modify(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "保存失败");
		try {
			if(null==pcm){
				result.element(MSG, "请填写信息");
				sendResult(result);
				return;
			}
			if(StringUtil.isEmpty(pcm.getId()) && pcm.getEmp_id().indexOf(",")>0){
				List<ProjectCommunicationModel> list=new ArrayList<ProjectCommunicationModel>();
				String[] emp_ids=pcm.getEmp_id().split(",");
				String[] emp_names=pcm.getEmp_name().split(",");
				for (int i = 0; i < emp_ids.length; i++) {
					ProjectCommunicationModel model=new ProjectCommunicationModel();
					model.setContent(pcm.getContent());
					model.setEmp_id(emp_ids[i]);
					model.setEmp_name(emp_names[i]);
					model.setName(pcm.getName());
					model.setPosition(pcm.getPosition());
					model.setProject_id(pcm.getProject_id());
					model.setScore(pcm.getScore());
					list.add(model);
				}
				flag=ProjectCommunicationService.getSingle().add(list);
			}else{
				flag=ProjectCommunicationService.getSingle().modify(pcm);
			}
			
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
		condition.append(" and exists(select * from project where project.id=PROJECT_COMMUNICATION.project_id and project.is_delete='0') ");
		
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.isNotEmpty(value)){
					if(StringUtil.eq(key, "project_name")){
						condition.append(" and exists(select * from project a where a.id=PROJECT_COMMUNICATION.project_id and a.name like ?) ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "start")){
						condition.append(" and PROJECT_COMMUNICATION.COMM_TIME >= str_to_date(?, '%Y-%m-%d') ");
						params.add( value );
					}
					if(StringUtil.eq(key, "end")){
						condition.append(" and PROJECT_COMMUNICATION.COMM_TIME <= str_to_date(?, '%Y-%m-%d') ");
						params.add( value );
					}
					if(StringUtil.eq(key, "hfrxm")){
						condition.append(" and PROJECT_COMMUNICATION.EMP_NAME like ? ");
						params.add("%" + value + "%");
					}
				}
			}
		}
		
		if(StringUtil.isNotEmpty(project_id)){
			condition.append(" and PROJECT_ID=? ");
			params.add(project_id);
		}else{
			condition.append(PrivUtil.getConditionForProject(user,"PROJECT_COMMUNICATION_LIST"));
		}
		
		List<ProjectCommunicationModel> list = ProjectCommunicationDao.getSingle().queryByPage(condition.toString(), params.toArray(new String[0]), page, rows, "PROJECT_ID asc,COMM_TIME", "desc");
		if(null!=list && !list.isEmpty()){
			Set<String> project_id_set = new HashSet<String>();
			for (ProjectCommunicationModel model : list) {
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
			for (ProjectCommunicationModel model : list) {
				ProjectModel pm = id_project_map.get(model.getProject_id());
				if(null!=pm){
					model.setProject_name(pm.getName());
					model.setProjectModel(pm);
				}
			}
			int total=ProjectCommunicationDao.getSingle().getTotal(condition.toString(), params.toArray(new String[0]));
			result.element(TOTAL, total);
			result.element(ROWS, JSONArray.fromObject(list));
		}
	
		sendResult(result);
	}

	public ProjectCommunicationModel getPcm() {
		return pcm;
	}

	public void setPcm(ProjectCommunicationModel pcm) {
		this.pcm = pcm;
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
