// JavaScript Document
var defaultptzport=8091;// 默认端口
var defaultucport=556;// 视频默认端口,uc port 555
var lastPtzInfoStr="";

var bhaveReportStatue=false;//  是否已上报过状态报告  
var strLastRecvP2pInfo="";
var timefor_report_timeout=0;

function OnRecvP2PInfo(str)
{
	strLastRecvP2pInfo=str;
	return true;
}

function OnReportCallBack(data)
{
	return true;
}

// 上传报告  
function PostStatusReport(constat)
{
	if(!bhaveReportStatue)
	{
		var reportrequrl="http://r1.seetong.com/report/postreport.php?fromsid=209&constat="+constat+"&"+strLastRecvP2pInfo+"&t="+new Date().getTime();
		var adddata=new Array();
		try
		{
			$.ajax({ 
				async:false, 
				url: reportrequrl, 
				type: "GET", 
				dataType: 'jsonp', 
				jsonp: '_report_data_', 
				data: adddata, 
				timeout: 5000, 
				beforeSend: function()
				{ 
					// 
				}, 
				success: function (json)
				{
					//				
				}, 
				complete: function(XMLHttpRequest, textStatus)
				{ 
					
				},
				error: function(xhr)
				{ 
					//
				} 
			}); 
		}catch(eevv){}
		bhaveReportStatue=true;
	}
	try
	{
		if(timefor_report_timeout)
		{
			window.clearTimeout(timefor_report_timeout);
		}
	}catch(eevv){}
}



function TimeOutReport()
{
	PostStatusReport(0);
}



function RestartReportTimer()
{
	try
	{
		if(timefor_report_timeout)
		{
			window.clearTimeout(timefor_report_timeout);
		}
		timefor_report_timeout=window.setTimeout(function (){TimeOutReport();},30*1000);
	}catch(eevv){}
}




function HideItem(idv)
{
    try
    {
        var obj=document.getElementById(idv);
        obj.style.display='none';
    }
    catch(eevv)
    {
    
    }
}

function ShowItem(idv)
{
    try
    {
        var obj=document.getElementById(idv);
        obj.style.display='block';
    }
    catch(eevv)
    {
    
    }
}

function HideItemList(idls)
{
    var ls=idls.split(",");
    var ilen=ls.length;
    if(ilen==1)
    {
        HideItem(idls);        
    }
    else 
    {
        for(var idx=0;idx<ilen;idx++)
        {
            HideItem(ls[idx]);        
        }    
    }
    return true;
}


function ShowItemList(idls)
{
    var ls=idls.split(",");
    var ilen=ls.length;
    if(ilen==1)
    {
        ShowItem(idls);        
    }
    else 
    {
        for(var idx=0;idx<ilen;idx++)
        {
            ShowItem(ls[idx]);        
        }    
    }
    return true;
}



//ptz_onlymove 时，只保留移动功能，去掉其它功能
function OnChangeAbilityInfo(info)
{
	if(info=="")
	{
		return true;
	}
	if(info.replace("ptz_control")==info)
	{
        HideItemList("ptz_adv_actiontalbe,show_ptz_advaction_tbody,ptz_movetable,preset_tbody_id");
	    ShowItemList("preset_tbody_id_onlybuffer");
	}
	else
	{
        ShowItemList("ptz_movetable,preset_tbody_id");
		HideItemList("preset_tbody_id_onlybuffer");
		if(info.replace("ptz_onlymove")==info)
		{
            		ShowItemList("ptz_adv_actiontalbe,show_ptz_advaction_tbody");
		}
		else
		{
            		HideItemList("ptz_adv_actiontalbe,show_ptz_advaction_tbody"); 
		}
	}
	
	if(info.replace("front_replay")==info)
	{
		HideItemList("playbackli_id");
	}
	else
	{
		ShowItemList("playbackli_id");
	}

	if(info.replace("audio_support")==info)
	{
		HideItemList("Talkback");
	}
	else
	{
		ShowItemList("Talkback");
	}
}





function OnGetSaveDir()
{
	try
	{
		var playobj=document.getElementById('CloudPlayerCtrl');
		var savedir=playobj.GetSaveDir(); 
		if(savedir!="")
		{
			var padir=document.getElementById("showdirdiv");
			padir.title=savedir;
			padir.innerText=savedir;
			g_savePath=savedir;
		}
	}catch(eevv){}
}
 
function OnCapture()
{
	try
	{
		var playobj=document.getElementById('CloudPlayerCtrl');
		var nRet=playobj.SnapShot(g_savePath,1); 
		if(nRet<0)
		{
			var caperror=GetLang("SnapShot_error","抓图失败，请先播放然后再抓拍!");
			ShowAlarmForm('',caperror);
		}
		else
		{
			ShowAlarmForm('','');
		}
	}catch(eevv){}
}
    
	
	
function ShowErrorTip(titlemsg,msg)
{
    try
    {
        document.getElementById("tipinfo_div").innerHTML=msg;
    }
    catch(eevv)
    {
        try
        {
            document.getElementById("tipinfo_div").setAttribute("nnerHTML",msg);
        }
        catch(vv){}
    }
}


function OnRecord()
{
	try
	{
		var playobj=document.getElementById('CloudPlayerCtrl');
		if(g_RecordFlash)
		{
			playobj.StopRecord();
			g_RecordFlash=false;
		}
		else
		{
			var nRet=playobj.StartRecord(g_savePath,1800); 
			
			if(nRet==-100)
			{
				var record_pathfull=GetLang("record_pathfull","录像失败，存储目录空间小于2G无法录像!");
				ShowAlarmForm('',record_pathfull);
			}
			else if(nRet!=0)
			{
				var record_notplayer=GetLang("record_notplayer","录像失败，请先播放然后再录像!");
				ShowAlarmForm('',record_notplayer);
			}
			else
			{
				g_RecordFlash=true;
				ShowAlarmForm('','');
			}
		}
	}catch(eevv){}
}
           
 
 
