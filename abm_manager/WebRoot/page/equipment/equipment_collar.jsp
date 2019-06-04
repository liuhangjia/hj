<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
<div id="collar_" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="collar_list_toolbar" class="toolbar-div">
    <fieldset>
	    <legend>查询条件</legend>
            <form id="collar_queryform" method="post" >
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">借用人：</label>
                <input id="collar_search_user_name" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            </div> 
            <%--
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">开始时间：</label>
                <input id="result_kssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">结束时间：</label>
                <input id="result_jssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            </div>
             --%>   
            </form>
        </fieldset>
        <div class="toolbar-btn">
        	<%--
			<div class="btn-left">
             <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:collar_doAdd"><i class="fa fa-plus"> </i> 添加</a>
             <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:collar_doImport"><i class="fa fa-sign-in"> </i> 导入</a>
			</div>
        	 --%>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="xmIdIsEmpty:'1',onClick:equip.used_doSearch"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="xmIdIsEmpty:'1',onClick:equip.used_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="collar_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			singleSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./EquipUsed-list.action?xmIdIsEmpty=1',
            scrollbarSize:217,
			toolbar:'#collar_list_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
               		<%--
                    <th data-options="field:'equip_name',width:'15%'"><b>企业名称</b></th>
               		 --%>
                    <th data-options="field:'user_name',width:'10%'"><b>借用人</b></th>
                    <th data-options="field:'xx02',width:'10%',formatter:function(value,row){if(row&&row['equipModel']&&row['equipModel']['category']){return row['equipModel']['category'];}else{return '';}}"><b>装备种类</b></th>
                    <th data-options="field:'equip_name',width:'20%'"><b>装备名称</b></th>
                    <th data-options="field:'quantity',width:'10%'"><b>借用数量</b></th>
                    <th data-options="field:'used_time',width:'15%',formatter:common.fmt_date"><b>借用时间</b></th>
                    <th data-options="field:'return_time',width:'15%',formatter:common.fmt_date"><b>归还时间</b></th>
                    <th data-options="field:'bak',width:'20%'"><b>备注</b></th>
                    <th data-options="field:'status',width:'180',formatter:equip.listOptsForUsed"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
