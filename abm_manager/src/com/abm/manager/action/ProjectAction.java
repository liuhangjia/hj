package com.abm.manager.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;

import com.abm.common.dao.EnterpriseDao;
import com.abm.common.dao.ProjectDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.EmployeeModel;
import com.abm.common.model.EnterpriseEmpModel;
import com.abm.common.model.EnterpriseModel;
import com.abm.common.model.ProjectModel;
import com.abm.common.model.SessionPrivModel;
import com.abm.common.service.EnterpriseEmpService;
import com.abm.common.service.ProjectService;
import com.abm.common.utils.AllUtil;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.abm.manager.util.ExcelUtil;
import com.mw.common.utils.Common;
import com.mw.common.utils.StringUtil;


import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 项目管理
 * @author minghuiWang
 * 20181229
 * */
public class ProjectAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = 4987967964172412551L;

	private String qx;
	private File uploadfile;
	
	public void upload(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		result.element(SUCCESS, flag);
		result.element(MSG, "导入失败");
		try {
			if(null == uploadfile){
				result.element(MSG, "找不到文件");
				sendResult(result);
				return;
			}
			AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
			String cond = AllUtil.getEnterpriseIdsCondition(user, "PROJECT_MANAGER_ADD", "ENTERPRISE.id");
			List<EnterpriseModel> list = EnterpriseDao.getSingle().executeQuery(cond);
			Map<String,String> entNameIdMap = new HashMap<String,String>();
			for (EnterpriseModel enterprise : list) {
				entNameIdMap.put(enterprise.getName(), enterprise.getId());
			}
			
			POIFSFileSystem fs = new POIFSFileSystem(new FileInputStream(uploadfile));
			HSSFWorkbook workbook = new HSSFWorkbook(fs);
			HSSFSheet sheet = workbook.getSheetAt(0);
			HSSFRow row = null;
			HSSFCell cell  = null;
			
			List<ProjectModel> projectList = new ArrayList<ProjectModel>();
			for(int i = 1; i<=sheet.getLastRowNum(); i++){
				row = sheet.getRow(i);
				if(null == row){
					continue;
				}
				ProjectModel model = new ProjectModel();
				int c_index = 0;
				
				cell = row.getCell(c_index++);
				String qymc = ExcelUtil.getCellValue(cell);
				if(StringUtil.isEmpty(qymc)){
					result.element(MSG, "第"+(i+1)+"行A列:所属企业不可为空");
					sendResult(result);
					return;
				}
				String qy_id = entNameIdMap.get(qymc);
				if(StringUtil.isEmpty(qy_id)){
					result.element(MSG, "第"+(i+1)+"行A列:该企业不存在于系统中，请填写导入注意sheet页中的企业");
					sendResult(result);
					return;
				}
				
				cell = row.getCell(c_index++);
				String xmmc = ExcelUtil.getCellValue(cell);
				if(StringUtil.isEmpty(xmmc)){
					result.element(MSG, "第"+(i+1)+"行B列:项目名称不可为空");
					sendResult(result);
					return;
				}
				
				cell = row.getCell(c_index++);
				String xmbh = ExcelUtil.getCellValue(cell);
				if(StringUtil.isEmpty(xmbh)){
					result.element(MSG, "第"+(i+1)+"行C列:项目编号不可为空");
					sendResult(result);
					return;
				}
				
				cell = row.getCell(c_index++);
				String lb = ExcelUtil.getCellValue(cell);
				
				cell = row.getCell(c_index++);
				String xmjb = ExcelUtil.getCellValue(cell);
				
				cell = row.getCell(c_index++);
				String xmqy = ExcelUtil.getCellValue(cell);
				
				cell = row.getCell(c_index++);
				String kssj = ExcelUtil.getCellValue(cell);
				
				cell = row.getCell(c_index++);
				String jssj = ExcelUtil.getCellValue(cell);
				
				cell = row.getCell(c_index++);
				String xmzt = ExcelUtil.getCellValue(cell);
				
				cell = row.getCell(c_index++);
				String bz = ExcelUtil.getCellValue(cell);
				
				model.setArea(xmqy);
				model.setBak(bz);
				model.setEnd_time(jssj);
				model.setEnterprise_id(qy_id);
				model.setId(Common.uuid());
				model.setIs_delete(Constants.IS_DELETE_FALSE);
				model.setLevel(xmjb);
				model.setName(xmmc);
				model.setSn(xmbh);
				model.setStart_time(kssj);
				model.setStatus(xmzt);
				model.setType(lb);
				projectList.add(model);
			}
			
			flag = projectService.addList(projectList);
			if(flag){
				result.element(MSG, "导入成功");
			}
			if(flag){
				log("项目导入", "", "1");
			}else{
				log("项目导入", "", "0");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "异常错误");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void downLoadModel(){
		HttpServletResponse response = getResponse();
		try {
			AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
			String cond = AllUtil.getEnterpriseIdsCondition(user, "PROJECT_MANAGER_ADD", "ENTERPRISE.id");
			List<EnterpriseModel> list = EnterpriseDao.getSingle().executeQuery(cond);
			if(null == list || list.isEmpty()){
				try {
					OutputStream out= getResponse().getOutputStream();
					String tips="您没有权限导入项目";
					out.write(tips.getBytes());
					out.flush();
				} catch (Exception e2) {
					e2.printStackTrace();
				}
				return;
			}
//			HSSFWorkbook workbook = ExcelUtil.getWorkBook(request, response, "blank.xls",Common.now().substring(0, 10)+"["+batch.getItem_mc()+"]"+".xls");
			POIFSFileSystem fs = new POIFSFileSystem(new  FileInputStream(getRequest().getServletContext().getRealPath("/")+"/file/project_imp.xls" ));
			HSSFWorkbook workbook = new HSSFWorkbook(fs);
			HSSFSheet sheet = workbook.getSheetAt(1);
			HSSFRow row = null;
			HSSFCell cell  = null;
			
			for (int i = 0; i < list.size(); i++) {
				row = sheet.createRow(i+3);
				cell = row.createCell(0);
				cell.setCellValue(list.get(i).getName());
			}
			
			String fileName = "[项目管理导入模板].xls";
			fileName = new String(fileName.substring(fileName.lastIndexOf("/")+1, fileName.length()).getBytes(),"ISO-8859-1");
			//fileName = URLEncoder.encode(fileName,"UTF-8");
			getResponse().setHeader("Content-Disposition", "attachment;filename=\""+fileName+"\"");
			
			OutputStream out = response.getOutputStream();
			workbook.write(out);
			out.flush();
		} catch (IOException e) {
			e.printStackTrace();
			try {
				OutputStream out= getResponse().getOutputStream();
				String tips="异常错误";
				out.write(tips.getBytes());
				out.flush();
			} catch (Exception e2) {
				e2.printStackTrace();
			}
		}
	}
	
	public void modify(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		boolean isAdd = false;
		if(StringUtil.isEmpty(project.getId())){
			isAdd = true;
		}
		if(null != project){
			AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
			if(StringUtil.isNotEmpty(project.getName())){
				if(StringUtil.isNotEmpty(project.getSn())){
					flag = projectService.modify(project);
					if(flag){
						result.element(MSG, "保存项目成功");
					}else{
						result.element(MSG, "保存项目失败");
					}
				}else{
					result.element(MSG, "请输入项目编号");
				}
			}else{
				result.element(MSG, "请输入项目名称");
			}
		}else{
			result.element(MSG, "请填写项目信息");
		}
		if(isAdd){
			if(flag){
				log("添加项目", "", "1");
			}else{
				log("添加项目", "", "0");
			}
		}else{
			if(flag){
				log("修改项目", "", "1");
			}else{
				log("修改项目", "", "0");
			}
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void delete(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if(StringUtil.isNotEmpty(ids)){
			flag = projectService.delete(ids.split(","));
			if(flag){
				result.element(MSG, "删除项目成功");
			}else{
				result.element(MSG, "删除项目失败");
			}
			if(flag){
				log("删除项目", "", "1");
			}else{
				log("删除项目", "", "0");
			}
		}else{
			result.element(MSG, "请选择项目信息");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void listForCombobox(){
		JSONObject result = new JSONObject();
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);

		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		condition.append(" and project.is_delete='0' ");
		condition.append(AllUtil.getEnterpriseIdsCondition(user, qx, "ENTERPRISE_ID")); 
		
		List<ProjectModel> models = ProjectDao.getSingle().executeQuery(condition.toString(), params.toArray(new String[params.size()]));
		if(null != models && !models.isEmpty()){
			//result.element(TOTAL, projectService.getTotal(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS, JSONArray.fromObject(models));
		}else{
			//result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	public void listForCombobox2(){
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		condition.append(" and project.is_delete='0' ");
		condition.append(AllUtil.getEnterpriseIdsCondition(user, qx, "ENTERPRISE_ID")); 
		
		List<ProjectModel> models = ProjectDao.getSingle().executeQuery(condition.toString(), params.toArray(new String[params.size()]));
		if(null != models && !models.isEmpty()){
			sendResult(JSONArray.fromObject(models));
		}else{
			sendResult("[]");
		}
	}
	
	public void listForCombobox3(){
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		condition.append(" and project.is_delete='0' ");
		if(!StringUtil.eq(user.getAccount(), "admin")){
			EnterpriseEmpModel eem = EnterpriseEmpService.getSingle().getModelByAccountId(user.getId());
			condition.append(" and project.enterprise_id = '"+eem.getEnterprise_id()+"' ");
		}
		List<ProjectModel> models = ProjectDao.getSingle().executeQuery(condition.toString(), params.toArray(new String[params.size()]));
		if(null != models && !models.isEmpty()){
			sendResult(JSONArray.fromObject(models));
		}else{
			sendResult("[]");
		}
	}
	
	public void list(){
		JSONObject result = new JSONObject();
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);

		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		condition.append(" and project.is_delete='0' ");
		
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.isNotEmpty(value)){
					if(StringUtil.eq(key, "name")){
						condition.append(" and project.name like ? ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "type")){
						condition.append(" and project.type like ? ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "start")){
						condition.append(" and project.START_TIME >= str_to_date(?, '%Y-%m-%d') ");
						params.add( value );
					}
					if(StringUtil.eq(key, "end")){
						condition.append(" and project.END_TIME <= str_to_date(?, '%Y-%m-%d') ");
						params.add( value );
					}
					if(StringUtil.eq(key, "status")){
						condition.append(" and project.status like ? ");
						params.add("%" + value + "%");
					}
				}
			}
		}
		
		condition.append(PrivUtil.getConditionForProject(user)); 
		
		List<ProjectModel> models = projectService.queryByPage(condition.toString(), params.toArray(new String[params.size()]), page, rows, "project.sn", null);
		if(null != models && !models.isEmpty()){
			result.element(TOTAL, projectService.getTotal(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS, JSONArray.fromObject(models));
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	private ProjectService projectService = ProjectService.getSingle();
	private String ids;
	private ProjectModel project;
	public String getIds() {
		return ids;
	}
	public void setIds(String ids) {
		this.ids = ids;
	}
	public ProjectModel getProject() {
		return project;
	}
	public void setProject(ProjectModel project) {
		this.project = project;
	}

	public String getQx() {
		return qx;
	}

	public void setQx(String qx) {
		this.qx = qx;
	}

	public File getUploadfile() {
		return uploadfile;
	}

	public void setUploadfile(File uploadfile) {
		this.uploadfile = uploadfile;
	}
	
	
}
