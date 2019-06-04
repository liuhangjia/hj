package com.abm.manager.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.abm.common.model.AccountsModel;
import com.abm.common.model.ProjectRangeModel;
import com.abm.common.service.ProjectShiftService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 班次
 */
public class ProjectShiftAction extends BaseAction{
	
	public void queryByPage(){
		JSONObject result = new JSONObject();
		result.element(TOTAL, 0);
		result.element(ROWS, "[]");
		AccountsModel user = (AccountsModel)getSession().getAttribute(Constants.USER);
		
		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		Map<String,String> conditions = parseCondition();
		if(null!=conditions && !conditions.isEmpty()){
			for (String key:conditions.keySet()) {
				String value = conditions.get(key);
				if(StringUtil.isNotEmpty(value)){
					if(StringUtil.eq(key, "project_name")){
						condition.append(" and exists(select * from project a where a.id=PROJECT_RANGE.project_id and a.is_delete='0' and a.name like ? ) ");
						params.add("%"+value+"%");
					}
				}
			}
		}
		condition.append(PrivUtil.getConditionForProject(user,"PROJECT_SHIFT_LIST"));
		
		List<ProjectRangeModel> list = service.queryByPage(condition.toString(), params.toArray(new String[params.size()]), page, rows);
		int total = service.getTotal(condition.toString(), params.toArray(new String[params.size()]));
		if(null!=list && !list.isEmpty()){
			result.element(ROWS, list);
			result.element(TOTAL, total);
		}
		sendResult(result);
	}
	
	public void list(){
		JSONObject result = new JSONObject();
		if(StringUtil.isEmpty(ids)){
			sendResult("[]");
		}else{
			List<ProjectRangeModel> list = service.listByPid(ids);
			if(null==list||list.isEmpty()){
				sendResult("[]");
			}else{
				sendResult(JSONArray.fromObject(list));
			}
		}
	}
	
	public void del(){
		JSONObject result = new JSONObject();
		result.element(SUCCESS, false);
		if(StringUtil.isEmpty(ids)){
			result.element(MSG, "删除对象为空");
			sendResult(result);
			return;
		}
		String[] _ids = ids.split(",");
		if(service.delete(_ids)){
			result.element(SUCCESS, true);
			result.element(MSG, "删除成功");
		}else{
			result.element(MSG, "删除失败");
		}
		sendResult(result);
	}
	
	public void save(){
		JSONObject result = new JSONObject();
		result.element(SUCCESS, false);
		if(null==projectRangeModel){
			result.element(MSG, "添加对象为空");
		}else{
			if(StringUtil.isEmpty(projectRangeModel.getId())){
				if(service.add(projectRangeModel)){
					result.element(SUCCESS, true);
					result.element(MSG, "添加成功");
				}else{
					result.element(MSG, "添加失败");
				}
			}else{
				if(service.upd(projectRangeModel)){
					result.element(SUCCESS, true);
					result.element(MSG, "更新成功");
				}else{
					result.element(MSG, "更新失败");
				}
			}
		}
		sendResult(result);
	}
	
	private String ids;
	private ProjectRangeModel projectRangeModel;
	
	public String getIds() {
		return ids;
	}

	public void setIds(String ids) {
		this.ids = ids;
	}

	public ProjectRangeModel getProjectRangeModel() {
		return projectRangeModel;
	}

	public void setProjectRangeModel(ProjectRangeModel projectRangeModel) {
		this.projectRangeModel = projectRangeModel;
	}

	private static ProjectShiftService service = ProjectShiftService.getSingle();
}
