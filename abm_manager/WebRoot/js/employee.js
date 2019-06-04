//
var employee = (function(){
	
	var tName_json={
			emp_education:{
				name:'教育经历',
				height:'190px',
				action_prop:'edu',
				save_url:'./Employee-modifyEdu.action',
				url:'./page/system/abrysjk_detail/star_include_edu.jsp'
			},
			emp_work:{
				name:'工作经历',
				height:'220px',
				action_prop:'work',
				save_url:'./Employee-modifyWork.action',
				url:'./page/system/abrysjk_detail/star_include_work.jsp'
			},
			emp_achievement:{
				name:'工作业绩',
				height:'340px',
				action_prop:'ach',
				save_url:'./Employee-modifyAch.action',
				url:'./page/system/abrysjk_detail/star_include_ach.jsp'
			},
			emp_training:{
				name:'培训经历',
				height:'310px',
				action_prop:'train',
				save_url:'./Employee-modifyTrain.action',
				url:'./page/system/abrysjk_detail/star_include_train.jsp'
			},
			emp_certifacation:{
				name:'资格证书',
				height:'220px',
				action_prop:'cer',
				save_url:'./Employee-modifyCer.action',
				url:'./page/system/abrysjk_detail/star_include_cer.jsp'
			},
			emp_award:{
				name:'所获奖励',
				height:'190px',
				action_prop:'award',
				save_url:'./Employee-modifyAward.action',
				url:'./page/system/abrysjk_detail/star_include_award.jsp'
			}	
	};
	
	return {
		
		fmt_shzt:function(value){
			if(value == '1'){
				return '已通过';
			}else{
				return '未审核';
			}
		},
		opt_btn:function(value,row,index){
			var tName = $(this).attr('tName');
			var btn = '';
			btn += '<a href="#" onclick="employee.modify_child_table('+index+',\''+row['id']+'\',\''+tName+'\')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			btn += '<a href="#" onclick="employee.examine('+index+',\''+row['id']+'\',\''+tName+'\')" style="padding:10px 8px;" ><i class="fa fa-gavel"></i> 审核</a>';
			btn += '<a href="#" onclick="employee.del_child_table('+index+',\''+row['id']+'\',\''+tName+'\')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			return btn;
		},
		examine:function(index,id,tName){
			var xm = $('#abrysjk_jbxx_xm').textbox('getValue');
			$.messager.confirm('提示','确认审核'+xm+'的'+tName_json[tName]['name']+'?',function(b){
				if(b){
					$.ajax({
		    			url:'./Employee-examineChildrenTableRow.action',
		    			type:'post',
		    			dataType:'json',
		    			data:{tName:tName,tId:id},
		    			success:function(resp){
		    				$('#'+tName+'_list').datagrid('load');
		    				$.messager.alert('提示',resp['msg']);
		    			},
		    			error:function(e){
		    				
		    			}
		    		});
				}
			});
		},
		del_child_table:function(index,id,tName){
			var xm = $('#abrysjk_jbxx_xm').textbox('getValue');
			$.messager.confirm('提示','确认删除'+xm+'的'+tName_json[tName]['name']+'?',function(b){
				if(b){
					$.ajax({
		    			url:'./Employee-delChildrenTableRow.action',
		    			type:'post',
		    			dataType:'json',
		    			data:{tName:tName,tId:id},
		    			success:function(resp){
		    				$('#'+tName+'_list').datagrid('load');
		    				$.messager.alert('提示',resp['msg']);
		    			},
		    			error:function(e){
		    				
		    			}
		    		});
				}
			});
		},
		modify_child_table:function(index,id,tName){
			var xm = $('#abrysjk_jbxx_xm').textbox('getValue');
			var emp_id = $('#abrysjk_emp_id_input').val();
			var title = '';
			var url = '';
			var row = null;
			if(id){
				var child_json = tName_json[tName];
				row = $('#'+tName+'_list').datagrid('getRows')[index];
				title = '修改'+xm+'的'+child_json['name'];
				url = child_json['url']+'?id='+row['id']+'&emp_id='+emp_id;
			}else{
				tName = $(this).linkbutton('options')['tName'];
				var child_json = tName_json[tName];
				title = '添加'+xm+'的'+child_json['name'];
				url = child_json['url']+'?emp_id='+emp_id;
			}
			var _dialog = common.openDialog({
				id:tName+'_modify_win',
				title:title,
				width:'575px',
				height:tName_json[tName]['height'],
				href:url,
				buttons:[
				         	{
				         		text:'保存',
				         		iconCls:'fa fa-check',
				         		handler:function(){
				         			_dialog.find('#'+tName+'_modify_form').form('submit',{
				        				url:tName_json[tName]['save_url'],
				        				onSubmit:function(){
				         					return $(this).form('validate');
				         				},
				        				success:function(resp){
				        					resp = $.MingwenJSON.decode(resp);
				        					if(resp['success']){
				        						_dialog.window('destroy');
				        						$('#'+tName+'_list').datagrid('load');
				        					}
				        					$.messager.alert('提示',resp['msg']);
				        				}
				        			});
				         		}
				         	}
				         ],
				onLoad:function(){
					if(id){
						var action_prop = tName_json[tName]['action_prop'];
						var newRow={};
						for ( var key in row) {
							newRow[action_prop+'.'+key] = row[key];
						}
						_dialog.find('#'+tName+'_modify_form').form('load',newRow);
					}
				}
			});
		},
		save:function(){
			$('#emp_base_info_form').form('submit',{
				url:'./Employee-modify.action',
				onSubmit:function(){
 					return $(this).form('validate');
 				},
				success:function(resp){
					resp = $.MingwenJSON.decode(resp);
					if(resp['success']){
						//$('#abry_abrysjk_list').datagrid('load');
						$('#abrysjk_child_table_form').show();
						var before_emp_id = $('#abrysjk_emp_id_input').val();
						if(!before_emp_id || before_emp_id==''){
							$('#abrysjk_emp_id_input').val(resp['emp_id']);
							for ( var tName in tName_json) {
								$('#'+tName+'_list').datagrid({url:'./Employee-getEmpInfoList.action?emp_id='+resp['emp_id']+'&tName='+tName});
							}
						}
					}
					$.messager.alert('提示',resp['msg']);
				}
			});
		}
	};
	
}());