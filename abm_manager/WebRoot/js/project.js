function manager_doHandle(value,row,index) {
	var btn ='<a href="#" onclick="manager_doOverview('+index+')" style="padding:10px 8px;"><i class="fa fa-file-text-o"></i> 项目总览</a>'
	+ '<a href="#" onclick="manager_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	return btn;
}
function personnel_doHandle(value,row,index) {
	var btn ='<a href="#" onclick="personnel_doCheck('+index+')" style="padding:10px 8px;"><i class="fa fa-file-text-o"></i> 查看</a>'
	 + '<a href="#" onclick="personnel_doEdit('+index+')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 编辑</a>';
	return btn;
}
function milestone_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="milestone_doCheck('+index+')" style="padding:10px 8px;"><i class="fa fa-file-text-o"></i> 查看</a>'
	 + '<a href="#" onclick="milestone_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	return btn;
}
function inspections_doHandle(value,row,index) {
	var btn ='<a href="#" onclick="inspections_doCheck('+index+')" style="padding:10px 8px;"><i class="fa fa-file-text-o"></i> 查看</a>'
	  + '<a href="#" onclick="inspection_gunjing('+index+')"  style="padding:10px;" ><i class="fa fa-map-marker"></i> 查看轨迹</a>';
	return btn;
}

function firemen_doHandle(value,row,index) {
	var btn ='<a href="#" onclick="firemen_doCheck('+index+')" style="padding:10px 8px;"><i class="fa fa-file-text-o"></i> 查看</a>'
	 + '<a href="#" onclick="firemen_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	return btn;
}
function equipments_doHandle(value,row,index) {
	var btn ='<a href="#" onclick="equipments_doCheck('+index+')" style="padding:10px 8px;"><i class="fa fa-file-text-o"></i> 查看</a>'
	 + '<a href="#" onclick="equipments_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	return btn;
}
function train_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="train_doCheck('+index+')" style="padding:10px 8px;"><i class="fa fa-file-text-o"></i> 查看</a>'
	 + '<a href="#" onclick="train_users('+index+')" style="padding:10px 8px;" ><i class="fa fa-list-alt"></i> 参加人员</a>';
	return btn;
}
function work_doHandle(value,row,index) {
	var btn ='<a href="#" onclick="work_doCheck('+index+')" style="padding:10px 8px;"><i class="fa fa-file-text-o"></i> 查看</a>'
	 + '<a href="#" onclick="work_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	return btn;
}
/**编辑*/

function manager_doEdit(value,row,index){
	var row = $("#manager_list").datagrid("getRows")[index];
	manager_doSave(false,row);
}

/***删除*/
function manager_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#manager_list").datagrid("getRows")[index];
  		} 
	});
}

/**添加*/
function manager_doAdd(value,row,index){
	manager_doSave(true);
}

function manager_doSave(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				id:'manager_add_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"page/project/project_manager_add.html",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							handler:function(){
								$(this).closest("form").form("submit",{
									url:" ",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													$("#manager_add_w").panel("destroy");
													$("#manager_list").datagrid("reload");
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
							$("#manager_add_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					if(!isAdd){
						
						var obj = {};
						for(var k in row){
							obj["rsda."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
						
					}
				}
				
	});
}

function manager_doOverview(value,row,index){
	$("#manager_content").hide();
	var editor = $("<div id='manager_editor'></div>").insertAfter("#manager_content");
	var opt = {
		border:false,
		href:"page/project/project_manager_overview.html",
		method:"post",
		fit:true,
		collapsible: false,
		minimizable: false,
		maximizable: false,
		onLoad:function(){
			
			
		}
	};
	editor.panel(opt);
}


/***返回列表*/

function manager_retList(){
	$("#manager_editor").panel("destroy");
	$("#manager_content").show();
}

function manager_doSearch(){
	var arra = [
		{"property":"mc","value":$('#batch_mc').textbox("getValue")},
		{"property":"kssj","value":$('#batch_kssj').datebox("getValue")},
		{"property":"jssj","value":$('#batch_jssj').datebox("getValue")},
		{"property":"zt","value":$('#batch_zt').combobox("getValue")}

	];
	var param = {};
	param["filter"]=arra;
	$('#manager_list').datagrid('reload',param);
	
	
}
/**重置*/

function manager_doReset(){
	$("#manager_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#manager_list').datagrid('reload',param);
}

	
/***导入*/
function manager_doImport(value,row,index){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-sign-in'> </i> 导入",
				id:'manager_import_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"project_manager_import.html",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							handler:function(){
								$(this).closest("form").form("submit",{
									url:" ",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													$("#manager_import_w").panel("destroy");
													$("#manager_list").datagrid("reload");
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
							$("#manager_import_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					w.find("form").form("load",{});
				
				}
				
	});
}

/***导出*/
function manager_daExport(value,row,index){
	$.messager.confirm("提示","确认导出信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#manager_list").datagrid("getRows")[index];
  		} 
	});
}




