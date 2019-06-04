// 人力服务-考勤
var humanTimecard = (function(){
	var _divId = '#timecard_div';
	var _listId = _divId + ' #timecard_list';
	
	function save(isAdd,row){
		if(isAdd){
			var w = $("<div></div>").css("padding","10px").appendTo("body");
				w.dialog({
					title:"<i class='fa fa-plus'> </i> 添加",
					width:"540px",
					height:"430px",
					collapsible:false,
					minimizable:false,
					maximizable:false,
					modal:true,
					href:"page/human/human_timecard_add.jsp",
					buttons: [{
								text:'<i class="fa fa-check"> </i> 保存',
								handler:function(){
									w.find("form").form("submit",{
										url:"",
										success:function(data){
											try{
												var obj = $.MingwenJSON.decode(data);
												$.messager.alert("提示",obj["msg"],"info",function(){
													if(obj["success"]){
														w.panel("destroy");
														$(_listId).datagrid("reload");
													}
												});
												
											}catch(e){}
										},
										error:function(){
											$.messager.alert("提示","网络错误","info");
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
						w.dialog("destroy");
					},
					onLoad:function(){
						
						w.find('[textboxname="employee.sex"]').combobox({
							data:common.listCodesByType('XB')
						});
					}
					
			});
		}else{
			if(row['employeeModel']['type']=='1'||row['employeeModel']['type']=='2'){
				var w = $("<div></div>").css("padding","10px").appendTo("body");
				w.dialog({
					title:"<i class='fa fa-pencil'> </i> 编辑",
					width:"540px",
					height:"430px",
					collapsible:false,
					minimizable:false,
					maximizable:false,
					modal:true,
					href:"page/human/human_staff_add.jsp",
					buttons: [{
								text:'<i class="fa fa-check"> </i> 保存',
								disabled:!hasPriv('EMPLOYEE_MANAGER_EDIT'),
								handler:function(){
									w.find("form").form("submit",{
										url:"./Employee-saveEmp.action",
										success:function(data){
											try{
												var obj = $.MingwenJSON.decode(data);
												$.messager.alert("提示",obj["msg"],"info",function(){
													if(obj["success"]){
														w.panel("destroy");
														$(_listId).datagrid("reload");
													}
												});
												
											}catch(e){}
										},
										error:function(){
											$.messager.alert("提示","网络错误","info");
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
						w.dialog("destroy");
					},
					onLoad:function(){
						w.find('[textboxname="enterpriseEmployee.enterprise_id"]').closest('div').hide();
						w.find('[textboxname="employee.sex"]').combobox({
							data:common.listCodesByType('XB')
						});
							
						var obj = {};
						for(var k in row){
							obj["enterpriseEmployee."+k] = row[k];
						}
						for(var k in row['employeeModel']){
							obj["employee."+k] = row['employeeModel'][k];
						}
						w.find("form").form("load",obj);
					}
					
				});
			}else if(row['employeeModel']['type']=='0'){
				//保安修改
			}
		}
	}
	
	var _handlerDel = function(ids){
		common.ajax('./Timecard-del.action',{ids:ids},function(resp){
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
			id:'timecard_add_win',
			width:"560px",
			height:"340px",
			collapsible:false,
			minimizable:false,
			maximizable:false,
			modal:true,
			href:"./page/human/human_timecard_add.jsp",
			buttons:[{
				//save
				text:'<i class="fa fa-check"> </i> 保存',
				handler:function(){
					var data = {};
					//企业ID
					data['workAttendanceModel.enterprise_id']=$('#timecard_addform #qymc').textbox('getValue');
					//项目ID
					data['workAttendanceModel.project_id']=$('#timecard_addform #xmmc').textbox('getValue');
					//ID
					data['workAttendanceModel.id']=$("#timecard_addform #id").val();
					//年
					var _ny = $("#timecard_addform #ny").textbox("getValue");
					data['workAttendanceModel.year']=_ny.split("-")[0];
					//月
					data['workAttendanceModel.month']=_ny.split("-")[1];
					//部门
//					data['workAttendanceModel.depart_name']=$("#timecard_addform #bm").textbox("getValue");
					//人数
//					data['workAttendanceModel.amount']=$("#timecard_addform #rs").textbox("getValue");
					//出勤
//					data['workAttendanceModel.normal']=$("#timecard_addform #cq").textbox("getValue");
					//病假
//					data['workAttendanceModel.sick']=$("#timecard_addform #bj").textbox("getValue");
					//事假
//					data['workAttendanceModel.leaves']=$("#timecard_addform #sj").textbox("getValue");
					//矿工
//					data['workAttendanceModel.absence']=$("#timecard_addform #kg").textbox("getValue");
					//迟到
//					data['workAttendanceModel.late']=$("#timecard_addform #cd").textbox("getValue");
					//值班
//					data['workAttendanceModel.over']=$("#timecard_addform #zb").textbox("getValue");
					//备注
					data['workAttendanceModel.bak']=$("#timecard_addform #bak").textbox("getValue");
					
					$.ajax({
						url:'./Timecard-modify.action',
						type:'post',
						data:data,
						dataType:'json',
						async:false,
						success:function(data){
							$.messager.alert("提示",data['msg']);
							if(data['success']){
								$("#timecard_add_win").panel("destroy");
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
					$("#timecard_add_win").panel("destroy");
				}
			}],
			onColse:function(){
				$(this).dialog("destory");
			},
			onLoad:function(){
				if(!isAdd){
					//企业ID
					$('#timecard_addform #qymc').textbox('getValue',row['enterprise_id']);
					//项目ID
					$('#timecard_addform #xmmc').textbox('getValue',row['project_id']);
					//ID
					$("#timecard_addform #id").val(row['id']);
					//年月
					$("#timecard_addform #ny").textbox('setValue',row['year']+"-"+row['month']);
					//部门
//					$("#timecard_addform #bm").textbox('setValue',row['depart_name']);
					//人数
//					$("#timecard_addform #rs").textbox('setValue',row['amount']);
					//出勤
//					$("#timecard_addform #cq").textbox('setValue',row['normal']);
					//病假
//					$("#timecard_addform #bj").textbox('setValue',row['sick']);
					//事假
//					$("#timecard_addform #sj").textbox('setValue',row['leaves']);
					//矿工
//					$("#timecard_addform #kg").textbox('setValue',row['absence']);
					//迟到
//					$("#timecard_addform #cd").textbox('setValue',row['late']);
					//值班
//					$("#timecard_addform #zb").textbox('setValue',row['over']);
					//备注
					$("#timecard_addform #bak").textbox('setValue',row['bak']);
				}
			}
		});
	};
	
	return {
		timecard_doAdd:function(){
			_modifyWin(true);
		},
		timecard_doDel:function(){
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
				$.messager.alert('提示','请选择数据');
			}
		},
		timecard_doEdit:function(index){
			var row = $(_listId).datagrid("getRows")[index];
			_modifyWin(false,row);
		},
		timecard_doDelOne:function(index){
			var row = $(_listId).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除吗?',function(b){
				if(b){
					_handlerDel(row['id']);
				};
			});
		},
		timecard_doImport:function(){
			$.messager.alert('提示','开发中');
		},
		timecard_doExport:function(){
			var ym = $('#timecard_queryform #year_month').textbox('getValue');
			var year = '';
			var month='';
			if(ym!=''){
				year = ym.split('-')[0];
				month = ym.split('-')[1];
			}
			var enterprise_id = $('#timecard_queryform #enterprise_id').textbox("getValue");
			var url = "./page/human/human_timecard_export.jsp?enterprise_id="+enterprise_id;
			url += "&year="+year;
			url += "&month="+month;
			$(this).attr("href",url);
		},
		timecard_doCheck:function(index){
			
			var row = $(_listId).datagrid("getRows")[index];
			var id = row['enterprise_id']+'_'+row['year']+'_'+row['month'];
			var title = row['enterpriseModel']['name']+'('+row['year']+'-'+row['month']+')';
			
			var eid = row['enterprise_id'];
			var year = row['year'];
			var month = row['month'];
			
			if($('#timecard_tabs #'+id).length == 0){
				$('#timecard_tabs').tabs('add',{
					fit:true,
					closable:true,
					href:'./page/human/human_timecard_company.jsp?enterprise_id='+eid+'&year='+year+'&month='+month,
					id:id,
					title:title
				});
			}else{
				$('#timecard_tabs').tabs('select',title);
			}
		},
		timecard_doCheck2:function(index){
			
			if(index){
				var w = $("<div></div>").css("padding","10px").appendTo("body");
				w.dialog({
					title:"<i class='fa fa-plus'> </i> 考勤明细",
					width:"1350px",
					height:"430px",
					collapsible:true,
					minimizable:false,
					maximizable:true,
					modal:true,
					href:"page/human/human_timecard_detail.jsp?id="+index,
					buttons: [{	
								text:'<i class="fa fa-remove"> </i> 取消',
								handler:function(){	
									w.panel("destroy");
								}
							}],
					onClose:function(){
						w.dialog("destroy");
					},
					onLoad:function(){
						
					}
				});
			}
		},
		timecard_doSearch:function(){
			var ym = $('#timecard_queryform #year_month').textbox('getValue');
			var year = '';
			var month='';
			if(ym!=''){
				year = ym.split('-')[0];
				month = ym.split('-')[1];
			}
			var arra = [
	    		{"property":"enterprise_id","value":$('#timecard_queryform #enterprise_id').textbox("getValue")},
	    		{"property":"year","value":year},
	    		{"property":"month","value":month}
	    	];
	    	var param = {};
	    	param["filter"]=arra;
	    	$(_listId).datagrid('reload',param);
		},
		timecard_doReset:function(){
			$("#timecard_queryform").form("reset");
			var param = {};
		    param["filter"]=[];
		    $(_listId).datagrid('reload',param);
		},
		timecard_doHandle:function(value,row,index){
			var btn = '';
			if(hasPriv("WORK_ATTENDANCE_MANAGER_EDIT")){
				//btn += '<a href="#" onclick="humanTimecard.timecard_doEdit('+index+')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 编辑</a>';
			}
			if(hasPriv("WORK_ATTENDANCE_MANAGER_STATISTIC")){
				btn += '<a href="#" onclick="humanTimecard.timecard_doCheck('+index+')" style="padding:10px; 8px" ><i class="fa fa-file-text-o"></i> 查看考勤</a>';
			}
			if(hasPriv("WORK_ATTENDANCE_MANAGER_DELETE")){
				//btn += '<a href="#" onclick="humanTimecard.timecard_doDelOne('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			return btn;
		},
		timecard_doHandle2:function(value,row,index){
			var btn = '';
			if(hasPriv("WORK_ATTENDANCE_MANAGER_STATISTIC")){
				btn += '<a href="#" onclick="humanTimecard.timecard_doCheck2(\''+row['id']+'\')" style="padding:10px; 8px" ><i class="fa fa-file-text-o"></i> 查看考勤明细</a>';
			}
			return btn;
		},
		timecard_ny:function(value,row,index){
			return row['year']+'-'+row['month'];
		}
	};
}());