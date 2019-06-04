<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
	<div class="mwsmartui-layout" data-options="fit:true,border:false">
		<div data-options="border:false,region:'north',height:'105px'">
			<div style="padding-top: 10px;background-color:#F5F5F5;" >
				<div style="height:50px;" >
					<form id="statistics_queryform" method="post" >
			            <div class="lbcxtj">
			                <label style="display:inline-block; width:100px; text-align:right;">开始时间：</label>
			                <input id="" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
			            </div>   
			            <div class="lbcxtj">
			                <label style="display:inline-block; width:100px; text-align:right;">结束时间：</label>
			                <input id="" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
			            </div> 
			            <div class="lbcxtj">
			                <label style="display:inline-block; width:100px; text-align:right;">服务类别：</label>
			                <select id="" class="mwsmartui-combobox" name="" data-options="width:'145px',height:'30px'" >
				                <option value="0">企业申请应用</option>
				                <option value="1">离职申诉</option>
				                <option value="2">保安升星</option>
				                <option value="3">设备安装</option>
			                </select>
			            </div>
			            <div class="lbcxtj">
			                <label style="display:inline-block; width:100px; text-align:right;">当前状态：</label>
			                <select id="" class="mwsmartui-combobox" name="" data-options="width:'145px',height:'30px'" >
			                	<option value="0">待审核</option>
				                <option value="1">审核通过</option>
				                <option value="2">审核拒绝</option>
			                </select>
			            </div>       
			        </form>
				</div>
		        <div class="toolbar-btn">
			        <%--
						<div class="btn-left">
							<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:pending_doAuditings"><i class="fa fa-plus"> </i> 批量处理</a>
						</div>
			         --%>
					<div class="btn-right">
						<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:pending_doSearch"><i class="fa fa-search"> </i> 查询</a>
		                <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:pending_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
					</div>
				</div>
			</div>
		</div>
		<div  data-options="border:false,region:'center'">
			<div id="ycl_wcl_pie">
				
			</div>
			<hr />
			<div id="month_count_line">
				
			</div>
			<hr />
			<div id="clr_count_column">
				
			</div>
		</div>
		
	</div>
	<script type="text/javascript">
		$(document).ready(function() {  
			common.ajax('./ServiceRequest-serviceCount.action',{},function(resp){
				var pie_data = resp['pie_data'];
				var line_data = resp['line_data'];
				var column_data = resp['column_data'];
				if(column_data && !$.isEmptyObject(column_data)){
					var nameList = column_data['nameList'];
					var zt_num_obj = column_data['data'];
					var chart = {
				            type: 'column'
				        };
				        var title = {
				            text: '人员处理服务请求统计'
				        };
//				        var subtitle = {
//				            text: 'Source: runoob.com'
//				        };
				        var xAxis = {
				            categories: nameList,
				            crosshair: true
				        };
//				        var yAxis = {
//				            min: 0,
//				            title: {
//				                text: '降雨量 (mm)'
//				            }
//				        };
				        var tooltip = {
				            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				            '<td style="padding:0"><b>{point.y} </b></td></tr>',
				            footerFormat: '</table>',
				            shared: true,
				            useHTML: true
				        };
				        var plotOptions = {
				            column: {
				                pointPadding: 0.2,
				                borderWidth: 0
				            }
				        };
				        var credits = {
				            enabled: false
				        };

				        var init_data = [];
				        for (var i = 0; i < nameList.length; i++) {
				        	init_data.push(0);
						}
				        //zt_num_obj
				        var ytgs = zt_num_obj['1']?zt_num_obj['1']:init_data;
				        var yjjs = zt_num_obj['2']?zt_num_obj['2']:init_data;
				        
				        var series= [
				            {
				                name: '已通过',
				                data: ytgs,
				                color:'#90ED7D'
				            },
				            {
				                name: '已拒绝',
				                data: yjjs,
				                color:'#434348'
				            }
				            ];

				        var json = {};
				        json.chart = chart;
				        json.title = title;
//				        json.subtitle = subtitle;
				        json.tooltip = tooltip;
				        json.xAxis = xAxis;
//				        json.yAxis = yAxis;
				        json.series = series;
				        json.plotOptions = plotOptions;
				        json.credits = credits;
				        $('#clr_count_column').highcharts(json);
				}
				
				if(line_data && !$.isEmptyObject(line_data)){
			        var line_title = {
			            text: '月度服务请求处理量'
			        };
//			        var subtitle = {
//			            text: 'Source: runoob.com'
//			        };
			        var line_xAxis = {
			            categories: ['一月', '二月', '三月', '四月', '五月', '六月',
			                '七月', '八月', '九月', '十月', '十一月', '十二月']
			        };
			        var line_yAxis = {
//			            title: {
//			                text: 'Temperature (\xB0C)'
//			            },
			            plotLines: [{
			                value: 0,
			                width: 1,
			                color: '#808080'
			            }]
			        };

//			        var tooltip = {
//			            valueSuffix: '\xB0C'
//			        }

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
			                data: wcls,
			                color:'#7CB5EC'
			            },
			            {
			                name: '已通过',
			                data: ytgs,
			                color:'#90ED7D'
			            },
			            {
			                name: '已拒绝',
			                data: yjjs,
			                color:'#434348'
			            }
			        ];

			        var line_json = {};

			        line_json.title = line_title;
//			        json.subtitle = subtitle;
			        line_json.xAxis = line_xAxis;
			        line_json.yAxis = line_yAxis;
//			        json.tooltip = tooltip;
			        line_json.legend = line_legend;
			        line_json.series = line_series;

			        $('#month_count_line').highcharts(line_json);
				}
				
				if(pie_data && !$.isEmptyObject(pie_data)){
				   var chart = {
						       plotBackgroundColor: null,
						       plotBorderWidth: null,
						       plotShadow: false
						   };
				   var title = {
				      text: '服务 处理状态 比例'   
				   };      
				   var tooltip = {
				      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
				   };
				   var plotOptions = {
				      pie: {
				         allowPointSelect: true,
				         cursor: 'pointer',
				         dataLabels: {
				            enabled: true,
				            format: '<b>{point.name}%</b>: {point.percentage:.1f} %',
				            style: {
				               color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
				            }
				         }
				      }
				   };
				   
				   var wcl_num = pie_data['0']?parseInt(pie_data['0']):0;
				   var ytg_num = pie_data['1']?parseInt(pie_data['1']):0;
				   var yjj_num = pie_data['2']?parseInt(pie_data['2']):0;
				   var series= [{
				      type: 'pie',
				      name: '比例',
				      data: [
				         {
				        	 name: '未处理',
					         y: wcl_num, 
					         color:'#7CB5EC'
				         },
				         {
				            name: '已通过',
				            y: ytg_num,
				            sliced: true,
				            selected: true,
				            color:'#90ED7D'
				         },
				         {
				        	 name: '已拒绝',
					         y: yjj_num, 
					         color:'#434348'
				         }
				      ]
				   }];     
				   
				   var json = {};   
				   json.chart = chart; 
				   json.title = title;     
				   json.tooltip = tooltip;  
				   json.series = series;
				   json.plotOptions = plotOptions;
				   $('#ycl_wcl_pie').highcharts(json); 
				}
			});		
		});
	</script>
</body>
</html>
