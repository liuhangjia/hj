<%@ page language="java"  pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> 
<meta http-equiv="Pragma" content="no-cache"> 
<meta http-equiv="Cache-Control" content="no-cache"> 
<meta http-equiv="Expires" content="0"> 
<title>欢迎登录云行保平台</title> 
<link href="css/login.css" type="text/css" rel="stylesheet"> 
<script type="text/javascript" src="./js/lib/jquery.min.js"></script>

<script language="javascript">
	$(function(){
	    $('.loginbox').css({'position':'absolute','left':($(window).width()-692)/2});
		$(window).resize(function(){  
	    $('.loginbox').css({'position':'absolute','left':($(window).width()-692)/2});
	    });  
	});  



	$(document).ready(function(){

		$("#loginForm").bind('submit',function(){
			return login();
		});
		$('#account').bind('focus',function(){
			$(this).val('');
		});
		$('#password').bind('focus',function(){
			$(this).val('');
		});
	});

	function login(){
		var account = $("#account").val();
		var password = $("#password").val();
		if($.trim(account)==""||$.trim(password)==""){
			alert("用户名或密码不能为空!");
			return false;
		}
		
		$.ajax({
		    type: "post",  
			url: "./Login-login.action?_r=" + Math.random(),
			dataType:"json",
			data: $("#loginForm").serialize(),
			success: function(data)
			{
				var flag = data["success"];
				if(flag)
				{ 
					window.location.href="main.jsp";
				}
				else
				{
					alert(data['msg']);
				}
	        }
	 });
	return false;
	}

</script>
</head> 
<body> 
<div style="position:  absolute; top: 155px; left: 43%;"><img src="./images/logo1.png" style="width:180px; height:60px;display:table-cell;vertical-align:middle;" alt=""/></div>
<div class="login">
    <div class="message" style="font-size:22px;">欢迎登录云行保平台</div>
    <div id="darkbannerwrap"></div>
    
    <form method="post"  id="loginForm">
		
		<input name="account" id="account" placeholder="账号" required type="text" autocomplete="off" />
		<hr class="hr15">
		<input name="password" id="password" placeholder="密码" required type="password">
		<!--<hr class="hr15">
		  <input name="zzm" id="zzm" placeholder="验证码" required type="text" style="width:55%;"><img src="./images/verify.png" alt="">-->
		<hr class="hr15">
		<input value="登录" style="width:100%;" type="submit">
		<hr class="hr15">
		<a href="http://www.yxb119.com/" class="button" style="float:left; width:45%;">返回网站首页</a> 
		<a href="http://www.yxb119.com/forgot.jsp" class="button" style="float:right; width:45%;">忘记密码</a>
	    <hr class="hr20">
	</form>

	
</div>

<div class="copyright"> </div>

</body>
</html>

