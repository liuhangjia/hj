<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String id = request.getParameter("id");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>流程角色人员</title>
</head>
<body>
	<div class="mwsmartui-panel" data-options="fit:true,border:true">
		<div id="act_role_emp_list_toolbar">
			<div class="toolbar-btn">
				<div class="btn-left">
					<a class="mwsmartui-linkbutton" data-options="iconCls:'icon-add'" id="addEmps">选择流程角色人员</a>
					<a class="mwsmartui-linkbutton" data-options="iconCls:'icon-remove'" id="delEmps">删除流程角色人员</a>
				</div>
			</div>
		</div>
		<table id="act_role_emp_list" class="mwsmartui-datagrid" data-options="
																		border:false,
																		checkOnSelect:false,
																		fit:true,
																		singleSelect:true,
																		striped:true,
																		method:'post',
																		url:'./ActRole-listEmp.action?role.id_=<%=id %>',
																		scrollbarSize:28,
																		toolbar:'#act_role_emp_list_toolbar'">
			<thead>
				<tr>
					<th data-options="field:'id_',checkbox:true">id</th>
                    <th data-options="field:'emp_name_',width:'55%'"><b>姓名</b></th>
                    <th data-options="field:'emp_jtbh_',width:'45%'"><b>集团编号</b></th>
				</tr>
			</thead>
		</table>
	</div>
</body>
</html>