function SendPtzCmd(cmd)
{
	try
	{
		var playobj=document.getElementById('CloudPlayerCtrl');
		playobj.WriteAUXString("PTZ_CONTROL_MESSAGE","PTZ_CMD","0",cmd);
	}catch(eevv){}
}

 

function hiddenAlarmForm()
{
	try
	{
		var msgobj=document.getElementById("alarmFormMsg"); 
		msgobj.innerHTML="&nbsp;";  
		msgobj=document.getElementById("alarmtitle"); 
		msgobj.innerHTML="&nbsp;";  
	}catch(e){}
}
 
 
 
 
var lastTimeHand=0;
function ShowAlarmForm(strtitle,str)
{ 
	try
	{	
		var msgobj=document.getElementById("alarmFormMsg"); 
		msgobj.innerHTML=str;  
		msgobj=document.getElementById("alarmtitle"); 
		msgobj.innerHTML=strtitle;  
		if(lastTimeHand!=0)window.clearTimeout(lastTimeHand);
		lastTimeHand=window.setTimeout("hiddenAlarmForm()",5000);
	}catch(e){}
}
 
 
 
//如果密码错误时，则显示输入密码的窗口
function ShowLoginForm()
{
	var logintalbe=document.getElementById("login_table"); 
	var playtalbe=document.getElementById("play_table"); 
	playtalbe.style.display="none";
	logintalbe.style.display="block";
}
 
 
 
 

function DownloadCtrl()
{
     window.location="IPCConfig.exe?version=1.4.0.1.exe";
}
		    
		    
 
 

function InitCheckVersion()
{
    var verseionerror = GetLang("htmllogin_ctrlversionerror");
    var version="v=1.0.0.23";//GetCtrlVersion();    
    var pubversion="v=1.0.0.23";    
	
    if(version!=pubversion)
    {
        var nowvls=version.split(".");
        var pubvls=pubversion.split(".");
        if(nowvls[0]!=pubvls[0] || nowvls[1]!=pubvls[1])
        {// 要求强制安装 
            return verseionerror;
        }
        else
        {//不提示版本可能不兼容，直接让他使用。
	        //ShowErrorTip("",verseionerror);
	    }
    }
    else
    {
	    ShowErrorTip("","");
    }
    return "";
}


 




function DoLogin()
{
    ShowErrorTip("","");
    var errormsg=checkdataUserName("");
    if(errormsg=="")
    {
        CheckAndLogin();
        var userlogin_waitinfo=GetLang("userlogin_waitinfo");
        ShowErrorTip(userlogin_waitinfo);
    }
    else
    {
        ShowErrorTip("",errormsg);
    }
}



