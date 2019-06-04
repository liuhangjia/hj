<%@ page language="java"  pageEncoding="UTF-8"%>

<form  method="post" >
   			<input type="hidden" name="id"/>
   			 <table class="mwsmartui-datagrid" id="yhgl_zhgl_role_list" data-options=" selectOnCheck:true,
            checkOnSelect:true,
            singleSelect:false,collapsible:true,method:'get',scrollbarSize:0,fitColumns:true,scrollbarSize:38">
			    <thead>
			        <tr>
			            <th data-options="field:'ck',checkbox:true">ID</th>
			            <th data-options="field:'name',width:'20%'">名称</th>
			            <th data-options="field:'bak',width:'80%'">备注</th>
			        </tr>
			    </thead>
			</table>
</form>

