<%@page import="com.mw.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String id = request.getParameter("id");
	if(StringUtil.isEmpty(id)){
		id = "";
	}
	String emp_id = request.getParameter("emp_id");
%>
<form id="emp_award_modify_form" method="post" >
		<input  name="award.id" type="hidden" >
		<input  name="award.emp_id" type="hidden" value="<%=emp_id %> ">
		 <div style="height:10px;" >
        </div>
         <div class="lbcxtj" >
            <label style="width:90px;">获得时间：</label>
            <input  name="award.pulish_time" class="mwsmartui-datebox" data-options="required:true,width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">获奖名称：</label>
            <input  name="award.name" class="mwsmartui-textbox" data-options="required:true,width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">颁奖单位：</label>
            <input  name="award.pulisher" class="mwsmartui-textbox" data-options="required:true,width:'140px',height:'30px'">
        </div>
        <div class="lbcxtj" >
            <label style="width:90px;">证明人：</label>
            <input  name="award.owner" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
        </div>
</form>
	