<%@page import="com.abm.common.model.AccountsModel"%>
<%@page import="com.abm.common.dao.AccountsDao"%>
<%@page import="com.abm.common.model.EmployeeModel"%>
<%@page import="com.abm.common.model.EnterpriseEmpModel"%>
<%@page import="java.util.List"%>
<%@page import="com.mw.common.utils.StringUtil"%>
<%@page import="com.abm.common.dao.EnterpriseEmpDao"%>
<%@page import="com.abm.common.dao.EmployeeDao"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String id = request.getParameter("id");
	if(StringUtil.isEmpty(id)){
		out.print("请选择企业信息");
		return;
	}
	String cond = " and exists(select * from enterprise where enterprise_emp.enterprise_id = enterprise.id and enterprise_emp.IS_ENTERPRISE_ADMIN='1' ) and enterprise_id = ?";
	List<EnterpriseEmpModel> emps = EnterpriseEmpDao.getSingle().executeQuery(cond,new String[]{id});
	EnterpriseEmpModel emp = null;
	EmployeeModel employee = null;
	String account = "";
	if(null != emps && !emps.isEmpty()){
		employee = EmployeeDao.getSingle().executeQueryById(emps.get(0).getEmp_id());
		account = employee.getAccount().getAccount();
		
	}else{
		account = "";
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>设置管理员</title>
</head>
<body>
	<form id="" method="post" style="padding-top:10px">
		<input type="hidden" id="enterpriseId" value="<%=id %>"/>
		<div class="lbcxtj">
			<label>帐号：</label> 
			<input id="account" class="mwsmartui-textbox" data-options="width:'370px',height:'30px',required:true" value="<%=account %>"/>
		</div>

	</form>
</body>
</html>