var equip_car = (function(){
	return {
		query:function(){
			var arra = [
			            {property:'car_number',value:$('#bjjk_car_number').textbox('getValue')},
			            {property:'record_time',value:$('#bjjk_car_record_time').datebox('getValue')},
			            {property:'equip_id',value:$('#bjjk_car_equip_id').combobox('getValue')}
			            ];
			var param = {filter:arra};
			$('#bjjk_car_managers_list').datagrid('reload',param);
		},
		reset:function(){
			var lb = $(this).linkbutton('options')['lb'];
			$("#bjjk_car_queryform").form("reset");
			var param = {filter:[]};
		    $('#bjjk_car_managers_list').datagrid('reload',param);
		},
	};
}());