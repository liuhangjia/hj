<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String deployId = request.getParameter("id");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>查看流程图</title>
</head>
<body>
	<div>
		<img alt="流程图" src="./act/ActWorkflow-viewPng.action?id=<%=deployId%>" width="100%" height="100%"/>
	</div>
	<%-- 
	<div style="position: absolute;border:1px solid red;top:100px;left:100px;width:100px;height:100px;">
	
	</div>
	--%>
</body>
</html>