draw2d.DecoratedConnection = function() {
	draw2d.Connection.call(this);
	var d = new draw2d.ArrowConnectionDecorator();
	var c = new draw2d.Color(0, 0, 0);
	d.setBackgroundColor(c);
	this.setTargetDecorator(d);
	this.setRouter(new draw2d.ManhattanConnectionRouter());
	this.setLineWidth(1);
	this.setColor(c);
	this.lineId = null;
	this.lineName = null;
	this.lineNameCode = null;
	this.condition = null;
	this.listeners = new draw2d.ArrayList();
	this.label = null;
};
draw2d.DecoratedConnection.prototype = new draw2d.Connection();
draw2d.DecoratedConnection.prototype.type = "DecoratedConnection";
draw2d.DecoratedConnection.prototype.getConditionXML = function() {
	var c = "";
	if (this.condition != null && this.condition != "") {
		var d = this.condition.replace(/(^\s*)|(\s*$)/g, "");
		c = '<conditionExpression xsi:type="tFormalExpression"><![CDATA[' + d + "]]></conditionExpression>\n"
	}
	return c;
};
draw2d.DecoratedConnection.prototype.toXML = function() {
	var i = null;
	var k = this.getSource().getParent().type;
	if (k == "draw2d.Start") {
		i = this.getSource().getParent().eventId;
	}else if(k == "draw2d.ExclusiveGateway"){
		i = this.getSource().getParent().gatewayId;
	}else if(k == "draw2d.ParallelGateway"){
		i = this.getSource().getParent().gatewayId;
	}else if(k == "draw2d.TimerBoundary"){
		i = this.getSource().getParent().boundaryId;
	}else if(k == "draw2d.ErrorBoundary"){
		i = this.getSource().getParent().boundaryId;
	}else if(k == "draw2d.CallActivity"){
		i = this.getSource().getParent().subProcessId;
	}else{
		i = this.getSource().getParent().taskId;
	}

	var l = null;
	k = this.getTarget().getParent().type;
	if (k == "draw2d.End") {
		l = this.getTarget().getParent().eventId
	} else {
		if (k == "draw2d.ExclusiveGateway") {
			l = this.getTarget().getParent().gatewayId
		} else {
			if (k == "draw2d.ParallelGateway") {
				l = this.getTarget().getParent().gatewayId
			} else {
				if (k == "draw2d.TimerBoundary") {
					l = this.getTarget().getParent().boundaryId
				} else {
					if (k == "draw2d.ErrorBoundary") {
						l = this.getTarget().getParent().boundaryId
					} else {
						if (k == "draw2d.CallActivity") {
							l = this.getTarget().getParent().subProcessId
						} else {
							l = this.getTarget().getParent().taskId
						}
					}
				}
			}
		}
	}
	var g = "";
	var j = trim(this.lineName);
	if (j != null && j != "") {
		g = j;
	}
	var h = '<sequenceFlow id="' + this.lineId + '" name="' + g + '" sourceRef="' + i + '" targetRef="' + l + '">\n';
	h = h + this.getConditionXML();
	h += this.getListenersXML();
	h = h + "</sequenceFlow>\n";
	return h
};
draw2d.DecoratedConnection.prototype.setLabel = function(b) {
	if (this.label == null) {
		this.label = new draw2d.Label(b);
		this.label.setFontSize(8);
		this.label.setAlign("center");
		this.addFigure(this.label, new draw2d.ManhattanMidpointLocator(this));
	} else {
		this.label.setText(b);
	}
};
draw2d.DecoratedConnection.prototype.toBpmnDI = function() {
	/**
	 <bpmndi:BPMNEdge bpmnElement="flow3" id="BPMNEdge_flow3">
        <omgdi:waypoint x="433.0" y="207.0"></omgdi:waypoint>
        <omgdi:waypoint x="541.0" y="207.0"></omgdi:waypoint>
        <bpmndi:BPMNLabel>
          <omgdc:Bounds height="16.0" width="32.0" x="469.0" y="190.0"></omgdc:Bounds>
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
	 * 
	 * */
	
	var e = '<bpmndi:BPMNEdge bpmnElement="' + this.lineId + '" id="BPMNEdge_' + this.lineId + '">\n';
	var f = this.getPoints();
	for (var d = 0; d < f.size; d++) {
		e = e + '<omgdi:waypoint x="' + f.get(d).x + '" y="' + f.get(d).y + '" />\n';
	}
	if(null != this.label && '' != this.label.msg){
		e = e + '<bpmndi:BPMNLabel>\n';
		e = e + '<omgdc:Bounds height="'+this.label.height+'" width="'+this.label.width+'" x="'+this.label.x+'" y="'+this.label.y+'" />\n';
		e = e + '</bpmndi:BPMNLabel>\n';
	}
	e = e + "</bpmndi:BPMNEdge>\n";
	return e;
};
draw2d.DecoratedConnection.prototype.onDoubleClick = function() {
	sys_act.openProperties(this, "flowProperties");
};
draw2d.DecoratedConnection.prototype.getContextMenu = function() {
	if (this.workflow.disabled) {
		return null
	}
	var c = new draw2d.ContextMenu(100, 50);
	var d = {
		line : this
	};
	c.appendMenuItem(new draw2d.ContextMenuItem("属性", "properties-icon", d,
			function(h, a) {
				var b = this.getData();
				var g = b.line;
				if (typeof sys_act.openProperties != "undefined") {
					sys_act.openProperties(g, "flowProperties")
				}
			}));
	c.appendMenuItem(new draw2d.ContextMenuItem("删除", "icon-remove", d,
			function(l, a) {
				var b = this.getData();
				var k = b.line;
				var i = k.getId();
				var j = k.getWorkflow();
				j.getCommandStack().execute(new draw2d.CommandDelete(k))
			}));
	return c
};
draw2d.DecoratedConnection.prototype.getListenersXML = function() {
	var e = "";
	for (var d = 0; d < this.listeners.getSize(); d++) {
		var f = this.listeners.get(d);
		e = e + f.toXML()
	}
	if (e != null && e != "") {
		e = "<extensionElements> " + e + " </extensionElements>"
	}
	return e
};
draw2d.DecoratedConnection.prototype.getListener = function(f) {
	for (var e = 0; e < this.listeners.getSize(); e++) {
		var d = this.listeners.get(e);
		if (d.getId() === f) {
			return d
		}
	}
};
draw2d.DecoratedConnection.prototype.deleteListener = function(c) {
	var d = this.getListener(c);
	this.listeners.remove(d);
};
draw2d.DecoratedConnection.prototype.setListener = function(b) {
	this.listeners.add(b);
};
draw2d.DecoratedConnection.prototype.addListener = function(b) {
	this.listeners.add(b)
};
draw2d.DecoratedConnection.prototype.setListeners = function(b) {
	this.listeners = b;
};