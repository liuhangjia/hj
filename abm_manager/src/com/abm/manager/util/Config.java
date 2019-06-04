package com.abm.manager.util;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

public class Config  {
	
	public static String filedir = "";
	public static String default_passwd = "";
	public static String debug ="";
	public static String tmpDir = "";
	
	public static String is_open_task = "";
	
	public static String task_url = "";
	
	public static String task_wsdl = "";
	
	public static String app_id = "";
	
	public static int sa_listen_port = 0;
	public static int szw_listen_port = 0;
	
	public static String ffmpeg_path = "";
	
	public static String local_ip = "";
	
	public static String face_adapter_ip = "";
	public static int face_adapter_port = 0;
	
	
	static {
		Properties p = new Properties();
		try {
			p.load(Config.class.getClassLoader().getResourceAsStream("config.properties"));
		} catch (IOException e) {
			e.printStackTrace();
		}
		filedir = p.getProperty("filedir");
		tmpDir = filedir + "\\tmp";
		File fileTmpDir = new File(tmpDir);
		if(!fileTmpDir.exists()){
			fileTmpDir.mkdirs();
		}
		default_passwd = p.getProperty("default_passwd");
		debug = p.getProperty("debug");
		
		is_open_task = p.getProperty("is_open_task");
		task_url = p.getProperty("task_url");
		task_wsdl = p.getProperty("task_wsdl");
		app_id = p.getProperty("app_id");
		
		sa_listen_port= Integer.parseInt(p.getProperty("sa_listen_port"));
		szw_listen_port= Integer.parseInt(p.getProperty("szw_listen_port"));
		
		ffmpeg_path = p.getProperty("ffmpeg_path");
		local_ip = p.getProperty("local_ip");
		
		face_adapter_ip = p.getProperty("face_adapter_ip");
		if(p.getProperty("face_adapter_port")!=null&&p.getProperty("face_adapter_port").trim().length()>0)
		{
			face_adapter_port = Integer.parseInt(p.getProperty("face_adapter_port"));
		}
	}
}
