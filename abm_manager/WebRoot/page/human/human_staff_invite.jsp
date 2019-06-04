<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>安保人员邀请</title>
</head>
<body>
	<div class="mwsmartui-panel" data-options="fit:true,border:false" style="padding-top:40px;">
		<form method="post">
			<div class="lbcxtj">
				<label style="width:120px;">企业名称：</label> 
				<select  name="entId" class="mwsmartui-combobox" data-options="width:'240px',height:'30px',required:true,url:'./Employee-listMyEnterprise.action?type=EMPLOYEE_MANAGER_ADD',valueField:'id',textField:'name'" >
				</select>
			</div>
			<div class="lbcxtj">
				<label style="width:120px;">邀请安保人员手机号：</label> 
				<input id="phone" class="mwsmartui-textbox" data-options="width:'240px',height:'30px',prompt:'手机号',required:true" />
			</div>
		</form>
	</div>
</body>
</html>