<%@page import="com.abm.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String train_id = request.getParameter("train_id");
	if(StringUtil.isEmpty(train_id)){
		train_id="";
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<body>
		<div id="project_training_emp_list_toolbar">
				<fieldset style="height:250px">
					<legend>信息</legend>
					<form id="train_modify_form" method="post" >
 
			              <div class="lbcxtj" >
				                <label >项目：</label><%-- style="width:90px;" --%>
				            	<select id="xmmc_select" name="train.project_id" class="mwsmartui-combobox"  data-options="required:true,valueField:'id',
				            																				textField:'name',
				            																				width:'370px',height:'30px'" >
				                
				                </select>
				            </div>
				             <%--
				            <div class="lbcxtj" >
				                <label>项目类别：</label>
				               <select id="" class="mwsmartui-combobox" name="language" data-options="width:'140px',height:'30px'" >
				                <option value="1">监控</option>
				                <option value="0">巡检</option>
				                
				                </select>
				            </div> 
				              --%>
				            <div class="lbcxtj" >
				                <label>培训类型：</label>
					            <select name="train.type"  class="mwsmartui-combobox"  data-options="data:common.listCodesByType('PXLX'),
		                 																					valueField:'code',
		                 																					textField:'name',
		                 																					width:'140px',height:'30px'" >
		             			</select>
				            </div>
				            <div class="lbcxtj" >
				                <label>培训讲师：</label>
				                <input  name="train.teacher" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
				            
				            </div>
				           
				            <div class="lbcxtj">
				                <label>开始时间：</label>
				                <input  name="train.start_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px',multiline:true">
				            
				            </div>
				             <div class="lbcxtj" >
				                <label>结束时间：</label>
				                <input  name="train.end_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'">
				            
				            </div>
				           
				            <div class="lbcxtj">
				                <label>培训情况：</label>
				                <input  name="train.bak" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true">
				            
				            </div>
			                
			            </form>
				</fieldset>
				<%--
				<div class="toolbar-btn">
					<div class="btn-left">
						<a href="#" class="mwsmartui-linkbutton" data-options="train_id:'<%=train_id %>',onClick:projectWork.modifyemp"><i class="fa fa-plus"> </i> 添加</a>
                    	<a href="#" class="mwsmartui-linkbutton" data-options="train_id:'<%=train_id %>',onClick:projectWork.delemp"><i class="fa fa-trash"> </i> 删除</a>
					</div>
				</div>
				 --%>
			</div>
			
	        <table id="project_training_emp_list" class="mwsmartui-datagrid" data-options="
	            pagination:true,
				pageSize:10,
				selectOnCheck:true,
				fileOnSelect:true,
				singleSelect:true,
				border:false,
				striped:true,
				fit:true,
				method:'post',
				url:'./ProjectTraining-empList.action?train_id=<%=train_id %>',
	            scrollbarSize:40,
				toolbar:'#project_training_emp_list_toolbar'">
	            <thead>
	                <tr>
	               		<th data-options="field:'id',checkbox:true">ID</th>
	                    <th data-options="field:'name',width:'20%'"><b>姓名</b></th>
	                    <th data-options="field:'position',width:'20%'"><b>职务</b></th>
	                    <th data-options="field:'score',width:'20%'"><b>成绩</b></th>
	                    <th data-options="field:'bak',width:'40%'"><b>备注</b></th>
	                </tr>
	            </thead>
	        </table>
</body>
</html>
