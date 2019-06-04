<%@ page language="java"  pageEncoding="UTF-8"%>


	<div  class="mwsmartui-panel" data-options="border:false,fit:true">
		<div id="khgl_hygl_list_toolbar" class="toolbar-div">
			<fieldset>
				<legend>查询条件</legend>
				<form id="khgl_hygl_queryForm" method="post">
					<div class="lbcxtj">
						<label style="display: inline-block; width: 100px; text-align: right;">姓名：</label>
						<input id="khgl_hygl_search_name" class="mwsmartui-textbox" />
					</div>
					<div class="lbcxtj">
						<label style="display: inline-block; width: 100px; text-align: right;">手机号：</label>
						<input id="khgl_hygl_search_phone" class="mwsmartui-textbox" />
					</div>
					<div class="lbcxtj">
						<label style="display: inline-block; width: 100px; text-align: right;">地址：</label>
						<input id="khgl_hygl_search_addr" class="mwsmartui-textbox" />
					</div>
				</form>
			</fieldset>
			<div class="toolbar-btn">
				<div class="btn-left">
				</div>
				<div class="btn-right">
					<a href="#" class="mwsmartui-linkbutton" data-options="onClick:khgl_hygl_search"><i class="fa fa-search"> </i> 查询</a> 
					<a href="#" class="mwsmartui-linkbutton" data-options="onClick:khgl_hygl_reset"><i class="fa fa-refresh"> </i> 重置</a>
				</div>
			</div>
		</div>
		<table id="khgl_hygl_list" class="mwsmartui-datagrid" data-options="
																            pagination:true,
																			pageSize:20,
																			selectOnCheck:true,
																			fileOnSelect:true,
																			singleSelect:false,
																			border:false,
																			striped:true,
																			fit:true,
																			url:'./Member-list.action',
																			method:'post',
																            scrollbarSize:157,
																			toolbar:'#khgl_hygl_list_toolbar'">
			<thead>
				<tr>
					<th data-options="field:'id',checkbox:true">ID</th>
					<th data-options="field:'account',width:'10%',formatter:function(value,row){return row['account']['account'];}"><b>账号</b></th>
					<th data-options="field:'name',width:'10%'"><b>姓名</b></th>
					<th data-options="field:'type',width:'10%',formatter:khgl_hygl_formatType"><b>类别</b></th>
					<th data-options="field:'phone',width:'10%'"><b>手机号</b></th>
					<th data-options="field:'address',width:'20%'"><b>地址</b></th>
					<th data-options="field:'business',width:'40%'"><b>经营范围</b></th>
					<th data-options="field:'xx',width:'120',formatter:khgl_hygl_retBtn"><b>操作</b></th>
				</tr>
			</thead>
		</table>
	</div>