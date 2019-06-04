
var projectEquip = (function(){
	
	var _modifyWin = function(row,project_id){
		if(!project_id){
			project_id='';
		}
		var pe_id = '';
		var title = '';
		var disabled_flag = false;
		if(row){
			title = '<i class="fa fa-pencil"> </i> 编辑';
			pe_id = row['id'];
			disabled_flag = !hasPriv("PROJECT_EQUIP_EDIT");
		}else{
			title = '<i class="fa fa-plus"> </i> 添加';
		}
		var _dialog = common.openDialog({
			id:'project_equip_add_win',
			title:title,
			width:'1000px',
			height:'500px',
			href:"./page/project/project_equipment_modify.jsp",
			buttons:[
			         	{
			         		text:'保存',
			         		iconCls:'fa fa-check',
			         		handler:function(){
			         			var p_id=_dialog.find('#xmmc_select').combobox('getValue');
			         			var rows=_dialog.find('#project_zb_add_list').datagrid('getRows');
			         			if(!p_id){
			         				$.messager.alert('提示','请选择项目');
			         				return;
			         			}
			         			if(!rows || rows.length<=0){
			         				$.messager.alert('提示','请添加装备');
			         				return;
			         			}
			         			var param={};
			         			param['project_id']=p_id;
			         			param['equips']=rows;
			         			param=$.MingwenJSON.encode(param);
			         			common.ajax('./ProjectEquip-add.action',{param:param},function(resp){
			         				if(resp['success']){
			         					$('#equipments_list').datagrid('load');
			         					_dialog.window('destroy');
			         				}
				         			$.messager.alert('提示',resp['msg']);
			         			});
			         		}
			         	}
			         ],
			onLoad:function(){
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
		common.ajax('./ProjectEquip-delete.action',{ids:ids},function(resp){
			if(resp['success']){
				$('#equipments_list'+project_id).datagrid('reload');
			}
			$.messager.alert('提示',resp['msg']);
		});
	}
	
	return {
		noIdEquipListOpts:function(value,row,index){
			var btn = '';
			btn += '<a href="#" onclick="projectEquip.editNoIdEquip('+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			return btn;
		},
		editNoIdEquip:function(index,id,db_row){
			var project_id = ''; 
			var row=null;
			var win=null;
			var table=null;
			var isAdd = true;
			if(!id){
				win = $('#project_equip_add_win');
				table = win.find('#project_zb_add_list');
				row = table.datagrid('getRows')[index];
				
				var xm_datas = $('#xmmc_select').combobox('getData');
				var xm_id = $('#xmmc_select').combobox('getValue');
				for (var i = 0; i < xm_datas.length; i++) {
					if(xm_id == xm_datas[i]['id']){
						break;
					}
				}
				isAdd = false;
				project_id = $('#xmmc_select').combobox('getValue');
			}else{
				row = db_row;
				project_id = row['project_id'];
			}
			
			var _dialog = common.openDialog({
				id:'project_equip_edit',
				title:'编辑',
				width:'540px',
				height:'430px',
				href:"./page/project/project_equip_edit.jsp?isAdd="+isAdd+"&project_id="+project_id,
				buttons:[
				         	{
				         		text:'保存',
				         		iconCls:'fa fa-check',
				         		disabled: id && !hasPriv("PROJECT_EQUIP_EDIT"),
				         		handler:function(){
				         			var name=_dialog.find('#xmzb_name').textbox('getValue');
				         			var lb=_dialog.find('#xmzb_lb').combobox('getValue');
			         				var zl=_dialog.find('#xmzb_zl').combobox('getValue');
			         				var cs=_dialog.find('#xmzb_cs').textbox('getValue');
			         				var xh=_dialog.find('#xmzb_xh').textbox('getValue');
			         				var dw=_dialog.find('#xmzb_dw').textbox('getValue');
			         				var sl=_dialog.find('#xmzb_sl').numberbox('getValue');
			         				
			         				row['name']=name;
			         				row['type']=lb;
			         				row['category']=zl;
			         				row['factory']=cs;
			         				row['model']=xh;
			         				row['unit']=dw;
			         				row['quantity']=sl;
			         				
				         			if(id){
//				         				var new_project_id = _dialog.find('#xmmc_select').combobox('getValue');
//				         				row['project_id'] = new_project_id;
//				         				row['project_id'] = project_id;
				         				var param={
				         						param:$.MingwenJSON.encode(row)
				         				};
				         				common.ajax('./ProjectEquip-update.action',param,function(resp){
				         					if(resp['success']){
				         						$('table[id^=equipments_list]').datagrid('load');
					         					_dialog.window('destroy');
				         					}
				         					$.messager.alert('提示',resp['msg']);
				         				});
				         			}else{
				         				table.datagrid('updateRow',{
				         					index:index,
				         					row:row
				         				});
				         				_dialog.window('destroy');
				         			}
				         		}
				         	}
				         ],
				onLoad:function(){
					if(!id){
						_dialog.find('#xmmc_select_div').hide();
					}else{
						common.ajax('./Project-list.action',{},function(resp){
							_dialog.find('#xmmc_select').combobox('loadData', resp['rows']);
							_dialog.find('#xmmc_select').combobox('setValue', db_row['project_id']);
						});
						_dialog.find('#xmmc_select').combobox('disable');
					}
					_dialog.find('#xmzb_name').textbox('setValue',common.toBlank(row['name']));
         			_dialog.find('#xmzb_lb').combobox('setValue',common.toBlank(row['type']));
     				_dialog.find('#xmzb_zl').combobox('setValue',common.toBlank(row['category']));
     				_dialog.find('#xmzb_cs').textbox('setValue',common.toBlank(row['factory']));
     				_dialog.find('#xmzb_xh').textbox('setValue',common.toBlank(row['model']));
     				_dialog.find('#xmzb_dw').textbox('setValue',common.toBlank(row['unit']));
     				_dialog.find('#xmzb_sl').numberbox('setValue',common.toBlank(row['quantity']));
				}
			});
		},
		deleteNoIdEmps:function(){
			var win=$('#project_rytj_win');
			var table = win.find('#project_xmzb_add_list');
			var checkeds = table.datagrid('getChecked');
			if(checkeds && checkeds.length>0){
				
			}
		},
		selectEquips:function(){
			var win=$('#project_equip_add_win');
			var table = win.find('#project_zb_add_list');
			var project_id = win.find('#xmmc_select').combobox('getValue');
			selectEquip.select({
				project_id:project_id,
				callback:function(equips){
					if(equips && equips.length>0){
						for (var i = 0; i < equips.length; i++) {
							var equip=equips[i];
							equip['equip_id']=equip['id'];
							equip['ct']=new Date().getTime()+'index'+i;
							equip['quantity']=0;
							delete equip.id;
							delete equip.enterprise_id;
							delete equip.bak;
							delete equip.enterpriseModel;
							table.datagrid('appendRow',equip);
						}
					}
				}
			});
		},
		add:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			_modifyWin(null,project_id);
		},
		detail:function(project_id,index){
			var row = $('#equipments_list'+project_id).datagrid('getRows')[index];
			projectEquip.editNoIdEquip(index,row['id'],row);
		},
		delBatch:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			var checkeds = $('#equipments_list'+project_id).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除选择的项目装备吗?',function(b){
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
			var row = $('#equipments_list'+project_id).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除项目装备['+row['name']+']吗?',function(b){
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
			btn += '<a href="#" onclick="projectEquip.detail(\''+project_id+'\','+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			if(hasPriv("PROJECT_EQUIP_DELETE")){
				btn += '<a href="#" onclick="projectEquip.del(\''+project_id+'\','+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			return btn;
		},
		query:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			var project_name = $('#xmzb_search_xmmc'+project_id).textbox('getValue');
			var category = $('#xmzb_search_zbzl'+project_id).textbox('getValue');
			var name = $('#xmzb_search_zbmc'+project_id).textbox('getValue');
			var factory = $('#xmzb_search_zbcs'+project_id).textbox('getValue');
			var model = $('#xmzb_search_zbxh'+project_id).textbox('getValue');
			var quantity_min = $('#xmzb_search_zbsl_min'+project_id).numberbox('getValue');
			var quantity_max = $('#xmzb_search_zbsl_max'+project_id).numberbox('getValue');
//			var type = $('#project_manage_query_type').textbox('getValue');			
//			var status = $('#project_manage_query_status').textbox('getValue');
			var arra = [
			    		{"property":"project_name","value":project_name},
			    		{"property":"category","value":category},
			    		{"property":"name","value":name},
			    		{"property":"factory","value":factory},
			    		{"property":"model","value":model},
			    		{"property":"quantity_min","value":quantity_min},
			    		{"property":"quantity_max","value":quantity_max}
			    	];
			var param = {filter:arra};
			$('#equipments_list'+project_id).datagrid('reload',param);
		},
		reset:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			$("#equipments_queryform"+project_id).form("reset");
			var param = {};
		    param["filter"]=[];
		    $('#equipments_list'+project_id).datagrid('reload',param);
		},
		click: function(){
			var project_id = $(this).datagrid('options')['project_id'];
			if($('#equipments_list' + project_id).datagrid("getChecked").length>0){
				var candelete = true;
				var checked = $('#equipments_list' + project_id).datagrid("getChecked");
				for(i=0;i<checked.length;i++){
					if(checked[i]["is_editable"]=="0")
					{
						candelete = false;
						break;
					}
				}
				if(candelete){
					$("#project_equip_del_btn" + project_id).linkbutton("enable");
				}else{
					$("#project_equip_del_btn" + project_id).linkbutton("disable");
				}
				
			}else{
				$("#project_equip_del_btn" + project_id).linkbutton("disable");
			}
		}
	};
}());