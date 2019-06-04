<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page import="java.util.Calendar"%>
<%
String id = request.getParameter("id");
 %>
<div class="mwsmartui-layout" data-options="fit:true,border:false">
	<div data-options="region:'north',height:'100%',border:false">
		<form id="human_salary_add_form" method="post" enctype = "multipart/form-data">
			<fieldset>
				<legend>工资单信息</legend>
				<input id="salary_add_id" name="payrollModel.id" type="hidden"/>
				<div class="lbcxtj" style="width:450px">
					<label style="display:inline-block; width:100px; text-align:right;">名称：</label>
					<input id="salary_add_name" name="payrollModel.name" class="mwsmartui-textbox" data-options="width:'340px',height:'30px',prompt:'',required:true">
				</div>
				<div class="lbcxtj" style="width:225px">
					<label style="display:inline-block; width:100px; text-align:right;">年份：</label>
					<select id="salary_add_year" name="payrollModel.year"  class="mwsmartui-combobox" data-options="width:'120px',height:'30px',required:true" >
		                <option value="">请选择</option>
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
				<div class="lbcxtj" style="width:225px">
					<label style="display:inline-block; width:90px; text-align:right;">月份：</label>
					<select id="salary_add_month" name="payrollModel.month" class="mwsmartui-combobox" data-options="width:'120px',height:'30px',required:true" >
		                <option value="">请选择</option>
		                <%for(int i = 1; i <= 12; i++){ %>
		                	<option value="<%=i %>"><%=i %></option>
		                <%} %>
	               </select>
				</div>
				<div id="salary_add_enterprise_hidden" class="lbcxtj" style="width:450px">
					<label style="display:inline-block; width:100px; text-align:right;">所属企业：</label>
					<select id="salary_add_enterprise_id" class="mwsmartui-combobox" data-options="
						width:'340px',
						height:'30px',
						url:'./Enterprise-listForPriv.action?priv=SYS_PAYROLL_TEMPLATE_LIST',
						textField:'name',
						valueField:'id',
						onSelect:humanSalary.salary_enterprise,
						required:true">
					</select>
				</div>
				<div id="salary_add_model_hidden" class="lbcxtj" style="width:450px">
					<label style="display:inline-block; width:100px; text-align:right;">选择模板：</label>
					<select id="salary_add_model" name="ids" class="mwsmartui-combobox" data-options="
						prompt:'请先选择企业',
						width:'340px',
						height:'30px',
						textField:'name',
						valueField:'id',
						required:true">
					</select>
				</div>
				<div id="salary_add_templateFile_hidden" class="lbcxtj" style="width:450px">
					<label style="display:inline-block; width:100px; text-align:right;">模板上传：</label>
					<input id="salary_add_templateFile" name="uploadFile" class="mwsmartui-filebox" data-options="width:'340px',height:'30px',prompt:'',required:true,buttonText:'选择文件'">
				</div>
			</fieldset>
		</form>
	</div>
</div>
