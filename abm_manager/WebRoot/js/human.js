
/*
function leave_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="leave_doEdit('+index+')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 编辑</a>'
	 + '<a href="#" onclick="leave_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	return btn;
}
 */

function timecard_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="timecard_doEdit('+index+')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 编辑</a>'
	 + '<a href="#" onclick="timecard_doCheck('+index+')" style="padding:10px; 8px" ><i class="fa fa-file-text-o"></i> 查看考勤</a>'
	 +'<a href="#" onclick="timecard_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	return btn;
}
function patronage_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="patronage_doEdit('+index+')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 编辑</a>'
	 + '<a href="#" onclick="patronage_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	return btn;
}

function quit_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="quit_doEdit('+index+')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 编辑</a>'
	 + '<a href="#" onclick="quit_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	return btn;
}
function cadres_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="cadres_doEdit('+index+')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 编辑</a>'
	 + '<a href="#" onclick="cadres_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	return btn;
}

/**编辑*/

function staff_doEdit(value,row,index){
	var row = $("#staff_list").datagrid("getRows")[index];
	staff_doSave(false,row);
}

/***删除*/
function staff_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#staff_list").datagrid("getRows")[index];
  		} 
	});
}

/**添加*/
function staff_doAdd(value,row,index){
	staff_doSave(true);
}

function staff_doSave(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				id:'staff_add_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"page/human/human_staff_add.html",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							handler:function(){
								w.find("form").form("submit",{
									url:"./Employee-saveAccount.action",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													w.panel("destroy");
													$("#yhgl_zhgl_list").datagrid("reload");
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
					w.find('[textboxname="employee.sex"]').combobox({
						data:common.listCodesByType('XB')
					});
					if(!isAdd){
						
						var obj = {};
						for(var k in row){
							obj["enterpriseEmployee."+k] = row[k];
						}
						for(var k in row['employeeModel']){
							obj["employee."+k] = row['employeeModel'][k];
						}
						w.find("form").form("load",obj);
					}
				}
				
	});
}
/***导入*/
function staff_doImport(value,row,index){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-sign-in'> </i> 导入",
				id:'staff_import_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"human_staff_import.html",
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
													$("#staff_import_w").panel("destroy");
													$("#staff_list").datagrid("reload");
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
							$("#staff_import_w").panel("destroy");
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

function staff_doCancel(){
	$("#staff_import_w").panel("destroy");

}

/***导出*/
function staff_doExport(value,row,index){
	$.messager.confirm("提示","确认导出信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#staff_list").datagrid("getRows")[index];
  		} 
	});
}
/**查询*/
function staff_doSearch(){
	var arra = [
		{"property":"xm","value":$('#staff_xm').textbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#staff_list').datagrid('reload',param);
	
	
}
/**重置*/

function staff_doReset(){
	$("#staff_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#staff_list').datagrid('reload',param);
}


/**编辑*/

function leave_doEdit(value,row,index){
	var row = $("#leave_list").datagrid("getRows")[index];
	leave_doSave(false,row);
}

/***删除*/
function leave_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#leave_list").datagrid("getRows")[index];
  		} 
	});
}

/**添加*/
function leave_doAdd(value,row,index){
	leave_doSave(true);
}

function leave_doSave(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				id:'leave_add_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"human_leave_add.html",
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
													$("#leave_add_w").panel("destroy");
													$("#leave_list").datagrid("reload");
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
							$("#leave_add_w").panel("destroy");
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
/***导出*/
function leave_doExport(value,row,index){
	$.messager.confirm("提示","确认导出信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#leave_list").datagrid("getRows")[index];
  		} 
	});
}
/**查询*/
function leave_doSearch(){
	var arra = [
		{"property":"xm","value":$('#leave_xm').textbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#leave_list').datagrid('reload',param);
	
	
}
/**重置*/

function leave_doReset(){
	$("#leave_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#leave_list').datagrid('reload',param);
}


/**编辑*/

function timecard_doEdit(value,row,index){
	var row = $("#timecard_list").datagrid("getRows")[index];
	timecard_doSave(false,row);
}

/***删除*/
function timecard_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#timecard_list").datagrid("getRows")[index];
  		} 
	});
}

