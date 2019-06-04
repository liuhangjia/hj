<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>

<input id="sgd_service_request_id" type="hidden"  />
 <div class="mwsmartui-layout" data-options="fit:true,border:false">
 	<%--
    <div data-options="border:false,region:'south',height:'45px'" style="text-align: center;padding:8px;" >
     
    <a href="#" class="mwsmartui-linkbutton" data-options="plain:true,toggle:true,onClick:pending_retList" 
    style=" border-color:#28b779 !important;background-color:#28b779 !important; color:#FFF"><i class="icon-share"> </i> 返回</a>
     <a href="#" class="mwsmartui-linkbutton" data-options=""><i class="icon-share"> </i> 暂存</a>
     <a href="#" class="mwsmartui-linkbutton" data-options=""><i class="icon-share"> </i> 提交</a>
    </div>
 	 --%>
    <div data-options="border:false,region:'center'" style=" padding:0px 10px 10px 10px;">
		    <fieldset>
	    		<legend>申请信息</legend>
					<div id="sqxx">
						<!--  
						<div class="lbcxtj">
					        <label style="font-weight: bold;">企业：</label>
					        <label style="text-align:left;" ></label>
					    </div>
						-->
					    <div class="lbcxtj">
					        <label style="font-weight: bold;">申请人：</label>
					        <label id="sqr" style="text-align:left;"></label>
					    </div>
					    <div class="lbcxtj">
					        <label style="font-weight: bold;">联系人：</label>
					        <label id="lxr" style="text-align:left;"></label>
					    </div>
					    <div class="lbcxtj">
					    	<label style="font-weight: bold;">联系方式：</label>
					        <label id="lxfs" style="text-align:left;"></label>
					    </div>
					    <div class="lbcxtj">
					    	<label style="font-weight: bold;">地址：</label>
					        <label id="dz" style="text-align:left;"></label>
					    </div>
					    <div class="lbcxtj">
					    	<label style="font-weight: bold;">开始时间：</label>
					        <label id="kssj" style="text-align:left;"></label>
					    </div>
					    <div class="lbcxtj">
					    	<label style="font-weight: bold;">结束时间：</label>
					        <label id="jssj" style="text-align:left;"></label>
					    </div>
					    <div class="lbcxtj">
					    	<label style="font-weight: bold;">备注：</label>
					        <label id="bak" style="text-align:left;"></label>
					    </div>
					    <%--
				        <div class="lbcxtj checkbox" style="clear:both;">
				        <label style="width:80px; text-align:right;" >申请应用：</label>
				              <label>
				                <input type="checkbox" name="CheckboxGroup1" value="111" id="CheckboxGroup1_0" checked="checked" />
				                服务请求-服务请求</label>
				             
				              <label>
				                <input type="checkbox" name="CheckboxGroup1_1" value="1222" id="CheckboxGroup1_1" checked="checked" />
				                用户管理</label>
				                <label>
				                <input type="checkbox" name="CheckboxGroup1_2" value="1222" id="CheckboxGroup1_2" checked="checked" />
				                项目管理</label>
				                <label>
				                <input type="checkbox" name="CheckboxGroup1_3" value="1222" id="CheckboxGroup1_3" checked="checked" />
				                人力服务</label>
				       </div>
					     --%>
					</div>
		        </fieldset>
		       
		        <fieldset>
			        <legend>施工配置信息</legend>
			        	<div class="lbcxtj">
					        <label>施工人：</label>
					        <input id="sgr"  class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
					    </div>
					    <div class="lbcxtj">
					    	<label >施工时间：</label>
					        <input id="sgsj"  class="mwsmartui-datebox" data-options="width:'140px',height:'30px'">
					    </div>
				     <div id="pending_toolbar" >
				        <div class="toolbar-btn">
							<div class="btn-left">
				                <a id="" href="#" class="mwsmartui-linkbutton"  data-options="onClick:sgd.append"><i class="fa fa-plus"> </i> 添加行</a>
				                <a id="" href="#" class="mwsmartui-linkbutton"  data-options="onClick:sgd.accept"><i class="fa fa-save"> </i> 保存行</a>
				                <a href="#" id="" class="mwsmartui-linkbutton" data-options="onClick:sgd.removeit"><i class="fa fa-trash"> </i> 删除行</a>
							</div>
						</div>
				    </div>
				     <table style="width:100%; height:350px;"  id="dg"  class="mwsmartui-datagrid" data-options="
				     		title:'施工设备', 
				     		singleSelect: true,
				            scrollbarSize:27, 
				            method:'post',
				            toolbar: '#pending_toolbar',
							onClickRow: sgd.onClickRow">
				            <thead>
				                <tr>
				               		<th data-options="field:'id',checkbox:true">ID</th>
				                    <th data-options="field:'mc',width:'9%',editor:'textbox'"><b>名称</b></th>
				                    <th data-options="field:'lb',width:'9%',
										editor:{
											type:'combobox',
											options:{
												valueField:'code',
								                textField:'value',
												method:'get',
												data:[{'value':'报警主机','code':'01'},
														{'value':'摄像头','code':'02'},
														{'value':'红外','code':'03'},
														{'value':'门磁','code':'04'},
														{'value':'烟感','code':'05'},
														{'value':'燃气','code':'06'}],
												required:true
											}
										}"><b>设备类别</b></th>
				                    <th data-options="field:'cj',width:'9%',
				                    editor:{
											type:'combobox',
											options:{
												valueField:'code',
								                textField:'value',
												method:'get',
												data:[{'value':'深安','code':'SA'},
														{'value':'狮子王','code':'SZW'},
														{'value':'阿里','code':'AL'},
														{'value':'迪士佳','code':'DSJ'}],
												required:true
											}
										}"><b>厂家</b></th>
				                    <th data-options="field:'xh',width:'9%',editor:'textbox'"><b>型号</b></th>
				                    <th data-options="field:'bh',width:'9%',editor:'textbox'"><b>编号</b></th>
				                    <th data-options="field:'fq',width:'9%',editor:'textbox'"><b>防区</b></th>
				                    <th data-options="field:'wz',width:'9%',editor:'textbox'"><b>位置</b></th>
				                    <th data-options="field:'yhm',width:'9%',editor:'textbox'"><b>用户名</b></th>
				                    <th data-options="field:'mm',width:'9%',editor:{
				                    		type:'textbox',
				                    		options:{
				                    			
				                    		}
				                    	}"><b>密码</b></th>
				                    <th data-options="field:'glsb',width:'9%',editor:{
											type:'combobox',
											options:{
												url:'./AlarmDevice-listAlarmDevice',
												valueField:'id',
								                textField:'name',
												method:'get'
											}
										}"><b>关联设备</b></th>
				                    <th data-options="field:'bz',width:'9%',editor:'textbox'"><b>备注</b></th>
				                </tr>
				            </thead>
				        </table>
		        		<div class="lbcxtj" style="width:100%; height:120px; margin-top:10px;">
					    	<label>施工说明：</label>
					    	 <input id="sgsm"  class="mwsmartui-textbox" data-options="width:'90%',height:'120px',multiline:true">
					        <%--
					        <span class="span" style="width:90%; height:120px;">西安某某某某股份有限公司</span>
					         --%>
					    </div>
		        </fieldset>		
		
		        <fieldset>
		        	<legend>回访信息</legend>
		        	<form id="hfxx_form" method="post" >
		        		<input id="srm_id"  type="hidden" name="srm.id" />
					    <div class="lbcxtj" >
					         <label>回访人：</label>
					         <input id="hfr_id"  type="hidden" name="srm.back_id" />
					         <input id="hfr_name" name="srm.back_name"  class="mwsmartui-textbox" data-options="
					         	required:true,
					         	buttonText:'选择',
					         	onClickButton:sgd.selectHFR,
					         	width:'140px',height:'30px'">
					     </div>
					    <div class="lbcxtj">
					    	<label >回访时间：</label>
					        <input id="hfsj" name="srm.back_time"  class="mwsmartui-datebox" data-options="required:true,width:'140px',height:'30px'">
					    </div>
					    <div class="lbcxtj" style="width:100%; height:120px;">
					    	<label >回访意见：</label>
					        <input id="hfyj" name="srm.back_comment"  class="mwsmartui-textbox" data-options="required:true,width:'90%',height:'120px',multiline:true">
					    </div>
		        	</form>
		        </fieldset>		
		
	</div>
</div>
</body>
</html>
