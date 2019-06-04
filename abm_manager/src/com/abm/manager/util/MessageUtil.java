package com.abm.manager.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import nl.justobjects.pushlet.core.Dispatcher;
import nl.justobjects.pushlet.core.Event;
import nl.justobjects.pushlet.core.Session;
import nl.justobjects.pushlet.core.SessionManager;

public class MessageUtil {
	public static void sendMessageToPage(String title,String message) throws UnsupportedEncodingException
	{
		Map<String, String> attrs = new HashMap<String, String>();
		try {
			attrs.put("message", URLEncoder.encode(message,"UTF-8").replace("+", "%20"));
			attrs.put("title", URLEncoder.encode(title,"UTF-8"));
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			throw e;
		}
		Event event = Event.createDataEvent("shanfrs",attrs);
		for(Session session : SessionManager.getInstance().getSessions())
		{
			Dispatcher.getInstance().unicast(event, session.getId());
			
		}
		
	}
}
