 <%@ page language="java"  pageEncoding="UTF-8"%>
 <%@ page import="com.abm.common.model.*" import="com.abm.manager.util.Config" import="com.abm.common.utils.Constants" import="java.util.List" import="com.abm.common.service.AlarmDeviceService"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<link rel="stylesheet" type="text/css" href="http://127.0.0.1:8888/abm_manager/css/font-awesome.css"/>
<body>
<%
	AccountsModel currentUser = (AccountsModel)session.getAttribute(Constants.USER);
	String device_id = request.getParameter("device_id");
	String url = "http://"+Config.local_ip+":"+request.getLocalPort()+request.getContextPath();
	if(device_id!=null&&device_id.trim().length()>0)
	{
		AlarmDeviceModel camera = AlarmDeviceService.getSingle().getById(device_id);
		if(camera!=null)
		{
			
				if(camera.getFactory().equalsIgnoreCase(Constants.FACTORY_DSJ))
				{%>
					<div style="width:100%; height:100%;float:left;"><iframe src="<%=url %>/dsj/show.jsp?username=<%=camera.getUser_name()%>&passwd=<%=camera.getPasswd()%>&idnum=<%=camera.getIdnum()%>&userid=<%=currentUser.getId()%>" style=" width:100%;min-height:360px;"></iframe></div>
					
				<%}else if(camera.getFactory().equalsIgnoreCase(Constants.FACTORY_SZW))
				{%>
					<div style="width:49%; height:340px;float:left;"><iframe src="<%=url %>/szw/show.jsp?username=<%=camera.getUser_name()%>&passwd=<%=camera.getPasswd()%>&idnum=<%=camera.getIdnum()%>&userid=<%=currentUser.getId()%>" style=" width:100%;min-height:360px;"></iframe></div>
				<%}else if(camera.getFactory().equalsIgnoreCase(Constants.FACTORY_ALI))
				{%>
					<div style="width:49%; height:340px;float:left;"><iframe src="<%=url %>/ali/show.jsp?device_id=<%=device_id%>" style=" width:100%;min-height:360px;"></iframe></div>
			
		<%}}
		else
		{
			out.print("找不到对应的摄像头设备");
		}
	}
	else
	{
		out.print("摄像头设备为空");
	}
%>
</body>
</html>
