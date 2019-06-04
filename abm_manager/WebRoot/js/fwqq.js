function fwqq_end_doHandle(value,row,index) {
	var btn = '';
	if(row['type']=='3'){
//		btn += '<a href="#" onclick="pending_look_emp(\''+row['req_id']+'\')" style="padding:10px 8px;" ><i class="fa fa-file-text"></i> 查看</a>';
		btn += '<a href="#" onclick="sgd.shigongdan_hf('+index+')" style="padding:10px 8px;" ><i class="fa fa-file-text"></i> 查看</a>';
	}else if(row['type']=='0'){
		btn += '<a href="#" onclick="hyzx_wdyy_doText(\'end_list\','+index+')" style="padding:10px 8px;" ><i class="fa fa-file-text"></i> 查看</a>';
	}
	if(parseInt(row['type'])>3){
		btn += '<a href="#" onclick="user_intention.callPhone(\''+row['req_id']+'\','+index+',\'end_list\')" style="padding:10px 8px;" ><i class="fa fa-file-text"></i> 查看</a>';
	}
	return btn;
}

function pending_doHandle(value,row,index) {
	var btn = '';
	if(row['type']=='3'){
		btn += '<a href="#" onclick="sgd.shigongdan('+index+')" style="padding:10px 8px;" ><i class="fa fa-gavel"></i> 施工</a>';
	}else if(row['type']=='2'){
		btn += '<a href="#" onclick="pending_doAuditing('+index+')" style="padding:10px 8px;" ><i class="fa fa-gavel"></i> 审核</a>';
		btn += '<a href="#" onclick="pending_look_emp(\''+row['req_id']+'\')" style="padding:10px 8px;" ><i class="fa fa-file-text"></i> 查看</a>';
	}else if(row['type']=='0'){
		btn += '<a href="#" onclick="hyzx_wdyy_doApply('+index+')" style="padding:10px 8px;" ><i class="fa fa-gavel"></i> 审核</a>';
		btn += '<a href="#" onclick="hyzx_wdyy_doText(\'pending_list\','+index+')" style="padding:10px 8px;" ><i class="fa fa-file-text"></i> 查看</a>';
	}
	if(parseInt(row['type'])>3){
		if(row['status']=='0'){
			btn += '<a href="#" onclick="user_intention.callPhone(\''+row['req_id']+'\','+index+')" style="padding:10px 8px;" ><i class="fa fa-gavel"></i> 处理</a>';
		}else{
			btn += '<a href="#" onclick="user_intention.callPhone(\''+row['req_id']+'\','+index+')" style="padding:10px 8px;" ><i class="fa fa-file-text"></i> 查看</a>';
		}
	}
	return btn;
}

function processing_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="processing_doText('+index+')" style="padding:10px 8px;" ><i class="fa fa-file-text"></i> 查看</a>';
	return btn;
}
function end_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="processing_doText('+index+')" style="padding:10px 8px;" ><i class="fa fa-file-text"></i> 查看</a>';
	return btn;
}

function pending_doAuditings(value,row,index){
	$.messager.confirm("提示","服务请求审核通过?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#pending_list").datagrid("getRows")[index];
  		} 
	});
}

function pending_retList(){
	$("#pending_editor").panel("destroy");
	$("#pending_content").show();
}
/**查看**/
function processing_doText(value,row,index){
	$("#processing_content").hide();
	var editor = $("<div id='processing_editor'></div>").insertAfter("#processing_content");
	var opt = {
		border:false,
		href:"service_processing_text.html",
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

function processing_retList(){
	$("#processing_editor").panel("destroy");
	$("#processing_content").show();
}
/*function processing_doText(value,row,index){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:'<i class="fa fa-file-text"></i> 查看',
				id:'processing_ck_w',
				width:"800px",
				height:"600px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"member_processing_text.html",
				buttons: [
						{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
							$("#processing_ck_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					
				}
				
	});
}*/

function pending_doSearch(){
	var arra = [
		{"property":"name","value":$('#pending_person').textbox("getValue")},
		{"property":"sqsj_kssj","value":$('#pending_sqsj_kssj').datebox("getValue")},
		{"property":"sqsj_jssj","value":$('#pending_sqsj_jssj').datebox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#pending_list').datagrid('reload',param);
}

function pending_doReset(){
	$("#pending_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#pending_list').datagrid('reload',param);
}

function processing_doSearch(){
	var arra = [
		{"property":"mc","value":$('#batch_mc').textbox("getValue")},
		{"property":"kssj","value":$('#batch_kssj').datebox("getValue")},
		{"property":"jssj","value":$('#batch_jssj').datebox("getValue")},
		{"property":"zt","value":$('#batch_zt').combobox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#processing_list').datagrid('reload',param);
}

function processing_doReset(){
	$("#processing_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#processing_list').datagrid('reload',param);
}
function end_doSearch(){
	var arra = [
		{"property":"name","value":$('#end_person').textbox("getValue")},
		{"property":"sl_name","value":$('#end_sl_person').textbox("getValue")},
		{"property":"slsj_kssj","value":$('#end_slsj_kssj').datebox("getValue")},
		{"property":"slsj_jssj","value":$('#end_slsj_jssj').datebox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#end_list').datagrid('reload',param);
}

function end_doReset(){
	$("#end_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#end_list').datagrid('reload',param);
}
function statistics_doSearch(){
	var arra = [
		{"property":"mc","value":$('#batch_mc').textbox("getValue")},
		{"property":"kssj","value":$('#batch_kssj').datebox("getValue")},
		{"property":"jssj","value":$('#batch_jssj').datebox("getValue")},
		{"property":"zt","value":$('#batch_zt').combobox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#statistics_list').datagrid('reload',param);
}

function statistics_doReset(){
	$("#statistics_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#statistics_list').datagrid('reload',param);
}

function pending_togglePlsc(){
	if($("#pending_list").datagrid("getChecked").length>0){
		var candelete = true;
		var checked = $("#pending_list").datagrid("getChecked");
		for(i=0;i<checked.length;i++){
			if(checked[i]["is_editable"]=="0")
			{
				candelete = false;
				break;
			}
		}
		if(candelete){
			$("#pending_del_btn").linkbutton("enable");
		}else{
			$("#pending_del_btn").linkbutton("disable");
		}
		
	}else{
		$("#pending_del_btn").linkbutton("disable");
	}

}

function end_togglePlsc(){
	if($("#end_list").datagrid("getChecked").length>0){
		var candelete = true;
		var checked = $("#end_list").datagrid("getChecked");
		for(i=0;i<checked.length;i++){
			if(checked[i]["is_editable"]=="0")
			{
				candelete = false;
				break;
			}
		}
		if(candelete){
			$("#end_del_btn").linkbutton("enable");
		}else{
			$("#end_del_btn").linkbutton("disable");
		}
		
	}else{
		$("#end_del_btn").linkbutton("disable");
	}

}

