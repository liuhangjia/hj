draw2d.ReceiveTask = function() {
	draw2d.Task.call(this);
	this.setTitle("接收任务");
	this.setIcon()
};
draw2d.ReceiveTask.prototype = new draw2d.Task();
draw2d.ReceiveTask.prototype.type = "draw2d.ReceiveTask";
draw2d.ReceiveTask.newInstance = function(c) {
	var d = new draw2d.ReceiveTask();
	d.id = c.attr("id");
	d.taskId = c.attr("id");
	d.taskName = scriptTaskXMLNode.attr("name");
	d.setContent(scriptTaskXMLNode.attr("name"));
	return d
};
draw2d.ReceiveTask.prototype.setWorkflow = function(b) {
	draw2d.Task.prototype.setWorkflow.call(this, b)
};
draw2d.ReceiveTask.prototype.getContextMenu = function() {
	var b = draw2d.Task.prototype.getContextMenu.call(this);
	return b
};
draw2d.ReceiveTask.prototype.setIcon = function() {
	var b = draw2d.Task.prototype.setIcon.call(this);
	b.className = "receive-task-icon"
};
draw2d.ReceiveTask.prototype.getStartElementXML = function() {
	var f = this.taskId;
	var e = trim(this.taskName);
	if (e != null && e != "") {
		f = e
	}
	var d = '<receiveTask id="' + this.taskId + '" name="' + f + '">\n';
	return d
};
draw2d.ReceiveTask.prototype.getEndElementXML = function() {
	var b = "</receiveTask>\n";
	return b
};
draw2d.ReceiveTask.prototype.figureDoubleClick = function() {
	var d = {
		event : this
	};
	var e = d.event;
	var f = e.getId();
	openProperties(f, "receiveTaskProperties")
};
draw2d.ReceiveTask.prototype.getContextMenu = function() {
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
					sys_act.openProperties(b, "receiveTaskProperties")
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
draw2d.ReceiveTask.prototype.toXML = function() {
	var b = this.getStartElementXML();
	b = b + this.getEndElementXML();
	return b
};
draw2d.ReceiveTask.prototype.toBpmnDI = function() {
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