package com.abm.manager.action;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;



import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.abm.common.dao.EmployeeDao;
import com.abm.common.dao.EnterpriseEmpDao;
import com.abm.common.dao.EquipDao;
import com.abm.common.dao.ProjectDao;
import com.abm.common.dao.ProjectEmpDao;
import com.abm.common.dao.ProjectRangeDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.EmployeeModel;
import com.abm.common.model.EnterpriseEmpModel;
import com.abm.common.model.EquipModel;
import com.abm.common.model.ProjectEmpModel;
import com.abm.common.model.ProjectModel;
import com.abm.common.model.ProjectRangeModel;
import com.abm.common.service.ProjectEmpService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.abm.manager.util.Config;
import com.mw.common.utils.StringUtil;

public class ProjectEmpAction extends BaseAction{
	
	private String param;
	private String project_id;
	private String ids;
	
	public void getProjectEmps(){
		JSONArray result = new JSONArray();
		if(StringUtil.isNotEmpty(project_id)){
			List<ProjectEmpModel> list = ProjectEmpDao.getSingle().executeQuery("and project_emp.project_id=?", new String[]{project_id});
			if(null!=list && !list.isEmpty()){
				result = JSONArray.fromObject(list);
			}
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
			String[] id_ss=ids.split(",");
			if(null==id_ss || id_ss.length==0){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			flag = ProjectEmpDao.getSingle().delete(id_ss);
			if(flag){
				result.element(MSG, "删除成功");
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
			JSONArray array=param_json.optJSONArray("emps");
			List<ProjectEmpModel> empList=new ArrayList<ProjectEmpModel>();
			for (int i = 0; i < array.size(); i++) {
				JSONObject json=array.optJSONObject(i);
				json.remove("ct");
				ProjectEmpModel pEmp=(ProjectEmpModel) JSONObject.toBean(json, ProjectEmpModel.class);
				pEmp.setProject_id(project_id);
				empList.add(pEmp);
			}
			flag=ProjectEmpService.getSingle().add(empList);
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
	
	public void empListForCombobox(){
		JSONArray array=new JSONArray();
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		EmployeeModel employee = user.getEmployee();
		if(null!=employee){
			List<EnterpriseEmpModel> enterpriseManagers = EnterpriseEmpDao.getSingle().executeQuery(" and status = '1' and is_enterprise_admin = '1' and emp_id = ?",new String[]{employee.getId()});
			if(null != enterpriseManagers && !enterpriseManagers.isEmpty()){
				EnterpriseEmpModel enterpriseManager = enterpriseManagers.get(0);
				List<EmployeeModel> list=EmployeeDao.getSingle().executeQuery("and exists(select * from ENTERPRISE_EMP a where employee.id=a.emp_id and a.ENTERPRISE_ID=?)", new String[]{enterpriseManager.getEnterprise_id()});
				if(null!=list && !list.isEmpty()){
					array=JSONArray.fromObject(list);	
				}
			}
		}
		sendResult(array);
	}
	
	public void modify(){
		
	}
	
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
			ProjectEmpModel model = (ProjectEmpModel) JSONObject.toBean(json, ProjectEmpModel.class);
			flag = ProjectEmpDao.getSingle().update(model, false);
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
		//
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);

		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		condition.append(" and exists(select * from project where project.id=PROJECT_EMP.project_id and project.is_delete='0') ");
		
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.isNotEmpty(value)){
					if(StringUtil.eq(key, "project_name")){
						condition.append(" and exists(select * from project a where a.id=PROJECT_EMP.project_id and a.name like ?) ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "name")){
						condition.append(" and PROJECT_EMP.name like ? ");
						params.add("%" + value + "%");
					}
//					if(StringUtil.eq(key, "depart_name")){
//						condition.append(" and PROJECT_EMP.depart_name like ? ");
//						params.add("%" + value + "%");
//					}
					if(StringUtil.eq(key, "qy")){
						condition.append(" and exists(select * from project where project.id=project_emp.project_id and project.ENTERPRISE_ID=?) ");
						params.add(value);
					}
					if(StringUtil.eq(key, "depart_name")){
						if(!StringUtil.eq(value, "-1")){
							condition.append(" and PROJECT_EMP.depart_name = ? ");
							params.add(value);
						}
					}
					if(StringUtil.eq(key, "phone")){
						condition.append(" and PROJECT_EMP.phone like ? ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "position")){
						condition.append(" and PROJECT_EMP.position like ? ");
						params.add("%" + value + "%");
					}
				}
			}
		}
		
		if(StringUtil.isNotEmpty(project_id)){
			condition.append(" and PROJECT_ID=? ");
			params.add(project_id);
		}else{
			condition.append(PrivUtil.getConditionForProject(user,"PROJECT_EMPLOYEE_LIST"));
		}
		
		List<ProjectEmpModel> list = ProjectEmpDao.getSingle().queryByPage(condition.toString(), params.toArray(new String[0]), page, rows, "PROJECT_EMP.PROJECT_ID", "asc");
		
		if(null!=list && !list.isEmpty()){
			Set<String> project_id_set = new HashSet<String>();
			Set<String> range_id_set = new HashSet<String>();
			for (ProjectEmpModel model : list) {
				range_id_set.add(model.getRange_id());
				project_id_set.add(model.getProject_id());
			}
			String project_ids_str="";
			for (String id : project_id_set) {
				project_ids_str+=",'"+id+"'";
			}
			String range_ids_str="";
			for (String id : range_id_set) {
				range_ids_str+=",'"+id+"'";
			}
			List<ProjectModel> projectList = ProjectDao.getSingle().executeQuery("and project.id in ("+project_ids_str.substring(1)+")");
			Map<String,ProjectModel> id_project_map = new HashMap<String,ProjectModel>();
			for (ProjectModel pm : projectList) {
				id_project_map.put(pm.getId(), pm);
			}
			for (ProjectEmpModel model : list) {
				ProjectModel pm = id_project_map.get(model.getProject_id());
				if(null!=pm){
					model.setProject_name(pm.getName());
					model.setProjectModel(pm);
				}
			}
			List<ProjectRangeModel> rangeList = ProjectRangeDao.getSingle().executeQuery(" and project_range.id in ("+range_ids_str.substring(1)+")");
			Map<String, String> range_map = new HashMap<String, String>();
			if(rangeList!=null)
			{
				for (ProjectRangeModel rm : rangeList) {
					range_map.put(rm.getId(), rm.getName());
				}
			}
			for (ProjectEmpModel model : list) {
				if(range_map.containsKey(model.getRange_id()))
				{
					model.setRange_name(range_map.get(model.getRange_id()));
				}
				
			}
			int total=ProjectEmpDao.getSingle().getTotal(condition.toString(), params.toArray(new String[0]));
			result.element(TOTAL, total);
			result.element(ROWS, JSONArray.fromObject(list));
		}
	
	
		sendResult(result);
	}
	
	public void startAttendance(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		String id = ids.split(",")[0];
		ProjectEmpModel projectEmp = ProjectEmpDao.getSingle().executeQueryById(id);
		if(projectEmp==null)
		{
			result.element(SUCCESS, false);
			result.element(MSG, "设置考勤失败");
			sendResult(result);
			return;
		}
		//找项目对应的考勤设备
		List<EquipModel> equips = EquipDao.getSingle().executeQuery(" and equip.id in (select equip_id from EQUIP_USED where project_id=? and return_time is null) and TYPE=?",new String[]{projectEmp.getProject_id(),"KQSB"});
		if(equips==null||equips.size()==0)
		{
			result.element(SUCCESS, false);
			result.element(MSG, "设置考勤失败,找不到项目对应的考勤设备");
			sendResult(result);
			return;
		}
		EmployeeModel employee = EmployeeDao.getSingle().executeQueryById(projectEmp.getEmp_id());
		if(employee==null)
		{
			result.element(SUCCESS, false);
			result.element(MSG, "设置考勤失败,找不到对应的员工信息");
			sendResult(result);
			return;
		
		}
		List<EnterpriseEmpModel> enterpriseEmps = EnterpriseEmpDao.getSingle().executeQuery(" and EMP_ID=? and ENTERPRISE_ID=(select ENTERPRISE_ID from PROJECT where ID=? )",new String[]{projectEmp.getEmp_id(),projectEmp.getProject_id()});
		if(enterpriseEmps==null||enterpriseEmps.size()==0)
		{
			result.element(SUCCESS, false);
			result.element(MSG, "设置考勤失败,找不到对应的员工信息");
			sendResult(result);
			return;
		}
		if(enterpriseEmps.get(0).getAttendance_photo()==null||enterpriseEmps.get(0).getAttendance_photo().trim().length()==0)
		{
			result.element(SUCCESS, false);
			result.element(MSG, "设置考勤失败,员工未设置考勤照片");
			sendResult(result);
			return;
		}
		int cutomerId = 1;
		List<Map<String,String>> retList = ProjectEmpDao.getSingle().executeQueryBySql("SELECT MAX(attendance_num) t FROM project_emp WHERE project_id=?", new String[]{projectEmp.getProject_id()});
		if(retList!=null&&retList.size()>0)
		{
			if(retList.get(0).get("t")!=null&&retList.get(0).get("t").trim().length()>0)
			{
				cutomerId = Integer.parseInt(retList.get(0).get("t"))+1;
			}
		}
		String imagePath = JSONObject.fromObject(enterpriseEmps.get(0).getAttendance_photo()).optString("save_filename");
		JSONObject param = new JSONObject();
		param.element("type", "add");
		param.element("deviceId", equips.get(0).getSn());
		param.element("empId", projectEmp.getEmp_id());
		param.element("customerId", cutomerId);
		param.element("name", employee.getName());
		param.element("idnum", employee.getId_number());
		param.element("image", imagePath);
		try
		{
			Socket client = new Socket(Config.face_adapter_ip,Config.face_adapter_port);
			OutputStream os = client.getOutputStream();
			InputStream is = client.getInputStream();
			os.write(param.toString().getBytes("GB2312"));
			os.flush();
			byte[] buffer = new byte[512];
			int length = -1;
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			while((length=is.read(buffer))>0)
			{
				baos.write(buffer, 0, length);
			}
			baos.flush();
			String message = new String(baos.toByteArray());
			JSONObject retMsg = JSONObject.fromObject(message);
			if(retMsg.optBoolean("success"))
			{
				projectEmp.setAttendance_num(String.valueOf(cutomerId));
				ProjectEmpDao.getSingle().update(projectEmp);
				result.element(SUCCESS, true);
				result.element(MSG, "设置考勤成功");
			}
			else
			{
				result.element(SUCCESS, false);
				result.element(MSG, "设置考勤失败");
			}
			client.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}

		sendResult(result);
	}
	
	
	public void endAttendance(){
		JSONObject result=new JSONObject();
		String id = ids.split(",")[0];
		ProjectEmpModel projectEmp = ProjectEmpDao.getSingle().executeQueryById(id);
		if(projectEmp==null)
		{
			result.element(SUCCESS, false);
			result.element(MSG, "去除考勤失败");
			sendResult(result);
			return;
		}
		//找项目对应的考勤设备
		List<EquipModel> equips = EquipDao.getSingle().executeQuery(" and id in (select equip_id from EQUIP_USED where project_id=? and return_time is null) and TYPE=?",new String[]{projectEmp.getProject_id(),"KQSB"});
		if(equips==null||equips.size()==0)
		{
			result.element(SUCCESS, false);
			result.element(MSG, "去除考勤失败,找不到项目对应的考勤设备");
			sendResult(result);
			return;
		}
		JSONObject param = new JSONObject();
		param.element("type", "delete");
		param.element("deviceId", equips.get(0).getSn());
		param.element("customerId",projectEmp.getAttendance_num());
		
		try
		{
			Socket client = new Socket(Config.face_adapter_ip,Config.face_adapter_port);
			OutputStream os = client.getOutputStream();
			InputStream is = client.getInputStream();
			os.write(param.toString().getBytes("GB2312"));
			os.flush();
			byte[] buffer = new byte[512];
			int length = -1;
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			while((length=is.read(buffer))>0)
			{
				baos.write(buffer, 0, length);
			}
			baos.flush();
			String message = new String(baos.toByteArray());
			JSONObject retMsg = JSONObject.fromObject(message);
			if(retMsg.optBoolean("success"))
			{
				projectEmp.setAttendance_num(null);
				ProjectEmpDao.getSingle().update(projectEmp);
				result.element(SUCCESS, true);
				result.element(MSG, "去除考勤成功");
			}
			else
			{
				result.element(SUCCESS, false);
				result.element(MSG, "去除考勤失败");
			}
			client.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
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
