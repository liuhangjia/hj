
var projectCommunication = (function(){
	
	var _div = '#project_communication_div';
	var _listId = _div + " #project_communication_list";
	
	var _modifyWin = function(project_id,row){
		if(!project_id){
			project_id='';
		}
		var disabled_flag=false;
		var title = '';
		if(row){
			title = '<i class="fa fa-pencil"> </i> 编辑';
			disabled_flag = !hasPriv("PROJECT_COMMUNICATION_EDIT");
		}else{
			title = '<i class="fa fa-plus"> </i> 添加';
		}
		
		var _dialog = common.openDialog({
			id:'communication_modify_win',
			title:title,
			width:'540px',
			height:'430px',
			href:"./page/project/project_communication_modify.jsp?project_id"+project_id,
			buttons:[
			         	{
			         		text:'保存',
			         		iconCls:'fa fa-check',
			         		disabled:disabled_flag,
			         		handler:function(){
			         			_dialog.find('#communication_modify_form').form('submit',{
			         				url:'./ProjectCommunication-modify.action',
			         				onSubmit:function(){
			         					return $(this).form('validate');
			         				},
			         				success:function(resp){
			         					resp = $.MingwenJSON.decode(resp);
			         					if(resp['success']){
			         						_dialog.window('destroy');
			         						$('#project_communication_list'+project_id).datagrid('load');
			         					}
			         					$.messager.alert('提示',resp['msg']);
			         				}
			         			});
			         		}
			         	}
			         ],
			onLoad:function(){
				if(row){
					var pcm = {};
					for(var p in row){
						pcm['pcm.'+p] = row[p];
					}
					_dialog.find('#communication_modify_form').form('load',pcm);
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
		common.ajax('./ProjectCommunication-delete.action',{ids:ids},function(resp){
			if(resp['success']){
				$('#project_communication_list'+project_id).datagrid('reload');
			}
			$.messager.alert('提示',resp['msg']);
		});
	}
	
	return {
		selectEmps:function(){
			var win=$('#communication_modify_win');
			selectEmp.select({
				qx:"PROJECT_COMMUNICATION_ADD",
				callback:function(emps){
					var rows=[];
					if(emps && emps.length>0){
						var texts='';
						var values='';
						for (var i = 0; i < emps.length; i++) {
							var emp=emps[i];
							texts+=','+emp['name'];
							values+=','+emp['id'];
						}
						win.find('#hfrxm_hidden').val(values.substring(1));
						win.find('#hfrxm').textbox('setValue',texts.substring(1));
						win.find('#hfrxm').textbox('setText',texts.substring(1));
					}
				}
			});
		},
		add:function(){
			var project_id = $(this).linkbutton('options')['project_id']; 
			_modifyWin(project_id);
		},
		detail:function(project_id,index){
			var row = $('#project_communication_list'+project_id).datagrid('getRows')[index];
			_modifyWin(project_id,row);
		},
		delBatch:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			if(!project_id){
				project_id='';
			}
			var checkeds = $('#project_communication_list'+project_id).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除选择的投诉回访吗?',function(b){
					if(b){
						var ids = [];
						for(var i = 0 ; i < checkeds.length ; i++){
							ids.push(checkeds[i]['id']);
						}
						_handlerDel(ids.join(','),project_id);
					}
				});
			}else{
				$.messager.alert('提示','请选择投诉回访');
			}
		},
		del:function(project_id,index){
			if(!project_id){
				project_id='';
			}
			var row = $('#project_communication_list'+project_id).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除[项目'+row['project_name']+common.fmt_date10(row['comm_time'])+']的工作检查吗?',function(b){
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
			btn += '<a href="#" onclick="projectCommunication.detail(\''+project_id+'\','+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			if(hasPriv("PROJECT_COMMUNICATION_DELETE")){
				btn += '<a href="#" onclick="projectCommunication.del(\''+project_id+'\','+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			return btn;
		},
		query:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			var project_name = $('#communication_xmmc'+project_id).textbox('getValue');
			var start = $('#communication_kssj'+project_id).datebox('getValue');
			var end = $('#communication_jssj'+project_id).datebox('getValue');
			var hfrxm = $('#communication_hfrxm'+project_id).textbox('getValue');
//			var type = $('#project_manage_query_type').textbox('getValue');			
//			var status = $('#project_manage_query_status').textbox('getValue');
			var arra = [
			    		{"property":"project_name","value":project_name},
			    		{"property":"start","value":start},
			    		{"property":"end","value":end},
			    		{"property":"hfrxm","value":hfrxm}
			    	];
			var param = {filter:arra};
			$('#project_communication_list'+project_id).datagrid('reload',param);
		},
		reset:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			$("#communication_queryform"+project_id).form("reset");
			var param = {};
		    param["filter"]=[];
		    $('#project_communication_list'+project_id).datagrid('reload',param);
		},
		click: function(){
			var project_id = $(this).datagrid('options')['project_id'];
			if($('#project_communication_list' + project_id).datagrid("getChecked").length>0){
				var candelete = true;
				var checked = $('#project_communication_list' + project_id).datagrid("getChecked");
				for(i=0;i<checked.length;i++){
					if(checked[i]["is_editable"]=="0")
					{
						candelete = false;
						break;
					}
				}
				if(candelete){
					$("#project_communication_del_btn" + project_id).linkbutton("enable");
				}else{
					$("#project_communication_del_btn" + project_id).linkbutton("disable");
				}
				
			}else{
				$("#project_communication_del_btn" + project_id).linkbutton("disable");
			}
		}
	};
}());