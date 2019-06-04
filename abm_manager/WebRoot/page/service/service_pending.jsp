<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
<script type="text/javascript" src="./js/service_sgd.js"></script>
<script type="text/javascript" src="./js/user_intention.js"></script>
<div id="processing_content" style=" width:100%; height:100%;">
<div class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="pending_list_toolbar" class="toolbar-div" style="">
    	<fieldset>
			<legend>查询条件</legend>
	        <form id="pending_queryform" method="post" >
	            <div class="lbcxtj">
	                <label style="display:inline-block; width:100px; text-align:right;">申请人：</label>
	                <input id="pending_person" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            
	            </div>    
	            
	        	<div class="lbcxtj">
	                <label style="display:inline-block; width:100px; text-align:right;">申请时间：</label>
	                <input id="pending_sqsj_kssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
	            	&nbsp;&nbsp; 至 &nbsp;&nbsp;
	            	<input id="pending_sqsj_jssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	        </form>
	    </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
			<!--  
				<a id="pending_del_btn" href="#" class="mwsmartui-linkbutton"  data-options="onClick:pending_doAuditings"><i class="fa fa-plus"> </i> 批量处理</a>
			-->
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:pending_doSearch"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:pending_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="pending_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./ServiceRequest-list.action?status=0',
            scrollbarSize:217,
			toolbar:'#pending_list_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'sn',width:'30%'"><b>编号</b></th>
                    <th data-options="field:'type',width:'20%',formatter:function(value){return common.codeToName('FWQQLB',value);}"><b>类别</b></th>
                    <th data-options="field:'req_name',width:'15%'"><b>申请人</b></th>
                    <th data-options="field:'req_time',width:'20%',formatter:function(value){return common.fmt_date19(value);}"><b>申请时间</b></th>
                    <th data-options="field:'status',width:'15%',formatter:sgd.fmt_zt"><b>处理状态</b></th>
                    <th data-options="field:'xxx01',width:180,formatter:pending_doHandle"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div></div>
</body>
</html>
