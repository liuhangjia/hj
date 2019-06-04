<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="com.abm.common.model.WorkAttendanceItemModel"%>
<%@page import="java.util.List"%>
<%@page import="com.abm.common.service.WorkAttendanceService"%>
<%@page import="com.mw.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<style>
	.kaoqing,.kaoqing tr th,.kaoqing tr td { border:1px solid #bab9bf; }
	.kaoqing{ margin:0px auto; padding:0px; width: 98%; min-height: 30px; line-height: 28px; text-align: center; border-collapse: collapse;}   
	.kaoqing tr th{font-size:14px; font-weight:600; background-color:#efefef; line-height: 28px;}
	.kaoqing tr td{font-size:18px; line-height: 28px;}
</style>
<%
	String id = (String)request.getParameter("id");
	if(StringUtil.isEmpty(id)){
		out.print("参数为空");
		return;
	}
	List<WorkAttendanceItemModel> list = WorkAttendanceService.getSingle().queryById3(id);
	if(null==list || list.isEmpty()){
		out.print("查询结果为空");
		return;
	}
	
	//标题
	String title = WorkAttendanceService.getSingle().makeName(id);
	
	//日期顺序
	List<String> dates = WorkAttendanceService.getSingle().queryDates(id);
	
	String thead = "<th style='width:80px;'>姓名</th>";
	for(String s:dates){
		String date=s.substring(s.length()-2);
		thead += "<th>"+date+"</th>";
	}
	//人的顺序
	List<String> emps = WorkAttendanceService.getSingle().queryEmp(id);
	//获取名字
	Map<String,String> names = new HashMap<String,String>();
	for(String e:emps){
		for(WorkAttendanceItemModel w:list){
			if(StringUtil.eq(e, w.getEmp_id())){
				names.put(e, w.getName());
				break;
			}
		}
	}
	//状态对应
	//(0出勤 3休假 4事假 5病假 6旷工 7迟到 10加班）
	Map<String,String> status = new HashMap<String,String>();
	//status.put("0", "出勤");
	status.put("0", "√");
	//status.put("3", "休假");
	status.put("3", "●");
	//status.put("4", "事假");
	status.put("4", "○");
	//status.put("5", "病假");
	status.put("5", "☆");
	//status.put("6", "旷工");
	status.put("6", "×");
	//status.put("7", "迟到");
	status.put("7", "※");
	//status.put("10", "加班");
	status.put("10", "+");
	//替班
	status.put("11","T");
	
	StringBuffer tbody = new StringBuffer();
	for(String e:emps){
		tbody.append("<tr>");
		tbody.append("<td style='font-size: 14px;'>"+names.get(e)+"</td>");
		for(String d:dates){
			for(WorkAttendanceItemModel w:list){
				if(StringUtil.eq(e, w.getEmp_id())&&StringUtil.eq(d, w.getWork_time().split(" ")[0])){
					if(StringUtil.isEmpty(w.getDetail())){
						tbody.append("<td> </td>");
					}else if(StringUtil.eq(w.getDetail(),"0")){
						tbody.append("<td>"+status.get(w.getDetail())+"</td>");	
					}else{
						tbody.append("<td><font color=\"red\">"+status.get(w.getDetail())+"</font></td>");	
					}
					break;
				}
			}
		}
		tbody.append("</tr>");
	}
%>
<div>
	<div style="text-align: center; font-size: 18px;  margin-bottom: 10px;"><%=title %></div>
	<table class="kaoqing">
		<thead>
			<tr>
				<%=thead %>
			</tr>
		</thead>
		<tbody>
			<%=tbody.toString() %>
		</tbody>
	</table>
	<br/>
	<div>
		<div>&nbsp;&nbsp;&nbsp;<label><b>表单说明	</b></label>	出勤:√	休假:●	事假:○	病假:☆	旷工:×	迟到:※	加班:+	替班:T</div>
	</div>
</div>

