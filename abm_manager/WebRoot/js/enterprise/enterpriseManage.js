// 客户管理
var enterpriseManage = (function(){
	
	var _div = '#div_eneterprise_manage';
	var _listId = _div + ' #enterprise_manage_list';
	
	var _modifyWin = function(row){
		var title = '';
		if(row){
			title = '<i class="fa fa-pencil"> </i> 编辑';
		}else{
			title = '<i class="fa fa-plus"> </i> 添加';
		}
		var _dialog = common.openDialog({
			title:title,
			width:'540px',
			height:'430px',
			buttons:[
			         	{
			         		text:'提交',
			         		iconCls:'fa fa-check',
			         		disabled:row&&!hasPriv("ENTERPRISE_MANAGER_EDIT"),
			         		handler:function(){
			         			_dialog.find('form').form('submit',{
			         				url:'./Enterprise-modify.action',
			         				onSubmit:function(){
			         					return $(this).form('validate');
			         				},
			         				success:function(resp){
			         					resp = JSON.parse(resp);
			         					if(resp['success']){
			         						$(_listId).datagrid('reload');
			         						_dialog.window('destroy');
			         					}
			         					$.messager.alert('提示',resp['msg']);
			         				}
			         			});
			         		}
			         	}
			         ],
			href:'./page/customer/enterpriseAdd.jsp',
			onLoad:function(){
				if(row){
					var data = {};
					for(var p in row){
						data['enterprise.'+p] = row[p];
					}
					_dialog.find('form').form('load',data);
				}else{
					_dialog.find('[name="enterprise.is_delete"]').val('0');
				}
			}
		});
	}
	
	var _delHandler = function(ids){
		common.ajax('./Enterprise-delete.action',{ids:ids},function(resp){
			if(resp['success']){
				$(_listId).datagrid('reload');
			}
			$.messager.alert('提示',resp['msg']);
		});
	}
	
	return {
		init:function(){
			if(!hasPriv("ENTERPRISE_MANAGER_ADD")){
				$("#enterprise_manage_add_btn").hide();
			}
			if(!hasPriv("ENTERPRISE_MANAGER_DELETE")){
				$("#enterprise_manage_plsc_btn").hide();
			}
			if(!hasPriv("ENTERPRISE_MANAGER_IMPORT")){
				$("#enterprise_manage_import_btn").hide();
			}
		},
		add:function(){
			_modifyWin();
		},
		detail:function(index){
			var row = $(_listId).datagrid('getRows')[index];
			_modifyWin(row);
		},
		delBatch:function(){
			var checkeds = $(_listId).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除选择的企业吗?',function(b){
					if(b){
						var ids = [];
						for(var i = 0 ; i < checkeds.length ; i++){
							ids.push(checkeds[i]['id']);
						}
						_delHandler(ids.join(','));
					}
				});
			}else{
				$.messager.alert('提示','请选择企业信息');
			}
		},
		del:function(index){
			var row = $(_listId).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除[<font color=red>'+row['name']+'</font>]吗?',function(b){
				if(b){
					_delHandler(row['id']);
				}
			});
		},
		setManager:function(index){
			var row = $(_listId).datagrid('getRows')[index];
			var _dialog = common.openDialog({
				title:'[<font color=red>' + row['name'] + '</font>]企业管理员',
				width:'540px',
				height:'230px',
				href:'./page/customer/enterpriseSetManager.jsp?id='+row['id'],
				buttons:[
				         {
				        	text:'设置企业管理员',
				        	iconCls:'fa fa-check',
				        	handler:function(){
				        		if(_dialog.find('form').form('validate')){
				        			var params = {};
				        			params['enterpriseId'] = _dialog.find('#enterpriseId').val();
					        		params['account'] = _dialog.find('#account').textbox('getValue');
					        		params = JSON.stringify(params);
					        		common.ajax('./Enterprise-setManager.action',{json:params},function(resp){
					        			if(resp['success']){
					        				_dialog.window('destroy');
					        			}
					        			$.messager.alert('提示',resp['msg']);
					        		});
				        		}
				        	}
				         }
				        ]
			});
		},
		listOpts:function(value,row,index){
			var btn = '';
			btn += '<a href="#" onclick="enterpriseManage.detail('+index+')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 编辑</a>';
			if(hasPriv("ENTERPRISE_MANAGER_DELETE")){
				btn += '<a href="#" onclick="enterpriseManage.del('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			if(hasPriv("ENTERPRISE_MANAGER_EDIT")){
				btn += '<a href="#" onclick="enterpriseManage.setManager('+index+')" style="padding:10px 8px;" ><i class="fa fa-cogs"></i> 设置企业管理员</a>';
			}
			return btn;
		},
		query:function(){
			var name = $(_div).find('#enterprise_query_name').textbox('getValue');
			if('' != $.trim(name)){
				var filters = [];
				var filter = {};
				filter['property'] = 'name';
				filter['value'] = name;
				filters.push(filter);
				$(_listId).datagrid('load',{'filter':filters});
			}
		},
		reset:function(){
			$(_div).find('#enterprise_query_name').textbox('reset');
			$(_listId).datagrid('load',{'filter':[]});
		},
		click: function(){
			if($('#enterprise_manage_list').datagrid("getChecked").length>0){
				var candelete = true;
				var checked = $('#enterprise_manage_list').datagrid("getChecked");
				for(i=0;i<checked.length;i++){
					if(checked[i]["is_editable"]=="0")
					{
						candelete = false;
						break;
					}
				}
				if(candelete){
					$("#enterprise_manage_plsc_btn").linkbutton("enable");
				}else{
					$("#enterprise_manage_plsc_btn").linkbutton("disable");
				}
				
			}else{
				$("#enterprise_manage_plsc_btn").linkbutton("disable");
			}
		}
	};
}());