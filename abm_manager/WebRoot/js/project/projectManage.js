// 项目管理
var projectManage = (function(){
	
	var _div = '#project_manage_div';
	var _listId = _div + " #project_manage_list";
	
	var _modifyWin = function(row){
		$.isEmptyObject(row);
		var title = '';
		if(row){
			title = '<i class="fa fa-pencil"> </i> 编辑';
		}else{
			title = '<i class="fa fa-plus"> </i> 添加';
		}
		var _dialog = common.openDialog({
			title:title,
			width:'540px',
			height:'450px',
			href:"./page/project/project_manager_add.jsp",
			buttons:[
			         	{
			         		text:'保存',
			         		iconCls:'fa fa-check',
			         		disabled:!hasPriv("PROJECT_MANAGER_EDIT"),
			         		handler:function(){
			         			_dialog.find('form').form('submit',{
			         				url:'./Project-modify.action',
			         				onSubmit:function(){
			         					return $(this).form('validate');
			         				},
			         				success:function(resp){
			         					resp = JSON.parse(resp);
			         					if(resp['success']){
			         						_dialog.window('destroy');
			         						$(_listId).datagrid('reload');
			         					}
			         					$.messager.alert('提示',resp['msg']);
			         				}
			         			});
			         		}
			         	}
			         ],
			onLoad:function(){
				if(row){
					var project = {};
					for(var p in row){
						project['project.'+p] = row[p];
					}
					_dialog.find('form').form('load',project);
					_dialog.find('#project_enterprise_id').combobox('readonly');
				}
			}
		});
	}
	
	var _handlerDel = function(ids){
		common.ajax('./Project-delete.action',{ids:ids},function(resp){
			if(resp['success']){
				$(_listId).datagrid('reload');
			}
			$.messager.alert('提示',resp['msg']);
		});
	}
	
	var manager_doOverview=function(index){
		var row = $('#project_manage_list').datagrid('getRows')[index];
		$("#manager_content").hide();
		var editor = $("<div id='manager_editor'></div>").insertAfter("#manager_content");
		var opt = {
			border:false,
			href:"page/project/project_manager_overview.jsp?project_id="+row['id'],
			method:"post",
			fit:true,
			collapsible: false,
			minimizable: false,
			maximizable: false,
			onLoad:function(){
				var win = $(this);
				var project = {};
				for(var p in row){
					project['project.'+p] = row[p];
				}
				win.find('#project_info_form').form('load',project);
				
				win.find('#project_info_update').linkbutton({
					onClick:function(){
						win.find('#project_info_form').form('submit',{
		     				url:'./Project-modify.action',
		     				onSubmit:function(){
		     					return $(this).form('validate');
		     				},
		     				success:function(resp){
		     					resp = JSON.parse(resp);
		     					if(resp['success']){
		     						$(_listId).datagrid('reload');
		     					}
		     					$.messager.alert('提示',resp['msg']);
		     				}
		     			});
					}
				});
			}
		};
		editor.panel(opt);
	}
	
	var imp = function(){
		
		var _dialog = common.openDialog({
			title:'导入项目',
			width:'540px',
			height:'210px',
			href:"./page/project/project_manager_import.jsp",
			buttons:[
			         	{
			         		text:'上传',
			         		iconCls:'fa fa-check',
			         		handler:function(){
			         			_dialog.find('#project_manager_import_form').form('submit',{
			         				url:'./Project-upload.action',
			         				success:function(resp){
			         					resp = $.MingwenJSON.decode(resp);
			         					if(resp['success']){
			         						$('#project_manage_list').datagrid('reload');
			         						_dialog.window('destroy');
			         					}
			         					$.messager.alert('提示',resp['msg']);
			         				}
			         			});
			         		}
			         	}
			         ],
			onLoad:function(){
				
			}
		});
	}
	
	return {
		imp:imp,
		manager_doOverview:manager_doOverview,
		selectTab:function(title,index){
			var project_id = $(this).tabs('options')['project_id'];
			var tab = $(this).tabs('getTab',index);
			var tab_id = tab.attr('id');
			if(tab_id=='xmry_tab'){
				tab.panel({
					href:'page/project/project_personnel.jsp?project_id='+project_id,
					onLoad:function(){
						
					}
				});
			}else if(tab_id=='zysj_tab'){
				tab.panel({
					href:'page/project/project_milestone.jsp?project_id='+project_id,
					onLoad:function(){
						
					}
				});
			}else if(tab_id=='xjgl_tab'){
				tab.panel({
					href:'page/project/project_inspection.jsp?project_id='+project_id,
					onLoad:function(){
						
					}
				});
			}else if(tab_id=='xfxj_tab'){
				tab.panel({
					href:'page/project/project_firemen.jsp?project_id='+project_id,
					onLoad:function(){
						
					}
				});
			}else if(tab_id=='xmzb_tab'){
				tab.panel({
					href:'page/project/project_equipment.jsp?project_id='+project_id,
					onLoad:function(){
						
					}
				});
			}else if(tab_id=='xmpx_tab'){
				tab.panel({
					href:'page/project/project_train.jsp?project_id='+project_id,
					onLoad:function(){
						
					}
				});
			}else if(tab_id=='gzjc_tab'){
				tab.panel({
					href:'page/project/project_work.jsp?project_id='+project_id,
					onLoad:function(){
						
					}
				});
			}else if(tab_id=='tshf_tab'){
				tab.panel({
					href:'page/project/project_complaint.jsp?project_id='+project_id,
					onLoad:function(){
						
					}
				});
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
				$.messager.confirm('提示','确认删除选择的项目吗?',function(b){
					if(b){
						var ids = [];
						for(var i = 0 ; i < checkeds.length ; i++){
							ids.push(checkeds[i]['id']);
						}
						_handlerDel(ids.join(','));
					}
				});
			}else{
				$.messager.alert('提示','请选择项目');
			}
		},
		del:function(index){
			var row = $(_listId).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除项目['+row['name']+']吗?',function(b){
				if(b){
					_handlerDel(row['id']);
				}
			});
		},
		listOpts:function(value,row,index){
			var btn = '';
			btn += '<a href="#" onclick="projectManage.manager_doOverview('+index+')" style="padding:10px 8px;"><i class="fa fa-file-text-o"></i> 项目总览</a>';
			btn += '<a href="#" onclick="projectManage.detail('+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			if(hasPriv("PROJECT_MANAGER_DELETE")){
				btn += '<a href="#" onclick="projectManage.del('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			return btn;
		},
		query:function(){
			var name = $('#project_manage_query_name').textbox('getValue');
			var type = $('#project_manage_query_type').textbox('getValue');
			var start = $('#project_manage_query_start').datebox('getValue');
			var end = $('#project_manage_query_end').datebox('getValue');
			var status = $('#project_manage_query_status').textbox('getValue');
			var arra = [
			    		{"property":"name","value":name},
			    		{"property":"type","value":type},
			    		{"property":"start","value":start},
			    		{"property":"end","value":end},
			    		{"property":"status","value":status}
			    	];
			var param = {filter:arra};
			$('#project_manage_list').datagrid('reload',param);
		},
		reset:function(){
			$("#project_manage_query_form").form("reset");
			var param = {};
		    param["filter"]=[];
		    $('#project_manage_list').datagrid('reload',param);
		},
		click:function(index){
			if($('#project_manage_list').datagrid("getChecked").length>0){
				var candelete = true;
				var checked = $('#project_manage_list').datagrid("getChecked");
				for(i=0;i<checked.length;i++){
					if(checked[i]["is_editable"]=="0")
					{
						candelete = false;
						break;
					}
				}
				if(candelete){
					$("#project_manage_del_btn").linkbutton("enable");
				}else{
					$("#project_manage_del_btn").linkbutton("disable");
				}
				
			}else{
				$("#project_manage_del_btn").linkbutton("disable");
			}
		}
	};
}());