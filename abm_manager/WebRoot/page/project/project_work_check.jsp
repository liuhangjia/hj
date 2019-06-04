<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
 <form id="" method="post" >
 
              <div class="lbcxtj" >
                <label>项目名称：</label>
                <input id="" class="mwsmartui-textbox" data-options="width:'370px',height:'30px'">
            
            </div>
             
            <div class="lbcxtj" >
                <label>项目类别：</label>
               <select id="" class="mwsmartui-combobox" name="language" data-options="width:'140px',height:'30px'" >
                <option value="1">监控</option>
                <option value="0">巡检</option>
                
                </select>
            </div> 
            <div class="lbcxtj" >
                <label>检查类型：</label>
                <input id="" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            
            </div>
          
             <div class="lbcxtj" >
                <label>检查时间：</label>
                <input id="" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'">
            
            </div>
           <div class="lbcxtj" >
                <label>检查主管：</label>
                <input id="" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            
            </div>
           
            <div class="lbcxtj">
                <label>检查情况：</label>
                <input id="" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',multiline:true">
            
            </div>
                
           
            </form>
            <table id="" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:10,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'get'">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
                    <th data-options="field:'tel',width:'30%'"><b>检查内容</b></th>
                    <th data-options="field:'zgh',width:'30%'"><b>检查结果</b></th>
                    <th data-options="field:'name',width:'40%'"><b>处理说明</b></th>
                   
                    
                </tr>
            </thead>
            <tbody>
            	<tr>
                	<td></td>
                	
                	<td>牟义星</td>
                    <td>保安</td>
                    
                    <td>良好</td>
                </tr>
            	
            </tbody>
        </table>
            
</body>
</html>