function ChangeItem(idx,obj,objvalue)
{
    var KeyID = (window.event) ? event.keyCode : e.keyCode;
    if (KeyID != 9)
    {
        return false;
    }
    if(idx==1)
    {
        if(objvalue!="")
        {
		    document.getElementById("password").focus();
        }
        else
        {
	        document.getElementById("username").focus();
	    }
    }
    else if(idx==2)
    {
        if(objvalue!="")
        {
            document.getElementById("LoginButton").focus();  
        }
        else
        {
		    document.getElementById("password").focus();
	    }
    }
    else
    {
        document.getElementById("username").focus();
    }
}







    function SendCmdWithSpeed(obj)
    {
        var tspeed ="5";
		var pspeed="5";
		try
		{
			tspeed=document.getElementById("TSpeed").text;
			pspeed = document.getElementById("PSpeed").text;
		}catch(eevv){}		
        var cmddata="<xml><cmd>"+obj.id+"</cmd><panspeed>"+pspeed+"</panspeed><tiltspeed>"+tspeed+"</tiltspeed></xml>";
        SendPtzCmd(cmddata);
    }
    
    function SendCmdByNameWithnoSpeed(cmdname)
    {
        var cmddata="<xml><cmd>"+cmdname+"</cmd></xml>";
        SendPtzCmd(cmddata);
    }
     
    function SendCmdWithnoSpeed(obj)
    {
        SendCmdByNameWithnoSpeed(obj.id);
    }
    
	
    function OnIrisOpenAutoOff(obj) 
    {
         SendCmdByNameWithnoSpeed("IrisOpenAutoOff");
    }
    
            
    function OnIrisCloseAutoOff(obj) 
    {
         SendCmdByNameWithnoSpeed("IrisCloseAutoOff");
    }
    
    function OnFocusFarAutoOff(obj)
    {
         SendCmdByNameWithnoSpeed("FocusFarAutoOff");
    }
    
    function OnFocusNearAutoOff(obj)
    {
         SendCmdByNameWithnoSpeed("FocusNearAutoOff");
    }
    
    function OnPtzControl(obj)
    {
         SendCmdWithSpeed(obj);
    }
   
    function OnPtzStop()
    {
        SendCmdByNameWithnoSpeed("stop");
    }
 
 
	function SendObjValueCmd(idvalue)
	{
		var cmdname=$(idvalue).val();
		SendCmdByNameWithnoSpeed(cmdname);
	}


 
    
    function scfEvent(nCode)
    {//call back function 
		
    }
    
    
    
    function PlayVideoStream(nstream)
    {
        try
        {
            DisplayVideo("IDPlayPict",nstream,scfEvent);
        }
        catch(eee)
        {
            ShowError(eee);
        }
    }
    
    
	var IntervalID=0;
    function OnStateChange()
    {
         if (g_RecordFlash)
         {
            var varRecord = document.getElementById("RealRecord");
            var bgimagew = varRecord.getAttribute("bgimagewidth");
            if (bgimagew == 47)
            {
                varRecord.setAttribute("bgimagewidth", 92);
            }
            else
            {
                varRecord.setAttribute("bgimagewidth", 47);
            }
            var height=varRecord.getAttribute("bgimagewidth");
            varRecord.style.backgroundPosition="0px -"+height+"px";
         }
         
         if (g_TalkbackFlash)
         {
            var varTalkback = document.getElementById("Talkback");
            var bgimagew = varTalkback.getAttribute("bgimagewidth");
            if (bgimagew == 47)
            {
                varTalkback.setAttribute("bgimagewidth", 92);
            }
            else
            {
                varTalkback.setAttribute("bgimagewidth", 47);
            }
            var height=varTalkback.getAttribute("bgimagewidth");
            varTalkback.style.backgroundPosition="0px -"+height+"px";
         }
    }
    
		
	function SelectValue(obj) 
    {
        for(var i=0; i<obj.length; i++)
        {
           if (obj.options[i].selected == true)
           { 
                obj.text = obj.options[i].text;
                break;
           }
        }
    }
    
    
    
    function CheckSpeed(obj, vaMin, vaMax)
    {       
        if (isNaN(obj.value))
        {
           
                if (obj.id == "PresetEdit")
                {
                    alert(GetLang("PlayerTips4"));
                }
                else   if (obj.id=="TSpeed" || obj.id=="PSpeed")
                {
                  alert(GetLang("PlayerTips2"));
                }
              obj.setAttribute("value", "");
              obj.focus();
              return false;
        }
        
        if (obj.value<vaMin || obj.value>vaMax)
        {   
                if (obj.id == "PresetEdit")
                {
                   alert(GetLang("PlayerTips3")+"["+vaMin+"-"+vaMax+"]");
                }
                else   if (obj.id=="TSpeed" || obj.id=="PSpeed")
                {
                    alert(GetLang("PlayerTips1")+"["+vaMin+"-"+vaMax+"]");
                }
           
            obj.setAttribute("value", "5");
            obj.focus();
            return false;
        }
        return true;
    }
    
    
 
    
	function ChangePresetNode(obj,toid)
	{
		try
		{
			document.getElementById(toid).value=obj.value;
			document.getElementById("inputgotopreset2").value=obj.value;
		}catch(eevv){}
	}

	
    function OnPresetListChange(strlist)
    {
        var objitem=document.getElementById("Call_PresetListChkBox");
        ChangePresetNode(objitem,"inputgotopreset2");
    }


	 
	function OnStop()
	{
		try
		{
			g_RecordFlash=false;
			var playobj=document.getElementById('CloudPlayerCtrl');
			var nRet=playobj.StopPlayP2PVideo(); 
			g_IsPlaying=0;
		}catch(eevv){}
	}
	
	 
	
	 
	function OnChangeBufferTick(va)
	{
		va=parseInt(va);
		if(va==NaN || va=="" || va<=0)
		{
			va=50;
		}
		var bufcount=Math.floor((va+500)/30);//30帧计
		try
		{
			var playobj=document.getElementById('CloudPlayerCtrl'); 
			var ret=playobj.SetBufferTick(va,bufcount);
		}catch(eevv){}
		SetCookie('player_buffertick',va);
		return ret;
	}
	
	
	function LoadDefaultBufferTick()
	{
		var str=GetCookie('player_buffertick');
		if(str=="" || str==null)
		{
			return false;
		}
		var va=parseInt(str);
		if(va!=NaN)
		{
			document.getElementById('bufferTick').value=va;
			return true;
		}
		return false;
	}
	
	
	
	
	function OnPlay()
	{
		var va=document.getElementById('bufferTick').value;
		OnChangeBufferTick(va);
		var streamty=document.getElementById('idChangeStream');
		var tid=streamty.value;
		OnChangeStream(tid);
		//RestartReportTimer();
	}
 
 
	 function OnPlayBack()
	 {
		try
		{
			var playobj=document.getElementById('CloudPlayerCtrl'); 
			playobj.OpenPlayBackDlg(0);
		}catch(eevv){}
	 }
 
 
 
	 function OnConfig()
	 {
		try
		{
			var playobj=document.getElementById('CloudPlayerCtrl'); 
			playobj.OpenConfigDlg(0);
		}catch(eevv){}
	 }
 
 	
	
 	function OnTalk()
	{		
		try
		{
			var playobj=document.getElementById('CloudPlayerCtrl'); 
			if(g_TalkbackFlash)
			{
				g_TalkbackFlash=false;
				playobj.StartAudio(0);
			}
			else
			{
				g_TalkbackFlash=true;
				playobj.StartAudio(1);	
			}
		}catch(ee){}
	}
 
 
	
	function OnChangeStream(va)
	{
		if(va==-1)
		{
			va=1;
		}
		OnPlayStream(va);
	}
	 
	 
	function OnChangeLangSel(va)
	{
		SetDefaultLang(va); 
		InitPageLang('ipc_html',document);
		ShowErrorTip("","");
	}
	 
	
	 
	function UnInitPage()
	{   
		window.clearInterval(IntervalID);
		try
		{
			var playobj=document.getElementById('CloudPlayerCtrl');
			var nRet=playobj.StopPlay(); 
		}catch(e){}
	}
	 
	 
	function checkdataUserName(thf)
	{
		var Tips1 = GetLang("LoginTips1");
		var Tips2 = GetLang("htmllogin_passisempty");
		if(document.getElementById("username").value=="")
		{
			document.getElementById("username").value="";
			document.getElementById("username").focus();
			return Tips1;
		}
		else if(document.getElementById("password").value=="")
		{
			document.getElementById("password").focus();
			return Tips2;
		}
		var checkversionerror=InitCheckVersion();
		if(checkversionerror!="")
		{
			return checkversionerror;
		}
		return "";
	}
	
	
	function CheckEnter(id,val)
	{
		if(val=="")
		{
			return false;
		}
		var KeyID = (window.event) ? event.keyCode : e.keyCode;
		if(KeyID==10 || KeyID==13 )
		{
			var un = document.getElementById("username");
			var pw = document.getElementById("password");
			if(un.value=="")
			{
				un.focus();
			}
			else if(pw.value=="")
			{
				pw.focus();
			}
			else 
			{
				DoLogin();
			}
		}
	}
	
	
