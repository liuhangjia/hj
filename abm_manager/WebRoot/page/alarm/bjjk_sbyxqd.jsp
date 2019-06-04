<%@ page language="java"  pageEncoding="UTF-8"%>
<div  class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="bjjk_sbyxqd_list_toolbar" class="toolbar-div">
            <form id="bjjk_sbyxqd_queryform" method="post" >
             <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">设备名称：</label>
                <input id="bjjk_sbyxqd_search_mc" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>  
			<div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">安装地点：</label>
                <input id="bjjk_sbyxqd_search_addr" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>			
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">布防状态：</label>
                <select  id="bjjk_sbyxqd_search_status" class="mwsmartui-combobox" data-options="width:'145px',height:'30px',prompt:''">
					<option value="ALL">全部</option>
					<option value="1">布防</option>
					<option value="0">撤防</option>
				</select>
            </div>
          
            </form>
        <div class="toolbar-btn">
			<div class="btn-left">
                    <a id="bjjk_sbyxqd_add_btn" href="#" class="mwsmartui-linkbutton"  data-options="onClick:bjjk_sbyxqd_add"><i class="fa fa-plus"> </i> 添加</a>
                    <!--  <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:bjjk_sbyxqd_export"><i class="fa fa-sign-out"> </i> 导出结果</a>-->
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:bjjk_sbyxqd_search"><i class="fa fa-search"> </i> 查询</a>
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:bjjk_sbyxqd_reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="bjjk_sbyxqd_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			singleSelect:true,
			border:false,
			scrollbarSize:230,
			striped:true,
			fit:true,
			method:'post',
			url:'./AlarmDevice-list.action',
			sortName:'install_time',
			sortOrder:'desc',
			toolbar:'#bjjk_sbyxqd_list_toolbar'">
            <thead>
                <tr>
                   	<!-- <th data-options="field:'type',width:'10%',formatter:function(value){return common.codeToName('SBLB',value);}"><b>设备类别</b></th>
                   	<th data-options="field:'name',width:'10%'"><b>设备名称</b></th>
                    <th data-options="field:'factory',width:'10%',formatter:function(value){return common.codeToName('FACTORY',value);}"><b>厂家</b></th>
                    <th data-options="field:'model',width:'10%'"><b>型号</b></th>
                    <th data-options="field:'status',width:'10%',formatter:function(value,row,index){if(row['type']=='01'){return common.codeToName('BFZT',value);}else{return '';}},styler:function(value){if(value=='-1'){return 'background-color:red;';}else{return '';}}"><b>状态</b></th>
                    <th data-options="field:'install_addr',width:'20%'"><b>详细地址</b></th>
                    <th data-options="field:'statu',width:'230',formatter:bjjk_sbyxqd_doHandle"><b>操作</b></th> -->
                    
                    <th data-options="field:'xx01',width:'10%',formatter:function(value,row){if(row['member']&&row['member']['member_name']){return row['member']['member_name']}else{return '';}}"><b>会员姓名</b></th>
                    <th data-options="field:'xx02',width:'10%',formatter:function(value,row){if(row['member']&&row['member']['phone']){return row['member']['phone']}else{return '';}}"><b>会员手机</b></th>
                   	<th data-options="field:'type',width:'10%',formatter:function(value){return common.codeToName('SBLB',value);}"><b>设备类别</b></th>
                   	<th data-options="field:'name',width:'10%'"><b>设备名称</b></th>
                    <th data-options="field:'factory',width:'10%',formatter:function(value){return common.codeToName('FACTORY',value);}"><b>厂家</b></th>
                    <th data-options="field:'model',width:'10%'"><b>型号</b></th>
                    <th data-options="field:'status',width:'10%',formatter:function(value,row,index){if(row['type']=='01'){return common.codeToName('BFZT',value);}else{return '';}},styler:function(value){if(value=='-1'){return 'background-color:red;';}else{return '';}}"><b>状态</b></th>
                    <!-- <th data-options="field:'installTime',width:'10%',formatter:bjjk_sbyxqd_datediff"><b>剩余天数</b></th> -->
                    <th data-options="field:'installAddr',width:'20%'"><b>详细地址</b></th>
                    <th data-options="field:'statu',width:'230',formatter:bjjk_sbyxqd_doHandle"><b>操作</b></th>
                </tr>
                <%--
                <tr>
               		<th data-options="field:'xx01',width:'10%',formatter:function(value,row){if(row['memberModel']&&row['memberModel']['name']){return row['memberModel']['name']}else{return '';}}"><b>会员姓名</b></th>
                    <th data-options="field:'xx02',width:'10%',formatter:function(value,row){if(row['memberModel']&&row['memberModel']['phone']){return row['memberModel']['phone']}else{return '';}}"><b>会员手机</b></th>
                   	<th data-options="field:'type',width:'10%',formatter:function(value){return common.codeToName('SBLB',value);}"><b>设备类别</b></th>
                   	<th data-options="field:'name',width:'10%'"><b>设备名称</b></th>
                    <th data-options="field:'factory',width:'10%',formatter:function(value){return common.codeToName('FACTORY',value);}"><b>厂家</b></th>
                    <th data-options="field:'model',width:'10%'"><b>型号</b></th>
                    <th data-options="field:'status',width:'10%',formatter:function(value,row,index){if(row['type']=='01'){return common.codeToName('BFZT',value);}else{return '';}},styler:function(value){if(value=='-1'){return 'background-color:red;';}else{return '';}}"><b>状态</b></th>
                    <!--<th data-options="field:'last_modify_time',width:'10%',formatter:function(value){return common.fmt_date(value);}"><b>更新时间</b></th>-->
                    <th data-options="field:'invalid_time',width:'10%',formatter:bjjk_sbyxqd_datediff"><b>剩余天数</b></th>
                    <!--<th data-options="field:'install_time',width:'10%',formatter:function(value){return common.fmt_date(value);}"><b>安装时间</b></th>-->
                    <th data-options="field:'install_addr',width:'20%'"><b>详细地址</b></th>
                    <!--  <th data-options="field:'xx03',width:'10%',formatter:function(value,row){if(row['memberModel']&&row['memberModel']['address']){return row['memberModel']['address']}else{return '';}}"><b>会员地址</b></th>-->
                    <!--<th data-options="field:'xx04',width:'10%',formatter:function(value,row){if(row['memberModel']&&row['memberModel']['business']){return row['memberModel']['business']}else{return '';}}"><b>会员经营范围</b></th>-->
                    <th data-options="field:'statu',width:'230',formatter:bjjk_sbyxqd_doHandle"><b>操作</b></th>
                </tr>
                 --%>
            </thead>
        </table>
  </div>