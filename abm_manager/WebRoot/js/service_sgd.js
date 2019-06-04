
var sgd = (function(){
	
	var editIndex = undefined;
	
	var endEditing = function(){
		if (editIndex == undefined){return true}
		if ($('#dg').datagrid('validateRow', editIndex)){
			//var ed = $('#dg').datagrid('getEditor', {index:editIndex,field:'productid'});
			//var productname = $(ed.target).combobox('getText');
			//$('#dg').datagrid('getRows')[editIndex]['productname'] = productname;
			$('#dg').datagrid('endEdit', editIndex);
			editIndex = undefined;
			return true;
		} else {
			return false;
		}
	}
	
	var onClickRow = function(index){
		if (editIndex != index){
			if (endEditing()){
				$('#dg').datagrid('selectRow', index)
						.datagrid('beginEdit', index);
				editIndex = index;
			} else {
				$('#dg').datagrid('selectRow', editIndex);
			}
		}
	}
	
	var append = function(){
		if (endEditing()){
			$('#dg').datagrid('acceptChanges');
		}
		var rows = $('#dg').datagrid('getRows');
		var data = [];
		if(rows.length > 0){
			for (var i = 0; i < rows.length; i++) {
//				var row_obj = {value:rows[i]['mc']};
//				data.push(row_obj);
				data.push({value:rows[i]['mc']});
			}
		}
		if (endEditing()){
			$('#dg').datagrid('appendRow',{status:'P'});
			editIndex = $('#dg').datagrid('getRows').length-1;
			$('#dg').datagrid('selectRow', editIndex)
					.datagrid('beginEdit', editIndex);
			if(editIndex==0){
				var editor = $('#dg').datagrid('getEditor',{
					index:0,
					field:'glsb'
				});
				$(editor.target).combobox({required:false});
			}else{
				if(data.length>0){
					var editor = $('#dg').datagrid('getEditor',{
						index:editIndex,
						field:'glsb'
					});
					$(editor.target).combobox('loadData',data);
				}
			}
		}
	}
	
	var removeit = function(){
		if (editIndex == undefined){return}
		$('#dg').datagrid('cancelEdit', editIndex)
				.datagrid('deleteRow', editIndex);
		editIndex = undefined;
	}
	
	var accept = function(){
		if (endEditing()){
			$('#dg').datagrid('acceptChanges');
		}
	}
	
	var reject = function(){
		$('#dg').datagrid('rejectChanges');
		editIndex = undefined;
	}
	
	var getChanges = function(){
		var rows = $('#dg').datagrid('getChanges');
		alert(rows.length+' 行已更改！');
	}
	
	var shigongdan_hf = function(index){
		var row = $('#end_list').datagrid('getRows')[index];
		
		var buttons=[];
//		if(row['status']=='0'){
//			
//		}
		buttons.push({
     		text:'保存',
     		iconCls:'fa fa-check',
     		handler:function(){
     			console.log(111);
     			var form_jObj = _dialog.find('#hfxx_form');
     			form_jObj.form('submit',{
     				url:'./ServiceRequest-returnVisit.action',
     				onSubmit:function(){
     					return form_jObj.form('validate');
     				},
     				success:function(resp){
     					resp = $.MingwenJSON.decode(resp);
     					if(resp['success']){
     						//$(_listId).datagrid('reload');
     						_dialog.window('destroy');
     					}
     					$.messager.alert('提示',resp['msg']);
     				}
     			});
     		}
     	});
		
		var _dialog = common.openDialog({
			id:'fwqq_sgd_hf',
			title:'['+row['req_name']+']施工单审批',
			width:'100%',
			height:'100%',
			href:'./page/service/service_pending_auditing.jsp',
			buttons:buttons,
			onLoad:function(){
				_dialog.find('#sgd_service_request_id').val(row['id']);
				var req_detail = row['req_detail'];
				_dialog.find('#sqr').html(row['req_name']);
				if(req_detail['lxr']){
					_dialog.find('#lxr').html(req_detail['lxr']);
				}else{
					_dialog.find('#lxr').html(row['req_name']);
				}
				_dialog.find('#lxfs').html(row['phone']);
				_dialog.find('#dz').html(req_detail['dz']);
				_dialog.find('#kssj').html(req_detail['kssj']);
				_dialog.find('#jssj').html(req_detail['jssj']);
				_dialog.find('#bak').html(row['bak']);
				
				_dialog.find('#sgr').textbox('setValue',row['exec_name']);
     			_dialog.find('#sgsj').textbox('setValue',row['exec_time']);
     			_dialog.find('#sgsm').textbox('setValue',row['exec_comment']);
     			_dialog.find('#sgr').textbox('disable');
     			_dialog.find('#sgsj').textbox('disable');
     			_dialog.find('#sgsm').textbox('disable');
				var exec_detail = row['exec_detail'];
				if(exec_detail && exec_detail.length>0){
					_dialog.find('#dg').datagrid('request',exec_detail);
				}
				_dialog.find('#pending_toolbar').hide();
				
				_dialog.find('#srm_id').val(row['id']);
				_dialog.find('#hfr_id').val(row['back_id']);
				_dialog.find('#hfr_name').textbox('setValue',row['back_name']);
				_dialog.find('#hfsj').datebox('setValue',row['back_time']);
				_dialog.find('#hfyj').textbox('setValue',row['back_comment']);
			}
		});
	}
	
	var shigongdan = function(index){
		var row = $('#pending_list').datagrid('getRows')[index];
		//createSqxxDiv(row['id']);
		
		var buttons=[];
		if(row['status']=='0'){
			buttons.push({
         		text:'保存',
         		iconCls:'fa fa-check',
         		handler:function(){
         			var sgr = _dialog.find('#sgr').textbox('getValue');
         			var sgsj = _dialog.find('#sgsj').datebox('getValue');
         			var sgsm = _dialog.find('#sgsm').textbox('getValue');
         			var equip_rows = _dialog.find('#dg').datagrid('getRows');
         			if(equip_rows.length==0){
         				$.messager.alert('提示','请添加施工设备');
         				return ;
         			}
         			equip_rows=$.MingwenJSON.encode(equip_rows);
         			var param={};
         			param['id']=row['id'];
         			param['sgr']=sgr;
         			param['sgsj']=sgsj;
         			param['sgsm']=sgsm;
         			param['equip_rows']=equip_rows;
         			common.ajax('./ServiceRequest-writeSGD.action',param,function(resp){
         				if(resp['success']){
         					
         				}
         				$.messager.alert('提示',resp['msg']);
         			});
         		}
         	});
			buttons.push({
         		text:'提交',
         		iconCls:'fa fa-check',
         		handler:function(){
         			var sgr = _dialog.find('#sgr').textbox('getValue');
         			var sgsj = _dialog.find('#sgsj').textbox('getValue');
         			var sgsm = _dialog.find('#sgsm').textbox('getValue');
         			var equip_rows = _dialog.find('#dg').datagrid('getRows');
         			if(equip_rows.length==0){
         				$.messager.alert('提示','请添加施工设备');
         				return ;
         			}
         			equip_rows=$.MingwenJSON.encode(equip_rows);
         			var param={};
         			param['id']=row['id'];
         			param['sgr']=sgr;
         			param['sgsj']=sgsj;
         			param['sgsm']=sgsm;
         			param['equip_rows']=equip_rows;
         			param['sftj']='1';
         			common.ajax('./ServiceRequest-writeSGD.action',param,function(resp){
         				if(resp['success']){
         					_dialog.window('destroy');
         					$('#pending_list').datagrid('load');
         				}
         				$.messager.alert('提示',resp['msg']);
         			});
         		}
         	});
		}
		
		var _dialog = common.openDialog({
			id:'fwqq_sgd_sp',
			title:'['+row['req_name']+']施工单审批',
			width:'100%',
			height:'100%',
			href:'./page/service/service_pending_auditing.jsp',
			buttons:buttons,
			onLoad:function(){
				_dialog.find('#sgd_service_request_id').val(row['id']);
				var req_detail = row['req_detail'];
				_dialog.find('#sqr').html(row['req_name']);
				if(req_detail['lxr']){
					_dialog.find('#lxr').html(req_detail['lxr']);
				}else{
					_dialog.find('#lxr').html(row['req_name']);
				}
				_dialog.find('#lxfs').html(row['phone']);
				_dialog.find('#dz').html(req_detail['dz']);
				_dialog.find('#kssj').html(req_detail['kssj']);
				_dialog.find('#jssj').html(req_detail['jssj']);
				_dialog.find('#bak').html(row['bak']);
				
				_dialog.find('#sgr').textbox('setValue',row['exec_name']);
     			_dialog.find('#sgsj').textbox('setValue',row['exec_time']);
     			_dialog.find('#sgsm').textbox('setValue',row['exec_comment']);
				var exec_detail = row['exec_detail'];
				if(exec_detail && exec_detail.length>0){
					_dialog.find('#dg').datagrid('request',exec_detail);
				}
				
				//_dialog.find('#srm_id').val(row['id']);
				//_dialog.find('#hfr_id').val(row['back_id']);
				_dialog.find('#hfr_name').textbox('disable');
				_dialog.find('#hfsj').datebox('disable');
				_dialog.find('#hfyj').textbox('disable');
			}
		});
	}
	
	return {
		selectHFR:function(){
			var win = $('#fwqq_sgd_hf');
			selectEmp.select({
				qx:'SERVICE_HANDLE',
				single:true,
				callback:function(emps){
					if(emps && emps.length>0){
						var emp=emps[0];
						win.find('#hfr_id').val(emp['id']);
						win.find('#hfr_name').textbox('setValue',emp['name']);
					}
				}
			});
		},
		fmt_zt:function(value){
			if(value){
				if(value=='0'){
					return '待处理';
				}else if(value=='1'){
					return '通过';
				}else if(value=='2'){
					return '拒绝';
				}
			}
			return '';
		},
		shigongdan_hf:shigongdan_hf,
		shigongdan:shigongdan,
		endEditing:endEditing,
		onClickRow:onClickRow,
		append:append,
		removeit:removeit,
		accept:accept,
		reject:reject,
		getChanges:getChanges
	};
	
}());
