<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
 <form id="patrol_modify_form" method="post" >
 
              <div class="lbcxtj" >
	                <label >项目：</label>
	            	<select id="xmmc_select" name="patrol.project_id" class="mwsmartui-combobox"  data-options="valueField:'id',
	            																				textField:'name',
	            																				width:'370px',height:'30px'" >
	                
	                </select>
	            </div>
             
            <div class="lbcxtj" >
                <label>类别：</label>
               <select name="patrol.type" class="mwsmartui-combobox"  data-options="width:'140px',height:'30px'" >
                <option value="0">日常巡检</option>
                <option value="1">消防巡检</option>
                
                </select>
            </div> 
              
            <div class="lbcxtj" >
                <label>巡检区域：</label>
               <input name="patrol.area" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            </div> 
            <div class="lbcxtj" >
                <label>开始时间：</label>
                <input name="patrol.staet_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'">
            
            </div>
           <div class="lbcxtj" >
                <label>结束时间：</label>
                <input name="patrol.end_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'">
            
            </div>
           
             <div class="lbcxtj" >
                <label>记录人：</label>
                <input name="patrol.record_name" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            
            </div>
           
           
            <div class="lbcxtj" style="height:120px;">
                <label>巡检情况：</label>
                <input name="patrol.description" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true">
            
            </div>
          
             
           
            </form>
</body>
</html>