/**添加*/
function timecard_doAdd(value,row,index){
	timecard_doSave(true);
}

function timecard_doSave(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				id:'timecard_add_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"human_timecard_add.html",
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
													$("#timecard_add_w").panel("destroy");
													$("#timecard_list").datagrid("reload");
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
							$("#timecard_add_w").panel("destroy");
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
function timecard_doCheck(value,row,index){
	$("#timecard_content").hide();
	var editor = $("<div id='timecard_editor'></div>").insertAfter("#timecard_content");
	var opt = {
		border:false,
		href:"./page/human/human_timecard_check.html",
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

function timecard_retList(){
	$("#timecard_editor").panel("destroy");
	$("#timecard_content").show();
}

/**查询*/
function timecard_doSearch(){
	var arra = [
		{"property":"xm","value":$('#timecard_xm').textbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#timecard_list').datagrid('reload',param);
	
	
}
/**重置*/

function timecard_doReset(){
	$("#timecard_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#timecard_list').datagrid('reload',param);
}




/**编辑*/

function patronage_doEdit(value,row,index){
	var row = $("#patronage_list").datagrid("getRows")[index];
	patronage_doSave(false,row);
}

/***删除*/
function patronage_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#patronage_list").datagrid("getRows")[index];
  		} 
	});
}

/**添加*/
function patronage_doAdd(value,row,index){
	patronage_doSave(true);
}

function patronage_doSave(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				id:'patronage_add_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"human_patronage_add.html",
				
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
													$("#patronage_add_w").panel("destroy");
													$("#patronage_list").datagrid("reload");
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
							$("#patronage_add_w").panel("destroy");
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
/**查询*/
function patronage_doSearch(){
	var arra = [
		{"property":"xm","value":$('#patronage_xm').textbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#patronage_list').datagrid('reload',param);
	
	
}
/**重置*/

function patronage_doReset(){
	$("#patronage_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#patronage_list').datagrid('reload',param);
}

/**编辑*/

function quit_doEdit(value,row,index){
	var row = $("#quit_list").datagrid("getRows")[index];
	quit_doSave(false,row);
}

/***删除*/
function quit_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#quit_list").datagrid("getRows")[index];
  		} 
	});
}

/**添加*/
function quit_doAdd(value,row,index){
	quit_doSave(true);
}

function quit_doSave(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				id:'quit_add_w',
				width:"540px",
				height:"530px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"human_quit_add.html",
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
													$("#quit_add_w").panel("destroy");
													$("#quit_list").datagrid("reload");
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
							$("#quit_add_w").panel("destroy");
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
/**查询*/
function quit_doSearch(){
	var arra = [
		{"property":"xm","value":$('#quit_xm').textbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#quit_list').datagrid('reload',param);
	
	
}
/**重置*/

function quit_doReset(){
	$("#quit_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#quit_list').datagrid('reload',param);
}




/**编辑*/

function cadres_doEdit(value,row,index){
	var row = $("#cadres_list").datagrid("getRows")[index];
	cadres_doSave(false,row);
}

/***删除*/
function cadres_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#cadres_list").datagrid("getRows")[index];
  		} 
	});
}

/**添加*/
function cadres_doAdd(value,row,index){
	cadres_doSave(true);
}

function cadres_doSave(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				id:'cadres_add_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"human_cadres_add.html",
				
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
													$("#cadres_add_w").panel("destroy");
													$("#cadres_list").datagrid("reload");
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
							$("#cadres_add_w").panel("destroy");
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
/**查询*/
function cadres_doSearch(){
	var arra = [
		{"property":"xm","value":$('#cadres_xm').textbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#cadres_list').datagrid('reload',param);
	
	
}
/**重置*/

function cadres_doReset(){
	$("#cadres_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#cadres_list').datagrid('reload',param);
}



