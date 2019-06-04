<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
 			<form id="communication_modify_form" method="post" >
 				<input name="pcm.id" type="hidden"/>
	            <div class="lbcxtj" >
	                <label style="width:90px;">项目：</label>
	            	<select id="xmmc_select" name="pcm.project_id" class="mwsmartui-combobox"  data-options="valueField:'id',
	            																				textField:'name',
	            																				width:'380px',height:'30px'" >
	                
	                </select>
	            </div>
	            <div class="lbcxtj" >
	                <label style="width:90px;">回访人姓名：</label>
	                <input id="hfrxm_hidden" name="pcm.emp_id" type="hidden" />
	                <input id="hfrxm" name="pcm.emp_name" class="mwsmartui-textbox" data-options="
	                	buttonText:'选择',
	                	onClickButton:projectCommunication.selectEmps,
	                	width:'380px',height:'30px'">
	            </div>
	            <div class="lbcxtj" >
	                <label style="width:90px;">被回访人姓名：</label>
	                <input id="bhfrxm" name="pcm.name" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
	            </div>
	            <div class="lbcxtj" >
	                <label style="width:90px;">被回访人职务：</label>
	                <input id="bhfrzw" name="pcm.position" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
	            </div>
	            <div class="lbcxtj" >
	                <label style="width:90px;">回访时间：</label>
	                <input id="hfsj" name="pcm.comm_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'">
	            </div>
	            <div class="lbcxtj" >
	                <label style="width:90px;">用户评分：</label>
	                <input id="yhpf" name="pcm.score" class="mwsmartui-numberbox" data-options="width:'140px',height:'30px'">
	            </div>
	            <div class="lbcxtj" style="height:120px;">
	                <label style="width:90px;">回访内容：</label>
	                <input id="hfnr" name="pcm.content" class="mwsmartui-textbox" data-options="width:'380px',height:'120px',multiline:true">
	            </div>
            </form>
</body>
</html>
