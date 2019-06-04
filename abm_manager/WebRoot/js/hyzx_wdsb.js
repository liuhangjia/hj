function hyzx_wdsb_apply(id,index){
	var row = null;
	var buttons = [];
	if(id){
		row = $('#hyzx_wdsb_list').datagrid('getRows')[index];
	}
	if(!id || row['status']=='0'){
		buttons = [
			      	{
			      		text:'提交',
			      		iconCls:'fa fa-check',
			      		handler:function(){
			      			if(_dialog.find('#hyzx_wdsb_add_form').form('validate')){
			      				//var enterprise_id = _dialog.find('#enterprise_id').combobox('getValue');
			      				//var req_name = _dialog.find('#req_name').textbox('getValue');
			      				var project_id = '';
			      				if(_dialog.find('#project_id').length>0){
			      					project_id = _dialog.find('#project_id').combobox('getValue');
			      				}
			      				var kssj = _dialog.find('#kssj').datebox('getValue');
			      				var jssj = _dialog.find('#jssj').datebox('getValue');
			      				var lxr = _dialog.find('#lxr').textbox('getValue');
			      				var lxdh = _dialog.find('#lxdh').textbox('getValue');
			      				var dz = _dialog.find('#dz').textbox('getValue');
			      				var bak = _dialog.find('#bak').textbox('getValue');
			      				var param={
			      						project_id:project_id,
			      						kssj:kssj,
			      						jssj:jssj,
			      						lxr:lxr,
			      						lxdh:lxdh,
			      						dz:dz,
			      						bak:bak
			      				};
			      				if(id){
			      					param['id'] = id;
			      				}
			      				param = $.MingwenJSON.encode(param);
			      				common.ajax('./ServiceRequest-sgdAdd.action',{param:param},function(resp){
			      					if(resp['success']){
			      						$('#hyzx_wdsb_list').datagrid('load');
			      						_dialog.window('destroy');
			      					}
			      					$.messager.alert('提示',resp['msg']);
			      				});
			      			}
			      		}
			      	}
			      ];
	}
	
	var _dialog = common.openDialog({
		id:'hyzx_wdsb_apply_win',
		title:'申请施工单',
		width:'550px',
		height:'500px',
		href:'./page/member/hyzx_wdsb_add.jsp',
		buttons:buttons,
		onLoad:function(){
			common.ajax('./Project-list.action',{page:1,rows:1000000},function(resp){
				var rows = resp['rows'];
				if(rows && rows.length>0){
					_dialog.find('#project_id').combobox('loadData',rows);
				}
			});
			if(id){
				var req_detail_obj = row['req_detail'];
				if(_dialog.find('#project_id').length>0){
					if(req_detail_obj['project_id']){
						_dialog.find('#project_id').combobox('setValue',req_detail_obj['project_id']);
					}
				}
				_dialog.find('#kssj').datebox('setValue',req_detail_obj['kssj']);
				_dialog.find('#jssj').datebox('setValue',req_detail_obj['jssj']);
				_dialog.find('#lxr').textbox('setValue',req_detail_obj['lxr']);
				_dialog.find('#dz').textbox('setValue',req_detail_obj['dz']);
				_dialog.find('#lxdh').textbox('setValue',row['phone']);
				_dialog.find('#bak').textbox('setValue',row['bak']);
			}
		}
	});
}

function hyzx_wdsb_formatStatus(value,row,index){
	if(value == '1'){
		return '通过';
	}else if(value == '2'){
		return '拒绝';
	}else{
		return '待处理';
	}
}

function hyzx_wdsb_doHandle(value,row,index){
	var btn = '';
	btn += '<a href="#" onclick="hyzx_wdsb_apply(\''+row['id']+'\','+index+')" style="padding:10px 8px;" ><i class="fa fa-file-text"></i> 查看</a>';
	return btn;
}




















