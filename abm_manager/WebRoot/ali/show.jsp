 <%@ page language="java"  pageEncoding="UTF-8"%>
 <%@ page import="com.abm.common.model.*" import="com.abm.common.service.*"  import="com.abm.manager.util.Config"  import="com.abm.common.utils.*" %>
<%
	
	String device_id = (String)request.getParameter("device_id");
	AlarmDeviceModel camera = AlarmDeviceService.getSingle().getById(device_id);
	String url = "";
	if(camera!=null)
	{
		url = AlarmDeviceService.getSingle().getVideoUrl(camera.getUser_name(),camera.getPasswd(),".flv");
	}
	
 %>
<html>
<head>
<link rel="stylesheet" href="./aliplayer-min.css" />
<script charset="utf-8" type="text/javascript" src="./aliplayer-min.js"></script>
</head>
<body>

<div  class="prism-player" id="J_prismPlayer"></div>
        <script>
            var player = new Aliplayer({
            id: 'J_prismPlayer',
            width: '100%',
            autoplay: true,
            //支持播放地址播放,此播放优先级最高
            source :'<%=url%>',
			//region:'cn-shanghai',//eu-central-1,ap-southeast-1
			//isLive:true,
			controlBarVisibility:'always',
			useFlashPrism:true
            },function(player){
                console.log('播放器创建好了。')
           });
        </script>
</body>
</html>