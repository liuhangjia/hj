<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
   <form id="patronage_addform" method="post" >
   
   			<input id="id" type="hidden" value="" />
   			<div class="lbcxtj" >
                <label>企业名称：</label>
                <select id="qymc" name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" data-options="width:'370px',
	                onSelect:humanPatronage.select_qy,
	                height:'30px',required:true,url:'./Employee-listMyEnterprise.action?type=APPOINT_MANAGER_ADD',valueField:'id',textField:'name'">
                </select>
            
            </div>
            <div class="lbcxtj">
                <label>姓名：</label>
                <input id="xm" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>部门：</label>
                <input id="enterpriseEmployee_depart_name" name="enterpriseEmployee.depart_name" type="hidden" />
                <input id="bm"  name="enterpriseEmployee.depart_id"  class="mwsmartui-combotree" data-options="
    				valueField:'id',
    				textField:'name',
    				onSelect:humanPatronage.select_bm,
                	width:'140px',height:'30px',prompt:''"/>
            </div>
            <%--
            <div class="lbcxtj">
                <label>部门：</label>
                <input id="bm" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
             --%>
            <div class="lbcxtj">
                <label>职务：</label>
                <input id="zw" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>任免批号：</label>
                <input id="rmph" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div><div class="lbcxtj">
                <label>任免时间：</label>
                <input id="sj" class="mwsmartui-datebox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj" style="height:80px">
                <label>任免说明：</label>
                <input id="bak" class="mwsmartui-textbox" data-options="width:'370px',height:'80px',prompt:''"/>
            </div>
            </form>
</body>
</html>
