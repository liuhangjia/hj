package com.abm.manager.action;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.abm.common.dao.AccountsDao;
import com.abm.common.dao.EmployeeDao;
import com.abm.common.dao.EnterpriseEmpDao;
import com.abm.common.dao.EnterpriseInviteDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.EmployeeModel;
import com.abm.common.model.EnterpriseEmpModel;
import com.abm.common.model.EnterpriseInviteModel;
import com.abm.common.model.EnterpriseModel;
import com.abm.common.model.ServiceRequestModel;
import com.abm.common.service.EnterpriseService;
import com.abm.common.service.ServiceRequestService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.Pk;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.mw.common.utils.Common;
import com.mw.common.utils.DateUtil;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 企业
 * @author minghuiWang
 * 20181228
 * */
public class EnterpriseAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = 4717723293127680400L;

	public void modify(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		try{
			if(null != enterprise){
				if(StringUtil.isNotEmpty(save_filename)&&StringUtil.isNotEmpty(yuan_filename)){
					JSONObject file_json=new JSONObject();
					file_json.element("yuan_filename", yuan_filename);
					file_json.element("save_filename", save_filename);
					enterprise.setLogo(file_json.toString());
				}
				flag = enterpriseService.modify(enterprise);
				if(flag){
					result.element(MSG, "保存数据成功");
				}else{
					result.element(MSG, "保存数据失败");
				}
			}else{
				result.element(MSG, "请填写企业信息");
			}
		}catch(Exception e){
			result.element(MSG, "保存数据异常：" + e.getMessage());
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void delete(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if(StringUtil.isNotEmpty(ids)){
			flag = enterpriseService.delete(ids.split(","));
			if(flag){
				result.element(MSG, "删除企业信息成功");
			}else{
				result.element(MSG, "删除企业信息失败");
			}
		}else{
			result.element(MSG, "请选择企业信息");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void listForProject(){
		StringBuffer condition = new StringBuffer(" and is_delete=? ");
		List<String> params = new ArrayList<String>();
		params.add(Constants.IS_DELETE_FALSE);
		
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(user, "PROJECT_MANAGER_ADD"));
		
		List<EnterpriseModel> models = enterpriseService.queryByPage(condition.toString(), params.toArray(new String[params.size()]), 1, 100000, "START_TIME", null);
		JSONArray array = new JSONArray();
		if(null != models && !models.isEmpty()){
			array = JSONArray.fromObject(models);
		}
		sendResult(array);
	}
	
	public void listForPriv(){
		StringBuffer condition = new StringBuffer(" and is_delete=? ");
		List<String> params = new ArrayList<String>();
		params.add(Constants.IS_DELETE_FALSE);
		
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(user, priv));
		
		List<EnterpriseModel> models = enterpriseService.queryByPage(condition.toString(), params.toArray(new String[params.size()]), 1, 100000, "START_TIME", null);
		JSONArray array = new JSONArray();
		if(null != models && !models.isEmpty()){
			array = JSONArray.fromObject(models);
		}
		sendResult(array);
	}
	
	public void list(){
		JSONObject result = new JSONObject();
		StringBuffer condition = new StringBuffer(" and is_delete=? ");
		List<String> params = new ArrayList<String>();
		params.add(Constants.IS_DELETE_FALSE);
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.eq(key, "name")){
					condition.append(" and name like ? ");
					params.add("%" + value + "%");
				}
			}
		}
		
		List<EnterpriseModel> models = enterpriseService.queryByPage(condition.toString(), params.toArray(new String[params.size()]), page, rows, "START_TIME", null);
		if(null != models && !models.isEmpty()){
			result.element(TOTAL, enterpriseService.getTotal(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS, JSONArray.fromObject(models));
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	// 设置管理员
	public void setManager(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		result.element(SUCCESS, flag);
		if(StringUtil.isNotEmpty(json)){
			JSONObject params = JSONObject.fromObject(json);
//			String accountId = params.optString("accountId");
			String account = params.optString("account");
			if(StringUtil.isEmpty(account)){
				result.element(MSG, "帐号为空");
				sendResult(result);
				return;
			}
			
			int ret  = enterpriseService.setManager(params.optString("enterpriseId"),account);
			if(ret==0){
				result.element(MSG, "设置企业管理员成功");
				flag = true;
			}else if(ret==-1){
				result.element(MSG, "设置企业管理员失败:账户不存在");
			}else{
				result.element(MSG, "设置企业管理员失败");
			}
		}else{
			result.element(MSG, "设置企业管理员失败:未指定账户信息");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
//	// 重置密码
//	public void resetPwd(){
//		JSONObject result = new JSONObject();
//		boolean flag = false;
//		if(StringUtil.isNotEmpty(json)){
//			JSONObject params = JSONObject.fromObject(json);
//			String accountId = params.optString("accountId");
//			if(StringUtil.isNotEmpty(accountId)){
//				String defPwd = Config.default_passwd;
//				String upd = "update accounts set PASSWD = ? where id = ? ";
//				flag = AccountsDao.getSingle().execute(upd, new String[]{defPwd,accountId});
//				if(flag){
//					result.element(MSG, "重置密码成功，重置密码为：" + defPwd);
//				}else{
//					result.element(MSG, "重置密码错误");
//				}
//			}else{
//				result.element(MSG, "请选择管理员");
//			}
//		}else{
//			result.element(MSG, "请输入管理员");
//		}
//		result.element(SUCCESS, flag);
//		sendResult(result);
//	}
	
	// 安保人员邀请
	public void empInvite(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
				
		if(StringUtil.isNotEmpty(phone)){
			if(StringUtil.isNotEmpty(entId))
			{
				List<AccountsModel> accountsModels = AccountsDao.getSingle().executeQuery(" and ACCOUNT = ? and IS_DELETE=? ",new String[]{phone,Constants.IS_DELETE_FALSE});
				if(null != accountsModels && !accountsModels.isEmpty()){
					AccountsModel account = accountsModels.get(0);
					List<EmployeeModel> employeeModels = EmployeeDao.getSingle().executeQuery(" and ACCOUNT_ID = ? and EMPLOYEE.IS_DELETE=? ",new String[]{account.getId(),Constants.IS_DELETE_FALSE});
					if(null != employeeModels && !employeeModels.isEmpty()){
						EmployeeModel employeeModel = employeeModels.get(0);
						if(EnterpriseEmpDao.getSingle().getTotal(" and emp_id='"+employeeModel.getId()+"' and STATUS='1' ") == 0){
							EnterpriseInviteModel inviteModel = new EnterpriseInviteModel();
							inviteModel.setId(Common.uuid());
							inviteModel.setEnterprise_id(entId);
							inviteModel.setEmp_id(employeeModel.getId());
							inviteModel.setInvite_time(Common.now());
							inviteModel.setHas_read("0");
							inviteModel.setHandle_id(user.getId());
							inviteModel.setHandle_name(user.getName());
							flag = EnterpriseInviteDao.getSingle().add(inviteModel);
							if(flag){
								result.element(MSG, phone+",邀请成功,请在APP中处理邀请.");
							}else{
								result.element(MSG, phone+",邀请失败");
							}
						}else{
							result.element(MSG, phone+",此手机号对应的安保人员已是其他企业员工");
						}
					}else{
						result.element(MSG, phone+",此手机号在平台不存在员工信息");
					}
				}else{
					result.element(MSG, phone+",此手机号在平台不存在帐号信息");
				}
			}
			else
			{
				result.element(MSG, "请填写邀请企业");
			}
		}else{
			result.element(MSG, "请填写邀请人联系电话");
		}
		
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	/**
	 * 获取应用申请列表
	 * @return
	 */
	public String listModelApply()
	{
		String results = null;
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		if(user.getEmployee()==null)
		{
			sendResult("{\"success\":true,\"total\":\"0\",\"rows\":[]}");
			return NONE;
		}
		List<EnterpriseModel> ents = EnterpriseService.getSingle().queryByPage(null, null, 1, Integer.MAX_VALUE, null, null);
		HashMap<String,String> entMap = new HashMap<String,String>();
		if(ents!=null)
		{
			for(EnterpriseModel ent : ents)
			{
				entMap.put(ent.getId(), ent.getName());
			}
		}
		
		ServiceRequestService service = ServiceRequestService.getSingle();
		String condition = " and type='0' and ENTERPRISE_ID IN (SELECT ENTERPRISE_ID FROM ENTERPRISE_EMP WHERE EMP_ID=? AND IS_ENTERPRISE_ADMIN='1')  ";
		List<String> params = new ArrayList<String>();
		params.add(user.getEmployee().getId());
		
		
		int total = service.getTotal(condition,params.toArray(new String[0]));
		List<ServiceRequestModel> ret = service.queryByPage(condition,params.toArray(new String[0]), page, rows, parseSorter(), parseDirect());
		if(ret!=null)
		{
			JSONArray arra = JSONArray.fromObject(ret);
			for(int i=0;i<arra.size();i++)
			{
				if(entMap.containsKey(arra.getJSONObject(i).optString("enterprise_id")))
				{
					arra.getJSONObject(i).element("enterprise_name", entMap.get(arra.getJSONObject(i).optString("enterprise_id")));
				}
				else
				{
					arra.getJSONObject(i).element("enterprise_name","");
				}
				
			}
			results =  arra.toString();
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
	 * 申请应用
	 * @return
	 */
	public String applyModel()
	{
		String results = null;
		if(sr==null)
		{
			sendResult("{\"success\":false,\"msg\":\"申请应用失败:未指定申请信息\"}");
			return NONE;
		}
		sr.setId(Pk.getId());
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		if(user.getEmployee()==null)
		{
			sendResult("{\"success\":false,\"msg\":\"申请应用失败:获取不到申请人信息\"}");
			return NONE;
		}
		sr.setSn(Pk.sn(new Date(), sr.getPhone()));
		sr.setType(Constants.ServiceRequest.TYPE_ENTERPRISE_APPLY_APP);
		sr.setReq_id(user.getEmployee().getId());
		sr.setReq_name(user.getEmployee().getName());
		sr.setReq_time(DateUtil.now());
		sr.setStatus(Constants.ServiceRequest.STATUS_NOT_HANDLE);
		
		int ret = ServiceRequestService.getSingle().add(sr);
		if(ret==0)
		{
			results = "{\"success\":true,\"msg\":\"申请应用成功，等待审核\"}";
		}
		else
		{
			results = "{\"success\":true,\"msg\":\"申请应用失败\"}";
		}
		sendResult(results);
		return NONE;
	}
	
	
	/**
	 * 申请应用
	 * @return
	 */
	public String approveApply()
	{
		String results = null;
		if(sr==null)
		{
			sendResult("{\"success\":false,\"msg\":\"审核应用失败:未指定申请信息\"}");
			return NONE;
		}
		ServiceRequestModel req = ServiceRequestService.getSingle().getById(sr.getId());
		if(req==null)
		{
			sendResult("{\"success\":false,\"msg\":\"审核应用失败:找不到申请信息\"}");
			return NONE;
		}
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		
		req.setHandle_id(user.getId());
		req.setHandle_name(user.getName());
		req.setHandle_time(Common.now());
		req.setStatus(sr.getStatus());
		if(ServiceRequestService.getSingle().entModuleApproval(req))
		{
			results = "{\"success\":true,\"msg\":\"审核应用成功\"}";
		}
		else
		{
			results = "{\"success\":false,\"msg\":\"审核应用失败\"}";
		}
		sendResult(results);
		return NONE;
	}
	
	
	
	/**
	 * 获取我管理的企业
	 */
	public String listMine(){
		JSONObject result = new JSONObject();
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		if(user.getEmployee()==null)
		{
			sendResult("{\"success\":true,\"total\":\"0\",\"rows\":[]}");
			return NONE;
		}
		StringBuffer condition = new StringBuffer(" and is_delete=? and ID IN (SELECT ENTERPRISE_ID FROM ENTERPRISE_EMP WHERE EMP_ID=? AND IS_ENTERPRISE_ADMIN='1') ");
		List<String> params = new ArrayList<String>();
		params.add(Constants.IS_DELETE_FALSE);
		params.add(user.getEmployee().getId());
		
		List<EnterpriseModel> models = enterpriseService.queryByPage(condition.toString(), params.toArray(new String[params.size()]), 1, Integer.MAX_VALUE, null, null);
		if(null != models && !models.isEmpty()){
			result.element(TOTAL, models.size());
			result.element(ROWS, JSONArray.fromObject(models));
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
		return NONE;
	}
	
	/**
	 * 流程中心中选择企业信息
	 * */
	public void listForWorkflow(){
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		List<EnterpriseModel> models = enterpriseService.queryByPage(PrivUtil.getConditionForEnterprise(user, "EMP_WORK_FLOW_LIST"), null, 1, Integer.MAX_VALUE, null, null);
		if(null != models && !models.isEmpty()){
			sendResult(JSONArray.fromObject(models));
		}else{
			sendResult("[]");
		}
	}
	
	private EnterpriseService enterpriseService = EnterpriseService.getSingle();
	
	private String phone;
	private String json;
	private String ids;
	private EnterpriseModel enterprise;
	private ServiceRequestModel sr;
	private String entId;
	private String priv;
	private String save_filename;
	private String yuan_filename;
	public String getIds() {
		return ids;
	}
	public void setIds(String ids) {
		this.ids = ids;
	}
	public EnterpriseModel getEnterprise() {
		return enterprise;
	}
	public void setEnterprise(EnterpriseModel enterprise) {
		this.enterprise = enterprise;
	}
	public String getJson() {
		return json;
	}
	public void setJson(String json) {
		this.json = json;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}

	public ServiceRequestModel getSr() {
		return sr;
	}

	public void setSr(ServiceRequestModel sr) {
		this.sr = sr;
	}

	public void setEntId(String entId) {
		this.entId = entId;
	}

	public String getPriv() {
		return priv;
	}

	public void setPriv(String priv) {
		this.priv = priv;
	}

	public String getSave_filename() {
		return save_filename;
	}

	public void setSave_filename(String save_filename) {
		this.save_filename = save_filename;
	}

	public String getYuan_filename() {
		return yuan_filename;
	}

	public void setYuan_filename(String yuan_filename) {
		this.yuan_filename = yuan_filename;
	}
	
}
