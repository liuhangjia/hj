<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>流程监听</title>
</head>
<body>
	<div class="mwsmartui-layout" data-options="border:false,fit:true">
		<input type="hidden" id="id"/>
		<div data-options="region:'center',fit:true,border:false" style="padding:10px 10px 0px 10px;">
			<table width="100%" border="0" cellspacing="0" cellpadding="5">
				<tr>
	               <td>
                       <label style="display:inline-block; width:60px; text-align:right;">名称：</label>
	               </td>
	               <td>
	               		<input id="name" class="mwsmartui-textbox" data-options="required:true,width:'100%'"/>  
	               </td>
	           </tr>
	           <tr>
	               <td>
                       <label style="display:inline-block; width:60px; text-align:right;">类别：</label>
	               </td>
	               <td>
               			<label><input type="radio" name="type" value="QJSJ"/>全局事件</label>
                       	<label><input type="radio" name="type" value="LXSJ"/>连线事件</label>
                       	<label><input type="radio" name="type" value="JDSJ"/>节点事件</label>
	               </td>
	           </tr>
	           <tr>
	               <td>
                       <label style="display:inline-block; width:60px; text-align:right;">事件：</label>
	               </td>
	               <td>
	               		<select id="event" name="event" class="mwsmartui-combobox" data-options="width:'100%',editable:false,required:true">
                       </select>
	               </td>
	           </tr>
	           <tr>
	               <td>
                       <label style="display:inline-block; width:60px; text-align:right;">CLASS：</label>
	               </td>
	               <td>
	               		<input id="class" class="mwsmartui-textbox" data-options="required:true,width:'100%'"/>  
	               </td>
	           </tr>
	        </table>
		</div>
	</div>
</body>
</html>