function OnLogout()
{
	try
	{
		var playobj=document.getElementById('CloudPlayerCtrl');
		var nRet=playobj.StopWithOutWait(); 
		var nRet=playobj.StopPlay(); 
		var nRet=playobj.StopPlayP2PVideo(); 
		try{playobj.Logout();}catch(eevv){}
	}catch(e){}
	g_IsPlaying=false;
	g_TalkbackFlash=false;
	g_RecordFlash=false;
	ShowLoginForm();
	ShowErrorTip("","");
}

	
	

function ShowConnectType(isP2P)
{
	if(isP2P==0)
	{
		//$("#cfgli_id,#cfgli_playback,#Talkback").show();
		$("#cfgli_id,#cfgli_playback,#Talkback").hide();
	}
	else
	{
		$("#cfgli_id,#cfgli_playback,#Talkback").hide();
	}
}
	
	
	
	
	
	
function addItem(value,itemMsg,call_preset)
{
	try
	{
		call_preset.options[call_preset.length]=new Option(itemMsg,value);	
		return ;
	}catch(e){}
}

	
	
function ShowPresetInfo(PresetList,callid,delid)
{
	
	try
	{	
		var call_preset=document.getElementById(callid);
		var clear_goto=document.getElementById(delid);
		var delid=clear_goto.selectedIndex;
		var calid=call_preset.selectedIndex;
		try
		{
			call_preset.length=0;
			clear_goto.length=0;
		}catch(eee){}
		var listarray = PresetList.split("^");
		var presetnum = parseInt(listarray[0]);
		var bhour;
		var bmin;
		var ehour;
		var emin;
		for(var i=0;i<presetnum;i++)
		{
			var tmparray = listarray[i+1].split("#");
			if(tmparray.length==2)
			{
				var posnum = parseInt(tmparray[0]);
		
				var bpos = 0;
				var epos = tmparray[1].indexOf(':');
				bhour = parseInt(tmparray[1].substring(bpos,epos),10);
				
				bpos = epos+1;
				epos = tmparray[1].indexOf('-',bpos);
				bmin = parseInt(tmparray[1].substring(bpos,epos),10);
						    
				bpos = epos+1;
				epos = tmparray[1].indexOf(':',bpos);
				ehour = parseInt(tmparray[1].substring(bpos,epos),10);			
				
				bpos = epos+1;
				epos = tmparray[1].length;
				emin = parseInt(tmparray[1].substring(bpos,epos),10);
				var msgstr = tmparray[0]+'#'+bhour+'-'+ehour;
				var valuestr = tmparray[0];
				addItem(listarray[i+1],listarray[i+1],clear_goto);
				if(((tmparray[0].charAt(0)!='s')&&(tmparray[0].charAt(0)!='o')))
				{
					addItem(listarray[i+1],msgstr,call_preset);
				}			
			}
			else
			{
				tmp = parseInt(listarray[i+2]);
				addItem(listarray[i+1],listarray[i+1],call_preset);
				addItem(listarray[i+1],listarray[i+1],clear_goto);
			}
		}
		PresetList = "";
		try
		{
			if(delid<0)delid=0;
			if(calid<0)calid=0;
			clear_goto.selectedIndex=delid;
			call_preset.selectedIndex=calid;
		}catch(eee){}
		return true;
	}
	catch(eee)
	{
		return false;
	}
}






		
function timeInStr(time,str)
{
	try
	{
		var ls1=str.split('#');
		if(ls1.length!=2)return false;
		var ls2=ls1[1].split('-');
		if(ls2.length!=2)return false;
		ls2[0]=ls2[0].replace(/:/g,"");
		ls2[1]=ls2[1].replace(/:/g,"");
		time2=time.replace(/:/g,"");
		if(parseInt("1"+ls2[0])<=parseInt("1"+time2) && parseInt("1"+ls2[1])>=parseInt("1"+time2))
		{
			return true;
		}
	}catch(eee){}
	return false;
}


function isTimeFormat(str)
{
	try
	{
		var ls=str.split(':');
		if(ls.length!=2)
		{
			return false;
		}
		if(str.replace(/[0-9]/g,"")!=":")
		{
			return false;
		}
		if(Math.abs(ls[0])<0 ||  Math.abs(ls[0])>23)return false;
		if(Math.abs(ls[1])<0 ||  Math.abs(ls[1])>59)return false;
		return true;
	}catch(eee)
	{
	}
	return false;
}



