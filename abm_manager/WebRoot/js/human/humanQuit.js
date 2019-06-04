// 人力服务-离职
var humanQuit = (function(){
	var _divId = '#quit_div';
	var _listId = _divId + ' #quit_list';
	
	var _handlerDel = function(ids){
		common.ajax('./Dismiss-del.action',{ids:ids},function(resp){
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
			id:'quit_add_win',
			width:"540px",
			height:"520px",
			collapsible:false,
			minimizable:false,
			maximizable:false,
			modal:true,
			href:"./page/human/human_quit_add.jsp",
			buttons:[{
				//save
				text:'<i class="fa fa-check"> </i> 保存',
				handler:function(){
					var data = {};
					//企业ID
					data['dismissModel.enterprise_id']=$('#quit_addform #qymc').textbox('getValue');
					//ID
					data['dismissModel.id']=$("#quit_addform #id").val();
					//姓名
					data['dismissModel.name']=$("#quit_addform #xm").textbox('getValue');
					//部门
					data['dismissModel.depart_name']=$("#quit_addform #quit_depart_name").val();
					data['dismissModel.depart_id']=$("#quit_addform #bm").combotree('getValue');
					//职务
					data['dismissModel.position']=$("#quit_addform #zw").textbox('getValue');
					//联系电话
					data['dismissModel.phone']=$("#quit_addform #dh").textbox('getValue');
					//申请时间
					data['dismissModel.req_time']=$("#quit_addform #sqsj").textbox('getValue');
					//工作交接
					data['dismissModel.hand_over']=$("#quit_addform #gzjj").textbox('getValue');
					//设备归还
					data['dismissModel.equip_return']=$("#quit_addform #sbgh").textbox('getValue');
					//欠款归还
					data['dismissModel.owe_return']=$("#quit_addform #qkgh").textbox('getValue');
					//工资支付
					data['dismissModel.pay']=$("#quit_addform #gzzf").textbox('getValue');
					//离职时间
					data['dismissModel.dismiss_time']=$("#quit_addform #lzsj").textbox('getValue');
					//离职原因
					data['dismissModel.reason']=$("#quit_addform #lzyy").textbox('getValue');
					//离职评价
					data['dismissModel.evaluation']=$("#quit_addform #lzpj").textbox('getValue');
					
					$.ajax({
						url:'./Dismiss-modify.action',
						type:'post',
						data:data,
						dataType:'json',
						async:false,
						success:function(data){
							$.messager.alert("提示",data['msg']);
							if(data['success']){
								$("#quit_add_win").panel("destroy");
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
					$("#quit_add_win").panel("destroy");
				}
			}],
			onColse:function(){
				$(this).dialog("destory");
			},
			onLoad:function(){
				if(!isAdd){
					//企业ID
					$('#quit_addform #qymc').textbox('setValue',row['enterprise_id']);
					//ID
					$("#quit_addform #id").val(row['id']);
					//姓名
					$("#quit_addform #xm").textbox('setValue',row['name']);
					//部门
					$("#quit_addform #bm").combotree('setValue',row['depart_id']);
					$("#quit_addform #quit_depart_name").val(row['depart_name']);
					//职务
					$("#quit_addform #zw").textbox('setValue',row['position']);
					//联系电话
					$("#quit_addform #dh").textbox('setValue',row['phone']);
					//申请时间
					$("#quit_addform #sqsj").textbox('setValue',row['req_time']);
					//工作交接
					$("#quit_addform #gzjj").textbox('setValue',row['hand_over']);
					//设备归还
					$("#quit_addform #sbgh").textbox('setValue',row['equip_return']);
					//欠款归还
					$("#quit_addform #qkgh").textbox('setValue',row['owe_return']);
					//工资支付
					$("#quit_addform #gzzf").textbox('setValue',row['pay']);
					//离职时间
					$("#quit_addform #lzsj").textbox('setValue',row['dismiss_time']);
					//离职原因
					$("#quit_addform #lzyy").textbox('setValue',row['reason']);
					//离职评价
					$("#quit_addform #lzpj").textbox('setValue',row['evaluation']);
					
				}
			}
		});
	};
	
	
	var _handlBusiness = function(key,row,listId){
		console.log("key:"+key);
		console.log("listId:"+listId);
		if($.isEmptyObject(row)){
			$.messager.alert('提示','请选择处理信息');
			return;
		}
		var width = '590px';
		var height = $(document).height()*0.8+'px';
		var opts = {
						businessId:row['id'],
						title:'离职单审批',
						width:width,
						height:height,
						status:row['status'],
						onLoad:function(){
							
							//ID
							$('#quit_addform #id').val(row['id']);
							//企业ID
							$('#quit_addform #qymc').textbox('setValue',row['enterpriseModel']['name']);
							//ID
							$("#quit_addform #id").val(row['id']);
							//姓名
							$("#quit_addform #xm").textbox('setValue',row['name']);
							//部门
							$("#quit_addform #bm").combotree('setValue',row['depart_name']);
							$("#quit_addform #quit_depart_name").val(row['depart_name']);
							//职务
							$("#quit_addform #zw").textbox('setValue',row['position']);
							//联系电话
							$("#quit_addform #dh").textbox('setValue',row['phone']);
							//申请时间
							$("#quit_addform #sqsj").textbox('setValue',row['req_time']);
							//工作交接
							$("#quit_addform #gzjj").textbox('setValue',row['hand_over']);
							//设备归还
							$("#quit_addform #sbgh").textbox('setValue',row['equip_return']);
							//欠款归还
							$("#quit_addform #qkgh").textbox('setValue',row['owe_return']);
							//工资支付
							$("#quit_addform #gzzf").textbox('setValue',row['pay']);
							//离职时间
							$("#quit_addform #lzsj").textbox('setValue',row['dismiss_time']);
							//离职原因
							$("#quit_addform #lzyy").textbox('setValue',row['reason']);
							//离职评价
							$("#quit_addform #lzpj").textbox('setValue',row['evaluation']);
						}
					};
		// key-企业id
		var quitConfig = common.getWorkflowType('QUIT_EMP');
		quitConfig['key'] = 'QUIT_EMP' + '-' + row['enterprise_id'];
//		var config = common.getWorkflowType('QUIT_EMP');
//		config['key'] = key;
//		opts = $.extend({},opts,config);
		opts = $.extend({},opts,quitConfig);
//		if(undefined != listId && null != listId && '' != listId){
//			config['listId'] = listId;
//		}
		act_workflow.handleByBusinessKey(opts);
	}
	
	return {
		handlById:function(businessKey,listId){
			if(businessKey){
				var id = businessKey.split('.')[1];
				var key = businessKey.split('.')[0];
				common.ajax('./Dismiss-findById.action',{'dismissModel.id':id},function(resp){
					if(resp['success']){
						var data = resp['data'];
						_handlBusiness(key,data,listId);
					}else{
						$.messager.alert('提示','找不到信息','info');
					}
				});
			}
		},
		quit_doAdd:function(){
			_modifyWin(true);
		},
		quit_doDel:function(){
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
		quit_doEdit:function(index){
			var row = $(_listId).datagrid("getRows")[index];
			_modifyWin(false,row);
		},
		quit_doDelOne:function(index){
			var row = $(_listId).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除吗?',function(b){
				if(b){
					_handlerDel(row['id']);
				};
			});
		},
		quit_doExport:function(){
			$.messager.alert('提示','开发中');
		},
		quit_doCheck:function(){
			$.messager.alert('提示','开发中');
		},
		quit_doSearch:function(){
			var arra = [
	    		{"property":"enterprise_id","value":$('#quit_queryform #enterprise_id').textbox("getValue")},
	    		{"property":"name","value":$('#quit_queryform #name').textbox("getValue")},
	    		{"property":"quit1","value":$('#quit_queryform #start').textbox("getValue")},
	    		{"property":"quit2","value":$('#quit_queryform #end').textbox("getValue")}
	    	];
	    	var param = {};
	    	param["filter"]=arra;
	    	$(_listId).datagrid('reload',param);
		},
		quit_doReset:function(){
			$("#quit_queryform").form("reset");
			var param = {};
		    param["filter"]=[];
		    $(_listId).datagrid('reload',param);
		},
		quit_doHandle:function(value,row,index){
			var btn = '';
			if(hasPriv("DISMISS_MANAGER_EDIT")){
				btn += '<a href="#" onclick="humanQuit.quit_doEdit('+index+')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 编辑</a>';
			}
			if(hasPriv("DISMISS_MANAGER_DELETE")){
				btn += '<a href="#" onclick="humanQuit.quit_doDelOne('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			return btn;
		},
		togglePlsc:function(){
			if($("#quit_list").datagrid("getChecked").length>0){
				$("#quit_div #quit_del").linkbutton("enable");
			}else{
				$("#quit_div #quit_del").linkbutton("disable");
			}
		},
		select_qy:function(row){
			$('#quit_addform #bm').combotree('clear');
			$('#quit_addform #bm').combotree('reload','./Depart-listDept.action?enterpriseId='+row['id']);
		},
		select_bm:function(row){
			$('#quit_depart_name').val(row['name']);
		},
	};
}());