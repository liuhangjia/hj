<%@page import="com.abm.common.utils.Cache"%>
<%@page import="com.abm.common.model.PrivModel"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.List"%>
<%@page import="java.util.HashMap"%>
<%@page import="net.sf.json.JSONArray"%>
<%@page import="net.sf.json.JSONObject"%>
<%@page import="com.abm.common.utils.Constants"%>
<%@page import="com.abm.common.model.*"%>
<%@page import="com.abm.common.service.BaseCodeService"%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	AccountsModel user = (AccountsModel)session.getAttribute(Constants.USER);
	JSONObject userObj = new JSONObject();	
	userObj.element("id", user.getId());
	userObj.element("account", user.getAccount());
	userObj.element("name", user.getName());

	
	JSONArray arra = new JSONArray();			
	Map<String, String> privList = new HashMap<String, String>();
				
	for(SessionPrivModel bean : user.getPrivs()){
		JSONObject obj = new JSONObject();
		obj.element("code",bean.getPriv().getCode());
		obj.element("name",bean.getPriv().getName());
		privList.put(bean.getPriv().getCode(),bean.getPriv().getName());
		arra.add(obj);
	}
	userObj.element("priv",arra);
	out.print("<script language=\"javascript\" type=\"text/javascript\">" +
							"var sys_user=JSON.parse('"+userObj.toString()+"');</script>");
	
	List<SysBaseCodeModel> allCodes = BaseCodeService.getSingle().listAll();
	List<SysCodeTypeModel> allTypes = BaseCodeService.getSingle().listAllTypes();
		JSONObject ret = new JSONObject();
		if(allTypes!=null)
		{
			for(SysCodeTypeModel type:allTypes)
			{
				JSONArray arraCode = new JSONArray();
				if(allCodes!=null)
				{
					for(SysBaseCodeModel code:allCodes)
					{
						if(code.getType_id().equals(type.getId()))
						{
							arraCode.add(JSONObject.fromObject(code));
						}
					}
				}
				ret.element(type.getCode(),arraCode);
			}
		}
		out.print("<script language=\"javascript\" type=\"text/javascript\">" +
							"var sys_codes=JSON.parse('"+ret.toString()+"');</script>");
	JSONObject departJSON = JSONObject.fromObject(Cache.departIdNameMap);
	out.print("<script  type=\"text/javascript\">" +
			"var departIdNameObj = JSON.parse('"+departJSON.toString()+"');</script>");
	
 %>
<div title="会员中心" data-options="iconCls:'fa fa-user-o'" style="overflow:auto;padding:0px;" >
    <ul class="mwsmartui-tree" data-options="onClick:common.openPlugin">        
        <%
        	if(user.getMember()!=null){
         %>  
        <li data-options="iconCls:'feed-icon',id:'member/member_basic.jsp'">
        	<span><i class="fa fa-window-maximize"></i> 基本信息</span>
        </li>
        <%
        	}
        %>
        <%
        	if(user.isEnterpriseAdmin()){
         %> 
         <li data-options="iconCls:'feed-icon',id:'member/hyzx_wdqy.jsp'">
            <span><i class="fa fa-file-audio-o"></i> 我的企业</span>
        </li>    
        <li data-options="iconCls:'feed-icon',id:'member/hyzx_wdyy.jsp'">
            <span><i class="fa fa-file-audio-o"></i> 我的应用</span>
        </li>
        <%
        }
         %>
          <%
        	if(user.getMember()!=null || user.isEnterpriseAdmin()){
         %>     
        <li data-options="iconCls:'feed-icon',id:'member/hyzx_wdsb.jsp'">
            <span><i class="fa fa-file-audio-o"></i> 我的设备</span>
        </li>
        <%
        }
         %>
        <li data-options="iconCls:'feed-icon',id:'system/act/my.jsp'">
            <span><i class="fa fa-book"></i> 我的待办</span>
        </li>
     	<li data-options="iconCls:'feed-icon',id:'system/xtgl_xgmm.jsp'">
            <span><i class="fa fa-asterisk"></i> 修改密码</span>
        </li>
       
         
    </ul>
