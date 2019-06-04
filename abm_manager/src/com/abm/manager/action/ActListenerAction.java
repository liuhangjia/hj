package com.abm.manager.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.abm.common.model.ActListenerModel;
import com.abm.common.service.ActListenerService;
import com.abm.manager.BaseAction;
import com.mw.common.utils.Common;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONObject;

public class ActListenerAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = -3359543040015404809L;
	
	public void modify(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if(null != model){
			if(StringUtil.isEmpty(model.getId_())){
				model.setId_(Common.uuid());
				flag = listenerService.add(model);
			}else{
				flag = listenerService.update(model);
			}
			if(flag){
				result.element(MSG, "保存数据成功");
			}else{
				result.element(MSG, "保存数据失败");
			}
		}else{
			result.element(MSG, "流程监听信息为空");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void delete(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if(StringUtil.isNotEmpty(ids)){
			flag = listenerService.delete(ids.split(","));
			if(flag){
				result.element(MSG, "删除数据成功");
			}else{
				result.element(MSG, "删除数据失败");
			}
		}else{
			result.element(MSG, "请选择");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void list(){
		JSONObject result = new JSONObject();
		StringBuffer condition = new StringBuffer();
		Map<String, String> conditions = parseCondition();
		List<String> params = new ArrayList<String>();
		for (String key : conditions.keySet()) {
			String value = conditions.get(key);
			if (value != null && value.trim().length() > 0) {
				if ("name".equals(key)) {
					condition.append(" and name_ like ? ");
					params.add("%"+value+"%");
				}
			}
		}
		if(null != model){
			if(StringUtil.isNotEmpty(model.getGroup_())){
				condition.append(" and group_ = ? ");
				params.add(model.getGroup_());
			}
		}
		List<ActListenerModel> models = listenerService.queryByPage(condition.toString(), params.toArray(new String[0]), page, rows, "GROUP_", null);
		if(null != models && !models.isEmpty()){
			int total = listenerService.getTotal(condition.toString(),params.toArray(new String[0]));
			result.element(TOTAL, total);
			result.element(ROWS, models);
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	private ActListenerService listenerService = ActListenerService.getSingle();
	
	private ActListenerModel model;
	private String ids;
	public ActListenerModel getModel() {
		return model;
	}
	public void setModel(ActListenerModel model) {
		this.model = model;
	}
	public String getIds() {
		return ids;
	}
	public void setIds(String ids) {
		this.ids = ids;
	}
	

}