function CheckTimeFormat(str)
{
	try
	{
		if(str.length>5){return "";}
		var ls=str.split(':');
		if(ls.length!=2)
		{
			return "";
		}
		if(str.replace(/[0-9]/g,"")!=":")
		{
			return "";
		}
		if(Math.abs(ls[0])<0 ||  Math.abs(ls[0])>23)return "";
		if(Math.abs(ls[1])<0 ||  Math.abs(ls[1])>59)return "";
		if(str.length==5){return str;}
		var retstr="";
		if(ls[0].length==2)
		{
			retstr=retstr+ls[0];
		}
		else
		{
			retstr=retstr+"0"+ls[0];
		}
		retstr=retstr+":";
		if(ls[1].length==2)
		{
			retstr=retstr+ls[1];
		}
		else
		{
			retstr=retstr+"0"+ls[1];
		}
		if(retstr.length!=5){return "";}
		return retstr;
	}catch(eee)
	{
	}
	return "";
}



				
function CheckdataPreset(str,chtype,delid)
{
		try
		{
			var errinfo=GetLang("err_advpreset_fromat_error","输入格式错误，正确格式应如：{type}1#00:01-02:02!");
			errinfo=errinfo.replace("{type}",chtype);
			var i=0;
			var list=str.split('#');
			if(list.length!=2)
			{
				return errinfo;
			}			
			var itempresetval="";
			if(chtype=="")
			{
				itempresetval=list[0];
			}
			else
			{
				itempresetval=list[0].substr(1);
			}
			var pval=parseInt(itempresetval);
			if(pval==isNaN || pval<1 || pval>8)
			{
				errinfo=GetLang("err_advpreset_value_error","输入{presetval}错误，规则值应该在{type1}1至{type2}8之间整数!");
				errinfo=errinfo.replace("{presetval}",list[0]);
				errinfo=errinfo.replace("{type1}",chtype);
				errinfo=errinfo.replace("{type2}",chtype);
				return errinfo; 
			}
			var list2=list[1].split('-');
			if(list2.length!=2)
			{
				return errinfo;
			}
			list2[0]=CheckTimeFormat(list2[0]);
			list2[1]=CheckTimeFormat(list2[1]);
			if(list2[0]=="" || list2[1]=="")
			{
				return errinfo;
			}
			if(!isTimeFormat(list2[1]) || !isTimeFormat(list2[0]))
			{
				return errinfo;
			}			
			if(	Math.abs("1"+list2[0].replace(/:/g,""))>=Math.abs("1"+list2[1].replace(/:/g,""))	)
			{
				errinfo=GetLang("err_advpreset_timefromat_error","开始时间应该小于结束时间!");
				return errinfo; 
			}
								
			var del_preset=document.getElementById(delid);
			for(i=0;i<del_preset.options.length;i++)
			{
				var vl=del_preset.options[i].value.toLowerCase();
				var chartypeInfo=""+vl.charAt(0);
				chartypeInfo=chartypeInfo.replace(/[0-9]+/g,"");
				var needcheck=true;
				if(chartypeInfo=="" && chtype!="")
				{
					needcheck=false;
				}
				else  if(chartypeInfo!="" && chtype=="")
				{
					needcheck=false;
				}
				if(needcheck)
				{
					if(timeInStr(list2[0],vl) || timeInStr(list2[1],vl))
					{
						errinfo=GetLang("err_advpreset_timeiscross","此时间段与当前设置{presetinfo}有冲突!"); 
						errinfo=errinfo.replace("{presetinfo}",vl);
						return errinfo;				
					}	
				}
			}
			return "";
		}catch(eee){}
		errinfo=GetLang("preset_formaterror_tip","预置点格式错误!"); 
		return errinfo;
}



function DOdelpre(str)
{
	try
	{
		 str=""+str;
		 str=str.toLowerCase();
		 var cmd=""
		 var tmp="";
		 if(str=="")return false;
		 var id="";
		 switch(str.charAt(0))
		 {
			case 's':
				cmd="DelOrbit";
				id=str.substr(1);
				if((Math.abs(id)<1)||(Math.abs(id)>8))
				{
					return false;
				}
				break;
			case 'o':
				cmd="DelScan";
				id=str.substr(1);
				if((Math.abs(id)<1)||(Math.abs(id)>8))
				{
					return false;
				}
				break;
			default:
				cmd="clearpreset";
				var ls=str.split('#');
				if(ls.length>1)
				{
					id=ls[0];
				}
				else
				{
					id=str;
				}
				break;
		 }
		var	tmp = '<xml>\n'+'<cmd>'+cmd+'</cmd>\n'+'<preset>'+id+'</preset>\n'+'</xml>';
		SendPtzCmd(tmp);		
	}catch(eee){}
}
 