</div>
<% if(privList.containsKey("ENTERPRISE_MANAGER_LIST")
||privList.containsKey("MEMBER_MANAGER_LIST")
||privList.containsKey("EMP_MANAGER_LIST")
||privList.containsKey("CONTRACT_MANAGER_LIST")
||privList.containsKey("PAYMENT_MANAGER_LIST")){%>
<div title="客户管理" data-options="iconCls:'fa fa-user-o'" style="overflow:auto;padding:0px;" >
    <ul class="mwsmartui-tree" data-options="onClick:common.openPlugin">  
     <% if(privList.containsKey("ENTERPRISE_MANAGER_LIST")){%>      
        <li data-options="iconCls:'feed-icon',id:'customer/enterprise_manager.jsp',onLoad:enterpriseManage.init">
        	<span><i class="fa fa-window-maximize"></i> 企业管理</span>
        </li>
       <%} if(privList.containsKey("MEMBER_MANAGER_LIST")){%>
       <li data-options="iconCls:'feed-icon',id:'customer/khgl_hygl.jsp',onLoad:khgl_hygl_init">
            <span><i class="fa fa-file-audio-o"></i> 会员管理</span>
        </li>
      <%} if(false&&privList.containsKey("CONTRACT_MANAGER_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'customer/customer_contracts.html'">
            <span><i class="fa fa-file-audio-o"></i> 合同管理</span>
        </li>
     <%} if(false&&privList.containsKey("PAYMENT_MANAGER_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'customer/customer_payment.html'">
            <span><i class="fa fa-wrench"></i> 缴费管理</span>
        </li>
       <%} %>
      
    </ul>
</div>
<%} %>
<% if(privList.containsKey("SERVICE_HANDLE")
||privList.containsKey("SERVICE_STATISTIC")){%>
<div title="服务请求" data-options="iconCls:'fa fa-indent'" style="overflow:auto;padding:0px;" >
    <ul class="mwsmartui-tree" data-options="onClick:common.openPlugin">  
    <% if(privList.containsKey("SERVICE_HANDLE")){%>           
        <li data-options="iconCls:'feed-icon',id:'service/service_pending.jsp'">
        	<span><i class="fa fa-outdent"></i> 待处理服务</span>
        </li>
        <%--
        <li data-options="iconCls:'feed-icon',id:'service/service_processing.jsp'">
            <span><i class="fa fa-align-left"></i> 处理中服务</span>
        </li>
         --%>
        <li data-options="iconCls:'feed-icon',id:'service/service_end.jsp'">
            <span><i class="fa fa-list-alt"></i> 已终结服务</span>
        </li>  
       <%}if(privList.containsKey("SERVICE_STATISTIC")){ %>   
       <!--  
        <li data-options="iconCls:'feed-icon',id:'service/service_statistics.jsp'">
            <span><i class="fa fa-bar-chart"></i> 工作量统计</span>
        </li>
       -->       
        <li data-options="iconCls:'feed-icon',id:'service/service_statistics_test.jsp'">
            <span><i class="fa fa-bar-chart"></i> 工作量统计</span>
        </li>
       <%} %>
       <%--
       <li data-options="iconCls:'feed-icon',id:'service/user_intention.jsp'">
        	<span><i class="fa fa-outdent"></i> 用户意向</span>
       </li>
        --%>
    </ul>
</div>
<%} %>
<% if(privList.containsKey("USER_ACCOUNT_MANAGER_LIST")
||privList.containsKey("USER_ROLE_MANAGER_LIST")){%>
<div title="用户管理" data-options="iconCls:'fa fa-vcard'" style="overflow:auto;padding:0px;" >
    <ul class="mwsmartui-tree" data-options="onClick:common.openPlugin">        
        <!--  <li data-options="iconCls:'feed-icon',id:'associator/associator_enterprise.html'">
        	<span><i class="fa fa-vcard-o"></i> 企业信息</span>
        </li>  -->          
        <% if(privList.containsKey("USER_ACCOUNT_MANAGER_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'associator/yhgl_zhgl.jsp',onLoad:yhgl_zhgl_init">
            <span><i class="fa fa-address-book-o"></i> 账号管理</span>
        </li>
        <% }if(privList.containsKey("USER_ROLE_MANAGER_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'associator/yhgl_jsgl.jsp',onLoad:yhgl_jsgl_init">
            <span><i class="fa fa-podcast"></i> 角色管理</span>
        </li>
        <%} %>
        <!--
        <li data-options="iconCls:'feed-icon',id:'associator/associator_permission.html'">
            <span><i class="fa fa-microchip"></i> 权限管理</span>
        </li> --> 
      
    </ul>
</div>
<%} %>
<% if(privList.containsKey("PROJECT_MANAGER_LIST")||privList.containsKey("PROJECT_SHIFT_LIST")
||privList.containsKey("PROJECT_EMPLOYEE_LIST")||privList.containsKey("PROJECT_EVENT_LIST")
||privList.containsKey("PROJECT_PATROL_LIST")||privList.containsKey("PROJECT_PATROL_FIRE_LIST")
||privList.containsKey("PROJECT_EQUIP_LIST")||privList.containsKey("PROJECT_TRAINING_LIST")
||privList.containsKey("PROJECT_CHECKING_LIST")||privList.containsKey("PROJECT_COMMUNICATION_LIST")){%>
<div title="项目管理" data-options="iconCls:'fa fa-suitcase'" style="overflow:auto;padding:0px;" >
    <ul class="mwsmartui-tree" data-options="onClick:common.openPlugin">        
         <% if(privList.containsKey("PROJECT_MANAGER_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'project/project_manager.jsp',onLoad:manager_authentication">
        	<span><i class="fa fa-file-text"></i> 项目管理</span>
        </li>
        <% }if(privList.containsKey("PROJECT_SHIFT_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'project/project_range.jsp'">
        	<span><i class="fa fa-file-text"></i> 班次配置</span>
        </li>
        <% }if(privList.containsKey("PROJECT_EMPLOYEE_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'project/project_personnel.jsp',onLoad:personnel_authentication">
            <span><i class="fa fa-user-secret"></i> 项目人员</span>
        </li>
        <% }if(privList.containsKey("PROJECT_EVENT_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'project/project_milestone.jsp',onLoad:manager_authentication">
            <span><i class="fa fa-universal-access"></i> 重要事件</span>
        </li>
        <% }if(privList.containsKey("PROJECT_PATROL_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'project/project_inspection.jsp',onLoad:manager_authentication">
            <span><i class="fa fa-street-view"></i> 巡检管理</span>
        </li>
         <% }if(privList.containsKey("PROJECT_PATROL_FIRE_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'project/project_firemen.jsp',onLoad:manager_authentication">
            <span><i class="fa fa-taxi"></i> 消防巡检</span>
        </li>           
          <% }if(privList.containsKey("PROJECT_EQUIP_LIST")){%> 
        <li data-options="iconCls:'feed-icon',id:'project/project_equipment.jsp',onLoad:manager_authentication">
            <span><i class="fa fa-support"></i> 项目装备</span>
        </li>
         <% }if(privList.containsKey("PROJECT_TRAINING_LIST")){%> 
        <li data-options="iconCls:'feed-icon',id:'project/project_train.jsp',onLoad:manager_authentication">
            <span><i class="fa fa-graduation-cap"></i> 项目培训</span>
        </li>
         <% }if(privList.containsKey("PROJECT_CHECKING_LIST")){%> 
        <li data-options="iconCls:'feed-icon',id:'project/project_work.jsp',onLoad:checking_authentication">
            <span><i class="fa fa-gavel"></i> 工作检查</span>
        </li>
         <% }if(privList.containsKey("PROJECT_COMMUNICATION_LIST")){%> 
         <li data-options="iconCls:'feed-icon',id:'project/project_complaint.jsp',onLoad:communication_authentication">
            <span><i class="fa fa-bell"></i> 投诉回访</span>
        </li>  
         <% }%>     
    </ul>
</div>
<%} %>
<% if(privList.containsKey("EMPLOYEE_MANAGER_LIST")||
		privList.containsKey("VACATION_MANAGER_LIST")||
		privList.containsKey("WORK_ATTENDANCE_MANAGER_LIST")||
		privList.containsKey("APPOINT_MANAGER_LIST")||
		privList.containsKey("DISMISS_MANAGER_LIST")||
		privList.containsKey("HR_POOL_LIST")||
		privList.containsKey("AWARD_PUNISH_LIST")){
%>
<div title="人力服务" data-options="iconCls:'fa fa-users'" style="overflow:auto;padding:0px;" >
    <ul class="mwsmartui-tree" data-options="onClick:common.openPlugin">
    	<%if(privList.containsKey("EMPLOYEE_MANAGER_LIST")){%>        
        <li data-options="iconCls:'feed-icon',id:'human/human_staff.jsp',onLoad:humanStaff.init">
        	<span><i class="fa fa-user-circle"></i> 员工管理</span>
        </li>
        <%} if(false){%>    
        <li data-options="iconCls:'feed-icon',id:'human/human_staff.html'">
        	<span><i class="fa fa-user-circle"></i> 绩效考核</span>
        </li>
        <%} if(privList.containsKey("VACATION_MANAGER_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'human/human_leave.jsp',onLoad:rlfw_qjgl_init">
            <span><i class="fa fa-calendar-check-o"></i> 请假管理</span>
        </li>
        <%} if(privList.containsKey("WORK_ATTENDANCE_MANAGER_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'human/human_timecard.jsp',onLoad:rlfw_kqgl_init">
            <span><i class="fa fa-calendar"></i> 考勤统计</span>
        </li>
        <%} if(privList.containsKey("APPOINT_MANAGER_LIST")){%>            
        <li data-options="iconCls:'feed-icon',id:'human/human_patronage.jsp',onLoad:rlfw_rmgl_init">
            <span><i class="fa fa-calendar-plus-o"></i> 任免管理</span>
        </li>
        <%} if(privList.containsKey("DISMISS_MANAGER_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'human/human_quit.jsp',onLoad:rlfw_lzgl_init">
            <span><i class="fa fa-calendar-times-o"></i> 离职管理</span>
        </li>
        <%} if(privList.containsKey("HR_POOL_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'human/human_cadres.jsp',onLoad:rlfw_rccb_init">
            <span><i class="fa fa-calendar-o"></i> 人才储备</span>
        </li>
        <%} if(privList.containsKey("AWARD_PUNISH_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'human/human_reward.jsp',onLoad:rlfw_jfjl_init">
        	<span><i class="fa fa-podcast"></i> 奖励处罚</span>
        </li>
        <%} %>
        <li data-options="iconCls:'feed-icon',id:'human/human_salary.jsp'">
        	<span><i class="fa fa-podcast"></i> 工资管理</span>
        </li>
    </ul>
</div>
<%} %>
<% if(privList.containsKey("ALARM_LOG_LIST")
||privList.containsKey("ALARM_DEVICE_LIST")
||privList.containsKey("EQUIP_CAR_LIST")
||privList.containsKey("PATROL_RECORD_LIST")||privList.containsKey("VIDEO_MANAGER_LIST")){%>
<div title="报警监控" data-options="iconCls:'fa fa-volume-up'" style="overflow:auto;padding:0px;" >
    <ul class="mwsmartui-tree" data-options="onClick:common.openPlugin"> 
    <% if(privList.containsKey("ALARM_LOG_LIST")){%>       
        <li data-options="iconCls:'feed-icon',id:'alarm/bjjk_bjsj.jsp'">
        	<span><i class="fa fa-volume-control-phone"></i> 报警事件</span>
        </li>
        <%} if(privList.containsKey("ALARM_DEVICE_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'alarm/bjjk_sbyxqd.jsp',onLoad:bjjk_sbyxqd_init">
            <span><i class="fa fa-file-text-o"></i> 设备运行清单</span>
        </li>
        <%} if(privList.containsKey("PATROL_RECORD_LIST")){%>

        <li data-options="iconCls:'feed-icon',id:'alarm/bjjk_xjjl.jsp',onLoad:bjjk_xjjl_init">

            <span><i class="fa fa-file-text"></i> 设备巡检</span>
        </li>       
        <%} if(privList.containsKey("VIDEO_MANAGER_LIST")){%>     
        <li data-options="iconCls:'feed-icon',id:'alarm/bjjk_spxz.jsp'">
            <span><i class="fa fa-file-video-o"></i> 视频下载</span>
        </li>
       	<%} if(privList.containsKey("EQUIP_CAR_LIST")){%> 
       	<li data-options="iconCls:'feed-icon',id:'alarm/bjjk_car.jsp'">
            <span><i class="fa fa-car"></i> 车辆扫描记录</span>
        </li>     
        <%}%>
    </ul>
</div>
<%} %>
<% if(privList.containsKey("EQUIP_MANAGER_LIST")||
		privList.containsKey("EQUIP_USED_MANAGER_LIST")||
		privList.containsKey("EQUIP_USED_PERSON_MANAGER_LIST")){
%>
<div title="装备管理" data-options="iconCls:'fa fa-video-camera'" style="overflow:auto;padding:0px;" >
    <ul class="mwsmartui-tree" data-options="onClick:common.openPlugin">        
        <% if(privList.containsKey("EQUIP_MANAGER_LIST")){%>   
        <li data-options="iconCls:'feed-icon',id:'equipment/equipment_managerV2.jsp'">
        	<span><i class="fa fa-video-camera"></i> 安保装备</span>
        </li>
        <%--
        <li data-options="iconCls:'feed-icon',id:'equipment/equipment_manager.jsp'">
        	<span><i class="fa fa-video-camera"></i> 安保装备</span>
        </li>
        <li data-options="iconCls:'feed-icon',id:'equipment_firefighting'">
        	<span><i class="fa fa-fire-extinguisher"></i> 消防设施</span>
        </li>
        --%>
         <% }if(privList.containsKey("EQUIP_USED_MANAGER_LIST")){%>   
        <li data-options="iconCls:'feed-icon',id:'equipment/zbgl_lyjl.jsp?grOrQy=qy'">
            <span><i class="fa fa-tachometer"></i> 装备借还记录</span>
        </li>
         <% }if(privList.containsKey("EQUIP_USED_PERSON_MANAGER_LIST")){%>   
        <li data-options="iconCls:'feed-icon',id:'equipment/zbgl_lyjl.jsp?grOrQy=gr'">
            <span><i class="fa fa-reorder"></i> 个人领用记录</span>
        </li>            
        <%}%>
    </ul>
</div>
<%} %>
<% if(privList.containsKey("SECURIY_DB_LIST")){%>
 <div title="安保人员" data-options="iconCls:'fa fa-vcard-o'" style="overflow:auto;padding:0px;" >
    <ul class="mwsmartui-tree" data-options="onClick:common.openPlugin">        
       <li data-options="iconCls:'feed-icon',id:'system/abry_abrysjk.jsp',onLoad:abry_abrysjk_init">
        	<span><i class="fa fa-database"></i> 安保人员数据库</span>
        </li>
      
    </ul>
</div>
<%} %>
<% if(privList.containsKey("SYS_ACCOUNT_MANAGER_LIST")
||privList.containsKey("SYS_ROLE_MANAGER_LIST")
||privList.containsKey("SYS_LOG_MANAGER_LIST")||privList.containsKey("BASE_CODE_MANAGER_LIST")||privList.containsKey("EMP_WORK_FLOW_LIST")){%>
<div title="系统管理" data-options="iconCls:'fa fa-cogs'" style="overflow:auto;padding:0px;" >
    <ul class="mwsmartui-tree" data-options="onClick:common.openPlugin">        
     <% if(privList.containsKey("SYS_ACCOUNT_MANAGER_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'system/xtgl_yhgl.jsp',onLoad:xtgl_yhgl_init">
            <span><i class="fa fa-address-book"></i> 系统用户</span>
        </li>
         <%} if(privList.containsKey("SYS_ROLE_MANAGER_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'system/xtgl_jsgl.jsp',onLoad:xtgl_jsgl_init">
            <span><i class="fa fa-address-book-o"></i> 系统角色</span>
        </li>
        <%} %>
       
        <%if(privList.containsKey("SYS_LOG_MANAGER_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'system/xtgl_xtrz.jsp',onLoad:xtgl_xtrz_init">
            <span><i class="fa fa-calendar"></i> 系统日志</span>
        </li>
        <%} if(privList.containsKey("BASE_CODE_MANAGER_LIST")){%>
        <li data-options="iconCls:'feed-icon',id:'system/xtgl_sjzd.jsp',onLoad:xtgl_sjzd_init">
            <span><i class="fa fa-book"></i> 数据字典</span>
        </li>
        <%}%>
        <% if(privList.containsKey("DEPART_MANAGER_LIST")){  %>
        <li data-options="iconCls:'feed-icon',id:'system/xtgl_zzjggl.jsp',onLoad:xtgl_zzjggl_init">
            <span><i class="fa fa-book"></i> 组织机构管理</span>
        </li>
        <% }  %>
        <%--
          <li data-options="iconCls:'feed-icon',id:'system/zzjggl.jsp'">
            <span><i class="fa fa-book"></i> 组织机构管理</span>
        </li>
         --%>
        <%if(privList.containsKey("EMP_WORK_FLOW_LIST")){%>
         <li data-options="iconCls:'feed-icon',id:'system/act/list.jsp'">
            <span><i class="fa fa-book"></i> 企业流程中心</span>
        </li>
        <%} %>
        <%if(privList.containsKey("SYS_PAYROLL_TEMPLATE_LIST")){%>
         <li data-options="iconCls:'feed-icon',id:'system/xtgl_gzmb.jsp',onLoad:xtgl_gzmb_init">
            <span><i class="fa fa-book"></i> 工资模板</span>
        </li>
        <%} %>
    </ul>
</div>
<%} %>