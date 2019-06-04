draw2d.ScriptTask = function() {
	draw2d.Task.call(this);
	this.setTitle("脚本任务");
	this.setIcon()
};
draw2d.ScriptTask.prototype = new draw2d.Task();
draw2d.ScriptTask.prototype.type = "draw2d.ScriptTask";
draw2d.ScriptTask.newInstance = function(d) {
	var c = new draw2d.ScriptTask();
	c.id = d.attr("id");
	c.taskId = d.attr("id");
	c.taskName = d.attr("name");
	c.setContent(d.attr("name"));
	return c
};
draw2d.ScriptTask.prototype.setWorkflow = function(b) {
	draw2d.Task.prototype.setWorkflow.call(this, b)
};
draw2d.ScriptTask.prototype.getContextMenu = function() {
	var b = draw2d.Task.prototype.getContextMenu.call(this);
	return b
};
draw2d.ScriptTask.prototype.setIcon = function() {
	var b = draw2d.Task.prototype.setIcon.call(this);
	b.className = "script-task-icon"
};
draw2d.ScriptTask.prototype.getStartElementXML = function() {
	var h = this.taskId;
	var f = trim(this.taskName);
	if (f != null && f != "") {
		h = f
	}
	var g = this.scriptFormat;
	if (g == null || g == "") {
		g = "Groovy"
	}
	var e = '<scriptTask id="' + this.taskId + '" name="' + h
			+ '" scriptFormat="' + g + '" ';
	if (this.resultVariable != null && this.resultVariable != "") {
		e = e + 'activiti:resultVariable="' + this.resultVariable + '" '
	}
	if (this.formKey != null && this.formKey != "") {
		e = e + 'activiti:formKey="' + this.formKey + '" '
	}
	e = e + ">\n";
	return e
};
draw2d.ScriptTask.prototype.getEndElementXML = function() {
	var b = "<\/scriptTask>\n";
	return b
};
draw2d.ScriptTask.prototype.getDocumentationXML = function() {
	if (this.documentation == null || this.documentation == "") {
		return ""
	}
	var b = "<documentation>";
	b = b + this.documentation;
	b = b + "</documentation>";
	return b
};
draw2d.ScriptTask.prototype.getScriptXML = function() {
	var b = "<script>";
	b = b + this.expression;
	b = b + "<\/script>";
	return b
};
draw2d.ScriptTask.prototype.figureDoubleClick = function() {
	var d = {
		event : this
	};
	var e = d.event;
	var f = e.getId();
	sys_act.openProperties(f, "scriptTaskProperties")
};
draw2d.ScriptTask.prototype.getContextMenu = function() {
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
					sys_act.openProperties(b, "scriptTaskProperties")
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
draw2d.ScriptTask.prototype.toXML = function() {
	var b = this.getStartElementXML();
	b = b + this.getDocumentationXML();
	b = b + this.getScriptXML();
	b = b + this.getEndElementXML();
	return b
};
draw2d.ScriptTask.prototype.toBpmnDI = function() {
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