<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
 <form method="post" >
 	  <input name="alarmDevice.id" type="hidden">
      <div class="lbcxtj">
          <label>会员：</label>
          <select name="alarmDevice.member_id" class="mwsmartui-combobox" data-options="width:'370px',height:'30px',url:'./AlarmDevice-listMemeber.action',valueField:'id',textField:'name'">
      	  </select>
      </div>
     <div class="lbcxtj" >
          <label>企业：</label>
          <select name="alarmDevice.enterprise_id" class="mwsmartui-combobox" data-options="width:'370px',height:'30px',url:'./Enterprise-listForPriv.action?priv=ALARM_DEVICE_LIST',textField:'name',valueField:'id'">
		  </select>
      </div>
      <div class="lbcxtj" >
          <label>项目：</label>
          <select name="alarmDevice.project_id" class="mwsmartui-combobox" data-options="width:'370px',height:'30px',url:'./AlarmDevice-listProject.action',valueField:'id',textField:'name'">
      	  </select>
      </div>
      <div class="lbcxtj">
          <label>设备名称：</label>
          <input name="alarmDevice.name" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
      </div>
       <div class="lbcxtj">
          <label>到期时间：</label>
          <input name="alarmDevice.invalid_time" class="mwsmartui-datebox" data-options="width:'140px',height:'30px'">
      </div>
      <div class="lbcxtj">
          <label>设备类别：</label>
          <input name="alarmDevice.type" class="mwsmartui-combobox" data-options="width:'140px',height:'30px',valueField:'code',textField:'name',url:'./SysBaseCode-listForCombo.action?type=SBLB'">
      </div>
      <div class="lbcxtj">
          <label>设备厂家：</label>
          <input name="alarmDevice.factory" class="mwsmartui-combobox" data-options="width:'140px',height:'30px',valueField:'code',textField:'value',data:[{'value':'深安','code':'SA'},
																																							{'value':'狮子王','code':'SZW'},
																																							{'value':'迪士佳','code':'DSJ'},
																																							{'value':'阿里','code':'AL'}]">
      </div>
      <div class="lbcxtj">
          <label>设备型号：</label>
          <input name="alarmDevice.model" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
      </div>
      <div class="lbcxtj">
          <label>设备编号：</label>
          <input name="alarmDevice.idnum" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
      </div>
      <div class="lbcxtj">
          <label>设备防区：</label>
          <input name="alarmDevice.area" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
      </div>
      <div class="lbcxtj">
          <label>设备位置：</label>
          <input name="alarmDevice.addr" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
      </div>
      <div class="lbcxtj">
          <label>app_name：</label>
          <input name="alarmDevice.user_name" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
      </div>
      <div class="lbcxtj">
          <label>steam_name：</label>
          <input name="alarmDevice.passwd" class="mwsmartui-textbox" data-options="width:'140px',height:'30px'">
          <a href="#"   class="mwsmartui-linkbutton" data-options="onClick:bjjk_sbyxqd_tldz">推流地址</a>
      </div>
      <div class="lbcxtj">
          <label>关联设备：</label>
          <input name="alarmDevice.pid" class="mwsmartui-combobox" data-options="width:'140px',height:'30px',url:'./AlarmDevice-listAlarmDevice',valueField:'id',textField:'name',method:'get'">
      </div>
</form>