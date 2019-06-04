
function bjjk_bjsj_doHandle(value,row,index) {
	var btn = '';
	if(hasPriv('ALARM_LOG_VIDEO')){
		btn = btn + '<a href="/abm_manager/showvideo.jsp?device_id='+row['alarmDeviceModel']['id']+'&id='+row['id']+'" onclick="" target="_blank" style="padding:10px 8px;" ><i class="fa fa-video-camera"></i> 查看视频</a>';
	}
	if(hasPriv('ALARM_LOG_STANDBY')){
		btn = btn +'<a href="#" onclick="bjjk_bjsj_chefang('+index+')" style="padding:10px 8px;" ><i class="fa fa-toggle-off"></i> 撤防</a>';
	}
	if(hasPriv('ALARM_LOG_HANDLE')){
		btn = btn +'<a href="#" onclick="bjjk_bjsj_handle('+index+')" style="padding:10px 8px;" ><i class="fa fa-edit"></i> 处理</a>';
	}
	return btn;
}

function bjjk_bjsj_chefang(index){
	$.messager.confirm("提示","确认撤防?",function(ok){
  		if(ok){
  			var row = $("#bjjk_bjsj_list").datagrid("getRows")[index];
  			$.ajax({
  				url:'./AlarmDevice-chefang.action',
  				data:'id='+row['alarmDeviceModel']['id'],
  				dataType:'json',
  				type:'post',
  				success:function(resp){
  					$.messager.alert("提示",resp['msg'],"info");
  					$('#bjjk_bjsj_list').datagrid('reload');
  				}
  			
  			
  			});
  		
  		} 
	});
}

function bjjk_xjjl_init(){
	if(!hasPriv("PATROL_RECORD_ADD")){
		$("#bjjk_xjjl_zj_btn").hide();
	}
	if(!hasPriv("PATROL_RECORD_DELETE")){
		$("#bjjk_xjjl_plsc_btn").hide();
	}
}

function bjjk_xjjl_doHandle(value,row,index){
	var btn = '<a href="#" onclick="bjjk_xjjl_edit('+index+')" style="padding:10px 10px;" ><i class="fa fa-file-text-o"></i> 修改</a>';
	
	if(hasPriv("PATROL_RECORD_DELETE")){
		btn = btn + '<a href="#" onclick="bjjk_xjjl_del('+index+')" style="padding:10px 10px;"><i class="fa fa-trash"></i> 删除</a>';
	}
	return btn;
}


function bjjk_xjjl_add(){
	bjjk_xjjl_save(true);
}

function bjjk_xjjl_edit(index){
	var row = $("#bjjk_xjjl_list").datagrid("getRows")[index];
	bjjk_xjjl_save(false,row);
}


function bjjk_xjjl_save(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"添加巡检记录":"修改巡检记录",
				width:"580px",
				height:"620px",
				resizable:false,
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"./page/alarm/bjjk_xjjl_add.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							disabled:!isAdd&&!hasPriv("PATROL_RECORD_EDIT"),
							handler:function(){
								bjjk_xjjl_doSave(w);
							}
						},
						{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
								w.window("destroy");
							}
						}],
				onClose:function(){
					$(this).window("destroy");
				},
				onLoad:function(){
					
					if(!isAdd){
						if(!hasPriv("PATROL_RECORD_EDIT")){
							w.find("[textboxname^='record.']").textbox("readonly",true);
						}
						var obj = {};
						for(var k in row){
							obj["record."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
					}
				}
	});
}


