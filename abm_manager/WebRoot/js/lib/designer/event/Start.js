draw2d.Start = function() {
	var b = "./js/lib/designer/icons/type.startevent.none.png";
	draw2d.ResizeImage.call(this, b);
	this.rightOutputPort = null;
	this.leftOutputPort = null;
	this.topOutputPort = null;
	this.resizeable = false;
	this.bottomOutputPort = null;
	this.eventId = "start1";
	this.eventName = "开始节点";
	this.expression = "applyUserId";
	this.setDimension(30, 30)
};
draw2d.Start.prototype = new draw2d.Node();
draw2d.Start.prototype.type = "draw2d.Start";
draw2d.Start.prototype.generateId = function() {
	this.id = "start1";
	this.eventId = this.id
};
draw2d.Start.prototype.createHTMLElement = function() {
	var b = draw2d.ResizeImage.prototype.createHTMLElement.call(this);
	return b
};
draw2d.Start.prototype.setDimension = function(d, c) {
	draw2d.ResizeImage.prototype.setDimension.call(this, d, c)
};
draw2d.Start.prototype.setWorkflow = function(b) {
	draw2d.ResizeImage.prototype.setWorkflow.call(this, b);
	if (b !== null && this.rightOutputPort === null) {
		this.rightOutputPort = new draw2d.MyOutputPort();
		this.rightOutputPort.setMaxFanOut(1);
		this.rightOutputPort.setWorkflow(b);
		this.rightOutputPort.setName("rightOutputPort");
		this.rightOutputPort
				.setBackgroundColor(new draw2d.Color(245, 115, 115));
		this.addPort(this.rightOutputPort, this.width, this.height / 2)
	}
	if (b !== null && this.leftOutputPort === null) {
		this.leftOutputPort = new draw2d.MyOutputPort();
		this.leftOutputPort.setMaxFanOut(1);
		this.leftOutputPort.setWorkflow(b);
		this.leftOutputPort.setName("leftOutputPort");
		this.leftOutputPort.setBackgroundColor(new draw2d.Color(245, 115, 115));
		this.addPort(this.leftOutputPort, 0, this.height / 2)
	}
	if (b !== null && this.topOutputPort === null) {
		this.topOutputPort = new draw2d.MyOutputPort();
		this.topOutputPort.setMaxFanOut(1);
		this.topOutputPort.setWorkflow(b);
		this.topOutputPort.setName("topOutputPort");
		this.topOutputPort.setBackgroundColor(new draw2d.Color(245, 115, 115));
		this.addPort(this.topOutputPort, this.width / 2, 0)
	}
	if (b !== null && this.bottomOutputPort === null) {
		this.bottomOutputPort = new draw2d.MyOutputPort();
		this.bottomOutputPort.setMaxFanOut(1);
		this.bottomOutputPort.setWorkflow(b);
		this.bottomOutputPort.setName("bottomOutputPort");
		this.bottomOutputPort.setBackgroundColor(new draw2d.Color(245, 115, 115));
		this.addPort(this.bottomOutputPort, this.width / 2, this.height)
	}
};
draw2d.Start.prototype.figureDoubleClick = function() {
	var c = {
		event : this
	};
	var d = c.event;
	nodeid = d.getId();
	sys_act.openProperties(nodeid, "eventProperties")
};
draw2d.Start.prototype.getContextMenu = function() {
	if (this.workflow.disabled) {
		return null
	}
	var c = new draw2d.ContextMenu(100, 50);
	var d = {
		event : this
	};
	c.appendMenuItem(new draw2d.ContextMenuItem("属性", "properties-icon", d,
			function(h, a) {
				var b = this.getData();
				var g = b.event;
				nodeid = g.getId();
				if (typeof sys_act.openProperties != "undefined") {
					sys_act.openProperties(nodeid, "eventProperties")
				}
			}));
	return c
};
draw2d.Start.prototype.toXML = function() {
	var b = '<startEvent id="' + this.eventId + '" name="' + this.eventName
			+ '" activiti:initiator="' + this.expression + '"></startEvent>\n';
	return b
};
draw2d.Start.prototype.toBpmnDI = function() {
	var f = this.getWidth();
	var i = this.getHeight();
	var g = this.getAbsoluteX();
	var h = this.getAbsoluteY();
	var j = '<bpmndi:BPMNShape bpmnElement="' + this.eventId
			+ '" id="BPMNShape_' + this.eventId + '">\n';
	j = j + '<omgdc:Bounds height="' + i + '" width="' + f + '" x="' + g
			+ '" y="' + h + '"/>\n';
	j = j + "</bpmndi:BPMNShape>\n";
	return j
};