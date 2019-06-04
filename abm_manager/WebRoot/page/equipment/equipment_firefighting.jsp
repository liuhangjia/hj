<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	<link rel="stylesheet" type="text/css" href="./css/mwsmartui.css">
	<link rel="stylesheet" type="text/css" href="./css/color.css">
	<link rel="stylesheet" type="text/css" href="./css/indexlb.css">
	<script type="text/javascript" src="./js/jquery.min.js"></script>
	<script type="text/javascript" src="./js/jquery.mwsmartui.min.js"></script>
	<script type="text/javascript" src="./js/mwsmartui-lang-zh_CN.js"></script>
	<script type="text/javascript" src="./js/MingwenJSON.js"></script>
	<script type="text/javascript" src="kindeditor/kindeditor.js"></script>
	<script type="text/javascript" src="kindeditor/lang/zh_CN.js"></script>
	<script type="text/javascript" src="kindeditor/plugins/code/prettify.js"></script>
	<script language="javascript" type="text/javascript" src="./js/mw_js/result.js"></script>
</head>

<body>
<div id="firefighting_content" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="firefighting_list_toolbar" class="toolbar-div">
            <form id="firefighting_queryform" method="post" >
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
             <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:firefighting_doAdd"><i class="fa fa-plus"> </i> 添加</a>
             <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:firefighting_doImport"><i class="fa fa-sign-in"> </i> 导入</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:firefighting_doSearch"><i class="fa fa-search"> </i> 查询</a>
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:firefighting_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="firefighting_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			singleSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'get',
            scrollbarSize:217,
			toolbar:'#firefighting_list_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
                    <th data-options="field:'tel',width:'25%'"><b>项目名称</b></th>
                    <th data-options="field:'zgh',width:'8%'"><b>类别</b></th>
                    <th data-options="field:'name',width:'15%'"><b>装备种类</b></th>
                    <th data-options="field:'zgxm',width:'12%'"><b>开始时间</b></th>
                    <th data-options="field:'zgxj',width:'12%'"><b>结束时间</b></th>
                    <th data-options="field:'job',width:'8%'"><b>负责人</b></th>
                    <th data-options="field:'dxzt',width:'20%'"><b>备注</b></th>
                    <th data-options="field:'status',width:'180',formatter:firefighting_doHandle"><b>操作</b></th>
                   
                    
                </tr>
            </thead>
            <tbody>
            	<tr>
                	<td></td>
                	<td>某某企业厂区监控</td>
                	<td>监控</td>
                	<td>某某企业厂区</td>
                	<td>2018-09-22 00:00:00</td>
                    <td>2018-09-22 01:00:00</td>
                    <td>牟义星</td>
                    <td>一切正常</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
  </div>
</body>
</html>
