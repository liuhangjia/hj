package com.abm.manager.action;

import java.io.InputStreamReader;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.abm.common.dao.EquipCarDao;
import com.mw.common.utils.Common;
import com.opensymphony.xwork2.ActionContext;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.abm.common.model.AccountsModel;
import com.abm.common.model.EquipCarModel;
import com.abm.common.model.EquipModel;
import com.abm.common.service.EquipCarService;
import com.abm.common.service.EquipService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.PrivUtil;
import com.abm.manager.BaseAction;
import com.mw.common.utils.StringUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.ServletActionContext;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;

public class EquipCarAction extends BaseAction{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 *车牌设备扫描回调
	 * EquipCar-scanNotify don't interceptor and filter
	 */
	public void scanNotify()throws Exception{
		HashMap<String,String> colorSelect =new HashMap<String,String>();
		colorSelect.put("1","蓝");
		colorSelect.put("2","黄");
		colorSelect.put("3","白");
		colorSelect.put("4","黑");
		ServletInputStream in=null;
		try{
			HttpServletRequest request = ServletActionContext.getRequest();
			if("application/json".equals(request.getContentType())) {
				in = request.getInputStream();
				StringBuilder out = new StringBuilder();
				InputStreamReader reader = new InputStreamReader(in, Charset.defaultCharset());
				char[] buffer = new char[4096];
				int bytesRead;
				while ((bytesRead = reader.read(buffer)) != -1) {
					out.append(buffer, 0, bytesRead);
				}
				String carStr = out.toString();//json
			//	System.out.println(carStr);
				JSONObject jsonObject = JSONObject.fromObject(carStr);
				//jsonObject.optString("");
				EquipCarModel car = new EquipCarModel();
				if(StringUtils.isNotBlank(jsonObject.optString("vehicleLaneKey"))){
					car.setEquip_id(jsonObject.optString("vehicleLaneKey"));
				};
				if(StringUtils.isNotBlank(jsonObject.optString("carNo"))){
					car.setCar_number(URLDecoder.decode(jsonObject.optString("carNo"),"UTF-8"));
				}
				if(StringUtils.isNotBlank(jsonObject.optString("scanTime"))){
					car.setRecord_time(jsonObject.optString("scanTime"));
				}
				if(StringUtils.isNotBlank(jsonObject.optString("carNumColor"))){
					String colorInt =jsonObject.optString("carNumColor");
					car.setCar_color(colorSelect.get(colorInt));

				}
				car.setId(Common.uuid());
				if(StringUtils.isNotBlank(jsonObject.optString("carNo"))) {
					boolean add = dao.add(car);
				}

			}
			}catch (Exception E){ }
			finally {
				if(in!=null){
					in.close();
				}
			}
			sendResult("[]");

	}

	public void list(){
		JSONObject result = new JSONObject();
		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		Map<String,String> conditions = parseCondition();
		if(null != conditions && !conditions.isEmpty()){
			for(String key : conditions.keySet()){
				String value = conditions.get(key);
				if(StringUtil.isEmpty(value)){
					continue;
				}
				if(StringUtil.eq(key, "car_number")){
					condition.append(" and equip_car.car_number like ? ");
					params.add("%" + value + "%");
				}
				if(StringUtil.eq(key, "record_time")){
					condition.append(" and equip_car.record_time like ? ");
					params.add("%" + value + "%");
				}
				if(StringUtil.eq(key, "equip_id")){
					condition.append(" and equip_car.equip_id = ? ");
					params.add(value);
				}
			}
		}
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(" and equip_car.equip_id in (select equip.sn from equip where 1 = 1 " + PrivUtil.getConditionForEnterprise(currentUser, "EQUIP_CAR_LIST") + ")");
		List<EquipCarModel> models = service.queryByPage(condition.toString(), params.toArray(new String[params.size()]), page, rows, " equip_car.record_time ", "desc");
		if(null != models){
			result.element(TOTAL, service.getTotal(condition.toString(), params.toArray(new String[params.size()])));
			result.element(ROWS, JSONArray.fromObject(models));
		}else{
			result.element(TOTAL, 0);
			result.element(ROWS, "[]");
		}
		sendResult(result);
	}
	
	public String listCarEquip(){
		StringBuffer condition = new StringBuffer();
		List<String> params = new ArrayList<String>();
		condition.append(" and equip.type = ? and equip.is_delete = ? ");
		params.add("CLSB");
		params.add(Constants.IS_DELETE_FALSE);
		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		condition.append(PrivUtil.getConditionForEnterprise(currentUser, "EQUIP_CAR_LIST"));
		List<EquipModel> equipModels = EquipService.getSingle().queryByPage(condition.toString(),  params.toArray(new String[params.size()]), 1, Integer.MAX_VALUE, null, null);
		if(equipModels!=null)
		{
			sendResult(JSONArray.fromObject(equipModels).toString());
		}
		else
		{
			sendResult("[]");
		}
		return NONE;
	}
	
	private EquipCarService service = EquipCarService.getSingle();
	private EquipCarDao dao = EquipCarDao.getSingle();
	private EquipCarModel carModel;

	public EquipCarModel getCarModel() {
		return carModel;
	}

	public void setCarModel(EquipCarModel carModel) {
		this.carModel = carModel;
	}

	public static void main(String[] args) {
	}
	
	
}
