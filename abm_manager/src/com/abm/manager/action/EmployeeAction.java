package com.abm.manager.action;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

import com.abm.common.dao.AccountsDao;
import com.abm.common.dao.EmpAchievementDao;
import com.abm.common.dao.EmpAwardDao;
import com.abm.common.dao.EmpCertifacationDao;
import com.abm.common.dao.EmpEducationDao;
import com.abm.common.dao.EmpTrainingDao;
import com.abm.common.dao.EmpWorkDao;
import com.abm.common.dao.EmployeeDao;
import com.abm.common.dao.EnterpriseEmpDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.DepartModel;
import com.abm.common.model.EmpAchievementModel;
import com.abm.common.model.EmpAwardModel;
import com.abm.common.model.EmpCertifacationModel;
import com.abm.common.model.EmpEducationModel;
import com.abm.common.model.EmpTrainingModel;
import com.abm.common.model.EmpWorkModel;
import com.abm.common.model.EmployeeModel;
import com.abm.common.model.EnterpriseEmpModel;
import com.abm.common.model.EnterpriseModel;
import com.abm.common.model.ProjectModel;
import com.abm.common.model.RoleModel;
import com.abm.common.service.AccountsService;
import com.abm.common.service.DepartService;
import com.abm.common.service.EmployeeService;
import com.abm.common.service.EnterpriseEmpService;
import com.abm.common.service.EnterpriseService;
import com.abm.common.service.ProjectService;
import com.abm.common.utils.AllUtil;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.abm.manager.util.ExcelUtil;
import com.mw.common.utils.Common;
import com.mw.common.utils.DateUtil;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 员工
 * @author minghuiWang
 * 20181228
 * */
