<%@page import="net.sf.json.JSONObject"%>
<%@page import="java.util.List"%>
<%@page import="com.abm.common.model.EnterpriseModel"%>
<%@page import="com.abm.common.service.EnterpriseService"%>
<%@page import="com.mw.common.utils.StringUtil"%>
<%@page import="com.abm.common.utils.PrivUtil"%>
<%@page import="com.abm.common.utils.Constants"%>
<%@page import="com.abm.common.model.AccountsModel"%>
<%@page import="com.abm.common.model.SessionPrivModel"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	AccountsModel user = (AccountsModel)session.getAttribute(Constants.USER);
%>
<script language="javascript" type="text/javascript">
$(document).ready(function () {
	
	$('#jqChart1').jqChart({
		title: { text: '' },
		axes: [
			{
				location: 'left',//y轴位置，取值：left,right
				minimum: 10,//y轴刻度最小值
				maximum: 100,//y轴刻度最大值
				interval: 10 //刻度间距
			}
		],
		series: [
			
			{
				type: 'line',//图表类型，取值：column 柱形图，line 线形图
				title:'企业用户',//标题
				data: [['1', 70], ['2', 40], ['3', 55], ['4', 50], ['5', 60], ['6', 40]]//数据内容，格式[[x轴标题,数值1],[x轴标题,数值2],......]
			},
			
			{
				type: 'line',
				title:'个人用户',
				data: [['1', 40], ['2', 50], ['3', 95], ['4', 55], ['5', 25], ['6', 45]]
			},
			
			{
			type: 'line',
			title:'安保人员',
			data: [['1', 30], ['2', 60], ['3', 55], ['4', 70], ['5', 45], ['6', 80]]
			},
			{
			type: 'line',
			title:'用户数量',
			data: [['1', 15], ['2', 20], ['3', 35], ['4', 40], ['5', 75], ['6', 90]]
			},		
		]
	});
	
	$('#jqChart3').jqChart({
		title: { text: '' },
		axes: [
			{
				location: 'left',//y轴位置，取值：left,right
				minimum: 10,//y轴刻度最小值
				maximum: 100,//y轴刻度最大值
				interval: 10//刻度间距
			}
		],
		series: [
			//数据1开始
			{
				type: 'column',//图表类型，取值：column 柱形图，line 线形图
				title:'',//标题
				data: [['1', 70], ['2', 40], ['3', 55], ['4', 50], ['5', 60], ['6', 40]]//数据内容，格式[[x轴标题,数值1],[x轴标题,数值2],......]
			},
			//数据1结束
			//数据2
		]
	});
	
	common.ajax('./ServiceRequest-serviceCount.action',{},function(resp){
	    var line_data = resp['line_data'];
	    var column_data = resp['column_data'];
	    if(column_data && !$.isEmptyObject(column_data)){
	    	var init_data = [0,0,0,0,0,0,0,0,0,0,0,0];
		    var wcls = line_data['0']?line_data['0']:init_data;
		    var ytgs = line_data['1']?line_data['1']:init_data;
		    var yjjs = line_data['2']?line_data['2']:init_data;
	    	var x_zhou = ['一月', '二月', '三月', '四月', '五月', '六月',
	  	                '七月', '八月', '九月', '十月', '十一月', '十二月'];
	    	var wcl_data = [];
	    	var ytg_data = [];
	    	var yjj_data = [];
	    	for (var i = 0; i < x_zhou.length; i++) {
				var wcl_one_data = [];
				var ytg_one_data = [];
				var yjj_one_data = [];
				
				wcl_one_data.push(x_zhou[i]);
				wcl_one_data.push(wcls[i]);
				wcl_data.push(wcl_one_data);
				
				ytg_one_data.push(x_zhou[i]);
				ytg_one_data.push(ytgs[i]);
				ytg_data.push(ytg_one_data);
				
				yjj_one_data.push(x_zhou[i]);
				yjj_one_data.push(yjjs[i]);
				yjj_data.push(yjj_one_data);
			}
	    	
	    	$('#fwclqk_column').jqChart({
	    		title: { text: '' },
	    		axes: [
	    			{
	    				location: 'left',//y轴位置，取值：left,right
	    				minimum: 0,//y轴刻度最小值
	    				//maximum: 100,//y轴刻度最大值
	    				interval: 1//刻度间距
	    			}
	    		],
	    		series: [
	    			{
	    				type: 'column',//图表类型，取值：column 柱形图，line 线形图
	    				title:'未处理',//标题
	    				//data: [['1', 70], ['2', 40], ['3', 55], ['4', 50], ['5', 60], ['6', 40]]//数据内容，格式[[x轴标题,数值1],[x轴标题,数值2],......]
	    				data:wcl_data,
	    				fillStyle:'#418CF0'
	    			},
	    			{
	    				type: 'column',
	    				title:'已通过',
	    				data:ytg_data,
	    				fillStyle:'#FCB441'
	    			},
	    			{
	    				type: 'column',
	    				title:'已拒绝',
	    				data:yjj_data,
	    				fillStyle:'#E0400A'
	    			}
	    		]
	    	});
	    }
	});
	
	common.ajax('./Welcome-regTotal.action',{},function(resp){
		$('#span_total_enterprise').html(resp['enterprise']);
		$('#span_total_employee').html(resp['employee']);
		$('#span_total_account').html(resp['account']);
		$('#span_total_member').html(resp['member']);
		var line_data = resp['yhzcqk_line'];
		if(line_data && !$.isEmptyObject(line_data)){
	        var line_title = {
	            text: ''
	        };
	        var line_xAxis = {
	            categories: ['一月', '二月', '三月', '四月', '五月', '六月',
	                '七月', '八月', '九月', '十月', '十一月', '十二月']
	        };
	        var line_yAxis = {
//	            title: {
//	                text: 'Temperature (\xB0C)'
//	            },
	            plotLines: [{
	                value: 0,
	                width: 1,
	                color: '#808080'
	            }]
	        };

	        var line_legend = {
	            layout: 'vertical',
	            align: 'right',
	            verticalAlign: 'middle',
	            borderWidth: 0
	        };

			var init_data = [0,0,0,0,0,0,0,0,0,0,0,0];

			var wcls = line_data['0']?line_data['0']:init_data;
			var ytgs = line_data['1']?line_data['1']:init_data;
			var yjjs = line_data['2']?line_data['2']:init_data;

	        var line_series =  [
	            {
	                name: '未处理',
	                data: wcls
	            },
	            {
	                name: '已通过',
	                data: ytgs
	            },
	            {
	                name: '已拒绝',
	                data: yjjs
	            }
	        ];

	        var line_json = {};

	        line_json.title = line_title;
//	        json.subtitle = subtitle;
	        line_json.xAxis = line_xAxis;
	        line_json.yAxis = line_yAxis;
//	        json.tooltip = tooltip;
	        line_json.legend = line_legend;
	        line_json.series = line_series;

	        $('#month_count_line').highcharts(line_json);
		}
	});
	
});
</script>  
<%
	if(null!=user.getEmployee()){
		String eid = user.getEmployee().getId();
		if(StringUtil.isNotEmpty(eid)){
			EnterpriseModel em = EnterpriseService.getSingle().findCompany(eid);
%>
<div class="mwsmartui-panel" data-options="width:'98%',height:'550px'" title="企业信息" style="margin-bottom: 20px;">
	<div style="width: 66%; height: 55px; margin-left: 10px; margin-top: 10px;float: center;">
		<span style="font-size: 28px; float: left; margin-left: 50%;">
<% 
			if(StringUtil.isEmpty(em.getName())){
%>
		<span>企业名称：暂无企业名称</span>
<%				
			}else{
%>
		<span><%=em.getName() %></span>
<%				
			}
%>
		</span> 
	</div>
	<div style="width: 66%; height:280px; margin-left: 10px;float: center;">
<% 
			if(StringUtil.isEmpty(em.getLogo())){
%>
		<img src="./images/bg.png" style="width:260px; height:260px; margin-left: 50%;"/>
<%				
			}else{
				String logoUrl = JSONObject.fromObject(em.getLogo()).getString("save_filename");
%>
				<img src="./File-getImage.action?imageName=<%=logoUrl %>" style="height:260px; width:auto; margin-left: 50%;"/>
		<%				
			}
%>
	</div>
	<div style="width: 66%; height: 100px; margin-left: 10px;float: center;">
		<div style="font-size: 18px; float: left; margin-left: 50%;">
<% 
			if(StringUtil.isEmpty(em.getBusiness())){
%>
		<p><b>经营业务：</b>：暂未填写业务范围</p>
<%				
			}else{
%>
		<p><b>经营业务：</b><%=em.getBusiness() %></p>
<%				
			}
%>
		</div> 
	</div>
	<div style="width: 66%; height: 55px; margin-left: 10px;float: center;">
		<div style="font-size: 18px; float: left; margin-left: 50%;">
<% 
			if(StringUtil.isEmpty(em.getAddress())){
%>
		<span><b>公司地址：</b>暂未填写公司地址</span>
<%				
			}else{
%>
		<span><b>公司地址：</b><%=em.getAddress() %></span>
<%				
			}
%>
		</div> 
	</div>
</div>
<%		
		}
	}else{
		boolean hasPriv = false;
		List<SessionPrivModel> privs = user.getPrivs();
		if(privs!=null&&privs.size()>0)
		{
			for(SessionPrivModel priv :privs)
			{
				if(priv.getPriv().getCode().equals("SYS_STATUS"))
				{
					hasPriv = true;
					break;
				}
			}
		}
		if(hasPriv){
%>

<div class="mwsmartui-panel" data-options="width:'98%',height:'490px'" title="用户注册情况" style="margin-bottom: 20px;">
	<div style="width: 23%; height: 70px; padding: 20px 0px; float: left; margin: 10px 5px 10px 10px; background: #f5b062; color: #FFF; border-radius: 5px;">
		<div style="margin: 0px 20px; height: 50px;">
			<span style="font-size: 36px; float: left;"><span id="span_total_enterprise">-</span></span> 
			<span style="float: right;"><i class="fa fa-address-card fa-4x"></i></span>
		</div>
		<div style="margin: 0px 20px; height: 20px; line-height: 20px; font-size: 18px;"> 企业用户注册 </div>
	</div>
	<div style="width: 24%; height: 70px; padding: 20px 0px; float: left; margin: 10px 5px 10px 10px; background: #d1b995; color: #FFF; border-radius: 5px;">
		<div style="margin: 0px 20px; height: 50px;">
			<span style="font-size: 36px; float: left;"><span id="span_total_member">-</span></span> 
			<span style="float: right;"><i class="fa fa-address-book fa-4x"></i></span>
		</div>
		<div style="margin: 0px 20px; height: 20px; line-height: 20px; font-size: 18px;"> 个人用户注册</div>
	</div>
	<div style="width: 23%; height: 70px; padding: 20px 0px; float: left; margin: 10px 5px 10px 10px; background: #71d398; color: #FFF; border-radius: 5px;">
		<div style="margin: 0px 20px; height: 50px;">
			<span style="font-size: 36px; float: left;"><span id="span_total_employee">-</span></span> 
			<span style="float: right;"><i class="fa fa-user-secret fa-4x"></i></span>
		</div>
		<div style="margin: 0px 20px; height: 20px; line-height: 20px; font-size: 18px;"> 安保人员数量</div>
	</div>
	<div style="width: 24%; height: 70px; padding: 20px 0px; float: left; margin: 10px 5px 10px 10px; background: #e65097; color: #FFF; border-radius: 5px;">
		<div style="margin: 0px 20px; height: 50px;">
			<span style="font-size: 36px; float: left;"><span id="span_total_account">-</span></span> 
			<span style="float: right;"><i class="fa fa-users fa-4x"></i></span>
		</div>
		<div style="margin: 0px 20px; height: 20px; line-height: 20px; font-size: 18px;"> 用户数量</div>
	</div>
	<div style="clear: both;"><%-- id="yhzcqk_line" --%>
		<div id="jqChart1" style="width: 98%; height: 300px; margin-left: 10px;"></div>
	</div>
</div>
<div class="mwsmartui-panel" data-options="width:'98%',height:'370px'" title="服务处理情况" style="margin-bottom: 20px;">
	<div id="fwclqk_column" style="width: 98%; height: 300px; margin-left: 10px; margin-top: 10px;"></div>
</div>
<div style="height: 300px; width: 49%; margin-bottom: 10px; margin-right: 20px; float: left;">
	<div class="mwsmartui-panel" data-options="width:'100%',height:'388px'" title="本月装机情况" style="margin-bottom: 20px; float: left">
		<div id="jqChart3" style="width: 96%; height: 300px; margin-left: 10px; margin-right: 10px; margin-top: 10px;"></div>
	</div>
</div>
<div style="height: 300px; width: 49%; margin-bottom: 10px; float: left;">
	<table class="mwsmartui-datagrid" title="本月巡检情况" style="width: 100%;" data-options="
																			singleSelect:true,
																			collapsible:true,
																			method:'get',
																			scrollbarSize:0">
		<thead>
			<tr>
				<th data-options="field:'productid',width:162">巡检区域</th>
				<th data-options="field:'listprice',width:120,align:'right'">巡检用户</th>
				<th data-options="field:'unitcost',width:120,align:'right'">巡检次数</th>
				<th data-options="field:'attr1',width:106">巡检问题</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1号区域</td>
				<td>某某企业</td>
				<td>10</td>
				<td>0</td>
			</tr>
			<tr>
				<td>1号区域</td>
				<td>某某企业</td>
				<td>10</td>
				<td>0</td>
			</tr>
			<tr>
				<td>1号区域</td>
				<td>某某企业</td>
				<td>10</td>
				<td>0</td>
			</tr>
			<tr>
				<td>1号区域</td>
				<td>某某企业</td>
				<td>10</td>
				<td>0</td>
			</tr>
			<tr>
				<td>1号区域</td>
				<td>某某企业</td>
				<td>10</td>
				<td>0</td>
			</tr>
			<tr>
				<td>1号区域</td>
				<td>某某企业</td>
				<td>10</td>
				<td>0</td>
			</tr>
			<tr>
				<td>1号区域</td>
				<td>某某企业</td>
				<td>10</td>
				<td>0</td>
			</tr>
			<tr>
				<td>1号区域</td>
				<td>某某企业</td>
				<td>10</td>
				<td>0</td>
			</tr>
			<tr>
				<td>1号区域</td>
				<td>某某企业</td>
				<td>10</td>
				<td>0</td>
			</tr>
			<tr>
				<td>1号区域</td>
				<td>某某企业</td>
				<td>10</td>
				<td>0</td>
			</tr>
			<tr>
				<td>1号区域</td>
				<td>某某企业</td>
				<td>10</td>
				<td>0</td>
			</tr>
		</tbody>
	</table>
</div>
<%}else{%>
<div class="mwsmartui-panel" data-options="width:'98%',height:'490px'" title="" style="margin-bottom: 20px;">
</div>
<%}}%>