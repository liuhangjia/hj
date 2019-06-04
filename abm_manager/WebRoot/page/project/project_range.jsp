<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
<script type="text/javascript" src="./js/project/projectRange.js"></script>
<div  class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="range_toolbar" class="toolbar-div">
   		<fieldset>
			<legend>查询条件</legend>
            <form id="range_queryform" method="post" >
	            <div class="lbcxtj">
	                <label>项目名称：</label>
	                <input id="range_project_name" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	            </div>
            </form>
        </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
				<a id="range_add" href="#" class="mwsmartui-linkbutton" data-options="onClick:projectRange.add"><i class="fa fa-plus"> </i> 添加</a>
                <a id="range_del" href="#" class="mwsmartui-linkbutton" data-options="onClick:projectRange.del"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:projectRange.query"><i class="fa fa-search">  </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:projectRange.reset"><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="range_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			checkOnSelect:false,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./ProjectShift-queryByPage.action',
            scrollbarSize:157,
            onCheck:projectRange.click,
            onUncheck:projectRange.click,
            onCheckAll:projectRange.click,
  			onUncheckAll:projectRange.click,
  			onLoadSuccess:projectRange.click,
			toolbar:'#range_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'projectModel',width:'19%',formatter:function(value){return value['name']}"><b>项目名称</b></th>
                    <th data-options="field:'name',width:'9%'"><b>班次名称</b></th>
                    <th data-options="field:'shift_starttime',width:'9%'"><b>开始时间</b></th>
                    <th data-options="field:'start',width:'14%',formatter:projectRange.starts"><b>上班考勤时段</b></th>
                    <th data-options="field:'shift_endtime',width:'9%'"><b>结束时间</b></th>
                    <th data-options="field:'end',width:'14%',formatter:projectRange.ends"><b>下班考勤时段</b></th>
                    <th data-options="field:'num',width:'7%'"><b>班次人数</b></th>
                    <th data-options="field:'shift_range',width:'7%'"><b>班次次序</b></th>
                    <th data-options="field:'bak',width:'12%'"><b>备注</b></th>
                    <th data-options="field:'status',width:'120',formatter:projectRange.listOpts"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
