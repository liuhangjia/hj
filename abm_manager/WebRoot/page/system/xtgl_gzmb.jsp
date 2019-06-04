<%@ page language="java"  pageEncoding="UTF-8"%>

<div  class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="xtgl_gzmb_toolbar" class="toolbar-div">
            <form id="xtgl_gzmb_queryform" method="post" >
				<fieldset>
					<legend>查询条件：</legend>
					<div class="lbcxtj">
						<label style="display:inline-block; width:100px; text-align:right;">名称：</label>
						<input id="xtgl_gzmb_search_mc" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
					</div>
				</fieldset>
             </form>
           
        <div class="toolbar-btn">
			<div class="btn-left">
            	<a href="#" id="xtgl_gzmb_zj_btn" class="mwsmartui-linkbutton" data-options="onClick:xtgl_gzmb_add"><i class="fa fa-plus"> </i> 添加</a>
            	<a href="#" id="xtgl_gzmb_plsc_btn" class="mwsmartui-linkbutton" data-options="disabled:true,onClick:xtgl_gzmb_plsc"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:xtgl_gzmb_search"><i class="fa fa-search"> </i> 查询</a>
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:xtgl_gzmb_reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="xtgl_gzmb_jslb" class="mwsmartui-datagrid" data-options="pagination:true,
																		   pageSize:20,
																		   selectOnCheck:true,
																		   fileOnSelect:true,
																		   border:false,
																		   striped:true,
																		   fit:true,
																		   method:'post',
															               scrollbarSize:37,
																		   toolbar:'#xtgl_gzmb_toolbar',
																		   url:'./Payroll-listByMb',
																		   onCheck:xtgl_gzmb_togglePlsc,onUncheck:xtgl_gzmb_togglePlsc,onCheckAll:xtgl_gzmb_togglePlsc,
															    	       onUncheckAll:xtgl_gzmb_togglePlsc,onLoadSuccess:xtgl_gzmb_togglePlsc">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
                    <th data-options="field:'name',width:'25%'"><b>名称</b></th>
                    <th data-options="field:'enterprise_id',width:'25%',formatter:function(value,row){if(row['enterpriseModel']){return row['enterpriseModel']['name'];}}"><b>企业</b></th>
                    <th data-options="field:'creator_name',width:'10%'"><b>创建人</b></th>
                    <th data-options="field:'create_time',width:'20%',formatter:common.fmt_date19"><b>创建时间</b></th>
                    <th data-options="field:'status',width:'20%',formatter:xtgl_gzmb_retBtn"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>


