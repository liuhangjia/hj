
var projectEmp = (function(){
	
//	var _div = '#project_manage_div';
//	var _listId = _div + " #project_manage_list";
	
	var _modifyWin = function(project_id,row){
		if(!project_id){
			project_id='';
		}
		var title = '';
		if(row){
			title = '<i class="fa fa-pencil"> </i> 编辑';
		}else{
			title = '<i class="fa fa-plus"> </i> 添加';
		}
		var _dialog = common.openDialog({
			id:'project_rytj_win',
			title:title,
			width:'1000px',
			height:'500px',
			href:"./page/project/project_personnel_add.jsp?project_id="+project_id,
			buttons:[
			         	{
			         		text:'保存',
			         		iconCls:'fa fa-check',
			         		handler:function(){
			         			var pId=_dialog.find('#xmmc_select').combobox('getValue');
			         			var rows=_dialog.find('#project_xmry_add_list').datagrid('getRows');
			         			if(!pId){
			         				$.messager.alert('提示','请选择项目');
			         				return;
			         			}
			         			if(!rows || rows.length<=0){
			         				$.messager.alert('提示','请添加人员');
			         				return;
			         			}
			         			var param={};
			         			param['project_id']=pId;
			         			param['emps']=rows;
			         			param=$.MingwenJSON.encode(param);
			         			common.ajax('./ProjectEmp-add.action',{param:param},function(resp){
			         				if(resp['success']){
			         					$('#personnel_list'+project_id).datagrid('load');
			         					_dialog.window('destroy');
			         				}
				         			$.messager.alert('提示',resp['msg']);
			         			});
			         		}
			         	}
			         ],
			onLoad:function(){
//				if(row){
//					var project = {};
//					for(var p in row){
//						project['project.'+p] = row[p];
//					}
//					_dialog.find('form').form('load',project);
//				}
				common.ajax('./Project-list.action',{},function(resp){
					_dialog.find('#xmmc_select').combobox('loadData', resp['rows']);
				});
				if(project_id){
					_dialog.find('#xmmc_select').combobox('setValue', project_id);
					_dialog.find('#xmmc_select').combobox('readonly');
				}
			}
		});
	}
	
	var _handlerDel = function(ids){
		common.ajax('./ProjectEmp-delete.action',{ids:ids},function(resp){
			if(resp['success']){
				$('table[id^=personnel_list]').datagrid('load');
			}
			$.messager.alert('提示',resp['msg']);
		});
	}
	
	return {
		searchSelect_qy:function(row){
			//$('#xmry_search_bm').combotree({url:'./Depart-listDept.action'});
			$('#xmry_search_bm').combotree('clear');
			$('#xmry_search_bm').combotree('reload','./Depart-listDept.action?enterpriseId='+row['id']);
		},
		noIdEmpsListOpts:function(value,row,index){
			var btn = '';
			btn += '<a href="#" onclick="projectEmp.editNoIdEmps('+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			return btn;
		},
		editNoIdEmps:function(index,id,db_row){
			var project_id = ''; 
			var row=null;
			var win=null;
			var table=null;
			var qy_id = null;
			var isAdd = true;
			if(!id){
				win = $('#project_rytj_win');
				table = win.find('#project_xmry_add_list');
				row = table.datagrid('getRows')[index];
				
				var xm_datas = $('#xmmc_select').combobox('getData');
				var xm_id = $('#xmmc_select').combobox('getValue');
				for (var i = 0; i < xm_datas.length; i++) {
					if(xm_id == xm_datas[i]['id']){
						qy_id = xm_datas[i]['enterprise_id'];
						break;
					}
				}
				isAdd = false;
				project_id = $('#xmmc_select').combobox('getValue');
			}else{
				row = db_row;
				qy_id = row['projectModel']['enterprise_id'];
				project_id = row['project_id'];
			}
			
			var _dialog = common.openDialog({
				id:'project_xmry_edit',
				title:'编辑',
				width:'540px',
				height:'430px',
				href:"./page/project/project_personnel_edit.jsp?isAdd="+isAdd+"&project_id="+project_id,
				buttons:[
				         	{
				         		text:'保存',
				         		iconCls:'fa fa-check',
				         		disabled: id && !hasPriv("PROJECT_EMPLOYEE_EDIT"),
				         		handler:function(){
				         			var sex=_dialog.find('#xmry_sex').combobox('getValue');
//			         				var depart=_dialog.find('#xmry_depart').textbox('getValue');
				         			var depart_id=_dialog.find('#xmry_depart').combotree('getValue');
				         			var range_id=_dialog.find('#xmry_range').combobox('getValue');
			         				var zw=_dialog.find('#xmry_zw').textbox('getValue');
			         				var phone=_dialog.find('#xmry_phone').textbox('getValue');
			         				var fznr=_dialog.find('#xmry_fznr').textbox('getValue');
			         				var role_id = _dialog.find('#project_role').combobox('getValue');
			         				row['sex']=sex;
			         				row['phone']=phone;
			         				row['depart_id']=depart_id;
			         				row['range_id']=range_id;
			         				row['position']=zw;
			         				row['duty']=fznr;
			         				row['role_id']=role_id;
			         				if(depart_id){
				         				var depart_tree = _dialog.find('#xmry_depart').combotree('tree');
				         				var tree_row = depart_tree.tree('getSelected');
				         				row['depart_name']=tree_row['name'];
				         			}
				         			if(id){
//				         				var project_id=db_row['project_id'];
				         				var param={
				         						param:$.MingwenJSON.encode(row)
				         				};
				         				common.ajax('./ProjectEmp-update.action',param,function(resp){
				         					if(resp['success']){
				         						$('table[id^=personnel_list]').datagrid('load');
					         					_dialog.window('destroy');
				         					}
				         					$.messager.alert('提示',resp['msg']);
				         				});
				         			}else{
				         				//var name=_dialog.find('#xmry_name').textbox('getValue');
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
					_dialog.find('#xmry_range').combobox('setValue',common.toBlank(row['range_id']));
					_dialog.find('#xmry_name').textbox('setValue',common.toBlank(row['name']));
					_dialog.find('#xmry_name').textbox('disable');
					_dialog.find('#xmry_sex').combobox('setValue',common.toBlank(row['sex']));
//     				_dialog.find('#xmry_depart').textbox('setValue',common.toBlank(row['depart_name']) );
					_dialog.find('#xmry_depart').combotree('setValue',common.toBlank(row['depart_name']) );
     				_dialog.find('#xmry_zw').textbox('setValue',common.toBlank(row['position']) );
     				_dialog.find('#xmry_phone').textbox('setValue',common.toBlank(row['phone']) );
     				_dialog.find('#xmry_fznr').textbox('setValue',common.toBlank(row['duty']) );
     				if(qy_id){
     					common.ajax('./Role-listByEntId.action',
     							{
     								enterpriseId:qy_id,
     								page:1,
     								rows:100000
     							},
     							function(resp){
     								var role_rows = resp['rows'];
     								if(role_rows){
     									_dialog.find('#project_role').combobox('loadData',role_rows);
     								}
     								_dialog.find('#project_role').combobox('setValue',row['role_id']);
     							}
     					);
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
		selectEmps:function(){
			var win=$('#project_rytj_win');
			var project_id = win.find('#xmmc_select').combobox('getValue');
			if(!project_id){
				$.messager.alert('提示','请您先选择项目');
				return;
			}
			var table = win.find('#project_xmry_add_list');
			var rows = table.datagrid('getRows');
			var select_ids=[];
			if(rows && rows.length>0){
				for (var i = 0; i < rows.length; i++) {
					select_ids.push(rows[i]['emp_id']);
				}
//				select_ids = select_ids.join(',');
			}
			
			common.ajax('./ProjectEmp-getProjectEmps.action',{project_id:project_id},function(data){
				if(data && data.length>0){
					for (var i = 0; i < data.length; i++) {
						select_ids.push(data[i]['emp_id']);
					}
				}
				select_ids = select_ids.join(',');
				selectEmp.select({
					qx:'PROJECT_EMPLOYEE_ADD',
					project_id:project_id,
					select_ids:select_ids,
					callback:function(emps){
						if(emps && emps.length>0){
							for (var i = 0; i < emps.length; i++) {
								var emp=emps[i];
								var row={};
								row['emp_id']=emp['id'];
								row['name']=emp['name'];
								row['sex']=emp['sex'];
								row['phone']=emp['phone'];
								row['ct']=new Date().getTime()+'index'+i;//ct为创建时间
								table.datagrid('appendRow',row);
							}
						}
					}
				});
			});
		},
		add:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			_modifyWin(project_id);
		},
		detail:function(project_id,index){
			var row = $('#personnel_list'+project_id).datagrid('getRows')[index];
			projectEmp.editNoIdEmps(index,row['id'],row);
		},
		delBatch:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			var checkeds = $('#personnel_list'+project_id).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除选择的人员吗?',function(b){
					if(b){
						var ids = [];
						for(var i = 0 ; i < checkeds.length ; i++){
							ids.push(checkeds[i]['id']);
						}
						_handlerDel(ids.join(','));
					}
				});
			}else{
				$.messager.alert('提示','请选择人员');
			}
		},
		del:function(project_id,index){
			var row = $('#personnel_list'+project_id).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除项目'+row['project_name']+'的'+row['name']+'吗?',function(b){
				if(b){
					_handlerDel(row['id']);
				}
			});
		},
		attendance:function(project_id,index,flag){
			var row = $('#personnel_list'+project_id).datagrid('getRows')[index];
			if(flag){
				common.ajax('./ProjectEmp-startAttendance.action',{ids:row['id']},function(resp){
					if(resp['success']){
						$('table[id^=personnel_list]').datagrid('load');
					}
					$.messager.alert('提示',resp['msg']);
				});
			}else{
				common.ajax('./ProjectEmp-endAttendance.action',{ids:row['id']},function(resp){
					if(resp['success']){
						$('table[id^=personnel_list]').datagrid('load');
					}
					$.messager.alert('提示',resp['msg']);
				});
			}
		},
		listOpts:function(value,row,index){
			var project_id = $(this).attr('project_id');
			if(!project_id){
				project_id='';
			}
			var btn = '';
			btn += '<a href="#" onclick="projectEmp.detail(\''+project_id+'\','+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			if(hasPriv("PROJECT_EMPLOYEE_DELETE")){
				btn += '<a href="#" onclick="projectEmp.del(\''+project_id+'\','+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			if(row['attendance_num']==''){
				btn += '<a href="#" onclick="projectEmp.attendance(\''+project_id+'\','+index+',true)" style="padding:10px 8px;"><i class="fa fa-pencil"></i>设置考勤</a>';
			}else{
				btn += '<a href="#" onclick="projectEmp.attendance(\''+project_id+'\','+index+',false)" style="padding:10px 8px;"><i class="fa fa-pencil"></i>去除考勤</a>';
			}
			
			return btn;
		},
		query:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			var project_name = $('#xmry_search_xmmc'+project_id).textbox('getValue');
			var name = $('#xmry_search_xingming'+project_id).textbox('getValue');
//			var depart_name = $('#xmry_search_bm'+project_id).textbox('getValue');
			var qy = $('#xmry_search_qy'+project_id).combobox('getValue');
			var depart_name = $('#xmry_search_bm'+project_id).combotree('getValue');
			var position = $('#xmry_search_zw'+project_id).textbox('getValue');
			var phone = $('#xmry_search_lxdh'+project_id).textbox('getValue');

			var arra = [
			    		{"property":"project_name","value":project_name},
			    		{"property":"name","value":name},
			    		{"property":"qy","value":qy},
			    		{"property":"depart_name","value":depart_name},
			    		{"property":"phone","value":phone},
			    		{"property":"position","value":position}
			    	];
			var param = {filter:arra};
			$('#personnel_list'+project_id).datagrid('reload',param);
		},
		reset:function(){
			var project_id = $(this).linkbutton('options')['project_id'];
			$("#personnel_queryform"+project_id).form("reset");
			var param = {};
		    param["filter"]=[];
		    $('#personnel_list'+project_id).datagrid('reload',param);
		    $('#xmry_search_bm').combotree('reload','./Depart-listDept.action?enterpriseId=');
		},
		click: function(){
			var project_id = $(this).datagrid('options')['project_id'];
			if($('#personnel_list' + project_id).datagrid("getChecked").length>0){
				var candelete = true;
				var checked = $('#personnel_list' + project_id).datagrid("getChecked");
				for(i=0;i<checked.length;i++){
					if(checked[i]["is_editable"]=="0")
					{
						candelete = false;
						break;
					}
				}
				if(candelete){
					$("#project_personnel_del_btn" + project_id).linkbutton("enable");
				}else{
					$("#project_personnel_del_btn" + project_id).linkbutton("disable");
				}
				
			}else{
				$("#project_personnel_del_btn" + project_id).linkbutton("disable");
			}
		}
	};
}());