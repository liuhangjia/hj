function service_type_fmt(value){
	//服务类别(0 企业申请应用|1离职申诉|2保安升星)
	if('0'==value){
		return '企业申请应用';
	}else if('1'==value){
		return '离职申诉';
	}else if('2'==value){
		return '保安升星';
	}else if('3'==value){
		return '申请施工单';
	}
}

function fwqq_abjysx_sp_level_combobox_onChange(nv,ov){
	var win = $('#fwqq_sp');
	if(nv=='2'){
		win.find('#update_star_approval_level_div').hide();
	}else if(nv=='1'){
		win.find('#update_star_approval_level_div').show();
	}
}

function pending_doAuditing(index){
	var row = null;
	if(undefined!=index && null!=index){
		row = $('#pending_list').datagrid('getRows')[index];
	}else{
		
		return;
	}
//	var url='';
//	var width='';
//	var height='';
//	if(row['type']=='0'){
//		url='./page/service/service_emp_update_star_approval.jsp';
//		width='320px';
//		height='';
//	}else{
//		url='./page/service/service_pending_auditing.jsp';
//	}
	 
	var _dialog = common.openDialog({
		id:'fwqq_sp',
		title:'['+row['req_name']+']申请升星审批',
		width:'320px',
		height:'180px',
		href:'./page/service/service_emp_update_star_approval.jsp',
		buttons:[
		         	{
		         		text:'保存',
		         		iconCls:'fa fa-check',
		         		handler:function(){
	         				var result = _dialog.find('#update_star_approval_result').combobox('getValue');
		         			var level = _dialog.find('#update_star_approval_level').textbox('getValue');
		         			console.log(result);
		         			if(!result || result==''){
		         				$.messager.alert('提示','请选择审批结果');
		         				return;
		         			}
		         			if('1'==result && (!level || level=='')){
		         				$.messager.alert('提示','请填写升至星级');
		         				return;
		         			}
		         			var param = {};
		         			param['emp_id']=row['req_id'];
		         			param['id']=row['id'];
		         			param['status']=result;
		         			if(level && level!=''){
		         				param['level']=level;
		         			}
		         			param = $.MingwenJSON.encode(param);
		         			common.ajax('./ServiceRequest-empUpStarApproval.action',{param:param},function(resp){
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

function pending_look_emp(emp_id){
	if(emp_id){
		$.ajax({
			url:'./Employee-findById.action',
			type:'post',
			dataType:'json',
			data:{emp_id:emp_id},
			success:function(row){
				if(row && !$.isEmptyObject(row)){
					var opt = {
							id:'tab_fwqq_emp_'+emp_id,
							title:row['name'],
							closable:true,
							href:"page/system/update_star_emp_detail.jsp?emp_id="+emp_id,
							onLoad:function(){
								for ( var key in row) {
									$('#update_star_emp_detail_form'+emp_id).find('#'+key+emp_id).html(row[key]);
								}
								$(this).find('input,select').attr('disabled',true);
								$(this).find('input,select').attr('readonly',true);
								$(this).find('.mwsmartui-linkbutton').hide();
							}
					};
					
					if($('#tab_fwqq_emp_'+emp_id).length==0){
						$('#operator').tabs('add',opt);
						var length = $('#operator').tabs('tabs').length;
						if(length > 8){
							$('#operator').tabs('close',1);
						}
					}else{
						var tabIndex = $('#operator').tabs('getTabIndex',$('#tab_fwqq_emp_'+emp_id));
						$('#operator').tabs('select',tabIndex);
					}
				}
			},
			error:function(e){
				
			}
		});
	}else{
		$.messager.alert('提示','找不到申请人的信息');
	}
}