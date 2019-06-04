<%@page import="com.abm.common.act.service.ActWorkflowService"%>
<%@page import="com.abm.common.dao.ActRunInstanceDao"%>
<%@page import="com.abm.common.model.ActRunInstanceModel"%>
<%@page import="java.util.List"%>
<%@page import="com.mw.common.utils.StringUtil"%>
<%@page import="org.activiti.engine.impl.pvm.process.ActivityImpl"%>
<%@page import="org.activiti.engine.runtime.ProcessInstance"%>
<%@page import="org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity"%>
<%@page import="org.activiti.engine.task.Task"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
String businessId = request.getParameter("id");
List<ActRunInstanceModel> models = ActRunInstanceDao.getSingle().executeQuery(" and business_id_ = ? ",new String[]{businessId});
ActRunInstanceModel model = null;
if(null != models && !models.isEmpty()){
	model = models.get(0);
}
if(null == model){
	out.print("运行实例信息不存在");
	return;
}
ActWorkflowService workflowService = ActWorkflowService.getSingle();
ProcessInstance processInstance = workflowService.getProcessInstanceByBusinessKey(model.getDefinition_key_()+"."+model.getBusiness_id_());
int x = 0,y = 0 ,w = 0,h = 0;

%>
<div class="mwsmartui-panel" data-options="fit:true,border:false">
	<div>
		<img alt="流程图" src="./act/ActWorkflow-viewPng.action?id=<%=model.getDeployment_id_() %>" />
	</div>
	<%
		if(null != processInstance){
			ProcessDefinitionEntity processDefinition = (ProcessDefinitionEntity)workflowService.getProcessDefinitionById(model.getDefinition_id_());
			// 当前活动
			ActivityImpl activityImpl = workflowService.getActivityImpl(processDefinition, processInstance);
			if(null != activityImpl){
				x = activityImpl.getX();
				y = activityImpl.getY();
				w = activityImpl.getWidth();
				h = activityImpl.getHeight();
	%>
	<div style="position: absolute;border:2px solid red;top:<%=y+70 %>px;left:<%=x+6 %>px;width:<%=w %>px;height:<%=h %>px;"> </div>
	<%			
			}
		}
	%>
</div>

