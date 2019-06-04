<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% 
String nodeid = request.getParameter("nodeid");
%>
<div id="gateway-properties-layout" class="mwsmartui-layout" data-options="fit:true,border:false">
	<div data-options="region:'north',border:false,height:'45px'">
		<div class="toolbar-btn">
			<a href="#" class="mwsmartui-linkbutton" data-options="onClick:saveGatewayProperties,plain:true" style="color: black;border:1px solid #1c86f4;font-weight: bold;background-color: #e8f5fe;"><i class="fa fa-save"> </i> 保存</a>
		</div>
	</div>
	<div data-options="region:'center',border:false">
		<div id="gateway-properties-accordion" class="mwsmartui-accordion" data-options="fit:true,border:false">
			<div data-options="selected:true,title:'属性面板'">
				<form action="" method="post">
					<table id="general-properties" style="width:99%;">
						<tr>
							<td align="right" style="width:40px;">ID:</td>
							<td><input class="mwsmartui-textbox" data-options="required:true,width:'100%'" id="gateway_id" name="id" value=""/></td>
						</tr>
						<tr>
							<td align="right">名字:</td>
							<td><input class="mwsmartui-textbox" data-options="required:true,width:'100%'" id="gateway_name" name="name" value=""/></td>
						</tr>
					</table>
				</form>
			</div>
		</div>	
	</div>
</div>
<script type="text/javascript">
var _gateway, _layout;
setTimeout(function(){
	_gateway = workflow.getFigure('<%=nodeid %>');
	_layout = $('#gateway-properties-layout');
	_layout.find('#gateway_id').textbox('setValue',_gateway.gatewayId);
	_layout.find('#gateway_name').textbox('setValue',_gateway.gatewayName);
},100);
function saveGatewayProperties(){
	if(_layout.find('form').form('validate')){
		_gateway.gatewayId = _layout.find('#gateway_id').textbox('getValue');
		_gateway.gatewayName = _layout.find('#gateway_name').textbox('getValue');
		$.messager.alert('提示','临时保存数据成功,请注意最后[<font color="blue">提交</font>]数据生效','info');
	}
}
</script>