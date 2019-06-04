/***操作按钮*/

function process_daHandle(value,row,index) {
	var btn = '<a href="#" onclick="process_daEdit('+index+')" style="padding:10px;" ><i class="fa fa-pencil"></i> 编辑</a>' + '<a href="#" onclick="process_daDel('+index+')" style="padding:10px;" ><i class="fa fa-trash"></i> 删除</a>';
	return btn;
	
}

/***编辑*/

function process_daEdit(index){
	var row = $("#process_dalb").datagrid("getRows")[index];
	process_daSave(false);
}

/***删除*/


function process_daDel(index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#process_dalb").datagrid("getRows")[index];
  		} 
	});
}

/***添加*/

function process_daAdd(){
	process_daSave(true);
}

function process_daSave(isAdd){
	$("#process_content").hide();
	var editor = $("<div id='process_editor'></div>").insertAfter("#process_content");
	var opt = {
		border:false,
		href:"process_datj.html",
		method:"post",
		collapsible: false,
		minimizable: false,
		maximizable: false,
		onLoad:function(){
			if(isAdd){
				
			}else{
				
			}
		}
	};
	
	editor.panel(opt);
}

/***密码重置*/
function process_daPwdReset(index){
	$.messager.confirm("提示","确认修改密码?",function(ok){
			if(ok){
				//do delete all
			} 
		});

}
/***查询*/

function process_daSearch(){
	var arra = [
		{"property":"zgh","value":$('#process_Search_zgh').textbox("getValue")},
		{"property":"xm","value":$('#process_Search_xm').textbox("getValue")},
		{"property":"zw","value":$('#process_Search_zw').combobox("getValue")},
		{"property":"zc","value":$('#process_Search_zc').combobox("getValue")},
		{"property":"xb","value":$('#process_Search_xb').combobox("getValue")},
		{"property":"dqzt","value":$('#process_Search_dqzt').combobox("getValue")},
		{"property":"kssj","value":$('#process_Search_kssj').datebox("getValue")},
		{"property":"jssj","value":$('#process_Search_jssj').datebox("getValue")}

	];
	var param = {};
	param["filter"]=arra;
	$('#process_dalb').datagrid('reload',param);
	
	
}
/***重置*/

function process_daReset(){
	$("#process_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#process_dalb').datagrid('reload',param);
}

/***返回列表*/

function process_retList(){
	$("#process_editor").panel("destroy");
	$("#process_content").show();
}

/***导出*/
function process_daExport(){
	$.messager.confirm("提示","确认导出信息?",function(ok){
  		if(ok){
			//do delete all
  		} 
	});
}


/***列表行*/

function process_togglePlsc(){
	
	if($("#process_dalb").datagrid("getChecked").length>0){
		$("#process_daExport").linkbutton("enable");
	}else{
		$("#process_daExport").linkbutton("disable");
	}
	
}

