<%@page import="com.abm.common.utils.Cache"%>
<%@page import="com.abm.common.model.EmpWorkModel"%>
<%@page import="com.abm.common.model.EmpAchievementModel"%>
<%@page import="com.abm.common.model.EmpTrainingModel"%>
<%@page import="com.abm.common.model.EmpCertifacationModel"%>
<%@page import="com.abm.common.model.EmpAwardModel"%>
<%@page import="com.abm.common.dao.EmpAwardDao"%>
<%@page import="com.abm.common.dao.EmpCertifacationDao"%>
<%@page import="com.abm.common.dao.EmpTrainingDao"%>
<%@page import="com.abm.common.dao.EmpAchievementDao"%>
<%@page import="com.abm.common.dao.EmpWorkDao"%>
<%@page import="com.abm.common.model.EmpEducationModel"%>
<%@page import="com.abm.common.dao.EmpEducationDao"%>
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
	String emp_id = request.getParameter("emp_id");
	
	EmployeeModel model = EmployeeDao.getSingle().executeQueryById(emp_id);
	List<EmpEducationModel> eduList = EmpEducationDao.getSingle().executeQuery("and emp_id=?", new String[]{emp_id});
	List<EmpWorkModel> workList = EmpWorkDao.getSingle().executeQuery("and emp_id=?", new String[]{emp_id});
	List<EmpAchievementModel> achList = EmpAchievementDao.getSingle().executeQuery("and emp_id=?", new String[]{emp_id});
	List<EmpTrainingModel> trainList = EmpTrainingDao.getSingle().executeQuery("and emp_id=?", new String[]{emp_id});
	List<EmpCertifacationModel> cerList = EmpCertifacationDao.getSingle().executeQuery("and emp_id=?", new String[]{emp_id});
	List<EmpAwardModel> awardList = EmpAwardDao.getSingle().executeQuery("and emp_id=?", new String[]{emp_id});
	
	response.setContentType("application/vnd.ms-excel");
	response.setHeader("Content-Disposition", "inline; filename="+ new String((model.getName()+"档案信息").getBytes(),"ISO8859-1") +".xls");
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
		<table border="1" cellspacing="0" cellpadding="0" style="font-size:20px;border-color: #c1c1c1;border-collapse: collapse;  ">
				<tr height="45px" style="font-size:30px;">
					<th colspan="8" >1、基本信息</th>
				</tr>
				<tr height="35px" >
					<th>手机号码</th><td><%=model.getPhone() %></td>
					<th>姓名</th><td><%=model.getName() %></td>
					<th>性别</th><td><%=Cache.codeToName("XB", model.getSex())  %></td>
					<th>民族</th><td><%=Cache.codeToName("MZ",model.getNation())  %></td>
				</tr>
				<tr height="35px">
					<th>政治面貌</th><td><%=Cache.codeToName("ZZMM",model.getPolitical()) %></td>
					<th>出生日期</th><td><%=model.getBirthday() %></td>
					<th>身高(cm)</th><td><%=model.getHeight() %></td>
					<th>体重(kg)</th><td><%=model.getWeight() %></td>
				</tr>
				<tr height="35px">
					<th>身份证号</th><td colspan="3" style="vnd.ms-excel.numberformat:@"><%=model.getId_number() %></td>
					<th>注册时间</th><td><%=AllUtil.subDateStr10(model.getRegister_time())  %></td>
					<th>星级</th><td><%=model.getStar() %></td>
				</tr>
				
				<%-- ----------------------------------------------------------------------------- --%>
				<tr height="45px" style="font-size:30px;">
					<th colspan="8" >2、教育经历</th>
				</tr>
				<tr height="35px">
					<th>开始时间</th>
					<th>毕业时间</th>
					<th>就读学校</th>
					<th>证明人</th>
					<th>审核人</th>
					<th>审核结果</th>
				</tr>
				<%
					if(null!=eduList && !eduList.isEmpty()){
						for(int i=0;i < eduList.size();i++ ){
							EmpEducationModel eduModel = eduList.get(i);
				%>
				<tr height="35px">
					<td><%=AllUtil.subDateStr10(eduModel.getStart_time())  %> </td>
					<td><%=AllUtil.subDateStr10(eduModel.getEnd_time()) %></td>
					<td><%=eduModel.getSchool() %></td>
					<td><%=AllUtil.nullToBlank(eduModel.getOwner())  %></td>
					<td><%=AllUtil.nullToBlank(eduModel.getExaminer_name())  %></td>
					<td><%=AllUtil.fmtEmpExamineStatus(eduModel.getExamine_status())  %></td>
				</tr>
				<%
						}
					}
				%>
				<%-- ----------------------------------------------------------------------------- --%>
				<tr height="45px" style="font-size:30px;">
					<th colspan="8">3、工作经历</th>
				</tr>
				<tr height="35px">
					<th>开始时间</th>
					<th>结束时间</th>
					<th>所在公司</th>
					<th>职务</th>
					<th>证明人</th>
					<th>审核人</th>
					<th>审核结果</th>
				</tr>
				<%
					if(null!=workList && !workList.isEmpty()){
						for(int i=0;i < workList.size();i++ ){
							EmpWorkModel workModel = workList.get(i);
				%>
				<tr height="35px">
					<td><%=AllUtil.subDateStr10(workModel.getStart_time())  %> </td>
					<td><%=AllUtil.subDateStr10(workModel.getEnd_time())  %></td>
					<td><%=workModel.getName() %></td>
					<td><%=AllUtil.nullToBlank(workModel.getPosition())  %></td>
					<td><%=AllUtil.nullToBlank(workModel.getOwner())  %></td>
					<td><%=AllUtil.nullToBlank(workModel.getExaminer_name())  %></td>
					<td><%=AllUtil.fmtEmpExamineStatus(workModel.getExamine_status())  %></td>
				</tr>
				<%
						}
					}
				%>
				<%-- ----------------------------------------------------------------------------- --%>
				<tr height="45px" style="font-size:30px;">
					<th colspan="8">4、工作业绩</th>
				</tr>
				<tr height="35px">
					<th>开始时间</th>
					<th>结束时间</th>
					<th>项目名称</th>
					<th>项目类别</th>
					<th>业绩说明</th>
					<th>证明人</th>
					<th>审核人</th>
					<th>审核结果</th>
				</tr>
				<%
					if(null!=achList && !achList.isEmpty()){
						for(int i=0;i < achList.size();i++ ){
							EmpAchievementModel achModel = achList.get(i);
				%>
				<tr height="35px">
					<td><%=AllUtil.subDateStr10(achModel.getStart_time())  %> </td>
					<td><%=AllUtil.subDateStr10(achModel.getEnd_time())  %></td>
					<td><%=AllUtil.nullToBlank(achModel.getProject_name())  %></td>
					<td><%=AllUtil.nullToBlank(achModel.getProject_type()) %></td>
					<td><%=AllUtil.nullToBlank(achModel.getBak()) %></td>
					<td><%=AllUtil.nullToBlank(achModel.getOwner()) %></td>
					<td><%=AllUtil.nullToBlank(achModel.getExaminer_name()) %></td>
					<td><%=AllUtil.fmtEmpExamineStatus(achModel.getExamine_status())  %></td>
				</tr>
				<%
						}
					}
				%>
				<%-- ----------------------------------------------------------------------------- --%>
				<tr height="45px" style="font-size:30px;">
					<th colspan="8">5、培训经历</th>
				</tr>
				<tr height="35px">
					<th>开始时间</th>
					<th>结束时间</th>
					<th>培训机构</th>
					<th>培训内容</th>
					<th>证明人</th>
					<th>审核人</th>
					<th>审核结果</th>
				</tr>
				<%
					if(null!=trainList && !trainList.isEmpty()){
						for(int i=0;i < trainList.size();i++ ){
							EmpTrainingModel trainModel = trainList.get(i);
				%>
				<tr height="35px">
					<td><%=AllUtil.subDateStr10(trainModel.getStart_time())  %> </td>
					<td><%=AllUtil.subDateStr10(trainModel.getEnd_time())  %></td>
					<td><%=AllUtil.nullToBlank(trainModel.getName())  %></td>
					<td><%=AllUtil.nullToBlank(trainModel.getContent())  %></td>
					<td><%=AllUtil.nullToBlank(trainModel.getOwner())  %></td>
					<td><%=AllUtil.nullToBlank(trainModel.getExaminer_name())  %></td>
					<td><%=AllUtil.fmtEmpExamineStatus(trainModel.getExamine_status())  %></td>
				</tr>
				<%
						}
					}
				%>
				<%-- ----------------------------------------------------------------------------- --%>
				<tr height="45px" style="font-size:30px;">
					<th colspan="8">6、资格证书</th>
				</tr>
				<tr height="35px">
					<th>发证时间</th>
					<th>发证机构</th>
					<th>证书名称</th>
					<th>有效期</th>
					<th>证书种类</th>
					<th>审核人</th>
					<th>审核结果</th>
				</tr>
				<%
					if(null!=awardList && !awardList.isEmpty()){
						for(int i=0;i < awardList.size();i++ ){
							EmpCertifacationModel cerModel = cerList.get(i);
				%>
				<tr height="35px">
					<td><%=AllUtil.subDateStr10(cerModel.getPublish_time())  %> </td>
					<td><%=AllUtil.nullToBlank(cerModel.getPublisher())  %></td>
					<td><%=AllUtil.nullToBlank(cerModel.getName())  %></td>
					<td><%=AllUtil.nullToBlank(cerModel.getValid())  %></td>
					<td><%=AllUtil.nullToBlank(cerModel.getType())  %></td>
					<td><%=AllUtil.nullToBlank(cerModel.getExaminer_name())  %></td>
					<td><%=AllUtil.fmtEmpExamineStatus(cerModel.getExamine_status())  %></td>
				</tr>
				<%
						}
					}
				%>
				<%-- ----------------------------------------------------------------------------- --%>
				<tr height="45px" style="font-size:30px;">
					<th colspan="8">7、所获奖励</th>
				</tr>
				<tr height="35px">
					<th>获奖时间</th>
					<th>获奖名称</th>
					<th>颁奖单位</th>
					<th>证明人</th>
					<th>审核人</th>
					<th>审核结果</th>
				</tr>
				<%
					if(null!=awardList && !awardList.isEmpty()){
						for(int i=0;i < awardList.size();i++ ){
							EmpAwardModel awardModel = awardList.get(i);
				%>
				<tr height="35px">
					<td><%=AllUtil.subDateStr10(awardModel.getPulish_time())  %> </td>
					<td><%=AllUtil.nullToBlank(awardModel.getName())  %></td>
					<td><%=AllUtil.nullToBlank(awardModel.getPulisher()) %></td>
					<td><%=AllUtil.nullToBlank(awardModel.getOwner()) %></td>
					<td><%=AllUtil.nullToBlank(awardModel.getExaminer_name()) %></td>
					<td><%=AllUtil.fmtEmpExamineStatus(awardModel.getExamine_status())  %></td>
				</tr>
				<%
						}
					}
				%>
		</table>
	
	</body>
</html>
