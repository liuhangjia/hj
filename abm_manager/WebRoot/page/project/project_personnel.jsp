<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String project_id = (String)request.getParameter("project_id");
	if(null == project_id){
		project_id="";
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>

<script  type="text/javascript" src="./js/project/projectEmp.js"></script>
<div  class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="personnel_list_toolbar<%=project_id %>" class="toolbar-div">
    	<fieldset>
			<legend>查询条件</legend>
            <form id="personnel_queryform<%=project_id %>" method="post" >
            <div class="lbcxtj">
                <label>项目名称：</label>
                <input id="xmry_search_xmmc" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div> 
            <div class="lbcxtj">
                <label>姓名：</label>
                <input id="xmry_search_xingming" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>企业：</label>
                <input id="xmry_search_qy" class="mwsmartui-combobox" data-options="
                url:'./Enterprise-listForPriv.action?priv=PROJECT_EMPLOYEE_LIST',
                valueField:'id',
                textField:'name',
                onSelect:projectEmp.searchSelect_qy,
                width:'145px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>部门：</label>
                <input id="xmry_search_bm" class="mwsmartui-combotree" data-options="
                valueField:'id',
                textField:'name',
                width:'145px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>职务：</label>
                <input id="xmry_search_zw" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>
            <div class="lbcxtj">
                <label>联系电话：</label>
                <input id="xmry_search_lxdh" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>   
           <%--
            <div class="lbcxtj">
                <label>当前状态：</label>
                <select id="" class="mwsmartui-combobox" name="language" data-options="width:'145px',height:'30px'" >
                <option value="0">未提交</option>
                <option value="1">待审核</option>
                <option value="2">审核通过</option>
                <option value="3">审核拒绝</option>
                </select>
            </div>       
            --%>
            </form>
        </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
                <a id="project_personnel_add_btn<%=project_id %>" href="#" class="mwsmartui-linkbutton" data-options="project_id:'<%=project_id %>',onClick:projectEmp.add"><i class="fa fa-plus"> </i> 添加</a>
                <a id="project_personnel_del_btn<%=project_id %>" href="#" class="mwsmartui-linkbutton" data-options="disabled:true,project_id:'<%=project_id %>',onClick:projectEmp.delBatch"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="project_id:'<%=project_id %>',onClick:projectEmp.query"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" class="mwsmartui-linkbutton"  data-options="project_id:'<%=project_id %>',onClick:projectEmp.reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="personnel_list<%=project_id %>" class="mwsmartui-datagrid" data-options=" pagination:true,
																							pageSize:20,
																							selectOnCheck:true,
																							fileOnSelect:true,
																							singleSelect:false,
																							border:false,
																							striped:true,
																							fit:true,
																							method:'post',
																							url:'./ProjectEmp-list.action?project_id=<%=project_id %>',
																				            scrollbarSize:217,
																				            project_id:'<%=project_id %>',
																				            onCheck:projectEmp.click,
																				            onUncheck:projectEmp.click,
																				            onCheckAll:projectEmp.click,
																				  			onUncheckAll:projectEmp.click,
																				  			onLoadSuccess:projectEmp.click,
																							toolbar:'#personnel_list_toolbar<%=project_id %>'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'project_name',width:'18%'"><b>项目名称</b></th>
                    <th data-options="field:'name',width:'11%'"><b>姓名</b></th> 
                    <th data-options="field:'range_name',width:'9%'"><b>班次</b></th>                      
                    <th data-options="field:'sex',width:'8%',formatter:function(value){return common.codeToName('XB',value);}"><b>性别</b></th>                    
                    <th data-options="field:'depart_name',width:'10%',formatter:common.departIdToName"><b>部门</b></th>                    
                    <th data-options="field:'position',width:'11%'"><b>职务</b></th>
                    <th data-options="field:'phone',width:'12%'"><b>联系电话</b></th>
                    <th data-options="field:'duty',width:'20%'"><b>负责内容</b></th>
                    <th data-options="field:'status',project_id:'<%=project_id %>',width:'190',formatter:projectEmp.listOpts"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
</body>
</html>
