package com.abm.manager.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.abm.common.dao.EquipDao;
import com.abm.common.dao.EquipUsedDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.EquipModel;
import com.abm.common.model.EquipUsedModel;
import com.abm.common.utils.AllUtil;
import com.abm.common.utils.Constants;
import com.abm.manager.BaseAction;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class EquipUsedAction extends BaseAction{
	
	private String xmIdIsEmpty;
	private String lb;
	
	public void list(){
		JSONObject result = new JSONObject();
		result.element(TOTAL, 0);
		result.element(ROWS, "[]");
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);

		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		
		if(StringUtil.isNotEmpty(lb)){
			condition.append(" and exists(select * from equip a where a.id=EQUIP_USED.equip_id and a.type=?) ");
			params.add(lb);
		}
		
		if(StringUtil.eq(xmIdIsEmpty, "1")){
			condition.append(" and (PROJECT_ID is null or PROJECT_ID='') ");
			condition.append(" and exists(select * from equip a where a.id=EQUIP_USED.equip_id "+ AllUtil.getEnterpriseIdsCondition(user, "EQUIP_USED_PERSON_MANAGER_LIST", "a.ENTERPRISE_ID") +" ) ");
		}else{
			condition.append(" and (PROJECT_ID is not null and PROJECT_ID<>'') ");
			condition.append(" and exists(select * from equip a where a.id=EQUIP_USED.equip_id "+ AllUtil.getEnterpriseIdsCondition(user, "EQUIP_USED_MANAGER_LIST", "a.ENTERPRISE_ID") +" ) ");
		}
		
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.isNotEmpty(value)){
					if(StringUtil.eq(key, "user_name")){
						condition.append(" and EQUIP_USED.user_name like ? ");
						params.add("%" + value + "%");
					}
					else if(StringUtil.eq(key, "sfygh")){
						if(StringUtil.eq(value, "1")){
							condition.append(" and EQUIP_USED.RETURN_TIME is not null ");
						}else if(StringUtil.eq(value, "0")){
							condition.append(" and EQUIP_USED.RETURN_TIME is null ");
						}
					}
					else if(StringUtil.eq(key, "jysj_start")){
						condition.append(" and EQUIP_USED.USED_TIME >= str_to_date(?,'%Y-%m-%d %H:%i:%s') ");
						params.add(value+" 00:00:00");
					}
					else if(StringUtil.eq(key, "jysj_end")){
						condition.append(" and EQUIP_USED.USED_TIME <= str_to_date(?,'%Y-%m-%d %H:%i:%s') ");
						params.add(value+" 23:59:59");
					}
					else if(StringUtil.eq(key, "ghsj_start")){
						condition.append(" and EQUIP_USED.RETURN_TIME >= str_to_date(?,'%Y-%m-%d %H:%i:%s') ");
						params.add(value+" 00:00:00");
					}
					else if(StringUtil.eq(key, "ghsj_end")){
						condition.append(" and EQUIP_USED.RETURN_TIME <= str_to_date(?,'%Y-%m-%d %H:%i:%s') ");
						params.add(value+" 23:59:59");
					}
					else if(StringUtil.eq(key, "project_name")){
						condition.append(" and EQUIP_USED.PROJECT_NAME like ? ");
						params.add("%" + value + "%");
					}
					else if(StringUtil.eq(key, "equip_name")){
						condition.append(" and exists(select * from equip a where a.id=EQUIP_USED.equip_id and a.name like ?) ");
						params.add("%" + value + "%");
					}
				}
			}
		}
		
		List<EquipUsedModel> list = EquipUsedDao.getSingle().queryByPage(condition.toString(), params.toArray(new String[0]), page, rows, "USED_TIME", "desc");
		if(null!=list && !list.isEmpty()){
			String equip_ids_str="";
			//String project_ids_str="";
			for (EquipUsedModel eum : list) {
				equip_ids_str += ",'"+eum.getEquip_id()+"'";
//				if(StringUtil.isNotEmpty(eum.getProject_id())){
//					project_ids_str += ",'"+eum.getProject_id()+"'";
//				}
			}
//			System.out.println("装备id："+"and id in ("+equip_ids_str.substring(1)+")");
			List<EquipModel> equipList = EquipDao.getSingle().executeQuery("and equip.id in ("+equip_ids_str.substring(1)+")");
			if(null!=equipList && !equipList.isEmpty()){
				Map<String,EquipModel> equip_map = new HashMap<String,EquipModel>();
				for (EquipModel equipModel : equipList) {
					equip_map.put(equipModel.getId(), equipModel);
				}
				for (EquipUsedModel eum : list) {
					EquipModel em = equip_map.get(eum.getEquip_id());
					eum.setEquipModel(em);
					eum.setEquip_name(em.getName());
				}
			}
			
//			if(!StringUtil.equals(xmIdIsEmpty, "1")){//项目id不是空
//				List<ProjectModel> pList = ProjectDao.getSingle().executeQuery("and id in ("+project_ids_str+")");
//				Map<String,ProjectModel> p_map = new HashMap<String, ProjectModel>();
//				for (ProjectModel projectModel : pList) {
//					p_map.put(projectModel.getId(), projectModel);
//				}
//				for (EquipUsedModel eum : list) {
//					ProjectModel pm = p_map.get(eum.getProject_id());
//					
//				}
//			}
			
			int total=EquipUsedDao.getSingle().getTotal(condition.toString(), params.toArray(new String[0]));
			result.element(TOTAL, total);
			result.element(ROWS, JSONArray.fromObject(list));
		}
	
		sendResult(result);
	}

	public String getXmIdIsEmpty() {
		return xmIdIsEmpty;
	}

	public void setXmIdIsEmpty(String xmIdIsEmpty) {
		this.xmIdIsEmpty = xmIdIsEmpty;
	}

	public String getLb() {
		return lb;
	}

	public void setLb(String lb) {
		this.lb = lb;
	}
	
}
