<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String nodeid = request.getParameter("nodeid");
// 
%>

<div id="line-properties-layout" class="mwsmartui-layout" data-options="fit:true,border:false">
	<div data-options="region:'north',border:false,height:'45px'">
		<div class="toolbar-btn">
			<a href="#" class="mwsmartui-linkbutton" data-options="onClick:saveLineProperties,plain:true" style="color: black;border:1px solid #1c86f4;font-weight: bold;background-color: #e8f5fe;"><i class="fa fa-save"> </i> 保存</a>
		</div>
	</div>
	<div data-options="region:'center',border:false">
		<div id="line-properties-accordion" class="mwsmartui-accordion" data-options="fit:true,border:false">
			<div data-options="selected:true,title:'属性面板'">
				<form action="" method="post">
					<table id="general-properties" style="width:99%">
						<tr>
							<td align="right" style="width: 60px;">ID:</td>
							<td><input class="mwsmartui-textbox" data-options="required:true,width:'100%'" id="id" name="id" value=""/></td>
						</tr>
						<tr>
							<td align="right" style="width: 60px;">名称:</td>
							<td>
							<select class="mwsmartui-combobox" data-options="width:'100%',
								                      						width:'150px',
								                      						method:'post',
								                      						url:'./SysBaseCode-list.action?type=LCLX',
								                      						valueField:'name',
								                      						textField:'name'" id="name" name="name">
							</select>
							</td>
						</tr>
						<tr>
							<td align="right">分支条件:</td>
							<td><input class="mwsmartui-textbox" data-options="width:'100%'" id="condition" name="condition" size="50" value=""/></td>
						</tr>
					</table>
				</form>
			</div>
			<%-- 
			<div data-options="title:'监听任务'">
				<div id="line-listener-list-toolbar">
					<div class="toolbar-btn">
						<div class="btn-left">
							<a href="#" class="mwsmartui-linkbutton" data-options="iconCls:'icon-add',onClick:chooseLineListener">选择</a>
							<a href="#" class="mwsmartui-linkbutton" data-options="iconCls:'icon-remove',onClick:removeLineListener">删除</a>
						</div>
					</div>
				</div>
				<table id="line-listener-list" class="mwsmartui-datagrid" data-options="
																						border:false,
																						checkOnSelect:false,
																						fit:true,
																						singleSelect:true,
																						striped:true,
																						method:'post',
																						scrollbarSize:28,
																						toolbar:'#line-listener-list-toolbar'">
					<thead>
						<tr>
							<th data-options="field:'id',checkbox:true">id</th>
		                    <th data-options="field:'event',width:'10%'"><b>事件</b></th>
		                    <th data-options="field:'type',width:'20%'"><b>类别</b></th>
		                    <th data-options="field:'class',width:'70%'"><b>Class</b></th>
							<%--  
		                    <th data-options="field:'name',width:'20%'"><b>名称</b></th>
		                    <th data-options="field:'type',width:'20%'"><b>类型</b></th>
		                    -- %>
						</tr>
					</thead>																		
				</table>
			</div>
			--%>
		</div>
	</div>
</div>
<script type="text/javascript">
	var line, _layout, _lineListenerList;
	setTimeout(function(){
		line = workflow.getLine('<%=nodeid%>');
		_layout = $('#line-properties-layout');
		_lineListenerList = _layout.find('#line-listener-list');
		_layout.find('#id').textbox('setValue',line.lineId);
		_layout.find('#name').combobox('setValue',line.lineName);
		_layout.find('#condition').textbox('setValue',line.condition);
		var listeners = line.listeners;
		if(listeners.size  > 0){
			var rows = [];
			for(var i = 0 ; i < listeners.size ; i++){
				var listener = listeners.get(i);
				var row = {};
				row.id = listener.id;
				row.event = listener.event;
				row.type = listener.serviceType;
				row['class'] = listener.serviceClass; 
				rows.push(row);
			}
			_lineListenerList.datagrid('request',{rows:rows,total:rows.length});
		}
	},100);
	function saveLineProperties(){
		if(_layout.find('form').form('validate')){
			line.lineId = _layout.find('#id').textbox('getValue');
			line.lineName = _layout.find('#name').combobox('getText');
			line.condition = _layout.find('#condition').textbox('getValue');
			line.setLabel($('#name').combobox('getText'));
			$.messager.alert('提示','临时保存数据成功,请注意最后[<font color="blue">提交</font>]数据生效','info');
		}
	}
	function chooseLineListener(){
		sys_act_listener.select({
			group:'LXSJ',
			callback:function(datas){
				if(datas && datas.length > 0){
					for(var i = 0 ; i < datas.length ; i++){
						var row = {};
						var listener = new draw2d.DecoratedConnection.Listener();
						listener.id = datas[i]['id_'];
						row.id = listener.id;
						listener.event = datas[i]['event'];
						row.event = listener.event;
						listener.serviceType = datas[i]['type_'];
						row.type = listener.serviceType;
						listener.serviceClass = datas[i]['class_'];
						row['class'] = listener.serviceClass;
						listener.serviceExpression = datas[i]['class_'];
						line.addListener(listener);
						_lineListenerList.datagrid('appendRow',row);
					}
				}
			}
		});
	}
	
	function removeLineListener(){
		var checkeds = _lineListenerList.datagrid('getChecked');
		if(checkeds && checkeds.length > 0){
			var row = checkeds[0];
			$.messager.confirm('提示','确认删除[<font color=red>'+row['event']+'</font>]吗?',function(b){
				var index = _lineListenerList.datagrid('getRowIndex',row);
				_lineListenerList.datagrid('deleteRow',index);
				line.deleteListener(row['id']);
			});
		}else{
			$.messager.alert('提示','请选流程监听信息');
		}
	}
	
	
</script>
