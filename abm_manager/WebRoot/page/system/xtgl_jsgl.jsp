<%@ page language="java"  pageEncoding="UTF-8"%>

<div  class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="xtgl_jsgl_toolbar" class="toolbar-div">
    <fieldset>
	    <legend>查询条件</legend>
            <form id="xtgl_jsgl_queryform" method="post" >
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">名称：</label>
                <input id="xtgl_jsgl_search_jsmc" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
             </form>
         </fieldset>  
        <div class="toolbar-btn">
			<div class="btn-left">
            	<a href="#" id="xtgl_jsgl_zj_btn" class="mwsmartui-linkbutton" data-options="onClick:xtgl_jsgl_add"><i class="fa fa-plus"> </i> 添加</a>
            	<a href="#" id="xtgl_jsgl_plsc_btn" class="mwsmartui-linkbutton" data-options="disabled:true,onClick:xtgl_jsgl_plsc"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:xtgl_jsgl_search"><i class="fa fa-search"> </i> 查询</a>
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:xtgl_jsgl_reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="xtgl_jsgl_jslb" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
            scrollbarSize:217,
            url:'./Role-list.action',
			toolbar:'#role_list_toolbar',
			onCheck:xtgl_jsgl_togglePlsc,onUncheck:xtgl_jsgl_togglePlsc,onCheckAll:xtgl_jsgl_togglePlsc,
    	onUncheckAll:xtgl_jsgl_togglePlsc,onLoadSuccess:xtgl_jsgl_togglePlsc">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
                    <th data-options="field:'name',width:'30%'"><b>名称</b></th>
                    <th data-options="field:'bak',width:'70%'"><b>备注</b></th>
                    <th data-options="field:'status',width:'180',formatter:xtgl_jsgl_retBtn"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>


