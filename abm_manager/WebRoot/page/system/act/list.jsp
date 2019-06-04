<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>

<script language="javascript" type="text/javascript" src="./js/system/act/sys_act.js"></script>
<%-- 
<script language="javascript" type="text/javascript" src="./js/system/act/sys_act_listener.js"></script>
<script language="javascript" type="text/javascript" src="./js/system/act/sys_act_role.js"></script>
--%>
	<div id="act_div" class="mwsmartui-tabs" data-options="fit:true,border:false">
		<div data-options="title:'流程设计'">
			<div class="mwsmartui-layout" data-options="border:false,fit:true">
				<div data-options="region:'north',height:'60%',border:false">
					<div id="act_design_list_toolbar">
						<div class="toolbar-btn">
							<div class="btn-left">
								<a class="mwsmartui-linkbutton" data-options="onClick:sys_act.addDesign"><i class="fa fa-plus"> </i> 增加流程设计</a>
								<a class="mwsmartui-linkbutton" data-options="onClick:sys_act.delDesign"><i class="fa fa-remove"> </i> 删除流程设计</a>
								<a class="mwsmartui-linkbutton" data-options="onClick:sys_act.deployDesign"><i class="fa fa-plus"> </i> 部署流程列表</a>
							</div>
						</div>
					</div>
					<table id="act_design_list" class="mwsmartui-datagrid" data-options="
																					border:false,
																					checkOnSelect:true,
																					selectOnCheck:true,
																					fit:true,
																					singleSelect:true,
																					striped:true,
																					method:'post',
																					onClickRow:function(index,row){
																						if(row){
																							$('#act_design_def_info_list').datagrid({
																								url:'./act/ActWorkflow-listProcessDef.action?key='+row['key_']
																							});
																						}
																					},
																					url:'./ActDesign-list.action?rows=10000',
																					scrollbarSize:159,
																					toolbar:'#act_design_list_toolbar'">
						<thead>
							<tr>
								<th data-options="field:'id_',checkbox:true">id</th>
								<th data-options="field:'enterprise',width:'25%',formatter:function(value,row,index){if(row['enterprise']){return row['enterprise']['name'];}else{return value;}}"><b>企业名称</b></th>
			                    <th data-options="field:'name_',width:'25%',align:'center'"><b>流程名称</b></th>
			                    <th data-options="field:'key_',width:'20%',align:'center'"><b>流程KEY</b></th>
			                    <%-- 
			                    <th data-options="field:'key_name_',width:'25%'"><b>流程名称</b></th>
			                    --%>
			                    <th data-options="field:'status_',width:'15%',formatter:sys_act.fbztOpts,align:'center'"><b>发布状态</b></th>
			                    <th data-options="field:'fbsf',width:'15%',formatter:sys_act.fbsjOpts,align:'center'"><b>发布时间</b></th>
			                    <th data-options="field:'xx',width:'120px',align:'center',formatter:sys_act.listDesignOpts"><b>操作</b></th>
							</tr>
						</thead>
					</table>
				</div>
				<div data-options="region:'center',border:false,title:'流程定义信息列表'">
					<table id="act_design_def_info_list" class="mwsmartui-datagrid" data-options="
																					border:false,
																					checkOnSelect:false,
																					fit:true,
																					singleSelect:true,
																					striped:true,
																					method:'post',
																					<%-- 
																					url:'./ActWorkflow-listProcessDef.action',
																					--%>
																					scrollbarSize:231">
						<thead>
							<tr>
								<th data-options="field:'id',width:'10%',align:'center'"><b>ID</b></th>
								<th data-options="field:'name',width:'25%',align:'center'"><b>流程名称</b></th>
								<th data-options="field:'key',width:'15%',align:'center'"><b>KEY</b></th>
								<th data-options="field:'version',width:'10%',align:'center'"><b>流程定义的版本</b></th>
								<th data-options="field:'resourceName',width:'15%',align:'center'"><b>流程定义的规则文件名</b></th>
								<th data-options="field:'diagramResourceName',width:'15%',align:'center'"><b>流程定义的规则图片名</b></th>
								<th data-options="field:'deploymentId',width:'10%',align:'center'"><b>部署ID</b></th>	
								<th data-options="field:'_opt',width:'230px',align:'center',formatter:act_workflow.deployDefOpt"><b>操作</b></th>
							</tr>
						</thead>
					</table>
				</div>
			</div>
		</div>
		<%--
		<div data-options="border:false,title:'流程部署'">
			<div class="mwsmartui-layout" data-options="border:false,fit:true">
				<div data-options="region:'north',height:'80%',collapsible:false,border:false">
					<div id="workflow_deploy_list_toolbar">
						<fieldset style="padding-bottom:10px;margin-bottom:10px;">
							<legend>部署流程定义</legend>
							<form id="workflow_form" method="post" enctype="multipart/form-data">
								<div class="list-query-condition">
									<label>流程名称:</label>
									<input name="name" class="mwsmartui-textbox"/>
								</div>
								<div class="list-query-condition">
									<label>流程文件(zip):</label>
									<input type="file" name="uploadfile"/>
								</div>
								<a class="mwsmartui-linkbutton" data-options="iconCls:'icon-save'">上传流程</a>
							</form>
						</fieldset>
					</div>
					<table id="workflow_deploy_list" class="mwsmartui-datagrid" data-options="pageSize:100,
																					border:false,
																					checkOnSelect:false,
																					fit:true,
																					singleSelect:true,
																					striped:true,
																					method:'post',
																					onClickRow:function(index,row){
																						if(row){
																							$('#workflow_def_info_list').datagrid({
																								url:'./ActWorkflow-listProcessDef.action?id='+row['id']
																							});
																						}
																					},
																					url:'./ActWorkflow-listDeployment.action',
																					scrollbarSize:181,
																					toolbar:'#workflow_deploy_list_toolbar'
																					">
						<thead>
							<tr>
								<th data-options="field:'id',width:'10%',align:'center'"><b>ID</b></th>
								<th data-options="field:'name',width:'70%',align:'center'"><b>流程名称</b></th>
								<th data-options="field:'deploymentTime',width:'20%',align:'center'"><b>部署时间</b></th>
								<th data-options="field:'_opt',width:'180px',align:'center',formatter:act_workflow.deployOpt"><b>操作</b></th>
							</tr>
						</thead>
					</table>
				</div>
				<div data-options="region:'center',title:'流程定义信息列表'">
					<table id="workflow_def_info_list" class="mwsmartui-datagrid" data-options="pageSize:100,
																					border:false,
																					checkOnSelect:false,
																					fit:true,
																					singleSelect:true,
																					striped:true,
																					method:'post',
																					<%-- 
																					url:'./ActWorkflow-listProcessDef.action',
																					-- %>
																					scrollbarSize:201">
						<thead>
							<tr>
								<th data-options="field:'id',width:'10%',align:'center'"><b>ID</b></th>
								<th data-options="field:'name',width:'25%',align:'center'"><b>流程名称</b></th>
								<th data-options="field:'key',width:'15%',align:'center'"><b>KEY</b></th>
								<th data-options="field:'version',width:'10%',align:'center'"><b>流程定义的版本</b></th>
								<th data-options="field:'resourceName',width:'15%',align:'center'"><b>流程定义的规则文件名</b></th>
								<th data-options="field:'diagramResourceName',width:'15%',align:'center'"><b>流程定义的规则图片名</b></th>
								<th data-options="field:'deploymentId',width:'10%',align:'center'"><b>部署ID</b></th>	
								<th data-options="field:'_opt',width:'200px',align:'center',formatter:act_workflow.deployDefOpt"><b>操作</b></th>
							</tr>
						</thead>
					</table>
				</div>
			</div>
		</div>
		<div data-options="title:'流程类别'">
			<div id="act_type_list_toolbar">
				<div class="toolbar-btn">
					<div class="btn-left">
						<a class="mwsmartui-linkbutton" data-options="iconCls:'icon-add',onClick:sys_act.addType">增加流程类别</a>
						<a class="mwsmartui-linkbutton" data-options="iconCls:'icon-remove',onClick:sys_act.delType">删除流程类别</a>
					</div>
				</div>
			</div>
			<table id="act_type_list" class="mwsmartui-datagrid" data-options="pageSize:20,
																			border:false,
																			pagination:true,
																			checkOnSelect:false,
																			fit:true,
																			singleSelect:true,
																			striped:true,
																			method:'post',
																			url:'./SysBaseCode-list.action?type=LCLB&fy=1',
																			scrollbarSize:138,
																			toolbar:'#act_type_list_toolbar'">
				<thead>
					<tr>
						<th data-options="field:'id',checkbox:true">id</th>
	                    <th data-options="field:'mc',width:'40%'"><b>名称</b></th>
	                    <th data-options="field:'px',width:'10%'"><b>排序</b></th>
	                    <th data-options="field:'xx',width:'110',align:'center',formatter:sys_act.listTypeOpts"><b>操作</b></th>
					</tr>
				</thead>
			</table>
		</div>
		
		<div data-options="title:'流程审批角色'">
			<div id="act_role_list_toolbar">
				<div class="toolbar-btn">
					<div class="btn-left">
						<a class="mwsmartui-linkbutton" data-options="iconCls:'icon-add',onClick:sys_act_role.add">增加流程审批角色</a>
						<a class="mwsmartui-linkbutton" data-options="iconCls:'icon-remove',onClick:sys_act_role.del">删除流程审批角色</a>
					</div>
				</div>
			</div>
			<table id="act_role_list" class="mwsmartui-datagrid" data-options="pageSize:20,
																			border:false,
																			pagination:true,
																			checkOnSelect:false,
																			fit:true,
																			singleSelect:true,
																			striped:true,
																			method:'post',
																			url:'./ActRole-list.action',
																			scrollbarSize:228,
																			toolbar:'#act_role_list_toolbar'">
				<thead>
					<tr>
						<th data-options="field:'id_',checkbox:true">id</th>
	                    <th data-options="field:'name_',width:'50%'"><b>名称</b></th>
	                    <th data-options="field:'mark_',width:'35%'"><b>说明</b></th>
	                    <th data-options="field:'seq_',width:'15%'"><b>排序</b></th>
	                    <th data-options="field:'xx',width:'200',align:'center',formatter:sys_act_role.listOpts"><b>操作</b></th>
					</tr>
				</thead>
			</table>
		</div>
		
		<div data-options="title:'流程连线名称'">
			<div id="act_line_list_toolbar">
				<div class="toolbar-btn">
					<div class="btn-left">
						<a class="mwsmartui-linkbutton" data-options="iconCls:'icon-add',onClick:sys_act.addLine">增加流程连线名称</a>
						<a class="mwsmartui-linkbutton" data-options="iconCls:'icon-remove',onClick:sys_act.delLine">删除流程连线名称</a>
					</div>
				</div>
			</div>
			<table id="act_line_list" class="mwsmartui-datagrid" data-options="pageSize:20,
																			border:false,
																			pagination:true,
																			checkOnSelect:false,
																			fit:true,
																			singleSelect:true,
																			striped:true,
																			method:'post',
																			url:'./SysBaseCode-list.action?type=LCLX&fy=1',
																			scrollbarSize:138,
																			toolbar:'#act_line_list_toolbar'">
				<thead>
					<tr>
						<th data-options="field:'id',checkbox:true">id</th>
						<th data-options="field:'code',width:'20%'"><b>编码</b></th>
	                    <th data-options="field:'name',width:'30%'"><b>名称</b></th>
	                    <th data-options="field:'seq',width:'10%'"><b>排序</b></th>
	                    <th data-options="field:'xx',width:'110',align:'center',formatter:sys_act.listLineOpts"><b>操作</b></th>
					</tr>
				</thead>
			</table>
		</div>
		<div data-options="title:'流程监听'">
			<div id="act_listener_list_toolbar">
				<div class="toolbar-btn">
					<div class="btn-left">
						<a class="mwsmartui-linkbutton" data-options="iconCls:'icon-add',onClick:sys_act_listener.add">增加流程监听</a>
						<a class="mwsmartui-linkbutton" data-options="iconCls:'icon-remove',onClick:sys_act_listener.del">删除流程监听</a>
					</div>
				</div>
			</div>
			<table id="act_listener_list" class="mwsmartui-datagrid" data-options="pageSize:20,
																			border:false,
																			pagination:true,
																			checkOnSelect:false,
																			fit:true,
																			singleSelect:true,
																			striped:true,
																			method:'post',
																			url:'./ActListener-list.action',
																			scrollbarSize:138,
																			toolbar:'#act_listener_list_toolbar'">
				<thead>
					<tr>
						<th data-options="field:'id_',checkbox:true">id</th>
	                    <th data-options="field:'name_',width:'40%'"><b>名称</b></th>
	                    <th data-options="field:'group_',width:'15%'"><b>类别</b></th>
	                    <th data-options="field:'event',width:'15%'"><b>事件</b></th>
	                    <th data-options="field:'class_',width:'30%'"><b>CLASS</b></th>
	                    <th data-options="field:'xx',width:'110',align:'center',formatter:sys_act_listener.listOpts"><b>操作</b></th>
					</tr>
				</thead>
			</table>
		</div>
		--%>
	</div>
</body>
</html>