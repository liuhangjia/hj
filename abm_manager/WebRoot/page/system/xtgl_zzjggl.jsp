<%@page import="com.abm.common.utils.PrivUtil"%>
<%@page import="com.abm.common.model.AccountsModel"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>
<%@page import="com.abm.common.model.EnterpriseModel"%>
<%@page import="com.abm.common.service.EnterpriseService"%>
<%@page import="com.abm.common.utils.Constants"%>
<%@ page language="java"  pageEncoding="UTF-8"%>
<div class="mwsmartui-layout" data-options="border:false,fit:true">
    <div data-options="title:'企业',collapsible:false,border:false,region:'west',width:'180px'">
    <%
	    StringBuffer condition = new StringBuffer(" and is_delete=? ");
		List<String> params = new ArrayList<String>();
		params.add(Constants.IS_DELETE_FALSE);
	    AccountsModel user = (AccountsModel)session.getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(user, "DEPART_MANAGER_LIST"));
		List<EnterpriseModel> companys = EnterpriseService.getSingle().queryByPage(condition.toString(), params.toArray(new String[params.size()]), 1, 100000, "START_TIME", null);
    	//List<EnterpriseModel>  companys = EnterpriseService.getSingle().listCompanys();
     %>
        <ul  class="mwsmartui-tree" data-options="onClick:xtgl_zzjggl_selComp">
        <%if(companys!=null){ 
        	for(int i=0;i<companys.size();i++){
        %>
            <li data-options="<%if(i==0){ %>checked:true,<%} %>
            id:'<%=companys.get(i).getId()%>'">
            <span><%=companys.get(i).getName()%></span>
            </li>
            <%}} %>
        </ul>
     
    
    </div>
    <div data-options="border:false, title:'部门',region:'center'" style="border-left-width:1px !important;">
        <div  class="mwsmartui-layout" data-options="border:false,fit:true">
        <div data-options="region:'center',border:false" style="border-top-width:1px !important;">
           <%-- url:'./Depart-listDept.action', --%>
           <table id="xtgl_zzjg_list" class="mwsmartui-treegrid" data-options="
				      													border:false,
				      													checkOnSelect:false,
				      													fit:true,
				      													singleSelect:true,
				      													collapsible:true,
				      													striped:true,
				      													method:'post',
				      													url:'./Depart-listDept.action',
				      													idField: 'id',
																		treeField: 'name',
																		onDblClickRow:function(row,index){
																		},
																		toolbar:'#toolbar_xtgl_zzjg_list',
				      													scrollbarSize:260">
	           <thead>
	               <tr>
	                   <th data-options="field:'name',width:'50%'"><b>名称</b></th>
	                   <th data-options="field:'xx',width:'260px',align:'center',formatter:xtgl_zzjggl_opt_btn"><b>操作</b></th>
	               </tr>
	           </thead>
       		</table>
        </div>
      </div>
   </div>
</div>