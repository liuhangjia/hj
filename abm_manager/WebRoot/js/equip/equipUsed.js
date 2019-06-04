
var equipUsed = (function(){
	
	var zblb_json={};
	common.ajax('./SysBaseCode-listForCombo.action',{type:'ZBLB'},function(data){
		if(data && data.length>0){
			for (var i = 0; i < data.length; i++) {
				zblb_json[data[i]['code']] = data[i];
			}
		}
	});
	
	var _modifyWin = function(){}
	
	var _handlerDel = function(ids,lb){
		common.ajax('./Equip-delete.action',{ids:ids},function(resp){
			if(resp['success']){
				$('#equip_managers_list'+lb).datagrid('reload');
			}
			$.messager.alert('提示',resp['msg']);
		});
	}
	
	return {
		download:function(){
			var lb = $(this).linkbutton('options')['lb']; 
			var grOrQy = $(this).linkbutton('options')['grOrQy']; 
//			console.log(lb);
//			console.log(grOrQy);
			var user_name = $('#zbgl_lyjl_search_user_name_'+lb+grOrQy).textbox('getValue');
			var sfygh = $('#zbgl_lyjl_search_sfygh_'+lb+grOrQy).combobox('getValue');
			var jysj_start = $('#zbgl_lyjl_search_jysj_start_'+lb+grOrQy).datebox('getValue');
			var jysj_end = $('#zbgl_lyjl_search_jysj_end_'+lb+grOrQy).datebox('getValue');
			var ghsj_start = $('#zbgl_lyjl_search_ghsj_start_'+lb+grOrQy).datebox('getValue');
			var ghsj_end = $('#zbgl_lyjl_search_ghsj_end_'+lb+grOrQy).datebox('getValue');
			
			var equip_name = $('#zbgl_lyjl_search_equip_name_'+lb+grOrQy).textbox('getValue');
			var project_name = null;
			if(grOrQy=='qy'){
				project_name = $('#zbgl_lyjl_search_project_name_'+lb+grOrQy).textbox('getValue');
			}
			
			var url = './page/equipment/zbgl_lyjl_export.jsp?';
			url += 'lb='+lb+'&grOrQy='+grOrQy;
			if(user_name){
				url += '&user_name='+encodeURI(encodeURI(user_name)) ;
			}
			if(equip_name){
				url += '&equip_name='+encodeURI(encodeURI(equip_name)) ;
			}
			if(project_name){
				url += '&project_name='+encodeURI(encodeURI(project_name)) ;
			}
//			url += '&user_name='+user_name+'&sfygh='+sfygh;
//			url += '&jysj_start='+jysj_start+'&jysj_end='+jysj_end;
//			url += '&ghsj_start='+ghsj_start+'&ghsj_end='+ghsj_end;
			var arra = [
//					    {property:'user_name',value:user_name},
					    {property:'sfygh',value:sfygh},
					    {property:'jysj_start',value:jysj_start},
					    {property:'jysj_end',value:jysj_end},
					    {property:'ghsj_start',value:ghsj_start},
					    {property:'ghsj_end',value:ghsj_end}
					             ];
			var fn = escape(escape(JSON.stringify(arra)));
			url += '&filter=' +fn ;
//			url += '&filter=' +JSON.stringify(arra) ;
//			console.log(url);
			window.open(url);
			
		},
		selectTab:function(title,index){
			var tab = $(this).tabs('getTab',index);
			var lb = tab.attr('lb');
			var grOrQy = tab.attr('grOrQy');
			tab.panel({
				href:'page/equipment/zbgl_lyjl_tab.jsp?lb='+lb+'&grOrQy='+grOrQy,
				onLoad:function(){
					
				}
			});
		},
		fmt_type:function(value){
			return zblb_json[value]['name'];
		},
		noIdEmpsListOpts:function(value,row,index){},
		editNoIdEmps:function(index,id){},
		deleteNoIdEmps:function(){},
		selectEquips:function(){},
		selectJYR:function(){},
		selectJBR:function(){},
		add:function(){
			var lb = $(this).linkbutton('options')['lb'];
			_modifyWin(null,lb);
		},
		detail:function(index,lb){
			var row = $('#equip_managers_list'+lb).datagrid('getRows')[index];
			_modifyWin(row,lb);
		},
		delBatch:function(){
			var lb = $(this).linkbutton('options')['lb'];
			var code_json = zblb_json[lb];
			var checkeds = $('#equip_managers_list'+lb).datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				$.messager.confirm('提示','确认删除选择的'+code_json['name']+'吗?',function(b){
					if(b){
						var ids = [];
						for(var i = 0 ; i < checkeds.length ; i++){
							ids.push(checkeds[i]['id']);
						}
						_handlerDel(ids.join(','),lb);
					}
				});
			}else{
				$.messager.alert('提示','请选择'+code_json['name']);
			}
		},
		del:function(index,lb){
			var code_json = zblb_json[lb];
			var row = $('#equip_managers_list'+lb).datagrid('getRows')[index];
			$.messager.confirm('提示','确认删除'+code_json['name']+'['+row['name']+']吗?',function(b){
				if(b){
					_handlerDel(row['id'],lb);
				}
			});
		},
		listOpts:function(value,row,index){},
		listOptsForUsed:function(value,row,index){
			var project_id = row['project_id'];
			if(!project_id){
				project_id='';
			}
			var lb = $(this).attr('lb');
			var grOrQy = $(this).attr('grOrQy');
			var btn = '';
			if(!row['return_time']){
				btn += '<a href="#" onclick="equipUsed.guihuan('+index+',\''+project_id+'\',\''+lb+'\',\''+grOrQy+'\')" style="padding:10px 8px;" ><i class="fa fa-pencil"></i> 归还</a>';
			}
			return btn;
		},
		guihuan:function(index,project_id,lb,grOrQy){
			var row = null;
			row = $('#zbgl_lyjl_list_'+lb+grOrQy).datagrid('getRows')[index];
//			param:$.MingwenJSON.encode(row)
			var param={
					'equipUsed.id':row['id'],
					'equipUsed.equip_id':row['equip_id'],
					'equipUsed.quantity':row['quantity'],
					'equipUsed.project_id':project_id,
			};
			$.messager.confirm('提示','确认归还吗?',function(b){
				if(b){
					common.ajax('./Equip-guihuan.action',
							param,
							function(resp){
								if(resp['success']){
									$('#zbgl_lyjl_list_'+lb+grOrQy).datagrid('load');
								}
								$.messager.alert('提示',resp['msg']);
							});
				}
			});
		},
		inWarehouse:function(index){},
		outWarehouse:function(index,lb){},
		equip_select_project:function(row){},
		used_doSearch:function(){
			var grOrQy = $(this).linkbutton('options')['grOrQy'];
			var lb = $(this).linkbutton('options')['lb'];
			var arra = [
			    {property:'user_name',value:$('#zbgl_lyjl_search_user_name_'+lb+grOrQy).textbox('getValue')},
			    {property:'sfygh',value:$('#zbgl_lyjl_search_sfygh_'+lb+grOrQy).combobox('getValue')},
			    {property:'jysj_start',value:$('#zbgl_lyjl_search_jysj_start_'+lb+grOrQy).datebox('getValue')},
			    {property:'jysj_end',value:$('#zbgl_lyjl_search_jysj_end_'+lb+grOrQy).datebox('getValue')},
			    {property:'ghsj_start',value:$('#zbgl_lyjl_search_ghsj_start_'+lb+grOrQy).datebox('getValue')},
			    {property:'ghsj_end',value:$('#zbgl_lyjl_search_ghsj_end_'+lb+grOrQy).datebox('getValue')},
			    {property:'equip_name',value:$('#zbgl_lyjl_search_equip_name_'+lb+grOrQy).textbox('getValue')}
			             ];
			if(grOrQy=='qy'){
				arra.push({property:'project_name',value:$('#zbgl_lyjl_search_project_name_'+lb+grOrQy).textbox('getValue')});
			}
			var param = {filter:arra};
			$('#zbgl_lyjl_list_'+lb+grOrQy).datagrid('reload',param);
		},
		used_doReset:function(){
			var grOrQy = $(this).linkbutton('options')['grOrQy'];
			var lb = $(this).linkbutton('options')['lb'];
			$("#zbgl_lyjl_queryform_"+lb+grOrQy).form("reset");
			var param = {filter:[]};
		    $('#zbgl_lyjl_list_'+lb+grOrQy).datagrid('reload',param);
		},
		query:function(){},
		reset:function(){},
		togglePlsc:function(){
			var lb = $(this).datagrid('options')['lb'];
			if($('#equip_managers_list'+lb).datagrid("getChecked").length>0){
				$("#managers_content"+lb+" #equip_del").linkbutton("enable");
			}else{
				$("#managers_content"+lb+" #equip_del").linkbutton("disable");
			}
		}
	};
}());