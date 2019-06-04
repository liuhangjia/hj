package com.abm.manager.action;

import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.abm.common.model.AccountsModel;
import com.abm.common.model.EnterpriseModel;
import com.abm.common.model.RoleModel;
import com.abm.common.service.EnterpriseService;
import com.abm.common.service.RoleService;
import com.abm.common.service.SysLogService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.common.utils.StringUtil;
import com.abm.manager.BaseAction;

public class RoleAction extends BaseAction{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private RoleService roleService = RoleService.getSingle();
	
	private RoleModel role;
	private String roleId;
	private String privId;
	private String ids;
	private String enterpriseId;
	


	public RoleModel getRole() {
		return role;
	}

	public void setRole(RoleModel role) {
		this.role = role;
	}
	
	

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public void setPrivId(String privId) {
		this.privId = privId;
	}

	
	public void setIds(String ids) {
		this.ids = ids;
	}

	
	
	public void setEnterpriseId(String enterpriseId) {
		this.enterpriseId = enterpriseId;
	}

	public String list()
	{
		String results = null;
		String condition = " and enterprise_id is null  ";
		Map<String,String> conditions = parseCondition();
		
		
		for(String key:conditions.keySet())
		{
			String value = conditions.get(key);
			if(value!=null&&value.trim().length()>0)
			{
				if( "name".equals(key))
				{
					condition = condition + " and name like '%"+value+"%' ";
				}
			}
		}
		
		int total = roleService.getTotal(condition,null);
		List<RoleModel> ret = roleService.queryByPage(condition,null, page, rows, parseSorter(), parseDirect());
		if(ret!=null)
		{
			results =  JSONArray.fromObject(ret).toString();
		}
		else
		{
			results = "[]";
		}
		results = "{\"success\":true,\"total\":\""+total+"\",\"rows\":"+results+"}";
		sendResult(results);
		return NONE;
	}
	
	public String listByEntId()
	{
		String results = null;
		String condition = " and enterprise_id = ?  ";
		Map<String,String> conditions = parseCondition();
		
		
		
		
		int total = roleService.getTotal(condition,new String[]{enterpriseId});
		List<RoleModel> ret = roleService.queryByPage(condition,new String[]{enterpriseId}, page, rows, parseSorter(), parseDirect());
		if(ret!=null)
		{
			results =  JSONArray.fromObject(ret).toString();
		}
		else
		{
			results = "[]";
		}
		results = "{\"success\":true,\"total\":\""+total+"\",\"rows\":"+results+"}";
		sendResult(results);
		return NONE;
	}
	
