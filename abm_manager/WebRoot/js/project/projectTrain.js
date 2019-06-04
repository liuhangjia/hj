
var projectTrain = (function(){
	
//	var _div = '#project_communication_div';
//	var _listId = _div + " #project_communication_list";
	
	var _modifyWin = function(row,project_id){
		if(!project_id){
			project_id='';
		}
		var train_id = '';
		var title = '';
		var disabled_flag = false;
		if(row){
			train_id = row['id'];
			title = '<i class="fa fa-pencil"> </i> 查看';
			disabled_flag = !hasPriv("PROJECT_TRAINING_EDIT");
		}else{
			title = '<i class="fa fa-plus"> </i> 添加';
		}
		var _dialog = common.openDialog({
			id:'train_modify_win',
			title:title,
			width:'720px',
			height:'600px',
			href:"./page/project/project_train_modify.jsp?train_id="+train_id,
//			buttons:[
//			         	{
//			         		text:'保存',
//			         		iconCls:'fa fa-check',
//			         		disabled:disabled_flag,
//			         		handler:function(){
//			         			if(_dialog.find('#train_modify_form').form('validate')){
//			         				var xm_id = _dialog.find('#xmmc_select').combobox('getValue');
//				         			var checker_id = _dialog.find('#checker_id').val();
//				         			var checker_name = _dialog.find('#checker_name').textbox('getValue');
//				         			var type = _dialog.find('#type').textbox('getValue');
//				         			var check_time = _dialog.find('#check_time').datebox('getValue');
//				         			var bak = _dialog.find('#bak').textbox('getValue');
//				         			var items = _dialog.find('#project_checking_item_list').datagrid('getRows');
//				         			var param={};
//				         			if(row){
//				         				param['id']=train_id;
//				         			}
//				         			param['project_id']=xm_id;
//				         			param['checker_id']=checker_id;
//				         			param['checker_name']=checker_name;
//				         			param['type']=type;
//				         			param['check_time']=check_time;
//				         			param['bak']=bak;
//				         			param['items']=items;
//				         			param=$.MingwenJSON.encode(param);
//				         			common.ajax('./ProjectChecking-modify.action',{param:param},function(resp){
//				         				if(resp['success']){
//				         					_dialog.window('destroy');
//				         					$('#train_list'+project_id).datagrid('load');
//				         				}
//				         				$.messager.alert('提示',resp['msg']);
//				         			});
//			         			}
//			         		}
//			         	}
//			         ],
			onLoad:function(){
				if(row){
					var newRow={};
					for ( var key in row) {
						newRow['train.'+key]=row[key];
					}
					_dialog.find('#train_modify_form').form('load',newRow);
				}
				
				common.ajax('./Project-list.action',{},function(resp){
					_dialog.find('#xmmc_select').combobox('loadData', resp['rows']);
					if(project_id){
						_dialog.find('#xmmc_select').combobox('setValue', project_id);
						_dialog.find('#xmmc_select').combobox('readonly');
					}
				});
			}
		});
	}
	
	var _handlerDel = function(ids,project_id){
		common.ajax('./ProjectTraining-delete.action',{ids:ids},function(resp){
			if(resp['success']){
				$('#train_list'+project_id).datagrid('reload');
			}
			$.messager.alert('提示',resp['msg']);
		});
	}
	
	return {
		delItem:function(){
			var win = $('#train_modify_win');
			var table = win.find('#project_checking_item_list');
			var checkeds = table.datagrid('getChecked');
			if(checkeds && checkeds.length>0){
				$.messager.confirm('提示','确认删除选择的检查内容吗?',function(b){
					if(b){
						var ids = [];
						for(var i = 0 ; i < checkeds.length ; i++){
							ids.push(checkeds[i]['id']);
						}
						common.ajax('./ProjectCheckingItem-delete.action',{ids:ids.join(',')},function(resp){
							table.datagrid('load');
						});
					}
				});
			}else{
				$.messager.alert('提示','请选择检查内容');
			}
		},
		modifyItem:function(id,index){
			var train_id =null;
			var win = $('#train_modify_win');
			var table = win.find('#project_checking_item_list');
			
			var title='';
			var row=null;
			if(undefined!=index && null!=index){
				title = '<i class="fa fa-pencil"> </i> 查看';
				row = table.datagrid('getRows')[index];
				train_id = row['project_checking_id'];
			}else{
				title = '<i class="fa fa-plus"> </i> 添加';
				train_id = $(this).linkbutton('options')['train_id'];
			}
			var _dialog = common.openDialog({
				id:'train_item_modify_win',
				title:title,
				width:'510px',
				height:'300px',
				href:"./page/project/project_train_item_modify.jsp",
				buttons:[
				         	{
				         		text:'保存',
				         		iconCls:'fa fa-check',
				         		handler:function(){
				         			var content=_dialog.find('#content').textbox('getValue');
			         				var result=_dialog.find('#result').textbox('getValue');
			         				var handle_result=_dialog.find('#handle_result').textbox('getValue');
				         			if(train_id && train_id!=''){
				         				if(!row){
				         					row={};
				         				}
				         				row['content']=content;
				         				row['result']=result;
				         				row['handle_result']=handle_result;
				         				row['project_checking_id']=train_id;
				         				common.ajax('./ProjectCheckingItem-modify.action',{param:$.MingwenJSON.encode(row)},function(resp){
				         					table.datagrid('load');
				         				});
				         			}else{
				         				var newRow={};
				         				newRow['content']=content;
				         				newRow['result']=result;
				         				newRow['handle_result']=handle_result;
				         				newRow['false_id']='false_id' + new Date().getTime();
				         				table.datagrid('appendRow',newRow);
				         			}

				         			_dialog.window('destroy');
				         		}
				         	}
				         ],
				onLoad:function(){
					if(row){
						_dialog.find('#content').textbox('setValue',row['content']);
         				_dialog.find('#result').textbox('setValue',row['result']);
         				_dialog.find('#handle_result').textbox('setValue',row['handle_result']);
					}
				}
			});
		},
		selectEmp:function(){
			var win = $('#train_modify_win');
			selectEmp.select({
				qx:'PROJECT_TRAINING_ADD',
				single:true,
				callback:function(emps){
					if(emps && emps.length>0){
						var emp=emps[0];
						win.find('#checker_id').val(emp['id']);
						win.find('#checker_name').textbox('setValue',emp['name']);
					}
				}
			});
		},
		add:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			_modifyWin(null,project_id);
		},
		detail:function(project_id,index){
			var row = $('#train_list'+project_id).datagrid('getRows')[index];
			_modifyWin(row,project_id);
		},
		delBatch:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			var checkeds = $('#train_list'+project_id).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除选择的项目培训吗?',function(b){
					if(b){
						var ids = [];
						for(var i = 0 ; i < checkeds.length ; i++){
							ids.push(checkeds[i]['id']);
						}
						_handlerDel(ids.join(','),project_id);
					}
				});
			}else{
				$.messager.alert('提示','请选择项目');
			}
		},
		del:function(project_id,index){
			var row = $('#train_list'+project_id).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除[项目'+row['project_name']+common.fmt_date10(row['start_time'])+'的项目培训]吗?',function(b){
				if(b){
					_handlerDel(row['id'],project_id);
				}
			});
		},
		listOpts:function(value,row,index){
			var project_id = $(this).attr('project_id');
			if(!project_id){
				project_id='';
			}
			var btn = '';
			btn += '<a href="#" onclick="projectTrain.detail(\''+project_id+'\','+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 查看</a>';
			if(hasPriv("PROJECT_TRAINING_DELETE")){
				btn += '<a href="#" onclick="projectTrain.del(\''+project_id+'\','+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			return btn;
		},
		itemListOpts:function(value,row,index){
			var row_id='';
			if(row['id']){
				row_id=row['id'];
			}
			var btn = '';
			btn += '<a href="#" onclick="projectTrain.modifyItem(\''+row_id+'\','+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 查看</a>';
			return btn;
		},
		query:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			var project_name = $('#xmpx_search_xmmc'+project_id).textbox('getValue');
			var type = $('#xmpx_search_pxlx'+project_id).textbox('getValue');
			var start_time = $('#xmpx_search_kssj'+project_id).datebox('getValue');
			var end_time = $('#xmpx_search_jssj'+project_id).datebox('getValue');
			var teacher = $('#xmpx_search_pxjs'+project_id).textbox('getValue');

			var arra = [
			    		{"property":"project_name","value":project_name},
			    		{"property":"type","value":type},
			    		{"property":"start_time","value":start_time},
			    		{"property":"end_time","value":end_time},
			    		{"property":"teacher","value":teacher}
			    	];
			var param = {filter:arra};
			$('#train_list'+project_id).datagrid('reload',param);
		},
		reset:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			$("#train_queryform"+project_id).form("reset");
			var param = {};
		    param["filter"]=[];
		    $('#train_list'+project_id).datagrid('reload',param);
		},
		click: function(){
			var project_id = $(this).datagrid('options')['project_id'];
			if($('#train_list' + project_id).datagrid("getChecked").length>0){
				var candelete = true;
				var checked = $('#train_list' + project_id).datagrid("getChecked");
				for(i=0;i<checked.length;i++){
					if(checked[i]["is_editable"]=="0")
					{
						candelete = false;
						break;
					}
				}
				if(candelete){
					$("#project_train_del_btn" + project_id).linkbutton("enable");
				}else{
					$("#project_train_del_btn" + project_id).linkbutton("disable");
				}
				
			}else{
				$("#project_train_del_btn" + project_id).linkbutton("disable");
			}
		}
	};
}());