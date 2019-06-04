<%@page import="com.abm.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
    String project_id = (String)request.getParameter("project_id");
	if(StringUtil.isEmpty(project_id)){
		project_id="";
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
 	<div id="project_xmry_add_div" class="mwsmartui-panel" data-options="border:false,fit:true">
	    <div id="xmry_add_list_toolbar" class="toolbar-div">
	        <form id="xmry_add_modify_form" method="post" >
	        	<div class="lbcxtj" >
	                <label>项目：</label>
	            	<select id="xmmc_select" class="mwsmartui-combobox"  data-options="valueField:'id',
           																				textField:'name',
           																				width:'370px',
           																				height:'30px'" >
	                </select>
	            </div> 
	        </form>
	        <div class="toolbar-btn">
				<div class="btn-left"><%-- onClick:projectxmry_add.add --%>
					<a href="#" class="mwsmartui-linkbutton" data-options="onClick:projectEmp.selectEmps"><i class="fa fa-plus"> </i> 添加</a>
				</div>
				<%--
				<div class="btn-right">
					<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:work_doSearch"><i class="fa fa-search"> </i> 查询</a>
	                <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:work_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
				</div>
				 --%>
			</div>
	    </div>
       <table id="project_xmry_add_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			singleSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
            scrollbarSize:157,
			toolbar:'#xmry_add_list_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'name',width:'10%'"><b>姓名</b></th>                    
                    <th data-options="field:'sex',width:'7%',formatter:function(value){return common.codeToName('XB',value);}"><b>性别</b></th>                    
                    <th data-options="field:'depart_name',width:'15%',formatter:common.departIdToName"><b>部门</b></th>                    
                    <th data-options="field:'position',width:'10%'"><b>职务</b></th>
                    <th data-options="field:'phone',width:'20%'"><b>联系电话</b></th>
                    <th data-options="field:'duty',width:'40%'"><b>负责内容</b></th>
                    <th data-options="field:'status',width:'10%',formatter:projectEmp.noIdEmpsListOpts"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
             
            <%--
            <div class="lbcxtj" >
                <label>姓名：</label>
                <input id="" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            
            </div>
            <div class="lbcxtj" >
                <label>性别：</label>
               <select id="" class="mwsmartui-combobox" name="language" data-options="width:'140px',height:'30px'" >
                <option value="1">男</option>
                <option value="0">女</option>
                
                </select>
            </div>
            <div class="lbcxtj" >
                <label>部门：</label>
               <select id="" class="mwsmartui-combobox" name="language" data-options="width:'140px',height:'30px'" >
                <option value="1">保安部</option>
                <option value="0">人力资源部</option>
                
                </select>
            
            </div>
              <div class="lbcxtj" >
                <label>职务：</label>
               <select id="" class="mwsmartui-combobox" name="language" data-options="width:'140px',height:'30px'" >
                <option value="1">大队长</option>
                <option value="0">中队长</option>
                
                </select>
            
            </div>
            
            <div class="lbcxtj" >
                <label>联系电话：</label>
                <input id="" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            
            </div>
            
          
             <div class="lbcxtj" style="height:120px;">
                <label>负责内容：</label>
                <input id="" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true">
            
            </div>
             --%>
              
           
            
</body>
</html>
