
var projectEvent = (function(){
	
	var _modifyWin = function(row,project_id){
		if(!project_id){
			project_id='';
		}
		var event_id = '';
		var title = '';
		var disabled_flag = false;
		if(row){
			event_id = row['id'];
			title = '<i class="fa fa-pencil"> </i> 编辑';
			disabled_flag = !hasPriv("PROJECT_EVENT_EDIT");
		}else{
			title = '<i class="fa fa-plus"> </i> 添加';
		}
		var _dialog = common.openDialog({
			id:'event_modify_win',
			title:title,
			width:'555px',
			height:'500px',
			href:"./page/project/project_milestone_add.jsp?event_id="+event_id,
			buttons:[
			         	{
			         		text:'保存',
			         		iconCls:'fa fa-check',
			         		disabled:disabled_flag,
			         		handler:function(){
			         			if(_dialog.find('#event_modify_form').form('validate')){
			         				_dialog.find('form').form('submit',{
				         				url:'./ProjectEvent-modify.action',
				         				onSubmit:function(){
				         					
				         				},
				         				success:function(resp){
				         					resp = $.MingwenJSON.decode(resp);
				         					if(resp['success']){
				         						$('#milestone_list'+project_id).datagrid('load');
				         						_dialog.window('destroy');
				         					}
				         					$.messager.alert('提示',resp['msg']);
				         				}
				         			});
			         			}
			         		}
			         	}
			         ],
			onLoad:function(){
				if(row){
					var newRow={};
					for ( var key in row) {
						newRow['event.'+key]=row[key];
					}
					_dialog.find('#event_modify_form').form('load',newRow);
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
		common.ajax('./ProjectEvent-delete.action',{ids:ids},function(resp){
			if(resp['success']){
				$('#milestone_list'+project_id).datagrid('reload');
			}
			$.messager.alert('提示',resp['msg']);
		});
	}
	
	return {
		delItem:function(){
			var win = $('#event_modify_win');
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
			var event_id =null;
			var win = $('#event_modify_win');
			var table = win.find('#project_checking_item_list');
			
			var title='';
			var row=null;
			if(undefined!=index && null!=index){
				title = '<i class="fa fa-pencil"> </i> 编辑';
				row = table.datagrid('getRows')[index];
				event_id = row['project_checking_id'];
			}else{
				title = '<i class="fa fa-plus"> </i> 添加';
				event_id = $(this).linkbutton('options')['event_id'];
			}
			var _dialog = common.openDialog({
				id:'event_item_modify_win',
				title:title,
				width:'510px',
				height:'300px',
				href:"./page/project/project_event_item_modify.jsp",
				buttons:[
				         	{
				         		text:'保存',
				         		iconCls:'fa fa-check',
				         		handler:function(){
				         			var content=_dialog.find('#content').textbox('getValue');
			         				var result=_dialog.find('#result').textbox('getValue');
			         				var handle_result=_dialog.find('#handle_result').textbox('getValue');
				         			if(event_id && event_id!=''){
				         				if(!row){
				         					row={};
				         				}
				         				row['content']=content;
				         				row['result']=result;
				         				row['handle_result']=handle_result;
				         				row['project_checking_id']=event_id;
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
			var win = $('#event_modify_win');
			var project_id = win.find('#xmmc_select').combobox('getValue');
			if(!project_id){
				$.messager.alert('提示','请先选择项目');
				return;
			}
			selectEmp.select({
				qx:'PROJECT_EVENT_ADD',
				project_id:project_id,
				single:true,
				callback:function(emps){
					if(emps && emps.length>0){
						var emp=emps[0];
						win.find('#record_id').val(emp['id']);
						win.find('#record_name').textbox('setValue',emp['name']);
					}
				}
			});
		},
		add:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			_modifyWin(null,project_id);
		},
		detail:function(project_id,index){
			var row = $('#milestone_list'+project_id).datagrid('getRows')[index];
			_modifyWin(row,project_id);
		},
		delBatch:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			var checkeds = $('#milestone_list'+project_id).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除选择的重要事件吗?',function(b){
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
			var row = $('#milestone_list'+project_id).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除[项目'+row['project_name']+common.fmt_date(row['occur_time'])+'的重要事件]吗?',function(b){
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
			btn += '<a href="#" onclick="projectEvent.detail(\''+project_id+'\','+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			if(hasPriv("PROJECT_EVENT_DELETE")){
				btn += '<a href="#" onclick="projectEvent.del(\''+project_id+'\','+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			return btn;
		},
		itemListOpts:function(value,row,index){
			var row_id='';
			if(row['id']){
				row_id=row['id'];
			}
			var btn = '';
			btn += '<a href="#" onclick="projectEvent.modifyItem(\''+row_id+'\','+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			return btn;
		},
		query:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			var project_name = $('#zysj_search_xmmc'+project_id).textbox('getValue');
			var start = $('#zysj_search_kssj'+project_id).datebox('getValue');
			var end = $('#zysj_search_jssj'+project_id).datebox('getValue');
			var record_name = $('#zysj_search_jlr'+project_id).textbox('getValue');

			var arra = [
			    		{"property":"project_name","value":project_name},
			    		{"property":"start","value":start},
			    		{"property":"end","value":end},
			    		{"property":"record_name","value":record_name}
			    	];
			var param = {filter:arra};
			$('#milestone_list'+project_id).datagrid('reload',param);
		},
		reset:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			$("#milestone_queryform"+project_id).form("reset");
			var param = {};
		    param["filter"]=[];
		    $('#milestone_list'+project_id).datagrid('reload',param);
		},
		click: function(){
			var project_id = $(this).datagrid('options')['project_id'];
			if($('#milestone_list' + project_id).datagrid("getChecked").length>0){
				var candelete = true;
				var checked = $('#milestone_list' + project_id).datagrid("getChecked");
				for(i=0;i<checked.length;i++){
					if(checked[i]["is_editable"]=="0")
					{
						candelete = false;
						break;
					}
				}
				if(candelete){
					$("#milestone_del_btn" + project_id).linkbutton("enable");
				}else{
					$("#milestone_del_btn" + project_id).linkbutton("disable");
				}
				
			}else{
				$("#milestone_del_btn" + project_id).linkbutton("disable");
			}
		}
	};
}());