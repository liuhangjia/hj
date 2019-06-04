/**列表操作按钮*/
function hyzx_wdyy_doHandle(value,row,index) {
	var btn = '<a href="#" onclick="hyzx_wdyy_doText(\'hyzx_wdyy_list\','+index+')" style="padding:10px 8px;" ><i class="fa fa-file-text"></i> 查看</a>';
	return btn;
}

function hyzx_wdyy_apply(){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:'<i class="fa fa-plus"> </i> 申请',
				width:"640px",
				height:"380px",			
				modal:true,
				href:"./page/member/hyzx_wdyy_add.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 提交',
							handler:function(){
								var detail = [];
								w.find('[name="yy"]').each(function(i,r){
									if($(r).attr('checked')){
										detail.push({
											'id':$(r).val(),
											'text':$(r).data('text')
										});
									}
									
								});
								w.find('[name="sr.req_detail"]').val($.MingwenJSON.encode(detail));
								w.find("form").form("submit",{
									url:"./Enterprise-applyModel.action",
									success:function(data){
										try{
											var obj = $.MingwenJSON.decode(data);
											$.messager.alert("提示",obj["msg"],"info",function(){
												if(obj["success"]){
													w.panel("destroy");
													$("#hyzx_wdyy_list").datagrid("reload");
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
//					w.find("form").form("load",obj);
					$.ajax({
						url:'./Enterprise-listMine.action',
						type:'post',
						dataType:'json',
						success:function(resp){
							w.find('[textboxname="sr.enterprise_id"]').combobox('loadData',resp['rows']);
						}
					});
					$.ajax({
						url:'./Priv-listApplications.action',
						type:'post',
						dataType:'json',
						success:function(resp){
							var h = '';
							$.each(resp,function(i,r){
								h = h + ' <label> <input type="checkbox" name="yy" value="'+r['id']+'" data-text="'+r['name']+'"/>'+r['name']+'</label>';
							});
							w.find('[name="hyzx_wdyy_add_ck"]').html(h);
						}
					});
					
				}
				
	});
}
function hyzx_wdyy_formatStatus(value){
	if(value=='0'){
		return '待处理';
	}else if(value=='1'){
		return '通过';
	}else if(value=='2'){
		return '拒绝';
	}
}
/**
 * 审核
 * @param {Object} row
 * @return {TypeName} 
 */
function hyzx_wdyy_doApply(index){
	var row = null;
	if(undefined!=index && null!=index){
		row = $('#pending_list').datagrid('getRows')[index];
	}else{
		
		return;
	}
	 
	var _dialog = common.openDialog({
		title:'企业申请应用',
		width:'320px',
		height:'180px',
		href:'./page/service/service_enterprise_module_approval.jsp',
		buttons:[
		         	{
		         		text:'保存',
		         		iconCls:'fa fa-check',
		         		handler:function(){
	         				var result = _dialog.find('#enterprise_module_approval_result').combobox('getValue');
		
		         			if(!result || result==''){
		         				$.messager.alert('提示','请选择审批结果');
		         				return;
		         			}
		         			var param = {};
		         			param['sr.id']=row['id'];
		         			param['sr.status']=result;
		         			
		         			common.ajax('./Enterprise-approveApply.action',param,function(resp){
		         				if(resp['success']){
		         					_dialog.window('destroy');
		         					$('#pending_list').datagrid('load');
		         				}
		         				$.messager.alert('提示',resp['msg']);
		         			});
		         		}
		         	}
		         ],
		onLoad:function(){
			
		}
	});
	
}
function hyzx_wdyy_doText(id,index){
	var row = $('#'+id).datagrid('getRows')[index];
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:'<i class="fa fa-plus"> </i> 申请',
				width:"640px",
				height:"380px",			
				modal:true,
				href:"./page/member/hyzx_wdyy_add.jsp",
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					var obj = {};
					for(k in row){
						obj['sr.'+k]=row[k];
					} 
					w.find("form").form("load",obj);
					$.ajax({
						url:'./Enterprise-listMine.action',
						type:'post',
						dataType:'json',
						success:function(resp){
							w.find('[textboxname="sr.enterprise_id"]').combobox('loadData',resp['rows']);
						}
					});
					var h = '';
					$.each(row['req_detail'],function(i,r){
						h = h + ' <label> '+r['text']+'</label>';
					});
					w.find('[name="hyzx_wdyy_add_ck"]').html(h);
					w.find('[textboxname="sr.enterprise_id"]').textbox('readonly',true);
					w.find('[textboxname="sr.phone"]').textbox('readonly',true);
					w.find('[textboxname="sr.bak"]').textbox('readonly',true);
					
				}
				
	});
}


function hyzx_wdqy_doHandle(value,row,index){
	var btn = '<a href="#" onclick="hyzx_wdqy_doEdit('+index+')" style="padding:10px 8px;" ><i class="fa fa-file-text"></i> 编辑</a>';
	return btn; 
}

function hyzx_wdqy_doEdit(index){
	var row = $('#hyzx_wdqy_list').datagrid('getRows')[index];
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-pencil'> </i> 编辑",
				width:"540px",
				height:"430px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"./page/member/hyzx_wdqy_detail.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							handler:function(){
								w.find('form').form('submit',{
			         				url:'./Enterprise-modify.action',
			         				onSubmit:function(){
			         					return w.form('validate');
			         				},
			         				success:function(resp){
			         					resp = JSON.parse(resp);
			         					if(resp['success']){
			         						$('#hyzx_wdqy_list').datagrid('reload');
			         						w.window('destroy');
			         					}
			         					$.messager.alert('提示',resp['msg']);
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
						var data = {};
						for(var p in row){
							data['enterprise.'+p] = row[p];
						}
						w.find('form').form('load',data);
					}else{
						w.find('[name="enterprise.is_delete"]').val('0');
					}
					
					if(row){
						var enterprise_logo_obj = row['logo'];
						var imgSrc = "./File-getImage.action?imageName="+enterprise_logo_obj['save_filename'];
						$('#enterprise_logo').attr('src',imgSrc);
						$('#enterprise_save_filename').val(enterprise_logo_obj['save_filename']);
						$('#enterprise_yuan_filename').val(enterprise_logo_obj['yuan_filename']);
					}
					
					/**	企业LOGO */
 					$('#enterprise_add_logo').change(function(){
 						$('#enterprise_edit_form').form('submit',{
 							url:"./File-uploadEmpAttendanceImg.action",
 							onSubmit:function(){
 								return true;
 							},
 							success:function(resp){
 								try{
 									resp = $.MingwenJSON.decode(resp);
 									if(resp['success']){
 										var imgSrc = "./File-getImage.action?imageName="+resp['save_filename'];
										$('#enterprise_logo').attr('src',imgSrc);
										$('#enterprise_save_filename').val(resp['save_filename']);
										$('#enterprise_yuan_filename').val(resp['yuan_filename']);
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
}

/**列表删除*/
function batch_daDel(value,row,index){
	$.messager.confirm("提示","确认删除信息?",function(ok){
  		if(ok){
  		} 
	});
}



/***返回列表*/

function application_retList(){
	$("#application_editor").panel("destroy");
	$("#application_content").show();
}

/**查看**/
/*function application_doText(value,row,index){
	var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:'<i class="fa fa-file-text"></i> 查看',
				id:'application_ck_w',
				width:"800px",
				height:"600px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"member_application_text.html",
				buttons: [
						{
							text:'<i class="fa fa-remove"> </i> 取消',
							handler:function(){	
							$("#application_ck_w").panel("destroy");
							}
						}],
				onClose:function(){
					$(this).dialog("destroy");
				},
				onLoad:function(){
					
					
				}
				
	});
}

*//**列表查询*/

function application_doSearch(){
	var arra = [
		{"property":"mc","value":$('#application').textbox("getValue")}
	];
	var param = {};
	param["filter"]=arra;
	$('#application_list').datagrid('reload',param);
	
	
}
/**列表重置*/

function application_doReset(){
	$("#application_queryform").form("reset");
	var param = {};
    param["filter"]=[];
    $('#application_list').datagrid('reload',param);
}


