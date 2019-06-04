<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>员工选择</title>
</head>
<body>
<div class="mwsmartui-panel" data-options="fit:true,border:false">
	<div id="employee_select_list_toolbar">
		<fieldset>
			<legend>查询条件</legend>
			<div class="list-query-condition">
				<label>姓名</label>
				<input id="query_name" class="mwsmartui-textbox"/>
			</div>
			<div class="list-query-condition">
				<label>手机号</label>
				<input id="query_phone" class="mwsmartui-textbox"/>
			</div>
		</fieldset>
		<div class="toolbar-btn">
			<div class="btn-right">
				<a id="btn_search" href="#" class="mwsmartui-linkbutton"><i class="fa fa-search"> </i> 查询</a>
				<a id="btn_reset" href="#" class="mwsmartui-linkbutton"><i class="fa fa-refresh"></i> 重置</a>
			</div>
		</div>
	</div>
	<table id="employee_select_list" class="mwsmartui-datagrid" data-options="
				      													border:false,
				      													fit:true,
				      													striped:true,
				      													lines:true,
				      													pageSize:50,
				      													pagination:true,
				      													animate:true,
				      													method:'post',
				      													scrollbarSize:30,
				      													toolbar:'#employee_select_list_toolbar'">
		<thead>
			<tr>
				<th data-options="field:'id',checkbox:true">id</th>
				<th data-options="field:'name',width:'15%',formatter:function(value,row,index){if(row['employeeModel']){return row['employeeModel']['name'];}else{return value;}}"><b>姓名</b></th>
				<th data-options="field:'phone',width:'15%',formatter:function(value,row,index){if(row['employeeModel']){return row['employeeModel']['phone'];}else{return value;}}"><b>手机号</b></th>
				<th data-options="field:'sex',width:'10%',formatter:function(value,row,index){if(row['employeeModel']){return row['employeeModel']['sex'];}else{return value;}}"><b>性别</b></th>
				<th data-options="field:'depart_name',width:'40%'"><b>部门</b></th>
				<th data-options="field:'position',width:'20%'"><b>职务</b></th>
			</tr>
		</thead>
	</table>
</div>
</body>
</html>