function bjjk_xjjl_del(index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			
  			var row = $("#bjjk_xjjl_list").datagrid("getRows")[index];
  			$.ajax({
				url:"./AlarmDeviceCheck-delete.action",
				method:"post",
				data:{"ids":row["id"]},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#bjjk_xjjl_list").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}

function bjjk_xjjl_doSave(win){
	win.find("form").form("submit",{
		url:"./AlarmDeviceCheck-save.action",
		success:function(data){
			try{
				var obj = $.MingwenJSON.decode(data);
				$.messager.alert("提示",obj["msg"],"info",function(){});
				if(obj["success"]){
					win.window('destroy');
					$("#bjjk_xjjl_list").datagrid("reload");
				}
				
			}catch(e){}
		},
		error:function(){
			$.messager.alert("提示","网络错误","info");
		}
	});
}

function bjjk_xjjl_togglePlsc(index)
{
	if($("#bjjk_xjjl_list").datagrid("getChecked").length>0){
		
		$("#bjjk_xjjl_plsc_btn").linkbutton("enable");
		
	}else{
		$("#bjjk_xjjl_plsc_btn").linkbutton("disable");
	}

}

function bjjk_xjjl_plsc(){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
  			var checked = $("#bjjk_xjjl_list").datagrid("getChecked");
  			var param = "";
  			for(i=0;i<checked.length;i++){
  				param = param + checked[i]["id"] + ",";
  			}
  			if(param.length>0){
  				param = param.substr(0,param.length-1);
  			}
			$.ajax({
				url:"./AlarmDeviceCheck-delete.action",
				method:"post",
				data:{"ids":param},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#bjjk_xjjl_list").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}

function bjjk_xjjl_search(){
	var arra = [{"property":"project_name","value":$('#bjjk_xjjl_search_xmmc').textbox("getValue")},
		{"property":"name","value":$('#bjjk_xjjl_search_name').textbox("getValue")},
		{"property":"start_time","value":$('#bjjk_xjjl_search_kssj').datebox("getValue")},
		{"property":"end_time","value":$('#bjjk_xjjl_search_jssj').datebox("getValue")}];
	var param = {};
    param["filter"]=arra;
    $('#bjjk_xjjl_list').datagrid('reload',param);
}

function bjjk_xjjl_reset(){
	$("#bjjk_xjjl_queryform").form("reset");	
	var param = {};
    param["filter"]=[];
    $('#bjjk_xjjl_list').datagrid('reload',param);
}


/***导出*/
function bjjk_bjsj_doExport(value,row,index){
	$.messager.confirm("提示","确认导出信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#leave_list").datagrid("getRows")[index];
  		} 
	});
}
/**查询*/
function bjjk_bjsj_search(){
	var arra = [
		{"property":"name","value":$('#bjjk_bjsj_search_mc').textbox("getValue")},
		{"property":"start","value":$('#bjjk_bjsj_search_kssj').datebox("getValue")},
		{"property":"end","value":$('#bjjk_bjsj_search_jssj').datebox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#bjjk_bjsj_list').datagrid('reload',param);
	
	
}
/**重置*/

function bjjk_bjsj_reset(){
	$("#bjjk_bjsj_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#bjjk_bjsj_list').datagrid('reload',param);
}


function bjjk_bjsj_handle(index){
	var row = $('#bjjk_bjsj_list').datagrid('getRows')[index];
	var w = $("<div></div>").css("padding","5px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-edit'> </i> 报警处理",
				width:"460px",
				height:"300px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"page/alarm/bjjk_bjsj_handle.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							handler:function(){
						
								
								w.find("form").form("submit",{
									url:"./AlarmLog-handle.action",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													w.panel("destroy");
													$("#bjjk_bjsj_list").datagrid("reload");
												}
											});
											
										}catch(e){}
									},
									error:function(){
										$.messager.alert("提示","网络错误","info");
									}
								});
									}
						},
						{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
								w.panel("destroy");
							}
						}],
				onClose:function(){
					w.dialog("destroy");
				},
				onLoad:function(){
					w.find('[name="id"]').val(row['id']);
					w.find('[textboxname="result"]').textbox('setValue',row['result']);
					
				}
				
	});
}

function bjjk_sbyxqd_init(){
	if(!hasPriv("ALARM_DEVICE_ADD")){
		$("#bjjk_sbyxqd_add_btn").hide();
	}
}

