<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.Calendar"%>
<%

 %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
<div id="salary_div" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="salary_list_toolbar" class="toolbar-div">
    <fieldset>
	    <legend>查询条件:</legend>
            <form id="salary_queryform" method="post">
	           <div class="lbcxtj">
	               <label style="display:inline-block; width:100px; text-align:right;">企业：</label>
	               <select id="enterprise_id" class="mwsmartui-combobox" 
		                data-options="width:'145px',
		                				height:'30px',
		                				url:'./Enterprise-listForPriv.action?priv=SYS_PAYROLL_TEMPLATE_LIST	',
		                				valueField:'id',
		                				textField:'name'">
	               </select>
	           </div>  
	           
	           <div class="lbcxtj">
	               <label style="display:inline-block; width:100px; text-align:right;">名称：</label>
	               <input id="name" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
	           </div>  
	          
	           <div class="lbcxtj">
	               <label style="display:inline-block; width:100px; text-align:right;">年份：</label>
	               <select id="year" class="mwsmartui-combobox"  data-options="width:'145px',height:'30px'" >
	               	<option value="">--请选择--</option>
	                <% 
	                Calendar cal = Calendar.getInstance();
					int year = cal.get(Calendar.YEAR)-10;
					for(int i=1; i<=21; i++){ 
						String str = String.valueOf(year);
					%>
							<option value="<%=str%>"><%=str%></option>
					<%	
						year++;
					}
					%>		
	               </select>
	           </div>
	           
	           <div class="lbcxtj">
	               <label style="display:inline-block; width:100px; text-align:right;">月份：</label>
	               <select id="month" class="mwsmartui-combobox" data-options="width:'145px',height:'30px'" >
	               	<option value="">--请选择--</option>
	                <%for(int i = 1; i <= 12; i++){ %>
	                	<option value="<%=i %>"><%=i %></option>
	                <%} %>
	               </select>
	           </div>
	           <div class="lbcxtj">
	               <label style="display:inline-block; width:100px; text-align:right;">状态：</label>
	               <select id="status" class="mwsmartui-combobox" data-options="width:'145px',height:'30px'">
	                <option value="">--请选择--</option>
	                <option value="0">新建</option>
	                <option value="1">归档</option>
	               </select>
	           </div>
            </form>
          </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
				<a href="#" id="salary_add" class="mwsmartui-linkbutton"  data-options="onClick:humanSalary.salary_doAdd"><i class="fa fa-plus"> </i> 添加</a>
                <a href="#" id="salary_del" class="mwsmartui-linkbutton" data-options="onClick:humanSalary.salary_doDel"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" id="salary_search" class="mwsmartui-linkbutton"  data-options="onClick:humanSalary.salary_doSearch"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" id="salary_reset" class="mwsmartui-linkbutton"  data-options="onClick:humanSalary.salary_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="salary_list" class="mwsmartui-datagrid" data-options="
	            pagination:true,
				pageSize:20,
				selectOnCheck:true,
				checkOnSelect:false,
				fileOnSelect:true,
				singleSelect:false,
				border:false,
				striped:true,
				fit:true,
				url:'./HumanSalary-list.action',
				method:'post',
	            scrollbarSize:38,
				toolbar:'#salary_list_toolbar',
				onCheck:humanSalary.togglePlsc,
				onUncheck:humanSalary.togglePlsc,
				onCheckAll:humanSalary.togglePlsc,
				onUncheckAll:humanSalary.togglePlsc,
				onLoadSuccess:humanSalary.togglePlsc">
        	<thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
               		<th data-options="field:'enterprise_id',width:'20%',formatter:function(value,row){if(row['enterpriseModel']){return row['enterpriseModel']['name'];}}"><b>企业</b></th>
                    <th data-options="field:'name',width:'15%'"><b>名称</b></th>
                    <th data-options="field:'year',width:'10%'"><b>年</b></th>
                    <th data-options="field:'month',width:'10%'"><b>月</b></th>
                    <th data-options="field:'status',width:'7%',formatter:function(value){return value=='0'?'新建':'归档'}"><b>状态</b></th>
                    <th data-options="field:'create_time',width:'10%',formatter:common.fmt_date10"><b>时间</b></th>
                    <th data-options="field:'xx',width:'28%',formatter:humanSalary.salary_doHandle"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
