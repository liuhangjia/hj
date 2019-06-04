// 人力服务-奖惩
var humanReward = (function(){
	var _divId = '#reward_div';
	var _listId = _divId + ' #reward_list';
	
	var _handlerDel = function(ids){
		common.ajax('./HumanAward-del.action',{ids:ids},function(resp){
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
			id:'reward_add_win',
			width:"540px",
			height:"570px",
			collapsible:false,
			minimizable:false,
			maximizable:false,
			modal:true,
			href:"./page/human/human_reward_add.jsp",
			buttons:[{
				//save
				text:'<i class="fa fa-check"> </i> 保存',
				handler:function(){
					var data = {};
					//企业ID
					data['awardPunishModel.enterprise_id']=$('#reward_addform #qymc').textbox('getValue');
					//项目ID
					data['awardPunishModel.project_id']=$('#reward_addform #xmmc').textbox('getValue');
					//ID
					data['awardPunishModel.id']=$("#reward_addform #id").val();
					//姓名
					data['awardPunishModel.name']=$("#reward_addform #xm").textbox('getValue');
					//部门
					data['awardPunishModel.depart_id']=$("#reward_addform #bm").combotree('getValue');
					data['awardPunishModel.depart_name']=$("#reward_addform #enterpriseEmployee_depart_name").val();
					//职务
					data['awardPunishModel.position']=$("#reward_addform #zw").textbox('getValue');
					//类别
					data['awardPunishModel.type']=$("#reward_addform #lb").textbox('getValue');
					//时间
					data['awardPunishModel.ap_time']=$("#reward_addform #sj").textbox('getValue');
					//原因
					data['awardPunishModel.reason']=$("#reward_addform #yy").textbox('getValue');
					//奖惩内容
					data['awardPunishModel.content']=$("#reward_addform #jcnr").textbox('getValue');
					//备注
					data['awardPunishModel.bak']=$("#reward_addform #bak").textbox('getValue');
					
					$.ajax({
						url:'./HumanAward-modify.action',
						type:'post',
						data:data,
						dataType:'json',
						async:false,
						success:function(data){
							$.messager.alert("提示",data['msg']);
							if(data['success']){
								$("#reward_add_win").panel("destroy");
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
					$("#reward_add_win").panel("destroy");
				}
			}],
			onColse:function(){
				$(this).dialog("destory");
			},
			onLoad:function(){
				if(!isAdd){
					$('#reward_addform #bm').combotree('reload','./Depart-listDept.action?enterpriseId='+row['enterprise_id']);
					//企业ID
					$('#reward_addform #qymc').combobox('setValue',row['enterprise_id']);
					//项目ID
					$('#reward_addform #xmmc').combobox('setValue',row['project_id']);
					//ID
					$("#reward_addform #id").val(row['id']);
					//姓名
					$("#reward_addform #xm").textbox('setValue',row['name']);
					//部门
					$("#reward_addform #bm").combotree('setValue',row['depart_id']);
					$("#reward_addform #enterpriseEmployee_depart_name").val(row['depart_name']);
					//职务
					$("#reward_addform #zw").textbox('setValue',row['position']);
					//类别
					$("#reward_addform #lb").combobox('setValue',row['type']);
					//时间
					$("#reward_addform #sj").textbox('setValue',row['ap_time']);
					//原因
					$("#reward_addform #yy").textbox('setValue',row['reason']);
					//奖惩内容
					$("#reward_addform #jcnr").textbox('setValue',row['content']);
					//备注
					$("#reward_addform #bak").textbox('setValue',row['bak']);
					
				}
			}
		});
	};
	
	return {
		select_bm:function(row){
			$('#enterpriseEmployee_depart_name').val(row['name']);
		},
		select_qy:function(row){
			$('#bm').combotree('clear');
			$('#bm').combotree('reload','./Depart-listDept.action?enterpriseId='+row['id']);
		},
		reward_doAdd:function(){
			_modifyWin(true);
		},
		reward_doDel:function(){
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
		reward_doEdit:function(index){
			var row = $(_listId).datagrid("getRows")[index];
			_modifyWin(false,row);
		},
		reward_doDelOne:function(index){
			var row = $(_listId).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除吗?',function(b){
				if(b){
					_handlerDel(row['id']);
				};
			});
		},
		reward_doExport:function(){
			$.messager.alert('提示','开发中');
		},
		reward_doCheck:function(){
			$.messager.alert('提示','开发中');
		},
		reward_doSearch:function(){
			var arra = [
	    		{"property":"enterprise_id","value":$('#reward_queryform #enterprise_id').textbox("getValue")},
	    		{"property":"project_id","value":$('#reward_queryform #project_id').textbox("getValue")},
	    		{"property":"name","value":$('#reward_queryform #name').textbox("getValue")},
	    		{"property":"type","value":$('#reward_queryform #type').textbox("getValue")},
	    		{"property":"starttime","value":$('#reward_queryform #starttime').textbox("getValue")},
	    		{"property":"endtime","value":$('#reward_queryform #endtime').textbox("getValue")}
	    	];
	    	var param = {};
	    	param["filter"]=arra;
	    	$(_listId).datagrid('reload',param);
		},
		reward_doReset:function(){
			$("#reward_queryform").form("reset");
			var param = {};
		    param["filter"]=[];
		    $(_listId).datagrid('reload',param);
		},
		reward_doHandle:function(value,row,index){
			var btn = '';
			if(hasPriv("DISMISS_MANAGER_EDIT")){
				btn += '<a href="#" onclick="humanReward.reward_doEdit('+index+')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 编辑</a>';
			}
			if(hasPriv("DISMISS_MANAGER_DELETE")){
				btn += '<a href="#" onclick="humanReward.reward_doDelOne('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			return btn;
		},
		togglePlsc:function(){
			if($("#reward_list").datagrid("getChecked").length>0){
				$("#reward_div #reward_del").linkbutton("enable");
			}else{
				$("#reward_div #reward_del").linkbutton("disable");
			}
		}
	};
}());