<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
</head>

<body>
<div id="reward_div" class="mwsmartui-panel" data-options="border:false,fit:true">
    <div id="reward_list_toolbar" class="toolbar-div">
    <fieldset>
	    <legend>查询条件</legend>
            <form id="reward_queryform" method="post">
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">企业：</label>
                <select id="enterprise_id" name="enterpriseEmployee.enterprise_id" class="mwsmartui-combobox" 
		                data-options="width:'145px',
		                				height:'30px',
		                				valueField:'id',
		                				textField:'name'">
                </select>
            </div>  
            
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">项目：</label>
                <select id=project_id name="enterpriseEmployee.project_id" class="mwsmartui-combobox" 
	                	data-options="width:'145px',
	                					height:'30px',
	                					valueField:'id',
	                					textField:'name'">
                </select>
            </div>  
           
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">姓名：</label>
                 <input id="name" class="mwsmartui-textbox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>
            
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">类别：</label>
                <select id="type" class="mwsmartui-combobox" name="language" data-options="width:'145px',height:'30px'" >
	                <option value="">请选择</option>
	                <option value="0">奖励</option>
	                <option value="1">处罚</option>
                </select>
            </div>
             
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">奖励时间从：</label>
                <input id="starttime" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>    
           
            <div class="lbcxtj">
                <label style="display:inline-block; width:100px; text-align:right;">到：</label>
                <input id="endtime" class="mwsmartui-datebox" data-options="width:'145px',height:'30px',prompt:''"/>
            </div>
            
            </form>
          </fieldset>
        <div class="toolbar-btn">
			<div class="btn-left">
				<a href="#" id="reward_add" class="mwsmartui-linkbutton"  data-options="onClick:humanReward.reward_doAdd"><i class="fa fa-plus"> </i> 添加</a>
                <a href="#" id="reward_del" class="mwsmartui-linkbutton" data-options="onClick:humanReward.reward_doDel"><i class="fa fa-trash"> </i> 批量删除</a>
			</div>
			<div class="btn-right">
				<a href="#" id="reward_search" class="mwsmartui-linkbutton"  data-options="onClick:humanReward.reward_doSearch"><i class="fa fa-search"> </i> 查询</a>
                <a href="#" id="reward_reset" class="mwsmartui-linkbutton"  data-options="onClick:humanReward.reward_doReset" ><i class="fa fa-refresh"> </i> 重置</a>
			</div>
		</div>
    </div>
       <table id="reward_list" class="mwsmartui-datagrid" data-options="
	            pagination:true,
				pageSize:30,
				selectOnCheck:true,
				checkOnSelect:false,
				fileOnSelect:true,
				singleSelect:false,
				border:false,
				striped:true,
				fit:true,
				url:'./HumanAward-list.action',
				method:'post',
	            scrollbarSize:157,
				toolbar:'#reward_list_toolbar',
				onCheck:humanReward.togglePlsc,
				onUncheck:humanReward.togglePlsc,
				onCheckAll:humanReward.togglePlsc,
				onUncheckAll:humanReward.togglePlsc,
				onLoadSuccess:humanReward.togglePlsc">
        	<thead>
                <tr>
               		<th data-options="field:'ck',checkbox:true">ID</th>
               		<th data-options="field:'ename',width:'9%',formatter:function(value,row){if(row['enterpriseModel']){return row['enterpriseModel']['name'];}}"><b>企业</b></th>
                    <th data-options="field:'name',width:'7%'"><b>姓名</b></th>
                    <th data-options="field:'depart_name',width:'7%'"><b>部门</b></th>
                    <th data-options="field:'position',width:'8%'"><b>职务</b></th>
                    <th data-options="field:'type',width:'7%',formatter:function(value){return value=='0'?'奖励':'处罚'}"><b>类别</b></th>
                    <th data-options="field:'ap_time',width:'11%',formatter:common.fmt_date10"><b>时间</b></th>
                    <th data-options="field:'reason',width:'21%',formatter:common.fmt_date10"><b>原因</b></th>
                    <th data-options="field:'content',width:'15%'"><b>奖惩内容</b></th>
                    <th data-options="field:'bak',width:'15%'"><b>备注</b></th>
                    <th data-options="field:'xx',width:'120',formatter:humanReward.reward_doHandle"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
  	<script type="text/javascript">
		$(function(){
			$('#reward_queryform #enterprise_id').combobox({
				url:'./Employee-listMyEnterprise.action?type=VACATION_MANAGER_LIST',
				onChange:function(val){
					if(val){
						$('#reward_queryform #project_id').combobox({
							url:'./Employee-listProjectByCondition.action?type=AWARD_PUNISH_LIST&enterpriseId='+val,
						});
					}
				}
			});
		});
	</script>
</body>
</html>
