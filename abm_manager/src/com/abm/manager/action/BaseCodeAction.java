package com.abm.manager.action;

import java.util.List;

import net.sf.json.JSONArray;

import com.abm.common.model.AccountsModel;
import com.abm.common.model.OperatorModel;
import com.abm.common.model.SysBaseCodeModel;
import com.abm.common.service.BaseCodeService;
import com.abm.common.service.SysLogService;
import com.abm.common.utils.Cache;
import com.abm.common.utils.Constants;
import com.abm.common.utils.StringUtil;
import com.abm.manager.BaseAction;

public class BaseCodeAction extends BaseAction{
	private BaseCodeService codeService = BaseCodeService.getSingle();

	private String id;
	private String type_id;
	private String code;
	private String name;
	private String seq;
	private String ids;
	
	



	public void setId(String id) {
		this.id = id;
	}


	public void setType_id(String typeId) {
		this.type_id = typeId;
	}


	public void setName(String name) {
		this.name = name;
	}

	

	public void setCode(String code) {
		this.code = code;
	}


	public void setSeq(String seq) {
		this.seq = seq;
	}
	
	


	public void setIds(String ids) {
		this.ids = ids;
	}


	public String listByType()
	{
		String results = null;
		
		if(StringUtil.isEmpty(type_id))
		{
			results = "{\"success\":true,\"total\":\"0\",\"rows\":[]}";
		}
		else
		{
			int total = codeService.getTotalByType(type_id);
			List<SysBaseCodeModel> ret = codeService.listByType(type_id,page,rows,sort,order);
			if(ret!=null)
			{
				results =  JSONArray.fromObject(ret).toString();
			}
			else
			{
				results = "[]";
			}
			results = "{\"success\":true,\"total\":\""+total+"\",\"rows\":"+results+"}";
		}
		
		sendResult(results);
		return NONE;
	}
	
	
	public String save()
	{
		String results = null;
		if(StringUtil.isEmpty(id))
		{
			//增加
			
			SysBaseCodeModel baseCode = new SysBaseCodeModel();
			baseCode.setType_id(type_id);
			baseCode.setCode(code);
			baseCode.setName(name);
			baseCode.setSeq(Integer.parseInt(seq));
			

			int ret = codeService.add(baseCode);
			if(ret==0)
			{
				Cache.reload();
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_DIC, code, Constants.SysLog.RESULT_SUCCESS);
				results = "{\"success\":true,\"msg\":\"增加数据字典成功\"}";
			}else
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_ADD_DIC, code, Constants.SysLog.RESULT_FAIL);
				if(ret==-1)
				{
					results = "{\"success\":false,\"msg\":\"增加数据字典失败: 编码重复\"}";
				}
				else
				{
						results = "{\"success\":false,\"msg\":\"增加数据字典失败\"}";
				}	
			}
		}
		else
		{
			SysBaseCodeModel baseCode = new SysBaseCodeModel();
			baseCode.setId(id);
			baseCode.setType_id(type_id);
			baseCode.setCode(code);
			baseCode.setName(name);
			baseCode.setSeq(Integer.parseInt(seq));
			
			
			int ret = codeService.update(baseCode);
			if(ret==0)
			{
				Cache.reload();
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_DIC, code, Constants.SysLog.RESULT_SUCCESS);
				results = "{\"success\":true,\"msg\":\"修改数据字典成功\"}";
			}else
			{
				SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_EDIT_DIC, code, Constants.SysLog.RESULT_FAIL);
				if(ret==-1)
				{
					results = "{\"success\":false,\"msg\":\"修改数据字典失败:数据字典不存在\"}";
				}
				else
				{
						results = "{\"success\":false,\"msg\":\"修改数据字典失败\"}";
				}	
			}
			
		}
		
		sendResult(results);
		return NONE;
	}
	
	public String delete()
	{
		String results="";
		if(StringUtil.isEmpty(ids))
		{
			sendResult("{\"success\":false,\"msg\":\"删除数据字典失败:未指定删除的内容\"}");
			return NONE;
		}
		String[] to_delete = ids.split(",");
		int ret = codeService.delete(to_delete);
		if(ret==0)
		{
			Cache.reload();
			SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_DIC, "", Constants.SysLog.RESULT_SUCCESS);
			results = "{\"success\":true,\"msg\":\"删除数据字典成功\"}";
		}else
		{
			SysLogService.getSingle().log(((AccountsModel)getSession().getAttribute(Constants.USER)).getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_DELETE_DIC, "", Constants.SysLog.RESULT_FAIL);
			results = "{\"success\":false,\"msg\":\"删除数据字典失败\"}";
				
		}
		sendResult(results);
		return NONE;
	}
}
