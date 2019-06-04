<%@page import="com.abm.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<body>
		<form id="range_form" method="post">
			<input id="range_id" name="projectRangeModel.id" type="hidden" />
			
			<div class="lbcxtj">
				<label>项目名称：</label> 
				<input id="pname" name="projectRangeModel.project_name" type="hidden" />
				<select id="pid" name="projectRangeModel.project_id" class="mwsmartui-combobox" data-options="
					onSelect:projectRange.select_xm,
					width:'430px',
					height:'30px',
					url:'./Project-listForCombobox3.action',
					textField:'name',
					valueField:'id',
					required:true">
				</select>
			</div>

			<div class="lbcxtj">
				<label>班次名称：</label> 
				<input id="range_name" name="projectRangeModel.name" class="mwsmartui-textbox" data-options="width:'170px',height:'30px',required:true" />
			</div>

			<div class="lbcxtj">
				<label>班次人数：</label> 
				<input id="range_num" name="projectRangeModel.num" class="mwsmartui-numberbox" data-options="width:'170px',height:'30px'" />
			</div>
			
			<div class="lbcxtj">
				<label>开始时间：</label> 
				<input id="range_start_time" name="projectRangeModel.shift_starttime" class="mwsmartui-timespinner" data-options="width:'170px',height:'30px',required:true" />
			</div>

			<div class="lbcxtj">
				<label>结束时间：</label> 
				<input id="range_end_time" name="projectRangeModel.shift_endtime" class="mwsmartui-timespinner" data-options="width:'170px',height:'30px',required:true" />
			</div>
			<fieldset style="padding: 0px">
					<legend>上班考勤时段</legend>
			<div class="lbcxtj">
				<label>开始考勤：</label> 
				<input id="range_start_start" name="projectRangeModel.start_start" class="mwsmartui-timespinner" data-options="width:'170px',height:'30px',required:true" />
			</div>
			
			<div class="lbcxtj">
				<label>结束考勤：</label> 
				<input id="range_start_end" name="projectRangeModel.start_end" class="mwsmartui-timespinner" data-options="width:'170px',height:'30px',required:true" />
			</div>
			</fieldset>
			
			<fieldset style="padding: 0px">
					<legend>下班考勤时段</legend>

			<div class="lbcxtj">
				<label>开始考勤：</label> 
				<input id="range_end_start" name="projectRangeModel.end_start" class="mwsmartui-timespinner" data-options="width:'170px',height:'30px',required:true" />
			</div>

			<div class="lbcxtj">
				<label>结束考勤：</label> 
				<input id="range_end_end" name="projectRangeModel.end_end" class="mwsmartui-timespinner" data-options="width:'170px',height:'30px',required:true" />
			</div>
			</fieldset>

			<div class="lbcxtj">
				<label>排序：</label> 
				<input id="range_range" name="projectRangeModel.shift_range" class="mwsmartui-numberbox" data-options="width:'170px',height:'30px',required:true" />
			</div>

			<div class="lbcxtj" style="height: 120px;">
				<label>备注：</label> 
				<input id="range_bak" name="projectRangeModel.bak" class="mwsmartui-textbox" data-options="width:'430px',height:'90px',multiline:true"/>
			</div>

		</form>
	</body>
</html>
