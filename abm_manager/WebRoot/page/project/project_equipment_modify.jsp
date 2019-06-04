<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
	
</head>

<body>
 	<div id="project_zb_add_div" class="mwsmartui-panel" data-options="border:false,fit:true">
	    <div id="zb_add_list_toolbar" class="toolbar-div">
	        <form id="zb_add_modify_form" method="post" >
		         <div class="lbcxtj" >
	                <label>项目：</label>
	            	<select id="xmmc_select" class="mwsmartui-combobox"  data-options="valueField:'id',
	            																				textField:'name',
	            																				width:'370px',height:'30px'" >
	                
	                </select>
	            </div>          
	        </form>
	        <div class="toolbar-btn">
				<div class="btn-left">
					<a href="#" class="mwsmartui-linkbutton" data-options="onClick:projectEquip.selectEquips"><i class="fa fa-plus"> </i> 添加</a>
				</div>
			</div>
	    </div>
       <table id="project_zb_add_list" class="mwsmartui-datagrid" data-options="
            pagination:true,
			pageSize:20,
			selectOnCheck:true,
			fileOnSelect:true,
			singleSelect:true,
			border:false,
			striped:true,
			fit:true,
			method:'post',
            scrollbarSize:157,
			toolbar:'#zb_add_list_toolbar'">
            <thead>
                <tr>
               		<th data-options="field:'id',checkbox:true">ID</th>
                    <th data-options="field:'name',width:'20%'"><b>名称</b></th>                    
                    <th data-options="field:'type',width:'10%',formatter:function(value){return common.codeToName('ZBLB',value);}"><b>类别</b></th>                    
                    <th data-options="field:'category',width:'10%'"><b>种类</b></th>                    
                    <th data-options="field:'factory',width:'20%'"><b>厂商</b></th>
                    <th data-options="field:'model',width:'10%'"><b>型号</b></th>
                    <th data-options="field:'unit',width:'10%'"><b>单位</b></th>
                    <th data-options="field:'quantity',width:'10%'"><b>数量</b></th>
                    <th data-options="field:'xx',width:'10%',formatter:projectEquip.noIdEquipListOpts"><b>操作</b></th>
                </tr>
            </thead>
        </table>
  </div>
          
</body>
</html>
