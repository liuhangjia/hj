<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>

<div id="managers_content" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="managers_list_toolbar" class="toolbar-div">
            <form id="managers_queryform" method="post" >
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">企业名称：</label>
                <input id="result_mc" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>    
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">开始时间：</label>
                <input id="result_kssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">结束时间：</label>
                <input id="result_jssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
            
          
            </form>
        <div class="toolbar-btn">
			<div class="btn-left">
             <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:equip.add"><i class="fa fa-plus"> </i> 添加</a>
             <%--
             <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:managers_doImport"><i class="fa fa-sign-in"> </i> 导入</a>
              --%>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:managers_doSearch"><i class="fa fa-search"> </i> 查询</a>
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:managers_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="equip_managers_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			singleSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./Equip-list.action',
            scrollbarSize:217,
			toolbar:'#managers_list_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'enterprise_name',width:'20%'"><b>企业名称</b></th>
                    <th data-options="field:'type',width:'10%',formatter:equip.fmt_type"><b>类别</b></th>
                    <th data-options="field:'category',width:'10%'"><b>装备种类</b></th>
                    <th data-options="field:'name',width:'20%'"><b>装备名称</b></th>
                    <th data-options="field:'factory',width:'15%'"><b>装备厂商</b></th>
                    <th data-options="field:'model',width:'10%'"><b>装备型号</b></th>
                    <th data-options="field:'unit',width:'10%'"><b>计量单位</b></th>
                    <th data-options="field:'quantity',width:'5%'"><b>数量</b></th>
                    <th data-options="field:'status',width:'180',formatter:equip.listOpts"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
