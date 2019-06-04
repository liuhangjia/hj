<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
 <form method="post" >
 		<input type="hidden" name="record.id"/>
 		<input type="hidden" name="record.checked_id"/>
 		<input type="hidden" name="record.checked_name"/>
            <div class="lbcxtj">
                <label>项目名称：</label>
                <select name="record.project_id" class="mwsmartui-combobox" data-options="width:'370px',height:'30px',url:'./AlarmDeviceCheck-listProject.action',valueField:'id',textField:'name'">
            	</select>
            </div>
           <div class="lbcxtj" >
                <label>客户名称：</label>
                <select name="record.member_id" class="mwsmartui-combobox" data-options="width:'370px',height:'30px',url:'./AlarmDeviceCheck-listMemeber.action',valueField:'id',textField:'name'">
            	</select>
            
            </div>
            <div class="lbcxtj">
                <label>巡检时间：</label>
                <input name="record.check_time" class="mwsmartui-datetimebox" data-options="width:'370px',height:'30px'"/>
            
            </div>
             <div class="lbcxtj">
                <label>地址：</label>
                <input name="record.address" class="mwsmartui-textbox" data-options="width:'370px',height:'30px'">
            
            </div>
             <div class="lbcxtj" style="height:120px;">
                <label>检查内容：</label>
                <input name="record.check_comment" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true">
            
            </div>
            <div class="lbcxtj" style="height:120px;">
                <label>检查结果：</label>
                <input name="record.result" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true">
            
            </div>
           
             
             
           
</form>

