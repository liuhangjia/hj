package com.abm.manager.monitor.model;

import java.util.concurrent.LinkedBlockingQueue;

public class AlarmUnit {
	private String id;
	private String factory;//厂家
	private String num;//编号
	private String status ;//当前状态(0撤防|1布防)
	private long last_alarm_time=-1;//最后一次告警时间
	private LinkedBlockingQueue<byte[]> message;
	public String getFactory() {
		return factory;
	}
	public void setFactory(String factory) {
		this.factory = factory;
	}
	public String getNum() {
		return num;
	}
	public void setNum(String num) {
		this.num = num;
	}
	public LinkedBlockingQueue<byte[]> getMessage() {
		return message;
	}
	public void setMessage(LinkedBlockingQueue<byte[]> message) {
		this.message = message;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public long getLast_alarm_time() {
		return last_alarm_time;
	}
	public void setLast_alarm_time(long lastAlarmTime) {
		last_alarm_time = lastAlarmTime;
	}
	
	
	
	

}
