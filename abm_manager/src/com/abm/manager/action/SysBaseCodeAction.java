package com.abm.manager.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.abm.common.model.SysBaseCodeModel;
import com.abm.common.model.SysCodeTypeModel;
import com.abm.common.service.SysBaseCodeService;
import com.abm.common.utils.Cache;
import com.abm.manager.BaseAction;
import com.mw.common.utils.StringUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 系统编码维护
 * @author minghuiWang
 * 20161105
 * */
public class SysBaseCodeAction extends BaseAction{
	/**
	 * 
	 */
	private static final long serialVersionUID = 9141913584647669362L;
	
	public void listForCombo(){
		JSONArray datas = new JSONArray();
		if(StringUtil.isNotEmpty(type)){
			List<SysBaseCodeModel> list = Cache.findCodeByTypeCode(type);
			if(null!=list && !list.isEmpty()){
				datas = JSONArray.fromObject(list);
			}
		}
		sendResult(datas);
	}
	
	public void modify(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if((StringUtils.isNotBlank(type) && StringUtils.isNotEmpty(type)) && (null != baseCode)){
			SysCodeTypeModel codeType = Cache.findTypeByCode(type);
			if(null != codeType){
				baseCode.setType_id(codeType.getId());
				baseCode.setCodeType(codeType);
				flag = codeService.modify(baseCode);
				if(flag){
					result.element(MSG, "保存成功");
				}else{
					result.element(MSG, "保存失败");
				}
			}else{
				result.element(MSG, "系统中不存在此类型编码");
			}
		}else{
			result.element(MSG, "编码类型不能为空");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void del(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if(StringUtil.isNotEmpty(ids)){
			SysBaseCodeModel code = Cache.findCodeById(ids);
			flag = codeService.del(ids);
			if(flag){
				Cache.initById(code.getType_id());
				result.element(MSG, "删除成功");
			}else{
				result.element(MSG, "删除失败");
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
				if ("code".equals(key)) {
					condition.append(" and code like ? ");
					params.add("%"+value+"%");
				}
				if("name".equals(key)){
					condition.append(" and name like ? ");
					params.add("%" + value + "%");
				}
			}
		}
		if(StringUtils.isNotBlank(type)&&StringUtils.isNotEmpty(type)){
			condition.append(" and exists (select * from sys_code_type where sys_code_type.id = sys_base_code.type_id and sys_code_type.code = ? ) ");
			params.add(type);
		}
		String sorter = parseSorter();
		if(StringUtils.isBlank(sorter)||StringUtils.isEmpty(sorter)){
			sorter = "seq";
		}
		String dir = parseDirect();
		// fy 默认分页数据 fy=1 
		fy = StringUtils.isBlank(fy)||StringUtils.isEmpty(fy)?DATA_ROWS:fy;
		List<SysBaseCodeModel> codes = null;
		if(StringUtils.equals(fy, DATA_PAGE)){
			int total = codeService.getTotal(condition.toString(), params.toArray(new String[0]));
			codes = codeService.list(condition.toString(), params.toArray(new String[0]), page, rows, sorter, dir);
			result.element(TOTAL, total);
			result.element(ROWS, codes);
			sendResult(result);
		}else{
			codes = Cache.findCodeByTypeCode(type);
			sendResult(JSONArray.fromObject(codes));    
		}
	}
	
	
	/**
	 * 省
	 * */
	public void provinces(){
		List<SysBaseCodeModel> baseCodes = Cache.findCodeByTypeCode("QY");
		List<SysBaseCodeModel> provinces = new ArrayList<SysBaseCodeModel>();
		if(null != baseCodes && !baseCodes.isEmpty()){
			for(SysBaseCodeModel baseCode:baseCodes){
				if(StringUtils.endsWith(baseCode.getCode(), "0000")){
					provinces.add(baseCode);
				}
			}
		}
		sendResult(JSONArray.fromObject(provinces));
	}
	/**
	 * 市
	 * */
	public void cities(){
		List<SysBaseCodeModel> cities = new ArrayList<SysBaseCodeModel>();
		if(StringUtils.isNotBlank(type)&&StringUtils.isNotEmpty(type)){
			List<SysBaseCodeModel> baseCodes = Cache.findCodeByTypeCode("QY");
			if(null != baseCodes && !baseCodes.isEmpty()){
				for(SysBaseCodeModel baseCode:baseCodes){
					if(!StringUtils.endsWith(baseCode.getCode(), "0000")){
						if(StringUtils.startsWith(baseCode.getCode(), type.substring(0,2)) && StringUtils.endsWith(baseCode.getCode(), "00")){ 
							cities.add(baseCode);
						}
					}
				}
			}
		}
		sendResult(JSONArray.fromObject(cities));
	}
	/**
	 * 地区
	 * */
	public void countries(){
		List<SysBaseCodeModel> counties = new ArrayList<SysBaseCodeModel>();
		if(StringUtils.isNotBlank(type)&&StringUtils.isNotEmpty(type)){
			List<SysBaseCodeModel> baseCodes = Cache.findCodeByTypeCode("QY");
			if(null != baseCodes && !baseCodes.isEmpty()){
				for(SysBaseCodeModel baseCode:baseCodes){
					if(!StringUtils.endsWith(baseCode.getCode(), "0000")&& !StringUtils.endsWith(baseCode.getCode(), "00")){
						if(StringUtils.startsWith(baseCode.getCode(), type.substring(0, 4))){ 
							counties.add(baseCode);
						}
					}
				}
			}
		}
		sendResult(JSONArray.fromObject(counties));
	}
	
	
	private SysBaseCodeService codeService = SysBaseCodeService.getSingle();
	
	private SysBaseCodeModel baseCode;
	private String type;
	private String ids;
	private String fy;
	private static final String DATA_PAGE = "1";
	private static final String DATA_ROWS = "0";
	public SysBaseCodeModel getBaseCode() {
		return baseCode;
	}

	public void setBaseCode(SysBaseCodeModel baseCode) {
		this.baseCode = baseCode;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getIds() {
		return ids;
	}

	public void setIds(String ids) {
		this.ids = ids;
	}

	public String getFy() {
		return fy;
	}

	public void setFy(String fy) {
		this.fy = fy;
	}
	
	
	
}
