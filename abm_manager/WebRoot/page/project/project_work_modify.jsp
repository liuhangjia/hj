<%@page import="com.abm.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String work_id = request.getParameter("work_id");
	if(StringUtil.isEmpty(work_id)){
		work_id="";
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<body>
		<div id="project_checking_item_list_toolbar">
				<fieldset style="height:215px">
					<legend>信息</legend>
					<form id="work_modify_form" method="post" >
			            <div class="lbcxtj" >
			                <label >项目：</label><%-- style="width:90px;" --%>
			            	<select id="xmmc_select" name="project_id" class="mwsmartui-combobox"  data-options="required:true,valueField:'id',
			            																				textField:'name',
			            																				width:'370px',height:'30px'" >
			                
			                </select>
			            </div>
			            <div class="lbcxtj" >
			                <label >检查人：</label>
			                <input id="checker_id" name="checker_id" type="hidden" />
			                <input id="checker_name" name="checker_name" class="mwsmartui-textbox" data-options="required:true,
			                	buttonText:'选择',
			                	onClickButton:projectWork.selectEmp,
			                	width:'370px',height:'30px'">
			            </div>
			            <div class="lbcxtj" >
			                <label>检查类型：</label>
			            	<select id="type" name="type"  class="mwsmartui-combobox"  data-options="data:common.listCodesByType('GZJCLX'),
	                 																					valueField:'code',
	                 																					textField:'name',
	                 																					width:'140px',height:'30px'" >
	        				</select>
			            </div>
			            <div class="lbcxtj">
							<label>检查时间：</label> 
							<input id="check_time" name="check_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'"/>
						</div>
			            <div class="lbcxtj">
			                <label>检查情况：</label>
			                <input id="bak" name="bak"  class="mwsmartui-textbox" data-options="width:'370px',height:'90px',multiline:true">
			            </div>
		            </form>
				</fieldset>
				<div class="toolbar-btn">
					<div class="btn-left">
						<a href="#" class="mwsmartui-linkbutton" data-options="work_id:'<%=work_id %>',onClick:projectWork.modifyItem"><i class="fa fa-plus"> </i> 添加</a>
                    	<a href="#" class="mwsmartui-linkbutton" data-options="work_id:'<%=work_id %>',onClick:projectWork.delItem"><i class="fa fa-trash"> </i> 删除</a>
					</div>
				</div>
			</div>
			
	        <table id="project_checking_item_list" class="mwsmartui-datagrid" style="height:500px;" data-options="
	            
	            pagination:true,
				pageSize:10,
				selectOnCheck:true,
				fileOnSelect:true,
				singleSelect:true,
				border:false,
				striped:true,
				
				method:'post',
				url:'./ProjectChecking-itemList.action?work_id=<%=work_id %>',
	            scrollbarSize:40,
				toolbar:'#project_checking_item_list_toolbar'">
	            <thead>
	                <tr>
	               		<th data-options="field:'id',checkbox:true">id</th>
	                    <th data-options="field:'content',width:'60%'"><b>检查内容</b></th>
	                    <th data-options="field:'result',width:'20%'"><b>检查结果</b></th>
	                    <%--
	                    <th data-options="field:'handle_result',width:'40%'"><b>处理说明</b></th>
	                     --%>
	                    <th data-options="field:'status',width:'20%',formatter:projectWork.itemListOpts"><b>操作</b></th>
	                </tr>
	            </thead>
	        </table>
</body>
</html>