function bjjk_sbyxqd_del(index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
  			var row = $("#bjjk_sbyxqd_list").datagrid("getRows")[index];
  			$.ajax({
				url:"./AlarmDevice-delete.action",
				method:"post",
				data:{"ids":row["id"]},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#bjjk_sbyxqd_list").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}

function bjjk_sbyxqd_doSave(win){
	win.find("form").form("submit",{
		url:"./AlarmDevice-save.action",
		success:function(data){
			try{
				var obj = $.MingwenJSON.decode(data);
				$.messager.alert("提示",obj["msg"],"info",function(){});
				if(obj["success"]){
					win.window('destroy');
					$("#bjjk_sbyxqd_list").datagrid("reload");
				}
				
			}catch(e){
				
			}
		},
		error:function(){
			$.messager.alert("提示","网络错误","info");
		}
	});
}

function bjjk_sbyxqd_save(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"添加运行设备":"修改运行设备",
				width:"590px",
				height:"450px",
				resizable:false,
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"./page/alarm/bjjk_sbyxqd_add.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
//							disabled:!isAdd&&!hasPriv("PATROL_RECORD_EDIT"), //权限控制
							handler:function(){
								bjjk_sbyxqd_doSave(w);
							}
						},
						{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
								w.window("destroy");
							}
						}],
				onClose:function(){
					$(this).window("destroy");
				},
				onLoad:function(){
					if(!isAdd){
//						if(!hasPriv("PATROL_RECORD_EDIT")){
//							w.find("[textboxname^='alarmDevice.']").textbox("readonly",true);
//						}
						var obj = {};
						for(var k in row){
							obj["alarmDevice."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
					}
				}
	});
}

function bjjk_sbyxqd_add(){
	bjjk_sbyxqd_save(true);
}

function bjjk_sbyxqd_edit(index){
	var row = $("#bjjk_sbyxqd_list").datagrid("getRows")[index];
	bjjk_sbyxqd_save(false,row);
}

function bjjk_sbyxqd_doHandle(value,row,index) {
	var btn = '';
	if(row['type']=='01'){
		if(hasPriv('ALARM_DEVICE_STANDBY')){
			if(row['status']=='0'){
				btn = btn +'<a href="#" onclick="bjjk_sbyxqd_bufang('+index+',\'B\')" style="padding:10px 8px;" ><i class="fa fa-toggle-on"></i> 布防</a>';
			}else if(row['status']=='1'){
				btn = btn + '<a href="#" onclick="bjjk_sbyxqd_bufang('+index+',\'C\')"  style="padding:10px 8px;" ><i class="fa fa-toggle-off"></i> 撤防</a>';	
			}
		}
	}else if(row['type']=='02'){
		if(hasPriv('ALARM_DEVICE_VIDEO')){
			btn = '<a href="/abm_manager/showsinglevideo.jsp?device_id='+row['id']+'" target="_blank"  style="padding:10px 8px;" ><i class="fa fa-video-camera"></i> 查看视频</a>';
		}
	}
	if(hasPriv('ALARM_DEVICE_EDIT')){
		btn += '<a href="#" onclick="bjjk_sbyxqd_edit('+index+')" style="padding:10px 8px;" ><i class="fa fa-file-text-o""></i> 编辑</a>';
	}
	if(hasPriv('ALARM_DEVICE_DELETE')){
		btn += '<a href="#" onclick="bjjk_sbyxqd_del('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	}
	return btn;
}

function bjjk_sbyxqd_tldz(){
	console.log($(this));
	$.ajax({
		url:'./AlarmDevice-getAliPushAddress.action',
		type:'post',
		dataType:'json',
		data:{
			'alarmDevice.user_name':$(this).closest('form').find('[name="alarmDevice.user_name"]').val(),
			'alarmDevice.passwd':$(this).closest('form').find('[name="alarmDevice.passwd"]').val()
		},
		success:function(resp){
			$("<div>"+resp['data']+"</div>").css("padding","10px").appendTo("body").dialog({
				title:'推流地址', 
			 	width:'400px',
			 	height:'100px'
			 });
		}
		
	});
	
	 
	 
}

