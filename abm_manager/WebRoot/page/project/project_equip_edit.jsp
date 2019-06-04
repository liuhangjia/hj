<%@page import="com.abm.common.model.ProjectModel"%>
<%@page import="com.abm.common.dao.ProjectDao"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String priv = "PROJECT_EQUIP_EDIT";
	boolean isAdd = Boolean.parseBoolean(request.getParameter("isAdd"));
	if(isAdd){
		priv = "PROJECT_EQUIP_ADD";
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
 <form  method="post" >
            <div id="xmmc_select_div" class="lbcxtj" >
                <label>项目：</label>
            	<select id="xmmc_select"  class="mwsmartui-combobox"  data-options="valueField:'id',
            																				textField:'name',
            																				width:'370px',height:'30px'" >
                
                </select>
            </div>
              <div class="lbcxtj" >
                <label>名称：</label>
                <input id="xmzb_name" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            </div>
            <div class="lbcxtj" >
                <label>类别：</label>
               <select id="xmzb_lb" class="mwsmartui-combobox"  data-options="
               		data:common.listCodesByType('ZBLB'),valueField:'code',textField:'name',
               		width:'140px',height:'30px'" >
                </select>
            </div>
              <div class="lbcxtj" >
                <label>种类：</label>
                <select id="xmzb_zl"  class="mwsmartui-combobox"  data-options="data:common.listCodesByType('ZBZL'),
	                 																					valueField:'code',
	                 																					textField:'name',
	                 																					width:'140px',height:'30px'" >
	             </select>
            </div>
            <div class="lbcxtj" >
                <label>厂商：</label>
                <input id="xmzb_cs" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            </div>
            <div class="lbcxtj" >
                <label>型号：</label>
                <input id="xmzb_xh" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            </div>
            <div class="lbcxtj" >
                <label>单位：</label>
                <input id="xmzb_dw" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
            </div>
            <div class="lbcxtj" >
                <label>数量：</label>
                <input id="xmzb_sl" class="mwsmartui-numberbox" data-options="width:'140px',height:'30px'">
            </div>
       </form>
</body>
</html>