/**编辑*/

function personnel_doEdit(value,row,index){
	var row = $("#personnel_list").datagrid("getRows")[index];
	personnel_doSave(false,row);
}

/***删除*/
function personnel_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#personnel_list").datagrid("getRows")[index];
  		} 
	});
}

/**添加*/
function personnel_doAdd(value,row,index){
	personnel_doSave(true);
}

function personnel_doSave(isAdd,row){
		var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				id:'personnel_add_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"project_personnel_add.html",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							handler:function(){
								$(this).closest("form").form("submit",{
									url:" ",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													$("#personnel_add_w").panel("destroy");
													$("#personnel_list").datagrid("reload");
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
							$("#personnel_add_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					if(!isAdd){
						
						var obj = {};
						for(var k in row){
							obj["rsda."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
						
					}
				}
				
	});
}

function personnel_doCheck(value,row,index){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-file-text-o'> </i> 查看",
				id:'personnel_check_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"project_personnel_check.html",
				buttons: [{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
							$("#personnel_check_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					if(!isAdd){
						
						var obj = {};
						for(var k in row){
							obj["rsda."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
						
					}
				}
				
	});
}

function personnel_doSearch(){
	var arra = [
		{"property":"mc","value":$('#batch_mc').textbox("getValue")},
		{"property":"kssj","value":$('#batch_kssj').datebox("getValue")},
		{"property":"jssj","value":$('#batch_jssj').datebox("getValue")},
		{"property":"zt","value":$('#batch_zt').combobox("getValue")}

	];
	var param = {};
	param["filter"]=arra;
	$('#personnel_list').datagrid('reload',param);
	
	
}
/**重置*/

function personnel_doReset(){
	$("#personnel_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#personnel_list').datagrid('reload',param);
}


function milestone_doEdit(value,row,index){
	var row = $("#milestone_list").datagrid("getRows")[index];
	milestone_doSave(false,row);
}

/***删除*/
function milestone_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#milestone_list").datagrid("getRows")[index];
  		} 
	});
}

/**添加*/
function milestone_doAdd(value,row,index){
	milestone_doSave(true);
}

function milestone_doSave(isAdd,row){
		var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				id:'milestone_add_w',
				width:"540px",
				height:"530px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"project_milestone_add.html",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							handler:function(){
								$(this).closest("form").form("submit",{
									url:" ",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													$("#milestone_add_w").panel("destroy");
													$("#milestone_list").datagrid("reload");
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
							$("#milestone_add_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					if(!isAdd){
						
						var obj = {};
						for(var k in row){
							obj["rsda."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
						
					}
				}
				
	});
}

function milestone_doCheck(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-file-text-o'> </i> 查看",
				id:'milestone_check',
				width:"540px",
				height:"530px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"project_milestone_check.html",
				buttons: [{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
							$("#milestone_check").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					if(!isAdd){
						
						var obj = {};
						for(var k in row){
							obj["rsda."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
						
					}
				}
				
	});
}

function milestone_doSearch(){
	var arra = [
		{"property":"mc","value":$('#batch_mc').textbox("getValue")},
		{"property":"kssj","value":$('#batch_kssj').datebox("getValue")},
		{"property":"jssj","value":$('#batch_jssj').datebox("getValue")},
		{"property":"zt","value":$('#batch_zt').combobox("getValue")}

	];
	var param = {};
	param["filter"]=arra;
	$('#milestone_list').datagrid('reload',param);
	
	
}
/**重置*/

function milestone_doReset(){
	$("#milestone_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#milestone_list').datagrid('reload',param);
}


function inspections_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#inspection_list").datagrid("getRows")[index];
  		} 
	});
}

function inspections_doCheck(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-file-text-o'> </i> 查看",
				id:'inspection_doCheck',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"project_inspection_check.html",
				buttons: [{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
							$("#personnel_add_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					if(!isAdd){
						
						var obj = {};
						for(var k in row){
							obj["rsda."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
						
					}
				}
				
	});
}

function inspections_doSearch(){
	var arra = [
		{"property":"mc","value":$('#batch_mc').textbox("getValue")},
		{"property":"kssj","value":$('#batch_kssj').datebox("getValue")},
		{"property":"jssj","value":$('#batch_jssj').datebox("getValue")},
		{"property":"zt","value":$('#batch_zt').combobox("getValue")}

	];
	var param = {};
	param["filter"]=arra;
	$('#inspections_list').datagrid('reload',param);
	
	
}
/**重置*/

function inspections_doReset(){
	$("#inspections_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#inspections_list').datagrid('reload',param);
}


function firemen_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#firemen_list").datagrid("getRows")[index];
  		} 
	});
}

