<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
	<form id="equip_out_warehouse_form" method="post" >
		 <input id="equip_id" name="equipUsed.equip_id" type="hidden" />
         <div class="lbcxtj" >
            <label style="width:90px;">项目：</label>
            <input id="project_name" name="equipUsed.project_name" type="hidden" />
	     	<select id="xmmc_select" name="equipUsed.project_id" class="mwsmartui-combobox"  data-options="
	     																				valueField:'id',
	     																				textField:'name',
	     																				onSelect:equip.equip_select_project,
	     																				width:'380px',height:'30px'" >
	         
	         </select>
	     </div>
	     <div class="lbcxtj" >
	         <label style="width:90px;">借用人：</label>
	         <input id="user_id" name="equipUsed.user_id" type="hidden" />
	         <input id="user_name" name="equipUsed.user_name" class="mwsmartui-textbox" data-options="
	         	required:true,
	         	buttonText:'选择',
	         	onClickButton:equip.selectJYR,
	         	width:'380px',height:'30px'">
	     </div>
	     <div class="lbcxtj" >
	         <label style="width:90px;">借出日期：</label>
	         <input id="used_time" name="equipUsed.used_time" class="mwsmartui-datetimebox" data-options="showSeconds:false,required:true,width:'140px',height:'30px'">
	     </div>
	     <%--
	     <div class="lbcxtj" >
	         <label style="width:90px;">归还日期：</label>
	         <input id="return_time" name="equipUsed.return_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'">
	     </div>
	      --%>
	     <div class="lbcxtj" >
	         <label style="width:90px;">借用数量：</label>
	         <input id="quantity" name="equipUsed.quantity" class="mwsmartui-numberbox" data-options="required:true,width:'140px',height:'30px'">
	     </div>
	     <div class="lbcxtj" >
	         <label style="width:90px;">经办人：</label>
	         <input id="opt_id" name="equipUsed.opt_id" type="hidden" />
	         <input id="opt_name" name="equipUsed.opt_name" class="mwsmartui-textbox" data-options="
	         	required:true,
	         	editable:false,
	         	buttonText:'选择',
	         	onClickButton:equip.selectJBR,
	         	width:'380px',height:'30px'">
	     </div>
	     <div class="lbcxtj" style="height:120px;">
	         <label style="width:90px;">备注：</label>
	         <input id="bak" name="equipUsed.bak" class="mwsmartui-textbox" data-options="width:'380px',height:'120px',multiline:true">
	     </div>
    </form>
</body>
</html>
