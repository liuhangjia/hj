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
<div id="end_" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="end_list_toolbar"class="toolbar-div" style="">
    	<fieldset>
			<legend>查询条件</legend>
        	<form id="end_queryform" method="post" >
	            <div class="lbcxtj">
	                <label style="display:inline-block; width:100px; text-align:right;">申请人：</label>
	                <input id="end_person" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>   
	            <div class="lbcxtj">
	                <label style="display:inline-block; width:100px; text-align:right;">受理人：</label>
	                <input id="end_sl_person" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>  
	        	<div class="lbcxtj">
	                <label style="display:inline-block; width:100px; text-align:right;">受理时间：</label>
	                <input id="end_slsj_kssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
	            	&nbsp;&nbsp; 至 &nbsp;&nbsp;
	            	<input id="end_slsj_jssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>     
	        
	        </form>
        </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
				<a id="end_del_btn" href="#" class="mwsmartui-linkbutton"  data-options="onClick:pending_doAuditings"><i class="fa fa-plus"> </i> 批量处理</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:end_doSearch"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:end_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="end_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./ServiceRequest-list.action?sfyzj=1',
            scrollbarSize:107,
			toolbar:'#end_list_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'sn',width:'25%'"><b>编号</b></th>
                    <th data-options="field:'type',width:'15%',formatter:function(value){return common.codeToName('FWQQLB',value);}"><b>类别</b></th>
                    <th data-options="field:'req_name',width:'10%'"><b>申请人</b></th>
                    <th data-options="field:'req_time',width:'15%',formatter:function(value){return common.fmt_date19(value);}"><b>申请时间</b></th>
                    <th data-options="field:'handle_name',width:'10%'"><b>受理人</b></th>
                    <th data-options="field:'handle_time',width:'15%',formatter:function(value){return common.fmt_date19(value);}"><b>受理时间</b></th>
                    <th data-options="field:'status',width:'10%',formatter:sgd.fmt_zt"><b>处理结果</b></th>
                    <th data-options="field:'xxx01',width:'70',formatter:fwqq_end_doHandle"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
