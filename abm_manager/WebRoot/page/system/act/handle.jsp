<%@page import="com.abm.common.utils.Constants"%>
<%@page import="com.mw.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String businessId = request.getParameter("businessId");
	String key = request.getParameter("key");
	if(StringUtil.isEmpty(businessId) || StringUtil.isEmpty(key)){
		out.print("请输入业务id");
		return;
	}
	String formPage = request.getParameter("formPage");
	if(StringUtil.isEmpty(formPage)){
		out.print("form page is null");
		return;
	}
	String status = request.getParameter("status");
	String _view = request.getParameter("view");
	boolean view = true;
	try{
		view = Boolean.parseBoolean(_view);
	}catch(Exception e){
		view = true;
	}
	status = StringUtil.isEmpty(status)?"1":status;
	
	/**
	// 当前活动完成之后的连线
	List<PvmTransition> pvmList = activity.getOutgoingTransitions();
	// 连线名称集合
	List<String> names = new ArrayList<String>();
	if(null != pvmList && !pvmList.isEmpty()){
		for(PvmTransition pvm : pvmList){
			String name = (String)pvm.getProperty("name");
			if(StringUtil.isNotEmpty(name)){
				names.add(name);
			}else{
				names.add("默认提交");
			}
		}
	}
	**/
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>流程处理界面</title>
</head>
<body>
	<div class="mwsmartui-panel" data-options="fit:true,border:false">
		<div class="mwsmartui-tabs" data-options="fit:true,border:false">
			<div data-options="title:'表单信息'">
				<jsp:include page="<%=formPage %>">
					<jsp:param value="<%=businessId %>" name="id"/>
					<jsp:param value="<%=status %>" name="status"/>
				</jsp:include>
			</div>
			<%
				if(!view && StringUtil.eq(status, String.valueOf(Constants.SP_INIT))){
			%>
			<div data-options="title:'审批意见'">
				<label>审批意见：</label>
				<input id="comment" class="mwsmartui-textbox" data-options="multiline:true,width:'95%',height:'260px'"/>
			</div>
			<%		
				}
			%>
			
			
			<div data-options="title:'图形流程节点'">
				<jsp:include page="current_png_businesskey.jsp">
					<jsp:param value="<%=businessId %>" name="id"/>
				</jsp:include>	
			</div>
			<div data-options="title:'流程记录'">
				<jsp:include page="comment.jsp">
					<jsp:param value="<%=businessId %>" name="id"/>
				</jsp:include>
			</div>
		</div>
	</div>
</body>
</html>