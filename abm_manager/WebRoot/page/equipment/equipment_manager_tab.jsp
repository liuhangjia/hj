<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String lb = request.getParameter("lb");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>

<div id="managers_content<%=lb %>" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="managers_list_toolbar<%=lb %>" class="toolbar-div">
    <fieldset>
	    <legend>查询条件</legend>       
           <form id="managers_queryform<%=lb %>" method="post" >
           <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">企业名称：</label>
                <input id="equip_managers_search_qymc_<%=lb %>"  class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            </div>
           <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">名称：</label>
                <input id="equip_managers_search_mc_<%=lb %>"  class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">厂商：</label>
                <input id="equip_managers_search_cs_<%=lb %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">型号：</label>
                <input id="equip_managers_search_xh_<%=lb %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">数量范围：</label>
                <input id="equip_managers_search_num_min_<%=lb %>" class="mwsmartui-numberbox" data-options="width:'145px',height:'30px',prompt:''">
                ~
                <input id="equip_managers_search_num_max_<%=lb %>" class="mwsmartui-numberbox" data-options="width:'145px',height:'30px',prompt:''">
            </div>
           
            </form>
            </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
             <a href="#" class="mwsmartui-linkbutton" data-options="onClick:equip.add,lb:'<%=lb %>'"><i class="fa fa-plus"> </i> 添加</a>
             <a href="#" class="mwsmartui-linkbutton" id="equip_del" data-options="onClick:equip.delBatch,lb:'<%=lb %>'"><i class="fa fa-trash"> </i> 批量删除</a>
             <%--
             <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:managers_doImport"><i class="fa fa-sign-in"> </i> 导入</a>
              --%>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:equip.query,lb:'<%=lb %>'"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:equip.reset,lb:'<%=lb %>'" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="equip_managers_list<%=lb %>" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			lb:'<%=lb %>',
			url:'./Equip-list.action?lb=<%=lb %>',
            scrollbarSize:217,
			toolbar:'#managers_list_toolbar<%=lb %>',
			onCheck:equip.togglePlsc,
			onUncheck:equip.togglePlsc,
			onCheckAll:equip.togglePlsc,
			onUncheckAll:equip.togglePlsc,
			onLoadSuccess:equip.togglePlsc">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'enterprise_name',width:'20%'"><b>企业名称</b></th>
                    <th data-options="field:'type',width:'10%',formatter:equip.fmt_type"><b>类别</b></th>
                    <th data-options="field:'sn',width:'10%'"><b>编号</b></th>
                    <th data-options="field:'category',width:'10%',formatter:function(value){return common.codeToName('ZBZL',value);}"><b>种类</b></th>
                    <th data-options="field:'name',width:'15%'"><b>名称</b></th>
                    <th data-options="field:'factory',width:'15%'"><b>厂商</b></th>
                    <th data-options="field:'model',width:'10%'"><b>型号</b></th>
                    <th data-options="field:'unit',width:'5%'"><b>计量单位</b></th>
                    <th data-options="field:'quantity',width:'5%'"><b>数量</b></th>
                    <th data-options="field:'status',lb:'<%=lb %>',width:'180',formatter:equip.listOpts"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
