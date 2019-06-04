function yhgl_jsgl_init(){
	if(!hasPriv("USER_ROLE_MANAGER_ADD")){
		$("#yhgl_jsgl_zj_btn").hide();
	}
	if(!hasPriv("USER_ROLE_MANAGER_DELETE")){
		$("#yhgl_jsgl_plsc_btn").hide();
	}
}

function yhgl_jsgl_fmtEname(value,row,index){
	if(row['enterpriseModel']){
		return row['enterpriseModel']['name'];
	}else {
		return '';
	}
}
function yhgl_jsgl_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="yhgl_jsgl_doEdit('+index+')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 编辑</a>';
	if(hasPriv('USER_ROLE_MANAGER_DELETE')){
		btn = btn + '<a href="#" onclick="yhgl_jsgl_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	}
	btn = btn + '<a href="#" onclick="yhgl_jsgl_doPermission('+index+')" style="padding:10px 8px;" ><i class="fa fa-id-badge"></i> 权限</a>';
	return btn;
}

function yhgl_jsgl_doPermission(index){
	var row = $("#yhgl_jsgl_list").datagrid("getRows")[index];
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-plus'> </i> 设置权限",
				width:"540px",
				height:"480px",
				footer:'#footer',				
				modal:true,
				href:"./page/associator/yhgl_jsgl_jsqx.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							disabled:!hasPriv("USER_ROLE_MANAGER_GRANT"),
							handler:function(){
								yhgl_jsgl_qxtj(w);
							}
						},
						{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
								w.panel("destroy");
							}
						}
				],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					$("#yhgl_jsgl_jsqx_roleId").val(row["id"]);
					
					$.ajax({
						url:"./Priv-getAllPrivListByEnterprise.action",
						loadMsg:'数据加载中,请稍后......',
						method:"post",
						data:{"roleId":row["id"],'enterpriseId':row['enterprise_id']},
						dataType:"json",
						success:function(resp){
							
							$('#yhgl_jsgl_jsqx_tree').tree({
								method:'get',
								animate:true,
								checkbox:true,
								onlyLeafCheck:true,
								data:resp
							});
						},
						error:function(){
							$.messager.alert("提示","网络错误","info");
						}
					});
				}
				
	});
}

function yhgl_jsgl_qxtj(win){
	
	var checked = $("#yhgl_jsgl_jsqx_tree").tree("getChecked");
  	var param = "";
  	for(i=0;i<checked.length;i++){
  		if(checked[i]['id']){
  			param = param + checked[i]["id"] + ",";
  		}
  	}
  	if(param.length>0){
  		param = param.substr(0,param.length-1);
  	}
	$("#yhgl_jsgl_jsqx_privId").val(param);
	
	win.find("form").form("submit",{
		url:"./Role-addPrivForRole.action",
		success:function(data){
			try{
				var obj = $.MingwenJSON.decode(data);
				$.messager.alert("提示",obj["msg"],"info",function(){});
				win.panel("destroy");
			}catch(e){}
		},
		error:function(){
			$.messager.alert("提示","网络错误","info");
		}
	});

	
	
	
	
}

function yhgl_jsgl_doAdd(){
	yhgl_jsgl_doSave(true);
}

function yhgl_jsgl_doEdit(index){
	var row = $("#yhgl_jsgl_list").datagrid("getRows")[index];
	yhgl_jsgl_doSave(false,row);
}

function yhgl_jsgl_doSave(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"./page/associator/yhgl_jsgl_add.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							disabled:!isAdd&&!hasPriv("USER_ROLE_MANAGER_EDIT"),
							handler:function(){
								w.find("form").form("submit",{
									url:"./Role-save.action",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													w.panel("destroy");
													$("#yhgl_jsgl_list").datagrid("reload");
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
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					if(!isAdd){
						w.find('[textboxname="role.enterprise_id"]').closest('div').hide();//不允许修改角色对应的企业
						if(!hasPriv("USER_ROLE_MANAGER_EDIT")){
							w.find("[textboxname^='role.']").textbox("readonly",true);
						}
						var obj = {};
						for(var k in row){
							obj["role."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
						
					}else{
						w.find('[name="role.is_editable"]').val('1');
					}
				}
				
	});
}

function yhgl_jsgl_doDel(index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			
  			var row = $("#yhgl_jsgl_list").datagrid("getRows")[index];
  			$.ajax({
				url:"./Role-delete.action",
				method:"post",
				data:{"ids":row["id"]},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#yhgl_jsgl_list").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}

function yhgl_jsgl_togglePlsc()
{
	if($("#yhgl_jsgl_list").datagrid("getChecked").length>0){
		$("#yhgl_jsgl_plsc_btn").linkbutton("enable");
	}else{
		$("#yhgl_jsgl_plsc_btn").linkbutton("disable");
	}

}

function yhgl_jsgl_plsc(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
  			var checked = $("#yhgl_jsgl_list").datagrid("getChecked");
  			var param = "";
  			for(i=0;i<checked.length;i++){
  				param = param + checked[i]["id"] + ",";
  			}
  			if(param.length>0){
  				param = param.substr(0,param.length-1);
  			}
			$.ajax({
				url:"./Role-delete.action",
				method:"post",
				data:{"ids":param},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#yhgl_jsgl_list").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}

function yhgl_jsgl_search(){
	var arra = [
		{"property":"name","value":$('#yhgl_jsgl_search_mc').textbox("getValue")},
		{"property":"ename","value":$('#yhgl_jsgl_search_qymc').textbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#yhgl_jsgl_list').datagrid('reload',param);
}

function yhgl_jsgl_reset(){
	$("#yhgl_jsgl_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#yhgl_jsgl_list').datagrid('reload',param);
}


