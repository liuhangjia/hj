package com.abm.manager.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;


import com.abm.common.model.AccountsModel;
import com.abm.common.model.OperatorModel;
import com.abm.common.model.RoleModel;
import com.abm.common.service.AccountsService;
import com.abm.common.service.OperatorService;
import com.abm.common.service.SysLogService;
import com.abm.common.utils.Constants;
import com.abm.manager.BaseAction;
import com.mw.common.utils.StringUtil;

public class OperatorAction extends BaseAction{
	/**
	 * 
	 */
	private static final long serialVersionUID = -5146597065430758275L;

	private OperatorService operatorService = OperatorService.getSingle();
	
	private String oldpasswd;
	private String newpasswd;
	private String id;
	private String name;
	private String account;
	private String passwd;
	private String roleIds;
	private String bak;
	private String account_id;
	private String ids;
	
	
	
	
	public void setOldpasswd(String oldpasswd) {
		this.oldpasswd = oldpasswd;
	}

	public void setNewpasswd(String newpasswd) {
		this.newpasswd = newpasswd;
	}
	
	

	public void setId(String id) {
		this.id = id;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public void setPasswd(String passwd) {
		this.passwd = passwd;
	}

	public void setRoleIds(String roleIds) {
		this.roleIds = roleIds;
	}

	public void setBak(String bak) {
		this.bak = bak;
	}
	
	

	public void setAccount_id(String accountId) {
		account_id = accountId;
	}
	
	

	public void setIds(String ids) {
		this.ids = ids;
	}

	/**
	 * 操作员列表
	 * @return
	 */
	public String list()
	{
		String results = "";
		String condition = " and 1=1 ";
		Map<String,String> conditions = parseCondition();
		
		
		for(String key:conditions.keySet())
		{
			String value = conditions.get(key);
			if(value!=null&&value.trim().length()>0)
			{
				if( "name".equals(key))
				{
					condition = condition + " and operator.name like '%"+value+"%' ";
				}
				else if( "account".equals(key))
				{
					condition = condition + " and accounts.account like '%"+value+"%' ";
				}
			}
		}
		int total = operatorService.getTotal(condition);
		List<OperatorModel> ret = operatorService.queryByPage(condition, page, rows,  parseSorter(), parseDirect());
		
		results =  JSONArray.fromObject(ret).toString();
		
		results = "{\"success\":true,\"total\":\""+total+"\",\"rows\":"+results+"}";
		sendResult(results);
		return NONE;
	}
	/**
	 * 保存操作员
	 * @return
	 */
	public String save()
	{
		String results = null;
		if(StringUtil.isEmpty(id))
		{
			//增加
			
			AccountsModel accounts = new AccountsModel();
			accounts.setAccount(account);
			accounts.setName(name);
			accounts.setPasswd(passwd);
			accounts.setIs_active(Constants.IS_ACTIVE_TRUE);
			accounts.setIs_delete(Constants.IS_DELETE_FALSE);
			
			OperatorModel operator = new OperatorModel();
			operator.setIs_editable(Constants.IS_EDITABLE_TRUE);
			operator.setBak(bak);
			operator.setName(name);
			operator.setAccount(accounts);

			int ret = operatorService.add(operator);
			if(ret==0)
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_SYS_USER, account, Constants.SysLog.RESULT_SUCCESS);
				results = "{\"success\":true,\"msg\":\"增加系统用户成功\"}";
			}else
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_SYS_USER, account, Constants.SysLog.RESULT_FAIL);
				if(ret==-1)
				{
					results = "{\"success\":false,\"msg\":\"增加系统用户失败: 用户已经存在\"}";
				}
				else if(ret==-2)
				{
					results = "{\"success\":false,\"msg\":\"增加系统用户失败: 账号已经存在,请引用为系统用户\"}";
				}
				else
				{
						results = "{\"success\":false,\"msg\":\"增加系统用户失败\"}";
				}	
			}
		}
		else
		{
			AccountsModel accounts = new AccountsModel();
			accounts.setId(account_id);
			accounts.setAccount(account);
			accounts.setName(name);
			accounts.setPasswd(passwd);
			accounts.setIs_active(Constants.IS_ACTIVE_TRUE);
			accounts.setIs_delete(Constants.IS_DELETE_FALSE);
			
			OperatorModel operator = new OperatorModel();
			operator.setId(id);
			operator.setIs_editable(Constants.IS_EDITABLE_TRUE);
			operator.setBak(bak);
			operator.setName(name);
			operator.setAccount_id(account_id);
			operator.setAccount(accounts);
			
			int ret = operatorService.update(operator);
			if(ret==0)
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_SYS_USER, account, Constants.SysLog.RESULT_SUCCESS);
				results = "{\"success\":true,\"msg\":\"修改系统用户成功\"}";
			}else
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_SYS_USER, account, Constants.SysLog.RESULT_FAIL);
				if(ret==-1)
				{
					results = "{\"success\":false,\"msg\":\"修改系统用户失败:用户已经存在\"}";
				}
				else if(ret==-2)
				{
					results = "{\"success\":false,\"msg\":\"修改系统用户失败:账号已经存在,请引用为系统用户再修改\"}";
				}
				else
				{
						results = "{\"success\":false,\"msg\":\"修改系统用户失败\"}";
				}	
			}
			
		}
		
		sendResult(results);
		return NONE;
	}
	
	
	/**
	 * 引用账号为操作员
	 * @return
	 */
	public String refAccount()
	{
		String results = null;
		if(StringUtil.isEmpty(account))
		{
			sendResult("{\"success\":false,\"msg\":\"增加系统用户失败: 账号为空\"}");
		}
		int ret = operatorService.addFromAccount(account);
		if(ret==0)
		{
			SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_SYS_USER, account, Constants.SysLog.RESULT_SUCCESS);
			results = "{\"success\":true,\"msg\":\"增加系统用户成功\"}";
		}else
		{
			SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_SYS_USER, account, Constants.SysLog.RESULT_FAIL);
			if(ret==-1)
			{
				results = "{\"success\":false,\"msg\":\"增加系统用户失败: 账号不存在\"}";
			}
			else if(ret==-2)
			{
				results = "{\"success\":false,\"msg\":\"增加系统用户失败: 账号已经引用\"}";
			}
			else
			{
					results = "{\"success\":false,\"msg\":\"增加系统用户失败\"}";
			}	
		}
		
		sendResult(results);
		return NONE;
	}
	
	public String listRolesByOperator()
	{
		List<RoleModel> ret = operatorService.listRolesByOperator(id);
		
		sendResult(JSONArray.fromObject(ret).toString());
		return NONE;
	}
	
	/**
	 * 保存操作员角色
	 * @return
	 */
	public String saveRole()
	{
		String results = null;
		if(StringUtil.isEmpty(id))
		{
			sendResult("{\"success\":false,\"msg\":\"指定用户角色失败:找不到用户信息\"}");
			return NONE;
		}
		JSONArray arra = JSONArray.fromObject(roleIds);
		List<RoleModel> roles = new ArrayList<RoleModel>();
		for(int i = 0;i<arra.size();i++)
		{
			RoleModel role = new RoleModel();
			role.setId(arra.getString(i));
			roles.add(role);
		}
		int ret = operatorService.saveRole(id,roles);
		if(ret==0)
		{
			SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_SYS_USER_ROLE, account, Constants.SysLog.RESULT_SUCCESS);
			results = "{\"success\":true,\"msg\":\"指定用户角色成功\"}";
		}else
		{
			SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_SYS_USER_ROLE, account, Constants.SysLog.RESULT_FAIL);
			results = "{\"success\":false,\"msg\":\"指定用户角色失败\"}";
				
		}
		sendResult(results);
		return NONE;
	}
	
	
	/**
	 * 删除操作员
	 */
	public String delete()
	{
		String results="";
		if(StringUtil.isEmpty(ids))
		{
			sendResult("{\"success\":false,\"msg\":\"删除系统用户失败:未指定删除的用户\"}");
			return NONE;
		}
		String[] to_delete = ids.split(",");
		int ret = operatorService.delete(to_delete);
		if(ret==0)
		{
			SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_SYS_USER, "", Constants.SysLog.RESULT_SUCCESS);
			results = "{\"success\":true,\"msg\":\"删除系统用户成功\"}";
		}else
		{
			SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_SYS_USER, "", Constants.SysLog.RESULT_FAIL);
			results = "{\"success\":false,\"msg\":\"删除系统用户失败\"}";
				
		}
		sendResult(results);
		return NONE;
	}
	
	/**
	 * 更新密码
	 * @return
	 */
	public String changePwd()
	{
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		if(!StringUtil.eq(currentUser.getPasswd(),oldpasswd))
		{
			sendResult("{\"success\":false,\"msg\":\"密码不正确\"}");
			return NONE;
		}
		if(AccountsService.getSingle().changePassword(currentUser.getId(), newpasswd))
		{
			currentUser.setPasswd(newpasswd);
			sendResult("{\"success\":true,\"msg\":\"密码更新成功\"}");
			
		}
		else
		{
			sendResult("{\"success\":false,\"msg\":\"密码更新失败\"}");
		}
		return NONE;
	}
}
