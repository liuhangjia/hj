
<%@page import="java.net.URLDecoder"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="com.abm.common.model.AccountsModel"%>
<%@page import="com.abm.common.dao.EquipDao"%>
<%@page import="com.abm.common.model.EquipModel"%>
<%@page import="com.abm.common.dao.EquipUsedDao"%>
<%@page import="com.abm.common.model.EquipUsedModel"%>
<%@page import="net.sf.json.JSONArray"%>
<%@page import="net.sf.json.JSONObject"%>
<%@page import="com.abm.common.utils.Cache"%>
<%@page import="com.abm.common.utils.AllUtil"%>
<%@page import="com.abm.common.utils.DateUtil"%>
<%@page import="java.util.Date"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.List"%>
<%@page import="com.mw.common.utils.StringUtil"%>
<%@page import="com.abm.common.utils.Constants"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% 
	
	String grOrQy = request.getParameter("grOrQy");
	String lb = request.getParameter("lb");
	String user_name = request.getParameter("user_name");
	String equip_name = request.getParameter("equip_name");
	String project_name = request.getParameter("project_name");
	
	String filter = request.getParameter("filter");
	filter = URLDecoder.decode(filter, "UTF-8");
	String fileName = Cache.codeToName("ZBLB", lb) ;
	if(StringUtil.eq(grOrQy, "gr")){
		fileName += "个人领用记录";
	}else{
		fileName += "装备借还记录";
	}
	
	AccountsModel user = (AccountsModel)session.getAttribute(Constants.USER);
	
	StringBuffer condition = new StringBuffer();
	List<String> params = new ArrayList<String>();
	
	if(StringUtil.isNotEmpty(lb)){
		condition.append(" and exists(select * from equip a where a.id=EQUIP_USED.equip_id and a.type=?) ");
		params.add(lb);
	}
	
	if(StringUtil.eq(grOrQy, "gr")){
		condition.append(" and (PROJECT_ID is null or PROJECT_ID='') ");
		condition.append(" and exists(select * from equip a where a.id=EQUIP_USED.equip_id "+ AllUtil.getEnterpriseIdsCondition(user, "EQUIP_USED_PERSON_MANAGER_LIST", "a.ENTERPRISE_ID") +" ) ");
	}else{
		condition.append(" and (PROJECT_ID is not null and PROJECT_ID<>'') ");
		condition.append(" and exists(select * from equip a where a.id=EQUIP_USED.equip_id "+ AllUtil.getEnterpriseIdsCondition(user, "EQUIP_USED_MANAGER_LIST", "a.ENTERPRISE_ID") +" ) ");
	}
	
	if(StringUtil.isNotEmpty(user_name)){
		user_name = URLDecoder.decode(user_name, "UTF-8");
		condition.append(" and EQUIP_USED.user_name like ? ");
		params.add("%" + user_name + "%");
	}
	if(StringUtil.isNotEmpty(equip_name)){
		equip_name = URLDecoder.decode(equip_name, "UTF-8");
		condition.append(" and exists(select * from equip a where a.id=EQUIP_USED.equip_id and a.name like ?) ");
		params.add("%" + equip_name + "%");
	}
	if(StringUtil.isNotEmpty(project_name)){
		project_name = URLDecoder.decode(project_name, "UTF-8");
		condition.append(" and EQUIP_USED.PROJECT_NAME like ? ");
		params.add("%" + project_name + "%");
	}
	
	//System.out.println(filter);
	JSONArray fArray = JSONArray.fromObject(filter);
	for(int i=0;i<fArray.size();i++){
		JSONObject json = fArray.optJSONObject(i);
		String key = json.optString("property");
		String value = json.optString("value");
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
		}
	}
	//System.out.println(condition.toString());
	//System.out.println(JSONArray.fromObject(params).toString());
	List<EquipUsedModel> list = EquipUsedDao.getSingle().queryByPage(condition.toString(), params.toArray(new String[0]), 1, Integer.MAX_VALUE, "USED_TIME", "desc");
	if(null!=list && !list.isEmpty()){
		//String equip_ids_str="";
		//String project_ids_str="";
		//for (EquipUsedModel eum : list) {
		//	equip_ids_str += ",'"+eum.getEquip_id()+"'";
//			if(StringUtil.isNotEmpty(eum.getProject_id())){
//				project_ids_str += ",'"+eum.getProject_id()+"'";
//			}
		//}
//		System.out.println("装备id："+"and id in ("+equip_ids_str.substring(1)+")");
		List<EquipModel> equipList = EquipDao.getSingle().executeQuery("and equip.type=? ",new String[]{lb});
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
		
//		if(!StringUtil.equals(xmIdIsEmpty, "1")){//项目id不是空
//			List<ProjectModel> pList = ProjectDao.getSingle().executeQuery("and id in ("+project_ids_str+")");
//			Map<String,ProjectModel> p_map = new HashMap<String, ProjectModel>();
//			for (ProjectModel projectModel : pList) {
//				p_map.put(projectModel.getId(), projectModel);
//			}
//			for (EquipUsedModel eum : list) {
//				ProjectModel pm = p_map.get(eum.getProject_id());
//				
//			}
//		}
	}
	
	response.setContentType("application/vnd.ms-excel");
	response.setHeader("Content-Disposition", "inline; filename="+ new String(fileName.getBytes(),"ISO8859-1") +".xls");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<style type="text/css">
		th,td{text-align:left;}
	</style>
</head>

	<body>
		<table border="1" cellspacing="0" cellpadding="0" style="font-size:20px;border-color: #c1c1c1;border-collapse: collapse;  ">
				<tr height="35px">
					<th>借用人</th>
					<%
						if(StringUtil.eq(grOrQy, "qy")){
					%>
					<th>项目名称</th>
					<%
						}
					%>
					<th>装备种类</th>
					<th>装备名称</th>
					<th>借用数量</th>
					<th>借用时间</th>
					<th>归还时间</th>
					<th>备注</th>
				</tr>
				<%
					if(null!=list && !list.isEmpty()){
						for(int i=0;i < list.size();i++ ){
							EquipUsedModel model = list.get(i);
							EquipModel zbModel = model.getEquipModel();
							
				%>
				<tr height="35px">
					<td><%=model.getUser_name() %></td>
					<%
						if(StringUtil.eq(grOrQy, "qy")){
					%>
					<td><%=model.getProject_name() %></td>
					<%
						}
					%>
					
					<td><%=AllUtil.nullToBlank(zbModel.getCategory()) %></td>
					<td><%=AllUtil.nullToBlank(zbModel.getName()) %></td>
					<td><%=model.getQuantity() %></td>
					<td><%=AllUtil.fmtDateToStr16ForExcel(model.getUsed_time()) %></td>
					<td><%=AllUtil.fmtDateToStr16ForExcel(model.getReturn_time()) %></td>
					<td><%=AllUtil.nullToBlank(model.getBak()) %></td>
					
					<%--
					<td><%=AllUtil.subDateStr10(eduModel.getEnd_time()) %></td>
					<td><%=AllUtil.nullToBlank(eduModel.getExaminer_name())  %></td>
					 --%>
				</tr>
				<%
						}
					}
				%>
				
		</table>
	
	</body>
</html>
