<%@page import="com.abm.common.service.ActFlowStepService"%>
<%@page import="com.abm.common.model.ActFlowStepModel"%>
<%@page import="com.mw.common.utils.StringUtil"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String businessId = request.getParameter("id");
	List<ActFlowStepModel> steps = ActFlowStepService.getSingle().listByBusinessId(businessId);
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>流程操作记录</title>
</head>
<body>
	<div class="mwsmartui-panel" data-options="fit:true,border:false">
		<table class="mwsmartui-datagrid" data-options="fit:true,border:false,scrollbarSize:0,singleSelect:true">
			<thead>
				<tr>
					<th data-options="field:'col1',width:'20%',align:'center'"><b>时间</b></th>
					<th data-options="field:'col2',width:'20%',align:'center'"><b>节点</b></th>
					<th data-options="field:'col3',width:'20%',align:'center'"><b>结果</b></th>
					<th data-options="field:'col4',width:'20%',align:'center'"><b>意见</b></th>
					<th data-options="field:'col5',width:'20%',align:'center'"><b>处理人</b></th>
				</tr>
			</thead>
			<tbody>
				<%
					if(null != steps && !steps.isEmpty()){
						for(ActFlowStepModel step : steps){
				%>
				<tr>
					<td><%=step.getOp_time_() %></td>
					<td><%=step.getTask_name_() %></td>
					<td><%=step.getLine_name_() %></td>
					<td><%=StringUtil.isEmpty(step.getResult_())?"":step.getResult_() %></td>
					<td><%=step.getOp_name_() %>(<%=step.getOp_jtbh_() %>)</td>
				</tr>
				<%			
						}
					}
				%>
			</tbody>
		</table>
	</div>
</body>
</html>