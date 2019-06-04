<%@page import="com.mw.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String grOrQy = request.getParameter("grOrQy");
	String lb = request.getParameter("lb");
	String xmIdIsEmpty = "1";
	String cz_th_width = "25%";
	if(StringUtil.eq(grOrQy, "qy")){
		xmIdIsEmpty = "0";
		cz_th_width = "10%";
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
<div id="zbgl_lyjl_<%=lb %><%=grOrQy %>" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="zbgl_lyjl_list_toolbar_<%=lb %><%=grOrQy %>" class="toolbar-div">
    <fieldset>
	    <legend>查询条件</legend>
            <form id="zbgl_lyjl_queryform_<%=lb %><%=grOrQy %>" method="post" >
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">借用人：</label>
                <input id="zbgl_lyjl_search_user_name_<%=lb %><%=grOrQy %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            </div> 
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">装备名称：</label>
                <input id="zbgl_lyjl_search_equip_name_<%=lb %><%=grOrQy %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            </div>
            <%
            	if(StringUtil.eq(grOrQy, "qy")){
            %>
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">项目名称：</label>
                <input id="zbgl_lyjl_search_project_name_<%=lb %><%=grOrQy %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            </div>
            <%
            	}
            %>
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">是否已归还：</label>
                <select id="zbgl_lyjl_search_sfygh_<%=lb %><%=grOrQy %>" class="mwsmartui-combobox" data-options="width:'145px',height:'30px',prompt:''">
            		<option value="" >&nbsp;</option>
            		<option value="1">是</option>
            		<option value="0">否</option>
            	</select>
            </div>
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">借用时间：</label>
                	从<input id="zbgl_lyjl_search_jysj_start_<%=lb %><%=grOrQy %>" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
                	到<input id="zbgl_lyjl_search_jysj_end_<%=lb %><%=grOrQy %>" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">归还时间：</label>
               		从<input id="zbgl_lyjl_search_ghsj_start_<%=lb %><%=grOrQy %>" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
                	到<input id="zbgl_lyjl_search_ghsj_end_<%=lb %><%=grOrQy %>" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            </div>
                
            </form>
        </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
             	<a href="#" class="mwsmartui-linkbutton"  data-options="grOrQy:'<%=grOrQy %>',lb:'<%=lb %>',onClick:equipUsed.download"><i class="fa fa-sign-out"> </i> 导出</a>
        	<%--
             <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:zbgl_lyjl_doImport"><i class="fa fa-sign-in"> </i> 导入</a>
        	 --%>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="grOrQy:'<%=grOrQy %>',lb:'<%=lb %>',onClick:equipUsed.used_doSearch"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="grOrQy:'<%=grOrQy %>',lb:'<%=lb %>',onClick:equipUsed.used_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="zbgl_lyjl_list_<%=lb %><%=grOrQy %>" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			singleSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./EquipUsed-list.action?xmIdIsEmpty=<%=xmIdIsEmpty %>&lb=<%=lb %>',
            scrollbarSize:40,
			toolbar:'#zbgl_lyjl_list_toolbar_<%=lb %><%=grOrQy %>'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
               		<%--
                    <th data-options="field:'equip_name',width:'15%'"><b>企业名称</b></th>
               		 --%>
                    <th data-options="field:'user_name',width:'10%'"><b>借用人</b></th>
                    <%
                    	if(StringUtil.eq(grOrQy, "qy")){
                    %>
                    <th data-options="field:'project_name',width:'15%'"><b>项目名称</b></th>
                    <%
                    	}
                    %>
                    <th data-options="field:'xx02',width:'10%',formatter:function(value,row){if(row&&row['equipModel']&&row['equipModel']['category']){return row['equipModel']['category'];}else{return '';}}"><b>装备种类</b></th>
                    <th data-options="field:'equip_name',width:'20%'"><b>装备名称</b></th>
                    <th data-options="field:'quantity',width:'7%'"><b>借用数量</b></th>
                    <th data-options="field:'used_time',width:'9%',formatter:common.fmt_date"><b>借用时间</b></th>
                    <th data-options="field:'return_time',width:'9%',formatter:common.fmt_date"><b>归还时间</b></th>
                    <th data-options="field:'bak',width:'10%'"><b>备注</b></th>
                    <th data-options="field:'status',width:'<%=cz_th_width %>',grOrQy:'<%=grOrQy %>',lb:'<%=lb %>',formatter:equipUsed.listOptsForUsed"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
