<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<body>
	<%-- JQuery validate CSS--%>
	<link href="./js/lib/validate/jquery.validate.extend.css" type="text/css" rel="stylesheet"/>
	<%-- JQuery AutoComplete --%>
	<link rel="stylesheet" type="text/css" href="./js/lib/jquery-autocomplete/jquery.autocomplete.css" />
	
	<link rel="stylesheet" type="text/css" href="./js/lib/designer/designer.css" />
	<%-- JQuery validate JS--%>
	<script src="./js/lib/validate/jquery.validate.js" type="text/javascript"></script>
	<script src="./js/lib/validate/jquery.metadata.js" type="text/javascript"></script>
	<script src="./js/lib/validate/jquery.validate.method.js" type="text/javascript"></script>
	<script src="./js/lib/validate/jquery.validate.extend.js" type="text/javascript"></script>
	<%-- JQuery form Plugin --%>
	<script src="./js/lib/jquery.form.js" type="text/javascript"></script>
	<%-- JSON JS--%>
	<script src="./js/lib/json2.js" type="text/javascript"></script>
	<%-- JQuery AutoComplete --%>
	<script type='text/javascript' src='./js/lib/jquery-autocomplete/lib/jquery.bgiframe.min.js'></script>
	<script type='text/javascript' src='./js/lib/jquery-autocomplete/lib/jquery.ajaxQueue.js'></script>
	<%--<script type='text/javascript' src='./js/jquery-autocomplete/lib/thickbox-compressed.js'></script>--%>
	<script type='text/javascript' src='./js/lib/jquery-autocomplete/jquery.autocomplete.min.js'></script>
	<%-- framework JS --%>
	<script src="./js/lib/skin.js" type="text/javascript"></script>
	<%-- common, all times required, imports --%>
	<script src='./js/lib/draw2d/wz_jsgraphics.js' type="text/javascript"></script>
	<%--       
    <script src='./js/draw2d/mootools.js' type="text/javascript"></script>          
    <script src='./js/draw2d/moocanvas.js' type="text/javascript"></script>
	--%>
	<script src='./js/lib/draw2d/draw2d.js' type="text/javascript"></script>
	<%-- example specific imports --%>
	<script type="text/javascript" src="./js/lib/designer/MyCanvas.js"></script>
	<script type="text/javascript" src="./js/lib/designer/ResizeImage.js"></script>
	<script type="text/javascript" src="./js/lib/designer/event/Start.js"></script>
	<script type="text/javascript" src="./js/lib/designer/event/End.js"></script>
	<script type="text/javascript" src="./js/lib/designer/connection/MyInputPort.js"></script>
	<script type="text/javascript" src="./js/lib/designer/connection/MyOutputPort.js"></script>
	<script type="text/javascript" src="./js/lib/designer/connection/DecoratedConnection.js"></script>
	<script type="text/javascript" src="./js/lib/designer/task/Task.js"></script>
	<script type="text/javascript" src="./js/lib/designer/task/UserTask.js"></script>
	<script type="text/javascript" src="./js/lib/designer/task/ManualTask.js"></script>
	<script type="text/javascript" src="./js/lib/designer/gateway/ExclusiveGateway.js"></script>
	<%-- 
	<script type="text/javascript" src="./js/lib/designer/task/ServiceTask.js"></script>
	<script type="text/javascript" src="./js/lib/designer/task/ScriptTask.js"></script>
	<script type="text/javascript" src="./js/lib/designer/task/MailTask.js"></script>
	<script type="text/javascript" src="./js/lib/designer/task/ReceiveTask.js"></script>
	<script type="text/javascript" src="./js/lib/designer/task/BusinessRuleTask.js"></script>
	<script type="text/javascript" src="./js/lib/designer/task/CallActivity.js"></script>
	
	<script type="text/javascript" src="./js/lib/designer/gateway/ParallelGateway.js"></script>
	--%>
	<script type="text/javascript" src="./js/lib/designer/designer.js"></script>
	
	<div id="designer" class="mwsmartui-layout" data-options="fit:true,border:false">
		<input type="hidden" id="design_id"/>
		<div data-options="region:'west',width:'140px',split:true,iconCls:'palette-icon',title:'流程元素'">
			<div class="mwsmartui-accordion" data-options="fit:true,border:false">
				<%--  
			<div id="connection" title="Connection" iconCls="palette-menu-icon" class="palette-menu">
				<a href="##" class="mwsmartui-linkbutton" plain="true" iconCls="sequence-flow-icon">SequenceFlow</a><br/>
			</div>
			--%>
				<div id="event" title="事件" iconCls="palette-menu-icon" class="palette-menu">
					<a href="##" class="mwsmartui-linkbutton" data-options="plain:true,iconCls:'start-event-icon',width:'90%'" wfmodel="Start" style="border:1px solid #1c86f4;color:black;">开始</a><br /> 
					<a href="##" class="mwsmartui-linkbutton" data-options="plain:true,iconCls:'end-event-icon',width:'90%'" wfmodel="Etart" style="border:1px solid #1c86f4;color:black;margin-top:5px;">结束</a><br />
				</div>
				<div id="task" title="任务" iconCls="palette-menu-icon" selected="true" class="palette-menu">
					<a href="##" class="mwsmartui-linkbutton" data-options="plain:true,iconCls:'user-task-icon',width:'90%'" wfModel="UserTask" style="border:1px solid #1c86f4;color:black;">用户任务</a><br />
					<a href="##" class="mwsmartui-linkbutton" data-options="plain:true,iconCls:'exclusive-gateway-icon',width:'90%'" wfModel="ExclusiveGateway" style="border:1px solid #1c86f4;color:black;margin-top:5px;">条件分支</a><br /> 
					<%-- 
					<a href="##" class="mwsmartui-linkbutton" plain="true" iconCls="manual-task-icon" wfModel="ManualTask">手工任务</a><br /> 
					<a href="##" class="mwsmartui-linkbutton" plain="true" iconCls="service-task-icon" wfModel="ServiceTask">服务任务</a><br /> 
					<a href="##" class="mwsmartui-linkbutton" plain="true" iconCls="script-task-icon" wfModel="ScriptTask">脚本任务</a><br /> 
					<a href="##" class="mwsmartui-linkbutton" plain="true" iconCls="mail-task-icon" wfModel="MailTask">邮件任务</a><br /> 
					<a href="##" class="mwsmartui-linkbutton" plain="true" iconCls="receive-task-icon" wfModel="ReceiveTask">接收任务</a><br /> 
					<a href="##" class="mwsmartui-linkbutton" plain="true" iconCls="business-rule-task-icon" wfModel="BusinessRuleTask">业务规则</a><br />
					<a href="##" class="mwsmartui-linkbutton" plain="true" iconCls="subprocess-icon" wfmodel="CallActivity">子流程</a><br />
					--%>
					<%--  
				<a href="##" class="mwsmartui-linkbutton" plain="true" iconCls="callactivity-icon" wfModel="CallActivity">CallActivity</a><br/>
				--%>
				</div>
				<%--
				<div id="gateway" title="网关" iconCls="palette-menu-icon" class="palette-menu">
					<a href="##" class="mwsmartui-linkbutton" plain="true" iconCls="parallel-gateway-icon" wfModel="ParallelGateway" iconImg="./js/designer/icons/type.gateway.parallel.png">同步</a><br />
					<a href="##" class="mwsmartui-linkbutton" plain="true" iconCls="exclusive-gateway-icon" wfModel="ExclusiveGateway" iconImg="./js/designer/icons/type.gateway.exclusive.png">分支</a><br />
				</div>
				<div id="boundary-event" title="边界事件" iconCls="palette-menu-icon" class="palette-menu">
					<a href="##" class="mwsmartui-linkbutton" plain="true" iconCls="timer-boundary-event-icon" wfmodel="TimerBoundary">时间边界</a><br />
					<a href="##" class="mwsmartui-linkbutton" plain="true" iconCls="error-boundary-event-icon" wfmodel="ErrorBoundary">错误边界</a><br />
				</div>
				--%>
			</div>
		</div>
		<div id="process-panel" data-options="region:'center',iconCls:'process-icon',title:'流程设计'">
			<div id="process-definition-tab">
				<div id="designer-area" title="设计" style="POSITION: absolute; width: 100%; height: 100%; padding: 0; border: none; overflow: auto;">
					<div id="paintarea" style="POSITION: absolute; WIDTH: 3000px; HEIGHT: 3000px"></div>
				</div>
				<div id="xml-area" title="XML源码" style="width: 100%; height: 100%; overflow: hidden; overflow-x: hidden; overflow-y: hidden;">
					<textarea id="descriptorarea" rows="38" style="width: 100%; height: 100%; padding: 0; border: none;" readonly="readonly"></textarea>
				</div>
			</div>
		</div>
		<div id="properties-panel" data-options="region:'east',split:true,iconCls:'properties-icon',title:'流程属性',width:'500px'">
		</div>
		<%-- toolbar 
		<div id="toolbar-panel" data-options="region:'north',border:false,height:'45px'"> 
			<div class="toolbar-btn">
				<div class="btn-left">
					<a href="#" class="mwsmartui-linkbutton" data-options="onClick:sys_act.saveProcessDef"><i class="fa fa-save"> </i> 保存</a>
					<a href="#" class="mwsmartui-linkbutton" data-options="onClick:sys_act.undo"><i class="fa fa-undo"> </i> 上一步</a>
					<a href="#" class="mwsmartui-linkbutton" data-options="onClick:sys_act.redo"><i class="fa fa-redo"> </i> 下一步</a>
				</div>
			</div>
		</div>
		--%>
		<%-- task context menu --%>
		<div id="task-context-menu" class="mwsmartui-menu" style="width: 120px;">
			<div id="properties-task-context-menu" iconCls="properties-icon">属性</div>
			<div id="delete-task-context-menu" iconCls="icon-remove">删除</div>
		</div>
		<%-- form configuration window --%>
		<div id="form-win" title="Form Configuration" style="width: 750px; height: 500px;"></div>
		<%-- listener configuration window --%>
		<div id="listener-win" title="Listener Configuration" style="width: 750px; height: 500px;"></div>
		<%-- candidate configuration window --%>
		<div id="task-candidate-win" title="" style="width: 750px; height: 500px;"></div>
		
	</div>
</body>
</html>