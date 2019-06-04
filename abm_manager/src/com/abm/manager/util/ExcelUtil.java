package com.abm.manager.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFCellUtil;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelUtil {
	
	public synchronized static String getCellStringValue(HSSFCell cell){
		if(null==cell){
			return "";
		}
		try {
			cell.setCellType(HSSFCell.CELL_TYPE_STRING);
			return cell.getStringCellValue();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
	
	public synchronized static String getCellValue(HSSFCell cell){
		String value="";
		if(cell==null){
			return value;
		}
		try{
			switch(cell.getCellType()){
				case HSSFCell.CELL_TYPE_STRING:
					value = cell.getStringCellValue();
					if(StringUtils.isBlank(value)||StringUtils.isEmpty(value)){
						value = "";
					}
					break;
				case HSSFCell.CELL_TYPE_NUMERIC:
					value = String.valueOf(cell.getNumericCellValue());
					break;
				case HSSFCell.CELL_TYPE_BOOLEAN:
					value = ""+ cell.getBooleanCellValue();
					break;
				case HSSFCell.CELL_TYPE_FORMULA:
					value = cell.getCellFormula();
					break;
				default:
					value = String.valueOf(cell.getStringCellValue());
					break;
			}
		}catch(Exception e){
			e.printStackTrace();
			value = "";
		}
		return value;
	}
	/**
	 * type(对齐方式): L 左  R 右 C 居中
	 * */
	 public static void setRegionStyle(HSSFRow row, int start, int end,HSSFWorkbook workbook,String type) {
		 HSSFCellStyle rowStyle = workbook.createCellStyle();
		 for (int j = start; j <= end; j++) {
			 HSSFCell cell = HSSFCellUtil.getCell(row, (short) j);
			
			 rowStyle.setBorderLeft(HSSFCellStyle.BORDER_THIN);
			 rowStyle.setBorderBottom(HSSFCellStyle.BORDER_THIN);
			 rowStyle.setBorderRight(HSSFCellStyle.BORDER_THIN);
			 rowStyle.setBorderTop(HSSFCellStyle.BORDER_THIN);
			 
			 if(StringUtils.equals("L", type)){
				 rowStyle.setAlignment(HSSFCellStyle.ALIGN_LEFT);
			 }else if(StringUtils.equals("R", type)){
				 rowStyle.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
			 }else if(StringUtils.equals("C", type)){
				 rowStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			 }else{
				 rowStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);
			 }
			 cell.setCellStyle(rowStyle);
		 }
	 }
	 public synchronized static HSSFWorkbook getWorkBook(HttpServletRequest request,HttpServletResponse response,String tmpFileName,String fileName){
		 try {
		 		POIFSFileSystem fs = new POIFSFileSystem(new  FileInputStream(request.getServletContext().getRealPath("/")+"/file/"+tmpFileName+"" ));
				response.setContentType("application/x-download;charset=UTF-8");
				if(StringUtils.isBlank(fileName) || StringUtils.isEmpty(fileName)){
					fileName = tmpFileName;
				}
				fileName = new String(fileName.substring(fileName.lastIndexOf("/")+1, fileName.length()).getBytes(),"ISO-8859-1");
				response.setHeader("Content-Disposition", "attachment;filename=\""+fileName+"\"");
		        return  new HSSFWorkbook(fs);
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			return null;
	 }
	 /**
	  * 设置导出文件request头,返回表格对象
	  * */
	 public synchronized static HSSFWorkbook getWorkBook(HttpServletRequest request,HttpServletResponse response,String tmpFileName){
		 	return getWorkBook(request,response,tmpFileName,null);
	 }
	 
	 /**
	  * 读取excel 第1张sheet （xls和xlsx）
	  * @param filePath	excel路径
	  * @param columns	列名（表头）
	  * @param fileContentType 文件后缀名
	  * @return
	  */
		public synchronized static List<Map<String, String>> readExcel(File file,List<Map<String, String>> columns,String fileContentType) {
			Sheet sheet = null;
			Row row = null;
			Row rowHeader = null;
			List<Map<String, String>> list = null;
			String cellData = null;
			Workbook wb = null;
			InputStream is = null;
			try {
				is = new FileInputStream(file);
				if (".xls".equals(fileContentType)) {
					wb = new HSSFWorkbook(is);
				} else if (".xlsx".equals(fileContentType)) {
					wb = new XSSFWorkbook(is);
				} else {
					wb = null;
				}
				if (wb != null) {
					// 用来存放表中数据
					list = new ArrayList<Map<String, String>>();
					// 获取第一个sheet
					sheet = wb.getSheetAt(0);
					// 获取最大行数
					int rownum = sheet.getPhysicalNumberOfRows();
					// 获取第一行
					rowHeader = sheet.getRow(0);
					row = sheet.getRow(0);
					// 获取最大列数
					int colnum = row.getPhysicalNumberOfCells();
					for (int i = 1; i < rownum; i++) {
						Map<String, String> map = new LinkedHashMap<String, String>();
						row = sheet.getRow(i);
						if (row != null) {
							for (int j = 0; j < colnum; j++) {
								Map<String, String> column = columns.get(j);
								String value = String.valueOf(excelUtil.getCellFormatValue(rowHeader.getCell(j)));
								if(column.get("header").equals(value)){
									cellData = (String) excelUtil.getCellFormatValue(row.getCell(j));
									map.put(column.get("name"), cellData);
								}
							}
						} else {
							break;
						}
						list.add(map);
					}
				}
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			return list;
		}
	 
		/**	获取单个单元格数据
		 * @param cell
		 * @return
		 * @author lizixiang ,2018-05-08
		 */
		public Object getCellFormatValue(Cell cell) {
			Object cellValue = null;
			if (cell != null) {
				// 判断cell类型
				switch (cell.getCellType()) {
				case Cell.CELL_TYPE_NUMERIC: {
					cellValue = String.valueOf(cell.getNumericCellValue());
					break;
				}
				case Cell.CELL_TYPE_FORMULA: {
					// 判断cell是否为日期格式
					if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
						// 转换为日期格式YYYY-mm-dd
						cellValue = cell.getDateCellValue();
					} else {
						// 数字
						cellValue = String.valueOf(cell.getNumericCellValue());
					}
					break;
				}
				case Cell.CELL_TYPE_STRING: {
					cellValue = cell.getRichStringCellValue().getString();
					break;
				}
				default:
					cellValue = "";
				}
			} else {
				cellValue = "";
			}
			return cellValue;
		}
	private static ExcelUtil excelUtil = new ExcelUtil();
	
	public static ExcelUtil getSingle(){
		if (null == excelUtil) {
			excelUtil = new ExcelUtil();
		}
		return excelUtil;
	}
	private ExcelUtil(){
		
	}
	 
	
	
	 
	 
}
