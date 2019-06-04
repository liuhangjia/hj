draw2d.MyCanvas = function(b) {
	draw2d.Workflow.call(this, b);
	this.html.style.backgroundImage = "";
	this.html.className = "MyCanvas";
	this.disabled = false;
	this.processId = null;
	this.processName = null;
	this.process = new draw2d.Process()
};
draw2d.MyCanvas.prototype = new draw2d.Workflow();
draw2d.MyCanvas.prototype.type = "MyCanvas";
draw2d.MyCanvas.prototype.setDisabled = function() {
	this.disabled = true;
	return this.readOnly
};
draw2d.MyCanvas.prototype.addFigure = function(f, g, h) {
	var e = this.getBestCompartmentFigure(g, h);
	if (e === null) {
		draw2d.Workflow.prototype.addFigure.call(this, f, g, h)
	} else {
		this.getCommandStack().execute(new draw2d.CommandAdd(this, f, g, h, e))
	}
};
draw2d.MyCanvas.prototype.addModel = function(f, g, h) {
	var e = this.getBestCompartmentFigure(g, h);
	this.getCommandStack().execute(new draw2d.CommandAdd(this, f, g, h, e))
};
draw2d.MyCanvas.prototype.getContextMenu = function() {
	if (this.readOnly) {
		return null
	}
	var c = new draw2d.ContextMenu(100, 50);
	var d = {
		workflow : this
	};
	c.appendMenuItem(new draw2d.ContextMenuItem("属性", "properties-icon", d,
			function(j, a) {
				var h = this.getData();
				var b = h.workflow;
				var i = b.process.id;
				sys_act.openProperties(i, "processProperties")
			}));
	return c
};
draw2d.MyCanvas.prototype.onContextMenu = function(f, g) {
	if (this.readOnly) {
		return
	}
	var e = this.getBestFigure(f, g);
	if (e == null) {
		e = this.getBestLine(f, g)
	}
	if (e != null) {
		var h = e.getContextMenu();
		if (h !== null) {
			this.showMenu(h, f, g)
		}
	} else {
		var h = this.getContextMenu();
		if (h !== null) {
			this.showMenu(h, f, g)
		}
	}
};
draw2d.MyCanvas.prototype.getXMLHeader = function() {
	var b = '<?xml version="1.0" encoding="UTF-8"?>\n';
	return b
};
draw2d.MyCanvas.prototype.getDefinitionsStartXML = function() {
	var b = '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:activiti="http://activiti.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="'
			+ this.process.category + '">\n';
	return b
};
draw2d.MyCanvas.prototype.getDefinitionsEndXML = function() {
	var b = "</definitions>\n";
	return b
};
draw2d.MyCanvas.prototype.toXML = function() {
	var n = this.getXMLHeader();
	n = n + this.getDefinitionsStartXML();
	n = n + '<process id="' + this.process.id + '" name="' + this.process.name
			+ '">\n';
	n = n + this.process.getDocumentationXML();
	n = n + this.process.getExtensionElementsXML();
	var l = '<bpmndi:BPMNDiagram id="BPMNDiagram_' + this.process.id + '">\n';
	l = l + '<bpmndi:BPMNPlane bpmnElement="' + this.process.id
			+ '" id="BPMNPlane_' + this.process.id + '">\n';
	var k = this.getFigures();
	for (var m = 0; m < k.getSize(); m++) {
		var o = k.get(m);
		for (var p = 0; p < DefaultModelTypeEnum.length; p++) {
			if (DefaultModelTypeEnum[p] == o.type) {
				n = n + o.toXML();
				l = l + o.toBpmnDI();
				break
			}
		}
	}
	var i = this.getLines();
	for (var m = 0; m < i.getSize(); m++) {
		var j = i.get(m);
		for (var p = 0; p < DefaultModelTypeEnum.length; p++) {
			if (DefaultModelTypeEnum[p] == j.type) {
				n = n + j.toXML();
				l = l + j.toBpmnDI();
				break
			}
		}
	}
	n = n + "</process>\n";
	l = l + "</bpmndi:BPMNPlane>\n";
	l = l + "</bpmndi:BPMNDiagram>\n";
	n = n + l;
	n = n + this.getDefinitionsEndXML();
	n = formatXml(n);
	return n
};