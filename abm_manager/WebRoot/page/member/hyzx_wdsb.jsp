<%@page import="com.abm.common.dao.EnterpriseEmpDao"%>
<%@page import="com.abm.common.model.EnterpriseEmpModel"%>
<%@page import="java.util.List"%>
<%@page import="com.abm.common.model.EmployeeModel"%>
<%@page import="com.abm.common.utils.Constants"%>
<%@page import="com.abm.common.model.AccountsModel"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	AccountsModel user = (AccountsModel)session.getAttribute(Constants.USER);
	EmployeeModel employee = user.getEmployee();
	String enterprise_id="";
	if(null!=employee){
		List<EnterpriseEmpModel> enterpriseManagers = EnterpriseEmpDao.getSingle().executeQuery(" and status = '1' and is_enterprise_admin = '1' and emp_id = ?",new String[]{employee.getId()});
		if(null != enterpriseManagers && !enterpriseManagers.isEmpty()){
			EnterpriseEmpModel enterpriseManager = enterpriseManagers.get(0);
			
		}
	}
%>
<script type="text/javascript" src="./js/hyzx_wdsb.js"></script>
<div  style=" width:100%; height:100%;">
<div class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="hyzx_wdsb_list_toolbar" class="toolbar-div" style="">
        <div class="toolbar-btn">
			<div class="btn-left">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:hyzx_wdsb_apply"><i class="fa fa-plus"> </i> 申请</a>
			</div>
		</div>
    </div>
       <table id="hyzx_wdsb_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			singleSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./ServiceRequest-listMyEquipApply.action',
            scrollbarSize:157,
			toolbar:'#hyzx_wdsb_list_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
                    <th data-options="field:'req_name',width:'9%'"><b>申请人</b></th>
                    <th data-options="field:'status',width:'9%',formatter:hyzx_wdsb_formatStatus"><b>当前状态</b></th>
                    <th data-options="field:'req_time',width:'11%',formatter:function(value){return common.fmt_date(value);}"><b>申请时间</b></th>
                    <th data-options="field:'req_detail',width:'9%',formatter:function(value){return value.lxr;}"><b>联系人</b></th>
                    <th data-options="field:'req_detail1',width:'13%',formatter:function(value,row){return row.req_detail.dz;}"><b>联系地址</b></th>
                    <th data-options="field:'phone',width:'11%'"><b>联系电话</b></th>
                    <th data-options="field:'handle_name',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'handle_time',width:'10%',formatter:function(value){return common.fmt_date(value);}"><b>审核时间</b></th>
                    <th data-options="field:'handle_result',width:'18%'"><b>审核意见</b></th>
                    <th data-options="field:'handle',width:'120',formatter:hyzx_wdsb_doHandle"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div></div>

