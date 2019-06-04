package com.abm.manager.action;

import java.io.File;
import java.io.FileInputStream;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.abm.common.dao.EmployeeDao;
import com.abm.common.dao.EnterpriseEmpDao;
import com.abm.common.dao.PayrollDao;
import com.abm.common.dao.PayrollTemplateDao;
import com.abm.common.dao.PayrollTemplateItemDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.EmployeeModel;
import com.abm.common.model.EnterpriseEmpModel;
import com.abm.common.model.PayrollDetailModel;
import com.abm.common.model.PayrollModel;
import com.abm.common.model.PayrollTemplateItemModel;
import com.abm.common.model.PayrollTemplateModel;
import com.abm.common.model.WorkAttendanceListModel;
import com.abm.common.service.PayrollService;
import com.abm.common.service.WorkAttendanceService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.abm.manager.filter.registerFunction;
import com.abm.manager.util.ExcelUtil;
import com.mw.common.utils.Common;
import com.mw.common.utils.StringUtil;

public class HumanSalaryAction extends BaseAction {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
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
					condition.append(" and payroll.enterprise_id = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "name")){
					condition.append(" and payroll.name like ? ");
					params.add("%"+conditions.get(key)+"%");
				}
				if(StringUtil.eq(key, "year")){
					condition.append(" and payroll.year = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "month")){
					condition.append(" and payroll.month = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "status")){
					condition.append(" and payroll.status = ? ");
					params.add(conditions.get(key));
				}
			}
		}
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(currentUser, "AWARD_PUNISH_LIST"));
		List<PayrollModel> list = service.queryByPageBySalary(condition.toString(), params.toArray(new String[params.size()]), 1, Integer.MAX_VALUE, order, null);
		if(null!=list && !list.isEmpty()){
			result.element(TOTAL,service.getTotalBySalary(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS,list);
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	public void listByDetail(){
		JSONObject result = new JSONObject();
		List<PayrollDetailModel> list = service.queryByPageByDetail("and payroll_detail.payroll_id = ? ", new String[]{ids}, 1, Integer.MAX_VALUE, order, null);
		if(null!=list && !list.isEmpty()){
			result.element(TOTAL,service.getTotalByDetail("and payroll_detail.payroll_id = ? ", new String[]{ids}));
			result.element(ROWS,list);
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}

	public void save(){
		JSONObject result = new JSONObject();
		if(null == payrollModel){
			result.element(SUCCESS, false);
			result.element(MSG, "保存失败");
			sendResult(result);
			return;
		}
		if(null != payrollModel.getId() && StringUtil.isNotEmpty(payrollModel.getId())){
			List<PayrollTemplateModel> templateModels = PayrollTemplateDao.getSingle().executeQuery(" and payroll_template.id in (select payroll_detail.template_id from payroll_detail where 1 = 1 and payroll_detail.payroll_id in (select payroll.id from payroll where 1 = 1 and payroll.year = ? and payroll.month = ? ))" , new String[]{payrollModel.getYear(), payrollModel.getMonth()});
			if(null != templateModels && templateModels.size() > 0){
				PayrollModel model = PayrollDao.getSingle().executeQueryById(payrollModel.getId());
				if(null != model){
					if(StringUtil.eq(model.getYear(), payrollModel.getYear()) && StringUtil.eq(model.getMonth(), payrollModel.getMonth())){
						if(service.saveBySalary(payrollModel, null)){
							result.element(SUCCESS, true);
							result.element(MSG, "保存成功");
							sendResult(result);
							return;
						}
					}
				}
				result.element(SUCCESS, false);
				result.element(MSG, "保存失败，该模板本月工资单已存在");
				sendResult(result);
				return;
			} else {
				if(!service.saveBySalary(payrollModel, null)){
					result.element(SUCCESS, false);
					result.element(MSG, "保存失败");
					sendResult(result);
					return;
				}
			}
		} else {
			if(null == uploadFile){
				result.element(SUCCESS, false);
				result.element(MSG, "保存失败");
				sendResult(result);
				return;
			}
			if(StringUtil.isEmpty(ids)){
				result.element(SUCCESS, false);
				result.element(MSG, "保存失败");
				sendResult(result);
				return;
			}
			List<PayrollTemplateModel> templateModels = PayrollTemplateDao.getSingle().executeQuery(" and payroll_template.id in (select payroll_detail.template_id from payroll_detail where 1 = 1 and payroll_detail.payroll_id in (select payroll.id from payroll where 1 = 1 and payroll.year = ? and payroll.month = ? ))" , new String[]{payrollModel.getYear(), payrollModel.getMonth()});
			if(null != templateModels && templateModels.size() > 0){
				result.element(SUCCESS, false);
				result.element(MSG, "保存失败，该模板本月工资单已存在");
				sendResult(result);
				return;
			}
			List<PayrollTemplateItemModel> templateItemModels = PayrollTemplateItemDao.getSingle().executeQuery(" and payroll_template_item.template_id = ? order by seq asc", new String[]{ids});
			if(null == templateItemModels || templateItemModels.size() <= 0){
				result.element(SUCCESS, false);
				result.element(MSG, "保存失败，请选择模板");
				sendResult(result);
				return;
			}
			PayrollTemplateModel templateModel = PayrollTemplateDao.getSingle().executeQueryById(ids);
			if(null == payrollModel.getId() || StringUtil.isEmpty(payrollModel.getId())){
				payrollModel.setEnterprise_id(templateModel.getEnterprise_id());
				payrollModel.setCreator_id(getSessionEmp().getId());
				payrollModel.setCreator_name(getSessionEmp().getName());
				payrollModel.setCreate_time(Common.now());
				payrollModel.setStatus("0"); // 状态“新建”
			}
			
			Map<String,WorkAttendanceListModel> maps = WorkAttendanceService.getSingle().queryEnterpriseEmp(templateModel.getEnterprise_id(),payrollModel.getYear(), payrollModel.getMonth());
			if(null == maps){
				System.out.println("Log----------获取" + payrollModel.getYear() + "-" + payrollModel.getMonth() + "考勤记录失败");
			}
			// 补全+计算
			POIFSFileSystem fs;
			try {
				fs = new POIFSFileSystem(new FileInputStream(uploadFile));
				HSSFWorkbook workbook = new HSSFWorkbook(fs);
				new registerFunction().evaluate(null, 0, 0);
				workbook.getCreationHelper().createFormulaEvaluator().evaluateAll(); // 公式计算
				HSSFSheet sheet = workbook.getSheetAt(0);
				HSSFRow row = null;
				List<PayrollDetailModel> detailModels = new ArrayList<PayrollDetailModel>();
				for(int i = 2; i<=sheet.getLastRowNum(); i++){
					PayrollDetailModel detailModel = new PayrollDetailModel();
					row = sheet.getRow(i);
					if(null == row){
						continue;
					}
					
					String sfzh = "";
					String name = "";
					JSONArray details = new JSONArray();
					for(int j = 0; j < templateItemModels.size(); j++){
						JSONObject detail = new JSONObject();
						HSSFCell cell = row.getCell(j);
						PayrollTemplateItemModel itemModel = templateItemModels.get(j);
						if(null != itemModel.getName() && StringUtil.isNotEmpty(itemModel.getName())){
							if(null != itemModel.getData_code() && StringUtil.isNotEmpty(itemModel.getData_code())){
								// 绑定字段业务
								if(StringUtil.eq(itemModel.getData_code(), "name")){
									name = ExcelUtil.getCellValue(cell);
									if(null != name && StringUtil.isNotEmpty(name)){
										detailModel.setName(ExcelUtil.getCellValue(cell));
									} else {
										result.element(SUCCESS, false);
										result.element(MSG, "保存失败，第" + i + "行“姓名”不允许为空");
										sendResult(result);
										return;
									}
								} else if(StringUtil.eq(itemModel.getData_code(), "sfzh")){
									sfzh = ExcelUtil.getCellValue(cell);
									if(null == sfzh || StringUtil.isEmpty(sfzh)){
										List<EmployeeModel> empModels = EmployeeDao.getSingle().executeQuery(" and employee.name = ? ", new String[]{name});
										if(null != empModels && empModels.size() > 0){
											if(empModels.size() != 1){
												result.element(SUCCESS, false);
												result.element(MSG, "保存失败，第" + i + "行,“姓名”重复，请手动填写该行“身份证号”。");
												sendResult(result);
												return;
											} else {
												sfzh = empModels.get(0).getId_number();
												if(null != sfzh && StringUtil.isNotEmpty(sfzh)){
													row.getCell(j).setCellValue(sfzh);
													row = workbook.getSheetAt(0).getRow(i);
													detail.element(String.valueOf(itemModel.getSeq()), sfzh);
													details.add(detail);
													continue;
												}
											}
										}
									}
								} else if(StringUtil.eq(itemModel.getData_code(), "rzrq")){
									if(null != sfzh && StringUtil.isNotEmpty(sfzh)){
										List<EnterpriseEmpModel> emps = EnterpriseEmpDao.getSingle().executeQuery("and emp_id in (select employee.id from employee where employee.name = ? and employee.id_number = ? ) ", new String[]{name, sfzh});
										if(null != emps && emps.size() > 0){
											EnterpriseEmpModel emp = emps.get(0);
											if(null != emp.getStart_time() && StringUtil.isNotEmpty(emp.getStart_time())){
//												cell.setCellValue(emp.getStart_time());
										        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
												row.getCell(j).setCellValue(sdf.parse(emp.getStart_time()));
												workbook.getCreationHelper().createFormulaEvaluator().evaluateAll();
												row = workbook.getSheetAt(0).getRow(i);
												detail.element(String.valueOf(itemModel.getSeq()), emp.getStart_time().substring(0, 10));
												details.add(detail);
												continue;
											}
										}
									}
								} else if(StringUtil.eq(itemModel.getData_code(), "kqts")){
									List<EmployeeModel> empModels = EmployeeDao.getSingle().executeQuery(" and employee.name = ? and employee.id_number = ? ", new String[]{name, sfzh});
									if(null != empModels && empModels.size() > 0){
										WorkAttendanceListModel model = maps.get(empModels.get(0).getId());
										int kqts = model.getNormal() + model.getLate() + model.getOvertime();
										row.getCell(j).setCellValue(kqts);
										workbook.getCreationHelper().createFormulaEvaluator().evaluateAll();
										row = workbook.getSheetAt(0).getRow(i);
										detail.element(String.valueOf(itemModel.getSeq()), kqts);
										details.add(detail);
										continue;
									}
								} else if(StringUtil.eq(itemModel.getData_code(), "gs")){
									detailModel.setTax_amount(String.valueOf(Common.formatMoneyToNum(ExcelUtil.getCellValue(cell))));
								} else if(StringUtil.eq(itemModel.getData_code(), "sb")){
									detailModel.setInsure_amount(String.valueOf(Common.formatMoneyToNum(ExcelUtil.getCellValue(cell))));
								} else if(StringUtil.eq(itemModel.getData_code(), "yfgz")){
									detailModel.setDue_amount(String.valueOf(Common.formatMoneyToNum(ExcelUtil.getCellValue(cell))));
								} else if(StringUtil.eq(itemModel.getData_code(), "sfgz")){
									detailModel.setActual_amount(String.valueOf(Common.formatMoneyToNum(ExcelUtil.getCellValue(cell))));
								}
							}
							detail.element(String.valueOf(itemModel.getSeq()), getCellValue(cell));
							details.add(detail);
						}
					}
					detailModel.setId(Common.uuid());
					detailModel.setTemplate_id(templateModel.getId());
					detailModel.setDetail(details.toString());
					detailModels.add(detailModel);
				}
				
				if(!service.saveBySalary(payrollModel, detailModels)){
					result.element(SUCCESS, false);
					result.element(MSG, "保存失败");
					sendResult(result);
					return;
				}
			} catch (Exception e) {
				e.printStackTrace();
				result.element(SUCCESS, false);
				result.element(MSG, "保存失败");
				sendResult(result);
				return;
			}
		}
		result.element(SUCCESS, true);
		result.element(MSG, "保存成功");
		sendResult(result);
	}
	
	public void updStatus(){
		JSONObject result = new JSONObject();
		if(StringUtil.isEmpty(ids)){
			result.element(SUCCESS, false);
			result.element(MSG, "请选择需要归档的数据");
		}else{
			if(service.updStatusBySalary(ids)){
				result.element(SUCCESS, true);
				result.element(MSG, "归档成功");
			}else{
				result.element(SUCCESS, false);
				result.element(MSG, "归档失败");
			}
		}
		sendResult(result);
	}
	
	public void del(){
		JSONObject result = new JSONObject();
		if(StringUtil.isEmpty(ids)){
			result.element(SUCCESS, false);
			result.element(MSG, "请选择需要删除的数据");
		}else{
			if(service.delBySalary(ids)){
				result.element(SUCCESS, true);
				result.element(MSG, "删除成功");
			}else{
				result.element(SUCCESS, false);
				result.element(MSG, "删除失败");
			}
		}
		sendResult(result);
	}
	
	public void delByDetail(){
		JSONObject result = new JSONObject();
		if(StringUtil.isEmpty(ids)){
			result.element(SUCCESS, false);
			result.element(MSG, "请选择需要删除的数据");
		}else{
			if(service.delBySalaryDetail(ids)){
				result.element(SUCCESS, true);
				result.element(MSG, "删除成功");
			}else{
				result.element(SUCCESS, false);
				result.element(MSG, "删除失败");
			}
		}
		sendResult(result);
	}
	
	public void saveByDetail(){
		JSONObject result = new JSONObject();
		if(null == payrollDetailModels){
			result.element(SUCCESS, false);
			result.element(MSG, "保存失败");
			sendResult(result);
			return;
		}
		if(service.updBySalaryDetail(payrollDetailModels)){
			result.element(SUCCESS, true);
			result.element(MSG, "保存成功");
		}else{
			result.element(SUCCESS, false);
			result.element(MSG, "保存失败");
		}
		sendResult(result);
	}
	
	private static String getCellValue(HSSFCell cell){
		String value="";
		DecimalFormat df = new DecimalFormat("######0.0");
		if(cell==null){
			return value;
		}
		try{
			switch(cell.getCellType()){
				case HSSFCell.CELL_TYPE_STRING:
					value = cell.getStringCellValue();
					if(StringUtils.isBlank(value)||StringUtils.isEmpty(value)){
						value = "";
					}
					break;
				case HSSFCell.CELL_TYPE_NUMERIC:
					 df = new DecimalFormat("#");
					if (HSSFDateUtil.isCellDateFormatted(cell)) {
						Date date = cell.getDateCellValue();
						value = DateFormatUtils.format(date, "yyyy-MM-dd");
					} else {
						value = String.valueOf(df.format(cell.getNumericCellValue()));
					}
					break;
				case HSSFCell.CELL_TYPE_BOOLEAN:
					value = ""+ cell.getBooleanCellValue();
					break;
				case HSSFCell.CELL_TYPE_FORMULA:
					try {  
						value = String.valueOf(cell.getStringCellValue());  
					} catch (IllegalStateException e) {  
						value = String.valueOf(df.format(cell.getNumericCellValue()));  
					}
					break;
				default:
					value = String.valueOf(cell.getStringCellValue());
					break;
			}
		}catch(Exception e){
			e.printStackTrace();
			value = "";
		}
		return value;
	}
	
	PayrollService service = PayrollService.getSingle();
	
	String ids;
	PayrollModel payrollModel;
	List<PayrollDetailModel> payrollDetailModels;
	File uploadFile;
	
	public String getIds() {
		return ids;
	}

	public void setIds(String ids) {
		this.ids = ids;
	}

	public PayrollModel getPayrollModel() {
		return payrollModel;
	}

	public void setPayrollModel(PayrollModel payrollModel) {
		this.payrollModel = payrollModel;
	}

	public File getUploadFile() {
		return uploadFile;
	}

	public void setUploadFile(File uploadFile) {
		this.uploadFile = uploadFile;
	}

	public List<PayrollDetailModel> getPayrollDetailModels() {
		return payrollDetailModels;
	}

	public void setPayrollDetailModels(List<PayrollDetailModel> payrollDetailModels) {
		this.payrollDetailModels = payrollDetailModels;
	}
}
