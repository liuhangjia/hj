<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div  style=" width:100%; height:100%;">
<div class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="hyzx_wdyy_list_toolbar" class="toolbar-div" style="">
        
        <div class="toolbar-btn">
			<div class="btn-left">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:hyzx_wdyy_apply"><i class="fa fa-plus"> </i> 申请</a>
			</div>
			
		</div>
    </div>
       <table id="hyzx_wdyy_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			singleSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'get',
			url:'./Enterprise-listModelApply.action',
            scrollbarSize:107,
			toolbar:'#hyzx_wdyy_list_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
                    <th data-options="field:'enterprise_name',width:'15%'"><b>企业名称</b></th>
                    <th data-options="field:'req_name',width:'10%'"><b>申请人</b></th>
                    <th data-options="field:'status',width:'10%',formatter:hyzx_wdyy_formatStatus"><b>当前状态</b></th>
                    <th data-options="field:'req_time',width:'16%',formatter:function(value){return common.fmt_date19(value);}"><b>申请时间</b></th>
                    <th data-options="field:'handle_name',width:'13%'"><b>审核人</b></th>
                    <th data-options="field:'handle_time',width:'16%',formatter:function(value){return common.fmt_date19(value);}"><b>审核时间</b></th>
                    <th data-options="field:'handle_result',width:'20%'"><b>审核意见</b></th>
                    <th data-options="field:'handle',width:'70px',formatter:hyzx_wdyy_doHandle"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div></div>
</body>
</html>
