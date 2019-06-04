<%@page import="com.mw.common.utils.StringUtil"%>
<%@page import="com.abm.common.model.EmployeeModel"%>
<%@page import="com.abm.common.dao.EmployeeDao"%>
<%@ page language="java"  pageEncoding="UTF-8"%>
<%
	String emp_id = (String)request.getParameter("emp_id");
	if(StringUtil.isEmpty(emp_id)){
		emp_id="";
	}
	
%>
<div class="mwsmartui-layout" data-options="fit:true,border:false">
	<script type="text/javascript" src="./js/employee.js"></script>
    <div id="emp_base_info_fanhui_div<%=emp_id %>" data-options="border:false,region:'north',height:'45px'" style="text-align:right;padding:8px;" >
     
    <a href="#" class="mwsmartui-linkbutton" data-options="plain:true,toggle:true,onClick:abry_abrysjk_retList" 
    style=" border-color:#28b779 !important;background-color:#28b779 !important; color:#FFF"><i class="icon-share"> </i> 返回</a>
    </div>
    <div data-options="border:false,region:'center'" style="border-top:solid 1px #cecece; padding:10px; ">
    
    <form id="emp_base_info_form" method="post" >
    		 <input id="abrysjk_emp_id_input" name="employee.id" type="hidden"  >
		     <fieldset>
		      <legend>1、基本信息</legend>
		      <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:employee.save"><i class="fa fa-check"> </i> 保存</a>
		      <div style="width:980px; height:auto; margin:8px auto;">
	            <div class="lbcxtj" >
	                <label >手机号码：</label>
	                <input id="" class="mwsmartui-textbox" name="employee.phone" data-options="required:true,width:'140px',height:'30px'">
	            </div>
	            <div class="lbcxtj" >
	                <label >姓名：</label>
	                <input id="abrysjk_jbxx_xm" class="mwsmartui-textbox" name="employee.name" data-options="required:true,width:'140px',height:'30px'">
	            </div>
	              <div class="lbcxtj" >
	                <label >性别：</label>
	                 <select id="emp_sex<%=emp_id %>" class="mwsmartui-combobox" name="employee.sex" data-options="data:common.listCodesByType('XB'),
	                 																					valueField:'code',
	                 																					textField:'name',
	                 																					required:true,width:'140px',height:'30px'" >
	                </select>
	            </div>
	             <div class="lbcxtj" >
	                <label>民族：</label>
	               <select id="" class="mwsmartui-combobox" name="employee.nation" data-options="data:common.listCodesByType('MZ'),
	                 																			valueField:'code',
	                 																			textField:'name',
	               																				required:true,width:'140px',height:'30px'" >
	                </select>
	            </div>
	            <div class="lbcxtj" >
	                <label>政治面貌：</label>
	               <select id="" class="mwsmartui-combobox" name="employee.political" data-options="data:common.listCodesByType('ZZMM'),
	                 																				valueField:'code',
	                 																				textField:'name',
	               																					required:true,width:'140px',height:'30px'" >
	               
	                </select>
	            </div> 
	             <div class="lbcxtj" >
	            <label >出生年月：</label>
	            <input id="" class="mwsmartui-datebox" name="employee.birthday" data-options="required:true,width:'140px',height:'30px'">
	            </div>
	             <div class="lbcxtj" >
	                <label >身高(cm)：</label>
	                <input id="" class="mwsmartui-textbox" name="employee.height" data-options="required:true,width:'140px',height:'30px'">
	            </div>
	             <div class="lbcxtj" >
	                <label>体重(kg)：</label>
	               <input id="" class="mwsmartui-textbox" name="employee.weight" data-options="required:true,width:'140px',height:'30px'">
	            </div> 
	            <div class="lbcxtj" >
	                <label >身份证号：</label>
	                <input id="" class="mwsmartui-textbox" name="employee.id_number" data-options="required:true,width:'370px',height:'30px'">
	            </div>
	            <div class="lbcxtj" >
	                <label >注册时间：</label>
	                <input id="" class="mwsmartui-datebox" name="employee.register_time" data-options="width:'140px',height:'30px'">
	            </div>
	            <div class="lbcxtj" >
	                <label >星级：</label>
	                <input id="" class="mwsmartui-numberbox" name="employee.star" data-options="disabled:true,width:'140px',height:'30px'">
	            </div>
	          </div>
	          <%--
		      <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:employee.save"><i class="fa fa-check"> </i> 保存</a>
	           --%>
           </fieldset> 
        </form>
        <form id="abrysjk_child_table_form" method="post" >
         <fieldset style="height:auto;">
      <legend>2、教育经历</legend>
        	 <div id="abry_abrysjk_education_toolbar" >
                 <a href="#" class="mwsmartui-linkbutton" data-options="onClick:employee.modify_child_table,tName:'emp_education'"><i class="fa fa-plus"> </i> 添加</a>
                 <%--
                 <a href="#" class="mwsmartui-linkbutton" data-options=""><i class="fa fa-trash"> </i> 编辑</a>
                 <a href="#" class="mwsmartui-linkbutton" data-options=""><i class="fa fa-trash"> </i> 删除</a>
                  --%>
    		 </div>
       <table id="emp_education_list" class="mwsmartui-datagrid" style="height:150px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'post',
			url:'./Employee-getEmpInfoList.action?emp_id=<%=emp_id %>&tName=emp_education',
            scrollbarSize:29,
			toolbar:'#abry_abrysjk_education_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'start_time',width:'15%',formatter:common.fmt_date10"><b>开始时间</b></th>                    
                    <th data-options="field:'end_time',width:'15%',formatter:common.fmt_date10"><b>毕业时间</b></th>                    
                    <th data-options="field:'school',width:'25%'"><b>就读学校</b></th>                    
                    <th data-options="field:'owner',width:'10%'"><b>证明人</b></th>
                    <th data-options="field:'examiner_name',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'examine_status',width:'10%',formatter:employee.fmt_shzt"><b>审核结果</b></th>
                    <th data-options="field:'xx01',width:'14%',tName:'emp_education',formatter:employee.opt_btn"><b>操作</b></th>
                </tr>
            </thead>
        </table>
         </fieldset>   
         <br/>
                  <fieldset>
      <legend>3、工作经历</legend>
        	 <div id="abry_abrysjk_works_toolbar">
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:employee.modify_child_table,tName:'emp_work'"><i class="fa fa-plus"> </i> 添加</a>
    		</div>
       <table id="emp_work_list" class="mwsmartui-datagrid" style="height:150px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'post',
			url:'./Employee-getEmpInfoList.action?emp_id=<%=emp_id %>&tName=emp_work',
            scrollbarSize:29,
			toolbar:'#abry_abrysjk_works_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'start_time',width:'10%',formatter:common.fmt_date10"><b>开始时间</b></th>                    
                    <th data-options="field:'end_time',width:'10%',formatter:common.fmt_date10"><b>结束时间</b></th>                    
                    <th data-options="field:'name',width:'25%'"><b>所在公司</b></th>  
                    <th data-options="field:'position',width:'10%'"><b>职务</b></th>                  
                    <th data-options="field:'owner',width:'10%'"><b>证明人</b></th>
                    <th data-options="field:'examiner_name',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'examine_status',width:'10%',formatter:employee.fmt_shzt"><b>审核结果</b></th>
                    <th data-options="field:'xx01',width:'14%',tName:'emp_work',formatter:employee.opt_btn"><b>操作</b></th>
                </tr>
            </thead>
        </table>
         </fieldset> 
         <br/>
                  <fieldset>
      <legend>4、工作业绩</legend>
        	 <div id="abry_abrysjk_performance_toolbar">
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:employee.modify_child_table,tName:'emp_achievement'"><i class="fa fa-plus"> </i> 添加</a>
    		</div>
       <table id="emp_achievement_list" class="mwsmartui-datagrid" style="height:120px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'post',
			url:'./Employee-getEmpInfoList.action?emp_id=<%=emp_id %>&tName=emp_achievement',
            scrollbarSize:29,
			toolbar:'#abry_abrysjk_performance_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'start_time',width:'10%',formatter:common.fmt_date10"><b>开始时间</b></th>                    
                    <th data-options="field:'end_time',width:'10%',formatter:common.fmt_date10"><b>结束时间</b></th>                    
                    <th data-options="field:'project_name',width:'15%'"><b>项目名称</b></th>  
                    <th data-options="field:'project_type',width:'10%'"><b>项目类别</b></th>                  
                    <th data-options="field:'bak',width:'20%'"><b>说明</b></th>
                    <th data-options="field:'examiner_name',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'examine_status',width:'10%',formatter:employee.fmt_shzt"><b>审核结果</b></th>
                    <th data-options="field:'xx01',width:'14%',tName:'emp_achievement',formatter:employee.opt_btn"><b>操作</b></th>
                </tr>
            </thead>
        </table>
         </fieldset> 
			<br/>
         <fieldset>
      		<legend>5、培训经历</legend>
        	 <div id="abry_abrysjk_trains_toolbar">
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:employee.modify_child_table,tName:'emp_training'"><i class="fa fa-plus"> </i> 添加</a>
    		</div>
       <table id="emp_training_list" class="mwsmartui-datagrid" style="height:120px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'post',
			url:'./Employee-getEmpInfoList.action?emp_id=<%=emp_id %>&tName=emp_training',
            scrollbarSize:29,
			toolbar:'#abry_abrysjk_trains_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'start_time',width:'15%',formatter:common.fmt_date10"><b>开始时间</b></th>                    
                    <th data-options="field:'end_time',width:'15%',formatter:common.fmt_date10"><b>结束时间</b></th>                    
                    <th data-options="field:'name',width:'25%'"><b>培训机构</b></th>                    
                    <th data-options="field:'owner',width:'10%'"><b>证明人</b></th>
                    <th data-options="field:'examiner_name',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'examine_status',width:'10%',formatter:employee.fmt_shzt"><b>审核结果</b></th>
                    <th data-options="field:'xx01',width:'14%',tName:'emp_training',formatter:employee.opt_btn"><b>操作</b></th>
                </tr>
            </thead>
        </table>
         </fieldset>   
