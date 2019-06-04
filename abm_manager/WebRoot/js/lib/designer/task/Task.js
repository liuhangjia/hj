draw2d.Task = function() {
	this.cornerWidth = 15;
	this.cornerHeight = 15;
	this.rightOutputPort = null;
	this.bottomOutputPort = null;
	this.topOutputPort = null;
	this.leftOutputPort = null;
	this.alpha = 1;
	draw2d.Node.call(this);
	this.setDimension(90, 50);
	this.originalHeight = -1;
	this.taskId = null;
	this.taskName = null;
	this.performerType = null;
	this.isUseExpression = false;
	this.expression = null;
	this.formKey = null;
	this.documentation = null;
	this.scriptFormat = null;
	this.resultVariable = null;
	this.toEmail = null;
	this.fromEmail = null;
	this.subjectEmail = null;
	this.ccEmail = null;
	this.bccEmail = null;
	this.charsetEmail = null;
	this.htmlEmail = null;
	this.textEmail = null;
	this.rulesInput = null;
	this.rulesOutputs = null;
	this.rules = null;
	this.isclude = "";
	this.task_extend = null;
	this.isSequential = null;
	this.loopCardinality = null;
	this.collection = null;
	this.elementVariable = null;
	this.completionCondition = null;
	this.listeners = new draw2d.ArrayList();
	this.forms = new draw2d.ArrayList();
	this.candidateUsers = new draw2d.ArrayList();
	this.candidateGroups = new draw2d.ArrayList()
};
draw2d.Task.prototype = new draw2d.Node();
draw2d.Task.prototype.type = "Task";
draw2d.Task.prototype.generateId = function() {
	this.id = "task" + Sequence.create();
	this.taskId = this.id;
	this.taskName = this.id;
	this.scriptFormat = "Groovy";
	this.charsetEmail = "UTF8"
};
draw2d.Task.prototype.figureDoubleClick = function() {
	var c = {
		event : this
	};
	var d = c.event;
	nodeid = d.getId();
	sys_act.openProperties(nodeid, "taskProperties", "task")
};
draw2d.Task.prototype.createHTMLElement = function() {
	var b = document.createElement("div");
	b.id = this.id;
	b.style.position = "absolute";
	b.style.left = this.x + "px";
	b.style.top = this.y + "px";
	b.style.height = this.width + "px";
	b.style.width = this.height + "px";
	b.className = "task";
	b.style.zIndex = "" + draw2d.Figure.ZOrderBaseIndex;
	this.top_left = document.createElement("div");
	this.top_left.className = "task-top-left";
	this.top_left.style.width = this.cornerWidth + "px";
	this.top_left.style.height = this.cornerHeight + "px";
	this.top_right = document.createElement("div");
	this.top_right.className = "task-top-right";
	this.top_right.style.width = this.cornerWidth + "px";
	this.top_right.style.height = this.cornerHeight + "px";
	this.bottom_left = document.createElement("div");
	this.bottom_left.className = "bottom-top-left";
	this.bottom_left.style.width = this.cornerWidth + "px";
	this.bottom_left.style.height = this.cornerHeight + "px";
	this.bottom_right = document.createElement("div");
	this.bottom_right.className = "bottom-top-right";
	this.bottom_right.style.width = this.cornerWidth + "px";
	this.bottom_right.style.height = this.cornerHeight + "px";
	this.header = document.createElement("div");
	this.header.className = "task-header";
	this.header.style.position = "absolute";
	this.header.style.left = this.cornerWidth + "px";
	this.header.style.top = "0px";
	this.header.style.height = (this.cornerHeight) + "px";
	this.disableTextSelection(this.header);
	this.footer = document.createElement("div");
	this.footer.className = "task-footer";
	this.footer.style.position = "absolute";
	this.footer.style.left = this.cornerWidth + "px";
	this.footer.style.top = "0px";
	this.footer.style.height = (this.cornerHeight - 1) + "px";
	this.textarea = document.createElement("div");
	this.textarea.className = "task-textarea";
	this.textarea.style.position = "absolute";
	this.textarea.style.left = "0px";
	this.textarea.style.top = this.cornerHeight + "px";
	this.disableTextSelection(this.textarea);
	b.appendChild(this.top_left);
	b.appendChild(this.header);
	b.appendChild(this.top_right);
	b.appendChild(this.textarea);
	b.appendChild(this.bottom_left);
	b.appendChild(this.footer);
	b.appendChild(this.bottom_right);
	return b
};
draw2d.Task.prototype.setDimension = function(e, d) {
	try {
		draw2d.Node.prototype.setDimension.call(this, e, d);
		if (this.top_left !== null) {
			this.top_right.style.left = (this.width - this.cornerWidth) + "px";
			this.bottom_right.style.left = (this.width - this.cornerWidth)
					+ "px";
			this.bottom_right.style.top = (this.height - this.cornerHeight)
					+ "px";
			this.bottom_left.style.top = (this.height - this.cornerHeight)
					+ "px";
			this.textarea.style.width = (this.width - 2) + "px";
			this.textarea.style.height = (this.height - this.cornerHeight * 2)
					+ "px";
			this.header.style.width = (this.width - this.cornerWidth * 2)
					+ "px";
			this.footer.style.width = (this.width - this.cornerWidth * 2)
					+ "px";
			this.footer.style.top = (this.height - this.cornerHeight) + "px"
		}
		if (this.rightOutputPort !== null) {
			this.rightOutputPort.setPosition(this.width + 5, this.height / 2)
		}
		if (this.bottomOutputPort !== null) {
			this.bottomOutputPort.setPosition(this.width / 2, this.height + 5)
		}
		if (this.leftOutputPort !== null) {
			this.leftOutputPort.setPosition(-5, this.height / 2)
		}
		if (this.topOutputPort !== null) {
			this.topOutputPort.setPosition(this.width / 2, -5)
		}
	} catch (f) {
	}
};
draw2d.Task.prototype.setTitle = function(b) {
	this.header.innerHTML = b
};
draw2d.Task.prototype.setContent = function(b) {
	this.textarea.innerHTML = b
};
draw2d.Task.prototype.onDragstart = function(e, f) {
	var d = draw2d.Node.prototype.onDragstart.call(this, e, f);
	if (this.header === null) {
		return false
	}
	if (f < this.cornerHeight && e < this.width
			&& e > (this.width - this.cornerWidth)) {
		this.toggle();
		return false
	}
	if (this.originalHeight == -1) {
		if (this.canDrag === true && e < parseInt(this.header.style.width)
				&& f < parseInt(this.header.style.height)) {
			return true
		}
	} else {
		return d
	}
};
draw2d.Task.prototype.setCanDrag = function(b) {
	draw2d.Node.prototype.setCanDrag.call(this, b);
	this.html.style.cursor = "";
	if (this.header === null) {
		return
	}
	if (b) {
		this.header.style.cursor = "move"
	} else {
		this.header.style.cursor = ""
	}
};
draw2d.Task.prototype.setWorkflow = function(b) {
	draw2d.Node.prototype.setWorkflow.call(this, b);
	if (b !== null && this.leftOutputPort === null) {
		this.leftOutputPort = new draw2d.MyOutputPort();
		this.leftOutputPort.setWorkflow(b);
		this.leftOutputPort.setName("leftOutputPort");
		this.addPort(this.leftOutputPort, -5, this.height / 2);
		this.topOutputPort = new draw2d.MyOutputPort();
		this.topOutputPort.setWorkflow(b);
		this.topOutputPort.setName("topOutputPort");
		this.addPort(this.topOutputPort, this.width / 2, -5);
		this.rightOutputPort = new draw2d.MyOutputPort();
		this.rightOutputPort.setMaxFanOut(5);
		this.rightOutputPort.setWorkflow(b);
		this.rightOutputPort.setName("rightOutputPort");
		this.addPort(this.rightOutputPort, this.width + 5, this.height / 2);
		this.bottomOutputPort = new draw2d.MyOutputPort();
		this.bottomOutputPort.setMaxFanOut(5);
		this.bottomOutputPort.setWorkflow(b);
		this.bottomOutputPort.setName("bottomOutputPort");
		this.addPort(this.bottomOutputPort, this.width / 2, this.height + 5)
	}
};
draw2d.Task.prototype.toggle = function() {
	if (this.originalHeight == -1) {
	} else {
	}
};
draw2d.Task.prototype.getContextMenu = function() {
	if (this.workflow.disabled) {
		return null
	}
	var c = new draw2d.ContextMenu(100, 50);
	var d = {
		task : this
	};
	c.appendMenuItem(new draw2d.ContextMenuItem("属性", "properties-icon", d,
			function(h, a) {
				var b = this.getData();
				var g = b.task;
				nodeid = g.getId();
				if (typeof sys_act.openProperties != "undefined") {
					sys_act.openProperties(nodeid, "taskProperties", "task")
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
draw2d.Task.prototype.setIcon = function() {
	this.icon = document.createElement("div");
	this.icon.style.position = "absolute";
	this.icon.style.width = this.cornerWidth + "px";
	this.icon.style.height = this.cornerHeight + "px";
	this.icon.style.left = "6px";
	this.icon.style.top = "1px";
	this.getHTMLElement().appendChild(this.icon);
	return this.icon
};
draw2d.Task.prototype.getListener = function(f) {
	for (var e = 0; e < this.listeners.getSize(); e++) {
		var d = this.listeners.get(e);
		if (d.getId() === f) {
			return d
		}
	}
};
draw2d.Task.prototype.getForm = function(f) {
	for (var e = 0; e < this.forms.getSize(); e++) {
		var d = this.forms.get(e);
		if (d.getId() === f) {
			return d
		}
	}
};
draw2d.Task.prototype.deleteListener = function(c) {
	var d = this.getListener(c);
	this.listeners.remove(d)
};
draw2d.Task.prototype.deleteForm = function(c) {
	var d = this.getForm(c);
	this.forms.remove(d)
};
draw2d.Task.prototype.addListener = function(b) {
	this.listeners.add(b)
};
draw2d.Task.prototype.addForm = function(b) {
	this.forms.add(b)
};
draw2d.Task.prototype.setListeners = function(b) {
	this.listeners = b
};
draw2d.Task.prototype.setForms = function(b) {
	this.forms = b
};
draw2d.Task.prototype.getCandidateUser = function(f) {
	for (var e = 0; e < this.candidateUsers.getSize(); e++) {
		var d = this.candidateUsers.get(e);
		if (d.sso === f) {
			return d
		}
	}
	return null
};
draw2d.Task.prototype.deleteCandidateUser = function(c) {
	var d = this.getCandidateUser(c);
	this.candidateUsers.remove(d)
};
draw2d.Task.prototype.addCandidateUser = function(b) {
	if (this.getCandidateUser(b.sso) == null) {
		this.candidateUsers.add(b)
	}
};
draw2d.Task.prototype.getCandidateGroup = function(e) {
	for (var d = 0; d < this.candidateGroups.getSize(); d++) {
		var f = this.candidateGroups.get(d);
		if (f === e) {
			return f
		}
	}
	return null
};
draw2d.Task.prototype.deleteCandidateGroup = function(d) {
	var c = this.getCandidateGroup(d);
	this.candidateGroups.remove(c)
};
draw2d.Task.prototype.addCandidateGroup = function(b) {
	if (!this.candidateGroups.contains(b)) {
		this.candidateGroups.add(b)
	}
};
draw2d.Task.prototype.setHighlight = function() {
	this.getHTMLElement().className = "task-highlight"
};
draw2d.Task.prototype.onMouseEnter = function() {
	if (typeof onTaskMouseEnter != "undefined") {
		onTaskMouseEnter(this)
	}
};
draw2d.Task.prototype.onMouseLeave = function() {
	if (typeof onTaskMouseLeave != "undefined") {
		onTaskMouseLeave(this)
	}
};