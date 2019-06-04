package com.abm.manager.action;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

import com.abm.common.model.AccountsModel;
import com.abm.common.model.AppointModel;
import com.abm.common.model.DepartModel;
import com.abm.common.model.EmployeeModel;
import com.abm.common.model.EnterpriseModel;
import com.abm.common.model.ProjectModel;
import com.abm.common.model.VacationModel;
import com.abm.common.service.AppointService;
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

public class PatronageAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = 7556873910604973978L;
	
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
					condition.append(" and appoint.enterprise_id = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "name")){
					condition.append(" and appoint.name like ? ");
					params.add("%"+conditions.get(key)+"%");
				}
				if(StringUtil.eq(key, "sn")){
					condition.append(" and appoint.sn = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "appoint1")){
					condition.append(" and appoint.appoint_time >= ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "appoint2")){
					condition.append(" and appoint.appoint_time <= ? ");
					params.add(conditions.get(key));
				}
			}
		}
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(currentUser, "APPOINT_MANAGER_LIST"));
		List<AppointModel> list = service.queryByPage(condition.toString(), params.toArray(new String[params.size()]), 1, Integer.MAX_VALUE, " appoint.appoint_time ", " desc ");
		if(null!=list && !list.isEmpty()){
			result.element(TOTAL,service.getTotal(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS,list);
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
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
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_PATRONAGE, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "删除成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_PATRONAGE, null, Constants.SysLog.RESULT_FAIL);
				result.element(SUCCESS, false);
				result.element(MSG, "删除失败");
			}
		}
		sendResult(result);
	}
	
	public void modify(){
		JSONObject result = new JSONObject();
		result.element(SUCCESS, false);
		if(null==patronageModel){
			result.element(MSG, "数据对象不存在");
			sendResult(result);
			return;
		}
		if(StringUtil.isEmpty(patronageModel.getId())){
			if(service.addItem(patronageModel)){
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_PATRONAGE, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "添加成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_PATRONAGE, null, Constants.SysLog.RESULT_FAIL);
				result.element(MSG, "添加失败");
			}
		}else{
			if(service.updItem(patronageModel)){
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_PATRONAGE, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "修改成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_PATRONAGE, null, Constants.SysLog.RESULT_FAIL);
				result.element(MSG, "修改失败");
			}
		}
		sendResult(result);
	}
	
	/**
	 * 任免信息批量上传
	 */
	public void importData(){
		JSONObject result = new JSONObject();
		result.element(SUCCESS, false);
		if(null != uploadFile){
			try{
				POIFSFileSystem fs = new POIFSFileSystem(new FileInputStream(uploadFile));
				HSSFWorkbook workbook = new HSSFWorkbook(fs);
				HSSFSheet sheet = workbook.getSheetAt(0);
				int start_row = 3;
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
				List<DepartModel> depList = DepartService.getSingle().list(enterpriseModel.getId());
				Map<String,String> depMap = new HashMap<String,String>();
				if(null!=depList && !depList.isEmpty()){
					for (DepartModel m:depList) {
						depMap.put(m.getName(), m.getId());
					}
				}
				List<AppointModel> aList = new ArrayList<AppointModel>();
				String message = "";
				boolean ifUpload = true;
				for (int i = start_row; i <= sheet.getLastRowNum(); i++) {
					row = sheet.getRow(i);
					if(null==row){
						continue;
					}
					AppointModel aModel = new AppointModel();
					aModel.setEnterprise_id(enterpriseModel.getId());
					for (int j = 0; j < 11; j++) {
						cell = row.getCell(j);
						if(null == cell){
//							message += "第"+(i+1)+"行，"+(j+1)+"列为空";
							if(j==0 || j==1){
								message += "第"+(i+1)+"行，姓名和账号不能为空";
								ifUpload = false;
							}
							continue;
						}
						String cStr = "";
						if(j==5){
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
							aModel.setName(cStr);
						}else if(j==1){
							//账号
							List<EmployeeModel> findEmployees = EmployeeService.getSingle().findByAccountAndName(cStr,aModel.getName());
							if(null == findEmployees || findEmployees.isEmpty()){
								ifUpload = false;
								message += "第"+(i+1)+"行人员查询结果为空";
							}else if(findEmployees.size()>1){
								ifUpload = false;
								message += "第"+(i+1)+"行人员查询结果不唯一";
							}else{
								aModel.setEmp_id(findEmployees.get(0).getId());
							}
						}else if(j==2){
							//部门
							aModel.setDepart_name(cStr);
							if(StringUtil.isNotEmpty(depMap.get(cStr))){
								aModel.setDepart_id(depMap.get(cStr));
							}else{
								ifUpload = false;
								message += "第"+(i+1)+"行部门不存在";
							}
						}else if(j==3){
							//职务
							aModel.setPosition(cStr);
						}else if(j==4){
							//任免批号
							aModel.setSn(cStr);
						}else if(j==5){
							//任免时间
							aModel.setAppoint_time(cStr);
						}else if(j==6){
							//任免说明
							aModel.setBak(cStr);
						}
							
					}
					aModel.setId(Common.uuid());
					aList.add(aModel);
				}
				if(ifUpload){
					if(service.addList(aList)){
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
	
	private String ids;
	private File uploadFile;
	private AppointModel patronageModel;
	
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

	public AppointModel getPatronageModel() {
		return patronageModel;
	}

	public void setPatronageModel(AppointModel patronageModel) {
		this.patronageModel = patronageModel;
	}

	private AppointService service = AppointService.getSingle();
}
