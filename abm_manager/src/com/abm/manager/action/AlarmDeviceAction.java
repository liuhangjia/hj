package com.abm.manager.action;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.abm.common.dao.MemberDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.AlarmDeviceModel;
import com.abm.common.model.MemberModel;
import com.abm.common.model.ProjectModel;
import com.abm.common.service.AlarmDeviceService;
import com.abm.common.service.MemberService;
import com.abm.common.service.ProjectService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.DateUtil;
import com.abm.common.utils.StringUtil;
import com.abm.manager.BaseAction;
import com.abm.manager.monitor.model.AlarmUnit;
import com.abm.manager.util.ClientCache;
import com.abm.manager.util.SqlSessionUtil;
import com.hj.bean.AlarmDeviceBean;
import com.hj.dao.AlarmDeviceBeanMapper;
import com.mw.common.utils.Common;

public class AlarmDeviceAction extends BaseAction{
	private AlarmDeviceService deviceService = AlarmDeviceService.getSingle();
	private String id;//设备id
	private String ids;
	private AlarmDeviceModel alarmDevice;
	
	public void setId(String id) {
		this.id = id;
	}

	public String getIds() {
		return ids;
	}

	public void setIds(String ids) {
		this.ids = ids;
	}

	public AlarmDeviceModel getAlarmDevice() {
		return alarmDevice;
	}

	public void setAlarmDevice(AlarmDeviceModel alarmDevice) {
		this.alarmDevice = alarmDevice;
	}

	public String delete() {
		JSONObject result = new JSONObject();
		if (StringUtil.isNotEmpty(ids)) {
			if (deviceService.delete(ids.split(","))) {
				result.element(SUCCESS, true);
				result.element(MSG, "删除运行设备成功");
			} else {
				result.element(SUCCESS, false);
				result.element(MSG, "删除运行设备失败");
			}
		} else {
			result.element(SUCCESS, false);
			result.element(MSG, "删除运行设备失败");
		}
		sendResult(result);
		return NONE;
	}
	
