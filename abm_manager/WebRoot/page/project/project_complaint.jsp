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
<script  type="text/javascript" src="./js/project/projectCommunication.js"></script>
<div id="project_communication_div<%=project_id %>" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="communication_list_toolbar<%=project_id %>" class="toolbar-div">
    	<fieldset>
			<legend>查询条件</legend>
            <form id="communication_queryform<%=project_id %>" method="post" >
	            <div class="lbcxtj">
	                <label>项目名称：</label>
	                <input id="communication_xmmc<%=project_id %>"  class="mwsmartui-textbox" data-options="disabled:<%=StringUtil.isNotEmpty(project_id) %>,width:'145px',height:'30px',prompt:''"/>
	            </div>
	            <%--
	            <div class="lbcxtj">
	                <label>项目类别：</label>
	                <input id="communication_xmlb<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
	            </div>    
	             --%>
	            <div class="lbcxtj">
	                <label>回访时间：从</label>
	                <input id="communication_kssj<%=project_id %>" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
	            	&nbsp;&nbsp; 到
	            	<input id="communication_jssj<%=project_id %>" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	            <div class="lbcxtj">
	                <label>回访人姓名：</label>
	                <input id="communication_hfrxm<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	            <%--
	            <div class="lbcxtj">
	                <label>到</label>
	                <input id="communication_xmjssj<%=project_id %>" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
	            </div>
	            <div class="lbcxtj">
	                <label>项目状态：</label>
	                <input id="communication_xmzt<%=project_id %>" class="mwsmartui-combobox" data-options="width:'145px',height:'30px',url: 'combobox_data.json',
					method: 'get',
					valueField:'value',
					textField:'text'">
	            </div>  
	             --%>
            </form>
        </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
				<a id="project_communication_add_btn<%=project_id %>" href="#" class="mwsmartui-linkbutton" data-options="project_id:'<%=project_id %>',onClick:projectCommunication.add"><i class="fa fa-plus"> </i> 添加</a>
                <a id="project_communication_del_btn<%=project_id %>" href="#" class="mwsmartui-linkbutton" data-options="project_id:'<%=project_id %>',onClick:projectCommunication.delBatch"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="project_id:'<%=project_id %>',onClick:projectCommunication.query"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="project_id:'<%=project_id %>',onClick:projectCommunication.reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="project_communication_list<%=project_id %>" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./ProjectCommunication-list.action?project_id=<%=project_id %>',
            scrollbarSize:157,
            project_id:'<%=project_id %>',
            onCheck:projectCommunication.click,
            onUncheck:projectCommunication.click,
            onCheckAll:projectCommunication.click,
  			onUncheckAll:projectCommunication.click,
  			onLoadSuccess:projectCommunication.click,
			toolbar:'#communication_list_toolbar<%=project_id %>'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'project_name',width:'15%'"><b>项目名称</b></th>
                    <%--
                    <th data-options="field:'zgh',width:'8%'"><b>项目类别</b></th>
                     --%>
                    <th data-options="field:'content',width:'20%'"><b>回访内容</b></th>
                    <th data-options="field:'comm_time',width:'15%',formatter:common.fmt_date"><b>回访时间</b></th>
                    <th data-options="field:'score',width:'10%'"><b>用户评分</b></th>
                    <th data-options="field:'emp_name',width:'13%'"><b>回访人姓名</b></th>
                    <th data-options="field:'name',width:'13%'"><b>被回访人姓名</b></th>
                    <th data-options="field:'position',width:'14%'"><b>被回访人职务</b></th>
                    <th data-options="field:'status',width:'120',project_id:'<%=project_id %>',formatter:projectCommunication.listOpts"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