function firemen_doCheck(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-file-text-o'> </i> 查看",
				id:'firemen_check_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"project_firemen_check.html",
				buttons: [{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
							$("#firemen_check_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					if(!isAdd){
						
						var obj = {};
						for(var k in row){
							obj["rsda."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
						
					}
				}
				
	});
}

function firemen_doSearch(){
	var arra = [
		{"property":"mc","value":$('#batch_mc').textbox("getValue")},
		{"property":"kssj","value":$('#batch_kssj').datebox("getValue")},
		{"property":"jssj","value":$('#batch_jssj').datebox("getValue")},
		{"property":"zt","value":$('#batch_zt').combobox("getValue")}

	];
	var param = {};
	param["filter"]=arra;
	$('#firemen_list').datagrid('reload',param);
	
	
}
/**重置*/

function firemen_doReset(){
	$("#firemen_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#firemen_list').datagrid('reload',param);
}


function equipments_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#equipment_list").datagrid("getRows")[index];
  		} 
	});
}

function equipments_doCheck(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-file-text-o'> </i> 查看",
				id:'equipment_check_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"project_equipment_check.html",
				buttons: [{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
							$("#equipment_check_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					if(!isAdd){
						
						var obj = {};
						for(var k in row){
							obj["rsda."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
						
					}
				}
				
	});
}

function equipments_doSearch(){
	var arra = [
		{"property":"mc","value":$('#batch_mc').textbox("getValue")},
		{"property":"kssj","value":$('#batch_kssj').datebox("getValue")},
		{"property":"jssj","value":$('#batch_jssj').datebox("getValue")},
		{"property":"zt","value":$('#batch_zt').combobox("getValue")}

	];
	var param = {};
	param["filter"]=arra;
	$('#equipments_list').datagrid('reload',param);
	
	
}
/**重置*/

function equipments_doReset(){
	$("#equipments_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#equipments_list').datagrid('reload',param);
}




function train_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#train_list").datagrid("getRows")[index];
  		} 
	});
}

function train_doCheck(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-file-text-o'> </i> 查看",
				id:'train_check_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"project_train_check.html",
				buttons: [{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
							$("#train_check_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					if(!isAdd){
						
						var obj = {};
						for(var k in row){
							obj["rsda."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
						
					}
				}
				
	});
}

function train_users(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-file-text-o'> </i> 查看",
				id:'train_users_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"project_train_users.html",
				buttons: [{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
							$("#train_users_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					if(!isAdd){
						
						var obj = {};
						for(var k in row){
							obj["rsda."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
						
					}
				}
				
	});
}

function train_doSearch(){
	var arra = [
		{"property":"mc","value":$('#batch_mc').textbox("getValue")},
		{"property":"kssj","value":$('#batch_kssj').datebox("getValue")},
		{"property":"jssj","value":$('#batch_jssj').datebox("getValue")},
		{"property":"zt","value":$('#batch_zt').combobox("getValue")}

	];
	var param = {};
	param["filter"]=arra;
	$('#train_list').datagrid('reload',param);
	
	
}
/**重置*/

function train_doReset(){
	$("#train_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#train_list').datagrid('reload',param);
}


function work_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#work_list").datagrid("getRows")[index];
  		} 
	});
}

function work_doCheck(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-file-text-o'> </i> 查看",
				id:'work_add_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				//href:"project_work_check.html",
				href:"./page/project/project_work_check.jsp",
				buttons: [{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
							$("#work_add_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					if(!isAdd){
						
						var obj = {};
						for(var k in row){
							obj["rsda."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
						
					}
				}
				
	});
}

function work_doSearch(){
	var arra = [
		{"property":"mc","value":$('#batch_mc').textbox("getValue")},
		{"property":"kssj","value":$('#batch_kssj').datebox("getValue")},
		{"property":"jssj","value":$('#batch_jssj').datebox("getValue")},
		{"property":"zt","value":$('#batch_zt').combobox("getValue")}

	];
	var param = {};
	param["filter"]=arra;
	$('#work_list').datagrid('reload',param);
	
	
}
/**重置*/

function work_doReset(){
	$("#work_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#work_list').datagrid('reload',param);
}





