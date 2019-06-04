package com.abm.manager.action;

import com.abm.common.dao.ProjectCheckingItemDao;
import com.abm.common.model.ProjectCheckingItemModel;
import com.abm.manager.BaseAction;
import com.mw.common.utils.Common;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONObject;

public class ProjectCheckingItemAction extends BaseAction{

	private String param;
	private String ids;
	
	public void delete(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "删除失败");
		try {
			if(StringUtil.isEmpty(ids)){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			
			String[] ss = ids.split(",");
			if(null == ss || ss.length==0){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			
			flag = ProjectCheckingItemDao.getSingle().delete(ss);
			if(flag){
				result.element(MSG, "删除成功");
				//log(Constants.SysLog.TYPE_DELETE_PROJECTCHECKING, "", Constants.SysLog.RESULT_SUCCESS);
			}else{
				//log(Constants.SysLog.TYPE_DELETE_PROJECTCHECKING, "", Constants.SysLog.RESULT_SUCCESS);
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}

	
	public void modify(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "保存失败");
		try {
			if(StringUtil.isEmpty(param)){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			JSONObject param_json=null;
			try {
				param_json=JSONObject.fromObject(param);
			} catch (Exception e) {
				e.printStackTrace();
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			
			if(StringUtil.isEmpty(param_json.optString("project_checking_id"))){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			
			ProjectCheckingItemModel model = (ProjectCheckingItemModel) JSONObject.toBean(param_json, ProjectCheckingItemModel.class);
			if(StringUtil.isEmpty(model.getId())){
				model.setId(Common.uuid());
				flag = ProjectCheckingItemDao.getSingle().add(model);
			}else{
				flag = ProjectCheckingItemDao.getSingle().update(model, false);
			}
			
			if(flag){
				result.element(MSG, "保存成功");
				//SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ROLE_PRIV, "", Constants.SysLog.RESULT_SUCCESS);
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}

	public String getParam() {
		return param;
	}

	public void setParam(String param) {
		this.param = param;
	}


	public String getIds() {
		return ids;
	}


	public void setIds(String ids) {
		this.ids = ids;
	}
	
}
