<%@ page language="java"  pageEncoding="UTF-8"%>

   <form  method="post" >
   			<input type="hidden" name="role.id"/>
   			<input type="hidden" name="role.is_editable" value="1"/> 
            <div class="lbcxtj" style="width:450px">
                <label style="display:inline-block; width:100px; text-align:right;">名称：</label>
                <input  class="mwsmartui-textbox" data-options="width:'340px',height:'30px',prompt:'',required:true" name="role.name">
            
            </div>
            
            <div class="lbcxtj" style="width:450px;height:130px;">
                <label style="display:inline-block; width:100px; text-align:right;">备注：</label>
                <input  class="mwsmartui-textbox" data-options="multiline:'true',width:'340px',height:'130px',prompt:''" name="role.bak">
            </div>  
</form>

