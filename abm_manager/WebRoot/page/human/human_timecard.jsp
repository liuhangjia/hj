<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
<script language="javascript" type="text/javascript" src="./js/human/humanTimecard.js"></script>

<div id="timecard_tabs" class="mwsmartui-tabs" data-options="fit:true,border:false">
	<div data-options="title:'考勤统计'">
		<div id="timecard_div" class="mwsmartui-panel" data-options="border:false,fit:true">
		    <div id="timecard_list_toolbar" class="toolbar-div">
		    	<fieldset>
		    	<legend>查询条件</legend>
		            <form id="timecard_queryform" method="post" >
			            <div class="lbcxtj">
		                <label style="display:inline-block; width:100px; text-align:right;">企业：</label>
			                <select id="enterprise_id" name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" 
					                data-options="width:'145px',
					                				height:'30px',
					                				url:'./Employee-listMyEnterprise.action?type=WORK_ATTENDANCE_MANAGER_LIST',
					                				valueField:'id',
					                				textField:'name'">
			            	</select>
		            	</div>    
			            <div class="lbcxtj">
			                <label style="display:inline-block; width:100px; text-align:right;">年月：</label>
			                <input id="year_month" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
			            </div> 
		          
		            </form>
		            </fieldset>
		        <div class="toolbar-btn">
					<div class="btn-left">
					<!--  
		                <a href="#" id="timecard_add" class="mwsmartui-linkbutton" data-options="onClick:humanTimecard.timecard_doAdd"><i class="fa fa-plus"> </i> 添加</a>
		                <a href="#" id="timecard_del" class="mwsmartui-linkbutton" data-options="onClick:humanTimecard.timecard_doDel"><i class="fa fa-trash"> </i> 批量删除</a>
		                <a href="#" id="timecard_import_btn" class="mwsmartui-linkbutton" data-options="onClick:humanTimecard.timecard_doImport"><i class="fa fa-sign-in"> </i> 批量导入</a>
					-->
						<a href="#" id="timecard_export_btn" class="mwsmartui-linkbutton" data-options="onClick:humanTimecard.timecard_doExport"><i class="fa fa-sign-in"> </i> 导出</a>
		            </div>
					<div class="btn-right">
						<a href="#" id="timecard_search" class="mwsmartui-linkbutton"  data-options="onClick:humanTimecard.timecard_doSearch"><i class="fa fa-search"> </i> 查询</a>
		                <a href="#" id="timecard_reset" class="mwsmartui-linkbutton"  data-options="onClick:humanTimecard.timecard_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
					</div>
				</div>
		    </div>
		       <table id="timecard_list" class="mwsmartui-datagrid" data-options="pagination:true,
																					pageSize:30,
																					selectOnCheck:true,
																					checkOnSelect:false,
																					fileOnSelect:true,
																					singleSelect:false,
																					border:false,
																					striped:true,
																					fit:true,
																					url:'./Timecard-listResultForCompany.action',
																					method:'post',
																		            scrollbarSize:120,
																					toolbar:'#timecard_list_toolbar'">
		            <thead>
		                <tr>
		               		<th data-options="field:'ename',width:'13%',formatter:function(value,row){if(row['enterpriseModel']){return row['enterpriseModel']['name'];}}"><b>企业</b></th> 
		                    <th data-options="field:'ny',width:'7%',formatter:humanTimecard.timecard_ny"><b>年月</b></th>                    
		                    <th data-options="field:'amount',width:'8%',formatter:function(value,row){return row['amount']+'/'+row['amount_']}"><b>人次/人数</b></th>                    
		                    <th data-options="field:'normal',width:'9%',formatter:function(value,row){return row['normal']+'/'+row['normal_']}"><b>出勤人次/人数</b></th>
		                    <th data-options="field:'vacation',width:'9%',formatter:function(value,row){return row['vacation']+'/'+row['vacation_']}"><b>休假人次/人数</b></th>
		                    <th data-options="field:'leaves',width:'9%',formatter:function(value,row){return row['leaves']+'/'+row['leaves_']}"><b>事假人次/人数</b></th>
		                    <th data-options="field:'sick',width:'9%',formatter:function(value,row){return row['sick']+'/'+row['sick_']}"><b>病假人次/人数</b></th>
		                    <th data-options="field:'absence',width:'9%',formatter:function(value,row){return row['absence']+'/'+row['absence_']}"><b>旷工人次/人数</b></th>
		                    <th data-options="field:'late',width:'9%',formatter:function(value,row){return row['late']+'/'+row['late_']}"><b>迟到人次/人数</b></th>
		                    <th data-options="field:'overtime',width:'9%',formatter:function(value,row){return row['overtime']+'/'+row['overtime_']}"><b>加班人次/人数</b></th>
		                    <th data-options="field:'replace',width:'9%',formatter:function(value,row){return row['replace']+'/'+row['replace_']}"><b>替班人次/人数</b></th>
		                    <th data-options="field:'xx',width:'120px',formatter:humanTimecard.timecard_doHandle"><b>操作</b></th>
		                    
		                </tr>
		            </thead>
		        </table>
		  	</div>
	</div>
</div>


</body>
</html>
