<%@ page language="java"  pageEncoding="UTF-8"%>
<div id="bjjk_spxz" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="bjjk_spxz_list_toolbar" class="toolbar-div">
            <form id="bjjk_spxz_queryform" method="post" >
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">视频名称：</label>
                <input id="bjjk_spxz_search_mc" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>    
			 <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">上传人：</label>
                <input id="bjjk_spxz_search_scr" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div> 
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">上传时间从：</label>
                <input id="bjjk_spxz_search_kssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">到：</label>
                <input id="bjjk_spxz_search_jssj" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
            
            </div>
            
          
            </form>
        <div class="toolbar-btn">
			<div class="btn-left">
                   
                    <!-- <a href="#" class="mwsmartui-linkbutton" data-options="onClick:bjjk_spxz_download"><i class="fa fa-download"> </i> 批量下载</a> -->
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:bjjk_spxz_search"><i class="fa fa-search"> </i> 查询</a>
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:bjjk_spxz_reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="bjjk_spxz_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			singleSelect:true,
			border:false,
			striped:true,
			fit:true,
			sortName:'upload_time',
			sortOrder:'desc',
			method:'post',
			url:'./Video-list.action',
            scrollbarSize:120,
			toolbar:'#bjjk_spxz_list_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'name',width:'30%'"><b>视频名称</b></th>
                    <th data-options="field:'upload_time',width:'15%',formatter:function(value){return common.fmt_date(value);}"><b>上传时间</b></th>
                    <th data-options="field:'upload_name',width:'15%'"><b>上传人</b></th>
                    <th data-options="field:'bak',width:'40%'"><b>备注</b></th>
                    <th data-options="field:'status',width:'120',formatter:bjjk_spxz_doHandle"><b>操作</b></th>
                   
                    
                </tr>
            </thead>
        </table>
  </div>