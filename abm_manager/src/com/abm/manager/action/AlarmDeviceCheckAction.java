package com.abm.manager.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;

import com.abm.common.model.AccountsModel;
import com.abm.common.model.AlarmDeviceCheckModel;
import com.abm.common.model.MemberModel;
import com.abm.common.model.ProjectModel;
import com.abm.common.model.RoleModel;
import com.abm.common.service.AlarmDeviceCheckService;
import com.abm.common.service.MemberService;
import com.abm.common.service.ProjectService;
import com.abm.common.service.SysLogService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.Pk;
import com.abm.common.utils.StringUtil;
import com.abm.manager.BaseAction;
import com.mw.common.utils.DateUtil;

public class AlarmDeviceCheckAction extends BaseAction{
	
	private AlarmDeviceCheckService service = AlarmDeviceCheckService.getSingle();
	
	private AlarmDeviceCheckModel record;
	
	private String ids;
	
	
	public AlarmDeviceCheckModel getRecord() {
		return record;
	}



	public void setRecord(AlarmDeviceCheckModel record) {
		this.record = record;
	}
	
	



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
				if( "project_name".equals(key))
				{
					condition = condition + " and project.name like '%"+value+"%' ";
				}
				else if( "name".equals(key))
				{
					condition = condition + " and member.name like '%"+value+"%' ";
				}
				else if( "start_time".equals(key))
				{
					condition = condition + " and check_time >= '"+value+"' ";
				}
				else if( "end_time".equals(key))
				{
					condition = condition + " and check_time < '"+value+"' ";
				}
			}
		}
		
		int total = service.getTotal(condition,null);
		List<AlarmDeviceCheckModel> ret = service.queryByPage(condition,null, page, rows, parseSorter(), parseDirect());
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
	
	public String save()
	{
		String results = null;
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		if(StringUtil.isEmpty(record.getId())){
			record.setCheck_time(DateUtil.now());
			record.setChecker_id(currentUser.getId());
			record.setChecker_name(currentUser.getName());
			int ret = service.add(record);
			if(ret==0)
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_DEVICE_CHECK_RECORD, "", Constants.SysLog.RESULT_SUCCESS);
				results = "{\"success\":true,\"msg\":\"添加设备巡检记录成功\"}";
			}
			else
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_DEVICE_CHECK_RECORD, "", Constants.SysLog.RESULT_FAIL);
				results = "{\"success\":false,\"msg\":\"添加设备巡检记录失败\"}";
			}
		}else{
			
			int ret = service.update(record);
			if(ret==0)
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_DEVICE_CHECK_RECORD, "", Constants.SysLog.RESULT_SUCCESS);
				results = "{\"success\":true,\"msg\":\"更新设备巡检记录成功\"}";
			}
			else if(ret==-1)
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_DEVICE_CHECK_RECORD, "", Constants.SysLog.RESULT_FAIL);
				results = "{\"success\":false,\"msg\":\"更新设备巡检记录失败:找不到巡检记录\"}";
			}
			else
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_DEVICE_CHECK_RECORD, "", Constants.SysLog.RESULT_FAIL);
				results = "{\"success\":false,\"msg\":\"更新设备巡检记录失败\"}";
			}
		}
		
		sendResult(results);
		return NONE;
	}
	
	
	public String delete()
	{
		String results = null;
		if(StringUtil.isNotEmpty(ids)){
			int ret = service.delete(ids.split(","));
			if(ret==0)
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_DEVICE_CHECK_RECORD, "", Constants.SysLog.RESULT_SUCCESS);
				results = "{\"success\":true,\"msg\":\"删除设备巡检记录成功\"}";
			}
			else
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_DEVICE_CHECK_RECORD, "", Constants.SysLog.RESULT_FAIL);
				results = "{\"success\":false,\"msg\":\"删除设备巡检记录失败\"}";
			}
		}else{
			results = "{\"success\":false,\"msg\":\"删除设备巡检记录失败\"}";
		}
		sendResult(results);
		return NONE;
	}
	
	public String listProject()
	{
		List<ProjectModel> projects = ProjectService.getSingle().queryByPage(" and project.is_delete=? ", new String[]{Constants.IS_DELETE_FALSE}, 1, Integer.MAX_VALUE, null, null);
		if(projects!=null)
		{
			sendResult(JSONArray.fromObject(projects).toString());
		}
		else
		{
			sendResult("[]");
		}
		return NONE;
	}
	
	
	public String listMemeber()
	{
		List<MemberModel> members = MemberService.getSingle().queryByPage(" and member.is_delete=? ", new String[]{Constants.IS_DELETE_FALSE}, 1, Integer.MAX_VALUE, null, null);
		if(members!=null)
		{
			sendResult(JSONArray.fromObject(members).toString());
		}
		else
		{
			sendResult("[]");
		}
		return NONE;
	}
	
	
	

}
