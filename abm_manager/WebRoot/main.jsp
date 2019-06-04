<%@ page language="java"  pageEncoding="UTF-8"%>
<%@page import="java.util.*" import="java.io.*" import="java.net.*" import="com.abm.common.model.*" import="com.abm.common.service.*" import="com.abm.common.utils.*" import="net.sf.json.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>云行保平台</title>
	<%-- 公共LIB --%>
	<jsp:include page="page/main/common_js.jsp" ></jsp:include>
	<%-- 业务相关JS --%>
	<jsp:include page="page/main/head_js.jsp"></jsp:include>
</head>

<body>
	<div id="tab_right_menu" class="mwsmartui-menu" style="width:150px;" data-options="onClick:closeTab">
       	<div id="tab_right_menu_refresh" data-options="name:4">刷新</div>
       	<div id="tab_right_menu_close" data-options="name:1">关闭</div>
        <div id="tab_right_menu_closall" data-options="name:2">全部关闭</div>
        <div id="tab_right_menu_closeother" data-options="name:3">除此之外全部关闭</div>
    </div>
    <div class="mwsmartui-layout" data-options="fit:true,border:false">
    	<div id="header" data-options="border:false,height:'60px',region:'north'" class="topbg">
	       	<jsp:include page="page/main/head.jsp" ></jsp:include>
	    </div>
		<div id="menu" data-options="border:false,region:'west'" style="width:180px;" class="mwsmartui-accordion">
		   <jsp:include page="page/main/menu.jsp"></jsp:include>
		</div>
		<div id="operator" data-options="region:'center',onContextMenu:tabRightMenu" class="mwsmartui-tabs">
			<div title="<i class='fa fa-home'></i>首页" style="padding:15px;">
	    		<jsp:include page="page/main/welcome.jsp"></jsp:include>    
	    	</div>
		</div>
    </div>
    <audio id='alarmsound' src='images/alarm.mp3'   align='center' border='0' width='1' height='1' loop='true'></audio>
</body>
</html>
