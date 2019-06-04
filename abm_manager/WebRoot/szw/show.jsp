<%@ page language="java"  pageEncoding="UTF-8"%>
<%@ page import="com.abm.manager.util.Config" %>
<%
	String user = (String)request.getParameter("username");
	String password = (String)request.getParameter("passwd");
	String idnum = (String)request.getParameter("idnum");
	String log_id = (String)request.getParameter("id");
	String userid = (String)request.getParameter("userid");
	String url = "http://"+Config.local_ip+":"+request.getLocalPort()+request.getContextPath()+"/Video-upload.action";
 %>
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
		<meta HTTP-EQUIV="pragma" CONTENT="no-cache">
 		<meta HTTP-EQUIV="Cache-Control" CONTENT="no-cache, must-revalidate">
 		<meta HTTP-EQUIV="expires" CONTENT="0">
 		<meta http-equiv="X-UA-Compatible" content="requiresActiveX=true"/>
 		<script src="./js/jquery-1.9.1.js?v=1.0.0.19" type="text/javascript" charset="utf-8"></script>
		<script language="javascript">

			
		    /************************************************************************/
		    /* 通用接口                                                             */
		    /************************************************************************/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////			
		    /*************************************************
		    Function:        createxmlDoc
		    Description:    创建xml DOM对象
		    Input:            无
		    Output:            无
		    return:            无
		    *************************************************/
		    function createxmlDoc() {
		        var xmlDoc;
		        var aVersions = ["MSXML2.DOMDocument", "MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "Microsoft.XmlDom"];

		        for (var i = 0; i < aVersions.length; i++) {
		            try {
		                xmlDoc = new ActiveXObject(aVersions[i]);
		                break;
		            } catch (oError) {
		                xmlDoc = document.implementation.createDocument("", "", null);
		                break;
		            }
		        }
		        xmlDoc.async = "false";
		        return xmlDoc;
	
		    }
		    /*************************************************
		    Function:        parseXmlFromStr
		    Description:    从xml字符串中解析xml
		    Input:            szXml xml字符串
		    Output:            无
		    return:            xml文档
		    *************************************************/
		    function parseXmlFromStr(szXml) {
		        if (null == szXml || '' == szXml) {
		            return null;
		        }
		        var xmlDoc = new createxmlDoc();
		        if (!$.browser.msie) {
		            var oParser = new DOMParser();
		            xmlDoc = oParser.parseFromString(szXml, "text/xml");
		        } else {
		            xmlDoc.loadXML(szXml);
		        }
		        return xmlDoc;
	
		    }
			function ShowDownloadPluginHyperLink()
			{
				document.write("<a href = \"IETool.exe\"> Please click here to download and run it for Internet Explorer running propertly! </a>")
			}			
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////			
			
			
			
			
			
			/************************************************************************/
			/* 下面定义的变量根据实际情况来更改以便能够运行起该demo                 */
			/************************************************************************/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			var username="<%=user%>";
			var password = "<%=password%>";
			//var gs_strIP="192.168.0.105";	
            var did = "<%=idnum%>";		
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









			/************************************************************************/
			/* 下面的函数是对接口的使用，一个函数对应一个接口                       */
			/************************************************************************/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////				
            //下面加载的视频默认是加载主码流，和UnLoadVideo()函数成对出现
		    function ConnectP2PDev() 
		    {
                var ncx = document.getElementById("ncX");
                if (ncx == null) 
                {
                    alert("ActiveX plugin not attached");
                }
				
                ncx.AddP2PDevForGetStatus(did);

                var nRet = ncx.ConnectP2PDev(did, username, password);
                if (nRet != 0) 
                {
                    alert("ConnectP2PDev failed,nRet=" + nRet);
                }
                else 
                {
                    alert("ConnectP2PDev success");
                }
				
            }
                    

            //使用该接口可以自定义报警的图片
            //注意自定义图片的格式（保证图片的背景色是RGB(255,0,255)保证背景透明，bmp格式,大小根据用户所选的图片显示）
            function SetLocalLanaguageZH() {
                var ncx = document.getElementById("ncX");
                if (ncx == null) {
                    alert("ActiveX plugin not attached");
                }
                try {
                    ncx.SetLocalLanaguage("0804");
                }
                catch (e) {
                    alert(e.description);
                }
            }

            function SetLocalLanaguageEN() {
                var ncx = document.getElementById("ncX");
                if (ncx == null) {
                    alert("ActiveX plugin not attached");
                }
                try {
                    ncx.SetLocalLanaguage("0409");
                }
                catch (e) {
                    alert(e.description);
                }
            }
            

            //获取插件的版本
            function GetOCXVersion() {
                var ncx = document.getElementById("ncX");
                if (ncx == null) {
                    alert("ActiveX plugin not attached");
                }
                try {
                    var nRet = ncx.GetOCXVersion();
                    alert(nRet);
                }
                catch (e) {
                    alert(e.description);
                }   
            }
		var isready = false;
 
            //cab从前端设备获取完成之后会调用此函数
            function NotifyActiveX(p) {
                var ncx = document.getElementById("ncX");
                if (ncx == null) {
                    return;
                }
				
                var urla = document.URL.split('/');
                var dev = urla.length > 3 ? urla[2] : '192.168.1.10';
                var address = dev.split(':');
                try {
                    ncx.SetDevice(address[0]);      // SetDevice是控件接口，肯定存在,这是在IE10中出错的地方
                    ncx.SetURL(dev);
                }
                catch (e) {
                    document.getElementById("axdiv").style.display = "none";
                }
              	isready=true;
              	
            }
            
            function autoconnect(){
            	if(isready){
            		ConnectP2PDev();
            	}else{
            		window.setTimeout('autoconnect()',500);
            	}
            }
            
            autoconnect();
            
            
            function upload(){
                 var fileObj = document.getElementById("uploadfile").files[0];
            	var formFile = new FormData();
               formFile.append("action", "./Video-upload.action");  
               formFile.append("uploadfile", fileObj);
               formFile.append("id", $('#logid').val());
               formFile.append("accountId", $('#accountid').val());
               var data = formFile;
               $.ajax({
                   url: "./Video-upload.action",
                   data: data,
                   type: "Post",
                   dataType: "json",
                   cache: false,//上传文件无需缓存
                   processData: false,//用于对data参数进行序列化处理 这里必须false
                   contentType: false, //必须
                   success: function (resp) {
                     
							if(resp['success']){
								alert('上传成功');
							}else{
								alert('上传失败:'+resp['msg']);
							}
                   },
               }) 
            }
           
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////				
        </script>
	</head>

	<body scroll="no"  oncontextmenu="return false">
		<script language="javascript">
			var browser=navigator.appName
			var b_version=navigator.appVersion
			var version=parseFloat(b_version)
			document.write("<div id=\"axdiv\"><object id=\"ncX\" name=\"ncX\" width=\"100%\" height=\"300\" classid=\"CLSID:84ba1786-bda1-469e-8e05-f72d2ac601a3\"onReadyStateChange=\"NotifyActiveX(this)\">")
			document.write("</object></div>");
			
		</script>

		<script language="Javascript" event="EventFullScreen()" for="ncX">  
			alert("full screen");
		</script>

		<script language="Javascript" event="NotifyOpenedStreamType(code)" for="ncX">  
			alert(code);
		</script>
		<%
			if(log_id!=null&&log_id.trim().length()>0){
		%>
		<input type="file" id="uploadfile"/>
		<input type="hidden" id="logid" value="<%=log_id%>"/>
		<input type="hidden" id="accountid" value="<%=userid%>"/>
		
        <input type="button" value = "上传文件" onclick="upload()">
		  <%} %>
	</body>
</html>


