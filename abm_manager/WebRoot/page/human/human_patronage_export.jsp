<%@page import="org.apache.struts2.ServletActionContext"%>
<%@page import="com.opensymphony.xwork2.ActionContext"%>
<%@page import="com.abm.common.model.AccountsModel"%>
<%@page import="com.abm.common.model.AppointModel"%>
<%@page import="com.abm.common.service.AppointService"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Date"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="com.mw.common.utils.StringUtil"%>
<%@page import="com.abm.common.utils.PrivUtil"%>
<%@page import="com.abm.common.utils.Constants"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% 
	String enterprise_id = request.getParameter("enterprise_id");
	String name = request.getParameter("name");
	String sn = request.getParameter("sn");
	String stime1 = request.getParameter("stime1");
	String stime2 = request.getParameter("stime2");
	
	StringBuffer condition = new StringBuffer();
	
	if(StringUtil.isNotEmpty(enterprise_id)){
		condition.append(" and appoint.enterprise_id =  '"+enterprise_id + "'");
	}
	if(StringUtil.isNotEmpty(name)){
		condition.append(" and appoint.name =  '"+ name + "'");
	}
	if(StringUtil.isNotEmpty(sn)){
		condition.append(" and appoint.sn =  '"+ sn + "'");
	}
	if(StringUtil.isNotEmpty(stime1)){
		condition.append(" and appoint.appoint_time >=  '"+stime1 + "'");
	}
	if(StringUtil.isNotEmpty(stime2)){
		condition.append(" and appoint.appoint_time <=  '"+stime2 + "'");
	}
	
	AccountsModel currentUser = (AccountsModel)(session.getAttribute(Constants.USER));
	condition.append(PrivUtil.getConditionForEnterprise(currentUser, "APPOINT_MANAGER_LIST"));
	
	List<AppointModel> models = AppointService.getSingle().queryByPage(condition.toString(), null, 1, 1000, "appoint.enterprise_id,appoint.appoint_time", "desc");
	
	response.setContentType("application/vnd.ms-excel");
	String fileName = "任免管理数据";
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
					<th width="50px" align="center">任免批号</th>
					<th width="50px" align="center">任免时间</th>
					<th width="50px" align="center">任免说明</th>
				</tr>
			<%
				if(null!=models && !models.isEmpty()){
					for(AppointModel model:models){
						out.print("<tr>");
						String str = "";
						//企业名称
						str = model.getEnterpriseModel().getName();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+str+"</td>");
						}else{
							out.print("<td></td>");
						}
						//姓名
						str = model.getName();
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
						//任免批号
						str = model.getSn();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+str+"</td>");
						}else{
							out.print("<td></td>");
						}
						//任免时间
						str = model.getAppoint_time();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+(str.split(" ")[0])+"</td>");
						}else{
							out.print("<td></td>");
						}
						//任免说明
						str = model.getBak();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+str+"</td>");
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
