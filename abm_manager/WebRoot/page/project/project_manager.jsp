<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<body>

<script language="javascript" type="text/javascript" src="./js/project/projectManage.js"></script>

	<div id="manager_content" style="width: 100%; height: 100%">
		<div id="project_manage_div" class="mwsmartui-panel" data-options="border:false,width:'100%',height:'100%'">
			<div id="project_manage_list_toolbar" class="toolbar-div">
				<fieldset>
					<legend>查询条件</legend>
					<form id="project_manage_query_form" method="post">
						<div class="lbcxtj">
							<label>项目名称：</label> 
							<input id="project_manage_query_name" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''" />
						</div>
						<div class="lbcxtj">
							<label>项目类别：</label> 
							<input id="project_manage_query_type" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''" />
						</div>
						<div class="lbcxtj">
							<label>开始时间：</label> 
							<input id="project_manage_query_start" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
						</div>
						<div class="lbcxtj">
							<label>结束时间：</label> 
							<input id="project_manage_query_end" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
						</div>
						<%--
						<div class="lbcxtj">
							<label>项目状态：</label> 
							<input id="project_manage_query_status" class="mwsmartui-combobox" data-options="width:'145px',height:'30px',method: 'get',valueField:'value',textField:'text'" />
						</div>
						 --%>
						 <div class="lbcxtj">
							<label>项目状态：</label> 
							<input id="project_manage_query_status" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''" />
						</div>
					</form>
				</fieldset>
				<div class="toolbar-btn">
					<div class="btn-left">
						<a id="project_manage_add_btn" href="#" class="mwsmartui-linkbutton" data-options="onClick:projectManage.add"><i class="fa fa-plus"> </i> 添加</a> 
						<a id="project_manage_del_btn" href="#" class="mwsmartui-linkbutton" data-options="disabled:true,onClick:projectManage.delBatch"><i class="fa fa-trash"> </i> 批量删除</a> 
						<a id="project_manage_upload_btn" href="#" class="mwsmartui-linkbutton" data-options="onClick:projectManage.imp"><i class="fa fa-sign-in"> </i> 批量导入</a>
					</div>
					<div class="btn-right">
						<a href="#" class="mwsmartui-linkbutton" data-options="onClick:projectManage.query"><i class="fa fa-search"> </i> 查询</a> 
						<a href="#" class="mwsmartui-linkbutton" data-options="onClick:projectManage.reset"><i class="fa fa-refresh"> </i> 重置</a>
					</div>
				</div>
			</div>
			<table id="project_manage_list" class="mwsmartui-datagrid" data-options="pagination:true,
																					pageSize:20,
																					selectOnCheck:true,
																					fileOnSelect:true,
																					border:false,
																					striped:true,
																					fit:true,
																					url:'./Project-list.action',
																					method:'post',
																		            scrollbarSize:237,
																		            onCheck:projectManage.click,
																		            onUncheck:projectManage.click,
																		            onCheckAll:projectManage.click,
															    	       			onUncheckAll:projectManage.click,
															    	       			onLoadSuccess:projectManage.click,
																					toolbar:'#project_manage_list_toolbar'">
				<thead>
					<tr>
						<th data-options="field:'id',checkbox:true">ID</th>
						<th data-options="field:'enterprise_id',width:'20%',align:'center',formatter:function(value,row){return row['enterpriseModel']['name'];}"><b>所属企业</b></th>
						<th data-options="field:'sn',width:'7%',align:'center'"><b>项目编号</b></th>
						<th data-options="field:'type',width:'8%',align:'center',formatter:function(value,row){ return common.codeToName('XMLB',value); }"><b>类别</b></th>
						<th data-options="field:'name',width:'18%',align:'center'"><b>项目名称</b></th>
						<th data-options="field:'start_time',width:'9%',align:'center',formatter:common.fmt_date10"><b>启动时间</b></th>
						<th data-options="field:'end_time',width:'9%',align:'center',formatter:common.fmt_date10"><b>结束时间</b></th>
						<th data-options="field:'level',width:'7%',align:'center'"><b>项目级别</b></th>
						<th data-options="field:'area',width:'15%',align:'center'"><b>项目区域</b></th>
						<th data-options="field:'status',width:'7%',align:'center'"><b>项目状态</b></th>
						<th data-options="field:'xx',width:'200',formatter:projectManage.listOpts,align:'center'"><b>操作</b></th>
					</tr>
				</thead>
			</table>
		</div>
	</div>
</body>
</html>
