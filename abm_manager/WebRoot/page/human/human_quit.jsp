<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
<script language="javascript" type="text/javascript" src="./js/human/humanQuit.js"></script>
<div id="quit_div" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="quit_list_toolbar" class="toolbar-div">
    <fieldset>
	    <legend>查询条件</legend>
            <form id="quit_queryform" method="post" >
            
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">企业：</label>
                <select id="enterprise_id" name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" 
		                data-options="width:'145px',
		                				height:'30px',
		                				url:'./Employee-listMyEnterprise.action?type=DISMISS_MANAGER_LIST',
		                				valueField:'id',
		                				textField:'name'">
            	</select>
            </div>   
            
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">姓名：</label>
                <input id="name" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>    
            
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">离职时间从：</label>
                <input id="start" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>    
           
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">到：</label>
                <input id="end" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>    
          
            </form>
            </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
                    <a href="#" id="quit_add" class="mwsmartui-linkbutton"  data-options="onClick:humanQuit.quit_doAdd"><i class="fa fa-plus"> </i> 添加</a>
                    <a href="#" id="quit_del" class="mwsmartui-linkbutton" data-options="onClick:humanQuit.quit_doDel"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" id="quit_search" class="mwsmartui-linkbutton"  data-options="onClick:humanQuit.quit_doSearch"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" id="quit_reset" class="mwsmartui-linkbutton"  data-options="onClick:humanQuit.quit_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="quit_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:30,
			selectOnCheck:true,
			checkOnSelect:false,
			fileOnSelect:true,
			singleSelect:false,
			border:false,
			striped:true,
			fit:true,
			url:'./Dismiss-list.action',
			method:'post',
            scrollbarSize:157,
			toolbar:'#quit_list_toolbar',
			onCheck:humanQuit.togglePlsc,
			onUncheck:humanQuit.togglePlsc,
			onCheckAll:humanQuit.togglePlsc,
			onUncheckAll:humanQuit.togglePlsc,
			onLoadSuccess:humanQuit.togglePlsc">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
               		<th data-options="field:'ename',width:'9%',formatter:function(value,row){if(row['enterpriseModel']){return row['enterpriseModel']['name'];}}"><b>企业</b></th>
                    <th data-options="field:'name',width:'8%'"><b>姓名</b></th>                    
                    <th data-options="field:'depart_name',width:'8%'"><b>部门</b></th>                    
                    <th data-options="field:'position',width:'8%'"><b>职务</b></th> 
                    <th data-options="field:'phone',width:'7%'"><b>联系电话</b></th>
                    <th data-options="field:'req_time',width:'7%',formatter:common.fmt_date10"><b>申请时间</b></th>
                    <th data-options="field:'hand_over',width:'7%'"><b>工作交接</b></th> 
                    <th data-options="field:'equip_return',width:'7%'"><b>设备归还</b></th>
                    <th data-options="field:'owe_return',width:'7%'"><b>欠款归还</b></th>
                    <th data-options="field:'pay',width:'7%'"><b>工资支付</b></th>
                    <th data-options="field:'dismiss_time',width:'7%',formatter:common.fmt_date10"><b>离职时间</b></th>
                    <th data-options="field:'reason',width:'9%'"><b>离职原因</b></th>
                    <th data-options="field:'evaluation',width:'9%'"><b>离职评价</b></th>
                    <th data-options="field:'xx',width:'120',formatter:humanQuit.quit_doHandle"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
