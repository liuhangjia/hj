<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
<div id="circulate_" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="circulate_list_toolbar" class="toolbar-div">
    <fieldset>
	    <legend>查询条件</legend>
            <form id="circulate_queryform" method="post" >
	            <div class="lbcxtj">
	                <label style="display:inline-block; width:100px; text-align:right;">借用人：</label>
	                <input id="circulate_search_user_name" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
	            </div>     
            </form>
     	</fieldset>
        <div class="toolbar-btn">
        	<%--
			<div class="btn-left">
             <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:circulate_doAdd"><i class="fa fa-plus"> </i> 添加</a>
             <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:circulate_doImport"><i class="fa fa-sign-in"> </i> 导入</a>
			</div>
        	 --%>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="xmIdIsEmpty:'0',onClick:equip.used_doSearch"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="xmIdIsEmpty:'0',onClick:equip.used_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="circulate_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			singleSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./EquipUsed-list.action?xmIdIsEmpty=0',
            scrollbarSize:217,
			toolbar:'#circulate_list_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
               		<th data-options="field:'user_name',width:'8%'"><b>借用人</b></th>
                    <th data-options="field:'project_name',width:'20%'"><b>项目名称</b></th>
                    <%--
                    <th data-options="field:'xx02',width:'8%'"><b>类别</b></th>
                     --%>
                    <th data-options="field:'xx03',width:'10%',formatter:function(value,row){if(row&&row['equipModel']&&row['equipModel']['category']){return row['equipModel']['category'];}else{return '';}}"><b>装备种类</b></th>
                    <th data-options="field:'equip_name',width:'15%'"><b>装备名称</b></th>
                    <th data-options="field:'quantity',width:'7%'"><b>借用数量</b></th>
                    <th data-options="field:'used_time',width:'14%',formatter:common.fmt_date"><b>借用时间</b></th>
                    <th data-options="field:'return_time',width:'14%',formatter:common.fmt_date"><b>归还时间</b></th>
                    <th data-options="field:'bak',width:'12%'"><b>备注</b></th>
                    <th data-options="field:'status',width:'180',formatter:equip.listOptsForUsed"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
