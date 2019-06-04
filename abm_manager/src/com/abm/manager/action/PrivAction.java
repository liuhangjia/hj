package com.abm.manager.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.abm.common.dao.ApplicationsDao;
import com.abm.common.model.ApplicationsModel;
import com.abm.common.model.PrivModel;
import com.abm.common.service.PrivService;
import com.abm.manager.BaseAction;

public class PrivAction extends BaseAction{
	/**
	 * 
	 */
	private static final long serialVersionUID = 6873256947515364424L;
	PrivService privService = PrivService.getSingle();
	private String roleId;
	private String enterpriseId;
	
	
	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}
	
	

	
	public void setEnterpriseId(String enterpriseId) {
		this.enterpriseId = enterpriseId;
	}




	private boolean hasPriv(List<PrivModel> privs,PrivModel priv)
	{
		if(privs!=null)
		{
			for(PrivModel pb : privs)
			{
				if(pb.getId().equals(priv.getId()))
				{
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	 * 根据用户的权限提取对应的权限列表
	 * @return
	 */
	public String getAllPrivListByEnterprise()
	{
		String results = ""; 
		
		List<PrivModel> privs = privService.listByRoleId(roleId);
		
		List<PrivModel> existsPrivs = privService.queryByPage(" and APP_ID in (select APP_ID from ENTERPRISE_APP where ENTERPRISE_ID=?)",new String[]{enterpriseId},1,Integer.MAX_VALUE,"module_code","asc");
		List<PrivModel> ret = new ArrayList<PrivModel>();
		HashMap<String,List<PrivModel>> mp = new HashMap<String,List<PrivModel>>();
		if(existsPrivs!=null)
		{
			ret.addAll(existsPrivs);
		}
		List<PrivModel> extraPrivs = privService.queryByPage(" and MODULE_CODE in ('USER_ACCOUNT_MANAGER','USER_ROLE_MANAGER','EQUIP_CAR','ALARM_LOG_APP','ALARM_DEVICE_APP','PATROL_RECORD_APP','VIDEO_MANAGER_APP','EMP_WORK_FLOW')",null,1,Integer.MAX_VALUE,"module_code","asc");
		ret.addAll(extraPrivs);
		
		if(ret!=null)
		{
			for(PrivModel priv : ret)
			{
				if(!mp.containsKey(priv.getModule_code()))
				{
					mp.put(priv.getModule_code(), new ArrayList<PrivModel>());
				}
				mp.get(priv.getModule_code()).add(priv);
			}
			JSONArray arra = new JSONArray();
			//服务请求
			JSONObject obj = new JSONObject();
			obj.element("id", "1");
			obj.element("text", "服务请求");
			obj.element("children", new JSONArray());
			for(String s:new String[]{"SERVICE_REQUEST"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			if(obj.getJSONArray("children").size()>0)
			{
				arra.add(obj);
			}
			//客户管理
			obj = new JSONObject();
			obj.element("id", "2");
			obj.element("text", "客户管理");
			obj.element("children", new JSONArray());
			for(String s:new String[]{"MEMBER_MANAGER","ENTERPRISE_MANAGER","CONTRACT_MANAGER","PAYMENT_MANAGER"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			if(obj.getJSONArray("children").size()>0)
			{
				arra.add(obj);
			}
			//用户管理
			obj = new JSONObject();
			obj.element("id", "3");
			obj.element("text", "用户管理");
			obj.element("children", new JSONArray());
			
			for(String s:new String[]{"USER_ACCOUNT_MANAGER","USER_ROLE_MANAGER"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			if(obj.getJSONArray("children").size()>0)
			{
				arra.add(obj);
			}
			
			//项目管理
			obj = new JSONObject();
			obj.element("id", "4");
			obj.element("text", "项目管理");
			obj.element("children", new JSONArray());
			
			
			for(String s:new String[]{"PROJECT_MANAGER","PROJECT_EMPLOYEE","PROJECT_EVENT","PROJECT_PATROL","PROJECT_PATROL_FIRE","PROJECT_EQUIP","PROJECT_TRAINING"
					,"PROJECT_CHECKING","PROJECT_COMMUNICATION","PROJECT_ALARM_PATROL","PROJECT_SHIFT"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			
			if(obj.getJSONArray("children").size()>0)
			{
				arra.add(obj);
			}
			//人力服务
			obj = new JSONObject();
			obj.element("id", "5");
			obj.element("text", "人力服务");
			obj.element("children", new JSONArray());
			
			for(String s:new String[]{"EMPLOYEE_MANAGER","VACATION_MANAGER","WORK_ATTENDANCE_MANAGER","APPOINT_MANAGER","DISMISS_MANAGER","HR_POOL","AWARD_PUNISH","ATTENDANCE_SHOW"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			if(obj.getJSONArray("children").size()>0)
			{
				arra.add(obj);
			}
			//报警监控 
			obj = new JSONObject();
			obj.element("id", "6");
			obj.element("text", "报警监控");
			obj.element("children", new JSONArray());
			
			for(String s:new String[]{"ALARM_LOG","ALARM_DEVICE","PATROL_RECORD","VIDEO_MANAGER","ALARM_LOG_APP","EQUIP_CAR","ALARM_DEVICE_APP","PATROL_RECORD_APP","VIDEO_MANAGER_APP"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			if(obj.getJSONArray("children").size()>0)
			{
				arra.add(obj);
			}
			
			
			
			//短信告警
			obj = new JSONObject();
			obj.element("id", "7");
			obj.element("text", "装备管理");
			obj.element("children", new JSONArray());
			
			for(String s:new String[]{"EQUIP_MANAGER","EQUIP_USED_MANAGER","EQUIP_USED_PERSON_MANAGER"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			
			if(obj.getJSONArray("children").size()>0)
			{
				arra.add(obj);
			}
			//告警日志
			obj = new JSONObject();
			obj.element("id", "8");
			obj.element("text", "安保人员");
			obj.element("children", new JSONArray());
			
			for(String s:new String[]{"SECURIY_DB"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			if(obj.getJSONArray("children").size()>0)
			{
				arra.add(obj);
			}
			
			//系统管理
			obj = new JSONObject();
			obj.element("id", "9");
			obj.element("text", "系统管理");
			obj.element("children", new JSONArray());
			
			for(String s:new String[]{"SYS_ACCOUNT_MANAGER","SYS_ROLE_MANAGER","SYS_LOG_MANAGER","BASE_CODE_MANAGER","EMP_WORK_FLOW","DEPART_MANAGER","SYS_PAYROLL_TEMPLATE"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			if(obj.getJSONArray("children").size()>0)
			{
				arra.add(obj);
			}
			
			JSONObject root = new JSONObject();
			root.element("id", "-1");
			root.element("text", "权限列表");
			root.element("children", arra);
			
			JSONArray arra1 = new JSONArray();
			arra1.add(root);
			results = arra1.toString();
		}
		else
		{
			results = "[]";
		}
		sendResult(results);
		return NONE;
	}

	public String getAllPrivList()
	{
		String results = ""; 
		
		List<PrivModel> privs = privService.listByRoleId(roleId);
		List<PrivModel> ret = privService.queryByPage(null,null,1,Integer.MAX_VALUE,"module_code","asc");
		HashMap<String,List<PrivModel>> mp = new HashMap<String,List<PrivModel>>();
		if(ret!=null)
		{
			for(PrivModel priv : ret)
			{
				if(!mp.containsKey(priv.getModule_code()))
				{
					mp.put(priv.getModule_code(), new ArrayList<PrivModel>());
				}
				mp.get(priv.getModule_code()).add(priv);
			}
			JSONArray arra = new JSONArray();
			//服务请求
			JSONObject obj = new JSONObject();
			obj.element("id", "1");
			obj.element("text", "服务请求");
			obj.element("children", new JSONArray());
			for(String s:new String[]{"SERVICE_REQUEST"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			arra.add(obj);
			//客户管理
			obj = new JSONObject();
			obj.element("id", "2");
			obj.element("text", "客户管理");
			obj.element("children", new JSONArray());
			for(String s:new String[]{"MEMBER_MANAGER","ENTERPRISE_MANAGER","CONTRACT_MANAGER","PAYMENT_MANAGER"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			
			
			arra.add(obj);
			//用户管理
			obj = new JSONObject();
			obj.element("id", "3");
			obj.element("text", "用户管理");
			obj.element("children", new JSONArray());
			
			for(String s:new String[]{"USER_ACCOUNT_MANAGER","USER_ROLE_MANAGER"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			arra.add(obj);
			
			//项目管理
			obj = new JSONObject();
			obj.element("id", "4");
			obj.element("text", "项目管理");
			obj.element("children", new JSONArray());
			
			
			for(String s:new String[]{"PROJECT_MANAGER","PROJECT_EMPLOYEE","PROJECT_EVENT","PROJECT_PATROL","PROJECT_PATROL_FIRE","PROJECT_EQUIP","PROJECT_TRAINING"
					,"PROJECT_CHECKING","PROJECT_COMMUNICATION","PROJECT_ALARM_PATROL","PROJECT_SHIFT"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			
			arra.add(obj);
			//人力服务
			obj = new JSONObject();
			obj.element("id", "5");
			obj.element("text", "人力服务");
			obj.element("children", new JSONArray());
			
			for(String s:new String[]{"EMPLOYEE_MANAGER","VACATION_MANAGER","WORK_ATTENDANCE_MANAGER","APPOINT_MANAGER","DISMISS_MANAGER","HR_POOL","AWARD_PUNISH","ATTENDANCE_SHOW"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			arra.add(obj);
			//报警监控 
			obj = new JSONObject();
			obj.element("id", "6");
			obj.element("text", "报警监控");
			obj.element("children", new JSONArray());
			
			for(String s:new String[]{"ALARM_LOG","ALARM_DEVICE","PATROL_RECORD","VIDEO_MANAGER","ALARM_LOG_APP","EQUIP_CAR","ALARM_DEVICE_APP","PATROL_RECORD_APP","VIDEO_MANAGER_APP"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
		
			
			
			
			arra.add(obj);
			
			//短信告警
			obj = new JSONObject();
			obj.element("id", "7");
			obj.element("text", "装备管理");
			obj.element("children", new JSONArray());
			
			for(String s:new String[]{"EQUIP_MANAGER","EQUIP_USED_MANAGER","EQUIP_USED_PERSON_MANAGER"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			
			
			arra.add(obj);
			//告警日志
			obj = new JSONObject();
			obj.element("id", "8");
			obj.element("text", "安保人员");
			obj.element("children", new JSONArray());
			
			for(String s:new String[]{"SECURIY_DB"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			arra.add(obj);
			
			//系统管理
			obj = new JSONObject();
			obj.element("id", "9");
			obj.element("text", "系统管理");
			obj.element("children", new JSONArray());
			
			for(String s:new String[]{"SYS_ACCOUNT_MANAGER","SYS_ROLE_MANAGER","SYS_LOG_MANAGER","BASE_CODE_MANAGER","EMP_WORK_FLOW","DEPART_MANAGER","SYS_PAYROLL_TEMPLATE","SYS_WELCOME"})
			{
				if(mp.containsKey(s))
				{
					JSONObject obj1 = new JSONObject();
					obj1.element("id", s);
					obj1.element("children", new JSONArray());
					for(PrivModel priv : mp.get(s))
					{
						JSONObject obj2 = new JSONObject();
						obj2.element("id", priv.getId());
						obj2.element("text", priv.getName());
						obj2.element("children", new JSONArray());
						if(hasPriv(privs,priv))
						{
							obj2.element("checked", true);
						}
						obj2.element("code", priv.getCode());
						obj1.getJSONArray("children").add(obj2);
						obj1.element("text", priv.getModule_name());
					}
					
					obj.getJSONArray("children").add(obj1);
				}
			}
			
			arra.add(obj);
			
			JSONObject root = new JSONObject();
			root.element("id", "-1");
			root.element("text", "权限列表");
			root.element("children", arra);
			
			JSONArray arra1 = new JSONArray();
			arra1.add(root);
			results = arra1.toString();
		}
		else
		{
			results = "[]";
		}
		sendResult(results);
		return NONE;
	}
	
	public String listApplications()
	{
		String results = "[]";
		List<ApplicationsModel> ret = ApplicationsDao.getSingle().executeQuery(null);
		if(ret!=null&&ret.size()>0)
		{
			results = JSONArray.fromObject(ret).toString();
		}
		
		sendResult(results);
		return NONE;
	}
}
