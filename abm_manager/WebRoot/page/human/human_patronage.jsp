<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
<script language="javascript" type="text/javascript" src="./js/human/humanPatronage.js"></script>
<div id="patronage_div" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="patronage_list_toolbar" class="toolbar-div">
    <fieldset>
	    <legend>查询条件</legend>
            <form id="patronage_queryform" method="post" >
            
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">企业：</label>
                <select id="leave_enterprise_name" name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" 
		                data-options="width:'145px',
		                				height:'30px',
		                				url:'./Employee-listMyEnterprise.action?type=APPOINT_MANAGER_LIST',
		                				valueField:'id',
		                				textField:'name'">
            	</select>
            </div>  
                
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">姓名：</label>
                <input id="name" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
            
            </div>    
           
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">任免时间从：</label>
                <input id="starttime" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>    
           
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">到：</label>
                <input id="endtime" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>    
                
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">批号：</label>
                <input id="sn" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>    
          
            </form>
            </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
                    <a href="#" id="patronage_add" class="mwsmartui-linkbutton" data-options="onClick:humanPatronage.patronage_doAdd"><i class="fa fa-plus"> </i> 添加</a>
                    <a href="#" id="patronage_del" class="mwsmartui-linkbutton" data-options="onClick:humanPatronage.patronage_doDel"><i class="fa fa-trash"> </i> 批量删除</a>
                    <a href="#" id="patronage_imp" class="mwsmartui-linkbutton" data-options="onClick:humanPatronage.patronage_doImport"><i class="fa fa-sign-in"> </i> 批量导入</a>
                    <a href="#" id="patronage_exp" class="mwsmartui-linkbutton" data-options="onClick:humanPatronage.patronage_doExport"><i class="fa fa-sign-out"> </i> 导出</a>
			</div>
			<div class="btn-right">
				<a href="#" id="patronage_search" class="mwsmartui-linkbutton"  data-options="onClick:humanPatronage.patronage_doSearch"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" id="patronage_reset" class="mwsmartui-linkbutton"  data-options="onClick:humanPatronage.patronage_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="patronage_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:30,
			selectOnCheck:true,
			checkOnSelect:false,
			fileOnSelect:true,
			singleSelect:false,
			border:false,
			striped:true,
			fit:true,
			url:'Patronage-list.action',
			method:'post',
            scrollbarSize:157,
			toolbar:'#patronage_list_toolbar',
			onCheck:humanPatronage.togglePlsc,
			onUncheck:humanPatronage.togglePlsc,
			onCheckAll:humanPatronage.togglePlsc,
			onUncheckAll:humanPatronage.togglePlsc,
			onLoadSuccess:humanPatronage.togglePlsc">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
               		<th data-options="field:'ename',width:'10%',formatter:function(value,row){if(row['enterpriseModel']){return row['enterpriseModel']['name'];}}"><b>企业</b></th>
                    <th data-options="field:'name',width:'8%'"><b>姓名</b></th>                   
                    <th data-options="field:'depart_name',width:'11%'"><b>部门</b></th>                    
                    <th data-options="field:'position',width:'13%'"><b>职务</b></th>
                    <th data-options="field:'sn',width:'13%'"><b>任免批号</b></th>
                    <th data-options="field:'appoint_time',width:'16%',formatter:common.fmt_date10"><b>任免时间</b></th>
                    <th data-options="field:'bak',width:'29%'"><b>任免说明</b></th>
                    <th data-options="field:'xx',width:'120',formatter:humanPatronage.patronage_doHandle"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
