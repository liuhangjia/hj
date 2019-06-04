<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String nodeid = request.getParameter("nodeid");
%>
<!DOCTYPE script PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<body>
	<div id="task-properties-layout" class="mwsmartui-layout" data-options="fit:true,border:false">
		<div data-options="region:'north',border:false,height:'45px'">
			<div class="toolbar-btn">
				<a href="#" class="mwsmartui-linkbutton" data-options="onClick:saveTaskProperties,plain:true" style="color: black;border:1px solid #1c86f4;font-weight: bold;background-color: #e8f5fe;"><i class="fa fa-save"></i> 保存</a>
			</div>
		</div>
		<div data-options="region:'center',border:false">
			<div id="task-properties-accordion" class="mwsmartui-accordion" data-options="fit:true,border:false">
				<div data-options="selected:true,title:'任务属性'">
					<table id="general-properties" width='99%'>
						<tr>
							<td align="right" style="width:'70px'">ID:</td>
							<td><input type="text" class="mwsmartui-textbox" data-options="required:true,width:'100%'" id="id" name="id" value=""/></td>
						</tr>
						<tr>
							<td align="right">描述:</td>
							<td><input type="text" class="mwsmartui-textbox" data-options="width:'100%'" id="name" name="name" value=""/></td>
						</tr>
						<tr>
							<td align="right">任务属性:</td>
							<td><input type="text" class="mwsmartui-textbox" data-options="width:'100%'" id="documentation" name="documentation" /></td>
						</tr>
						<tr>
							<td align="right">表单key:</td>
							<td><input type="text" class="mwsmartui-textbox" data-options="width:'100%'" id="formKey" name="formKey" value="" /></td>
						</tr>
						<tr>
							<td align="right" style="width:70px;">处理人类型:</td>
							<td>
								<select class="mwsmartui-combobox" data-options="required:true,editable:false" id="performerType" name="performerType">
									<option value="assignee" selected>一个处理人</option>
									<option value="candidateUsers">多个处理人</option>
									<option value="candidateGroups">审批角色</option>
								</select>
								<a href="#" class="mwsmartui-linkbutton" data-options="onClick:selectForTask,plain:true" id="btn-select" style="color: black;border:1px solid #1c86f4;font-weight: bold;background-color: #e8f5fe;">选择 </a>
								<a href="#" class="mwsmartui-linkbutton" data-options="onClick:setCurrentEmp,plain:true" style="color: black;border:1px solid #1c86f4;font-weight: bold;background-color: #e8f5fe;">申请者</a>
								<a href="#" class="mwsmartui-linkbutton" data-options="onClick:function(){
																						$('#task-properties-accordion #performerType').combobox('reset');
																						$('#task-properties-accordion #expressionVal').textbox('reset');
																						$('#task-properties-accordion #expression').val('');
																						},plain:true" style="color: black;border:1px solid #1c86f4;font-weight: bold;background-color: #e8f5fe;">
								清除</a>
							</td>
						</tr>
						<tr>
							<td align="right">处理人:</td>
							<td>
								<input class="mwsmartui-textbox" data-options="required:true,width:'100%'" id="expressionVal" name="expressionVal"/>
								<input type="hidden" id="expression" name="expression"/>
							</td>
						</tr>
					</table>
				</div>
				<%--
				<div data-options="title:'监听任务'">
					<div id="task-listener-list-toolbar">
						<div class="toolbar-btn">
							<div class="btn-left">
								<a href="#" class="mwsmartui-linkbutton" data-options="iconCls:'icon-add',onClick:chooseTaskListener">选择</a>
								<a href="#" class="mwsmartui-linkbutton" data-options="iconCls:'icon-remove',onClick:removeTaskListener">删除</a>
							</div>
						</div>
					</div>
					<table id="task-listener-list" class="mwsmartui-datagrid" data-options="
																							border:false,
																							checkOnSelect:false,
																							fit:true,
																							singleSelect:true,
																							striped:true,
																							method:'post',
																							scrollbarSize:28,
																							toolbar:'#task-listener-list-toolbar'">
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
		var task, _layout, _taskListenerList;
		setTimeout(function(){
			task = workflow.getFigure('<%=nodeid%>');
			_layout = $('#task-properties-layout');
			_taskListenerList = _layout.find('#task-listener-list');
			_layout.find('#id').textbox('setValue',task.taskId);
			_layout.find('#name').textbox('setValue',task.taskName);
			_layout.find('#documentation').textbox('setValue',task.documentation);
			_layout.find('#formKey').textbox('setValue',task.formKey);
			var _performerType = task.performerType;
			var _expression = task.expression;
			_layout.find('#performerType').combobox('setValue',_performerType);
			_layout.find('#expression').val(task.expression);
			if('assignee' == _performerType || 'candidateUsers' == _performerType){
				if(_expression == '\${applyUserId}'){
					_layout.find('#expressionVal').textbox('setValue','申请者');
				}else{
					var _vals = [];
					$.ajax({
						url:'./Employee-findByIds.action',
						type:'post',
						async:false,
						dataType:'json',
						data:{'ids':_expression},
						success:function(resp){
							var datas = resp['rows'];
							if($.isArray(datas) && datas.length > 0){
								for(var i = 0 ; i < datas.length ; i++){
									var data = datas[i];
									if(data['employeeModel']){
										_vals.push(data['employeeModel']['name']);
									}
								}
							}else{
								$.messager.alert('提示','员工信息不存在');
							}
						},
						error:function(e){
							$.messager.alert('提示','网络异常');
						}
					});
					_layout.find('#expressionVal').textbox('setValue',_vals.join(','));
				}
				
			}else if('candidateGroups' == _performerType){
				if(_expression == 'ZSLDSP'){
					_layout.find('#expressionVal').textbox('setValue','主管领导审批');
				}else{
					var _vals = [];
					$.ajax({
						url:'./Role-findByIds.action',
						type:'post',
						async:false,
						dataType:'json',
						data:{'ids':_expression},
						success:function(resp){
							var datas = resp['rows'];
							if($.isArray(datas) && datas.length > 0){
								for(var i = 0 ; i < datas.length ; i++){
									_vals.push( datas[i]['name'] );
								}
							}else{
								$.messager.alert('提示','审批角色信息不存在');
							}
						},
						error:function(e){
							$.messager.alert('提示','网络异常');
						}
					});
					_layout.find('#expressionVal').textbox('setValue',_vals.join(','));
				}
			}
			var listeners = task.listeners;
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
				_taskListenerList.datagrid('request',{rows:rows,total:rows.length});
			}
			
		},150);
		function saveTaskProperties(){
			if(_layout.find('form').form('validate')){
				task.taskId = _layout.find('#id').textbox('getValue');
				task.taskName = _layout.find('#name').textbox('getValue');
				task.documentation = _layout.find('#documentation').textbox('getValue');
				task.formKey = _layout.find('#formKey').textbox('getValue');
				task.performerType = _layout.find('#performerType').combobox('getValue');
				task.expression = _layout.find('#expression').val();
				task.isUseExpression=true;
				task.setId(task.taskId);
				task.setContent(task.taskName);
				$.messager.alert('提示','临时保存数据成功,请注意最后[<font color=blue>提交</font>]数据生效','info');
			}
		}
		function selectForTask(){
			var performerType = _layout.find('#performerType').combobox('getValue');
			var enterpriseName = workflow.process.enterpriseName;
			if(performerType == 'assignee' || performerType == 'candidateUsers'){
				var title = '选择员工';
				if(enterpriseName){
					title = '选择[<font color=red>'+enterpriseName+'</font>]员工';
				}
				common.selectEntEmp({
					single:performerType=='assignee',
					title:title,
					enterpriseId:workflow.process.enterpriseId,
					callback:function(datas){
						if(datas.length > 0){
							var _ids = [];
							var _desc = [];
							for(var i = 0 ; i < datas.length ; i++){
								var data = datas[i];
								_ids.push(data['id']);
								if(data['employeeModel']){
									_desc.push(data['employeeModel']['name']);
								}else{
									_desc.push(data['id']);
								}
							}
							_layout.find('#expression').val(_ids.join(','));
							_layout.find('#expressionVal').textbox('setValue',_desc.join(','));
						}else{
							$.messager.alert('提示','请选择处理人','info');
						}
					}
				});
			}else if(performerType == 'candidateGroups'){
				var title = '选择角色';
				if(enterpriseName){
					title = '选择[<font color=red>'+enterpriseName+'</font>]角色';
				}
				common.selectEntRole({
					signle:true,
					title:title,
					enterpriseId:workflow.process.enterpriseId,
					callback:function(datas){
						if(datas.length > 0){
							var _ids = [];
							var _desc = [];
							for(var i = 0 ; i < datas.length ; i++){
								var data = datas[i];
								_ids.push(data['id']);
								_desc.push(data['name']);
							}
							_layout.find('#expression').val(_ids.join(','));
							_layout.find('#expressionVal').textbox('setValue',_desc.join(','));
						}else{
							$.messager.alert('提示','请选择角色');
						}
					}
				});
				
			}else{
				$.messager.alert('提示','请选择处理人类别','info');
			}
		}
		
		function chooseTaskListener(){
			sys_act_listener.select({
				group:'JDSJ',
				callback:function(datas){
					if(datas && datas.length > 0){
						for(var i = 0 ; i < datas.length ; i++){
							var row = {};
							var listener = new draw2d.Task.Listener();
							listener.id = datas[i]['id_'];
							row.id = listener.id;
							listener.event = datas[i]['event'];
							row.event = listener.event;
							listener.serviceType = datas[i]['type_'];
							row.type = listener.serviceType;
							listener.serviceClass = datas[i]['class_'];
							row['class'] = listener.serviceClass;
							listener.serviceExpression = datas[i]['class_'];
							task.addListener(listener);
							_taskListenerList.datagrid('appendRow',row);
						}
					}
				}
			});
		}
		
		function removeTaskListener(){
			var checkeds = _taskListenerList.datagrid('getChecked');
			if(checkeds && checkeds.length > 0){
				var row = checkeds[0];
				$.messager.confirm('提示','确认删除[<font color=red>'+row['event']+'</font>]吗?',function(b){
					var index = _taskListenerList.datagrid('getRowIndex',row);
					_taskListenerList.datagrid('deleteRow',index);
					task.deleteListener(row['id']);
				});
			}else{
				$.messager.alert('提示','请选流程监听信息','info');
			}
		}
		
		function setCurrentEmp(){
			_layout.find('#performerType').combobox('setValue','assignee');
			_layout.find('#expressionVal').textbox('setValue','申请者');
			_layout.find('#expression').val('\${applyUserId}');
		}
		
	</script>
</body>
</html>