function DOaddpre(str,delselid)
{		
	try
	{
		str=""+str;
		str=str.toLowerCase();
		var flag=1;
		var cmd="setpreset"
		var tmp="";
		switch(str.charAt(0))
		{
			case 's':
				var checkinfo=CheckdataPreset(str,'s',delselid);
				if(checkinfo!="")
				{
					alert(checkinfo);
					return false;
				}
				cmd="SetOrbit";
				var ls1=str.split('#');
				var ls2=ls1[1].split('-');
				var preset=ls1[0].replace(/[^0-9]/g,"");
				tmp="<xml>\n<cmd>"+cmd+"</cmd><preset>"+preset+"</preset><flag>"+flag+"</flag><r><b>"+ls2[0]+"</b><e>"+ls2[1]+"</e></r></xml>\n";
				break;
			case 'o':
				var checkinfo=CheckdataPreset(str,'o',delselid);
				if(checkinfo!="")
				{
					alert(checkinfo);
					return false;
				}
				cmd="SetScan";
				flag = 1;
				var ls1=str.split('#');
				var ls2=ls1[1].split('-');
				var preset=ls1[0].replace(/[^0-9]/g,"");
				tmp="<xml>\n<cmd>"+cmd+"</cmd><preset>"+preset+"</preset><flag>"+flag+"</flag><r><b>"+ls2[0]+"</b><e>"+ls2[1]+"</e></r></xml>\n";
				break;
			default:
				var ipstr=str.split("#");
				if(ipstr.length==2)
				{//定时归位
					var checkinfo=CheckdataPreset(str,"",delselid);
					if(checkinfo!="")
					{
						alert(checkinfo);
						return false;
					}
					cmd="setpreset";
					flag = 1;
					var ls1=str.split('#');
					var ls2=ls1[1].split('-');
					var preset=ls1[0].replace(/[^0-9]/g,"");
					tmp="<xml>\n<cmd>"+cmd+"</cmd><preset>"+preset+"</preset><flag>"+flag+"</flag><r><b>"+ls2[0]+"</b><e>"+ls2[1]+"</e></r></xml>\n";
				}
				else
				{			
					var presetval=parseInt(str);	
					if(str.replace(/[0-9]/g,"")!="" || presetval==isNaN || Math.abs(str)>255 || Math.abs(str)<=0)
					{
						var errinfo=GetLang("err_preset_number_only1to255","预置点只能为1至255之间的整数!");
						alert(errinfo);
						return false;
					}
					cmd="setpreset";
					preset=Math.abs(str);
					tmp="<xml>\n<cmd>"+cmd+"</cmd><preset>"+preset+"</preset><flag>"+flag+"</flag></xml>\n";
				}
				break;
		}
		SendPtzCmd(tmp);
		return true;
	}catch(eee){}
	return false;	
}




var timefor_getlast_preset=0;
function AutoGetPreset()
{
	if(timefor_getlast_preset!=0)
	{
			window.clearTimeout(timefor_getlast_preset);
			timefor_getlast_preset=0;
	}
	SendPtzCmd("<xml>\n<cmd>GetPresetList</cmd>\n</xml>");
	timefor_getlast_preset=window.setTimeout(function(){AutoGetPreset();},1000);
}