/**查询*/
function bjjk_sbyxqd_search(){
	var arra = [
		{"property":"name","value":$('#bjjk_sbyxqd_search_mc').textbox("getValue")},
		{"property":"addr","value":$('#bjjk_sbyxqd_search_addr').textbox("getValue")},
		{"property":"status","value":$('#bjjk_sbyxqd_search_status').combobox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#bjjk_sbyxqd_list').datagrid('reload',param);
	
	
}
/**重置*/

function bjjk_sbyxqd_reset(){
	$("#bjjk_sbyxqd_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#bjjk_sbyxqd_list').datagrid('reload',param);
}


function bjjk_sbyxqd_bufang(index,type){
	
	var cmsg = '',url='';
	if(type=='B'){
		cmsg='布防';
		url = './AlarmDevice-bufang.action';
	}else{
		cmsg = '撤防';
		url = './AlarmDevice-chefang.action';
	}
	
	$.messager.confirm("提示","确认"+cmsg+"?",function(ok){
  		if(ok){
			var row = $("#bjjk_sbyxqd_list").datagrid("getRows")[index];
  			$.ajax({
  				url:url,
  				data:'id='+row['id'],
  				dataType:'json',
  				type:'post',
  				success:function(resp){
  					$.messager.alert("提示",resp['msg'],"info");
  					$('#bjjk_sbyxqd_list').datagrid('reload');
  				}
  			
  			
  			});
  		} 
	});
}

/***导出*/
function bjjk_sbyxqd_export(value,row,index){
	$.messager.confirm("提示","确认导出信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#bjjk_sbyxqd_list").datagrid("getRows")[index];
  		} 
	});
}


function bjjk_sbyxqd_datediff(value){
	if(value!=''){
		 var dateBegin = new Date(value.substr(0,19).replace(/-/g, "/"));
		 var dateEnd = new Date();
		 var dateDiff = dateBegin.getTime() - dateEnd.getTime();
		 return Math.floor(dateDiff / (24 * 3600 * 1000));
	}
	return value;
}


function bjjk_spxz_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="bjjk_spxz_chakan('+index+')" style="padding:10px 8px;" ><i class="fa fa-eye"></i> 查看</a>'
	 + '<a href="./Video-download.action?id='+row['id']+'"  style="padding:10px 8px;"><i class="fa fa-download"></i> 下载</a>';
	return btn;
}


function bjjk_spxz_chakan(index){
	var row = $('#bjjk_spxz_list').datagrid('getRows')[index];
	var w = $("<div></div>").css("padding","5px").appendTo("body");
			w.window({
				title:"<i class='fa fa-video-camera'> </i> 视频",
				width:"850px",
				height:"650px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
//				content:'<video src="file/181009-vv-2_t.mp4" controls="controls"></video>',
				content:'<video src="Video-show.action?id='+row['id']+'" controls="controls" style="width:100%;height:90%;"></video>',
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
				}
				
	});
}


function bjjk_spxz_download(){
	
}


