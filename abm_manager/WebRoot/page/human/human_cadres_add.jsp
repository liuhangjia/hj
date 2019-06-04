<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
   <form id="cadres_addform" method="post" >
   			<input id="id" type="hidden" value="" />
   			<div class="lbcxtj" >
                <label>企业名称：</label>
                <select id="qymc" name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" data-options="width:'370px',
                	onSelect:humanCadres.select_qy,
                	height:'30px',required:true,url:'./Employee-listMyEnterprise.action?type=HR_POOL_LIST',valueField:'id',textField:'name'">
                </select>
            </div>
            <div class="lbcxtj">
                <label>姓名：</label>
                <input id="xm" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                <label>部门：</label>
                <input id="human_cadres_depart_name" name="enterpriseEmployee.depart_name" type="hidden" >
                <input id="bm"  name="enterpriseEmployee.depart_id"  class="mwsmartui-combotree" data-options="
    				valueField:'id',
    				textField:'name',
    				onSelect:humanCadres.select_bm,
                	width:'140px',height:'30px',prompt:''">
            </div>
            <%--
            <div class="lbcxtj">
                <label>当前部门：</label>
                <input id="bm" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
             --%>
            <div class="lbcxtj">
                <label>当前职务：</label>
                <input id="zw" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
           
			<div class="lbcxtj">
                <label>备选时间：</label>
                <input id="bxsj" class="mwsmartui-datebox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
           <div class="lbcxtj">
                <label>主管领导：</label>
                <input id="zgld" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj" style="height:180px">
                <label>指定说明：</label>
                <input id="bak" class="mwsmartui-textbox" data-options="width:'370px',height:'180px',prompt:''">
            </div>
            </form>
</body>
</html>
