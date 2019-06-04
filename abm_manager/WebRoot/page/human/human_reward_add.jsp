<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
   <form id="reward_addform" method="post" >
   			<input id="id" type="hidden" value="" />
   			<div class="lbcxtj" >
                <label>企业名称：</label>
                <select id="qymc" name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" data-options="width:'370px',
                	onSelect:humanReward.select_qy,
                	height:'30px',required:true,valueField:'id',textField:'name'">
                </select>
            
            </div>
   			<div class="lbcxtj" >
                <label>项目名称：</label>
                <select id="xmmc" name="enterpriseEmployee.project_id" class="mwsmartui-combobox" data-options="width:'370px',height:'30px',valueField:'id',textField:'name'">
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
    				onSelect:humanReward.select_bm,
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
           	<div class="lbcxtj" >
                <label>类别：</label>
                <select id="lb" class="mwsmartui-combobox" data-options="width:'140px',height:'30px',required:true">
                	<option value="0">奖励</option>
                	<option value="1">处罚</option>
                </select>
            </div>
			<div class="lbcxtj">
                <label>时间：</label>
                <input id="sj" class="mwsmartui-datebox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj" style="height:80px">
                <label>原因：</label>
                <input id="yy" class="mwsmartui-textbox" data-options="width:'370px',height:'80px',prompt:''"/>
            </div>
            <div class="lbcxtj" style="height:80px">
                <label>奖惩内容：</label>
                <input id="jcnr" class="mwsmartui-textbox" data-options="width:'370px',height:'80px',prompt:''"/>
            </div>
            <div class="lbcxtj" style="height:80px">
                <label>备注：</label>
                <input id="bak" class="mwsmartui-textbox" data-options="width:'370px',height:'80px',prompt:''"/>
            </div>
       </form>
       <script type="text/javascript">
        	$(function(){
        		$('#reward_addform #qymc').combobox({
        			url:'./Employee-listMyEnterprise.action?type=AWARD_PUNISH_ADD',
        			onChange:function(val){
        				if(val){
        					$('#reward_addform #xmmc').combobox({
        						url:'./Employee-listProjectByCondition.action?type=AWARD_PUNISH_ADD&enterpriseId='+val,
        					});
        				}
        			}
        		});
        	});
        </script>
</body>
</html>
