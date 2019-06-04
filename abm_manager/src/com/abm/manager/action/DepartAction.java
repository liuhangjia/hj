package com.abm.manager.action;

import java.util.List;
import java.util.Map;

import com.abm.common.dao.DepartDao;
import com.abm.common.dao.EnterpriseDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.DepartModel;
import com.abm.common.model.EnterpriseModel;
import com.abm.common.service.DepartService;
import com.abm.common.utils.AllUtil;
import com.abm.common.utils.Constants;
import com.abm.manager.BaseAction;
import com.mw.common.utils.Common;
import com.mw.common.utils.StringUtil;


import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class DepartAction extends BaseAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4086214092154384070L;
	private String priv;
	
	public void listForCombo(){
//		JSONArray ret = new JSONArray();
//		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
//		String in_sql = AllUtil.getEnterpriseIdsCondition(user, priv, "depart.enterprise_id");
//		List<DepartModel>  list = DepartDao.getSingle().executeQuery(in_sql+" and depart.is_delete='0' ");
//		if(null!=list && !list.isEmpty()){
//			ret = JSONArray.fromObject(list);
//		}
//		sendResult(ret);
	}
	
	public void del(){
		JSONObject result=new JSONObject();
		boolean flag=false;
		result.element(SUCCESS, flag);
		result.element(MSG, "删除失败");
		try {
			if(StringUtil.isEmpty(code) || StringUtil.isEmpty(enterpriseId)){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
//			String sql = "delete from depart where code like ? and enterprise_id=?";
			String sql = "update depart set is_delete='1' where code like ? and enterprise_id=?";
			flag = DepartDao.getSingle().execute(sql, new String[]{(code+"%"),enterpriseId});
			if(flag){
				result.element(MSG, "删除成功");
				log("组织机构删除", "", "1");
			}else{
				log("组织机构删除", "", "0");
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
			if(null == dm || StringUtil.isEmpty(dm.getName()) || StringUtil.isEmpty(dm.getEnterprise_id())){
				result.element(MSG, "找不到信息");
				sendResult(result);
				return;
			}
			List<DepartModel> dmList = DepartService.getSingle().list(dm.getEnterprise_id());
			if(null!=dmList && !dmList.isEmpty()){
				for (DepartModel m:dmList) {
					if(StringUtil.eq(dm.getName(), m.getName())){
						result.element(MSG, "部门名称不可重复");
						sendResult(result);
						return;
					}
				}
			}
			if(StringUtil.isEmpty(dm.getId())){
				String p_code = dm.getCode();
				if(StringUtil.eq(p_code, "-1")){
					p_code = "";
				}
				List<Map<String, String>> codeList = DepartDao.getSingle().executeQueryBySql("select depart.code from depart where depart.enterprise_id=? and depart.code like ? order by depart.code desc", new String[]{dm.getEnterprise_id(),(p_code+"___")});
				if(null!=codeList && !codeList.isEmpty()){
					Map<String, String> codeMap = codeList.get(0);
					String code_max = codeMap.get("code");
					int code_max_int = AllUtil.parseInt(code_max);
					code_max_int++;
					code_max = String.valueOf(code_max_int);
					int ys = code_max.length() % 3;
					if(ys == 2){
						code_max = "0"+code_max;
					}else if(ys == 1){
						code_max = "00"+code_max;
					}
					dm.setCode(code_max);
				}else{
					dm.setCode(p_code+"001");
				}
				dm.setId(Common.uuid());
				dm.setIs_delete(Constants.IS_DELETE_FALSE);
				flag = DepartDao.getSingle().add(dm);
				if(flag){
					log("组织机构增加", "", "1");
				}else{
					log("组织机构增加", "", "0");
				}
			}else{
				flag = DepartDao.getSingle().update(dm, false);
				if(flag){
					log("组织机构修改", "", "1");
				}else{
					log("组织机构修改", "", "0");
				}
			}
			if(flag){
				result.element(MSG, "保存成功");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.element(MSG, "有异常");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void listDept(){
		long start = System.currentTimeMillis();
		JSONArray rets = new JSONArray();
		if(StringUtil.isNotEmpty(enterpriseId)){
			EnterpriseModel eModel = EnterpriseDao.getSingle().executeQueryById(enterpriseId);
			if(StringUtil.isNotEmpty(id)){
				if(StringUtil.eq(id, "-1")){
					rets = DepartService.getSingle().listDept("",enterpriseId);
				}else{
					DepartModel depart = DepartService.getSingle().getDeptById(id);
					if(null != depart){
						rets = DepartService.getSingle().listDept(depart.getCode(),enterpriseId);
					}
				}
			}else{
				JSONObject root = new JSONObject();
				root.element("id", "-1");
				root.element("code", "-1");
				root.element("name", eModel.getName());
				root.element("text", eModel.getName());
				root.element("enterprise_id", enterpriseId);
				JSONArray departs = DepartService.getSingle().listDept("",enterpriseId);
				if(null==departs){
					departs = new JSONArray();
				}
				root.element("children", departs);
				rets.add(root);
			}
		}
		
		System.out.println("读取部门耗时：" + (System.currentTimeMillis() - start));
		sendResult(rets);
		
	}
	
	public void list(){
		JSONObject result = new JSONObject();
		if(StringUtil.isEmpty(enterpriseId)){
			sendResult("[]");
		}else{
			List<DepartModel> list = service.list(enterpriseId);
			sendResult(JSONArray.fromObject(list).toString());
		}
	}
	
	private DepartService service = DepartService.getSingle();
	private String enterpriseId;
	private String id;
	private String code;
	private DepartModel dm;

	public String getEnterpriseId() {
		return enterpriseId;
	}

	public void setEnterpriseId(String enterpriseId) {
		this.enterpriseId = enterpriseId;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public DepartModel getDm() {
		return dm;
	}

	public void setDm(DepartModel dm) {
		this.dm = dm;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getPriv() {
		return priv;
	}

	public void setPriv(String priv) {
		this.priv = priv;
	}
	
}
