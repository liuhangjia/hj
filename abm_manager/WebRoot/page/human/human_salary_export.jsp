<%@page import="net.sf.json.JSONObject"%>
<%@page import="net.sf.json.JSONArray"%>
<%@page import="com.abm.common.dao.PayrollTemplateItemDao"%>
<%@page import="com.abm.common.model.PayrollTemplateItemModel"%>
<%@page import="com.abm.common.dao.PayrollTemplateDao"%>
<%@page import="com.abm.common.model.PayrollTemplateModel"%>
<%@page import="com.mw.common.utils.StringUtil"%>
<%@page import="com.abm.common.dao.PayrollDetailDao"%>
<%@page import="com.abm.common.model.PayrollDetailModel"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
String payrollId = request.getParameter("id");
String year = request.getParameter("year");
String month = request.getParameter("month");
String fileName = year + "年" + month + "月工资单";
if(StringUtil.isNotEmpty(payrollId)){
	List<PayrollDetailModel> details = PayrollDetailDao.getSingle().executeQuery(" and payroll_id = ? ", new String[]{payrollId});
	if(null != details && details.size() > 0){
		String tempId = details.get(0).getTemplate_id();
		if(StringUtil.isNotEmpty(tempId)){
			List<PayrollTemplateItemModel> templateItemModels = PayrollTemplateItemDao.getSingle().executeQuery(" and payroll_template_item.template_id = ? order by seq asc", new String[]{tempId});		
 %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
	<body>
		<table border="1" cellspacing="0" cellpadding="0" style="border-color: #c1c1c1;border-collapse: collapse; text-align:center; ">
			<tr><th colspan="<%=templateItemModels.size() %>" style="font-size:22px; text-align:center;"><%=fileName %></th></tr>
			<tr height="35px;" style="font-size:16px;">
				<% 
				if(null != templateItemModels && templateItemModels.size() > 0){ 
					for(PayrollTemplateItemModel model : templateItemModels){
				%>
				<th width="50px" align="center"><%=model.getName() %></th>
				<%
					}
				} 
				%>
			</tr>
			<%
			for(PayrollDetailModel detail : details){
				JSONArray arr = JSONArray.fromObject(detail.getDetail());
				out.print("<tr>");
				if(null != arr && arr.size() > 0){
					for(int i = 0; i < arr.size(); i++){
						JSONObject json = arr.getJSONObject(i);
						String name = json.optString(String.valueOf(i));
						if(StringUtil.isNotEmpty(name)){
							out.print("<td>"+name+"</td>");
						}else{
							out.print("<td></td>");
						}
					}
				}
				out.print("</tr>");
			}
			%>
		</table>
	</body>
</html>
<%
		}
	}
	response.setContentType("application/vnd.ms-excel");
	response.setHeader("Content-Disposition", "inline; filename="+ new String(fileName.getBytes(),"ISO8859-1") +".xls");
}
%>