<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String lb = request.getParameter("lb");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
<div class="mwsmartui-layout" data-options="border:false,fit:true">
	<div data-options="region:'center',border:true">
		<div id="user_intention_content<%=lb %>" class="mwsmartui-panel" data-options="border:false,fit:true">
		    <div id="user_intention_list_toolbar<%=lb %>" class="toolbar-div">
		    <fieldset>
			    <legend>查询条件</legend>       
		           <form id="user_intention_queryform<%=lb %>" method="post" >
		           <div class="lbcxtj">
		                <label style="display:inline-block; width:100px; text-align:right;">企业名称：</label>
		                <input id="user_intention_search_qymc_<%=lb %>"  class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
		            </div>
		           <div class="lbcxtj">
		                <label style="display:inline-block; width:100px; text-align:right;">名称：</label>
		                <input id="user_intention_search_mc_<%=lb %>"  class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
		            </div>
		            <div class="lbcxtj">
		                <label style="display:inline-block; width:100px; text-align:right;">厂商：</label>
		                <input id="user_intention_search_cs_<%=lb %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
		            </div>
		            <div class="lbcxtj">
		                <label style="display:inline-block; width:100px; text-align:right;">型号：</label>
		                <input id="user_intention_search_xh_<%=lb %>" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
		            </div>
		            <div class="lbcxtj">
		                <label style="display:inline-block; width:100px; text-align:right;">数量范围：</label>
		                <input id="user_intention_search_num_min_<%=lb %>" class="mwsmartui-numberbox" data-options="width:'145px',height:'30px',prompt:''">
		                ~
		                <input id="user_intention_search_num_max_<%=lb %>" class="mwsmartui-numberbox" data-options="width:'145px',height:'30px',prompt:''">
		            </div>
		           
		            </form>
		            </fieldset>
		        <div class="toolbar-btn">
		        	<%--
					<div class="btn-left">
		             <a href="#" class="mwsmartui-linkbutton" id="equip_del" data-options="onClick:equip.delBatch,lb:'<%=lb %>'"><i class="fa fa-trash"> </i> 批量删除</a>
					</div>
					<div class="btn-right">
						<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:equip.query,lb:'<%=lb %>'"><i class="fa fa-search"> </i> 查询</a>
		                <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:equip.reset,lb:'<%=lb %>'" ><i class="fa fa-refresh"> </i> 重置</a>
					</div>
		        	 --%>
				</div>
		    </div>
		       <table id="user_intention_list<%=lb %>" class="mwsmartui-datagrid" data-options="
		            pagination:true,
					pageSize:20,
					selectOnCheck:true,
					fileOnSelect:true,
					border:false,
					striped:true,
					fit:true,
					method:'post',
					lb:'<%=lb %>',
					url:'./ServiceRequest-listForUserIntention.action?type=<%=lb %>',
		            scrollbarSize:217,
					toolbar:'#user_intention_list_toolbar<%=lb %>' 
					">
		            <thead>
		                <tr>
		               		<th data-options="field:'id',checkbox:true">ID</th>
		                    <th data-options="field:'sn',width:'20%'"><b>编号</b></th>
		                    <th data-options="field:'xxx02',width:'25%',formatter:function(value,row){if(row['req_detail']&&row['req_detail']['phone']){return row['req_detail']['phone'];}else{return '';}}"><b>联系电话</b></th>
		                    <th data-options="field:'xxx03',width:'25%',formatter:function(value,row){if(row['req_detail']&&row['req_detail']['email']){return row['req_detail']['email'];}else{return '';}}"><b>联系email</b></th>
		                    <th data-options="field:'xxx04',width:'30%',formatter:function(value,row){if(row['req_detail']&&row['req_detail']['msg_time']){return row['req_detail']['msg_time'];}else{return '';}}"><b>留言时间</b></th>
		                    <th data-options="field:'sn',width:'20%'"><b>状态</b></th>
		                    <th data-options="field:'sn',width:'20%'"><b>沟通人</b></th>
		                    <th data-options="field:'sn',width:'20%'"><b>沟通时间</b></th>
		                    <th data-options="field:'xxx01',width:180,formatter:pending_doHandle"><b>操作</b></th>
		                </tr>
		            </thead>
		        </table>
		  </div>
	</div>
	<%--
	<div data-options="region:'east',border:true,width:'50%',split:true">
	</div>
	 --%>
</div>

</body>
</html>
