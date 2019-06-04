<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
 <form method="post" >
 		<input type="hidden" name="role.id"/>
 		<input type="hidden" name="role.is_editable"/>
            <div class="lbcxtj">
                <label>企业名称：</label>
                <select name="role.enterprise_id" class="mwsmartui-combobox" data-options="width:'370px',height:'30px',required:true,url:'./Role-listMyEnterprise.action?type=USER_ROLE_MANAGER_ADD',valueField:'id',textField:'name'">
            	</select>
            </div>
           <div class="lbcxtj" >
                <label>角色名称：</label>
                <input name="role.name" class="mwsmartui-textbox" data-options="width:'370px',height:'30px'">
            
            </div>
            <div class="lbcxtj" style="height:120px;">
                <label>备注：</label>
                <input name="role.bak" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true">
            
            </div>
           
             
             
           
</form>

