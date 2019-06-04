
var selectEmp = (function(){
	var _defOpts = {
			title:'选择人员',
			width:'900px',
			height:'600px',
			onLoad:null,
			callback:null,
			gwlb:[],
			selected:[],
			single:false,
			lb:'0',
			depart_type:'',
			depart_bm:'',
			qx:''
		};
	var _select_win = function(options){
		options = $.extend(true,_defOpts,options);
		var buttons = [];
		var button = {};
		button.text = '确定';
		button.iconCls = 'fa fa-check';
		button.handler = function(){
			var checkeds = _dialog.find('#employee_select_list').datagrid('getChecked');
			if(checkeds.length > 0){
				options.callback && options.callback.call(_dialog,checkeds);
				_dialog.window('destroy');
			}else{
				$.messager.alert('提示','请选择人员信息');
			}
		}
		buttons.push(button);
		
		var project_id='';
		if(options['project_id']){
			project_id=options['project_id'];
		}
		var select_ids='';
		if(options['select_ids']){
			select_ids=options['select_ids'];
		}
		var qx='';
		if(options['qx']){
			qx=options['qx'];
		}
		
		var _dialog = common.openDialog({
			href:'./page/project/employee_select.jsp?project_id='+project_id+'&select_ids='+select_ids+'&qx='+qx,
			title:options['title'],
			buttons:buttons,
			width:options['width'],
			height:options['height'],
			onLoad:function(){
				options['onLoad'] && options['onLoad'].call(this);
				
				_dialog.find('#employee_select_list').datagrid({
					//url:'./Employee-list.action',
					singleSelect:options['single'],
					onLoadSuccess:function(datas){
//						if(options && datas && datas['rows'].length > 0){
//							var _cyrys = options['selected'];
//							if(_cyrys.length > 0){
//								_cyrys = _cyrys.join(",");
//								var _t = $(this);
//								for(var i = 0 ; i < datas['rows'].length ; i++){
//									if(_cyrys.indexOf(datas['rows'][i]['id']) > -1){
//										_t.datagrid('checkRow',i);
//									}
//								}
//							}
//						}
					}
				});
				
				_dialog.find('#btn_search').linkbutton({
					onClick:function(){
						var name = _dialog.find('#query_name').textbox('getValue');
						var filters = [];
						if('' != name){
							var filter = {};
							filter['property'] = 'name';
							filter['value'] = name;
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
						_dialog.find('#employee_select_list').datagrid('load',{filter:[]});
					}
				});
			}
		});
		return _dialog;
	}
	return {
		/**
		 * @param options.title 窗口标题 || '选择员工'
		 * @param options.width 窗口宽度 || '900px'
		 * @param options.height 窗口高度 || '600px'
		 * @param options.onLoad 窗口加载后调用函数 || null
		 * @param options.gwlb 需要过滤的岗位类别 || []
		 * @param options.selected 默认选中 || []
		 * @param options.callback 选择完成后的回调函数 || null
		 * @param options.single 是否单选 || false
		 * @param options.payrollMod 薪资发放模式 || '' 全部员工  '1' 发放部门不在正职部门的员工
		 * @param options.lb 是否领导干部  || '0' 领导干部  '1' 后备人才
		 * @param options.depart_type ||'' '1' 一级部门 '2' 二级部门
		 * @param options.depart_bm   ||'' 若depart_type为2二级部门，则需要传入二级部门编码
		 * */
		select:_select_win
	}
	
}());