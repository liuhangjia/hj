<%@ page language="java" pageEncoding="UTF-8"%>
<%
String id = request.getParameter("id");
 %>
<div class="mwsmartui-layout" data-options="fit:true,border:false">
	<div data-options="region:'north',height:'170px',border:false">
		<form id="xtgl_gzmb_add_form" method="post" enctype="multipart/form-data">
			<fieldset>
				<legend>基本信息</legend>
				<input id="templateId" name="templateModel.id" type="hidden"/>
				<div class="lbcxtj" style="width:450px">
					<label style="display:inline-block; width:100px; text-align:right;">名称：</label>
					<input id="templateName" name="templateModel.name" class="mwsmartui-textbox" data-options="width:'340px',height:'30px',prompt:'',required:true">
				</div>
				<div class="lbcxtj" style="width:450px">
					<label style="display:inline-block; width:100px; text-align:right;">所属企业：</label>
					<select id="template_enterprise_id" name="templateModel.enterprise_id" class="mwsmartui-combobox" data-options="
						width:'340px',
						height:'30px',
						url:'./Enterprise-listForPriv.action?priv=SYS_PAYROLL_TEMPLATE_LIST',
						textField:'name',
						valueField:'id',
						required:true">
					</select>
				</div>
				<div id="templateFile_hide" class="lbcxtj" style="width:450px">
					<label style="display:inline-block; width:100px; text-align:right;">模板上传：</label>
					<input id="templateFile" name="uploadFile" class="mwsmartui-filebox" data-options="width:'340px',height:'30px',prompt:'',required:true,onChange:impModel,buttonText:'选择文件'">
				</div>
			</fieldset>
		</form>
	</div>
	<div data-options="region:'center',border:false">
		<table id="xtgl_gzmb_kmlb" class="mwsmartui-datagrid" data-options="title:'工资科目（<font style=color:red>请上传模板</font>）',
																			checkOnSelect:false,
																			border:true,
																			striped:true,
																			fit:true,
																			method:'post',
																			url:'./Payroll-listByKm?ids=<%=id %>',
																			scrollbarSize:38,
																			toolbar:'#xtgl_gzmb_kmlb_toolbar'">
			<thead>
				<tr>
					<th data-options="field:'id',checkbox:true">ID</th>
					<th data-options="field:'name',width:'55%'"><b>科目名称</b></th>
					<th data-options="field:'status',width:'45%',formatter:xtgl_gzmb_add_retBtn"><b>含义绑定</b></th>
				</tr>
			</thead>
		</table>
	</div>
</div>

<%-- 
<div class="mwsmartui-panel" data-options="fit:true,border:false">
	<div id="xtgl_gzmb_kmlb_toolbar" style="padding:0px;border-style: none;margin-top:5px;">
		<form id="xtgl_gzmb_add_form" method="post" enctype = "multipart/form-data">
			<input id="templateId" name="templateModel.id" type="hidden"/>
			<div class="lbcxtj" style="width:450px">
				<label style="display:inline-block; width:100px; text-align:right;">名称：</label>
				<input id="templateName" name="templateModel.name" class="mwsmartui-textbox" data-options="width:'340px',height:'30px',prompt:'',required:true">
			</div>
			<div class="lbcxtj" style="width:450px">
				<label style="display:inline-block; width:100px; text-align:right;">所属企业：</label>
				<select id="template_enterprise_id" name="templateModel.enterprise_id" class="mwsmartui-combobox" data-options="
					width:'340px',
					height:'30px',
					url:'./Enterprise-listForPriv.action?priv=PROJECT_MANAGER_ADD',
					textField:'name',
					valueField:'id',
					required:true">
				</select>
			</div>
			<div class="lbcxtj" style="width:450px">
				<label style="display:inline-block; width:100px; text-align:right;">模板上传：</label>
				<input id="templateFile" name="uploadFile" class="mwsmartui-filebox" data-options="width:'340px',height:'30px',prompt:'',required:true,onChange:impModel">
			</div>
		</form>
	</div>
	<table id="xtgl_gzmb_kmlb" class="mwsmartui-datagrid" data-options="pagination:true,
																		pageSize:20,
																		checkOnSelect:false,
																		border:true,
																		striped:true,
																		fit:true,
																		method:'post',
																		scrollbarSize:27,
																		url:'./Payroll-listByKm.action?ids=<%=id %>',
																		toolbar:'#xtgl_gzmb_kmlb_toolbar'">
		<thead>
			<tr>
				<th data-options="field:'ck',checkbox:true">ID</th>
				<th data-options="field:'name',width:'55%'"><b>科目名称</b></th>
				<th data-options="field:'status',width:'45%',formatter:xtgl_gzmb_add_retBtn"><b>含义绑定</b></th>
			</tr>
		</thead>
	</table>
</div>
--%>