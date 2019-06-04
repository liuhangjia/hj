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
		<div data-options="border:false,region:'center'">
			<div class="mwsmartui-layout" data-options="fit:true,border:false">
				<div data-options="border:false,region:'north',height:'50%'">
					<div  class="mwsmartui-panel" data-options="title:'日统计',border:false,fit:true">
						<div class="mwsmartui-layout" data-options="fit:true,border:false">
							<div data-options="border:false,region:'west',width:'50%'">
								<table id="gzltj_month_ry_list" class="mwsmartui-datagrid" data-options="
						            pagination:false,
									pageSize:20,
									selectOnCheck:true,
									fileOnSelect:true,
									singleSelect:true,
									border:true,
									striped:true,
									fit:true,
									method:'get',
						            scrollbarSize:0
									">
						            <thead>
						                <tr>
						                    <th data-options="field:'tel',width:'10%'"><b>编号</b></th>
						                    <th data-options="field:'zgh',width:'15%'"><b>类别</b></th>
						                </tr>
						            </thead>
						        </table>
							</div>
							<div data-options="border:false,region:'center'">
								<table id="gzltj_month_lb_list" class="mwsmartui-datagrid" data-options="
						            pagination:false,
									pageSize:20,
									selectOnCheck:true,
									fileOnSelect:true,
									singleSelect:true,
									border:true,
									striped:true,
									fit:true,
									method:'get',
						            scrollbarSize:0
									">
						            <thead>
						                <tr>
						                    <th data-options="field:'tel',width:'10%'"><b>编号</b></th>
						                    <th data-options="field:'zgh',width:'15%'"><b>类别</b></th>
						                </tr>
						            </thead>
						        </table>
							</div>
						</div>
					</div>
				</div>
				<%------------------------------------------------------------------------ --%>
				<div data-options="border:false,region:'center'">
					<div  class="mwsmartui-panel" data-options="title:'月统计',border:false,fit:true">
						<div class="mwsmartui-layout" data-options="fit:true,border:false">
							<div data-options="border:false,region:'west',width:'50%'">
								<table id="statistics_list" class="mwsmartui-datagrid" data-options="
						            pagination:false,
									pageSize:20,
									selectOnCheck:true,
									fileOnSelect:true,
									singleSelect:true,
									border:true,
									striped:true,
									fit:true,
									method:'get',
						            scrollbarSize:0
									">
						            <thead>
						                <tr>
						                    <th data-options="field:'tel',width:'10%'"><b>编号</b></th>
						                    <th data-options="field:'zgh',width:'15%'"><b>类别</b></th>
						                </tr>
						            </thead>
						        </table>
							</div>
							<div data-options="border:false,region:'center'">
								<table id="statistics_list" class="mwsmartui-datagrid" data-options="
						            pagination:false,
									pageSize:20,
									selectOnCheck:true,
									fileOnSelect:true,
									singleSelect:true,
									border:true,
									striped:true,
									fit:true,
									method:'get',
						            scrollbarSize:0,
									toolbar:'#statistics_list_toolbar'">
						            <thead>
						                <tr>
						                    <th data-options="field:'tel',width:'10%'"><b>编号</b></th>
						                    <th data-options="field:'zgh',width:'15%'"><b>类别</b></th>
						                </tr>
						            </thead>
						        </table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
