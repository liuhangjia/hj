<%@ page language="java"  pageEncoding="UTF-8"%>
	<form id="" method="post">
		<input type="hidden" name="enterprise.id"/>
		<input type="hidden" name="enterprise.is_delete"/>
		<div class="lbcxtj">
			<label>企业名称：</label> 
			<input name="enterprise.name" class="mwsmartui-textbox" data-options="width:'370px',height:'30px'" />
		</div>
		<div class="lbcxtj">
			<label>联系人：</label> 
			<input name="enterprise.contact" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'"/>
		</div>
		<div class="lbcxtj">
			<label>联系电话：</label> 
			<input name="enterprise.phone" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'" />
		</div>
		<div class="lbcxtj">
			<label>地址：</label> 
			<input name="enterprise.address" class="mwsmartui-textbox" data-options="width:'370px',height:'30px'" />
		</div>

		<div class="lbcxtj">
			<label>开始时间：</label> 
			<input name="enterprise.start_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'" />
		</div>
		<div class="lbcxtj">
			<label>结束时间：</label> 
			<input name="enterprise.end_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'" />
		</div>
		<div class="lbcxtj">
			<label>接洽人：</label> 
			<input name="enterprise.operator" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'" />
		</div>
		<div class="lbcxtj" style="height: 120px;">
			<label>经营范围：</label> 
			<input name="enterprise.business" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true" />
		</div>
	</form>

