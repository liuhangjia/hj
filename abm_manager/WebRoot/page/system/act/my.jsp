<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>员工</title>
</head>
<body>
	<div id="workflow_my_div" class="mwsmartui-layout" data-options="border:false,fit:true">
		<div class="mwsmartui-tabs" data-options="fit:true,border:true">
			<div data-options="border:false,title:'待审批'" style="border-top-width:1px !important;">
				<table id="workflow_my_list" class="mwsmartui-datagrid" data-options="pageSize:50,
																				border:false,
																				checkOnSelect:false,
																				pagination:true,
																				fit:true,
																				pageList:[50,100,150,200],
																				singleSelect:true,
																				striped:true,
																				url:'./act/ActWorkflow-my.action',
																				method:'post',
																				scrollbarSize:234">
					<thead>
						<tr>
							<%--  <th data-options="field:'id',width:'10%',align:'center'"><b>任务ID</b></th>
							<th data-options="field:'key',width:'10%',align:'center'"><b>KEY</b></th>--%>
							<th data-options="field:'businessName',width:'35%',align:'center'"><b>流程名称</b></th>
							<th data-options="field:'applyUser',width:'15%',align:'center'"><b>发起人</b></th>
							<th data-options="field:'name',width:'30%',align:'center'"><b>任务名称</b></th>
							<th data-options="field:'createTime',width:'20%',align:'center'"><b>提报时间</b></th>
							<th data-options="field:'_opt',width:'212px',align:'center',formatter:act_workflow.myListOpt"><b>操作</b></th>
						</tr>
					</thead>
				</table>
			</div>
			<div data-options="border:false,title:'已审批'" style="border-top-width:1px !important;">
				<table id="workflow_my_ysp_list" class="mwsmartui-datagrid" data-options="pageSize:50,
																				border:false,
																				checkOnSelect:false,
																				pagination:true,
																				fit:true,
																				pageList:[50,100,150,200],
																				singleSelect:true,
																				striped:true,
																				url:'./act/ActWorkflow-myHistory.action',
																				method:'post',
																				scrollbarSize:134">
					<thead>
						<tr>
							<th data-options="field:'businessName',width:'35%',align:'center'"><b>流程名称</b></th>
							<th data-options="field:'applyUser',width:'10%',align:'center'"><b>发起人</b></th>
							<th data-options="field:'name',width:'15%',align:'center'"><b>任务名称</b></th>
							<th data-options="field:'createTime',width:'15%',align:'center'"><b>处理时间</b></th>
							<th data-options="field:'result',width:'10%',align:'center'"><b>处理结果</b></th>
							<th data-options="field:'comment',width:'15%',align:'center'"><b>处理意见</b></th>
							<th data-options="field:'_opt',width:'112px',align:'center',formatter:act_workflow.myHiListOpt"><b>操作</b></th>
						</tr>
					</thead>
				</table>
			</div>
		</div>
	</div>
</body>
</html>