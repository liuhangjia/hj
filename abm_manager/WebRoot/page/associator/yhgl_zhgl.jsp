<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="yhgl_zhgl_list_toolbar"class="toolbar-div">
    	<fieldset>
			<legend>查询条件</legend>
	            <form id="yhgl_zhgl_queryform" method="post" >
		            <div class="lbcxtj">
		                <label style="display:inline-block; width:100px; text-align:right;">账号：</label>
		                <input id="yhgl_zhgl_search_account" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
		            
		            </div>
		            <div class="lbcxtj">
			            <label style="display:inline-block; width:100px; text-align:right;">姓名：</label>
			            <input id="yhgl_zhgl_search_name" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
		            </div>
		            <div class="lbcxtj">
		                <label>企业：</label>
		                <input id="yhgl_zhgl_search_enterprise" class="mwsmartui-combobox" data-options="
		                url:'./Enterprise-listForPriv.action?priv=USER_ACCOUNT_MANAGER_LIST',
		                valueField:'id',
		                textField:'name',
		                onSelect:yhgl_zhgl_select_qy,
		                width:'145px',height:'30px',prompt:''"/>
		            </div>
		            <div class="lbcxtj">
		                <label>部门：</label>
		                <input id="yhgl_zhgl_depart_id" class="mwsmartui-combotree" data-options="
		                valueField:'id',
		                textField:'name',
		                width:'145px',height:'30px',prompt:''"/>
		            </div>
	            </form>
            </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
                <a href="#" id="yhgl_zhgl_zj_btn" class="mwsmartui-linkbutton" data-options="onClick:yhgl_zhgl_add"><i class="fa fa-plus"> </i> 添加</a>
                <a href="#" id="yhgl_zhgl_plsc_btn" class="mwsmartui-linkbutton" data-options="disabled:true,onClick:yhgl_zhgl_plsc"><i class="fa fa-trash"> </i> 批量删除</a>
<!--                 <a href="#" id="yhgl_zhgl_import_btn" class="mwsmartui-linkbutton" data-options="onClick:yhgl_zhgl_import" ><i class="fa fa-sign-in"> </i> 批量导入</a> -->
			</div>
			<div class="btn-right">
                <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:yhgl_zhgl_search"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:yhgl_zhgl_reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="yhgl_zhgl_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./Employee-list.action?type=USER_ACCOUNT_MANAGER_LIST',
            scrollbarSize:247,
			toolbar:'#yhgl_zhgl_list_toolbar',
			onCheck:yhgl_zhgl_togglePlsc,onUncheck:yhgl_zhgl_togglePlsc,onCheckAll:yhgl_zhgl_togglePlsc,
    	onUncheckAll:yhgl_zhgl_togglePlsc,onLoadSuccess:yhgl_zhgl_togglePlsc">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
                    <th data-options="field:'gh1',width:'20%',formatter:function(value,row){return row['enterpriseModel']['name'];}"><b>企业</b></th>
                    <th data-options="field:'gh2',width:'12%',formatter:function(value,row){return row['employeeModel']['account']&&row['employeeModel']['account']['account'];}"><b>账号</b></th>
                    <th data-options="field:'xm',width:'12%',formatter:function(value,row){return row['employeeModel']['name'];}"><b>姓名</b></th>
                    <th data-options="field:'gh3',width:'10%',formatter:function(value,row){return row['employeeModel']['phone'];}"><b>手机</b></th>
                    <th data-options="field:'xb',width:'12%',formatter:function(value,row){return common.codeToName('XB',row['employeeModel']['sex']);}"><b>性别</b></th>
                    <th data-options="field:'depart_name',width:'12%'"><b>部门</b></th>
                    <th data-options="field:'position',width:'12%'"><b>职务</b></th>
                    <th data-options="field:'type',width:'10%',align:'center',formatter:function(value,row,index){return common.codeToName('RYLB',row['employeeModel']['type']);}"><b>人员类别</b></th>
                    <th data-options="field:'status',width:'210',formatter:yhgl_zhgl_doHandle"><b>操作</b></th>
                </tr>
            </thead>
            
        </table>
  </div>
