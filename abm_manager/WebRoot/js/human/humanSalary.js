// 人力服务-工资
var humanSalary = (function(){
	var _divId = '#salary_div';
	var _listId = _divId + ' #salary_list';
	
	var _handlerDel = function(ids){
		common.ajax('./HumanSalary-del.action',{ids:ids},function(resp){
			if(resp['success']){
				$(_listId).datagrid('reload');
			}
			$.messager.alert('提示',resp['msg']);
		});
	};
	
	var _modifyWin = function(isAdd,row){
		var w = $("<div></div>").css("padding","10px").appendTo("body");
		w.dialog({
			title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
			id:'salary_add_win',
			width:"540px",
			height:"350px",
			collapsible:false,
			minimizable:false,
			maximizable:false,
			modal:true,
			href:"./page/human/human_salary_add.jsp",
			buttons:[{
				//save
				text:'<i class="fa fa-check"> </i> 保存',
				handler:function(){
					$('#human_salary_add_form').form('submit',{
						url:"./HumanSalary-save.action",
						onSubmit:function(){
							if(!isAdd){
								return true;
							}
						},
						success:function(resp){
							resp = JSON.parse(resp);
							$.messager.alert("提示",resp["msg"],"info",function(){});
							$("#" + _listId).datagrid("reload");
							w.window("destroy");
						},
						error:function(){
							$.messager.alert("提示","网络错误","info");
						}
					});
				}
			},{
				text:'<i class="fa fa-remove"> </i> 取消',
				handler:function(){	
					w.window("destroy");
				}
			}],
			onColse:function(){
				$(this).dialog("destory");
			},
			onLoad:function(){
				if(!isAdd){
					// 修改页初始化数据
					if(row){
						$(this).find('#salary_add_id').val(row['id']);
						$(this).find('#salary_add_name').textbox('setValue',row['name']);
						$(this).find('#salary_add_year').combobox('setValue',row['year']);
						$(this).find('#salary_add_month').combobox('setValue',row['month']);
						$(this).find('#salary_add_enterprise_hidden').hide();
						$(this).find('#salary_add_model_hidden').hide();
						$(this).find('#salary_add_templateFile_hidden').hide();
					}
					
				} else {
					var date = new Date();
					var year = date.getFullYear(); // 年
					var month = date.getMonth() + 1; // 月
					$(this).find('#salary_add_year').combobox('setValue',year);
					$(this).find('#salary_add_month').combobox('setValue',month);
				}
				
			}
		});
	};
	
	var _editDefIndex = undefined;
	var _endEditingDef = function(){
		if (_editDefIndex == undefined){
			return true;
		};
		if ($('#salary_detail_list').datagrid('validateRow', _editDefIndex)){
			$('#salary_detail_list').datagrid('endEdit', _editDefIndex);
			_editDefIndex = undefined;
			return true;
		} else {
			return false;
		}
	}
	
	return {
		salary_doDetail:function(index){
			var rows = $("#" + _listId).datagrid("getRows")[index];
			var _title = '工资详情' + '[<font color=red>' + rows['year'] + '年' + rows['month'] + '月</font>]';
			if($('#tab_'+rows['id']).length==0){
				var _tabId = 'tab_'+rows['id'];
				var _tab = $('#operator').tabs('add',{
					id:_tabId,
					title:_title,
					closable:true,
					href:'./page/human/human_salary_detail.jsp?id=' + rows["id"] + '&status=' + rows["status"],
					onLoad:function(){
						var _this = $(this);
						$.ajax({
							url:'./HumanSalary-listByDetail.action',
							type:'post',
							dataType:'json',
							data:{'ids':rows["id"]},
							async:true,
							success:function(resp){
								var rows_data = resp['rows'];
								var rows = [];
								if(rows_data && rows_data.length > 0){
									for(var i in rows_data){
										var row = {};
										var arr = rows_data[i]['detail'];
										row['id'] = rows_data[i]['id'];
										for(var j in arr){
											row[j] = arr[j][j];
										}
										rows.push(row);
									}
								}
								_this.find('#salary_detail_list').datagrid('request',{total:rows["total"],rows:rows});
							},
							error:function(){
							}
						});
					}
				});
			} else {
				$('#operator').tabs('select',_title);
			}
		},
		salary_doAdd:function(){
			_modifyWin(true);
		},
		salary_doDel:function(){
			var checkeds = $(_listId).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除选择的数据吗?',function(b){
					if(b){
						var ids = [];
						for(var i = 0 ; i < checkeds.length ; i++){
							if(checkeds[i]['status'] == '1'){
								$.messager.alert('提示','删除失败，已封存工资单无法删除');
								return;
							}
							ids.push(checkeds[i]['id']);
						};
						_handlerDel(ids.join(','));
					}
				});
			}else{
				$.messager.alert('提示','请选择项目');
			}
		},
		salary_detail_doSave:function(){
			var rows = $('#salary_detail_list').datagrid("getRows");
			var data = {};
			for(var i in rows){
				var row = rows[i];
				data['payrollDetailModels['+ i +'].id'] = row['id'];
				var details = [];
				for(var j = 0 ; j < Object.keys(row).length - 1; j ++){
					var detail = {};
					detail[j] = row[j];
					details.push(JSON.stringify(detail));
				}
				data['payrollDetailModels['+ i +'].detail'] = '[' + details.join(',') + ']';
			}
			
			common.ajax('./HumanSalary-saveByDetail.action',data,function(resp){
				if(resp['success']){
					$($('#salary_detail_list')).datagrid('reload');
				}
				$.messager.alert('提示',resp['msg']);
	  			$('#salary_detail_list').datagrid('acceptChanges');
			});
		},
		salary_detail_onclick:function(index){
			if (_editDefIndex != index){
				if (_endEditingDef()){
					$('#salary_detail_list').datagrid('selectRow', index).datagrid('beginEdit', index);
					var editors = $('#salary_detail_list').datagrid('getEditors', index);
					if($('#salary_detail_status').val() == '1'){
						for(var i in editors){
							$(editors[i].target).combobox('disable');
						}
					}
					_editDefIndex = index;
				} else {
					$('#salary_detail_list').datagrid('selectRow', _editDefIndex);
				}
			}
		},
		salary_detail_doDel:function(){
			var checkeds = $('#salary_detail_list').datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除选择的数据吗?',function(b){
					if(b){
						var ids = [];
						for(var i = 0 ; i < checkeds.length ; i++){
							ids.push(checkeds[i]['id']);
						};
						common.ajax('./HumanSalary-delByDetail.action',{ids:ids},function(resp){
							if(resp['success']){
								$($('#salary_detail_list')).datagrid('reload');
							}
							$.messager.alert('提示',resp['msg']);
						});
					}
				});
			}else{
				$.messager.alert('提示','请选择工资条');
			}
		},
		salary_doEdit:function(index){
			var row = $(_listId).datagrid("getRows")[index];
			_modifyWin(false,row);
		},
		salary_doDelOne:function(index){
			var row = $(_listId).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除吗?',function(b){
				if(b){
					if(row['status'] == '1'){
						$.messager.alert('提示','删除失败，已封存工资单无法删除');
						return;
					}
					_handlerDel(row['id']);
				};
			});
		},
		salary_doExport:function(){
			$.messager.alert('提示','开发中');
		},
		salary_doSearch:function(){
			var arra = [
	    		{"property":"enterprise_id","value":$('#salary_queryform #enterprise_id').combobox("getValue")},
	    		{"property":"name","value":$('#salary_queryform #name').textbox("getValue")},
	    		{"property":"year","value":$('#salary_queryform #year').combobox("getValue")},
	    		{"property":"month","value":$('#salary_queryform #month').combobox("getValue")},
	    		{"property":"status","value":$('#salary_queryform #status').combobox("getValue")}
	    	];
	    	var param = {};
	    	param["filter"]=arra;
	    	$(_listId).datagrid('reload',param);
		},
		salary_doReset:function(){
			$("#salary_queryform").form("reset");
			var param = {};
		    param["filter"]=[];
		    $(_listId).datagrid('reload',param);
		},
		salary_doUpdStatus:function(ids){
			$.messager.confirm('提示','确认归档此月工资单数据吗?',function(b){
				if(b){
					common.ajax('./HumanSalary-updStatus.action',{ids:ids},function(resp){
						if(resp['success']){
							$(_listId).datagrid('reload');
						}
						$.messager.alert('提示',resp['msg']);
					});
				}
			});
		},
		salary_doExport:function(index){
			var row = $(_listId).datagrid('getRows')[index];
			console.log(row);
			window.open('./page/human/human_salary_export.jsp?id=' + row['id'] + "&year=" + row['year'] + "&month=" + row['month']);
		},
		salary_doHandle:function(value,row,index){
			var btn = '';
			btn += '<a href="#" onclick="humanSalary.salary_doDetail('+index+')" style="padding:10px 8px;" ><i class="fa fa-file-text-o"></i> 查看详情</a>';
			if(hasPriv("DISMISS_MANAGER_EDIT") && row['status'] == '0'){
				btn += '<a href="#" onclick="humanSalary.salary_doEdit('+index+')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 编辑</a>';
			}
			if(hasPriv("DISMISS_MANAGER_DELETE") && row['status'] == '0'){
				btn += '<a href="#" onclick="humanSalary.salary_doDelOne('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			if(row['status'] == '0'){
				btn += '<a href="#" onclick="humanSalary.salary_doUpdStatus(\''+row['id']+'\')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 封存</a>';
			}
			btn += '<a href="#" onclick="humanSalary.salary_doExport(\''+index+'\')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 导出</a>';
			return btn;
		},
		salary_enterprise:function(row){
			$('#salary_add_model').combobox('clear');
			$('#salary_add_model').combobox('reload','./Payroll-listByModel.action?ids='+row['id']);
		},
		togglePlsc:function(){
			if($(_listId).datagrid("getChecked").length>0){
				$("#salary_del").linkbutton("enable");
			}else{
				$("#salary_del").linkbutton("disable");
			}
		}
	};
}());