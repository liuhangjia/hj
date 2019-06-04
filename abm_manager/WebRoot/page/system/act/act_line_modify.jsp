<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>流程类别</title>
</head>
<body>
	<div class="mwsmartui-layout" data-options="border:false,fit:true">
		<input type="hidden" id="id"/>
		<div data-options="region:'center',fit:true,border:false" style="padding:10px 10px 0px 10px;">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
				<tr>
	               <td>
	                   <div style="text-align:left;padding:5px;">
	                       <label style="display:inline-block; width:60px; text-align:right;">编码：</label>
	                       <input id="bm" class="mwsmartui-textbox" data-options="required:true"/>                            
	                   </div>
	               </td>
	           </tr>
				<tr>
	               <td>
	                   <div style="text-align:left;padding:5px;">
	                       <label style="display:inline-block; width:60px; text-align:right;">名称：</label>
	                       <input id="mc" class="mwsmartui-textbox" data-options="required:true"/>                            
	                   </div>
	               </td>
	           </tr>
	           <tr>
	               <td>
	                   <div style="text-align:left;padding:5px;">
	                       <label style="display:inline-block; width:60px; text-align:right;">排序：</label>
	                       <input id="px" class="mwsmartui-numberspinner" data-options="required:true,min:1" value="1"/>                            
	                   </div>
	               </td>
	           </tr>
	        </table>
		</div>
	</div>
</body>
</html>