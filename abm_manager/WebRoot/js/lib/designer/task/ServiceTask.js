draw2d.ServiceTask = function() {
	draw2d.Task.call(this);
	this.setTitle("服务任务");
	this.setIcon()
};
draw2d.ServiceTask.prototype = new draw2d.Task();
draw2d.ServiceTask.prototype.type = "draw2d.ServiceTask";
draw2d.ServiceTask.newInstance = function(c) {
	var d = new draw2d.ServiceTask();
	d.id = c.attr("id");
	d.taskId = c.attr("id");
	d.taskName = c.attr("name");
	d.setContent(c.attr("name"));
	return d
};
draw2d.ServiceTask.prototype.setWorkflow = function(b) {
	draw2d.Task.prototype.setWorkflow.call(this, b)
};
draw2d.ServiceTask.prototype.figureDoubleClick = function() {
	var c = {
		event : this
	};
	var d = c.event;
	nodeid = d.getId();
	sys_act.openProperties(nodeid, "serviceTaskProperties")
};
draw2d.ServiceTask.prototype.getContextMenu = function() {
	var b = draw2d.Task.prototype.getContextMenu.call(this);
	return b
};
draw2d.ServiceTask.prototype.setIcon = function() {
	var b = draw2d.Task.prototype.setIcon.call(this);
	b.className = "service-task-icon"
};
draw2d.ServiceTask.prototype.getStartElementXML = function() {
	var g = this.taskId;
	var f = trim(this.taskName);
	if (f != null && f != "") {
		g = f
	}
	var h = '<serviceTask id="' + this.taskId + '" name="' + g + '" ';
	var e = trim(this.expression);
	if (this.serviceType == "javaClass") {
		h += ' activiti:class="' + e + '" '
	} else {
		if (this.serviceType == "expression") {
			h += ' activiti:expression="' + e + '" '
		} else {
			if (this.serviceType == "delegateExpression") {
				h += ' activiti:delegateExpression="' + e + '" '
			}
		}
	}
	if (this.resultVariable != null && this.resultVariable != "") {
		h += ' activiti:resultVariableName="' + this.resultVariable + '"'
	}
	if (this.formKey != null && this.formKey != "") {
		h = h + 'activiti:formKey="' + this.formKey + '" '
	}
	h = h + ">\n";
	return h
};
draw2d.ServiceTask.prototype.getEndElementXML = function() {
	var b = "</serviceTask>\n";
	return b
};
draw2d.ServiceTask.prototype.getDocumentationXML = function() {
	if (this.documentation == null || this.documentation == "") {
		return ""
	}
	var b = "<documentation>";
	b = b + this.documentation;
	b = b + "</documentation>";
	return b
};
draw2d.ServiceTask.prototype.getExtensionElementsXML = function() {
	if (this.listeners.getSize() == 0 && this.forms.getSize() == 0) {
		return ""
	}
	var b = "<extensionElements>\n";
	b = b + this.getFormsXML();
	b = b + this.getListenersXML();
	b = b + "</extensionElements>\n";
	return b
};
draw2d.ServiceTask.prototype.getListenersXML = function() {
	var e = "";
	for (var d = 0; d < this.listeners.getSize(); d++) {
		var f = this.listeners.get(d);
		e = e + f.toXML()
	}
	return e
};
draw2d.ServiceTask.prototype.getFormsXML = function() {
	var e = "";
	for (var d = 0; d < this.forms.getSize(); d++) {
		var f = this.forms.get(d);
		e = e + f.toXML()
	}
	return e
};
draw2d.ServiceTask.prototype.getPerformersBPMNXML = function() {
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
draw2d.ServiceTask.prototype.toXML = function() {
	var b = this.getStartElementXML();
	b = b + this.getDocumentationXML();
	b = b + this.getExtensionElementsXML();
	b = b + this.getPerformersBPMNXML();
	b = b + this.getEndElementXML();
	return b
};
draw2d.ServiceTask.prototype.toBpmnDI = function() {
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