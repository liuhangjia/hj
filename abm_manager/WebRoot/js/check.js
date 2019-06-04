/**批次列表操作按钮*/
function check_daHandle(value,row,index) {
	var btn = '<a href="#" onclick="" style="padding:10px 8px;" ><i class="fa fa-file-text-o"></i> 详情</a>'
	 + '<a href="#" onclick="" style="padding:10px 8px;" ><i class="fa fa-gavel"></i> 审核</a>';
	return btn;
}

/**批次设置*/
function check_daEdit(value,row,index){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-file-text-o'> </i> 申请详情",
				id:'check_add_w',
				width:"540px",
				height:"480px",
				footer:'#footer',				
				modal:true,
				href:"check_edit.html",
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					w.find("form").form("load",obj);
				}
				
	});
}

/**批次列表删除*/
function check_daDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#check_list").datagrid("getRows")[index];
  		} 
	});
}
/**批次列表添加*/
function check_daAdd(){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-plus'> </i> 添加",
				id:'check_add_w',
				width:"540px",
				height:"480px",
				footer:'#footer',				
				modal:true,
				href:"check_add.html",
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
													$("#check_add_w").panel("destroy");
													$("#check_list").datagrid("reload");
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
							$("#check_add_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					w.find("form").form("load",obj);
				}
				
	});
}
/**批次审核*/
function check_check(value,row,index){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-gavel'> </i> 申请审核",
				id:'check_check_w',
				width:"600px",
				height:"480px",
				footer:'#footer',				
				modal:true,
				href:"check_check.html",
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
													$("#check_check_w").panel("destroy");
													$("#check_list").datagrid("reload");
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
							$("#check_check_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					var obj = {};
				for(var k in row){
					obj["check."+k] = row[k];
				}
				
				
				$(this).find("form").form("load",obj);
					
					
				}
				
	});
}

/**批次列表查询*/

function check_daSearch(){
	var arra = [
		{"property":"mc","value":$('#check_mc').textbox("getValue")},
		{"property":"zt","value":$('#check_zt').combobox("getValue")}

	];
	var param = {};
	param["filter"]=arra;
	$('#check_list').datagrid('reload',param);
	
	
}
/**批次列表重置*/

function check_daReset(){
	$("#check_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#check_list').datagrid('reload',param);
}
/**批次列表行*/

function check_togglePlsc(){
	
	if($("#check_list").datagrid("getChecked").length>0){
		$("#check_daExport").linkbutton("enable");
	}else{
		$("#check_daExport").linkbutton("disable");
	}
	
}
