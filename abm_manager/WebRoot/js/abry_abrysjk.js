function abry_abrysjk_init(){
	
}

function abry_abrysjk_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="abry_abrysjk_doOverview('+index+')" style="padding:10px 8px;" ><i class="fa fa-file-text-o"></i> 查看</a>';
	btn += '<a href="#" onclick="abry_abrysjk_dangan_doDownload('+index+')" style="padding:10px 8px;" ><i class="fa fa-download"></i> 下载档案</a>';
	return btn;
}

function abry_abrysjk_dangan_doDownload(index){
	var row = $('#abry_abrysjk_list').datagrid('getRows')[index];
	window.open('./page/system/abry_abrysjk_dangan_export.jsp?emp_id='+row['id']);
}

/**删除*/
function abry_abrysjk_plsc(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			//do delete row
  			var row = $("#abry_abrysjk_list").datagrid("getRows")[index];
  		} 
	});
}
function abry_abrysjk_add(){
	$("#abry_abrysjk_content").hide();
	var editor = $("<div id='abry_abrysjk_editor'></div>").insertAfter("#abry_abrysjk_content");
	var opt = {
		border:false,
		href:"page/system/abry_abrysjk_add.jsp",
		method:"post",
		fit:true,
		collapsible: false,
		minimizable: false,
		maximizable: false,
		onLoad:function(){
			$('#abrysjk_child_table_form').hide();
			
		}
	};
	editor.panel(opt);
}
function abry_abrysjk_doOverview(index){
	var row=null;
	if(undefined!=index && null!=index){
		row = $('#abry_abrysjk_list').datagrid('getRows')[index];
	}
	var emp_id='';
	if(row){
		emp_id=row['id'];
	}
	$("#abry_abrysjk_content").hide();
	var editor = $("<div id='abry_abrysjk_editor'></div>").insertAfter("#abry_abrysjk_content");
	var opt = {
		border:false,
		href:"page/system/abry_abrysjk_add.jsp?emp_id="+emp_id,
		method:"post",
		fit:true,
		collapsible: false,
		minimizable: false,
		maximizable: false,
		onLoad:function(){
			if(row){
				var newRow={};
				for ( var key in row) {
					newRow['employee.'+key]=row[key];
				}
				$('#emp_base_info_form').form('load',newRow);
//				$('#emp_base_info_form'+emp_id).form('load',newRow);
			}
		}
	};
	editor.panel(opt);
}


/***返回列表*/

function abry_abrysjk_retList(){
	$("#abry_abrysjk_editor").panel("destroy");
	$("#abry_abrysjk_content").show();
	$('#abry_abrysjk_list').datagrid('load');
}
function abry_abrysjk_import(value,row,index){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-sign-in'> </i> 导入",
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"page/system/abry_abrysjk_import.jsp",
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
													w.panel("destroy");
													$("#abry_abrysjk_list").datagrid("reload");
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
					
					w.find("form").form("load",{});
				
				}
				
	});
}
function abry_abrysjk_export(value,row,index){
//	var _dialog = common.openDialog({
//		title:'安保人员导出',
//		width:'540px',
//		height:'210px',
//		href:"./page/system/abry_abrysjk_batch_export.jsp",
//		buttons:[
//		         	{
//		         		text:'导出',
//		         		iconCls:'fa fa-check',
//		         		handler:function(){
//		         			var url = './page/system/abry_abrysjk_export.jsp?';
//		         			var checkboxs = _dialog.find('input[type="checkbox"]:checked');
//		         			if(checkboxs && checkboxs.length>0){
//		         				checkboxs.each(function(){
//		         					url += $(this).val() + '=1&';
//		         				});
//		         				
//		         			}else{
//		         				$.messager.alert('提示','请选择要导出的内容');
//		         			}
//		         		}
//		         	}
//		         ],
//		onLoad:function(){
//			
//		}
//	});
	var url = './page/system/abry_abrysjk_export.jsp?';
	var checkeds = $('#abry_abrysjk_list').datagrid('getChecked');
	if(checkeds && checkeds.length>0){
		var ids_str = '';
		for (var i = 0; i < checkeds.length; i++) {
			ids_str += ','+checkeds[i]['id'];
		}
		ids_str = ids_str.substring(1);
		url += 'emp_ids='+ids_str;
	}else{
		var arra = [
			  		{"property":"name","value":$('#abry_abrysjk_search_name').textbox("getValue")},
			  		{"property":"star","value":$('#abry_abrysjk_search_star').numberbox("getValue")},
			  		{"property":"sex","value":$('#abry_abrysjk_search_sex').combobox("getValue")},
			  		{"property":"mz","value":$('#abry_abrysjk_search_mz').combobox("getValue")},
			  		{"property":"zzmm","value":$('#abry_abrysjk_search_zzmm').combobox("getValue")},
			  		{"property":"phone","value":$('#abry_abrysjk_search_phone').textbox("getValue")},
			  		{"property":"weight","value":$('#abry_abrysjk_search_weight').numberbox("getValue")},
			  		{"property":"height","value":$('#abry_abrysjk_search_height').numberbox("getValue")},
			  		{"property":"age_min","value":$('#abry_abrysjk_search_age_min').numberbox("getValue")},
			  		{"property":"age_max","value":$('#abry_abrysjk_search_age_max').numberbox("getValue")}
			  	];
		for (var i = 0; i < arra.length; i++) {
			var ele = arra[i];
			url += ele['property']+'='+ele['value']+'&';
		}
		url = url.substring(0,url.length-1);
	}
	window.open(url);
}

function abry_abrysjk_search(){
	var arra = [
		{"property":"name","value":$('#abry_abrysjk_search_name').textbox("getValue")},
		{"property":"star","value":$('#abry_abrysjk_search_star').numberbox("getValue")},
		{"property":"sex","value":$('#abry_abrysjk_search_sex').combobox("getValue")},
		{"property":"mz","value":$('#abry_abrysjk_search_mz').combobox("getValue")},
		{"property":"zzmm","value":$('#abry_abrysjk_search_zzmm').combobox("getValue")},
		{"property":"phone","value":$('#abry_abrysjk_search_phone').textbox("getValue")},
		{"property":"weight","value":$('#abry_abrysjk_search_weight').numberbox("getValue")},
		{"property":"height","value":$('#abry_abrysjk_search_height').numberbox("getValue")},
		{"property":"age_min","value":$('#abry_abrysjk_search_age_min').numberbox("getValue")},
		{"property":"age_max","value":$('#abry_abrysjk_search_age_max').numberbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#abry_abrysjk_list').datagrid('reload',param);
}

function abry_abrysjk_reset(){
	$("#abry_abrysjk_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#abry_abrysjk_list').datagrid('reload',param);
}




