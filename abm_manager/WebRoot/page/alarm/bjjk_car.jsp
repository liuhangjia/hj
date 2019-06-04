<%@ page language="java"  pageEncoding="UTF-8"%>
<div class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="bjjk_car_list_toolbar" class="toolbar-div">
         <form id="bjjk_car_queryform" method="post" >
          <div class="lbcxtj">
              <label style="display:inline-block; width:100px; text-align:right;">车牌号：</label>
              <input id="bjjk_car_number" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''">
          
          </div>    
		  <div class="lbcxtj">
              <label style="display:inline-block; width:100px; text-align:right;">记录时间：</label>
              <input id="bjjk_car_record_time" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''">
          
          </div>   
          <div class="lbcxtj">
              <label style="display:inline-block; width:100px; text-align:right;">记录设备：</label>
              <input id="bjjk_car_equip_id" class="mwsmartui-combobox" data-options="width:'145px',height:'30px',prompt:'',url:'./EquipCar-listCarEquip.action',valueField:'sn',textField:'name'">
          
          </div>
         </form>
        <div class="toolbar-btn">
			<div class="btn-left">
			</div>
			<div class="btn-right">
				<a href="#" class="mwsmartui-linkbutton"  data-options="onClick:equip_car.query"><i class="fa fa-search"> </i> 查询</a>
                    <a href="#" class="mwsmartui-linkbutton"  data-options="onClick:equip_car.reset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="bjjk_car_managers_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
			url:'./EquipCar-list.action',
			toolbar:'#bjjk_car_list_toolbar'">
            <thead>
                <tr>
                    <th data-options="field:'car_number',width:'25%'"><b>车牌号</b></th>
                    <th data-options="field:'car_color',width:'25%'"><b>车牌颜色</b></th>
                    <th data-options="field:'record_time',width:'25%'"><b>记录时间</b></th>
                    <th data-options="field:'equip_id',width:'25%',formatter:function(value,row){if(row['equipModel']){return row['equipModel']['name'];}}"><b>记录设备</b></th>
                </tr>
            </thead>
        </table>
  </div>