public class EmployeeAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = 3930652975880216055L;

	private String emp_id;
	private String tName;
	private String project_id;
	private String select_ids;
	private String qx;
	private File uploadFile;
	private EmpAwardModel award;
	private EmpWorkModel work;
	private EmpEducationModel edu;
	private EmpAchievementModel ach;
	private EmpTrainingModel train;
	private EmpCertifacationModel cer;
	private String tId;
	private String save_filename;
	private String yuan_filename;
	
	public void examineChildrenTableRow(){
		JSONObject rv=new JSONObject();
		boolean flag=false;
		rv.element(SUCCESS, flag);
		rv.element(MSG, "审核失败");
		try {
			if(StringUtil.isEmpty(tId) || StringUtil.isEmpty(tName)){
				rv.element(MSG, "找不到信息");
				sendResult(rv);
				return;
			}
			AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
			String sql = "update "+tName+" set EXAMINE_STATUS=?,EXAMINE_TIME=str_to_date(?,'%Y-%m-%d %H:%i:%s'),EXAMINER_ID=?,EXAMINER_NAME=? where id=?";
			flag = EmployeeDao.getSingle().execute(sql, new String[]{Constants.EXAMINE_STATUS_PASS,Common.now(),currentUser.getId(),currentUser.getAccount(),tId});
			if(flag){
				rv.element(MSG, "审核通过");
			}
			if(flag){
				log(tName+"审核", "", "1");
			}else{
				log(tName+"审核", "", "0");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		rv.element(SUCCESS, flag);
		sendResult(rv);
	}
	
	public void delChildrenTableRow(){
		JSONObject rv=new JSONObject();
		boolean flag=false;
		rv.element(SUCCESS, flag);
		rv.element(MSG, "删除失败");
		try {
			if(StringUtil.isEmpty(tId) || StringUtil.isEmpty(tName)){
				rv.element(MSG, "找不到信息");
				sendResult(rv);
				return;
			}
			String sql="delete from "+tName+" where id=?";
			flag = EmployeeDao.getSingle().execute(sql, new String[]{tId});
			if(flag){
				rv.element(MSG, "删除成功");
			}
			if(flag){
				log(tName+"删除", "", "1");
			}else{
				log(tName+"删除", "", "0");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		rv.element(SUCCESS, flag);
		sendResult(rv);
	}
	
	public void modifyCer(){
		JSONObject rv=new JSONObject();
		boolean flag=false;
		rv.element(SUCCESS, flag);
		try {
			if(null==cer || StringUtil.isEmpty(cer.getEmp_id())){
				rv.element(MSG, "请填写信息");
				sendResult(rv);
				return;
			}
			if(StringUtil.isEmpty(cer.getId())){
				cer.setId(Common.uuid());
				cer.setExamine_status(Constants.EXAMINE_STATUS_INIT);
				flag=EmpCertifacationDao.getSingle().add(cer);
				if(flag){
					log("安保人员数据库-资格证书增加", "", "1");
				}else{
					log("安保人员数据库-资格证书增加", "", "0");
				}
			}else{
				flag=EmpCertifacationDao.getSingle().update(cer,false);
				if(flag){
					log("安保人员数据库-资格证书修改", "", "1");
				}else{
					log("安保人员数据库-资格证书修改", "", "0");
				}
			}
			if(flag){
				rv.element(MSG, "保存成功");
			}else{
				rv.element(MSG, "保存失败");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		rv.element(SUCCESS, flag);
		sendResult(rv);
	}
	
	public void modifyTrain(){
		JSONObject rv=new JSONObject();
		boolean flag=false;
		rv.element(SUCCESS, flag);
		try {
			if(null==train || StringUtil.isEmpty(train.getEmp_id())){
				rv.element(MSG, "请填写信息");
				sendResult(rv);
				return;
			}
			if(StringUtil.isEmpty(train.getId())){
				train.setId(Common.uuid());
				train.setExamine_status(Constants.EXAMINE_STATUS_INIT);
				flag=EmpTrainingDao.getSingle().add(train);
				if(flag){
					log("安保人员数据库-培训经历增加", "", "1");
				}else{
					log("安保人员数据库-培训经历增加", "", "0");
				}
			}else{
				flag=EmpTrainingDao.getSingle().update(train,false);
				if(flag){
					log("安保人员数据库-培训经历修改", "", "1");
				}else{
					log("安保人员数据库-培训经历修改", "", "0");
				}
			}
			if(flag){
				rv.element(MSG, "保存成功");
			}else{
				rv.element(MSG, "保存失败");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		rv.element(SUCCESS, flag);
		sendResult(rv);
	}
	
	public void modifyAch(){
		JSONObject rv=new JSONObject();
		boolean flag=false;
		rv.element(SUCCESS, flag);
		try {
			if(null==ach || StringUtil.isEmpty(ach.getEmp_id())){
				rv.element(MSG, "请填写信息");
				sendResult(rv);
				return;
			}
			if(StringUtil.isEmpty(ach.getId())){
				ach.setId(Common.uuid());
				ach.setExamine_status(Constants.EXAMINE_STATUS_INIT);
				flag=EmpAchievementDao.getSingle().add(ach);
				if(flag){
					log("安保人员数据库-工作业绩增加", "", "1");
				}else{
					log("安保人员数据库-工作业绩增加", "", "0");
				}
			}else{
				flag=EmpAchievementDao.getSingle().update(ach,false);
				if(flag){
					log("安保人员数据库-工作业绩修改", "", "1");
				}else{
					log("安保人员数据库-工作业绩修改", "", "0");
				}
			}
			if(flag){
				rv.element(MSG, "保存成功");
			}else{
				rv.element(MSG, "保存失败");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		rv.element(SUCCESS, flag);
		sendResult(rv);
	}
	
	public void modifyWork(){
		JSONObject rv=new JSONObject();
		boolean flag=false;
		rv.element(SUCCESS, flag);
		try {
			if(null==work || StringUtil.isEmpty(work.getEmp_id())){
				rv.element(MSG, "请填写信息");
				sendResult(rv);
				return;
			}
			if(StringUtil.isEmpty(work.getId())){
				work.setId(Common.uuid());
				work.setExamine_status(Constants.EXAMINE_STATUS_INIT);
				flag=EmpWorkDao.getSingle().add(work);
				if(flag){
					log("安保人员数据库-工作经历增加", "", "1");
				}else{
					log("安保人员数据库-工作经历增加", "", "0");
				}
			}else{
				flag=EmpWorkDao.getSingle().update(work,false);
				if(flag){
					log("安保人员数据库-工作经历修改", "", "1");
				}else{
					log("安保人员数据库-工作经历修改", "", "0");
				}
			}
			if(flag){
				rv.element(MSG, "保存成功");
			}else{
				rv.element(MSG, "保存失败");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		rv.element(SUCCESS, flag);
		sendResult(rv);
	}
	
	public void modifyAward(){
		JSONObject rv=new JSONObject();
		boolean flag=false;
		rv.element(SUCCESS, flag);
		try {
			if(null==award || StringUtil.isEmpty(award.getEmp_id())){
				rv.element(MSG, "请填写信息");
				sendResult(rv);
				return;
			}
			if(StringUtil.isEmpty(award.getId())){
				award.setId(Common.uuid());
				award.setExamine_status(Constants.EXAMINE_STATUS_INIT);
				flag=EmpAwardDao.getSingle().add(award);
				if(flag){
					log("安保人员数据库-获得奖励增加", "", "1");
				}else{
					log("安保人员数据库-获得奖励增加", "", "0");
				}
			}else{
				flag=EmpAwardDao.getSingle().update(award,false);
				if(flag){
					log("安保人员数据库-获得奖励修改", "", "1");
				}else{
					log("安保人员数据库-获得奖励修改", "", "0");
				}
			}
			if(flag){
				rv.element(MSG, "保存成功");
			}else{
				rv.element(MSG, "保存失败");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		rv.element(SUCCESS, flag);
		sendResult(rv);
	}
	
	public void modifyEdu(){
		JSONObject rv=new JSONObject();
		boolean flag=false;
		rv.element(SUCCESS, flag);
		try {
			if(null==edu || StringUtil.isEmpty(edu.getEmp_id())){
				rv.element(MSG, "请填写信息");
				sendResult(rv);
				return;
			}
			if(StringUtil.isEmpty(edu.getId())){
				edu.setId(Common.uuid());
				edu.setExamine_status(Constants.EXAMINE_STATUS_INIT);
				flag=EmpEducationDao.getSingle().add(edu);
				if(flag){
					log("安保人员数据库-教育经历增加", "", "1");
				}else{
					log("安保人员数据库-教育经历增加", "", "0");
				}
			}else{
				flag=EmpEducationDao.getSingle().update(edu,false);
				if(flag){
					log("安保人员数据库-教育经历修改", "", "1");
				}else{
					log("安保人员数据库-教育经历修改", "", "0");
				}
			}
			if(flag){
				rv.element(MSG, "保存成功");
			}else{
				rv.element(MSG, "保存失败");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		rv.element(SUCCESS, flag);
		sendResult(rv);
	}
	
	public void getEmpInfoList(){
		JSONObject result = new JSONObject();
		result.element(ROWS, "[]");
		try {
			if(StringUtil.isEmpty(emp_id) || StringUtil.isEmpty(tName)){
				sendResult(result);
				return ;
			}
			if(StringUtil.eq(tName, "emp_award")){
				List<EmpAwardModel> awardList = EmpAwardDao.getSingle().executeQuery("and emp_id=? order by PULISH_TIME desc", new String[]{emp_id});
				result.element(ROWS, awardList);
			}else if(StringUtil.eq(tName, "emp_work")){
				List<EmpWorkModel> workList = EmpWorkDao.getSingle().executeQuery("and emp_id=? order by START_TIME desc", new String[]{emp_id});
				result.element(ROWS, workList);
			}else if(StringUtil.eq(tName, "emp_education")){
				List<EmpEducationModel> eduList = EmpEducationDao.getSingle().executeQuery("and emp_id=? order by START_TIME desc", new String[]{emp_id});
				result.element(ROWS, eduList);
			}else if(StringUtil.eq(tName, "emp_achievement")){
				List<EmpAchievementModel> achList = EmpAchievementDao.getSingle().executeQuery("and emp_id=? order by START_TIME desc", new String[]{emp_id});
				result.element(ROWS, achList);
			}else if(StringUtil.eq(tName, "emp_training")){
				List<EmpTrainingModel> trainList = EmpTrainingDao.getSingle().executeQuery("and emp_id=? order by START_TIME desc", new String[]{emp_id});
				result.element(ROWS, trainList);
			}else if(StringUtil.eq(tName, "emp_certifacation")){
				List<EmpCertifacationModel> cerList = EmpCertifacationDao.getSingle().executeQuery("and emp_id=? order by PUBLISH_TIME desc", new String[]{emp_id});
				result.element(ROWS, cerList);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		sendResult(result);
	}
	
//	public void getEmpInfoList(){
//		JSONObject result = new JSONObject();
//		boolean flag=false;
//		result.element(SUCCESS, flag);
//		try {
//			HttpServletRequest request=getRequest();
//			if( StringUtil.isEmpty(emp_id)){
//				sendResult(result);
//				return ;
//			}
//			List<EmpAwardModel> awardList = EmpAwardDao.getSingle().executeQuery("and emp_id=? order by PULISH_TIME desc", new String[]{emp_id});
//			List<EmpWorkModel> workList = EmpWorkDao.getSingle().executeQuery("and emp_id=? order by START_TIME desc", new String[]{emp_id});
//			List<EmpEducationModel> eduList = EmpEducationDao.getSingle().executeQuery("and emp_id=? order by START_TIME desc", new String[]{emp_id});
//			List<EmpAchievementModel> achList = EmpAchievementDao.getSingle().executeQuery("and emp_id=? order by START_TIME desc", new String[]{emp_id});
//			List<EmpTrainingModel> trainList = EmpTrainingDao.getSingle().executeQuery("and emp_id=? order by START_TIME desc", new String[]{emp_id});
//			List<EmpCertifacationModel> cerList = EmpCertifacationDao.getSingle().executeQuery("and emp_id=? order by PUBLISH_TIME desc", new String[]{emp_id});
//			result.element("awardList",awardList);
//			result.element("workList",workList);
//			result.element("eduList",eduList);
//			result.element("achList",achList);
//			result.element("trainList",trainList);
//			result.element("cerList",cerList);
//			flag=true;
////			EmployeeModel  dbEmp = EmployeeDao.getSingle().executeQueryById(emp.getId());
////			if(StringUtil.isNotEmpty(dbEmp.getIdcard_front())){
////				JSONObject img_json=JSONObject.fromObject(dbEmp.getIdcard_front());
////				request.setAttribute("idcard_front_save_filename",img_json.optString("save_filename"));
////			}
////			if(StringUtil.isNotEmpty(dbEmp.getIdcard_back())){
////				JSONObject img_json=JSONObject.fromObject(dbEmp.getIdcard_back());
////				request.setAttribute("idcard_back_save_filename",img_json.optString("save_filename"));
////			}
//			
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		result.element(SUCCESS, flag);
//		sendResult(result);
//	}
	
	public void findById(){
		JSONObject result=new JSONObject();
		if(StringUtil.isNotEmpty(emp_id)){
			EmployeeModel model = EmployeeDao.getSingle().executeQueryById(emp_id);
			if(null!=model){
				result=JSONObject.fromObject(model);
			}
		}
		sendResult(result);
	}
	
	public void modify(){
		JSONObject rv=new JSONObject();
		boolean flag=false;
		rv.element(SUCCESS, flag);
		try {
			if(null==employee || StringUtil.isEmpty(employee.getPhone())){
				rv.element(MSG, "请填写信息");
				sendResult(rv);
				return;
			}
			
//			int total = EmployeeDao.getSingle().getTotal("and phone=?", new String[]{employee.getPhone()});
//			if(total > 0){
//				msg="该手机号已被注册";
//				rv.element(MSG, msg);
//				sendResult(rv);
//				return;
//			}
			boolean isAdd = false;
			if(StringUtil.isEmpty(employee.getId())){
				int accounts_total=AccountsDao.getSingle().getTotal("and accounts.ACCOUNT=? and accounts.IS_ACTIVE='1' and accounts.IS_DELETE='0'", new String[]{employee.getPhone()});
				if(accounts_total > 0){
					rv.element(MSG, "该手机号已被注册");
					sendResult(rv);
					return;
				}
				isAdd = true;
			}
			String emp_id = EmployeeService.getSingle().modify(employee);
			if(StringUtil.isNotEmpty(emp_id)){
				flag = true;
				rv.element(MSG, "保存成功");
				rv.element("emp_id", emp_id);
			}else{
				rv.element(MSG, "保存失败");
			}
			if(isAdd){
				if(flag){
					log("安保人员数据库增加", "", "1");
				}else{
					log("安保人员数据库增加", "", "0");
				}
			}else{
				if(flag){
					log("安保人员数据库修改", "", "1");
				}else{
					log("安保人员数据库修改", "", "0");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		rv.element(SUCCESS, flag);
		sendResult(rv);
	}
	
	public void listForEmpSelect(){
		JSONObject result = new JSONObject();
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.isNotEmpty(value)){
					if(StringUtil.eq(key, "name")){
						condition.append(" and employee.name like ? ");
						params.add("%" + value + "%");
					}
				}
			}
		}
		
		if(StringUtil.isNotEmpty(project_id)){
//			condition.append(" and not exists(select * from project_emp where project_emp.emp_id=employee.id and project_emp.PROJECT_ID=? ) ");
//			params.add(project_id);
			condition.append(" and exists(select * from enterprise_emp a where a.EMP_ID=employee.id  ");
			condition.append(" and exists(select * from project b where b.ENTERPRISE_ID=a.ENTERPRISE_ID and b.id=? )) ");
			params.add(project_id);
		}else{
			if(StringUtil.isNotEmpty(qx)){
				condition.append(" and exists(select * from enterprise_emp a where a.EMP_ID=employee.id  ");
				condition.append(AllUtil.getEnterpriseIdsCondition(user, qx, "a.ENTERPRISE_ID") + ") ");
			}else{
				
			}
		}
		if(StringUtil.isNotEmpty(select_ids)){
			String[] select_id_ss = select_ids.split(",");
			String in_sql="";
			if(null!=select_id_ss && select_id_ss.length>0){
				for (String id : select_id_ss) {
					in_sql+=",'"+id+"'";
				}
				condition.append(" and employee.id not in ("+in_sql.substring(1)+") ");
			}
		}
		
		List<EmployeeModel> models = employeeService.queryByPage(condition.toString(), params.toArray(new String[params.size()]), page, rows, "REGISTER_TIME", null);
		if(null != models && !models.isEmpty()){
//			StringBuffer ids = new StringBuffer();
//			Map<String,EmployeeModel> _models = new HashMap<String,EmployeeModel>();
//			int i ;
//			for(i = 0 ; i < models.size() ; i++){
//				EmployeeModel model = models.get(i);
//				ids.append(",'").append(model.getId()).append("'");
//				_models.put(model.getId(), model);
//			}
//			List<EnterpriseEmpModel> enterpriseEmps = EnterpriseEmpDao.getSingle().executeQuery(" and emp_id in ("+ids.substring(1)+") and enterprise_emp.enterprise_id = ?",new String[]{enterpriseManager.getEnterprise_id()});
//			if(null != enterpriseEmps && !enterpriseEmps.isEmpty()){
//				for(i = 0 ; i < enterpriseEmps.size() ; i++){
//					EnterpriseEmpModel enterpriseEmp = enterpriseEmps.get(i);
//					if(_models.containsKey(enterpriseEmp.getEmp_id())){
//						_models.get(enterpriseEmp.getEmp_id()).setEnterpriseEmp(enterpriseEmp);
//					}
//				}
//			}
			result.element(TOTAL, employeeService.getTotal(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS, JSONArray.fromObject(models));
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	
	
	/**
	 * 安保人员列表
	 */
	public void listAbry(){
		JSONObject result = new JSONObject();
		StringBuffer condition = new StringBuffer(" and employee.is_delete=?  and employee.type=? ");
		List<String> params = new ArrayList<String>();
		params.add(Constants.IS_DELETE_FALSE);
		params.add("0");
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			Calendar cal = Calendar.getInstance();
			cal.setTime(new Date());
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.isNotEmpty(value))
				{
					if(StringUtil.eq(key, "name")){
						condition.append(" and employee.name like ? ");
						params.add("%" + value + "%");
					}
					else if(StringUtil.eq(key, "star")){
						condition.append(" and employee.star >= ? ");
						params.add(value);
					}
					else if(StringUtil.eq(key, "sex")){
						condition.append(" and employee.sex = ? ");
						params.add(value);
					}
					else if(StringUtil.eq(key, "mz")){
						condition.append(" and employee.nation = ? ");
						params.add(value);
					}
					else if(StringUtil.eq(key, "zzmm")){
						condition.append(" and employee.political = ? ");
						params.add(value);
					}
//					else if(StringUtil.eq(key, "idnum")){
//						condition.append(" and employee.id_number like ? ");
//						params.add("%" + value + "%");
//					}
					else if(StringUtil.eq(key, "phone")){
						condition.append(" and employee.phone like ? ");
						params.add("%" + value + "%");
					}
					else if(StringUtil.eq(key, "weight")){
						condition.append(" and (employee.weight+0) >= ? ");
						params.add(value);
					}
					else if(StringUtil.eq(key, "height")){
						condition.append(" and (employee.height+0) >= ? ");
						params.add(value);
					}
					else if(StringUtil.eq(key, "age_min")){
						int age_min = AllUtil.parseInt(value);
						cal.add(Calendar.YEAR, -1*age_min);
						Date age_min_date = cal.getTime();
						String age_min_date_str = DateUtil.toYYYYMMDD(age_min_date);
						condition.append(" and employee.birthday <= str_to_date(?,'%Y-%m-%d') ");
						params.add(age_min_date_str);
						cal.setTime(new Date());
					}
					else if(StringUtil.eq(key, "age_max")){
						int age_max = AllUtil.parseInt(value);
						cal.add(Calendar.YEAR, -1*age_max);
						Date age_max_date = cal.getTime();
						String age_max_date_str = DateUtil.toYYYYMMDD(age_max_date);
						condition.append(" and employee.birthday >= str_to_date(?,'%Y-%m-%d') ");
						params.add(age_max_date_str);
						cal.setTime(new Date());
					}
//					else if(StringUtil.eq(key, "ename")){
//						condition.append(" and employee.id in (SELECT enterprise_emp.emp_id FROM enterprise_emp,enterprise WHERE enterprise.id=enterprise_emp.enterprise_id AND enterprise.name LIKE ?) ");
//						params.add("%" + value + "%");
//					}
				}
			}
		}
		
		List<EmployeeModel> models = employeeService.queryByPage(condition.toString(), params.toArray(new String[params.size()]), page, rows, "REGISTER_TIME", null);
		if(null != models && !models.isEmpty()){
			result.element(TOTAL, employeeService.getTotal(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS, JSONArray.fromObject(models));
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	/**
	 * 根据当前用户的权限获取对应的企业下面的人员信息
	 */
	public void list(){
		JSONObject result = new JSONObject();
		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		condition.append(" and enterprise.is_delete=? ");
		params.add(Constants.IS_DELETE_FALSE);
		condition.append(" and employee.is_delete=? ");
		params.add(Constants.IS_DELETE_FALSE);
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.isEmpty(value)){
					continue;
				}
				if(StringUtil.eq(key, "account")){
					condition.append(" and exists(select * from employee where employee.id=enterprise_emp.emp_id and employee.phone like ? ) ");
					params.add("%" + value + "%");
				}
				if(StringUtil.eq(key, "name")){
					condition.append(" and exists(select * from employee where employee.id=enterprise_emp.emp_id and employee.name like ? ) ");
					params.add("%" + value + "%");
				}
//				if(StringUtil.eq(key, "enterprise_name")){
//					condition.append(" and exists(select * from enterprise where enterprise.id=enterprise_emp.enterprise_id and enterprise.name like ? ) ");
//					params.add("%" + value + "%");
//				}
				if(StringUtil.eq(key, "enterprise_id")){
					condition.append(" and exists(select * from enterprise where enterprise.id=enterprise_emp.enterprise_id and enterprise.id = ? ) ");
					params.add(value);
				}
//				if(StringUtil.eq(key, "depart_name")){
//					condition.append(" and enterprise_emp.depart_name like ? ");
//					params.add("%" + value + "%");
//				}
				if(StringUtil.eq(key, "depart_id")){
					condition.append(" and enterprise_emp.depart_id = ? ");
					params.add(value);
				}
				
			}
		}
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(currentUser, type));
		
		List<EnterpriseEmpModel> models = empService.queryByPage(condition.toString(), params.toArray(new String[params.size()]), page, rows, "ENTERPRISE.START_TIME,enterprise_emp.depart_name", "desc");
		if(null != models){
			result.element(TOTAL, empService.getTotal(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS, JSONArray.fromObject(models));
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	/**
	 * 根据当前用户的权限获取对应的企业下面的人员信息
	 */
	public void listByEntId(){
		JSONObject result = new JSONObject();
		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		condition.append(" and enterprise.is_delete=? ");
		params.add(Constants.IS_DELETE_FALSE);
		condition.append(" and employee.is_delete=? ");
		params.add(Constants.IS_DELETE_FALSE);
		
		condition.append(" and enterprise_emp.enterprise_id=? ");
		params.add(enterpriseId);
		
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.eq(key, "phone")){
					condition.append(" and employee.phone like ?");
					params.add("%" + value + "%");
				}else if(StringUtil.eq(key, "name")){
					condition.append(" and employee.name like ? ");
					params.add("%" + value + "%");
				}
			}
		}
		
		List<EnterpriseEmpModel> models = empService.queryByPage(condition.toString(), params.toArray(new String[params.size()]), page, rows, "ENTERPRISE.START_TIME", "desc");
		if(null != models){
			result.element(TOTAL, empService.getTotal(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS, JSONArray.fromObject(models));
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	
	public void findByIds(){
		JSONObject result = new JSONObject();
		if(StringUtil.isNotEmpty(ids)){
			String[] _ids = ids.split(",");
			StringBuffer condIds = new StringBuffer();
			for(int i = 0 ; i < _ids.length ; i++){
				condIds.append(",'").append(_ids[i]).append("'");
			}
			String condition = " and enterprise_emp.id in ("+condIds.substring(1)+")";
			List<EnterpriseEmpModel> models = empService.queryByPage(condition, null, 1, Integer.MAX_VALUE, "ENTERPRISE.START_TIME", "desc");
			if(null != models){
				result.element(ROWS, JSONArray.fromObject(models));
			}else{
				result.element(ROWS, "[]");
			}
		}else{
			result.element(ROWS, "[]");
		}
		sendResult(result);
		
	}
	
	
	
	public String resetPwd()
	{
		String results = "";
		if(StringUtil.isEmpty(employee.getAccount_id()))
		{
			sendResult("{\"success\":false,\"msg\":\"重置密码失败:未指定账号信息\"}");
			return NONE;
		}
		if(AccountsService.getSingle().changePassword(employee.getAccount_id(), "111111"))
		{
			results = "{\"success\":true,\"msg\":\"重置密码成功:新密码为111111\"}";
		}
		else
		{
			results = "{\"success\":false,\"msg\":\"重置密码失败\"}";
		}
		sendResult(results);
		return NONE;
		
	}
	
	/**
	 * 保存企业员工账户
	 * @return
	 */
	public String saveAccount()
	{
		String results = "";
		if(StringUtil.isEmpty(enterpriseEmployee.getId()))
		{
			//增加账号，如果账号在employee已经存在，失败，否则如果在accounts中存在，提示从账号初始化
			AccountsModel aModel = new AccountsModel();
			aModel.setAccount(account);
			aModel.setPasswd(passwd);
			aModel.setIs_active(Constants.IS_ACTIVE_TRUE);
			employee.setAccount(aModel);
			employee.setType(Constants.Employee.EMP_TYPE_ACCOUNT);
			employee.setRegister_time(DateUtil.now());
			enterpriseEmployee.setEmployeeModel(employee);
			enterpriseEmployee.setIs_enterprise_admin("0");//非企业管理员
			enterpriseEmployee.setStatus("1");//在岗
			int ret = employeeService.add(enterpriseEmployee);
			if(ret==0){
				results = "{\"success\":true,\"msg\":\"添加账户成功\"}";
			}
			else if(ret==-1){
				results = "{\"success\":false,\"msg\":\"添加账户失败:账户已经存在\"}";
			}
			else{
				results = "{\"success\":false,\"msg\":\"添加账户失败\"}";
			}
		}
		else
		{
			//修改账号
			EnterpriseEmpModel oldEE = EnterpriseEmpDao.getSingle().executeQueryById(enterpriseEmployee.getId());
			if(oldEE==null||oldEE.getEmployeeModel()==null||oldEE.getEmployeeModel().getAccount()==null)
			{
				sendResult("{\"success\":false,\"msg\":\"保存账户失败:找不到对应的记录\"}");
				return NONE;
			}
			oldEE.getEmployeeModel().getAccount().setAccount(account);
			oldEE.getEmployeeModel().getAccount().setPasswd(passwd);
			
			oldEE.getEmployeeModel().setName(employee.getName());
			oldEE.getEmployeeModel().setPhone(employee.getPhone());
			oldEE.getEmployeeModel().setSex(employee.getSex());
			
			oldEE.setDepart_name(enterpriseEmployee.getDepart_name());
			oldEE.setPosition(enterpriseEmployee.getPosition());
			oldEE.setBak(enterpriseEmployee.getBak());
			
			int ret = employeeService.update(oldEE);
			if(ret==0){
				results = "{\"success\":true,\"msg\":\"保存账户成功\"}";
			}
			else if(ret==-1){
				results = "{\"success\":false,\"msg\":\"保存账户失败:账户已经存在\"}";
			}
			else{
				results = "{\"success\":false,\"msg\":\"保存账户失败\"}";
			}
		}
		
		
		sendResult(results);
		return NONE;
	}
	
	/**
	 * 为企业人员设置账号密码
	 * @return
	 */
	public String setAccountForEmployee()
	{
		String results = "";
		if(StringUtil.isEmpty(employee.getId()))
		{
			sendResult("{\"success\":false,\"msg\":\"设置账号失败:未指定员工信息\"}");
			return NONE;
		}
		int ret =  employeeService.setAccount(employee.getId(),account,passwd);
		if(ret==0){
			results = "{\"success\":true,\"msg\":\"设置账号成功\"}";
		}
		else if(ret==-1){
			results = "{\"success\":false,\"msg\":\"设置账号失败:找不到员工信息\"}";
		}
		else if(ret==-2){
			results = "{\"success\":false,\"msg\":\"设置账号失败:账号已经存在\"}";
		}
		else if(ret==-3){
			results = "{\"success\":false,\"msg\":\"设置账号失败:找不到账号信息\"}";
		}
		else{
			results = "{\"success\":false,\"msg\":\"设置账号失败\"}";
		}
		sendResult(results);
		return NONE;
	}
	
	/**
	 * 为企业人员设置账号密码
	 * @return
	 */
	public String clearAccount()
	{
		String results = "";
		if(StringUtil.isEmpty(id))
		{
			sendResult("{\"success\":false,\"msg\":\"清除账号失败:未指定员工信息\"}");
			return NONE;
		}
		int ret =  employeeService.clearAccount(id);
		if(ret==0){
			results = "{\"success\":true,\"msg\":\"设置账号成功\"}";
		}
		else if(ret==-1){
			results = "{\"success\":false,\"msg\":\"设置账号失败:找不到员工信息\"}";
		}
		else if(ret==-2){
			results = "{\"success\":false,\"msg\":\"设置账号失败:账号已经存在\"}";
		}
		else if(ret==-3){
			results = "{\"success\":false,\"msg\":\"设置账号失败:找不到账号信息\"}";
		}
		else{
			results = "{\"success\":false,\"msg\":\"设置账号失败\"}";
		}
		sendResult(results);
		return NONE;
	}
	
	
	/**
	 * 保存企业员工信息
	 * @return
	 */
	public String saveEmp()
	{
		String results = "";
		if(StringUtil.isEmpty(enterpriseEmployee.getId()))
		{
			//增加账号，如果账号在employee已经存在，失败，否则如果在accounts中存在，提示从账号初始化
			List<EmployeeModel> empList = EmployeeDao.getSingle().executeQuery("and employee.phone=? and employee.is_delete='0' ", new String[]{employee.getPhone()});
			if(null!=empList && !empList.isEmpty()){
				results = "{\"success\":false,\"msg\":\"该员工手机号已存在于系统中，不能添加\"}";
				sendResult(results);
				return NONE;
			}
			
			employee.setType(Constants.Employee.EMP_TYPE_YG);
			employee.setRegister_time(DateUtil.now());
			enterpriseEmployee.setEmployeeModel(employee);
			enterpriseEmployee.setIs_enterprise_admin("0");//非企业管理员
			if(StringUtil.isNotEmpty(save_filename) && StringUtil.isNotEmpty(yuan_filename)){
				JSONObject file_json=new JSONObject();
				file_json.element("yuan_filename", yuan_filename);
				file_json.element("save_filename", save_filename);
				enterpriseEmployee.setAttendance_photo(file_json.toString());
			}
			int ret = employeeService.add(enterpriseEmployee);
			if(ret==0){
				results = "{\"success\":true,\"msg\":\"添加员工成功\"}";
			}
			else{
				results = "{\"success\":false,\"msg\":\"添加员工失败\"}";
			}
		}
		else
		{
			//修改账号
			
//			enterpriseEmployee.setEmployeeModel(employee);
			
			EnterpriseEmpModel oldEE = EnterpriseEmpDao.getSingle().executeQueryById(enterpriseEmployee.getId());
			if(oldEE==null)
			{
				sendResult("{\"success\":false,\"msg\":\"保存员工失败:找不到对应的记录\"}");
				return NONE;
			}
			if(oldEE.getEmployeeModel()==null)
			{
				sendResult("{\"success\":false,\"msg\":\"保存员工失败:找不到对应的记录\"}");
				return NONE;
			}
			oldEE.getEmployeeModel().setName(employee.getName());
			oldEE.getEmployeeModel().setPhone(employee.getPhone());
			oldEE.getEmployeeModel().setSex(employee.getSex());
			oldEE.getEmployeeModel().setAddress(employee.getAddress());
			
			oldEE.setDepart_id(enterpriseEmployee.getDepart_id());
			oldEE.setDepart_name(enterpriseEmployee.getDepart_name());
			oldEE.setPosition(enterpriseEmployee.getPosition());
			oldEE.setBak(enterpriseEmployee.getBak());
			oldEE.setStart_time(enterpriseEmployee.getStart_time());
			oldEE.setEnd_time(enterpriseEmployee.getEnd_time());
			oldEE.setStatus(enterpriseEmployee.getStatus());
			
			if(StringUtil.isNotEmpty(save_filename) && StringUtil.isNotEmpty(yuan_filename)){
				JSONObject file_json=new JSONObject();
				file_json.element("yuan_filename", yuan_filename);
				file_json.element("save_filename", save_filename);
				oldEE.setAttendance_photo(file_json.toString());
			}
			
			int ret = employeeService.update(oldEE);
			if(ret==0){
				results = "{\"success\":true,\"msg\":\"保存员工成功\"}";
			}
			else{
				results = "{\"success\":false,\"msg\":\"保存员工失败\"}";
			}
		}
		
		
		sendResult(results);
		return NONE;
	}
	
	
	/**
	 * 批量上传企业员工信息
	 * @return
	 */
	public void importData(){
		JSONObject result = new JSONObject();
		result.element(SUCCESS, false);
		if(null != uploadFile){
			try {
				POIFSFileSystem fs = new POIFSFileSystem(new FileInputStream(uploadFile));
				HSSFWorkbook workbook = new HSSFWorkbook(fs);
				HSSFSheet sheet = workbook.getSheetAt(0);
				int start_row = 2;
				HSSFRow row = null;
				HSSFCell cell  = null;
				List<EnterpriseEmpModel> datas = new ArrayList<EnterpriseEmpModel>();
				String msg = "";
				boolean flag = true;	
				if(null==enterpriseEmployee || StringUtil.isEmpty(enterpriseEmployee.getEnterprise_id())){
					result.element(MSG, "请选择企业");
					sendResult(result);
					return;
				}
				EnterpriseModel enterpriseModel = EnterpriseService.getSingle().findById(enterpriseEmployee.getEnterprise_id());
				List<DepartModel> depList = DepartService.getSingle().list(enterpriseModel.getId());
				Map<String, String> depMap = new HashMap<String, String>();
				if(null!=depList && !depList.isEmpty()){
					for (DepartModel m:depList) {
						depMap.put(m.getName(), m.getId());
					}
				}
				
				for (int i = start_row; i <= sheet.getLastRowNum(); i++) {
					row = sheet.getRow(i);
					if(null==row){
						continue;
					}
					EnterpriseEmpModel model = new EnterpriseEmpModel();
					EmployeeModel empModel = new EmployeeModel();
					
					//姓名
					cell = row.getCell(0);
					empModel.setName(cell.getStringCellValue());
					//手机
					cell = row.getCell(1);
					empModel.setPhone(ExcelUtil.getCellStringValue(cell));
					//性别
					cell = row.getCell(2);
					if(null!=cell){
						empModel.setSex(cell.getStringCellValue());
					}
					//部门
					cell = row.getCell(3);
					if(null!=cell){
						String cStr = cell.getStringCellValue();
						String dStr = depMap.get(cStr);
						if(StringUtil.isEmpty(cStr) || StringUtil.isEmpty(dStr)){
							flag = false;
							msg += "第"+(i+1)+"行部门不存在;";
						}else{
							model.setDepart_name(cStr);
							model.setDepart_id(dStr);
						}
					}
					//职务
					cell = row.getCell(4);
					if(null!=cell){
						model.setPosition(cell.getStringCellValue());
					}
					//联系地址
					cell = row.getCell(5);
					if(null!=cell){
						empModel.setAddress(cell.getStringCellValue());
					}
					//入职时间
					cell = row.getCell(6);
					if(null!=cell){
						model.setStart_time(ExcelUtil.getCellStringValue(cell));
					}
					//离职时间
					cell = row.getCell(7);
					if(null!=cell){
						model.setEnd_time(ExcelUtil.getCellStringValue(cell));
					}
					//当前状态
					cell = row.getCell(8);
					if(null!=cell){
						String _type = cell.getStringCellValue();
						if(StringUtil.eq(_type, "在岗")){
							model.setStatus("1");
						}else if(StringUtil.eq(_type, "离职")){
							model.setStatus("0");
						}else{
							
						}
					}
					//备注
					cell = row.getCell(9);
					if(null!=cell){
						model.setBak(cell.getStringCellValue());
					}
					
					empModel.setType(Constants.Employee.EMP_TYPE_YG);
					empModel.setRegister_time(DateUtil.now());
					model.setEmployeeModel(empModel);
					
					model.setEnterpriseModel(enterpriseModel);
					model.setEnterprise_id(enterpriseModel.getId());
					//非企业管理员
					model.setIs_enterprise_admin("0");
					datas.add(model);
				}
				if(flag){
					int r = employeeService.importData(datas);
					if(r==0){
						result.element(SUCCESS, true);
						result.element(MSG, "导入成功");
					}else if(r==-1){
						result.element(MSG, "账号不存在");
					}else if(r==-2){
						result.element(MSG, "账户已经存在");
					}else{
						result.element(MSG, "导入失败");
					}
				}else{
					result.element(MSG, msg);
				}
			} catch (Exception e) {
				result.element(MSG, "异常错误");
				e.printStackTrace();
			}
			
		}else{
			result.element(MSG, "请选择上传文件");
		}
		sendResult(result);
	}
	
	 
	
	/**
	 * 从账号初始化账户
	 */
	public String refAccount()
	{
		String results = "";
		if(StringUtil.isEmpty(account))
		{
			sendResult("{\"success\":false,\"msg\":\"初始化失败:未指定账号\"}");
			return NONE;
		}
		
		int ret = employeeService.initFromAccount(account);
		if(ret==0){
			results = "{\"success\":true,\"msg\":\"初始化成功\"}";
		}
		else if(ret==-1){
			results = "{\"success\":false,\"msg\":\"初始化失败:账号不存在\"}";
		}
		else if(ret==-2){
			results = "{\"success\":false,\"msg\":\"初始化失败: 账户已经存在\"}";
		}
		else{
			results = "{\"success\":false,\"msg\":\"初始化失败\"}";
		}
		
		sendResult(results);
		return NONE;
	}
	
	
	
	public String delete()
	{
		String results = "";
		if(StringUtil.isEmpty(ids))
		{
			sendResult("{\"success\":false,\"msg\":\"删除账户失败:未指定账户\"}");
			return NONE;
		}
		int ret = employeeService.delete(ids.split(","));
		if(ret==0){
			results = "{\"success\":true,\"msg\":\"删除账户成功\"}";
		}
		else {
			results = "{\"success\":false,\"msg\":\"删除账户失败\"}";
		}
		
		sendResult(results);
		return NONE;
	}
	
	public String listMyEnterprise()
	{
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		String condition = " and is_delete='"+Constants.IS_DELETE_FALSE+"' ";
		condition = condition + PrivUtil.getConditionForEnterprise(currentUser,type);
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
	
	public void listEnterpriseEmp(){
		if(StringUtil.isEmpty(tId)){
			sendResult("[]");
			return;
		}
//		select * from employee where id in(select EMP_ID from enterprise_emp where ENTERPRISE_ID = '0000005');
		List<EmployeeModel> list = EmployeeDao.getSingle().executeQuery(" and employee.id in(select e.EMP_ID from enterprise_emp e where e.ENTERPRISE_ID = ?) ", new String[]{tId});
		sendResult(JSONArray.fromObject(list).toString());
	}
	
	/**
	 * 根据条件查找项目列表
	 * @return
	 */
	public String listProjectByCondition(){
//		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		String condition = " and project.is_delete='"+Constants.IS_DELETE_FALSE+"' ";
		if(StringUtil.isNotEmpty(enterpriseId)){
			condition = condition + " and project.enterprise_id =  '"+enterpriseId + "'";
		}else{
			condition = condition + " and 1=0 ";
		}
//		condition = condition + PrivUtil.getConditionForProject(currentUser);
		List<ProjectModel> list = ProjectService.getSingle().queryByPage(condition, null, 1, Integer.MAX_VALUE, "project.name", "asc");
		if(list!=null){
			sendResult(JSONArray.fromObject(list).toString());
		}else{
			sendResult("[]");
		}
		return NONE;
	}
	
	public String listRolesByEnterpriseEmp()
	{
		List<RoleModel> ret = empService.listRolesByEnterpriseEmp(id);
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
	
	public String saveRole()
	{
		String results = null;
		if(StringUtil.isEmpty(id))
		{
			sendResult("{\"success\":false,\"msg\":\"指定账户角色失败:找不到账户信息\"}");
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
		int ret = empService.saveRole(id,roles);
		if(ret==0)
		{
			results = "{\"success\":true,\"msg\":\"指定账户角色成功\"}";
		}else
		{
			results = "{\"success\":false,\"msg\":\"指定账户角色失败\"}";
				
		}
		sendResult(results);
		return NONE;
	}
	
	
	private EmployeeService employeeService = EmployeeService.getSingle();
	private EnterpriseEmpService empService = EnterpriseEmpService.getSingle();
	
	private String id;
	private String ids;
	private String roleIds;
	private String enterpriseId;
	private String account;
	private String passwd;
	private EmployeeModel employee;
	private EnterpriseEmpModel enterpriseEmployee;
	private String type;
	public String getIds() {
		return ids;
	}
	public void setIds(String ids) {
		this.ids = ids;
	}
	public String getEnterpriseId() {
		return enterpriseId;
	}
	public void setEnterpriseId(String enterpriseId) {
		this.enterpriseId = enterpriseId;
	}
	public EmployeeModel getEmployee() {
		return employee;
	}
	public void setEmployee(EmployeeModel employee) {
		this.employee = employee;
	}

	public String getEmp_id() {
		return emp_id;
	}

	public void setEmp_id(String emp_id) {
		this.emp_id = emp_id;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public void setPasswd(String passwd) {
		this.passwd = passwd;
	}

	public String gettName() {
		return tName;
	}

	public void settName(String tName) {
		this.tName = tName;
	}

	public String getProject_id() {
		return project_id;
	}

	public void setProject_id(String project_id) {
		this.project_id = project_id;
	}

	public String getSelect_ids() {
		return select_ids;
	}

	public void setSelect_ids(String select_ids) {
		this.select_ids = select_ids;
	}

	public void setType(String type) {
		this.type = type;
	}

	public EnterpriseEmpModel getEnterpriseEmployee() {
		return enterpriseEmployee;
	}

	public void setEnterpriseEmployee(EnterpriseEmpModel enterpriseEmployee) {
		this.enterpriseEmployee = enterpriseEmployee;
	}

	public void setId(String id) {
		this.id = id;
	}

	public void setRoleIds(String roleIds) {
		this.roleIds = roleIds;
	}

	public String getQx() {
		return qx;
	}

	public void setQx(String qx) {
		this.qx = qx;
	}

	public File getUploadFile() {
		return uploadFile;
	}

	public void setUploadFile(File uploadFile) {
		this.uploadFile = uploadFile;
	}

	public EmpAwardModel getAward() {
		return award;
	}

	public void setAward(EmpAwardModel award) {
		this.award = award;
	}

	public EmpWorkModel getWork() {
		return work;
	}

	public void setWork(EmpWorkModel work) {
		this.work = work;
	}

	public EmpEducationModel getEdu() {
		return edu;
	}

	public void setEdu(EmpEducationModel edu) {
		this.edu = edu;
	}

	public EmpAchievementModel getAch() {
		return ach;
	}

	public void setAch(EmpAchievementModel ach) {
		this.ach = ach;
	}

	public EmpTrainingModel getTrain() {
		return train;
	}

	public void setTrain(EmpTrainingModel train) {
		this.train = train;
	}

	public EmpCertifacationModel getCer() {
		return cer;
	}

	public void setCer(EmpCertifacationModel cer) {
		this.cer = cer;
	}

	public String gettId() {
		return tId;
	}

	public void settId(String tId) {
		this.tId = tId;
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
