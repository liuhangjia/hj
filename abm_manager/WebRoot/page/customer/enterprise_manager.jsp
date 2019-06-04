<%@ page language="java"  pageEncoding="UTF-8"%>


	<div id="div_eneterprise_manage" class="mwsmartui-panel" data-options="border:false,fit:true">
		<div id="enterprise_manage_list_toolbar" class="toolbar-div">
			<fieldset>
				<legend>查询条件</legend>
				<form id="" method="post">
					<div class="lbcxtj">
						<label style="display: inline-block; width: 100px; text-align: right;">企业名称：</label>
						<select id="enterprise_query_name" name="templateModel.enterprise_id" class="mwsmartui-combobox" data-options="
							width:'340px',
							height:'30px',
							url:'./Enterprise-listForPriv.action?priv=ENTERPRISE_MANAGER_LIST',
							textField:'name',
							valueField:'name'">
						</select>
					</div>
				</form>
			</fieldset>
			<div class="toolbar-btn">
				<div class="btn-left">
					<a href="#" id="enterprise_manage_add_btn" class="mwsmartui-linkbutton" data-options="onClick:enterpriseManage.add"><i class="fa fa-plus"></i> 添加</a> 
					<a href="#" id="enterprise_manage_plsc_btn" class="mwsmartui-linkbutton" data-options="onClick:enterpriseManage.delBatch"><i class="fa fa-trash"></i> 批量删除</a> 
<!-- 					<a href="#" id="enterprise_manage_import_btn" class="mwsmartui-linkbutton" data-options="onClick:function(){alert('研发中...');}"><i class="fa fa-sign-in"> </i> 批量导入</a> -->
				</div>
				<div class="btn-right">
					<a href="#" class="mwsmartui-linkbutton" data-options="onClick:enterpriseManage.query"><i class="fa fa-search"> </i> 查询</a> 
					<a href="#" class="mwsmartui-linkbutton" data-options="onClick:enterpriseManage.reset"><i class="fa fa-refresh"> </i> 重置</a>
				</div>
			</div>
		</div>
		<table id="enterprise_manage_list" class="mwsmartui-datagrid" data-options="
																            pagination:true,
																			pageSize:20,
																			selectOnCheck:true,
																			fileOnSelect:true,
																			singleSelect:false,
																			border:false,
																			striped:true,
																			fit:true,
																			url:'./Enterprise-list.action',
																			method:'post',
																            scrollbarSize:277,
																            onCheck:enterpriseManage.click,
																            onUncheck:enterpriseManage.click,
																            onCheckAll:enterpriseManage.click,
																  			onUncheckAll:enterpriseManage.click,
																  			onLoadSuccess:enterpriseManage.click,
																			toolbar:'#enterprise_manage_list_toolbar'">
			<thead>
				<tr>
					<th data-options="field:'id',checkbox:true">ID</th>
					<th data-options="field:'name',width:'20%'"><b>企业名称</b></th>
					<th data-options="field:'contact',width:'10%'"><b>联系人</b></th>
					<th data-options="field:'address',width:'20%'"><b>单位地址</b></th>
					<th data-options="field:'phone',width:'10%'"><b>联系电话</b></th>
					<th data-options="field:'start_time',width:'15%'"><b>开始时间</b></th>
					<th data-options="field:'operator',width:'10%'"><b>接洽人</b></th>
					<th data-options="field:'end_time',width:'15%'"><b>结束时间</b></th>
					<th data-options="field:'xx',width:'240',formatter:enterpriseManage.listOpts"><b>操作</b></th>
				</tr>
			</thead>
		</table>
	</div>