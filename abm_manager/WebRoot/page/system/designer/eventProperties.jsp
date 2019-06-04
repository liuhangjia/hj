<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String nodeid = request.getParameter("nodeid");
%>
<div id="event-properties-layout" class="mwsmartui-layout" data-options="fit:true,border:false">
	<div data-options="region:'north',border:false,height:'45px'">
		<div class="toolbar-btn">
			<a href="#" class="mwsmartui-linkbutton" data-options="onClick:saveEventProperties,plain:true" style="color: black;border:1px solid #1c86f4;font-weight: bold;background-color: #e8f5fe;"><i class="fa fa-save"> </i> 保存</a>
		</div>
	</div>
	<div data-options="region:'center',border:false,title:''">
		<div id="event-properties-accordion" class="mwsmartui-accordion" data-options="fit:true,border:false">
			<div data-options="selected:true,title:'属性面板'">
				<form action="" method="post">
					<table id="general-properties" style="width:99%">
						<tr>
							<td align="right" style="width: 50px;">ID:</td>
							<td><input class="mwsmartui-textbox" data-options="required:true,width:'100%'" id="id" name="id" value=""/></td>
						</tr>
						<tr>
							<td align="right">名字:</td>
							<td><input class="mwsmartui-textbox" data-options="required:true,width:'100%'" id="name" name="name" value=""/></td>
						</tr>
						<tr>
							<td align="right">发起人:</td>
							<td><input class="mwsmartui-textbox" data-options="width:'100%'" id="expression" name="expression" size="50" value=""/></td>
						</tr>
					</table>
				</form>
			</div>
		</div>	
	</div>
</div>
<script type="text/javascript">
var eventFigure, _layout;
setTimeout(function(){
	eventFigure = workflow.getFigure('<%=nodeid%>');
	_layout = $('#event-properties-layout');
	_layout.find('#id').textbox('setValue',eventFigure.eventId);
	_layout.find('#name').textbox('setValue',eventFigure.eventName);
	_layout.find('#expression').textbox('setValue',eventFigure.expression);
},100);
function saveEventProperties(){
	if(_layout.find('form').form('validate')){
		eventFigure.eventId = _layout.find('#id').textbox('getValue');
		eventFigure.eventName = _layout.find('#name').textbox('getValue');
		eventFigure.expression = _layout.find('#expression').textbox('getValue');
		$.messager.alert('提示','临时保存数据成功,请注意最后[<font color="blue">提交</font>]数据生效','info');
	}
}
</script>