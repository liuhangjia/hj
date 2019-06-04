
var projectWork = (function(){
	
//	var _div = '#project_communication_div';
//	var _listId = _div + " #project_communication_list";
	
	var _modifyWin = function(row,project_id){
		if(!project_id){
			project_id='';
		}
		var work_id = '';
		var title = '';
		var disabled_flag = false;
		if(row){
			work_id = row['id'];
			title = '<i class="fa fa-pencil"> </i> 编辑';
			disabled_flag = !hasPriv("PROJECT_CHECKING_EDIT");
		}else{
			title = '<i class="fa fa-plus"> </i> 添加';
		}
		var _dialog = common.openDialog({
			id:'work_modify_win',
			title:title,
			width:'680px',
			height:'590px',
			href:"./page/project/project_work_modify.jsp?work_id="+work_id,
			buttons:[
			         	{
			         		text:'保存',
			         		iconCls:'fa fa-check',
			         		disabled:disabled_flag,
			         		handler:function(){
			         			if(_dialog.find('#work_modify_form').form('validate')){
			         				var xm_id = _dialog.find('#xmmc_select').combobox('getValue');
				         			var checker_id = _dialog.find('#checker_id').val();
				         			var checker_name = _dialog.find('#checker_name').textbox('getValue');
				         			var type = _dialog.find('#type').combobox('getValue');
				         			var check_time = _dialog.find('#check_time').datebox('getValue');
				         			var bak = _dialog.find('#bak').textbox('getValue');
				         			var items = _dialog.find('#project_checking_item_list').datagrid('getRows');
				         			var param={};
				         			if(row){
				         				param['id']=work_id;
				         			}
				         			param['project_id']=xm_id;
				         			param['checker_id']=checker_id;
				         			param['checker_name']=checker_name;
				         			param['type']=type;
				         			param['check_time']=check_time;
				         			param['bak']=bak;
				         			param['items']=items;
				         			param=$.MingwenJSON.encode(param);
				         			common.ajax('./ProjectChecking-modify.action',{param:param},function(resp){
				         				if(resp['success']){
				         					_dialog.window('destroy');
				         					$('#work_list'+project_id).datagrid('load');
				         				}
				         				$.messager.alert('提示',resp['msg']);
				         			});
			         			}
			         		}
			         	}
			         ],
			onLoad:function(){
				if(row){
					_dialog.find('#xmmc_select').combobox('setValue',row['project_id']);
	     			_dialog.find('#checker_id').val(row['checker_id']);
	     			_dialog.find('#checker_name').textbox('setValue',row['checker_name']);
	     			_dialog.find('#type').combobox('setValue',row['type']);
	     			_dialog.find('#check_time').datebox('setValue',row['check_time']);
	     			_dialog.find('#bak').textbox('setValue',row['bak']);
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
		common.ajax('./ProjectChecking-delete.action',{ids:ids},function(resp){
			if(resp['success']){
				$('#work_list'+project_id).datagrid('reload');
			}
			$.messager.alert('提示',resp['msg']);
		});
	}
	
	return {
		delItem:function(){
			var win = $('#work_modify_win');
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
			var work_id =null;
			var win = $('#work_modify_win');
			var table = win.find('#project_checking_item_list');
			
			var title='';
			var row=null;
			if(undefined!=index && null!=index){
				title = '<i class="fa fa-pencil"> </i> 编辑';
				row = table.datagrid('getRows')[index];
				work_id = row['project_checking_id'];
			}else{
				title = '<i class="fa fa-plus"> </i> 添加';
				work_id = $(this).linkbutton('options')['work_id'];
			}
			var _dialog = common.openDialog({
				id:'work_item_modify_win',
				title:title,
				width:'510px',
				height:'300px',
				href:"./page/project/project_work_item_modify.jsp",
				buttons:[
				         	{
				         		text:'保存',
				         		iconCls:'fa fa-check',
				         		handler:function(){
				         			var content=_dialog.find('#content').textbox('getValue');
			         				var result=_dialog.find('#result').textbox('getValue');
			         				var handle_result=_dialog.find('#handle_result').textbox('getValue');
				         			if(work_id && work_id!=''){
				         				if(!row){
				         					row={};
				         				}
				         				row['content']=content;
				         				row['result']=result;
				         				row['handle_result']=handle_result;
				         				row['project_checking_id']=work_id;
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
			var win = $('#work_modify_win');
			selectEmp.select({
				qx:'PROJECT_CHECKING_ADD',
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
			var row = $('#work_list'+project_id).datagrid('getRows')[index];
			_modifyWin(row,project_id);
		},
		delBatch:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			var checkeds = $('#work_list'+project_id).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除选择的工作检查吗?',function(b){
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
			var row = $('#work_list'+project_id).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除[项目'+row['project_name']+common.fmt_date10(row['check_time'])+'的工作检查]吗?',function(b){
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
			btn += '<a href="#" onclick="projectWork.detail(\''+project_id+'\','+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			if(hasPriv("PROJECT_CHECKING_DELETE")){
				btn += '<a href="#" onclick="projectWork.del(\''+project_id+'\','+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			return btn;
		},
		itemListOpts:function(value,row,index){
			var row_id='';
			if(row['id']){
				row_id=row['id'];
			}
			var btn = '';
			btn += '<a href="#" onclick="projectWork.modifyItem(\''+row_id+'\','+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			return btn;
		},
		query:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			var project_name = $('#gzjc_search_xmmc'+project_id).textbox('getValue');
			var type = $('#gzjc_search_jclx'+project_id).textbox('getValue');
			var start = $('#gzjc_search_kssj'+project_id).datebox('getValue');
			var end = $('#gzjc_search_jssj'+project_id).datebox('getValue');
			var checker_name = $('#gzjc_search_jczg'+project_id).textbox('getValue');

			var arra = [
			    		{"property":"project_name","value":project_name},
			    		{"property":"type","value":type},
			    		{"property":"start","value":start},
			    		{"property":"end","value":end},
			    		{"property":"checker_name","value":checker_name}
			    	];
			var param = {filter:arra};
			$('#work_list'+project_id).datagrid('reload',param);
		},
		reset:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			$("#work_queryform"+project_id).form("reset");
			var param = {};
		    param["filter"]=[];
		    $('#work_list'+project_id).datagrid('reload',param);
		},
		click: function(){
			var project_id = $(this).datagrid('options')['project_id'];
			if($('#work_list' + project_id).datagrid("getChecked").length>0){
				var candelete = true;
				var checked = $('#work_list' + project_id).datagrid("getChecked");
				for(i=0;i<checked.length;i++){
					if(checked[i]["is_editable"]=="0")
					{
						candelete = false;
						break;
					}
				}
				if(candelete){
					$("#project_work_del_btn" + project_id).linkbutton("enable");
				}else{
					$("#project_work_del_btn" + project_id).linkbutton("disable");
				}
				
			}else{
				$("#project_work_del_btn" + project_id).linkbutton("disable");
			}
		}
	};
}());