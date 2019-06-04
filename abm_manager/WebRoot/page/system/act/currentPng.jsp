<%@page import="com.abm.common.act.service.ActWorkflowService"%>
<%@page import="org.activiti.engine.impl.pvm.process.ActivityImpl"%>
<%@page import="org.activiti.engine.runtime.ProcessInstance"%>
<%@page import="org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity"%>
<%@page import="org.activiti.engine.task.Task"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
String taskId = request.getParameter("id");
ActWorkflowService workflowService = ActWorkflowService.getSingle();

Task task = workflowService.getTaskById(taskId);

ProcessDefinitionEntity processDefEntity = (ProcessDefinitionEntity)workflowService.getProcessDefinitionById(task.getProcessDefinitionId());

ProcessInstance processIns = workflowService.getProcessInstance(task.getProcessInstanceId());
// 当前活动
ActivityImpl activityImpl = workflowService.getActivityImpl(processDefEntity, processIns);
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>查看当前流程图</title>
</head>
<body>
	<div>
		<img alt="流程图" src="./act/ActWorkflow-viewPng.action?id=<%=processDefEntity.getDeploymentId() %>" />
	</div>
	<div style="position: absolute;border:2px solid red;top:<%=activityImpl.getY()+38 %>px;left:<%=activityImpl.getX()+5 %>px;width:<%=activityImpl.getWidth() %>px;height:<%=activityImpl.getHeight() %>px;"> </div>
</body>
</html>