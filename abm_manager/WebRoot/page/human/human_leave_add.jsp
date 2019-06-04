<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
   <form id="leave_addform" method="post" >
   			<input id="id" type="hidden" value="" />
   			<div class="lbcxtj" >
                <label>企业名称：</label>
                <select id="qymc" name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" data-options="
            		onSelect:humanLeave.select_qy,
                	width:'370px',height:'30px',required:true,url:'./Employee-listMyEnterprise.action?type=VACATION_MANAGER_ADD',valueField:'id',textField:'name'">
                </select>
            </div>
   			<div class="lbcxtj" >
                <label>项目名称：</label>
                <input id="leave_empproject_name" name="enterpriseEmployee.project_name" type="hidden" />
                <input id="leave_empproject_id" name="enterpriseEmployee.project_id" class="mwsmartui-combobox" data-options="
                	onSelect:humanLeave.select_xm,
                	width:'370px',height:'30px',valueField:'id',textField:'name'"/>
            </div>
            <div class="lbcxtj">
                <label>请假人：</label>
                <input id="leave_emp_name" type="hidden" />
                <input id="leave_emp_id" name="enterpriseEmployee" class="mwsmartui-combobox" data-options="
                	valueField:'id',
    				textField:'name',
    				onSelect:humanLeave.select_emp,
                	width:'140px',height:'30px',required:true"/>
            </div>
            <div class="lbcxtj">
                <label>部门：</label>
                <input id="leave_depart_name" type="hidden" />
                <input id="leave_depart_id" class="mwsmartui-combotree" data-options="
    				valueField:'id',
    				textField:'name',
    				onSelect:humanLeave.select_bm,
                	width:'140px',height:'30px'"/>
            </div>
            <div class="lbcxtj">
                <label>职务：</label>
                <input id="zw" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>请假类别：</label>
                <select id="lb" class="mwsmartui-combobox" name="" data-options="width:'140px',height:'30px'">
	                <option value="0">病假</option>
	                <option value="1">事假</option>
                </select>
            </div>
            <div class="lbcxtj">
                <label>审批状态：</label>
                <select id="zt" class="mwsmartui-combobox" name="" data-options="width:'140px',height:'30px'">
	                <option value="0">审批新建</option>
	                <option value="1">审批中</option>
	                <option value="2">审批拿回</option>
	                <option value="3">审批通过</option>
	                <option value="4">审批拒绝</option>
	                <option value="5">审批结束</option>
                </select>
            </div>
            <!--  
            <div class="lbcxtj">
                <label>请假天数：</label>
                <input id="qjts" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
            -->
            <div class="lbcxtj">
                <label>请假时间：</label>
                <input id="qjsj" class="mwsmartui-datebox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>结束时间：</label>
                <input id="xjsj" class="mwsmartui-datebox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>  
			<div class="lbcxtj">
                <label>批准人：</label>
                <input id="pzr" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
             <div class="lbcxtj">
                <label>批准时间：</label>
                <input id="pzsj" class="mwsmartui-datebox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>  
            
            <div class="lbcxtj" style="height:80px">
                <label>请假事由：</label>
                <input id="qjsy" class="mwsmartui-textbox" data-options="width:'370px',height:'80px',prompt:''"/>
            </div>
        </form>
</body>
</html>
