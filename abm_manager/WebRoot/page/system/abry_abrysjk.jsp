<%@ page language="java"  pageEncoding="UTF-8"%>
<body>
	<script type="text/javascript" src="./js/employee.js"></script>
	<div id="abry_abrysjk_content" style="width: 100%; height: 100%;">
		<div class="mwsmartui-panel" data-options="border:false,fit:true">
			<div id="abry_abrysjk_list_toolbar" class="toolbar-div">
				<fieldset>
					<legend>查询条件</legend>
					<form id="abry_abrysjk_queryform" method="post">
						<div class="lbcxtj">
							<label style="display: inline-block; width: 100px; text-align: right;">姓名：</label>
							<input id="abry_abrysjk_search_name" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''" />
						</div>
						<div class="lbcxtj">
							<label style="display: inline-block; width: 100px; text-align: right;">星级：</label>
							<input id="abry_abrysjk_search_star" class="mwsmartui-numberbox" data-options="width:'145px',height:'30px',prompt:''" />
						</div>
						<div class="lbcxtj">
							<label style="display: inline-block; width: 100px; text-align: right;">性别：</label>
							<select id="abry_abrysjk_search_sex" class="mwsmartui-combobox"  data-options="data:common.listCodesByType('XB'),
	                 																					valueField:'code',
	                 																					textField:'name',
	                 																					width:'145px',height:'30px'" >
	                		</select>
						</div>
						<div class="lbcxtj">
							<label style="display: inline-block; width: 100px; text-align: right;">民族：</label>
							<select id="abry_abrysjk_search_mz" class="mwsmartui-combobox"  data-options="data:common.listCodesByType('MZ'),
	                 																			valueField:'code',
	                 																			textField:'name',
	               																				width:'145px',height:'30px'" >
	                		</select>
						</div>
						<div class="lbcxtj">
							<label style="display: inline-block; width: 100px; text-align: right;">政治面貌：</label>
							<select id="abry_abrysjk_search_zzmm" class="mwsmartui-combobox"  data-options="data:common.listCodesByType('ZZMM'),
	                 																				valueField:'code',
	                 																				textField:'name',
	               																					width:'145px',height:'30px'" >
	               
	                		</select>
						</div>
						<div class="lbcxtj">
							<label style="display: inline-block; width: 100px; text-align: right;">电话：</label>
							<input id="abry_abrysjk_search_phone" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''" />
						</div>
						<div class="lbcxtj">
							<label style="display: inline-block; width: 100px; text-align: right;">至少体重(kg)：</label>
							<input id="abry_abrysjk_search_weight" class="mwsmartui-numberbox" data-options="width:'145px',height:'30px',prompt:''" />
						</div>
						<div class="lbcxtj">
							<label style="display: inline-block; width: 100px; text-align: right;">至少身高(cm)：</label>
							<input id="abry_abrysjk_search_height" class="mwsmartui-numberbox" data-options="width:'145px',height:'30px',prompt:''" />
						</div>
						<div class="lbcxtj">
							<label style="display: inline-block; width: 100px; text-align: right;">年龄范围：</label>
							<input id="abry_abrysjk_search_age_min" class="mwsmartui-numberbox" data-options="width:'145px',height:'30px',prompt:''" />
						</div>
						<div class="lbcxtj">
							<label style="display: inline-block; width: 40px; min-width: 40px; text-align: center;">~</label>
							<input id="abry_abrysjk_search_age_max" class="mwsmartui-numberbox" data-options="width:'145px',height:'30px',prompt:''" />
						</div>
					</form>
				</fieldset>
				<div class="toolbar-btn">
					<div class="btn-left">
						<a href="#" class="mwsmartui-linkbutton" data-options="onClick:abry_abrysjk_add"><i class="fa fa-plus"> </i> 添加</a> 
						<%--
						<a href="#"  class="mwsmartui-linkbutton" data-options="onClick:abry_abrysjk_plsc"><i class="fa fa-trash"> </i> 批量删除</a> 
						<a href="#" class="mwsmartui-linkbutton" data-options="onClick:abry_abrysjk_import"><i class="fa fa-sign-in"> </i> 批量导入</a> 
						 --%>
						<a href="#" class="mwsmartui-linkbutton" data-options="onClick:abry_abrysjk_export"><i class="fa fa-sign-out"> </i> 导出</a>
					</div>
					<div class="btn-right">
						<a href="#" class="mwsmartui-linkbutton" data-options="onClick:abry_abrysjk_search"><i class="fa fa-search"> </i> 查询</a> 
						<a href="#" class="mwsmartui-linkbutton" data-options="onClick:abry_abrysjk_reset"><i class="fa fa-refresh"> </i> 重置</a>
					</div>
				</div>
			</div>
			<table id="abry_abrysjk_list" class="mwsmartui-datagrid" data-options="pagination:true,
																				pageSize:20,
																				selectOnCheck:true,
																				fileOnSelect:true,
																				singleSelect:false,
																				border:false,
																				striped:true,
																				fit:true,
																				url:'./Employee-listAbry.action',
																				method:'post',
																	            scrollbarSize:157,
																				toolbar:'#abry_abrysjk_list_toolbar'">
				<thead>
					<tr>
						<th data-options="field:'id',checkbox:true">选择</th>
						<th data-options="field:'name',width:'15%'"><b>姓名</b></th>
						<th data-options="field:'star',width:'7%'"><b>星级</b></th>
						<th data-options="field:'birthday',width:'10%',formatter:common.fmt_date10"><b>出生日期</b></th>
						<th data-options="field:'sex',width:'7%',formatter:function(value){return common.codeToName('XB',value);}"><b>性别</b></th>
						<th data-options="field:'nation',width:'7%',formatter:function(value){return common.codeToName('MZ',value);} "><b>民族</b></th>
						<th data-options="field:'political',width:'9%',formatter:function(value){return common.codeToName('ZZMM',value);}"><b>政治面貌</b></th>
						<th data-options="field:'phone',width:'10%'"><b>联系电话</b></th>
						<th data-options="field:'weight',width:'10%'"><b>体重(kg)</b></th>
						<th data-options="field:'height',width:'10%'"><b>身高(cm)</b></th>
						<th data-options="field:'register_time',width:'10%',formatter:function(value){return common.fmt_date(value);}"><b>注册时间</b></th>
						<th data-options="field:'status',width:'180',formatter:abry_abrysjk_doHandle"><b>操作</b></th>
					</tr>
				</thead>
			</table>
		</div>
	</div>
