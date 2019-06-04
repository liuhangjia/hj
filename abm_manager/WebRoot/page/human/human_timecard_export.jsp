<%@page import="java.util.ArrayList"%>
<%@page import="com.abm.common.model.WorkAttendanceListModel"%>
<%@page import="java.util.List"%>
<%@page import="com.abm.common.service.WorkAttendanceService"%>
<%@page import="com.abm.common.utils.PrivUtil"%>
<%@page import="com.abm.common.utils.Constants"%>
<%@page import="com.abm.common.model.AccountsModel"%>
<%@page import="com.mw.common.utils.StringUtil"%>
<%@page import="java.util.Date"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% 
	String enterprise_id = request.getParameter("enterprise_id");
	String year = request.getParameter("year");
	String month = request.getParameter("month");
	
	StringBuffer condition = new StringBuffer();
	
	if(StringUtil.isNotEmpty(enterprise_id)){
		condition.append(" and work_attendance.enterprise_id =  '"+enterprise_id + "'");
	}
	if(StringUtil.isNotEmpty(year)){
		condition.append(" and work_attendance.year =  '"+year + "'");
	}
	if(StringUtil.isNotEmpty(month)){
		condition.append(" and work_attendance.month =  '"+month + "'");
	}
	
	AccountsModel currentUser = (AccountsModel)(session.getAttribute(Constants.USER));
	condition.append(PrivUtil.getConditionForEnterprise(currentUser, "WORK_ATTENDANCE_MANAGER_LIST"));
	condition.append(" group by work_attendance.enterprise_id,work_attendance.year,work_attendance.month ");
	
	List<WorkAttendanceListModel> list = WorkAttendanceService.getSingle().queryByPage1(condition.toString(), null, 1, Integer.MAX_VALUE);
	if(null==list){
		list = new ArrayList<WorkAttendanceListModel>();
	}
	
	response.setContentType("application/vnd.ms-excel");
	String fileName = "考勤数据";
	SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
	fileName += sdf.format(new Date());
	response.setHeader("Content-Disposition", "inline; filename="+ new String(fileName.getBytes(),"ISO8859-1") +".xls");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
	<body>
		<table border="1" cellspacing="0" cellpadding="0" style="border-color: #c1c1c1;border-collapse: collapse; text-align:center; ">
				<tr height="35px;" style="font-size:20px;">
					<th width="50px" align="center">企业名称</th>
					<th width="50px" align="center">年月</th>
					<th width="50px" align="center">人次/人数</th>
					<th width="50px" align="center">出勤人次/人数</th>
					<th width="50px" align="center">休假人次/人数</th>
					<th width="50px" align="center">事假人次/人数</th>
					<th width="50px" align="center">病假人次/人数</th>
					<th width="50px" align="center">旷工人次/人数</th>
					<th width="50px" align="center">迟到人次/人数</th>
					<th width="50px" align="center">加班人次/人数</th>
					<th width="50px" align="center">替班人次/人数</th>
				</tr>
			<%
				if(null!=list && !list.isEmpty()){
					for(WorkAttendanceListModel model:list){
						out.print("<tr>");
						String str = "";
						//企业名称
						str = model.getEnterpriseModel().getName();
						if(StringUtil.isNotEmpty(str)){
							out.print("<td>"+str+"</td>");
						}else{
							out.print("<td></td>");
						}
						//年月
						if(StringUtil.isNotEmpty(model.getYear())&&StringUtil.isNotEmpty(model.getMonth())){
							out.print("<td>"+model.getYear()+"\\"+model.getMonth()+"</td>");
						}else{
							out.print("<td></td>");
						}
						//人次amount
						out.print("<td>"+model.getAmount()+"\\"+model.getAmount_()+"</td>");
						//出勤normal
						out.print("<td>"+model.getNormal()+"\\"+model.getNormal_()+"</td>");
						//休假vacation
						out.print("<td>"+model.getVacation()+"\\"+model.getVacation_()+"</td>");
						//事假leaves
						out.print("<td>"+model.getLeaves()+"\\"+model.getLeaves_()+"</td>");
						//病假sick
						out.print("<td>"+model.getSick()+"\\"+model.getSick_()+"</td>");
						//旷工absence
						out.print("<td>"+model.getAbsence()+"\\"+model.getAbsence_()+"</td>");
						//迟到late
						out.print("<td>"+model.getLate()+"\\"+model.getLate_()+"</td>");
						//加班overtime
						out.print("<td>"+model.getOvertime()+"\\"+model.getOvertime_()+"</td>");
						//替班replace
						out.print("<td>"+model.getReplace()+"\\"+model.getReplace_()+"</td>");
						out.print("</tr>");
					}
				}
			%>
		</table>
		
	</body>
</html>
