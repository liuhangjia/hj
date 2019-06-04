<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>企业基本信息</title>
</head>
<body>
	<div id="member_basic_div" class="mwsmartui-panel" data-options="border:false,fit:true">
		<form id="member_basic_form" method="post">
			<input type="hidden" name="member.id"/>
			<center>
				<fieldset style="width: 55%;margin-top:20px;">
					<legend>基本信息</legend>
					<table style="width: 70%;padding: 10px;margin: 5px;">
						<tr height="30px">
							<td style="width:80px;">类别</td>
							<td>
								<select name="member.type" class="mwsmartui-combobox" data-options="width:'100%',height: '28px',required:true,editable:false">
									<option value="1">个人</option>
									<option value="0">商铺</option>
								</select>
							</td>
						</tr>
						<tr height="30px">
							<td style="width:80px;">手机号</td>
							<td>
								<input name="member.phone" class="mwsmartui-textbox" data-options="width:'100%',height: '28px',required:true" />
							</td>
						</tr>
						<tr height="30px">
							<td style="width:80px;">姓名</td>
							<td>
								<input name="member.name" class="mwsmartui-textbox" data-options="width:'100%',height: '28px',required:true" />
							</td>
						</tr>
						<tr height="30px">
							<td style="width:80px;">地址</td>
							<td>
								<input name="member.address" class="mwsmartui-textbox" data-options="width:'100%',height: '28px'" />
							</td>
						</tr>
						<tr>
							<td style="width:80px;">经营范围</td>
							<td>
								<input name="member.business" class="mwsmartui-textbox" data-options="width:'100%',multiline:true,height:'80px'" />
							</td>
						</tr>
						<tr>
							<td style="width:80px;">备注</td>
							<td>
								<input name="member.bak" class="mwsmartui-textbox" data-options="width:'100%',multiline:true,height:'80px'" />
							</td>
						</tr>
						<tr height="60px">
							<td colspan="2" align="center">
								<a href="#" class="mwsmartui-linkbutton" data-options="onClick:saveMemberBasicInfo"><i class="fa fa-save"> </i> 修改基本信息</a>
							</td>
						</tr>
					</table>
				</fieldset>
			</center>
		</form>
	</div>
	<script type="text/javascript">
		setTimeout(function(){
			common.ajax('./Member-findCurrentMember.action',{},function(data){
				if(!$.isEmptyObject(data)){
					var obj = {};
					for(var p in data){
						obj['member.'+p] = data[p];
					}
					$('#member_basic_div #member_basic_form').form('load',obj);
				}else{
					$.messager.alert('提示','会员信息不存在','info');
				}
			});
		},100);
		
		var saveMemberBasicInfo = function(){
			$('#member_basic_div #member_basic_form').form('submit',{
				url:'./Member-saveBaseInfo.action',
				onSubmit:function(){
					return $(this).form('validate');
				},
				success:function(resp){
					resp = JSON.parse(resp);
					$.messager.alert('提示',resp['msg'],'info');
				}
			});
		}
		
	</script>
</body>
</html>