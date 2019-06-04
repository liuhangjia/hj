
var user_intention = (function(){
	
	return {
		callPhone:function(id,index,list_id){
			var row = null;
			if(list_id){
				row = $('#'+list_id).datagrid('getRows')[index];
			}else{
				row = $('#pending_list').datagrid('getRows')[index];
			}
			var buttons = [];
			if(row['status']=='0'){
				buttons.push({
	         		text:'标记为已处理',
	         		iconCls:'fa fa-check',
	         		handler:function(){
	         			var back_content = _dialog.find('#user_intention_back_content').textbox('getValue');
	         			var req_detail = row['req_detail'];
	         			req_detail['back_content'] = back_content;
	         			var param = {
	         					'srm.req_detail':JSON.stringify(req_detail),
	         					'srm.status':'1',
	         					'srm.id':row['id']
	         			};
	         			common.ajax('./ServiceRequest-handleUserIntention.action',param,function(resp){
	         				if(resp['success']){
	         					_dialog.window('destroy');
	         					$('#pending_list').datagrid('reload');
	         				}
	         				$.messager.alert('提示',resp['msg']);
	         			});
	         		}
	         	});
				buttons.push({
	         		text:'暂存',
	         		iconCls:'fa fa-check',
	         		handler:function(){
	         			var back_content = _dialog.find('#user_intention_back_content').textbox('getValue');
	         			var req_detail = row['req_detail'];
	         			req_detail['back_content'] = back_content;
	         			var param = {
	         					'srm.req_detail':JSON.stringify(req_detail),
	         					'srm.id':row['id']
	         			};
	         			common.ajax('./ServiceRequest-handleUserIntention.action',param,function(resp){
	         				if(resp['success']){
	         					$('#pending_list').datagrid('reload');
	         					_dialog.window('destroy');
	         				}
	         				$.messager.alert('提示',resp['msg']);
	         			});
	         		}
	         	});
			}
			var _dialog = common.openDialog({
				id:'user_intention_detail_win',
				title:'意向详情',
				width:'550px',
				height:'510px',
				href:"./page/service/user_intention_detail.jsp",
				buttons:buttons,
				onLoad:function(){
					if(row){
//						var test = '时间短发很精神的封建士大夫京哈开发计划爱撒娇的卡是觉得喀什觉得喀什假大空老师和大陆空军的绿卡就打开拉萨建档立卡'
//							+ '手机电话费骄傲和道路喀什灯笼裤洒家打开安教授的课垃圾的可拉斯基打卡机吉安市打开拉萨建档立卡建档立卡今安徽省得利卡就对啦安徽的可拉斯基'
//							+ '今安徽打款哈十六点埃里克啥的卡机的啦按考生的绿卡就是的绿卡卢卡斯的卡拉机读卡卢卡斯德拉克斯的利卡河上的拉开见识到了卡利卡河上的绿卡好的';
//						_dialog.find('#user_intention_detail_form').form('load',row['req_detail']);
						_dialog.find('#user_intention_type').html(common.codeToName('FWQQLB',row['req_detail']['type']));
						_dialog.find('#user_intention_phone').html(row['req_detail']['phone']);
						_dialog.find('#user_intention_email').html(row['req_detail']['email']);
						_dialog.find('#user_intention_content').html(row['req_detail']['content']);
						_dialog.find('#user_intention_back_content').textbox('setValue',row['req_detail']['back_content']);
						if(row['status']=='1'){
							_dialog.find('#user_intention_back_content').textbox('disable');
						}
					}
				}
			});
		},
		opt_btn:function(value,row,index){
			var btn = '';
			btn += '<a href="#" onclick="pending_doAuditing('+index+')" style="padding:10px 8px;" ><i class="fa fa-gavel"></i> 审核</a>';
			btn += '<a href="#" onclick="pending_look_emp(\''+row['req_id']+'\')" style="padding:10px 8px;" ><i class="fa fa-file-text"></i> 查看</a>';
			return btn;
		},
		selectTab:function(title,index){
			var tab = $(this).tabs('getTab',index);
			var lb = tab.attr('lb');
			tab.panel({
				href:'page/service/user_intention_tab.jsp?lb='+lb,
				onLoad:function(){
					
				}
			});
		}
	};
	
}());
