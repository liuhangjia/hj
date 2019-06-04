<%@ page language="java"  pageEncoding="UTF-8"%>
<div  class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="bjjk_bjsj_list_toolbar" class="toolbar-div">
            <form id="bjjk_bjsj_queryform" method="post" >
             <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">设备名称：</label>
                <input id="bjjk_bjsj_search_mc" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>    
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">报警时间从：</label>
                <input id="bjjk_bjsj_search_kssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">到：</label>
                <input id="bjjk_bjsj_search_jssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
            
          
            </form>
        <div class="toolbar-btn">
			<div class="btn-left">
                    <!--  <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:bjjk_bjsj_doExport"><i class="fa fa-sign-out"> </i> 导出结果</a>-->
					<a href="./szw/fileassist.rar"  class="mwsmartui-linkbutton"><i class="fa fa-download"> </i> 下载文件助手</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:bjjk_bjsj_search"><i class="fa fa-search"> </i> 查询</a>
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:bjjk_bjsj_reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="bjjk_bjsj_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			singleSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./AlarmLog-list.action',
			sortName:'alarm_time',
			sortOrder:'desc',
            scrollbarSize:265,
			toolbar:'#bjjk_bjsj_list_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
                     <th data-options="field:'type_code',width:'7%',formatter:function(value){return common.codeToName('GJLB',value);}"><b>报警类型</b></th>
                    <th data-options="field:'alarm_time',width:'13%',formatter:function(value){return common.fmt_date(value);}"><b>报警时间</b></th>
                    <th data-options="field:'xx01',width:'10%',formatter:function(value,row){if(row['alarmDeviceModel']['memberModel']&&row['alarmDeviceModel']['memberModel']['name']){return row['alarmDeviceModel']['memberModel']['name']}else{return '';}}"><b>会员姓名</b></th>
                    <th data-options="field:'xx02',width:'10%',formatter:function(value,row){if(row['alarmDeviceModel']['memberModel']&&row['alarmDeviceModel']['memberModel']['phone']){return row['alarmDeviceModel']['memberModel']['phone']}else{return '';}}"><b>会员手机</b></th>
                    <th data-options="field:'b',width:'20%',formatter:function(value,row){return row['alarmDeviceModel']['install_addr'];}"><b>详细地址</b></th>
                    <th data-options="field:'a',width:'10%',formatter:function(value,row){return row['alarmDeviceModel']['name'];}"><b>设备名称</b></th>
                    <th data-options="field:'area',width:'7%'"><b>防区编号</b></th>
                    <th data-options="field:'handle_name',width:'10%'"><b>处理人</b></th>
                    <th data-options="field:'handle_time',width:'13%',formatter:function(value){return common.fmt_date(value);}"><b>处理时间</b></th>
					<!--  <th data-options="field:'result',width:'10%'"><b>处理意见</b></th>-->
                    <th data-options="field:'status',width:'228',formatter:bjjk_bjsj_doHandle"><b>操作</b></th>
                   
                    
                </tr>
            </thead>
        </table>
  </div>