function xtgl_gzmb_init(){
	if(!hasPriv("SYS_PAYROLL_TEMPLATE_ADD")){
		$("#xtgl_gzmb_zj_btn").hide();
	}
	if(!hasPriv("SYS_PAYROLL_TEMPLATE_DELETE")){
		$("#xtgl_gzmb_plsc_btn").hide();
	}
}

function xtgl_gzmb_retBtn(value,row,index) {
	var btn = '';
	if(hasPriv("SYS_PAYROLL_TEMPLATE_EDIT")){
		btn += '<a href="#" onclick="xtgl_gzmb_edit('+index+')" style="padding:10px 10px;" ><i class="fa fa-file-text-o"></i> 修改</a>';
	}
	if(hasPriv("SYS_PAYROLL_TEMPLATE_DELETE")){
		btn += '<a href="#" onclick="xtgl_gzmb_del('+index+')" style="padding:10px 10px;"><i class="fa fa-trash"></i> 删除</a>';
	}
	return btn;
	
}

function xtgl_gzmb_add_retBtn(value,row,index) {
	var btn = '';
	var code = row['data_code'];
	btn += '<select id="xtgl_gzmb_add_select_' + index + '" class="mwsmartui-combo" onchange="bindmean('+index+',\'xtgl_gzmb_add_select_' + index + '\')">';
	btn += '<option value=""> 无</option>';
	btn += code=="name"?'<option value="name" selected> 姓名</option>':'<option value="name" > 姓名</option>';
	btn += code=="sfzh"?'<option value="sfzh" selected> 身份证号</option>':'<option value="sfzh" > 身份证号</option>';
	btn += code=="rzrq"?'<option value="rzrq" selected> 入职日期</option>':'<option value="rzrq" > 入职日期</option>';
	btn += code=="gs"?'<option value="gs" selected> 个税</option>':'<option value="gs" > 个税</option>';
	btn += code=="sb"?'<option value="sb" selected> 社保</option>':'<option value="sb" > 社保</option>';
	btn += code=="kqts"?'<option value="kqts" selected> 实际考勤天数</option>':'<option value="kqts" > 实际考勤天数</option>';
	btn += code=="kqts"?'<option value="cd" selected> 迟到</option>':'<option value="cd" > 迟到</option>';
	btn += code=="kqts"?'<option value="jb" selected> 加班</option>':'<option value="jb" > 加班</option>';
	btn += code=="kqts"?'<option value="kqts" selected> 实际考勤天数</option>':'<option value="kqts" > 实际考勤天数</option>';
	btn += code=="yfgz"?'<option value="yfgz" selected> 应发工资</option>':'<option value="yfgz" > 应发工资</option>';
	btn += code=="sfgz"?'<option value="sfgz" selected> 实发工资</option>':'<option value="sfgz" > 实发工资</option></select>';
	return btn;
	
}

function bindmean(index, id){
	var row = $("#xtgl_gzmb_kmlb").datagrid("getRows")[index];
	var value = $('#' + id).val();
	row['data_code'] = value;
}

function xtgl_gzmb_edit(index){
	var row = $("#xtgl_gzmb_jslb").datagrid("getRows")[index];
	xtgl_gzmb_save(false,row);
}

