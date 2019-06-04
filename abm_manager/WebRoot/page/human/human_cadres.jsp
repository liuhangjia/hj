<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>
<body>
<script language="javascript" type="text/javascript" src="./js/human/humanCadres.js"></script>
<div id="cadres_div" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="cadres_list_toolbar" class="toolbar-div">
    <fieldset>
	    <legend>查询条件</legend>
            <form id="cadres_queryform" method="post" >
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">企业：</label>
                <select id="enterprise_id" name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" 
		                data-options="width:'145px',
		                				height:'30px',
		                				url:'./Employee-listMyEnterprise.action?type=HR_POOL_LIST',
		                				valueField:'id',
		                				textField:'name'">
            	</select>
            </div>   
            
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">姓名：</label>
                <input id="name" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>    
            
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">备选时间从：</label>
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
                    <a href="#" id="cadres_add" class="mwsmartui-linkbutton"  data-options="onClick:humanCadres.cadres_doAdd"><i class="fa fa-plus"> </i> 添加</a>
                    <a href="#" id="cadres_del" class="mwsmartui-linkbutton" data-options="onClick:humanCadres.cadres_doDel"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:humanCadres.cadres_doSearch"><i class="fa fa-search"> </i> 查询</a>
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:humanCadres.cadres_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="cadres_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:30,
			selectOnCheck:true,
			checkOnSelect:false,
			fileOnSelect:true,
			singleSelect:false,
			border:false,
			striped:true,
			fit:true,
			url:'./HrPool-list.action',
			method:'post',
            scrollbarSize:157,
			toolbar:'#cadres_list_toolbar',
			onCheck:humanCadres.togglePlsc,
			onUncheck:humanCadres.togglePlsc,
			onCheckAll:humanCadres.togglePlsc,
			onUncheckAll:humanCadres.togglePlsc,
			onLoadSuccess:humanCadres.togglePlsc">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
               		<th data-options="field:'ename',width:'9%',formatter:function(value,row){if(row['enterpriseModel']){return row['enterpriseModel']['name'];}}"><b>企业</b></th>
                    <th data-options="field:'emp_name',width:'8%'"><b>姓名</b></th>                    
                    <th data-options="field:'depart_name',width:'8%'"><b>当前部门</b></th>                    
                    <th data-options="field:'position',width:'8%'"><b>当前职务</b></th>                    
                    <th data-options="field:'in_time',width:'17%',formatter:common.fmt_date10"><b>备选干部时间</b></th>
                    <th data-options="field:'leader',width:'15%'"><b>主管领导</b></th>
                    <th data-options="field:'bak',width:'35%'"><b>指定说明</b></th>
                    <th data-options="field:'XX',width:'120',formatter:humanCadres.cadres_doHandle"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
