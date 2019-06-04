<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
	<form id="project_manager_import_form" method="post" enctype="multipart/form-data">
			<div class="tck_tr" style="margin-bottom:10px; padding-left:10px;">
				<p>
					<span style="width:100%; line-height:24px; float:left; text-align:left; display:block; color:#D04C3E;">
						<span style="font-weight:bold;">重要提示</span>:
						&nbsp;&nbsp;导入的Excel文件必须是以模板为格式基础添加数据,请勿修改模板格式, 下载模板请点击此处&nbsp;
						<span style="color:#2C991A;">
							<a  href="./Project-downLoadModel.action">&rarr;模板下载&larr;</a>
						</span>&nbsp;
					</span>
				</p>
			</div>
			
			<div style="text-align:left;padding:10px">
				<label style="display:inline-block; text-align:right;"><br/>文件：</label>
               	<input id="project_manager_import_file" name="uploadfile" type="file" data-options="width:'240px',buttonText:'选择文件'" />
			</div>
		</form>
		<%-- 
 <form id="" method="post" >
 
              <div class="lbcxtj" style="width:450px; height:35px;">
                <label style="display:inline-block; width:100px; text-align:right;">上传文件：</label>
                <input class="mwsmartui-filebox" data-options="prompt:'请选择文件',height:'30',width:'300px',buttonText:'选择文件'">
            
            </div>
              <div class="lbcxtj" style="width:450px; height:35px;">
               
            </div>
              <div class="lbcxtj" style="width:450px; height:35px;">
               
            </div>
             <div class="lbcxtj" style="width:450px; height:160px;">
               
            </div>
           
            </form>
		--%>
</body>
</html>
