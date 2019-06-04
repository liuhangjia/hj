package com.abm.manager.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

import org.apache.log4j.Logger;


public class FileIOUtil {
	private static Logger logger = Logger.getLogger("FileIOUtil");
	public static String uploadFile(File uploadfile,String uploadfileFileName,boolean deleteOriginalFile) throws Exception
	{
		FileInputStream fis = null;
		FileOutputStream fos = null;
		byte[] buffer = new byte[1024];
		int length = -1;
		String dest = null;
		try
		{
			if(uploadfile!=null&&uploadfileFileName!=null&&uploadfileFileName.trim().length()>0)
			{
				fis = new FileInputStream(uploadfile);
				String uuid = UUID.randomUUID().toString();
				File rootdir = new File(Config.filedir);
				if(!rootdir.exists()||!rootdir.isDirectory())
				{
					rootdir.mkdir();
				}
				File destdir = new File(rootdir,"/"+uuid);
				
				File filedir = new File(Config.filedir);
				if(!filedir.exists())
				{
					filedir.mkdir();
				}

				if(!destdir.exists())
				{
					if(destdir.mkdir())
					{
						dest = Config.filedir+"/"+uuid+"/"+uploadfileFileName;
						File destFile = new File(dest);
						fos = new FileOutputStream(destFile);
						while((length=fis.read(buffer))>-1)
						{
							fos.write(buffer,0,length);
						}
						
					}
				}
			}
			return dest;
		}
		catch(Exception e)
		{
			throw e;
		}
		finally
		{
			if(fis!=null)
			{
				try {
					fis.close();
				} catch (IOException e) {
					
				}
			}
			if(fos!=null)
			{
				try {
					fos.close();
				} catch (IOException e) {
					
				}
			}
			if(uploadfile!=null)
			{
				if(deleteOriginalFile)
				{
					uploadfile.delete();
					if(uploadfile.exists())
					{
						logger.error("文件："+uploadfile.getAbsolutePath()+"没有被删除掉");
					}
				}
			}
			
		}
	}
	
	
	
	
	
	
	
	public static String copyFile(String pathFileName) {
		int index = pathFileName.lastIndexOf("/");
		if(index>-1&&index<pathFileName.length()-1)
		{
//			String dirName = pathFileName.substring(0, index);
			String fileName = pathFileName.substring(index+1);
			File destFile = new File(Config.filedir,"copy"+fileName);
			FileInputStream fis = null;
			FileOutputStream fos = null;
			try
			{
				fis = new FileInputStream(new File(pathFileName));
				fos = new FileOutputStream(destFile);
				byte[] buffer = new byte[1024];
				int length = -1;
				while((length=fis.read(buffer))>-1)
				{
					fos.write(buffer,0,length);
				}
			}
			catch(Exception e)
			{
				
			}
			finally
			{
				if(fis!=null)
				{
					try {
						fis.close();
					} catch (IOException e) {
						
					}
				}
				if(fos!=null)
				{
					try {
						fos.close();
					} catch (IOException e) {
						
					}
				}
			}
			return "copy"+fileName;
		}
		return null;
	}

	
}
