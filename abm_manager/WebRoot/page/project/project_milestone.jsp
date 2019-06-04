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
<script type="text/javascript" src="./js/project/projectEvent.js"></script>
<div  class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="milestone_list_toolbar<%=project_id %>" class="toolbar-div">
    	<fieldset>
			<legend>查询条件</legend>
	         <form id="milestone_queryform<%=project_id %>" method="post" >
	            <div class="lbcxtj">
	                <label>项目名称：</label>
	                <input id="zysj_search_xmmc<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	            <div class="lbcxtj">
	                <label>发生时间：从</label>
	                <input id="zysj_search_kssj<%=project_id %>" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
	                &nbsp;&nbsp;到 
	                <input id="zysj_search_jssj<%=project_id %>" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	            <div class="lbcxtj">
	                <label>记录人：</label>
	                <input id="zysj_search_jlr<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	        </form>
        </fieldset>   
        <div class="toolbar-btn">
			<div class="btn-left">
                <a href="#" id="milestone_add_btn<%=project_id %>" class="mwsmartui-linkbutton" data-options="project_id:'<%=project_id %>',onClick:projectEvent.add"><i class="fa fa-plus"> </i> 添加</a>
                <a href="#" id="milestone_del_btn<%=project_id %>" class="mwsmartui-linkbutton" data-options="disabled:true,project_id:'<%=project_id %>',onClick:projectEvent.delBatch"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="project_id:'<%=project_id %>',onClick:projectEvent.query"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="project_id:'<%=project_id %>',onClick:projectEvent.reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="milestone_list<%=project_id %>" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./ProjectEvent-list.action?project_id=<%=project_id %>',
            scrollbarSize:157,
            project_id:'<%=project_id %>',
            onCheck:projectEvent.click,
            onUncheck:projectEvent.click,
            onCheckAll:projectEvent.click,
  			onUncheckAll:projectEvent.click,
  			onLoadSuccess:projectEvent.click,
			toolbar:'#milestone_list_toolbar<%=project_id %>'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'project_name',width:'25%'"><b>项目名称</b></th>
                    <%--
                    <th data-options="field:'xx01',width:'8%'"><b>类别</b></th>
                     --%>
                    <th data-options="field:'content',width:'15%'"><b>事件说明</b></th>
                    <th data-options="field:'occur_time',width:'15%',formatter:common.fmt_date"><b>发生时间</b></th>
                    <th data-options="field:'record_name',width:'15%'"><b>记录人</b></th>
                    <th data-options="field:'handle_time',width:'15%',formatter:common.fmt_date"><b>记录时间</b></th>
                    <th data-options="field:'handle_result',width:'15%'"><b>处理结果</b></th>
                    <th data-options="field:'status',project_id:'<%=project_id %>',width:'120',formatter:projectEvent.listOpts"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
