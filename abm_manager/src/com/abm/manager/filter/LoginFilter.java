package com.abm.manager.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.abm.common.utils.Constants;





public class LoginFilter implements Filter{

	public void destroy() {
		// TODO Auto-generated method stub
		
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		String path = ((HttpServletRequest)request).getRequestURI();
		if(path.contains("scanNotify")||path.contains("login.jsp") || path.contains("login.action")|| path.contains("Video-upload.action")|| path.contains("/dsj/")|| path.contains("/szw")|| path.contains("/ali"))
		{
			chain.doFilter(request, response);
//			if((path.contains("login.jsp")||path.contains("login.action"))&&((HttpServletRequest)request).getSession(). getAttribute(Constants.USER)!=null)
//			{
//				((HttpServletResponse)response).sendRedirect("main.jsp");
//			}
//			else
//			{
//				
//			}
		}
		else
		{
			
			if(((HttpServletRequest)request).getSession(). getAttribute(Constants.USER)==null)
			 {
				if(((HttpServletRequest)request).getHeader("x-requested-with")!=null
						&& ((HttpServletRequest)request).getHeader("x-requested-with").equalsIgnoreCase("XMLHttpRequest"))
				{
					((HttpServletResponse)response).addHeader("sessionstatus", "timeOut"); 
					((HttpServletResponse)response).addHeader("loginPath", "login.jsp");
					//chain.doFilter(request, response);
				}
				else
				{
				 ((HttpServletResponse)response).sendRedirect("login.jsp");
				}
			 }
			 else
			 {
				 chain.doFilter(request, response);
			 }
		}	
	}

	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub
	}

}
