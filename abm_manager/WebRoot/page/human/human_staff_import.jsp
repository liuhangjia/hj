<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
	<form id="human_staff_import" method="post" enctype = "multipart/form-data">
	 	
		<div class="tck_tr" style="width:450px; margin-bottom:10px; padding-left:20px;">
			<p>
				<span style="width:100%; line-height:24px; float:left; text-align:left; display:block; color:#D04C3E;">
				<span style="font-weight:bold;">重要提示</span>:<br/>&nbsp;&nbsp;1.导入之前请先选择企业<br/>&nbsp;&nbsp;2.导入的Excel文件必须是以模板为格式基础添加数据,请勿修改模板格式<br/> 下载模板请点击此处&nbsp;<span style="color:#2C991A;"><a  href="././././file/EnterpriseEmpImport.xls">&rarr;模板下载&larr;</a></span>&nbsp;</span>
			</p>
		</div>

	 	<div class="lbcxtj" style="width:450px; height:35px;">
             <label style="display:inline-block; width:100px; text-align:right;">企业名称：</label>
            <select name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" data-options="width:'300px',height:'30px',required:true,url:'./Employee-listMyEnterprise.action?type=EMPLOYEE_MANAGER_ADD',valueField:'id',textField:'name'">
            </select>
        </div>
	 	
		<div class="lbcxtj" style="width:450px; height:35px;">
		    <label style="display:inline-block; width:100px; text-align:right;">上传文件：</label>
		    <input id="efile" name="uploadFile" class="mwsmartui-filebox" data-options="prompt:'请选择文件',height:'30',width:'300px',buttonText:'选择文件'"/>
		</div>
		
	</form>
</body>
</html>