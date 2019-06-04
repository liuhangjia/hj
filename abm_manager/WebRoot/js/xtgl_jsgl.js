function xtgl_jsgl_init(){
	if(!hasPriv("SYS_ROLE_MANAGER_ADD")){
		$("#xtgl_jsgl_zj_btn").hide();
	}
	if(!hasPriv("SYS_ROLE_MANAGER_DELETE")){
		$("#xtgl_jsgl_plsc_btn").hide();
	}
}
function xtgl_jsgl_retBtn(value,row,index) {
	var btn = '<a href="#" onclick="xtgl_jsgl_edit('+index+',false)" style="padding:10px 10px;" ><i class="fa fa-file-text-o"></i> 修改</a>';
	
	btn = btn + '<a href="#" onclick="xtgl_jsgl_authority('+index+')" style="padding:10px 10px;" ><i class="fa fa-id-badge"></i> 权限</a>';
	
	if(hasPriv("SYS_ROLE_MANAGER_DELETE")&&row['is_editable']=='1'){
		btn = btn + '<a href="#" onclick="xtgl_jsgl_del('+index+')" style="padding:10px 10px;"><i class="fa fa-trash"></i> 删除</a>';
	}
	return btn;
	
}

function xtgl_jsgl_authority(index) {
	
 var w = $("<div></div>").css("padding","10px").appendTo("body");
 var row = $("#xtgl_jsgl_jslb").datagrid("getRows")[index];
			w.dialog({
				title:"权限设置",
				id:'jsgl_authority_w',
				width:"700px",
				height:"550px",
				resizable:false,
				minimizable:false,
				maximizable:false,
				collapsible:false,
				modal:true,
				href:"./page/system/xtgl_jsgl_jsqx.jsp",
				onClose:function(){
					$(this).window("destroy");
				},
				onOpen:function(){
					$.parser.parse($(this).next());
				},
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							disabled:!hasPriv("SYS_ROLE_MANAGER_GRANT")||row['is_editable']=='0',
							handler:function(){
								xtgl_jsgl_qxtj(w);
							}
						},
						{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
								w.panel("destroy");
							}
				}],
				onLoad:function(){
					
					
					$("#xtgl_jsgl_jsqx_roleId").val(row["id"]);
					
					$.ajax({
						url:"./Priv-getAllPrivList.action",
						loadMsg:'数据加载中,请稍后......',
						method:"post",
						data:{"roleId":row["id"]},
						dataType:"json",
						success:function(resp){
							
							$('#xtgl_jsqx_tree').tree({
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


//function jsgl_role(value,row) {
//	
//	var roles = "";
//	for(var i=0; i<row.RoleList.length; i++){
//		roles = roles +" &nbsp; "+row.RoleList[i]["name"];
//		
//	}
//	return roles;
//}





function xtgl_jsgl_edit(index,isReadOnly){

	var row = $("#xtgl_jsgl_jslb").datagrid("getRows")[index];
	xtgl_jsgl_save(false,row,isReadOnly);
}

function xtgl_jsgl_del(index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			
  			var row = $("#xtgl_jsgl_jslb").datagrid("getRows")[index];
  			$.ajax({
				url:"./Role-delete.action",
				method:"post",
				data:{"ids":row["id"]},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#xtgl_jsgl_jslb").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}


function xtgl_jsgl_add(){
	xtgl_jsgl_save(true);
}

function xtgl_jsgl_save(isAdd,row,isReadOnly){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"角色添加":"角色修改",
				width:"580px",
				height:"420px",
				resizable:false,
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"./page/system/xtgl_jsgl_add.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							disabled:!isAdd&&(!hasPriv("SYS_ROLE_MANAGER_EDIT")||row['is_editable']=='0'),
							handler:function(){
								xtgl_jsgl_doSave(w);
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
						if(!hasPriv("SYS_ROLE_MANAGER_EDIT")||row['is_editable']=='0'){
							w.find("[textboxname^='role.']").textbox("readonly",true);
						}
						var obj = {};
						for(var k in row){
							obj["role."+k] = row[k];
						}
						w.find("form").form("load",obj);
						
					}
				}
	});
}


function  xtgl_jsgl_doSave(win){
	
	win.find("form").form("submit",{
		url:"./Role-save.action",
		success:function(data){
			try{
				var obj = $.MingwenJSON.decode(data);
				$.messager.alert("提示",obj["msg"],"info",function(){});
				if(obj["success"]){
					win.window('destroy');
					$("#xtgl_jsgl_jslb").datagrid("reload");
				}
				
			}catch(e){}
		},
		error:function(){
			$.messager.alert("提示","网络错误","info");
		}
	});

}
function xtgl_jsgl_qxtj(win){
	
	var checked = $("#xtgl_jsqx_tree").tree("getChecked");
  	var param = "";
  	for(i=0;i<checked.length;i++){
  		if(checked[i]['id']){
  			param = param + checked[i]["id"] + ",";
  		}
  	}
  	if(param.length>0){
  		param = param.substr(0,param.length-1);
  	}
	$("#xtgl_jsgl_jsqx_privId").val(param);
	
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

function xtgl_jsgl_search(){
	var arra = [{"property":"name","value":$('#xtgl_jsgl_search_jsmc').textbox("getValue")}];
	var param = {};
    param["filter"]=arra;
    $('#xtgl_jsgl_jslb').datagrid('reload',param);

}
function xtgl_jsgl_reset(){
	$("#xtgl_jsgl_queryform").form("reset");	
	var param = {};
    param["filter"]=[];
    $('#xtgl_jsgl_jslb').datagrid('reload',param);

}


function xtgl_jsgl_togglePlsc(index)
{
	if($("#xtgl_jsgl_jslb").datagrid("getChecked").length>0){
		var candelete = true;
		var checked = $("#xtgl_jsgl_jslb").datagrid("getChecked");
		for(i=0;i<checked.length;i++){
			if(checked[i]["is_editable"]=="0")
			{
				candelete = false;
				break;
			}
		}
		if(candelete){
			$("#xtgl_jsgl_plsc_btn").linkbutton("enable");
		}else{
			$("#xtgl_jsgl_plsc_btn").linkbutton("disable");
		}
		
	}else{
		$("#xtgl_jsgl_plsc_btn").linkbutton("disable");
	}

}

function xtgl_jsgl_plsc(){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
  			var checked = $("#xtgl_jsgl_jslb").datagrid("getChecked");
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
					$("#xtgl_jsgl_jslb").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}
