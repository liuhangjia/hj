<%@page import="com.abm.common.model.ProjectModel"%>
<%@page import="com.abm.common.dao.ProjectDao"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String priv = "PROJECT_EMPLOYEE_EDIT";
	boolean isAdd = Boolean.parseBoolean(request.getParameter("isAdd"));
	if(isAdd){
		priv = "PROJECT_EMPLOYEE_ADD";
	}
	
	String project_id = request.getParameter("project_id");
	ProjectModel pm = ProjectDao.getSingle().executeQueryById(project_id);
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
 <form id="" method="post" >
            <div id="xmmc_select_div" class="lbcxtj" >
                <label>项目：</label>
            	<select id="xmmc_select"  class="mwsmartui-combobox"  data-options="valueField:'id',
       																				textField:'name',
       																				width:'370px',height:'30px'" >
                
                </select>
            </div>
              <div class="lbcxtj" >
                <label>姓名：</label>
                <input id="xmry_name" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            </div>
            <div class="lbcxtj" >
                <label>性别：</label>
               <select id="xmry_sex" class="mwsmartui-combobox"  data-options="
               		data:common.listCodesByType('XB'),valueField:'code',textField:'name',
               		width:'140px',height:'30px'" >
                </select>
            </div>
            <div class="lbcxtj" >
                <label>部门：</label>
                <select id="xmry_depart" class="mwsmartui-combotree"  data-options="
                	url:'./Depart-listDept.action?enterpriseId=<%=pm.getEnterprise_id() %>',
    				valueField:'id',
    				textField:'name',            
	                width:'140px',height:'30px'" >
                </select>
                <%--
                <select id="xmry_depart" class="mwsmartui-combobox"  data-options="
    				url:'./Depart-listForCombo.action?priv=<%=priv %>',
    				valueField:'id',
    				textField:'name',            
	                width:'140px',height:'30px'" >
                </select>
                <input id="xmry_depart" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
                 --%>
            </div>
            <div class="lbcxtj" >
            	<label>班次：</label>
            	<select id="xmry_range" class="mwsmartui-combobox"  data-options="
                	url:'./ProjectShift-list.action?ids=<%=project_id %>',
    				valueField:'id',
    				textField:'name',            
	                width:'140px',height:'30px'" >
                </select>
            </div>
            <div class="lbcxtj" >
                <label>职务：</label>
                <input id="xmry_zw" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
                <%--
                <select id="xmry_zw" class="mwsmartui-combobox" name="language" data-options="width:'140px',height:'30px'" >
                <option value="1">大队长</option>
                <option value="0">中队长</option>
                </select>
                 --%>
            </div>
            <div class="lbcxtj" >
                <label>联系电话：</label>
                <input id="xmry_phone" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            </div>
            <div  class="lbcxtj" >
                <label>角色：</label>
            	<select id="project_role"  class="mwsmartui-combobox"  data-options="valueField:'id',
            																				textField:'name',
            																				width:'140px',height:'30px'" >
                
                </select>
            </div>
             <div class="lbcxtj" style="height:120px;">
                <label>负责内容：</label>
                <input id="xmry_fznr" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true">
            </div>
       </form>
</body>
</html>
