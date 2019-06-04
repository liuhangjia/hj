package com.abm.manager.action;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

import com.abm.common.dao.EquipDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.AttendanceDataModel;
import com.abm.common.model.EmployeeModel;
import com.abm.common.model.EnterpriseEmpModel;
import com.abm.common.model.EnterpriseModel;
import com.abm.common.model.EquipModel;
import com.abm.common.model.HrPoolModel;
import com.abm.common.model.WorkAttendanceItemModel;
import com.abm.common.model.WorkAttendanceListModel;
import com.abm.common.model.WorkAttendanceModel;
import com.abm.common.service.EnterpriseService;
import com.abm.common.service.SysLogService;
import com.abm.common.service.WorkAttendanceService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.abm.manager.util.ExcelUtil;
import com.mw.common.utils.DateUtil;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONObject;

public class TimecardAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = 8441922824882385554L;
	
	public void list(){
		JSONObject result = new JSONObject();
		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				if(StringUtil.isEmpty(conditions.get(key))){
					continue;
				}
				if(StringUtil.eq(key, "enterprise_id")){
					condition.append(" and enterprise_id = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "year")){
					condition.append(" and year = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "month")){
					condition.append(" and month = ? ");
					params.add(conditions.get(key));
				}
			}
		}
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(currentUser, "WORK_ATTENDANCE_MANAGER_LIST"));
		List<WorkAttendanceModel> list = service.queryByPage(condition.toString(), params.toArray(new String[params.size()]), 1, Integer.MAX_VALUE, order, null);
		if(null!=list && !list.isEmpty()){
			result.element(TOTAL,service.getTotal1(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS,list);
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	/**
	 * 根据公司统计/第一层列表
	 */
	public void listResultForCompany(){
		JSONObject result = new JSONObject();
		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				if(StringUtil.isEmpty(conditions.get(key))){
					continue;
				}
				if(StringUtil.eq(key, "enterprise_id")){
					condition.append(" and enterprise_id = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "year")){
					condition.append(" and year = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "month")){
					condition.append(" and month = ? ");
					params.add(conditions.get(key));
				}
			}
		}
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(currentUser, "WORK_ATTENDANCE_MANAGER_LIST"));
		condition.append(" group by work_attendance.enterprise_id,work_attendance.year,work_attendance.month ");
		
		List<WorkAttendanceListModel> list = service.queryByPage1(condition.toString(), params.toArray(new String[params.size()]), 1, Integer.MAX_VALUE);
		
		if(null!=list && !list.isEmpty()){
			result.element(TOTAL,service.getTotal1(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS,list);
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		
		sendResult(result);
	}
	
	/**
	 * 根据项目统计/第二层列表
	 */
	public void listResultForProject(){
		JSONObject result = new JSONObject();
		result.element(SUCCESS, false);
		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		boolean flag = true;
		if(StringUtil.isEmpty(enterprise_id)){
			flag = false;
			result.element(MSG, "传入企业数据为空");
		}else if(StringUtil.isEmpty(year)){
			flag = false;
			result.element(MSG, "传入时间数据为空");
		}else if(StringUtil.isEmpty(month)){
			flag = false;
			result.element(MSG, "传入时间数据为空");
		}
		if(!flag){
			sendResult(result);
			return;
		}
		
		params.add(enterprise_id);
		params.add(year);
		params.add(month);
		condition.append(" and enterprise_id = ? ");
		condition.append(" and year = ? ");
		condition.append(" and month = ? ");
		
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(currentUser, "WORK_ATTENDANCE_MANAGER_LIST"));
		String sql1 = condition.toString() + " group by work_attendance.enterprise_id,work_attendance.project_id,work_attendance.year,work_attendance.month ";
		String sql2 = condition.toString() + " group by work_attendance.enterprise_id,work_attendance.year,work_attendance.month ";
		
		List<WorkAttendanceListModel> list = service.queryByPage2(sql1, params.toArray(new String[params.size()]), 1, Integer.MAX_VALUE);
		
		if(null!=list && !list.isEmpty()){
			result.element(SUCCESS, true);
			result.element(TOTAL,service.getTotal2(sql2, params.toArray(new String[params.size()])));
			result.element(ROWS,list);
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		
		sendResult(result);
	}
	
	/**
	 * 第三层数据列表
	 */
	public void listResultForDetail(){
		JSONObject result = new JSONObject();
		result.element(SUCCESS, false);
		if(StringUtil.isEmpty(ids)){
			result.element(MSG, "参数为空");
			sendResult(result);
			return;
		}
		List<WorkAttendanceItemModel> list = service.queryById3(ids);
		if(null!=list&&list.size()>0){
			result.element(SUCCESS, true);
			result.element(ROWS, list);
		}else{
			result.element(MSG, "查询结果为空");
		}
		sendResult(result);
	}
	
	public void del(){
		JSONObject result = new JSONObject();
		if(StringUtil.isEmpty(ids)){
			result.element(SUCCESS, false);
			result.element(MSG, "请指定需要删除的数据");
		}else{
			if(service.del(ids)){
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_TIMECARD, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "删除成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_TIMECARD, null, Constants.SysLog.RESULT_FAIL);
				result.element(SUCCESS, false);
				result.element(MSG, "删除失败");
			}
		}
		sendResult(result);
	}
	
	/**
	 * 上传考勤信息
	 */
	public void importData(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		result.element(SUCCESS, flag);
		
		
//		if(null != uploadFile){
//			try {
//				POIFSFileSystem fs = new POIFSFileSystem(new FileInputStream(uploadFile));
//				HSSFWorkbook workbook = new HSSFWorkbook(fs);
//				HSSFSheet sheet = workbook.getSheetAt(0);
//				int start_row = 2;
//				HSSFRow row = null;
//				HSSFCell cell  = null;
//				List<EnterpriseEmpModel> datas = new ArrayList<EnterpriseEmpModel>();
//				String msg = "";
//						
//				if(null==enterpriseEmployee || StringUtil.isEmpty(enterpriseEmployee.getEnterprise_id())){
//					result.element(MSG, "请选择企业");
//					sendResult(result);
//					return;
//				}
//				EnterpriseModel enterpriseModel = EnterpriseService.getSingle().findById(enterpriseEmployee.getEnterprise_id());
//				
//				for (int i = start_row; i <= sheet.getLastRowNum(); i++) {
//					row = sheet.getRow(i);
//					if(null==row){
//						continue;
//					}
//					EnterpriseEmpModel model = new EnterpriseEmpModel();
//					EmployeeModel empModel = new EmployeeModel();
//					
//					//姓名
//					cell = row.getCell(0);
//					empModel.setName(cell.getStringCellValue());
//					//手机
//					cell = row.getCell(1);
//					empModel.setPhone(ExcelUtil.getCellStringValue(cell));
//					//性别
//					cell = row.getCell(2);
//					if(null!=cell){
//						empModel.setSex(cell.getStringCellValue());
//					}
//					//部门
//					cell = row.getCell(3);
//					if(null!=cell){
//						model.setDepart_name(cell.getStringCellValue());
//					}
//					//职务
//					cell = row.getCell(4);
//					if(null!=cell){
//						model.setPosition(cell.getStringCellValue());
//					}
//					//联系地址
//					cell = row.getCell(5);
//					if(null!=cell){
//						empModel.setAddress(cell.getStringCellValue());
//					}
//					//入职时间
//					cell = row.getCell(6);
//					if(null!=cell){
//						model.setStart_time(ExcelUtil.getCellStringValue(cell));
//					}
//					//离职时间
//					cell = row.getCell(7);
//					if(null!=cell){
//						model.setEnd_time(ExcelUtil.getCellStringValue(cell));
//					}
//					//当前状态
//					cell = row.getCell(8);
//					if(null!=cell){
//						String _type = cell.getStringCellValue();
//						if(StringUtil.eq(_type, "在岗")){
//							model.setStatus("1");
//						}else if(StringUtil.eq(_type, "离职")){
//							model.setStatus("0");
//						}else{
//							
//						}
//					}
//					//备注
//					cell = row.getCell(9);
//					if(null!=cell){
//						model.setBak(cell.getStringCellValue());
//					}
//					
//					empModel.setType(Constants.Employee.EMP_TYPE_YG);
//					empModel.setRegister_time(DateUtil.now());
//					model.setEmployeeModel(empModel);
//					
//					model.setEnterpriseModel(enterpriseModel);
//					model.setEnterprise_id(enterpriseModel.getId());
//					//非企业管理员
//					model.setIs_enterprise_admin("0");
//					datas.add(model);
//				}
//				int r = employeeService.importData(datas);
//				if(r==0){
//					result.element(SUCCESS, true);
//					result.element(MSG, "导入成功");
//				}else if(r==-1){
//					result.element(MSG, "账号不存在");
//				}else if(r==-2){
//					result.element(MSG, "账户已经存在");
//				}else{
//					result.element(MSG, "导入失败");
//				}
//			} catch (Exception e) {
//				result.element(MSG, "异常错误");
//				e.printStackTrace();
//			}
//		}else{
//			result.element(MSG, "请选择上传文件");
//		}
//		sendResult(result);
	}
	
	public void modify(){
		JSONObject result = new JSONObject();
		result.element(SUCCESS, false);
		if(null==workAttendanceModel){
			result.element(MSG, "数据对象不存在");
			sendResult(result);
			return;
		}
		if(StringUtil.isEmpty(workAttendanceModel.getId())){
			if(service.addItem(workAttendanceModel)){
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_TIMECARD, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "添加成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_TIMECARD, null, Constants.SysLog.RESULT_FAIL);
				result.element(MSG, "添加失败");
			}
		}else{
			if(service.updItem(workAttendanceModel)){
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_TIMECARD, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "修改成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_TIMECARD, null, Constants.SysLog.RESULT_FAIL);
				result.element(MSG, "修改失败");
			}
		}
		
		sendResult(result);
	}
	
	public void addFaceData()
	{
		if(param!=null&&param.trim().length()>0)
		{
			AttendanceDataModel data = new AttendanceDataModel();
			JSONObject obj = JSONObject.fromObject(param);
			data.setEmp_id(obj.optString("empId"));
			List<EquipModel> equips = EquipDao.getSingle().executeQuery(" and sn=? and type=? ",new String[]{obj.optString("deviceNum"),"KQSB"});
			if(equips!=null&&equips.size()>0)
			{
				data.setEquipment_id(equips.get(0).getId());
			}
			data.setTime_data(obj.optString("time"));
			service.addEmpFaceData(data);
		}
		
	}
	
	
	private String ids;
	private WorkAttendanceModel workAttendanceModel;
	private File uploadFile;
	private String enterprise_id;
	private String year;
	private String month;
	private String param; 
	
	
	public String getIds() {
		return ids;
	}

	public void setIds(String ids) {
		this.ids = ids;
	}
	
	public File getUploadFile() {
		return uploadFile;
	}

	public void setUploadFile(File uploadFile) {
		this.uploadFile = uploadFile;
	}

	public WorkAttendanceModel getWorkAttendanceModel() {
		return workAttendanceModel;
	}

	public void setWorkAttendanceModel(WorkAttendanceModel workAttendanceModel) {
		this.workAttendanceModel = workAttendanceModel;
	}

	public String getEnterprise_id() {
		return enterprise_id;
	}

	public void setEnterprise_id(String enterprise_id) {
		this.enterprise_id = enterprise_id;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}
	
	

	public void setParam(String param) {
		this.param = param;
	}


	private WorkAttendanceService service = WorkAttendanceService.getSingle();
}