function OnIPCStateChange()
{
	 if (g_RecordFlash)
	 {
		var varRecord = document.getElementById("RealRecord");
		var bgimagew = varRecord.getAttribute("bgimagewidth");
		if (bgimagew == 47)
		{
			varRecord.setAttribute("bgimagewidth", 92);
		}
		else
		{
			varRecord.setAttribute("bgimagewidth", 47);
		}
		var height=varRecord.getAttribute("bgimagewidth");
		varRecord.style.backgroundPosition="0px -"+height+"px";
	 }
	 else
	 {
		var varRecord = document.getElementById("RealRecord");
		var bgimagew = varRecord.getAttribute("bgimagewidth");
		if (bgimagew != 47)
		{
			varRecord.setAttribute("bgimagewidth", 47);
			var height=varRecord.getAttribute("bgimagewidth");
			varRecord.style.backgroundPosition="0px -"+height+"px";
		}
	 }
	 
	 if (g_TalkbackFlash)
	 {
		var varTalkback = document.getElementById("Talkback");
		var bgimagew = varTalkback.getAttribute("bgimagewidth");
		if (bgimagew == 47)
		{
			varTalkback.setAttribute("bgimagewidth", 92);
		}
		else
		{
			varTalkback.setAttribute("bgimagewidth", 47);
		}
		var height=varTalkback.getAttribute("bgimagewidth");
		varTalkback.style.backgroundPosition="0px -"+height+"px";
	 }
	 else
	 {
		var varTalkback = document.getElementById("Talkback");
		var bgimagew = varTalkback.getAttribute("bgimagewidth");
		if (bgimagew != 47)
		{
			varTalkback.setAttribute("bgimagewidth", 47);
			var height=varTalkback.getAttribute("bgimagewidth");
			varTalkback.style.backgroundPosition="0px -"+height+"px";
		}
	 }
	 
	 if (g_IsPlaying)
	 {
		var varPlayRealVideo = document.getElementById("PlayRealVideo"); 
		if($(varPlayRealVideo).attr("isselected")!=="true") 
		{
			$(varPlayRealVideo).attr("isselected","true");
			var height=92;
			varPlayRealVideo.style.backgroundPosition="0px -"+height+"px";
		}
	 }
	 else
	 {
		var varPlayRealVideo = document.getElementById("PlayRealVideo"); 
		if($(varPlayRealVideo).attr("isselected")==="true")  
		{
			$(varPlayRealVideo).attr("isselected","");
			varPlayRealVideo.style.backgroundPosition="0px 0px";
		}
	 }
}



	
function DoOnPlayEvent(nEvnetType,nTypeID,Info)
{
	if(nTypeID==70 && nEvnetType==70)
	{
		try{OnChangeAbilityInfo(Info);}catch(eevv){}
		
	}
	switch(nEvnetType)
	{
		case 21:
		{//ptz info
			
			if(lastPtzInfoStr==Info || Info=="" || Info==null || Info==undefined){return true;}
			Info=Info.replace(/[\r\n\b ]+/g,"");
			if(Info==""){return true;}
			lastPtzInfoStr=Info;
			ShowPresetInfo(Info,'Call_PresetListChkBox','Del_PresetListChkBox');
			if(timefor_getlast_preset!=0){window.clearTimeout(timefor_getlast_preset);timefor_getlast_preset=0;}
			
		}
		break;		
		case 1:
		{//connect ok 
				var connectstate=GetLang("connect_state_tip","连接状态");
				var stateinfo=GetLang("connect_state_connecting","正在连接中...");
				//ShowAlarmForm(connectstate,stateinfo);
		}
		break;
		case 2:
		case 3:
		{//connect fail
				var connectstate=GetLang("connect_state_tip","连接状态");
				var stateinfo=GetLang("connect_state_connect_faile","连接失败!");
				//ShowAlarmForm(connectstate,stateinfo);
				if(!g_useP2PConnect  && g_isFirstAutoLogin)
				{
					var connectstate=GetLang("connect_state_tip","连接状态");
					var stateinfo=GetLang("connect_state_connect_faile_usep2p","使用UNPN连接失败，切换成P2P连接...");
					g_useP2PConnect=true;
					g_isFirstAutoLogin=false;
					OnLogin();
				}
		}
		break;
		case 4:
		{
				var connectstate=GetLang("connect_state_tip","连接状态");
				var stateinfo=GetLang("connect_login_ok","登录成功!");
				//ShowAlarmForm(connectstate,stateinfo);
		}
		break;
		case 31:
		case 5:
			{
				OnLogout();
				var usernameerror=GetLang("LoginTips2","用户或密码错误!");
				ShowErrorTip("",usernameerror);
				g_IsPlaying=0;
				g_TalkbackFlash = 0;
				g_RecordFlash=0;
			}
			break;
		case 6:
			{//start talk ok
				 g_TalkbackFlash = 1;
			}
			break;
		case 8:
			{// stop talk  
				g_TalkbackFlash = 0;
			}
			break;
		case 23:
		{
			if(Info!="")
			{
				var alarmtitle=GetLang('tip_alarmtitle','Alarm Info');
				var ls=Info.split("\r\n");
				var showmsg="";//ls[0]+"<br/>";
				var alarmtypeinfo=GetAlarmInfoByID(nTypeID);
				showmsg=showmsg+alarmtypeinfo;
				if(alarmtypeinfo!="")
				{
					ShowAlarmForm(ls[0],alarmtypeinfo);
				}
			}
		}
		break;	
		case 24:
			{// start play video 
				g_IsPlaying=1;
				
			 }
			 break;
		case 42:
			{//start record 
				g_RecordFlash=1;
			}
			break;
		case 43://record error
		case 44://record finish
			{//stop record or record error
				g_RecordFlash=0;
			}
			break;
		case 28:
		case 10001:
			{// 手工停止视频流  
				g_IsPlaying=0;
				g_TalkbackFlash = 0;
				g_RecordFlash=0;
			}
			break;

		case 59:
		{//connect ok 
				var connectstate=GetLang("connect_state_tip","连接状态");
				var stateinfo=GetLang("EVNET_INITP2P_OK","初始化P2P成功,连接中...");
				ShowAlarmForm(connectstate,stateinfo);
		}
		break;
		case 60:
		{//connect ok 
				var connectstate=GetLang("connect_state_tip","连接状态");
				var stateinfo=GetLang("EVNET_INITP2P_ERROR","初始化P2P失败!");
				ShowAlarmForm(connectstate,stateinfo);
		}
		break;
		case 61:
		{//connect ok 
				var connectstate=GetLang("connect_state_tip","连接状态");
				var stateinfo=GetLang("EVENT_START_CONNECT_DEVICE","连接设备中...");
				ShowAlarmForm(connectstate,stateinfo);
		}
		break;
		case 62:
		{//connect ok 
				var connectstate=GetLang("connect_state_tip","连接状态");
				var stateinfo=GetLang("EVENT_START_CONNECT_DEVICE_ERROR","连接设备中失败!");
				ShowAlarmForm(connectstate,stateinfo);
		}
		break;
		case 63:
		{//connect ok 
				var connectstate=GetLang("connect_state_tip","连接状态");
				var stateinfo=GetLang("EVENT_P2PSERVER_LOGIN_OK","登陆P2P服务器成功!");
				ShowAlarmForm(connectstate,stateinfo);
		}
		break;
		case 64:
		{//connect ok 
				var connectstate=GetLang("connect_state_tip","连接状态");
				var stateinfo=GetLang("EVENT_P2PSERVER_LOGOUT","登陆P2P服务器失败!");
				ShowAlarmForm(connectstate,stateinfo);
		}
		break;
		case 65:
		{//connect ok 
				var connectstate=GetLang("connect_state_tip","连接状态");
				var stateinfo=GetLang("EVENT_P2PERROR_EVNETINFO","P2P服务返回错误代码:{error}!");
				ShowAlarmForm(connectstate,stateinfo);
		}
		break;
		case 66:
		{//connect ok 
				var connectstate=GetLang("connect_state_tip","连接状态");
				var stateinfo=GetLang("EVENT_P2PCONNECT_DEVICEOK","连接设备成功!");
				ShowAlarmForm(connectstate,stateinfo);
		}
		break;
		case 67:
		{//connect ok 
				var connectstate=GetLang("connect_state_tip","连接状态");
				var stateinfo=GetLang("EVENT_P2PCONNECT_CLOSE","连接设备断开!");
				ShowAlarmForm(connectstate,stateinfo);
		}
		break;
		case 68:
		{//connect ok 
				var connectstate=GetLang("connect_state_tip","连接状态");
				var stateinfo=GetLang("EVENT_P2P_EXIT_CONNECT","已退出P2P服务器!");
				ShowAlarmForm(connectstate,stateinfo);
		}
		break;
		case 30:
		{//  视频音频参数，说明连成功了  
			//PostStatusReport(1);
			
		}
		break;
		case 69:
		{//  抓图成功			
			ShowAlarmForm("",Info);
		}
		break;
		case 71:
		{// p2p connect event 
			OnRecvP2PInfo(Info);
			
		}
		break;
		case 72:
                {// p2p connect event
			var connectstate=GetLang("connect_state_tip","连接状态");
			var reqerror=GetLang("connect_state_reqerror","请求视频流返回失败！");
			ShowAlarmForm(connectstate,stateinfo);
                }
                break;
		case 75:
                {// p2p offline vent
                        var connectstate=GetLang("connect_state_tip","连接状态");
                        var stateinfo=GetLang("connect_offlinestate_reqerror","当前设备不在线！");
                        ShowAlarmForm(connectstate,stateinfo);
                }
                break;
	}
}