function xtgl_gzmb_del(index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
		if(ok){
			var row = $("#xtgl_gzmb_jslb").datagrid("getRows")[index];
			$.ajax({
				url:"./Payroll-delByMb.action",
				method:"post",
				data:{"ids":row["id"]},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#xtgl_gzmb_jslb").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}

function xtgl_gzmb_add(){
	xtgl_gzmb_save(true);
}

function xtgl_gzmb_save(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
	var id = '';
	if(row){
		id = row['id'];
	}
	w.dialog({
		title:isAdd?"添加模板":"修改模板",
		width:"580px",
		height:"520px",
		resizable:false,
		collapsible:false,
		minimizable:false,
		maximizable:false,
		modal:true,
		href:"./page/system/xtgl_gzmb_add.jsp?id=" + id,
		buttons: [{
					text:'<i class="fa fa-check"> </i> 保存',
					disabled:!isAdd&&(!hasPriv("SYS_ROLE_MANAGER_EDIT")||row['is_editable']=='0'),
					handler:function(){
						xtgl_gzmb_doSave(w,isAdd);
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
				$('#templateFile_hide').hide();
			}
			if(row){
				$('#templateId').val(row['id']);
				$('#templateName').textbox('setValue',row['name']);
				$('#template_enterprise_id').combobox('setValue',row['enterprise_id']);
			}
			
		}
	});
}

function xtgl_gzmb_search(){
	var arra = [{"property":"name","value":$('#xtgl_gzmb_search_mc').textbox("getValue")}];
	var param = {};
    param["filter"]=arra;
    $('#xtgl_gzmb_jslb').datagrid('reload',param);

}
function xtgl_gzmb_reset(){
	$("#xtgl_gzmb_queryform").form("reset");	
	var param = {};
    param["filter"]=[];
    $('#xtgl_gzmb_jslb').datagrid('reload',param);

}

var _editDefIndex = undefined;

function _endEditingDef(){
	if (_editDefIndex == undefined){
		return true;
	};
	if ($('#xtgl_gzmb_kmlb').datagrid('validateRow', _editDefIndex)){
		$('#xtgl_gzmb_kmlb').datagrid('endEdit', _editDefIndex);
		_editDefIndex = undefined;
		return true;
	} else {
		return false;
	}
}

function xtgl_gzmb_doSave(win,isAdd){
	if(!win.find('#templateName').textbox('isValid')){
		$.messager.alert("提示","请填写模板名称","info");
		return;
	}
	if(!win.find('#template_enterprise_id').combobox('isValid')){
		$.messager.alert("提示","请选择企业","info");
		return;
	}
	if(!win.find('#templateFile').filebox('isValid') && isAdd){
		$.messager.alert("提示","请上传模板文件","info");
		return;
	}
	var rows = $('#xtgl_gzmb_kmlb').datagrid('getRows');
	var arr = [];
	for(var i in rows){
		var row = rows[i];
		if(row['data_code']){
			arr.push(row['data_code']);
		}
	}
//	// 校验是否有必选
	if(arr.indexOf('name') == -1 || arr.indexOf('sfzh') == -1 || arr.indexOf('yfgz') == -1 || arr.indexOf('sfgz') == -1){
		$.messager.alert("提示","需要至少绑定（姓名、身份证号、应发工资、实发工资）","info");
		return;
	}
	var s = arr.join(',') + ',';
	for(var i in arr) {
		// 校验是否重复
		if(s.replace(arr[i]+",","").indexOf(arr[i]+",")>-1) {
			$.messager.alert("提示","含义不允许重复绑定,请检查后重试","info");
			return;
		}
	}
	$('#xtgl_gzmb_add_form').form('submit',{
		url:"./Payroll-save.action",
		onSubmit:function(param){
			for(var i = 0; i < rows.length; i++){
				param['items[' + i + '].id'] = rows[i]['id'];
				param['items[' + i + '].name'] = rows[i]['name'];
				param['items[' + i + '].formula'] = rows[i]['formula'];
				param['items[' + i + '].seq'] = rows[i]['seq'];
				param['items[' + i + '].data_code'] = rows[i]['data_code'];
			}
			if(!isAdd){
				return true;
			}
		},
		success:function(resp){
			resp = JSON.parse(resp);
			$.messager.alert("提示",resp["msg"],"info",function(){});
			$("#xtgl_gzmb_jslb").datagrid("reload");
			win.window("destroy");
		},
		error:function(){
			$.messager.alert("提示","网络错误","info");
		}
	});
	if (_endEditingDef()){
		$('#xtgl_gzmb_kmlb').datagrid('acceptChanges');
	}
}

function xtgl_gzmb_onclick(index){
	if (_editDefIndex != index){
		if (_endEditingDef()){
			$('#xtgl_gzmb_kmlb').datagrid('selectRow', index).datagrid('beginEdit', index);
			var editors = $('#xtgl_gzmb_kmlb').datagrid('getEditors', index);
			if(editors[0].oldHtml == "应发工资" || editors[0].oldHtml == "实发工资" || editors[0].oldHtml == "社保" || editors[0].oldHtml == "个税"){
				$(editors[0].target).combobox('disable');
//				$(editors[0].target).combobox('setText','固定');
			}
			_editDefIndex = index;
		} else {
			$('#xtgl_gzmb_kmlb').datagrid('selectRow', _editDefIndex);
		}
	}
}

function impModel(){
	if(!$('#templateFile').filebox('isValid')){
		$.messager.alert("提示","请上传模板文件","info");
		return;
	}
	$('#xtgl_gzmb_add_form').form('submit',{
		url:"./Payroll-importModel.action",
		onSubmit:function(){
			return true;
		},
		success:function(resp){
			$('#xtgl_gzmb_kmlb').datagrid('loading');
			resp = JSON.parse(resp);
			if(resp['success'] && resp['data']){
				var arrs = resp['data'];
				var arr = arrs[1];
				var rows = [];
				for(var i = 0; i < arr.length; i++){
					var row = {};
					if(arr[i]['CellContent']){
						row['name'] = arr[i]['CellContent'];
						row['seq'] = arr[i]['ColumnIndex'];
						row['formula'] = arrs[2][i]['CellType']['Formula']?true:false;
						rows.push(row);
					}
				}
				$('#xtgl_gzmb_kmlb').datagrid('loaded');
				$('#xtgl_gzmb_kmlb').datagrid('request',{total:arr.length,rows:rows});
			} else {
				$.messager.alert("提示","导入文件有误，请检查后重试","info",function(){});
			}
			
		},
		error:function(){
			$.messager.alert("提示","网络错误","info");
		}
	});
}

function xtgl_gzmb_add_item(){
	var rows = $('#xtgl_gzmb_kmlb').datagrid('getRows');
	var index = rows.length + 1;
	var row = {
		'name' : '科目'+ index,
		'px' : index
	};
	$('#xtgl_gzmb_kmlb').datagrid('appendRow',row);
	$('#xtgl_gzmb_kmlb').datagrid('request',{rows:$('#xtgl_gzmb_kmlb').datagrid('getRows')});
}

function xtgl_gzmb_del_item(index){
	var row = $("#xtgl_gzmb_kmlb").datagrid("getRows")[index];
	if(row['name'] == "应发工资" || row['name']== "实发工资" || row['name'] == "社保" || row['name'] == "个税"){
		$.messager.alert("提示","默认项无法修改或删除","info",function(){});
	} else {
		$.messager.confirm("提示","确认删除信息?",function(ok){
	  		if(ok){
	  			$('#xtgl_gzmb_kmlb').datagrid('deleteRow', index);
	  			$('#xtgl_gzmb_kmlb').datagrid('request',{rows:$('#xtgl_gzmb_kmlb').datagrid('getRows')});
	  		}
		});
	}
}

function xtgl_gzmb_togglePlsc(index)
{
	if($("#xtgl_gzmb_jslb").datagrid("getChecked").length>0){
		var candelete = true;
		var checked = $("#xtgl_gzmb_jslb").datagrid("getChecked");
		for(i=0;i<checked.length;i++){
			if(checked[i]["is_editable"]=="0")
			{
				candelete = false;
				break;
			}
		}
		if(candelete){
			$("#xtgl_gzmb_plsc_btn").linkbutton("enable");
		}else{
			$("#xtgl_gzmb_plsc_btn").linkbutton("disable");
		}
		
	}else{
		$("#xtgl_gzmb_plsc_btn").linkbutton("disable");
	}

}

function xtgl_gzmb_plsc(){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
  			var checked = $("#xtgl_gzmb_jslb").datagrid("getChecked");
  			var param = "";
  			for(i=0;i<checked.length;i++){
  				param = param + checked[i]["id"] + ",";
  			}
  			if(param.length>0){
  				param = param.substr(0,param.length-1);
  			}
			$.ajax({
				url:"./Payroll-delByMb.action",
				method:"post",
				data:{"ids":param},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#xtgl_gzmb_jslb").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}
