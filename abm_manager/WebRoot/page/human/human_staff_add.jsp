<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
   <form  id="human_staff_add_form" method="post" enctype="multipart/form-data">
    <input type="hidden" name="enterpriseEmployee.id"/>
   			<div class="lbcxtj" >
                <label>企业名称：</label>
                <select name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" data-options="
                	onSelect:humanStaff.select_qy,
                	width:'370px',height:'30px',required:true,url:'./Employee-listMyEnterprise.action?type=EMPLOYEE_MANAGER_ADD',valueField:'id',textField:'name'">
                </select>
            
            </div>
            <div class="lbcxtj">
                <label>姓名：</label>
                <input id="employee_name" name="employee.name"  class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:'',required:true">
            
            </div>
            <div class="lbcxtj">
                <label>手机：</label>
                <input id="employee_phone" name="employee.phone"  class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:'',required:true">
            
            </div>
            <div class="lbcxtj">
                 <label>性别：</label>
                <select  id="employee_sex" name="employee.sex"  class="mwsmartui-combobox" name="language" data-options="width:'140px',height:'30px',valueField:'code',textField:'name'" >
                </select>
            </div>
            <%--
            <div class="lbcxtj">
                <label>部门：</label>
                <input name="enterpriseEmployee.depart_name" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
             --%>
            <div class="lbcxtj">
                <label>部门：</label>
                <input id="enterpriseEmployee_depart_name" name="enterpriseEmployee.depart_name" type="hidden" >
                <input id="enterpriseEmployee_depart_id"  name="enterpriseEmployee.depart_id"  class="mwsmartui-combotree" data-options="
    				valueField:'id',
    				textField:'name',
    				onSelect:humanStaff.select_bm,
                	width:'140px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                <label>职务：</label>
                <input name="enterpriseEmployee.position" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                <label>联系地址：</label>
                <input name="employee.address" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''">
            </div>  
			<div class="lbcxtj">
                <label>入职时间：</label>
                <input name="enterpriseEmployee.start_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                <label>离职时间：</label>
                <input name="enterpriseEmployee.end_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj">
                 <label>当前状态：</label>
                <select name="enterpriseEmployee.status" class="mwsmartui-combobox" name="language" data-options="width:'140px',height:'30px'" >
                	<option value="1">在岗</option>
                	<option value="0">离职</option>
                
                </select>
            </div>
            <div class="lbcxtj" style="height:80px">
                <label>备注：</label>
                <input name="enterpriseEmployee.bak"  class="mwsmartui-textbox" data-options="width:'370px',height:'80px',prompt:''">
            </div>
            <div class="lbcxtj" >
            	<input type="hidden" name="save_filename" id="emp_attendance_save_filename"/>
            	<input type="hidden" name="yuan_filename" id="emp_attendance_yuan_filename"/>
            	<label>考勤照片：</label>
            	<input name="uploadfile" id="emp_attendance_photo" type="file" accept="image/gif, image/jpeg, image/png"  style="display:none">
				<a class="mwsmartui-linkbutton" onclick="$('#emp_attendance_photo').click();">上传照片</a>
				
            </div>
			<div class="lbcxtj" >
				<img id="emp_attendance_img" src="./images/bg.png" alt=""  style="width:150px; height:150px;border-radius:150px;">
			</div>
            </form>

