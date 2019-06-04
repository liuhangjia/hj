/**投票结果统计列表操作按钮*/
function result_daHandle(value,row,index) {
	var btn = '<a href="#" onclick="" style="padding:10px;" ><i class="icon-columns"></i> 查看结果</a>';
	return btn;
}
function result_Handle(value,row,index) {
	var btn = '<a href="#" onclick="" style="padding:10px;" ><i class="icon-columns"></i> 查看详情</a>';
	return btn;
}

function result_daCourse(){
var w = $("<div></div>").css("padding","5px").appendTo("body");
			w.dialog({
				title:"<i class='icon-columns'> </i> 查看详情",
				id:'',
				width:"560px",
				height:"400px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"result_course.html",
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					$(this).find("[name='grd']").datagrid({
						border:false,
						singleSelect:true,
						collapsible:true,
						scrollbarSize:0, 
                        url:'datagrid_data03.json',
                        method:'get'
					});
				}
				
	});
}

/**投票结果统计查看*/
function result_daLook(){
	$("#result_content").hide();
	var editor = $("<div id='result_editor'></div>").insertAfter("#result_content");
	var opt = {
		border:false,
		href:"result_look.html",
		method:"post",
		collapsible: false,
		minimizable: false,
		maximizable: false,
		onLoad:function(){
			
		}
	};
	
	editor.panel(opt);
}
function result_retList(){
	$("#result_editor").panel("destroy");
	$("#result_content").show();
}

/**投票结果统计列表查询*/

function result_daSearch(){
	var arra = [
		{"property":"mc","value":$('#result_mc').textbox("getValue")},
		{"property":"kssj","value":$('#result_kssj').datebox("getValue")},
		{"property":"jssj","value":$('#result_jssj').datebox("getValue")},
		{"property":"zt","value":$('#result_zt').combobox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#result_list').datagrid('reload',param);
	
	
}
/***清除投票数据*/
function result_daDel(value,row,index){
	$.messager.confirm("提示","确认清除投票数据信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#result_list").datagrid("getRows")[index];
  		} 
	});
}
/**投票结果统计列表重置*/

function result_daReset(){
	$("#result_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#result_list').datagrid('reload',param);
}
/***评委投票结果统计导出*/
function result_daExport(value,row,index){
	$.messager.confirm("提示","确认导出投票结果",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#result_list").datagrid("getRows")[index];
  		} 
	});
}


