function yhgl_zhgl_select_bm(row){
	$('#yhgl_zhgl_depart_name').val(row['name']);
}

function yhgl_zhgl_select_qy(row){
	$('#yhgl_zhgl_depart_id').combotree('clear');
	$('#yhgl_zhgl_depart_id').combotree('reload','./Depart-listDept.action?enterpriseId='+row['id']);
}

function yhgl_zhgl_init(){
	if(!hasPriv("USER_ACCOUNT_MANAGER_ADD")){
		$("#yhgl_zhgl_zj_btn").hide();
	}
	if(!hasPriv("USER_ACCOUNT_MANAGER_DELETE")){
		$("#yhgl_zhgl_plsc_btn").hide();
	}
	if(!hasPriv("USER_ACCOUNT_MANAGER_IMPORT")){
		$("#yhgl_zhgl_import_btn").hide();
	}
	
}

function yhgl_zhgl_doHandle(value,row,index) {
	if(row['employeeModel']['type']=='0'){
		var btn =  '<a href="#" onclick="yhgl_zhgl_doStaffRole('+index+')" style="padding:10px 8px;" ><i class="fa fa-id-badge"></i> 角色</a>';
		return btn;
	}else if(row['employeeModel']['type']=='1'){
		var btn =  '';
		if(hasPriv('USER_ACCOUNT_MANAGER_ADD')){
			btn = btn + '<a href="#" onclick="yhgl_zhgl_setAccount('+index+')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 设置账号</a>';
		}
		if(hasPriv('USER_ACCOUNT_MANAGER_DELETE')&&row['employeeModel']&&row['employeeModel']['account_id']!=''){
			btn = btn + '<a href="#" onclick="yhgl_zhgl_clearAccount('+index+')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 清除账号</a>';
		}
		btn = btn + '<a href="#" onclick="yhgl_zhgl_doStaffRole('+index+')" style="padding:10px 8px;" ><i class="fa fa-id-badge"></i> 角色</a>';
		return btn;
	}else if(row['employeeModel']['type']=='2'){
		var btn = '<a href="#" onclick="yhgl_zhgl_doEdit('+index+')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 编辑</a>';
		if(hasPriv("USER_ACCOUNT_MANAGER_DELETE")){
		 	btn = btn + '<a href="#" onclick="yhgl_zhgl_doDel('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
		}
		btn = btn + '<a href="#" onclick="yhgl_zhgl_doStaffRole('+index+')" style="padding:10px 8px;" ><i class="fa fa-id-badge"></i> 角色</a>';
		return btn;
	}
}

