
var defaultlang="zh-cn";
var g_ptz_port = defaultptzport;
var g_uc_port = defaultucport;
var g_defaultlang=defaultlang;
var gxmlDoc=0;
var g_szLan=null;
var g_langXmlDoc = null;
var g_titleLangDoc=null;
var g_channelcount=9;
var g_langtypeid=0;
var g_RecordFlash=0;
var g_TalkbackFlash=0;
var g_ptz_port = defaultptzport;  
var g_RecordFlash=0;
var g_TalkbackFlash=0;
var g_IsPlaying=0;
var langDoc=null;
var defaultLangObject=null;
var strDefautLang="";
var g_auloginurl="";
var g_user="";
var g_pass="";
var g_initlang="en-us";
var g_useP2PConnect=false;
var g_isFirstAutoLogin=false;



String.prototype.trim= function()
{  
    // 用正则表达式将前后空格  
    // 用空字符串替代。  
    return this.replace(/(^\s*)|(\s*$)/g, "");  
}




function SetDefaultLangName()
{
    var language;     
    language = GetCookie('lang');
    if(language==undefined || language==null || language=="")
    {
        try
        {
            if (navigator.appName == "Netscape" || navigator.appName == "Opera")
            {
	            language = navigator.language.toLowerCase();
            }
            else if (navigator.language) 
            {
                language = navigator.language.toLowerCase();;
            }
            else if(navigator.browserLanguage)
            {
                language = navigator.browserLanguage.toLowerCase();
            }
            else
            {
                language= "en-us";
            }
        }catch(eevv){}
    }
    if (language == "zh-tw")
    {
        language = "zh-tw";
    }
    else if(language == "zh-cn") 
    {
	    language = "zh-cn";
    }
    else if(language == "en-us" || language == "en")
    {
        language = "en-us";
    }
    else if(language == "rs-py" || language == "rs")
    {
	    language = "rs-py";
    }
    else if(language == "tr-tr" || language == "tr")
    {
	    language = "tr-tr";
    }
    else
    {
        language = "en-us";
    }
    SetCookie('lang', language);	
    return language;
}



//  判断str是否为合法的时间 1970-2036 内  
function isDate(str)
{
	try
	{
		if(str.length!=10)return false;
		var date=str.split("-");
		if(date.length!=3)return false;
		var y=Math.floor(date[0]);
		var M=Math.floor(date[1]);
		var d=Math.floor(date[2]);
		var maxday=31;
		if(M>7)M=M-1;
		if(M%2!=1)
		{//   小月
			maxday=30;
		}
		if(M==2)
		{// 2月份 
			if((y%4==0 && y%100!=0) || (y%400==0) )
			{
				maxday=29;
			}
			else 
			{
				maxday=28;
			}
		}
		if(y<1970 || y>2036)return false;
		if(M<1 || M>12)return false;
		if(d<1 || d>maxday)return false;		
		return true;
	}
	catch(ee){}
	
	return false;
}



//  判断是否时间，其中24:00:00也是合法    
function isTime(str)
{
	try
	{
		if(str.length!=8)return false;
		if(str=="24:00:00")return true;
		if(str.replace(/[0-9:]+/g,"")!="")
		{
			return false;
		}
		var time=str.split(":");
		var h=Math.floor(time[0]);
		var m=Math.floor(time[1]);
		var s=Math.floor(time[2]);
		if(time.length!=3)return false;
		if(h<0 || h>23)return false;
		if(m<0 || m>59)return false;
		if(s<0 || s>59)return false;
		return true;
	}catch(ee){}
	return false;
}



//   判断是否合法日期时间 其中  0000-00-00 00:00:00被视为合法日期  
//  日期必须19位，时间与日期之间用空间分隔 
function isDateTime(str)
{
		try
		{
			if(str.length!=19)return false;
			if(str=="0000-00-00 00:00:00")return true;
			var ls=str.split(" ");
			if(ls.length!=2)
			{
				return false;
			}
			if(!isDate(ls[0]))return false;
			if(!isTime(ls[1]))return false;
			return true;
		}catch(ee){}
		return false;
}

//   返回2表示出错 返回1 表示st>en 
function CompareDateTime(st,en)
{
	try
	{
		var stvalue=Math.floor(st.replace(/[^0-9]+/g,""));
		var envalue=Math.floor(en.replace(/[^0-9]+/g,""));
		if(stvalue>envalue)
		{
			return 1;
		}
		else if(envalue>stvalue)
		{
			return -1;
		}
		else
		{
			return 0;
		}
	}catch(ee){}
	return 2;//   出错
}





function  GetCookie(name)
{
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null)
	{
		return unescape(arr[2]); 
	}
	return "";
}



        
function  DelCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=GetCookie(name);
    if(cval!=null) document.cookie= name + "="+cval+";path=/;expires="+exp.toGMTString();
}



