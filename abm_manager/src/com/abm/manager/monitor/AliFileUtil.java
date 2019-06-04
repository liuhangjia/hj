package com.abm.manager.monitor;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;

import com.abm.common.dao.AlarmDeviceDao;
import com.abm.common.model.AlarmDeviceModel;
import com.abm.common.model.AlarmLogModel;
import com.abm.common.model.UploadFileModel;
import com.abm.common.service.AlarmLogService;
import com.abm.common.service.UploadFileService;
import com.abm.common.utils.Constants;
import com.abm.manager.util.Config;
import com.abm.manager.util.VideoConverter;
import com.aliyun.oss.ClientException;
import com.aliyun.oss.OSSClient;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.model.GetObjectRequest;
import com.aliyun.oss.model.ListObjectsRequest;
import com.aliyun.oss.model.OSSObject;
import com.aliyun.oss.model.OSSObjectSummary;
import com.aliyun.oss.model.ObjectListing;
import com.mw.common.utils.DateUtil;

public class AliFileUtil {
	private static String endpoint = "http://oss-cn-beijing.aliyuncs.com";
    private static String accessKeyId = "LTAILnrHHEchap9D";
    private static String accessKeySecret = "TmHFVAvsFqg6IJYVNuMwrbzoDz8azi";
    private static String bucketName = "yxbbucket001";
	public static void downloadFile(String device_id,String log_id,String start_time)
	{
		System.out.println("ready to handle start="+start_time);
		AlarmDeviceModel camera = AlarmDeviceDao.getSingle().executeQueryById(device_id);
		if(camera==null)
		{
			return ;
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    	// 创建OSSClient实例。
    	OSSClient ossClient = new OSSClient(endpoint, accessKeyId, accessKeySecret);
    	long startl = 0;
    	long endl = 0;
    	String start = "";
    	try
    	{
    		Date d = sdf.parse(start_time);
    		startl = d.getTime();
    		endl = startl + 5*60*1000;
    		start = String.valueOf(d.getTime()/1000);
    		start = start.substring(0,start.length()-2);
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    	}
    	// 指定每页200个文件。
    	final int maxKeys = 100;
    	//根据起始时间的秒数截取后两位查找最近的ts文件名
    	ObjectListing objectListing = ossClient.listObjects(bucketName, "testvedio/record/"+camera.getUser_name()+"/"+camera.getPasswd()+"/"+start);
    	    
    	List<OSSObjectSummary> sums = objectListing.getObjectSummaries();
    	if(sums!=null&&sums.size()>0)
    	{
    		
    		//以第一个文件名作为marker，查找后续的文件名
    		String marker = sums.get(0).getKey();
    		System.out.println("find first key="+marker);
    		objectListing = ossClient.listObjects(new ListObjectsRequest(bucketName)
            .withMarker(marker).withMaxKeys(maxKeys));
    		sums = objectListing.getObjectSummaries();
    		if(objectListing!=null&&sums!=null&&sums.size()>0)
    		{
    			
    			boolean hasEnd = false;
    			List<String> toDownloadFiles = new ArrayList<String>();
    			for (OSSObjectSummary s : sums) {
    				if(s.getKey().endsWith(".ts"))
    				{
	    				System.out.println(s.getKey()+"---"+sdf.format(s.getLastModified()));
	        	        if(s.getLastModified().getTime()<=endl)
	        	        {
	        	        	toDownloadFiles.add(s.getKey());
	        	        }
	        	        else
	        	        {
	        	        	hasEnd = true;
	        	        	break;
	        	        }
    				}
    				
        	        
        	    }
    			System.out.println("hasend="+hasEnd);
    			//已经录制完成
    			if(hasEnd)
    			{
    				//创建临时文件夹
    				File dest = new File(Config.filedir,UUID.randomUUID().toString());
    				dest.mkdir();
    				//下载文件
    				for(String fileName : toDownloadFiles)
    				{
    					try {
							saveToFile(ossClient,fileName,dest);
						} catch (IOException e) {
							
						}
    				}
    				System.out.println("find download finish="+hasEnd);
    				ossClient.shutdown();
    				//合并文件
    				VideoConverter.mergeAndConvert(dest, new File(dest,"output.mp4"));
    				//插入日志
    				UploadFileModel toAdd = new UploadFileModel();
    				AlarmLogModel log = AlarmLogService.getSingle().getById(log_id);
    				if(log.getAlarmDeviceModel()!=null)
					{
    					toAdd.setName(log.getAlarmDeviceModel().getName()+start_time+"报警视频");
    					toAdd.setBak(log.getAlarmDeviceModel().getAddr());
					}
					else
					{
						toAdd.setName(start_time+"报警视频");
					}
    				toAdd.setRes_type(Constants.FILE_TYPE_VIDEO);
    				toAdd.setRes_id(log_id);
    				toAdd.setUpload_id("admin");
    				toAdd.setUpload_name("admin");
					
    				toAdd.setUpload_time(DateUtil.now());
					if(new File(dest,"output.mp4").exists())
					{
						toAdd.setFile_name(new File(dest,"output.mp4").getAbsolutePath());
					}
					
    				UploadFileService.getSingle().add(toAdd);
    			}
    			else
    			{
    				ossClient.shutdown();
    				if(System.currentTimeMillis()-startl>30*60*1000)
            		{
            			System.out.println("end for no end");
    					return;
            		}
            		else
            		{
            			final String deviceId = device_id;
            			final String logId = log_id;
            			final String startTime = start_time;
            			new Timer().schedule(new TimerTask(){

            				public void run() {
            					// TODO Auto-generated method stub
            					downloadFile(deviceId,logId,startTime);
            				}
            				
            			}, 60*1000);
            		}
    			}
    		}
    		else
    		{
    			ossClient.shutdown();
    			if(System.currentTimeMillis()-startl>30*60*1000)
        		{
    				System.out.println("end for no files");
    				return;
        		}
        		else
        		{
        			final String deviceId = device_id;
        			final String logId = log_id;
        			final String startTime = start_time;
        			new Timer().schedule(new TimerTask(){

        				public void run() {
        					// TODO Auto-generated method stub
        					downloadFile(deviceId,logId,startTime);
        				}
        				
        			}, 60*1000);
        		}
    		}
    	}
    	else
    	{
    		ossClient.shutdown();
    		if(System.currentTimeMillis()-startl>30*60*1000)
    		{
    			System.out.println("end for no first file");
    			return;
    		}
    		else
    		{
    			final String deviceId = device_id;
    			final String logId = log_id;
    			final String startTime = start_time;
    			new Timer().schedule(new TimerTask(){

    				public void run() {
    					// TODO Auto-generated method stub
    					downloadFile(deviceId,logId,startTime);
    				}
    				
    			}, 60*1000);
    		}
    	}
		
	}
	
	 private static void saveToFile(OSSClient client,String fileName,File destDir) throws IOException {
    	
        try {
            
            
            OSSObject object = client.getObject(new GetObjectRequest(bucketName, fileName));
            System.out.println("Content-Type: "  + object.getObjectMetadata().getContentType());
            InputStream input =  object.getObjectContent();
            FileOutputStream fos = new FileOutputStream(new File(destDir,fileName.substring(fileName.lastIndexOf("/")+1)));
	        int length = 0;
	        byte[] buffer = new byte[512];
	        while((length=input.read(buffer))>0)
	        {
	        	fos.write(buffer,0,length);
	        }
	        fos.close();
	        input.close();
        } catch (OSSException oe) {
            System.out.println("Caught an OSSException, which means your request made it to OSS, "
                    + "but was rejected with an error response for some reason.");
            System.out.println("Error Message: " + oe.getErrorCode());
            System.out.println("Error Code:       " + oe.getErrorCode());
            System.out.println("Request ID:      " + oe.getRequestId());
            System.out.println("Host ID:           " + oe.getHostId());
        } catch (ClientException ce) {
            System.out.println("Caught an ClientException, which means the client encountered "
                    + "a serious internal problem while trying to communicate with OSS, "
                    + "such as not being able to access the network.");
            System.out.println("Error Message: " + ce.getMessage());
        } 
    	
        
    }

}
