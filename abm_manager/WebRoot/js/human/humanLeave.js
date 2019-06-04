// 人力服务-请假管理
var humanLeave = (function(){
	var _divId = '#leave_div';
	var _listId = _divId + ' #leave_list';
	
	
	var _handlerDel = function(ids){
		common.ajax('./Vacation-del.action',{ids:ids},function(resp){
			if(resp['success']){
				$(_listId).datagrid('reload');
			}
			$.messager.alert('提示',resp['msg']);
		});
	};
	
	var _doEdit = function(index){
		return '<a href="#" onclick="humanLeave.leave_doEdit('+index+')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 编辑</a>';
	};
	
	var _doDel = function(index){
		return '<a href="#" onclick="humanLeave.leave_doDelOne('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
	}
	
	var _modifyWin = function(isAdd,row){
		var w = $("<div></div>").css("padding","10px").appendTo("body");
		w.dialog({
			title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
			id:'leave_add_win',
			width:"540px",
			height:"470px",
			collapsible:false,
			minimizable:false,
			maximizable:false,
			closable:false,
			modal:true,
			href:"./page/human/human_leave_add.jsp",
			buttons:[{
				//save
				text:'<i class="fa fa-check"> </i> 保存',
				handler:function(){
					var data = {};
					//ID
					data['vacationModel.id']=$("#leave_addform #id").val();
					//企业ID
					data['vacationModel.enterprise_id']=$('#leave_addform #qymc').textbox('getValue');
					//项目ID
					data['vacationModel.project_id']=$('#leave_addform #leave_empproject_id').combobox('getValue');
					//员工姓名
					data['vacationModel.enterprise_emp_name']=$("#leave_addform #leave_emp_name").val();
					//员工ID
					data['vacationModel.enterprise_emp_id']=$("#leave_addform #leave_emp_id").combobox('getValue');
					//部门ID
					data['vacationModel.depart_id']=$('#leave_addform #leave_depart_id').combotree('getValue');
					//部门
					data['vacationModel.depart_name']=$('#leave_addform #leave_depart_name').val();
					//职务
					data['vacationModel.position']=$("#leave_addform #zw").textbox('getValue');
					//请假类别
					data['vacationModel.type']=$("#leave_addform #lb").combobox('getValue');
					//请假时间
					data['vacationModel.start_time']=$("#leave_addform #qjsj").textbox('getValue');
					//销假时间
					data['vacationModel.end_time']=$("#leave_addform #xjsj").textbox('getValue');
					//批准人
					data['vacationModel.approval_name']=$("#leave_addform #pzr").textbox('getValue');
					//批准时间
					data['vacationModel.approval_time']=$("#leave_addform #pzsj").textbox('getValue');
					//请假事由
					data['vacationModel.reason']=$("#leave_addform #qjsy").textbox('getValue');
					//审批状态
					data['vacationModel.status']=$("#leave_addform #zt").combobox('getValue');
					
					$.ajax({
						url:'./Vacation-modify.action',
						type:'post',
						data:data,
						dataType:'json',
						async:false,
						success:function(data){
							$.messager.alert("提示",data['msg']);
							if(data['success']){
								w.window("destroy");
								$(_listId).datagrid('reload');
							};
						},
						error:function(){
							$.messager.alert("提示","网络错误");
						}
					});
				}
			},{
				//cancle
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
//					$('#leave_depart_id').combotree('reload','./Depart-listDept.action?enterpriseId='+row['enterprise_id']);
//					$('#leave_empproject_id').combobox('reload','./Employee-listProjectByCondition.action?type=VACATION_MANAGER_ADD&enterpriseId='+row['enterprise_id']);
//					$('#leave_emp_id').combobox('reload','./Employee-listEnterpriseEmp.action?tId='+row['enterprise_id']);
					$.ajax({
						url:'./Depart-listDept.action',
						data:{enterpriseId:row['enterprise_id']},
						dataType:'json',
						type:'post',
						async:false,
						success:function(resp){
							$('#leave_depart_id').combotree('loadData',resp);
						},
						error:function(){
							$.messager.alert("提示","网络错误");
						}
					});
					
					$.ajax({
						url:'./Employee-listProjectByCondition',
						data:{
							type:'VACATION_MANAGER_ADD',
							enterpriseId:row['enterprise_id']
						},
						dataType:'json',
						type:'post',
						async:false,
						success:function(resp){
							$('#leave_empproject_id').combobox('loadData',resp);
						},
						error:function(){
							$.messager.alert("提示","网络错误");
						}
					});
					
					$.ajax({
						url:'./Employee-listEnterpriseEmp.action',
						data:{
							tId:row['enterprise_id']
						},
						dataType:'json',
						type:'post',
						async:false,
						success:function(resp){
							$('#leave_emp_id').combobox('loadData',resp);
						},
						error:function(){
							$.messager.alert("提示","网络错误");
						}
					});
				
					
					//ID
					$("#leave_addform #id").val(row['id']);
					//企业ID
					$("#leave_addform #qymc").combobox('setValue',row['enterprise_id']);
					//项目ID
					$("#leave_addform #leave_empproject_id").combobox('setValue',row['project_id']);
					//员工ID
					$("#leave_addform #leave_emp_id").combobox('setValue',row['enterprise_emp_id']);
					//员工姓名
					$("#leave_addform #leave_emp_name").val(row['enterprise_emp_name']);
					//部门ID
					$('#leave_addform #leave_depart_id').combotree('setValue',row['depart_id']);
					//部门
					$('#leave_addform #leave_depart_name').val(row['depart_name']);
					//职务
					$("#leave_addform #zw").textbox('setValue',row['position']);
					//请假类别
					$("#leave_addform #lb").combobox('setValue',row['type']);
					//请假时间
					var _time1 = row['start_time'];
					if(_time1){
						_time1 = _time1.split(" ")[0]
					}
					$("#leave_addform #qjsj").textbox('setValue',_time1);
					//销假时间
					var _time2 = row['end_time'];
					if(_time2){
						_time2 = _time2.split(" ")[0]
					}
					$("#leave_addform #xjsj").textbox('setValue',_time2);
					//批准人
					$("#leave_addform #pzr").textbox('setValue',row['approval_name']);
					//批准时间
					$("#leave_addform #pzsj").textbox('setValue',row['approval_time']);
					//请假事由
					$("#leave_addform #qjsy").textbox('setValue',row['reason']);
					//审批状态
					$("#leave_addform #zt").combobox('setValue',row['status']);
				}
			}
		});
	};
	
	
	var _handlBusiness = function(key,row,listId){
		if($.isEmptyObject(row)){
			$.messager.alert('提示','请选择处理信息');
			return;
		}
		var width = $(document).width()*0.6+'px';
		var height = $(document).height()*0.8+'px';
		var opts = {
						businessId:row['id'],
						title:'请假单审批',
						width:width,
						height:height,
						status:row['status'],
						onLoad:function(){
							var _this = $(this);
							//ID
							_this.find("#leave_addform #id").val(row['id']);
							//企业
							_this.find("#leave_addform #qymc").combobox('setValue',row['enterprise_id']);
							//项目ID
							_this.find("#leave_addform #leave_empproject_id").combobox('setValue',row['project_id']);
							//员工姓名
							_this.find("#leave_addform #leave_emp_name").val(row['enterprise_emp_name']);
							//员工ID
							_this.find("#leave_addform #leave_emp_id").combobox('setValue',row['enterprise_emp_id']);
							//部门ID
							_this.find('#leave_addform #leave_depart_id').combotree('setValue',row['depart_name']);
							//部门
							_this.find('#leave_addform #leave_depart_name').val(row['depart_id']);
							//职务
							_this.find("#leave_addform #zw").textbox('setValue',row['position']);
							//请假类别
							_this.find("#leave_addform #lb").textbox('setValue',row['type']);
							//请假时间
							_this.find("#leave_addform #qjsj").textbox('setValue',row['start_time']);
							//销假时间
							_this.find("#leave_addform #xjsj").textbox('setValue',row['end_time']);
							//批准人
							_this.find("#leave_addform #pzr").textbox('setValue',row['approval_name']);
							//批准时间
							_this.find("#leave_addform #pzsj").textbox('setValue',row['approval_time']);
							//请假事由
							_this.find("#leave_addform #qjsy").textbox('setValue',row['reason']);
							
						}
					};
		var config = common.getWorkflowType('LEAVE_EMP');
		config['key'] = key;
		config = $.extend(true,opts,config);
		if(undefined != listId && null != listId && '' != listId){
			config['listId'] = listId;
		}
		act_workflow.handleByBusinessKey(opts);
	}
	
	return {
		leave_doAdd:function(){
			_modifyWin(true);
		},
		leave_doDel:function(){
			var checkeds = $(_listId).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除选择的数据吗?',function(b){
					if(b){
						var ids = [];
						for(var i = 0 ; i < checkeds.length ; i++){
							ids.push(checkeds[i]['id']);
						};
						_handlerDel(ids.join(','));
					}
				});
			}else{
				$.messager.alert('提示','请选择项目');
			}
		},
		leave_doEdit:function(index){
			var row = $(_listId).datagrid("getRows")[index];
			_modifyWin(false,row);
		},
		leave_doDelOne:function(index){
			var row = $(_listId).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除吗?',function(b){
				if(b){
					_handlerDel(row['id']);
				};
			});
		},
		leave_doSearch:function(){
			//企业名称 类别 是否销假
			var arra = [
	            {"property":"enterprise_id","value":$('#leave_enterprise_name').textbox("getValue")},
	            {"property":"project_id","value":$('#leave_project_name').textbox("getValue")},
	    		{"property":"type","value":$('#leave_type').textbox("getValue")},
	    		{"property":"is_back","value":$('#leave_state').textbox("getValue")},
	    		{"property":"status","value":$('#leave_back').textbox("getValue")}
	    	];
	    	var param = {};
	    	param["filter"]=arra;
	    	$(_listId).datagrid('reload',param);
		},
		leave_doReset:function(){
			$("#leave_queryform").form("reset");
			var param = {};
		    param["filter"]=[];
		    $(_listId).datagrid('reload',param);
		},
		leave_doHandle:function(value,row,index){
			var btn='';
			if(hasPriv("VACATION_MANAGER_EDIT")){
				btn += _doEdit(index);
			}
			if(hasPriv("VACATION_MANAGER_DELETE")){
				btn += _doDel(index);
			}
			return btn;
		},
		leave_status:function(value,row,index){
			if(value){
				if(value=='0'){
					return '审批新建';
				}
				if(value=='1'){
					return '审批中';
				}
				if(value=='2'){
					return '审批拿回';
				}
				if(value=='3'){
					return '审批通过';
				}
				if(value=='4'){
					return '审批拒绝';
				}
				if(value=='5'){
					return '审批结束';
				}
			}else{
				return '无状态';
			}
		},
		handlById:function(businessKey,listId){
			if(businessKey){
				var id = businessKey.split('.')[1];
				var key = businessKey.split('.')[0];
				common.ajax('./Vacation-findById.action',{'vacationModel.id':id},function(resp){
					if(resp['success']){
						var data = resp['data'];
						_handlBusiness(key,data,listId);
					}else{
						$.messager.alert('提示',resp['msg'],'info');
					}
				});
				
			}
			
		},
		leave_doImport:function(){
			var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-sign-in'> </i> 导入",
				width:"540px",
				height:"330px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"page/human/human_leave_import.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							handler:function(){
								var importUrl = './Vacation-importData.action';
								$('#human_leave_import').form('submit',{
									url:importUrl,
									success:function(resp){
										resp = JSON.parse(resp);
										if(resp['success']){
											$.messager.alert('提示',resp['msg']);
											w.panel("destroy");
											$(_listId).datagrid('reload');
										}else{
											$.messager.alert('提示',resp['msg']);
											w.panel("destroy");
											$(_listId).datagrid('reload');
										}
									}
								});
							}
						},
						{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
								w.panel("destroy");
							}
				}],
				onClose:function(){
					w.panel("destroy");
				},
				onLoad:function(){
				
				}
				
			});
		},
		leave_doExport:function(){
			var enterprise_id = $('#leave_queryform #leave_enterprise_name').textbox("getValue");
			var project_id = $('#leave_queryform #leave_project_name').textbox("getValue");
			var type = $('#leave_queryform #leave_type').textbox("getValue");
			var is_back = $('#leave_queryform #leave_state').textbox("getValue");
			var status = $('#leave_queryform #leave_back').textbox("getValue");
			var url = "./page/human/human_leave_export.jsp?";
			url += "enterprise_id="+enterprise_id;
			url += "&project_id="+project_id;
			url += "&type="+type;
			url += "&is_back="+is_back;
			url += "&status="+status;
			$(this).attr("href",url);
		},
		select_qy:function(row){
			$('#leave_depart_id').combotree('clear');
			$('#leave_depart_id').combotree('reload','./Depart-listDept.action?enterpriseId='+row['id']);
			$('#leave_empproject_id').combobox('clear');
			$('#leave_empproject_id').combobox('reload','./Employee-listProjectByCondition.action?type=VACATION_MANAGER_ADD&enterpriseId='+row['id']);
			$('#leave_emp_id').combobox('clear');
			$('#leave_emp_id').combobox('reload','./Employee-listEnterpriseEmp.action?tId='+row['id']);
		},
		select_bm:function(row){
			$('#leave_depart_name').val(row['name']);
		},
		select_xm:function(row){
			$('#leave_empproject_name').val(row['name']);
		},
		select_emp:function(row){
			$('#leave_emp_name').val(row['name']);
		},
		togglePlsc:function(){
			if($("#leave_list").datagrid("getChecked").length>0){
				$("#leave_div #leave_del").linkbutton("enable");
			}else{
				$("#leave_div #leave_del").linkbutton("disable");
			}
		}
	};
}());