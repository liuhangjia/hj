package com.abm.manager.util;

import java.util.HashMap;
import java.util.Map;

import com.abm.manager.monitor.model.AlarmUnit;





public class ClientCache {
	private static Map<String,AlarmUnit> pool = new HashMap<String,AlarmUnit>();
	
	public static void register(AlarmUnit socket)
	{
		pool.put(socket.getId(),socket);
	}
	
	public static void remove(String id)
	{
		pool.remove(id);
	}
	
	public static AlarmUnit getById(String id)
	{
		return pool.get(id);
	}
	

}
