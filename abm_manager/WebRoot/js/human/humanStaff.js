// 人力服务-员工管理
var humanStaff = (function(){
	var _divId = '#div_human_staff';
	var _listId = _divId + ' #human_staff_list';
	function save(isAdd,row){
		if(isAdd){
			var w = $("<div></div>").css("padding","10px").appendTo("body");
				w.dialog({
					title:"<i class='fa fa-plus'> </i> 添加",
					width:"540px",
					height:"530px",
					collapsible:false,
					minimizable:false,
					maximizable:false,
					modal:true,
					href:"page/human/human_staff_add.jsp",
					buttons: [{
								text:'<i class="fa fa-check"> </i> 保存',
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
						w.find('[textboxname="employee.sex"]').combobox({
							data:common.listCodesByType('XB')
						});
						
						/**考勤照片**/
						$('#emp_attendance_photo').change(function(){
							$('#human_staff_add_form').form("submit",{
								url:"./File-uploadEmpAttendanceImg.action",
								onSubmit:function(){
									return true;
								},
								success:function(resp){
									try{
										resp = $.MingwenJSON.decode(resp);
										if(resp['success']){
											var imgSrc = "./File-getImage.action?imageName="+resp['save_filename'];
											$('#emp_attendance_img').attr('src',imgSrc);
											$('#emp_attendance_save_filename').val(resp['save_filename']);
											$('#emp_attendance_yuan_filename').val(resp['yuan_filename']);
										}
										$.messager.alert('提示',resp['msg']);
									}catch(e){}
								},
								error:function(){
									$.messager.alert("提示","网络错误","info");
								}
							});
						});
					}
					
			});
		}else{
//			if(row['employeeModel']['type']=='1'||row['employeeModel']['type']=='2'){
				var w = $("<div></div>").css("padding","10px").appendTo("body");
				w.dialog({
					title:"<i class='fa fa-pencil'> </i> 编辑",
					width:"540px",
					height:"530px",
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
						if(row){
							w.find('#enterpriseEmployee_depart_id').combotree('reload','./Depart-listDept.action?enterpriseId='+row['enterprise_id']);
						}
						w.find('[textboxname="enterpriseEmployee.enterprise_id"]').closest('div').hide();
						w.find('[textboxname="employee.sex"]').combobox({
							data:common.listCodesByType('XB')
						});
						
						if(row['employeeModel']['type']=='0'){
							$('#human_staff_add_form #employee_name').textbox('disable');
							$('#human_staff_add_form #employee_phone').textbox('disable');
							$('#human_staff_add_form #employee_sex').textbox('disable');
						}
						
						var obj = {};
						for(var k in row){
							obj["enterpriseEmployee."+k] = row[k];
						}
						for(var k in row['employeeModel']){
							obj["employee."+k] = row['employeeModel'][k];
						}
						w.find("form").form("load",obj);
						
						if(row){
							var attendance_photo_obj = row['attendance_photo'];
							var imgSrc = "./File-getImage.action?imageName="+attendance_photo_obj['save_filename'];
							$('#emp_attendance_img').attr('src',imgSrc);
							$('#emp_attendance_save_filename').val(attendance_photo_obj['save_filename']);
							$('#emp_attendance_yuan_filename').val(attendance_photo_obj['yuan_filename']);
						}
						
						/**考勤照片**/
						$('#emp_attendance_photo').change(function(){
							$('#human_staff_add_form').form("submit",{
								url:"./File-uploadEmpAttendanceImg.action",
								onSubmit:function(){
									return true;
								},
								success:function(resp){
									try{
										resp = $.MingwenJSON.decode(resp);
										if(resp['success']){
											var imgSrc = "./File-getImage.action?imageName="+resp['save_filename'];
											$('#emp_attendance_img').attr('src',imgSrc);
											$('#emp_attendance_save_filename').val(resp['save_filename']);
											$('#emp_attendance_yuan_filename').val(resp['yuan_filename']);
										}
										$.messager.alert('提示',resp['msg']);
									}catch(e){}
								},
								error:function(){
									$.messager.alert("提示","网络错误","info");
								}
							});
						});
					}
					
				});
//			}else if(row['employeeModel']['type']=='0'){
//				//保安修改
//			}
		}
		
	}
	return {
		select_bm:function(row){
			$('#enterpriseEmployee_depart_name').val(row['name']);
		},
		searchSelect_qy:function(row){
			$('#human_staff_search_bm').combotree('clear');
			$('#human_staff_search_bm').combotree('reload','./Depart-listDept.action?enterpriseId='+row['id']);
		},
		select_qy:function(row){
			$('#enterpriseEmployee_depart_id').combotree('clear');
			$('#enterpriseEmployee_depart_id').combotree('reload','./Depart-listDept.action?enterpriseId='+row['id']);
		},
		init:function(){
			if(!hasPriv('EMPLOYEE_MANAGER_ADD')){
				$('#human_staff_add_btn').hide();
				$('#human_staff_invite_btn').hide();
			}
			if(!hasPriv('EMPLOYEE_MANAGER_DELETE')){
				$('#human_staff_plsc_btn').hide();
			}
			if(!hasPriv('EMPLOYEE_MANAGER_IMPORT')){
				$('#human_staff_import_btn').hide();
			}
			
		},
		addEmp:function(){
			save(true);
		},
		addEmpInvite:function(){
			var _dialog = common.openDialog({
				title:'邀请安保人员',
				width:'400px',
				height:'300px',
				href:'./page/human/human_staff_invite.jsp',
				buttons:[
				         	{
				         		text:'发送邀请',
				         		iconCls:'fa fa-check',
				         		handler:function(){
				         			if(_dialog.find('form').form('validate')){
				         				var phone = _dialog.find('#phone').textbox('getValue');
				         				var entId = _dialog.find('[textboxname="entId"]').textbox('getValue');
				         				common.ajax('./Enterprise-empInvite.action',{phone:phone,entId:entId},function(resp){
				         					if(resp['success']){
				         						_dialog.window('destroy');
				         					}
				         					$.messager.alert('提示',resp['msg']);
				         				});
				         			}
				         		}
				         	}
				         ]
			});
		},
		del:function(index){
			$.messager.confirm("提示","确认删除信息?",function(ok){
		  		if(ok){
					//do delete row
		  			var row = $(_listId).datagrid("getRows")[index];
				  	$.ajax({
						url:"./Employee-delete.action",
						method:"post",
						data:{"ids":row["id"]},
						dataType:"json",
						success:function(resp){
							$.messager.alert("提示",resp["msg"],"info",function(){});
							$(_listId).datagrid("reload");
						},
						error:function(){
							$.messager.alert("提示","网络错误","info");
						}
					});
		  		} 
			});
		},
		togglePlsc:function(){
			if($(_listId).datagrid("getChecked").length>0){
				$("#human_staff_plsc_btn").linkbutton("enable");
			}else{
				$("#human_staff_plsc_btn").linkbutton("disable");
			}
		},
		plsc:function(){
			$.messager.confirm("提示","确认删除信息?",function(ok){
		  		if(ok){
		  			var checked = $(_listId).datagrid("getChecked");
		  			var param = "";
		  			for(i=0;i<checked.length;i++){
		  				param = param + checked[i]["id"] + ",";
		  			}
		  			if(param.length>0){
		  				param = param.substr(0,param.length-1);
		  			}
					$.ajax({
						url:"./Employee-delete.action",
						method:"post",
						data:{"ids":param},
						dataType:"json",
						success:function(resp){
							$.messager.alert("提示",resp["msg"],"info",function(){});
							$(_listId).datagrid("reload");
						},
						error:function(){
							$.messager.alert("提示","网络错误","info");
						}
					});
		  		} 
			});
		},
		detail:function(index){
			var row = $(_listId).datagrid("getRows")[index];
			save(false,row);
		},
		query:function(){
//			var arra = [
//				{"property":"enterprise_id","value":$('#human_staff_queryform #human_staff_enterprise_name').textbox("getValue")},
////				{"property":"project_id","value":$('#human_staff_queryform #human_staff_project_name').textbox("getValue")},
//				{"property":"depart_id","value":$('#human_staff_queryform #human_staff_depart').textbox("getValue")},
//				{"property":"name","value":$('#human_staff_queryform #human_staff_search_name').textbox("getValue")}
//			];
			var arra = [
						{"property":"enterprise_id","value":$('#human_staff_queryform #human_staff_search_qy').combobox("getValue")},
						{"property":"depart_id","value":$('#human_staff_queryform #human_staff_search_bm').combotree("getValue")},
						{"property":"name","value":$('#human_staff_queryform #human_staff_search_name').textbox("getValue")}
					];
			var param = {};
			param["filter"]=arra;
			$(_listId).datagrid('reload',param);
		},
		reset:function(){
			$("#human_staff_queryform").form("reset");
			var param = {};
		    param["filter"]=[];
		    $(_listId).datagrid('reload',param);
		},
		doHandle:function(value,row,index){
			var btn = '<a href="#" onclick="humanStaff.detail('+index+')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 编辑</a>';
			if(hasPriv('EMPLOYEE_MANAGER_DELETE')){
		 		btn = btn + '<a href="#" onclick="humanStaff.del('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
		 	}
			return btn;
		},
		doImport:function(){
			var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-sign-in'> </i> 导入",
				width:"540px",
				height:"330px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"page/human/human_staff_import.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							handler:function(){
								var importUrl = './Employee-importData.action';
								$('#human_staff_import').form('submit',{
									url:importUrl,
									success:function(resp){
										resp = JSON.parse(resp);
										if(resp['success']){
											$.messager.alert('提示','导入成功.');
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
					w.dialog("destroy");
				},
				onLoad:function(){
				
				}
				
			});
		},
		doExport:function(){
			var enterprise_id = $('#human_staff_queryform #human_staff_enterprise_name').textbox("getValue");
			var depart_id = $('#human_staff_queryform #human_staff_depart').textbox("getValue");
			var name = $('#human_staff_queryform #human_staff_search_name').textbox("getValue");
			var url = "./page/human/human_staff_export.jsp?";
			url += "enterprise_id="+enterprise_id;
			url += "&depart_id="+depart_id;
			url += "&name="+name;
			$(this).attr("href",url);
		}
	};
}());