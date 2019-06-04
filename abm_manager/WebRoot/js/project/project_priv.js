function manager_authentication(){
	if(!hasPriv("PROJECT_MANAGER_ADD")){
		$("#project_manage_add_btn").hide();
		$("#project_manage_upload_btn").hide();
	}
	if(!hasPriv("PROJECT_MANAGER_DELETE")){
		$("#project_manage_del_btn").hide();
	}
}

function range_authentication(){
	if(!hasPriv("PROJECT_SHIFT_ADD")){
		$("#range_add").hide();
	}
	if(!hasPriv("PROJECT_SHIFT_DELETE")){
		$("#range_del").hide();
	}
}

function personnel_authentication(){
	if(!hasPriv("PROJECT_EMPLOYEE_ADD")){
		$('[id^="project_personnel_add_btn"]').hide();
	}
	if(!hasPriv("PROJECT_EMPLOYEE_DELETE")){
		$('[id^="project_personnel_del_btn"]').hide();
	}
}

function communication_authentication(){
	if(!hasPriv("PROJECT_COMMUNICATION_ADD")){
		$('[id^="project_communication_add_btn"]').hide();
	}
	if(!hasPriv("PROJECT_COMMUNICATION_DELETE")){
		$('[id^="project_communication_del_btn"]').hide();
	}
}

function checking_authentication(){
	if(!hasPriv("PROJECT_CHECKING_ADD")){
		$('[id^="project_work_add_btn"]').hide();
	}
	if(!hasPriv("PROJECT_CHECKING_DELETE")){
		$('[id^="project_work_del_btn"]').hide();
	}
}
















