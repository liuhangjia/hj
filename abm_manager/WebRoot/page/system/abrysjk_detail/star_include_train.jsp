<%@page import="com.mw.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String id = request.getParameter("id");
	if(StringUtil.isEmpty(id)){
		id = "";
	}
	String emp_id = request.getParameter("emp_id");
%>
<form id="emp_training_modify_form" method="post" >
		<input  name="train.id" type="hidden" >
		<input  name="train.emp_id" type="hidden" value="<%=emp_id %> ">
		 <div style="height:10px;" >
        </div>
         <div class="lbcxtj" >
            <label style="width:90px;">起始时间：</label>
            <input  name="train.start_time" class="mwsmartui-datebox" data-options="required:true,width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">截止时间：</label>
            <input  name="train.end_time" class="mwsmartui-datebox" data-options="required:true,width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">培训机构：</label>
            <input  name="train.name" class="mwsmartui-textbox" data-options="required:true,width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">证明人：</label>
            <input  name="train.owner" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">培训内容：</label>
            <input  name="train.content" class="mwsmartui-textbox" data-options="required:true,width:'380px',height:'120px',multiline:true">
        </div>
        
</form>
