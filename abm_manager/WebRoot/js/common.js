//'use strict';
var common = (function(){
	var USER_MENU = "#";
	var currentEmp = {};
	var _workflowType = {};
	
	
	// 安保人员请假
	_workflowType['LEAVE_EMP'] = {
			key:'LEAVE_EMP',
			formPage:'/page/human/human_leave_add.jsp',
			showDeleteBtn:false,
			deleteCallBack:function(businessId,callback){
				callback && callback();
			},
			formValidate:function(_ctx){
				return true;
			}
	};
	
	_workflowType['QUIT_EMP'] = {
			key:'QUIT_EMP',
			formPage:'/page/human/human_quit_add.jsp',
	        deleteCallBack:function(businessId,callback){
	        	callback && callback();
	        },
	        formValidate:function(_ctx){
	            var _win = _ctx;
	            
	            return true;
	        }

	};
	
	/** 
	 * ajax
	 * */
	var ajax = function(url,params,suc){
		$.ajax({
			url:url,
			type:'post',
			dataType:'json',
			data:params,
			success:function(resp){
				suc && suc(resp);
			},
			error:function(e){
				$.messager.alert('提示','网络异常');
			}
		});
	}
	/**
	 * 打开窗口
	 * @param config
	 * */
	var openWindow = function(config){
		var defConf = {title:'',id:'',width:'500px',height:'400px',resizable:true,model:true,href:'',onLoad:function(){},method:'post',border:false,
				footer:null,
				onClose:function(){
					$(this).window('destroy');
				},minimizable:false,maximizable:true,collapsible:false,onOpen:function(){}};
		config = $.extend(true,defConf,config);
		var w = $("<div></div>").css("padding","10px").appendTo("body");
		w.window({
			title:config['title'],
			id:config['id'],
			width:config['width'],
			height:config['height'],
			resizable:config['resizable'],
			modal:config['model'],
			href:config['href'],
			method:config['method'],
			border:config['border'],
			footer:config['footer'],
			onClose:config['onClose'],
			onLoad:config['onLoad'],
			minimizable:config['minimizable'],
			maximizable:config['maximizable'],
			collapsible:config['collapsible'],
			onOpen:config['onOpen']
		});
		return w;
	}
	/**
	 * @param tab_id
	 * @param hrefPage 连接地址
	 * @param tab_text tab上显示名字
	 * */
	var openTab = function(tab_id,hrefPage,tab_text,onLoad){
		if(hrefPage){
			if(hrefPage.indexOf('page') == -1 && hrefPage.indexOf('action') == -1){
				hrefPage = 'page/' + hrefPage;
			}
		}
		if(tab_text.lastIndexOf('(') > -1){
			tab_text = tab_text.substring(0,tab_text.lastIndexOf('('));
		}
		var _id = 'tab_' + tab_id;
		var _operator = $('#operator');
		if($('#'+_id).length==0){
			_operator.tabs('add',{
				id:_id,
				title:tab_text,
				closable:true,
				onLoad:function(){
					onLoad && onLoad.call(this);
				},
				//content:'<iframe src="./' + hrefPage + '" frameborder="0" width="100%" height="100%" marginwidth="0px" marginheight="0px" scrolling="no" style="display:block"></iframe>'
				href:hrefPage
			});
			var length = _operator.tabs('tabs').length;
			if(length > 8){
				_operator.tabs('close',1);
			}
			
		}else{
			var _tabs = _operator.tabs('tabs');
			for(var i = 0 ; i < _tabs.length ; i++){
				if(_id == _tabs[i].attr('id')){
					_operator.tabs('select',i);
				}
			}
		}
	}
	/**
	 * 菜单栏点击
	 * */
	var openPlugin = function(node){
		var node_id = node.id;
		if(node_id){
			if(node_id.indexOf('xxgl_wdxxgl') > -1){
				common.ajax('./Employee-currentEmp.action',{},function(data){
					if(data){
						if('0' == data['lb']){
							ryxx.detail_current(null,data);
						}else{
							ryxx.detail_current('hbrc',data);
						}
					}
				});
			}else{
				var tab_id = node_id;
				tab_id = tab_id.replace(new RegExp(/\./g),'_');
				tab_id = tab_id.replace(new RegExp(/\//g),'_');
				tab_id = tab_id.replace(new RegExp(/\?/g),'_');
				tab_id = tab_id.replace(new RegExp(/\&/g),'_');
				tab_id = tab_id.replace(new RegExp(/\=/g),'_');
//				tab_id = node_id.replace('.','_');
//				tab_id = node_id.replace('/','_');
				openTab(tab_id,node_id,node.text,node.onLoad);
			}
		}
	}
	/**
	 * 格式化性别
	 * */
	var fmt_xb = function(value){
		if('M' == value){
			return '男';
		}else if('F' == value){
			return '女';
		}
		return '';
	}
	/**
	 * 格式化密级
	 * */
	var fmt_mj = function(value){
		if('1' == value){
			return '升密';
		}else if('0' == value){
			return '降密';
		}
		return '';
	}
	
	/**
	 * 初始化当前登录领导干部信息
	 * */
	var initEmp = function(){
		ajax('./Employee-currentEmp.action',{},function(resp){
			currentEmp = resp;
		});
	}
	/**
	 * 获取当前登录者信息
	 * */
	var emp = function(){
		return currentEmp;
	}
	
	var isAdmin=function(){
		return currentEmp.is_admin;
	}
	
	var isGbgly=function(){
		return currentEmp.is_gb_gly;
	}
	
	var isGbjby=function(){
		return currentEmp.is_gb_jby;
	}
	
	var isXcgly=function(){
		return currentEmp.is_xc_gly;
	}
	
	var isZgjby=function(){
		return currentEmp.is_zg_jby;
	}

	
	/**
	 * 刷新系统左侧菜单 
	 */ 
	var refreshCd = function(){
		if(USER_MENU!='#'){
			var panels = $('#menus').accordion('panels');
			if(panels && panels.length > 0){
				var i = 0 , panel_length = panels.length,remove_panel = [];
				for(i=0;i<panel_length;i++){
					var panel = panels[i],panel_id = panel.attr('id');
					if(panel_id && '' != panel_id){
						if(!hasPriv(panel_id)){
							var tree = $(panel.find('.tree'));
							var roots = tree.tree('getRoots');
							while(roots.length > 0){
								tree.tree('remove',roots[0].target);
							}
							remove_panel.push(panel.parent().find('.panel-title').html());
						}else{
							var nodes = panel.find('i');
							var j , node_length = nodes.length;
							for(j = 0; j < node_length ; j++){
								var node = $(nodes[j]);
								var id = node.attr('id');
								if(id && '' != id){
									if(!hasPriv(id)){
										node.parent().parent().parent().remove();
									}
								}else{
									node.parent().parent().parent().remove();
								}
							}
						}
					}
				}
				if(remove_panel.length > 0){
					var rm_length = remove_panel.length;
					for(i=0;i<rm_length;i++){
						$('#menus').accordion('remove',remove_panel[i]);
					}
				}
			}
		}
	}
	
	var filter = function(menuId){
		if(!hasPriv(menuId)){
			$("#"+menuId).remove();
		}
	}
	
	var hasPrivList = function(menuCodes){
		if(isAdmin()){
			return true;
		}
		if(!menuCodes || menuCodes.length==0){
			return false;
		}
		var menuCodes_str='';
		for (var i = 0; i < menuCodes.length; i++) {
			menuCodes_str+=','+menuCodes[i];
		}
		var qxList=currentEmp.qx;
		for(var k in qxList){
			if(menuCodes_str.indexOf(qxList[k]['bm'])>0){
				return true;
			}
		}
		return false;
	}
	
	var hasPriv = function(menuCode){
		if(isAdmin()){
			return true;
		}
		var qxList=currentEmp.qx;
		for(var k in qxList){
			if(qxList[k]['bm']==menuCode){
				return true;
			}
		}
		return false;
	}
	
	var getUserMenu = function(){
		if(USER_MENU=='#'){
			$.ajax({
				url:"./Login-getQxList.action",
				type:"post",
				dataType:"json",
				async:false,
				success:function(code){
					USER_MENU = code;
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					/*alert(XMLHttpRequest.status);
					 alert(XMLHttpRequest.readyState);
					 alert(textStatus);*/
					 $.messager.alert("提示","获取权限失败","warning",function(){
						 window.location.href='./Login-logout.action';
					 });
				}
			});
		}

	}
	
	
	/**
	 * 刷新列表操作权限
	 * datagrid或treegrid    onLoadSuccess: refreshQx
	 * 
	 * 示例代码：
	 * <table id="" class="mwsmartui-datagrid" data-options="
	 * 			...
	 *			url:'',
	 *			method:'get',
	 *			onLoadSuccess:refreshQx
	 *			...
	 */
	var refreshQx = function(){
		$("a[href='#']").each(function(){
			var aId = $(this).attr("id");
			if(aId!=undefined && aId!=''){
				filter(aId);
			}
		});
	}
	
	var check_review = function(review){
		if(review){
			try{
				var zt = review['zt'];
				if(1==zt || 3==zt){
					//if(now >= _kssj && now <= _jssj){
						return true;
					//}
				}else{
					return false;
				}
			}catch(e){
				return false;
			}
			
		}
		return false;
	}
	
	var getCurrentYearMonth=function(){
		var date = new Date();
		var month=date.getMonth()+1;
		if(month>9){
			month=''+month;
		}else{
			month='0'+month;
		}
		return date.getFullYear()+'-'+month;
	}
	
	return {
			hasPriv:hasPriv,
			isAdmin:isAdmin,
			getCurrentYearMonth:getCurrentYearMonth,
			openPlugin:openPlugin,
			openWindow:openWindow,
			openTab:openTab,
			openDialog:function(config){
				var defConf = {iconCls:'',title:'',id:'',width:'500px',height:'400px',resizable:true,model:true,href:'',onLoad:function(){},method:'post',border:false,
						toolbar:null,
						buttons:[],
						buttonAlign:'right',
						footer:null,
						onClose:function(){
							$(this).window('destroy');
						},minimizable:false,maximizable:true,collapsible:false,onOpen:function(){}};
				config = $.extend(true,defConf,config);
				if(null == config['buttons'] || config['buttons'].length == 0){
					config['buttons'] = [
					                     	{
					                     		text:'关闭',
					                     		iconCls:'fa fa-remove',
					                     		handler:function(){
					                     			w.window('destroy');
					                     		}
					                     	}
					                     ];
				}else{
					var button = {};
					button.text = '关闭';
					button.iconCls = 'fa fa-remove';
					button.handler = function(){
						w.window('destroy');
					}
					config['buttons'].push(button);
				}
				var w = $("<div></div>").css("padding","2px").appendTo("body");
				w.dialog({
					iconCls:config['iconCls'],
					title:config['title'],
					id:config['id'],
					href:config['href'],
					width:config['width'],
					height:config['height'],
					resizable:config['resizable'],
					modal:config['model'],
					method:config['method'],
					border:config['border'],
					minimizable:config['minimizable'],
					maximizable:config['maximizable'],
					collapsible:config['collapsible'],
					toolbar:config['toolbar'],
					buttons:config['buttons'],
					buttonAlign:config['buttonAlign'],
					footer:config['footer'],
					onLoad:config['onLoad'],
					onClose:config['onClose'],
					onOpen:config['onOpen']
				});
				return w;
			},
			ajax:ajax,
			fmt_xb:fmt_xb,
			initEmp:initEmp,
			emp:emp,
			refreshCd:refreshCd,
			refreshQx:refreshQx,
			getUserMenu:getUserMenu,
			check_review:check_review,
			fmt_num:function(num){
				var _num = 0;
				if($.isNumeric(num)){
					_num = parseFloat(num);
					_num = Math.round(_num*100)/100;
					return _num;
				}else{
					return num;
				}
			},
			fmt_num0:function(num){
				var _num = 0;
				if($.isNumeric(num)){
					_num = parseFloat(num);
					_num = Math.round(_num*100)/100;
				}
				return _num;
			},
			toDecimal:function (x) {
			   var f = parseFloat(x); 
			   if (isNaN(f)) { 
			    return 0; 
			   } 
			   f = Math.round(x*100)/100; 
			   return f; 
			},
			fmt_date:function(date){
				if(date){
					if(date.length >= 16){
						return date.substring(0,16);
					}else{
						return date;
					}
				}else{
					return '';
				}
			},
			fmt_date10:function(date){
				if(date){
					if(date.length >= 10){
						return date.substring(0,10);
					}else{
						return date;
					}
				}else{
					return '';
				}
			},
			fmt_date19:function(date){
				if(date){
					if(date.length >= 19){
						return date.substring(0,19);
					}else{
						return date;
					}
				}else{
					return '';
				}
			},
			download:function(fileName,fn){
				fileName = fileName || '';
				if(''!=fileName){
					fn = fn || '';
					if('' != fn){
						fn = fn.substring(0,fn.lastIndexOf('.'))
						fn = escape(escape(fn));
					}
					window.open('./FileDownload.action?fileName='+fileName+'&fn='+fn);
				}
			},
			menuClick:function(){
				var hrefPage = $(this).attr('id');
				var tabText = $(this).text();
				var tabIconCls = $(this).linkbutton('options')['iconCls'];
				var tabId = hrefPage;
				tabId = tabId.replace(new RegExp(/\./g),'_');
				tabId = tabId.replace(new RegExp(/\//g),'_');
				
				if(hrefPage){
					if(hrefPage.indexOf('page') == -1 && hrefPage.indexOf('action') == -1){
						hrefPage = 'page/' + hrefPage;
					}
				}
				if(tabText.lastIndexOf('(') > -1){
					tabText = tabText.substring(0,tabText.lastIndexOf('('));
				}
				if($('#tab_'+tabId).length==0){
					$('#operator').tabs('add',{
						id:'tab_'+tabId,
						iconCls:tabIconCls,
						title:tabText,
						closable:true,
						onLoad:function(){
							onLoad && onLoad.call(this);
						},
						href:hrefPage
					});
					var length = $('#operator').tabs('tabs').length;
					if(length > 8){
						$('#operator').tabs('close',1);
					}
					
				}else{
					$('#operator').tabs('select',tabText);
				}
				
			},
			departIdToName:function(departId){
				if(departId){
					var departName = departIdNameObj[departId];
					if(departName){
						return departName;
					}else{
						return departId;
					}
				}
				return '';
			},
			listCodesByType:function(type){
				return sys_codes[type];
			},
			codeToName:function(type,code){
				var ret = code;
				if(type=='BFZT'){
					if(code=='0'){
						return '撤防';
					}else if(code=='1'){
						return '布防';
					}else if(code=='-1'){
						return '不在线';
					}else{
						return code;
					}
				}
				if(type=='FACTORY'){
					if(code=='SZW'){
						return '狮子王';
					}else if(code=='DSJ'){
						return '迪视佳';
					}else if(code=='SA'){
						return '深安';
					}else if(code=='AL'){
						return '阿里';
					}else{
						return code;
					}
				}
				if(type=='ZGZT'){
					if(code=='0'){
						return '离职';
					}else if(code=='1'){
						return '在岗';
					}else{
						return code;
					}
				}
				if(type=='RYLB'){
					if(code=='0'){
						return '保安';
					}else if(code=='1'){
						return '员工';
					}else if(code=='2'){
						return '员工';
					}else{
						return code;
					}
				}
				if(sys_codes[type]){
					$.each(sys_codes[type],function(i,r){
						if(r['code']==code){
							ret = r['name'];
							return false;
						}
					});
				}
				return ret;
			},
			toBlank:function(s){
				if(null==s || undefined==s){
					return '';
				}
				return s;
			},
			/**
			 * 选择企业角色
			 * @param options.title 窗口标题 || '选择橘色'
			 * @param options.enterpriseId 企业Id || ''
			 * @param options.width 窗口宽度 || '900px'
			 * @param options.height 窗口高度 || '600px'
			 * @param options.onLoad 窗口加载后调用函数 || null
			 * @param options.callback 选择完成后的回调函数 || null
			 * @param options.single 是否单选 || false
			 * **/
			selectEntRole:function(options){
				var _defOpts = {title:'选择角色',width:'900px',height:'600px',onLoad:null,callback:null,single:false};
				options = $.extend(true,_defOpts,options);
				var buttons = [
				               	{
				               		text:'选择',
				               		iconCls:'fa fa-check',
				               		handler:function(){
				               			var checkeds = _dialog.find('#role_select_list').datagrid('getChecked');
				        				if(checkeds.length > 0){
				        					options.callback && options.callback.call(_dialog,checkeds);
				        					_dialog.window('destroy');
				        				}else{
				        					$.messager.alert('提示','请选择角色信息','info');
				        				}
				               		}
				               	}
				               ];
				var _dialog = common.openDialog({
					href:'./page/system/_role_select.jsp',
					title:options['title'],
					buttons:buttons,
					width:options['width'],
					height:options['height'],
					onLoad:function(){
						options['onLoad'] && options['onLoad'].call(this);
						_dialog.find('#role_select_list').datagrid({
							url:'./Role-listByEntId.action?enterpriseId='+options['enterpriseId'],
							singleSelect:options['single']
//						,
//							onLoadSuccess:function(datas){
//								if(options && datas && datas['rows'].length > 0){
//									var _cyrys = options['selected'];
//									if(_cyrys.length > 0){
//										_cyrys = _cyrys.join(",");
//										var _t = $(this);
//										for(var i = 0 ; i < datas['rows'].length ; i++){
//											if(_cyrys.indexOf(datas['rows'][i]['id']) > -1){
//												_t.datagrid('checkRow',i);
//											}
//										}
//									}
//								}
//							}
						});
					}
				});
				return _dialog;
			},
			/**
			 * 选择企业员工
			 * @param options.title 窗口标题 || '选择员工'
			 * @param options.enterpriseId 企业Id || ''
			 * @param options.width 窗口宽度 || '900px'
			 * @param options.height 窗口高度 || '600px'
			 * @param options.onLoad 窗口加载后调用函数 || null
			 * @param options.callback 选择完成后的回调函数 || null
			 * @param options.single 是否单选 || false
			 * */
			selectEntEmp:function(options){
				var _defOpts = {title:'选择员工',width:'900px',height:'600px',onLoad:null,callback:null,single:false};
				options = $.extend(true,_defOpts,options);
				var buttons = [
				               	{
				               		text:'选择',
				               		iconCls:'fa fa-check',
				               		handler:function(){
				               			var checkeds = _dialog.find('#employee_select_list').datagrid('getChecked');
				        				if(checkeds.length > 0){
				        					options.callback && options.callback.call(_dialog,checkeds);
				        					_dialog.window('destroy');
				        				}else{
				        					$.messager.alert('提示','请选择员工信息','info');
				        				}
				               		}
				               	}
				               ];
				
				var _dialog = common.openDialog({
					href:'./page/system/_emp_select.jsp',
					title:options['title'],
					buttons:buttons,
					width:options['width'],
					height:options['height'],
					onLoad:function(){
						options['onLoad'] && options['onLoad'].call(this);
						_dialog.find('#employee_select_list').datagrid({
							url:'./Employee-listByEntId.action?enterpriseId='+options['enterpriseId'],
							singleSelect:options['single']
//						,
//							onLoadSuccess:function(datas){
//								if(options && datas && datas['rows'].length > 0){
//									var _cyrys = options['selected'];
//									if(_cyrys.length > 0){
//										_cyrys = _cyrys.join(",");
//										var _t = $(this);
//										for(var i = 0 ; i < datas['rows'].length ; i++){
//											if(_cyrys.indexOf(datas['rows'][i]['id']) > -1){
//												_t.datagrid('checkRow',i);
//											}
//										}
//									}
//								}
//							}
						});
						
						_dialog.find('#btn_search').linkbutton({
							onClick:function(){
								var name = _dialog.find('#query_name').textbox('getValue');
								var phone = _dialog.find('#query_phone').textbox('getValue');
								var filters = [];
								if('' != phone){
									var filter = {};
									filter['property'] = 'phone';
									filter['value'] =phone;
									filters.push(filter); 
								}
								if('' != name){
									var filter = {};
									filter['property'] = 'name';
									filter['value'] =name;
									filters.push(filter);
								}
								if(filters.length > 0){
									_dialog.find('#employee_select_list').datagrid('load',{filter:filters});
								}
								
							}
						});
						_dialog.find('#btn_reset').linkbutton({
							onClick:function(){
								_dialog.find('#query_name').textbox('reset');
								_dialog.find('#query_phone').textbox('reset');
								_dialog.find('#employee_select_list').datagrid('load',{filter:[]});
							}
						});
					}
				});
				return _dialog;
			},
			// 获取审批配置
			getWorkflowType:function(key){
				return _workflowType[key];
			},
			/**审批状态 审批新建0 审批中1 审批拿回2 审批通过3 审批拒绝4**/
			SP_ZT:{'NEW':0,'INIT':1,'BACK':2,'PASS':3,'REFUSE':4}
	};
}());
(function($){
	 var buttonDir = {north:'down',south:'up',east:'left',west:'right'};
	    $.extend($.fn.layout.paneldefaults,{
	        onBeforeCollapse:function(){
	            var popts = $(this).panel('options');
	            var dir = popts.region;
	            var btnDir = buttonDir[dir];
	            if(!btnDir) return false;
	            setTimeout(function(){
	                var pDiv = $('.layout-button-'+btnDir).closest('.layout-expand').css({
	                    textAlign:'center',lineHeight:'18px',fontWeight:'bold'
	                });
	                if(popts.title){
	                    if(dir == "east" || dir == "west"){
	                        var vTitle = popts.title.split('').join('<br/>');
	                        pDiv.find('.panel-body').html('<font color=blue>'+vTitle+'</font>');
	                    }else{
	                        $('.layout-button-'+btnDir).closest('.layout-expand').find('.panel-title').css({textAlign:'left'}).html('<font color=blue>'+popts.title+'</font>');
	                    }
	                }   
	            },100);
	             
	        }
	    });
	})(jQuery);
