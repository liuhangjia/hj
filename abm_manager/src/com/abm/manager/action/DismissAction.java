package com.abm.manager.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.runtime.ProcessInstance;

import com.abm.common.act.service.ActWorkflowService;
import com.abm.common.act.service.ProcessKey;
import com.abm.common.dao.DismissDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.DismissModel;
import com.abm.common.model.EmployeeModel;
import com.abm.common.service.DismissService;
import com.abm.common.service.SysLogService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONObject;

public class DismissAction extends BaseAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7830635170458965953L;

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
					condition.append(" and dismiss.enterprise_id = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "name")){
					condition.append(" and dismiss.name like ? ");
					params.add("%"+conditions.get(key)+"%");
				}
				if(StringUtil.eq(key, "quit1")){
					condition.append(" and dismiss.dismiss_time >= ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "quit2")){
					condition.append(" and dismiss.dismiss_time <= ? ");
					params.add(conditions.get(key));
				}
			}
		}
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(currentUser, "DISMISS_MANAGER_LIST"));
		List<DismissModel> list = service.queryByPage(condition.toString(), params.toArray(new String[params.size()]), 1, Integer.MAX_VALUE, order, null);
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
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_QUIT, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "删除成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_QUIT, null, Constants.SysLog.RESULT_FAIL);
				result.element(SUCCESS, false);
				result.element(MSG, "删除失败");
			}
		}
		sendResult(result);
	}
	
	public void modify(){
		JSONObject result = new JSONObject();
		result.element(SUCCESS, false);
		if(null==dismissModel){
			result.element(MSG, "数据对象不存在");
			sendResult(result);
			return;
		}
		if(StringUtil.isEmpty(dismissModel.getId())){
			dismissModel.setStatus(String.valueOf(Constants.SP_INIT));
			if(service.addItem(dismissModel)){
				/***/
				AccountsModel account = (AccountsModel)getSession().getAttribute(Constants.USER);
				EmployeeModel emp = account.getEmployee();
				String empName = "";
				if(null!=emp && StringUtil.isNotEmpty(emp.getName())){
					empName = emp.getName();
				}
				String processKey = ProcessKey.QUIT_EMP + "-" + dismissModel.getEnterprise_id();
				String businessKey = processKey+"."+dismissModel.getId();
				Map<String,Object> vars = new HashMap<String,Object>();
				vars.put(ProcessKey.APPLY_USER_ID, account.getId());
				vars.put(ProcessKey.APPLY_USER_NAME, account.getAccount());
				vars.put(ProcessKey.BUSINESS_KEY, businessKey);
				vars.put(ProcessKey.BUSINESS_NAME, account.getAccount()+"为"+dismissModel.getName()+"申请离职");
				
				ProcessInstance pi = ActWorkflowService.getSingle().startProcessInstanceByKey(processKey, dismissModel.getId(), vars , account.getId(), account.getAccount(), empName, "");
				if(null != pi){
					result.element(SUCCESS, true);
					result.element(MSG, "申请离职成功");
					sendResult(result);
				}else{
					result.element(MSG, "申请离职失败");
					//service.del(vacationModel.getId());
					sendResult(result);
				}
			
				/***/
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_QUIT, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "添加成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_QUIT, null, Constants.SysLog.RESULT_FAIL);
				result.element(MSG, "添加失败");
			}
		}else{
			if(service.updItem(dismissModel)){
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_QUIT, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "修改成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_QUIT, null, Constants.SysLog.RESULT_FAIL);
				result.element(MSG, "修改失败");
			}
		}
		sendResult(result);
	}
	
	public void findById(){
		JSONObject result = new JSONObject();
		if(null!=dismissModel && StringUtil.isNotEmpty(dismissModel.getId())){
			DismissModel data = DismissDao.getSingle().executeQueryById(dismissModel.getId());
			if(null!=data){
				result.element(DATA, data);
				result.element(SUCCESS, true);
			}
		}
		sendResult(result);
	}
	
	private String ids;
	private DismissModel dismissModel;

	public String getIds() {
		return ids;
	}

	public void setIds(String ids) {
		this.ids = ids;
	}
	
	public DismissModel getDismissModel() {
		return dismissModel;
	}

	public void setDismissModel(DismissModel dismissModel) {
		this.dismissModel = dismissModel;
	}

	private DismissService service = DismissService.getSingle();
}
