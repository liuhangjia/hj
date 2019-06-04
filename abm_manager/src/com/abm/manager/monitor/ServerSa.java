package com.abm.manager.monitor;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import com.abm.common.dao.AlarmDeviceDao;
import com.abm.common.dao.AlarmLogDao;
import com.abm.common.model.AlarmDeviceModel;
import com.abm.common.model.AlarmLogModel;
import com.abm.common.service.AlarmDeviceService;
import com.abm.common.utils.Cache;
import com.abm.common.utils.Constants;
import com.abm.common.utils.DateUtil;
import com.abm.common.utils.Pk;
import com.abm.manager.monitor.model.AlarmUnit;
import com.abm.manager.util.ClientCache;
import com.abm.manager.util.Config;
import com.abm.manager.util.MessageUtil;
public class ServerSa {
	public static void listen() throws IOException{
		{
			
			
			ServerSocket server = new ServerSocket(Config.sa_listen_port);
			while(true)
			{
				final Socket client = server.accept();
				final LinkedBlockingQueue<byte[]> tosend = new LinkedBlockingQueue<byte[]>(10);
				final AlarmUnit unit = new AlarmUnit();
				unit.setFactory(Constants.FACTORY_SA);
				unit.setMessage(tosend);
				
				new Thread(){
					public void run(){
						SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
						SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						System.out.println("receive connection from "+client.getRemoteSocketAddress());
						InputStream is = null;
//						OutputStream os = null;
						byte[] buffer = new byte[512];
						int length = -1;
						try
						{
							is = client.getInputStream();
//							os = client.getOutputStream();
							while((length=is.read(buffer))>0)
							{
								byte[] data = new byte[length];
								System.arraycopy(buffer, 0, data, 0, length);
								
								System.out.print("receive data package,time="+sdf1.format(new Date())+":");
								
								String message = new String(data);
								System.out.println(message);
								
								String now = sdf.format(new Date());
								String resp = "ACCEPTOK8,"+now.substring(2)+"\r\n";
								
								int start = message.indexOf("txwzid=");
								if(-1==start){
									continue;
								}
								int end = message.indexOf("&", start);
								String num = message.substring(start+"txwzid=".length(),end); 
								unit.setNum(num);
								
								List<AlarmDeviceModel> devList=AlarmDeviceDao.getSingle().executeQuery("and factory=? and idnum=?", new String[]{unit.getFactory(),unit.getNum()});
								Date date=new Date();
								String date_str=sdf1.format(date);
								AlarmDeviceModel bean=new AlarmDeviceModel();
								if(null==devList || devList.isEmpty()){
//									bean.setId(Pk.getId());
//									bean.setLast_modify_time(date_str);
//									bean.setName(unit.getFactory());
//									bean.setIdnum(unit.getNum());
//									AlarmDeviceDao.getSingle().add(bean);
									continue;
								}else{
									bean=devList.get(0);
								}
								
								unit.setId(bean.getId());
								ClientCache.register(unit);
								
								
								
								int index = message.indexOf("alarm=");
								if(index>0)
								{
									String msg = message.substring(index+"alarm=".length(),index+"alarm=".length()+8);
									if(msg!=null&&msg.trim().length()==8)
									{
										char event = msg.charAt(0);
										if(event=='0'){
//											MessageUtil.sendMessageToPage("msg", "{\"type\":\"sa\",\"ptype\":\"heart\",\"time\":\""+date_str+"\",\"status\":\""+event+"\"}");
											bean.setStatus(Constants.CANCEL_DEFENCE);
											bean.setLast_modify_time(date_str);
											AlarmDeviceDao.getSingle().update(bean);
											unit.setStatus(Constants.CANCEL_DEFENCE);
										}
										else if(event=='1')
										{
//											MessageUtil.sendMessageToPage("msg", "{\"type\":\"sa\",\"ptype\":\"heart\",\"time\":\""+date_str+"\",\"status\":\""+event+"\"}");
											bean.setStatus(Constants.APPLY_DEFENCE);
											bean.setLast_modify_time(date_str);
											AlarmDeviceDao.getSingle().update(bean);
											unit.setStatus(Constants.APPLY_DEFENCE);
										}
										else if(event=='4'||event=='3'||event==';')
										{
											unit.setStatus(Constants.APPLY_DEFENCE);
//											if(!DateUtil.isValid(bean.getInvalid_time()))
//											{
//												continue;
//											}
											//1分钟内连续发过来的告警可以忽略
											if(unit.getLast_alarm_time()<0||(System.currentTimeMillis()-unit.getLast_alarm_time())>60*1000)
											{
												unit.setLast_alarm_time(System.currentTimeMillis());
											}
											else
											{
												continue;
											}
											AlarmLogModel dmm=new AlarmLogModel();
											dmm.setType_code(msg.substring(0,2));
											dmm.setArea(msg.substring(2,4));
											dmm.setAlarm_time(date_str);
											dmm.setDevice_id(bean.getId());
											dmm.setId(Pk.getId());
											AlarmLogDao.getSingle().add(dmm);
											MessageUtil.sendMessageToPage("msg", "{\"type\":\"sa\",\"id\":\""+dmm.getId()+"\",\"device_id\":\""+bean.getId()+"\",\"ptype\":\"alarm\",\"time\":\""+date_str+"\",\"event\":\""+Cache.codeToName("GJLB",msg.substring(0,2))+"\",\"fangqu\":\""+msg.substring(2,4)+"\",\"address\":\""+((bean.getAddr()!=null)?bean.getAddr():"")+"\"}");
											//查找设备_id对应的摄像头，如果包含有阿里的摄像头，启动视频下载线程，将date_str后的5分钟的视频录制下来
											List<AlarmDeviceModel> cameras = AlarmDeviceService.getSingle().listNeighborCamera(bean.getId());
											if(cameras!=null)
											{
												final String logId = dmm.getId();
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
										}
									}
								}
								
								
								tosend.offer(resp.getBytes());
							}
						}
						catch(Exception e)
						{
							e.printStackTrace();
						}
						finally
						{
							if(is!=null)
							{
								try {
									is.close();
								} catch (IOException e) {
									// TODO Auto-generated catch block
									e.printStackTrace();
								}
							}
							//停止写线程
							tosend.offer("kill".getBytes());
						}
						
						
					}
				}.start();
				new Thread(){
					public void run(){
						OutputStream os = null;
						SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						try
						{
							os = client.getOutputStream();
							while(!client.isClosed())
							{
								byte[] resp = tosend.poll(10, TimeUnit.SECONDS);
								if(resp!=null)
								{
									if(new String(resp).equals("kill"))
									{
										break;
									}
									System.out.print("ready to send data to alarm ,time="+sdf.format(new Date())+",data:"+new String(resp));
									os.write(resp);
									os.flush();
								}
							}
							
						}
						catch(Exception e)
						{
							e.printStackTrace();
						}
						finally
						{
							if(os!=null)
							{
								try {
									os.close();
								} catch (IOException e) {
									// TODO Auto-generated catch block
									e.printStackTrace();
								}
							}
							tosend.clear();
							ClientCache.remove(unit.getId());
						}
						
						
					}
				}.start();
			}
		}
	}
}
