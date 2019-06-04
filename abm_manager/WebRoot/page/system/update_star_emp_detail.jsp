<%@page import="com.mw.common.utils.StringUtil"%>

<%@ page language="java"  pageEncoding="UTF-8"%>
<%
	String emp_id = (String)request.getParameter("emp_id");
	if(StringUtil.isEmpty(emp_id)){
		emp_id="";
	}
	
%>
<div class="mwsmartui-layout" data-options="fit:true,border:false">
	<script type="text/javascript" src="./js/employee.js"></script>
    
    <div data-options="border:false,region:'center'" style="border-top:solid 1px #cecece; padding:10px; ">
    
    <form id="update_star_emp_detail_form<%=emp_id %>" method="post" >
		     <fieldset>
		      <legend>1、基本信息</legend>
		      <div style="width:980px; height:auto; margin:8px auto;">
	            <div class="lbcxtj" >
	                <label >手机号码：</label>
	            	<label id="phone<%=emp_id %>" style="text-align: left;width:130px;"></label>
	            </div>
	            <div class="lbcxtj" >
	                <label >姓名：</label>
	            	<label id="name<%=emp_id %>" style="text-align: left;width:130px;"></label>
	            </div>
	              <div class="lbcxtj" >
	                <label >性别：</label>
	                <label id="sex<%=emp_id %>" style="text-align: left;width:130px;"></label>
	            </div>
	             <div class="lbcxtj" >
	                <label>民族：</label>
	                <label id="nation<%=emp_id %>" style="text-align: left;width:130px;"></label>
	            </div>
	            <div class="lbcxtj" >
	                <label>政治面貌：</label>
	                <label id="political<%=emp_id %>" style="text-align: left;width:130px;"></label>
	            </div> 
	             <div class="lbcxtj" >
	            	<label >出生年月：</label>
	            	 <label id="birthday<%=emp_id %>" style="text-align: left;width:130px;"></label>
	            </div>
	             <div class="lbcxtj" >
	                <label >身高(cm)：</label>
	                <label id="height<%=emp_id %>" style="text-align: left;width:130px;"></label>
	            </div>
	             <div class="lbcxtj" >
	                <label>体重(kg)：</label>
	                <label id="weight<%=emp_id %>" style="text-align: left;width:130px;"></label>
	            </div> 
	            <div class="lbcxtj" >
	                <label >身份证号：</label>
	                <label id="id_number<%=emp_id %>" style="text-align: left;width:130px;"></label>
	            </div>
	            <div class="lbcxtj" >
	                <label >注册时间：</label>
	                <label id="register_time<%=emp_id %>" style="text-align: left;width:130px;"></label>
	            </div>
	            <div class="lbcxtj" >
	                <label >星级：</label>
	                <label id="star<%=emp_id %>" style="text-align: left;width:130px;"></label>
	            </div>
	          </div>
           </fieldset> 
        </form>
        <form method="post" >
         <fieldset style="height:auto;">
      <legend>2、教育经历</legend>
        	 
       <table id="update_star_emp_detail_education_list<%=emp_id %>" class="mwsmartui-datagrid" style="height:100px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'post',
			url:'./Employee-getEmpInfoList.action?emp_id=<%=emp_id %>&tName=emp_education',
            scrollbarSize:29
			">
            <thead>
                <tr>
                    <th data-options="field:'start_time',width:'15%'"><b>开始时间</b></th>                    
                    <th data-options="field:'end_time',width:'15%'"><b>毕业时间</b></th>                    
                    <th data-options="field:'school',width:'25%'"><b>就读学校</b></th>                    
                    <th data-options="field:'owner',width:'10%'"><b>证明人</b></th>
                    <th data-options="field:'examiner_name',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'examine_status',width:'24%',formatter:employee.fmt_shzt"><b>审核结果</b></th>
                </tr>
            </thead>
        </table>
         </fieldset>   
         <br/>
                  <fieldset>
      <legend>3、工作经历</legend>
        	 
       <table id="update_star_emp_detail_works_list<%=emp_id %>" class="mwsmartui-datagrid" style="height:100px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'post',
			url:'./Employee-getEmpInfoList.action?emp_id=<%=emp_id %>&tName=emp_work',
            scrollbarSize:29
			">
            <thead>
                <tr>
                    <th data-options="field:'start_time',width:'15%'"><b>开始时间</b></th>                    
                    <th data-options="field:'end_time',width:'15%'"><b>结束时间</b></th>                    
                    <th data-options="field:'name',width:'25%'"><b>所在公司</b></th>  
                    <th data-options="field:'position',width:'10%'"><b>职务</b></th>                  
                    <th data-options="field:'owner',width:'10%'"><b>证明人</b></th>
                    <th data-options="field:'examiner_name',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'examine_status',width:'14%',formatter:employee.fmt_shzt"><b>审核结果</b></th>
                </tr>
            </thead>
        </table>
         </fieldset> 
         <br/>
                  <fieldset>
      <legend>4、工作业绩</legend>
        	 
       <table id="update_star_emp_detail_performance_list<%=emp_id %>" class="mwsmartui-datagrid" style="height:100px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'post',
			url:'./Employee-getEmpInfoList.action?emp_id=<%=emp_id %>&tName=emp_achievement',
            scrollbarSize:29
			">
            <thead>
                <tr>
                    <th data-options="field:'start_time',width:'15%'"><b>开始时间</b></th>                    
                    <th data-options="field:'end_time',width:'15%'"><b>结束时间</b></th>                    
                    <th data-options="field:'project_name',width:'15%'"><b>项目名称</b></th>  
                    <th data-options="field:'project_type',width:'10%'"><b>项目类别</b></th>                  
                    <th data-options="field:'bak',width:'20%'"><b>说明</b></th>
                    <th data-options="field:'examiner_name',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'examine_status',width:'14%',formatter:employee.fmt_shzt"><b>审核结果</b></th>
                </tr>
            </thead>
        </table>
         </fieldset> 
			<br/>
                     <fieldset>
      <legend>5、培训经历</legend>
        	 
       <table id="update_star_emp_detail_trains_list<%=emp_id %>" class="mwsmartui-datagrid" style="height:100px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'post',
			url:'./Employee-getEmpInfoList.action?emp_id=<%=emp_id %>&tName=emp_training',
            scrollbarSize:29
			">
            <thead>
                <tr>
                    <th data-options="field:'start_time',width:'15%'"><b>开始时间</b></th>                    
                    <th data-options="field:'end_time',width:'15%'"><b>结束时间</b></th>                    
                    <th data-options="field:'name',width:'25%'"><b>培训机构</b></th>                    
                    <th data-options="field:'owner',width:'10%'"><b>证明人</b></th>
                    <th data-options="field:'examiner_name',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'examine_status',width:'24%',formatter:employee.fmt_shzt"><b>审核结果</b></th>
                </tr>
            </thead>
        </table>
         </fieldset>   
