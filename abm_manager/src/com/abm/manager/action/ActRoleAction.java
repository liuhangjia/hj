package com.abm.manager.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.abm.common.act.service.ProcessKey;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.ActRoleEmpModel;
import com.abm.common.model.ActRoleModel;
import com.abm.common.service.ActRoleService;
import com.abm.manager.BaseAction;
import com.mw.common.utils.Common;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONObject;

public class ActRoleAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = 9146444148008542500L;
	
	
	public void findByIds(){
		JSONObject result = new JSONObject();
		if(StringUtil.isNotEmpty(ids)){
			String[] _ids = ids.split(",");
			StringBuffer cond = new StringBuffer();
			for(int i = 0 ; i < _ids.length ; i++){
				cond.append(",'").append(_ids[i]).append("'");
			}
			List<ActRoleModel> datas = roleService.queryByPage(" and id_ in ("+cond.substring(1)+")", null, 1, Integer.MAX_VALUE, "seq_", null, false);
			if(null != datas){
				result.element(ROWS, datas);
			}else{
				result.element(ROWS, "[]");
			}
		}else{
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	public void modify(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if(null != role){
			AccountsModel emp = getSessionEmp();
			if(StringUtil.isEmpty(role.getId_())){
				role.setCreater_id_(emp.getId());
				role.setCreater_name_(emp.getName());
				role.setCreate_time_(Common.now());
				flag = roleService.add(role);
			}else{
				role.setUpdater_id_(emp.getId());
				role.setUpdater_name_(emp.getName());
				role.setUpdater_time_(Common.now());
				flag = roleService.update(role);
			}
			if(flag){
				result.element(MSG, "保存流程角色数据成功");
			}else{
				result.element(MSG, "保存流程角色数据失败");
			}
		}else{
			result.element(MSG, "请输入流程角色信息");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void delete(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if(StringUtil.isNotEmpty(ids)){
			flag = roleService.del(ids.split(","));
			if(flag){
				result.element(MSG, "删除流程角色成功");
			}else{
				result.element(MSG, "删除流程角色失败");
			}
		}else{
			result.element(MSG, "请选择流程角色信息");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void addEmps(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if(null != role && StringUtil.isNotEmpty(role.getId_()) && null != emps && !emps.isEmpty()){
			flag = roleService.addEmps(role.getId_(), emps);
			if(flag){
				result.element(MSG, "增加流程角色人员信息成功");
			}else{
				result.element(MSG, "增加流程角色人员信息失败");
			}
		}else{
			result.element(MSG, "请选择流程角色人员信息");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void delEmps(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if(StringUtil.isNotEmpty(ids)){
			flag = roleService.delEmps(ids.split(","));
			if(flag){
				result.element(MSG, "删除流程角色人员成功");
			}else{
				result.element(MSG, "删除流程角色人员失败");
			}
		}else{
			result.element(MSG, "请选择流程角色信息");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void listEmp(){
		JSONObject result = new JSONObject();
		if(null != role && StringUtil.isNotEmpty(role.getId_())){
			List<ActRoleEmpModel> emps = roleService.listEmpById(role.getId_());
			if(null != emps && !emps.isEmpty()){
				result.element(ROWS, emps);
				result.element(TOTAL, emps.size());
			}else{
				result.element(ROWS, "[]");
				result.element(TOTAL, 0);
			}
		}else{
			result.element(ROWS, "[]");
			result.element(TOTAL, 0);
		}
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
		if(page <= 0){
			page = 1;
		}
		List<ActRoleModel> datas = roleService.queryByPage(condition.toString(), params.toArray(new String[params.size()]), page, rows , "SEQ_", null, false);
		if(null != datas){
			result.element(TOTAL, roleService.getTotal(condition.toString(),params.toArray(new String[params.size()])));
			result.element(ROWS, datas);
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	public void chooseList(){
		JSONObject result = new JSONObject();
		List<ActRoleModel> datas = roleService.queryByPage(null, null, 1, Integer.MAX_VALUE, "seq_", null, false);
		if(null == datas){
			datas = new ArrayList<ActRoleModel>();
		}
		ActRoleModel data = new ActRoleModel();
		data.setId_(ProcessKey.ZSLDSP);
		data.setName_("直属领导审批");
		datas.add(0, data);
		result.element(TOTAL, datas.size());
		result.element(ROWS, datas);
		sendResult(result);
	}
	
	private ActRoleService roleService = ActRoleService.getSingle();
	
	private String ids;
	private ActRoleModel role;
	private List<ActRoleEmpModel> emps;
	public String getIds() {
		return ids;
	}
	public void setIds(String ids) {
		this.ids = ids;
	}
	public ActRoleModel getRole() {
		return role;
	}
	public void setRole(ActRoleModel role) {
		this.role = role;
	}
	public List<ActRoleEmpModel> getEmps() {
		return emps;
	}
	public void setEmps(List<ActRoleEmpModel> emps) {
		this.emps = emps;
	}
	
	
}
