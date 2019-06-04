package com.abm.manager.action;

import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.abm.common.dao.MemberDao;
import com.abm.common.model.AccountsModel;
import com.abm.common.model.MemberModel;
import com.abm.common.model.RoleModel;
import com.abm.common.service.AccountsService;
import com.abm.common.service.MemberService;
import com.abm.common.utils.StringUtil;
import com.abm.manager.BaseAction;

public class MemberAction extends BaseAction{
	
	private MemberService memberService = MemberService.getSingle();
	
	private String id;
	private MemberModel member;
	
	
	public MemberModel getMember() {
		return member;
	}

	public void setMember(MemberModel member) {
		this.member = member;
	}

	public void setId(String id) {
		this.id = id;
	}
	
	public void saveBaseInfo(){
		JSONObject result = new JSONObject();
		boolean flag = false;
		if(null != member && StringUtil.isNotEmpty(member.getId())){
			flag = MemberDao.getSingle().update(member, false);
			if(flag){
				result.element(MSG, "保存会员基本信息成功");
			}else{
				result.element(MSG, "保存会员基本信息失败");
			}
		}else{
			result.element(MSG, "请输入基本信息");
		}
		result.element(SUCCESS, flag);
		sendResult(result);
	}
	
	public void findCurrentMember(){
		AccountsModel model = getSessionEmp();
		List<MemberModel> members = MemberDao.getSingle().executeQuery(" and member.account_id = ? ",new String[]{model.getId()});
		if(null != members && !members.isEmpty()){
			sendResult(JSONObject.fromObject(members.get(0)));
		}else{
			sendResult("{}");
		}
	}
	
	public void findByAccountId(){
		if(StringUtil.isNotEmpty(id)){
			List<MemberModel> members = MemberDao.getSingle().executeQuery(" and member.account_id = ? ",new String[]{id});
			if(null != members && !members.isEmpty()){
				sendResult(JSONObject.fromObject(members.get(0)));
			}else{
				sendResult("{}");
			}
		}else{
			sendResult("{}");
		}
	}


	public String list()
	{
		String results = null;
		String condition = " and 1=1  ";
		Map<String,String> conditions = parseCondition();
		
		
		for(String key:conditions.keySet())
		{
			String value = conditions.get(key);
			if(value!=null&&value.trim().length()>0)
			{
				if( "name".equals(key))
				{
					condition = condition + " and member.name like '%"+value+"%' ";
				}
				else if( "phone".equals(key))
				{
					condition = condition + " and member.phone like '%"+value+"%' ";
				}
				else if( "addr".equals(key))
				{
					condition = condition + " and member.address like '%"+value+"%' ";
				}
			}
		}
		
		int total = memberService.getTotal(condition,null);
		List<MemberModel> ret = memberService.queryByPage(condition,null, page, rows, parseSorter(), parseDirect());
		if(ret!=null)
		{
			results =  JSONArray.fromObject(ret).toString();
		}
		else
		{
			results = "[]";
		}
		results = "{\"success\":true,\"total\":\""+total+"\",\"rows\":"+results+"}";
		sendResult(results);
		return NONE;
	}
	
	
	public String resetPwd()
	{
		String results = "";
		if(StringUtil.isEmpty(id))
		{
			sendResult("{\"success\":false,\"msg\":\"重置密码失败:未指定账号信息\"}");
			return NONE;
		}
		if(AccountsService.getSingle().changePassword(id, "111111"))
		{
			results = "{\"success\":true,\"msg\":\"重置密码成功:新密码为111111\"}";
		}
		else
		{
			results = "{\"success\":false,\"msg\":\"重置密码失败\"}";
		}
		sendResult(results);
		return NONE;
		
	}

}
