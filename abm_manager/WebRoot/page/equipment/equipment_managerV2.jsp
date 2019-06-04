<%@page import="net.sf.json.JSONArray"%>
<%@page import="com.abm.common.model.SysBaseCodeModel"%>
<%@page import="java.util.List"%>
<%@page import="com.abm.common.utils.Cache"%>
<%@page import="com.abm.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	List<SysBaseCodeModel> codeList = Cache.findCodeByTypeCode("ZBLB");
	String code_str="";
	for(SysBaseCodeModel sys:codeList){
		code_str += ","+sys.getCode();
	}
	code_str = code_str.substring(1);
	//JSONArray code_array = JSONArray.fromObject(codeList);
	//String code_array_str = code_array.toString().replaceAll("\"", "'");
	//System.out.println(code_array.toString().replaceAll("\"", "'") );
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
   <div class="mwsmartui-layout" data-options="fit:true,border:false">
   		<input id="equip_managers_code_str" type="hidden" value="" />
	    <div id="equip_managers_tabs" class="mwsmartui-tabs" data-options="border:false,region:'center',onSelect:equip.selectTab"  style="border-top:solid 1px #cecece; ">
	        <%
	        	if(null!=codeList && !codeList.isEmpty()){
	        		for(int i=0;i<codeList.size();i++){
	        			SysBaseCodeModel codeModel = codeList.get(i);
	        	
	        %>
	        <div id="equip_managers_tab_<%=codeModel.getCode() %>"  lb="<%=codeModel.getCode() %>" data-options="title:'<%=codeModel.getName() %>'">
	        
	        </div>
	        <%
	        		}
	        	}
	        %>
	    </div>
    </div>
</body>
</html>
