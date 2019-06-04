<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String group = request.getParameter("group");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>选择监听</title>
</head>
<body>
	<div class="mwsmartui-panel" data-options="fit:true,border:true">
		<table id="act_listener_list" class="mwsmartui-datagrid" data-options="pageSize:10000,
																			border:false,
																			checkOnSelect:true,
																			selectOnCheck:true,
																			fit:true,
																			singleSelect:true,
																			striped:true,
																			method:'post',
																			scrollbarSize:28,
																			url:'./ActListener-list.action?model.group_=<%=group %>'">
			<thead>
				<tr>
					<th data-options="field:'id_',checkbox:true">id</th>
                    <th data-options="field:'name_',width:'25%'"><b>名称</b></th>
                    <th data-options="field:'group_',width:'10%'"><b>类别</b></th>
                    <th data-options="field:'event',width:'10%'"><b>事件</b></th>
                    <th data-options="field:'class_',width:'55%'"><b>CLASS</b></th>
				</tr>
			</thead>																
		</table>
	</div>
</body>
</html>