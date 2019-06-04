<%@ page language="java"  pageEncoding="UTF-8"%>

<div class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="xtgl_yhgl_toolbar" class="toolbar-div">
    <fieldset>
	    <legend>查询条件</legend>
            <form id="xtgl_yhgl_queryform" method="post" >
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">账号：</label>
                <input class="mwsmartui-textbox" id="xtgl_yhgl_search_account" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
              <div class="lbcxtj">
            <label style="display:inline-block; width:100px; text-align:right;">姓名：</label>
            <input  class="mwsmartui-textbox" id="xtgl_yhgl_search_name" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
           
            </form>
        </fieldset>  
        <div class="toolbar-btn">
			<div class="btn-left">
             	 <a href="#" id="xtgl_yhgl_zj_btn"  class="mwsmartui-linkbutton" data-options="onClick:xtgl_yhgl_add"><i class="fa fa-plus"> </i> 添加</a>
             	 <a href="#" id="xtgl_yhgl_yy_btn"  class="mwsmartui-linkbutton" data-options="onClick:xtgl_yhgl_yy"><i class="fa fa-plus"> </i> 引用</a>
                 <a href="#" id="xtgl_yhgl_plsc_btn" class="mwsmartui-linkbutton" data-options="disabled:true,onClick:xtgl_yhgl_plsc"><i class="fa fa-trash"> </i> 批量删除</a>
				 
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:xtgl_yhgl_search"><i class="fa fa-search"> </i> 查询</a>
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:xtgl_yhgl_reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="xtgl_yhgl_yhlb" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			url:'./Operator-list.action',
			method:'post',
            scrollbarSize:217,
			toolbar:'#xtgl_yhgl_toolbar',
			onCheck:xtgl_yhgl_togglePlsc,onUncheck:xtgl_yhgl_togglePlsc,onCheckAll:xtgl_yhgl_togglePlsc,
    	onUncheckAll:xtgl_yhgl_togglePlsc,onLoadSuccess:xtgl_yhgl_togglePlsc">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
                    <th data-options="field:'account',width:'25%',formatter:function(value){return value['account'];}"><b>账号</b></th>
                    <th data-options="field:'name',width:'25%'"><b>姓名</b></th>
                    <th data-options="field:'bak',width:'50%'"><b>备注</b></th>
                    <th data-options="field:'status',width:'180',formatter:xtgl_yhgl_retBtn"><b>操作</b></th>
                </tr>
            </thead>
            
        </table>
  </div>

