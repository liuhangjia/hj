<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
 <form  method="post" >
 <input type="hidden" name="enterpriseEmployee.id"/>
              <div class="lbcxtj" >
                <label>企业名称：</label>
                <select name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" data-options="width:'370px',
	                onSelect:yhgl_zhgl_select_qy,
	                height:'30px',required:true,url:'./Employee-listMyEnterprise.action?type=USER_ACCOUNT_MANAGER_ADD',valueField:'id',textField:'name'">
                </select>
            
            </div>
             <div class="lbcxtj" >
                <label>账号：</label>
                <input name="account" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            
            </div>
            <div class="lbcxtj" >
                <label>密码：</label>
                <input name="passwd" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',type:'password'">
            
            </div>
              <div class="lbcxtj" >
                <label>姓名：</label>
                <input name="employee.name" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            
            </div>
            <div class="lbcxtj" >
                <label>手机：</label>
                <input name="employee.phone" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            
            </div>
            <div class="lbcxtj" >
                <label>性别：</label>
               <select name="employee.sex" class="mwsmartui-combobox" name="language" data-options="width:'140px',height:'30px',valueField:'code',textField:'name'" >
                </select>
            </div>
            <div class="lbcxtj">
                <label>部门：</label>
                <input id="yhgl_zhgl_depart_name" name="enterpriseEmployee.depart_name" type="hidden" >
                <input id="yhgl_zhgl_depart_id"  name="enterpriseEmployee.depart_id"  class="mwsmartui-combotree" data-options="
    				valueField:'id',
    				textField:'name',
    				onSelect:yhgl_zhgl_select_bm,
                	width:'140px',height:'30px',prompt:''">
            </div>
            <%--
               <div class="lbcxtj" >
                <label>部门：</label>
                <input name="enterpriseEmployee.depart_name" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            
            </div>
             --%>
             <div class="lbcxtj" >
                <label>职务：</label>
                <input name="enterpriseEmployee.position" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            
            </div>
             
             <div class="lbcxtj" style="height:120px;">
                <label>备注：</label>
                <input name="enterpriseEmployee.bak" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true">
            
            </div>
           
            </form>

