<%@page import="com.mw.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String id = request.getParameter("id");
	if(StringUtil.isEmpty(id)){
		id = "";
	}
	String emp_id = request.getParameter("emp_id");
%>
<form id="emp_certifacation_modify_form" method="post" >
		<input  name="cer.id" type="hidden" >
		<input  name="cer.emp_id" type="hidden" value="<%=emp_id %> ">
		 <div style="height:10px;" >
        </div>
         <div class="lbcxtj" >
            <label style="width:90px;">发证时间：</label>
            <input  name="cer.publish_time" class="mwsmartui-datebox" data-options="required:true,width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">发证机构：</label>
            <input  name="cer.publisher" class="mwsmartui-textbox" data-options="required:true,width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">证书名称：</label>
            <input  name="cer.name" class="mwsmartui-textbox" data-options="required:true,width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">有效期：</label>
            <input  name="cer.valid" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">证书种类：</label>
            <input  name="cer.type" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
        </div>
</form>
