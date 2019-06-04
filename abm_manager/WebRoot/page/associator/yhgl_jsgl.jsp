<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div  class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="yhgl_jsgl_list_toolbar"class="toolbar-div" style="">
    	<fieldset>
			<legend>查询条件</legend>
            <form id="yhgl_jsgl_queryform" method="post" >
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">名称：</label>
                <input id="yhgl_jsgl_search_mc" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">企业名称：</label>
                <input id="yhgl_jsgl_search_qymc" class="mwsmartui-combobox" data-options="
                url:'./Enterprise-listForPriv.action?priv=USER_ROLE_MANAGER_LIST',
                valueField:'name',
                textField:'name',
                width:'145px',height:'30px',prompt:''"/>
            </div>
             </form>
        </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
              <a href="#" id="yhgl_jsgl_zj_btn" class="mwsmartui-linkbutton" data-options="onClick:yhgl_jsgl_doAdd"><i class="fa fa-plus"> </i> 添加</a>
              <a href="#" id="yhgl_jsgl_plsc_btn" class="mwsmartui-linkbutton" data-options="onClick:yhgl_jsgl_plsc"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:yhgl_jsgl_search"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:yhgl_jsgl_reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="yhgl_jsgl_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./Role-listByPriv.action',
            scrollbarSize:217,
			toolbar:'#yhgl_jsgl_list_toolbar',
			onCheck:yhgl_jsgl_togglePlsc,onUncheck:yhgl_jsgl_togglePlsc,onCheckAll:yhgl_jsgl_togglePlsc,
    	onUncheckAll:yhgl_jsgl_togglePlsc,onLoadSuccess:yhgl_jsgl_togglePlsc">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
                    <th data-options="field:'name',width:'20%'"><b>名称</b></th>
                    <th data-options="field:'enterpriseModel',width:'30%',formatter:yhgl_jsgl_fmtEname"><b>企业名称</b></th>
                    <th data-options="field:'bak',width:'50%'"><b>备注</b></th>
                    <th data-options="field:'status',width:'180',formatter:yhgl_jsgl_doHandle"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
