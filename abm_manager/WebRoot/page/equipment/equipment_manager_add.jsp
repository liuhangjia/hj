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
   <form id="equip_modify_form" method="post" >
   			<input  name="equip.id" type="hidden"  />
   			<input  name="equip.type" type="hidden" value="<%=lb %>" />
            <div class="lbcxtj" id="equip_modify_enterprise_div">
                <label>企业名称：</label>
                <select name="equip.enterprise_id" class="mwsmartui-combobox" data-options="
                	width:'370px',
                	height:'30px',
                	required:true,
                	url:'./Employee-listMyEnterprise.action?type=EQUIP_MANAGER_ADD',
                	valueField:'id',
                	textField:'name'">
                </select>
            </div>
            <%--
            <div class="lbcxtj">
                 <label>类别：</label>
                <select name="equip.type"  class="mwsmartui-combobox"  data-options="width:'140px',height:'30px'" >
                <option value="0">监控</option>
                <option value="1">门闸</option>
                </select>
            </div>
             --%>
             
            <div class="lbcxtj">
                <label>装备种类：</label>
            	<select name="equip.category"  class="mwsmartui-combobox"  data-options="data:common.listCodesByType('ZBZL'),
	                 																					valueField:'code',
	                 																					textField:'name',
	                 																					width:'140px',height:'30px'" >
	             </select>
            </div>
            <div class="lbcxtj">
                <label>编号：</label>
                <input name="equip.sn" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
           <div class="lbcxtj">
                <label>装备名称：</label>
                <input name="equip.name" class="mwsmartui-textbox" data-options="required:true,width:'140px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                <label>装备厂商：</label>
                <input name="equip.factory" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                <label>装备型号：</label>
                <input name="equip.model" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                <label>计量单位：</label>
                <input name="equip.unit" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                <label>数量：</label>
                <input name="equip.quantity" class="mwsmartui-textbox" data-options="required:true,width:'140px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj" >
                <label>备注：</label>
                <input name="equip.bak" class="mwsmartui-textbox" data-options="width:'370px',height:'80px',prompt:''">
            </div>
            </form>
</body>
</html>
