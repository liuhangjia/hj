package com.abm.manager.action;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.abm.common.dao.AccountsDao;
import com.abm.common.dao.EmployeeDao;
import com.abm.common.dao.EnterpriseDao;
import com.abm.common.dao.EnterpriseEmpDao;
import com.abm.common.dao.MemberDao;
import com.abm.common.dao.ProjectPatrolDao;
import com.abm.common.dao.ServiceRequestDao;
import com.abm.common.model.ProjectPatrolModel;
import com.abm.common.utils.Constants;
import com.abm.common.utils.DateUtil;
import com.abm.manager.BaseAction;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 欢迎页action
 * @author minghuiWang
 * 20190120
 * */
public class WelcomeAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = -1531609864769959327L;

	/**
	 * 注册情况统计
	 * */
	public void regTotal(){
		JSONObject result = new JSONObject();
		
		int enterprise = EnterpriseDao.getSingle().getTotal(" and enterprise.IS_DELETE = '0' ");
		int employee = EmployeeDao.getSingle().getTotal(" and employee.TYPE = '0' and employee.IS_DELETE = '0' ");
		int member = MemberDao.getSingle().getTotal(" and member.IS_DELETE = '0' ");
		int account = AccountsDao.getSingle().getTotal(" and accounts.IS_ACTIVE = '1' and accounts.IS_DELETE = '0'  ");
		result.element("enterprise", enterprise);
		result.element("employee", employee);
		result.element("member", member);
		result.element("account", account);
		
		String year_str = DateUtil.getCurrentYear();
		String qy_sql = "";
		
		sendResult(result);
	}
	
	/**
	 * 安保平台注册统计
	 * -- 统计是累计方式
	 * -- 统计当月每天之前的数据之和
	 * 
	 * 	企业  enterprise
	 * 	企业内账号（安保人员，保安）enterpriseUser
	 * 	商户 business
	 * 	个人 person
	 * 	安保人员（资料库）protect
	 */
	public void serviceUserCount(){
		JSONObject result = new JSONObject();
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
		String date = sdf.format(new Date());
		Calendar c = Calendar.getInstance();
		c.setTime(new Date());
		int mDay = c.getActualMaximum(Calendar.DATE);
		
		JSONObject enterprise = new JSONObject();
		JSONObject enterpriseUser = new JSONObject();
		JSONObject business = new JSONObject();
		JSONObject person = new JSONObject();
		JSONObject protect = new JSONObject();
		
		for (int i = 1; i <= mDay; i++) {
			String day = date + "-" + i;
			String sql = " select count(*) count from enterprise where date_format(start_time, '%Y-%m-%d')<=? ";
			List<Map<String, String>> enterpriseList = EnterpriseDao.getSingle().executeQueryBySql(sql, new String[]{day});
			enterprise.element(day, Integer.parseInt(enterpriseList.get(0).get("count")));
		}
		
		for (int i = 1; i <= mDay; i++) {
			String day = date + "-" + i;
			String sql = " select count(*) count from enterprise_emp where date_format(start_time, '%Y-%m-%d')<=? ";
			List<Map<String, String>> enterpriseUserList = EnterpriseEmpDao.getSingle().executeQueryBySql(sql, new String[]{day});
			enterpriseUser.element(day, Integer.parseInt(enterpriseUserList.get(0).get("count")));
		}
		
		for (int i = 1; i <= mDay; i++) {
			String day = date + "-" + i;
			String sql = " select count(*) count from  member where type in('0','2') and date_format(register_time, '%Y-%m-%d')<=? ";
			List<Map<String, String>> businessList = EnterpriseEmpDao.getSingle().executeQueryBySql(sql, new String[]{day});
			business.element(day, Integer.parseInt(businessList.get(0).get("count")));
		}
		
		for (int i = 1; i <= mDay; i++) {
			String day = date + "-" + i;
			String sql = " select count(*) count from  member where type in('1','2') and date_format(register_time, '%Y-%m-%d')<=? ";
			List<Map<String, String>> personList = EnterpriseEmpDao.getSingle().executeQueryBySql(sql, new String[]{day});
			person.element(day, Integer.parseInt(personList.get(0).get("count")));
		}
		
		for (int i = 1; i <= mDay; i++) {
			String day = date + "-" + i;
			String sql = " select count(*) count from employee where date_format(register_time,'%Y-%m')<=? ";
			List<Map<String, String>> protectList = EnterpriseEmpDao.getSingle().executeQueryBySql(sql, new String[]{day});
			protect.element(day, Integer.parseInt(protectList.get(0).get("count")));
		}
		
		result.element("enterprise", enterprise);
		result.element("enterpriseUser", enterpriseUser);
		result.element("business", business);
		result.element("person", person);
		result.element("protect", protect);
		
		sendResult(result);
	}
	
	/**
	 * 安保平台装机统计
	 * -- 累计数据的统计
	 * -- 当月每天之前的数据总计
	 */
	public void serviceEquipmentCount(){
		JSONObject result = new JSONObject();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
		String date = sdf.format(new Date());
		Calendar c = Calendar.getInstance();
		c.setTime(new Date());
		int mDay = c.getActualMaximum(Calendar.DATE);
		for (int i = 1; i <= mDay; i++) {
			String day = date + "-" + i;
			String sql = " select count(*) count from service_request where TYPE= '3' and status= '1' and date_format(exec_time,'%Y-%m-%d') <= ? ";
			List<Map<String, String>> protectList = ServiceRequestDao.getSingle().executeQueryBySql(sql, new String[]{day});
			result.element(day, Integer.parseInt(protectList.get(0).get("count")));
		}
		sendResult(result);
	}
	
	/**
	 * 安保平台首页巡检
	 * -- 当前月的巡检记录
	 */
	public void checkList(){
		JSONObject result = new JSONObject();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
		String date = sdf.format(new Date());
		List<ProjectPatrolModel> list = ProjectPatrolDao.getSingle().executeQuery(" date_format(STAET_TIME,'%Y-%m') = ? order by STAET_TIME desc ", new String[]{date});
		if(null!=list&&list.size()>0){
			sendResult(JSONObject.fromObject(list));
		}else{
			sendResult("[]");
		}
	}
	
}
