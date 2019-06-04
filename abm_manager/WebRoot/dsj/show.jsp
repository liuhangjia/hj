 <%@ page language="java"  pageEncoding="UTF-8"%>
 <%@ page import="com.abm.common.model.*" import="com.abm.manager.util.Config"  import="com.abm.common.utils.*" %>
<html xmlns="http://www.w3.org/1999/xhtml"><head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<link rel="stylesheet" type="text/css" href="../css/font-awesome.css"/>
<script src="./js/jquery-1.9.1.js?v=1.0.0.19" type="text/javascript" charset="utf-8"></script>
<script src="./js/ipc.js?v=1.0.0.26" type="text/javascript" charset="utf-8"></script>
<script src="./js/common.js?v=1.0.0.19" type="text/javascript" charset="utf-8"></script>



<title>网络摄像机</title>
<script type="text/javascript"> 
    var bntdefultbgimgae=47;
    var g_savePath='c:\\';
    var folder = '';
    var havecall_backfunc=false;
 
   

 
var IntervalID=0; 

var g_szLan = null;
var g_lanxXmlDoc = null;
</script>

</head> 


 

 
  
<body bgcolor="#FFFFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" style="text-align:center;position:relative;"  >

<%
	
	String user = (String)request.getParameter("username");
	String password = (String)request.getParameter("passwd");
	String idnum = (String)request.getParameter("idnum");
	String log_id = (String)request.getParameter("id");
	String userid = (String)request.getParameter("userid");
	String url = "http://"+Config.local_ip+":"+request.getLocalPort()+request.getContextPath()+"/Video-upload.action";
	if(user==null||user.trim().length()==0)
	{
		out.print("用户名为空");
	}
	else if(password==null||password.trim().length()==0)
	{
		out.print("密码为空");
	}
	else if(idnum==null||idnum.trim().length()==0)
	{
		out.print("序列号为空");
	}
	else
	{
 %>

<input type="hidden" id="bufferTick" value="800">
<input type="hidden" id="idChangeStream" value="1">

    <div style="width:100%; min-height:300px;">
    <script type="text/javascript" >
		WriteCloudPlayer(600,300);
	</script>
    </div>
	<div style="width:100%; height:40px; line-height:40px; text-align:center;">
    <a href="#" id="PlayRealVideo" onclick="OnPlay();" title="播放视频" style="background-color:#666; color:#FFF; border:1px solid #666; padding:5px 10px; text-decoration:none; border-radius:5px"><i class="fa fa-play"> </i></a>
&nbsp;&nbsp;
<a href="#" id="StopPlayReal"  
 onclick="OnStop();" title="停止播放" style="background-color:#666; color:#FFF; border:1px solid #666; padding:5px 10px; text-decoration:none; border-radius:5px"><i class="fa fa-stop"> </i></a>
 &nbsp;&nbsp;
<a href="#" id="SnapPicture"  onClick="OnCapture();"  title="快照图片" style="background-color:#666; color:#FFF; border:1px solid #666; padding:5px 10px; text-decoration:none; border-radius:5px"><i class="fa fa-image"> </i></a>
&nbsp;&nbsp;
<a href="#" id="RealRecord"   onClick="OnRecord();" title="实录视频" style="background-color:#666; color:#FFF; border:1px solid #666; padding:5px 10px; text-decoration:none; border-radius:5px"><i class="fa fa-video-camera"> </i></a>
&nbsp;&nbsp;
<a href="#" id="Talkback"   onclick="OnTalk();" title="对讲电话" style="background-color:#666; color:#FFF; border:1px solid #666; padding:5px 10px; text-decoration:none; border-radius:5px"><i class="fa fa-microphone"> </i></a>

    </div>






 

 

<script type="text/javascript" > 




var isrecord = 0;
var haveInitPassWord=false;
var recordIntervalId,starttime;
function doRecord(){
	var playobj=document.getElementById('CloudPlayerCtrl');
	if(g_RecordFlash)
	{
		if(new Date().getTime()-starttime>=30*1000){
			var r = playobj.StopRecord();
			g_RecordFlash=false;
			if(recordIntervalId!=0){
				window.clearInterval(recordIntervalId);
				if(folder!=''){
					//alert('视频录制完成，正在上传到服务器');
					$.ajax({
						url:'http://127.0.0.1:19017/',
						type:'POST',
						data:'{"type":"uploadFile","url":"<%=url%>","folder":"'+folder+'","id":"<%=log_id%>","userid":"<%=userid%>"}',
						async:false,
						success:function(resp){
							var respObj = JSON.parse(resp);
							if(respObj['success']){
								alert('上传成功');
							}else{
								alert('上传失败:'+respObj['msg']);
							}
							
							
						},
						error:function(){
							alert('自动上传录像失败,请手动上传，目录:'+g_savePath);
						}
					});
				}else{
					alert('视频录制完成，请手动上传到服务器');
				}
				
				
			}
		}
	}
	else
	{
		if(!g_RecordFlash){
			var nRet=playobj.StartRecord(g_savePath,1800); 
			if(nRet==0){
				g_RecordFlash = true;
				starttime = new Date().getTime();
			}	
		}
	}
	
	
	
}

function OnPlayStream(ty)
{
try{var ctrlobj=document.getElementById('CloudPlayerCtrl');
var defpass='cf010de7d2507500398b8dd19157be02';
//nRet=ctrlobj.StartPlayP2PVideo('39.105.148.129:10048\r\ntype=0&load=0&addr=jjrelay1.s1.seetong.com:1443;type=0&load=0&addr=xxrelay1.s1.seetong.com:1443;type=0&load=0&addr=xxrelay2.s1.seetong.com:1443;type=0&load=0&addr=jjrelay1.s1.seetong.com:1443','webipc',defpass,g_user,g_pass,'<%=idnum%>',100,ty);
//nRet=ctrlobj.StartPlayP2PVideo('47.98.240.18:10088\r\ntype=0&load=0&addr=jjrelay1.s1.seetong.com:1443;type=0&load=0&addr=xxrelay1.s1.seetong.com:1443;type=0&load=0&addr=xxrelay2.s1.seetong.com:1443;type=0&load=0&addr=jjrelay1.s1.seetong.com:1443','webipc',defpass,g_user,g_pass,'7161177',100,ty);
nRet=ctrlobj.StartPlayP2PVideo('123.56.223.171:10038\r\ntype=0&load=0&addr=jjrelay1.s1.seetong.com:1443;type=0&load=0&addr=xxrelay1.s1.seetong.com:1443;type=0&load=0&addr=xxrelay2.s1.seetong.com:1443;type=0&load=0&addr=jjrelay1.s1.seetong.com:1443','webipc',defpass,g_user,g_pass,'<%=idnum%>',100,ty);
;ctrlobj.PlaySound(1);
if(recordIntervalId!=0){
	window.clearInterval(recordIntervalId);
}
  <%
            	if(log_id!=null&&log_id.trim().length()>0){
            %> 
recordIntervalId = window.setInterval("doRecord()", 500);
  <%
            	}
            %> 

}catch(eevv){}
}







var waitIntervalId,fso;
function waitFolder(){
				try
				{
					fso.GetFolder("D:\\abc1");
					window.clearInterval(waitIntervalId);
					g_savePath='D:\\abc1\\';
					OnPlay();
				}catch(e){
				
				}
				
			}
function DoOnCtrlEvent(data,id,subid)
{
	if(id==10001 && subid==10001)
	{		
		if(g_user!='' && g_pass!='')
	        {
			try{OnPlay();}catch(eevv){}
		}
	}
	if(id==70 && subid==70)
	{
		try{OnChangeAbilityInfo(data);}catch(eevv){}
	}
}
function addEvent(obj, name, func)
{
	try
	{
		if (obj.attachEvent)
		{
			obj.attachEvent(name, func);
		}
		else
		{
			obj.addEventListener(name, func, false); 
		}
	}catch(eev){}
}

function removeEvent(obj, name, func)
{
	try
	{
		if (obj.detachEvent)
		{
			obj.detachEvent(name, func);
		}
		else
		{
			obj.removeEventListener(name, func, false); 
		}
	}catch(eev){}
}

function OnUninit(e)
{
	var obj=document.getElementById("CloudPlayerCtrl");
	removeEvent(obj,"OnPlayEvent",DoOnPlayEvent);
	removeEvent(obj,"OnCtrlEvent",DoOnCtrlEvent);
}

function InitPage()
{
	window.onunload=OnUninit;
    document.body.onunload=OnUninit;
    OnUninit();
    try
    {
        var obj=document.getElementById("CloudPlayerCtrl");
        addEvent(obj,"OnPlayEvent",DoOnPlayEvent);
        try{addEvent(obj,"OnCtrlEvent",DoOnCtrlEvent);}catch(eevv2){}
        obj.SetIEWindow(window,"DoOnPlayEvent,DoOnCtrlEvent");
    }catch(eevv){}	
    try
    {
        g_useP2PConnect=true;
		g_isFirstAutoLogin=false;
		if(!haveInitPassWord){
			haveInitPassWord=true;
			g_user='<%=user%>';
			g_pass='<%=password%>';
			g_initlang='zh-cn';
  
		}
     }catch(eevv){}
    
    var deflan=g_initlang;
    try
    {
        InitLangList('idLanguage'); 
    	LoadDefaultBufferTick();
    }catch(eevv){}
  
    try
    {
		    if(IntervalID!=0)
		    {
			      window.clearInterval(IntervalID);
		    }
		    IntervalID = window.setInterval("OnIPCStateChange()", 500);
    }catch(eevv){}
   
 	g_useP2PConnect=true;
		g_isFirstAutoLogin=false;
		if(!haveInitPassWord){
			haveInitPassWord=true;
			g_user='<%=user%>';
			g_pass='<%=password%>';
			g_initlang='zh-cn';
  
		}
    if(g_user!='' && g_pass!='')
    {
       
        try
        {
            <%
            	if(log_id!=null&&log_id.trim().length()>0){
            %> 
        	$.ajax({
				url:'http://127.0.0.1:19017/',
				type:'POST',
				data:'{"type":"createFolder"}',
				async:false,
				timeout:3000,
				success:function(resp){
					var respObj = JSON.parse(resp);
					g_savePath=respObj['fullpath'];
					folder = respObj['folder'];
				},
				error:function(){
					alert('创建本地录像目录失败,请手动上传');
					g_savePath='C:\\';
				}
			});
        	<%
            	}
        	%>
            //fso = new ActiveXObject("Scripting.FileSystemObject");
			//try{
				//fso.GetFolder("D:\\abc1");
				//g_savePath='D:\\abc1\\';
				OnPlay();
			//}catch(e){
				//fso.CreateFolder ("D:\\abc1");
			
			
				//waitIntervalId = window.setInterval('waitFolder()',500);
			//}
			
			
			
           
        }catch(eevv){}
    }
    
}



//InitPage();
window.onload=InitPage;
</script>
<%}%>
</body>
</html>