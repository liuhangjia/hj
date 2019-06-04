function managers_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="managers_doEdit('+index+')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 编辑</a>'
		+ '<a href="#" onclick="managers_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	return btn;
}
function firefighting_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="firefighting_doEdit('+index+')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 编辑</a>'
		+ '<a href="#" onclick="firefighting_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	return btn;
}
function circulate_doHandle(value,row,index) {
//	var btn = '<a href="#" onclick="circulate_doEdit('+index+')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 编辑</a>'
//		+ '<a href="#" onclick="circulate_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
//	return btn;
}

function collar_doHandle(value,row,index) {
//	var btn = '<a href="#" onclick="collar_doEdit('+index+')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 编辑</a>'
//		+ '<a href="#" onclick="collar_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
//	return btn;
}
/**编辑*/

function managers_doEdit(value,row,index){
	var row = $("#managers_list").datagrid("getRows")[index];
	managers_doSave(false,row);
}

/***删除*/
function managers_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#managers_list").datagrid("getRows")[index];
  		} 
	});
}

/**添加*/
function managers_doAdd(value,row,index){
	managers_doSave(true);
}

function managers_doSave(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				id:'managers_add_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"equipment_manager_add.html",
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
													$("#managers_add_w").panel("destroy");
													$("#managers_list").datagrid("reload");
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
							$("#managers_add_w").panel("destroy");
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
/***导入*/
function managers_doImport(value,row,index){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-sign-in'> </i> 导入",
				id:'managers_import_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"equipment_manager_import.html",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 提交',
							handler:function(){
								$(this).closest("form").form("submit",{
									url:" ",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													$("#managers_import_w").panel("destroy");
													$("#managers_list").datagrid("reload");
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
							$("#managers_import_w").panel("destroy");
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
/**查询*/
function managers_doSearch(){
	var arra = [
		{"property":"xm","value":$('#managers_xm').textbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#managers_list').datagrid('reload',param);
	
	
}
/**重置*/

function managers_doReset(){
	$("#managers_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#managers_list').datagrid('reload',param);
}

/**编辑*/

function firefighting_doEdit(value,row,index){
	var row = $("#firefighting_list").datagrid("getRows")[index];
	firefighting_doSave(false,row);
}

/***删除*/
function firefighting_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#firefighting_list").datagrid("getRows")[index];
  		} 
	});
}

/**添加*/
function firefighting_doAdd(value,row,index){
	firefighting_doSave(true);
}

function firefighting_doSave(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				id:'firefighting_add_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"equipment_firefighting_add.html",
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
													$("#firefighting_add_w").panel("destroy");
													$("#firefighting_list").datagrid("reload");
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
							$("#firefighting_add_w").panel("destroy");
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
/***导入*/
function firefighting_doImport(value,row,index){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-sign-in'> </i> 导入",
				id:'firefighting_import_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"equipment_firefighting_import.html",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 提交',
							handler:function(){
								$(this).closest("form").form("submit",{
									url:" ",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													$("#firefighting_import_w").panel("destroy");
													$("#firefighting_list").datagrid("reload");
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
							$("#firefighting_import_w").panel("destroy");
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
/**查询*/
function firefighting_doSearch(){
	var arra = [
		{"property":"xm","value":$('#firefighting_xm').textbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#firefighting_list').datagrid('reload',param);
	
	
}
/**重置*/

function firefighting_doReset(){
	$("#firefighting_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#firefighting_list').datagrid('reload',param);
}

/**编辑*/

function circulate_doEdit(value,row,index){
	var row = $("#circulate_list").datagrid("getRows")[index];
	circulate_doSave(false,row);
}

/***删除*/
function circulate_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#circulate_list").datagrid("getRows")[index];
  		} 
	});
}

/**添加*/
function circulate_doAdd(value,row,index){
	circulate_doSave(true);
}

function circulate_doSave(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				id:'circulate_add_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"./page/equipment/equipment_circulate_add.jsp",
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
													$("#circulate_add_w").panel("destroy");
													$("#circulate_list").datagrid("reload");
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
							$("#circulate_add_w").panel("destroy");
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
/***导入*/
function circulate_doImport(value,row,index){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-sign-in'> </i> 导入",
				id:'circulate_import_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"equipment_circulate_import.html",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 提交',
							handler:function(){
								$(this).closest("form").form("submit",{
									url:" ",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													$("#circulate_import_w").panel("destroy");
													$("#circulate_list").datagrid("reload");
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
							$("#circulate_import_w").panel("destroy");
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
/**查询*/
function circulate_doSearch(){
	var arra = [
		{"property":"xm","value":$('#circulate_xm').textbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#circulate_list').datagrid('reload',param);
	
	
}
/**重置*/

function circulate_doReset(){
	$("#circulate_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#circulate_list').datagrid('reload',param);
}

/**编辑*/

function collar_doEdit(value,row,index){
	var row = $("#collar_list").datagrid("getRows")[index];
	collar_doSave(false,row);
}

/***删除*/
function collar_doDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#collar_list").datagrid("getRows")[index];
  		} 
	});
}

/**添加*/
function collar_doAdd(value,row,index){
	collar_doSave(true);
}

function collar_doSave(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				id:'collar_add_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"./page/equipment/equipment_collar_add.jsp",
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
													$("#collar_add_w").panel("destroy");
													$("#collar_list").datagrid("reload");
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
							$("#collar_add_w").panel("destroy");
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
/***导入*/
function collar_doImport(value,row,index){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-sign-in'> </i> 导入",
				id:'collar_import_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"equipment_collar_import.html",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 提交',
							handler:function(){
								$(this).closest("form").form("submit",{
									url:" ",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													$("#collar_import_w").panel("destroy");
													$("#collar_list").datagrid("reload");
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
							$("#collar_import_w").panel("destroy");
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
/**查询*/
function collar_doSearch(){
	var arra = [
		{"property":"xm","value":$('#collar_xm').textbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#collar_list').datagrid('reload',param);
	
	
}
/**重置*/

function collar_doReset(){
	$("#collar_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#collar_list').datagrid('reload',param);
}

