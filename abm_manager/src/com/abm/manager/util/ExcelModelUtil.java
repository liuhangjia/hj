package com.abm.manager.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.poi.hssf.usermodel.HSSFFormulaEvaluator;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.util.CellReference;

import com.mw.common.utils.StringUtil;

public class ExcelModelUtil {
	/**
	  * 解析excel生成json字符串
	  * @param workbook
	  * @return
	  */
	 public static String convertExcelToJSON(Workbook workbook) {
			// TODO Auto-generated method stub
//			int maxRowNum = 0;
//			int maxColumnNum = 0;

			String jsonString = "";
			JSONArray excelDetails = new JSONArray();
			
			FormulaEvaluator formulaEvaluator = new HSSFFormulaEvaluator((HSSFWorkbook) workbook);
			int totalColumns = 0;
			try {
				Sheet sheet = workbook.getSheetAt(0);
				int regions = sheet.getNumMergedRegions();
				
				
				DataFormatter formatter = new DataFormatter();
				
				int totalRows = sheet.getLastRowNum();
				//先遍历一遍，取到最多的列数
				
				for (int j=0;j<=totalRows;j++) {
					Row row = sheet.getRow(j);
					
					if(row!=null&&row.getLastCellNum()>totalColumns)
					{
						totalColumns = row.getLastCellNum();
					}
				}
				JSONArray width = new JSONArray();
				double totalWidth = 0;
				for(int j=0;j<totalColumns;j++)
				{
					totalWidth += sheet.getColumnWidth(j);
				}
				
				for (int j=0;j<=totalRows;j++) 
				{
					
					Row row = sheet.getRow(j);
					
					JSONArray rowDetail = new JSONArray();
//					maxRowNum = row.getRowNum();
					for(int k=0;k<totalColumns;k++)
					{
						Cell cell = null;
						if(row!=null)
						{
							cell = row.getCell(k);
						}
						
						JSONObject cellDetail = new JSONObject();
						
						if(cell==null)
						{
							cellDetail.element("df", "");
							cellDetail.element("locked", true);
							cellDetail.element("value","");
							cellDetail.element("bg", "rgb(255,255,255)");
							cellDetail.element("align", "center");
							cellDetail.element("width", (int)(sheet.getColumnWidth(k)*100/totalWidth));
//							cellDetail
							cellDetail.element("ColSpan",1);
							cellDetail.element("RowSpan",1);
							cellDetail.element("CellName", "");
							cellDetail.element("RowIndex", j);
							cellDetail.element("ColumnIndex", k);
							cellDetail.element("CellContent", "");
							JSONObject tmp = new JSONObject();
							tmp.element("Type","CELL_TYPE_BLANK");
							tmp.element("Formula","");
							cellDetail.element("CellType",tmp);
							rowDetail.add(cellDetail);
							continue;
						}
//						maxColumnNum = cell.getColumnIndex() > maxColumnNum ? cell.getColumnIndex() : maxColumnNum;
						int columnIndex = 0;
						int rowIndex = 0;
						rowIndex = j;
						columnIndex = cell.getColumnIndex();
						boolean ignore = false;
						cellDetail.element("df", cell.getCellStyle().getDataFormatString());
						
						
						cellDetail.element("locked", cell.getCellStyle().getLocked());
						if(cell.getCellStyle().getAlignment()== CellStyle.ALIGN_LEFT )
						{
							cellDetail.element("align","left");
						}
						else
						{
							cellDetail.element("align","center");
						}
						JSONObject color = JSONObject.fromObject(cell.getCellStyle().getFillForegroundColorColor());
						if(color.optString("triplet").equals("[0,0,0]"))
						{
							cellDetail.element("bg","rgb(255,255,255)");
						}
						else
						{
							cellDetail.element("bg", "rgb("+color.optString("triplet").substring(1,color.optString("triplet").length()-1)+")");
						}
						
						cellDetail.element("width", (int)(sheet.getColumnWidth(k)*100/totalWidth));
						cellDetail.element("ColSpan",1);
						cellDetail.element("RowSpan",1);
						
						for(int i=0;i<regions;i++)
						{
							if(rowIndex>=sheet.getMergedRegion(i).getFirstRow()&&columnIndex>=sheet.getMergedRegion(i).getFirstColumn()
								&&rowIndex<=sheet.getMergedRegion(i).getLastRow()&&columnIndex<=sheet.getMergedRegion(i).getLastColumn())
							{
								if(rowIndex==sheet.getMergedRegion(i).getFirstRow()&&columnIndex==sheet.getMergedRegion(i).getFirstColumn())
								{
									cellDetail.element("ColSpan", sheet.getMergedRegion(i).getLastColumn()-sheet.getMergedRegion(i).getFirstColumn()+1);
									cellDetail.element("RowSpan", sheet.getMergedRegion(i).getLastRow()-sheet.getMergedRegion(i).getFirstRow()+1);
								}
								else
								{
									ignore = true;
									continue;
								}
								break;
							}
							
						}
						if(ignore)
						{
							continue;
						}
						String cellTypeName = "";
						JSONObject columnType = new JSONObject();
						
						
						
						CellReference cellRef = new CellReference(rowIndex, columnIndex);
						// System.out.println(rowIndex + "---" + columnIndex);

						// 单元格名称
						// System.out.print("cellRef:--" + cellRef.formatAsString());
//						rowDetail.put(cellRef.formatAsString(), "columnName");
						cellDetail.element("CellName", cellRef.formatAsString());
						cellDetail.element("RowIndex", rowIndex);
						cellDetail.element("ColumnIndex", columnIndex);

						
//						System.out.println(cellRef.formatAsString()+"--"+cell.getCellStyle().getDataFormat()+"--"+cell.getCellStyle().getDataFormatString());
						

						// 通过获取单元格值并应用任何数据格式（Date，0.00，1.23e9，$ 1.23等），获取单元格中显示的文本
						String content = formatter.formatCellValue(cell);
						// System.out.println("CellValue:--" + content);
						cellDetail.element("CellContent", content);
						// 获取值并自己格式化
						switch (cell.getCellType()) {
						case Cell.CELL_TYPE_STRING:// 字符串型
							cellTypeName = "CELL_TYPE_STRING";
							// System.out.println("typeString:" +
							 cellDetail.element("value", cell.getRichStringCellValue().getString());
							break;
						case Cell.CELL_TYPE_NUMERIC:// 数值型
							if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) { // 如果是date类型则 ，获取该cell的date值
								cellTypeName = "CELL_TYPE_Date";
								// System.out.println("typeNumber0:" + cell.getDateCellValue());
								cellDetail.element("value", cell.getDateCellValue());
							} else {// 纯数字
								cellTypeName = "CELL_TYPE_NUMERIC";
								// System.out.println("typeNumber1:" + cell.getNumericCellValue());
								cellDetail.element("value",cell.getNumericCellValue());
							}
							break;
						case Cell.CELL_TYPE_BOOLEAN:// 布尔
							cellTypeName = "CELL_TYPE_BOOLEAN";
							// System.out.println("typeBoolean:" + cell.getBooleanCellValue());
							cellDetail.element("value",cell.getBooleanCellValue());
							break;
						case Cell.CELL_TYPE_FORMULA:// 公式型
							cellTypeName = "CELL_TYPE_FORMULA";
							// System.out.println("typeFormula:" + cell.getCellFormula());
							cellDetail.element("value","");
							break;
						case Cell.CELL_TYPE_BLANK:// 空值
							cellTypeName = "CELL_TYPE_BLANK";
							// System.out.println("Blank");
							cellDetail.element("value","");
							break;
						case Cell.CELL_TYPE_ERROR: // 故障
							cellTypeName = "CELL_TYPE_ERROR";
							// System.out.println("Error");
							cellDetail.element("value","");
							break;
						default:
							cellTypeName = "CELL_TYPE_OTHER";
							// System.out.println("Others");
							cellDetail.element("value","");
						}
						columnType.element("Type", cellTypeName);
						if (cellTypeName.equals("CELL_TYPE_FORMULA")) {
							columnType.element("Formula", content);
							cellDetail.element("value","");
							try
							{
								cellDetail.element("CellContent",formatter.formatCellValue(cell, formulaEvaluator));
							}
							catch(Exception e)
							{
								cellDetail.element("CellContent","");
							}
							
						} else {
							columnType.element("Formula", "");
						}

						cellDetail.element("CellType", columnType);
						
						rowDetail.add(cellDetail);
						
					}
					excelDetails.add(rowDetail);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			JSONObject obj = new JSONObject();
//			obj.element("MaxRow", maxRowNum);
			obj.element("MaxColumn", totalColumns);
//			obj.element("Details", excelDetails);
			
//			System.out.println("maxRow:" + maxRowNum + "---maxCol:" + maxColumnNum);
			obj.element("data", excelDetails);
			jsonString = obj.toString();
			return jsonString;
		}
	 public static Workbook openExcel(File file) {

			InputStream inputStream = null;
			Workbook workbook = null;
			try {
				inputStream = new FileInputStream(file);
				workbook = WorkbookFactory.create(inputStream);
			} catch (Exception e) {
				e.printStackTrace();
			}

			return workbook;
	 }
	 
	 public static Workbook convertJSONToExcel(String bookJson) {
			Workbook workbook = new HSSFWorkbook();
			Sheet sheet = workbook.createSheet("sheet1");
			
			JSONArray excelInfo = JSONObject.fromObject(bookJson).optJSONArray("data");
			for(int i=0;i<excelInfo.size();i++)
			{
				JSONArray rowObj = excelInfo.optJSONArray(i);
				for(int j=0;j<rowObj.size();j++)
				{
					JSONObject cell = rowObj.getJSONObject(j);
					String cellName =  cell.optString("CellName");
					String cellContent =  cell.optString("CellContent");
					JSONObject cellType = cell.optJSONObject("CellType");
					int rowNum = cell.optInt("RowIndex");
					int columnNum =  cell.optInt("ColumnIndex");
					Row row = sheet.getRow(rowNum);
					if (row == null) {
						row = sheet.createRow(rowNum);
					}

					// System.out.println("cc:" + cellName + "---" + cellContent);
					Cell localCell = row.createCell(columnNum);
					CellStyle style = workbook.createCellStyle();
					style.setDataFormat(workbook.createDataFormat().getFormat(cell.optString("df")));
					localCell.setCellStyle(style);
//					localCell.getCellStyle().setDataFormat(Short.parseShort(cell.optString("df")));
//					sheet.setColumnWidth(arg0, arg1);
//					System.out.println(cell.optString("CellName")+Short.parseShort(cell.optString("df")));
					if ((cellType.optString("Type")).equals("CELL_TYPE_FORMULA")) {
//						localCell.setCellType(Cell.CELL_TYPE_NUMERIC);
						localCell.setCellFormula(( cellType.optString("Formula")));
					}
					else {
						localCell.setCellValue( cell.optString("value"));
					}
					// System.out.println("cellType:" + cellType.get("Type"));
					if("CELL_TYPE_STRING".equals(cellType.optString("Type"))) {
					
						localCell.setCellType(Cell.CELL_TYPE_STRING);
//						localCell.setCellValue(cell.optString("value"));
					}else if("CELL_TYPE_NUMERIC".equals(cellType.optString("Type")))	
					{
						localCell.setCellType(Cell.CELL_TYPE_STRING);
						localCell.setCellValue(cell.optDouble("value"));
					}else if("CELL_TYPE_Date".equals(cellType.optString("Type")))	
					{
						localCell.setCellType(Cell.CELL_TYPE_NUMERIC);
//						localCell.setCellValue(cell.optDouble("value"));
					}else if("CELL_TYPE_BOOLEAN".equals(cellType.optString("Type")))	
					{
						localCell.setCellType(Cell.CELL_TYPE_BOOLEAN);
//						localCell.setCellValue(cell.optBoolean("value"));
					}else if("CELL_TYPE_FORMULA".equals(cellType.optString("Type")))	
					{
						localCell.setCellType(Cell.CELL_TYPE_FORMULA);
					}else if("CELL_TYPE_BLANK".equals(cellType.optString("Type")))	
					{
						localCell.setCellType(Cell.CELL_TYPE_BLANK);
//						localCell.setCellValue(cell.optString("value"));
					}else{
						localCell.setCellType(Cell.CELL_TYPE_ERROR);
//						localCell.setCellValue(cell.optString("value"));
					}
					
				}
			}
			
			sheet.setForceFormulaRecalculation(true);
			return workbook;
	 }
	 
	 private static List<JSONObject> getFormulaFields(String excelInfo) {
			List<JSONObject> formulaField = new ArrayList<JSONObject>();
			JSONArray jsonExcel = JSONObject.fromObject(excelInfo).optJSONArray("data");
			for(int i=0;i<jsonExcel.size();i++)
			{
				JSONArray rowObj = jsonExcel.optJSONArray(i);
				for(int j=0;j<rowObj.size();j++)
				{
					JSONObject cell = rowObj.getJSONObject(j);
					JSONObject cellType = cell.optJSONObject("CellType");
					if (( cellType.optString("Type")).equals("CELL_TYPE_FORMULA")) {
						formulaField.add(cell);
					}
				}
			}
			
			return formulaField;
	}
	 
	 public static Map<String, String> getExcelFormulaFieldResult(Map<String, Object> input, Workbook workBook,
				String excelInfo,Map<String,String> formatMap) {
			// TODO Auto-generated method stub
			Map<String, String> formulaResult = new HashMap<String, String>();
			List<JSONObject> formulaFieldsList = getFormulaFields(excelInfo);
//			JSONObject json = JSONObject.fromObject(excelInfo);
			FormulaEvaluator formulaEvaluator = new HSSFFormulaEvaluator((HSSFWorkbook) workBook);
			DataFormatter formatter = new DataFormatter();
			Sheet sheet = workBook.getSheetAt(0);
			
			
			// set referenced cell value
			for (String keyName : input.keySet()) {

				Cell localCell = sheet.getRow(Integer.parseInt(keyName.split(",")[0])).getCell(Integer.parseInt(keyName.split(",")[1]));
				String val = ((String) input.get(keyName)).trim();
				if(localCell!=null)
				{
					if(StringUtil.isEmpty(val))
					{
							localCell.setCellType(Cell.CELL_TYPE_BLANK);
							formatMap.put(keyName, "");
						}
						else
						{
							try
							{
								localCell.setCellValue(Double.parseDouble(val));
							}
							catch(Exception e)
							{
								localCell.setCellValue(val);
							}
					}
					formatMap.put(keyName, formatter.formatCellValue(localCell));
				}
						
			}
			
//			HSSFFormulaEvaluator.evaluateAllFormulaCells(workBook);
			
			// generate result
			for (JSONObject cell : formulaFieldsList) {
				
					Cell localCell = sheet.getRow(cell.optInt("RowIndex")).getCell(cell.optInt("ColumnIndex"));
					if(localCell!=null)
					{
						try
						{
							formulaResult.put( cell.optString("CellName"),formatter.formatCellValue(localCell, formulaEvaluator));
						}
						catch(Exception e)
						{
							formulaResult.put( cell.optString("CellName"),"");
						}
					}
			}
			
			return formulaResult;

		}

		private static Cell getCellByName(Sheet sheet, String excelInfo, String cellName) {
			Cell localCell = null;
			JSONArray cellList = JSONObject.fromObject(excelInfo).optJSONArray("data");
			for(int i=0;i<cellList.size();i++)
			{
				JSONArray row = cellList.getJSONArray(i);
				for(int j=0;j<row.size();j++)
				{
					JSONObject cell = row.optJSONObject(j);
					if(cell.optString("CellName").equals(cellName))
					{
						int rowNum = cell.optInt("RowIndex");
						int columnNum = cell.optInt("ColumnIndex");
						localCell = sheet.getRow(rowNum).getCell(columnNum);
						break;
					}
				}
			}
			return localCell;
		}

//		private static boolean referencedByFormula(String keyName, List<JSONObject> formulaList) {
//			boolean referenced=false;
//			for (JSONObject cell : formulaList) {
//				String formulaContent =  cell.optJSONObject("CellType").optString("Formula");
//				System.out.println(keyName+"---"+cell.optString("CellName")+"---"+formulaContent+"---"+formulaContent.indexOf(keyName) );
//				if (formulaContent.indexOf(keyName) > 0) {
//					return true;
//				}
//			}
//			return false;
//
//		}
	 public static void main(String args[])
	 {
		 Workbook wk = ExcelModelUtil.openExcel(new File("d:/工资预算表 - 副本.xls"));
		 String json = ExcelModelUtil.convertExcelToJSON(wk);
		 Map<String, Object> cellVal = new HashMap<String, Object>();
//			cellVal.put("A3", "测试");
			cellVal.put("D25", "0.027");
			Workbook wb1 = ExcelModelUtil.convertJSONToExcel(json);
	FileOutputStream fw;
	try {
		fw = new FileOutputStream("d:/aa.xls");
		
		wb1.write(fw);
		fw.close();
	} catch (FileNotFoundException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (IOException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	
		 
		 
	 }
}
