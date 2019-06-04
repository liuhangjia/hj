package com.abm.manager.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import com.abm.common.model.AccountsModel;
import com.abm.common.model.AlarmDeviceModel;
import com.abm.common.model.AlarmLogModel;
import com.abm.common.model.UploadFileModel;
import com.abm.common.service.AccountsService;
import com.abm.common.service.AlarmDeviceService;
import com.abm.common.service.AlarmLogService;
import com.abm.common.service.SysLogService;
import com.abm.common.service.UploadFileService;
import com.abm.common.utils.Constants;
import com.abm.common.utils.StringUtil;
import com.abm.manager.BaseAction;
import com.abm.manager.monitor.AliFileUtil;
import com.abm.manager.util.Config;
import com.abm.manager.util.FileIOUtil;
import com.abm.manager.util.VideoConverter;
import com.mw.common.utils.DateUtil;

public class VideoAction extends BaseAction{
	private UploadFileService fileService = UploadFileService.getSingle();
	private File[] uploadfile;
	/** 上传文件名 */
	private String[] uploadfileFileName;
	private String id;
	private String accountId;
	public File[] getUploadfile() {
		return uploadfile;
	}
	public void setUploadfile(File[] uploadfile) {
		this.uploadfile = uploadfile;
	}
	public String[] getUploadfileFileName() {
		return uploadfileFileName;
	}
	public void setUploadfileFileName(String[] uploadfileFileName) {
		this.uploadfileFileName = uploadfileFileName;
	}
	
	
	
	
	
