<%@page import="com.mw.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String id = request.getParameter("id");
	if(StringUtil.isEmpty(id)){
		id = "";
	}
	String emp_id = request.getParameter("emp_id");
%>
<form id="emp_work_modify_form" method="post" >
		<input  name="work.id" type="hidden" >
		<input  name="work.emp_id" type="hidden" value="<%=emp_id %> ">
		 <div style="height:10px;" >
        </div>
         <div class="lbcxtj" >
            <label style="width:90px;">起始时间：</label>
            <input  name="work.start_time" class="mwsmartui-datebox" data-options="required:true,width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">截止时间：</label>
            <input  name="work.end_time" class="mwsmartui-datebox" data-options="required:true,width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">工作单位：</label>
            <input  name="work.name" class="mwsmartui-textbox" data-options="required:true,width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">职务：</label>
            <input  name="work.position" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">证明人：</label>
            <input  name="work.owner" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
        </div>
</form>
