var sys_act_role = (function(){
	
	var _divId = '#act_div';
	var _listId = _divId + ' #act_role_list';
	
	var _modifyWin = function(index,id){
		var title = '';
		var row = {};
		if(id){
			row = $(_listId).datagrid('getRows')[index];
			title = '编辑流程角色[<font color=red>' + row['name_'] + '</font>]';
		}else{
			title = '新增流程角色';
		}
		var _w = common.openDialog({
			id:'sys_act_role_modify_win',
			href:'./page/system/act/act_role_modify.jsp',
			title:title,
			width:'400px',
			height:'300px',
			buttons:[
			         	{
			         		text:'保存',
			         		iconCls:'icon-save',
							handler:function(){
								if(_w.find('form').form('validate')){
									var params = {};
									params['role.id_'] = _w.find('#id').val();
									params['role.name_'] = _w.find('#name').textbox('getValue');
									params['role.seq_'] = _w.find('#seq').numberbox('getValue');
									params['role.mark_'] = _w.find('#mark').textbox('getValue');
									common.ajax('./ActRole-modify.action',params,function(resp){
										if(resp['success']){
											_w.window('destroy');
											$(_listId).datagrid('reload',{'filter':[]});
										}
										$.messager.alert('提示',resp['msg']);
									});
								}
							}
			         	}
			         ],
			onLoad:function(){
				var _this = $(this);
				if(id && row){
					_this.find('#id').val(row['id_']);
					_this.find('#name').textbox('setValue',row['name_']);
					_this.find('#seq').numberbox('setValue',row['seq_']);
					_this.find('#mark').textbox('setValue',row['mark_']);
				}
			}
		});
	}
	
	return {
		add : function(){
			_modifyWin();
		},
		del : function(){
			var checkeds = $(_listId).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除[<font color=red>'+checkeds[0]['name_']+'</font>]吗?',function(b){
					if(b){
						common.ajax('./ActRole-delete.action',{'ids':checkeds[0]['id_']},function(resp){
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
		detail : function(id,index){
			_modifyWin(index,id);
		},
		listEmps : function(id ,index){
			var rows = $(_listId).datagrid('getRows'); 
			var row = rows[index];
			var _dialog = common.openDialog({
				id:'sys_act_role_emp_win',
				href: './page/system/act/act_role_emp.jsp?id=' + id,
				title: row['name_'],
				onLoad : function(){
					var _btnAddEmps = _dialog.find('#addEmps');
					_btnAddEmps.linkbutton({
						onClick:function(){
							employee.select({
								title: row['name_'] + ' - 选择流程角色人员',
								single:false,
								callback:function(datas){
									var empIds = [];
									for(var i = 0 ; i < rows.length ; i++){
										empIds.push(rows[i]['emp_id_']);
									}
									var params = {};
									var c = 0;
									empIds = empIds.join(',');
									for(var i = 0 ; i < datas.length ; i++){
										var data = datas[i];
										if(empIds.indexOf(data[id]) == -1){
											params['emps['+c+'].emp_id_'] = data['id'];
											params['emps['+c+'].emp_name_'] = data['xm'];
											params['emps['+c+'].emp_jtbh_'] = data['jtbh'];
											c++;
										}
									}
									params['role.id_'] = id;
									common.ajax('./ActRole-addEmps.action',params,function(resp){
										if(resp['success']){
											_dialog.find('#act_role_emp_list').datagrid('reload');
										}
										$.messager.alert('提示',resp['msg']);
									});
								}
							});
						}
					});
					var _btnDelEmps = _dialog.find('#delEmps');
					_btnDelEmps.linkbutton({
						onClick:function(){
							var checkeds = _dialog.find('#act_role_emp_list').datagrid('getChecked');
							if(checkeds && checkeds.length > 0){
								$.messager.confirm('提示','确认删除[<font color=red>'+checkeds[0]['emp_name_']+'</font>]吗?',function(b){
									if(b){
										common.ajax('./ActRole-delEmps.action',{'ids':checkeds[0]['id_']},function(resp){
											if(resp['success']){
												_dialog.find('#act_role_emp_list').datagrid('reload');
											}
											$.messager.alert('提示',resp['msg']);
										});
									}
								});
							}else{
								$.messager.alert('提示','请选流程角色人员信息');
							}
						}
					});
				}
			});
		},
		listOpts : function(value,row,index){
			var btn = '';
			btn += '<a href="#" id="" onclick="sys_act_role.detail(\''+row['id_']+'\','+index+');" title="编辑">';
			btn += '<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">编辑</span><span class="l-btn-icon icon-edit">&nbsp;</span></span>';
			btn += '</a>';
			btn += '<a href="#" id="" onclick="sys_act_role.listEmps(\''+row['id_']+'\','+index+');" title="人员列表">';
			btn += '<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">人员列表</span><span class="l-btn-icon icon-blog">&nbsp;</span></span>';
			btn += '</a>';
			return btn;
		},
		select : function(options){
			var _defOpts = {title:'选择监听',width:'500px',height:'400px',onLoad:null,callback:null,selected:[],single:false};
			options = $.extend(true,_defOpts,options);
			var _w = common.openDialog({
				id:'sys_act_role_select_win',
				href:'./page/system/act/choose_role.jsp',
				title:options['title'],
				width:options['width'],
				height:options['height'],
				buttons:[
				         	{
				         		text:'选择',
				         		iconCls:'icon-ok',
								handler:function(){
									var checkeds = _w.find('#act_role_list').datagrid('getChecked');
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