<%@ page language="java"  pageEncoding="UTF-8"%>
<div class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="bjjk_xjjl_list_toolbar" class="toolbar-div">
            <form id="bjjk_xjjl_queryform" method="post" >
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">项目名称：</label>
                <input id="bjjk_xjjl_search_xmmc" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>    
			<div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">客户姓名：</label>
                <input id="bjjk_xjjl_search_name" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>   
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">开始时间：</label>
                <input id="bjjk_xjjl_search_kssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">结束时间：</label>
                <input id="bjjk_xjjl_search_jssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
          
            </form>
        <div class="toolbar-btn">
			<div class="btn-left">
            	<a href="#" id="bjjk_xjjl_zj_btn" class="mwsmartui-linkbutton" data-options="onClick:bjjk_xjjl_add"><i class="fa fa-plus"> </i> 添加</a>
            	<a href="#" id="bjjk_xjjl_plsc_btn" class="mwsmartui-linkbutton" data-options="disabled:true,onClick:bjjk_xjjl_plsc"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:bjjk_xjjl_search"><i class="fa fa-search"> </i> 查询</a>
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:bjjk_xjjl_reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="bjjk_xjjl_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./AlarmDeviceCheck-list.action',
            scrollbarSize:157,
			toolbar:'#bjjk_xjjl_list_toolbar',
			onCheck:bjjk_xjjl_togglePlsc,
			onUncheck:bjjk_xjjl_togglePlsc,
			onCheckAll:bjjk_xjjl_togglePlsc,
    		onUncheckAll:bjjk_xjjl_togglePlsc,
    		onLoadSuccess:bjjk_xjjl_togglePlsc">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">选择</th>
                    <th data-options="field:'zgh',width:'10%',formatter:function(value,row){if(row['member']){return row['member']['name'];}}"><b>客户姓名</b></th>
                    <th data-options="field:'zgxm',width:'25%',formatter:function(value,row){if(row['project']){return row['project']['name'];}}"><b>项目名称</b></th>
                    <th data-options="field:'check_time',width:'15%',formatter:function(value){return common.fmt_date19(value);}"><b>巡检时间</b></th>
                    <th data-options="field:'address',width:'20%'"><b>巡检地点</b></th>
                    <th data-options="field:'checker_name',width:'10%'"><b>巡检人</b></th>
                    <th data-options="field:'result',width:'20%'"><b>巡检结果</b></th>
                    <th data-options="field:'status',width:'120',formatter:bjjk_xjjl_doHandle"><b>操作</b></th>
                   
                    
                </tr>
            </thead>
        </table>
  </div>