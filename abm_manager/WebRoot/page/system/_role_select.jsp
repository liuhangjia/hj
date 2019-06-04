<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>员工选择</title>
</head>
<body>
<div class="mwsmartui-panel" data-options="fit:true,border:false">
	<table id="role_select_list" class="mwsmartui-datagrid" data-options="
				      													border:false,
				      													fit:true,
				      													striped:true,
				      													lines:true,
				      													pageSize:50,
				      													pagination:true,
				      													animate:true,
				      													method:'post',
				      													scrollbarSize:30">
		<thead>
			<tr>
				<th data-options="field:'id',checkbox:true">id</th>
				<th data-options="field:'name',width:'80%'"><b>名称</b></th>
				<th data-options="field:'bak',width:'20%'"><b>备注</b></th>
			</tr>
		</thead>
	</table>
</div>
</body>
</html>