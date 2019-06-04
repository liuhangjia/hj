<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.Calendar"%>
<%@ page import="java.util.List"%>
<%@ page import="com.abm.common.dao.PayrollTemplateItemDao"%>
<%@ page import="com.abm.common.model.PayrollTemplateItemModel"%>
<%
String id = request.getParameter("id");
String status = request.getParameter("status");
List<PayrollTemplateItemModel> templateItemModels = PayrollTemplateItemDao.getSingle().executeQuery(" and payroll_template_item.template_id in (select payroll_detail.template_id from payroll_detail where payroll_detail.payroll_id in (select payroll.id from payroll where id = ? )) order by seq asc", new String[]{id});
 %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title></title>
	</head>

	<body>
		<div id="salary_detail_div" class="mwsmartui-panel" data-options="border:false,fit:true">
			<input id="salary_detail_status" type="hidden" value="<%=status%>"/>
			<div id="salary_list_detail_toolbar" class="toolbar-div">
				<%
				if(null == status || status.equals("0")){
				
				 %>
<%-- 		   		<div class="toolbar-btn"> -->
<!-- 					<div class="btn-left"> -->
<!-- 						<a href="#" id="salary_detail_save" class="mwsmartui-linkbutton"  data-options="onClick:humanSalary.salary_detail_doSave"><i class="fa fa-check"> </i> 保存</a> -->
<!-- 		                <a href="#" id="salary_detail_del" class="mwsmartui-linkbutton" data-options="onClick:humanSalary.salary_detail_doDel"><i class="fa fa-trash"> </i> 批量删除</a> -->
<!-- 					</div> -->
<!-- 					<div class="btn-right"> -->
<!-- 					</div> -->
<!-- 				</div> --%>
				<%
				}
				 %>
		    </div>
			<table id="salary_detail_list" class="mwsmartui-datagrid" data-options="pagination:true,
																					pageSize:20,
																					selectOnCheck:true,
																					checkOnSelect:false,
																					fileOnSelect:true,
																					singleSelect:false,
																					border:false,
																					striped:true,
																					fit:true,
																					method:'get'">
				<thead>
		        	<tr>
		            	<th data-options="field:'id',checkbox:true">ID</th>
		               	<% 
		               		if(null != templateItemModels && templateItemModels.size() > 0){ 
		               			int num = 100/templateItemModels.size();
		               			for(int i = 0; i < templateItemModels.size(); i++){
		               			PayrollTemplateItemModel model = templateItemModels.get(i);
		               	%>
		               				<th data-options="field:'<%=i %>',width:'120',editor:{type:'textbox'}"><b><%=model.getName() %></b></th>
		               	<% 
		                		}
		                	} 
		               	%>
		               </tr>
		           </thead>
			</table>
		</div>
	</body>
</html>
