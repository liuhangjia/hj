<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
	<form id="work_item_modify_form" method="post" >
          <div class="lbcxtj" >
              <label style="width:90px;">检查内容：</label>
              <input id="content" name="content" class="mwsmartui-textbox" data-options="width:'370px',height:'30px'">
          </div>
          <div class="lbcxtj" >
              <label style="width:90px;">检查结果：</label>
              <input id="result" name="result" class="mwsmartui-textbox" data-options="width:'370px',height:'30px'">
          </div>
          <div class="lbcxtj" style="height:120px;">
              <label style="width:90px;">处理说明：</label>
              <input id="handle_result" name="handle_result" class="mwsmartui-textbox" data-options="width:'370px',height:'120px',multiline:true">
          </div>
     </form>
</body>
</html>
