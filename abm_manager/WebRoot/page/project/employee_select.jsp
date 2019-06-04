<%@page import="com.mw.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	    String project_id = request.getParameter("project_id");
		String select_ids = request.getParameter("select_ids");
		String qx = request.getParameter("qx");
		if(StringUtil.isEmpty(project_id)){
			project_id="";
		}
		if(StringUtil.isEmpty(select_ids)){
			select_ids="";
		}
		if(StringUtil.isEmpty(qx)){
			qx="";
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
			<ul id="employee_select_tree" class="mwsmartui-tree" data-options="method:'post'">
			</ul>
		</div>
		 --%>
		
		<div data-options="region:'center',border:true">
			<div id="employee_select_list_toolbar">
				<fieldset>
					<legend>查询条件</legend>
					<div class="list-query-condition">
						<label>姓名</label>
						<input id="query_name" class="mwsmartui-textbox"/>
					</div>
				</fieldset>
				<div class="toolbar-btn">
					<div class="btn-right">
						<a href="#" id="btn_search" class="mwsmartui-linkbutton"  data-options=""><i class="fa fa-search"> </i> 查询</a>
                    	<a href="#" id="btn_reset" class="mwsmartui-linkbutton"  data-options="" ><i class="fa fa-refresh"> </i> 重置</a>
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
						      													url:'./Employee-listForEmpSelect.action?qx=<%=qx %>&project_id=<%=project_id %>&select_ids=<%=select_ids %>',
						      													scrollbarSize:38,
						      													toolbar:'#employee_select_list_toolbar'">
	            <thead>
	                <tr>
	               		<th data-options="field:'id',checkbox:true">id</th>
	                    <th data-options="field:'name',width:'20%'"><b>姓名</b></th>
	                    <th data-options="field:'sex',width:'20%',formatter:function(value){return common.codeToName('XB',value);}"><b>性别</b></th>
	                    <th data-options="field:'phone',width:'60%'"><b>手机</b></th>
	                </tr>
	            </thead>
	        </table>
		</div>
	</div>
</body>
</html>