function  SetCookie(name,  value)
{
    var Days = 1; 
    var exp  = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    DelCookie(name);
    document.cookie = name + "="+ escape (value) + ";path=/;expires=" + exp.toGMTString();
}





function isIp(ipstr)
{
	try
	{
		if(ipstr=="" || ipstr==undefined)return false;
		if(!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){2}\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-4])$/.test(ipstr)) 
		{
			return false;
		}
		var ls=ipstr.split('.');
		if(ls==null || ls.length!=4 || ls[3]=="0" || parseInt(ls[3])===0)
		{
			return false;
		}
		return true;
	}catch(ee){}
	return false;
}


function isSite(str)
{ 
	try
	{
		if(str.replace(/^([_a-zA-Z0-9\\-]+[\\.])+[a-zA-Z]{2,3}$/,"")!="") 
		{
			return false;
		}
		return true;
	}catch(ee){}
	return false;				   
}


function isEmail(emailStr)
{
	try
	{
		var ls=emailStr.split('@');
		if(ls.length!=2)
		{
			return false;
		}
		if(isIp(ls[1]))
		{//结束符是域名
			return true;
		}
		if(!isSite(ls[1]))
		{//结束符是域名
			return false;
		}
		if(ls[1].replace(/[\._0-9a-zA-Z\\-]+/g,"")!="")
		{
			return false;
		}
		var lsv=ls[1].split('.');
		if(lsv.length<=1 || lsv.length>=6)
		{// 后面的.太多 
			return false;
		}
		return true;
	}catch(e){}
	return false;
}


function ReplaceSpace(instr)
{
	if(instr==null || instr==undefined)
	{
		return "";
	}
	return instr.replace(/^\s+|\s+$/g, "");
}

 


function ShowDebugError(msg)
{
	alert(msg);
    //ShowErrDlg(msg,"调试信息");
}


function ShowDebugEvp(evp)
{
    return ShowDebugError(evp.description);
}
 






function CancleEvent(e)
{
    try
    {
        if(navigator.appName.indexOf("Explorer") > -1)
        { 
            if(event.srcElement.tagName=="INPUT") 
            {
                return true;
            } 
        } 
        else
        {
            if(event.target.tagName=="INPUT" ) 
            { 
                return true;
            } 
        } 
    }
    catch(eee)
    {
        ShowError(eee);
    }
    
    try
    {        
        if ( event && event.preventDefault )
        { 
            event.preventDefault(); 
        }
        else if( e && e.preventDefault )
        {
            e.preventDefault(); 
        }
        else
        {
            window.event.returnValue = false;
        }
    }
    catch(eee)
    {
        ShowError(eee);
    }
    return false;
}


function SelectNothing()
{
    try
    {
        if(navigator.appName.indexOf("Explorer") > -1)
        { 
            if(event.srcElement.tagName=="INPUT") 
            {
                return true;
            } 
        } 
        else
        { 

            if(event.target.tagName=="INPUT" ) 
            { 
                return true;
            } 
        } 
    }
    catch(eee)
    {
        ShowError(eee);
    }
    try
    {
        document.selection.empty();
    }
    catch(eee)
    {
        ShowError(eee);
    }
}



 

var lastselectmainbutid=null;
function OnBntMouseOut(objthis)
{
    var allowselect=false;
    if($(objthis).attr("id")!="mainbut6")
    {
        allowselect=true;
    }
   if($(objthis).attr("isselected")==="true" && allowselect)
   {
        objthis.css("backgroundPosition","0px -84px ") ;
   }
   else
   {   
        objthis.css("backgroundPosition","0px 0px ") ;
   }
}





function OnBntMouseOver(objthis)
{ 
    objthis.css("backgroundPosition","0px -84px ") ;
}


function OnBntMouseDown(objthis)
{
   if(lastselectmainbutid!=null && lastselectmainbutid.attr("id")!=objthis.attr("id"))
   {
        lastselectmainbutid.attr("isselected","");
        OnBntMouseOut(lastselectmainbutid);
   }
   else
   {//已选中，重复单击
   }
   objthis.css("backgroundPosition","0px -168px ");
   lastselectmainbutid=objthis;
   $(objthis).attr("isselected","true");
}


function OnBntMouseUp(objthis)
{ 
    var allowselect=false;
    if($(objthis).attr("id")!="mainbut6")
    {
        allowselect=true;
    }
   objthis.css("backgroundPosition","0px -84px ") ;
   if($(objthis).attr("isselected")==="true" && allowselect)
   {
        objthis.css("backgroundPosition","0px -168px ");
   }
}







function OnSaveMouseEvent(objthis,evntype)
{
    var clsname=$(objthis).attr("class");
    var ls=clsname.split("_");
    $(objthis).attr("class",ls[0]+"_"+evntype);
}







