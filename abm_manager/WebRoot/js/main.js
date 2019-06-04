$(document).ajaxComplete(function(event, xhr, settings) {  
    var sessionstatus = xhr.getResponseHeader("sessionstatus");
	if(sessionstatus=="timeOut"){
        alert("会话过期，请重新登陆!");
        window.location.replace(xhr.getResponseHeader("loginPath")+"?_r=" + Math.random());  
    }else if(sessionstatus == 'licenseSignError'){
    	alert("License验证失败,请联系售后");
    	window.location.replace(xhr.getResponseHeader("loginPath")+"?_r=" + Math.random());
    }else if(sessionstatus == 'licenseValidateError' || sessionstatus == 'licenseInvalid'){
    	alert("License已失效,请联系售后");
    	window.location.replace(xhr.getResponseHeader("loginPath")+"?_r=" + Math.random());
    }
}); 
function tabRightMenu(e, title,index){
	e.preventDefault();
     if(index>0){
    	 $('#tab_right_menu').menu('enableItem','#tab_right_menu_close');
     }else{
    	 $('#tab_right_menu').menu('disableItem','#tab_right_menu_close');
     }
     $('#tab_right_menu').menu('show', {
         left: e.pageX,
         top: e.pageY
     }).data("tabTitle", title);
}



function closeTab(item){
	var allTabs = $("#operator").tabs('tabs');
	var allTabtitle = [];
 	$.each(allTabs, function (i, n) {
		var opt = $(n).panel('options');
		if (opt.closable){
			allTabtitle.push(opt.title);
		}
	});
    var curTabTitle = $(this).data("tabTitle");
	var curTabIndex = $("#operator").tabs("getTabIndex", $("#operator").tabs("getTab", curTabTitle));
	switch (item.name) {
		case 1:
			$("#operator").tabs("close", curTabIndex);
			return false;
			break;
		case 2:
			for (var i = 0; i < allTabtitle.length; i++) {
 				$('#operator').tabs('close', allTabtitle[i]);
			}
			break;
		case 3:
			for (var i = 0; i < allTabtitle.length; i++) {
				if (curTabTitle != allTabtitle[i])
					$('#operator').tabs('close', allTabtitle[i]);
			}
			$('#operator').tabs('select', curTabTitle);
            break;
        case 4:
        	$("#operator").tabs("getTab", curTabTitle).panel("refresh");
           	break;
    }
   
}


function hasPriv(code){
	for(var i =0 ;i<sys_user["priv"].length;i++){
		if(sys_user["priv"][i]["code"]==code){
			return true;
		}
	}
	return false;
}
$(document).ready(function(){
	$("#loginOut").click(function() {
		loginOut();
	});
	var iframeHeight = function () {
		var _height = $(window).height() - 34;
		$('#content').height(_height);
	}
	window.onresize = iframeHeight;
	$(function () {
		iframeHeight();
	});
	//init pushlet
	PL._init();
    PL.setDebug(false);
    PL.joinListen("shanfrs");

});

function loginOut() {
	$.ajax( {
		type : "post",
		url : "./Login-loginOut.action",
		dataType : "json",
		success : function(data) {
			var flag = data["success"];
			if (flag) {
				window.location.href = "login.jsp";
			} else {
				alert(data["msg"]);
			}
		}
	});
}

function onData(event){
			var smessage = decodeURIComponent(event.get('message'));
		    var message = $.MingwenJSON.decode(smessage); 
		    if(message.ptype=='alarm'){
		    	if(hasPriv('ALARM_LOG_LIST')){
		    		var node = {};
		    		node.id = 'alarm/bjjk_bjsj.jsp';
		    		node.text = '报警事件';
		    		node.onLoad=null;
		    		common.openPlugin(node);
		    		window.open('./showvideo.jsp?id='+message.id+'&device_id='+message.device_id);
		    		$('#bjjk_bjsj_list').datagrid('reload');
		    		$.messager.show({
					  title:"告警",
					  msg:"时间="+message.time+",类型="+message.event+",防区="+message.fangqu+",地址="+message.address,
					  width:"350px",
					  height:"160px",
					  showType:"show",
					  onDestroy:function(){
		    				
		    			stop_alarm();
					  }
					});
		    		//播放声音
					play_alarm();
		    	}
		    }
				
}	

function play_alarm(){
	var d = document.getElementById('alarmsound');
	if(d){
		d.play();
	}
}

function stop_alarm(){
	var d =  document.getElementById('alarmsound');
	if(d){
		d.pause();
	}
}













