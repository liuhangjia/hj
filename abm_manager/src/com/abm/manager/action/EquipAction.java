package com.abm.manager.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.abm.common.dao.EnterpriseDao;
import com.abm.common.dao.EnterpriseEmpDao;
import com.abm.common.dao.EquipDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.EmployeeModel;
import com.abm.common.model.EnterpriseEmpModel;
import com.abm.common.model.EnterpriseModel;
import com.abm.common.model.EquipModel;
import com.abm.common.model.EquipUsedModel;
import com.abm.common.service.EquipService;
import com.abm.common.utils.AllUtil;
import com.abm.common.utils.Constants;

import com.abm.manager.BaseAction;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class EquipAction extends BaseAction{
	
	private EquipUsedModel equipUsed;
	private EquipModel equip;
	private String param;
	private String lb;
	private String ids;
	private String project_id;
	
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
			if(null==ss || ss.length==0){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			flag = EquipService.getSingle().delete(ss);
			if(flag){
				result.element(MSG, "删除成功");
			}
			if(flag){
				log("装备删除", "", "1");
			}else{
				log("装备删除", "", "0");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void guihuan(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "归还失败");
		try {
			if(null==equipUsed){
				result.element(MSG, "找不到借用信息");
				sendResult(result);
				return;
			}
			
			flag=EquipService.getSingle().guihuan(equipUsed);
			if(flag){
				result.element(MSG, "归还成功");
			}
			if(flag){
				log("归还装备", "", "1");
			}else{
				log("归还装备", "", "0");
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
			if(null==equip ){
				result.element(MSG, "请填写信息");
				sendResult(result);
				return;
			}
			if(StringUtil.isEmpty(equip.getEnterprise_id())){
				result.element(MSG, "企业信息找不到");
				sendResult(result);
				return;
			}
			boolean isAdd = false;
			if(StringUtil.isEmpty(equip.getId())){
				isAdd = true;
			}
			flag=EquipService.getSingle().modify(equip);
			if(flag){
				result.element(MSG, "保存成功");
			}
			if(isAdd){
				if(flag){
					log("增加装备", "", "1");
				}else{
					log("增加装备", "", "0");
				}
			}else{
				if(flag){
					log("修改装备", "", "1");
				}else{
					log("修改装备", "", "0");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void outWarehouse(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "记录失败");
		try {
			if(null==equipUsed || StringUtil.isEmpty(equipUsed.getEquip_id())){
				result.element(MSG, "找不到装备信息");
				sendResult(result);
				return;
			}
			
			flag=EquipService.getSingle().outWarehouse(equipUsed);
			if(flag){
				result.element(MSG, "记录成功");
			}
			if(flag){
				log("借用装备", "", "1");
			}else{
				log("借用装备", "", "0");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void listForSelect(){
		JSONObject result = new JSONObject();
		result.element(TOTAL, 0);
		result.element(ROWS, "[]");
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		EmployeeModel employee = user.getEmployee();
		if(null!=employee){
			List<EnterpriseEmpModel> enterpriseManagers = EnterpriseEmpDao.getSingle().executeQuery(" and status = '1' and is_enterprise_admin = '1' and emp_id = ?",new String[]{employee.getId()});
			if(null!=enterpriseManagers && !enterpriseManagers.isEmpty()){
				EnterpriseEmpModel enterpriseEmp = enterpriseManagers.get(0);
				StringBuffer condition = new StringBuffer();
				List<String> params = new ArrayList<String>();
				
				condition.append(" and ENTERPRISE_ID=? ");
				params.add(enterpriseEmp.getEnterprise_id());
				
				List<EquipModel> list=EquipDao.getSingle().queryByPage(condition.toString(), params.toArray(new String[0]), page, rows, " equip.name ", " asc ");
				if(null!=list && !list.isEmpty()){
					EnterpriseModel enterprise = EnterpriseDao.getSingle().executeQueryById(list.get(0).getEnterprise_id());
					if(null!=enterprise){
						for (EquipModel equipModel : list) {
							equipModel.setEnterprise_name(enterprise.getName());
						}
					}
					int total=EquipDao.getSingle().getTotal(condition.toString(), params.toArray(new String[0]));
					result.element(TOTAL, total);
					result.element(ROWS, JSONArray.fromObject(list));
				}
			}
		}
		sendResult(result);
	}
	
	public void list(){
		JSONObject result = new JSONObject();
		result.element(TOTAL, 0);
		result.element(ROWS, "[]");
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		
		condition.append(" and equip.is_delete='0' ");
		if(StringUtil.isNotEmpty(lb)){
			condition.append(" and equip.type=? ");
			params.add(lb);
		}
		
		if(StringUtil.isNotEmpty(project_id)){
			condition.append(" and exists(select * from project a where a.ENTERPRISE_ID=equip.ENTERPRISE_ID and a.id=?) ");
			params.add(project_id);
		}else{
			condition.append(AllUtil.getEnterpriseIdsCondition(user, "EQUIP_MANAGER_LIST", "ENTERPRISE_ID"));
		}
		
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.isNotEmpty(value)){
					if(StringUtil.eq(key, "qymc")){
						condition.append(" and exists(select * from ENTERPRISE a where a.id=equip.enterprise_id and a.name like ?) ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "mc")){
						condition.append(" and equip.name like ? ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "cs")){
						condition.append(" and equip.factory like ? ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "xh")){
						condition.append(" and equip.model like ? ");
						params.add("%" + value + "%");
					}
					if(StringUtil.eq(key, "num_min")){
						condition.append(" and equip.quantity >= ? ");
						params.add(value);
					}
					if(StringUtil.eq(key, "num_max")){
						condition.append(" and equip.quantity <= ? ");
						params.add(value);
					}
				}
			}
		}
		
		List<EquipModel> list=EquipDao.getSingle().queryByPage(condition.toString(), params.toArray(new String[0]), page, rows, " equip.name ", " asc ");
		if(null!=list && !list.isEmpty()){
			EnterpriseModel enterprise = EnterpriseDao.getSingle().executeQueryById(list.get(0).getEnterprise_id());
			if(null!=enterprise){
				for (EquipModel equipModel : list) {
					equipModel.setEnterprise_name(enterprise.getName());
				}
			}
			int total=EquipDao.getSingle().getTotal(condition.toString(), params.toArray(new String[0]));
			result.element(TOTAL, total);
			result.element(ROWS, JSONArray.fromObject(list));
		}
		sendResult(result);
	}

	public EquipUsedModel getEquipUsed() {
		return equipUsed;
	}

	public void setEquipUsed(EquipUsedModel equipUsed) {
		this.equipUsed = equipUsed;
	}

	public EquipModel getEquip() {
		return equip;
	}

	public void setEquip(EquipModel equip) {
		this.equip = equip;
	}

	public String getLb() {
		return lb;
	}

	public void setLb(String lb) {
		this.lb = lb;
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

	public String getProject_id() {
		return project_id;
	}

	public void setProject_id(String project_id) {
		this.project_id = project_id;
	}
	
}
