
var selectEquip = (function(){
	var _defOpts = {
			title:'选择装备',
			width:'900px',
			height:'600px',
			onLoad:null,
			callback:null,
			selected:[],
			single:false,
			qx:''
		};
	var _select_win = function(options){
		options = $.extend(true,_defOpts,options);
		var buttons = [];
		var button = {};
		button.text = '确定';
		button.iconCls = 'fa fa-check';
		button.handler = function(){
			var checkeds = _dialog.find('#equip_select_list').datagrid('getChecked');
			if(checkeds.length > 0){
				options.callback && options.callback.call(_dialog,checkeds);
				_dialog.window('destroy');
			}else{
				$.messager.alert('提示','请选择装备信息');
			}
		}
		buttons.push(button);
		
		var project_id = '';
		if(options['project_id']){
			project_id = options['project_id'];
		}
		
		var _dialog = common.openDialog({
			href:'./page/project/equip_select.jsp?project_id='+project_id,
			title:options['title'],
			buttons:buttons,
			width:options['width'],
			height:options['height'],
			onLoad:function(){
				options['onLoad'] && options['onLoad'].call(this);
				
				_dialog.find('#equip_select_list').datagrid({
					//url:'./Employee-list.action',
					singleSelect:options['single'],
					onLoadSuccess:function(datas){
						
					}
				});
				
				_dialog.find('#btn_search').linkbutton({
					onClick:function(){
						var jtbh = _dialog.find('#query_jtbh').textbox('getValue');
						var xm = _dialog.find('#query_name').textbox('getValue');
						var filters = [];
						if('' != jtbh){
							var filter = {};
							filter['property'] = 'jtbh';
							filter['value'] =jtbh;
							filters.push(filter); 
						}
						if('' != xm){
							var filter = {};
							filter['property'] = 'xm';
							filter['value'] =xm;
							filters.push(filter);
						}
						if(filters.length > 0){
							_dialog.find('#employee_select_list').datagrid('load',{filter:filters});
						}
						
					}
				});
				_dialog.find('#btn_reset').linkbutton({
					onClick:function(){
						_dialog.find('#query_jtbh').textbox('reset');
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
		 * @param options.title 窗口标题 || '选择装备'
		 * @param options.width 窗口宽度 || '900px'
		 * @param options.height 窗口高度 || '600px'
		 * @param options.onLoad 窗口加载后调用函数 || null
		 * @param options.selected 默认选中 || []
		 * @param options.callback 选择完成后的回调函数 || null
		 * @param options.single 是否单选 || false
		 * */
		select:_select_win
	}
	
}());