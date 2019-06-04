<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String processDefId = request.getParameter("id");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>按照流程定义id获取全部流程节点</title>
</head>
<body>
	<div class="mwsmartui-panel" data-options="fit:true,border:true">
		<table class="mwsmartui-datagrid" data-options="border:false,
														checkOnSelect:false,
														fit:true,
														singleSelect:true,
														striped:true,
														method:'post',
														scrollbarSize:0,
														url:'./act/ActWorkflow-listActiviesByProcessDefId.action?id=<%=processDefId %>'">
														
			<thead>
				<tr>
					<th data-options="field:'id',width:'15%',align:'center'"><b>ID</b></th>
					<th data-options="field:'type',width:'20%',align:'center'"><b>节点类别</b></th>
					<th data-options="field:'name',width:'50%',align:'center'"><b>节点名称</b></th>
					<th data-options="field:'documentation',width:'15%',align:'center'"><b>节点描述</b></th>
				</tr>
			</thead>
		</table>
	</div>
</body>
</html>