<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
 <form id="event_modify_form" method="post" >
 			<input  name="event.id" type="hidden" />
              <div class="lbcxtj" >
	                <label >项目：</label><%-- style="width:90px;" --%>
	            	<select id="xmmc_select" name="event.project_id" class="mwsmartui-combobox"  data-options="required:true,valueField:'id',
	            																				textField:'name',
	            																				width:'370px',height:'30px'" >
	                
	                </select>
	            </div>
             <%--
            <div class="lbcxtj" >
                <label>类别：</label>
               <select id="" class="mwsmartui-combobox" name="language" data-options="width:'140px',height:'30px'" >
                <option value="1">监控</option>
                <option value="0">巡检</option>
                
                </select>
            </div> 
              --%>
            <div class="lbcxtj" >
                <label>发生时间：</label>
                <input name="event.occur_time"  class="mwsmartui-datetimebox" data-options="required:true,width:'140px',height:'30px'">
            
            </div>
           
            <div class="lbcxtj" style="height:120px;">
                <label>事件说明：</label>
                <input name="event.content"  class="mwsmartui-textbox" data-options="required:true,width:'370px',height:'120px',multiline:true">
            
            </div>
            <div class="lbcxtj" >
                <label >记录人：</label>
                <input id="record_id" name="event.record_id" type="hidden" />
                <input id="record_name" name="event.record_name" class="mwsmartui-textbox" data-options="required:true,
                	buttonText:'选择',
                	onClickButton:projectEvent.selectEmp,
                	width:'370px',height:'30px'">
            </div>
           <div class="lbcxtj" >
                <label>记录时间：</label>
                <input name="event.handle_time" class="mwsmartui-datetimebox" data-options="required:true,width:'140px',height:'30px'">
            
            </div>
           
            <div class="lbcxtj" style="height:120px;">
                <label>处理结果：</label>
                <input name="event.handle_result" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true">
            
            </div>
          
             
           
            </form>
</body>
</html>
