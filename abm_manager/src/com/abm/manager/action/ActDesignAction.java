package com.abm.manager.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.abm.common.model.AccountsModel;
import com.abm.common.model.ActDesignModel;
import com.abm.common.model.SysBaseCodeModel;
import com.abm.common.service.ActDesignService;
import com.abm.common.utils.Cache;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.mw.common.utils.Common;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONObject;

public class ActDesignAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = -6030454308075518123L;
	
	public void modify(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		result.element(SUCCESS, flag);
		if(null != model){
			AccountsModel emp = getSessionEmp();
			if(StringUtil.isEmpty(model.getId_())){
				model.setCreater_id_(emp.getId());
				model.setCreater_name_(emp.getName());
				model.setCreate_time_(Common.now());
				model.setStatus_(Constants.NO);
				if(StringUtil.isEmpty(model.getName_())){
					result.element(MSG, "请输入流程设计名称");
					sendResult(result);
					return;
				}
				if(StringUtil.isEmpty(model.getDesign_())){
					result.element(MSG, "请输入流程设计内容");
					sendResult(result);
					return;
				}
				model.setId_(Common.uuid());
				flag = designService.add(model);
			}else{
				model.setUpdater_id_(emp.getId());
				model.setUpdater_name_(emp.getName());
				model.setUpdater_time_(Common.now());
				model.setStatus_(Constants.NO);
				flag = designService.update(model);
			}
			result.element("id", model.getId_());
			if(flag){
				result.element(MSG, "保存信息成功");
			}else{
				result.element(MSG, "保存信息失败");
			}
		}else{
			result.element(MSG, "流程设计信息为空");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void delete(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if(StringUtil.isNotEmpty(ids)){
			flag = designService.delete(ids.split(","));
			if(flag){
				result.element(MSG, "删除流程设计成功");
			}else{
				result.element(MSG, "删除流程设计失败");
			}
		}else{
			result.element(MSG, "请选择流程设计");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void list(){
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		JSONObject result = new JSONObject();
		int i = 0 ;
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
				if ("key".equals(key)) {
					condition.append(" and key_ like ?");
					params.add("%"+value+"%");
				}
			}
		}
		condition.append(PrivUtil.getConditionForEnterpriseForAct(user, "EMP_WORK_FLOW_LIST"));
		List<ActDesignModel> models = designService.queryByPage(condition.toString(), params.toArray(new String[0]), page, rows, "enterprise_id_,key_", null,true);
		if(null != models && !models.isEmpty()){
			List<SysBaseCodeModel> codes = Cache.findCodeByTypeCode("LC_KEY");
			Map<String,SysBaseCodeModel> _codes = new HashMap<String,SysBaseCodeModel>();
			if(null != codes && !codes.isEmpty()){
				for(i = 0 ; i < codes.size() ; i++){
					SysBaseCodeModel code = codes.get(i);
					_codes.put(code.getCode(), code);
				}
			}
			for(i = 0 ; i < models.size() ; i++){
				if(_codes.containsKey(models.get(i).getKey_())){
					models.get(i).setKey_name_(_codes.get(models.get(i).getKey_()).getName());
				}
			}
//			for(ActDesignModel model:models){
//				SysBaseCodeModel one = SysBaseCodeService.getSingle().findById(model.getKey_());
//				model.setKey_name_(one.getMc());
//			}
			int total = designService.getTotal(condition.toString(),params.toArray(new String[0]));
			result.element(TOTAL, total);
			result.element(ROWS, models);
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	public void findByIdForXml(){
		if(null != model && StringUtil.isNotEmpty(model.getId_())){
			ActDesignModel m = designService.findById(model.getId_());
			sendResult(m.getDesign_());
		}else{
			sendResult("");
		}
	}
	
	private ActDesignService designService = ActDesignService.getSingle();
	
	private String ids;
	private ActDesignModel model;
	public String getIds() {
		return ids;
	}
	public void setIds(String ids) {
		this.ids = ids;
	}
	public ActDesignModel getModel() {
		return model;
	}
	public void setModel(ActDesignModel model) {
		this.model = model;
	}
	

}
