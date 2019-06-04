<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<form method="post" >
	<input type="hidden" name="sr.req_detail">
    <div class="lbcxtj">
        <label>企业名称：</label>
        <select name="sr.enterprise_id" class="mwsmartui-combobox" data-options="width:'500px',height:'30px',textField:'name',valueField:'id',required:true">
        </select>
    
    </div>
    
    <div class="lbcxtj">
    <label >联系方式：</label>
    <input name="sr.phone" class="mwsmartui-textbox" data-options="width:'204px',height:'30px',required:true">
    
    </div>
    
    
    
    <div class="lbcxtj" style="height:120px;">
    <label >备注：</label>
    <input name="sr.bak" class="mwsmartui-textbox" data-options="width:'500px',height:'120px',multiline:true">
    
    </div>
    <fieldset>
        <legend>申请应用</legend>
        <div class="checkbox" name="hyzx_wdyy_add_ck">
         </div>  
        </fieldset>		
    </form>


