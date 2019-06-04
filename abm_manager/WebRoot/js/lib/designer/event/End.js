draw2d.End = function() {
	var _url = "./js/lib/designer/icons/type.endevent.none.png";
	draw2d.ResizeImage.call(this, _url);
	this.rightInputPort = null;
	this.leftInputPort = null;
	this.topInputPort = null;
	this.bottomInputPort = null;
	this.resizeable = false;
	this.eventId = "end";
	this.eventName = "结束节点";
	this.setDimension(30, 30)
};
draw2d.End.prototype = new draw2d.Node();
draw2d.End.prototype.type = "draw2d.End";
draw2d.End.prototype.generateId = function() {
	this.id = "end";
	this.taskId = this.id
};
draw2d.End.prototype.createHTMLElement = function() {
	var b = draw2d.ResizeImage.prototype.createHTMLElement.call(this);
	return b
};
draw2d.End.prototype.setDimension = function(d, c) {
	draw2d.ResizeImage.prototype.setDimension.call(this, d, c)
};
draw2d.End.prototype.setWorkflow = function(b) {
	draw2d.ResizeImage.prototype.setWorkflow.call(this, b);
	if (b !== null && this.rightInputPort === null) {
		this.rightInputPort = new draw2d.MyInputPort();
		this.rightInputPort.setName("RightInputPort");
		this.rightInputPort.setWorkflow(b);
		this.rightInputPort.setBackgroundColor(new draw2d.Color(115, 115, 245));
		this.addPort(this.rightInputPort, this.width, this.height / 2)
	}
	if (b !== null && this.leftInputPort === null) {
		this.leftInputPort = new draw2d.MyInputPort();
		this.leftInputPort.setName("leftInputPort");
		this.leftInputPort.setWorkflow(b);
		this.leftInputPort.setBackgroundColor(new draw2d.Color(115, 115, 245));
		this.addPort(this.leftInputPort, 0, this.height / 2)
	}
	if (b !== null && this.topInputPort === null) {
		this.topInputPort = new draw2d.MyInputPort();
		this.topInputPort.setName("RightInputPort");
		this.topInputPort.setWorkflow(b);
		this.topInputPort.setBackgroundColor(new draw2d.Color(115, 115, 245));
		this.addPort(this.topInputPort, this.width / 2, 0)
	}
	if (b !== null && this.bottomInputPort === null) {
		this.bottomInputPort = new draw2d.MyInputPort();
		this.bottomInputPort.setName("RightInputPort");
		this.bottomInputPort.setWorkflow(b);
		this.bottomInputPort
				.setBackgroundColor(new draw2d.Color(115, 115, 245));
		this.addPort(this.bottomInputPort, this.width / 2, this.height)
	}
};
draw2d.End.prototype.figureDoubleClick = function() {
	var c = {
		event : this
	};
	var d = c.event;
	nodeid = d.getId();
	sys_act.openProperties(nodeid, "eventProperties")
};
draw2d.End.prototype.getContextMenu = function() {
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
draw2d.End.prototype.toXML = function() {
	var b = '<endEvent id="' + this.eventId + '" name="' + this.eventName
			+ '"></endEvent>\n';
	return b
};
draw2d.End.prototype.toBpmnDI = function() {
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