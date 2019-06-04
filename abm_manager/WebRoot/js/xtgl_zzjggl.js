function xtgl_zzjggl_init(){
//	if(!hasPriv("SYS_ROLE_MANAGER_ADD")){
//		$("#xtgl_jsgl_zj_btn").hide();
//	}
//	if(!hasPriv("SYS_ROLE_MANAGER_DELETE")){
//		$("#xtgl_jsgl_plsc_btn").hide();
//	}
}


function xtgl_zzjggl_selComp(node){
//	$("#xtgl_sjzd_plsc_btn").linkbutton("disable");
//	$('#xtgl_zjjg_list').data('typeid',node.id);
	
//	$('#xtgl_zzjg_list').treegrid('load','./SysDepart-listDept.action?comp='+node);
	$('#xtgl_zzjg_list').treegrid('load',{enterpriseId:node.id});
//	$('#xtgl_zzjg_list').treegrid({url:'./Depart-listDept.action?enterpriseId='+node.id});
}

function xtgl_zzjggl_opt_btn(value,row,index){
	var btn = '';
	btn = '<a href="#" onclick="xtgl_zzjg_modify_child('+index+',\''+row['id']+'\',true)" style="padding:10px 10px;" ><i class="fa fa-file-text-o"></i> 增加子部门</a>';
	if('-1' != row['id']){
		btn += '<a href="#" onclick="xtgl_zzjg_modify_child('+index+',\''+row['id']+'\',false)" style="padding:10px 10px;" ><i class="fa fa-file-text-o"></i> 修改</a>';
		btn += '<a href="#" onclick="xtgl_zzjg_del_child('+index+',\''+row['id']+'\')" style="padding:10px 10px;" ><i class="fa fa-file-text-o"></i> 删除</a>';
	}
	return btn;
}

function xtgl_zzjg_del_child(index,id){
	var row = $('#xtgl_zzjg_list').treegrid('find',id);
	$.messager.confirm('提示','确认删除'+row['name']+'及其子部门吗?',function(b){
		if(b){
			common.ajax('./Depart-del.action',{code:row['code'],enterpriseId:row['enterprise_id']},function(resp){
				if(resp['success']){
     				$('#xtgl_zzjg_list').treegrid('reload');
     			}
     			$.messager.alert('提示',resp['msg']);
			});
		}
	});
}

function xtgl_zzjg_modify_child(index,id,isAdd){
	var row = $('#xtgl_zzjg_list').treegrid('find',id);
	var title = '';
	if(isAdd){
		title = '添加'+row['name']+'子部门' ;
	}else{
		title = '编辑'+row['name'] ;
	}
	var _dialog = common.openDialog({
		id:'xtgl_zzjg_modify_child_win',
		title:title,
		width:'310px',
		height:'140px',
		href:'./page/system/xtgl_zzjggl_modify_child.jsp',
		buttons:[
		         {
		        	text:'保存',
		         	iconCls:'fa fa-check',
		         	handler:function(){
		         		if(_dialog.find('#xtgl_zzjg_modify_child_form').form('validate')){
		         			var bmmc = 	_dialog.find('#xtgl_zzjg_modify_bmmc').textbox('getValue');
			         		var bean_obj = {};
			         		bean_obj['dm.name'] = bmmc;
			         		bean_obj['dm.code'] = row['code'];
			         		bean_obj['dm.enterprise_id'] = row['enterprise_id'];
			         		if(!isAdd){
			         			bean_obj['dm.id'] = id;
			         		}
			         		common.ajax('./Depart-modify.action',bean_obj,function(resp){
			         			if(resp['success']){
			         				$('#xtgl_zzjg_list').treegrid('reload');
			         				_dialog.window('destroy');
			         			}
			         			$.messager.alert('提示',resp['msg']);
			         		});
		         		}
		         	}
		         }
		         ],
		onLoad:function(){
			if(!isAdd){
				_dialog.find('#xtgl_zzjg_modify_bmmc').textbox('setValue',row['name']);
			}
		}
	});
}
