package com.abm.manager.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.Comparator;

public class VideoConverter {
//	public static final String FORMAT_AVI = "avi";
//	public static final String FORMAT_MP4 = "mp4";
	public static void convert(File source,File target)
	{
		Runtime run = null;    
		
		try {    
			run = Runtime.getRuntime();
//			String cmd = Config.ffmpeg_path + " -i " + source.getAbsolutePath() + " " + target;
			String cmd = "ffmpge -i \"concat:1554957904_10362.ts|1554957936_10363.ts|1554957968_10364.ts\" -acodec copy -vcodec copy -absf aac_adtstoasc output.mp4";
			Process p=run.exec(cmd); 
			
			//释放进程    
			p.getOutputStream().close();    
			p.getInputStream().close();    
			InputStream stderr = p.getErrorStream();
			InputStreamReader isr = new InputStreamReader(stderr);
            BufferedReader br = new BufferedReader(isr);
            while ( br.readLine() != null){
            	
            }
            stderr.close();  
			p.waitFor();      
			
			
		} catch (Exception e) {    
			e.printStackTrace();    
		}finally{    
			run.freeMemory();    
		}  

	}
	
	
	
	public static void mergeAndConvert(File destDir,File target)
	{
		Runtime run = null;    
		
		try {   
			File[] files = destDir.listFiles();
			if(files!=null)
			{
				Arrays.sort(files, new Comparator(){
	
					@Override
					public int compare(Object o1, Object o2) {
						// TODO Auto-generated method stub
						File f1 = (File)o1;
						File f2 = (File)o2;
						
						if(Integer.parseInt(f1.getName().substring(f1.getName().lastIndexOf("_")+1,f1.getName().lastIndexOf(".")))
								>Integer.parseInt(f2.getName().substring(f2.getName().lastIndexOf("_")+1,f2.getName().lastIndexOf("."))))
						{
							return 1;
						}
						return -1;
					}
					
				});
				String listFile = "";
				for(File f: files)
				{
					listFile = listFile+"|"+f.getAbsolutePath();
				}
				
				run = Runtime.getRuntime();
//				String cmd = Config.ffmpeg_path+" -i \"concat:"+listFile.substring(1)+"\" -acodec copy -vcodec copy -absf aac_adtstoasc "+target.getAbsolutePath();
				String cmd = Config.ffmpeg_path+" -i concat:"+listFile.substring(1)+" -acodec copy -vcodec copy -absf aac_adtstoasc "+target.getAbsolutePath();
				System.out.println(cmd);
				Process p=run.exec(cmd); 
				//释放进程    
				p.getOutputStream().close();    
				p.getInputStream().close();    
				InputStream stderr = p.getErrorStream();
				InputStreamReader isr = new InputStreamReader(stderr);
	            BufferedReader br = new BufferedReader(isr);
	            while ( br.readLine() != null){
	            	
	            }
	            stderr.close();  
				p.waitFor();      
			}
			
			
			
		} catch (Exception e) {    
			e.printStackTrace();    
		}finally{    
			run.freeMemory();    
		}  

	}

}
