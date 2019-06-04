package com.abm.manager.action;

import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;

import com.abm.common.model.AccountsModel;
import com.abm.common.model.SysLogModel;
import com.abm.common.service.SysLogService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.StringUtil;
import com.abm.manager.BaseAction;

public class SysLogAction extends BaseAction{
	private SysLogService logService = SysLogService.getSingle();
	private String ids;
	
	
	public void setIds(String ids) {
		this.ids = ids;
	}

	public String list()
	{
		String results = null;
		String condition = "";
		Map<String,String> conditions = parseCondition();
		
		
		for(String key:conditions.keySet())
		{
			String value = conditions.get(key);
			if(value!=null&&value.trim().length()>0)
			{
				if( "account".equals(key))
				{
					condition = condition + " and operator_account like '%"+value+"%' ";
				}
				else if( "start".equals(key))
				{
					condition = condition + " and create_time >= '"+value+"' ";
				}
				else if( "end".equals(key))
				{
					condition = condition + " and create_time < '"+value+"' ";
				}
			}
		}
		
		int total = logService.getTotal(condition,null);
		List<SysLogModel> ret = logService.queryByPage(condition,null, page, rows, parseSorter(), parseDirect());
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
	
	public String delete()
	{
		String results = null;
		if(StringUtil.isNotEmpty(ids)){
			int ret = logService.delete(ids.split(","));
			if(ret==0)
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_LOG, "", Constants.SysLog.RESULT_SUCCESS);
				results = "{\"success\":true,\"msg\":\"删除日志成功\"}";
			}
			else
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_LOG, "", Constants.SysLog.RESULT_FAIL);
				results = "{\"success\":false,\"msg\":\"删除日志失败\"}";
			}
		}else{
			results = "{\"success\":false,\"msg\":\"删除日志失败\"}";
		}
		sendResult(results);
		return NONE;
	}
}
