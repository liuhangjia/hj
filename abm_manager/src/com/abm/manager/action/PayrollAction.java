package com.abm.manager.action;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Workbook;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.abm.common.dao.PayrollTemplateDao;
import com.abm.common.dao.PayrollTemplateItemDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.PayrollModel;
import com.abm.common.model.PayrollTemplateItemModel;
import com.abm.common.model.PayrollTemplateModel;
import com.abm.common.service.PayrollService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.abm.manager.util.ExcelModelUtil;
import com.abm.manager.util.FileIOUtil;
import com.mw.common.utils.Common;
import com.mw.common.utils.StringUtil;

public class PayrollAction extends BaseAction{

	public void listByMb(){
		JSONObject result = new JSONObject();
		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				if(StringUtil.isEmpty(conditions.get(key))){
					continue;
				}
				if(StringUtil.eq(key, "name")){
					condition.append(" and payroll_template.name like ? ");
					params.add("%"+conditions.get(key)+"%");
				}
			}
		}
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(currentUser, "SYS_PAYROLL_TEMPLATE_LIST"));
		List<PayrollTemplateModel> list = service.queryByPage(condition.toString(), params.toArray(new String[params.size()]), 1, Integer.MAX_VALUE, " payroll_template.create_time ", " desc ");
		if(null!=list && !list.isEmpty()){
			result.element(TOTAL,service.getTotal(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS,list);
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	public void listByKm(){
		JSONObject result = new JSONObject();
		List<PayrollTemplateItemModel> models = PayrollTemplateItemDao.getSingle().executeQuery(" and payroll_template_item.template_id = ? order by seq asc", new String[]{ids});
		if (null != models && models.size() > 0) {
			result.element(TOTAL, models.size());
			result.element(ROWS, models);
		} else {
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	public void listByModel(){
		JSONArray array = new JSONArray();
		if(StringUtil.isNotEmpty(ids)){
			List<PayrollTemplateModel> models = PayrollTemplateDao.getSingle().executeQuery(" and payroll_template.enterprise_id = ? ", new String[]{ids});
			if(null != models && !models.isEmpty()){
				array = JSONArray.fromObject(models);
			}
		}
		sendResult(array);
	}
	
	public void delByMb(){
		JSONObject result = new JSONObject();
		if(StringUtil.isEmpty(ids)){
			result.element(SUCCESS, false);
			result.element(MSG, "请选择需要删除的数据");
		}else{
			if(service.delByMb(ids)){
				result.element(SUCCESS, true);
				result.element(MSG, "删除成功");
			}else{
				result.element(SUCCESS, false);
				result.element(MSG, "删除失败");
			}
		}
		sendResult(result);
	}
	
	public void importModel(){
		JSONObject result = new JSONObject();
		if(null != uploadFile){
			Workbook wk = ExcelModelUtil.openExcel(uploadFile);
			String json = ExcelModelUtil.convertExcelToJSON(wk);
			JSONObject obj = JSONObject.fromObject(json);
			JSONArray arr = obj.optJSONArray("data");
			result.element(SUCCESS, true);
			result.element(DATA, arr.toString());
			sendResult(result);
			return;
		}
		result.element(SUCCESS, false);
		sendResult(result);
	}
	
	public void save(){
		JSONObject result = new JSONObject();
		if(null == templateModel || StringUtil.isEmpty(templateModel.getId())){
			if(null == uploadFile){
				result.element(SUCCESS, false);
				result.element(MSG, "保存失败");
				sendResult(result);
				return;
			}
		}
		if(null == items && items.size() <= 0){
			result.element(SUCCESS, false);
			result.element(MSG, "保存失败");
			sendResult(result);
			return;
		}
		try {
			if(null != templateModel){
				String filePath = FileIOUtil.uploadFile(uploadFile, Common.uuid(), false);
				templateModel.setAttachment(filePath);
				if(null == templateModel.getId() || StringUtil.isEmpty(templateModel.getId())){
					templateModel.setCreator_id(getSessionEmp().getId());
					templateModel.setCreator_name(getSessionEmp().getName());
					templateModel.setCreate_time(Common.now());
				}
				if(service.saveByTemplate(templateModel, items)){
					
					result.element(SUCCESS, true);
					result.element(MSG, "保存成功");
					sendResult(result);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		result.element(SUCCESS, false);
		result.element(MSG, "保存失败");
		sendResult(result);
	}
	
	private static final long serialVersionUID = 1L;
	
	
	private static PayrollService service = PayrollService.getSingle();
	
	private String ids;
	private PayrollTemplateModel templateModel;
	private PayrollModel payrollModel;
	private List<PayrollTemplateItemModel> items;
	private File uploadFile;

	public String getIds() {
		return ids;
	}

	public void setIds(String ids) {
		this.ids = ids;
	}

	public PayrollTemplateModel getTemplateModel() {
		return templateModel;
	}

	public void setTemplateModel(PayrollTemplateModel templateModel) {
		this.templateModel = templateModel;
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

	public List<PayrollTemplateItemModel> getItems() {
		return items;
	}

	public void setItems(List<PayrollTemplateItemModel> items) {
		this.items = items;
	}

}
