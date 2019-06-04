draw2d.MailTask = function() {
	draw2d.Task.call(this);
	this.setTitle("邮件任务");
	this.setIcon()
};
draw2d.MailTask.prototype = new draw2d.Task();
draw2d.MailTask.prototype.type = "draw2d.MailTask";
draw2d.MailTask.newInstance = function(c) {
	var d = new draw2d.MailTask();
	d.id = c.attr("id");
	d.taskId = c.attr("id");
	return d
};
draw2d.MailTask.prototype.setWorkflow = function(b) {
	draw2d.Task.prototype.setWorkflow.call(this, b)
};
draw2d.MailTask.prototype.getContextMenu = function() {
	var b = draw2d.Task.prototype.getContextMenu.call(this);
	return b
};
draw2d.MailTask.prototype.setIcon = function() {
	var b = draw2d.Task.prototype.setIcon.call(this);
	b.className = "mail-task-icon"
};
draw2d.MailTask.prototype.getStartElementXML = function() {
	var d = '<serviceTask id="' + this.taskId + '"  activiti:type="mail">\n';
	d = d + "<extensionElements>\n";
	d = d + '<activiti:field name="to" expression="' + this.toEmail + '" />\n';
	if (this.fromEmail != null && this.fromEmail != "") {
		d = d + '<activiti:field name="from" expression="' + this.fromEmail
				+ '" />\n'
	}
	if (this.subjectEmail != null && this.subjectEmail != "") {
		d = d + '<activiti:field name="subject" expression="'
				+ this.subjectEmail + '" />\n'
	}
	if (this.ccEmail != null && this.ccEmail != "") {
		d = d + '<activiti:field name="cc" expression="' + this.ccEmail
				+ '" />\n'
	}
	if (this.bccEmail != null && this.bccEmail != "") {
		d = d + '<activiti:field name="bcc" expression="' + this.bccEmail
				+ '" />\n'
	}
	var c = this.charsetEmail;
	if (c == null || c == "") {
		c = "UTF8"
	}
	if (this.charsetEmail != null && this.charsetEmail != "") {
		d = d + '<activiti:field name="charset" expression="' + c + '" />\n'
	}
	if (this.htmlEmail != null && this.htmlEmail != "") {
		d = d + '<activiti:field name="html" >\n';
		d = d + "<activiti:expression>\n";
		d = d + "<![CDATA[" + this.htmlEmail;
		d = d + "]]>\n";
		d = d + "</activiti:expression>\n";
		d = d + "</activiti:field>\n"
	}
	if (this.textEmail != null && this.textEmail != "") {
		d = d + '<activiti:field name="text" >\n';
		d = d + "<activiti:expression>\n";
		d = d + "<![CDATA[" + this.textEmail;
		d = d + "]]>\n";
		d = d + "</activiti:expression>\n";
		d = d + "</activiti:field>\n"
	}
	d = d + "</extensionElements>\n";
	return d
};
draw2d.MailTask.prototype.getEndElementXML = function() {
	var b = "</serviceTask>\n";
	return b
};
draw2d.MailTask.prototype.figureDoubleClick = function() {
	var d = {
		event : this
	};
	var e = d.event;
	var f = e.getId();
	sys_act.openProperties(f, "mailTaskProperties")
};
draw2d.MailTask.prototype.getContextMenu = function() {
	if (this.workflow.disabled) {
		return null
	}
	var c = new draw2d.ContextMenu(100, 50);
	var d = {
		task : this
	};
	c.appendMenuItem(new draw2d.ContextMenuItem("属性", "properties-icon", d,
			function(j, a) {
				var h = this.getData();
				var i = h.task;
				var b = i.getId();
				if (typeof sys_act.openProperties != "undefined") {
					sys_act.openProperties(b, "mailTaskProperties")
				}
			}));
	c.appendMenuItem(new draw2d.ContextMenuItem("删除", "icon-remove", d,
			function(l, a) {
				var i = this.getData();
				var k = i.task;
				var b = k.getId();
				var j = k.getWorkflow();
				j.getCommandStack().execute(new draw2d.CommandDelete(k))
			}));
	return c
};
draw2d.MailTask.prototype.toXML = function() {
	var b = this.getStartElementXML();
	b = b + this.getEndElementXML();
	return b
};
draw2d.MailTask.prototype.toBpmnDI = function() {
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