<br/>
         <fieldset>
      <legend>6、资格证书</legend>
        	 <div id="abry_abrysjk_certificate_toolbar" >
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:employee.modify_child_table,tName:'emp_certifacation'"><i class="fa fa-plus"> </i> 添加</a>
    		</div>
       <table id="emp_certifacation_list" class="mwsmartui-datagrid" style="height:120px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'post',
			url:'./Employee-getEmpInfoList.action?emp_id=<%=emp_id %>&tName=emp_certifacation',
            scrollbarSize:29,
			toolbar:'#abry_abrysjk_certificate_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'name',width:'20%'"><b>证书名称</b></th>                    
                    <th data-options="field:'publish_time',width:'10%',formatter:common.fmt_date10"><b>发证时间</b></th>                    
                    <th data-options="field:'type',width:'10%'"><b>证书种类</b></th>                    
                    <th data-options="field:'publisher',width:'15%'"><b>发证单位</b></th>
                    <th data-options="field:'valid',width:'10%'"><b>有效日期</b></th>
                    <th data-options="field:'examiner_name',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'examine_status',width:'10%',formatter:employee.fmt_shzt"><b>审核结果</b></th>
                    <th data-options="field:'xx01',width:'14%',tName:'emp_certifacation',formatter:employee.opt_btn"><b>操作</b></th>
                </tr>
            </thead>
        </table>
         </fieldset>   
