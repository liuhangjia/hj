<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<body>



	<div id="div_human_staff" class="mwsmartui-panel" data-options="border:false,fit:true">
		<div id="human_staff_list_toolbar" class="toolbar-div">
			<fieldset>
				<legend>查询条件</legend>
				<form id="human_staff_queryform" method="post">
		            
		            <!--  
					<div class="lbcxtj">
		                <label style="display:inline-block; width:100px; text-align:right;">企业：</label>
		                <select id="human_staff_enterprise_name" name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" 
				                data-options="width:'145px',
				                				height:'30px',
				                				valueField:'id',
				                				textField:'name'">
		                </select>
		            </div>  
		            <div class="lbcxtj">
		                <label style="display:inline-block; width:100px; text-align:right;">项目：</label>
		                <select id="human_staff_project_name" name="enterpriseEmployee.project_id" class="mwsmartui-combobox" 
			                	data-options="width:'145px',
			                					height:'30px',
			                					valueField:'id',
			                					textField:'name'">
		                </select>
		            </div>
		            <div class="lbcxtj">
		                <label style="display:inline-block; width:100px; text-align:right;">部门：</label>
		                <select id="human_staff_depart" name="enterpriseEmployee.depart_id" class="mwsmartui-combobox" 
			                	data-options="width:'145px',
			                					height:'30px',
			                					valueField:'id',
			                					textField:'name'">
		                </select>
		            </div>
		            -->
					<div class="lbcxtj">
		                <label>企业：</label>
		                <input id="human_staff_search_qy" class="mwsmartui-combobox" data-options="
		                url:'./Enterprise-listForPriv.action?priv=EMPLOYEE_MANAGER_LIST',
		                valueField:'id',
		                textField:'name',
		                onSelect:humanStaff.searchSelect_qy,
		                width:'145px',height:'30px',prompt:''">
		            </div>
		            <div class="lbcxtj">
		                <label>部门：</label>
		                <input id="human_staff_search_bm" class="mwsmartui-combotree" data-options="
		                valueField:'id',
		                textField:'name',
		                width:'145px',height:'30px',prompt:''">
		            </div>
				
					<div class="lbcxtj">
						<label style="display: inline-block; width: 100px; text-align: right;">姓名：</label>
						<input id="human_staff_search_name" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''" />
					</div>
				</form>
			</fieldset>
			<div class="toolbar-btn">
				<div class="btn-left">
					<a href="#" id="human_staff_add_btn" class="mwsmartui-linkbutton" data-options="onClick:humanStaff.addEmp"><i class="fa fa-plus"></i> 添加员工</a>
					<a href="#" id="human_staff_invite_btn" class="mwsmartui-linkbutton" data-options="onClick:humanStaff.addEmpInvite"><i class="fa fa-plus"></i> 邀请安保人员</a>
					<a href="#" id="human_staff_plsc_btn" class="mwsmartui-linkbutton" data-options="disabled:true,onClick:humanStaff.plsc"><i class="fa fa-trash"> </i> 批量删除</a> 
					<a href="#" id="human_staff_import_btn" class="mwsmartui-linkbutton" data-options="onClick:humanStaff.doImport"><i class="fa fa-sign-in"> </i> 批量导入</a>
					<!--  
					<a href="#" id="human_staff_export_btn" class="mwsmartui-linkbutton" data-options="onClick:humanStaff.doExport"><i class="fa fa-sign-in"> </i> 导出</a>
					-->
				</div>
				<div class="btn-right">
					<a href="#" class="mwsmartui-linkbutton" data-options="onClick:humanStaff.query"><i class="fa fa-search"> </i> 查询</a> 
					<a href="#" class="mwsmartui-linkbutton" data-options="onClick:humanStaff.reset"><i class="fa fa-refresh"> </i> 重置</a>
				</div>
			</div>
		</div>
		<table id="human_staff_list" class="mwsmartui-datagrid" data-options="pagination:true,
																		pageSize:30,
																		selectOnCheck:true,
																		checkOnSelec:false,
																		fileOnSelect:true,
																		border:false,
																		striped:true,
																		fit:true,
																		url:'./Employee-list.action?type=EMPLOYEE_MANAGER_LIST',
																		method:'post',
															            scrollbarSize:157,
																		toolbar:'#human_staff_list_toolbar',
																		onCheck:humanStaff.togglePlsc,
																		onUncheck:humanStaff.togglePlsc,
																		onCheckAll:humanStaff.togglePlsc,
    																	onUncheckAll:humanStaff.togglePlsc,
    																	onLoadSuccess:humanStaff.togglePlsc">
			<thead>
				<tr>
					<th data-options="field:'id',checkbox:true">ID</th>
					<th data-options="field:'name',width:'9%',align:'center',formatter:function(value,row){return row['enterpriseModel']['name'];}"><b>企业名称</b></th>
					<th data-options="field:'n',width:'8%',align:'center',formatter:function(value,row){return row['employeeModel']['name'];}"><b>姓名</b></th>
					<th data-options="field:'sex',width:'5%',align:'center',formatter:function(value,row){return common.codeToName('XB',row['employeeModel']['sex']);}"><b>性别</b></th>
					<th data-options="field:'depart_name',width:'15%',align:'center'"><b>部门</b></th><%-- ,formatter:common.departIdToName --%>
					<th data-options="field:'position',width:'8%',align:'center'"><b>职务</b></th>
					<th data-options="field:'phone',width:'10%',align:'center',formatter:function(value,row){return row['employeeModel']['phone'];}"><b>联系电话</b></th>
					<th data-options="field:'address',width:'15%',align:'center',formatter:function(value,row){return row['employeeModel']['address'];}"><b>联系地址</b></th>
					<th data-options="field:'start_time',width:'10%',align:'center',formatter:function(value){return common.fmt_date10(value);}"><b>入职时间</b></th>
					<th data-options="field:'status',width:'10%',align:'center',formatter:function(value,row,index){return common.codeToName('ZGZT',value);}"><b>当前状态</b></th>
					<th data-options="field:'type',width:'10%',align:'center',formatter:function(value,row,index){return common.codeToName('RYLB',row['employeeModel']['type']);}"><b>人员类别</b></th>
					<th data-options="field:'xx',width:'120',align:'center',formatter:humanStaff.doHandle"><b>操作</b></th>
				</tr>
			</thead>
		</table>
	</div>
	<script type="text/javascript">
		$(function(){
			$('#human_staff_queryform #human_staff_enterprise_name').combobox({
				url:'./Employee-listMyEnterprise.action?type=EMPLOYEE_MANAGER_LIST',
				onChange:function(val){
					if(val){
						//project
						//$('#human_staff_queryform #human_staff_project_name').combobox({
						//	url:'./Employee-listProjectByCondition.action?type=EMPLOYEE_MANAGER_LIST&enterpriseId='+val,
						//});
						//staff
						$('#human_staff_queryform #human_staff_depart').combobox({
							url:'./Depart-list.action?enterpriseId='+val,
						});
					}
				}
			});
			
		});
	</script>
</body>
</html>
