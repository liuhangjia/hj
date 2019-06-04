// 人力服务-任免
var humanPatronage = (function(){
	var _divId = '#patronage_div';
	var _listId = _divId + ' #patronage_list';
	
	var _handlerDel = function(ids){
		common.ajax('./Patronage-del.action',{ids:ids},function(resp){
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
			id:'patronage_add_win',
			width:"540px",
			height:"360px",
			collapsible:false,
			minimizable:false,
			maximizable:false,
			modal:true,
			href:"./page/human/human_patronage_add.jsp",
			buttons:[{
				//save
				text:'<i class="fa fa-check"> </i> 保存',
				handler:function(){
					var data = {};
					//企业ID
					data['patronageModel.enterprise_id']=$('#patronage_addform #qymc').textbox('getValue');
					//ID
					data['patronageModel.id']=$("#patronage_addform #id").val();
					//姓名
					data['patronageModel.name']=$("#patronage_addform #xm").textbox('getValue');
					//部门
					data['patronageModel.depart_id']=$("#patronage_addform #bm").combotree('getValue');
					data['patronageModel.depart_name']=$("#patronage_addform #enterpriseEmployee_depart_name").val();
					//职务
					data['patronageModel.position']=$("#patronage_addform #zw").textbox('getValue');
					//批号
					data['patronageModel.sn']=$("#patronage_addform #rmph").textbox('getValue');
					//时间
					data['patronageModel.appoint_time']=$("#patronage_addform #sj").textbox('getValue');
					//说明
					data['patronageModel.bak']=$("#patronage_addform #bak").textbox('getValue');
					
					$.ajax({
						url:'./Patronage-modify.action',
						type:'post',
						data:data,
						dataType:'json',
						async:false,
						success:function(data){
							$.messager.alert("提示",data['msg']);
							if(data['success']){
								w.window("destroy");
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
					w.window("destroy");
				}
			}],
			onColse:function(){
				w.window("destroy");
			},
			onLoad:function(){
				if(!isAdd){
					$('#patronage_addform #bm').combotree('reload','./Depart-listDept.action?enterpriseId='+row['enterprise_id']);
					//企业ID
					$('#patronage_addform #qymc').textbox('setValue',row['enterprise_id']);
					//ID
					$("#patronage_addform #id").val(row['id']);
					//姓名
					$("#patronage_addform #xm").textbox('setValue',row['name']);
					//部门
					$("#patronage_addform #bm").combotree('setValue',row['depart_id']);
					$("#patronage_addform #enterpriseEmployee_depart_name").val(row['depart_name']);
					//职务
					$("#patronage_addform #zw").textbox('setValue',row['position']);
					//批号
					$("#patronage_addform #rmph").textbox('setValue',row['sn']);
					//时间
					$("#patronage_addform #sj").textbox('setValue',row['appoint_time'].split(" ")[0]);
					//说明
					$("#patronage_addform #bak").textbox('setValue',row['bak']);
					
				}
			}
		});
	};
	
	return {
		select_bm:function(row){
			$('#enterpriseEmployee_depart_name').val(row['name']);
		},
		select_qy:function(row){
			$('#patronage_addform #bm').combotree('clear');
			$('#patronage_addform #bm').combotree('reload','./Depart-listDept.action?enterpriseId='+row['id']);
		},
		patronage_doAdd:function(){
			_modifyWin(true);
		},
		patronage_doDel:function(){
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
		patronage_doEdit:function(index){
			var row = $(_listId).datagrid("getRows")[index];
			_modifyWin(false,row);
		},
		patronage_doDelOne:function(index){
			var row = $(_listId).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除吗?',function(b){
				if(b){
					_handlerDel(row['id']);
				};
			});
		},
		patronage_doExport:function(){
			$.messager.alert('提示','开发中');
		},
		patronage_doCheck:function(){
			$.messager.alert('提示','开发中');
		},
		patronage_doSearch:function(){
			var arra = [
	    		{"property":"enterprise_id","value":$('#patronage_queryform #leave_enterprise_name').textbox("getValue")},
	    		{"property":"name","value":$('#patronage_queryform #name').textbox("getValue")},
	    		{"property":"sn","value":$('#patronage_queryform #sn').textbox("getValue")},
	    		{"property":"appoint1","value":$('#patronage_queryform #starttime').textbox("getValue")},
	    		{"property":"appoint2","value":$('#patronage_queryform #endtime').textbox("getValue")}
	    	];
	    	var param = {};
	    	param["filter"]=arra;
	    	$(_listId).datagrid('reload',param);
		},
		patronage_doReset:function(){
			$("#patronage_queryform").form("reset");
			var param = {};
		    param["filter"]=[];
		    $(_listId).datagrid('reload',param);
		},
		patronage_doHandle:function(value,row,index){
			var btn = '';
			if(hasPriv("APPOINT_MANAGER_EDIT")){
				btn += '<a href="#" onclick="humanPatronage.patronage_doEdit('+index+')" style="padding:10px; 8px" ><i class="fa fa-pencil"></i> 编辑</a>';
			}
			if(hasPriv("APPOINT_MANAGER_DELETE")){
				btn += '<a href="#" onclick="humanPatronage.patronage_doDelOne('+index+')" style="padding:10px 8px;" ><i class="fa fa-trash"></i> 删除</a>';
			}
			return btn;
		},
		patronage_doImport:function(){
			var w = $("<div></div>").css("padding","10px").appendTo("body");
			w.dialog({
				title:"<i class='fa fa-sign-in'> </i> 导入",
				width:"540px",
				height:"330px",
				collapsible:false,
				minimizable:false,
				maximizable:false,
				modal:true,
				href:"page/human/human_patronage_import.jsp",
				buttons: [{
							text:'<i class="fa fa-check"> </i> 保存',
							handler:function(){
								var importUrl = './Patronage-importData.action';
								$('#human_patronage_import').form('submit',{
									url:importUrl,
									success:function(resp){
										resp = JSON.parse(resp);
										if(resp['success']){
											$.messager.alert('提示',resp['msg']);
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
		patronage_doExport:function(){
			var enterprise_id = $('#patronage_queryform #leave_enterprise_name').textbox("getValue");
			var name = $('#patronage_queryform #name').textbox("getValue");
			var sn = $('#patronage_queryform #sn').textbox("getValue");
			var stime1 = $('#patronage_queryform #starttime').textbox("getValue");
			var stime2 = $('#patronage_queryform #endtime').textbox("getValue");
			var url = "./page/human/human_patronage_export.jsp?";
			url += "enterprise_id="+enterprise_id;
			url += "&name="+name;
			url += "&sn="+sn;
			url += "&stime1="+stime1;
			url += "&stime2="+stime2;
			$(this).attr("href",url);
		},
		togglePlsc:function(){
			if($("#patronage_list").datagrid("getChecked").length>0){
				$("#patronage_div #patronage_del").linkbutton("enable");
			}else{
				$("#patronage_div #patronage_del").linkbutton("disable");
			}
		}
	};
}());