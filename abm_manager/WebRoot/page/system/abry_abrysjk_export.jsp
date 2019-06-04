<%@page import="com.abm.common.utils.Cache"%>
<%@page import="net.sf.json.JSONObject"%>
<%@page import="com.abm.common.dao.EmpAwardDao"%>
<%@page import="com.abm.common.dao.EmpCertifacationDao"%>
<%@page import="com.abm.common.dao.EmpTrainingDao"%>
<%@page import="com.abm.common.dao.EmpAchievementDao"%>
<%@page import="com.abm.common.dao.EmpWorkDao"%>
<%@page import="com.abm.common.dao.EmpEducationDao"%>
<%@page import="com.abm.common.model.EmpAwardModel"%>
<%@page import="com.abm.common.model.EmpCertifacationModel"%>
<%@page import="com.abm.common.model.EmpTrainingModel"%>
<%@page import="com.abm.common.model.EmpAchievementModel"%>
<%@page import="com.abm.common.model.EmpWorkModel"%>
<%@page import="com.abm.common.model.EmpEducationModel"%>
<%@page import="com.abm.common.utils.AllUtil"%>
<%@page import="com.abm.common.utils.DateUtil"%>
<%@page import="java.util.Date"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.util.ArrayList"%>
<%@page import="com.abm.common.dao.EmployeeDao"%>
<%@page import="com.abm.common.model.EmployeeModel"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.List"%>
<%@page import="com.mw.common.utils.StringUtil"%>
<%@page import="com.abm.common.utils.Constants"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% 
	String name = request.getParameter("name");
	String star = request.getParameter("star");
	String sex = request.getParameter("sex");
	String mz = request.getParameter("mz");
	String zzmm = request.getParameter("zzmm");
	String phone = request.getParameter("phone");
	String weight = request.getParameter("weight");
	String height = request.getParameter("height");
	String age_min_p = request.getParameter("age_min");
	String age_max_p = request.getParameter("age_max");
	
	String emp_ids = request.getParameter("emp_ids");
	
	String jbxx = request.getParameter("jbxx");
	String edu = request.getParameter("edu");
	String work = request.getParameter("work");
	String ach = request.getParameter("ach");
	String train = request.getParameter("train");
	String cer = request.getParameter("cer");
	String award = request.getParameter("award");
	
	List<EmployeeModel> models = null;
	List<EmpEducationModel> eduList = null;
	List<EmpWorkModel> workList = null;
	List<EmpAchievementModel> achList = null;
	List<EmpTrainingModel> trainList = null;
	List<EmpCertifacationModel> cerList = null;
	List<EmpAwardModel> awardList = null;
	
	if(StringUtil.isNotEmpty(emp_ids)){
		String[] ss = emp_ids.split(",");
		String in_sql = "";
		for(String s :ss){
			in_sql += ",'"+s+"'";
		}
		in_sql = in_sql.substring(1);
		models = EmployeeDao.getSingle().executeQuery("and employee.id in ("+in_sql+")");
	}else{
		StringBuffer condition = new StringBuffer(" and employee.is_delete=?  and employee.type=? ");
		List<String> params = new ArrayList<String>();
		params.add(Constants.IS_DELETE_FALSE);
		params.add("0");
		
		Map<String,String> conditions = new HashMap<String,String>();
		conditions.put("name", name);
		conditions.put("star", star);
		conditions.put("sex", sex);
		conditions.put("mz", mz);
		conditions.put("zzmm", zzmm);
		conditions.put("phone", phone);
		conditions.put("weight", weight);
		conditions.put("height", height);
		conditions.put("age_min", age_min_p);
		conditions.put("age_max", age_max_p);
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(new Date());
		for(String key : conditions.keySet()){
			String value = conditions.get(key);
			if(StringUtil.isNotEmpty(value))
			{
				if(StringUtil.eq(key, "name")){
					condition.append(" and employee.name like ? ");
					params.add("%" + value + "%");
				}
				else if(StringUtil.eq(key, "star")){
					condition.append(" and employee.star >= ? ");
					params.add(value);
				}
				else if(StringUtil.eq(key, "sex")){
					condition.append(" and employee.sex = ? ");
					params.add(value);
				}
				else if(StringUtil.eq(key, "mz")){
					condition.append(" and employee.nation = ? ");
					params.add(value);
				}
				else if(StringUtil.eq(key, "zzmm")){
					condition.append(" and employee.political = ? ");
					params.add(value);
				}
//				else if(StringUtil.eq(key, "idnum")){
//					condition.append(" and employee.id_number like ? ");
//					params.add("%" + value + "%");
//				}
				else if(StringUtil.eq(key, "phone")){
					condition.append(" and employee.phone like ? ");
					params.add("%" + value + "%");
				}
				else if(StringUtil.eq(key, "weight")){
					condition.append(" and (employee.weight+0) >= ? ");
					params.add(value);
				}
				else if(StringUtil.eq(key, "height")){
					condition.append(" and (employee.height+0) >= ? ");
					params.add(value);
				}
				else if(StringUtil.eq(key, "age_min")){
					int age_min = AllUtil.parseInt(value);
					cal.add(Calendar.YEAR, -1*age_min);
					Date age_min_date = cal.getTime();
					String age_min_date_str = DateUtil.toYYYYMMDD(age_min_date);
					condition.append(" and employee.birthday <= str_to_date(?,'%Y-%m-%d') ");
					params.add(age_min_date_str);
					cal.setTime(new Date());
				}
				else if(StringUtil.eq(key, "age_max")){
					int age_max = AllUtil.parseInt(value);
					cal.add(Calendar.YEAR, -1*age_max);
					Date age_max_date = cal.getTime();
					String age_max_date_str = DateUtil.toYYYYMMDD(age_max_date);
					condition.append(" and employee.birthday >= str_to_date(?,'%Y-%m-%d') ");
					params.add(age_max_date_str);
					cal.setTime(new Date());
				}
//				else if(StringUtil.eq(key, "ename")){
//					condition.append(" and employee.id in (SELECT enterprise_emp.emp_id FROM enterprise_emp,enterprise WHERE enterprise.id=enterprise_emp.enterprise_id AND enterprise.name LIKE ?) ");
//					params.add("%" + value + "%");
//				}
			}
		}

		models = EmployeeDao.getSingle().executeQuery(condition.toString(), params.toArray(new String[0]));
		emp_ids = "";
		for(EmployeeModel empModel:models){
			emp_ids += ","+empModel.getId();
		}
		emp_ids = emp_ids.substring(1);
	}
	
	String[] ss = emp_ids.split(",");
	String child_in_sql = "";
	for(String s :ss){
		child_in_sql += ",'"+s+"'";
	}
	child_in_sql = "and emp_id in ("+child_in_sql.substring(1)+")";
	
	eduList = EmpEducationDao.getSingle().executeQuery(child_in_sql) ;
	workList = EmpWorkDao.getSingle().executeQuery(child_in_sql) ;
	achList = EmpAchievementDao.getSingle().executeQuery(child_in_sql) ;
	trainList = EmpTrainingDao.getSingle().executeQuery(child_in_sql) ;
	cerList = EmpCertifacationDao.getSingle().executeQuery(child_in_sql) ;
	awardList = EmpAwardDao.getSingle().executeQuery(child_in_sql) ;
	
	//List<EmpEducationModel> eduListNew = new ArrayList<EmpEducationModel>();
	//List<EmpWorkModel> workListNew = new ArrayList<EmpWorkModel>();
	//List<EmpAchievementModel> achListNew = new ArrayList<EmpAchievementModel>();
	//List<EmpTrainingModel> trainListNew = new ArrayList<EmpTrainingModel>();
	//List<EmpCertifacationModel> cerListNew = new ArrayList<EmpCertifacationModel>();
	//List<EmpAwardModel> awardListNew = new ArrayList<EmpAwardModel>();
	
	List<JSONObject> jsonList = new ArrayList<JSONObject>();
	
	for(EmployeeModel empModel:models){
		JSONObject modelJson = JSONObject.fromObject(empModel);
		if(null!=eduList && !eduList.isEmpty()){
			String edu_str = "";
			int edu_num = 1;
			for(int i=0;i<eduList.size();i++){
				EmpEducationModel eduModel = eduList.get(i);
				if(StringUtil.eq(empModel.getId(), eduModel.getEmp_id())){
					edu_str += edu_num+"."+AllUtil.subDateStr10(eduModel.getStart_time())+"至"+AllUtil.subDateStr10(eduModel.getEnd_time());
					edu_str += "在"+eduModel.getSchool()+"就读,";
					if(StringUtil.isNotEmpty(eduModel.getExaminer_name()) ){
						edu_str += "已通过审核。<br>" ;
					}else{
						edu_str += "未审核。<br>";
					}
					edu_num++;
				}
			}
			modelJson.element("edu_str", edu_str);
		}
		
		if(null!=workList && !workList.isEmpty()){
			String work_str = "";
			int work_num = 1;
			for(EmpWorkModel workModel:workList){
				if(StringUtil.eq(empModel.getId(), workModel.getEmp_id())){
					work_str += work_num+"."+AllUtil.subDateStr10(workModel.getStart_time())+"至"+AllUtil.subDateStr10(workModel.getEnd_time()) ;
					work_str += "在"+workModel.getName()+"就职,";
					if(StringUtil.isNotEmpty(workModel.getPosition())){
						work_str += "职务:"+workModel.getPosition()+",";
					}
					if(StringUtil.isNotEmpty(workModel.getExaminer_name()) ){
						work_str += "已通过审核。<br>" ;
					}else{
						work_str += "未审核。<br>";
					}
					work_num++;
				}
			}
			modelJson.element("work_str", work_str);
		}
		
		if(null!=achList && !achList.isEmpty()){
			String ach_str = "";
			int ach_num = 1;
			for(EmpAchievementModel achModel:achList){
				if(StringUtil.eq(empModel.getId(), achModel.getEmp_id())){
					ach_str += ach_num+"."+AllUtil.subDateStr10(achModel.getStart_time())+"至"+AllUtil.subDateStr10(achModel.getEnd_time()) ;
					ach_str += "在"+achModel.getProject_name()+"项目中工作,";
					if(StringUtil.isNotEmpty(achModel.getProject_type())){
						ach_str += "项目类别:"+achModel.getProject_type()+",";
					}
					if(StringUtil.isNotEmpty(achModel.getBak())){
						ach_str += "业绩说明:"+achModel.getBak()+";";
					}
					if(StringUtil.isNotEmpty(achModel.getExaminer_name()) ){
						ach_str += "已通过审核。<br>" ;
					}else{
						ach_str += "未审核。<br>";
					}
					ach_num++;
				}
			}
			modelJson.element("ach_str", ach_str);
		}
		
		if(null!=trainList && !trainList.isEmpty()){
			String train_str = "";
			int train_num = 1;
			for(EmpTrainingModel trainModel:trainList){
				if(StringUtil.eq(empModel.getId(), trainModel.getEmp_id())){
					train_str += train_num+"."+AllUtil.subDateStr10(trainModel.getStart_time())+"至"+AllUtil.subDateStr10(trainModel.getEnd_time()) ;
					train_str += "在"+trainModel.getName()+"中参加培训,";
					if(StringUtil.isNotEmpty(trainModel.getExaminer_name()) ){
						train_str += "已通过审核。<br>" ;
					}else{
						train_str += "未审核。<br>";
					}
					train_num++;
				}
			}
			modelJson.element("train_str", train_str);
		}
		
		if(null!=cerList && !cerList.isEmpty()){
			String cer_str = "";
			int cer_num = 1;
			for(EmpCertifacationModel cerModel:cerList){
				if(StringUtil.eq(empModel.getId(), cerModel.getEmp_id())){
					cer_str += cer_num+"."+AllUtil.subDateStr10(cerModel.getPublish_time())+"获得"+cerModel.getName()+"," ;
					if(StringUtil.isNotEmpty(cerModel.getType())){
						cer_str += "证书种类:"+cerModel.getType()+",";
					}
					if(StringUtil.isNotEmpty(cerModel.getPublisher())){
						cer_str += "发证单位:"+cerModel.getPublisher()+",";
					}
					if(StringUtil.isNotEmpty(cerModel.getValid())){
						cer_str += "有效日期:"+cerModel.getValid()+",";
					}
					if(StringUtil.isNotEmpty(cerModel.getExaminer_name()) ){
						cer_str += "已通过审核。<br>" ;
					}else{
						cer_str += "未审核。<br>";
					}
					cer_num++;
				}
			}
			modelJson.element("cer_str", cer_str);
		}
		
		if(null!=awardList && !awardList.isEmpty()){
			String award_str = "";
			int award_num = 1;
			for(EmpAwardModel awardModel:awardList){
				if(StringUtil.eq(empModel.getId(), awardModel.getEmp_id())){
					award_str += award_num+"."+AllUtil.subDateStr10(awardModel.getPulish_time())+"获得"+awardModel.getName()+"," ;
					if(StringUtil.isNotEmpty(awardModel.getPulisher())){
						award_str += "颁奖单位:"+awardModel.getPulisher()+",";
					}
					if(StringUtil.isNotEmpty(awardModel.getExaminer_name()) ){
						award_str += "已通过审核。<br>" ;
					}else{
						award_str += "未审核。<br>";
					}
					award_num++;
				}
			}
			modelJson.element("award_str", award_str);
		}
		
		jsonList.add(modelJson);
	}
	
	response.setContentType("application/vnd.ms-excel");
	response.setHeader("Content-Disposition", "inline; filename="+ new String("安保人员基本信息".getBytes(),"ISO8859-1") +".xls");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<style type="text/css">
		th,td{text-align:left;}
	</style>
