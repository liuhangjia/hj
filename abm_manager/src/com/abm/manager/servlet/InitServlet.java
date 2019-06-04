package com.abm.manager.servlet;


import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import com.abm.manager.filter.registerFunction;
import com.abm.manager.monitor.ServerSa;
import com.abm.manager.monitor.ServerSzw;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngineConfiguration;
import org.apache.poi.ss.formula.eval.FunctionEval;

import com.abm.common.utils.Cache;

import com.mw.common.dao.ConnectionProxy;
import com.mw.common.dao.config.DbConfig;
import com.mw.common.dao.config.JNDIConfig;
import com.mw.common.dao.factory.ConnectionFactoryJNDI;


public class InitServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;

	@Override
	public void init() throws ServletException {
		super.init();
		
		JNDIConfig config = new JNDIConfig();
		config.setDbType(DbConfig.MYSQL);
		config.setRefName("java:comp/env/jdbc/connectdb");
		ConnectionFactoryJNDI jndi = new ConnectionFactoryJNDI(config,new String[]{"com.abm.common.model"});
		ConnectionProxy.regist(jndi);
		

		
		new Thread(){
			public void run(){
				try {
					ServerSa.listen();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
			}
		}.start();
		new Thread(){
			public void run(){
				
				try {
					ServerSzw.listen();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}.start();

		// 初始化编码表
		Cache.init();
		
		long start = System.currentTimeMillis();
		// 流程中心初始化数据库
		ProcessEngineConfiguration c = ProcessEngineConfiguration.createStandaloneProcessEngineConfiguration();
		c.setDataSource(jndi.getDataSource());
//		c.setJdbcDriver("oracle.jdbc.driver.OracleDriver");
//		c.setJdbcUrl("jdbc:oracle:thin:@127.0.0.1:1521:ORCL");
//		c.setJdbcUsername("elms2");
//		c.setJdbcPassword("Pass1234");
//		c.setDatabaseSchema("abm");
		c.setDatabaseSchema("abm_mj");
		c.setDatabaseType("mysql");
		c.setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE);
		c.setActivityFontName("宋体").setAnnotationFontName("宋体").setLabelFontName("宋体");
		c.setXmlEncoding("UTF-8");
		ProcessEngine engine = c.buildProcessEngine();
		System.out.println("流程中心初始化数据库："+engine);
		System.out.println("初始化流程中心数据库耗时:"+(System.currentTimeMillis()-start));
		
		// 初始化 注册poi函数
		System.out.println("poi初始化函数中...");
		FunctionEval.registerFunction("DATEDIF", new registerFunction());
		System.out.println("初始化DATEDIF函数成功！！");
	}
}