<br/>
         <fieldset>
      <legend>7、所获奖励</legend>
        	 <div id="abry_abrysjk_awards_toolbar">
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:employee.modify_child_table,tName:'emp_award'"><i class="fa fa-plus"> </i> 添加</a>
    		</div>
       <table id="emp_award_list" class="mwsmartui-datagrid" style="height:120px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'post',
			url:'./Employee-getEmpInfoList.action?emp_id=<%=emp_id %>&tName=emp_award',
            scrollbarSize:29,
			toolbar:'#abry_abrysjk_awards_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'pulish_time',width:'15%',formatter:common.fmt_date10"><b>获奖时间</b></th>                    
                    <th data-options="field:'name',width:'15%'"><b>获奖名称</b></th>                    
                    <th data-options="field:'pulisher',width:'20%'"><b>颁奖单位</b></th>                    
                    <th data-options="field:'owner',width:'15%'"><b>证明人</b></th>
                    <th data-options="field:'examiner_name',width:'10%'"><b>审核人</b></th>
                    <th data-options="field:'examine_status',width:'10%',formatter:employee.fmt_shzt"><b>审核结果</b></th>
                    <th data-options="field:'xx01',width:'14%',tName:'emp_award',formatter:employee.opt_btn"><b>操作</b></th>
                </tr>
            </thead>
        </table>
         </fieldset> 
         <br/>
         <%--
         <fieldset>
      <legend>8、工作评价</legend>
        	  <div id="abry_abrysjk_positive_toolbar">
                    <a href="#" class="mwsmartui-linkbutton"  data-options=""><i class="fa fa-plus"> </i> 添加</a>
                    <a href="#" id="" class="mwsmartui-linkbutton" data-options=""><i class="fa fa-trash"> </i> 编辑</a>
                    <a href="#" id="" class="mwsmartui-linkbutton" data-options=""><i class="fa fa-trash"> </i> 删除</a>
		
    </div>
       <table id="" class="mwsmartui-datagrid" style="height:100px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'get',
            scrollbarSize:29,
			toolbar:'#abry_abrysjk_positive_toolbar'">
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
        	 <div id="abry_abrysjk_negative_toolbar">
                    <a href="#" class="mwsmartui-linkbutton"  data-options=""><i class="fa fa-plus"> </i> 添加</a>
                    <a href="#" id="" class="mwsmartui-linkbutton" data-options=""><i class="fa fa-trash"> </i> 编辑</a>
                    <a href="#" id="" class="mwsmartui-linkbutton" data-options=""><i class="fa fa-trash"> </i> 删除</a>
		
    </div>
       <table id="" class="mwsmartui-datagrid" style="height:100px" data-options="
           singleSelect:true,
           collapsible:true,
			method:'get',
            scrollbarSize:29,
			toolbar:'#abry_abrysjk_negative_toolbar'">
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
