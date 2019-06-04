<%@ page language="java"  pageEncoding="UTF-8"%>
<form  method="post" >
            
            <input type="hidden" name="id"/>
            <input type="hidden" name="type_id">
            <div class="lbcxtj" style="width:450px">
                <label  style="display:inline-block; width:100px; text-align:right;">编码：</label>
                <input  name="code" class="mwsmartui-textbox" data-options="width:'345px',height:'30px',prompt:'',requied:true">
            </div>
            <div class="lbcxtj" style="width:450px">
                <label style="display:inline-block; width:100px; text-align:right;">名称：</label>
                <input name="name" class="mwsmartui-textbox" data-options="width:'345px',height:'30px',prompt:'',requied:true">
            </div> 
            <div class="lbcxtj" style="width:450px">
                <label style="display:inline-block; width:100px; text-align:right;">排序：</label>
                  <input  name="seq" class="mwsmartui-numberspinner" data-options="width:'345px',height:'30px',requied:true,min:1">
            </div> 
            
            </form>