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
		<table id="act_role_list" class="mwsmartui-datagrid" data-options="
																			border:false,
																			checkOnSelect:true,
																			selectOnCheck:true,
																			fit:true,
																			singleSelect:true,
																			striped:true,
																			method:'post',
																			scrollbarSize:28,
																			url:'./ActRole-chooseList.action'">
			<thead>
				<tr>
					<th data-options="field:'id_',checkbox:true">id</th>
                    <th data-options="field:'name_',width:'55%',formatter:function(value,row,index){if(row['id_'] == 'ZSLDSP'){ return '<font color=blue>'+value+'</font>'; } return value;}"><b>名称</b></th>
                    <th data-options="field:'mark_',width:'45%'"><b>说明</b></th>
				</tr>
			</thead>																
		</table>
	</div>
</body>
</html>