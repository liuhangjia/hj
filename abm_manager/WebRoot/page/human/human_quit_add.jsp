<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
   <form id="quit_addform" method="post" >
   			<input id="id" name="id" type="hidden" value="" />
   			<div class="lbcxtj" >
                <label>企业名称：</label>
                <select id="qymc" name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" data-options="width:'370px',height:'30px',
                	required:true,
                	onSelect:humanQuit.select_qy,
                	url:'./Employee-listMyEnterprise.action?type=DISMISS_MANAGER_LIST',
                	valueField:'id',textField:'name'">
                </select>
            
            </div>
            <div class="lbcxtj">
                <label>姓名：</label>
                <input id="xm" name="name" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>部门：</label>
                <input id="quit_depart_name" name="depart_name" type="hidden" val="" />
                <input id="bm" name="depart_id" class="mwsmartui-combotree" data-options="
    				valueField:'id',
    				textField:'name',
    				onSelect:humanQuit.select_bm,
                	width:'140px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>职务：</label>
                <input id="zw" name="position" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
           
			<div class="lbcxtj">
                <label>联系电话：</label>
                <input id="dh" name="phone" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>申请时间：</label>
                <input id="sqsj" name="req_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div><div class="lbcxtj">
                <label>工作交接：</label>
                <input id="gzjj" name="hand_over" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div><div class="lbcxtj">
                <label>设备归还：</label>
                <input id="sbgh" name="equip_return" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div><div class="lbcxtj">
                <label>欠款归还：</label>
                <input id="qkgh" name="owe_return" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div><div class="lbcxtj">
                <label>工资支付：</label>
                <input id="gzzf" name="pay" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>离职时间：</label>
                <input id="lzsj" name="dismiss_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px',prompt:''">
            </div>
            <div class="lbcxtj" style="height:80px">
                <label>离职原因：</label>
                <input id="lzyy" name="reason" class="mwsmartui-textbox" data-options="width:'370px',height:'80px',prompt:''">
            </div>
            <div class="lbcxtj" style="height:80px">
                <label>离职评价：</label>
                <input id="lzpj" name="evaluation" class="mwsmartui-textbox" data-options="width:'370px',height:'80px',prompt:''">
            </div>
            </form>
</body>
</html>
