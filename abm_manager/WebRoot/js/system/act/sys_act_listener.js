// 流程监听
var sys_act_listener = (function(){
	var _divId = '#act_div';
	var _listId = _divId + ' #act_listener_list';
	
	var _modifyWin = function(index,id){
		var title = '';
		var row = {};
		if(id){
			row = $(_listId).datagrid('getRows')[index];
			title = '编辑流程监听[<font color=red>' + row['name_'] + '</font>]';
		}else{
			title = '新增流程监听';
		}
		var _w = common.openDialog({
			id:'sys_act_listener_modify_win',
			href:'./page/system/act/act_listener_modify.jsp',
			title:title,
			width:'400px',
			height:'300px',
			buttons:[
			         	{
			         		text:'保存',
			         		iconCls:'icon-save',
							handler:function(){
								var params = {};
								params['model.id_'] = _w.find('#id').val();
								params['model.name_'] = _w.find('#name').textbox('getValue');
								params['model.group_'] = _w.find('input[type="radio"][name="type"]:checked').val();
								params['model.event'] = _w.find('#event').combobox('getValue');
								params['model.class_'] = _w.find('#class').textbox('getValue');
								params['model.type_'] = 'javaClass'
								common.ajax('./ActListener-modify.action',params,function(resp){
									if(resp['success']){
										_w.window('destroy');
										$(_listId).datagrid('reload',{'filter':[]});
									}
									$.messager.alert('提示',resp['msg']);
								});
							}
			         	}
			         ],
			onLoad:function(){
				var _this = $(this);
				var _event = _this.find('#event');
				var _event_opts = _event.combobox('options');
				_event_opts['valueField'] = 'code';
				_event_opts['textField'] = 'code';
				_this.find('input[type="radio"][name="type"]').bind('click',function(){
					var _type = $(this).val();
					if(_type == 'QJSJ'){
						_event_opts['url'] = './SysBaseCode-list.action?type=LCJT_QJSJ';
					}else if(_type == 'LXSJ'){
						_event_opts['url'] = './SysBaseCode-list.action?type=LCJT_LXSJ';
					}else if(_type == 'JDSJ'){
						_event_opts['url'] = './SysBaseCode-list.action?type=LCJT_JDSJ';
					}
					_event.combobox(_event_opts);
				});
				
				if(id && row){
					_this.find('#id').val(row['id_']);
					_this.find('#name').textbox('setValue',row['name_']);
					_this.find('#class').textbox('setValue',row['class_']);
					_this.find('input[type="radio"][name="type"]').each(function(){
						var _type = $(this);
						var _type_val = _type.val();
						if(_type.val() == row['group_']){
							_type.attr('checked',true);
							if(_type_val == 'QJSJ'){
								_event_opts['url'] = './SysBaseCode-list.action?type=LCJT_QJSJ';
							}else if(_type_val == 'LXSJ'){
								_event_opts['url'] = './SysBaseCode-list.action?type=LCJT_LXSJ';
							}else if(_type_val == 'JDSJ'){
								_event_opts['url'] = './SysBaseCode-list.action?type=LCJT_JDSJ';
							}
							_event.combobox(_event_opts);
						}
					});
					_this.find('#event').combobox('setValue',row['event']);
				}
			}
		});
	}
	
	return {
		add:function(){
			_modifyWin();
		},
		del:function(){
			var checkeds = $(_listId).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除[<font color=red>'+checkeds[0]['name_']+'</font>]吗?',function(b){
					if(b){
						common.ajax('./ActListener-delete.action',{'ids':checkeds[0]['id_']},function(resp){
							if(resp['success']){
								$(_listId).datagrid('reload');
							}
							$.messager.alert('提示',resp['msg']);
						});
					}
				});
			}else{
				$.messager.alert('提示','请选流程监听信息');
			}
		},
		detail:function(id,index){
			_modifyWin(index,id);
		},
		listOpts:function(value,row,index){
			var btn = '';
			btn += '<a href="#" id="" onclick="sys_act_listener.detail(\''+row['id_']+'\','+index+');" title="详情">';
			btn += '<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">详情</span><span class="l-btn-icon icon-edit">&nbsp;</span></span>';
			btn += '</a>';
			return btn;
		},
		select:function(options){
			var _defOpts = {title:'选择监听',width:'500px',height:'400px',onLoad:null,callback:null,group:null,selected:[],single:false};
			options = $.extend(true,_defOpts,options);
			var _w = common.openDialog({
				id:'sys_act_listener_select_win',
				href:'./page/system/act/choose_listener.jsp?group='+options['group'],
				title:options['title'],
				width:options['width'],
				height:options['height'],
				buttons:[
				         	{
				         		text:'选择',
				         		iconCls:'icon-ok',
								handler:function(){
									var checkeds = _w.find('#act_listener_list').datagrid('getChecked');
									if(checkeds.length > 0){
										options.callback && options.callback(checkeds);
										_w.window('destroy');
									}else{
										$.messager.alert('提示','请选择监听');
									}
								}
				         	}
				         ],
				onLoad:function(){
					options.onLoad && options.onLoad.call(_w);
				}
			});
		}
	};
}());