var lastmainbutid="";
function OpenUrl(objme,toid,urlmsg,targetname)
{
    if(urlmsg==undefined || urlmsg=="" )
	{
		return ;
	}
	if(targetname=="newwindow")
	{
	    window.open(urlmsg);
	}
	else
	{
	    try
	    {
	        $("#"+toid).attr("innerHTML","");
	        $("#"+toid).loadapphtml(urlmsg);
	        if($("#"+toid).attr("innerHTML")=="")
	        {
	            $("#"+toid).load(urlmsg);//调试时打开
	        }
	    }
	    catch(eevv)
	    {
	        ShowDebugEvp(eevv);
	    }
	}
}



var lastsubitemname="";
function OpenSubMenu(thisobj,jqobj)
{
    var showid=jqobj.attr("showdivid"); 
    if(lastsubitemname!="")
    {
        var obj=$("#"+lastsubitemname);
        if(obj)
        {
            obj.hide();
        }
    }
    lastsubitemname=showid;
    var showobj=$("#"+showid);
    if(showobj)
    {
        showobj.show();
    }
    var subtype=jqobj.attr("subtype");
    if(subtype=="left")
    {
        jqobj.addClass("selineButtonleft");
    }
    else if(subtype=="right")
    {
        jqobj.addClass("selineButtonright");
    }
    else
    {
        jqobj.addClass("selineButtonmid");
    }
}




function OnClickButton(thisobj,bntobj,listselectfilter)
{
    $(listselectfilter).each(function(idx)
    {
        var objunset=$(this);
        if(objunset.attr("isselected")=="true")
        {
            objunset.attr("isselected","");
            OnSubBntMouseOut(this,objunset);
        }
    });
    OpenSubMenu(thisobj,bntobj);
    OnSubChangeMenu(thisobj,bntobj);
    bntobj.attr("isselected","true");
    if(bntobj.attr("dofunc")!="" && bntobj.attr("noclick")!="yes") 
    {
		try
		{
			eval(bntobj.attr("dofunc"));
		}
		catch(eevv)
		{
			ShowDebugError("执行失败:"+bntobj.attr("outerHTML")+eevv);
		}  
    }
    return true;
}




function OnSubBntMouseOut(objthis,jqobj)
{
    if(jqobj.attr("isselected")=="true")
    {
    
    }
    else
    {
        jqobj.removeClass("lineButtonSelect");
        jqobj.addClass("lineButtonLeave") ;
    }
}



function OnSubBntMouseOver(objthis,jqobj)
{ 
   jqobj.addClass("lineButtonSelect") ;
}

function OnSubBntMouseDown(objthis,jqobj)
{
   jqobj.addClass("lineButtonSelect") ;
}


function OnSubBntMouseUp(objthis,jqobj)
{
   jqobj.addClass("lineButtonSelect") ;
}




function ClickLink(obj)
{
    try
	{
		var url=obj.attr("href");
		OpenUrl(url);
	}
	catch(evp)
	{
	    ShowDebugEvp(evp);
	}
}





var lastopenid="";
var showstyle="block";
function ChangeSubItem(obj)
{
    try
    {
        var objid=obj.attr("id");
        var nowsubid=objid+"_sub";
        var subobj=$("#"+nowsubid);
        if(lastopenid!="" && nowsubid!="nowsubid")
        {
            $("#"+lastopenid).css("display","none");
        }
        if(subobj.style.display!=showstyle)
		{
		    subobj.css("display",showstyle);
		    lastopenid=nowsubid; 
		}
		else
		{
		    subobj.css("display","none");
		    lastopenid=""; 
		}
    }
	catch(evp)
	{
	    ShowDebugEvp(evp);
	}
    
}





//objid:
//      <object> label id value
//weburl:
//      language file ,eg:/xml/IPCConfig.xml
function  LoadLangToCtrlObj(objid,weburl)
{
    try
    {
        var szPort = window.location.port;
        var szProtocol = window.location.protocol;
        var szHostname = window.location.hostname;
        var szUrl = szProtocol+ "//" + szHostname + ":" + szPort + "/" +weburl+"?v=1.4.0.4";
	    if(szPort=="")
        {
            szUrl = szProtocol+ "//" + szHostname + "/" +weburl+"?v=1.4.0.4";
        }
        var ctrlobj=document.getElementById("objid");
        ctrlobj.LoadLang(szUrl,1);
        return true;
    }
    catch(eevvp)
    {
    
    }
    return false;
}

function Lover(obj)
{
    $(obj).css("color","#EB7C61");
}



function Lout(obj)
{
    $(obj).css("color","#000000");
}


function OnRecvAction(avtype,msg,ishtml)
{
    
}




var lastOpenDiv="";
function OpenDiv(divid)
{
    if(lastOpenDiv!="")
    {
        $("#"+lastOpenDiv).hide();
    }
    $("#"+divid).hide();
}





