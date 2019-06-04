<%@ page language="java"  pageEncoding="UTF-8"%>
<%@page import="java.util.*" import="com.abm.common.service.*" import="com.abm.common.model.*" %>
<div class="mwsmartui-layout" data-options="border:false,fit:true">
    <div data-options="title:'类别',collapsible:false,border:false,region:'west',width:'180px'">
    <%
    	List<SysCodeTypeModel>  codeTypes = BaseCodeService.getSingle().listCodeTypes();
     %>
        <ul  class="mwsmartui-tree" data-options="onClick:xtgl_sjzd_selType">
        <%if(codeTypes!=null){ 
        	for(int i=0;i<codeTypes.size();i++){
        %>
            <li data-options="<%if(i==0){ %>checked:true,<%} %>id:'<%=codeTypes.get(i).getId()%>'"><span><%=codeTypes.get(i).getName()%></span></li>

            <%}} %>
        </ul>
     
    
    </div>
    <div data-options="border:false, title:'编码',region:'center'" style="border-left-width:1px !important;">
        <div  class="mwsmartui-layout" data-options="border:false,fit:true">
            <div data-options="border:false,region:'north',height:'50px'">
                    <div style="height:28px; padding:10px 5px; clear:both; background-color:#fdfdfd;">
                    <div class="mwsmartui-layout" data-options="fit:true,border:false">
                        
                        <div data-options="region:'center',border:false">
                         <a id="xtgl_sjzd_add_btn" href="#" class="mwsmartui-linkbutton"  data-options="onClick:xtgl_sjzd_add"><i class="fa fa-plus"> </i> 添加</a>
                          
                       <a href="#" id="xtgl_sjzd_plsc_btn" class="mwsmartui-linkbutton" data-options="onClick:xtgl_sjzd_plsc,disabled:true"><i class="fa fa-trash"> </i> 删除</a>
                        </div>
                     </div>
                    </div>
            </div>
        
        <div data-options="region:'center',border:false" style="border-top-width:1px !important;">
           <table id="xtgl_sjzd_list" class="mwsmartui-datagrid" data-typeid="<%if(codeTypes!=null&&codeTypes.size()>0){out.print(codeTypes.get(0).getId());}%>" data-options="            
                pagination:true,
                pageSize:20,
                 selectOnCheck:true,
                checkOnSelect:true,
                singleSelect:false,
                border:false,
                striped:true,
                collapsible:true,
                fit:true,
              	method:'post',
              	sortName:'seq',
              	sortOrder:'asc',
              	url:'./BaseCode-listByType.action?type_id=<%if(codeTypes!=null&&codeTypes.size()>0){out.print(codeTypes.get(0).getId());}%>',
                scrollbarSize:129,
                onCheck:xtgl_sjzd_togglePlsc,
                onUncheck:xtgl_sjzd_togglePlsc,
                onCheckAll:xtgl_sjzd_togglePlsc,
    			onUncheckAll:xtgl_sjzd_togglePlsc,
    			onLoadSuccess:xtgl_sjzd_togglePlsc">
                <thead>
                    <tr>
                        <th data-options="field:'ck',checkbox:true">ID</th>
                        <th data-options="field:'code',width:'25%'"><b>编码</b></th>
                        <th data-options="field:'name',width:'50%'"><b>名称</b></th>
                        <th data-options="field:'seq',width:'25%'"><b>排序</b></th>
                         <th data-options="field:'status',width:'90',formatter:xtgl_sjzd_retBtn"><b>操作</b></th>
                    </tr>
                </thead>
            </table>
        </div>
      </div>



</div>
</div>