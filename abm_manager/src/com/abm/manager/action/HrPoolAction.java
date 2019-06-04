package com.abm.manager.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.abm.common.model.AccountsModel;
import com.abm.common.model.HrPoolModel;
import com.abm.common.service.HrPoolService;
import com.abm.common.service.SysLogService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONObject;

public class HrPoolAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = -2247562903535449377L;
	
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
					condition.append(" and hr_pool.enterprise_id = ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "name")){
					condition.append(" and hr_pool.emp_name like ? ");
					params.add("%"+conditions.get(key)+"%");
				}
				if(StringUtil.eq(key, "cadre1")){
					condition.append(" and hr_pool.in_time >= ? ");
					params.add(conditions.get(key));
				}
				if(StringUtil.eq(key, "cadre2")){
					condition.append(" and hr_pool.in_time <= ? ");
					params.add(conditions.get(key));
				}
			}
		}
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(currentUser, "HR_POOL_LIST"));
		List<HrPoolModel> list = service.queryByPage(condition.toString(), params.toArray(new String[params.size()]), 1, Integer.MAX_VALUE, order, null);
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
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_HRPOOL, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "删除成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_HRPOOL, null, Constants.SysLog.RESULT_FAIL);
				result.element(SUCCESS, false);
				result.element(MSG, "删除失败");
			}
		}
		sendResult(result);
	}
	
	public void modify(){
		JSONObject result = new JSONObject();
		result.element(SUCCESS, false);
		if(null==hrPoolModel){
			result.element(MSG, "数据对象不存在");
			sendResult(result);
			return;
		}
		if(StringUtil.isEmpty(hrPoolModel.getId())){
			if(service.addItem(hrPoolModel)){
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_HRPOOL, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "添加成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_HRPOOL, null, Constants.SysLog.RESULT_FAIL);
				result.element(MSG, "添加失败");
			}
		}else{
			if(service.updItem(hrPoolModel)){
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_HRPOOL, null, Constants.SysLog.RESULT_SUCCESS);
				result.element(SUCCESS, true);
				result.element(MSG, "修改成功");
			}else{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_HRPOOL, null, Constants.SysLog.RESULT_FAIL);
				result.element(MSG, "修改失败");
			}
		}
		sendResult(result);
	}
	
	private String ids;
	private HrPoolModel hrPoolModel;
	
	public String getIds() {
		return ids;
	}

	public void setIds(String ids) {
		this.ids = ids;
	}

	public HrPoolModel getHrPoolModel() {
		return hrPoolModel;
	}

	public void setHrPoolModel(HrPoolModel hrPoolModel) {
		this.hrPoolModel = hrPoolModel;
	}

	private HrPoolService service = HrPoolService.getSingle();
}
