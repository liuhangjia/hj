<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<body>
	<form id="" method="post">
		<input type="hidden" name="project.id"/>
		<div class="lbcxtj">
			<label>所属企业：</label> 
			<select id="project_enterprise_id" name="project.enterprise_id" class="mwsmartui-combobox" data-options="
				width:'370px',
				height:'30px',
				url:'./Enterprise-listForProject.action',
				textField:'name',
				valueField:'id',
				required:true">
				
			</select>
		</div>
		<div class="lbcxtj">
			<label>项目名称：</label> 
			<input name="project.name" class="mwsmartui-textbox" data-options="width:'370px',height:'30px',required:true" />
		</div>
		<div class="lbcxtj">
			<label>项目编号：</label> 
			<input name="project.sn" class="mwsmartui-textbox" data-options="width:'140px',height:'30px',required:true" />
		</div>
		<div class="lbcxtj">
			<label>类别：</label> 
			<select name="project.type"  class="mwsmartui-combobox"  data-options="data:common.listCodesByType('XMLB'),
	                 																					valueField:'code',
	                 																					textField:'name',
	                 																					width:'140px',height:'30px'" >
	        </select>
		</div>
		<div class="lbcxtj">
			<label>项目级别：</label> 
			<select name="project.level"  class="mwsmartui-combobox"  data-options="data:common.listCodesByType('XMJB'),
	                 																					valueField:'code',
	                 																					textField:'name',
	                 																					width:'140px',height:'30px'" >
	        </select>
		</div>
		<div class="lbcxtj">
			<label>项目区域：</label> 
			<input name="project.area" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'" />
		</div>

		<div class="lbcxtj">
			<label>启动时间：</label> 
			<input name="project.start_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'"/>
		</div>
		<div class="lbcxtj">
			<label>结束时间：</label> 
			<input name="project.end_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'"/>
		</div>

		<div class="lbcxtj">
			<label>项目状态：</label>
			<input name="project.status" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'"/> 
		</div>
		<div class="lbcxtj" style="height: 120px;">
			<label>备注：</label> 
			<input name="project.bak" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true"/>
		</div>

	</form>
</body>
</html>