</head>
	<body>
		<table border="1" cellspacing="0" cellpadding="0" style="border-color: #c1c1c1;border-collapse: collapse; text-align:center; ">
				<tr height="45px;" style="font-size:20px;">
					<th width="50px" align="center">序号</th>
					<th width="50px" align="center">姓名</th>
					<th width="50px" align="center">星级</th>
					<th width="50px" align="center">出生日期</th>
					<th width="50px" align="center">性别</th>
					<th width="50px" align="center">民族</th>
					<th width="50px" align="center">政治面貌</th>
					<th width="50px" align="center">联系电话</th>
					<th width="50px" align="center">体重(kg)</th>
					<th width="50px" align="center">身高(cm)</th>
					<th width="50px" align="center">注册时间</th>
					<th width="50px" align="center">身份证号</th>
					<th width="50px" align="center">教育经历</th>
					<th width="50px" align="center">工作经历</th>
					<th width="50px" align="center">工作业绩</th>
					<th width="50px" align="center">培训经历</th>
					<th width="50px" align="center">资格证书</th>
					<th width="50px" align="center">获得奖励</th>
				</tr>
			<%
				if(null!=models && !models.isEmpty()){
					for(int i=0;i<models.size();i++){
						EmployeeModel empModel = models.get(i);
						JSONObject modelJson = jsonList.get(i);
			%>
				<tr style="font-size:20px;">
					<td><%=(i+1)  %></td>
					<td><%=AllUtil.nullToBlank(empModel.getName())  %></td>
					<td><%=empModel.getStar() %></td>
					<td><%=AllUtil.nullToBlank(empModel.getBirthday()) %></td>
					<td><%=AllUtil.nullToBlank(Cache.codeToName("XB", empModel.getSex()))   %></td>
					<td><%=AllUtil.nullToBlank(Cache.codeToName("MZ", empModel.getNation())) %></td>
					<td><%=AllUtil.nullToBlank(Cache.codeToName("ZZMM", empModel.getPolitical()))  %></td>
					<td style="vnd.ms-excel.numberformat:@"><%=AllUtil.nullToBlank(empModel.getPhone()) %></td>
					<td><%=AllUtil.nullToBlank(empModel.getWeight()) %></td>
					<td><%=AllUtil.nullToBlank(empModel.getHeight()) %></td>
					<td><%=AllUtil.subDateStr10(empModel.getRegister_time())  %></td>
					<td style="vnd.ms-excel.numberformat:@"><%=AllUtil.nullToBlank(empModel.getId_number()) %></td>
					<td><%=modelJson.optString("edu_str") %></td>
					<td><%=modelJson.optString("work_str") %></td>
					<td><%=modelJson.optString("ach_str") %></td>
					<td><%=modelJson.optString("train_str") %></td>
					<td><%=modelJson.optString("cer_str") %></td>
					<td><%=modelJson.optString("award_str") %></td>					
				</tr>	
			<%
					}
				}
			%>
		</table>
	</body>
</html>
