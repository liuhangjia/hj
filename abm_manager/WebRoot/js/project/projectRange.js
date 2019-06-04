
var projectRange = (function(){
	
	if(!hasPriv("PROJECT_SHIFT_ADD")){
		$("#range_add").hide();
	}
	if(!hasPriv("PROJECT_SHIFT_DELETE")){
		$("#range_del").hide();
	}
	
	var _modifyWin = function(isAdd,row){
		var title = "";
		if(isAdd){
			title = '<i class="fa fa-pencil"></i> 添加';
		}else{
			title = '<i class="fa fa-pencil"></i> 编辑';
		}
		
		var w = $("<div></div>").css("padding","10px").appendTo("body");
		w.dialog({
			title:title,
			width:'600px',
			height:'517px',
			collapsible:false,
			minimizable:false,
			maximizable:false,
			modal:true,
			href:'./page/project/project_range_modify.jsp',
			buttons:[{
				text:'<i class="fa fa-check"> </i> 保存',
				handler:function(){
					w.find("form").form("submit",{
						url:'./ProjectShift-save.action',
						success:function(data){
							data = JSON.parse(data);
							$.messager.alert("提示",data['msg'],"info");
							if(data['success']){
								w.panel("destroy");
								$('#range_list').datagrid("reload");
							}
						},
						error:function(){
							$.messager.alert("提示","网络错误","info");
						}
					});
				}
			},{
				text:'<i class="fa fa-remove"> </i> 取消',
				handler:function(){	
					w.panel("destroy");
				}
			}],
			onLoad:function(){
				if(!isAdd){
					w.find("#range_id").val(row['id']);
					w.find("#pname").val(row['project_name']);
					w.find("#pid").combobox('setValue',row['project_id']);
					w.find("#range_name").textbox('setValue',row['name']);
					w.find("#range_start_time").textbox('setValue',row['shift_starttime']);
					w.find("#range_start_start").textbox('setValue',row['start_start']);
					w.find("#range_start_end").textbox('setValue',row['start_end']);
					w.find("#range_end_time").textbox('setValue',row['shift_endtime']);
					w.find("#range_end_start").textbox('setValue',row['end_start']);
					w.find("#range_end_end").textbox('setValue',row['end_end']);
					w.find("#range_num").numberbox('setValue',row['num']);
					w.find("#range_range").numberbox('setValue',row['shift_range']);
					w.find("#range_bak").textbox('setValue',row['bak']);
				}
			},
			onClose:function(){
				w.dialog("destroy");
			},
		});
	}
	
	var _handlerDel = function(ids){
		common.ajax('./ProjectShift-del.action',{ids:ids},function(resp){
			if(resp['success']){
				$('#range_list').datagrid('reload');
			}
			$.messager.alert('提示',resp['msg']);
		});
	}
	
	return {
		modifyWin:function(index){
			var row = $('#range_list').datagrid('getRows')[index];
			_modifyWin(false,row);
		},
		add:function(){
			_modifyWin(true);
		},
		delOne:function(id){
			_handlerDel(id);
		},
		del:function(){
			var checks = $('#range_list').datagrid('getChecked');
			if(checks && checks.length>0){
				$.messager.confirm('提示','确认删除吗?',function(b){
					if(b){
						var ids=[];
						for(var i=0;i<checks.length;i++){
							ids.push(checks[i]['id']);
						}
						_handlerDel(ids.join(','));
						
					}
				});
			}else{
				$.messager.alert('提示','请选择项目');
			}
		},
		query:function(){
			var project_name = $("#range_queryform #range_project_name").textbox('getValue');
			var arra = [
				{"property":"project_name","value":project_name}
			];
			var param = {filter:arra};
			$("#range_list").datagrid('reload',param);
		},
		reset:function(){
			$("#range_queryform").form("reset");
			var param = {};
			param['filter']=[];
			$("#range_list").datagrid('reload',param);
		},
		starts:function(value,row,index){
			if(row && row['start_start'] && row['start_end']){
				return row['start_start']+'-'+row['start_end'];
			}
		},
		ends:function(value,row,index){
			if(row && row['end_start'] && row['end_end']){
				return row['end_start']+'-'+row['end_end'];
			}
		},
		listOpts:function(value,row,index){
			var row_id='';
			if(row['id']){
				row_id=row['id'];
			}
			var btn='';
			if(hasPriv("PROJECT_SHIFT_EDIT")){
				btn += '<a href="#" onclick="projectRange.modifyWin('+index+')" style="padding:10px 8px;"><i class="fa fa-pencil"></i> 编辑</a>';
			}
			if(hasPriv("PROJECT_SHIFT_DELETE")){
				btn += '<a href="#" onclick="projectRange.delOne(\''+row_id+'\')" style="padding:10px 8px;"><i class="fa fa-trash"></i> 删除</a>';
			}
			return btn;
		},
		select_xm:function(row){
			$('#range_form #pname').val(row['name']);
		},
		click: function(){
			if($('#range_list').datagrid("getChecked").length>0){
				var candelete = true;
				var checked = $('#range_list').datagrid("getChecked");
				for(i=0;i<checked.length;i++){
					if(checked[i]["is_editable"]=="0")
					{
						candelete = false;
						break;
					}
				}
				if(candelete){
					$("#range_del").linkbutton("enable");
				}else{
					$("#range_del").linkbutton("disable");
				}
				
			}else{
				$("#range_del").linkbutton("disable");
			}
		}
		
	};
}());