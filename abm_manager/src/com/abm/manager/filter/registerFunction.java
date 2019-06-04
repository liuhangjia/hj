package com.abm.manager.filter;

import java.text.DecimalFormat;
import java.util.Date;

import org.apache.poi.ss.formula.eval.EvaluationException;
import org.apache.poi.ss.formula.eval.NumberEval;
import org.apache.poi.ss.formula.eval.OperandResolver;
import org.apache.poi.ss.formula.eval.ValueEval;
import org.apache.poi.ss.formula.functions.Function;
import org.apache.poi.ss.usermodel.DateUtil;
import org.joda.time.DateTime;
import org.joda.time.Months;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import com.mw.common.utils.Common;

public class registerFunction implements Function{
	@Override
	public ValueEval evaluate(ValueEval[] args, int srcRowIndex, int srcColumnIndex) {
		System.out.println("DATEDIF函数已执行");
		try {
			if(null != args){
				ValueEval eval = OperandResolver.getSingleValue(args[0], srcRowIndex, srcColumnIndex);
				System.out.println("args[0]:" + args[0]);
				double number = OperandResolver.coerceValueToDouble(eval);
				Date date = DateUtil.getJavaDate(number);
				String startTime = Common.getFormatDate(date, Common.DATE_YMD);
				
				ValueEval eval1 = OperandResolver.getSingleValue(args[1], srcRowIndex, srcColumnIndex);
				double number1 = OperandResolver.coerceValueToDouble(eval1);
				Date date1 = DateUtil.getJavaDate(number1);
				String endTime = Common.getFormatDate(date1, Common.DATE_YMD);
				
				ValueEval eval2 = OperandResolver.getSingleValue(args[2], srcRowIndex, srcColumnIndex);
				String str = OperandResolver.coerceValueToString(eval2);
				System.out.println("str" + str);
				System.out.println("srcColumnIndex:" + srcColumnIndex);
				System.out.println("srcRowIndex:" + srcRowIndex);
				return new NumberEval(monthDif(startTime, endTime, str));
			}
			
		} catch (EvaluationException e) {
			e.printStackTrace();
		};
		return new NumberEval(0);
	}
	
	public static double monthDif(String startTime, String endTime, String type){
		double months = 0.0;
		DecimalFormat df = new DecimalFormat("######0.0");
        DateTimeFormatter formatter = DateTimeFormat.forPattern("yyyy-MM-dd");
        DateTime start = formatter.parseDateTime(startTime);
        DateTime end = formatter.parseDateTime(endTime);
        months = Months.monthsBetween(start, end).getMonths();
        if(type.equals("M")){
        	Double.valueOf(df.format(months));
        } else if(type.equals("Y")){
        	months = Double.valueOf(df.format(months/12));
        } else if(type.equals("D")){
        	
        }
		return months;
	}
}
