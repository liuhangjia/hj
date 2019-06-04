function xtgl_yhgl_init(){
	if(!hasPriv("SYS_ACCOUNT_MANAGER_ADD")){
		$("#xtgl_yhgl_zj_btn").hide();
		$('#xtgl_yhgl_yy_btn').hide();
	}
	if(!hasPriv("SYS_ACCOUNT_MANAGER_DELETE")){
		$("#xtgl_yhgl_plsc_btn").hide();
	}
}
function xtgl_yhgl_retBtn(value,row,index) {
	
	var btn = '';
	if(hasPriv("SYS_ACCOUNT_MANAGER_EDIT")){
		btn = btn + '<a href="#" onclick="xtgl_yhgl_edit('+index+')" style="padding:10px 10px;"  ><i class="fa fa-file-text-o"></i> 修改</a>';
	}
	if(hasPriv("SYS_ACCOUNT_MANAGER_DELETE")&&row['is_editable']=='1'){
		btn = btn + '<a href="#" onclick="xtgl_yhgl_del('+index+')" style="padding:10px 10px;"><i class="fa fa-trash"></i> 删除</a>';
	}
	if(hasPriv("SYS_ACCOUNT_MANAGER_ROLE")){
		btn = btn + '<a href="#" onclick="xtgl_yhgl_role('+index+')" style="padding:10px 8px;" ><i class="fa fa-id-badge"></i> 角色</a>';
	}
	return btn;
}



function xtgl_yhgl_edit(index){

	var row = $("#xtgl_yhgl_yhlb").datagrid("getRows")[index];
	xtgl_yhgl_save(false,row);
}

function xtgl_yhgl_del(index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			
  			var row = $("#xtgl_yhgl_yhlb").datagrid("getRows")[index];
  			$.ajax({
				url:"./Operator-delete.action",
				method:"post",
				data:{"ids":row["id"]},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#xtgl_yhgl_yhlb").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}


function xtgl_yhgl_add(){
	xtgl_yhgl_save(true);
}

function xtgl_yhgl_save(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"系统用户添加":"系统用户修改",
				width:"530px",
				height:"320px",
				resizable:false,
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"./page/system/xtgl_yhgl_add.jsp",
				onClose:function(){
					$(this).window("destroy");
				},
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							disabled:!isAdd&&row['is_editable']=='0',
							handler:function(){
								xtgl_yhgl_doSave(w);
							}
						},
						{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
								w.panel("destroy");
							}
				}],
				onLoad:function(){
					
					if(!isAdd){
						w.find("[name='id']").val(row['id']);
						w.find("[name='account_id']").val(row['account']['id']);
						w.find("[textboxname='account']").textbox('setValue',row['account']['account']);
						w.find("[textboxname='passwd']").textbox('setValue',row['account']['passwd']);
						w.find("[textboxname='name']").textbox('setValue',row['name']);
						w.find("[textboxname='bak']").textbox('setValue',row['bak']);
					}
				}
	});
}




function  xtgl_yhgl_doSave(win){
	win.find("form").form("submit",{
		url:"./Operator-save.action",
		success:function(data){
			try{
				var obj = $.MingwenJSON.decode(data);
				$.messager.alert("提示",obj["msg"],"info",function(){});
				if(obj["success"]){
					win.panel("destroy");
					$("#xtgl_yhgl_yhlb").datagrid("reload");
				}
				
			}catch(e){}
		},
		error:function(){
			$.messager.alert("提示","网络错误","info");
		}
	});

}
function xtgl_yhgl_yy(){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"引用账号",
				width:"630px",
				height:"200px",
				resizable:false,
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"./page/system/xtgl_yhgl_yy.jsp",
				onClose:function(){
					$(this).window("destroy");
				},
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							handler:function(){
								xtgl_yhgl_doYy(w);
							}
						},
						{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
								w.panel("destroy");
							}
				}]
	});
}

function xtgl_yhgl_doYy(win){
	win.find("form").form("submit",{
		url:"./Operator-refAccount.action",
		success:function(data){
			try{
				var obj = $.MingwenJSON.decode(data);
				$.messager.alert("提示",obj["msg"],"info",function(){});
				if(obj["success"]){
					win.panel("destroy");
					$("#xtgl_yhgl_yhlb").datagrid("reload");
				}
				
			}catch(e){}
		},
		error:function(){
			$.messager.alert("提示","网络错误","info");
		}
	});
}


