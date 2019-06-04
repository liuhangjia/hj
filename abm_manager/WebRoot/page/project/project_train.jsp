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
<script type="text/javascript" src="./js/project/projectTrain.js"></script>
<div  class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="train_list_toolbar<%=project_id %>" class="toolbar-div">
   		<fieldset>
			<legend>查询条件</legend>
            <form id="train_queryform<%=project_id %>" method="post" >
            <div class="lbcxtj">
                <label>项目名称：</label>
                <input id="xmpx_search_xmmc<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>培训类型：</label>
                <input id="xmpx_search_pxlx<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>开始时间：</label>
                <input id="xmpx_search_kssj<%=project_id %>" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>结束时间：</label>
                <input id="xmpx_search_jssj<%=project_id %>" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>培训讲师：</label>
                <input id="xmpx_search_pxjs<%=project_id %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>            
          
            </form>
        </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
                <a href="#" id="project_train_del_btn<%=project_id %>" class="mwsmartui-linkbutton" data-options="project_id:'<%=project_id %>',onClick:projectTrain.delBatch"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="project_id:'<%=project_id %>',onClick:projectTrain.query"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="project_id:'<%=project_id %>',onClick:projectTrain.reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="train_list<%=project_id %>" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./ProjectTraining-list.action?project_id=<%=project_id %>',
            scrollbarSize:217,
            project_id:'<%=project_id %>',
            onCheck:projectTrain.click,
            onUncheck:projectTrain.click,
            onCheckAll:projectTrain.click,
  			onUncheckAll:projectTrain.click,
  			onLoadSuccess:projectTrain.click,
			toolbar:'#train_list_toolbar<%=project_id %>'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'project_name',width:'25%'"><b>项目名称</b></th>
                    <%--
                    <th data-options="field:'zgh',width:'8%'"><b>项目类别</b></th>
                     --%>
                    <th data-options="field:'type',width:'15%'"><b>培训类型</b></th>
                    <th data-options="field:'start_time',width:'15%',formatter:common.fmt_date10"><b>开始时间</b></th>
                    <th data-options="field:'end_time',width:'15%',formatter:common.fmt_date10"><b>结束时间</b></th>
                    <th data-options="field:'teacher',width:'10%'"><b>培训讲师</b></th>
                    <th data-options="field:'bak',width:'20%'"><b>培训情况</b></th>
                    <th data-options="field:'status',project_id:'<%=project_id %>',width:'180',formatter:projectTrain.listOpts"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
