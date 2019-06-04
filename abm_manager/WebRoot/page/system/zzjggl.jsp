<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>系统管理 组织机构管理</title>
</head>
<body>

<script language="javascript" type="text/javascript" src="./js/xtgl_zzjggl.js"></script>

	<div id="xtgl_zzjggl_div" class="mwsmartui-panel" data-options="border:false,fit:true">
		<div id="toolbar_xtgl_zzjg_list">
			<%--
			<div class="toolbar-btn">
				<div class="btn-left">
					<a href="#" class="mwsmartui-linkbutton" data-options="iconCls:'clipboard_task',onClick:sys_sync.sync_depart">同步部门信息</a>
				</div>
			</div>
			 --%>
		</div>
		<%--
		onDblClickRow:function(row,index){
																				zzjg.detail(row['id']);
																			},
		 --%>
		<table id="xtgl_zzjg_list" class="mwsmartui-treegrid" data-options="
					      													border:false,
					      													checkOnSelect:false,
					      													fit:true,
					      													singleSelect:true,
					      													collapsible:true,
					      													striped:true,
					      													url:'./SysDepart-listDept.action',
					      													method:'post',
					      													idField: 'id',
																			treeField: 'name',
																			toolbar:'#toolbar_xtgl_zzjg_list',
					      													scrollbarSize:260">
            <thead>
                <tr>
                	<th data-options="field:'qymc',width:'50%'"><b>企业名称</b></th>
                    <th data-options="field:'mc',width:'50%'"><b>部门名称</b></th>
                    <th data-options="field:'xx',width:'260px',formatter:zzjg.opt_btn,align:'center'"><b>操作</b></th>
                </tr>
            </thead>
        </table>
	</div>
</body>
</html>