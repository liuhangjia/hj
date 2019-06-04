function khgl_hygl_init(){
}

function khgl_hygl_search(){
	var arra = [{"property":"name","value":$('#khgl_hygl_search_name').textbox("getValue")},
		{"property":"phone","value":$('#khgl_hygl_search_phone').textbox("getValue")},
		{"property":"addr","value":$('#khgl_hygl_search_addr').textbox("getValue")}];
	var param = {};
    param["filter"]=arra;
    $('#khgl_hygl_list').datagrid('reload',param);
}

function khgl_hygl_reset(){
	$("#khgl_hygl_queryForm").form("reset");	
	var param = {};
    param["filter"]=[];
    $('#khgl_hygl_list').datagrid('reload',param);
}

function khgl_hygl_retBtn(value,row,index){
	var btn = '';
	if(hasPriv("MEMBER_MANAGER_RESET")){
		btn = btn + '<a href="#" onclick="khgl_hygl_resetPwd('+index+')" style="padding:10px 10px;" ><i class="fa fa-asterisk"></i> 重置密码</a>';
	}
	return btn;
	
}
function khgl_hygl_formatType(value){
	if(value=='0'){
		return '商铺';
	}else if(value=='1'){
		return '个人';
	}else{
		return value;
	}
}
function khgl_hygl_resetPwd(index){
	
	$.messager.confirm("提示","确认重置密码?",function(ok){
  		if(ok){
			
  			var row = $('#khgl_hygl_list').datagrid('getRows')[index];
  			$.ajax({
				url:"./Member-resetPwd.action",
				method:"post",
				data:{"id":row["account_id"]},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#khgl_hygl_list").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}