function GetXmlFileUrl()
{
	var szPort = window.location.port;
	var szProtocol = window.location.protocol;
	var szHostname = window.location.hostname;
	if(szProtocol!="http:" && szProtocol!="https:" && szProtocol!="HTTP:" && szProtocol!="HTTPS:")
	{//不是http
		g_ptz_port = defaultptzport;
		g_uc_port = defaultucport;
		return "lang/ipclang.xml";
	}
	var dateva=new Date();
	var szUrl = szProtocol+ "//" + szHostname + ":" + szPort + "/lang/ipclang.xml?v=1.0.0.23&sub=1";
	if(szPort=="" || szPort=="80")
	{
		szUrl = szProtocol+ "//" + szHostname + "/lang/ipclang.xml?v=1.0.0.23&sub=1";
	} 
	return szUrl;
}






//get ptz port value
function inner__getptzport()
{
    var vvprot = 0;
    try
    {
        var xmlHttpRequest = null; 
        if (window.XMLHttpRequest) 
        {
       
            xmlHttpRequest = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
      
    	    xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }       
        var szPort = window.location.port;
        var szProtocol = window.location.protocol;
        var szHostname = window.location.hostname;
        var dateva=new Date();
        var szUrl = szProtocol+ "//" + szHostname + ":" + szPort + "/cgi-bin/getptzport.cgi?t=" +dateva.getTime();
        xmlHttpRequest.open("GET", szUrl, false); 
        xmlHttpRequest.send(null);
        if(xmlHttpRequest.readyState==4)
	    {
		    if(xmlHttpRequest.status==200)
		    {
			    vvprot = xmlHttpRequest.responseText;
		    }
		    else		    
		    {
                vvprot = 0;
		    }
	    }
   }
   catch(e)
   {
        vvprot = 0;
   }
   return vvprot; 
}




function CheckVer()
{ 
    try
    {
		var obj=document.getElementById("CloudPlayerCtrl2");
		var versioninfo=obj.GetCtrlVersion();
        if(versioninfo=="")
        {//
             return false;
        } 
        var ls=versioninfo.split("=");
        var pubversion="1.8.0.30";
        if(ls.length>1)
        {
            var ctrlverls=ls[1].split(".");
            var pubverls=pubversion.split(".");
            for(var idx=0;idx<4;idx++)
            {
                var cval=parseInt(ctrlverls[idx],10);
                var pval=parseInt(pubverls[idx],10);
                if(cval!=pval)
                {
                    return false;
                }
            }
			return true;
        }
    }
    catch(eevv)
    {
        
    }
	return false;   
}




function isIE()
{
	try
	{
		if ( (!!(window.ActiveXObject)) || ("ActiveXObject" in window) )
		{
			return true;
		}
		else
		{
			return false;
		}
	}catch(eev){}	
	return false;
}






function WriteCloudPlayer(wv,hv)
{	
	var type="win32";
	var bswname="microsoft internet explorer";
	try
	{
		type=window.navigator.platform.toLowerCase();
		bswname=window.navigator.appName.toLowerCase();
	}catch(eevv){}
	var pubverstr="1,8,0,30";
	var isIEBro=isIE();
	if(bswname.replace("internet exp","")!=bswname || isIEBro)
	{
		if(type=="win32")
		{
			document.write('<object id="CloudPlayerCtrl" codebase="Update.exe#version='+pubverstr+'" classid="CLSID:B087FC11-45AE-46AF-923A-58008028F050"  width="'+wv+'px" height="'+hv+'px" ></object>');
		}
		else if(type=="win64")
		{
			document.write('<object id="CloudPlayerCtrl" codebase="Update.exe" classid="CLSID:DCED061C-63F3-47AA-8C49-76153C7B7602"  width="'+wv+'px" height="'+hv+'px" ></object>');
		}
		else
		{
			document.write('<object id="CloudPlayerCtrl" codebase="Update.exe#version='+pubverstr+'" classid="CLSID:B087FC11-45AE-46AF-923A-58008028F050"  width="'+wv+'px" height="'+hv+'px" ></object>');
		}
	}
	else
	{
		  document.write('<object id="CloudPlayerCtrl"  codebase="Update.exe#version=1,0,0,12" type="application/x-cloudplayer" width="'+wv+'px" height="'+hv+'px"><param name="onload" value="InitPage"/><embed type="application/x-cloudplayer"   width="'+wv+'px" height="'+hv+'px"  pluginspage="CloudPlayer.exe#version=1,0,0,12"></embed></object>');
	} 
	return 0;
}