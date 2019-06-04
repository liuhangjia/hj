function xtgl_xtrz_init(value,row,index) {
	if(!hasPriv("SYS_LOG_MANAGER_DELETE")){
		$("#xtgl_xtrz_plsc_btn").hide();
	}
}
function xtgl_xtrz_plsc(){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
  			var checked = $("#xtgl_xtrz_list").datagrid("getChecked");
  			var param = "";
  			for(i=0;i<checked.length;i++){
  				param = param + checked[i]["id"] + ",";
  			}
  			if(param.length>0){
  				param = param.substr(0,param.length-1);
  			}
			$.ajax({
				url:"./SysLog-delete.action",
				method:"post",
				data:{"ids":param},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#xtgl_xtrz_list").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}

function xtgl_xtrz_search(){
	var arra = [{"property":"account","value":$('#xtgl_xtrz_search_account').textbox("getValue")},
		{"property":"start","value":$('#xtgl_xtrz_search_start').datebox("getValue")},
		{"property":"start","value":$('#xtgl_xtrz_search_end').datebox("getValue")}];
	var param = {};
    param["filter"]=arra;
    $('#xtgl_xtrz_list').datagrid('reload',param);
}

function xtgl_xtrz_reset(){
	
	$("#xtgl_xtrz_queryform").form("reset");	
	var param = {};
    param["filter"]=[];
    $('#xtgl_xtrz_list').datagrid('reload',param);
}

function xtgl_xtrz_togglePlsc(){
	
	if($("#xtgl_xtrz_list").datagrid("getChecked").length>0){
		$("#xtgl_xtrz_plsc_btn").linkbutton("enable");
	}else{
		$("#xtgl_xtrz_plsc_btn").linkbutton("disable");
	}
		
	
}





