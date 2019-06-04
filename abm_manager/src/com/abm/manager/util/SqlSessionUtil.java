package com.abm.manager.util;

import java.io.InputStream;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class SqlSessionUtil {

	public static SqlSession getSqlSession(){
		try {
			String resource = "mybatis-config.xml";
			InputStream inputStream = Resources.getResourceAsStream(resource);
			SqlSessionFactory sqlSessionFactory = null;
			sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
			SqlSession sqlSession = sqlSessionFactory.openSession();
			return sqlSession;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static void closeSqlSession(SqlSession sqlSession){
		try {
			if(null!=sqlSession){
				sqlSession.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
