<%@ page language="java"  pageEncoding="UTF-8"%>
<div class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="xtgl_xtrz_list_toolbar" class="toolbar-div">
    <fieldset>
	    <legend>查询条件</legend>
            <form id="xtgl_xtrz_queryform" method="post" >
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">操作人：</label>
                <input id="xtgl_xtrz_search_account" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
              <div class="lbcxtj">
            <label style="display:inline-block; width:100px; text-align:right;">开始时间：</label>
            <input  id="xtgl_xtrz_search_start" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
            <div class="lbcxtj">
            <label style="display:inline-block; width:100px; text-align:right;">结束时间：</label>
            <input id="xtgl_xtrz_search_end" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            </div>
          </form>
        </fieldset>   
        <div class="toolbar-btn">
			<div class="btn-left">
              <a href="#" id="xtgl_xtrz_plsc_btn" class="mwsmartui-linkbutton" data-options="onClick:xtgl_xtrz_plsc,disabled:true"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:xtgl_xtrz_search"><i class="fa fa-search"> </i> 查询</a>
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:xtgl_xtrz_reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="xtgl_xtrz_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./SysLog-list.action',
            scrollbarSize:37,
            sortName:'create_time',
            sortOrder:'desc',
			toolbar:'#xtgl_xtrz_list_toolbar',
			onCheck:xtgl_xtrz_togglePlsc,onUncheck:xtgl_xtrz_togglePlsc,onCheckAll:xtgl_xtrz_togglePlsc,
    	onUncheckAll:xtgl_xtrz_togglePlsc,onLoadSuccess:xtgl_xtrz_togglePlsc">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
                    <th data-options="field:'operator_account',width:'10%'"><b>操作人</b></th>
                    <th data-options="field:'create_time',width:'20%',formatter:common.fmt_date"><b>操作时间</b></th>
                    <th data-options="field:'type',width:'20%'"><b>操作类型</b></th>
                    <th data-options="field:'detail',width:'30%'"><b>操作内容</b></th>
                    <th data-options="field:'result',width:'10%',formatter:function(val){if(val=='0'){return '失败';}else if(val=='1'){return '成功';}else{return '';}}"><b>结果</b></th>
                    <th data-options="field:'login_ip',width:'10%'"><b>操作人IP</b></th>
                   
                </tr>
            </thead>
        </table>
  </div>
