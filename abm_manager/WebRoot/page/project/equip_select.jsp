<%@page import="com.mw.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String project_id = request.getParameter("project_id");
	if(StringUtil.isEmpty(project_id)){
		project_id = "";
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>选择人员</title>
</head>
<body>
	<div class="mwsmartui-layout" data-options="border:false,fit:true">
		<%--
		<div data-options="region:'west',width:'200px',split:true">
			<ul id="equip_select_tree" class="mwsmartui-tree" data-options="method:'post'">
			</ul>
		</div>
		 --%>
		
		<div data-options="region:'center',border:true">
			<%-- 
			<div id="equip_select_list_toolbar">
				<fieldset>
					<legend>查询条件</legend>
					<div class="list-query-condition">
						<label>名称</label>
						<input id="query_name" class="mwsmartui-textbox"/>
					</div>
				</fieldset>
				<div class="toolbar-btn">
					<div class="btn-right">
						<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:personnel_doSearch"><i class="fa fa-search"> </i> 查询</a>
                    	<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:personnel_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
					</div>
				</div>
			</div>
			--%>
			<%-- toolbar:'#equip_select_list_toolbar' --%>
			<table id="equip_select_list" class="mwsmartui-datagrid" data-options="
						      													border:false,
						      													fit:true,
						      													striped:true,
						      													lines:true,
						      													pageSize:50,
						      													pagination:true,
						      													animate:true,
						      													method:'post',
						      													url:'./Equip-list.action?project_id=<%=project_id %>',
						      													scrollbarSize:28
						      													">
	            <thead>
	                <tr>
	               		<th data-options="field:'id',checkbox:true">ID</th>
	                    <th data-options="field:'name',width:'20%'"><b>名称</b></th>                    
	                    <th data-options="field:'type',width:'10%',formatter:function(value){return common.codeToName('ZBLB',value);}"><b>类别</b></th>                    
	                    <th data-options="field:'category',width:'10%'"><b>种类</b></th>                    
	                    <th data-options="field:'factory',width:'20%'"><b>厂商</b></th>
	                    <th data-options="field:'model',width:'10%'"><b>型号</b></th>
	                    <th data-options="field:'unit',width:'10%'"><b>单位</b></th>
	                    <th data-options="field:'quantity',width:'10%'"><b>数量</b></th>
	                </tr>
	            </thead>
	        </table>
		</div>
	</div>
</body>
</html>