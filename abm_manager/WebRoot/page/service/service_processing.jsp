<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
<div id="processing_content" style=" width:100%; height:100%;">

<div id="" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="processing_list_toolbar"class="toolbar-div" style="">
        <form id="processing_queryform" method="post" >
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">应用名称：</label>
                <input id="" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>    
            
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">当前状态：</label>
                <select id="" class="mwsmartui-combobox" name="" data-options="width:'145px',height:'30px'" >
                <option value="0">未提交</option>
                <option value="1">待审核</option>
                <option value="2">审核通过</option>
                <option value="3">审核拒绝</option>
                
                </select>
            
            </div>       
        
        </form>
        <div class="toolbar-btn">
			<div class="btn-left">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:pending_doAuditings"><i class="fa fa-plus"> </i> 批量处理</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:processing_doSearch"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:processing_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="processing_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			singleSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./ServiceRequest-list.action?status=3',
            scrollbarSize:107,
			toolbar:'#processing_list_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'sn',width:'10%'"><b>编号</b></th>
                    <th data-options="field:'type',width:'15%'"><b>类别</b></th>
                    <th data-options="field:'req_name',width:'10%'"><b>申请人</b></th>
                    <th data-options="field:'req_time',width:'15%'"><b>申请时间</b></th>
                    <th data-options="field:'xxx',width:'10%'"><b>紧急度</b></th>
                    <th data-options="field:'handle_name',width:'15%'"><b>受理人</b></th>
                    <th data-options="field:'handle_time',width:'15%'"><b>受理时间</b></th>
                    <th data-options="field:'status',width:'10%'"><b>处理状态</b></th>
                    <th data-options="field:'xxx01',width:'70',formatter:pending_doHandle"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div></div>
</body>
</html>
