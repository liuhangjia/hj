package com.abm.manager.monitor;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.text.SimpleDateFormat;
import java.util.Calendar;
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
public class ServerSzw {
	public static void listen() throws IOException{
		ServerSocket server = new ServerSocket(Config.szw_listen_port);
		while(true)
		{
			final Socket client = server.accept();
			final LinkedBlockingQueue<byte[]> tosend = new LinkedBlockingQueue<byte[]>(10);
			final AlarmUnit unit = new AlarmUnit();
			unit.setFactory(Constants.FACTORY_SZW);
			unit.setMessage(tosend);
			
			//读线程
			new Thread(){
				public void run(){
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					System.out.println("receive connection from "+client.getRemoteSocketAddress());
					InputStream is = null;
					
					byte[] buffer = new byte[512];
					int length = -1;
					try
					{
						is = client.getInputStream();
						
						while(!client.isClosed()&&(length=is.read(buffer))>0)
						{
							byte[] data = new byte[length];
							System.arraycopy(buffer, 0, data, 0, length);
							System.out.print("receive data package,time="+sdf.format(new Date())+":0X");
							for(int i=0;i<data.length;i++)
							{
								String s = Integer.toHexString(data[i]&0xff).toUpperCase();
								
								if(s.length()<2)
								{
									s = "0"+s;
								}
								System.out.print(s);
								
							}
							System.out.println("");
							
							if((data[0]&0xff)!=0xad||data.length<3)
							{
								System.out.println("invalid package,abandon");
								continue;
							}
							Date date=new Date();
							String date_str=sdf.format(date);
							//heart package
							if(((data[1]&0xff)==0x03)&&((data[2]&0xff)==0x01))
							{
								System.out.println("heart package");
								if(data.length!=29)
								{
									System.out.println("invalid length,abandon");
									continue;
								}
								int checker = 0;
								for(int i=0;i< 7;i++)
								{
									checker = checker + (data[i]&0xff);
								}
								checker = ~checker;
								checker ++;
								if((byte)checker!=data[8])
								{
									System.out.println("package check failure");
									continue;
								}
								
								System.out.println("bufang status:"+data[17]);
								
								String num = Integer.toHexString(data[9]&0xff).toUpperCase()+Integer.toHexString(data[10]&0xff).toUpperCase();
								unit.setNum(num);
								
								List<AlarmDeviceModel> devList=AlarmDeviceDao.getSingle().executeQuery("and factory=? and idnum=?", new String[]{unit.getFactory(),unit.getNum()});
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
								
								
//								MessageUtil.sendMessageToPage("msg", "{\"type\":\"szw\",\"ptype\":\"heart\",\"time\":\""+date_str+"\",\"status\":\""+data[17]+"\"}");
								if(data[17]==1){
									bean.setStatus(Constants.CANCEL_DEFENCE);
									unit.setStatus(Constants.CANCEL_DEFENCE);
								}else if(data[17]==2){
									bean.setStatus(Constants.APPLY_DEFENCE);
									unit.setStatus(Constants.APPLY_DEFENCE);
								}
								bean.setLast_modify_time(date_str);
								AlarmDeviceDao.getSingle().update(bean);
							}
							//alarm package
							else if(((data[1]&0xff)==0x03)&&((data[2]&0xff)==0x02))
							{
								System.out.println("alarm package");
								if(data.length!=31)
								{
									System.out.println("invalid length,abandon");
									continue;
								}
								
								int checker = 0;
								for(int i=0;i< 7;i++)
								{
									checker = checker + (data[i]&0xff);
								}
								checker = ~checker;
								checker ++;
								if((byte)checker!=data[8])
								{
									System.out.println("package check failure");
									continue;
								}
								
								String number = Integer.toHexString(data[16]&0xff).toUpperCase()+Integer.toHexString(data[17]&0xff).toUpperCase();
								List<AlarmDeviceModel> devList=AlarmDeviceDao.getSingle().executeQuery("and factory=? and idnum=?", new String[]{unit.getFactory(),number});
								AlarmDeviceModel bean=new AlarmDeviceModel();
								if(null==devList || devList.isEmpty()){
//									bean.setId(Pk.getId());
//									bean.setLast_modify_time(date_str);
//									bean.setName(unit.getFactory());
//									bean.setIdnum(number);
//									
//									AlarmDeviceDao.getSingle().add(bean);
									continue;
								}else{
									bean=devList.get(0);
								}
								
								
								unit.setNum(number);
								unit.setId(bean.getId());
								ClientCache.register(unit);
								
								int alarm = 0;
								alarm = alarm | data[24];
								alarm = (alarm << 8 ) | data[25];
								System.out.println("alarm event:"+Integer.toHexString(alarm));
								
								if(Integer.toHexString(alarm).startsWith("340"))
								{
									unit.setStatus(Constants.APPLY_DEFENCE);
									bean.setStatus(Constants.APPLY_DEFENCE);
									bean.setLast_modify_time(date_str);
									AlarmDeviceDao.getSingle().update(bean);
								}
								else if(Integer.toHexString(alarm).startsWith("140"))
								{
									unit.setStatus(Constants.CANCEL_DEFENCE);
									bean.setStatus(Constants.CANCEL_DEFENCE);
									bean.setLast_modify_time(date_str);
									AlarmDeviceDao.getSingle().update(bean);
								}
								else
								{
									unit.setStatus(Constants.APPLY_DEFENCE);
									int num = data[26];
									num = ( num << 8 ) | data[27];
									System.out.println("fangqu:"+num);
									
//									if(!DateUtil.isValid(bean.getInvalid_time()))
//									{
//										continue;
//									}
									//1分钟内连续发过来的告警可以忽略
									if(unit.getLast_alarm_time()<0||(System.currentTimeMillis()-unit.getLast_alarm_time())>60*1000)
									{
										unit.setLast_alarm_time(System.currentTimeMillis());
									}
									else
									{
										continue;
									}
									AlarmLogModel ddm=new AlarmLogModel();
									ddm.setType_code(Integer.toHexString(alarm));
									ddm.setArea(String.valueOf(num));
									ddm.setAlarm_time(date_str);
									ddm.setDevice_id(bean.getId());
									ddm.setId(Pk.getId());
									AlarmLogDao.getSingle().add(ddm);
									MessageUtil.sendMessageToPage("msg", "{\"type\":\"szw\",\"id\":\""+ddm.getId()+"\",\"device_id\":\""+bean.getId()+"\",\"ptype\":\"alarm\",\"time\":\""+date_str+"\",\"event\":\""+Cache.codeToName("GJLB",Integer.toHexString(alarm))+"\",\"fangqu\":\""+num+"\",\"address\":\""+((bean.getAddr()!=null)?bean.getAddr():"")+"\"}");
									//查找设备_id对应的摄像头，如果包含有阿里的摄像头，启动视频下载线程，将date_str后的5分钟的视频录制下来
									List<AlarmDeviceModel> cameras = AlarmDeviceService.getSingle().listNeighborCamera(bean.getId());
									if(cameras!=null)
									{
										final String logId = ddm.getId();
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
							else
							{
								continue;
							}
							//ying da
							byte[] resp = new byte[18];
							resp[0] = (byte)0xAD;
							
							resp[1] = (byte)0x99;
							resp[2] = (byte)0x09;
							
							resp[3] = data[3];
							
							resp[4] = (byte)0x07;
							resp[5] = 0;
							resp[6] = 0;
							resp[7] = 0;
							
							Calendar cal = Calendar.getInstance();
							
							resp[9] = (byte)cal.get(Calendar.SECOND);
							resp[10] = (byte)cal.get(Calendar.MINUTE);
							resp[11] = (byte)cal.get(Calendar.HOUR_OF_DAY);
							resp[12] = (byte)cal.get(Calendar.DAY_OF_MONTH);
							resp[13] = (byte)(cal.get(Calendar.MONTH)+1);
							resp[14] = (byte)(cal.get(Calendar.YEAR)%1000);
							resp[15] = (byte)(cal.get(Calendar.YEAR)/100);
							
							
							resp[16] = (byte)0x0d;
							resp[17] = (byte)0x0a;
							
							int checker = 0;
							for(int i=0;i< 8;i++)
							{
								checker = checker + (resp[i]&0xff);
							}
							checker = ~checker;
							checker ++;
							resp[8] = (byte)checker;
							tosend.offer(resp);
						}
						
					}
					catch(Exception e)
					{
						e.printStackTrace();
						System.out.print("111111");
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
						System.out.print("222222 ");
					}
					System.out.print("333333 ");
					
				}
			}.start();
			//写线程
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
									System.out.print("444444 ");
									break;
								}
								System.out.print("ready to send data to alarm ,time="+sdf.format(new Date())+",data:0X");
								for(int i=0;i<resp.length;i++)
								{
									String s = Integer.toHexString(resp[i]&0xff).toUpperCase();
									
									if(s.length()<2)
									{
										s = "0"+s;
									}
									System.out.print(s);
									
								}
								System.out.println("");
								os.write(resp);
								os.flush();
							}
						}
						
					}
					catch(Exception e)
					{
						e.printStackTrace();
						System.out.print("555555 ");
						
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
					System.out.print("666666 ");
					
				}
			}.start();
		}
	}
	
}