<br/>
         <fieldset>
      <legend>6、资格证书</legend>
        	 
       <table id="update_star_emp_detail_cer_list<%=emp_id %>" class="mwsmartui-datagrid" style="height:100px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'post',
			url:'./Employee-getEmpInfoList.action?emp_id=<%=emp_id %>&tName=emp_certifacation',
            scrollbarSize:29
			">
            <thead>
                <tr>
                    <th data-options="field:'name',width:'25%'"><b>证书名称</b></th>                    
                    <th data-options="field:'publish_time',width:'10%'"><b>发证时间</b></th>                    
                    <th data-options="field:'type',width:'10%'"><b>证书种类</b></th>                    
                    <th data-options="field:'publisher',width:'20%'"><b>发证单位</b></th>
                    <th data-options="field:'valid',width:'10%'"><b>有效日期</b></th>
                    <th data-options="field:'examiner_name',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'examine_status',width:'14%',formatter:employee.fmt_shzt"><b>审核结果</b></th>
                </tr>
            </thead>
        </table>
         </fieldset>   
<br/>
         <fieldset>
      <legend>7、所获奖励</legend>
        	 
       <table id="update_star_emp_detail_award_list<%=emp_id %>" class="mwsmartui-datagrid" style="height:100px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'post',
			url:'./Employee-getEmpInfoList.action?emp_id=<%=emp_id %>&tName=emp_award',
            scrollbarSize:29
			">
            <thead>
                <tr>
                    <th data-options="field:'pulish_time',width:'15%'"><b>获奖时间</b></th>                    
                    <th data-options="field:'name',width:'15%'"><b>获奖名称</b></th>                    
                    <th data-options="field:'pulisher',width:'25%'"><b>颁奖单位</b></th>                    
                    <th data-options="field:'owner',width:'15%'"><b>证明人</b></th>
                    <th data-options="field:'examiner_name',width:'15%'"><b>审核人</b></th>
                    <th data-options="field:'examine_status',width:'14%',formatter:employee.fmt_shzt"><b>审核结果</b></th>
                </tr>
            </thead>
        </table>
         </fieldset> 
         <br/>
         <%--
         <fieldset>
      <legend>8、工作评价</legend>
        	  <div id="update_star_emp_detail_positive_toolbar">
                    <a href="#" class="mwsmartui-linkbutton"  data-options=""><i class="fa fa-plus"> </i> 添加</a>
                    <a href="#"  class="mwsmartui-linkbutton" data-options=""><i class="fa fa-trash"> </i> 编辑</a>
                    <a href="#"  class="mwsmartui-linkbutton" data-options=""><i class="fa fa-trash"> </i> 删除</a>
		
    </div>
       <table  class="mwsmartui-datagrid" style="height:100px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'get',
            scrollbarSize:29,
			toolbar:'#update_star_emp_detail_positive_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
                    <th data-options="field:'pcmc',width:'10%'"><b>开始时间</b></th>                    
                    <th data-options="field:'shsj',width:'10%'"><b>结束时间</b></th>                    
                    <th data-options="field:'dxzt1',width:'15%'"><b>项目名称</b></th>  
                    <th data-options="field:'dxzt2',width:'10%'"><b>项目类别</b></th>                  
                    <th data-options="field:'dxzt',width:'10%'"><b>项目说明</b></th>
                    <th data-options="field:'dxzt3',width:'10%'"><b>业务评分</b></th>
                    <th data-options="field:'dxzt4',width:'10%'"><b>业务评价</b></th>
                    <th data-options="field:'sqrxm',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'sqrdw',width:'14%'"><b>审核结果</b></th>
                   
                    
                </tr>
            </thead>
            <tbody>
            	<tr>
                	<td></td>
                	<td>2013-02-23</td>
                	<td>2015-06-23</td>
                	<td>西安某某企业</td>
                	<td>保安队长</td>
                    <td>张三</td>
                    <td></td>
                    <td></td>
                    <td>李四</td>
                    <td>通过</td>
                </tr>
            </tbody>
        </table>
         </fieldset> 
         <br/>
         <fieldset>
      <legend>9、负面评价</legend>
        	 <div id="update_star_emp_detail_negative_toolbar">
                    <a href="#" class="mwsmartui-linkbutton"  data-options=""><i class="fa fa-plus"> </i> 添加</a>
                    <a href="#"  class="mwsmartui-linkbutton" data-options=""><i class="fa fa-trash"> </i> 编辑</a>
                    <a href="#"  class="mwsmartui-linkbutton" data-options=""><i class="fa fa-trash"> </i> 删除</a>
		
    </div>
       <table  class="mwsmartui-datagrid" style="height:100px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'get',
            scrollbarSize:29,
			toolbar:'#update_star_emp_detail_negative_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
                    <th data-options="field:'pcmc',width:'10%'"><b>开始时间</b></th>                    
                    <th data-options="field:'shsj',width:'10%'"><b>结束时间</b></th>                    
                    <th data-options="field:'dxzt1',width:'15%'"><b>项目名称</b></th>  
                    <th data-options="field:'dxzt2',width:'10%'"><b>项目类别</b></th>                  
                    <th data-options="field:'dxzt',width:'10%'"><b>项目说明</b></th>
                    <th data-options="field:'dxzt3',width:'10%'"><b>业务评分</b></th>
                    <th data-options="field:'dxzt4',width:'10%'"><b>业务评价</b></th>
                    <th data-options="field:'sqrxm',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'sqrdw',width:'14%'"><b>审核结果</b></th>
                   
                    
                </tr>
            </thead>
            <tbody>
            	<tr>
                	<td></td>
                	<td>2013-02-23</td>
                	<td>2015-06-23</td>
                	<td>西安某某企业</td>
                	<td>保安队长</td>
                    <td>张三</td>
                    <td></td>
                    <td></td>
                    <td>李四</td>
                    <td>通过</td>
                </tr>
            </tbody>
        </table>
         </fieldset>   
          --%>
          
       </form>     
       
    </div>
    </div>
