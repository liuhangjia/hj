<%@page import="com.mw.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String project_id = (String)request.getParameter("project_id");
	if(null == project_id){
		project_id="";
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
<script  type="text/javascript" src="./js/project/selectEquip.js"></script>
<script  type="text/javascript" src="./js/project/projectEquip.js"></script>
<div  class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="equipments_list_toolbar<%=project_id %>" class="toolbar-div">
    	<fieldset>
			<legend>查询条件</legend>
	        <form id="equipments_queryform<%=project_id %>" method="post" >
	            <div class="lbcxtj">
	                <label>项目名称：</label>
	                <input id="xmzb_search_xmmc<%=project_id %>" class="mwsmartui-textbox" data-options="disabled:<%=StringUtil.isNotEmpty(project_id) %>,width:'145px',height:'30px',prompt:''"/>
	            </div>
	             <div class="lbcxtj">
	                <label>装备种类：</label>
	                <input id="xmzb_search_zbzl<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>           
	            <div class="lbcxtj">
	                <label>装备名称：</label>
	                <input id="xmzb_search_zbmc<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	            <div class="lbcxtj">
	                <label>装备厂商：</label>
	                <input id="xmzb_search_zbcs<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	            <div class="lbcxtj">
	                <label>装备型号：</label>
	                <input id="xmzb_search_zbxh<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	            <div class="lbcxtj">
	                <label>装备数量：从</label>
	                <input id="xmzb_search_zbsl_min<%=project_id %>" class="mwsmartui-numberbox" data-options="width:'145px',height:'30px',prompt:''"/>
	                &nbsp;&nbsp;到
	                <input id="xmzb_search_zbsl_max<%=project_id %>" class="mwsmartui-numberbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	        </form>
        </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
				<a href="#" id="project_equip_add_btn<%=project_id %>" class="mwsmartui-linkbutton" data-options="project_id:'<%=project_id %>',onClick:projectEquip.add"><i class="fa fa-plus"> </i> 添加</a>
                <a href="#" id="project_equip_del_btn<%=project_id %>" class="mwsmartui-linkbutton" data-options="project_id:'<%=project_id %>',onClick:projectEquip.delBatch"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="project_id:'<%=project_id %>',onClick:projectEquip.query"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="project_id:'<%=project_id %>',onClick:projectEquip.reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="equipments_list<%=project_id %>" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./ProjectEquip-list.action?project_id=<%=project_id %>',
            scrollbarSize:157,
            project_id:'<%=project_id %>',
            onCheck:projectEquip.click,
            onUncheck:projectEquip.click,
            onCheckAll:projectEquip.click,
  			onUncheckAll:projectEquip.click,
  			onLoadSuccess:projectEquip.click,
			toolbar:'#equipments_list_toolbar<%=project_id %>'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'project_name',width:'15%'"><b>项目名称</b></th>
                    <%--
                    <th data-options="field:'zgh',width:'8%'"><b>类别</b></th>
                     --%>
                    <th data-options="field:'type',width:'10%',formatter:function(value){return common.codeToName('ZBLB',value);}"><b>装备类别</b></th>
                    <th data-options="field:'category',width:'10%'"><b>装备种类</b></th>
                    <th data-options="field:'name',width:'20%'"><b>装备名称</b></th>
                    <th data-options="field:'factory',width:'15%'"><b>装备厂商</b></th>
                    <th data-options="field:'model',width:'10%'"><b>装备型号</b></th>
                    <th data-options="field:'unit',width:'10%'"><b>计量单位</b></th>
                    <th data-options="field:'quantity',width:'10%'"><b>数量</b></th>
                    <th data-options="field:'status',project_id:'<%=project_id %>',width:'120',formatter:projectEquip.listOpts"><b>操作</b></th>
                </tr>
            </thead>
            
        </table>
  </div>
</body>
</html>
