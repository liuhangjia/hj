/** 人力服务按钮权限集合 */

/** 请假管理 */
function rlfw_qjgl_init() {
	if(!hasPriv("VACATION_MANAGER_ADD")){
		$("#leave_div #leave_add").hide();
	}
//	if(!hasPriv("VACATION_MANAGER_EDIT")){
//		//编辑
//		
//	}
	if(!hasPriv("VACATION_MANAGER_DELETE")){
		//批量
		$("#leave_div #leave_del").hide();
		//单删
		//业务中
	}
	if(!hasPriv("VACATION_MANAGER_IMPORT")){
		$("#leave_div #leave_exp").hide();
	}
}

/** 人才储备 */
function rlfw_rccb_init(){
	if(!hasPriv("HR_POOL_ADD")){
		$("#cadres_div #cadres_add").hide();
	}
//if(!hasPriv("HR_POOL_EDIT")){
//	
//}
	if(!hasPriv("HR_POOL_DELETE")){
		$("#cadres_div #cadres_del").hide();
	}
	
}

/** 考勤管理 */
function rlfw_kqgl_init(){
	if(!hasPriv("WORK_ATTENDANCE_MANAGER_ADD")){
		$('#timecard_div #timecard_add').hide();
	}
//	if(!hasPriv("WORK_ATTENDANCE_MANAGER_EDIT")){
//		$('#timecard_div #').hide();
//	}
	if(!hasPriv("WORK_ATTENDANCE_MANAGER_DELETE")){
		$('#timecard_div #timecard_del').hide();
	}
	if(!hasPriv("WORK_ATTENDANCE_MANAGER_IMPORT")){
		$('#timecard_div #timecard_exp').hide();
	}
//	if(!hasPriv("WORK_ATTENDANCE_MANAGER_STATISTIC")){
//		$('#timecard_div #').hide();
//	}
//	if(!hasPriv("WORK_ATTENDANCE_MANAGER_GATHER")){
//		$('#timecard_div #').hide();
//	}
}

/** 任免管理 */
function rlfw_rmgl_init(){
	if(!hasPriv("APPOINT_MANAGER_ADD")){
		$("#patronage_div #patronage_add").hide();
	}
//	if(!hasPriv("APPOINT_MANAGER_EDIT")){
//		$("#patronage_div #").hide();
//	}
	if(!hasPriv("APPOINT_MANAGER_DELETE")){
		$("#patronage_div #patronage_del").hide();
	}
}

/** 离职管理 */
function rlfw_lzgl_init(){
	if(!hasPriv("DISMISS_MANAGER_ADD")){
		$('#quit_div #quit_add').hide();
	}
//	if(!hasPriv("DISMISS_MANAGER_EDIT")){
//		
//	}
	if(!hasPriv("DISMISS_MANAGER_DELETE")){
		$('#quit_div #quit_del').hide();
	}
}

/** 奖罚记录 */
function rlfw_jfjl_init(){
	if(!hasPriv("AWARD_PUNISH_ADD")){
		$('#reward_div #reward_add').hide();
	}
//	if(!hasPriv("AWARD_PUNISH_EDIT")){
//		
//	}
	if(!hasPriv("AWARD_PUNISH_DELETE")){
		$('#reward_div #reward_del').hide();
	}
}

