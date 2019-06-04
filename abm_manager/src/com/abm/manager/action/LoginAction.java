package com.abm.manager.action;

import com.abm.common.model.AccountsModel;
import com.abm.common.model.EnterpriseEmpModel;
import com.abm.common.service.AccountsService;
import com.abm.common.service.EnterpriseEmpService;
import com.abm.common.service.SysLogService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.StringUtil;
import com.abm.manager.BaseAction;

public class LoginAction extends BaseAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = 3791142715898142101L;
	private String account;
	private String password;
	
	

	public void setAccount(String account) {
		this.account = account;
	}



	public void setPassword(String password) {
		this.password = password;
	}

	public String login()
	{
		String result = null;
		try{
			if(StringUtil.isEmpty(account))
			{
				throw new Exception("账号不允许为空");
			}
			if(StringUtil.isEmpty(password))
			{
				throw new Exception("密码不允许为空");
			}
			AccountsModel user = AccountsService.getSingle().login(account, password);
			getSession().setAttribute(Constants.USER, user);
			EnterpriseEmpModel enterpriseEmp = EnterpriseEmpService.getSingle().getModelByAccountId(user.getId());
			getSession().setAttribute(Constants.ENTERPRISE_EMP, enterpriseEmp);
			
			SysLogService.getSingle().log(account, getRequest().getRemoteAddr(), Constants.SysLog.TYPE_LOGIN, "", Constants.SysLog.RESULT_SUCCESS);
			result = "{\"success\":true,\"msg\":\"登录成功\"}";
			
		}catch(Exception e){
			SysLogService.getSingle().log(account, getRequest().getRemoteAddr(), Constants.SysLog.TYPE_LOGIN, e.getMessage(), Constants.SysLog.RESULT_FAIL);
			result = "{\"success\":false,\"msg\":\"登录失败:"+e.getMessage()+"\"}";
		}
		
		sendResult(result);
		return null;
	}
	
	
	
	public String loginOut()
	{
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		if(user!=null)
		{
			getSession().removeAttribute(Constants.USER);
			SysLogService.getSingle().log(user.getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_LOGOFF, "", Constants.SysLog.RESULT_SUCCESS);
		}
		sendResult("{\"success\":true}");
		return null;
	}
}