	public void setId(String id) {
		this.id = id;
	}
	
	
	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}
	
	
	
	public String upload()
	{
		//复制文件，生成路径，存储到数据库中
		String result = "";
//		AccountsModel currentUser = (AccountsModel)getSession().getAttribute(Constants.USER);
		if(uploadfile!=null&&uploadfile.length>0)
		{
			List<UploadFileModel> files = new ArrayList<UploadFileModel>();
			AlarmLogModel log = AlarmLogService.getSingle().getById(id);
			AccountsModel accounts = AccountsService.getSingle().getById(accountId);
			if(log==null)
			{
				sendResult( "{\"success\":false,\"msg\":\"上传视频文件失败:找不到对应的告警日志\"}");
				return NONE;
			}
			try
			{
				
				for(int i=0;i<uploadfile.length;i++)
				{
					String dest = "";
					if(uploadfileFileName[i].endsWith(".mp4"))
					{
						dest = FileIOUtil.uploadFile(uploadfile[i], uploadfileFileName[i].substring(0,uploadfileFileName[i].lastIndexOf("."))+".avc", true);
					}
					else
					{
						dest = FileIOUtil.uploadFile(uploadfile[i], uploadfileFileName[i], true);
					}
					
					File destFile = new File(dest);
					String newFileName = destFile.getName().substring(0,destFile.getName().lastIndexOf("."))+"_t.mp4";
					File newFile = new File(destFile.getParentFile(),newFileName);
					VideoConverter.convert(destFile, newFile);
					
					UploadFileModel file = new UploadFileModel();
					String now = DateUtil.toyyyyMMddHHmmss(new Date());
					if(log.getAlarmDeviceModel()!=null)
					{
						file.setName(log.getAlarmDeviceModel().getName()+now+"报警视频");
						file.setBak(log.getAlarmDeviceModel().getAddr());
					}
					else
					{
						file.setName(now+"报警视频");
					}
					file.setRes_type(Constants.FILE_TYPE_VIDEO);
					file.setRes_id(id);
					file.setUpload_id(accountId);
					if(accounts!=null)
					{
						file.setUpload_name(accounts.getName());
					}
					file.setUpload_time(DateUtil.now());
					if(newFile.exists())
					{
						file.setFile_name(newFile.getAbsolutePath());
					}
					else
					{
						file.setFile_name(dest);
					}
					files.add(file);
				}
				int ret = fileService.add(files);
				if(ret==0)
				{
					result = "{\"success\":true,\"msg\":\"上传视频文件成功\"}";
					SysLogService.getSingle().log(accounts.getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_UPLOAD_VIDEO, "", Constants.SysLog.RESULT_SUCCESS);
				}
				else
				{
					result = "{\"success\":false,\"msg\":\"上传视频文件失败\"}";
					SysLogService.getSingle().log(accounts.getAccount(), getRequest().getRemoteAddr(), Constants.SysLog.TYPE_UPLOAD_VIDEO, "", Constants.SysLog.RESULT_SUCCESS);
				}
			}
			catch(Exception e)
			{
				e.printStackTrace();
				result = "{\"success\":false,\"msg\":\"上传视频文件失败\"}";
			}
		}
		else
		{
			result = "{\"success\":false,\"msg\":\"上传视频文件失败\"}";
		}
		sendResult(result);
		return NONE;
	}
	
	
	public String list()
	{
		String results = null;
		String condition = " and res_type=?   ";
		String[] conditionParams = new String[]{Constants.FILE_TYPE_VIDEO};
		Map<String,String> conditions = parseCondition();
		
		
		for(String key:conditions.keySet())
		{
			String value = conditions.get(key);
			if(value!=null&&value.trim().length()>0)
			{
				if( "name".equals(key))
				{
					condition = condition + " and name like '%"+value+"%' ";
				}
				else if( "uploader".equals(key))
				{
					condition = condition + " and upload_name like '%"+value+"%' ";
				}
				else if( "start".equals(key))
				{
					
					condition = condition + " and upload_time >= '"+value+"' ";
				}
				else if( "end".equals(key))
				{
					
					condition = condition + " and upload_time < '"+value+"' ";
				}

			}
		}
		
		int total = fileService.getTotal(condition,conditionParams);
		List<UploadFileModel> ret = fileService.queryByPage(condition,conditionParams, page, rows, parseSorter(), parseDirect());
		if(ret!=null)
		{
			results =  JSONArray.fromObject(ret).toString();
		}
		else
		{
			results = "[]";
		}
		results = "{\"success\":true,\"total\":\""+total+"\",\"rows\":"+results+"}";
		sendResult(results);
		return NONE;
	}
	
	public String download()
	{
		if(StringUtil.isEmpty(id))
		{
			return NONE;
		}
		
		UploadFileModel video = fileService.getById(id);
		if(video==null)
		{
			return NONE;
		}
		try
		{
			HttpServletResponse response = getResponse();
			response.setContentType("application/x-download;charset=UTF-8");
			OutputStream out = null;
	        
	        String fileName = video.getName();
	        String filePath = video.getFile_name();
	        if(filePath==null)
	        {
	        	return NONE;
	        }
	        response.setHeader("Content-Disposition", "attachment;filename=\""+new String(fileName.getBytes(),"ISO-8859-1")+"."+filePath.substring(filePath.lastIndexOf(".")+1)+"\"");
	        out = response.getOutputStream();
	        File destFile = new File(filePath);
	        if(!destFile.isFile()||!destFile.exists())
	        {
	        	return NONE;
	        }
	        FileInputStream fis = new FileInputStream(destFile);
	        int length =-1;
	        byte[] buffer =new byte[512];
	        while((length=fis.read(buffer))>0)
	        {
	        	out.write(buffer, 0, length);
	        }
	        out.flush();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		return NONE;
		
	}
	
	
	public String show()
	{
		if(StringUtil.isEmpty(id))
		{
			return NONE;
		}
		
		UploadFileModel video = fileService.getById(id);
		if(video==null)
		{
			return NONE;
		}
		try
		{
			HttpServletResponse response = getResponse();
			response.setContentType("video/mp4;charset=UTF-8");
			OutputStream out = null;
	        
	        String fileName = video.getName();
	        String filePath = video.getFile_name();
	        if(filePath==null)
	        {
	        	return NONE;
	        }
//	        response.setHeader("Content-Disposition", "attachment;filename=\""+new String(fileName.getBytes(),"ISO-8859-1")+"."+filePath.substring(filePath.lastIndexOf(".")+1)+"\"");
	        out = response.getOutputStream();
	        File destFile = new File(filePath);
	        if(!destFile.isFile()||!destFile.exists())
	        {
	        	return NONE;
	        }
	        FileInputStream fis = new FileInputStream(destFile);
	        int length =-1;
	        byte[] buffer =new byte[512];
	        while((length=fis.read(buffer))>0)
	        {
	        	out.write(buffer, 0, length);
	        }
	        fis.close();
	        out.flush();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		return NONE;
	}
	
	
	public String test()
	{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		final String date_str = sdf.format(new Date());
		List<AlarmDeviceModel> cameras = AlarmDeviceService.getSingle().listNeighborCamera("5405429C4171410D99E2C9517AC3B4B3");
		if(cameras!=null)
		{
			final String logId = "DBA9415D898B4765BA2CC6B2C53E3FEC";
			final String alarm_time = date_str;
			for(final AlarmDeviceModel camera :cameras)
			{
				if(Constants.FACTORY_ALI.equalsIgnoreCase(camera.getFactory()))
				{
					
					new Timer().schedule(new TimerTask(){

						public void run() {
							
							AliFileUtil.downloadFile(camera.getId(), logId, alarm_time);
						}
						
					}, 60*3*1000);
				}
			}
		}
		
		
//		new Timer().schedule(new TimerTask(){
//
//			public void run() {
//				
//				
//				AliFileUtil.downloadFile("927F4FE4BB1C408D9681ED4CCB64DE38", "108F5486E63D47A881644223EE5441F2", date_str);
//			}
//			
//		}, 60*2*1000);
		sendResult("success");
		return NONE;
	}
	
	
}
