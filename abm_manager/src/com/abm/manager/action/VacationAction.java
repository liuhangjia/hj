package com.abm.manager.action;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

import com.abm.common.dao.VacationDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.DepartModel;
import com.abm.common.model.EmployeeModel;
import com.abm.common.model.EnterpriseModel;
import com.abm.common.model.ProjectModel;
import com.abm.common.model.VacationModel;
import com.abm.common.service.DepartService;
import com.abm.common.service.EmployeeService;
import com.abm.common.service.EnterpriseService;
import com.abm.common.service.ProjectService;
import com.abm.common.service.SysLogService;
import com.abm.common.service.VacationService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.abm.manager.util.ExcelUtil;
import com.mw.common.utils.Common;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONObject;

public class VacationAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = -662584169342381911L;
	
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
//				if(StringUtil.eq(key, "ename")){
//					List<EnterpriseModel> elist = EnterpriseService.getSingle().list(conditions.get(key));
//					if(null == elist || elist.isEmpty()){
//						condition.append(" and 1 = 0 ");
//					}else{
//						condition.append(" and enterprise_id in (");
//						for (int i = 0; i < elist.size(); i++) {
//							if(i==elist.size()-1){
//								condition.append(elist.get(i).getId()+")");
//							}else{
//								condition.append(elist.get(i).getId()+",");
//							}
//						}
//					}
//				}
				if(StringUtil.eq(key, "enterprise_id")){
					condition.append(" and enterprise_id = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "project_id")){
					condition.append(" and project_id = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "type")){
					condition.append(" and type = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "is_back")){
					condition.append(" and is_back = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "status")){
					condition.append(" and status = ? ");
					params.add(conditions.get(key));
				}
			}
		}
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(currentUser, "VACATION_MANAGER_LIST"));
		List<VacationModel> list = service.queryByPage(condition.toString(), params.toArray(new String[params.size()]), 1, Integer.MAX_VALUE, "vacation.start_time", "desc");
		if(null!=list && !list.isEmpty()){
			Set<String> pIds = new HashSet<String>();
			for (VacationModel v:list) {
				pIds.add(v.getProject_id());
			}
			Map<String, String> _map = ProjectService.getSingle().listByIds(pIds);
			for (int i = 0; i < list.size(); i++) {
				VacationModel v = list.get(i);
				v.setProject_name(_map.get(v.getProject_id()));
			}
			result.element(TOTAL,service.getTotal(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS,list);
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	/**
	 * 批量上传请假信息(补录)
	 */
	public void importData(){
		JSONObject result = new JSONObject();
		result.element(SUCCESS, false);
		if(null != uploadFile){
			try{
				POIFSFileSystem fs = new POIFSFileSystem(new FileInputStream(uploadFile));
				HSSFWorkbook workbook = new HSSFWorkbook(fs);
				HSSFSheet sheet = workbook.getSheetAt(0);
				int start_row = 4;
				HSSFRow row = sheet.getRow(1);
				HSSFCell cell  = row.getCell(1);
				//企业
				if(StringUtil.isEmpty(cell.getStringCellValue())){
					result.element(MSG, "请填写企业");
					sendResult(result);
					return;
				}
				List<EnterpriseModel> enList = EnterpriseService.getSingle().list(cell.getStringCellValue());
				if(null==enList || enList.isEmpty()){
					result.element(MSG, "企业不存在");
					sendResult(result);
					return;
				}
				EnterpriseModel enterpriseModel = enList.get(0);
				Map<String, String> depMap = new HashMap<String, String>();
				List<DepartModel> depList = DepartService.getSingle().list(enterpriseModel.getId());
				if(null!=depList && !depList.isEmpty()){
					for (DepartModel m:depList) {
						depMap.put(m.getName(), m.getId());
					}
				}
				//项目
				row = sheet.getRow(2);
				cell = row.getCell(1);
				ProjectModel projectModel = null;
				if(StringUtil.isNotEmpty(cell.getStringCellValue())){
					List<ProjectModel> prList = ProjectService.getSingle().list(enterpriseModel.getId(),cell.getStringCellValue());
					if(null!=prList && prList.size()>0){
						projectModel = prList.get(0);
					}
				}
				
				if(null==projectModel){
					result.element(MSG, "项目不存在");
					sendResult(result);
					return;
				}
				
				List<VacationModel> vList = new ArrayList<VacationModel>();
				String message = "";
				boolean ifUpload = true;
				for (int i = start_row; i <= sheet.getLastRowNum(); i++) {
					row = sheet.getRow(i);
					if(null==row){
//						message += "第"+(i+1)+"行为空";
						continue;
					}
					VacationModel vModel = new VacationModel();
					vModel.setEnterprise_id(enterpriseModel.getId());
					vModel.setProject_id(projectModel.getId());
					for (int j = 0; j < 11; j++) {
						cell = row.getCell(j);
						if(null == cell){
							if(j==0 || j==1){
								message += "第"+(i+1)+"行，姓名和账号不能为空";
								ifUpload = false;
							}
							continue;
						}
						String cStr = "";
						if(j==1 || j==5 || j==7 || j==11){
							cStr = ExcelUtil.getCellStringValue(cell);
						}else{
							cStr = cell.getStringCellValue();
						}
						
						if(StringUtil.isEmpty(cStr)){
							if(j==0 || j==1){
								message += "第"+(i+1)+"行，姓名和账号不能为空";
								ifUpload = false;
							}
							continue;
						}
						
						if(j==0){
							//姓名
							vModel.setEnterprise_emp_name(cStr);
						}else if(j==1){
							//账号
							List<EmployeeModel> findEmployees = EmployeeService.getSingle().findByAccountAndName(cStr,vModel.getEnterprise_emp_name());
							if(null == findEmployees || findEmployees.isEmpty()){
								ifUpload = false;
								message += "第"+(i+1)+"行请假人查询结果为空";
							}else if(findEmployees.size()>1){
								ifUpload = false;
								message += "第"+(i+1)+"行请假人查询结果不唯一";
							}else{
								vModel.setEnterprise_emp_id(findEmployees.get(0).getId());
							}
						}else if(j==2){
							//部门
							if(StringUtil.isEmpty(depMap.get(cStr))){
								ifUpload = false;
								message += "第"+(i+1)+"行部门不存在";
							}else{
								vModel.setDepart_name(cStr);
								vModel.setDepart_id(depMap.get(cStr));
							}
						}else if(j==3){
							//职务
							vModel.setPosition(cStr);
						}else if(j==4){
							//请假类别
							if(StringUtil.eq("病假", cStr)){
								vModel.setType("0");
							}else if(StringUtil.eq("事假", cStr)){
								vModel.setType("1");
							}
						}else if(j==5){
							//请假时间
							vModel.setStart_time(cStr);
						}else if(j==6){
							//是否销假
							if(StringUtil.eq("否", cStr)){
								vModel.setIs_back("0");
							}else if(StringUtil.eq("是", cStr)){
								vModel.setIs_back("1");
							}
						}else if(j==7){
							//销假时间
							vModel.setEnd_time(cStr);
						}else if(j==8){
							//请假事由
							vModel.setReason(cStr);
						}else if(j==9){
							//审批状态
							if(StringUtil.eq("审批新建", cStr)){
								vModel.setStatus("0");
							}else if(StringUtil.eq("审批中", cStr)){
								vModel.setStatus("1");
							}else if(StringUtil.eq("审批拿回", cStr)){
								vModel.setStatus("2");
							}else if(StringUtil.eq("审批通过", cStr)){
								vModel.setStatus("3");
							}else if(StringUtil.eq("审批拒绝", cStr)){
								vModel.setStatus("4");
							}else if(StringUtil.eq("审批结束", cStr)){
								vModel.setStatus("5");
							}
						}else if(j==10){
							//审批人
							vModel.setApproval_name(cStr);
						}else if(j==11){
							//审批时间
							vModel.setApproval_time(cStr);
						}
					}
					vModel.setId(Common.uuid());
					//重复检验
					int checkStatus = VacationService.getSingle().checkHave(vModel);
					if(checkStatus > 0){
						ifUpload = false;
						message += "第"+(i+1)+"行请假数据重复导入";
					}else if(checkStatus == -1){
						ifUpload = false;
						message += "请完善第"+(i+1)+"行请假人和请假时间信息";
					}
					vList.add(vModel);
				}
				if(ifUpload){
					if(service.addList(vList)){
						result.element(MSG, "上传成功");
						result.element(SUCCESS, true);
					}else{
						result.element(MSG, "上传失败");
					}
				}else{
					result.element(MSG, message);
				}
				
			}catch(Exception e){
				result.element(MSG, "异常错误");
				e.printStackTrace();
			}
		}else{
			result.element(MSG, "请选择上传文件");
		}
		sendResult(result);
		
	}
	
	public void modify(){
		JSONObject result = new JSONObject();
		result.element(SUCCESS, false);
		if(null==vacationModel){
			result.element(MSG, "数据对象不存在");
			sendResult(result);
			return;
		}
		if(StringUtil.isEmpty(vacationModel.getIs_back())){
			vacationModel.setIs_back("0");
		}
		if(StringUtil.isEmpty(vacationModel.getId())){
			if(service.addItem(vacationModel)){
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_VACATION, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "添加成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_VACATION, null, Constants.SysLog.RESULT_FAIL);
				result.element(MSG, "添加失败");
			}
		}else{
			if(service.upd(vacationModel)){
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_VACATION, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "修改成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_VACATION, null, Constants.SysLog.RESULT_FAIL);
				result.element(MSG, "修改失败");
			}
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
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_VACATION, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "删除成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_VACATION, null, Constants.SysLog.RESULT_FAIL);
				result.element(SUCCESS, false);
				result.element(MSG, "删除失败");
			}
		}
		sendResult(result);
	}
	
	public void findById(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if(null != vacationModel && StringUtil.isNotEmpty(vacationModel.getId())){
			VacationModel model = service.findById(vacationModel.getId());
			if(null != model){
				flag = true;
				result.element(DATA, JSONObject.fromObject(model));
			}else{
				result.element(MSG, "请假单信息不存在");
			}
		}else{
			result.element(MSG, "请选择请假单信息");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	
	private String ids;
	private File uploadFile;
	private VacationModel vacationModel;

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

	public VacationModel getVacationModel() {
		return vacationModel;
	}

	public void setVacationModel(VacationModel vacationModel) {
		this.vacationModel = vacationModel;
	}


	private VacationService service = VacationService.getSingle();
}
