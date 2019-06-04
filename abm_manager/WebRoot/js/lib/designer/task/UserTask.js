draw2d.UserTask = function() {
	draw2d.Task.call(this);
	this.setTitle("用户任务");
	this.setIcon()
};
draw2d.UserTask.prototype = new draw2d.Task();
draw2d.UserTask.prototype.type = "draw2d.UserTask";
draw2d.UserTask.newInstance = function(c) {
	var d = new draw2d.UserTask();
	d.id = c.attr("id");
	d.taskId = c.attr("id");
	d.taskName = c.attr("name");
	d.setContent(c.attr("name"));
	return d
};
draw2d.UserTask.prototype.setWorkflow = function(b) {
	draw2d.Task.prototype.setWorkflow.call(this, b)
};
draw2d.UserTask.prototype.getContextMenu = function() {
	var b = draw2d.Task.prototype.getContextMenu.call(this);
	return b
};
draw2d.UserTask.prototype.setIcon = function() {
	var b = draw2d.Task.prototype.setIcon.call(this);
	b.className = "user-task-icon"
};
draw2d.UserTask.prototype.getStartElementXML = function() {
	var f = this.taskId;
	var e = trim(this.taskName);
	if (e != null && e != "") {
		f = e;
	}
	var d = '<userTask id="' + this.taskId + '" name="' + f + '" ';
	if (this.isUseExpression) {
		if (this.performerType == "assignee") {
			d = d + 'activiti:assignee="' + this.expression + '" ';
		} else {
			if (this.performerType == "candidateUsers") {
				d = d + 'activiti:candidateUsers="' + this.expression + '" ';
			} else if (this.performerType == "candidateGroups"){
					d = d + 'activiti:candidateGroups="' + this.expression + '" ';
			}
		}
	}
	if (this.formKey != null && this.formKey != "") {
		d = d + 'activiti:formKey="' + this.formKey + '" '
	}
	d = d + ">\n";
	return d
};
draw2d.UserTask.prototype.getEndElementXML = function() {
	var b = "</userTask>\n";
	return b
};
draw2d.UserTask.prototype.getDocumentationXML = function() {
	if (this.documentation == null || this.documentation == "") {
		return ""
	}
	var b = "<documentation>";
	b = b + this.documentation;
	b = b + "</documentation>";
	return b
};
draw2d.UserTask.prototype.getExtensionElementsXML = function() {
	if (this.listeners.getSize() == 0 && this.forms.getSize() == 0) {
		return ""
	}
	var b = "<extensionElements>\n";
	b = b + this.getFormsXML();
	b = b + this.getListenersXML();
	b = b + "</extensionElements>\n";
	return b
};
draw2d.UserTask.prototype.getListenersXML = function() {
	var e = "";
	for (var d = 0; d < this.listeners.getSize(); d++) {
		var f = this.listeners.get(d);
		e = e + f.toXML()
	}
	return e
};
draw2d.UserTask.prototype.getFormsXML = function() {
	var e = "";
	for (var d = 0; d < this.forms.getSize(); d++) {
		var f = this.forms.get(d);
		e = e + f.toXML()
	}
	return e
};
draw2d.UserTask.prototype.getPerformersBPMNXML = function() {
	var e = "";
	if (this.performerType == "candidateUsers") {
		if (this.candidateUsers.getSize() != 0) {
			e = e + "<potentialOwner>\n";
			e = e + "<resourceAssignmentExpression>\n";
			e = e + "<formalExpression>\n";
			e = e + "<![CDATA[";
			for (var h = 0; h < this.candidateUsers.getSize(); h++) {
				var f = this.candidateUsers.get(h);
				e = e + "user(" + f.sso + "),"
			}
			e = e.substring(0, e.length - 1);
			e = e + "]]>\n";
			e = e + "</formalExpression>\n";
			e = e + "</resourceAssignmentExpression>\n";
			e = e + "</potentialOwner>\n"
		}
	} else {
		if (this.performerType == "candidateGroups") {
			if (this.candidateGroups.getSize() != 0) {
				e = e + "<potentialOwner>\n";
				e = e + "<resourceAssignmentExpression>\n";
				e = e + "<formalExpression>\n";
				e = e + "<![CDATA[";
				for (var h = 0; h < this.candidateGroups.getSize(); h++) {
					var g = this.candidateGroups.get(h);
					e = e + "group(" + g + "),"
				}
				e = e.substring(0, e.length - 1);
				e = e + "]]>\n";
				e = e + "</formalExpression>\n";
				e = e + "</resourceAssignmentExpression>\n";
				e = e + "</potentialOwner>\n"
			}
		}
	}
	return e
};
draw2d.UserTask.prototype.toXML = function() {
	var b = this.getStartElementXML();
	b = b + this.getDocumentationXML();
	b = b + this.getExtensionElementsXML();
	b = b + this.getPerformersBPMNXML();
	b = b + this.getMultiInstanceXML();
	b = b + this.getEndElementXML();
	return b
};
draw2d.UserTask.prototype.toBpmnDI = function() {
	var f = this.getWidth();
	var i = this.getHeight();
	var g = this.getAbsoluteX();
	var h = this.getAbsoluteY();
	var j = '<bpmndi:BPMNShape bpmnElement="' + this.taskId
			+ '" id="BPMNShape_' + this.taskId + '">\n';
	j = j + '<omgdc:Bounds height="' + i + '" width="' + f + '" x="' + g
			+ '" y="' + h + '"/>\n';
	j = j + "</bpmndi:BPMNShape>\n";
	return j
};
draw2d.UserTask.prototype.getMultiInstanceXML = function() {
	var b = "";
	if (this.isSequential == null || this.isSequential == "") {
		return ""
	}
	b += '<multiInstanceLoopCharacteristics  isSequential="'
			+ this.isSequential + '" activiti:collection="' + this.collection
			+ '"  activiti:elementVariable="' + this.elementVariable + '" >';
	if (this.loopCardinality != null && this.loopCardinality != "") {
		b += "<loopCardinality>" + this.loopCardinality + "</loopCardinality>"
	}
	if (this.completionCondition != null && this.completionCondition != "") {
		b += "<completionCondition>" + this.completionCondition
				+ "</completionCondition>"
	}
	b += "</multiInstanceLoopCharacteristics>";
	return b
};
draw2d.UserTask.prototype.getTaskExtendXML = function() {
	var b = "";
	if (this.task_extend == null || this.task_extend == "") {
		return ""
	}
	b += task_extend;
	return b
};