/**查询*/
function bjjk_spxz_search(){
	var arra = [
		{"property":"name","value":$('#bjjk_spxz_search_mc').textbox("getValue")},
		{"property":"uploader","value":$('#bjjk_spxz_search_scr').textbox("getValue")},
		{"property":"start","value":$('#bjjk_spxz_search_kssj').datebox("getValue")},
		{"property":"end","value":$('#bjjk_spxz_search_jssj').datebox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#bjjk_spxz_list').datagrid('reload',param);
	
	
}
/**重置*/

function bjjk_spxz_reset(){
	$("#bjjk_spxz_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#bjjk_spxz_list').datagrid('reload',param);
}


function inspection_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="inspection_gunjing('+index+')"  style="padding:10px;" ><i class="fa fa-map-marker"></i> 查看轨迹</a>';
	return btn;
}

function inspection_gunjing(value,row,index){
	var w = $("<div></div>").css("padding","5px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-eye'> </i> 查看",
				id:'',
				width:"760px",
				height:"560px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"alarm_inspection_gunjing.html",
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					var map = new BMap.Map('map_canvas');
					map.enableScrollWheelZoom();
					map.centerAndZoom(new BMap.Point(116.404, 39.915), 13);
					var lushu;
					// 实例化一个驾车导航用来生成路线
					/*var drv = new BMap.DrivingRoute('北京', {
						onSearchComplete: function(res) {
							if (drv.getStatus() == BMAP_STATUS_SUCCESS) {
								var plan = res.getPlan(0);
								var arrPois =[];
								for(var j=0;j<plan.getNumRoutes();j++){
									var route = plan.getRoute(j);
									arrPois= arrPois.concat(route.getPath());
								}
								map.addOverlay(new BMap.Polyline(arrPois, {strokeColor: '#111'}));
								map.setViewport(arrPois);
								
								lushu = new BMapLib.LuShu(map,arrPois,{
								defaultContent:"",//"从天安门到百度大厦"
								autoView:true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
								icon  : new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/car.png', new BMap.Size(52,26),{anchor : new BMap.Size(27, 13)}),
								speed: 4500,
								enableRotation:true,//是否设置marker随着道路的走向进行旋转
								landmarkPois: [
								   {lng:116.314782,lat:39.913508,html:'加油站',pauseTime:2},
								   {lng:116.315391,lat:39.964429,html:'高速公路收费<div><img src="http://map.baidu.com/img/logo-map.gif"/></div>',pauseTime:3},
								   {lng:116.381476,lat:39.974073,html:'肯德基早餐<div><img src="http://ishouji.baidu.com/resource/images/map/show_pic04.gif"/></div>',pauseTime:2}
								]});          
							}
						}
					});
					drv.search('天安门', '百度大厦');*/
					
					var drv = new BMap.DrivingRoute('西安', {
						onSearchComplete: function(res) {
							if (drv.getStatus() == BMAP_STATUS_SUCCESS) {
								var plan = res.getPlan(0);
								var arrPois =[];
								for(var j=0;j<plan.getNumRoutes();j++){
									var route = plan.getRoute(j);
									arrPois= arrPois.concat(route.getPath());
								}
								map.addOverlay(new BMap.Polyline(arrPois, {strokeColor: '#111'}));
								map.setViewport(arrPois);
								
								lushu = new BMapLib.LuShu(map,arrPois,{
								defaultContent:"",//"从天安门到百度大厦"
								autoView:true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
								icon  : new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/car.png', new BMap.Size(52,26),{anchor : new BMap.Size(27, 13)}),
								speed: 4500,
								enableRotation:true,//是否设置marker随着道路的走向进行旋转
								landmarkPois: [
								   {lng:116.314782,lat:39.913508,html:'加油站',pauseTime:2},
								   {lng:116.315391,lat:39.964429,html:'高速公路收费<div><img src="http://map.baidu.com/img/logo-map.gif"/></div>',pauseTime:3},
								   {lng:116.381476,lat:39.974073,html:'肯德基早餐<div><img src="http://ishouji.baidu.com/resource/images/map/show_pic04.gif"/></div>',pauseTime:2}
								]});          
							}
						}
					});
					drv.search('茶张路', '西安名将安防科技');
				}
				
	});
}

/***导出*/
function inspection_doExport(value,row,index){
	$.messager.confirm("提示","确认导出信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#inspection_list").datagrid("getRows")[index];
  		} 
	});
}
/**查询*/
function inspection_doSearch(){
	var arra = [
		{"property":"xm","value":$('#inspection_xm').textbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#inspection_list').datagrid('reload',param);
	
	
}
/**重置*/

function inspection_doReset(){
	$("#inspection_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#inspection_list').datagrid('reload',param);
}




