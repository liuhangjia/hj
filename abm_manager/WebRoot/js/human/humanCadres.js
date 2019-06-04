// 人力服务-人才储备
var humanCadres = (function(){
	var _divId = '#cadres_div';
	var _listId = _divId + ' #cadres_list';
	
	var _handlerDel = function(ids){
		common.ajax('./HrPool-del.action',{ids:ids},function(resp){
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
			id:'cadres_add_win',
			width:"540px",
			height:"450px",
			collapsible:false,
			minimizable:false,
			maximizable:false,
			modal:true,
			href:"./page/human/human_cadres_add.jsp",
			buttons:[{
				//save
				text:'<i class="fa fa-check"> </i> 保存',
				handler:function(){
					var data = {};
					//企业ID
					data['hrPoolModel.enterprise_id']=$('#cadres_addform #qymc').textbox('getValue');
					//ID
					data['hrPoolModel.id']=$("#cadres_addform #id").val();
					//姓名
					data['hrPoolModel.emp_name']=$("#cadres_addform #xm").textbox('getValue');
					//部门
					data['hrPoolModel.depart_id']=$("#cadres_addform #bm").combotree('getValue');
					data['hrPoolModel.depart_name']=$("#cadres_addform #human_cadres_depart_name").val();
					//职务
					data['hrPoolModel.position']=$("#cadres_addform #zw").textbox('getValue');
					//备选时间
					data['hrPoolModel.in_time']=$("#cadres_addform #bxsj").textbox('getValue');
					//主管领导
					data['hrPoolModel.leader']=$("#cadres_addform #zgld").textbox('getValue');
					//指定说明
					data['hrPoolModel.bak']=$("#cadres_addform #bak").textbox('getValue');
					
					$.ajax({
						url:'./HrPool-modify.action',
						type:'post',
						data:data,
						dataType:'json',
						async:false,
						success:function(data){
							$.messager.alert("提示",data['msg']);
							if(data['success']){
								$("#cadres_add_win").panel("destroy");
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
					$("#cadres_add_win").panel("destroy");
				}
			}],
			onColse:function(){
				$(this).dialog("destory");
			},
			onLoad:function(){
				if(!isAdd){
					$('#cadres_addform #bm').combotree('reload','./Depart-listDept.action?enterpriseId='+row['enterprise_id']);
					//企业ID
					$('#cadres_addform #qymc').textbox('setValue',row['enterprise_id']);
					//ID
					$("#cadres_addform #id").val(row['id']);
					//姓名
					$("#cadres_addform #xm").textbox('setValue',row['emp_name']);
					//部门
					$("#cadres_addform #bm").combotree('setValue',row['depart_id']);
					$("#cadres_addform #human_cadres_depart_name").val(row['depart_name']);
					//职务
					$("#cadres_addform #zw").textbox('setValue',row['position']);
					//备选时间
					$("#cadres_addform #bxsj").textbox('setValue',row['in_time']);
					//主管领导
					$("#cadres_addform #zgld").textbox('setValue',row['leader']);
					//指定说明
					$("#cadres_addform #bak").textbox('setValue',row['bak']);
					
				}
			}
		});
	};
	
	return {
		select_bm:function(row){
			$('#human_cadres_depart_name').val(row['name']);
		},
		select_qy:function(row){
			$('#bm').combotree('clear');
			$('#bm').combotree('reload','./Depart-listDept.action?enterpriseId='+row['id']);
		},
		cadres_doAdd:function(){
			_modifyWin(true);
		},
		cadres_doDel:function(){
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
		cadres_doEdit:function(index){
			var row = $(_listId).datagrid("getRows")[index];
			_modifyWin(false,row);
		},
		cadres_doDelOne:function(index){
			var row = $(_listId).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除吗?',function(b){
				if(b){
					_handlerDel(row['id']);
				};
			});
		},
		cadres_doExport:function(){
			$.messager.alert('提示','开发中');
		},
		cadres_doSearch:function(){
			var arra = [
	    		{"property":"enterprise_id","value":$('#cadres_queryform #enterprise_id').textbox("getValue")},
	    		{"property":"name","value":$('#cadres_queryform #name').textbox("getValue")},
	    		{"property":"cadre1","value":$('#cadres_queryform #start').textbox("getValue")},
	    		{"property":"cadre2","value":$('#cadres_queryform #end').textbox("getValue")}
	    	];
	    	var param = {};
	    	param["filter"]=arra;
	    	$(_listId).datagrid('reload',param);
		},
		cadres_doReset:function(){
			$("#cadres_queryform").form("reset");
			var param = {};
		    param["filter"]=[];
		    $(_listId).datagrid('reload',param);
		},
		cadres_doHandle:function(value,row,index){
			var btn = '';
			if(hasPriv("HR_POOL_EDIT")){
				btn += '<a href="#" onclick="humanCadres.cadres_doEdit('+index+')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 编辑</a>';
			}
			if(hasPriv("HR_POOL_DELETE")){
				btn += '<a href="#" onclick="humanCadres.cadres_doDelOne('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			return btn;
		},
		togglePlsc:function(){
			if($("#cadres_list").datagrid("getChecked").length>0){
				$("#cadres_div #cadres_del").linkbutton("enable");
			}else{
				$("#cadres_div #cadres_del").linkbutton("disable");
			}
		}
	};
}());