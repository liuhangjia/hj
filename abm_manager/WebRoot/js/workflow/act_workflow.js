// 流程中心
var act_workflow = (function(){
	// 打开处理业务窗口
	var _openHandleBusinessWindow = function(taskId,businessId,key,businessKey){
		var _listId = '#workflow_my_list';
		var _key = key.split('-')[0];
		var _enterpriseId = key.split('-')[1];
		// 离职
		if('QUIT' == _key){
			
		}
		if('QUIT_EMP' == _key){
			humanQuit.handlById(businessKey,_listId);
		}
		
		// 安保人员请假
		else if('LEAVE_EMP' == _key){
			humanLeave.handlById(businessKey,_listId);
		}
		// 领导请假
		else if('LEAVE2' == _key){
			
		}
	};
	// 处理业务
	var _handleBusiness = function(params,key,businessId,callBack){
		var businessKey = key + "." + businessId;
		var handleResult = $.MingwenJSON.encode(params);
		common.ajax('./act/ActWorkflow-handleBusiness.action',{businessKey:businessKey,handleResult:handleResult},function(resp){
			if(resp['success']){
				$('#workflow_my_div #workflow_my_ysp_list').datagrid('reload');
				callBack && callBack();
			}
			$.messager.alert('提示',resp['msg']);
		});
		
	}
	
	
	
	return {
		deployDefOpt:function(value,row,index){
			var btn = '';
			btn += '<a href="#" id="" onclick="act_workflow.viewPng(\''+row['deploymentId']+'\',\''+row['name']+'\');" title="查看流程图">';
			btn += '<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">查看流程图</span><span class="l-btn-icon icon-search">&nbsp;</span></span>';
			btn += '</a>';
			btn += '<a href="#" id="" onclick="act_workflow.listActivitiesByProcessDefId(\''+row['id']+'\',\''+row['name']+'\');" title="流程节点">';
			btn += '<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">流程节点</span><span class="l-btn-icon icon-text-list-bullets">&nbsp;</span></span>';
			btn += '</a>';
			return btn;
		},
		listActivitiesByProcessDefId:function(processDefId,name){
			var opts = {};
			opts.title = name;
			opts.id = 'list_activities_window';
			opts.width = '600px';
			opts.href = './page/system/act/listActivities.jsp?id='+processDefId;
			var w = common.openDialog(opts);
		},
		viewPng:function(id,name){
			var opts = {};
			opts.title = '[<font color=red>'+name+'</font>]流程图查看';
			opts.id = 'view_png_window';
			opts.href = './page/system/act/viewPng.jsp?id='+id;
			common.openDialog(opts);
		},
		viewPngByKey:function(key,title){
			if(key){
				common.ajax('./act/ActWorkflow-findProcessDefByKeyMaxVersion.action',{key:key},function(data){
					if(!$.isEmptyObject(data)){
						act_workflow.viewPng(data['data']['deploymentId'],title);
					}else{
						$.messager.alert('提示',key+' 不存在流程定义信息');
					}
				})
			}else{
				$.messager.alert('提示','请选择流程KEY');
			}
		},
		deployOpt:function(value,row,index){
			var btn = '';
			btn += '<a href="#" id="" onclick="act_workflow.deployDel(\''+row['id']+'\',\''+row['name']+'\');" title="删除">';
			btn += '<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">删除</span><span class="l-btn-icon icon-remove">&nbsp;</span></span>';
			btn += '</a>';
			return btn;
		},
		deployDel:function(id,name){
			$.messager.confirm('提示','确认删除[<font color=red>'+name+'</font>]部署流程信息吗?',function(b){
				if(b){
					common.ajax('./act/ActWorkflow-del.action',{id:id},function(resp){
						if(resp['success']){
							$('#act_div #workflow_deploy_list').datagrid('reload');
							$('#act_div #workflow_def_info_list').datagrid('reload');
						}
						$.messager.alert('提示',resp['msg']);
					});
				}
			});
		},
		myListOpt:function(value,row,index){
			var btn = '';
			btn += '<a href="#" id="" onclick="act_workflow.audit(\''+row['id']+'\',\''+row['businessKey']+'\',\''+row['key']+'\');" title="办理任务">';
			btn += '<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">办理任务</span><span class="l-btn-icon icon-ok">&nbsp;</span></span>';
			btn += '</a>';
			btn += '<a href="#" id="" onclick="act_workflow.viewCurrentPng(\''+row['id']+'\',\''+row['name']+'\');" title="查看当前流程图">';
			btn += '<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">查看当前流程图</span><span class="l-btn-icon icon-search">&nbsp;</span></span>';
			btn += '</a>';
			return btn;
		},
		myHiListOpt:function(value,row,index){
			var btn = '';
			btn += '<a href="#" id="" onclick="act_workflow.audit(\''+row['id']+'\',\''+row['businessKey']+'\',\''+row['key']+'\');" title="办理任务">';
			btn += '<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">详情</span><span class="l-btn-icon icon-ok">&nbsp;</span></span>';
			btn += '</a>';
			return btn;
		},
		// 我的业务办理任务
		audit:function(taskId,businessKey,key){
			var businessId = businessKey.split('.')[1];
			_openHandleBusinessWindow(taskId,businessId,key,businessKey);
		},
		viewCurrentPng:function(taskId,name){
			var opts = {};
			opts.title = '[<font color=red>'+name+'</font>]流程图查看';
			opts.id = 'view_current_png_window';
			opts.href = './page/system/act/currentPng.jsp?id='+taskId;
			opts.width = $(document).width()*0.6+'px';
			opts.height = $(document).height()*0.8+'px';
			common.openDialog(opts);
		},
		// 查看审批记录
		viewComments:function(businessId,title){
			var _dialog = common.openDialog({
				title:title,
				href:'./page/workflow/comment.jsp?id=' + businessId,
				width:$(document).width()*0.7+'px',
				height:$(document).height()*0.7+'px'
			});
		},
		/**
		 * 
		 * config.key 流程key
		 * config.businessId 业务id
		 * config.title 窗口标题
		 * config.width 窗口宽度
		 * config.height 窗口高度
		 * config.status 审批状态
		 * config.formPage 表单地址
		 * config.listId 刷新列表ID
		 * config.deleteCallBack 删除回调函数
		 * config.onLoad 打开窗口后执行的函数
		 * config.formValidate 表单验证回调函数
		 * config.showDeleteBtn true 是否显示删除按钮
		 * */
		handleByBusinessKey:function(config){
			var _defOptions = {
								key:'',
								businessId:'',
								title:'流程审批',
								width:'500px',
								height:'400px',
								taskId:'',
								formPage:'',
								listId:'',
								status:common.SP_ZT.NEW,
								deleteCallBack:null,
								formValidate:null,
								onLoad:null,
								showDeleteBtn:true
							};
			config = $.extend(true,_defOptions,config);
			
			
			if(config['businessId'] == ''){
				$.messager.alert('提示','请输入业务id');
				return false;
			}
			if(config['key'] == ''){
				$.messager.alert('提示','请输入流程Key');
				return false;
			}
			if(config['formPage'] == ''){
				$.messager.alert('提示','请输入formPage');
				return false;
			}
			var buttons = [];
			var button = {};
			var view = false;
			$.ajax({
				url:'./act/ActWorkflow-getOutgoingNamesByBusinessKey.action',
				type:'post',
				async:false,
				dataType:'json',
				data:{businessKey:config['key']+"."+config['businessId']},
				success:function(resp){
					if(resp['success']){
						var lines = resp['data'];
						if(lines.length == 1){
							var line = lines[0];
							if(line['name'] == '提交'){
								view = true;
							}
						}
						for(var i =0 ; i < lines.length ; i++){
							var lineId = lines[i]['id'];
							var lineDocumentation = lines[i]['documentation'];
							lineDocumentation = undefined == lineDocumentation ? '' : lineDocumentation;
							var lineName = lines[i]['name'];
							lineName = lineName == '' ? '默认提交' : lineName;
							button = {};
							button.id = lineId;
							button.text = '<font style="font-size:14px;font-weight:bold;padding-left:15px;padding-right:15px;">' + lineName + '</font>';
							if('' != lineDocumentation){
								button.title =  lineDocumentation;
							}
							button.handler = function(){
								var _this = $(this);
								var _execute = function(){
									$.messager.confirm('提示','确认处理流程[<font color=red>'+config['title']+'</font>]结果为:[<font color=red>'+_this.text()+'</font>]吗?',function(b){
										if(b){
											var comment = '';
											if(_w.find('#comment') && _w.find('#comment').length > 0){
												comment = _w.find('#comment').textbox('getValue');
											}
											_handleBusiness({id:_this.attr('id'),name:_this.text(),comment:comment},config['key'],config['businessId'],function(){
												$(config['listId']).datagrid('load');
												_w.window('destroy');
											});
										}
									});
								}
								if(config['status'] == common.SP_ZT.NEW || config['status'] == common.SP_ZT.BACK || config['status'] == common.SP_ZT.REFUSE){
									if(config['formValidate']){
										var validate = config['formValidate'].call(_w,config['businessId']);
										if(validate){
											_execute();
										}
									}
								}else{
									_execute();
								}
							};
							buttons.push(button);
						}
					}else{
						view = true;
					}
				},
				error:function(e){
					$.messager.alert('提示','网络异常');
				}
			});
			
			$.ajax({
				url:'./act/ActWorkflow-getProcessInstanceVariablesByBusinessId.action',
				type:'post',
				async:false,
				dataType:'json',
				data:{businessKey:config['key']+"."+config['businessId']},
				success:function(resp){
					var data = resp['data'];
					if(data['applyUserId'] == common.emp()['id']){
						// 审批中 可以有拿回按钮
						if(config['status'] == common.SP_ZT.INIT){
							view = true;
							button = {};
							button.text = '拿回';
							button.iconCls = 'fa fa-undo';
							button.handler = function(){
								$.messager.confirm('提示','确定拿回['+config['title']+']吗?',function(b){
									if(b){
										common.ajax('./act/ActWorkflow-backWorkflow.action',{businessKey:config['key']+"."+config['businessId']},function(resp){
											if(resp['success']){
												$(config['listId']).datagrid('load');
												_w.window('destroy');
											}
											$.messager.alert('提示',resp['msg']);
										});
									}
								});
							}
							buttons.push(button);
						}
					}
				},
				error:function(e){
					$.messager.alert('提示','网络异常');
				}
			});
			if(config['showDeleteBtn']){
				if(config['status'] == common.SP_ZT.NEW || config['status'] == common.SP_ZT.BACK){
					button = {};
					button.text = '删除';
					button.iconCls = 'fa fa-trash';
					button.handler = function(){
						$.messager.confirm('提示','确定删除['+config['title']+']吗?',function(b){
							if(b){
								config['deleteCallBack'] && config['deleteCallBack'](config['businessId'],function(){
									$(config['listId']).datagrid('load');
									_w.window('destroy');
								});
							}
						});
					}
					buttons.push(button);
				}
			}
			var opts = {};
			opts.title = config['title'];
			opts.width = config['width'];
			opts.height = config['height'];
			opts.id = 'workflow_handle_window';
			//opts.footer = $(footer);
			opts.buttons = buttons;
			opts.onLoad = config['onLoad'];
			opts.href = './page/system/act/handle.jsp?businessId='+config['businessId']+'&key='+config['key']+'&status='+config['status']+'&view='+view+'&formPage='+config['formPage'];
			var _w = common.openDialog(opts);
			
			return _w;
		}
	
	};
	
}());