package com.abm.manager;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.ServletActionContext;

import com.abm.common.model.AccountsModel;
import com.abm.common.service.SysLogService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.StringUtil;
import com.opensymphony.xwork2.ActionContext;


public class BaseAction extends com.mw.common.Action.BaseAction{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 8149237752904802840L;
	
	public JSONObject isTrueFromJSONObjectParam(String param){
		JSONObject result=new JSONObject();
		result.element(MSG, "找不到信息");
		if(StringUtil.isEmpty(param)){
			result.element(SUCCESS, false);
			sendResult(result);
			return result;
		}
		JSONObject json = null;
		try {
			json = JSONObject.fromObject(param);
			result.element("param", json);
		} catch (Exception e) {
			e.printStackTrace();
			result.element(SUCCESS, false);
			sendResult(result);
			return result;
		}
		if(null==json || json.isEmpty()){
			result.element(SUCCESS, false);
			sendResult(result);
			return result;
		}
		result.element(SUCCESS, true);
		return result;
	}
	
	public void log(String sysLogType, String detail, String result){
		SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), sysLogType, detail, result);
	}
	
	public AccountsModel getSessionEmp(){
		return (AccountsModel) getSession().getAttribute(Constants.USER);
	}
	
	public void addActionMessage(String message)
	{
		HttpServletRequest hrequest = (HttpServletRequest)ActionContext.getContext().get(ServletActionContext.HTTP_REQUEST);
		hrequest.setAttribute("message", message);
	}
	
	@SuppressWarnings("rawtypes")
	public Map<String,String> parseCondition()
	{
		Map<String,String> result = new HashMap<String,String>();
		if(filter!=null&&filter.length()>0)
		{
			
			JSONArray arrays = JSONArray.fromObject(filter);
			Iterator it = arrays.listIterator();
			while(it.hasNext())
			{
				JSONObject  obj = (JSONObject)it.next();
				String key = obj.getString("property");
				String value = obj.getString("value");
				result.put(key, value.equals("null")?null:value);
			}
			
		}
		return result;
	}
	

	/**
	 * 获取系统路径
	 * @author minghui.wang
	 * @date   20150730
	 * @return http://serverName:port/path/
	 * */
	private String getBasePath(){
		HttpServletRequest request = getRequest();
		//String path = request.getContextPath();
//		String path="";
		String basePath = request.getScheme()+"://"+request.getServerName();
		if(request.getServerPort() != 80){
			basePath += ":"+request.getServerPort()+"/";
		}else{
			basePath +=  "/";
		}
		return basePath;
	}
	/**
	 * 获取系统路径,modified by tpan,从session中取出应用id，套件id和企业id附加到url后部
	 * @author minghui.wang
	 * @date   20150802
	 * @param toUrl 例如：mission.jsp#mission_detail_section
	 * @param agentId 应用ID，使用Constants中的常量
	 * @return http://serverName:port/path/
	 * */
	public String getUrlPath(String toUrl){
		if(StringUtils.isBlank(toUrl) || StringUtils.isEmpty(toUrl)){
			return "";
		}
		toUrl = getBasePath() + toUrl;
		return toUrl;
	}
	
	/**
	 * 获取当前session中的USER
	 * @author minghui.wang
	 * @date   20150802
	 * */
//	public SysUserBean getSessionUser(){
//		return (SysUserBean) getSession().getAttribute(Constants.USER);
//	}
//	
	public int getPage() {
		if(page <= 0){
			page = 1;
		}
		return page;
	}
	public void setPage(int page) {
		if(page <= 0){
			page = 1;
		}
		this.page = page;
	}
	
}
