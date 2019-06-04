package com.abm.manager.action;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.runtime.ProcessInstance;

import com.abm.common.act.service.ActWorkflowService;
import com.abm.common.act.service.ProcessKey;
import com.abm.common.dao.AccountsDao;
import com.abm.common.dao.EmployeeDao;
import com.abm.common.dao.MemberDao;
import com.abm.common.dao.ServiceRequestDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.AlarmDeviceModel;
import com.abm.common.model.EmployeeModel;
import com.abm.common.model.EnterpriseEmpModel;
import com.abm.common.model.MemberModel;
import com.abm.common.model.ServiceRequestModel;
import com.abm.common.service.ServiceRequestService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.DateUtil;
import com.abm.common.utils.Pk;
import com.abm.manager.BaseAction;

import com.mw.common.utils.Common;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class ServiceRequestAction extends BaseAction{

	private String status;
	private String sfyzj;
	private String param;
	private String sgr;
	private String sgsj;
	private String sgsm;
	private String equip_rows;
	private String id;
	private String sftj;
	private String type;
	private ServiceRequestModel srm; 
	
	
	public void handleUserIntention(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		try {
			if(null==srm || StringUtil.isEmpty(srm.getId())){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			
			AccountsModel account = (AccountsModel)getSession().getAttribute(Constants.USER);
			String hId = "";
			String hName = "";
			if(StringUtil.eq(account.getAccount(), "admin")){
				hId = account.getId();
				hName = "admin";
			}else{
				List<EmployeeModel>  empList = EmployeeDao.getSingle().executeQuery(" and employee.ACCOUNT_ID=? ",new String[]{account.getId()});
				if(null==empList || empList.isEmpty()){
					result.element(MSG, "找不到用户信息");
					sendResult(result);
					return;
				}
				EmployeeModel emp = empList.get(0);
				if(null==emp){
					result.element(MSG, "找不到用户信息");
					sendResult(result);
					return;
				}
				hId = emp.getId();
				hName = emp.getName();
			}
			
			String save_type = "";
			if(StringUtil.eq(srm.getStatus(), "1")){
				srm.setHandle_id(hId);
				srm.setHandle_name(hName);
				srm.setHandle_time(Common.now());
				srm.setHandle_result("已和用户沟通");
				save_type = "标记为已处理";
			}else{
				save_type = "暂存";
			}
			flag = ServiceRequestDao.getSingle().update(srm, false);
			if(flag){
				result.element(MSG, save_type+"成功");
			}else{
				result.element(MSG, save_type+"失败");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void listForUserIntention(){
		JSONObject result = new JSONObject();
		result.element(TOTAL, 0);
		result.element(ROWS, "[]");
		try {
			if(StringUtil.isNotEmpty(type)){
				StringBuffer condition = new StringBuffer();
				List<String> params = new ArrayList<String>();
				
				condition.append(" and service_request.type=? ");
				params.add(type);
				
				if(StringUtil.isNotEmpty(sfyzj) && StringUtil.eq(sfyzj, "1")){
					condition.append(" and (service_request.status='1' or service_request.status='2') ");
				}else{
					if(StringUtil.isNotEmpty(status)){
						condition.append(" and service_request.status=? ");
						params.add(status);
					}
				}
				
				Map<String,String> conditions = parseCondition();
				if(null != conditions && !conditions.isEmpty()){
					for(String key : conditions.keySet()){
						String value = conditions.get(key);
						if(StringUtil.isEmpty(value)){
							continue;
						}
						if(StringUtil.eq(key, "name")){
							condition.append(" and service_request.req_name like ? ");
							params.add("%" + value + "%");
						}
						if(StringUtil.eq(key, "sqsj_kssj")){
							condition.append(" and service_request.req_time > ? ");
							params.add(value);
						}
						if(StringUtil.eq(key, "sqsj_jssj")){
							condition.append(" and service_request.req_time <= ? ");
							params.add(value);
						}
						if(StringUtil.eq(key, "sl_name")){
							condition.append(" and service_request.handle_name like ? ");
							params.add("%" + value + "%");
						}
						if(StringUtil.eq(key, "slsj_kssj")){
							condition.append(" and service_request.handle_time > ? ");
							params.add(value);
						}
						if(StringUtil.eq(key, "slsj_jssj")){
							condition.append(" and service_request.handle_time <= ? ");
							params.add(value);
						}
					}
				}
				
				List<ServiceRequestModel> list = ServiceRequestDao.getSingle().queryByPage(condition.toString(), params.toArray(new String[0]), page, rows, "REQ_TIME", "desc");
				if(null!=list && !list.isEmpty()){
//					JSONArray array = new JSONArray();
//					for (ServiceRequestModel model : list) {
//						JSONObject json = JSONObject.fromObject(model);
//						JSONObject req_detail_json = JSONObject.fromObject(model.getReq_detail());//{"type":"","phone":"","email":"","content":""}
//						
//					}
					int total=ServiceRequestDao.getSingle().getTotal(condition.toString(), params.toArray(new String[0]));
					result.element(TOTAL, total);
					result.element(ROWS, JSONArray.fromObject(list));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		sendResult(result);
	}
	
	public void serviceCount(){
		JSONObject result=new JSONObject();
//		boolean flag=false;
//		result.element(SUCCESS, flag);
//		result.element(MSG, "数据统计有误");
		try {
			String pie_sql = "select STATUS,count(1) ct from service_request GROUP BY STATUS";
			List<Map<String, String>> status_map_list = ServiceRequestDao.getSingle().executeQueryBySql(pie_sql, null);
			JSONObject status_json = null;
			if(null!=status_map_list && !status_map_list.isEmpty()){
				status_json = new JSONObject();
				for (Map<String, String> map : status_map_list) {
					status_json.element(map.get("status"), map.get("ct"));
				}
				result.element("pie_data", status_json);
			}
			
			String year_str = DateUtil.getCurrentYear();
			String line_sql = "select a.status,a.rt,COUNT(1) ct from ("
					+ "select DATE_FORMAT(REQ_TIME,'%Y-%m') rt,status from service_request"
					+ ") a where a.rt like '"+year_str+"%'  GROUP BY a.status,a.rt ORDER BY a.rt";
			List<Map<String, String>> status_month_map_list = ServiceRequestDao.getSingle().executeQueryBySql(line_sql, null);
			Map<String,int[]> month_map = null;
			if(null!=status_month_map_list && !status_month_map_list.isEmpty()){
				month_map = new HashMap<String, int[]>();
				for (Map<String, String> map : status_month_map_list) {
					String rTime = map.get("rt");
					int month_int = Integer.parseInt(rTime.substring(5, 7));
					if(!month_map.containsKey(map.get("status"))){
						int[] is = new int[12];
						for (int i = 0; i < is.length; i++) {
							if((i+1)==month_int){
								is[i] = Integer.parseInt(map.get("ct"));
							}else{
								is[i] = 0;
							}
						}
						month_map.put(map.get("status"), is);
					}else{
						int[] is = month_map.get(map.get("status"));
						for (int i = 0; i < is.length; i++) {
							if((i+1)==month_int){
								is[i] = Integer.parseInt(map.get("ct"));
							}
						}
					}
				}
				result.element("line_data", month_map);
			}
			
			String column_sql = "select HANDLE_ID,STATUS,count(1) ct from service_request "
					+ "where DATE_FORMAT(REQ_TIME,'%Y')='"+year_str+"' and (STATUS='1' or STATUS='2') GROUP BY HANDLE_ID,STATUS";
			List<Map<String, String>> clr_map_list = ServiceRequestDao.getSingle().executeQueryBySql(column_sql, null);
			List<String> nameList = null;
			Map<String,List<Integer>> countMap = null;
			if(null!=clr_map_list && !clr_map_list.isEmpty()){
				StringBuffer acc_id_sb = new StringBuffer();
				for (Map<String, String> map : clr_map_list) {
					if(StringUtil.isNotEmpty(map.get("handle_id"))){
						acc_id_sb.append(",'").append(map.get("handle_id")).append("'");
					}
				}
				List<AccountsModel> accountList = AccountsDao.getSingle().executeQuery("and id in ("+acc_id_sb.substring(1)+")");
				nameList = new ArrayList<String>();// 与accountList顺序相同
				for (AccountsModel account : accountList) {
					if(StringUtil.isEmpty(account.getName())){
						nameList.add(account.getAccount());
					}else{
						nameList.add(account.getName());
					}
				}
				
				countMap = new HashMap<String, List<Integer>>();//List<Integer> 与accountList顺序相同
				for (Map<String, String> map : clr_map_list) {
					if(!countMap.containsKey(map.get("status"))){
						List<Integer> countList = new ArrayList<Integer>();
						for (AccountsModel account : accountList) {
							if(StringUtil.eq(map.get("handle_id"), account.getId())){
								countList.add(Integer.parseInt(map.get("ct")));
							}else{
								countList.add(0);
							}
						}
						countMap.put(map.get("status"), countList);
					}else{
						List<Integer> countList = countMap.get(map.get("status"));
						for (int i = 0; i < accountList.size(); i++) {
							AccountsModel account = accountList.get(i);
							if(StringUtil.eq(map.get("handle_id"), account.getId())){
								countList.set(i, Integer.parseInt(map.get("ct")));
							}
						}
					}
				}
				JSONObject column_data = new JSONObject();
				column_data.element("nameList", nameList);
				column_data.element("data", countMap);
				result.element("column_data", column_data);
			}
//			if(flag){
//				result.element(MSG, "保存回访信息成功");
//			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
//		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void returnVisit(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "保存回访信息失败");
		try {
			if(null==srm || StringUtil.isEmpty(srm.getId())){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			flag = ServiceRequestDao.getSingle().update(srm, false);
			if(flag){
				result.element(MSG, "保存回访信息成功");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	/**
	 * 有更新功能
	 */
	public void sgdAdd(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "申请失败");
		try {
			AccountsModel account = (AccountsModel)getSession().getAttribute(Constants.USER);
			List<MemberModel> memberList = MemberDao.getSingle().executeQuery(" and member.ACCOUNT_ID=? and member.IS_DELETE='0' ", new String[]{account.getId()});
			MemberModel member = new MemberModel();
			if(null!=memberList && !memberList.isEmpty()){
				member = memberList.get(0);
			}
			
			EnterpriseEmpModel enterpriseEmp = (EnterpriseEmpModel)getSession().getAttribute(Constants.ENTERPRISE_EMP);
			EmployeeModel emp = account.getEmployee();
			
			if(StringUtil.isEmpty(param)){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			JSONObject param_json=null;
			try {
				param_json = JSONObject.fromObject(param);
			} catch (Exception e) {
				e.printStackTrace();
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			if(null==param_json || param_json.isEmpty()){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			ServiceRequestModel srm = new ServiceRequestModel();
			if(StringUtil.isNotEmpty(param_json.optString("id"))){
				srm.setId(param_json.optString("id"));
				param_json.remove("id");
			}
			srm.setBak(param_json.optString("bak"));
//			srm.setEnterprise_id(param_json.optString("enterprise_id"));
			if(StringUtil.isNotEmpty(param_json.optString("lxdh"))){
				srm.setPhone(param_json.optString("lxdh"));
			}else{
				srm.setPhone(member.getPhone());
			}
			
			param_json.remove("bak");
			param_json.remove("lxdh");
//			param_json.remove("enterprise_id");
//			param_json.remove("req_name");
			srm.setReq_detail(param_json.toString());
			srm.setStatus(Constants.ServiceRequest.STATUS_NOT_HANDLE);
			srm.setType(Constants.ServiceRequest.TYPE_SGD);
			
			if(StringUtil.isNotEmpty(srm.getId())){
				flag = ServiceRequestDao.getSingle().update(srm, false);
			}else{
				srm.setId(Common.uuid());
				Date date = new Date();
				srm.setReq_time(DateUtil.toYYYYMMDDHHMMSS(date));
				srm.setSn(Pk.sn(date, member.getPhone()));
				
				if(StringUtil.isNotEmpty(param_json.optString("project_id"))){
					srm.setReq_id(enterpriseEmp.getEmp_id());
					srm.setReq_name(emp.getName());
					srm.setEnterprise_id(enterpriseEmp.getEnterprise_id());
				}else{
					srm.setReq_id(member.getId());
					srm.setReq_name(member.getName());
				}
				
				flag = ServiceRequestDao.getSingle().add(srm);
//				String processKey = "";
//				String businessKey = "";
//				Map<String,Object> vars = new HashMap<String,Object>();
//				vars.put(ProcessKey.APPLY_USER_ID, getSessionEmp().getJtbh());
//				vars.put(ProcessKey.APPLY_USER_NAME, account.getEmployee().getName());
//				vars.put(ProcessKey.BUSINESS_KEY, businessKey);
//				vars.put(ProcessKey.BUSINESS_NAME, shbxBatch.getNd()+"年度"+sblb+pclb_mc);
//				ProcessInstance processInstantc = ActWorkflowService.getSingle().startProcessInstanceByKey(processKey,batch_id,vars,getSessionEmp(),"");
//				if(null == processInstantc){
////					batchService.del(shbxBatch);
//					flag=false;
//					result.element(MSG, "流程启动失败");
//				}
			}
			
			if(flag){
				result.element(MSG, "保存成功");
				
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void writeSGD(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "保存失败");
		try {
			if(StringUtil.isEmpty(id)){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			if(StringUtil.isEmpty(equip_rows)){
				result.element(MSG, "请添加施工设备");
				sendResult(result);
				return;
			}
			JSONArray equip_array=null;
			try {
				equip_array = JSONArray.fromObject(equip_rows);
			} catch (Exception e) {
				e.printStackTrace();
				result.element(MSG, "请添加施工设备");
				sendResult(result);
				return;
			}
			if(null==equip_array || equip_array.isEmpty()){
				result.element(MSG, "请添加施工设备");
				sendResult(result);
				return;
			}
			ServiceRequestModel model = ServiceRequestDao.getSingle().executeQueryById(id);
//			ServiceRequestModel model = new ServiceRequestModel();
//			EmployeeModel emp = EmployeeDao.getSingle().executeQueryById(model.getReq_id());
//			model.setId(id);
			model.setExec_comment(sgsm);
			model.setExec_detail(equip_array.toString());
			model.setExec_name(sgr);
			model.setExec_time(sgsj);
			if(StringUtil.eq(sftj, "1")){
				model.setStatus(Constants.ServiceRequest.STATUS_PASS);
				AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
				model.setHandle_id(user.getId());
				model.setHandle_name(user.getName());
				model.setHandle_time(Common.now());
				String req_detail = model.getReq_detail();
				JSONObject req_json = JSONObject.fromObject(req_detail);
				List<AlarmDeviceModel> admList = new ArrayList<AlarmDeviceModel>();
				for (int i = 0; i < equip_array.size(); i++) {
					JSONObject e_json = equip_array.optJSONObject(i);
					AlarmDeviceModel adm = new AlarmDeviceModel();
					adm.setAddr(e_json.optString("wz"));//位置
					adm.setArea(e_json.optString("fq"));//区域
					adm.setFactory(e_json.optString("cj"));
					adm.setId(Common.uuid());
					adm.setIdnum(e_json.optString("bh"));
					adm.setInstall_addr(req_json.optString("dz"));
					adm.setInstall_time(model.getExec_time());
					adm.setModel(e_json.optString("xh"));
					adm.setName(e_json.optString("mc"));
					adm.setPasswd(e_json.optString("mm"));
					adm.setPid(e_json.optString("glsb"));
					adm.setStatus("0");
					adm.setType(e_json.optString("lb"));
					adm.setUser_name(e_json.optString("yhm"));
					if(StringUtil.isNotEmpty(req_json.optString("project_id"))){
						adm.setEmp_id(model.getReq_id());
						adm.setEmp_name(model.getReq_name());
						adm.setEnterprise_id(model.getEnterprise_id());
						adm.setProject_id(req_json.optString("project_id"));
					}else{
						adm.setMember_id(model.getReq_id());
					}
					admList.add(adm);
				}
				flag = ServiceRequestService.getSingle().tj_sgd(admList, model);
			}else{
				flag = ServiceRequestDao.getSingle().update(model, false);
			}
			
			if(flag){
				if(StringUtil.eq(sftj, "1")){
					result.element(MSG, "提交成功");
				}else{
					result.element(MSG, "保存成功");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void empUpStarApproval(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "审批失败");
		try {
			if(StringUtil.isEmpty(param)){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			JSONObject param_json = JSONObject.fromObject(param);
			String id = param_json.optString("id");
			String emp_id = param_json.optString("emp_id");
			String status = param_json.optString("status");
			String level = param_json.optString("level");
			if(StringUtil.isEmpty(id) || StringUtil.isEmpty(emp_id)){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			if(StringUtil.isEmpty(status)){
				result.element(MSG, "请选择审批结果");
				sendResult(result);
				return;
			}
			
			AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
			
			flag=ServiceRequestService.getSingle().empUpStarApproval(id, emp_id, status, level, user);
			if(flag){
				result.element(MSG, "审批成功");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	/**
	 * 提取我的设备申请列表
	 */
	public void listMyEquipApply()
	{
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		JSONObject result = new JSONObject();
		result.element(TOTAL, 0);
		result.element(ROWS, "[]");
		try {
			StringBuffer condition = new StringBuffer();
			List<String> params = new ArrayList<String>();
			condition.append(" and type = ?  ");
			params.add(Constants.ServiceRequest.TYPE_SGD);
			condition.append(" and (1!=1  ");
			if(user.getMember()!=null)
			{
				condition.append(" or req_id=? ");
				params.add(user.getMember().getId());
			}
			if(user.getEmployee()!=null)
			{
				condition.append(" or req_id=? ");
				params.add(user.getEmployee().getId());
			}
			condition.append(" )  ");
			
			
			List<ServiceRequestModel> list = ServiceRequestDao.getSingle().queryByPage(condition.toString(), params.toArray(new String[0]), page, rows, "REQ_TIME", "desc");
			if(null!=list && !list.isEmpty()){
				int total=ServiceRequestDao.getSingle().getTotal(condition.toString(), params.toArray(new String[0]));
				result.element(TOTAL, total);
				result.element(ROWS, JSONArray.fromObject(list));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		sendResult(result);
	}
	
	public void list(){
		JSONObject result = new JSONObject();
		result.element(TOTAL, 0);
		result.element(ROWS, "[]");
		try {
			StringBuffer condition = new StringBuffer();
			List<String> params = new ArrayList<String>();
			
			if(StringUtil.isNotEmpty(sfyzj) && StringUtil.eq(sfyzj, "1")){
				condition.append(" and (service_request.status='1' or service_request.status='2') ");
			}else{
				if(StringUtil.isNotEmpty(status)){
					condition.append(" and service_request.status=? ");
					params.add(status);
				}
			}
			
//			condition.append(" and (service_request.type='0' or service_request.type='1' or service_request.type='2' or service_request.type='3') ");
			
			Map<String,String> conditions = parseCondition();
			if(null != conditions && !conditions.isEmpty()){
				for(String key : conditions.keySet()){
					String value = conditions.get(key);
					if(StringUtil.isEmpty(value)){
						continue;
					}
					if(StringUtil.eq(key, "name")){
						condition.append(" and service_request.req_name like ? ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "sqsj_kssj")){
						condition.append(" and service_request.req_time > ? ");
						params.add(value);
					}
					if(StringUtil.eq(key, "sqsj_jssj")){
						condition.append(" and service_request.req_time <= ? ");
						params.add(value);
					}
					if(StringUtil.eq(key, "sl_name")){
						condition.append(" and service_request.handle_name like ? ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "slsj_kssj")){
						condition.append(" and service_request.handle_time > ? ");
						params.add(value);
					}
					if(StringUtil.eq(key, "slsj_jssj")){
						condition.append(" and service_request.handle_time <= ? ");
						params.add(value);
					}
				}
			}
			
			List<ServiceRequestModel> list = ServiceRequestDao.getSingle().queryByPage(condition.toString(), params.toArray(new String[0]), page, rows, "REQ_TIME", "desc");
			if(null!=list && !list.isEmpty()){
				int total=ServiceRequestDao.getSingle().getTotal(condition.toString(), params.toArray(new String[0]));
				result.element(TOTAL, total);
				result.element(ROWS, JSONArray.fromObject(list));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		sendResult(result);
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getSfyzj() {
		return sfyzj;
	}

	public void setSfyzj(String sfyzj) {
		this.sfyzj = sfyzj;
	}

	public String getParam() {
		return param;
	}

	public void setParam(String param) {
		this.param = param;
	}

	public String getSgr() {
		return sgr;
	}

	public void setSgr(String sgr) {
		this.sgr = sgr;
	}

	public String getSgsj() {
		return sgsj;
	}

	public void setSgsj(String sgsj) {
		this.sgsj = sgsj;
	}

	public String getSgsm() {
		return sgsm;
	}

	public void setSgsm(String sgsm) {
		this.sgsm = sgsm;
	}

	public String getEquip_rows() {
		return equip_rows;
	}

	public void setEquip_rows(String equip_rows) {
		this.equip_rows = equip_rows;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSftj() {
		return sftj;
	}

	public void setSftj(String sftj) {
		this.sftj = sftj;
	}

	public ServiceRequestModel getSrm() {
		return srm;
	}

	public void setSrm(ServiceRequestModel srm) {
		this.srm = srm;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
}