function xtgl_yhgl_role(index){
	var row = $("#xtgl_yhgl_yhlb").datagrid("getRows")[index];
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"指定角色",
				width:"630px",
				height:"420px",
				resizable:false,
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"./page/system/xtgl_yhgl_role.jsp",
				onClose:function(){
					$(this).window("destroy");
				},
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							disabled:row['is_editable']=='0',
							handler:function(){
								xtgl_yhgl_doRole(w);
							}
						},
						{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
								w.panel("destroy");
							}
				}],
				onLoad:function(){
					w.find("[name='id']").val(row['id']);
					$.ajax({
						url:'./Role-listAll.action',
						dataType:'json',
						success:function(resp){
							$('#xtgl_yhgl_role_list').datagrid('request',resp);
							$.ajax({
								url:'./Operator-listRolesByOperator.action',
								data:{'id':row['id']},
								dataType:'json',
								success:function(res){
									$.each(res,function(i,r){
										var rows = $('#xtgl_yhgl_role_list').datagrid('getRows');
										$.each(rows,function(i,r){
											$.each(res,function(j,r1){
												if(r1['id']==r['id']){
													$('#xtgl_yhgl_role_list').datagrid('checkRow',i);
													return  false;
												}
											});
										});
										
									});
								}
							});
						}
					});
					
					
				}
	});
	
}

function xtgl_yhgl_doRole(win){
	var selected = $('#xtgl_yhgl_role_list').datagrid('getChecked');
	var roleIds = [];
	$.each(selected,function(i,r){
		roleIds.push(r['id']);
	});
	win.find("form").form("submit",{
		url:"./Operator-saveRole.action",
		queryParams:{'roleIds':$.MingwenJSON.encode(roleIds)},
		success:function(data){
			try{
				var obj = $.MingwenJSON.decode(data);
				$.messager.alert("提示",obj["msg"],"info",function(){});
				if(obj["success"]){
					win.panel("destroy");
					$("#xtgl_yhgl_yhlb").datagrid("reload");
				}
				
			}catch(e){}
		},
		error:function(){
			$.messager.alert("提示","网络错误","info");
		}
	});
}

function xtgl_yhgl_search(){
	var arra = [{"property":"name","value":$('#xtgl_yhgl_search_name').textbox("getValue")},
		{"property":"account","value":$('#xtgl_yhgl_search_account').textbox("getValue")}];
	var param = {};
    param["filter"]=arra;
    $('#xtgl_yhgl_yhlb').datagrid('reload',param);

}
function xtgl_yhgl_reset(){
	$("#xtgl_yhgl_queryform").form("reset");	
	var param = {};
    param["filter"]=[];
    $('#xtgl_yhgl_yhlb').datagrid('reload',param);

}




function xtgl_yhgl_togglePlsc(index)
{
	if($("#xtgl_yhgl_yhlb").datagrid("getChecked").length>0){
		var candelete = true;
		var checked = $("#xtgl_yhgl_yhlb").datagrid("getChecked");
		for(i=0;i<checked.length;i++){
			if(checked[i]["is_editable"]=="0")
			{
				candelete = false;
				break;
			}
		}
		if(candelete){
			$("#xtgl_yhgl_plsc_btn").linkbutton("enable");
		}else{
			$("#xtgl_yhgl_plsc_btn").linkbutton("disable");
		}
		
	}else{
		$("#xtgl_yhgl_plsc_btn").linkbutton("disable");
	}

}

function xtgl_yhgl_plsc(){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
  			var checked = $("#xtgl_yhgl_yhlb").datagrid("getChecked");
  			var param = "";
  			for(i=0;i<checked.length;i++){
  				param = param + checked[i]["id"] + ",";
  			}
  			if(param.length>0){
  				param = param.substr(0,param.length-1);
  			}
			$.ajax({
				url:"./Operator-delete.action",
				method:"post",
				data:{"ids":param},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#xtgl_yhgl_yhlb").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}

function xtgl_xgmm_save(){
	if($('#xtgl_xgmm_xmm').textbox('getValue')!=$('#xtgl_xgmm_xmm1').textbox('getValue')){
		$.messager.alert("提示","两次密码不一致","info");
	}else{
		$(this).closest("form").form("submit",{
		url:"./Operator-changePwd.action",
		success:function(data){
			try{
				var obj = $.MingwenJSON.decode(data);
				$.messager.alert("提示",obj["msg"],"info",function(){});
				
				
			}catch(e){}
		},
		error:function(){
			$.messager.alert("提示","网络错误","info");
		}
	});
	}
}
