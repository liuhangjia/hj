<%@page import="com.abm.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<body>
	<form id="user_intention_detail_form" method="post" >
         <div class="lbcxtj" >
             <label >意向目标：</label><%-- style="width:90px;" --%>
             <%--
         	<select name="type"  class="mwsmartui-combobox"  data-options="disabled:true,
         																data:common.listCodesByType('FWQQLB'),
               															valueField:'code',
               															textField:'name',
         																	width:'370px',height:'30px'" >
             
             </select>
              --%>
              <div style="width: 370px;height: 30px">
              	<span id="user_intention_type"></span>
              </div>
         </div>
         
         <div class="lbcxtj">
             <label>联系电话：</label>
             <div style="width: 250px;height: 30px">
             	<span id="user_intention_phone"></span>
             </div>
         </div>
         <div class="lbcxtj">
             <label>联系邮箱：</label>
             <div style="width: 250px;height: 30px">
             	<span id="user_intention_email"></span>
             </div>
         </div>
         <div class="lbcxtj" style="height: auto;">
             <label>意向详情：</label>
             <div style="width: 370px;height: auto;margin-left:85px;">
             	<span id="user_intention_content"></span>
             </div>
         </div>
         <div class="lbcxtj">
             <label>调查情况：</label>
             <input id="user_intention_back_content" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true">
         </div>
         <%--
         <div class="lbcxtj">
             <label>联系电话：</label>
             <input name="phone" id="user_intention_phone"   class="mwsmartui-textbox" data-options="disabled:true,width:'370px',height:'30px'">
         </div>
         <div class="lbcxtj">
             <label>联系邮箱：</label>
             <input name="email" id="user_intention_email"   class="mwsmartui-textbox" data-options="disabled:true,width:'370px',height:'30px'">
         </div>
         <div class="lbcxtj">
             <label>意向详情：</label>
             <input name="content" id="user_intention_content"   class="mwsmartui-textbox" data-options="disabled:true,width:'370px',height:'120px',multiline:true">
         </div>
          --%>
     </form>	     
</body>
</html>
