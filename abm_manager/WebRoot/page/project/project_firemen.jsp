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
<script type="text/javascript" src="./js/project/projectPatrol.js"></script>
<div  class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="firemen_list_toolbar<%=project_id %>" class="toolbar-div">
   		<fieldset>
			<legend>查询条件</legend>
            <form id="patrol_queryform1<%=project_id %>" method="post" >
	            <div class="lbcxtj">
	                <label>项目名称：</label>
	                <input id="patrol_search_xmmc1<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	            <div class="lbcxtj">
	                <label>开始时间：</label>
	                <input id="patrol_search_kssj1<%=project_id %>" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	            <div class="lbcxtj">
	                <label>结束时间：</label>
	                <input id="patrol_search_jssj1<%=project_id %>" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	            <div class="lbcxtj">
	                <label>巡检区域：</label>
	                <input id="patrol_search_xjqy1<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
	            <div class="lbcxtj">
	                <label>记录人：</label>
	                <input id="patrol_search_jlr1<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>             
            </form>
        </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
                <a href="#" id="firemen_del_btn<%=project_id %>" class="mwsmartui-linkbutton" data-options="xjlb:'1',project_id:'<%=project_id %>',onClick:projectPatrol.delBatch"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="xjlb:'1',project_id:'<%=project_id %>',onClick:projectPatrol.query"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="xjlb:'1',project_id:'<%=project_id %>',onClick:projectPatrol.reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="firemen_list<%=project_id %>" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./ProjectPatrol-list.action?type=1&project_id=<%=project_id %>',
            scrollbarSize:157,
            project_id:'<%=project_id %>',
            onCheck:projectPatrol.click_1,
            onUncheck:projectPatrol.click_1,
            onCheckAll:projectPatrol.click_1,
  			onUncheckAll:projectPatrol.click_1,
  			onLoadSuccess:projectPatrol.click_1,
			toolbar:'#firemen_list_toolbar<%=project_id %>'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'project_name',width:'25%'"><b>项目名称</b></th>
                    <%--
                    <th data-options="field:'zgh',width:'8%'"><b>类别</b></th>
                     --%>
                    <th data-options="field:'area',width:'15%'"><b>巡检区域</b></th>
                    <th data-options="field:'staet_time',width:'15%',formatter:common.fmt_date"><b>开始时间</b></th>
                    <th data-options="field:'end_time',width:'15%',formatter:common.fmt_date"><b>结束时间</b></th>
                    <th data-options="field:'record_name',width:'10%'"><b>记录人</b></th>
                    <th data-options="field:'description',width:'20%'"><b>巡检情况</b></th>
                    <th data-options="field:'status',xjlb:'1',project_id:'<%=project_id %>',width:'120',formatter:projectPatrol.listOpts"><b>操作</b></th>
                </tr>
            </thead>
            
        </table>
  </div>
</body>
</html>
