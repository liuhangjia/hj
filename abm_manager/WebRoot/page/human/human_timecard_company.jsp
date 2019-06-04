<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String eid = (String)request.getParameter("enterprise_id");
	String year = (String)request.getParameter("year");
	String month = (String)request.getParameter("month");
%>
<div id="timecard_div2" class="mwsmartui-panel" data-options="border:false,fit:true">
       <table id="timecard_list2" class="mwsmartui-datagrid" data-options="pagination:true,
																			pageSize:30,
																			selectOnCheck:true,
																			checkOnSelect:false,
																			fileOnSelect:true,
																			singleSelect:false,
																			border:false,
																			striped:true,
																			fit:true,
																			url:'./Timecard-listResultForProject.action?enterprise_id=<%=eid %>&year=<%=year %>&month=<%=month %>',
																			method:'get',
																            scrollbarSize:120">
            <thead>
                <tr>
               		<th data-options="field:'ename',width:'12%',formatter:function(value,row){if(row['enterpriseModel']){return row['enterpriseModel']['name'];}}"><b>企业</b></th> 
               		<th data-options="field:'pname',width:'18%',formatter:function(value,row){if(row['projectModel']){return row['projectModel']['name'];}}"><b>项目</b></th> 
                    <th data-options="field:'ny',width:'7%',formatter:humanTimecard.timecard_ny"><b>年月</b></th>                    
                    <th data-options="field:'amount',width:'7%',formatter:function(value,row){return row['amount']+'/'+row['amount_']}"><b>人次/人数</b></th>                    
                    <th data-options="field:'normal',width:'7%',formatter:function(value,row){return row['normal']+'/'+row['normal_']}"><b>出勤人次/人数</b></th>
                    <th data-options="field:'vacation',width:'7%',formatter:function(value,row){return row['vacation']+'/'+row['vacation_']}"><b>休假人次/人数</b></th>
                    <th data-options="field:'leaves',width:'7%',formatter:function(value,row){return row['leaves']+'/'+row['leaves_']}"><b>事假人次/人数</b></th>
                    <th data-options="field:'sick',width:'7%',formatter:function(value,row){return row['sick']+'/'+row['sick_']}"><b>病假人次/人数</b></th>
                    <th data-options="field:'absence',width:'7%',formatter:function(value,row){return row['absence']+'/'+row['absence_']}"><b>旷工人次/人数</b></th>
                    <th data-options="field:'late',width:'7%',formatter:function(value,row){return row['late']+'/'+row['late_']}"><b>迟到人次/人数</b></th>
                    <th data-options="field:'overtime',width:'7%',formatter:function(value,row){return row['overtime']+'/'+row['overtime_']}"><b>加班人次/人数</b></th>
                    <th data-options="field:'replace',width:'7%',formatter:function(value,row){return row['replace']+'/'+row['replace_']}"><b>替班人次/人数</b></th>
                    <th data-options="field:'xx',width:'120px',formatter:humanTimecard.timecard_doHandle2"><b>操作</b></th>
                    
                </tr>
            </thead>
        </table>
  	</div>
