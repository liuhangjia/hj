
var equip = (function(){
	
	var zblb_json={};
	common.ajax('./SysBaseCode-listForCombo.action',{type:'ZBLB'},function(data){
		if(data && data.length>0){
			for (var i = 0; i < data.length; i++) {
				zblb_json[data[i]['code']] = data[i];
			}
		}
	});
	
	var _modifyWin = function(row,lb){
		var code_json = zblb_json[lb];
		var title = '';
		if(row){
			title = '<i class="fa fa-pencil"> </i> '+code_json['name']+'编辑';
		}else{
			title = '<i class="fa fa-plus"> </i> '+code_json['name']+'添加';
		}
		var _dialog = common.openDialog({
			id:'equip_modify_win',
			title:title,
			width:'550px',
			height:'375px',
			href:"./page/equipment/equipment_manager_add.jsp?lb="+lb,
			buttons:[
			         	{
			         		text:'保存',
			         		iconCls:'fa fa-check',
			         		handler:function(){
			         			var form = _dialog.find('#equip_modify_form');
			         			form.form('submit',{
			         				url:'./Equip-modify.action',
			         				onSubmit:function(){
			         					return $(this).form('validate');
			         				},
			         				success:function(resp){
			         					resp = $.MingwenJSON.decode(resp);
			         					if(resp['success']){
			         						$('#equip_managers_list'+lb).datagrid('load');
			         						_dialog.window('destroy');
			         					}
			         					$.messager.alert('提示',resp['msg']);
			         				}
			         			});
			         		}
			         	}
			         ],
			onLoad:function(){
				if(row){
					var newRow={};
					for ( var key in row) {
						newRow['equip.'+key]=row[key];
					}
					_dialog.find('#equip_modify_form').form('load',newRow);
				}
			}
		});
	}
	
	var _handlerDel = function(ids,lb){
		common.ajax('./Equip-delete.action',{ids:ids},function(resp){
			if(resp['success']){
				$('#equip_managers_list'+lb).datagrid('reload');
			}
			$.messager.alert('提示',resp['msg']);
		});
	}
	
	return {
		selectTab:function(title,index){
			var tab = $(this).tabs('getTab',index);
			var lb = tab.attr('lb');
			tab.panel({
				href:'page/equipment/equipment_manager_tab.jsp?lb='+lb,
				onLoad:function(){
					
				}
			});
			
//			var tab_id = tab.attr('id');
//			if(tab_id=='xmry_tab'){
//				tab.panel({
//					href:'page/project/project_personnel.jsp?project_id='+project_id,
//					onLoad:function(){
//						
//					}
//				});
//			}
		},
		fmt_type:function(value){
			return zblb_json[value]['name'];
		},
		noIdEmpsListOpts:function(value,row,index){
			var btn = '';
			btn += '<a href="#" onclick="projectEmp.editNoIdEmps('+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			return btn;
		},
		editNoIdEmps:function(index,id){
			var row=null;
			var win=null;
			var table=null;
			if(id){
				
			}else{
				win = $('#project_rytj_win');
				table = win.find('#project_xmry_add_list');
				row = table.datagrid('getRows')[index];
			}
			
			var _dialog = common.openDialog({
				id:'project_xmry_edit',
				title:'编辑',
				width:'540px',
				height:'430px',
				href:"./page/project/project_personnel_edit.jsp",
				buttons:[
				         	{
				         		text:'保存',
				         		iconCls:'fa fa-check',
				         		handler:function(){
				         			if(id){
				         				
				         			}else{
				         				//var name=_dialog.find('#xmry_name').textbox('getValue');
				         				var sex=_dialog.find('#xmry_sex').combobox('getValue');
				         				var depart=_dialog.find('#xmry_depart').textbox('getValue');
				         				var zw=_dialog.find('#xmry_zw').textbox('getValue');
				         				var phone=_dialog.find('#xmry_phone').textbox('getValue');
				         				var fznr=_dialog.find('#xmry_fznr').textbox('getValue');
				         				row['sex']=sex;
				         				row['phone']=phone;
				         				row['depart_name']=depart;
				         				row['position']=zw;
				         				row['duty']=fznr;
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
					if(id){
						
					}else{
						_dialog.find('#xmmc_select_div').hide();
						_dialog.find('#xmry_name').textbox('setValue',common.toBlank(row['name']));
						_dialog.find('#xmry_name').textbox('disable');
						_dialog.find('#xmry_sex').combobox('setValue',common.toBlank(row['sex']));
         				_dialog.find('#xmry_depart').textbox('setValue',common.toBlank(row['depart_name']) );
         				_dialog.find('#xmry_zw').textbox('setValue',common.toBlank(row['position']) );
         				_dialog.find('#xmry_phone').textbox('setValue',common.toBlank(row['phone']) );
         				_dialog.find('#xmry_fznr').textbox('setValue',common.toBlank(row['duty']) );
					}
				}
			});
		},
		deleteNoIdEmps:function(){
			var win=$('#project_rytj_win');
			var table = win.find('#project_xmry_add_list');
			var checkeds = table.datagrid('getChecked');
			if(checkeds && checkeds.length>0){
				
			}
		},
		selectEquips:function(){
			var win=$('#project_equip_add_win');
			var table = win.find('#project_zb_add_list');
			selectEquip.select({
				callback:function(equips){
					if(equips && equips.length>0){
						for (var i = 0; i < equips.length; i++) {
							var equip=equips[i];
							equip['equip_id']=equip['id'];
							equip['ct']=new Date().getTime()+'index'+i;
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
		selectJYR:function(){
			var win = $('#equip_outWarehouse_win');
			selectEmp.select({
				qx:'EQUIP_MANAGER_EDIT',
				single:true,
				callback:function(emps){
					if(emps && emps.length>0){
						var emp=emps[0];
						win.find('#user_id').val(emp['id']);
						win.find('#user_name').textbox('setValue',emp['name']);
					}
				}
			});
		},
		selectJBR:function(){
			var win = $('#equip_outWarehouse_win');
			selectEmp.select({
				qx:'EQUIP_MANAGER_EDIT',
				single:true,
				callback:function(emps){
					if(emps && emps.length>0){
						var emp=emps[0];
						win.find('#opt_id').val(emp['id']);
						win.find('#opt_name').textbox('setValue',emp['name']);
					}
				}
			});
		},
		add:function(){
			var lb = $(this).linkbutton('options')['lb'];
			_modifyWin(null,lb);
		},
		detail:function(index,lb){
			var row = $('#equip_managers_list'+lb).datagrid('getRows')[index];
			_modifyWin(row,lb);
		},
		delBatch:function(){
			var lb = $(this).linkbutton('options')['lb'];
			var code_json = zblb_json[lb];
			var checkeds = $('#equip_managers_list'+lb).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除选择的'+code_json['name']+'吗?',function(b){
					if(b){
						var ids = [];
						for(var i = 0 ; i < checkeds.length ; i++){
							ids.push(checkeds[i]['id']);
						}
						_handlerDel(ids.join(','),lb);
					}
				});
			}else{
				$.messager.alert('提示','请选择'+code_json['name']);
			}
		},
		del:function(index,lb){
			var code_json = zblb_json[lb];
			var row = $('#equip_managers_list'+lb).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除'+code_json['name']+'['+row['name']+']吗?',function(b){
				if(b){
					_handlerDel(row['id'],lb);
				}
			});
		},
		listOpts:function(value,row,index){
			var lb = $(this).attr('lb');
			var btn = '';
			btn += '<a href="#" onclick="equip.detail('+index+',\''+lb+'\')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 编辑</a>';
			btn += '<a href="#" onclick="equip.del('+index+',\''+lb+'\')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			//btn += '<a href="#" onclick="equip.inWarehouse('+index+')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 入库</a>';
			btn += '<a href="#" onclick="equip.outWarehouse('+index+',\''+lb+'\')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 领用</a>';
			return btn;
		},
		listOptsForUsed:function(value,row,index){
			var project_id = row['project_id'];
			if(!project_id){
				project_id='';
			}
			var btn = '';
			if(!row['return_time']){
				btn += '<a href="#" onclick="equip.guihuan('+index+',\''+project_id+'\')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 归还</a>';
			}
			return btn;
		},
		guihuan:function(index,project_id){
			var row = null;
			if(project_id && project_id!=''){   //项目
				row = $('#circulate_list').datagrid('getRows')[index];
			}else{                              //个人
				row = $('#collar_list').datagrid('getRows')[index];
			}
			//param:$.MingwenJSON.encode(row)
			var param={
					'equipUsed.id':row['id'],
					'equipUsed.equip_id':row['equip_id'],
					'equipUsed.quantity':row['quantity'],
					'equipUsed.project_id':project_id,
			};
			$.messager.confirm('提示','确认归还吗?',function(b){
				if(b){
					common.ajax('./Equip-guihuan.action',
							param,
							function(resp){
								if(resp['success']){
									if(project_id && project_id!=''){  
										 $('#circulate_list').datagrid('load');
									}else{                              
										 $('#collar_list').datagrid('load');
									}
								}
								$.messager.alert('提示',resp['msg']);
							});
				}
			});
		},
		inWarehouse:function(index){
			var row = $('#equip_managers_list').datagrid('getRows')[index];
			
		},
		outWarehouse:function(index,lb){
			var row = $('#equip_managers_list'+lb).datagrid('getRows')[index];
			var _dialog = common.openDialog({
				id:'equip_outWarehouse_win',
				title:'['+row['name']+']'+'借出记录',
				width:'580px',
				height:'420px',
				href:"./page/equipment/equip_out_warehouse.jsp",
				buttons:[
				         	{
				         		text:'保存',
				         		iconCls:'fa fa-check',
				         		handler:function(){
				         			var quantity = _dialog.find('#quantity').numberbox('getValue');
				         			if(parseInt(quantity) > parseInt(row['quantity'])){
				         				$.messager.alert('提示','库存不够');
				         				return;
				         			}
				         			
				         			var form = _dialog.find('#equip_out_warehouse_form');
				         			form.form('submit',{
				         				url:'./Equip-outWarehouse.action',
				         				onSubmit:function(){
				         					return $(this).form('validate');
				         				},
				         				success:function(resp){
				         					resp = $.MingwenJSON.decode(resp);
				         					if(resp['success']){
				         						$('#equip_managers_list'+lb).datagrid('load');
				         						_dialog.window('destroy');
				         					}
				         					$.messager.alert('提示',resp['msg']);
				         				}
				         			});
				         		}
				         	}
				         ],
				onLoad:function(){
					_dialog.find('#equip_id').val(row['id']);
					common.ajax('./Project-listForCombobox.action',{qx:'EQUIP_MANAGER_EDIT'},function(resp){
						_dialog.find('#xmmc_select').combobox('loadData', resp['rows']);
					});
				}
			});
		},
		equip_select_project:function(row){
			var win=$('#equip_outWarehouse_win');
			win.find('#project_name').val(row['name']);
		},
		used_doSearch:function(){
			var xmIdIsEmpty = $(this).linkbutton('options')['xmIdIsEmpty'];
			if(xmIdIsEmpty == '1'){
				var arra = [
				            {property:'user_name',value:$('#collar_search_user_name').textbox('getValue')}
				            ];
				var param = {filter:arra};
				$('#collar_list').datagrid('reload',param);
			}else{
				var arra = [
				            {property:'user_name',value:$('#circulate_search_user_name').numberbox('getValue')}
				            ];
				var param = {filter:arra};
				$('#circulate_list').datagrid('reload',param);
			}
		},
		used_doReset:function(){
			var xmIdIsEmpty = $(this).linkbutton('options')['xmIdIsEmpty'];
			if(xmIdIsEmpty == '1'){
				$("#collar_queryform").form("reset");
				var param = {filter:[]};
			    $('#collar_list').datagrid('reload',param);
			}else{
				$("#circulate_queryform").form("reset");
				var param = {filter:[]};
			    $('#circulate_list').datagrid('reload',param);
			}
		},
		query:function(){
			var lb = $(this).linkbutton('options')['lb'];
			var arra = [
			            {property:'qymc',value:$('#equip_managers_search_qymc_'+lb).textbox('getValue')},
			            {property:'mc',value:$('#equip_managers_search_mc_'+lb).textbox('getValue')},
			            {property:'cs',value:$('#equip_managers_search_cs_'+lb).textbox('getValue')},
			            {property:'xh',value:$('#equip_managers_search_xh_'+lb).textbox('getValue')},
			            {property:'num_min',value:$('#equip_managers_search_num_min_'+lb).numberbox('getValue')},
			            {property:'num_max',value:$('#equip_managers_search_num_max_'+lb).numberbox('getValue')}
			            ];
			var param = {filter:arra};
			$('#equip_managers_list'+lb).datagrid('reload',param);
		},
		reset:function(){
			var lb = $(this).linkbutton('options')['lb'];
			$("#managers_queryform"+lb).form("reset");
			var param = {filter:[]};
		    $('#equip_managers_list'+lb).datagrid('reload',param);
		},
		togglePlsc:function(){
			var lb = $(this).datagrid('options')['lb'];
			if($('#equip_managers_list'+lb).datagrid("getChecked").length>0){
				$("#managers_content"+lb+" #equip_del").linkbutton("enable");
			}else{
				$("#managers_content"+lb+" #equip_del").linkbutton("disable");
			}
		}
	};
}());