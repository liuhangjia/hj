<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title></title>
</head>

<body>

<div id="leave_div" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="leave_list_toolbar" class="toolbar-div">
	    <fieldset>
	    <legend>查询条件</legend>
            <form id="leave_queryform" method="post" >
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">企业：</label>
                <select id="leave_enterprise_name" name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" 
		                data-options="width:'145px',
		                				height:'30px',
		                				valueField:'id',
		                				textField:'name'">
                </select>
            </div>  
            
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">项目：</label>
                <select id="leave_project_name" name="enterpriseEmployee.project_id" class="mwsmartui-combobox" 
	                	data-options="width:'145px',
	                					height:'30px',
	                					valueField:'id',
	                					textField:'name'">
                </select>
            </div>  
           
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">类别：</label>
                <select id="leave_type" class="mwsmartui-combobox" name="language" data-options="width:'145px',height:'30px'" >
	                <option value="">请选择</option>
	                <option value="0">病假</option>
	                <option value="1">事假</option>
                </select>
            </div>
                   
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">是否销假：</label>
                <select id="leave_state" class="mwsmartui-combobox" name="language" data-options="width:'145px',height:'30px'" >
	                <option value="">请选择</option>
	                <option value="0">否</option>
	                <option value="1">是</option>
                </select>
            </div>
                   
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">审批状态：</label>
                <select id="leave_back" class="mwsmartui-combobox" name="language" data-options="width:'145px',height:'30px'" >
	                <option value="">请选择</option>
	                <option value="0">审批新建</option>
	                <option value="1">审批中</option>
	                <option value="2">审批拿回</option>
	                <option value="3">审批通过</option>
	                <option value="4">审批拒绝</option>
	                <option value="5">审批结束</option>
                </select>
            </div>       
           </form>
           </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
                    <a href="#" id="leave_add" class="mwsmartui-linkbutton"  data-options="onClick:humanLeave.leave_doAdd"><i class="fa fa-plus"> </i> 添加</a>
                    <a href="#" id="leave_del" class="mwsmartui-linkbutton" data-options="onClick:humanLeave.leave_doDel"><i class="fa fa-trash"> </i> 批量删除</a>
                    <a href="#" id="leave_imp" class="mwsmartui-linkbutton" data-options="onClick:humanLeave.leave_doImport"><i class="fa fa-sign-in"> </i> 批量导入</a>
                    <a href="#" id="leave_exp" class="mwsmartui-linkbutton" data-options="onClick:humanLeave.leave_doExport"><i class="fa fa-sign-out"> </i> 导出</a>
			</div>
			<div class="btn-right">
				<a href="#" id="leave_search" class="mwsmartui-linkbutton"  data-options="onClick:humanLeave.leave_doSearch"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" id="leave_reset" class="mwsmartui-linkbutton"  data-options="onClick:humanLeave.leave_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="leave_list" class="mwsmartui-datagrid" data-options="pagination:true,
																		pageSize:30,
																		selectOnCheck:true,
																		checkOnSelect:false,
																		fileOnSelect:true,
																		singleSelect:false,
																		border:false,
																		striped:true,
																		fit:true,
																		url:'./Vacation-list.action',
																		method:'post',
															            scrollbarSize:157,
																		toolbar:'#leave_list_toolbar',
																		onCheck:humanLeave.togglePlsc,
																		onUncheck:humanLeave.togglePlsc,
																		onCheckAll:humanLeave.togglePlsc,
    																	onUncheckAll:humanLeave.togglePlsc,
    																	onLoadSuccess:humanLeave.togglePlsc">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
               		<th data-options="field:'ename',width:'10%',formatter:function(value,row){if(row['enterprise']){return row['enterprise']['name'];}}"><b>企业</b></th>     
               		<th data-options="field:'project_name',width:'14%'"><b>项目</b></th>     
                    <th data-options="field:'enterprise_emp_name',width:'6%'"><b>请假人</b></th>                   
                    <th data-options="field:'depart_name',width:'6%'"><b>部门</b></th>                    
                    <th data-options="field:'position',width:'5%'"><b>职务</b></th>
                    <th data-options="field:'type',width:'7%',formatter:function(value){return value=='0'?'病假':'事假'}"><b>请假类别</b></th>  
                    <th data-options="field:'start_time',width:'7%',formatter:common.fmt_date10"><b>请假时间</b></th>
                    <th data-options="field:'end_time',width:'7%',formatter:common.fmt_date10"><b>销假时间</b></th>
                    <th data-options="field:'is_back',width:'6%',formatter:function(value){return value=='1'?'是':'否'}"><b>是否销假</b></th>
                    <th data-options="field:'reason',width:'13%'"><b>请假事由</b></th>
                    <th data-options="field:'status',width:'6%',formatter:humanLeave.leave_status"><b>审批状态</b></th>
                    <th data-options="field:'approval_name',width:'6%'"><b>审批人</b></th>
                    <th data-options="field:'approval_time',width:'7%',formatter:common.fmt_date10"><b>审批时间</b></th>
                    <th data-options="field:'xx',width:'120',formatter:humanLeave.leave_doHandle"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
	<script type="text/javascript">
		$(function(){
			$('#leave_queryform #leave_enterprise_name').combobox({
				url:'./Employee-listMyEnterprise.action?type=VACATION_MANAGER_LIST',
				onChange:function(val){
					if(val){
						$('#leave_queryform #leave_project_name').combobox({
							url:'./Employee-listProjectByCondition.action?type=VACATION_MANAGER_LIST&enterpriseId='+val,
						});
					}
				}
			});
		});
	</script>
</body>
</html>