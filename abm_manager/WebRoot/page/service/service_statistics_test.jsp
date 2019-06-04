<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
	<div class="mwsmartui-layout" data-options="fit:true,border:false">
	<!--  
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
	-->	
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
					
			        var init_data = [];
			        for (var i = 0; i < nameList.length; i++) {
			        	init_data.push(0);
					}
			        //zt_num_obj
			        var ytgs = zt_num_obj['1']?zt_num_obj['1']:init_data;
			        var yjjs = zt_num_obj['2']?zt_num_obj['2']:init_data;
			        
			        var ytg_datas = [];
			        var yjj_datas = [];
			        for (var i = 0; i < nameList.length; i++) {
			        	var ytg_one_data = [];
			        	var yjj_one_data = [];
			        	
			        	ytg_one_data.push(nameList[i]);
			        	ytg_one_data.push(ytgs[i]);
			        	ytg_datas.push(ytg_one_data);
			        	
			        	yjj_one_data.push(nameList[i]);
			        	yjj_one_data.push(yjjs[i]);
			        	yjj_datas.push(yjj_one_data);
					}
					
					$('#clr_count_column').jqChart({
						title: { text: '人员处理服务请求统计' },
						axes: [
							{
								location: 'left',//y轴位置，取值：left,right
								minimum: 0,//y轴刻度最小值
								//maximum: 100,//y轴刻度最大值
								interval: 1 //刻度间距
							}
						],
						series: [
							{
								type: 'column',//图表类型，取值：column 柱形图，line 线形图
								title:'已通过',//标题
								//data: [['1', 70], ['2', 40], ['3', 55], ['4', 50], ['5', 60], ['6', 40]]//数据内容，格式[[x轴标题,数值1],[x轴标题,数值2],......]
								data:ytg_datas,
								fillStyle:'#FCB441'
							},
							{
								type: 'column',
								title:'已拒绝',
								data:yjj_datas,
								fillStyle:'#E0400A'
							}		
						]
					});
				}
				
				if(line_data && !$.isEmptyObject(line_data)){
					var x_zhou = ['一月', '二月', '三月', '四月', '五月', '六月',
				  	                '七月', '八月', '九月', '十月', '十一月', '十二月'];
					
					var init_data = [0,0,0,0,0,0,0,0,0,0,0,0];

					var wcls = line_data['0']?line_data['0']:init_data;
					var ytgs = line_data['1']?line_data['1']:init_data;
					var yjjs = line_data['2']?line_data['2']:init_data;
					
					var wcl_datas = [];
					var ytg_datas = [];
					var yjj_datas = [];
					for (var i = 0; i < x_zhou.length; i++) {
						var wcl_one_data = [];
						var ytg_one_data = [];
			        	var yjj_one_data = []; 
			        	wcl_one_data.push(x_zhou[i]);
			        	wcl_one_data.push(wcls[i]);
			        	wcl_datas.push(wcl_one_data);
			        	ytg_one_data.push(x_zhou[i]);
			        	ytg_one_data.push(ytgs[i]);
			        	ytg_datas.push(ytg_one_data);
			        	yjj_one_data.push(x_zhou[i]);
			        	yjj_one_data.push(yjjs[i]);
			        	yjj_datas.push(yjj_one_data);
					}
					
					$('#month_count_line').jqChart({
						title: { text: '月度服务请求处理量' },
						axes: [
							{
								location: 'left',//y轴位置，取值：left,right
								minimum: 0,//y轴刻度最小值
								//maximum: 100,//y轴刻度最大值
								interval: 1 //刻度间距
							}
						],
						series: [
							{
								type: 'line',
								title:'未处理',
								data:wcl_datas,
								fillStyle:'#7CB5EC'
							},
							{
								type: 'line',//图表类型，取值：column 柱形图，line 线形图
								title:'已通过',//标题
								//data: [['1', 70], ['2', 40], ['3', 55], ['4', 50], ['5', 60], ['6', 40]]//数据内容，格式[[x轴标题,数值1],[x轴标题,数值2],......]
								data:ytg_datas,
								fillStyle:"#90ED7D"
							},
							{
								type: 'line',
								title:'已拒绝',
								data:yjj_datas,
								fillStyle:"#434348"
							}
						]
					});
				}
				
				if(pie_data && !$.isEmptyObject(pie_data)){
				   var wcl_num = pie_data['0']?parseInt(pie_data['0']):0;
				   var ytg_num = pie_data['1']?parseInt(pie_data['1']):0;
				   var yjj_num = pie_data['2']?parseInt(pie_data['2']):0;
				   
				   $('#ycl_wcl_pie').jqChart({
						title: { text: '服务 处理状态 比例' },
						series: [
							{
	                           type: 'pie',
	                           title: 'sss',
	                           fillStyle: 'green',
	                           data: [['未处理', wcl_num], ['已通过', ytg_num], ['已拒绝', yjj_num]]
		                    }
							
						]
					});
				}
			});		
		});
	</script>
</body>
</html>
