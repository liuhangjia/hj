<%@page import="org.apache.struts2.ServletActionContext"%>
<%@page import="com.opensymphony.xwork2.ActionContext"%>
<%@page import="com.abm.common.model.AccountsModel"%>
<%@page import="com.abm.common.model.VacationModel"%>
<%@page import="com.abm.common.service.VacationService"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Date"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="com.mw.common.utils.StringUtil"%>
<%@page import="com.abm.common.utils.PrivUtil"%>
<%@page import="com.abm.common.utils.Constants"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% 
	String enterprise_id = request.getParameter("enterprise_id");
	String project_id = request.getParameter("project_id");
	String type = request.getParameter("type");
	String is_back = request.getParameter("is_back");
	String status = request.getParameter("status");
	
	StringBuffer condition = new StringBuffer();
	
	if(StringUtil.isNotEmpty(enterprise_id)){
		condition.append(" and vacation.enterprise_id =  '"+enterprise_id + "'");
	}
	if(StringUtil.isNotEmpty(project_id)){
		condition.append(" and vacation.project_id =  '"+project_id + "'");
	}
	if(StringUtil.isNotEmpty(type)){
		condition.append(" and vacation.type =  '"+type + "'");
	}
	if(StringUtil.isNotEmpty(is_back)){
		condition.append(" and vacation.is_back =  '"+is_back + "'");
	}
	if(StringUtil.isNotEmpty(status)){
		condition.append(" and vacation.status =  '"+status + "'");
	}
	
	AccountsModel currentUser = (AccountsModel)(session.getAttribute(Constants.USER));
	condition.append(PrivUtil.getConditionForEnterprise(currentUser, "VACATION_MANAGER_LIST"));
	
	List<VacationModel> models = VacationService.getSingle().queryByPage(condition.toString(), null, 1, 1000, "vacation.enterprise_id,vacation.project_id,vacation.start_time", "desc");
	
	response.setContentType("application/vnd.ms-excel");
	String fileName = "请假管理数据";
	SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
	fileName += sdf.format(new Date());
	response.setHeader("Content-Disposition", "inline; filename="+ new String(fileName.getBytes(),"ISO8859-1") +".xls");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
	<body>
		<table border="1" cellspacing="0" cellpadding="0" style="border-color: #c1c1c1;border-collapse: collapse; text-align:center; ">
				<tr height="35px;" style="font-size:20px;">
					<th width="50px" align="center">企业名称</th>
					<th width="50px" align="center">姓名</th>
					<th width="50px" align="center">部门</th>
					<th width="50px" align="center">职务</th>
					<th width="50px" align="center">请假类别</th>
					<th width="50px" align="center">请假时间</th>
					<th width="50px" align="center">销假时间</th>
					<th width="50px" align="center">是否销假</th>
					<th width="50px" align="center">请假事由</th>
					<th width="50px" align="center">审批状态</th>
					<th width="50px" align="center">审批人</th>
					<th width="50px" align="center">审批时间</th>
				</tr>
			<%
				if(null!=models && !models.isEmpty()){
					for(VacationModel model:models){
						out.print("<tr>");
						String str = "";
						//企业名称
						str = model.getEnterprise().getName();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+str+"</td>");
						}else{
							out.print("<td></td>");
						}
						//姓名
						str = model.getEnterprise_emp_name();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+str+"</td>");
						}else{
							out.print("<td></td>");
						}
						//部门
						str = model.getDepart_name();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+str+"</td>");
						}else{
							out.print("<td></td>");
						}
						//职务
						str = model.getPosition();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+str+"</td>");
						}else{
							out.print("<td></td>");
						}
						//请假类别
						str = model.getType();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+(StringUtil.eq(str,"0")?"病假":"事假")+"</td>");
						}else{
							out.print("<td></td>");
						}
						//请假时间
						str = model.getStart_time();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+(str.split(" ")[0])+"</td>");
						}else{
							out.print("<td></td>");
						}
						//销假时间
						str = model.getEnd_time();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+(str.split(" ")[0])+"</td>");
						}else{
							out.print("<td></td>");
						}
						//是否销假
						str = model.getIs_back();
						if(StringUtil.isNotEmpty(str)){
							str = StringUtil.eq(str,"1")?"是":"否";
							out.print("<td>"+str+"</td>");
						}else{
							out.print("<td></td>");
						}
						//请假事由
						str = model.getReason();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+str+"</td>");
						}else{
							out.print("<td></td>");
						}
						//审批状态
						str = model.getStatus();
						if(StringUtil.isNotEmpty(str)){
							if(StringUtil.eq(str,"0")){
								out.print("<td>审批新建</td>");
							}else if(StringUtil.eq(str,"1")){
								out.print("<td>审批中</td>");
							}else if(StringUtil.eq(str,"2")){
								out.print("<td>审批拿回</td>");
							}else if(StringUtil.eq(str,"3")){
								out.print("<td>审批通过</td>");
							}else if(StringUtil.eq(str,"4")){
								out.print("<td>审批拒绝</td>");
							}else if(StringUtil.eq(str,"5")){
								out.print("<td>审批结束</td>");
							}else{
								out.print("<td></td>");
							}
						}else{
							out.print("<td></td>");
						}
						//审批人
						str = model.getApproval_name();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+str+"</td>");
						}else{
							out.print("<td></td>");
						}
						//审批时间
						str = model.getApproval_time();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+(str.split(" ")[0])+"</td>");
						}else{
							out.print("<td></td>");
						}
						out.print("</tr>");
					}
				}
			%>
		</table>
	</body>
</html>
