<%@page import="org.apache.struts2.ServletActionContext"%>
<%@page import="com.opensymphony.xwork2.ActionContext"%>
<%@page import="com.abm.common.model.AccountsModel"%>
<%@page import="com.abm.common.service.EnterpriseEmpService"%>
<%@page import="com.abm.common.model.EnterpriseEmpModel"%>
<%@page import="java.util.List"%>
<%@page import="com.mw.common.utils.StringUtil"%>
<%@page import="com.abm.common.utils.PrivUtil"%>
<%@page import="com.abm.common.utils.Constants"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% 
	String enterprise_id = request.getParameter("enterprise_id");
	String depart_id = request.getParameter("depart_id");
	String name = request.getParameter("name");
	
	StringBuffer condition = new StringBuffer();
	condition.append(" and enterprise.is_delete='"+Constants.IS_DELETE_FALSE+"' ");
	condition.append(" and employee.is_delete='"+Constants.IS_DELETE_FALSE+"' ");
	
	if(StringUtil.isNotEmpty(enterprise_id)){
		condition.append(" and enterprise.enterprise_id =  '"+enterprise_id + "'");
	}
	if(StringUtil.isNotEmpty(depart_id)){
		condition.append(" and enterprise_emp.depart_id =  '"+depart_id + "'");
	}
	if(StringUtil.isNotEmpty(name)){
		condition.append(" and employee.name like '%"+name+"%' ");
	}
	
	AccountsModel currentUser = (AccountsModel)(session.getAttribute(Constants.USER));
	condition.append(PrivUtil.getConditionForEnterprise(currentUser, "EMPLOYEE_MANAGER_LIST"));
	
	List<EnterpriseEmpModel> models = EnterpriseEmpService.getSingle().queryByPage(condition.toString(), null, 1, 1000, "ENTERPRISE.START_TIME,enterprise_emp.depart_name", "desc");
	
	
	response.setContentType("application/vnd.ms-excel");
	response.setHeader("Content-Disposition", "inline; filename="+ new String("员工管理数据".getBytes(),"ISO8859-1") +".xls");
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
					<th width="50px" align="center">性别</th>
					<th width="50px" align="center">部门</th>
					<th width="50px" align="center">职务</th>
					<th width="50px" align="center">联系电话</th>
					<th width="50px" align="center">联系地址</th>
					<th width="50px" align="center">入职时间</th>
					<th width="50px" align="center">当前状态</th>
					<th width="50px" align="center">人员类别</th>
				</tr>
			<%
				if(null!=models && !models.isEmpty()){
					for(EnterpriseEmpModel model:models){
						out.print("<tr>");
						
						String enname = model.getEnterpriseModel().getName();
						if(StringUtil.isNotEmpty(enname)){
							out.print("<td>"+enname+"</td>");
						}else{
							out.print("<td></td>");
						}
						
						String emname = model.getEmployeeModel().getName();
						if(StringUtil.isNotEmpty(emname)){
							out.print("<td>"+emname+"</td>");
						}else{
							out.print("<td></td>");
						}
						
						String sex = model.getEmployeeModel().getSex();
						if(StringUtil.isNotEmpty(sex)){
							out.print("<td>"+(sex=="0"?"男":"女")+"</td>");
						}else{
							out.print("<td></td>");
						}

						String dname = model.getDepart_name();
						if(StringUtil.isNotEmpty(dname)){
							out.print("<td>"+dname+"</td>");
						}else{
							out.print("<td></td>");
						}
						
						String position = model.getPosition();
						if(StringUtil.isNotEmpty(position)){
							out.print("<td>"+position+"</td>");
						}else{
							out.print("<td></td>");
						}
						
						String phone = model.getEmployeeModel().getPhone();
						if(StringUtil.isNotEmpty(phone)){
							out.print("<td>"+phone+"</td>");
						}else{
							out.print("<td></td>");
						}
						
						String addr = model.getEmployeeModel().getAddress();
						if(StringUtil.isNotEmpty(addr)){
							out.print("<td>"+addr+"</td>");
						}else{
							out.print("<td></td>");
						}
						
						String time = model.getStart_time();
						if(StringUtil.isNotEmpty(time)){
							out.print("<td>"+time+"</td>");
						}else{
							out.print("<td></td>");
						}
						
						String status = model.getStatus();
						if(StringUtil.isNotEmpty(status)){
							out.print("<td>"+(status=="0"?"离职":"在岗")+"</td>");
						}else{
							out.print("<td></td>");
						}
						
						String type = model.getEmployeeModel().getType();
						if(StringUtil.isNotEmpty(type)){
							out.print("<td>"+(type=="0"?"保安":"员工")+"</td>");
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