	public void findByIds(){
		JSONObject result = new JSONObject();
		if(StringUtil.isNotEmpty(ids)){
			String[] _ids = ids.split(",");
			StringBuffer condIds = new StringBuffer();
			for(int i = 0 ; i < _ids.length ; i++){
				condIds.append(",'").append(_ids[i]).append("'");
			}
			String condition = " and id in ("+condIds.substring(1)+")";
			List<RoleModel> ret = roleService.queryByPage(condition,null, 1, Integer.MAX_VALUE, parseSorter(), parseDirect());
			if(null != ret){
				result.element(ROWS, JSONArray.fromObject(ret));
			}else{
				result.element(ROWS, "[]");
			}
		}else{
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	
	/**
	 * 获取所有系统角色
	 * @return
	 */
	public String listAll()
	{
		String results = null;
		List<RoleModel> ret = roleService.queryByPage(" and enterprise_id is null ",null, 1, Integer.MAX_VALUE, "name", "asc");
		if(ret!=null)
		{
			results =  JSONArray.fromObject(ret).toString();
		}
		else
		{
			results = "[]";
		}
		results = "{\"success\":true,\"total\":\""+ret.size()+"\",\"rows\":"+results+"}";
		sendResult(results);
		return NONE;
	}
	
	/**
	 * 根据当前用户的权限提取角色列表
	 * @return
	 */
	public String listByPriv()
	{
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		String results = null;
		String condition = " and enterprise_id is not null  ";
		Map<String,String> conditions = parseCondition();
		
		
		for(String key:conditions.keySet())
		{
			String value = conditions.get(key);
			if(value!=null&&value.trim().length()>0)
			{
				if( "name".equals(key))
				{
					condition = condition + " and name like '%"+value+"%' ";
				}
				else if( "ename".equals(key))
				{
					condition = condition + " and exists (select * from enterprise where  enterprise.name like '%"+value+"%'  and enterprise.id=role.enterprise_id and enterprise.is_delete='"+Constants.IS_DELETE_FALSE+"' )";
				}
			}
		}
		condition = condition + PrivUtil.getConditionForRole(currentUser);
		int total = roleService.getTotal(condition,null);
		List<RoleModel> ret = roleService.queryByPage(condition,null, page, rows, parseSorter(), parseDirect(),true);
		if(ret!=null)
		{
			results =  JSONArray.fromObject(ret).toString();
		}
		else
		{
			results = "[]";
		}
		results = "{\"success\":true,\"total\":\""+total+"\",\"rows\":"+results+"}";
		sendResult(results);
		return NONE;
	}
	
	/**
	 * 保存角色
	 * @return
	 */
	public String save()
	{
		 
		String results = null;
		if(StringUtil.isEmpty(role.getId())){
			if(roleService.add(role))
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_ROLE, role.getName(), Constants.SysLog.RESULT_SUCCESS);
				results = "{\"success\":true,\"msg\":\"添加角色成功\"}";
			}
			else
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_ROLE, role.getName(), Constants.SysLog.RESULT_FAIL);
				results = "{\"success\":false,\"msg\":\"添加角色失败\"}";
			}
		}else{
			if(roleService.update(role))
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_ROLE, role.getName(), Constants.SysLog.RESULT_SUCCESS);
				results = "{\"success\":true,\"msg\":\"更新角色成功\"}";
			}
			else
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_ROLE, role.getName(), Constants.SysLog.RESULT_FAIL);
				results = "{\"success\":false,\"msg\":\"更新角色失败\"}";
			}
		}
		
		sendResult(results);
		return NONE;
	}
	
	public String addPrivForRole()
	{
		String results = null;
		String privIds[] = null;
		if(StringUtil.isNotEmpty(privId))
		{
			privIds = privId.split(",");
		}
		if(roleService.addPrivForRole(roleId, privIds))
		{
			SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ROLE_PRIV, "", Constants.SysLog.RESULT_SUCCESS);
			results = "{\"success\":true,\"msg\":\"添加角色权限成功\"}";
		}
		else
		{
			SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ROLE_PRIV, "", Constants.SysLog.RESULT_FAIL);
			results = "{\"success\":false,\"msg\":\"添加角色权限失败\"}";
		}
		sendResult(results);
		return NONE;
	}
	
	public String delete()
	{
		String results = null;
		if(StringUtil.isNotEmpty(ids)){
			if(roleService.delete(ids.split(",")))
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_ROLE, "", Constants.SysLog.RESULT_SUCCESS);
				results = "{\"success\":true,\"msg\":\"删除角色成功\"}";
			}
			else
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_ROLE, "", Constants.SysLog.RESULT_FAIL);
				results = "{\"success\":false,\"msg\":\"删除角色失败\"}";
			}
		}else{
			results = "{\"success\":false,\"msg\":\"删除角色失败\"}";
		}
		sendResult(results);
		return NONE;
	}
	
	public String listMyEnterprise()
	{
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		String condition = " and is_delete='"+Constants.IS_DELETE_FALSE+"' ";
		condition = condition + PrivUtil.getConditionForEnterprise(currentUser,"USER_ROLE_MANAGER_ADD");
		List<EnterpriseModel> ret = EnterpriseService.getSingle().queryByPage(condition, null, 1, Integer.MAX_VALUE, "name", "asc");
		if(ret!=null)
		{
			sendResult(JSONArray.fromObject(ret).toString());
		}
		else
		{
			sendResult("[]");
		}
		return NONE;
	}
	
}