function ReplaceToXml(str)
{
    	str=""+str;
	str=str.replace(/[&]/g,"&amp;");
	str=str.replace(/[\"]/g,"&quot;");
	str=str.replace(/[']/g,"&apos;");
	str=str.replace(/[<]/g,"&lt;");
	str=str.replace(/[>]/g,"&gt;");
	return str;
}





var timerfortimeout=0;


function CloseWait()
{
    if(timerfortimeout!=0)
    {
        window.clearTimeout(timerfortimeout);
        timerfortimeout=0;
    }
    try
    {
        $.unblockUI({fadeInTime: 0,fadeOutTime: 0});
    }
	catch(evp)
	{
	    ShowDebugEvp(evp);
	}
}


function ShowWaitMsg(msg,tmoutvalue)
{
    return true;
    if(timerfortimeout!=0)
    {
        window.clearTimeout(timerfortimeout);
        timerfortimeout=0;
    }
    try
    {
        $.blockUI({
            message: msg,
            overlayCSS:
            {
                opacity: 0.3,
                cursor: "wait"
            }
        });
    }
	catch(evp)
	{
	    ShowDebugEvp(evp);
	}
    timerfortimeout=window.setTimeout("CloseWiat()",tmoutvalue);
}






function SetSubMenuAction(thisobj)
{
    var obj=$(thisobj);
    obj.mouseout(function(){OnSubBntMouseOut(thisobj,obj);});	
    obj.mouseover(function(){OnSubBntMouseOver(thisobj,obj);});
    obj.mousedown(function(){OnSubBntMouseDown(thisobj,obj);});	
    obj.mouseup(function(){OnSubBntMouseUp(thisobj,obj);});
    
}

function SetButtonAction(thisobj)
{    
    var obj=$(thisobj);
    obj.mouseout(function(){OnSaveMouseEvent(thisobj,"Leave");});	
    obj.mouseover(function(){OnSaveMouseEvent(thisobj,"Over");});
    obj.mousedown(function(){OnSaveMouseEvent(thisobj,"Down");});	
    obj.mouseup(function(){OnSaveMouseEvent(thisobj,"Over");});
    obj.click(function()
    {
       if(obj.attr("dofunc")!=""  && obj.attr("noclick")!="yes" ) 
       {
            try
            {
                eval(obj.attr("dofunc"));
            }
            catch(eevv)
            {
                ShowDebugError("执行失败:"+obj.attr("outerHTML")+eevv);
            }    
       }
    });
}







var bntdefultbgimgaew=74;
var bntdefultbgimgaeh=0;

function ChangeBgImage(obj,idx)
{
	obj=$(obj);
    var bgimgsize=obj.attr("bgimageheight");
    var bgimagewidth=obj.attr("bgimagewidth");
    var hv=parseInt(bgimgsize);
    var wv=parseInt(bgimagewidth);
    if(isNaN(hv))
    {
        hv=0;
    }
    if(isNaN(wv))
    {
        wv=0;
    }
	if(hv==0 && wv==0)
	{
		wv=bntdefultbgimgaew;
	}
	if(obj.attr("noclick")=="yes")
	{//禁用
		idx=3;
	}
	if(hv==0)
	{
		if(wv==0)
		{
			wv=bntdefultbgimgaew;
		}
		var width=Math.abs(wv*idx);		
		var cssx=obj.css("backgroundPositionX","-"+width+"px");
	}
	else 
	{
		var height=Math.abs(hv*idx);		
		var cssx=obj.css("backgroundPositionY","-"+height+"px");
	}
}


function OnDefMouseDW(obj)
{
	ChangeBgImage(obj,2);
}

function OnDefMouseOT(obj)
{
	ChangeBgImage(obj,0);
}

function OnDefMouseOV(obj)
{
	ChangeBgImage(obj,1);
}

function OnDefMouseUP(obj)
{
	ChangeBgImage(obj,1);
}

 
function SetBgButtonEvent(thisobj)
{    
    var obj=$(thisobj);
    if(obj.attr("havesetfunc")=="y")
    {
        return true;
    }
    obj.attr("havesetfunc","y");
    obj.mouseout(function(){OnDefMouseOT(obj);});	
    obj.mouseover(function(){OnDefMouseOV(obj);});
    obj.mousedown(function(){OnDefMouseDW(obj);});	
    obj.mouseup(function(){OnDefMouseUP(obj);});
    obj.click(function()
    {
       if(obj.attr("dofunc")!=""  && obj.attr("noclick")!="yes"  ) 
       {
            try
            {
                eval(obj.attr("dofunc"));
            }
            catch(eevv)
            {            
                ShowDebugError("执行失败:"+eevv.description+"\r\n"+obj.attr("outerHTML"));
            }    
       }
    });
}

function ShowAllPage(obj,pagesize)
{
		if(pagesize==undefined || pagesize<=0)
		{
			pagesize=20;
		}
		var retobject=$("xml",obj);
		var pg=Math.floor(retobject.children("page").text());
		$("#Lcurpage").html(pg+1);//
		$("#Lpages").html(allpages);//
		var allcount=Math.floor(retobject.children("allcount").text());
		$("#Lrows").html(allcount);// all rows 
		var pagels=$("#Dgotopage").get(0);
		var nowpages=pagels.length;
		var allpages=Math.floor((allcount+pagesize-1)/pagesize);		
		$("#Lpages").html(allpages);
		if(nowpages>allpages)
		{
			pagels.length=allpages;
		}
		else
		{
			for(var nowid=nowpages;nowid<allpages;nowid++)
			{
				pagels.options[nowid]=new Option(nowid+1,nowid+1);
			}
		}
		if(pg<pagels.length)
		{
			pagels.options[pg].selected=true;
		}
}



function RemoveSpace(objid)
{
	var ls=objid.split(",");
	var len=ls.length;
	for(var idx=0;idx<len;idx++)
	{
		var retvalue=ReplaceSpace($("#"+ls[idx]).val());
		$("#"+ls[idx]).val(retvalue);	
	}
}



function GetDataStr(dain,adddayvalue)
{
	var retstr="";
	var jsdatastr=dain.replace(/[-]/g,"/");
	var da=new Date(jsdatastr);	
	
	da.setDate(da.getDate()+adddayvalue);
	var	yearNow	 = da.getFullYear();
	retstr=""+yearNow+"-";
	var	monthNow = da.getMonth()+1;
	if(monthNow>=10)
	{
		retstr=retstr+monthNow+"-";
	}
	else
	{
		retstr=retstr+"0"+monthNow+"-";
	}	
	var	dateNow	 = da.getDate();
	if(dateNow>=10)
	{
		retstr=retstr+dateNow+" ";
	}
	else
	{
		retstr=retstr+"0"+dateNow+" ";
	}
	
	var	h	 = da.getHours();
	if(h>=10)
	{
		retstr=retstr+h+":";
	}
	else
	{
		retstr=retstr+"0"+h+":";
	}
	var	m=da.getMinutes();
	if(m>=10)
	{
		retstr=retstr+m+":";
	}
	else
	{
		retstr=retstr+"0"+m+":";
	}
	var	s = da.getSeconds();
	if(s>=10)
	{
		retstr=retstr+s;
	}
	else
	{
		retstr=retstr+"0"+s;
	}
	return retstr;
}





function HaveErrorChar(str)
{
	if(str.replace(/^(([^\^\.<>%&',;=?$"':#@!~\]\[{}\\/`\|])*)$/g,"")!="")
	{
		return true;
	}
	return false;
}

function CheckHaveLogin(data)
{
	var code=$("xml",data).children("ret").text();
	if(code=="-80000001")
	{
 		top.location="../index.html";
	}
}



function GetNowDate()
{
	var d=new Date();
	var dstr=""+d.getFullYear()+"-";
	if(d.getMonth()<9)
	{
		dstr=dstr+"0";
	}
	dstr=dstr+(d.getMonth()+1)+"-";
	if(d.getDate()<10)
	{
		dstr=dstr+"0";
	}
	dstr=dstr+d.getDate();
	return dstr;
}




function CheckDevSn(devsn,allowempty)
{
	var sn=devsn;
	if(sn=="" && allowempty)
	{
		info=GetLang("devsn_notallowempty","设备序列号不能为空"); 
		return info;
	}
	if(sn.replace(/[0-9A-F]+/g,"")!="")
	{
		info=GetLang("devsn_charseterror","设备序列号只能数字和A-F字母");
		return info;
	}
	if(sn.length!=16)
	{
		info=GetLang("devsn_lengtherror","设备序列号只能是16位字符！");
		return info;
	}
	return "";
}






function CheckDevName(devname,allowempty)
{
	var name=devname;
	var chekret=name.replace(/^[0-9]+/g, "");
	if(name!="" && chekret!=name)
	{
		info=GetLang("devname_firstchar_error","设备别名第一个字符不能为数字！"); 
		return info;
	}	
	if(name.replace(/[0-9a-zA-Z\\-]+/g,"")!="")
	{
		info=GetLang("devname_formaterror","设备别名只能数字、字母、连接符(-)!");
		return info;
	}
	if(name!="")
	{
		if(name.length<3 || name.length>14)
		{
			info=GetLang("devname_lengtherror","设备别名长度只能为3至14位!");
			return info;
		}
	}
	if(allowempty==false && name=="")
	{
		info=GetLang("devname_notallow_empty","设备别名不允许为空!");
		return info;
	}
	return "";
}



function ForMatXmlObject(xml)
{
  var retxmlobj=null;
  if(window.ActiveXObject)
  {
      var xmlCom=new Array( "MSXML2.DOMDocument.3.0","MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument", "Microsoft.XMLDOM", "MSXML.DOMDocument"); 
      for(var i=0; i<xmlCom.length; i++)
      {
            try
            {
                for(var idx=0;idx<5;idx++)
                {
                    var xmlDom=new ActiveXObject(xmlCom[i]);           
                    xmlDom.async=false;
                    xmlDom.loadXML(xml);
                    retxmlobj=xmlDom;
                    if(retxmlobj!=null)
                    {
                        break;
                    }
                }
                return retxmlobj;
            }
            catch(eee)
            {
                ShowError(eee);
            }
      }
  }
  else 
  {
        retxmlobj=$.parseXML(xml);
  }
  return retxmlobj;
}

function parseXml(fileRoute)
{  
	var retobjxml=null;  
	if(window.ActiveXObject)
	{
	  var xmlCom=new Array( "MSXML2.DOMDocument.3.0","MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument", "Microsoft.XMLDOM", "MSXML.DOMDocument"); 
	  for(var i=0; i<xmlCom.length; i++)
	  {
			try
			{
				for(var idx=0;idx<5;idx++)
				{
					var xmlDom=new ActiveXObject(xmlCom[i]);           
					xmlDom.async=false;
					xmlDom.load(fileRoute);
					retobjxml=xmlDom;
					if(retobjxml!=null)
					{
						break;
					}
				}
				return retobjxml;
			}
			catch(eee)
			{
				ShowError(eee);
			}
	  }
	}
	else if(document.implementation&&document.implementation.createDocument)
	{
		for(var idx=0;idx<5;idx++)
		{
			var xmlhttp=new window.XMLHttpRequest();
			xmlhttp.open("GET",fileRoute,false);
			xmlhttp.send(null);
			retobjxml=xmlhttp.responseXML;
			if(retobjxml!=null)
			{
				break;
			}
		}
	}
	else
	{
		retobjxml=null;
	}
	if(retobjxml==null)
	{
		if($!=undefined && jQuery!=undefined && typeof($.post)=="function" )
		{
			$.ajax({
				type:'GET',
				url:fileRoute,
				datatype:'html',
				async :false,
				success:function(msg)
				{
				    try
				    {
					    if(msg.xml!=null &&  msg.xml!="" && msg.xml!=undefined)
					    {
						    retobjxml=ForMatXmlObject(msg.xml); 
					    }
					    else 
					    {
						    retobjxml=ForMatXmlObject(msg); 
					    }
					}catch(eevv){}
				}
			});
		}
		if(retobjxml!=null)
		{
			return retobjxml;
		}
	}  
	return retobjxml;
}







function GetLangDoc()
{
	if(top.langDoc==null)
	{
		var xmlfile= GetXmlFileUrl();
		top.langDoc=parseXml(xmlfile);
	}	
	return top.langDoc;
}




//显示到select上
function InitLangList(selObjId)
{
	var vSelectObj = document.getElementById(selObjId);
	var xmlDoc=GetLangDoc();
	if(xmlDoc==null)
	{
		vSelectObj.options.length=0;
		vSelectObj.options[0]=new Option("English","en-us"); 
		return false;
	}
	var lanobjlist=xmlDoc.getElementsByTagName("Resources");
	var lanrescount=0;
	if(lanobjlist!=null)
	{
		lanrescount=lanobjlist.length;// language count 
	}
	if(lanrescount<=0)
	{
		vSelectObj.options.length=0;
		vSelectObj.options[0]=new Option("English","en-us"); 
		return false;
	} 
	vSelectObj.options.length=0;//clear all items
	{    
		var szOption="";
		for(var i=0; i<lanrescount; i++)
		{
			var vLanguage = lanobjlist[i].getAttribute("lan");
			var vName = lanobjlist[i].getAttribute("name"); 
			var objitem=new Option(vName, vLanguage);
			vSelectObj.options[vSelectObj.options.length]=objitem;
		} 
	}
}


function SetDefaultLang(strtype)
{
	var xmlDoc=GetLangDoc();
	if(xmlDoc==null)
	{
		return false;
	}
	if(strtype==null || strtype=="")
	{
		strtype="en-us";
	}
	if(top.strDefautLang==strtype && top.defaultLangObject!=null)
	{
		return true;
	}
	var lanobjlist=xmlDoc.getElementsByTagName("Resources");
	var lanrescount=0;
	if(lanobjlist!=null)
	{
		lanrescount=lanobjlist.length;// language count 
	}
	if(lanrescount<=0)
	{
		return false;
	}	
	for(var i=0; i<lanrescount; i++)
	{
		var vLanguage = lanobjlist[i].getAttribute("lan"); 
		if(vLanguage==strtype)
		{
			top.strDefautLang=strtype;
			top.defaultLangObject=lanobjlist[i];
			return true;
		}
	} 
	top.strDefautLang=lanobjlist[0].getAttribute("lan");
	top.defaultLangObject=lanobjlist[0]; 
	return false;	
}



function GetDefaultLang(idstr,defstr)
{
	var defoutstr=defstr;
	var xmlDoc=GetLangDoc();
	if(xmlDoc==null)
	{//not lang file
		return defoutstr;
	}
	if(top.defaultLangObject==null)
	{
		return defoutstr;
	}
	var countread=0;
	var findobj=$("jsinfo "+idstr,top.defaultLangObject);
	if(findobj==null || findobj==undefined || findobj.size()<=0)
	{
		return defoutstr;	
	}
	findobj.each(function(idx)
	{
		defoutstr=$(this).text();
		countread++;
	});
	return defoutstr;	
}



function GetLang(idstr,defstr)
{
	return GetDefaultLang(idstr,defstr);
}


function InitPageLangDefault(pgname,pobj)
{
	var xmlDoc=GetLangDoc();
	if(xmlDoc==null)
	{
		return false;
	}
	if(top.defaultLangObject==null)
	{
		return false;
	}
	var objls=$(pgname,top.defaultLangObject); 
	if(objls.size()>0)
	{
		objls.first().children().each(function(idx)
		{
			var obj=$(this);
			var htmlinfo=obj.text();
			var fidls=obj.attr("fid");
			var attrname=obj.attr("attr"); 
			if(fidls=="title")
			{
				document.title=htmlinfo;
			}
			else
			{
				$(fidls,pobj).each(function(idxx)
				{				
					try
					{
						if("innerHTML"==attrname)
						{
							$(this).html(htmlinfo);
						}
						else if("backgroundImage"==attrname)
						{
							$(this).css("backgroundImage",htmlinfo);
						}
						else if("css"==attrname)
						{
							var cssname=obj.attr("cssname"); 
							$(this).css(cssname,htmlinfo);
						}
						else if("value"==attrname)
						{
							$(this).val(htmlinfo);
						}
						else
						{
							$(this).attr(attrname,htmlinfo);
						}
					}catch(eevv)
					{
							
					}
				});
			}
		});
	}
}


function InitPageLang(pgname,pobj)
{
	InitPageLangDefault("com_showpage",pobj);
	InitPageLangDefault(pgname,pobj);
}








function GetEntList(toid,url,needempty,defaultselect)
{
	//url="ajaxgetentlist.php";
	$.post(url+"?t="+new Date().getTime(),{p:0,onlyname:'yes'},function(data)
	{
		CheckHaveLogin(data);
		var retcod=$("xml",data).children("ret").text();
		if(retcod==0)
		{
			var countv=Math.floor($("xml",data).children("allcount").text());			
			if(countv>0)
			{
				var entobj=$("#"+toid);
				entobj.empty();
				if(needempty)
				{
					var allenttip=GetDefaultLang("tip_sel_allentlist","--所有企业--");
					var html="<option value=''>"+allenttip+"</option>";
					entobj.append(html);							
				}
				$("ls",data).each(function(idx)
				{
					var obj=$(this);
					var id=obj.children("id").text();
					var name=obj.children("name").text();	
					var html="<option value='"+id+"'>"+name+"</option>";
					entobj.append(html);							
				});
			}
		}
	},"xml").error(function()
	{
		var error="";
	}); 
}



function GetListName(cfgtype,strid,defname)
{
	var xmlDoc=GetLangDoc();
	if(xmlDoc==null)
	{
		return defname;
	}
	if(top.defaultLangObject==null)
	{
		return defname;
	}
	$(cfgtype+" ls",top.defaultLangObject).each(function(idx)
	{			
		var obj=$(this);
		var id=obj.children("id").text();
		if(strid==id)
		{
			defname=obj.children("name").text();
		}
	});
	return defname;
}


function GetAdvCfgName(strid,defname)
{
	return GetListName("advcfgname_list",strid,defname);
}
	
function GetLogTypeLang(strid,defname)
{
	return GetListName("logtype_list",strid,defname);
}


function GetUserTypeLang(strid,defname)
{
	if(defname=="系统管理员")
	{
		strid="1000";
	}
	else
	{
		strid="9000";
	}
	return GetListName("usertype_list",strid,defname);
}

function GetSystemCfgTypeLang(strid,defname)
{
	return GetListName("systemcfg_list",strid,defname);
}


function GetLogTypeList(toid,url,needempty,defaultselect)
{
	var xmlDoc=GetLangDoc();
	if(xmlDoc==null)
	{
		return false;
	}
	if(top.defaultLangObject==null)
	{
		return false;
	}	
	var entobj=$("#"+toid);
	entobj.empty();
	if(needempty)
	{
		var alllogtype=GetDefaultLang("tip_all_logtype","--所有类型--");
		var html="<option value=''>"+alllogtype+"</option>"; 
		entobj.append(html);							
	}
	$("logtype_list ls",top.defaultLangObject).each(function(idx)
	{			
		var obj=$(this);
		var id=obj.children("id").text();
		var name=obj.children("name").text();	
		var html="<option value='"+id+"' >"+name+"</option>";
		entobj.append(html);	
	});	
}









var timerforautoloadxml=0;//timer handle 
var checkloadxmlcount=0;//read xml file counter


function CallClickButton(objid)
{
    try
    {
        var btn = document.getElementById(objid);
	    btn.click();
	    return true;
    }
    catch(eev)
    {
    }
    return false;
}


function SetValue(objid,value)
{
    try
    {
        if(document.getElementById)
        {
            var obj=document.getElementById(objid);
            obj.value= value;
        }
        else
        {
            var objls=document.all[objid];
            if(objls && objls.length!=undefined && objls.length>=0)
            {
                objls[0].value=value;
            }
        }
     }
     catch(eee)
     {
        
     }   
}



    
function Base64() 
{    
    // private property   
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";   
    
    // public method for encoding   
    this.encode = function (input) {   
        var output = "";   
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;   
        var i = 0;   
        input = _utf8_encode(input);   
        while (i < input.length) {   
            chr1 = input.charCodeAt(i++);   
            chr2 = input.charCodeAt(i++);   
            chr3 = input.charCodeAt(i++);   
            enc1 = chr1 >> 2;   
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);   
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);   
            enc4 = chr3 & 63;   
            if (isNaN(chr2)) {   
                enc3 = enc4 = 64;   
            } else if (isNaN(chr3)) {   
                enc4 = 64;   
            }   
            output = output +   
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +   
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);   
        }   
        return output;   
    }   
    
    // public method for decoding   
    this.decode = function (input) {   
        var output = "";   
        var chr1, chr2, chr3;   
        var enc1, enc2, enc3, enc4;   
        var i = 0;   
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");   
        while (i < input.length) {   
            enc1 = _keyStr.indexOf(input.charAt(i++));   
            enc2 = _keyStr.indexOf(input.charAt(i++));   
            enc3 = _keyStr.indexOf(input.charAt(i++));   
            enc4 = _keyStr.indexOf(input.charAt(i++));   
            chr1 = (enc1 << 2) | (enc2 >> 4);   
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);   
            chr3 = ((enc3 & 3) << 6) | enc4;   
            output = output + String.fromCharCode(chr1);   
            if (enc3 != 64) {   
                output = output + String.fromCharCode(chr2);   
            }   
            if (enc4 != 64) {   
                output = output + String.fromCharCode(chr3);   
            }   
        }   
        output = _utf8_decode(output);   
        return output;   
    }   
    
    // private method for UTF-8 encoding   
    _utf8_encode = function (string) {   
        string = string.replace(/\r\n/g,"\n");   
        var utftext = "";   
        for (var n = 0; n < string.length; n++) {   
            var c = string.charCodeAt(n);   
            if (c < 128) {   
                utftext += String.fromCharCode(c);   
            } else if((c > 127) && (c < 2048)) {   
                utftext += String.fromCharCode((c >> 6) | 192);   
                utftext += String.fromCharCode((c & 63) | 128);   
            } else {   
                utftext += String.fromCharCode((c >> 12) | 224);   
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);   
                utftext += String.fromCharCode((c & 63) | 128);   
            }   
    
        }   
        return utftext;   
    }   
    
    // private method for UTF-8 decoding   
    _utf8_decode = function (utftext) {   
        var string = "";   
        var i = 0;   
        var c = c1 = c2 = 0;   
        while ( i < utftext.length ) {   
            c = utftext.charCodeAt(i);   
            if (c < 128) {   
                string += String.fromCharCode(c);   
                i++;   
            } else if((c > 191) && (c < 224)) {   
                c2 = utftext.charCodeAt(i+1);   
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));   
                i += 2;   
            } else {   
                c2 = utftext.charCodeAt(i+1);   
                c3 = utftext.charCodeAt(i+2);   
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));   
                i += 3;   
            }   
        }   
        return string;   
    }   
} 


function ShowAdvAction(pg)
{
	document.write("<scr"+"ipt type='text/javascript'  src='"+pg+"'   ><"+"/" + "script>");
}

 
 
 
 function GetHostByUrl(url)
 {
	var szPort = window.location.port;
	var szProtocol = window.location.protocol;
	var szHostname = window.location.hostname;
	var ls=szHostname.split('.');
	if(ls[0].toLowerCase()=="www")
	{
		var len=ls.length;
		szHostname="";
		for(var idx=1;idx<len;idx++)
		{
			if(szHostname!="")
			{
				szHostname=szHostname+":"+ls[idx];
			}
			else
			{
				szHostname=ls[idx];
			}
		}
	}
	if(szPort!=80)
	{
		return szHostname+":"+szPort;
	}
	else
	{
		return szHostname;
	}
 }



function GetAlarmInfoByID(idval)
{
	return GetLang("alarmmsg"+idval+"_tip","");
}