	public String save(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if(null == alarmDevice){
			result.element(SUCCESS, flag);
			result.element(MSG, "添加运行设备失败");
			sendResult(result);
			return NONE;
		}
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		
//		AlarmDeviceBean bean = new AlarmDeviceBean();
//		bean.setAddr();
//		bean.setArea(area);
//		bean.setEmpId();
//		bean.setEmpName();
//		bean.setEnterpriseId();
//		bean.setFactory();
//		bean.setId();
//		bean.setIdnum();
//		bean
//		bean
//		bean
//		bean
//		bean
		
		
		if(StringUtil.isEmpty(alarmDevice.getId())){
			alarmDevice.setEmp_id(currentUser.getId());
			alarmDevice.setEmp_name(currentUser.getName());
			alarmDevice.setInstall_time(Common.now());
			flag = deviceService.modify(alarmDevice);
			if(flag){
				result.element(MSG, "添加运行设备成功");
			} else {
				result.element(MSG, "添加运行设备失败");
			}
		}else{
			flag = deviceService.modify(alarmDevice);
			if(flag){
				result.element(MSG, "修改运行设备成功");
			} else {
				result.element(MSG, "修改运行设备失败");
			}
		}
		result.element(SUCCESS, flag);
		sendResult(result);
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
	
	public String listAlarmDevice()
	{
		List<AlarmDeviceModel> alarmDeviceModels = deviceService.queryByPage("", null, 1, Integer.MAX_VALUE, null, null);
		if(alarmDeviceModels!=null)
		{
			sendResult(JSONArray.fromObject(alarmDeviceModels).toString());
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
	
	public String list()
	{
		String results = null;
		String condition = " and 1=1   ";
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
				else if( "addr".equals(key))
				{
					condition = condition + " and alarm_device.install_addr like '%"+value+"%' ";
				}
				else if( "status".equals(key))
				{
					if(!value.equalsIgnoreCase("ALL"))
					{
						condition = condition + " and alarm_device.status = '"+value+"' ";
					}
					
				}


			}
		}
		
		int total = deviceService.getTotal(condition,null);
//		List<AlarmDeviceModel> ret = deviceService.queryByPage(condition,null, page, rows, parseSorter(), parseDirect());
//		if(ret!=null)
//		{
//			String m_ids_str = "";
//			for (AlarmDeviceModel alarmDevice : ret) {
//				m_ids_str += ",'"+alarmDevice.getMember_id()+"'";
//				if(alarmDevice.getLast_modify_time()!=null&&alarmDevice.getLast_modify_time().trim().length()>0)
//				{
//					try
//					{
//						if((System.currentTimeMillis()-DateUtil.StrToDate(alarmDevice.getLast_modify_time().substring(0,19)).getTime())>10*60*1000)//写死10分钟
//						{
//							alarmDevice.setStatus("-1");
//						}
//					}
//					catch(Exception e)
//					{
//						
//					}
//				}
//				
//			}
//			m_ids_str = m_ids_str.substring(1);
//			List<MemberModel> memberList = MemberDao.getSingle().executeQuery("and member.id in ("+m_ids_str+")");
//			Map<String,MemberModel> memberMap = new HashMap<String, MemberModel>();
//			for (MemberModel memberModel : memberList) {
//				memberMap.put(memberModel.getId(), memberModel);
//			}
//			for (AlarmDeviceModel alarmDevice : ret) {
//				MemberModel mm = memberMap.get(alarmDevice.getMember_id());
//				alarmDevice.setMemberModel(mm);
//			}
//			results =  JSONArray.fromObject(ret).toString();
//		}
//		else
//		{
//			results = "[]";
//		}
		
		SqlSession sqlSession = SqlSessionUtil.getSqlSession();
		AlarmDeviceBeanMapper alarmDeviceBeanMapper = sqlSession.getMapper(AlarmDeviceBeanMapper.class);
		List<AlarmDeviceBean> list = alarmDeviceBeanMapper.selectAll();
		results = JSONArray.fromObject(list).toString();
		System.out.println(results);
		
		results = "{\"success\":true,\"total\":\""+total+"\",\"rows\":"+results+"}";
		sendResult(results);
		return NONE;
	}
	
	/**
	 * 撤防
	 * @return
	 */
	public String chefang()
	{
		
		String results = "";
		if(StringUtil.isEmpty(id))
		{
			sendResult("{\"success\":false,\"msg\":\"撤防失败:未指定设备\"}");
			return NONE;
		}
		AlarmUnit dest = ClientCache.getById(id);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		
		if(dest!=null)
		{
				if(Constants.CANCEL_DEFENCE.equals(dest.getStatus()))
				{
					sendResult("{\"success\":false,\"msg\":\"撤防失败:设备已经为撤防状态\"}");
					return NONE;
				}
				if(dest.getFactory().equals(Constants.FACTORY_SA))
				{
					String now = sdf.format(new Date());
					String resp = "ACCEPTOK0,"+now.substring(2)+"\r\n";
					dest.getMessage().offer(resp.getBytes());
				}
				else if(dest.getFactory().equals(Constants.FACTORY_SZW))
				{
					byte[] resp = new byte[18];
					resp[0] = (byte)0xAD;
					
					resp[1] = (byte)0x99;
					resp[2] = (byte)0x11;
					
					resp[3] = (byte)0x1;
					
					resp[4] = (byte)0x06;
					resp[5] = 0;
					resp[6] = 0;
					resp[7] = 0;
					
					
					resp[9] = 0;
					resp[10] = 0;
					resp[11] = 0;
					resp[12] = 0x2;
					resp[13] = 0;
					
					
					
					resp[14] = (byte)0x0d;
					resp[15] = (byte)0x0a;
					
					int checker = 0;
					for(int i=0;i< 8;i++)
					{
						checker = checker + (resp[i]&0xff);
					}
					checker = ~checker;
					checker ++;
					resp[8] = (byte)checker;
					dest.getMessage().offer(resp);
			}
			results = "{\"success\":true,\"msg\":\"撤防成功\"}";
		}
			
		else
		{
			results = "{\"success\":false,\"msg\":\"撤防失败:找不到对应的设备\"}";
		}
		
		sendResult(results);
		return NONE;
	}
	
	/**
	 * 布防
	 */
	public String bufang()
	{
		String results = "";
		if(StringUtil.isEmpty(id))
		{
			sendResult("{\"success\":false,\"msg\":\"布防失败:未指定设备\"}");
			return NONE;
		}
		AlarmUnit dest = ClientCache.getById(id);
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		
			if(dest!=null)
			{
				if(Constants.APPLY_DEFENCE.equals(dest.getStatus()))
				{
					sendResult("{\"success\":false,\"msg\":\"布防失败:设备已经为布防状态\"}");
					return NONE;
				}
				if(dest.getFactory().equals(Constants.FACTORY_SA))
				{
					String now = sdf.format(new Date());
					String resp = "ACCEPTOK1,"+now.substring(2)+"\r\n";
					dest.getMessage().offer(resp.getBytes());
				}
				else if(dest.getFactory().equals(Constants.FACTORY_SZW))
				{
					byte[] resp = new byte[18];
					resp[0] = (byte)0xAD;
					
					resp[1] = (byte)0x99;
					resp[2] = (byte)0x11;
					
					resp[3] = (byte)0x1;
					
					resp[4] = (byte)0x06;
					resp[5] = 0;
					resp[6] = 0;
					resp[7] = 0;
					
					
					resp[9] = 0;
					resp[10] = 0;
					resp[11] = 0;
					resp[12] = 0x1;
					resp[13] = 0;
					
					
					
					resp[14] = (byte)0x0d;
					resp[15] = (byte)0x0a;
					
					int checker = 0;
					for(int i=0;i< 8;i++)
					{
						checker = checker + (resp[i]&0xff);
					}
					checker = ~checker;
					checker ++;
					resp[8] = (byte)checker;
					dest.getMessage().offer(resp);
				}
				results = "{\"success\":true,\"msg\":\"布防成功\"}";
			}
			else
			{
				results = "{\"success\":false,\"msg\":\"布防失败:找不到对应的设备\"}";
			}
		
		sendResult(results);
		return NONE;
	}
	
	public String getAliPushAddress()
	{
		String address = deviceService.getVideoPushUrl(alarmDevice.getUser_name(), alarmDevice.getPasswd());
		JSONObject data = new JSONObject();
		data.element("data", address);
		sendResult(data.toString());
		return NONE;
	}

//	/**
//	 * 深安设备布防
//	 * @return
//	 */
//	public String bufangSa()
//	{
//		String results = "";
//		List<AlarmUnit> units = ClientCache.getAll();
//		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
//		//目前只有一个
//		if(units.size()>0)
//		{
//			for(AlarmUnit unit : units)
//			{
//				if(unit.getFactory().equals(Constants.FACTORY_SA))
//				{
//					String now = sdf.format(new Date());
//					String resp = "ACCEPTOK1,"+now.substring(2)+"\r\n";
//					unit.getMessage().offer(resp.getBytes());
//				}
//			}
//			
//			
//			results = "{\"success\":true,\"msg\":\"布防成功\"}";
//		}
//		else
//		{
//			results = "{\"success\":false,\"msg\":\"布防失败\"}";
//		}
//		sendResult(results);
//		return NONE;
//	}
//	
//	/**
//	 * 深安设备撤防
//	 * @return
//	 */
//	public String chefangSa()
//	{
//		String results = "";
//		List<AlarmUnit> units = ClientCache.getAll();
//		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
//		//目前只有一个
//		if(units.size()>0)
//		{
//			for(AlarmUnit unit : units)
//			{
//				if(unit.getFactory().equals("SA"))
//				{
//					String now = sdf.format(new Date());
//					String resp = "ACCEPTOK0,"+now.substring(2)+"\r\n";
//					unit.getMessage().offer(resp.getBytes());
//				}
//			}
//			
//			
//			results = "{\"success\":true,\"msg\":\"撤防成功\"}";
//		}
//		else
//		{
//			results = "{\"success\":false,\"msg\":\"撤防失败\"}";
//		}
//		sendResult(results);
//		return NONE;
//	}
//	
//	
//	/**
//	 * 狮子王设备布防
//	 * @return
//	 */
//	public String bufangSzw()
//	{
//		String results = "";
//		List<AlarmUnit> units = ClientCache.getAll();
//		//目前只有一个
//		if(units.size()>0)
//		{
//			for(AlarmUnit unit:units)
//			{
//				if(unit.getFactory().equals("SZW"))
//				{
//					byte[] resp = new byte[18];
//					resp[0] = (byte)0xAD;
//					
//					resp[1] = (byte)0x99;
//					resp[2] = (byte)0x11;
//					
//					resp[3] = (byte)0x1;
//					
//					resp[4] = (byte)0x06;
//					resp[5] = 0;
//					resp[6] = 0;
//					resp[7] = 0;
//					
//					
//					resp[9] = 0;
//					resp[10] = 0;
//					resp[11] = 0;
//					resp[12] = 0x1;
//					resp[13] = 0;
//					
//					
//					
//					resp[14] = (byte)0x0d;
//					resp[15] = (byte)0x0a;
//					
//					int checker = 0;
//					for(int i=0;i< 8;i++)
//					{
//						checker = checker + (resp[i]&0xff);
//					}
//					checker = ~checker;
//					checker ++;
//					resp[8] = (byte)checker;
//					unit.getMessage().offer(resp);
//				}
//			}
//			
//			results = "{\"success\":true,\"msg\":\"布防成功\"}";
//		}
//		else
//		{
//			results = "{\"success\":false,\"msg\":\"布防失败\"}";
//		}
//		sendResult(results);
//		return NONE;
//	}
//	
//	/**
//	 * 狮子王设备撤防
//	 * @return
//	 */
//	public String chefangSzw()
//	{
//		String results = "";
//		List<AlarmUnit> units = ClientCache.getAll();
//		//目前只有一个
//		if(units.size()>0)
//		{
//			for(AlarmUnit unit : units)
//			{
//				if(unit.getFactory().equals("SZW"))
//				{
//					byte[] resp = new byte[18];
//					resp[0] = (byte)0xAD;
//					
//					resp[1] = (byte)0x99;
//					resp[2] = (byte)0x11;
//					
//					resp[3] = (byte)0x1;
//					
//					resp[4] = (byte)0x06;
//					resp[5] = 0;
//					resp[6] = 0;
//					resp[7] = 0;
//					
//					
//					resp[9] = 0;
//					resp[10] = 0;
//					resp[11] = 0;
//					resp[12] = 0x2;
//					resp[13] = 0;
//					
//					
//					
//					resp[14] = (byte)0x0d;
//					resp[15] = (byte)0x0a;
//					
//					int checker = 0;
//					for(int i=0;i< 8;i++)
//					{
//						checker = checker + (resp[i]&0xff);
//					}
//					checker = ~checker;
//					checker ++;
//					resp[8] = (byte)checker;
//					unit.getMessage().offer(resp);
//				}
//			}
//			
//			
//			
//			results = "{\"success\":true,\"msg\":\"撤防成功\"}";
//		}
//		else
//		{
//			results = "{\"success\":false,\"msg\":\"撤防失败\"}";
//		}
//		sendResult(results);
//		return NONE;
//	}

}
