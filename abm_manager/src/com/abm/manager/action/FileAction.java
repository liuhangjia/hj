package com.abm.manager.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import com.abm.common.dao.EmployeeDao;
import com.abm.manager.BaseAction;
import com.abm.manager.util.Config;
import com.mw.common.utils.Common;
import com.mw.common.utils.FileIOUtil;
import com.mw.common.utils.StringUtil;


import net.sf.json.JSONObject;

public class FileAction extends BaseAction{
	
	private String uploadfileFileName;	//上传文件名
	private File uploadfile;			//上传文件
	private String imageName;			//图片名
	private String fileName;
	private String contentType;
	private String emp_id;
	private String type;//photo,idcard_front,idcard_back
	
	public void uploadEmpAttendanceImg(){
		JSONObject rv=new JSONObject();
		boolean flag=false;
		rv.element(SUCCESS, flag);
		rv.element(MSG, "上传失败");
		try {
			if(null==uploadfile){
				rv.element(MSG, "请选择文件");
				sendResult(rv);
				return;
			}
			if(StringUtil.isNotEmpty(uploadfileFileName)){
				try {
					String suffix = uploadfileFileName.substring(uploadfileFileName.lastIndexOf(".") + 1);
					String toFileName = "kaoqin"+System.currentTimeMillis()+"." + suffix;
					if(FileIOUtil.uploadFile(Config.filedir,uploadfile, toFileName, true)){
						JSONObject file_json=new JSONObject();
						file_json.element("yuan_filename", uploadfileFileName);
						file_json.element("save_filename", toFileName);
						flag=true;
						rv.element(MSG, "上传成功");
						rv.element("yuan_filename", uploadfileFileName);
						rv.element("save_filename", toFileName);
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		rv.element(SUCCESS, flag);
		sendResult(rv);
	}
	
	public void uploadEmpImg(){
		JSONObject rv=new JSONObject();
		boolean flag=false;
		rv.element(SUCCESS, flag);
		rv.element(MSG, "上传失败");
		try {
			if(null==uploadfile){
				rv.element(MSG, "请选择文件");
				sendResult(rv);
				return;
			}
			if(StringUtil.isEmpty(emp_id)){
				rv.element(MSG, "找不到安保精英信息");
				sendResult(rv);
				return;
			}
			if(StringUtil.isNotEmpty(uploadfileFileName) && StringUtil.isNotEmpty(type)){
				try {
					String suffix = uploadfileFileName.substring(uploadfileFileName.lastIndexOf(".") + 1);
					String toFileName = emp_id+"_"+type+ "." + suffix;
					if(FileIOUtil.uploadFile(Config.filedir,uploadfile, toFileName, true)){
						JSONObject file_json=new JSONObject();
						file_json.element("yuan_filename", uploadfileFileName);
						file_json.element("save_filename", toFileName);
						String sql="update employee set "+type+"=? where id=? ";
						if(EmployeeDao.getSingle().execute(sql, new String[]{file_json.toString(),emp_id})){
							flag=true;
							rv.element(MSG, "上传成功");
							rv.element("yuan_filename", uploadfileFileName);
							rv.element("save_filename", toFileName);
						}
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		rv.element(SUCCESS, flag);
		sendResult(rv);
	}

	public String getImage(){
		if(StringUtil.isEmpty(imageName)){
			return NONE;
		}
		if(StringUtils.contains(imageName, "./") || StringUtils.contains(imageName, "../")){
			return NONE;
		}
		if(StringUtils.contains(imageName, ".\\") || StringUtils.contains(imageName, "..\\")){
			return NONE;
		}
		String filePathName = Config.filedir + File.separator + imageName;
		OutputStream os = null;
		FileInputStream fis = null;
		try{
			//从response获得输出流
			HttpServletRequest req = getRequest();
			HttpServletResponse resp = getResponse();
			File iFile = new File(filePathName);
			if(!iFile.exists()){
				return NONE;
			}
			long header = req.getDateHeader("If-Modified-Since");
			if(header > 0 && (header+5000) >= iFile.lastModified()) {
				resp.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
				return NONE;
			}
			
			resp.addHeader("Cache-Control", "private");
			resp.addDateHeader("Last-Modified", iFile.lastModified());
			os = resp.getOutputStream();
			if(imageName!=null&&imageName.trim().length()>0){
				//文件输入流
				fis = new FileInputStream(filePathName);
				//缓冲区
				byte[] b = new byte[1024];			
				int i = 0;
				//循环：从文件输入流中读取一定的字节到缓冲区，i表示读取的字节数
				//到达文件末尾时，返回-1
				while ((i = fis.read(b)) > 0){
					//输出流输出：缓冲区从0开始，i长度个字节
					os.write(b, 0, i);
				}
			}
			//输出流内字节全部发送
			os.flush();
		}catch(Exception e){
		}finally{
			try{
				if (fis != null) fis.close();
				if (os != null) os.close();
			}catch (Exception e1){
			}
		}
		return NONE;
	}
	
	public String getEmp_id() {
		return emp_id;
	}

	public void setEmp_id(String emp_id) {
		this.emp_id = emp_id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}



	public String getUploadfileFileName() {
		return uploadfileFileName;
	}



	public void setUploadfileFileName(String uploadfileFileName) {
		this.uploadfileFileName = uploadfileFileName;
	}



	public File getUploadfile() {
		return uploadfile;
	}



	public void setUploadfile(File uploadfile) {
		this.uploadfile = uploadfile;
	}



	public String getImageName() {
		return imageName;
	}



	public void setImageName(String imageName) {
		this.imageName = imageName;
	}



	public String getFileName() {
		return fileName;
	}



	public void setFileName(String fileName) {
		this.fileName = fileName;
	}



	public String getContentType() {
		return contentType;
	}



	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
	
}
