package com.abm.manager.action;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;

import com.abm.common.dao.MemberDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.AlarmDeviceModel;
import com.abm.common.model.AlarmLogModel;
import com.abm.common.model.MemberModel;
import com.abm.common.service.AlarmLogService;
import com.abm.common.service.SysLogService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.DateUtil;
import com.abm.common.utils.StringUtil;
import com.abm.manager.BaseAction;

public class AlarmLogAction extends BaseAction{
	private AlarmLogService alarmLogService = AlarmLogService.getSingle();
	private String id;
	private String result;

	
	
	
	public void setId(String id) {
		this.id = id;
	}

	public void setResult(String result) {
		this.result = result;
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
				if( "name".equals(key))
				{
					condition = condition + " and alarm_device.name like '%"+value+"%' ";
				}
				else if( "start".equals(key))
				{
					condition = condition + " and alarm_log.alarm_time >= '"+value+"' ";
				}
				else if( "end".equals(key))
				{
					condition = condition + " and alarm_log.alarm_time < '"+value+"' ";
				}
			}
		}
		
		int total = alarmLogService.getTotal(condition,null);
		List<AlarmLogModel> ret = alarmLogService.queryByPage(condition,null, page, rows, parseSorter(), parseDirect());
		
		if(ret!=null)
		{
			String m_ids_str = "";
			for(AlarmLogModel alarmLog:ret)
			{
				m_ids_str += ",'"+alarmLog.getAlarmDeviceModel().getMember_id()+"'";
				if(alarmLog.getAlarmDeviceModel().getLast_modify_time()!=null&&alarmLog.getAlarmDeviceModel().getLast_modify_time().trim().length()>0)
				{
						try
						{
							if((System.currentTimeMillis()-DateUtil.StrToDate(alarmLog.getAlarmDeviceModel().getLast_modify_time()).getTime())>10*60*1000)//写死10分钟
							{
								alarmLog.getAlarmDeviceModel().setStatus("-1");
							}
						}
						catch(Exception e)
						{
							
						}
				}
					
			}
			m_ids_str = m_ids_str.substring(1);
			List<MemberModel> memberList = MemberDao.getSingle().executeQuery("and member.id in ("+m_ids_str+")");
			Map<String,MemberModel> memberMap = new HashMap<String, MemberModel>();
			for (MemberModel memberModel : memberList) {
				memberMap.put(memberModel.getId(), memberModel);
			}
			for (AlarmLogModel alarmLog:ret) {
				MemberModel mm = memberMap.get(alarmLog.getAlarmDeviceModel().getMember_id());
				alarmLog.getAlarmDeviceModel().setMemberModel(mm);
			}
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
	
	public String handle()
	{
		String results = null;
		if(StringUtil.isEmpty(id))
		{
			sendResult("{\"success\":false,\"msg\":\"处理失败:未指定告警信息\"}");
			return NONE;
		}
		AccountsModel currentUser = ((AccountsModel)getSession().getAttribute(Constants.USER));
		int ret = alarmLogService.handle(id,result,currentUser.getId(),currentUser.getName());
		
		if(ret==0)
		{
			SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_HANDLE_ALARM, result, Constants.SysLog.RESULT_SUCCESS);
				results = "{\"success\":true,\"msg\":\"处理成功\"}";
		}
		else if(ret==-1)
		{
			SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_HANDLE_ALARM, result, Constants.SysLog.RESULT_FAIL);
			results = "{\"success\":false,\"msg\":\"处理失败:找不到告警信息\"}";
		}
		else
		{
			SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_HANDLE_ALARM, result, Constants.SysLog.RESULT_FAIL);
			results = "{\"success\":false,\"msg\":\"处理失败\"}";
		}
		
		sendResult(results);
		return NONE;
	}
	
	
}