function yhgl_zhgl_clearAccount(index){
	$.messager.confirm("提示","确认清除账号?",function(ok){
  		if(ok){
			
  			var row = $("#yhgl_zhgl_list").datagrid("getRows")[index];
  			$.ajax({
				url:"./Employee-clearAccount.action",
				method:"post",
				data:{"id":row['employeeModel']["id"]},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#yhgl_zhgl_list").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}

function yhgl_zhgl_setAccount(index){
	var row = $("#yhgl_zhgl_list").datagrid("getRows")[index];
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-plus'> </i> 设置账号",
				width:"540px",
				height:"230px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"page/associator/yhgl_zhgl_account.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							handler:function(){
								w.find("form").form("submit",{
									url:"./Employee-setAccountForEmployee.action",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													w.panel("destroy");
													$("#yhgl_zhgl_list").datagrid("reload");
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
					$(this).dialog("destroy");
				},
				onLoad:function(){
						w.find('[name="employee.id"]').val(row['employeeModel']['id']);
						w.find('[textboxname="account"]').textbox('setValue',row['employeeModel']['account']['account']);
						w.find('[textboxname="passwd"]').textbox('setValue',row['employeeModel']['account']['passwd']);
				}
				
	});
}

function yhgl_zhgl_add(){
	yhgl_zhgl_doSave(true);
}

function yhgl_zhgl_doEdit(index){
	var row = $("#yhgl_zhgl_list").datagrid("getRows")[index];
	yhgl_zhgl_doSave(false,row);
}

function yhgl_zhgl_doSave(isAdd,row){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:isAdd?"<i class='fa fa-plus'> </i> 添加":"<i class='fa fa-pencil'> </i> 编辑",
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"page/associator/yhgl_zhgl_add.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							disabled:!isAdd&&!hasPriv('USER_ACCOUNT_MANAGER_EDIT'),
							handler:function(){
								w.find("form").form("submit",{
									url:"./Employee-saveAccount.action",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													w.panel("destroy");
													$("#yhgl_zhgl_list").datagrid("reload");
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
					$(this).dialog("destroy");
				},
				onLoad:function(){
					w.find('[textboxname="employee.sex"]').combobox({
						data:common.listCodesByType('XB')
					});
					
					if(!isAdd){
						w.find('[textboxname="enterpriseEmployee.enterprise_id"]').closest('div').hide();
						var obj = {};
						for(var k in row){
							obj["enterpriseEmployee."+k] = row[k];
						}
						for(var k in row['employeeModel']){
							obj["employee."+k] = row['employeeModel'][k];
						}
						w.find('[textboxname="account"]').textbox('setValue',row['employeeModel']['account']['account']);
						w.find('[textboxname="passwd"]').textbox('setValue',row['employeeModel']['account']['passwd']);
						w.find("form").form("load",obj);
						w.find('#yhgl_zhgl_depart_id').combotree('reload','./Depart-listDept.action?enterpriseId='+row['enterprise_id']);
					}
				}
				
	});
}

function yhgl_zhgl_doDel(index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
			
  			var row = $("#yhgl_zhgl_list").datagrid("getRows")[index];
  			$.ajax({
				url:"./Employee-delete.action",
				method:"post",
				data:{"ids":row["id"]},
				dataType:"json",
				success:function(resp){
					$.messager.alert("提示",resp["msg"],"info",function(){});
					$("#yhgl_zhgl_list").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}

function yhgl_zhgl_doStaffRole(index){
	var row = $("#yhgl_zhgl_list").datagrid("getRows")[index];
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-plus'> </i> 设置角色",
				width:"540px",
				height:"480px",
				footer:'#footer',				
				modal:true,
				href:"page/associator/yhgl_zhgl_role.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							disabled:!hasPriv('USER_ACCOUNT_MANAGER_ROLE'),
							handler:function(){
								yhgl_zhgl_doRole(w);
							}
						},
						{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
								w.dialog("destroy");
							}
						}
				],
				onClose:function(){
					w.dialog("destroy");
				},
				onLoad:function(){
					w.find("[name='id']").val(row['id']);
					$.ajax({
						url:'./Role-listByEntId.action',
						data:{'enterpriseId':row['enterprise_id']},
						dataType:'json',
						success:function(resp){
							$('#yhgl_zhgl_role_list').datagrid('request',resp);
							$.ajax({
								url:'./Employee-listRolesByEnterpriseEmp.action',
								data:{'id':row['id']},
								dataType:'json',
								success:function(res){
									$.each(res,function(i,r){
										var rows = $('#yhgl_zhgl_role_list').datagrid('getRows');
										$.each(rows,function(i,r){
											$.each(res,function(j,r1){
												if(r1['id']==r['id']){
													$('#yhgl_zhgl_role_list').datagrid('checkRow',i);
													return  false;
												}
											});
										});
										
									});
								}
							});
						}
					});
				}
				
	});
}
function yhgl_zhgl_doRole(win){
	var selected = $('#yhgl_zhgl_role_list').datagrid('getChecked');
	var roleIds = [];
	$.each(selected,function(i,r){
		roleIds.push(r['id']);
	});
	win.find("form").form("submit",{
		url:"./Employee-saveRole.action",
		queryParams:{'roleIds':$.MingwenJSON.encode(roleIds)},
		success:function(data){
			try{
				var obj = $.MingwenJSON.decode(data);
				$.messager.alert("提示",obj["msg"],"info",function(){});
				if(obj["success"]){
					win.panel("destroy");
					$("#yhgl_zhgl_list").datagrid("reload");
				}
				
			}catch(e){}
		},
		error:function(){
			$.messager.alert("提示","网络错误","info");
		}
	});
}

function yhgl_zhgl_togglePlsc(index)
{
	if($("#yhgl_zhgl_list").datagrid("getChecked").length>0){
		
		$("#yhgl_zhgl_plsc_btn").linkbutton("enable");
		
	}else{
		$("#yhgl_zhgl_plsc_btn").linkbutton("disable");
	}

}

function yhgl_zhgl_plsc(){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
  			var checked = $("#yhgl_zhgl_list").datagrid("getChecked");
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
					$("#yhgl_zhgl_list").datagrid("reload");
				},
				error:function(){
					$.messager.alert("提示","网络错误","info");
				}
			});
  		} 
	});
}

function yhgl_zhgl_import(){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-sign-in'> </i> 导入",
				id:'accounts_import_w',
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"associator_accounts_import.html",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							handler:function(){
								$(this).closest("form").form("submit",{
									url:" ",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													$("#accounts_import_w").panel("destroy");
													$("#accounts_list").datagrid("reload");
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
							$("#accounts_import_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					w.find("form").form("load",obj);
				}
	});
}

function searchSelect_qy(){
	$('#yhgl_zhgl_select_qy').combotree('clear');
	$('#yhgl_zhgl_select_qy').combotree('reload','./Depart-listDept.action?enterpriseId='+row['id']);
}

function yhgl_zhgl_search(){
	var arra = [
		{"property":"account","value":$('#yhgl_zhgl_search_account').textbox("getValue")},
		{"property":"name","value":$('#yhgl_zhgl_search_name').textbox("getValue")},
		{"property":"enterprise_id","value":$('#yhgl_zhgl_search_enterprise').combobox("getValue")},
		{"property":"depart_id","value":$('#yhgl_zhgl_depart_id').combotree("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#yhgl_zhgl_list').datagrid('reload',param);
}

function yhgl_zhgl_reset(){
	$("#yhgl_zhgl_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#yhgl_zhgl_list').datagrid('reload',param);
    $('#yhgl_zhgl_depart_id').combotree('reload','./Depart-listDept.action?enterpriseId=');
}




