function xtgl_sjzd_init(value,row,index) {
	if(!hasPriv("BASE_CODE_MANAGER_ADD")){
		$("#xtgl_sjzd_add_btn").hide();
	}
	if(!hasPriv("BASE_CODE_MANAGER_DELETE")){
		$("#xtgl_sjzd_plsc_btn").hide();
	}
}

function xtgl_sjzd_selType(node){
	$("#xtgl_sjzd_plsc_btn").linkbutton("disable");
	$('#xtgl_sjzd_list').data('typeid',node.id);
	$('#xtgl_sjzd_list').datagrid('load','./BaseCode-listByType.action?type_id='+node.id);
}

function xtgl_sjzd_retBtn(value,row,index){
	var btn = '<a href="#" onclick="xtgl_sjzd_edit('+index+')" style="padding:10px 10px;" ><i class="fa fa-file-text-o"></i> 修改</a>';
	return btn;
}

function xtgl_sjzd_add(){
	xtgl_sjzd_save(true);
	
}

function xtgl_sjzd_edit(index){
	var row = $("#xtgl_sjzd_list").datagrid("getRows")[index];
	xtgl_sjzd_save(false,row);
}

function xtgl_sjzd_save(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"字典添加":"字典修改",
				width:"580px",
				height:"250px",
				resizable:false,
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"./page/system/xtgl_sjzd_add.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							disabled:!isAdd&&!hasPriv("BASE_CODE_MANAGER_EDIT"),
							handler:function(){
								xtgl_sjzd_doSave(w);
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
						w.find("form").form("load",row);
						w.find('[textboxname="code"]').textbox('readonly',true);
					}else{
						w.find('[name="type_id"]').val($('#xtgl_sjzd_list').data('typeid'));
					}
				}
	});
}
function xtgl_sjzd_doSave(win){
	win.find("form").form("submit",{
		url:"./BaseCode-save.action",
		success:function(data){
			try{
				var obj = $.MingwenJSON.decode(data);
				$.messager.alert("提示",obj["msg"],"info",function(){});
				if(obj["success"]){
					win.window('destroy');
					$("#xtgl_sjzd_list").datagrid("reload");
				}
				
			}catch(e){}
		},
		error:function(){
			$.messager.alert("提示","网络错误","info");
		}
	});
}

function xtgl_sjzd_plsc(){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
  			var checked = $("#xtgl_sjzd_list").datagrid("getChecked");
  			var param = "";
  			for(i=0;i<checked.length;i++){
  				param = param + checked[i]["id"] + ",";
  			}
  			if(param.length>0){
  				param = param.substr(0,param.length-1);
  			}
			$.ajax({
				url:"./BaseCode-delete.action",
				method:"post",
				data:{"ids":param},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#xtgl_sjzd_list").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}

function xtgl_sjzd_togglePlsc(index){
	if($("#xtgl_sjzd_list").datagrid("getChecked").length>0){
		$("#xtgl_sjzd_plsc_btn").linkbutton("enable");
	}else{
		$("#xtgl_sjzd_plsc_btn").linkbutton("disable");
	}
}






