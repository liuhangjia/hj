<%@page import="com.mw.common.utils.StringUtil"%>

<%@page import="com.abm.common.model.EnterpriseEmpModel"%>
<%@page import="com.abm.common.utils.Constants"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	EnterpriseEmpModel enterpriseEmp = (EnterpriseEmpModel)session.getAttribute(Constants.ENTERPRISE_EMP);

%>
<form id="hyzx_wdsb_add_form" method="post" >
	<input type="hidden" >
	<%--
    <div class="lbcxtj">
        <label>企业名称：</label>
        <select  id="enterprise_id" class="mwsmartui-combobox" data-options="width:'370px',height:'30px',textField:'name',valueField:'id'">
        </select>
    </div>
    <div class="lbcxtj" >
        <label>申请人：</label>
        <input  id="req_name" class="mwsmartui-textbox" data-options="width:'370px',height:'30px'">
    </div>
	 --%>
	 <%
	 	if(null!=enterpriseEmp && StringUtil.eq(enterpriseEmp.getIs_enterprise_admin(), "1")){
	 %>
	 <div class="lbcxtj">
        <label>项目：</label>
        <select  id="project_id" class="mwsmartui-combobox" data-options="
        	width:'370px',height:'30px',textField:'name',valueField:'id'">
        </select>
    </div>
	  <%
	 	}
	 %>
     <div class="lbcxtj" >
         <label>开始时间：</label>
         <input id="kssj" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'">
     </div>
       <div class="lbcxtj" >
         <label>结束时间：</label>
         <input id="jssj" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'">
     </div>
     <div class="lbcxtj" >
         <label>联系人：</label>
         <input id="lxr" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
     </div>
     <div class="lbcxtj" >
         <label>联系电话：</label>
         <input id="lxdh" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
     </div>
     <div class="lbcxtj" >
        <label>地址：</label>
        <input id="dz" class="mwsmartui-textbox" data-options="width:'370px',height:'30px',required:true">
    </div>
      <div class="lbcxtj" style="height:120px;">
         <label>备注：</label>
         <input id="bak" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true">
     </div>
    <%-- 
    <fieldset>
        <legend>申请应用</legend>
        <div class="lbcxtj checkbox" style="clear:both;">
				        <label style="width:80px; text-align:right;" >申请应用：</label>
				              <label>
				                <input type="checkbox" name="CheckboxGroup1" value="111" id="CheckboxGroup1_0" checked="checked" />
				                服务请求-服务请求</label>
				             
				              <label>
				                <input type="checkbox" name="CheckboxGroup1_1" value="1222" id="CheckboxGroup1_1" checked="checked" />
				                用户管理</label>
				                <label>
				                <input type="checkbox" name="CheckboxGroup1_2" value="1222" id="CheckboxGroup1_2" checked="checked" />
				                项目管理</label>
				                <label>
				                <input type="checkbox" name="CheckboxGroup1_3" value="1222" id="CheckboxGroup1_3" checked="checked" />
				                人力服务</label>
				       </div>  
    </fieldset>		
     --%>
</form>


