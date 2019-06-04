<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
   <form id="timecard_addform" method="post" >
   			<input id="id" type="hidden" value="" />
   			<div class="lbcxtj" >
                <label>企业名称：</label>
                <select id="qymc" name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" data-options="width:'370px',height:'30px',required:true,valueField:'id',textField:'name'">
                </select>
            
            </div>
   			<div class="lbcxtj" >
                <label>项目名称：</label>
                <select id="xmmc" name="enterpriseEmployee.project_id" class="mwsmartui-combobox" data-options="width:'370px',height:'30px',valueField:'id',textField:'name'">
                </select>
            
            </div>
            <div class="lbcxtj">
                <label>年月：</label>
                <input id="ny" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:'2020-01'"/>
            </div>
            <!--  
            <div class="lbcxtj">
                <label>部门：</label>
                <input id="bm" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>人数：</label>
                <input id="rs" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
			<div class="lbcxtj">
                <label>出勤：</label>
                <input id="cq" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>病假：</label>
                <input id="bj" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div><div class="lbcxtj">
                <label>事假：</label>
                <input id="sj" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div><div class="lbcxtj">
                <label>旷工：</label>
                <input id="kg" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div><div class="lbcxtj">
                <label>迟到：</label>
                <input id="cd" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div><div class="lbcxtj">
                <label>值班：</label>
                <input id="zb" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
            -->
            <div class="lbcxtj" style="height:80px">
                <label>备注：</label>
                <input id="bak" class="mwsmartui-textbox" data-options="width:'370px',height:'80px',prompt:''"/>
            </div>
         </form>
         <script type="text/javascript">
        	$(function(){
        		$('#timecard_addform #qymc').combobox({
        			url:'./Employee-listMyEnterprise.action?type=WORK_ATTENDANCE_MANAGER_ADD',
        			onChange:function(val){
        				if(val){
        					$('#timecard_addform #xmmc').combobox({
        						url:'./Employee-listProjectByCondition.action?type=WORK_ATTENDANCE_MANAGER_ADD&enterpriseId='+val,
        					});
        				}
        			}
        		});
        	});
        </script>
	</body>
</html>
