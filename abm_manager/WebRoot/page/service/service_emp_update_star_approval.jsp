<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
 	<div id="service_emp_update_star_approval_div" class="mwsmartui-panel" data-options="border:false,fit:true">
	    <form id="service_emp_update_star_approval_form" method="post" >
	        <div class="lbcxtj" >
                <label>审批结果：</label>
            	<select id="update_star_approval_result" class="mwsmartui-combobox"  data-options="required:true,
            																				onChange:fwqq_abjysx_sp_level_combobox_onChange,
            																				width:'140px',height:'30px'" >
                	<option value="1">通过</option>
                	<option value="2">拒绝</option>
                </select>
            </div> 
            <div id="update_star_approval_level_div" class="lbcxtj" >
                <label>升至星级：</label>
            	<input id="update_star_approval_level" class="mwsmartui-numberbox"  data-options="min:0,width:'140px',height:'30px'" >
            </div>         
	    </form>
    </div>
</body>
</html>
