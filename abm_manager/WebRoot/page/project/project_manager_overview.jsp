<%@page import="com.abm.common.utils.StringUtil"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String project_id = (String)request.getParameter("project_id");
	if(StringUtil.isEmpty(project_id)){
		out.print("找不到项目信息");
		return;
	}
	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
   <div class="mwsmartui-layout" data-options="fit:true,border:false">
    <div data-options="border:false,region:'north',height:'45px'" style="text-align:right;padding:8px;" >
     
    <a href="#" class="mwsmartui-linkbutton" data-options="plain:true,toggle:true,onClick:manager_retList" 
    style=" border-color:#28b779 !important;background-color:#28b779 !important; color:#FFF"><i class="icon-share"> </i> 返回</a>
    </div>
    <div id="project_tabs_div" data-options="project_id:'<%=project_id %>',border:false,region:'center',onSelect:projectManage.selectTab" class="mwsmartui-tabs" style="border-top:solid 1px #cecece; ">
        <input id="project_id" type="hidden" value="<%=project_id %>"/>
        <div data-options="title:'项目信息'">
        	<div class="mwsmartui-layout" data-options="border:false,fit:true">
			    <div data-options="border:false,region:'center'" >
				      <form id="project_info_form" method="post" >
					      	<input type="hidden" name="project.id"/>
					      	<input type="hidden" name="project.enterprise_id"/>
				            <div style="width:950px; height:auto; margin:8px auto;">
				            <div class="lbcxtj" style="width:300px; height:30px;">
				                <label >项目名称：</label>
				                <input name="project.name" class="mwsmartui-textbox" data-options="width:'200px',height:'30px'"/>
				            </div>
				            <div class="lbcxtj" style="width:300px; height:30px;">
				                <label >项目编号：</label>
				                <input name="project.sn" class="mwsmartui-textbox" data-options="width:'200px',height:'30px'"/>
				            </div>
				            <div class="lbcxtj" style="width:300px; height:30px;">
								<label>类别：</label> 
								<select name="project.type"  class="mwsmartui-combobox"  data-options="data:common.listCodesByType('XMLB'),
	                 																					valueField:'code',
	                 																					textField:'name',
	                 																					width:'200px',height:'30px'" >
								</select>
							</div>
				            <div class="lbcxtj" style="width:300px; height:30px;">
				                <label>项目级别：</label>
				                <input name="project.level" class="mwsmartui-textbox" data-options="width:'200px',height:'30px'"/>
				            </div>
				            <div class="lbcxtj" style="width:300px; height:30px;">
				                <label>项目区域：</label>
				               	<input name="project.area" class="mwsmartui-textbox" data-options="width:'200px',height:'30px'"/>
				            </div> 
				             <div class="lbcxtj" style="width:300px; height:30px;">
					            <label >开始时间：</label>
					            <input name="project.start_time" class="mwsmartui-datebox" data-options="width:'200px',height:'30px'"/>
				            </div>
				            <div class="lbcxtj" style="width:300px; height:30px;">
					            <label >结束时间： </label>
					            <input name="project.end_time" class="mwsmartui-datebox" data-options="width:'200px',height:'30px'"/>
				            </div>
				            <div class="lbcxtj" style="width:300px; height:30px;">
				                <label>项目状态：</label>
				                <input name="project.status" class="mwsmartui-textbox" data-options="width:'200px',height:'30px'"/>
				            </div> 
				            <div class="lbcxtj" style="width:910px; height:60px; padding-top:2px;">
					            <label>备注：</label>
					            <input name="project.bak" class="mwsmartui-textbox" data-options="width:'806px',height:'60px',multiline:true"/>
				            </div>
			            </div>
			        </form>
	        </div>
	        <div style="text-align:center;padding:10px 0px;" data-options="border:false,region:'south',height:'50px'" >
				<a id="project_info_update" href="#" class="mwsmartui-linkbutton" data-options=""><i class="fa fa-check"> </i> 保存</a>
			</div>
       </div>
        
        </div>
        <div id="xmry_tab" data-options="title:'项目人员'">
        
        </div>
        <div id="zysj_tab" data-options="title:'重要事件'">
        
        </div>
        <div id="xjgl_tab" data-options="title:'巡检管理'">
       
        </div>
        <div id="xfxj_tab" data-options="title:'消防巡检'">
       
        </div>
        <div id="xmzb_tab" data-options="title:'项目装备'">
       
        </div>
        <div id="xmpx_tab" data-options="title:'项目培训'">
       
        </div>
        <div id="gzjc_tab" data-options="title:'工作检查'">
        
        </div>
       	<div id="tshf_tab" data-options="title:'投诉回访'">
        
        </div>
  
    </div>
    </div>
</body>
</html>
