
var projectPatrol = (function(){
	
//	var _div = '#project_communication_div';
//	var _listId = _div + " #project_communication_list";
	
	var xjlb_list_json={
			'0':'#inspections_list',
			'1':'#firemen_list'
	};
	
	var qx_json={
			
	};
	
	var _modifyWin = function(row,project_id,xjlb){
		if(!project_id){
			project_id='';
		}
		var patrol_id = '';
		var title = '';
		var disabled_flag = false;
		if(row){
			patrol_id = row['id'];
			title = '<i class="fa fa-pencil"> </i> 查看';
			if(xjlb=='0'){
				disabled_flag = !hasPriv("PROJECT_PATROL_EDIT");
			}else if(xjlb=='1'){
				disabled_flag = !hasPriv("PROJECT_PATROL_FIRE_EDIT");
			}
		}else{
			title = '<i class="fa fa-plus"> </i> 添加';
		}
		var _dialog = common.openDialog({
			id:'patrol_modify_win',
			title:title,
			width:'555px',
			height:'375px',
			href:"./page/project/project_patrol_modify.jsp?patrol_id="+patrol_id,
//			buttons:[
//			         	{
//			         		text:'保存',
//			         		iconCls:'fa fa-check',
//			         		disabled:disabled_flag,
//			         		handler:function(){
//			         			if(_dialog.find('#patrol_modify_form').form('validate')){
//			         				var xm_id = _dialog.find('#xmmc_select').combobox('getValue');
//				         			var checker_id = _dialog.find('#checker_id').val();
//				         			var checker_name = _dialog.find('#checker_name').textbox('getValue');
//				         			var type = _dialog.find('#type').textbox('getValue');
//				         			var check_time = _dialog.find('#check_time').datebox('getValue');
//				         			var bak = _dialog.find('#bak').textbox('getValue');
//				         			var items = _dialog.find('#project_checking_item_list').datagrid('getRows');
//				         			var param={};
//				         			if(row){
//				         				param['id']=patrol_id;
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
//				         					$('#patrol_list'+project_id).datagrid('load');
//				         				}
//				         				$.messager.alert('提示',resp['msg']);
//				         			});
//			         			}
//			         		}
//			         	}
//			         ],
			onLoad:function(){
				common.ajax('./Project-list.action',{},function(resp){
					_dialog.find('#xmmc_select').combobox('loadData', resp['rows']);
					if(project_id){
						_dialog.find('#xmmc_select').combobox('setValue', project_id);
						_dialog.find('#xmmc_select').combobox('readonly');
					}
				});
				if(row){
					var newRow={};
					for ( var key in row) {
						newRow['patrol.'+key]=row[key];
					}
					_dialog.find('#patrol_modify_form').form('load',newRow);
				}
			}
		});
	}
	
	var _handlerDel = function(ids,project_id,xjlb){
		common.ajax('./ProjectPatrol-delete.action',{ids:ids,type:xjlb},function(resp){
			if(resp['success']){
				var list_id = xjlb_list_json[xjlb]+project_id;
				$(list_id).datagrid('reload');
			}
			$.messager.alert('提示',resp['msg']);
		});
	}
	
	return {
		delItem:function(){
			var win = $('#patrol_modify_win');
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
			var patrol_id =null;
			var win = $('#patrol_modify_win');
			var table = win.find('#project_checking_item_list');
			
			var title='';
			var row=null;
			if(undefined!=index && null!=index){
				title = '<i class="fa fa-pencil"> </i> 编辑';
				row = table.datagrid('getRows')[index];
				patrol_id = row['project_checking_id'];
			}else{
				title = '<i class="fa fa-plus"> </i> 添加';
				patrol_id = $(this).linkbutton('options')['patrol_id'];
			}
			var _dialog = common.openDialog({
				id:'patrol_item_modify_win',
				title:title,
				width:'510px',
				height:'300px',
				href:"./page/project/project_patrol_item_modify.jsp",
				buttons:[
				         	{
				         		text:'保存',
				         		iconCls:'fa fa-check',
				         		handler:function(){
				         			var content=_dialog.find('#content').textbox('getValue');
			         				var result=_dialog.find('#result').textbox('getValue');
			         				var handle_result=_dialog.find('#handle_result').textbox('getValue');
				         			if(patrol_id && patrol_id!=''){
				         				if(!row){
				         					row={};
				         				}
				         				row['content']=content;
				         				row['result']=result;
				         				row['handle_result']=handle_result;
				         				row['project_checking_id']=patrol_id;
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
			var win = $('#patrol_modify_win');
			selectEmp.select({
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
			var xjlb = $(this).linkbutton('options')['xjlb'];
			_modifyWin(null,project_id,xjlb);
		},
		detail:function(project_id,index,xjlb){
			var list_id = xjlb_list_json[xjlb]+project_id;
			var row = $(list_id).datagrid('getRows')[index];
			_modifyWin(row,project_id,xjlb);
		},
		delBatch:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			var xjlb = $(this).linkbutton('options')['xjlb'];
			var list_id = xjlb_list_json[xjlb]+project_id;
			var checkeds = $(list_id).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除选择的巡检吗?',function(b){
					if(b){
						var ids = [];
						for(var i = 0 ; i < checkeds.length ; i++){
							ids.push(checkeds[i]['id']);
						}
						_handlerDel(ids.join(','),project_id,xjlb);
					}
				});
			}else{
				$.messager.alert('提示','请选择项目');
			}
		},
		del:function(project_id,index,xjlb){
			var list_id = xjlb_list_json[xjlb]+project_id;
			var row = $(list_id).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除[项目'+row['project_name']+common.fmt_date(row['staet_time'])+'的巡检]吗?',function(b){
				if(b){
					_handlerDel(row['id'],project_id,xjlb);
				}
			});
		},
		listOpts:function(value,row,index){
			var project_id = $(this).attr('project_id');
			var xjlb = $(this).attr('xjlb');
			if(!project_id){
				project_id='';
			}
			var btn = '';
			btn += '<a href="#" onclick="projectPatrol.detail(\''+project_id+'\','+index+',\''+xjlb+'\')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 查看</a>';
			if(xjlb=='0' && hasPriv("PROJECT_PATROL_DELETE")){
				btn += '<a href="#" onclick="projectPatrol.del(\''+project_id+'\','+index+',\''+xjlb+'\')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}else if(xjlb=='1' && hasPriv("PROJECT_PATROL_FIRE_DELETE")){
				btn += '<a href="#" onclick="projectPatrol.del(\''+project_id+'\','+index+',\''+xjlb+'\')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			return btn;
		},
		itemListOpts:function(value,row,index){
			var row_id='';
			if(row['id']){
				row_id=row['id'];
			}
			var btn = '';
			btn += '<a href="#" onclick="projectPatrol.modifyItem(\''+row_id+'\','+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			return btn;
		},
		query:function(){
			var xjlb = $(this).linkbutton('options')['xjlb'];
			var project_id = $(this).linkbutton('options')['project_id'];
			var project_name = $('#patrol_search_xmmc'+xjlb+project_id).textbox('getValue');
			var staet_time = $('#patrol_search_kssj'+xjlb+project_id).datebox('getValue');
			var end_time = $('#patrol_search_jssj'+xjlb+project_id).datebox('getValue');
			var area = $('#patrol_search_xjqy'+xjlb+project_id).textbox('getValue');
			var record_name = $('#patrol_search_jlr'+xjlb+project_id).textbox('getValue');
			var arra = [
			    		{"property":"project_name","value":project_name},
			    		{"property":"staet_time","value":staet_time},
			    		{"property":"end_time","value":end_time},
			    		{"property":"area","value":area},
			    		{"property":"record_name","value":record_name}
			    	];
			var param = {filter:arra};
			if(xjlb == '1'){
				$('#firemen_list'+project_id).datagrid('reload',param);
			}else{
				$('#inspections_list'+project_id).datagrid('reload',param);
			}
		},
		reset:function(){
			var xjlb = $(this).linkbutton('options')['xjlb'];
			var project_id = $(this).linkbutton('options')['project_id'];
			$("#patrol_queryform"+xjlb+project_id).form("reset");
			var param = {};
		    param["filter"]=[];
		    if(xjlb == '1'){
				$('#firemen_list'+project_id).datagrid('reload',param);
			}else{
				$('#inspections_list'+project_id).datagrid('reload',param);
			}
		},
		click: function(){
			var project_id = $(this).datagrid('options')['project_id'];
			if($('#inspections_list' + project_id).datagrid("getChecked").length>0){
				var candelete = true;
				var checked = $('#inspections_list' + project_id).datagrid("getChecked");
				for(i=0;i<checked.length;i++){
					if(checked[i]["is_editable"]=="0")
					{
						candelete = false;
						break;
					}
				}
				if(candelete){
					$("#inspections_del_btn" + project_id).linkbutton("enable");
				}else{
					$("#inspections_del_btn" + project_id).linkbutton("disable");
				}
				
			}else{
				$("#inspections_del_btn" + project_id).linkbutton("disable");
			}
		},
		click_1: function(){
			var project_id = $(this).datagrid('options')['project_id'];
			if($('#firemen_list' + project_id).datagrid("getChecked").length>0){
				var candelete = true;
				var checked = $('#firemen_list' + project_id).datagrid("getChecked");
				for(i=0;i<checked.length;i++){
					if(checked[i]["is_editable"]=="0")
					{
						candelete = false;
						break;
					}
				}
				if(candelete){
					$("#firemen_del_btn" + project_id).linkbutton("enable");
				}else{
					$("#firemen_del_btn" + project_id).linkbutton("disable");
				}
				
			}else{
				$("#firemen_del_btn" + project_id).linkbutton("disable");
			}
		}
	};
}());