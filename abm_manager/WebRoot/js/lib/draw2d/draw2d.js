var draw2d = new Object();
var _errorStack_ = [];
function pushErrorStack(d, c) {
	_errorStack_.push(c + "\n");
	throw d
}
draw2d.AbstractEvent = function() {
	this.type = null;
	this.target = null;
	this.relatedTarget = null;
	this.cancelable = false;
	this.timeStamp = null;
	this.returnValue = true
};
draw2d.AbstractEvent.prototype.initEvent = function(c, d) {
	this.type = c;
	this.cancelable = d;
	this.timeStamp = (new Date()).getTime()
};
draw2d.AbstractEvent.prototype.preventDefault = function() {
	if (this.cancelable) {
		this.returnValue = false
	}
};
draw2d.AbstractEvent.fireDOMEvent = function(f, d) {
	if (document.createEvent) {
		var e = document.createEvent("Events");
		e.initEvent(f, true, true);
		d.dispatchEvent(e)
	} else {
		if (document.createEventObject) {
			var e = document.createEventObject();
			d.fireEvent("on" + f, e)
		}
	}
};
draw2d.EventTarget = function() {
	this.eventhandlers = {}
};
draw2d.EventTarget.prototype.addEventListener = function(c, d) {
	if (typeof this.eventhandlers[c] == "undefined") {
		this.eventhandlers[c] = []
	}
	this.eventhandlers[c][this.eventhandlers[c].length] = d
};
draw2d.EventTarget.prototype.dispatchEvent = function(c) {
	c.target = this;
	if (typeof this.eventhandlers[c.type] != "undefined") {
		for (var d = 0; d < this.eventhandlers[c.type].length; d++) {
			this.eventhandlers[c.type][d](c)
		}
	}
	return c.returnValue
};
draw2d.EventTarget.prototype.removeEventListener = function(g, h) {
	if (typeof this.eventhandlers[g] != "undefined") {
		var f = [];
		for (var e = 0; e < this.eventhandlers[g].length; e++) {
			if (this.eventhandlers[g][e] != h) {
				f[f.length] = this.eventhandlers[g][e]
			}
		}
		this.eventhandlers[g] = f
	}
};
String.prototype.trim = function() {
	return (this.replace(new RegExp("^([\\s]+)|([\\s]+)$", "gm"), ""))
};
String.prototype.lefttrim = function() {
	return (this.replace(new RegExp("^[\\s]+", "gm"), ""))
};
String.prototype.righttrim = function() {
	return (this.replace(new RegExp("[\\s]+$", "gm"), ""))
};
String.prototype.between = function(h, i, j) {
	if (!j) {
		j = 0
	}
	var g = this.indexOf(h, j);
	if (g == -1) {
		return null
	}
	var f = this.indexOf(i, g);
	if (f == -1) {
		return null
	}
	return this.substring(g + h.length, f)
};
draw2d.UUID = function() {
};
draw2d.UUID.prototype.type = "draw2d.UUID";
draw2d.UUID.create = function() {
	var b = function() {
		return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1)
	};
	return (b() + b() + "-" + b() + "-" + b() + "-" + b() + "-" + b() + b() + b())
};
draw2d.ArrayList = function() {
	this.increment = 10;
	this.size = 0;
	this.data = new Array(this.increment)
};
draw2d.ArrayList.EMPTY_LIST = new draw2d.ArrayList();
draw2d.ArrayList.prototype.type = "draw2d.ArrayList";
draw2d.ArrayList.prototype.reverse = function() {
	var c = new Array(this.size);
	for (var d = 0; d < this.size; d++) {
		c[d] = this.data[this.size - d - 1]
	}
	this.data = c
};
draw2d.ArrayList.prototype.getCapacity = function() {
	return this.data.length
};
draw2d.ArrayList.prototype.getSize = function() {
	return this.size
};
draw2d.ArrayList.prototype.isEmpty = function() {
	return this.getSize() === 0
};
draw2d.ArrayList.prototype.getLastElement = function() {
	if (this.data[this.getSize() - 1] !== null) {
		return this.data[this.getSize() - 1]
	}
};
draw2d.ArrayList.prototype.getFirstElement = function() {
	if (this.data[0] !== null && this.data[0] !== undefined) {
		return this.data[0]
	}
	return null
};
draw2d.ArrayList.prototype.get = function(b) {
	return this.data[b]
};
draw2d.ArrayList.prototype.add = function(b) {
	if (this.getSize() == this.data.length) {
		this.resize()
	}
	this.data[this.size++] = b
};
draw2d.ArrayList.prototype.addAll = function(c) {
	for (var d = 0; d < c.getSize(); d++) {
		this.add(c.get(d))
	}
};
draw2d.ArrayList.prototype.remove = function(c) {
	var d = this.indexOf(c);
	if (d >= 0) {
		return this.removeElementAt(d)
	}
	return null
};
draw2d.ArrayList.prototype.insertElementAt = function(f, e) {
	if (this.size == this.capacity) {
		this.resize()
	}
	for (var d = this.getSize(); d > e; d--) {
		this.data[d] = this.data[d - 1]
	}
	this.data[e] = f;
	this.size++
};
draw2d.ArrayList.prototype.removeElementAt = function(d) {
	var e = this.data[d];
	for (var f = d; f < (this.getSize() - 1); f++) {
		this.data[f] = this.data[f + 1]
	}
	this.data[this.getSize() - 1] = null;
	this.size--;
	return e
};
draw2d.ArrayList.prototype.removeAllElements = function() {
	this.size = 0;
	for (var b = 0; b < this.data.length; b++) {
		this.data[b] = null
	}
};
draw2d.ArrayList.prototype.indexOf = function(c) {
	for (var d = 0; d < this.getSize(); d++) {
		if (this.data[d] == c) {
			return d
		}
	}
	return -1
};
draw2d.ArrayList.prototype.contains = function(c) {
	for (var d = 0; d < this.getSize(); d++) {
		if (this.data[d] == c) {
			return true
		}
	}
	return false
};
draw2d.ArrayList.prototype.resize = function() {
	newData = new Array(this.data.length + this.increment);
	for (var b = 0; b < this.data.length; b++) {
		newData[b] = this.data[b]
	}
	this.data = newData
};
draw2d.ArrayList.prototype.trimToSize = function() {
	if (this.data.length == this.size) {
		return
	}
	var d = new Array(this.getSize());
	for (var c = 0; c < this.getSize(); c++) {
		d[c] = this.data[c]
	}
	this.size = d.length;
	this.data = d
};
draw2d.ArrayList.prototype.sort = function(j) {
	var k, l;
	var m;
	var n;
	var f;
	var i;
	for (k = 1; k < this.getSize(); k++) {
		n = this.data[k];
		m = n[j];
		l = k - 1;
		f = this.data[l];
		i = f[j];
		while (l >= 0 && i > m) {
			this.data[l + 1] = this.data[l];
			l--;
			if (l >= 0) {
				f = this.data[l];
				i = f[j]
			}
		}
		this.data[l + 1] = n
	}
};
draw2d.ArrayList.prototype.clone = function() {
	var c = new draw2d.ArrayList(this.size);
	for (var d = 0; d < this.size; d++) {
		c.add(this.data[d])
	}
	return c
};
draw2d.ArrayList.prototype.overwriteElementAt = function(c, d) {
	this.data[d] = c
};
draw2d.ArrayList.prototype.getPersistentAttributes = function() {
	return {
		data : this.data,
		increment : this.increment,
		size : this.getSize()
	}
};
function trace(c) {
	var d = openwindow("about:blank", 700, 400);
	d.document.writeln("<pre>" + c + "</pre>")
}
function openwindow(g, f, h) {
	var i = (screen.width - f) / 2;
	var j = (screen.height - h) / 2;
	property = "left="
			+ i
			+ ", top="
			+ j
			+ ", toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,alwaysRaised,width="
			+ f + ",height=" + h;
	return window.open(g, "_blank", property)
}
function dumpObject(f) {
	trace("----------------------------------------------------------------------------");
	trace("- Object dump");
	trace("----------------------------------------------------------------------------");
	for ( var e in f) {
		try {
			if (typeof f[e] != "function") {
				trace(e + " --&gt; " + f[e])
			}
		} catch (d) {
		}
	}
	for ( var e in f) {
		try {
			if (typeof f[e] == "function") {
				trace(e + " --&gt; " + f[e])
			}
		} catch (d) {
		}
	}
	trace("----------------------------------------------------------------------------")
}
draw2d.Drag = function() {
};
draw2d.Drag.current = null;
draw2d.Drag.currentTarget = null;
draw2d.Drag.currentHover = null;
draw2d.Drag.currentCompartment = null;
draw2d.Drag.dragging = false;
draw2d.Drag.isDragging = function() {
	return this.dragging
};
draw2d.Drag.setCurrent = function(b) {
	this.current = b;
	this.dragging = true
};
draw2d.Drag.getCurrent = function() {
	return this.current
};
draw2d.Drag.clearCurrent = function() {
	this.current = null;
	this.dragging = false;
	this.currentTarget = null
};
draw2d.Draggable = function(d, c) {
	this.id = draw2d.UUID.create();
	this.node = null;
	draw2d.EventTarget.call(this);
	this.construct(d, c);
	this.diffX = 0;
	this.diffY = 0;
	this.targets = new draw2d.ArrayList()
};
draw2d.Draggable.prototype = new draw2d.EventTarget();
draw2d.Draggable.prototype.construct = function(h) {
	if (h === null || h === undefined) {
		return
	}
	this.element = h;
	var j = this;
	var i = function() {
		var a = new draw2d.DragDropEvent();
		a.initDragDropEvent("dblclick", true);
		j.dispatchEvent(a);
		var b = arguments[0] || window.event;
		b.cancelBubble = true;
		b.returnValue = false
	};
	var f = function() {
		var c = arguments[0] || window.event;
		var e = new draw2d.DragDropEvent();
		if (j.node !== null) {
			var l = j.node.getWorkflow().getAbsoluteX();
			var a = j.node.getWorkflow().getAbsoluteY();
			var b = j.node.getWorkflow().getScrollLeft();
			var d = j.node.getWorkflow().getScrollTop();
			e.x = c.clientX - j.element.offsetLeft + b - l;
			e.y = c.clientY - j.element.offsetTop + d - a
		}
		if (c.button === 2) {
			e.initDragDropEvent("contextmenu", true);
			j.dispatchEvent(e)
		} else {
			e.initDragDropEvent("dragstart", true);
			if (j.dispatchEvent(e)) {
				j.diffX = c.clientX - j.element.offsetLeft;
				j.diffY = c.clientY - j.element.offsetTop;
				draw2d.Drag.setCurrent(j);
				if (j.isAttached == true) {
					j.detachEventHandlers()
				}
				j.attachEventHandlers()
			}
		}
		c.cancelBubble = true;
		c.returnValue = false
	};
	var g = function() {
		if (draw2d.Drag.getCurrent() === null) {
			var b = arguments[0] || window.event;
			if (draw2d.Drag.currentHover !== null
					&& j !== draw2d.Drag.currentHover) {
				var a = new draw2d.DragDropEvent();
				a.initDragDropEvent("mouseleave", false, j);
				draw2d.Drag.currentHover.dispatchEvent(a)
			}
			if (j !== null && j !== draw2d.Drag.currentHover) {
				var a = new draw2d.DragDropEvent();
				a.initDragDropEvent("mouseenter", false, j);
				j.dispatchEvent(a)
			}
			draw2d.Drag.currentHover = j
		} else {
		}
	};
	if (this.element.addEventListener) {
		this.element.addEventListener("mousemove", g, false);
		this.element.addEventListener("mousedown", f, false);
		this.element.addEventListener("dblclick", i, false)
	} else {
		if (this.element.attachEvent) {
			this.element.attachEvent("onmousemove", g);
			this.element.attachEvent("onmousedown", f);
			this.element.attachEvent("ondblclick", i)
		} else {
			throw "Drag not supported in this browser."
		}
	}
};
draw2d.Draggable.prototype.onDrop = function(d, c) {
};
draw2d.Draggable.prototype.attachEventHandlers = function() {
	var b = this;
	b.isAttached = true;
	this.tempMouseMove = function() {
		var r = arguments[0] || window.event;
		var s = new draw2d.Point(r.clientX - b.diffX, r.clientY - b.diffY);
		if (b.node !== null && b.node.getCanSnapToHelper()) {
			s = b.node.getWorkflow().snapToHelper(b.node, s)
		}
		b.element.style.left = s.x + "px";
		b.element.style.top = s.y + "px";
		if (b.node !== null) {
			var a = b.node.getWorkflow().getScrollLeft();
			var m = b.node.getWorkflow().getScrollTop();
			var n = b.node.getWorkflow().getAbsoluteX();
			var o = b.node.getWorkflow().getAbsoluteY();
			var p = b.getDropTarget(r.clientX + a - n, r.clientY + m - o);
			var q = b.getCompartment(r.clientX + a - n, r.clientY + m - o);
			if (draw2d.Drag.currentTarget !== null
					&& p != draw2d.Drag.currentTarget) {
				var t = new draw2d.DragDropEvent();
				t.initDragDropEvent("dragleave", false, b);
				draw2d.Drag.currentTarget.dispatchEvent(t)
			}
			if (p !== null && p !== draw2d.Drag.currentTarget) {
				var t = new draw2d.DragDropEvent();
				t.initDragDropEvent("dragenter", false, b);
				p.dispatchEvent(t)
			}
			draw2d.Drag.currentTarget = p;
			if (draw2d.Drag.currentCompartment !== null
					&& q !== draw2d.Drag.currentCompartment) {
				var t = new draw2d.DragDropEvent();
				t.initDragDropEvent("figureleave", false, b);
				draw2d.Drag.currentCompartment.dispatchEvent(t)
			}
			if (q !== null && q.node != b.node
					&& q !== draw2d.Drag.currentCompartment) {
				var t = new draw2d.DragDropEvent();
				t.initDragDropEvent("figureenter", false, b);
				q.dispatchEvent(t)
			}
			draw2d.Drag.currentCompartment = q
		}
		var l = new draw2d.DragDropEvent();
		l.initDragDropEvent("drag", false);
		b.dispatchEvent(l)
	};
	b.tempMouseUp = function() {
		b.detachEventHandlers();
		var a = arguments[0] || window.event;
		if (b.node !== null) {
			var k = b.node.getWorkflow().getScrollLeft();
			var l = b.node.getWorkflow().getScrollTop();
			var m = b.node.getWorkflow().getAbsoluteX();
			var n = b.node.getWorkflow().getAbsoluteY();
			var o = b.getDropTarget(a.clientX + k - m, a.clientY + l - n);
			var p = b.getCompartment(a.clientX + k - m, a.clientY + l - n);
			if (o !== null) {
				var q = new draw2d.DragDropEvent();
				q.initDragDropEvent("drop", false, b);
				o.dispatchEvent(q)
			}
			if (p !== null && p.node !== b.node) {
				var q = new draw2d.DragDropEvent();
				q.initDragDropEvent("figuredrop", false, b);
				p.dispatchEvent(q)
			}
			if (draw2d.Drag.currentTarget !== null) {
				var q = new draw2d.DragDropEvent();
				q.initDragDropEvent("dragleave", false, b);
				draw2d.Drag.currentTarget.dispatchEvent(q);
				draw2d.Drag.currentTarget = null
			}
		}
		var r = new draw2d.DragDropEvent();
		r.initDragDropEvent("dragend", false);
		b.dispatchEvent(r);
		b.onDrop(a.clientX, a.clientY);
		draw2d.Drag.currentCompartment = null;
		draw2d.Drag.clearCurrent()
	};
	if (document.body.addEventListener) {
		document.body.addEventListener("mousemove", this.tempMouseMove, false);
		document.body.addEventListener("mouseup", this.tempMouseUp, false)
	} else {
		if (document.body.attachEvent) {
			document.body.attachEvent("onmousemove", this.tempMouseMove);
			document.body.attachEvent("onmouseup", this.tempMouseUp)
		} else {
			throw new Error("Drag doesn't support this browser.")
		}
	}
};
draw2d.Draggable.prototype.detachEventHandlers = function() {
	this.isAttached = false;
	if (document.body.removeEventListener) {
		document.body.removeEventListener("mousemove", this.tempMouseMove,
				false);
		document.body.removeEventListener("mouseup", this.tempMouseUp, false)
	} else {
		if (document.body.detachEvent) {
			document.body.detachEvent("onmousemove", this.tempMouseMove);
			document.body.detachEvent("onmouseup", this.tempMouseUp)
		} else {
			throw new Error("Drag doesn't support this browser.")
		}
	}
};
draw2d.Draggable.prototype.getDropTarget = function(f, g) {
	for (var h = 0; h < this.targets.getSize(); h++) {
		var e = this.targets.get(h);
		if (e.node.isOver(f, g) && e.node !== this.node) {
			return e
		}
	}
	return null
};
draw2d.Draggable.prototype.getCompartment = function(g, h) {
	var i = null;
	for (var j = 0; j < this.node.getWorkflow().compartments.getSize(); j++) {
		var f = this.node.getWorkflow().compartments.get(j);
		if (f.isOver(g, h) && f !== this.node) {
			if (i === null) {
				i = f
			} else {
				if (i.getZOrder() < f.getZOrder()) {
					i = f
				}
			}
		}
	}
	return i === null ? null : i.dropable
};
draw2d.Draggable.prototype.getLeft = function() {
	return this.element.offsetLeft
};
draw2d.Draggable.prototype.getTop = function() {
	return this.element.offsetTop
};
draw2d.DragDropEvent = function() {
	draw2d.AbstractEvent.call(this)
};
draw2d.DragDropEvent.prototype = new draw2d.AbstractEvent();
draw2d.DragDropEvent.prototype.initDragDropEvent = function(f, d, e) {
	this.initEvent(f, d);
	this.relatedTarget = e
};
draw2d.DropTarget = function(b) {
	draw2d.EventTarget.call(this);
	this.construct(b)
};
draw2d.DropTarget.prototype = new draw2d.EventTarget();
draw2d.DropTarget.prototype.construct = function(b) {
	this.element = b
};
draw2d.DropTarget.prototype.getLeft = function() {
	var c = this.element;
	var d = c.offsetLeft;
	while ((c = c.offsetParent) !== null) {
		d += c.offsetLeft
	}
	return d
};
draw2d.DropTarget.prototype.getTop = function() {
	var d = this.element;
	var c = d.offsetTop;
	while ((d = d.offsetParent) !== null) {
		c += d.offsetTop
	}
	return c
};
draw2d.DropTarget.prototype.getHeight = function() {
	return this.element.offsetHeight
};
draw2d.DropTarget.prototype.getWidth = function() {
	return this.element.offsetWidth
};
draw2d.PositionConstants = function() {
};
draw2d.PositionConstants.NORTH = 1;
draw2d.PositionConstants.SOUTH = 4;
draw2d.PositionConstants.WEST = 8;
draw2d.PositionConstants.EAST = 16;
draw2d.Color = function(g, h, f) {
	if (typeof h == "undefined") {
		var e = this.hex2rgb(g);
		this.red = e[0];
		this.green = e[1];
		this.blue = e[2]
	} else {
		this.red = g;
		this.green = h;
		this.blue = f
	}
};
draw2d.Color.prototype.type = "draw2d.Color";
draw2d.Color.prototype.getHTMLStyle = function() {
	return "rgb(" + this.red + "," + this.green + "," + this.blue + ")"
};
draw2d.Color.prototype.getRed = function() {
	return this.red
};
draw2d.Color.prototype.getGreen = function() {
	return this.green
};
draw2d.Color.prototype.getBlue = function() {
	return this.blue
};
draw2d.Color.prototype.getIdealTextColor = function() {
	var c = 105;
	var d = (this.red * 0.299) + (this.green * 0.587) + (this.blue * 0.114);
	return (255 - d < c) ? new draw2d.Color(0, 0, 0) : new draw2d.Color(255,
			255, 255)
};
draw2d.Color.prototype.hex2rgb = function(b) {
	b = b.replace("#", "");
	return ({
		0 : parseInt(b.substr(0, 2), 16),
		1 : parseInt(b.substr(2, 2), 16),
		2 : parseInt(b.substr(4, 2), 16)
	})
};
draw2d.Color.prototype.hex = function() {
	return (this.int2hex(this.red) + this.int2hex(this.green) + this
			.int2hex(this.blue))
};
draw2d.Color.prototype.int2hex = function(b) {
	b = Math.round(Math.min(Math.max(0, b), 255));
	return ("0123456789ABCDEF".charAt((b - b % 16) / 16) + "0123456789ABCDEF"
			.charAt(b % 16))
};
draw2d.Color.prototype.darker = function(g) {
	var h = parseInt(Math.round(this.getRed() * (1 - g)));
	var e = parseInt(Math.round(this.getGreen() * (1 - g)));
	var f = parseInt(Math.round(this.getBlue() * (1 - g)));
	if (h < 0) {
		h = 0
	} else {
		if (h > 255) {
			h = 255
		}
	}
	if (e < 0) {
		e = 0
	} else {
		if (e > 255) {
			e = 255
		}
	}
	if (f < 0) {
		f = 0
	} else {
		if (f > 255) {
			f = 255
		}
	}
	return new draw2d.Color(h, e, f)
};
draw2d.Color.prototype.lighter = function(g) {
	var h = parseInt(Math.round(this.getRed() * (1 + g)));
	var e = parseInt(Math.round(this.getGreen() * (1 + g)));
	var f = parseInt(Math.round(this.getBlue() * (1 + g)));
	if (h < 0) {
		h = 0
	} else {
		if (h > 255) {
			h = 255
		}
	}
	if (e < 0) {
		e = 0
	} else {
		if (e > 255) {
			e = 255
		}
	}
	if (f < 0) {
		f = 0
	} else {
		if (f > 255) {
			f = 255
		}
	}
	return new draw2d.Color(h, e, f)
};
draw2d.Point = function(d, c) {
	this.x = d;
	this.y = c
};
draw2d.Point.prototype.type = "draw2d.Point";
draw2d.Point.prototype.getX = function() {
	return this.x
};
draw2d.Point.prototype.getY = function() {
	return this.y
};
draw2d.Point.prototype.getPosition = function(f) {
	var d = f.x - this.x;
	var e = f.y - this.y;
	if (Math.abs(d) > Math.abs(e)) {
		if (d < 0) {
			return draw2d.PositionConstants.WEST
		}
		return draw2d.PositionConstants.EAST
	}
	if (e < 0) {
		return draw2d.PositionConstants.NORTH
	}
	return draw2d.PositionConstants.SOUTH
};
draw2d.Point.prototype.equals = function(b) {
	return this.x == b.x && this.y == b.y
};
draw2d.Point.prototype.getDistance = function(b) {
	return Math.sqrt((this.x - b.x) * (this.x - b.x) + (this.y - b.y)
			* (this.y - b.y))
};
draw2d.Point.prototype.getTranslated = function(b) {
	return new draw2d.Point(this.x + b.x, this.y + b.y)
};
draw2d.Point.prototype.getPersistentAttributes = function() {
	return {
		x : this.x,
		y : this.y
	}
};
draw2d.Dimension = function(f, g, e, h) {
	draw2d.Point.call(this, f, g);
	this.w = e;
	this.h = h
};
draw2d.Dimension.prototype = new draw2d.Point();
draw2d.Dimension.prototype.type = "draw2d.Dimension";
draw2d.Dimension.prototype.translate = function(c, d) {
	this.x += c;
	this.y += d;
	return this
};
draw2d.Dimension.prototype.resize = function(d, c) {
	this.w += d;
	this.h += c;
	return this
};
draw2d.Dimension.prototype.setBounds = function(b) {
	this.x = b.x;
	this.y = b.y;
	this.w = b.w;
	this.h = b.h;
	return this
};
draw2d.Dimension.prototype.isEmpty = function() {
	return this.w <= 0 || this.h <= 0
};
draw2d.Dimension.prototype.getWidth = function() {
	return this.w
};
draw2d.Dimension.prototype.getHeight = function() {
	return this.h
};
draw2d.Dimension.prototype.getRight = function() {
	return this.x + this.w
};
draw2d.Dimension.prototype.getBottom = function() {
	return this.y + this.h
};
draw2d.Dimension.prototype.getTopLeft = function() {
	return new draw2d.Point(this.x, this.y)
};
draw2d.Dimension.prototype.getCenter = function() {
	return new draw2d.Point(this.x + this.w / 2, this.y + this.h / 2)
};
draw2d.Dimension.prototype.getBottomRight = function() {
	return new draw2d.Point(this.x + this.w, this.y + this.h)
};
draw2d.Dimension.prototype.equals = function(b) {
	return this.x == b.x && this.y == b.y && this.w == b.w && this.h == b.h
};
draw2d.SnapToHelper = function(b) {
	this.workflow = b
};
draw2d.SnapToHelper.NORTH = 1;
draw2d.SnapToHelper.SOUTH = 4;
draw2d.SnapToHelper.WEST = 8;
draw2d.SnapToHelper.EAST = 16;
draw2d.SnapToHelper.CENTER = 32;
draw2d.SnapToHelper.NORTH_EAST = draw2d.SnapToHelper.NORTH
		| draw2d.SnapToHelper.EAST;
draw2d.SnapToHelper.NORTH_WEST = draw2d.SnapToHelper.NORTH
		| draw2d.SnapToHelper.WEST;
draw2d.SnapToHelper.SOUTH_EAST = draw2d.SnapToHelper.SOUTH
		| draw2d.SnapToHelper.EAST;
draw2d.SnapToHelper.SOUTH_WEST = draw2d.SnapToHelper.SOUTH
		| draw2d.SnapToHelper.WEST;
draw2d.SnapToHelper.NORTH_SOUTH = draw2d.SnapToHelper.NORTH
		| draw2d.SnapToHelper.SOUTH;
draw2d.SnapToHelper.EAST_WEST = draw2d.SnapToHelper.EAST
		| draw2d.SnapToHelper.WEST;
draw2d.SnapToHelper.NSEW = draw2d.SnapToHelper.NORTH_SOUTH
		| draw2d.SnapToHelper.EAST_WEST;
draw2d.SnapToHelper.prototype.snapPoint = function(f, d, e) {
	return d
};
draw2d.SnapToHelper.prototype.snapRectangle = function(c, d) {
	return c
};
draw2d.SnapToHelper.prototype.onSetDocumentDirty = function() {
};
draw2d.SnapToGrid = function(b) {
	draw2d.SnapToHelper.call(this, b)
};
draw2d.SnapToGrid.prototype = new draw2d.SnapToHelper();
draw2d.SnapToGrid.prototype.type = "draw2d.SnapToGrid";
draw2d.SnapToGrid.prototype.snapPoint = function(f, d, e) {
	e.x = this.workflow.gridWidthX
			* Math
					.floor(((d.x + this.workflow.gridWidthX / 2) / this.workflow.gridWidthX));
	e.y = this.workflow.gridWidthY
			* Math
					.floor(((d.y + this.workflow.gridWidthY / 2) / this.workflow.gridWidthY));
	return 0
};
draw2d.SnapToGrid.prototype.snapRectangle = function(c, d) {
	d.x = c.x;
	d.y = c.y;
	d.w = c.w;
	d.h = c.h;
	return 0
};
draw2d.SnapToGeometryEntry = function(c, d) {
	this.type = c;
	this.location = d
};
draw2d.SnapToGeometryEntry.prototype.getLocation = function() {
	return this.location
};
draw2d.SnapToGeometryEntry.prototype.getType = function() {
	return this.type
};
draw2d.SnapToGeometry = function(b) {
	draw2d.SnapToHelper.call(this, b);
	this.rows = null;
	this.cols = null
};
draw2d.SnapToGeometry.prototype = new draw2d.SnapToHelper();
draw2d.SnapToGeometry.THRESHOLD = 5;
draw2d.SnapToGeometry.prototype.snapPoint = function(h, i, j) {
	if (this.rows === null || this.cols === null) {
		this.populateRowsAndCols()
	}
	if ((h & draw2d.SnapToHelper.EAST) !== 0) {
		var k = this.getCorrectionFor(this.cols, i.getX() - 1, 1);
		if (k !== draw2d.SnapToGeometry.THRESHOLD) {
			h &= ~draw2d.SnapToHelper.EAST;
			j.x += k
		}
	}
	if ((h & draw2d.SnapToHelper.WEST) !== 0) {
		var l = this.getCorrectionFor(this.cols, i.getX(), -1);
		if (l !== draw2d.SnapToGeometry.THRESHOLD) {
			h &= ~draw2d.SnapToHelper.WEST;
			j.x += l
		}
	}
	if ((h & draw2d.SnapToHelper.SOUTH) !== 0) {
		var m = this.getCorrectionFor(this.rows, i.getY() - 1, 1);
		if (m !== draw2d.SnapToGeometry.THRESHOLD) {
			h &= ~draw2d.SnapToHelper.SOUTH;
			j.y += m
		}
	}
	if ((h & draw2d.SnapToHelper.NORTH) !== 0) {
		var n = this.getCorrectionFor(this.rows, i.getY(), -1);
		if (n !== draw2d.SnapToGeometry.THRESHOLD) {
			h &= ~draw2d.SnapToHelper.NORTH;
			j.y += n
		}
	}
	return h
};
draw2d.SnapToGeometry.prototype.snapRectangle = function(j, l) {
	var g = j.getTopLeft();
	var h = j.getBottomRight();
	var i = this.snapPoint(draw2d.SnapToHelper.NORTH_WEST, j.getTopLeft(), g);
	l.x = g.x;
	l.y = g.y;
	var k = this.snapPoint(draw2d.SnapToHelper.SOUTH_EAST, j.getBottomRight(),
			h);
	if (i & draw2d.SnapToHelper.WEST) {
		l.x = h.x - j.getWidth()
	}
	if (i & draw2d.SnapToHelper.NORTH) {
		l.y = h.y - j.getHeight()
	}
	return i | k
};
draw2d.SnapToGeometry.prototype.populateRowsAndCols = function() {
	this.rows = [];
	this.cols = [];
	var h = this.workflow.getDocument().getFigures();
	var j = 0;
	for (var i = 0; i < h.getSize(); i++) {
		var g = h.get(i);
		if (g != this.workflow.getCurrentSelection()) {
			var f = g.getBounds();
			this.cols[j * 3] = new draw2d.SnapToGeometryEntry(-1, f.getX());
			this.rows[j * 3] = new draw2d.SnapToGeometryEntry(-1, f.getY());
			this.cols[j * 3 + 1] = new draw2d.SnapToGeometryEntry(0, f.x
					+ (f.getWidth() - 1) / 2);
			this.rows[j * 3 + 1] = new draw2d.SnapToGeometryEntry(0, f.y
					+ (f.getHeight() - 1) / 2);
			this.cols[j * 3 + 2] = new draw2d.SnapToGeometryEntry(1, f
					.getRight() - 1);
			this.rows[j * 3 + 2] = new draw2d.SnapToGeometryEntry(1, f
					.getBottom() - 1);
			j++
		}
	}
};
draw2d.SnapToGeometry.prototype.getCorrectionFor = function(j, m, p) {
	var k = draw2d.SnapToGeometry.THRESHOLD;
	var l = draw2d.SnapToGeometry.THRESHOLD;
	for (var i = 0; i < j.length; i++) {
		var n = j[i];
		var o;
		if (n.type === -1 && p !== 0) {
			o = Math.abs(m - n.location);
			if (o < k) {
				k = o;
				l = n.location - m
			}
		} else {
			if (n.type === 0 && p === 0) {
				o = Math.abs(m - n.location);
				if (o < k) {
					k = o;
					l = n.location - m
				}
			} else {
				if (n.type === 1 && p !== 0) {
					o = Math.abs(m - n.location);
					if (o < k) {
						k = o;
						l = n.location - m
					}
				}
			}
		}
	}
	return l
};
draw2d.SnapToGeometry.prototype.onSetDocumentDirty = function() {
	this.rows = null;
	this.cols = null
};
draw2d.Border = function() {
	this.color = null
};
draw2d.Border.prototype.type = "draw2d.Border";
draw2d.Border.prototype.dispose = function() {
	this.color = null
};
draw2d.Border.prototype.getHTMLStyle = function() {
	return ""
};
draw2d.Border.prototype.setColor = function(b) {
	this.color = b
};
draw2d.Border.prototype.getColor = function() {
	return this.color
};
draw2d.Border.prototype.refresh = function() {
};
draw2d.LineBorder = function(b) {
	draw2d.Border.call(this);
	this.width = 1;
	if (b) {
		this.width = b
	}
	this.figure = null
};
draw2d.LineBorder.prototype = new draw2d.Border();
draw2d.LineBorder.prototype.type = "draw2d.LineBorder";
draw2d.LineBorder.prototype.dispose = function() {
	draw2d.Border.prototype.dispose.call(this);
	this.figure = null
};
draw2d.LineBorder.prototype.setLineWidth = function(b) {
	this.width = b;
	if (this.figure !== null) {
		this.figure.html.style.border = this.getHTMLStyle()
	}
};
draw2d.LineBorder.prototype.getHTMLStyle = function() {
	if (this.getColor() !== null) {
		return this.width + "px solid " + this.getColor().getHTMLStyle()
	}
	return this.width + "px solid black"
};
draw2d.LineBorder.prototype.refresh = function() {
	this.setLineWidth(this.width)
};
draw2d.Figure = function() {
	this.construct()
};
draw2d.Figure.prototype.type = "draw2d.Figure";
draw2d.Figure.ZOrderBaseIndex = 100;
draw2d.Figure.setZOrderBaseIndex = function(b) {
	draw2d.Figure.ZOrderBaseIndex = b
};
draw2d.Figure.prototype.construct = function() {
	this.lastDragStartTime = 0;
	this.x = 0;
	this.y = 0;
	this.width = 10;
	this.height = 10;
	this.border = null;
	this.id = draw2d.UUID.create();
	this.html = this.createHTMLElement();
	this.canvas = null;
	this.workflow = null;
	this.draggable = null;
	this.parent = null;
	this.isMoving = false;
	this.canSnapToHelper = true;
	this.snapToGridAnchor = new draw2d.Point(0, 0);
	this.timer = -1;
	this.model = null;
	this.alpha = 1;
	this.alphaBeforeOnDrag = 1;
	this.properties = {};
	this.moveListener = new draw2d.ArrayList();
	this.setDimension(this.width, this.height);
	this.setDeleteable(true);
	this.setCanDrag(true);
	this.setResizeable(true);
	this.setSelectable(true)
};
draw2d.Figure.prototype.dispose = function() {
	this.canvas = null;
	this.workflow = null;
	this.moveListener = null;
	if (this.draggable !== null) {
		this.draggable.removeEventListener("mouseenter", this.tmpMouseEnter);
		this.draggable.removeEventListener("mouseleave", this.tmpMouseLeave);
		this.draggable.removeEventListener("dragend", this.tmpDragend);
		this.draggable.removeEventListener("dragstart", this.tmpDragstart);
		this.draggable.removeEventListener("drag", this.tmpDrag);
		this.draggable.removeEventListener("dblclick", this.tmpDoubleClick);
		this.draggable.node = null;
		this.draggable.target.removeAllElements()
	}
	this.draggable = null;
	if (this.border !== null) {
		this.border.dispose()
	}
	this.border = null;
	if (this.parent !== null) {
		this.parent.removeChild(this)
	}
};
draw2d.Figure.prototype.getProperties = function() {
	return this.properties
};
draw2d.Figure.prototype.getProperty = function(b) {
	return this.properties[b]
};
draw2d.Figure.prototype.setProperty = function(d, c) {
	this.properties[d] = c;
	this.setDocumentDirty()
};
draw2d.Figure.prototype.getId = function() {
	return this.id
};
draw2d.Figure.prototype.setId = function(b) {
	this.id = b;
	if (this.html !== null) {
		this.html.id = b
	}
};
draw2d.Figure.prototype.setCanvas = function(b) {
	this.canvas = b
};
draw2d.Figure.prototype.getWorkflow = function() {
	return this.workflow
};
draw2d.Figure.prototype.setWorkflow = function(c) {
	if (this.draggable === null) {
		this.html.tabIndex = "0";
		var d = this;
		this.keyDown = function(a) {
			a.cancelBubble = true;
			a.returnValue = true;
			d.onKeyDown(a.keyCode, a.ctrlKey)
		};
		if (this.html.addEventListener) {
			this.html.addEventListener("keydown", this.keyDown, false)
		} else {
			if (this.html.attachEvent) {
				this.html.attachEvent("onkeydown", this.keyDown)
			}
		}
		this.draggable = new draw2d.Draggable(this.html,
				draw2d.Draggable.DRAG_X | draw2d.Draggable.DRAG_Y);
		this.draggable.node = this;
		this.tmpContextMenu = function(a) {
			d.onContextMenu(d.x + a.x, a.y + d.y)
		};
		this.tmpMouseEnter = function(a) {
			d.onMouseEnter()
		};
		this.tmpMouseLeave = function(a) {
			d.onMouseLeave()
		};
		this.tmpDragend = function(a) {
			d.onDragend()
		};
		this.tmpDragstart = function(a) {
			var b = d.workflow;
			b.showMenu(null);
			if (b.toolPalette && b.toolPalette.activeTool) {
				a.returnValue = false;
				b.onMouseDown(d.x + a.x, a.y + d.y);
				b.onMouseUp(d.x + a.x, a.y + d.y);
				return
			}
			if (!(d instanceof draw2d.ResizeHandle)
					&& !(d instanceof draw2d.Port)) {
				var f = b.getBestLine(d.x + a.x, a.y + d.y);
				if (f !== null) {
					a.returnValue = false;
					b.setCurrentSelection(f);
					b.showLineResizeHandles(f);
					b.onMouseDown(d.x + a.x, a.y + d.y);
					return
				} else {
					if (d.isSelectable()) {
						b.showResizeHandles(d);
						b.setCurrentSelection(d)
					}
				}
			}
			a.returnValue = d.onDragstart(a.x, a.y)
		};
		this.tmpDrag = function(a) {
			d.onDrag()
		};
		this.tmpDoubleClick = function(a) {
			d.onDoubleClick()
		};
		this.draggable.addEventListener("contextmenu", this.tmpContextMenu);
		this.draggable.addEventListener("mouseenter", this.tmpMouseEnter);
		this.draggable.addEventListener("mouseleave", this.tmpMouseLeave);
		this.draggable.addEventListener("dragend", this.tmpDragend);
		this.draggable.addEventListener("dragstart", this.tmpDragstart);
		this.draggable.addEventListener("drag", this.tmpDrag);
		this.draggable.addEventListener("dblclick", this.tmpDoubleClick)
	}
	this.workflow = c
};
draw2d.Figure.prototype.createHTMLElement = function() {
	var b = document.createElement("div");
	b.id = this.id;
	b.style.position = "absolute";
	b.style.left = this.x + "px";
	b.style.top = this.y + "px";
	b.style.height = this.width + "px";
	b.style.width = this.height + "px";
	b.style.margin = "0px";
	b.style.padding = "0px";
	b.style.outline = "none";
	b.style.zIndex = "" + draw2d.Figure.ZOrderBaseIndex;
	return b
};
draw2d.Figure.prototype.setParent = function(b) {
	this.parent = b
};
draw2d.Figure.prototype.getParent = function() {
	return this.parent
};
draw2d.Figure.prototype.getZOrder = function() {
	return this.html.style.zIndex
};
draw2d.Figure.prototype.setZOrder = function(b) {
	this.html.style.zIndex = b
};
draw2d.Figure.prototype.hasFixedPosition = function() {
	return false
};
draw2d.Figure.prototype.getMinWidth = function() {
	return 5
};
draw2d.Figure.prototype.getMinHeight = function() {
	return 5
};
draw2d.Figure.prototype.getHTMLElement = function() {
	if (this.html === null) {
		this.html = this.createHTMLElement()
	}
	return this.html
};
draw2d.Figure.prototype.paint = function() {
};
draw2d.Figure.prototype.setBorder = function(b) {
	if (this.border !== null) {
		this.border.figure = null
	}
	this.border = b;
	this.border.figure = this;
	this.border.refresh();
	this.setDocumentDirty()
};
draw2d.Figure.prototype.onRemove = function(b) {
};
draw2d.Figure.prototype.onContextMenu = function(e, f) {
	var d = this.getContextMenu();
	if (d !== null) {
		this.workflow.showMenu(d, e, f)
	}
};
draw2d.Figure.prototype.getContextMenu = function() {
	return null
};
draw2d.Figure.prototype.onDoubleClick = function() {
	this.figureDoubleClick()
};
draw2d.Figure.prototype.figureDoubleClick = function() {
	return null
};
draw2d.Figure.prototype.onMouseEnter = function() {
};
draw2d.Figure.prototype.onMouseLeave = function() {
};
draw2d.Figure.prototype.onDrag = function() {
	this.x = this.draggable.getLeft();
	this.y = this.draggable.getTop();
	if (this.isMoving == false) {
		this.isMoving = true;
		this.alphaBeforeOnDrag = this.getAlpha();
		this.setAlpha(this.alphaBeforeOnDrag * 0.5)
	}
	this.fireMoveEvent()
};
draw2d.Figure.prototype.onDragend = function() {
	if (this.getWorkflow().getEnableSmoothFigureHandling() === true) {
		var d = this;
		var c = function() {
			if (d.alpha < d.alphaBeforeOnDrag) {
				d.setAlpha(Math.min(1, d.alpha + 0.05))
			} else {
				window.clearInterval(d.timer);
				d.timer = -1
			}
		};
		if (d.timer > 0) {
			window.clearInterval(d.timer)
		}
		d.timer = window.setInterval(c, 20)
	} else {
		this.setAlpha(this.alphaBeforeOnDrag)
	}
	this.command.setPosition(this.x, this.y);
	this.workflow.commandStack.execute(this.command);
	this.command = null;
	this.isMoving = false;
	this.workflow.hideSnapToHelperLines();
	this.fireMoveEvent()
};
draw2d.Figure.prototype.onDragstart = function(d, c) {
	this.command = this.createCommand(new draw2d.EditPolicy(
			draw2d.EditPolicy.MOVE));
	return this.command !== null
};
draw2d.Figure.prototype.setCanDrag = function(b) {
	this.canDrag = b;
	if (b) {
		this.html.style.cursor = "move"
	} else {
		this.html.style.cursor = ""
	}
};
draw2d.Figure.prototype.getCanDrag = function() {
	return this.canDrag
};
draw2d.Figure.prototype.setAlpha = function(b) {
	if (this.alpha === b) {
		return
	}
	this.alpha = Math.max(0, Math.min(1, b));
	if (this.alpha == 1) {
		this.html.style.filter = "";
		this.html.style.opacity = ""
	} else {
		this.html.style.filter = "alpha(opacity="
				+ Math.round(this.alpha * 100) + ")";
		this.html.style.opacity = this.alpha
	}
};
draw2d.Figure.prototype.getAlpha = function() {
	return this.alpha
};
draw2d.Figure.prototype.setDimension = function(d, c) {
	this.width = Math.max(this.getMinWidth(), d);
	this.height = Math.max(this.getMinHeight(), c);
	if (this.html === null) {
		return
	}
	this.html.style.width = this.width + "px";
	this.html.style.height = this.height + "px";
	this.fireMoveEvent();
	if (this.workflow !== null && this.workflow.getCurrentSelection() == this) {
		this.workflow.showResizeHandles(this)
	}
};
draw2d.Figure.prototype.setPosition = function(c, d) {
	this.x = c;
	this.y = d;
	if (this.html === null) {
		return
	}
	this.html.style.left = this.x + "px";
	this.html.style.top = this.y + "px";
	this.fireMoveEvent();
	if (this.workflow !== null && this.workflow.getCurrentSelection() == this) {
		this.workflow.showResizeHandles(this)
	}
};
draw2d.Figure.prototype.isResizeable = function() {
	return this.resizeable
};
draw2d.Figure.prototype.setResizeable = function(b) {
	this.resizeable = b
};
draw2d.Figure.prototype.isSelectable = function() {
	return this.selectable
};
draw2d.Figure.prototype.setSelectable = function(b) {
	this.selectable = b
};
draw2d.Figure.prototype.isStrechable = function() {
	return true
};
draw2d.Figure.prototype.isDeleteable = function() {
	return this.deleteable
};
draw2d.Figure.prototype.setDeleteable = function(b) {
	this.deleteable = b
};
draw2d.Figure.prototype.setCanSnapToHelper = function(b) {
	this.canSnapToHelper = b
};
draw2d.Figure.prototype.getCanSnapToHelper = function() {
	return this.canSnapToHelper
};
draw2d.Figure.prototype.getSnapToGridAnchor = function() {
	return this.snapToGridAnchor
};
draw2d.Figure.prototype.setSnapToGridAnchor = function(b) {
	this.snapToGridAnchor = b
};
draw2d.Figure.prototype.getBounds = function() {
	return new draw2d.Dimension(this.getX(), this.getY(), this.getWidth(), this
			.getHeight())
};
draw2d.Figure.prototype.getWidth = function() {
	return this.width
};
draw2d.Figure.prototype.getHeight = function() {
	return this.height
};
draw2d.Figure.prototype.getY = function() {
	return this.y
};
draw2d.Figure.prototype.getX = function() {
	return this.x
};
draw2d.Figure.prototype.getAbsoluteY = function() {
	return this.y
};
draw2d.Figure.prototype.getAbsoluteX = function() {
	return this.x
};
draw2d.Figure.prototype.onKeyDown = function(d, c) {
	if (d == 46) {
		this.workflow.getCommandStack().execute(
				this.createCommand(new draw2d.EditPolicy(
						draw2d.EditPolicy.DELETE)))
	}
	if (c) {
		this.workflow.onKeyDown(d, c)
	}
};
draw2d.Figure.prototype.getPosition = function() {
	return new draw2d.Point(this.x, this.y)
};
draw2d.Figure.prototype.isOver = function(g, i) {
	var h = this.getAbsoluteX();
	var j = this.getAbsoluteY();
	var l = h + this.width;
	var k = j + this.height;
	return (g >= h && g <= l && i >= j && i <= k)
};
draw2d.Figure.prototype.attachMoveListener = function(b) {
	if (b === null || this.moveListener === null) {
		return
	}
	this.moveListener.add(b)
};
draw2d.Figure.prototype.detachMoveListener = function(b) {
	if (b === null || this.moveListener === null) {
		return
	}
	this.moveListener.remove(b)
};
draw2d.Figure.prototype.fireMoveEvent = function() {
	this.setDocumentDirty();
	var c = this.moveListener.getSize();
	for (var d = 0; d < c; d++) {
		this.moveListener.get(d).onOtherFigureMoved(this)
	}
};
draw2d.Figure.prototype.setModel = function(b) {
	if (this.model !== null) {
		this.model.removePropertyChangeListener(this)
	}
	this.model = b;
	if (this.model !== null) {
		this.model.addPropertyChangeListener(this)
	}
};
draw2d.Figure.prototype.getModel = function() {
	return this.model
};
draw2d.Figure.prototype.onOtherFigureMoved = function(b) {
};
draw2d.Figure.prototype.setDocumentDirty = function() {
	if (this.workflow !== null) {
		this.workflow.setDocumentDirty()
	}
};
draw2d.Figure.prototype.disableTextSelection = function(b) {
	b.onselectstart = function() {
		return false
	};
	b.unselectable = "on";
	b.style.MozUserSelect = "none";
	b.onmousedown = function() {
		return false
	}
};
draw2d.Figure.prototype.createCommand = function(b) {
	if (b.getPolicy() == draw2d.EditPolicy.MOVE) {
		if (!this.canDrag) {
			return null
		}
		return new draw2d.CommandMove(this)
	}
	if (b.getPolicy() == draw2d.EditPolicy.DELETE) {
		if (!this.isDeleteable()) {
			return null
		}
		return new draw2d.CommandDelete(this)
	}
	if (b.getPolicy() == draw2d.EditPolicy.RESIZE) {
		if (!this.isResizeable()) {
			return null
		}
		return new draw2d.CommandResize(this)
	}
	return null
};
draw2d.Node = function() {
	this.bgColor = null;
	this.lineColor = new draw2d.Color(128, 128, 255);
	this.lineStroke = 1;
	this.ports = new draw2d.ArrayList();
	draw2d.Figure.call(this)
};
draw2d.Node.prototype = new draw2d.Figure();
draw2d.Node.prototype.type = "draw2d.Node";
draw2d.Node.prototype.dispose = function() {
	for (var b = 0; b < this.ports.getSize(); b++) {
		this.ports.get(b).dispose()
	}
	this.ports = null;
	draw2d.Figure.prototype.dispose.call(this)
};
draw2d.Node.prototype.createHTMLElement = function() {
	var b = draw2d.Figure.prototype.createHTMLElement.call(this);
	b.style.width = "auto";
	b.style.height = "auto";
	b.style.margin = "0px";
	b.style.padding = "0px";
	if (this.lineColor !== null) {
		b.style.border = this.lineStroke + "px solid "
				+ this.lineColor.getHTMLStyle()
	}
	b.style.fontSize = "1px";
	if (this.bgColor !== null) {
		b.style.backgroundColor = this.bgColor.getHTMLStyle()
	}
	return b
};
draw2d.Node.prototype.paint = function() {
	draw2d.Figure.prototype.paint.call(this);
	for (var b = 0; b < this.ports.getSize(); b++) {
		this.ports.get(b).paint()
	}
};
draw2d.Node.prototype.getPorts = function() {
	return this.ports
};
draw2d.Node.prototype.getInputPorts = function() {
	var f = new draw2d.ArrayList();
	for (var d = 0; d < this.ports.getSize(); d++) {
		var e = this.ports.get(d);
		if (e instanceof draw2d.InputPort) {
			f.add(e)
		}
	}
	return f
};
draw2d.Node.prototype.getOutputPorts = function() {
	var f = new draw2d.ArrayList();
	for (var d = 0; d < this.ports.getSize(); d++) {
		var e = this.ports.get(d);
		if (e instanceof draw2d.OutputPort) {
			f.add(e)
		}
	}
	return f
};
draw2d.Node.prototype.getPort = function(d) {
	if (this.ports === null) {
		return null
	}
	for (var f = 0; f < this.ports.getSize(); f++) {
		var e = this.ports.get(f);
		if (e.getName() == d) {
			return e
		}
	}
};
draw2d.Node.prototype.getInputPort = function(d) {
	if (this.ports === null) {
		return null
	}
	for (var f = 0; f < this.ports.getSize(); f++) {
		var e = this.ports.get(f);
		if (e.getName() == d && e instanceof draw2d.InputPort) {
			return e
		}
	}
};
draw2d.Node.prototype.getOutputPort = function(f) {
	if (this.ports === null) {
		return null
	}
	for (var d = 0; d < this.ports.getSize(); d++) {
		var e = this.ports.get(d);
		if (e.getName() == f && e instanceof draw2d.OutputPort) {
			return e
		}
	}
};
draw2d.Node.prototype.addPort = function(d, e, f) {
	this.ports.add(d);
	d.setOrigin(e, f);
	d.setPosition(e, f);
	d.setParent(this);
	d.setDeleteable(false);
	this.html.appendChild(d.getHTMLElement());
	if (this.workflow !== null) {
		this.workflow.registerPort(d)
	}
};
draw2d.Node.prototype.removePort = function(e) {
	if (this.ports !== null) {
		this.ports.remove(e)
	}
	try {
		this.html.removeChild(e.getHTMLElement())
	} catch (f) {
	}
	if (this.workflow !== null) {
		this.workflow.unregisterPort(e)
	}
	var g = e.getConnections();
	for (var h = 0; h < g.getSize(); ++h) {
		this.workflow.removeFigure(g.get(h))
	}
};
draw2d.Node.prototype.setWorkflow = function(f) {
	var d = this.workflow;
	draw2d.Figure.prototype.setWorkflow.call(this, f);
	if (d !== null) {
		for (var e = 0; e < this.ports.getSize(); e++) {
			d.unregisterPort(this.ports.get(e))
		}
	}
	if (this.workflow !== null) {
		for (var e = 0; e < this.ports.getSize(); e++) {
			this.workflow.registerPort(this.ports.get(e))
		}
	}
};
draw2d.Node.prototype.setBackgroundColor = function(b) {
	this.bgColor = b;
	if (this.bgColor !== null) {
		this.html.style.backgroundColor = this.bgColor.getHTMLStyle()
	} else {
		this.html.style.backgroundColor = "transparent"
	}
};
draw2d.Node.prototype.getBackgroundColor = function() {
	return this.bgColor
};
draw2d.Node.prototype.setColor = function(b) {
	this.lineColor = b;
	if (this.lineColor !== null) {
		this.html.style.border = this.lineStroke + "px solid "
				+ this.lineColor.getHTMLStyle()
	} else {
		this.html.style.border = "0px"
	}
};
draw2d.Node.prototype.setLineWidth = function(b) {
	this.lineStroke = b;
	if (this.lineColor !== null) {
		this.html.style.border = this.lineStroke + "px solid "
				+ this.lineColor.getHTMLStyle()
	} else {
		this.html.style.border = "0px"
	}
};
draw2d.Node.prototype.getModelSourceConnections = function() {
	throw "You must override the method [Node.prototype.getModelSourceConnections]"
};
draw2d.Node.prototype.refreshConnections = function() {
	if (this.workflow !== null) {
		this.workflow.refreshConnections(this)
	}
};
draw2d.VectorFigure = function() {
	this.bgColor = null;
	this.lineColor = new draw2d.Color(0, 0, 0);
	this.stroke = 1;
	this.graphics = null;
	draw2d.Node.call(this)
};
draw2d.VectorFigure.prototype = new draw2d.Node;
draw2d.VectorFigure.prototype.type = "draw2d.VectorFigure";
draw2d.VectorFigure.prototype.dispose = function() {
	draw2d.Node.prototype.dispose.call(this);
	this.bgColor = null;
	this.lineColor = null;
	if (this.graphics !== null) {
		this.graphics.clear()
	}
	this.graphics = null
};
draw2d.VectorFigure.prototype.createHTMLElement = function() {
	var b = draw2d.Node.prototype.createHTMLElement.call(this);
	b.style.border = "0px";
	b.style.backgroundColor = "transparent";
	return b
};
draw2d.VectorFigure.prototype.setWorkflow = function(b) {
	draw2d.Node.prototype.setWorkflow.call(this, b);
	if (this.workflow === null) {
		this.graphics.clear();
		this.graphics = null
	}
};
draw2d.VectorFigure.prototype.paint = function() {
	if (this.html === null) {
		return
	}
	try {
		if (this.graphics === null) {
			this.graphics = new jsGraphics(this.html)
		} else {
			this.graphics.clear()
		}
		draw2d.Node.prototype.paint.call(this);
		for (var d = 0; d < this.ports.getSize(); d++) {
			this.getHTMLElement().appendChild(
					this.ports.get(d).getHTMLElement())
		}
	} catch (c) {
		pushErrorStack(c, "draw2d.VectorFigure.prototype.paint=function()["
				+ area + "]")
	}
};
draw2d.VectorFigure.prototype.setDimension = function(d, c) {
	draw2d.Node.prototype.setDimension.call(this, d, c);
	if (this.graphics !== null) {
		this.paint()
	}
};
draw2d.VectorFigure.prototype.setBackgroundColor = function(b) {
	this.bgColor = b;
	if (this.graphics !== null) {
		this.paint()
	}
};
draw2d.VectorFigure.prototype.getBackgroundColor = function() {
	return this.bgColor
};
draw2d.VectorFigure.prototype.setLineWidth = function(b) {
	this.stroke = b;
	if (this.graphics !== null) {
		this.paint()
	}
};
draw2d.VectorFigure.prototype.setColor = function(b) {
	this.lineColor = b;
	if (this.graphics !== null) {
		this.paint()
	}
};
draw2d.VectorFigure.prototype.getColor = function() {
	return this.lineColor
};
draw2d.SVGFigure = function(c, d) {
	this.bgColor = null;
	this.lineColor = new draw2d.Color(0, 0, 0);
	this.stroke = 1;
	this.context = null;
	draw2d.Node.call(this);
	if (c && d) {
		this.setDimension(c, d)
	}
};
draw2d.SVGFigure.prototype = new draw2d.Node();
draw2d.SVGFigure.prototype.type = "draw2d.SVGFigure";
draw2d.SVGFigure.prototype.createHTMLElement = function() {
	var b = new MooCanvas(this.id, {
		width : 100,
		height : 100
	});
	b.style.position = "absolute";
	b.style.left = this.x + "px";
	b.style.top = this.y + "px";
	b.style.zIndex = "" + draw2d.Figure.ZOrderBaseIndex;
	this.context = b.getContext("2d");
	return b
};
draw2d.SVGFigure.prototype.paint = function() {
	this.context.clearRect(0, 0, this.getWidth(), this.getHeight());
	this.context.fillStyle = "rgba(200,0,0,0.3)";
	this.context.fillRect(0, 0, this.getWidth(), this.getHeight())
};
draw2d.SVGFigure.prototype.setDimension = function(d, c) {
	draw2d.Node.prototype.setDimension.call(this, d, c);
	this.html.width = d;
	this.html.height = c;
	this.html.style.width = d + "px";
	this.html.style.height = c + "px";
	if (this.context !== null) {
		if (this.context.element) {
			this.context.element.style.width = d + "px";
			this.context.element.style.height = c + "px"
		}
		this.paint()
	}
};
draw2d.SVGFigure.prototype.setBackgroundColor = function(b) {
	this.bgColor = b;
	if (this.graphics !== null) {
		this.paint()
	}
};
draw2d.SVGFigure.prototype.getBackgroundColor = function() {
	return this.bgColor
};
draw2d.SVGFigure.prototype.setLineWidth = function(b) {
	this.stroke = b;
	if (this.context !== null) {
		this.paint()
	}
};
draw2d.SVGFigure.prototype.setColor = function(b) {
	this.lineColor = b;
	if (this.context !== null) {
		this.paint()
	}
};
draw2d.SVGFigure.prototype.getColor = function() {
	return this.lineColor
};
draw2d.Label = function(b) {
	this.msg = b;
	this.bgColor = null;
	this.color = new draw2d.Color(0, 0, 0);
	this.fontSize = 10;
	this.textNode = null;
	this.align = "center";
	draw2d.Figure.call(this)
};
draw2d.Label.prototype = new draw2d.Figure();
draw2d.Label.prototype.type = "draw2d.Label";
draw2d.Label.prototype.createHTMLElement = function() {
	var b = draw2d.Figure.prototype.createHTMLElement.call(this);
	this.textNode = document.createTextNode(this.msg);
	b.appendChild(this.textNode);
	b.style.color = this.color.getHTMLStyle();
	b.style.fontSize = this.fontSize + "pt";
	b.style.width = "auto";
	b.style.height = "auto";
	b.style.paddingLeft = "3px";
	b.style.paddingRight = "3px";
	b.style.textAlign = this.align;
	b.style.MozUserSelect = "none";
	this.disableTextSelection(b);
	if (this.bgColor !== null) {
		b.style.backgroundColor = this.bgColor.getHTMLStyle()
	}
	return b
};
draw2d.Label.prototype.isResizeable = function() {
	return false
};
draw2d.Label.prototype.setWordwrap = function(b) {
	this.html.style.whiteSpace = b ? "wrap" : "nowrap"
};
draw2d.Label.prototype.setAlign = function(b) {
	this.align = b;
	this.html.style.textAlign = b
};
draw2d.Label.prototype.setBackgroundColor = function(b) {
	this.bgColor = b;
	if (this.bgColor !== null) {
		this.html.style.backgroundColor = this.bgColor.getHTMLStyle()
	} else {
		this.html.style.backgroundColor = "transparent"
	}
};
draw2d.Label.prototype.setColor = function(b) {
	this.color = b;
	this.html.style.color = this.color.getHTMLStyle()
};
draw2d.Label.prototype.setFontSize = function(b) {
	this.fontSize = b;
	this.html.style.fontSize = this.fontSize + "pt"
};
draw2d.Label.prototype.setDimension = function(d, c) {
};
draw2d.Label.prototype.getWidth = function() {
	if (window.getComputedStyle) {
		return parseInt(getComputedStyle(this.html, "").getPropertyValue(
				"width"))
	}
	return parseInt(this.html.clientWidth)
};
draw2d.Label.prototype.getHeight = function() {
	if (window.getComputedStyle) {
		return parseInt(getComputedStyle(this.html, "").getPropertyValue(
				"height"))
	}
	return parseInt(this.html.clientHeight)
};
draw2d.Label.prototype.getText = function() {
	return this.msg
};
draw2d.Label.prototype.setText = function(b) {
	this.msg = b;
	this.html.removeChild(this.textNode);
	this.textNode = document.createTextNode(this.msg);
	this.html.appendChild(this.textNode)
};
draw2d.Label.prototype.setStyledText = function(b) {
	this.msg = b;
	this.html.removeChild(this.textNode);
	this.textNode = document.createElement("div");
	this.textNode.style.whiteSpace = "nowrap";
	this.textNode.innerHTML = b;
	this.html.appendChild(this.textNode)
};
draw2d.Oval = function() {
	draw2d.VectorFigure.call(this)
};
draw2d.Oval.prototype = new draw2d.VectorFigure();
draw2d.Oval.prototype.type = "draw2d.Oval";
draw2d.Oval.prototype.paint = function() {
	if (this.html === null) {
		return
	}
	try {
		draw2d.VectorFigure.prototype.paint.call(this);
		this.graphics.setStroke(this.stroke);
		if (this.bgColor !== null) {
			this.graphics.setColor(this.bgColor.getHTMLStyle());
			this.graphics.fillOval(0, 0, this.getWidth() - 1,
					this.getHeight() - 1)
		}
		if (this.lineColor !== null) {
			this.graphics.setColor(this.lineColor.getHTMLStyle());
			this.graphics.drawOval(0, 0, this.getWidth() - 1,
					this.getHeight() - 1)
		}
		this.graphics.paint()
	} catch (b) {
		pushErrorStack(b, "draw2d.Oval.prototype.paint=function()")
	}
};
draw2d.Circle = function(b) {
	draw2d.Oval.call(this);
	if (b) {
		this.setDimension(b, b)
	}
};
draw2d.Circle.prototype = new draw2d.Oval();
draw2d.Circle.prototype.type = "draw2d.Circle";
draw2d.Circle.prototype.setDimension = function(d, c) {
	if (d > c) {
		draw2d.Oval.prototype.setDimension.call(this, d, d)
	} else {
		draw2d.Oval.prototype.setDimension.call(this, c, c)
	}
};
draw2d.Circle.prototype.isStrechable = function() {
	return false
};
draw2d.Rectangle = function(d, c) {
	this.bgColor = null;
	this.lineColor = new draw2d.Color(0, 0, 0);
	this.lineStroke = 1;
	draw2d.Figure.call(this);
	if (d && c) {
		this.setDimension(d, c)
	}
};
draw2d.Rectangle.prototype = new draw2d.Figure();
draw2d.Rectangle.prototype.type = "draw2d.Rectangle";
draw2d.Rectangle.prototype.dispose = function() {
	draw2d.Figure.prototype.dispose.call(this);
	this.bgColor = null;
	this.lineColor = null
};
draw2d.Rectangle.prototype.createHTMLElement = function() {
	var b = draw2d.Figure.prototype.createHTMLElement.call(this);
	b.style.width = "auto";
	b.style.height = "auto";
	b.style.margin = "0px";
	b.style.padding = "0px";
	b.style.border = this.lineStroke + "px solid "
			+ this.lineColor.getHTMLStyle();
	b.style.fontSize = "1px";
	b.style.lineHeight = "1px";
	b.innerHTML = "&nbsp";
	if (this.bgColor !== null) {
		b.style.backgroundColor = this.bgColor.getHTMLStyle()
	}
	return b
};
draw2d.Rectangle.prototype.setBackgroundColor = function(b) {
	this.bgColor = b;
	if (this.bgColor !== null) {
		this.html.style.backgroundColor = this.bgColor.getHTMLStyle()
	} else {
		this.html.style.backgroundColor = "transparent"
	}
};
draw2d.Rectangle.prototype.getBackgroundColor = function() {
	return this.bgColor
};
draw2d.Rectangle.prototype.setColor = function(b) {
	this.lineColor = b;
	if (this.lineColor !== null) {
		this.html.style.border = this.lineStroke + "px solid "
				+ this.lineColor.getHTMLStyle()
	} else {
		this.html.style.border = this.lineStroke + "0px"
	}
};
draw2d.Rectangle.prototype.getColor = function() {
	return this.lineColor
};
draw2d.Rectangle.prototype.getWidth = function() {
	return draw2d.Figure.prototype.getWidth.call(this) + 2 * this.lineStroke
};
draw2d.Rectangle.prototype.getHeight = function() {
	return draw2d.Figure.prototype.getHeight.call(this) + 2 * this.lineStroke
};
draw2d.Rectangle.prototype.setDimension = function(d, c) {
	draw2d.Figure.prototype.setDimension.call(this, d - 2 * this.lineStroke, c
			- 2 * this.lineStroke)
};
draw2d.Rectangle.prototype.setLineWidth = function(e) {
	var c = e - this.lineStroke;
	this.setDimension(this.getWidth() - 2 * c, this.getHeight() - 2 * c);
	this.lineStroke = e;
	var f = "transparent";
	if (this.lineColor !== null) {
		f = this.lineColor.getHTMLStyle()
	}
	this.html.style.border = this.lineStroke + "px solid " + f
};
draw2d.Rectangle.prototype.getLineWidth = function() {
	return this.lineStroke
};
draw2d.ImageFigure = function(b) {
	if (b === undefined) {
		b = null
	}
	this.url = b;
	draw2d.Node.call(this);
	this.setDimension(40, 40)
};
draw2d.ImageFigure.prototype = new draw2d.Node;
draw2d.ImageFigure.prototype.type = "draw2d.Image";
draw2d.ImageFigure.prototype.createHTMLElement = function() {
	var b = draw2d.Node.prototype.createHTMLElement.call(this);
	b.style.width = this.width + "px";
	b.style.height = this.height + "px";
	b.style.margin = "0px";
	b.style.padding = "0px";
	b.style.border = "0px";
	if (this.url !== null) {
		b.style.backgroundImage = "url(" + this.url + ")"
	} else {
		b.style.backgroundImage = ""
	}
	return b
};
draw2d.ImageFigure.prototype.setColor = function(b) {
};
draw2d.ImageFigure.prototype.isResizeable = function() {
	return false
};
draw2d.ImageFigure.prototype.setImage = function(b) {
	if (b === undefined) {
		b = null
	}
	this.url = b;
	if (this.url !== null) {
		this.html.style.backgroundImage = "url(" + this.url + ")"
	} else {
		this.html.style.backgroundImage = ""
	}
};
draw2d.Port = function(c, d) {
	Corona = function() {
	};
	Corona.prototype = new draw2d.Circle();
	Corona.prototype.setAlpha = function(a) {
		draw2d.Circle.prototype.setAlpha.call(this, Math.min(0.3, a));
		this.setDeleteable(false);
		this.setCanDrag(false);
		this.setResizeable(false);
		this.setSelectable(false)
	};
	if (c === null || c === undefined) {
		this.currentUIRepresentation = new draw2d.Circle()
	} else {
		this.currentUIRepresentation = c
	}
	if (d === null || d === undefined) {
		this.connectedUIRepresentation = new draw2d.Circle();
		this.connectedUIRepresentation.setColor(null)
	} else {
		this.connectedUIRepresentation = d
	}
	this.disconnectedUIRepresentation = this.currentUIRepresentation;
	this.hideIfConnected = false;
	this.uiRepresentationAdded = true;
	this.parentNode = null;
	this.originX = 0;
	this.originY = 0;
	this.coronaWidth = 10;
	this.corona = null;
	draw2d.Rectangle.call(this);
	this.setDimension(8, 8);
	this.setBackgroundColor(new draw2d.Color(100, 180, 100));
	this.setColor(new draw2d.Color(90, 150, 90));
	draw2d.Rectangle.prototype.setColor.call(this, null);
	this.dropable = new draw2d.DropTarget(this.html);
	this.dropable.node = this;
	this.dropable.addEventListener("dragenter", function(a) {
		a.target.node.onDragEnter(a.relatedTarget.node)
	});
	this.dropable.addEventListener("dragleave", function(a) {
		a.target.node.onDragLeave(a.relatedTarget.node)
	});
	this.dropable.addEventListener("drop", function(a) {
		a.relatedTarget.node.onDrop(a.target.node)
	})
};
draw2d.Port.prototype = new draw2d.Rectangle();
draw2d.Port.prototype.type = "draw2d.Port";
draw2d.Port.ZOrderBaseIndex = 5000;
draw2d.Port.setZOrderBaseIndex = function(b) {
	draw2d.Port.ZOrderBaseIndex = b
};
draw2d.Port.prototype.setHideIfConnected = function(b) {
	this.hideIfConnected = b
};
draw2d.Port.prototype.dispose = function() {
	var d = this.moveListener.getSize();
	for (var e = 0; e < d; e++) {
		var f = this.moveListener.get(e);
		this.parentNode.workflow.removeFigure(f);
		f.dispose()
	}
	draw2d.Rectangle.prototype.dispose.call(this);
	this.parentNode = null;
	this.dropable.node = null;
	this.dropable = null;
	this.disconnectedUIRepresentation.dispose();
	this.connectedUIRepresentation.dispose()
};
draw2d.Port.prototype.createHTMLElement = function() {
	var b = draw2d.Rectangle.prototype.createHTMLElement.call(this);
	b.style.zIndex = draw2d.Port.ZOrderBaseIndex;
	this.currentUIRepresentation.html.zIndex = draw2d.Port.ZOrderBaseIndex;
	b.appendChild(this.currentUIRepresentation.html);
	this.uiRepresentationAdded = true;
	return b
};
draw2d.Port.prototype.setUiRepresentation = function(b) {
	if (b === null) {
		b = new draw2d.Figure()
	}
	if (this.uiRepresentationAdded) {
		this.html.removeChild(this.currentUIRepresentation.getHTMLElement())
	}
	this.html.appendChild(b.getHTMLElement());
	b.paint();
	this.currentUIRepresentation = b
};
draw2d.Port.prototype.onMouseEnter = function() {
	this.setLineWidth(2)
};
draw2d.Port.prototype.onMouseLeave = function() {
	this.setLineWidth(0)
};
draw2d.Port.prototype.setDimension = function(c, d) {
	draw2d.Rectangle.prototype.setDimension.call(this, c, d);
	this.connectedUIRepresentation.setDimension(c, d);
	this.disconnectedUIRepresentation.setDimension(c, d);
	this.setPosition(this.x, this.y)
};
draw2d.Port.prototype.setBackgroundColor = function(b) {
	this.currentUIRepresentation.setBackgroundColor(b)
};
draw2d.Port.prototype.getBackgroundColor = function() {
	return this.currentUIRepresentation.getBackgroundColor()
};
draw2d.Port.prototype.getConnections = function() {
	var g = new draw2d.ArrayList();
	var h = this.moveListener.getSize();
	for (var e = 0; e < h; e++) {
		var f = this.moveListener.get(e);
		if (f instanceof draw2d.Connection) {
			g.add(f)
		}
	}
	return g
};
draw2d.Port.prototype.setColor = function(b) {
	this.currentUIRepresentation.setColor(b)
};
draw2d.Port.prototype.getColor = function() {
	return this.currentUIRepresentation.getColor()
};
draw2d.Port.prototype.setLineWidth = function(b) {
	this.currentUIRepresentation.setLineWidth(b)
};
draw2d.Port.prototype.getLineWidth = function() {
	return this.currentUIRepresentation.getLineWidth()
};
draw2d.Port.prototype.paint = function() {
	try {
		this.currentUIRepresentation.paint()
	} catch (b) {
		pushErrorStack(b, "draw2d.Port.prototype.paint=function()")
	}
};
draw2d.Port.prototype.setPosition = function(c, d) {
	this.originX = c;
	this.originY = d;
	draw2d.Rectangle.prototype.setPosition.call(this, c, d);
	if (this.html === null) {
		return
	}
	this.html.style.left = (this.x - this.getWidth() / 2) + "px";
	this.html.style.top = (this.y - this.getHeight() / 2) + "px"
};
draw2d.Port.prototype.setParent = function(b) {
	if (this.parentNode !== null) {
		this.parentNode.detachMoveListener(this)
	}
	this.parentNode = b;
	if (this.parentNode !== null) {
		this.parentNode.attachMoveListener(this)
	}
};
draw2d.Port.prototype.attachMoveListener = function(b) {
	draw2d.Rectangle.prototype.attachMoveListener.call(this, b);
	if (this.hideIfConnected == true) {
		this.setUiRepresentation(this.connectedUIRepresentation)
	}
};
draw2d.Port.prototype.detachMoveListener = function(b) {
	draw2d.Rectangle.prototype.detachMoveListener.call(this, b);
	if (this.getConnections().getSize() == 0) {
		this.setUiRepresentation(this.disconnectedUIRepresentation)
	}
};
draw2d.Port.prototype.getParent = function() {
	return this.parentNode
};
draw2d.Port.prototype.onDrag = function() {
	draw2d.Rectangle.prototype.onDrag.call(this);
	this.parentNode.workflow.showConnectionLine(this.parentNode.x + this.x,
			this.parentNode.y + this.y, this.parentNode.x + this.originX,
			this.parentNode.y + this.originY)
};
draw2d.Port.prototype.getCoronaWidth = function() {
	return this.coronaWidth
};
draw2d.Port.prototype.setCoronaWidth = function(b) {
	this.coronaWidth = b
};
draw2d.Port.prototype.setOrigin = function(d, c) {
	this.originX = d;
	this.originY = c
};
draw2d.Port.prototype.onDragend = function() {
	this.setAlpha(1);
	this.setPosition(this.originX, this.originY);
	this.parentNode.workflow.hideConnectionLine();
	document.body.focus()
};
draw2d.Port.prototype.onDragEnter = function(e) {
	var d = new draw2d.EditPolicy(draw2d.EditPolicy.CONNECT);
	d.canvas = this.parentNode.workflow;
	d.source = e;
	d.target = this;
	var f = this.createCommand(d);
	if (f === null) {
		return
	}
	this.parentNode.workflow.connectionLine
			.setColor(new draw2d.Color(0, 150, 0));
	this.parentNode.workflow.connectionLine.setLineWidth(3);
	this.showCorona(true)
};
draw2d.Port.prototype.onDragLeave = function(b) {
	this.parentNode.workflow.connectionLine.setColor(new draw2d.Color(0, 0, 0));
	this.parentNode.workflow.connectionLine.setLineWidth(1);
	this.showCorona(false)
};
draw2d.Port.prototype.onDrop = function(d) {
	var f = new draw2d.EditPolicy(draw2d.EditPolicy.CONNECT);
	f.canvas = this.parentNode.workflow;
	f.source = d;
	f.target = this;
	var e = this.createCommand(f);
	if (e !== null) {
		this.parentNode.workflow.getCommandStack().execute(e)
	}
};
draw2d.Port.prototype.getAbsolutePosition = function() {
	return new draw2d.Point(this.getAbsoluteX(), this.getAbsoluteY())
};
draw2d.Port.prototype.getAbsoluteBounds = function() {
	return new draw2d.Dimension(this.getAbsoluteX(), this.getAbsoluteY(), this
			.getWidth(), this.getHeight())
};
draw2d.Port.prototype.getAbsoluteY = function() {
	return this.originY + this.parentNode.getY()
};
draw2d.Port.prototype.getAbsoluteX = function() {
	return this.originX + this.parentNode.getX()
};
draw2d.Port.prototype.onOtherFigureMoved = function(b) {
	this.fireMoveEvent()
};
draw2d.Port.prototype.getName = function() {
	return this.name
};
draw2d.Port.prototype.setName = function(b) {
	this.name = b
};
draw2d.Port.prototype.isOver = function(g, i) {
	var h = this.getAbsoluteX() - this.coronaWidth - this.getWidth() / 2;
	var j = this.getAbsoluteY() - this.coronaWidth - this.getHeight() / 2;
	var l = h + this.width + (this.coronaWidth * 2) + this.getWidth() / 2;
	var k = j + this.height + (this.coronaWidth * 2) + this.getHeight() / 2;
	return (g >= h && g <= l && i >= j && i <= k)
};
draw2d.Port.prototype.showCorona = function(d, c) {
	if (d === true) {
		this.corona = new Corona();
		this.corona.setAlpha(0.3);
		this.corona.setBackgroundColor(new draw2d.Color(0, 125, 125));
		this.corona.setColor(null);
		this.corona.setDimension(this.getWidth() + (this.getCoronaWidth() * 2),
				this.getWidth() + (this.getCoronaWidth() * 2));
		this.parentNode.getWorkflow().addFigure(
				this.corona,
				this.getAbsoluteX() - this.getCoronaWidth() - this.getWidth()
						/ 2,
				this.getAbsoluteY() - this.getCoronaWidth() - this.getHeight()
						/ 2)
	} else {
		if (d === false && this.corona !== null) {
			this.parentNode.getWorkflow().removeFigure(this.corona);
			this.corona = null
		}
	}
};
draw2d.Port.prototype.createCommand = function(b) {
	if (b.getPolicy() === draw2d.EditPolicy.MOVE) {
		if (!this.canDrag) {
			return null
		}
		return new draw2d.CommandMovePort(this)
	}
	if (b.getPolicy() === draw2d.EditPolicy.CONNECT) {
		if (b.source.parentNode.id === b.target.parentNode.id) {
			return null
		} else {
			return new draw2d.CommandConnect(b.canvas, b.source, b.target)
		}
	}
	return null
};
draw2d.InputPort = function(b) {
	draw2d.Port.call(this, b)
};
draw2d.InputPort.prototype = new draw2d.Port();
draw2d.InputPort.prototype.type = "draw2d.InputPort";
draw2d.InputPort.prototype.onDragstart = function(d, c) {
	if (!this.canDrag) {
		return false
	}
	return true
};
draw2d.InputPort.prototype.onDragEnter = function(c) {
	if (c instanceof draw2d.OutputPort) {
		draw2d.Port.prototype.onDragEnter.call(this, c)
	} else {
		if (c instanceof draw2d.LineStartResizeHandle) {
			var d = this.workflow.currentSelection;
			if (d instanceof draw2d.Connection
					&& d.getSource() instanceof draw2d.InputPort) {
				draw2d.Port.prototype.onDragEnter.call(this, d.getTarget())
			}
		} else {
			if (c instanceof draw2d.LineEndResizeHandle) {
				var d = this.workflow.currentSelection;
				if (d instanceof draw2d.Connection
						&& d.getTarget() instanceof draw2d.InputPort) {
					draw2d.Port.prototype.onDragEnter.call(this, d.getSource())
				}
			}
		}
	}
};
draw2d.InputPort.prototype.onDragLeave = function(c) {
	if (c instanceof draw2d.OutputPort) {
		draw2d.Port.prototype.onDragLeave.call(this, c)
	} else {
		if (c instanceof draw2d.LineStartResizeHandle) {
			var d = this.workflow.currentSelection;
			if (d instanceof draw2d.Connection
					&& d.getSource() instanceof draw2d.InputPort) {
				draw2d.Port.prototype.onDragLeave.call(this, d.getTarget())
			}
		} else {
			if (c instanceof draw2d.LineEndResizeHandle) {
				var d = this.workflow.currentSelection;
				if (d instanceof draw2d.Connection
						&& d.getTarget() instanceof draw2d.InputPort) {
					draw2d.Port.prototype.onDragLeave.call(this, d.getSource())
				}
			}
		}
	}
};
draw2d.InputPort.prototype.createCommand = function(b) {
	if (b.getPolicy() == draw2d.EditPolicy.CONNECT) {
		if (b.source.parentNode.id == b.target.parentNode.id) {
			return null
		}
		if (b.source instanceof draw2d.OutputPort) {
			return new draw2d.CommandConnect(b.canvas, b.source, b.target)
		}
		return null
	}
	return draw2d.Port.prototype.createCommand.call(this, b)
};
draw2d.OutputPort = function(b) {
	draw2d.Port.call(this, b);
	this.maxFanOut = 100
};
draw2d.OutputPort.prototype = new draw2d.Port();
draw2d.OutputPort.prototype.type = "draw2d.OutputPort";
draw2d.OutputPort.prototype.onDragEnter = function(c) {
	if (this.getMaxFanOut() <= this.getFanOut()) {
		return
	}
	if (c instanceof draw2d.InputPort) {
		draw2d.Port.prototype.onDragEnter.call(this, c)
	} else {
		if (c instanceof draw2d.LineStartResizeHandle) {
			var d = this.workflow.currentSelection;
			if (d instanceof draw2d.Connection
					&& d.getSource() instanceof draw2d.OutputPort) {
				draw2d.Port.prototype.onDragEnter.call(this, d.getTarget())
			}
		} else {
			if (c instanceof draw2d.LineEndResizeHandle) {
				var d = this.workflow.currentSelection;
				if (d instanceof draw2d.Connection
						&& d.getTarget() instanceof draw2d.OutputPort) {
					draw2d.Port.prototype.onDragEnter.call(this, d.getSource())
				}
			}
		}
	}
};
draw2d.OutputPort.prototype.onDragLeave = function(c) {
	if (c instanceof draw2d.InputPort) {
		draw2d.Port.prototype.onDragLeave.call(this, c)
	} else {
		if (c instanceof draw2d.LineStartResizeHandle) {
			var d = this.workflow.currentSelection;
			if (d instanceof draw2d.Connection
					&& d.getSource() instanceof draw2d.OutputPort) {
				draw2d.Port.prototype.onDragLeave.call(this, d.getTarget())
			}
		} else {
			if (c instanceof draw2d.LineEndResizeHandle) {
				var d = this.workflow.currentSelection;
				if (d instanceof draw2d.Connection
						&& d.getTarget() instanceof draw2d.OutputPort) {
					draw2d.Port.prototype.onDragLeave.call(this, d.getSource())
				}
			}
		}
	}
};
draw2d.OutputPort.prototype.onDragstart = function(d, c) {
	if (!this.canDrag) {
		return false
	}
	if (this.maxFanOut === -1) {
		return true
	}
	if (this.getMaxFanOut() <= this.getFanOut()) {
		return false
	}
	return true
};
draw2d.OutputPort.prototype.setMaxFanOut = function(b) {
	this.maxFanOut = b
};
draw2d.OutputPort.prototype.getMaxFanOut = function() {
	return this.maxFanOut
};
draw2d.OutputPort.prototype.getFanOut = function() {
	if (this.getParent().workflow === null) {
		return 0
	}
	var h = 0;
	var f = this.getParent().workflow.getLines();
	var i = f.getSize();
	for (var j = 0; j < i; j++) {
		var g = f.get(j);
		if (g instanceof draw2d.Connection) {
			if (g.getSource() == this) {
				h++
			} else {
				if (g.getTarget() == this) {
					h++
				}
			}
		}
	}
	return h
};
draw2d.OutputPort.prototype.createCommand = function(b) {
	if (b.getPolicy() === draw2d.EditPolicy.CONNECT) {
		if (b.source.parentNode.id === b.target.parentNode.id) {
			return null
		}
		if (b.source instanceof draw2d.InputPort) {
			return new draw2d.CommandConnect(b.canvas, b.target, b.source)
		}
		return null
	}
	return draw2d.Port.prototype.createCommand.call(this, b)
};
draw2d.Line = function() {
	this.lineColor = new draw2d.Color(0, 0, 0);
	this.stroke = 1;
	this.canvas = null;
	this.parent = null;
	this.workflow = null;
	this.html = null;
	this.graphics = null;
	this.id = draw2d.UUID.create();
	this.startX = 30;
	this.startY = 30;
	this.endX = 100;
	this.endY = 100;
	this.alpha = 1;
	this.isMoving = false;
	this.model = null;
	this.zOrder = draw2d.Line.ZOrderBaseIndex;
	this.corona = draw2d.Line.CoronaWidth;
	this.properties = {};
	this.moveListener = new draw2d.ArrayList();
	this.setSelectable(true);
	this.setDeleteable(true)
};
draw2d.Line.prototype.type = "draw2d.Line";
draw2d.Line.ZOrderBaseIndex = 200;
draw2d.Line.ZOrderBaseIndex = 200;
draw2d.Line.CoronaWidth = 5;
draw2d.Line.setZOrderBaseIndex = function(b) {
	draw2d.Line.ZOrderBaseIndex = b
};
draw2d.Line.setDefaultCoronaWidth = function(b) {
	draw2d.Line.CoronaWidth = b
};
draw2d.Line.prototype.dispose = function() {
	this.canvas = null;
	this.workflow = null;
	if (this.graphics !== null) {
		this.graphics.clear()
	}
	this.graphics = null
};
draw2d.Line.prototype.getZOrder = function() {
	return this.zOrder
};
draw2d.Line.prototype.setZOrder = function(b) {
	if (this.html !== null) {
		this.html.style.zIndex = b
	}
	this.zOrder = b
};
draw2d.Line.prototype.setCoronaWidth = function(b) {
	this.corona = b
};
draw2d.Line.prototype.createHTMLElement = function() {
	var b = document.createElement("div");
	b.id = this.id;
	b.style.position = "absolute";
	b.style.left = "0px";
	b.style.top = "0px";
	b.style.height = "0px";
	b.style.width = "0px";
	b.style.zIndex = this.zOrder;
	return b
};
draw2d.Line.prototype.setId = function(b) {
	this.id = b;
	if (this.html !== null) {
		this.html.id = b
	}
};
draw2d.Line.prototype.getId = function() {
	return this.id
};
draw2d.Line.prototype.getProperties = function() {
	return this.properties
};
draw2d.Line.prototype.getProperty = function(b) {
	return this.properties[b]
};
draw2d.Line.prototype.setProperty = function(d, c) {
	this.properties[d] = c;
	this.setDocumentDirty()
};
draw2d.Line.prototype.getHTMLElement = function() {
	if (this.html === null) {
		this.html = this.createHTMLElement()
	}
	return this.html
};
draw2d.Line.prototype.getWorkflow = function() {
	return this.workflow
};
draw2d.Line.prototype.isResizeable = function() {
	return true
};
draw2d.Line.prototype.setCanvas = function(b) {
	this.canvas = b;
	if (this.graphics !== null) {
		this.graphics.clear()
	}
	this.graphics = null
};
draw2d.Line.prototype.setWorkflow = function(b) {
	this.workflow = b;
	if (this.graphics !== null) {
		this.graphics.clear()
	}
	this.graphics = null
};
draw2d.Line.prototype.paint = function() {
	if (this.html === null) {
		return
	}
	try {
		if (this.graphics === null) {
			this.graphics = new jsGraphics(this.html)
		} else {
			this.graphics.clear()
		}
		this.graphics.setStroke(this.stroke);
		this.graphics.setColor(this.lineColor.getHTMLStyle());
		this.graphics.drawLine(this.startX, this.startY, this.endX, this.endY);
		this.graphics.paint()
	} catch (b) {
		pushErrorStack(b, "draw2d.Line.prototype.paint=function()")
	}
};
draw2d.Line.prototype.attachMoveListener = function(b) {
	this.moveListener.add(b)
};
draw2d.Line.prototype.detachMoveListener = function(b) {
	this.moveListener.remove(b)
};
draw2d.Line.prototype.fireMoveEvent = function() {
	var c = this.moveListener.getSize();
	for (var d = 0; d < c; d++) {
		this.moveListener.get(d).onOtherFigureMoved(this)
	}
};
draw2d.Line.prototype.onOtherFigureMoved = function(b) {
};
draw2d.Line.prototype.setLineWidth = function(b) {
	this.stroke = b;
	if (this.graphics !== null) {
		this.paint()
	}
	this.setDocumentDirty()
};
draw2d.Line.prototype.setColor = function(b) {
	this.lineColor = b;
	if (this.graphics !== null) {
		this.paint()
	}
	this.setDocumentDirty()
};
draw2d.Line.prototype.getColor = function() {
	return this.lineColor
};
draw2d.Line.prototype.setAlpha = function(h) {
	if (h == this.alpha) {
		return
	}
	try {
		this.html.style.MozOpacity = h
	} catch (i) {
	}
	try {
		this.html.style.opacity = h
	} catch (j) {
	}
	try {
		var f = Math.round(h * 100);
		if (f >= 99) {
			this.html.style.filter = ""
		} else {
			this.html.style.filter = "alpha(opacity=" + f + ")"
		}
	} catch (g) {
	}
	this.alpha = h
};
draw2d.Line.prototype.setStartPoint = function(d, c) {
	this.startX = d;
	this.startY = c;
	if (this.graphics !== null) {
		this.paint()
	}
	this.setDocumentDirty()
};
draw2d.Line.prototype.setEndPoint = function(d, c) {
	this.endX = d;
	this.endY = c;
	if (this.graphics !== null) {
		this.paint()
	}
	this.setDocumentDirty()
};
draw2d.Line.prototype.getStartX = function() {
	return this.startX
};
draw2d.Line.prototype.getStartY = function() {
	return this.startY
};
draw2d.Line.prototype.getStartPoint = function() {
	return new draw2d.Point(this.startX, this.startY)
};
draw2d.Line.prototype.getEndX = function() {
	return this.endX
};
draw2d.Line.prototype.getEndY = function() {
	return this.endY
};
draw2d.Line.prototype.getEndPoint = function() {
	return new draw2d.Point(this.endX, this.endY)
};
draw2d.Line.prototype.isSelectable = function() {
	return this.selectable
};
draw2d.Line.prototype.setSelectable = function(b) {
	this.selectable = b
};
draw2d.Line.prototype.isDeleteable = function() {
	return this.deleteable
};
draw2d.Line.prototype.setDeleteable = function(b) {
	this.deleteable = b
};
draw2d.Line.prototype.getLength = function() {
	return Math.sqrt((this.startX - this.endX) * (this.startX - this.endX)
			+ (this.startY - this.endY) * (this.startY - this.endY))
};
draw2d.Line.prototype.getAngle = function() {
	var d = this.getLength();
	var c = -(180 / Math.PI) * Math.asin((this.startY - this.endY) / d);
	if (c < 0) {
		if (this.endX < this.startX) {
			c = Math.abs(c) + 180
		} else {
			c = 360 - Math.abs(c)
		}
	} else {
		if (this.endX < this.startX) {
			c = 180 - c
		}
	}
	return c
};
draw2d.Line.prototype.createCommand = function(h) {
	if (h.getPolicy() == draw2d.EditPolicy.MOVE) {
		var f = this.getStartX();
		var i = this.getStartY();
		var g = this.getEndX();
		var j = this.getEndY();
		return new draw2d.CommandMoveLine(this, f, i, g, j)
	}
	if (h.getPolicy() == draw2d.EditPolicy.DELETE) {
		if (this.isDeleteable() == false) {
			return null
		}
		return new draw2d.CommandDelete(this)
	}
	return null
};
draw2d.Line.prototype.setModel = function(b) {
	if (this.model !== null) {
		this.model.removePropertyChangeListener(this)
	}
	this.model = b;
	if (this.model !== null) {
		this.model.addPropertyChangeListener(this)
	}
};
draw2d.Line.prototype.getModel = function() {
	return this.model
};
draw2d.Line.prototype.onRemove = function(b) {
};
draw2d.Line.prototype.onContextMenu = function(e, f) {
	var d = this.getContextMenu();
	if (d !== null) {
		this.workflow.showMenu(d, e, f)
	}
};
draw2d.Line.prototype.getContextMenu = function() {
	return null
};
draw2d.Line.prototype.onDoubleClick = function() {
};
draw2d.Line.prototype.setDocumentDirty = function() {
	if (this.workflow !== null) {
		this.workflow.setDocumentDirty()
	}
};
draw2d.Line.prototype.containsPoint = function(c, d) {
	return draw2d.Line.hit(this.corona, this.startX, this.startY, this.endX,
			this.endY, c, d)
};
draw2d.Line.hit = function(l, s, k, t, m, n, o) {
	t -= s;
	m -= k;
	n -= s;
	o -= k;
	var p = n * t + o * m;
	var q;
	if (p <= 0) {
		q = 0
	} else {
		n = t - n;
		o = m - o;
		p = n * t + o * m;
		if (p <= 0) {
			q = 0
		} else {
			q = p * p / (t * t + m * m)
		}
	}
	var r = n * n + o * o - q;
	if (r < 0) {
		r = 0
	}
	return Math.sqrt(r) < l
};
draw2d.ConnectionRouter = function() {
};
draw2d.ConnectionRouter.prototype.type = "draw2d.ConnectionRouter";
draw2d.ConnectionRouter.prototype.getDirection = function(i, h) {
	var j = Math.abs(i.x - h.x);
	var f = 3;
	var g = Math.abs(i.y - h.y);
	if (g <= j) {
		j = g;
		f = 0
	}
	g = Math.abs(i.getBottom() - h.y);
	if (g <= j) {
		j = g;
		f = 2
	}
	g = Math.abs(i.getRight() - h.x);
	if (g < j) {
		j = g;
		f = 1
	}
	return f
};
draw2d.ConnectionRouter.prototype.getEndDirection = function(d) {
	var f = d.getEndPoint();
	var e = d.getTarget().getParent().getBounds();
	return this.getDirection(e, f)
};
draw2d.ConnectionRouter.prototype.getStartDirection = function(d) {
	var f = d.getStartPoint();
	var e = d.getSource().getParent().getBounds();
	return this.getDirection(e, f)
};
draw2d.ConnectionRouter.prototype.route = function(b) {
};
draw2d.NullConnectionRouter = function() {
};
draw2d.NullConnectionRouter.prototype = new draw2d.ConnectionRouter();
draw2d.NullConnectionRouter.prototype.type = "draw2d.NullConnectionRouter";
draw2d.NullConnectionRouter.prototype.invalidate = function() {
};
draw2d.NullConnectionRouter.prototype.route = function(b) {
	b.addPoint(b.getStartPoint());
	b.addPoint(b.getEndPoint())
};
draw2d.ManhattanConnectionRouter = function() {
	this.MINDIST = 20
};
draw2d.ManhattanConnectionRouter.prototype = new draw2d.ConnectionRouter();
draw2d.ManhattanConnectionRouter.prototype.type = "draw2d.ManhattanConnectionRouter";
draw2d.ManhattanConnectionRouter.prototype.route = function(j) {
	var f = j.getStartPoint();
	var g = this.getStartDirection(j);
	var h = j.getEndPoint();
	var i = this.getEndDirection(j);
	this._route(j, h, i, f, g)
};
draw2d.ManhattanConnectionRouter.prototype._route = function(G, s, u, q, H) {
	var E = 0.1;
	var B = 0.01;
	var r = 0;
	var D = 1;
	var v = 2;
	var J = 3;
	var x = s.x - q.x;
	var z = s.y - q.y;
	var t;
	var I;
	if (((x * x) < (B)) && ((z * z) < (B))) {
		G.addPoint(new draw2d.Point(q.x, q.y));
		return
	}
	if (u == J) {
		if ((x > 0) && ((z * z) < E) && (H === D)) {
			t = q;
			I = H
		} else {
			if (x < 0) {
				t = new draw2d.Point(s.x - this.MINDIST, s.y)
			} else {
				if (((z > 0) && (H === v)) || ((z < 0) && (H == r))) {
					t = new draw2d.Point(q.x, s.y)
				} else {
					if (u == H) {
						var y = Math.min(s.x, q.x) - this.MINDIST;
						t = new draw2d.Point(y, s.y)
					} else {
						t = new draw2d.Point(s.x - (x / 2), s.y)
					}
				}
			}
			if (z > 0) {
				I = r
			} else {
				I = v
			}
		}
	} else {
		if (u == D) {
			if ((x < 0) && ((z * z) < E) && (H === J)) {
				t = q;
				I = H
			} else {
				if (x > 0) {
					t = new draw2d.Point(s.x + this.MINDIST, s.y)
				} else {
					if (((z > 0) && (H === v)) || ((z < 0) && (H === r))) {
						t = new draw2d.Point(q.x, s.y)
					} else {
						if (u == H) {
							var y = Math.max(s.x, q.x) + this.MINDIST;
							t = new draw2d.Point(y, s.y)
						} else {
							t = new draw2d.Point(s.x - (x / 2), s.y)
						}
					}
				}
				if (z > 0) {
					I = r
				} else {
					I = v
				}
			}
		} else {
			if (u == v) {
				if (((x * x) < E) && (z < 0) && (H == r)) {
					t = q;
					I = H
				} else {
					if (z > 0) {
						t = new draw2d.Point(s.x, s.y + this.MINDIST)
					} else {
						if (((x > 0) && (H === D)) || ((x < 0) && (H === J))) {
							t = new draw2d.Point(s.x, q.y)
						} else {
							if (u === H) {
								var y = Math.max(s.y, q.y) + this.MINDIST;
								t = new draw2d.Point(s.x, y)
							} else {
								t = new draw2d.Point(s.x, s.y - (z / 2))
							}
						}
					}
					if (x > 0) {
						I = J
					} else {
						I = D
					}
				}
			} else {
				if (u == r) {
					if (((x * x) < E) && (z > 0) && (H === v)) {
						t = q;
						I = H
					} else {
						if (z < 0) {
							t = new draw2d.Point(s.x, s.y - this.MINDIST)
						} else {
							if (((x > 0) && (H === D))
									|| ((x < 0) && (H === J))) {
								t = new draw2d.Point(s.x, q.y)
							} else {
								if (u === H) {
									var y = Math.min(s.y, q.y) - this.MINDIST;
									t = new draw2d.Point(s.x, y)
								} else {
									t = new draw2d.Point(s.x, s.y - (z / 2))
								}
							}
						}
						if (x > 0) {
							I = J
						} else {
							I = D
						}
					}
				}
			}
		}
	}
	this._route(G, t, I, q, H);
	G.addPoint(s)
};
draw2d.BezierConnectionRouter = function(b) {
	if (!b) {
		this.cheapRouter = new draw2d.ManhattanConnectionRouter()
	} else {
		this.cheapRouter = null
	}
	this.iteration = 5
};
draw2d.BezierConnectionRouter.prototype = new draw2d.ConnectionRouter();
draw2d.BezierConnectionRouter.prototype.type = "draw2d.BezierConnectionRouter";
draw2d.BezierConnectionRouter.prototype.drawBezier = function(v, i, j, n) {
	var s = v.length - 1;
	var t = [];
	var u = s + 1;
	for (var o = 0; o < u; o++) {
		t[o] = [];
		t[o][0] = v[o]
	}
	for (var q = 1; q <= s; q++) {
		for (var o = 0; o <= (s - q); o++) {
			t[o][q] = new draw2d.Point((1 - j) * t[o][q - 1].x + j
					* t[o + 1][q - 1].x, (1 - j) * t[o][q - 1].y + j
					* t[o + 1][q - 1].y)
		}
	}
	var p = [];
	var r = [];
	for (var o = 0; o < s + 1; o++) {
		p[o] = t[0][o];
		r[o] = t[o][s - o]
	}
	if (n >= 0) {
		this.drawBezier(p, i, j, --n);
		this.drawBezier(r, i, j, --n)
	} else {
		for (var o = 0; o < s; o++) {
			i.push(t[o][s - o])
		}
	}
};
draw2d.BezierConnectionRouter.prototype.route = function(j) {
	if (this.cheapRouter !== null
			&& (j.getSource().getParent().isMoving === true || j.getTarget()
					.getParent().isMoving === true)) {
		this.cheapRouter.route(j);
		return
	}
	var k = [];
	var l = j.getStartPoint();
	var i = j.getEndPoint();
	this._route(k, j, i, this.getEndDirection(j), l, this.getStartDirection(j));
	var h = [];
	this.drawBezier(k, h, 0.5, this.iteration);
	for (var g = 0; g < h.length; g++) {
		j.addPoint(h[g])
	}
	j.addPoint(i)
};
draw2d.BezierConnectionRouter.prototype._route = function(K, G, L, M, B, N) {
	var u = 0.1;
	var I = 0.01;
	var J = 90;
	var H = 0;
	var z = 1;
	var t = 2;
	var y = 3;
	var s = L.x - B.x;
	var D = L.y - B.y;
	var v;
	var x;
	if (((s * s) < (I)) && ((D * D) < (I))) {
		K.push(new draw2d.Point(B.x, B.y));
		return
	}
	if (M === y) {
		if ((s > 0) && ((D * D) < u) && (N === z)) {
			v = B;
			x = N
		} else {
			if (s < 0) {
				v = new draw2d.Point(L.x - J, L.y)
			} else {
				if (((D > 0) && (N === t)) || ((D < 0) && (N === H))) {
					v = new draw2d.Point(B.x, L.y)
				} else {
					if (M === N) {
						var E = Math.min(L.x, B.x) - J;
						v = new draw2d.Point(E, L.y)
					} else {
						v = new draw2d.Point(L.x - (s / 2), L.y)
					}
				}
			}
			if (D > 0) {
				x = H
			} else {
				x = t
			}
		}
	} else {
		if (M === z) {
			if ((s < 0) && ((D * D) < u) && (N == y)) {
				v = B;
				x = N
			} else {
				if (s > 0) {
					v = new draw2d.Point(L.x + J, L.y)
				} else {
					if (((D > 0) && (N === t)) || ((D < 0) && (N === H))) {
						v = new draw2d.Point(B.x, L.y)
					} else {
						if (M === N) {
							var E = Math.max(L.x, B.x) + J;
							v = new draw2d.Point(E, L.y)
						} else {
							v = new draw2d.Point(L.x - (s / 2), L.y)
						}
					}
				}
				if (D > 0) {
					x = H
				} else {
					x = t
				}
			}
		} else {
			if (M === t) {
				if (((s * s) < u) && (D < 0) && (N === H)) {
					v = B;
					x = N
				} else {
					if (D > 0) {
						v = new draw2d.Point(L.x, L.y + J)
					} else {
						if (((s > 0) && (N === z)) || ((s < 0) && (N === y))) {
							v = new draw2d.Point(L.x, B.y)
						} else {
							if (M === N) {
								var E = Math.max(L.y, B.y) + J;
								v = new draw2d.Point(L.x, E)
							} else {
								v = new draw2d.Point(L.x, L.y - (D / 2))
							}
						}
					}
					if (s > 0) {
						x = y
					} else {
						x = z
					}
				}
			} else {
				if (M === H) {
					if (((s * s) < u) && (D > 0) && (N === t)) {
						v = B;
						x = N
					} else {
						if (D < 0) {
							v = new draw2d.Point(L.x, L.y - J)
						} else {
							if (((s > 0) && (N === z))
									|| ((s < 0) && (N === y))) {
								v = new draw2d.Point(L.x, B.y)
							} else {
								if (M === N) {
									var E = Math.min(L.y, B.y) - J;
									v = new draw2d.Point(L.x, E)
								} else {
									v = new draw2d.Point(L.x, L.y - (D / 2))
								}
							}
						}
						if (s > 0) {
							x = y
						} else {
							x = z
						}
					}
				}
			}
		}
	}
	this._route(K, G, v, x, B, N);
	K.push(L)
};
draw2d.FanConnectionRouter = function() {
};
draw2d.FanConnectionRouter.prototype = new draw2d.NullConnectionRouter();
draw2d.FanConnectionRouter.prototype.type = "draw2d.FanConnectionRouter";
draw2d.FanConnectionRouter.prototype.route = function(m) {
	var n = m.getStartPoint();
	var k = m.getEndPoint();
	var j = m.getSource().getConnections();
	var i = new draw2d.ArrayList();
	var p = 0;
	for (var o = 0; o < j.getSize(); o++) {
		var l = j.get(o);
		if (l.getTarget() == m.getTarget() || l.getSource() == m.getTarget()) {
			i.add(l);
			if (m == l) {
				p = i.getSize()
			}
		}
	}
	if (i.getSize() > 1) {
		this.routeCollision(m, p)
	} else {
		draw2d.NullConnectionRouter.prototype.route.call(this, m)
	}
};
draw2d.FanConnectionRouter.prototype.routeNormal = function(b) {
	b.addPoint(b.getStartPoint());
	b.addPoint(b.getEndPoint())
};
draw2d.FanConnectionRouter.prototype.routeCollision = function(x, u) {
	var y = x.getStartPoint();
	var v = x.getEndPoint();
	x.addPoint(y);
	var m = 10;
	var n = new draw2d.Point((v.x + y.x) / 2, (v.y + y.y) / 2);
	var p = v.getPosition(y);
	var o;
	if (p == draw2d.PositionConstants.SOUTH
			|| p == draw2d.PositionConstants.EAST) {
		o = new draw2d.Point(v.x - y.x, v.y - y.y)
	} else {
		o = new draw2d.Point(y.x - v.x, y.y - v.y)
	}
	var q = Math.sqrt(o.x * o.x + o.y * o.y);
	var r = m * o.x / q;
	var s = m * o.y / q;
	var t;
	if (u % 2 === 0) {
		t = new draw2d.Point(n.x + (u / 2) * (-1 * s), n.y + (u / 2) * r)
	} else {
		t = new draw2d.Point(n.x + (u / 2) * s, n.y + (u / 2) * (-1 * r))
	}
	x.addPoint(t);
	x.addPoint(v)
};
draw2d.Graphics = function(e, f, d) {
	this.jsGraphics = e;
	this.xt = d.x;
	this.yt = d.y;
	this.radian = f * Math.PI / 180;
	this.sinRadian = Math.sin(this.radian);
	this.cosRadian = Math.cos(this.radian)
};
draw2d.Graphics.prototype.setStroke = function(b) {
	this.jsGraphics.setStroke(b)
};
draw2d.Graphics.prototype.drawLine = function(i, o, j, p) {
	var m = this.xt + i * this.cosRadian - o * this.sinRadian;
	var k = this.yt + i * this.sinRadian + o * this.cosRadian;
	var n = this.xt + j * this.cosRadian - p * this.sinRadian;
	var l = this.yt + j * this.sinRadian + p * this.cosRadian;
	this.jsGraphics.drawLine(m, k, n, l)
};
draw2d.Graphics.prototype.fillRect = function(o, r, n, u) {
	var v = this.xt + o * this.cosRadian - r * this.sinRadian;
	var p = this.yt + o * this.sinRadian + r * this.cosRadian;
	var x = this.xt + (o + n) * this.cosRadian - r * this.sinRadian;
	var q = this.yt + (o + n) * this.sinRadian + r * this.cosRadian;
	var y = this.xt + (o + n) * this.cosRadian - (r + u) * this.sinRadian;
	var s = this.yt + (o + n) * this.sinRadian + (r + u) * this.cosRadian;
	var h = this.xt + o * this.cosRadian - (r + u) * this.sinRadian;
	var t = this.yt + o * this.sinRadian + (r + u) * this.cosRadian;
	this.jsGraphics.fillPolygon([ v, x, y, h ], [ p, q, s, t ])
};
draw2d.Graphics.prototype.fillPolygon = function(j, g) {
	var h = [];
	var i = [];
	for (var f = 0; f < j.length; f++) {
		h[f] = this.xt + j[f] * this.cosRadian - g[f] * this.sinRadian;
		i[f] = this.yt + j[f] * this.sinRadian + g[f] * this.cosRadian
	}
	this.jsGraphics.fillPolygon(h, i)
};
draw2d.Graphics.prototype.setColor = function(b) {
	this.jsGraphics.setColor(b.getHTMLStyle())
};
draw2d.Graphics.prototype.drawPolygon = function(h, i) {
	var j = [];
	var f = [];
	for (var g = 0; g < h.length; g++) {
		j[g] = this.xt + h[g] * this.cosRadian - i[g] * this.sinRadian;
		f[g] = this.yt + h[g] * this.sinRadian + i[g] * this.cosRadian
	}
	this.jsGraphics.drawPolygon(j, f)
};
draw2d.Connection = function() {
	draw2d.Line.call(this);
	this.sourcePort = null;
	this.targetPort = null;
	this.canDrag = true;
	this.sourceDecorator = null;
	this.targetDecorator = null;
	this.sourceAnchor = new draw2d.ConnectionAnchor();
	this.targetAnchor = new draw2d.ConnectionAnchor();
	this.router = draw2d.Connection.defaultRouter;
	this.lineSegments = new draw2d.ArrayList();
	this.children = new draw2d.ArrayList();
	this.setColor(new draw2d.Color(0, 0, 115));
	this.setLineWidth(1)
};
draw2d.Connection.prototype = new draw2d.Line();
draw2d.Connection.prototype.type = "draw2d.Connection";
draw2d.Connection.defaultRouter = new draw2d.ManhattanConnectionRouter();
draw2d.Connection.setDefaultRouter = function(b) {
	draw2d.Connection.defaultRouter = b
};
draw2d.Connection.prototype.disconnect = function() {
	if (this.sourcePort !== null) {
		this.sourcePort.detachMoveListener(this);
		this.fireSourcePortRouteEvent()
	}
	if (this.targetPort !== null) {
		this.targetPort.detachMoveListener(this);
		this.fireTargetPortRouteEvent()
	}
};
draw2d.Connection.prototype.reconnect = function() {
	if (this.sourcePort !== null) {
		this.sourcePort.attachMoveListener(this);
		this.fireSourcePortRouteEvent()
	}
	if (this.targetPort !== null) {
		this.targetPort.attachMoveListener(this);
		this.fireTargetPortRouteEvent()
	}
};
draw2d.Connection.prototype.isResizeable = function() {
	return this.getCanDrag()
};
draw2d.Connection.prototype.setCanDrag = function(b) {
	this.canDrag = b
};
draw2d.Connection.prototype.getCanDrag = function() {
	return this.canDrag
};
draw2d.Connection.prototype.addFigure = function(j, h) {
	var i = {};
	i.figure = j;
	i.locator = h;
	this.children.add(i);
	if (this.graphics !== null) {
		this.paint()
	}
	var f = this;
	var g = function() {
		var a = arguments[0] || window.event;
		a.returnValue = false;
		f.getWorkflow().setCurrentSelection(f);
		f.getWorkflow().showLineResizeHandles(f)
	};
	if (j.getHTMLElement().addEventListener) {
		j.getHTMLElement().addEventListener("mousedown", g, false)
	} else {
		if (j.getHTMLElement().attachEvent) {
			j.getHTMLElement().attachEvent("onmousedown", g)
		}
	}
};
draw2d.Connection.prototype.setSourceDecorator = function(b) {
	this.sourceDecorator = b;
	if (this.graphics !== null) {
		this.paint()
	}
};
draw2d.Connection.prototype.getSourceDecorator = function() {
	return this.sourceDecorator
};
draw2d.Connection.prototype.setTargetDecorator = function(b) {
	this.targetDecorator = b;
	if (this.graphics !== null) {
		this.paint()
	}
};
draw2d.Connection.prototype.getTargetDecorator = function() {
	return this.targetDecorator
};
draw2d.Connection.prototype.setSourceAnchor = function(b) {
	this.sourceAnchor = b;
	this.sourceAnchor.setOwner(this.sourcePort);
	if (this.graphics !== null) {
		this.paint()
	}
};
draw2d.Connection.prototype.setTargetAnchor = function(b) {
	this.targetAnchor = b;
	this.targetAnchor.setOwner(this.targetPort);
	if (this.graphics !== null) {
		this.paint()
	}
};
draw2d.Connection.prototype.setRouter = function(b) {
	if (b !== null) {
		this.router = b
	} else {
		this.router = new draw2d.NullConnectionRouter()
	}
	if (this.graphics !== null) {
		this.paint()
	}
};
draw2d.Connection.prototype.getRouter = function() {
	return this.router
};
draw2d.Connection.prototype.setWorkflow = function(d) {
	draw2d.Line.prototype.setWorkflow.call(this, d);
	for (var c = 0; c < this.children.getSize(); c++) {
		this.children.get(c).isAppended = false
	}
};
draw2d.Connection.prototype.paint = function() {
	if (this.html === null) {
		return
	}
	try {
		for (var e = 0; e < this.children.getSize(); e++) {
			var d = this.children.get(e);
			if (d.isAppended == true) {
				this.html.removeChild(d.figure.getHTMLElement())
			}
			d.isAppended = false
		}
		if (this.graphics === null) {
			this.graphics = new jsGraphics(this.html)
		} else {
			this.graphics.clear()
		}
		this.graphics.setStroke(this.stroke);
		this.graphics.setColor(this.lineColor.getHTMLStyle());
		this.startStroke();
		this.router.route(this);
		if (this.getSource().getParent().isMoving == false
				&& this.getTarget().getParent().isMoving == false) {
			if (this.targetDecorator !== null) {
				this.targetDecorator.paint(new draw2d.Graphics(this.graphics,
						this.getEndAngle(), this.getEndPoint()))
			}
			if (this.sourceDecorator !== null) {
				this.sourceDecorator.paint(new draw2d.Graphics(this.graphics,
						this.getStartAngle(), this.getStartPoint()))
			}
		}
		this.finishStroke();
		for (var e = 0; e < this.children.getSize(); e++) {
			var d = this.children.get(e);
			this.html.appendChild(d.figure.getHTMLElement());
			d.isAppended = true;
			d.locator.relocate(d.figure)
		}
	} catch (f) {
		pushErrorStack(f, "draw2d.Connection.prototype.paint=function()")
	}
};
draw2d.Connection.prototype.getStartPoint = function() {
	if (this.isMoving == false) {
		return this.sourceAnchor.getLocation(this.targetAnchor
				.getReferencePoint())
	} else {
		return draw2d.Line.prototype.getStartPoint.call(this)
	}
};
draw2d.Connection.prototype.getEndPoint = function() {
	if (this.isMoving == false) {
		return this.targetAnchor.getLocation(this.sourceAnchor
				.getReferencePoint())
	} else {
		return draw2d.Line.prototype.getEndPoint.call(this)
	}
};
draw2d.Connection.prototype.startStroke = function() {
	this.oldPoint = null;
	this.lineSegments = new draw2d.ArrayList()
};
draw2d.Connection.prototype.finishStroke = function() {
	this.graphics.paint();
	this.oldPoint = null
};
draw2d.Connection.prototype.getPoints = function() {
	var f = new draw2d.ArrayList();
	var e = null;
	for (var d = 0; d < this.lineSegments.getSize(); d++) {
		e = this.lineSegments.get(d);
		f.add(e.start)
	}
	if (e !== null) {
		f.add(e.end)
	}
	return f
};
draw2d.Connection.prototype.addPoint = function(c) {
	c = new draw2d.Point(parseInt(c.x), parseInt(c.y));
	if (this.oldPoint !== null) {
		this.graphics.drawLine(this.oldPoint.x, this.oldPoint.y, c.x, c.y);
		var d = {};
		d.start = this.oldPoint;
		d.end = c;
		this.lineSegments.add(d)
	}
	this.oldPoint = {};
	this.oldPoint.x = c.x;
	this.oldPoint.y = c.y
};
draw2d.Connection.prototype.refreshSourcePort = function() {
	var m = this.getModel().getSourceModel();
	var k = this.getModel().getSourcePortName();
	var n = this.getWorkflow().getDocument().getFigures();
	var j = n.getSize();
	for (var l = 0; l < j; l++) {
		var i = n.get(l);
		if (i.getModel() == m) {
			var h = i.getOutputPort(k);
			this.setSource(h)
		}
	}
	this.setRouter(this.getRouter())
};
draw2d.Connection.prototype.refreshTargetPort = function() {
	var m = this.getModel().getTargetModel();
	var n = this.getModel().getTargetPortName();
	var i = this.getWorkflow().getDocument().getFigures();
	var k = i.getSize();
	for (var l = 0; l < k; l++) {
		var j = i.get(l);
		if (j.getModel() == m) {
			var h = j.getInputPort(n);
			this.setTarget(h)
		}
	}
	this.setRouter(this.getRouter())
};
draw2d.Connection.prototype.setSource = function(b) {
	if (this.sourcePort !== null) {
		this.sourcePort.detachMoveListener(this)
	}
	this.sourcePort = b;
	if (this.sourcePort === null) {
		return
	}
	this.sourceAnchor.setOwner(this.sourcePort);
	this.fireSourcePortRouteEvent();
	this.sourcePort.attachMoveListener(this);
	this.setStartPoint(b.getAbsoluteX(), b.getAbsoluteY())
};
draw2d.Connection.prototype.getSource = function() {
	return this.sourcePort
};
draw2d.Connection.prototype.setTarget = function(b) {
	if (this.targetPort !== null) {
		this.targetPort.detachMoveListener(this)
	}
	this.targetPort = b;
	if (this.targetPort === null) {
		return
	}
	this.targetAnchor.setOwner(this.targetPort);
	this.fireTargetPortRouteEvent();
	this.targetPort.attachMoveListener(this);
	this.setEndPoint(b.getAbsoluteX(), b.getAbsoluteY())
};
draw2d.Connection.prototype.getTarget = function() {
	return this.targetPort
};
draw2d.Connection.prototype.onOtherFigureMoved = function(b) {
	if (b == this.sourcePort) {
		this.setStartPoint(this.sourcePort.getAbsoluteX(), this.sourcePort
				.getAbsoluteY())
	} else {
		this.setEndPoint(this.targetPort.getAbsoluteX(), this.targetPort
				.getAbsoluteY())
	}
};
draw2d.Connection.prototype.containsPoint = function(g, e) {
	for (var h = 0; h < this.lineSegments.getSize(); h++) {
		var f = this.lineSegments.get(h);
		if (draw2d.Line.hit(this.corona, f.start.x, f.start.y, f.end.x,
				f.end.y, g, e)) {
			return true
		}
	}
	return false
};
draw2d.Connection.prototype.getStartAngle = function() {
	var g = this.lineSegments.get(0).start;
	var e = this.lineSegments.get(0).end;
	if (this.router instanceof draw2d.BezierConnectionRouter) {
		e = this.lineSegments.get(5).end
	}
	var f = Math.sqrt((g.x - e.x) * (g.x - e.x) + (g.y - e.y) * (g.y - e.y));
	var h = -(180 / Math.PI) * Math.asin((g.y - e.y) / f);
	if (h < 0) {
		if (e.x < g.x) {
			h = Math.abs(h) + 180
		} else {
			h = 360 - Math.abs(h)
		}
	} else {
		if (e.x < g.x) {
			h = 180 - h
		}
	}
	return h
};
draw2d.Connection.prototype.getEndAngle = function() {
	if (this.lineSegments.getSize() === 0) {
		return 90
	}
	var g = this.lineSegments.get(this.lineSegments.getSize() - 1).end;
	var e = this.lineSegments.get(this.lineSegments.getSize() - 1).start;
	if (this.router instanceof draw2d.BezierConnectionRouter) {
		e = this.lineSegments.get(this.lineSegments.getSize() - 5).end
	}
	var f = Math.sqrt((g.x - e.x) * (g.x - e.x) + (g.y - e.y) * (g.y - e.y));
	var h = -(180 / Math.PI) * Math.asin((g.y - e.y) / f);
	if (h < 0) {
		if (e.x < g.x) {
			h = Math.abs(h) + 180
		} else {
			h = 360 - Math.abs(h)
		}
	} else {
		if (e.x < g.x) {
			h = 180 - h
		}
	}
	return h
};
draw2d.Connection.prototype.fireSourcePortRouteEvent = function() {
	var d = this.sourcePort.getConnections();
	for (var c = 0; c < d.getSize(); c++) {
		d.get(c).paint()
	}
};
draw2d.Connection.prototype.fireTargetPortRouteEvent = function() {
	var c = this.targetPort.getConnections();
	for (var d = 0; d < c.getSize(); d++) {
		c.get(d).paint()
	}
};
draw2d.Connection.prototype.createCommand = function(b) {
	if (b.getPolicy() == draw2d.EditPolicy.MOVE) {
		return new draw2d.CommandReconnect(this)
	}
	if (b.getPolicy() == draw2d.EditPolicy.DELETE) {
		if (this.isDeleteable() == true) {
			return new draw2d.CommandDelete(this)
		}
		return null
	}
	return null
};
draw2d.ConnectionAnchor = function(b) {
	this.owner = b
};
draw2d.ConnectionAnchor.prototype.type = "draw2d.ConnectionAnchor";
draw2d.ConnectionAnchor.prototype.getLocation = function(b) {
	return this.getReferencePoint()
};
draw2d.ConnectionAnchor.prototype.getOwner = function() {
	return this.owner
};
draw2d.ConnectionAnchor.prototype.setOwner = function(b) {
	this.owner = b
};
draw2d.ConnectionAnchor.prototype.getBox = function() {
	return this.getOwner().getAbsoluteBounds()
};
draw2d.ConnectionAnchor.prototype.getReferencePoint = function() {
	if (this.getOwner() === null) {
		return null
	} else {
		return this.getOwner().getAbsolutePosition()
	}
};
draw2d.ChopboxConnectionAnchor = function(b) {
	draw2d.ConnectionAnchor.call(this, b)
};
draw2d.ChopboxConnectionAnchor.prototype = new draw2d.ConnectionAnchor();
draw2d.ChopboxConnectionAnchor.prototype.type = "draw2d.ChopboxConnectionAnchor";
draw2d.ChopboxConnectionAnchor.prototype.getLocation = function(n) {
	var l = new draw2d.Dimension();
	l.setBounds(this.getBox());
	l.translate(-1, -1);
	l.resize(1, 1);
	var k = l.x + l.w / 2;
	var m = l.y + l.h / 2;
	if (l.isEmpty() || (n.x == k && n.y == m)) {
		return new Point(k, m)
	}
	var h = n.x - k;
	var i = n.y - m;
	var j = 0.5 / Math.max(Math.abs(h) / l.w, Math.abs(i) / l.h);
	h *= j;
	i *= j;
	k += h;
	m += i;
	return new draw2d.Point(Math.round(k), Math.round(m))
};
draw2d.ChopboxConnectionAnchor.prototype.getBox = function() {
	return this.getOwner().getParent().getBounds()
};
draw2d.ChopboxConnectionAnchor.prototype.getReferencePoint = function() {
	return this.getBox().getCenter()
};
draw2d.ConnectionDecorator = function() {
	this.color = new draw2d.Color(0, 0, 0);
	this.backgroundColor = new draw2d.Color(250, 250, 250)
};
draw2d.ConnectionDecorator.prototype.type = "draw2d.ConnectionDecorator";
draw2d.ConnectionDecorator.prototype.paint = function(b) {
};
draw2d.ConnectionDecorator.prototype.setColor = function(b) {
	this.color = b
};
draw2d.ConnectionDecorator.prototype.setBackgroundColor = function(b) {
	this.backgroundColor = b
};
draw2d.ArrowConnectionDecorator = function(d, c) {
	draw2d.ConnectionDecorator.call(this);
	if (d === undefined || d < 1) {
		this.lenght = 15
	}
	if (c === undefined || c < 1) {
		this.width = 10
	}
};
draw2d.ArrowConnectionDecorator.prototype = new draw2d.ConnectionDecorator();
draw2d.ArrowConnectionDecorator.prototype.type = "draw2d.ArrowConnectionDecorator";
draw2d.ArrowConnectionDecorator.prototype.paint = function(b) {
	if (this.backgroundColor !== null) {
		b.setColor(this.backgroundColor);
		b.fillPolygon([ 3, this.lenght, this.lenght, 3 ], [ 0,
				(this.width / 2), -(this.width / 2), 0 ])
	}
	b.setColor(this.color);
	b.setStroke(1);
	b.drawPolygon([ 3, this.lenght, this.lenght, 3 ], [ 0, (this.width / 2),
			-(this.width / 2), 0 ])
};
draw2d.ArrowConnectionDecorator.prototype.setDimension = function(d, c) {
	this.width = w;
	this.lenght = d
};
draw2d.CompartmentFigure = function() {
	draw2d.Node.call(this);
	this.children = new draw2d.ArrayList();
	this.setBorder(new draw2d.LineBorder(1));
	this.dropable = new draw2d.DropTarget(this.html);
	this.dropable.node = this;
	this.dropable.addEventListener("figureenter", function(b) {
		b.target.node.onFigureEnter(b.relatedTarget.node)
	});
	this.dropable.addEventListener("figureleave", function(b) {
		b.target.node.onFigureLeave(b.relatedTarget.node)
	});
	this.dropable.addEventListener("figuredrop", function(b) {
		b.target.node.onFigureDrop(b.relatedTarget.node)
	})
};
draw2d.CompartmentFigure.prototype = new draw2d.Node();
draw2d.CompartmentFigure.prototype.type = "draw2d.CompartmentFigure";
draw2d.CompartmentFigure.prototype.onFigureEnter = function(b) {
};
draw2d.CompartmentFigure.prototype.onFigureLeave = function(b) {
};
draw2d.CompartmentFigure.prototype.onFigureDrop = function(b) {
};
draw2d.CompartmentFigure.prototype.getChildren = function() {
	return this.children
};
draw2d.CompartmentFigure.prototype.addChild = function(b) {
	b.setZOrder(this.getZOrder() + 1);
	b.setParent(this);
	this.children.add(b)
};
draw2d.CompartmentFigure.prototype.removeChild = function(b) {
	b.setParent(null);
	this.children.remove(b)
};
draw2d.CompartmentFigure.prototype.setZOrder = function(d) {
	draw2d.Node.prototype.setZOrder.call(this, d);
	for (var c = 0; c < this.children.getSize(); c++) {
		this.children.get(c).setZOrder(d + 1)
	}
};
draw2d.CompartmentFigure.prototype.setPosition = function(j, k) {
	var l = this.getX();
	var g = this.getY();
	draw2d.Node.prototype.setPosition.call(this, j, k);
	for (var h = 0; h < this.children.getSize(); h++) {
		var i = this.children.get(h);
		i.setPosition(i.getX() + this.getX() - l, i.getY() + this.getY() - g)
	}
};
draw2d.CompartmentFigure.prototype.onDrag = function() {
	var h = this.getX();
	var e = this.getY();
	draw2d.Node.prototype.onDrag.call(this);
	for (var f = 0; f < this.children.getSize(); f++) {
		var g = this.children.get(f);
		g.setPosition(g.getX() + this.getX() - h, g.getY() + this.getY() - e)
	}
};
draw2d.CanvasDocument = function(b) {
	this.canvas = b
};
draw2d.CanvasDocument.prototype.type = "draw2d.CanvasDocument";
draw2d.CanvasDocument.prototype.getFigures = function() {
	var g = new draw2d.ArrayList();
	var h = this.canvas.figures;
	var i = this.canvas.dialogs;
	for (var j = 0; j < h.getSize(); j++) {
		var f = h.get(j);
		if (i.indexOf(f) == -1 && f.getParent() === null
				&& !(f instanceof draw2d.WindowFigure)) {
			g.add(f)
		}
	}
	return g
};
draw2d.CanvasDocument.prototype.getFigure = function(b) {
	return this.canvas.getFigure(b)
};
draw2d.CanvasDocument.prototype.getLines = function() {
	return this.canvas.getLines()
};
draw2d.CanvasDocument.prototype.getLine = function(b) {
	return this.canvas.getLine(b)
};
draw2d.Annotation = function(b) {
	this.msg = b;
	this.alpha = 1;
	this.color = new draw2d.Color(0, 0, 0);
	this.bgColor = new draw2d.Color(241, 241, 121);
	this.fontSize = 10;
	this.textNode = null;
	draw2d.Figure.call(this)
};
draw2d.Annotation.prototype = new draw2d.Figure();
draw2d.Annotation.prototype.type = "draw2d.Annotation";
draw2d.Annotation.prototype.createHTMLElement = function() {
	var b = draw2d.Figure.prototype.createHTMLElement.call(this);
	b.style.color = this.color.getHTMLStyle();
	b.style.backgroundColor = this.bgColor.getHTMLStyle();
	b.style.fontSize = this.fontSize + "pt";
	b.style.width = "auto";
	b.style.height = "auto";
	b.style.margin = "0px";
	b.style.padding = "0px";
	b.onselectstart = function() {
		return false
	};
	b.unselectable = "on";
	b.style.cursor = "default";
	this.textNode = document.createTextNode(this.msg);
	b.appendChild(this.textNode);
	this.disableTextSelection(b);
	return b
};
draw2d.Annotation.prototype.onDoubleClick = function() {
	var b = new draw2d.AnnotationDialog(this);
	this.workflow.showDialog(b)
};
draw2d.Annotation.prototype.setBackgroundColor = function(b) {
	this.bgColor = b;
	if (this.bgColor !== null) {
		this.html.style.backgroundColor = this.bgColor.getHTMLStyle()
	} else {
		this.html.style.backgroundColor = "transparent"
	}
};
draw2d.Annotation.prototype.getBackgroundColor = function() {
	return this.bgColor
};
draw2d.Annotation.prototype.setFontSize = function(b) {
	this.fontSize = b;
	this.html.style.fontSize = this.fontSize + "pt"
};
draw2d.Annotation.prototype.getText = function() {
	return this.msg
};
draw2d.Annotation.prototype.setText = function(b) {
	this.msg = b;
	this.html.removeChild(this.textNode);
	this.textNode = document.createTextNode(this.msg);
	this.html.appendChild(this.textNode)
};
draw2d.Annotation.prototype.setStyledText = function(b) {
	this.msg = b;
	this.html.removeChild(this.textNode);
	this.textNode = document.createElement("div");
	this.textNode.innerHTML = b;
	this.html.appendChild(this.textNode)
};
draw2d.ResizeHandle = function(g, f) {
	draw2d.Rectangle.call(this, 5, 5);
	this.type = f;
	var h = this.getWidth();
	var e = h / 2;
	switch (this.type) {
	case 1:
		this.setSnapToGridAnchor(new draw2d.Point(h, h));
		break;
	case 2:
		this.setSnapToGridAnchor(new draw2d.Point(e, h));
		break;
	case 3:
		this.setSnapToGridAnchor(new draw2d.Point(0, h));
		break;
	case 4:
		this.setSnapToGridAnchor(new draw2d.Point(0, e));
		break;
	case 5:
		this.setSnapToGridAnchor(new draw2d.Point(0, 0));
		break;
	case 6:
		this.setSnapToGridAnchor(new draw2d.Point(e, 0));
		break;
	case 7:
		this.setSnapToGridAnchor(new draw2d.Point(h, 0));
		break;
	case 8:
		this.setSnapToGridAnchor(new draw2d.Point(h, e));
	case 9:
		this.setSnapToGridAnchor(new draw2d.Point(e, e));
		break
	}
	this.setBackgroundColor(new draw2d.Color(0, 255, 0));
	this.setWorkflow(g);
	this.setZOrder(10000)
};
draw2d.ResizeHandle.prototype = new draw2d.Rectangle();
draw2d.ResizeHandle.prototype.type = "draw2d.ResizeHandle";
draw2d.ResizeHandle.prototype.getSnapToDirection = function() {
	switch (this.type) {
	case 1:
		return draw2d.SnapToHelper.NORTH_WEST;
	case 2:
		return draw2d.SnapToHelper.NORTH;
	case 3:
		return draw2d.SnapToHelper.NORTH_EAST;
	case 4:
		return draw2d.SnapToHelper.EAST;
	case 5:
		return draw2d.SnapToHelper.SOUTH_EAST;
	case 6:
		return draw2d.SnapToHelper.SOUTH;
	case 7:
		return draw2d.SnapToHelper.SOUTH_WEST;
	case 8:
		return draw2d.SnapToHelper.WEST;
	case 9:
		return draw2d.SnapToHelper.CENTER
	}
};
draw2d.ResizeHandle.prototype.onDragend = function() {
	var b = this.workflow.currentSelection;
	if (this.commandMove !== null) {
		this.commandMove.setPosition(b.getX(), b.getY());
		this.workflow.getCommandStack().execute(this.commandMove);
		this.commandMove = null
	}
	if (this.commandResize !== null) {
		this.commandResize.setDimension(b.getWidth(), b.getHeight());
		this.workflow.getCommandStack().execute(this.commandResize);
		this.commandResize = null
	}
	this.workflow.hideSnapToHelperLines()
};
draw2d.ResizeHandle.prototype.setPosition = function(c, d) {
	this.x = c;
	this.y = d;
	if (this.html === null) {
		return
	}
	this.html.style.left = this.x + "px";
	this.html.style.top = this.y + "px"
};
draw2d.ResizeHandle.prototype.onDragstart = function(e, f) {
	if (!this.canDrag) {
		return false
	}
	var d = this.workflow.currentSelection;
	this.commandMove = d.createCommand(new draw2d.EditPolicy(
			draw2d.EditPolicy.MOVE));
	this.commandResize = d.createCommand(new draw2d.EditPolicy(
			draw2d.EditPolicy.RESIZE));
	return true
};
draw2d.ResizeHandle.prototype.onDrag = function() {
	var k = this.getX();
	var l = this.getY();
	draw2d.Rectangle.prototype.onDrag.call(this);
	var m = k - this.getX();
	var o = l - this.getY();
	var n = this.workflow.currentSelection.getX();
	var p = this.workflow.currentSelection.getY();
	var i = this.workflow.currentSelection.getWidth();
	var j = this.workflow.currentSelection.getHeight();
	switch (this.type) {
	case 1:
		this.workflow.currentSelection.setPosition(n - m, p - o);
		this.workflow.currentSelection.setDimension(i + m, j + o);
		break;
	case 2:
		this.workflow.currentSelection.setPosition(n, p - o);
		this.workflow.currentSelection.setDimension(i, j + o);
		break;
	case 3:
		this.workflow.currentSelection.setPosition(n, p - o);
		this.workflow.currentSelection.setDimension(i - m, j + o);
		break;
	case 4:
		this.workflow.currentSelection.setPosition(n, p);
		this.workflow.currentSelection.setDimension(i - m, j);
		break;
	case 5:
		this.workflow.currentSelection.setPosition(n, p);
		this.workflow.currentSelection.setDimension(i - m, j - o);
		break;
	case 6:
		this.workflow.currentSelection.setPosition(n, p);
		this.workflow.currentSelection.setDimension(i, j - o);
		break;
	case 7:
		this.workflow.currentSelection.setPosition(n - m, p);
		this.workflow.currentSelection.setDimension(i + m, j - o);
		break;
	case 8:
		this.workflow.currentSelection.setPosition(n - m, p);
		this.workflow.currentSelection.setDimension(i + m, j);
		break
	}
	this.workflow.moveResizeHandles(this.workflow.getCurrentSelection())
};
draw2d.ResizeHandle.prototype.setCanDrag = function(b) {
	draw2d.Rectangle.prototype.setCanDrag.call(this, b);
	if (this.html === null) {
		return
	}
	if (!b) {
		this.html.style.cursor = "";
		return
	}
	switch (this.type) {
	case 1:
		this.html.style.cursor = "nw-resize";
		break;
	case 2:
		this.html.style.cursor = "s-resize";
		break;
	case 3:
		this.html.style.cursor = "ne-resize";
		break;
	case 4:
		this.html.style.cursor = "w-resize";
		break;
	case 5:
		this.html.style.cursor = "se-resize";
		break;
	case 6:
		this.html.style.cursor = "n-resize";
		break;
	case 7:
		this.html.style.cursor = "sw-resize";
		break;
	case 8:
		this.html.style.cursor = "e-resize";
		break;
	case 9:
		this.html.style.cursor = "resize";
		break
	}
};
draw2d.ResizeHandle.prototype.onKeyDown = function(c, d) {
	this.workflow.onKeyDown(c, d)
};
draw2d.ResizeHandle.prototype.fireMoveEvent = function() {
};
draw2d.LineStartResizeHandle = function(b) {
	draw2d.ResizeHandle.call(this, b, 9);
	this.setDimension(10, 10);
	this.setBackgroundColor(new draw2d.Color(100, 255, 0));
	this.setZOrder(10000)
};
draw2d.LineStartResizeHandle.prototype = new draw2d.ResizeHandle();
draw2d.LineStartResizeHandle.prototype.type = "draw2d.LineStartResizeHandle";
draw2d.LineStartResizeHandle.prototype.onDragend = function() {
	if (this.workflow.currentSelection instanceof draw2d.Connection) {
		if (this.command !== null) {
			this.command.cancel()
		}
	} else {
		if (this.command !== null) {
			this.getWorkflow().getCommandStack().execute(this.command)
		}
	}
	this.command = null
};
draw2d.LineStartResizeHandle.prototype.onDragstart = function(d, c) {
	if (!this.canDrag) {
		return false
	}
	this.command = this.workflow.currentSelection
			.createCommand(new draw2d.EditPolicy(draw2d.EditPolicy.MOVE));
	return this.command !== null
};
draw2d.LineStartResizeHandle.prototype.onDrag = function() {
	var j = this.getX();
	var k = this.getY();
	draw2d.Rectangle.prototype.onDrag.call(this);
	var l = j - this.getX();
	var g = k - this.getY();
	var i = this.workflow.currentSelection.getStartPoint();
	var h = this.workflow.currentSelection;
	h.setStartPoint(i.x - l, i.y - g);
	h.isMoving = true
};
draw2d.LineStartResizeHandle.prototype.onDrop = function(c) {
	var d = this.workflow.currentSelection;
	d.isMoving = false;
	if (d instanceof draw2d.Connection) {
		this.command.setNewPorts(c, d.getTarget());
		this.getWorkflow().getCommandStack().execute(this.command)
	}
	this.command = null
};
draw2d.LineEndResizeHandle = function(b) {
	draw2d.ResizeHandle.call(this, b, 9);
	this.setDimension(10, 10);
	this.setBackgroundColor(new draw2d.Color(0, 255, 0));
	this.setZOrder(10000)
};
draw2d.LineEndResizeHandle.prototype = new draw2d.ResizeHandle();
draw2d.LineEndResizeHandle.prototype.type = "draw2d.LineEndResizeHandle";
draw2d.LineEndResizeHandle.prototype.onDragend = function() {
	if (this.workflow.currentSelection instanceof draw2d.Connection) {
		if (this.command !== null) {
			this.command.cancel()
		}
	} else {
		if (this.command !== null) {
			this.workflow.getCommandStack().execute(this.command)
		}
	}
	this.command = null
};
draw2d.LineEndResizeHandle.prototype.onDragstart = function(d, c) {
	if (!this.canDrag) {
		return false
	}
	this.command = this.workflow.currentSelection
			.createCommand(new draw2d.EditPolicy(draw2d.EditPolicy.MOVE));
	return this.command !== null
};
draw2d.LineEndResizeHandle.prototype.onDrag = function() {
	var i = this.getX();
	var j = this.getY();
	draw2d.Rectangle.prototype.onDrag.call(this);
	var l = i - this.getX();
	var g = j - this.getY();
	var k = this.workflow.currentSelection.getEndPoint();
	var h = this.workflow.currentSelection;
	h.setEndPoint(k.x - l, k.y - g);
	h.isMoving = true
};
draw2d.LineEndResizeHandle.prototype.onDrop = function(c) {
	var d = this.workflow.currentSelection;
	d.isMoving = false;
	if (d instanceof draw2d.Connection) {
		this.command.setNewPorts(d.getSource(), c);
		this.getWorkflow().getCommandStack().execute(this.command)
	}
	this.command = null
};
draw2d.Canvas = function(d) {
	try {
		if (d) {
			this.construct(d)
		}
		this.enableSmoothFigureHandling = false;
		this.canvasLines = new draw2d.ArrayList()
	} catch (c) {
		pushErrorStack(c, "draw2d.Canvas=function(/*:String*/id)")
	}
};
draw2d.Canvas.IMAGE_BASE_URL = "";
draw2d.Canvas.prototype.type = "draw2d.Canvas";
draw2d.Canvas.prototype.construct = function(b) {
	this.canvasId = b;
	this.html = document.getElementById(this.canvasId);
	this.scrollArea = document.body.parentNode
};
draw2d.Canvas.prototype.setViewPort = function(b) {
	this.scrollArea = document.getElementById(b)
};
draw2d.Canvas.prototype.addFigure = function(e, l, p, j) {
	try {
		if (this.enableSmoothFigureHandling === true) {
			if (e.timer <= 0) {
				e.setAlpha(0.001)
			}
			var k = e;
			var m = function() {
				if (k.alpha < 1) {
					k.setAlpha(Math.min(1, k.alpha + 0.05))
				} else {
					window.clearInterval(k.timer);
					k.timer = -1
				}
			};
			if (k.timer > 0) {
				window.clearInterval(k.timer)
			}
			k.timer = window.setInterval(m, 30)
		}
		e.setCanvas(this);
		if (l && p) {
			e.setPosition(l, p)
		}
		if (e instanceof draw2d.Line) {
			this.canvasLines.add(e);
			this.html.appendChild(e.getHTMLElement())
		} else {
			var n = this.canvasLines.getFirstElement();
			if (n === null) {
				this.html.appendChild(e.getHTMLElement())
			} else {
				this.html.insertBefore(e.getHTMLElement(), n.getHTMLElement())
			}
		}
		if (!j) {
			e.paint()
		}
	} catch (o) {
		pushErrorStack(
				o,
				"draw2d.Canvas.prototype.addFigure= function( /*:draw2d.Figure*/figure,/*:int*/ xPos,/*:int*/ yPos, /*:boolean*/ avoidPaint)")
	}
};
draw2d.Canvas.prototype.removeFigure = function(f) {
	if (this.enableSmoothFigureHandling === true) {
		var e = this;
		var g = f;
		var h = function() {
			if (g.alpha > 0) {
				g.setAlpha(Math.max(0, g.alpha - 0.05))
			} else {
				window.clearInterval(g.timer);
				g.timer = -1;
				e.html.removeChild(g.html);
				g.setCanvas(null)
			}
		};
		if (g.timer > 0) {
			window.clearInterval(g.timer)
		}
		g.timer = window.setInterval(h, 20)
	} else {
		this.html.removeChild(f.html);
		f.setCanvas(null)
	}
	if (f instanceof draw2d.Line) {
		this.canvasLines.remove(f)
	}
};
draw2d.Canvas.prototype.getEnableSmoothFigureHandling = function() {
	return this.enableSmoothFigureHandling
};
draw2d.Canvas.prototype.setEnableSmoothFigureHandling = function(b) {
	this.enableSmoothFigureHandling = b
};
draw2d.Canvas.prototype.getWidth = function() {
	return parseInt(this.html.style.width)
};
draw2d.Canvas.prototype.setWidth = function(b) {
	if (this.scrollArea !== null) {
		this.scrollArea.style.width = b + "px"
	} else {
		this.html.style.width = b + "px"
	}
};
draw2d.Canvas.prototype.getHeight = function() {
	return parseInt(this.html.style.height)
};
draw2d.Canvas.prototype.setHeight = function(b) {
	if (this.scrollArea !== null) {
		this.scrollArea.style.height = b + "px"
	} else {
		this.html.style.height = b + "px"
	}
};
draw2d.Canvas.prototype.setBackgroundImage = function(c, d) {
	if (c !== null) {
		if (d) {
			this.html.style.background = "transparent url(" + c + ") "
		} else {
			this.html.style.background = "transparent url(" + c + ") no-repeat"
		}
	} else {
		this.html.style.background = "transparent"
	}
};
draw2d.Canvas.prototype.getY = function() {
	return this.y
};
draw2d.Canvas.prototype.getX = function() {
	return this.x
};
draw2d.Canvas.prototype.getAbsoluteY = function() {
	var d = this.html;
	var c = d.offsetTop;
	while ((d = d.offsetParent) !== null) {
		c += d.offsetTop
	}
	return c
};
draw2d.Canvas.prototype.getAbsoluteX = function() {
	var c = this.html;
	var d = c.offsetLeft;
	while ((c = c.offsetParent) !== null) {
		d += c.offsetLeft
	}
	return d
};
draw2d.Canvas.prototype.getScrollLeft = function() {
	return this.scrollArea.scrollLeft
};
draw2d.Canvas.prototype.getScrollTop = function() {
	return this.scrollArea.scrollTop
};
draw2d.Workflow = function(p) {
	try {
		if (!p) {
			return
		}
		this.menu = null;
		this.gridWidthX = 10;
		this.gridWidthY = 10;
		this.snapToGridHelper = null;
		this.verticalSnapToHelperLine = null;
		this.horizontalSnapToHelperLine = null;
		this.snapToGeometryHelper = null;
		this.figures = new draw2d.ArrayList();
		this.lines = new draw2d.ArrayList();
		this.commonPorts = new draw2d.ArrayList();
		this.dropTargets = new draw2d.ArrayList();
		this.compartments = new draw2d.ArrayList();
		this.selectionListeners = new draw2d.ArrayList();
		this.dialogs = new draw2d.ArrayList();
		this.toolPalette = null;
		this.dragging = false;
		this.tooltip = null;
		this.draggingLine = null;
		this.draggingLineCommand = null;
		this.commandStack = new draw2d.CommandStack();
		this.oldScrollPosLeft = 0;
		this.oldScrollPosTop = 0;
		this.currentSelection = null;
		this.currentMenu = null;
		this.connectionLine = new draw2d.Line();
		this.resizeHandleStart = new draw2d.LineStartResizeHandle(this);
		this.resizeHandleEnd = new draw2d.LineEndResizeHandle(this);
		this.resizeHandle1 = new draw2d.ResizeHandle(this, 1);
		this.resizeHandle2 = new draw2d.ResizeHandle(this, 2);
		this.resizeHandle3 = new draw2d.ResizeHandle(this, 3);
		this.resizeHandle4 = new draw2d.ResizeHandle(this, 4);
		this.resizeHandle5 = new draw2d.ResizeHandle(this, 5);
		this.resizeHandle6 = new draw2d.ResizeHandle(this, 6);
		this.resizeHandle7 = new draw2d.ResizeHandle(this, 7);
		this.resizeHandle8 = new draw2d.ResizeHandle(this, 8);
		this.resizeHandleHalfWidth = parseInt(this.resizeHandle2.getWidth() / 2);
		draw2d.Canvas.call(this, p);
		this.setPanning(false);
		if (this.html !== null) {
			this.html.style.backgroundImage = "url(grid_10.png)";
			this.html.className = "Workflow";
			m = this;
			this.html.tabIndex = "0";
			var k = function() {
				var d = arguments[0] || window.event;
				d.cancelBubble = true;
				d.returnValue = false;
				d.stopped = true;
				var i = d.clientX;
				var b = d.clientY;
				var a = m.getScrollLeft();
				var c = m.getScrollTop();
				var g = m.getAbsoluteX();
				var h = m.getAbsoluteY();
				var f = m.getBestLine(i + a - g, b + c - h, null);
				if (f !== null) {
					f.onContextMenu(i + a - g, b + c - h)
				} else {
					m.onContextMenu(i + a - g, b + c - h)
				}
			};
			this.html.oncontextmenu = function() {
				return false
			};
			var m = this;
			var n = function(b) {
				var a = b.ctrlKey;
				m.onKeyDown(b.keyCode, a)
			};
			var o = function() {
				var f = arguments[0] || window.event;
				if (f.returnValue == false) {
					return
				}
				var b = f.clientX;
				var c = f.clientY;
				var d = m.getScrollLeft();
				var g = m.getScrollTop();
				var h = m.getAbsoluteX();
				var a = m.getAbsoluteY();
				m.onMouseDown(b + d - h, c + g - a)
			};
			var r = function() {
				var f = arguments[0] || window.event;
				if (m.currentMenu !== null) {
					m.removeFigure(m.currentMenu);
					m.currentMenu = null
				}
				if (f.button == 2) {
					return
				}
				var b = f.clientX;
				var d = f.clientY;
				var g = m.getScrollLeft();
				var h = m.getScrollTop();
				var c = m.getAbsoluteX();
				var a = m.getAbsoluteY();
				m.onMouseUp(b + g - c, d + h - a)
			};
			var q = function() {
				var a = arguments[0] || window.event;
				var f = a.clientX;
				var h = a.clientY;
				var c = m.getScrollLeft();
				var d = m.getScrollTop();
				var g = m.getAbsoluteX();
				var i = m.getAbsoluteY();
				m.currentMouseX = f + c - g;
				m.currentMouseY = h + d - i;
				var j = m.getBestFigure(m.currentMouseX, m.currentMouseY);
				if (draw2d.Drag.currentHover !== null && j === null) {
					var b = new draw2d.DragDropEvent();
					b.initDragDropEvent("mouseleave", false, m);
					draw2d.Drag.currentHover.dispatchEvent(b)
				} else {
					var f = a.clientX;
					var h = a.clientY;
					var c = m.getScrollLeft();
					var d = m.getScrollTop();
					var g = m.getAbsoluteX();
					var i = m.getAbsoluteY();
					m.onMouseMove(f + c - g, h + d - i)
				}
				if (j === null) {
					draw2d.Drag.currentHover = null
				}
				if (m.tooltip !== null) {
					if (Math.abs(m.currentTooltipX - m.currentMouseX) > 10
							|| Math.abs(m.currentTooltipY - m.currentMouseY) > 10) {
						m.showTooltip(null)
					}
				}
			};
			var e = function(d) {
				var d = arguments[0] || window.event;
				var b = d.clientX;
				var c = d.clientY;
				var h = m.getScrollLeft();
				var g = m.getScrollTop();
				var i = m.getAbsoluteX();
				var a = m.getAbsoluteY();
				var f = m.getBestLine(b + h - i, c + g - a, null);
				if (f !== null) {
					f.onDoubleClick()
				}
			};
			if (this.html.addEventListener) {
				this.html.addEventListener("contextmenu", k, false);
				this.html.addEventListener("mousemove", q, false);
				this.html.addEventListener("mouseup", r, false);
				this.html.addEventListener("mousedown", o, false);
				this.html.addEventListener("keydown", n, false);
				this.html.addEventListener("dblclick", e, false)
			} else {
				if (this.html.attachEvent) {
					this.html.attachEvent("oncontextmenu", k);
					this.html.attachEvent("onmousemove", q);
					this.html.attachEvent("onmousedown", o);
					this.html.attachEvent("onmouseup", r);
					this.html.attachEvent("onkeydown", n);
					this.html.attachEvent("ondblclick", e)
				} else {
					throw "Open-jACOB Draw2D not supported in this browser."
				}
			}
		}
	} catch (l) {
		pushErrorStack(l, "draw2d.Workflow=function(/*:String*/id)")
	}
};
draw2d.Workflow.prototype = new draw2d.Canvas();
draw2d.Workflow.prototype.type = "draw2d.Workflow";
draw2d.Workflow.COLOR_GREEN = new draw2d.Color(0, 255, 0);
draw2d.Workflow.prototype.clear = function() {
	this.scrollTo(0, 0, true);
	this.gridWidthX = 10;
	this.gridWidthY = 10;
	this.snapToGridHelper = null;
	this.verticalSnapToHelperLine = null;
	this.horizontalSnapToHelperLine = null;
	var e = this.getDocument();
	var f = e.getLines().clone();
	for (var h = 0; h < f.getSize(); h++) {
		(new draw2d.CommandDelete(f.get(h))).execute()
	}
	var g = e.getFigures().clone();
	for (var h = 0; h < g.getSize(); h++) {
		(new draw2d.CommandDelete(g.get(h))).execute()
	}
	this.commonPorts.removeAllElements();
	this.dropTargets.removeAllElements();
	this.compartments.removeAllElements();
	this.selectionListeners.removeAllElements();
	this.dialogs.removeAllElements();
	this.commandStack = new draw2d.CommandStack();
	this.currentSelection = null;
	this.currentMenu = null;
	draw2d.Drag.clearCurrent()
};
draw2d.Workflow.prototype.onScroll = function() {
	var i = this.getScrollLeft();
	var k = this.getScrollTop();
	var g = i - this.oldScrollPosLeft;
	var h = k - this.oldScrollPosTop;
	for (var l = 0; l < this.figures.getSize(); l++) {
		var j = this.figures.get(l);
		if (j.hasFixedPosition && j.hasFixedPosition() == true) {
			j.setPosition(j.getX() + g, j.getY() + h)
		}
	}
	this.oldScrollPosLeft = i;
	this.oldScrollPosTop = k
};
draw2d.Workflow.prototype.setPanning = function(b) {
	this.panning = b;
	if (b) {
		this.html.style.cursor = "move"
	} else {
		this.html.style.cursor = "default"
	}
};
draw2d.Workflow.prototype.scrollTo = function(l, n, o) {
	if (o) {
		this.scrollArea.scrollLeft = l;
		this.scrollArea.scrollTop = n
	} else {
		var m = 40;
		var q = (l - this.getScrollLeft()) / m;
		var r = (n - this.getScrollTop()) / m;
		var i = this.getScrollLeft();
		var k = this.getScrollTop();
		for (var p = 0; p < m; p++) {
			this.scrollArea.scrollLeft = i + (q * p);
			this.scrollArea.scrollTop = k + (r * p)
		}
	}
};
draw2d.Workflow.prototype.showTooltip = function(f, g) {
	if (this.tooltip !== null) {
		this.removeFigure(this.tooltip);
		this.tooltip = null;
		if (this.tooltipTimer >= 0) {
			window.clearTimeout(this.tooltipTimer);
			this.tooltipTimer = -1
		}
	}
	this.tooltip = f;
	if (this.tooltip !== null) {
		this.currentTooltipX = this.currentMouseX;
		this.currentTooltipY = this.currentMouseY;
		this.addFigure(this.tooltip, this.currentTooltipX + 10,
				this.currentTooltipY + 10);
		var h = this;
		var e = function() {
			h.tooltipTimer = -1;
			h.showTooltip(null)
		};
		if (g == true) {
			this.tooltipTimer = window.setTimeout(e, 5000)
		}
	}
};
draw2d.Workflow.prototype.showDialog = function(e, f, d) {
	if (f) {
		this.addFigure(e, f, d)
	} else {
		this.addFigure(e, 200, 100)
	}
	this.dialogs.add(e)
};
draw2d.Workflow.prototype.showMenu = function(f, d, e) {
	if (this.menu !== null) {
		this.html.removeChild(this.menu.getHTMLElement());
		this.menu.setWorkflow()
	}
	this.menu = f;
	if (this.menu !== null) {
		this.menu.setWorkflow(this);
		this.menu.setPosition(d, e);
		this.html.appendChild(this.menu.getHTMLElement());
		this.menu.paint()
	}
};
draw2d.Workflow.prototype.onContextMenu = function(e, f) {
	var d = this.getContextMenu();
	if (d !== null) {
		this.showMenu(d, e, f)
	}
};
draw2d.Workflow.prototype.getContextMenu = function() {
	return null
};
draw2d.Workflow.prototype.setToolWindow = function(d, e, f) {
	this.toolPalette = d;
	if (f) {
		this.addFigure(d, e, f)
	} else {
		this.addFigure(d, 20, 20)
	}
	this.dialogs.add(d)
};
draw2d.Workflow.prototype.setSnapToGrid = function(b) {
	if (b) {
		this.snapToGridHelper = new draw2d.SnapToGrid(this)
	} else {
		this.snapToGridHelper = null
	}
};
draw2d.Workflow.prototype.setSnapToGeometry = function(b) {
	if (b) {
		this.snapToGeometryHelper = new draw2d.SnapToGeometry(this)
	} else {
		this.snapToGeometryHelper = null
	}
};
draw2d.Workflow.prototype.setGridWidth = function(c, d) {
	this.gridWidthX = c;
	this.gridWidthY = d
};
draw2d.Workflow.prototype.addFigure = function(e, h, j) {
	try {
		draw2d.Canvas.prototype.addFigure.call(this, e, h, j, true);
		e.setWorkflow(this);
		var g = this;
		if (e instanceof draw2d.CompartmentFigure) {
			this.compartments.add(e)
		}
		if (e instanceof draw2d.Line) {
			this.lines.add(e)
		} else {
			this.figures.add(e);
			e.draggable.addEventListener("drag", function(a) {
				var b = g.getFigure(a.target.element.id);
				if (b === null) {
					return
				}
				if (b.isSelectable() == false) {
					return
				}
				g.moveResizeHandles(b)
			})
		}
		e.paint();
		this.setDocumentDirty()
	} catch (i) {
		pushErrorStack(
				i,
				"draw2d.Workflow.prototype.addFigure=function(/*:draw2d.Figure*/ figure ,/*:int*/ xPos, /*:int*/ yPos)")
	}
};
draw2d.Workflow.prototype.removeFigure = function(b) {
	draw2d.Canvas.prototype.removeFigure.call(this, b);
	this.figures.remove(b);
	this.lines.remove(b);
	this.dialogs.remove(b);
	b.setWorkflow(null);
	if (b instanceof draw2d.CompartmentFigure) {
		this.compartments.remove(b)
	}
	if (b instanceof draw2d.Connection) {
		b.disconnect()
	}
	if (this.currentSelection == b) {
		this.setCurrentSelection(null)
	}
	this.setDocumentDirty();
	b.onRemove(this)
};
draw2d.Workflow.prototype.moveFront = function(b) {
	this.html.removeChild(b.getHTMLElement());
	this.html.appendChild(b.getHTMLElement())
};
draw2d.Workflow.prototype.moveBack = function(b) {
	this.html.removeChild(b.getHTMLElement());
	this.html.insertBefore(b.getHTMLElement(), this.html.firstChild)
};
draw2d.Workflow.prototype.getBestCompartmentFigure = function(h, i, k) {
	var l = null;
	for (var g = 0; g < this.figures.getSize(); g++) {
		var j = this.figures.get(g);
		if ((j instanceof draw2d.CompartmentFigure) && j.isOver(h, i) == true
				&& j != k) {
			if (l === null) {
				l = j
			} else {
				if (l.getZOrder() < j.getZOrder()) {
					l = j
				}
			}
		}
	}
	return l
};
draw2d.Workflow.prototype.getBestFigure = function(h, i, j) {
	var l = null;
	for (var k = 0; k < this.figures.getSize(); k++) {
		var g = this.figures.get(k);
		if (g.isOver(h, i) == true && g != j) {
			if (l === null) {
				l = g
			} else {
				if (l.getZOrder() < g.getZOrder()) {
					l = g
				}
			}
		}
	}
	return l
};
draw2d.Workflow.prototype.getBestLine = function(h, j, i) {
	var k = null;
	var l = this.lines.getSize();
	for (var m = 0; m < l; m++) {
		var n = this.lines.get(m);
		if (n.containsPoint(h, j) == true && n != i) {
			if (k === null) {
				k = n
			} else {
				if (k.getZOrder() < n.getZOrder()) {
					k = n
				}
			}
		}
	}
	return k
};
draw2d.Workflow.prototype.getFigure = function(f) {
	for (var e = 0; e < this.figures.getSize(); e++) {
		var d = this.figures.get(e);
		if (d.id == f) {
			return d
		}
	}
	return null
};
draw2d.Workflow.prototype.getFigures = function() {
	return this.figures
};
draw2d.Workflow.prototype.getDocument = function() {
	return new draw2d.CanvasDocument(this)
};
draw2d.Workflow.prototype.addSelectionListener = function(b) {
	if (b !== null) {
		if (b.onSelectionChanged) {
			this.selectionListeners.add(b)
		} else {
			throw "Object doesn't implement required callback method [onSelectionChanged]"
		}
	}
};
draw2d.Workflow.prototype.removeSelectionListener = function(b) {
	this.selectionListeners.remove(b)
};
draw2d.Workflow.prototype.setCurrentSelection = function(f) {
	if (f === null || this.currentSelection != f) {
		this.hideResizeHandles();
		this.hideLineResizeHandles()
	}
	this.currentSelection = f;
	for (var d = 0; d < this.selectionListeners.getSize(); d++) {
		var e = this.selectionListeners.get(d);
		if (e.onSelectionChanged) {
			e.onSelectionChanged(this.currentSelection,
					this.currentSelection ? this.currentSelection.getModel()
							: null)
		}
	}
	if (f instanceof draw2d.Line) {
		this.showLineResizeHandles(f);
		if (!(f instanceof draw2d.Connection)) {
			this.draggingLineCommand = line
					.createCommand(new draw2d.EditPolicy(draw2d.EditPolicy.MOVE));
			if (this.draggingLineCommand !== null) {
				this.draggingLine = f
			}
		}
	}
};
draw2d.Workflow.prototype.getCurrentSelection = function() {
	return this.currentSelection
};
draw2d.Workflow.prototype.getLine = function(g) {
	var h = this.lines.getSize();
	for (var e = 0; e < h; e++) {
		var f = this.lines.get(e);
		if (f.getId() == g) {
			return f
		}
	}
	return null
};
draw2d.Workflow.prototype.getLines = function() {
	return this.lines
};
draw2d.Workflow.prototype.registerPort = function(b) {
	b.draggable.targets = this.dropTargets;
	this.commonPorts.add(b);
	this.dropTargets.add(b.dropable)
};
draw2d.Workflow.prototype.unregisterPort = function(b) {
	b.draggable.targets = null;
	this.commonPorts.remove(b);
	this.dropTargets.remove(b.dropable)
};
draw2d.Workflow.prototype.getCommandStack = function() {
	return this.commandStack
};
draw2d.Workflow.prototype.showConnectionLine = function(e, g, f, h) {
	this.connectionLine.setStartPoint(e, g);
	this.connectionLine.setEndPoint(f, h);
	if (this.connectionLine.canvas === null) {
		draw2d.Canvas.prototype.addFigure.call(this, this.connectionLine)
	}
};
draw2d.Workflow.prototype.hideConnectionLine = function() {
	if (this.connectionLine.canvas !== null) {
		draw2d.Canvas.prototype.removeFigure.call(this, this.connectionLine)
	}
};
draw2d.Workflow.prototype.showLineResizeHandles = function(f) {
	var g = this.resizeHandleStart.getWidth() / 2;
	var h = this.resizeHandleStart.getHeight() / 2;
	var i = f.getStartPoint();
	var j = f.getEndPoint();
	draw2d.Canvas.prototype.addFigure.call(this, this.resizeHandleStart, i.x
			- g, i.y - g);
	draw2d.Canvas.prototype.addFigure.call(this, this.resizeHandleEnd, j.x - g,
			j.y - g);
	this.resizeHandleStart.setCanDrag(f.isResizeable());
	this.resizeHandleEnd.setCanDrag(f.isResizeable());
	if (f.isResizeable()) {
		this.resizeHandleStart.setBackgroundColor(draw2d.Workflow.COLOR_GREEN);
		this.resizeHandleEnd.setBackgroundColor(draw2d.Workflow.COLOR_GREEN);
		this.resizeHandleStart.draggable.targets = this.dropTargets;
		this.resizeHandleEnd.draggable.targets = this.dropTargets
	} else {
		this.resizeHandleStart.setBackgroundColor(null);
		this.resizeHandleEnd.setBackgroundColor(null)
	}
};
draw2d.Workflow.prototype.hideLineResizeHandles = function() {
	if (this.resizeHandleStart.canvas !== null) {
		draw2d.Canvas.prototype.removeFigure.call(this, this.resizeHandleStart)
	}
	if (this.resizeHandleEnd.canvas !== null) {
		draw2d.Canvas.prototype.removeFigure.call(this, this.resizeHandleEnd)
	}
};
draw2d.Workflow.prototype.showResizeHandles = function(m) {
	this.hideLineResizeHandles();
	this.hideResizeHandles();
	if (this.getEnableSmoothFigureHandling() == true
			&& this.getCurrentSelection() != m) {
		this.resizeHandle1.setAlpha(0.01);
		this.resizeHandle2.setAlpha(0.01);
		this.resizeHandle3.setAlpha(0.01);
		this.resizeHandle4.setAlpha(0.01);
		this.resizeHandle5.setAlpha(0.01);
		this.resizeHandle6.setAlpha(0.01);
		this.resizeHandle7.setAlpha(0.01);
		this.resizeHandle8.setAlpha(0.01)
	}
	var l = this.resizeHandle1.getWidth();
	var n = this.resizeHandle1.getHeight();
	var p = m.getHeight();
	var j = m.getWidth();
	var k = m.getX();
	var i = m.getY();
	draw2d.Canvas.prototype.addFigure.call(this, this.resizeHandle1, k - l, i
			- n);
	draw2d.Canvas.prototype.addFigure.call(this, this.resizeHandle3, k + j, i
			- n);
	draw2d.Canvas.prototype.addFigure.call(this, this.resizeHandle5, k + j, i
			+ p);
	draw2d.Canvas.prototype.addFigure.call(this, this.resizeHandle7, k - l, i
			+ p);
	this.moveFront(this.resizeHandle1);
	this.moveFront(this.resizeHandle3);
	this.moveFront(this.resizeHandle5);
	this.moveFront(this.resizeHandle7);
	this.resizeHandle1.setCanDrag(m.isResizeable());
	this.resizeHandle3.setCanDrag(m.isResizeable());
	this.resizeHandle5.setCanDrag(m.isResizeable());
	this.resizeHandle7.setCanDrag(m.isResizeable());
	if (m.isResizeable()) {
		var o = new draw2d.Color(0, 255, 0);
		this.resizeHandle1.setBackgroundColor(o);
		this.resizeHandle3.setBackgroundColor(o);
		this.resizeHandle5.setBackgroundColor(o);
		this.resizeHandle7.setBackgroundColor(o)
	} else {
		this.resizeHandle1.setBackgroundColor(null);
		this.resizeHandle3.setBackgroundColor(null);
		this.resizeHandle5.setBackgroundColor(null);
		this.resizeHandle7.setBackgroundColor(null)
	}
	if (m.isStrechable() && m.isResizeable()) {
		this.resizeHandle2.setCanDrag(m.isResizeable());
		this.resizeHandle4.setCanDrag(m.isResizeable());
		this.resizeHandle6.setCanDrag(m.isResizeable());
		this.resizeHandle8.setCanDrag(m.isResizeable());
		draw2d.Canvas.prototype.addFigure.call(this, this.resizeHandle2, k
				+ (j / 2) - this.resizeHandleHalfWidth, i - n);
		draw2d.Canvas.prototype.addFigure.call(this, this.resizeHandle4, k + j,
				i + (p / 2) - (n / 2));
		draw2d.Canvas.prototype.addFigure.call(this, this.resizeHandle6, k
				+ (j / 2) - this.resizeHandleHalfWidth, i + p);
		draw2d.Canvas.prototype.addFigure.call(this, this.resizeHandle8, k - l,
				i + (p / 2) - (n / 2));
		this.moveFront(this.resizeHandle2);
		this.moveFront(this.resizeHandle4);
		this.moveFront(this.resizeHandle6);
		this.moveFront(this.resizeHandle8)
	}
};
draw2d.Workflow.prototype.hideResizeHandles = function() {
	if (this.resizeHandle1.canvas !== null) {
		draw2d.Canvas.prototype.removeFigure.call(this, this.resizeHandle1)
	}
	if (this.resizeHandle2.canvas !== null) {
		draw2d.Canvas.prototype.removeFigure.call(this, this.resizeHandle2)
	}
	if (this.resizeHandle3.canvas !== null) {
		draw2d.Canvas.prototype.removeFigure.call(this, this.resizeHandle3)
	}
	if (this.resizeHandle4.canvas !== null) {
		draw2d.Canvas.prototype.removeFigure.call(this, this.resizeHandle4)
	}
	if (this.resizeHandle5.canvas !== null) {
		draw2d.Canvas.prototype.removeFigure.call(this, this.resizeHandle5)
	}
	if (this.resizeHandle6.canvas !== null) {
		draw2d.Canvas.prototype.removeFigure.call(this, this.resizeHandle6)
	}
	if (this.resizeHandle7.canvas !== null) {
		draw2d.Canvas.prototype.removeFigure.call(this, this.resizeHandle7)
	}
	if (this.resizeHandle8.canvas !== null) {
		draw2d.Canvas.prototype.removeFigure.call(this, this.resizeHandle8)
	}
};
draw2d.Workflow.prototype.moveResizeHandles = function(h) {
	var i = this.resizeHandle1.getWidth();
	var j = this.resizeHandle1.getHeight();
	var m = h.getHeight();
	var n = h.getWidth();
	var k = h.getX();
	var l = h.getY();
	this.resizeHandle1.setPosition(k - i, l - j);
	this.resizeHandle3.setPosition(k + n, l - j);
	this.resizeHandle5.setPosition(k + n, l + m);
	this.resizeHandle7.setPosition(k - i, l + m);
	if (h.isStrechable()) {
		this.resizeHandle2.setPosition(
				k + (n / 2) - this.resizeHandleHalfWidth, l - j);
		this.resizeHandle4.setPosition(k + n, l + (m / 2) - (j / 2));
		this.resizeHandle6.setPosition(
				k + (n / 2) - this.resizeHandleHalfWidth, l + m);
		this.resizeHandle8.setPosition(k - i, l + (m / 2) - (j / 2))
	}
};
draw2d.Workflow.prototype.onMouseDown = function(e, f) {
	this.dragging = true;
	this.mouseDownPosX = e;
	this.mouseDownPosY = f;
	if (this.toolPalette !== null && this.toolPalette.getActiveTool() !== null) {
		this.toolPalette.getActiveTool().execute(e, f)
	}
	this.showMenu(null);
	var d = this.getBestLine(e, f);
	if (d !== null && d.isSelectable()) {
		this.setCurrentSelection(d)
	} else {
		this.setCurrentSelection(null)
	}
};
draw2d.Workflow.prototype.onMouseUp = function(d, c) {
	this.dragging = false;
	if (this.draggingLineCommand !== null) {
		this.getCommandStack().execute(this.draggingLineCommand);
		this.draggingLine = null;
		this.draggingLineCommand = null
	}
};
draw2d.Workflow.prototype.onMouseMove = function(f, g) {
	if (this.dragging === true && this.draggingLine !== null) {
		var h = f - this.mouseDownPosX;
		var e = g - this.mouseDownPosY;
		this.draggingLine.startX = this.draggingLine.getStartX() + h;
		this.draggingLine.startY = this.draggingLine.getStartY() + e;
		this.draggingLine.setEndPoint(this.draggingLine.getEndX() + h,
				this.draggingLine.getEndY() + e);
		this.mouseDownPosX = f;
		this.mouseDownPosY = g;
		this.showLineResizeHandles(this.currentSelection)
	} else {
		if (this.dragging === true && this.panning === true) {
			var h = f - this.mouseDownPosX;
			var e = g - this.mouseDownPosY;
			this.scrollTo(this.getScrollLeft() - h, this.getScrollTop() - e,
					true);
			this.onScroll()
		}
	}
};
draw2d.Workflow.prototype.onKeyDown = function(d, c) {
	if (d == 46 && this.currentSelection !== null) {
		this.commandStack
				.execute(this.currentSelection
						.createCommand(new draw2d.EditPolicy(
								draw2d.EditPolicy.DELETE)))
	} else {
		if (d == 90 && c) {
			this.commandStack.undo()
		} else {
			if (d == 89 && c) {
				this.commandStack.redo()
			}
		}
	}
};
draw2d.Workflow.prototype.setDocumentDirty = function() {
	try {
		for (var e = 0; e < this.dialogs.getSize(); e++) {
			var f = this.dialogs.get(e);
			if (f !== null && f.onSetDocumentDirty) {
				f.onSetDocumentDirty()
			}
		}
		if (this.snapToGeometryHelper !== null) {
			this.snapToGeometryHelper.onSetDocumentDirty()
		}
		if (this.snapToGridHelper !== null) {
			this.snapToGridHelper.onSetDocumentDirty()
		}
	} catch (d) {
		pushErrorStack(d,
				"draw2d.Workflow.prototype.setDocumentDirty=function()")
	}
};
draw2d.Workflow.prototype.snapToHelper = function(k, j) {
	if (this.snapToGeometryHelper !== null) {
		if (k instanceof draw2d.ResizeHandle) {
			var l = k.getSnapToGridAnchor();
			j.x += l.x;
			j.y += l.y;
			var m = new draw2d.Point(j.x, j.y);
			var h = k.getSnapToDirection();
			var n = this.snapToGeometryHelper.snapPoint(h, j, m);
			if ((h & draw2d.SnapToHelper.EAST_WEST)
					&& !(n & draw2d.SnapToHelper.EAST_WEST)) {
				this.showSnapToHelperLineVertical(m.x)
			} else {
				this.hideSnapToHelperLineVertical()
			}
			if ((h & draw2d.SnapToHelper.NORTH_SOUTH)
					&& !(n & draw2d.SnapToHelper.NORTH_SOUTH)) {
				this.showSnapToHelperLineHorizontal(m.y)
			} else {
				this.hideSnapToHelperLineHorizontal()
			}
			m.x -= l.x;
			m.y -= l.y;
			return m
		} else {
			var i = new draw2d.Dimension(j.x, j.y, k.getWidth(), k.getHeight());
			var m = new draw2d.Dimension(j.x, j.y, k.getWidth(), k.getHeight());
			var h = draw2d.SnapToHelper.NSEW;
			var n = this.snapToGeometryHelper.snapRectangle(i, m);
			if ((h & draw2d.SnapToHelper.WEST)
					&& !(n & draw2d.SnapToHelper.WEST)) {
				this.showSnapToHelperLineVertical(m.x)
			} else {
				if ((h & draw2d.SnapToHelper.EAST)
						&& !(n & draw2d.SnapToHelper.EAST)) {
					this.showSnapToHelperLineVertical(m.getX() + m.getWidth())
				} else {
					this.hideSnapToHelperLineVertical()
				}
			}
			if ((h & draw2d.SnapToHelper.NORTH)
					&& !(n & draw2d.SnapToHelper.NORTH)) {
				this.showSnapToHelperLineHorizontal(m.y)
			} else {
				if ((h & draw2d.SnapToHelper.SOUTH)
						&& !(n & draw2d.SnapToHelper.SOUTH)) {
					this.showSnapToHelperLineHorizontal(m.getY()
							+ m.getHeight())
				} else {
					this.hideSnapToHelperLineHorizontal()
				}
			}
			return m.getTopLeft()
		}
	} else {
		if (this.snapToGridHelper !== null) {
			var l = k.getSnapToGridAnchor();
			j.x = j.x + l.x;
			j.y = j.y + l.y;
			var m = new draw2d.Point(j.x, j.y);
			this.snapToGridHelper.snapPoint(0, j, m);
			m.x = m.x - l.x;
			m.y = m.y - l.y;
			return m
		}
	}
	return j
};
draw2d.Workflow.prototype.showSnapToHelperLineHorizontal = function(b) {
	if (this.horizontalSnapToHelperLine === null) {
		this.horizontalSnapToHelperLine = new draw2d.Line();
		this.horizontalSnapToHelperLine
				.setColor(new draw2d.Color(175, 175, 255));
		this.addFigure(this.horizontalSnapToHelperLine)
	}
	this.horizontalSnapToHelperLine.setStartPoint(0, b);
	this.horizontalSnapToHelperLine.setEndPoint(this.getWidth(), b)
};
draw2d.Workflow.prototype.showSnapToHelperLineVertical = function(b) {
	if (this.verticalSnapToHelperLine === null) {
		this.verticalSnapToHelperLine = new draw2d.Line();
		this.verticalSnapToHelperLine.setColor(new draw2d.Color(175, 175, 255));
		this.addFigure(this.verticalSnapToHelperLine)
	}
	this.verticalSnapToHelperLine.setStartPoint(b, 0);
	this.verticalSnapToHelperLine.setEndPoint(b, this.getHeight())
};
draw2d.Workflow.prototype.hideSnapToHelperLines = function() {
	this.hideSnapToHelperLineHorizontal();
	this.hideSnapToHelperLineVertical()
};
draw2d.Workflow.prototype.hideSnapToHelperLineHorizontal = function() {
	if (this.horizontalSnapToHelperLine !== null) {
		this.removeFigure(this.horizontalSnapToHelperLine);
		this.horizontalSnapToHelperLine = null
	}
};
draw2d.Workflow.prototype.hideSnapToHelperLineVertical = function() {
	if (this.verticalSnapToHelperLine !== null) {
		this.removeFigure(this.verticalSnapToHelperLine);
		this.verticalSnapToHelperLine = null
	}
};
draw2d.WindowFigure = function(b) {
	this.title = b;
	this.titlebar = null;
	draw2d.Figure.call(this);
	this.setDeleteable(false);
	this.setCanSnapToHelper(false);
	this.setZOrder(draw2d.WindowFigure.ZOrderIndex)
};
draw2d.WindowFigure.prototype = new draw2d.Figure();
draw2d.WindowFigure.prototype.type = ":draw2d.WindowFigure";
draw2d.WindowFigure.ZOrderIndex = 50000;
draw2d.WindowFigure.setZOrderBaseIndex = function(b) {
	draw2d.WindowFigure.ZOrderBaseIndex = b
};
draw2d.WindowFigure.prototype.hasFixedPosition = function() {
	return true
};
draw2d.WindowFigure.prototype.hasTitleBar = function() {
	return true
};
draw2d.WindowFigure.prototype.createHTMLElement = function() {
	var b = draw2d.Figure.prototype.createHTMLElement.call(this);
	b.style.margin = "0px";
	b.style.padding = "0px";
	b.style.border = "1px solid black";
	b.style.backgroundImage = "url(window_bg.png)";
	b.style.zIndex = draw2d.WindowFigure.ZOrderIndex;
	b.style.cursor = null;
	b.className = "WindowFigure";
	if (this.hasTitleBar()) {
		this.titlebar = document.createElement("div");
		this.titlebar.style.position = "absolute";
		this.titlebar.style.left = "0px";
		this.titlebar.style.top = "0px";
		this.titlebar.style.width = this.getWidth() + "px";
		this.titlebar.style.height = "15px";
		this.titlebar.style.margin = "0px";
		this.titlebar.style.padding = "0px";
		this.titlebar.style.font = "normal 10px verdana";
		this.titlebar.style.backgroundColor = "blue";
		this.titlebar.style.borderBottom = "2px solid gray";
		this.titlebar.style.whiteSpace = "nowrap";
		this.titlebar.style.textAlign = "center";
		this.titlebar.style.backgroundImage = "url(window_toolbar.png)";
		this.titlebar.className = "WindowFigure_titlebar";
		this.textNode = document.createTextNode(this.title);
		this.titlebar.appendChild(this.textNode);
		this.disableTextSelection(this.titlebar);
		b.appendChild(this.titlebar)
	}
	return b
};
draw2d.WindowFigure.prototype.setDocumentDirty = function(b) {
};
draw2d.WindowFigure.prototype.onDragend = function() {
};
draw2d.WindowFigure.prototype.onDragstart = function(d, c) {
	if (this.titlebar === null) {
		return false
	}
	if (this.canDrag === true && d < parseInt(this.titlebar.style.width)
			&& c < parseInt(this.titlebar.style.height)) {
		return true
	}
	return false
};
draw2d.WindowFigure.prototype.isSelectable = function() {
	return false
};
draw2d.WindowFigure.prototype.setCanDrag = function(b) {
	draw2d.Figure.prototype.setCanDrag.call(this, b);
	this.html.style.cursor = "";
	if (this.titlebar === null) {
		return
	}
	if (b) {
		this.titlebar.style.cursor = "move"
	} else {
		this.titlebar.style.cursor = ""
	}
};
draw2d.WindowFigure.prototype.setWorkflow = function(c) {
	var d = this.workflow;
	draw2d.Figure.prototype.setWorkflow.call(this, c);
	if (d !== null) {
		d.removeSelectionListener(this)
	}
	if (this.workflow !== null) {
		this.workflow.addSelectionListener(this)
	}
};
draw2d.WindowFigure.prototype.setDimension = function(d, c) {
	draw2d.Figure.prototype.setDimension.call(this, d, c);
	if (this.titlebar !== null) {
		this.titlebar.style.width = this.getWidth() + "px"
	}
};
draw2d.WindowFigure.prototype.setTitle = function(b) {
	this.title = b
};
draw2d.WindowFigure.prototype.getMinWidth = function() {
	return 50
};
draw2d.WindowFigure.prototype.getMinHeight = function() {
	return 50
};
draw2d.WindowFigure.prototype.isResizeable = function() {
	return false
};
draw2d.WindowFigure.prototype.setAlpha = function(b) {
};
draw2d.WindowFigure.prototype.setBackgroundColor = function(b) {
	this.bgColor = b;
	if (this.bgColor !== null) {
		this.html.style.backgroundColor = this.bgColor.getHTMLStyle()
	} else {
		this.html.style.backgroundColor = "transparent";
		this.html.style.backgroundImage = ""
	}
};
draw2d.WindowFigure.prototype.setColor = function(b) {
	this.lineColor = b;
	if (this.lineColor !== null) {
		this.html.style.border = this.lineStroke + "px solid "
				+ this.lineColor.getHTMLStyle()
	} else {
		this.html.style.border = "0px"
	}
};
draw2d.WindowFigure.prototype.setLineWidth = function(b) {
	this.lineStroke = b;
	this.html.style.border = this.lineStroke + "px solid black"
};
draw2d.WindowFigure.prototype.onSelectionChanged = function(c, d) {
};
draw2d.Button = function(f, e, d) {
	this.x = 0;
	this.y = 0;
	this.width = 24;
	this.height = 24;
	this.id = draw2d.UUID.create();
	this.enabled = true;
	this.active = false;
	this.palette = f;
	this.html = this.createHTMLElement();
	if (e !== undefined && d !== undefined) {
		this.setDimension(e, d)
	} else {
		this.setDimension(24, 24)
	}
};
draw2d.Button.prototype.type = "draw2d.Button";
draw2d.Button.prototype.dispose = function() {
};
draw2d.Button.prototype.getImageUrl = function() {
	return this.type + ".png"
};
draw2d.Button.prototype.createHTMLElement = function() {
	var c = document.createElement("div");
	c.id = this.id;
	c.style.position = "absolute";
	c.style.left = this.x + "px";
	c.style.top = this.y + "px";
	c.style.height = this.width + "px";
	c.style.width = this.height + "px";
	c.style.margin = "0px";
	c.style.padding = "0px";
	c.style.outline = "none";
	if (this.getImageUrl() !== null) {
		c.style.backgroundImage = "url(" + this.getImageUrl() + ")"
	} else {
		c.style.backgroundImage = ""
	}
	var d = this;
	this.omousedown = function(a) {
		if (d.enabled) {
			d.setActive(true)
		}
		a.cancelBubble = true;
		a.returnValue = false
	};
	this.omouseup = function(a) {
		if (d.enabled) {
			d.setActive(false);
			d.execute();
			d.palette.setActiveTool(null)
		}
		a.cancelBubble = true;
		a.returnValue = false
	};
	if (c.addEventListener) {
		c.addEventListener("mousedown", this.omousedown, false);
		c.addEventListener("mouseup", this.omouseup, false)
	} else {
		if (c.attachEvent) {
			c.attachEvent("onmousedown", this.omousedown);
			c.attachEvent("onmouseup", this.omouseup)
		}
	}
	return c
};
draw2d.Button.prototype.getHTMLElement = function() {
	if (this.html === null) {
		this.html = this.createHTMLElement()
	}
	return this.html
};
draw2d.Button.prototype.execute = function() {
};
draw2d.Button.prototype.setTooltip = function(b) {
	this.tooltip = b;
	if (this.tooltip !== null) {
		this.html.title = this.tooltip
	} else {
		this.html.title = ""
	}
};
draw2d.Button.prototype.getWorkflow = function() {
	return this.getToolPalette().getWorkflow()
};
draw2d.Button.prototype.getToolPalette = function() {
	return this.palette
};
draw2d.Button.prototype.setActive = function(b) {
	if (!this.enabled) {
		return
	}
	this.active = b;
	if (b === true) {
		this.html.style.border = "1px inset"
	} else {
		this.html.style.border = "0px"
	}
};
draw2d.Button.prototype.isActive = function() {
	return this.active
};
draw2d.Button.prototype.setEnabled = function(b) {
	this.enabled = b;
	if (b) {
		this.html.style.filter = "alpha(opacity=100)";
		this.html.style.opacity = "1.0"
	} else {
		this.html.style.filter = "alpha(opacity=30)";
		this.html.style.opacity = "0.3"
	}
};
draw2d.Button.prototype.setDimension = function(d, c) {
	this.width = d;
	this.height = c;
	if (this.html === null) {
		return
	}
	this.html.style.width = this.width + "px";
	this.html.style.height = this.height + "px"
};
draw2d.Button.prototype.setPosition = function(c, d) {
	this.x = Math.max(0, c);
	this.y = Math.max(0, d);
	if (this.html === null) {
		return
	}
	this.html.style.left = this.x + "px";
	this.html.style.top = this.y + "px"
};
draw2d.Button.prototype.getWidth = function() {
	return this.width
};
draw2d.Button.prototype.getHeight = function() {
	return this.height
};
draw2d.Button.prototype.getY = function() {
	return this.y
};
draw2d.Button.prototype.getX = function() {
	return this.x
};
draw2d.Button.prototype.getPosition = function() {
	return new draw2d.Point(this.x, this.y)
};
draw2d.ToggleButton = function(b) {
	draw2d.Button.call(this, b);
	this.isDownFlag = false
};
draw2d.ToggleButton.prototype = new draw2d.Button();
draw2d.ToggleButton.prototype.type = "draw2d.ToggleButton";
draw2d.ToggleButton.prototype.createHTMLElement = function() {
	var c = document.createElement("div");
	c.id = this.id;
	c.style.position = "absolute";
	c.style.left = this.x + "px";
	c.style.top = this.y + "px";
	c.style.height = "24px";
	c.style.width = "24px";
	c.style.margin = "0px";
	c.style.padding = "0px";
	if (this.getImageUrl() !== null) {
		c.style.backgroundImage = "url(" + this.getImageUrl() + ")"
	} else {
		c.style.backgroundImage = ""
	}
	var d = this;
	this.omousedown = function(a) {
		if (d.enabled) {
			if (!d.isDown()) {
				draw2d.Button.prototype.setActive.call(d, true)
			}
		}
		a.cancelBubble = true;
		a.returnValue = false
	};
	this.omouseup = function(a) {
		if (d.enabled) {
			if (d.isDown()) {
				draw2d.Button.prototype.setActive.call(d, false)
			}
			d.isDownFlag = !d.isDownFlag;
			d.execute()
		}
		a.cancelBubble = true;
		a.returnValue = false
	};
	if (c.addEventListener) {
		c.addEventListener("mousedown", this.omousedown, false);
		c.addEventListener("mouseup", this.omouseup, false)
	} else {
		if (c.attachEvent) {
			c.attachEvent("onmousedown", this.omousedown);
			c.attachEvent("onmouseup", this.omouseup)
		}
	}
	return c
};
draw2d.ToggleButton.prototype.isDown = function() {
	return this.isDownFlag
};
draw2d.ToggleButton.prototype.setActive = function(b) {
	draw2d.Button.prototype.setActive.call(this, b);
	this.isDownFlag = b
};
draw2d.ToggleButton.prototype.execute = function() {
};
draw2d.ToolGeneric = function(b) {
	this.x = 0;
	this.y = 0;
	this.enabled = true;
	this.tooltip = null;
	this.palette = b;
	this.html = this.createHTMLElement();
	this.setDimension(10, 10)
};
draw2d.ToolGeneric.prototype.type = "draw2d.ToolGeneric";
draw2d.ToolGeneric.prototype.dispose = function() {
};
draw2d.ToolGeneric.prototype.getImageUrl = function() {
	return this.type + ".png"
};
draw2d.ToolGeneric.prototype.getWorkflow = function() {
	return this.getToolPalette().getWorkflow()
};
draw2d.ToolGeneric.prototype.getToolPalette = function() {
	return this.palette
};
draw2d.ToolGeneric.prototype.createHTMLElement = function() {
	var c = document.createElement("div");
	c.id = this.id;
	c.style.position = "absolute";
	c.style.left = this.x + "px";
	c.style.top = this.y + "px";
	c.style.height = "24px";
	c.style.width = "24px";
	c.style.margin = "0px";
	c.style.padding = "0px";
	if (this.getImageUrl() !== null) {
		c.style.backgroundImage = "url(" + this.getImageUrl() + ")"
	} else {
		c.style.backgroundImage = ""
	}
	var d = this;
	this.click = function(a) {
		if (d.enabled) {
			d.palette.setActiveTool(d)
		}
		a.cancelBubble = true;
		a.returnValue = false
	};
	if (c.addEventListener) {
		c.addEventListener("click", this.click, false)
	} else {
		if (c.attachEvent) {
			c.attachEvent("onclick", this.click)
		}
	}
	if (this.tooltip !== null) {
		c.title = this.tooltip
	} else {
		c.title = ""
	}
	return c
};
draw2d.ToolGeneric.prototype.getHTMLElement = function() {
	if (this.html === null) {
		this.html = this.createHTMLElement()
	}
	return this.html
};
draw2d.ToolGeneric.prototype.execute = function(d, c) {
	if (this.enabled) {
		this.palette.setActiveTool(null)
	}
};
draw2d.ToolGeneric.prototype.setTooltip = function(b) {
	this.tooltip = b;
	if (this.tooltip !== null) {
		this.html.title = this.tooltip
	} else {
		this.html.title = ""
	}
};
draw2d.ToolGeneric.prototype.setActive = function(b) {
	if (!this.enabled) {
		return
	}
	if (b === true) {
		this.html.style.border = "1px inset"
	} else {
		this.html.style.border = "0px"
	}
};
draw2d.ToolGeneric.prototype.setEnabled = function(b) {
	this.enabled = b;
	if (b) {
		this.html.style.filter = "alpha(opacity=100)";
		this.html.style.opacity = "1.0"
	} else {
		this.html.style.filter = "alpha(opacity=30)";
		this.html.style.opacity = "0.3"
	}
};
draw2d.ToolGeneric.prototype.setDimension = function(d, c) {
	this.width = d;
	this.height = c;
	if (this.html === null) {
		return
	}
	this.html.style.width = this.width + "px";
	this.html.style.height = this.height + "px"
};
draw2d.ToolGeneric.prototype.setPosition = function(c, d) {
	this.x = Math.max(0, c);
	this.y = Math.max(0, d);
	if (this.html === null) {
		return
	}
	this.html.style.left = this.x + "px";
	this.html.style.top = this.y + "px"
};
draw2d.ToolGeneric.prototype.getWidth = function() {
	return this.width
};
draw2d.ToolGeneric.prototype.getHeight = function() {
	return this.height
};
draw2d.ToolGeneric.prototype.getY = function() {
	return this.y
};
draw2d.ToolGeneric.prototype.getX = function() {
	return this.x
};
draw2d.ToolGeneric.prototype.getPosition = function() {
	return new draw2d.Point(this.x, this.y)
};
draw2d.ToolPalette = function(b) {
	draw2d.WindowFigure.call(this, b);
	this.setDimension(75, 400);
	this.activeTool = null;
	this.children = {}
};
draw2d.ToolPalette.prototype = new draw2d.WindowFigure();
draw2d.ToolPalette.prototype.type = "draw2d.ToolPalette";
draw2d.ToolPalette.prototype.dispose = function() {
	draw2d.WindowFigure.prototype.dispose.call(this)
};
draw2d.ToolPalette.prototype.createHTMLElement = function() {
	var b = draw2d.WindowFigure.prototype.createHTMLElement.call(this);
	this.scrollarea = document.createElement("div");
	this.scrollarea.style.position = "absolute";
	this.scrollarea.style.left = "0px";
	if (this.hasTitleBar()) {
		this.scrollarea.style.top = "15px"
	} else {
		this.scrollarea.style.top = "0px"
	}
	this.scrollarea.style.width = this.getWidth() + "px";
	this.scrollarea.style.height = "15px";
	this.scrollarea.style.margin = "0px";
	this.scrollarea.style.padding = "0px";
	this.scrollarea.style.font = "normal 10px verdana";
	this.scrollarea.style.borderBottom = "2px solid gray";
	this.scrollarea.style.whiteSpace = "nowrap";
	this.scrollarea.style.textAlign = "center";
	this.scrollarea.style.overflowX = "auto";
	this.scrollarea.style.overflowY = "auto";
	this.scrollarea.style.overflow = "auto";
	b.appendChild(this.scrollarea);
	return b
};
draw2d.ToolPalette.prototype.setDimension = function(d, c) {
	draw2d.WindowFigure.prototype.setDimension.call(this, d, c);
	if (this.scrollarea !== null) {
		this.scrollarea.style.width = this.getWidth() + "px";
		if (this.hasTitleBar()) {
			this.scrollarea.style.height = (this.getHeight() - 15) + "px"
		} else {
			this.scrollarea.style.height = this.getHeight() + "px"
		}
	}
};
draw2d.ToolPalette.prototype.addChild = function(b) {
	this.children[b.id] = b;
	this.scrollarea.appendChild(b.getHTMLElement())
};
draw2d.ToolPalette.prototype.getChild = function(b) {
	return this.children[b]
};
draw2d.ToolPalette.prototype.getActiveTool = function() {
	return this.activeTool
};
draw2d.ToolPalette.prototype.setActiveTool = function(b) {
	if (this.activeTool != b && this.activeTool !== null) {
		this.activeTool.setActive(false)
	}
	if (b !== null) {
		b.setActive(true)
	}
	this.activeTool = b
};
draw2d.Dialog = function(b) {
	this.buttonbar = null;
	if (b) {
		draw2d.WindowFigure.call(this, b)
	} else {
		draw2d.WindowFigure.call(this, "Dialog")
	}
	this.setDimension(400, 300)
};
draw2d.Dialog.prototype = new draw2d.WindowFigure();
draw2d.Dialog.prototype.type = "draw2d.Dialog";
draw2d.Dialog.prototype.createHTMLElement = function() {
	var c = draw2d.WindowFigure.prototype.createHTMLElement.call(this);
	var d = this;
	this.buttonbar = document.createElement("div");
	this.buttonbar.style.position = "absolute";
	this.buttonbar.style.left = "0px";
	this.buttonbar.style.bottom = "0px";
	this.buttonbar.style.width = this.getWidth() + "px";
	this.buttonbar.style.height = "30px";
	this.buttonbar.style.margin = "0px";
	this.buttonbar.style.padding = "0px";
	this.buttonbar.style.font = "normal 10px verdana";
	this.buttonbar.style.backgroundColor = "#c0c0c0";
	this.buttonbar.style.borderBottom = "2px solid gray";
	this.buttonbar.style.whiteSpace = "nowrap";
	this.buttonbar.style.textAlign = "center";
	this.buttonbar.className = "Dialog_buttonbar";
	this.okbutton = document.createElement("button");
	this.okbutton.style.border = "1px solid gray";
	this.okbutton.style.font = "normal 10px verdana";
	this.okbutton.style.width = "80px";
	this.okbutton.style.margin = "5px";
	this.okbutton.className = "Dialog_okbutton";
	this.okbutton.innerHTML = "Ok";
	this.okbutton.onclick = function() {
		var b = null;
		try {
			d.onOk()
		} catch (a) {
			b = a
		}
		d.workflow.removeFigure(d);
		if (b !== null) {
			throw b
		}
	};
	this.buttonbar.appendChild(this.okbutton);
	this.cancelbutton = document.createElement("button");
	this.cancelbutton.innerHTML = "Cancel";
	this.cancelbutton.style.font = "normal 10px verdana";
	this.cancelbutton.style.border = "1px solid gray";
	this.cancelbutton.style.width = "80px";
	this.cancelbutton.style.margin = "5px";
	this.cancelbutton.className = "Dialog_cancelbutton";
	this.cancelbutton.onclick = function() {
		var b = null;
		try {
			d.onCancel()
		} catch (a) {
			b = a
		}
		d.workflow.removeFigure(d);
		if (b !== null) {
			throw b
		}
	};
	this.buttonbar.appendChild(this.cancelbutton);
	c.appendChild(this.buttonbar);
	return c
};
draw2d.Dialog.prototype.onOk = function() {
};
draw2d.Dialog.prototype.onCancel = function() {
};
draw2d.Dialog.prototype.setDimension = function(d, c) {
	draw2d.WindowFigure.prototype.setDimension.call(this, d, c);
	if (this.buttonbar !== null) {
		this.buttonbar.style.width = this.getWidth() + "px"
	}
};
draw2d.Dialog.prototype.setWorkflow = function(b) {
	draw2d.WindowFigure.prototype.setWorkflow.call(this, b);
	this.setFocus()
};
draw2d.Dialog.prototype.setFocus = function() {
};
draw2d.Dialog.prototype.onSetDocumentDirty = function() {
};
draw2d.InputDialog = function() {
	draw2d.Dialog.call(this);
	this.setDimension(400, 100)
};
draw2d.InputDialog.prototype = new draw2d.Dialog();
draw2d.InputDialog.prototype.type = "draw2d.InputDialog";
draw2d.InputDialog.prototype.createHTMLElement = function() {
	var b = draw2d.Dialog.prototype.createHTMLElement.call(this);
	return b
};
draw2d.InputDialog.prototype.onOk = function() {
	this.workflow.removeFigure(this)
};
draw2d.InputDialog.prototype.onCancel = function() {
	this.workflow.removeFigure(this)
};
draw2d.PropertyDialog = function(e, d, f) {
	this.figure = e;
	this.propertyName = d;
	this.label = f;
	draw2d.Dialog.call(this);
	this.setDimension(400, 120)
};
draw2d.PropertyDialog.prototype = new draw2d.Dialog();
draw2d.PropertyDialog.prototype.type = "draw2d.PropertyDialog";
draw2d.PropertyDialog.prototype.createHTMLElement = function() {
	var e = draw2d.Dialog.prototype.createHTMLElement.call(this);
	var f = document.createElement("form");
	f.style.position = "absolute";
	f.style.left = "10px";
	f.style.top = "30px";
	f.style.width = "375px";
	f.style.font = "normal 10px verdana";
	e.appendChild(f);
	this.labelDiv = document.createElement("div");
	this.labelDiv.innerHTML = this.label;
	this.disableTextSelection(this.labelDiv);
	f.appendChild(this.labelDiv);
	this.input = document.createElement("input");
	this.input.style.border = "1px solid gray";
	this.input.style.font = "normal 10px verdana";
	this.input.type = "text";
	var d = this.figure.getProperty(this.propertyName);
	if (d) {
		this.input.value = d
	} else {
		this.input.value = ""
	}
	this.input.style.width = "100%";
	f.appendChild(this.input);
	this.input.focus();
	return e
};
draw2d.PropertyDialog.prototype.onOk = function() {
	draw2d.Dialog.prototype.onOk.call(this);
	this.figure.setProperty(this.propertyName, this.input.value)
};
draw2d.AnnotationDialog = function(b) {
	this.figure = b;
	draw2d.Dialog.call(this);
	this.setDimension(400, 100)
};
draw2d.AnnotationDialog.prototype = new draw2d.Dialog();
draw2d.AnnotationDialog.prototype.type = "draw2d.AnnotationDialog";
draw2d.AnnotationDialog.prototype.createHTMLElement = function() {
	var d = draw2d.Dialog.prototype.createHTMLElement.call(this);
	var e = document.createElement("form");
	e.style.position = "absolute";
	e.style.left = "10px";
	e.style.top = "30px";
	e.style.width = "375px";
	e.style.font = "normal 10px verdana";
	d.appendChild(e);
	this.label = document.createTextNode("Text");
	e.appendChild(this.label);
	this.input = document.createElement("input");
	this.input.style.border = "1px solid gray";
	this.input.style.font = "normal 10px verdana";
	this.input.type = "text";
	var f = this.figure.getText();
	if (f) {
		this.input.value = f
	} else {
		this.input.value = ""
	}
	this.input.style.width = "100%";
	e.appendChild(this.input);
	this.input.focus();
	return d
};
draw2d.AnnotationDialog.prototype.onOk = function() {
	this.workflow.getCommandStack().execute(
			new draw2d.CommandSetText(this.figure, this.input.value));
	this.workflow.removeFigure(this)
};
draw2d.PropertyWindow = function() {
	this.currentSelection = null;
	draw2d.WindowFigure.call(this, "Property Window");
	this.setDimension(200, 100)
};
draw2d.PropertyWindow.prototype = new draw2d.WindowFigure();
draw2d.PropertyWindow.prototype.type = "draw2d.PropertyWindow";
draw2d.PropertyWindow.prototype.dispose = function() {
	draw2d.WindowFigure.prototype.dispose.call(this)
};
draw2d.PropertyWindow.prototype.createHTMLElement = function() {
	var b = draw2d.WindowFigure.prototype.createHTMLElement.call(this);
	b.appendChild(this.createLabel("Type:", 15, 25));
	b.appendChild(this.createLabel("X :", 15, 50));
	b.appendChild(this.createLabel("Y :", 15, 70));
	b.appendChild(this.createLabel("Width :", 85, 50));
	b.appendChild(this.createLabel("Height :", 85, 70));
	this.labelType = this.createLabel("", 50, 25);
	this.labelX = this.createLabel("", 40, 50);
	this.labelY = this.createLabel("", 40, 70);
	this.labelWidth = this.createLabel("", 135, 50);
	this.labelHeight = this.createLabel("", 135, 70);
	this.labelType.style.fontWeight = "normal";
	this.labelX.style.fontWeight = "normal";
	this.labelY.style.fontWeight = "normal";
	this.labelWidth.style.fontWeight = "normal";
	this.labelHeight.style.fontWeight = "normal";
	b.appendChild(this.labelType);
	b.appendChild(this.labelX);
	b.appendChild(this.labelY);
	b.appendChild(this.labelWidth);
	b.appendChild(this.labelHeight);
	return b
};
draw2d.PropertyWindow.prototype.onSelectionChanged = function(b) {
	draw2d.WindowFigure.prototype.onSelectionChanged.call(this, b);
	if (this.currentSelection !== null) {
		this.currentSelection.detachMoveListener(this)
	}
	this.currentSelection = b;
	if (b !== null && b != this) {
		this.labelType.innerHTML = b.type;
		if (b.getX) {
			this.labelX.innerHTML = b.getX();
			this.labelY.innerHTML = b.getY();
			this.labelWidth.innerHTML = b.getWidth();
			this.labelHeight.innerHTML = b.getHeight();
			this.currentSelection = b;
			this.currentSelection.attachMoveListener(this)
		} else {
			this.labelX.innerHTML = "";
			this.labelY.innerHTML = "";
			this.labelWidth.innerHTML = "";
			this.labelHeight.innerHTML = ""
		}
	} else {
		this.labelType.innerHTML = "&lt;none&gt;";
		this.labelX.innerHTML = "";
		this.labelY.innerHTML = "";
		this.labelWidth.innerHTML = "";
		this.labelHeight.innerHTML = ""
	}
};
draw2d.PropertyWindow.prototype.getCurrentSelection = function() {
	return this.currentSelection
};
draw2d.PropertyWindow.prototype.onOtherFigureMoved = function(b) {
	if (b == this.currentSelection) {
		this.onSelectionChanged(b)
	}
};
draw2d.PropertyWindow.prototype.createLabel = function(h, f, g) {
	var e = document.createElement("div");
	e.style.position = "absolute";
	e.style.left = f + "px";
	e.style.top = g + "px";
	e.style.font = "normal 10px verdana";
	e.style.whiteSpace = "nowrap";
	e.style.fontWeight = "bold";
	e.innerHTML = h;
	return e
};
draw2d.ColorDialog = function() {
	this.maxValue = {
		h : "359",
		s : "100",
		v : "100"
	};
	this.HSV = {
		0 : 359,
		1 : 100,
		2 : 100
	};
	this.slideHSV = {
		0 : 359,
		1 : 100,
		2 : 100
	};
	this.SVHeight = 165;
	this.wSV = 162;
	this.wH = 162;
	draw2d.Dialog.call(this, "Color Chooser");
	this.loadSV();
	this.setColor(new draw2d.Color(255, 0, 0));
	this.setDimension(219, 244)
};
draw2d.ColorDialog.prototype = new draw2d.Dialog();
draw2d.ColorDialog.prototype.type = "draw2d.ColorDialog";
draw2d.ColorDialog.prototype.createHTMLElement = function() {
	var d = this;
	var c = draw2d.Dialog.prototype.createHTMLElement.call(this);
	this.outerDiv = document.createElement("div");
	this.outerDiv.id = "plugin";
	this.outerDiv.style.top = "15px";
	this.outerDiv.style.left = "0px";
	this.outerDiv.style.width = "201px";
	this.outerDiv.style.position = "absolute";
	this.outerDiv.style.padding = "9px";
	this.outerDiv.display = "block";
	this.outerDiv.style.background = "#0d0d0d";
	this.plugHEX = document.createElement("div");
	this.plugHEX.id = "plugHEX";
	this.plugHEX.innerHTML = "F1FFCC";
	this.plugHEX.style.color = "white";
	this.plugHEX.style.font = "normal 10px verdana";
	this.outerDiv.appendChild(this.plugHEX);
	this.SV = document.createElement("div");
	this.SV.onmousedown = function(a) {
		d.mouseDownSV(d.SVslide, a)
	};
	this.SV.id = "SV";
	this.SV.style.cursor = "crosshair";
	this.SV.style.background = "#FF0000 url(SatVal.png)";
	this.SV.style.position = "absolute";
	this.SV.style.height = "166px";
	this.SV.style.width = "167px";
	this.SV.style.marginRight = "10px";
	this.SV.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='SatVal.png', sizingMethod='scale')";
	this.SV.style["float"] = "left";
	this.outerDiv.appendChild(this.SV);
	this.SVslide = document.createElement("div");
	this.SVslide.onmousedown = function(a) {
		d.mouseDownSV(a)
	};
	this.SVslide.style.top = "40px";
	this.SVslide.style.left = "40px";
	this.SVslide.style.position = "absolute";
	this.SVslide.style.cursor = "crosshair";
	this.SVslide.style.background = "url(slide.gif)";
	this.SVslide.style.height = "9px";
	this.SVslide.style.width = "9px";
	this.SVslide.style.lineHeight = "1px";
	this.outerDiv.appendChild(this.SVslide);
	this.H = document.createElement("form");
	this.H.id = "H";
	this.H.onmousedown = function(a) {
		d.mouseDownH(a)
	};
	this.H.style.border = "1px solid #000000";
	this.H.style.cursor = "crosshair";
	this.H.style.position = "absolute";
	this.H.style.width = "19px";
	this.H.style.top = "28px";
	this.H.style.left = "191px";
	this.outerDiv.appendChild(this.H);
	this.Hslide = document.createElement("div");
	this.Hslide.style.top = "-7px";
	this.Hslide.style.left = "-8px";
	this.Hslide.style.background = "url(slideHue.gif)";
	this.Hslide.style.height = "5px";
	this.Hslide.style.width = "33px";
	this.Hslide.style.position = "absolute";
	this.Hslide.style.lineHeight = "1px";
	this.H.appendChild(this.Hslide);
	this.Hmodel = document.createElement("div");
	this.Hmodel.style.height = "1px";
	this.Hmodel.style.width = "19px";
	this.Hmodel.style.lineHeight = "1px";
	this.Hmodel.style.margin = "0px";
	this.Hmodel.style.padding = "0px";
	this.Hmodel.style.fontSize = "1px";
	this.H.appendChild(this.Hmodel);
	c.appendChild(this.outerDiv);
	return c
};
draw2d.ColorDialog.prototype.onOk = function() {
	draw2d.Dialog.prototype.onOk.call(this)
};
draw2d.browser = function(b) {
	return (Math.max(navigator.userAgent.toLowerCase().indexOf(b), 0))
};
draw2d.ColorDialog.prototype.showColor = function(b) {
	this.plugHEX.style.background = "#" + b;
	this.plugHEX.innerHTML = b
};
draw2d.ColorDialog.prototype.getSelectedColor = function() {
	var b = this.hex2rgb(this.plugHEX.innerHTML);
	return new draw2d.Color(b[0], b[1], b[2])
};
draw2d.ColorDialog.prototype.setColor = function(d) {
	if (d === null) {
		d = new draw2d.Color(100, 100, 100)
	}
	var c = this.rgb2hex(Array(d.getRed(), d.getGreen(), d.getBlue()));
	this.updateH(c)
};
draw2d.ColorDialog.prototype.XY = function(d, e) {
	var f = draw2d.browser("msie") ? Array(event.clientX
			+ document.body.scrollLeft, event.clientY + document.body.scrollTop)
			: Array(d.pageX, d.pageY);
	return f[e]
};
draw2d.ColorDialog.prototype.mkHSV = function(b, c, a) {
	return (Math.min(b, Math.max(0, Math.ceil((parseInt(a) / c) * b))))
};
draw2d.ColorDialog.prototype.ckHSV = function(a, b) {
	if (a >= 0 && a <= b) {
		return (a)
	} else {
		if (a > b) {
			return (b)
		} else {
			if (a < 0) {
				return ("-" + oo)
			}
		}
	}
};
draw2d.ColorDialog.prototype.mouseDownH = function(c) {
	this.slideHSV[0] = this.HSV[0];
	var d = this;
	this.H.onmousemove = function(a) {
		d.dragH(a)
	};
	this.H.onmouseup = function(a) {
		d.H.onmousemove = "";
		d.H.onmouseup = ""
	};
	this.dragH(c)
};
draw2d.ColorDialog.prototype.dragH = function(d) {
	var c = this.XY(d, 1) - this.getY() - 40;
	this.Hslide.style.top = (this.ckHSV(c, this.wH) - 5) + "px";
	this.slideHSV[0] = this.mkHSV(359, this.wH, this.Hslide.style.top);
	this.updateSV();
	this.showColor(this.commit());
	this.SV.style.backgroundColor = "#"
			+ this.hsv2hex(Array(this.HSV[0], 100, 100))
};
draw2d.ColorDialog.prototype.mouseDownSV = function(g, h) {
	this.slideHSV[0] = this.HSV[0];
	var f = this;
	function e() {
		f.SV.onmousemove = "";
		f.SV.onmouseup = "";
		f.SVslide.onmousemove = "";
		f.SVslide.onmouseup = ""
	}
	this.SV.onmousemove = function(a) {
		f.dragSV(a)
	};
	this.SV.onmouseup = e;
	this.SVslide.onmousemove = function(a) {
		f.dragSV(a)
	};
	this.SVslide.onmouseup = e;
	this.dragSV(h)
};
draw2d.ColorDialog.prototype.dragSV = function(d) {
	var e = this.XY(d, 0) - this.getX() - 1;
	var f = this.XY(d, 1) - this.getY() - 20;
	this.SVslide.style.left = this.ckHSV(e, this.wSV) + "px";
	this.SVslide.style.top = this.ckHSV(f, this.wSV) + "px";
	this.slideHSV[1] = this.mkHSV(100, this.wSV, this.SVslide.style.left);
	this.slideHSV[2] = 100 - this.mkHSV(100, this.wSV, this.SVslide.style.top);
	this.updateSV()
};
draw2d.ColorDialog.prototype.commit = function() {
	var h = "hsv";
	var g = {};
	var f = "";
	for (var e = 0; e <= h.length - 1; e++) {
		f = h.substr(e, 1);
		g[e] = (f == "h") ? this.maxValue[f]
				- this.mkHSV(this.maxValue[f], this.wH, this.Hslide.style.top)
				: this.HSV[e]
	}
	return (this.updateSV(this.hsv2hex(g)))
};
draw2d.ColorDialog.prototype.updateSV = function(b) {
	this.HSV = b ? this.hex2hsv(b) : Array(this.slideHSV[0], this.slideHSV[1],
			this.slideHSV[2]);
	if (!b) {
		b = this.hsv2hex(Array(this.slideHSV[0], this.slideHSV[1],
				this.slideHSV[2]))
	}
	this.showColor(b);
	return b
};
draw2d.ColorDialog.prototype.loadSV = function() {
	var c = "";
	for (var d = this.SVHeight; d >= 0; d--) {
		c += '<div style="background:#'
				+ this.hsv2hex(Array(Math.round((359 / this.SVHeight) * d),
						100, 100)) + ';"><br/></div>'
	}
	this.Hmodel.innerHTML = c
};
draw2d.ColorDialog.prototype.updateH = function(b) {
	this.plugHEX.innerHTML = b;
	this.HSV = this.hex2hsv(b);
	this.SV.style.backgroundColor = "#"
			+ this.hsv2hex(Array(this.HSV[0], 100, 100));
	this.SVslide.style.top = (parseInt(this.wSV - this.wSV
			* (this.HSV[1] / 100)) + 20)
			+ "px";
	this.SVslide.style.left = (parseInt(this.wSV * (this.HSV[1] / 100)) + 5)
			+ "px";
	this.Hslide.style.top = (parseInt(this.wH
			* ((this.maxValue.h - this.HSV[0]) / this.maxValue.h)) - 7)
			+ "px"
};
draw2d.ColorDialog.prototype.toHex = function(b) {
	b = Math.round(Math.min(Math.max(0, b), 255));
	return ("0123456789ABCDEF".charAt((b - b % 16) / 16) + "0123456789ABCDEF"
			.charAt(b % 16))
};
draw2d.ColorDialog.prototype.hex2rgb = function(b) {
	return ({
		0 : parseInt(b.substr(0, 2), 16),
		1 : parseInt(b.substr(2, 2), 16),
		2 : parseInt(b.substr(4, 2), 16)
	})
};
draw2d.ColorDialog.prototype.rgb2hex = function(b) {
	return (this.toHex(b[0]) + this.toHex(b[1]) + this.toHex(b[2]))
};
draw2d.ColorDialog.prototype.hsv2hex = function(b) {
	return (this.rgb2hex(this.hsv2rgb(b)))
};
draw2d.ColorDialog.prototype.hex2hsv = function(b) {
	return (this.rgb2hsv(this.hex2rgb(b)))
};
draw2d.ColorDialog.prototype.rgb2hsv = function(j) {
	var h = Math.max(j[0], j[1], j[2]);
	var i = h - Math.min(j[0], j[1], j[2]);
	var k;
	var l;
	var g;
	if (h != 0) {
		l = Math.round(i / h * 100);
		if (j[0] == h) {
			k = (j[1] - j[2]) / i
		} else {
			if (j[1] == h) {
				k = 2 + (j[2] - j[0]) / i
			} else {
				if (j[2] == h) {
					k = 4 + (j[0] - j[1]) / i
				}
			}
		}
		var k = Math.min(Math.round(k * 60), 360);
		if (k < 0) {
			k += 360
		}
	}
	return ({
		0 : k ? k : 0,
		1 : l ? l : 0,
		2 : Math.round((h / 255) * 100)
	})
};
draw2d.ColorDialog.prototype.hsv2rgb = function(k) {
	var l;
	var j;
	var m;
	var n = k[1] / 100;
	var i = k[2] / 100;
	var h = k[0] / 360;
	if (n > 0) {
		if (h >= 1) {
			h = 0
		}
		h = 6 * h;
		F = h - Math.floor(h);
		A = Math.round(255 * i * (1 - n));
		j = Math.round(255 * i * (1 - (n * F)));
		C = Math.round(255 * i * (1 - (n * (1 - F))));
		i = Math.round(255 * i);
		switch (Math.floor(h)) {
		case 0:
			l = i;
			m = C;
			j = A;
			break;
		case 1:
			l = j;
			m = i;
			j = A;
			break;
		case 2:
			l = A;
			m = i;
			j = C;
			break;
		case 3:
			l = A;
			m = j;
			j = i;
			break;
		case 4:
			l = C;
			m = A;
			j = i;
			break;
		case 5:
			l = i;
			m = A;
			j = j;
			break
		}
		return ({
			0 : l ? l : 0,
			1 : m ? m : 0,
			2 : j ? j : 0
		})
	} else {
		return ({
			0 : (i = Math.round(i * 255)),
			1 : i,
			2 : i
		})
	}
};
draw2d.LineColorDialog = function(c) {
	draw2d.ColorDialog.call(this);
	this.figure = c;
	var d = c.getColor();
	this.updateH(this.rgb2hex(d.getRed(), d.getGreen(), d.getBlue()))
};
draw2d.LineColorDialog.prototype = new draw2d.ColorDialog();
draw2d.LineColorDialog.prototype.type = "draw2d.LineColorDialog";
draw2d.LineColorDialog.prototype.onOk = function() {
	var b = this.workflow;
	draw2d.ColorDialog.prototype.onOk.call(this);
	if (typeof this.figure.setColor == "function") {
		b.getCommandStack()
				.execute(
						new draw2d.CommandSetColor(this.figure, this
								.getSelectedColor()));
		if (b.getCurrentSelection() == this.figure) {
			b.setCurrentSelection(this.figure)
		}
	}
};
draw2d.BackgroundColorDialog = function(c) {
	draw2d.ColorDialog.call(this);
	this.figure = c;
	var d = c.getBackgroundColor();
	if (d !== null) {
		this.updateH(this.rgb2hex(d.getRed(), d.getGreen(), d.getBlue()))
	}
};
draw2d.BackgroundColorDialog.prototype = new draw2d.ColorDialog();
draw2d.BackgroundColorDialog.prototype.type = "draw2d.BackgroundColorDialog";
draw2d.BackgroundColorDialog.prototype.onOk = function() {
	var b = this.workflow;
	draw2d.ColorDialog.prototype.onOk.call(this);
	if (typeof this.figure.setBackgroundColor == "function") {
		b.getCommandStack().execute(
				new draw2d.CommandSetBackgroundColor(this.figure, this
						.getSelectedColor()));
		if (b.getCurrentSelection() == this.figure) {
			b.setCurrentSelection(this.figure)
		}
	}
};
draw2d.AnnotationDialog = function(b) {
	this.figure = b;
	draw2d.Dialog.call(this);
	this.setDimension(400, 100)
};
draw2d.AnnotationDialog.prototype = new draw2d.Dialog();
draw2d.AnnotationDialog.prototype.type = "draw2d.AnnotationDialog";
draw2d.AnnotationDialog.prototype.createHTMLElement = function() {
	var d = draw2d.Dialog.prototype.createHTMLElement.call(this);
	var e = document.createElement("form");
	e.style.position = "absolute";
	e.style.left = "10px";
	e.style.top = "30px";
	e.style.width = "375px";
	e.style.font = "normal 10px verdana";
	d.appendChild(e);
	this.label = document.createTextNode("Text");
	e.appendChild(this.label);
	this.input = document.createElement("input");
	this.input.style.border = "1px solid gray";
	this.input.style.font = "normal 10px verdana";
	this.input.type = "text";
	var f = this.figure.getText();
	if (f) {
		this.input.value = f
	} else {
		this.input.value = ""
	}
	this.input.style.width = "100%";
	e.appendChild(this.input);
	this.input.focus();
	return d
};
draw2d.AnnotationDialog.prototype.onOk = function() {
	this.workflow.getCommandStack().execute(
			new draw2d.CommandSetText(this.figure, this.input.value));
	this.workflow.removeFigure(this)
};
draw2d.Command = function(b) {
	this.label = b
};
draw2d.Command.prototype.type = "draw2d.Command";
draw2d.Command.prototype.getLabel = function() {
	return this.label
};
draw2d.Command.prototype.canExecute = function() {
	return true
};
draw2d.Command.prototype.execute = function() {
};
draw2d.Command.prototype.cancel = function() {
};
draw2d.Command.prototype.undo = function() {
};
draw2d.Command.prototype.redo = function() {
};
draw2d.CommandStack = function() {
	this.undostack = [];
	this.redostack = [];
	this.maxundo = 50;
	this.eventListeners = new draw2d.ArrayList()
};
draw2d.CommandStack.PRE_EXECUTE = 1;
draw2d.CommandStack.PRE_REDO = 2;
draw2d.CommandStack.PRE_UNDO = 4;
draw2d.CommandStack.POST_EXECUTE = 8;
draw2d.CommandStack.POST_REDO = 16;
draw2d.CommandStack.POST_UNDO = 32;
draw2d.CommandStack.POST_MASK = draw2d.CommandStack.POST_EXECUTE
		| draw2d.CommandStack.POST_UNDO | draw2d.CommandStack.POST_REDO;
draw2d.CommandStack.PRE_MASK = draw2d.CommandStack.PRE_EXECUTE
		| draw2d.CommandStack.PRE_UNDO | draw2d.CommandStack.PRE_REDO;
draw2d.CommandStack.prototype.type = "draw2d.CommandStack";
draw2d.CommandStack.prototype.setUndoLimit = function(b) {
	this.maxundo = b
};
draw2d.CommandStack.prototype.markSaveLocation = function() {
	this.undostack = [];
	this.redostack = []
};
draw2d.CommandStack.prototype.execute = function(b) {
	if (b === null) {
		return
	}
	if (b.canExecute() == false) {
		return
	}
	this.notifyListeners(b, draw2d.CommandStack.PRE_EXECUTE);
	this.undostack.push(b);
	b.execute();
	this.redostack = [];
	if (this.undostack.length > this.maxundo) {
		this.undostack = this.undostack.slice(this.undostack.length
				- this.maxundo)
	}
	this.notifyListeners(b, draw2d.CommandStack.POST_EXECUTE)
};
draw2d.CommandStack.prototype.undo = function() {
	var b = this.undostack.pop();
	if (b) {
		this.notifyListeners(b, draw2d.CommandStack.PRE_UNDO);
		this.redostack.push(b);
		b.undo();
		this.notifyListeners(b, draw2d.CommandStack.POST_UNDO)
	}
};
draw2d.CommandStack.prototype.redo = function() {
	var b = this.redostack.pop();
	if (b) {
		this.notifyListeners(b, draw2d.CommandStack.PRE_REDO);
		this.undostack.push(b);
		b.redo();
		this.notifyListeners(b, draw2d.CommandStack.POST_REDO)
	}
};
draw2d.CommandStack.prototype.canRedo = function() {
	return this.redostack.length > 0
};
draw2d.CommandStack.prototype.canUndo = function() {
	return this.undostack.length > 0
};
draw2d.CommandStack.prototype.addCommandStackEventListener = function(b) {
	this.eventListeners.add(b)
};
draw2d.CommandStack.prototype.removeCommandStackEventListener = function(b) {
	this.eventListeners.remove(b)
};
draw2d.CommandStack.prototype.notifyListeners = function(g, h) {
	var i = new draw2d.CommandStackEvent(g, h);
	var j = this.eventListeners.getSize();
	for (var f = 0; f < j; f++) {
		this.eventListeners.get(f).stackChanged(i)
	}
};
draw2d.CommandStackEvent = function(d, c) {
	this.command = d;
	this.details = c
};
draw2d.CommandStackEvent.prototype.type = "draw2d.CommandStackEvent";
draw2d.CommandStackEvent.prototype.getCommand = function() {
	return this.command
};
draw2d.CommandStackEvent.prototype.getDetails = function() {
	return this.details
};
draw2d.CommandStackEvent.prototype.isPostChangeEvent = function() {
	return 0 != (this.getDetails() & draw2d.CommandStack.POST_MASK)
};
draw2d.CommandStackEvent.prototype.isPreChangeEvent = function() {
	return 0 != (this.getDetails() & draw2d.CommandStack.PRE_MASK)
};
draw2d.CommandStackEventListener = function() {
};
draw2d.CommandStackEventListener.prototype.type = "draw2d.CommandStackEventListener";
draw2d.CommandStackEventListener.prototype.stackChanged = function(b) {
};
draw2d.CommandAdd = function(j, f, g, h, i) {
	draw2d.Command.call(this, "add figure");
	if (i === undefined) {
		i = null
	}
	this.parent = i;
	this.figure = f;
	this.x = g;
	this.y = h;
	this.workflow = j
};
draw2d.CommandAdd.prototype = new draw2d.Command();
draw2d.CommandAdd.prototype.type = "draw2d.CommandAdd";
draw2d.CommandAdd.prototype.execute = function() {
	this.redo()
};
draw2d.CommandAdd.prototype.redo = function() {
	if (this.x && this.y) {
		this.workflow.addFigure(this.figure, this.x, this.y)
	} else {
		this.workflow.addFigure(this.figure)
	}
	this.workflow.setCurrentSelection(this.figure);
	if (this.parent !== null) {
		this.parent.addChild(this.figure)
	}
};
draw2d.CommandAdd.prototype.undo = function() {
	this.workflow.removeFigure(this.figure);
	this.workflow.setCurrentSelection(null);
	if (this.parent !== null) {
		this.parent.removeChild(this.figure)
	}
};
draw2d.CommandDelete = function(b) {
	draw2d.Command.call(this, "delete figure");
	this.parent = b.parent;
	this.figure = b;
	this.workflow = b.workflow;
	this.connections = null;
	this.compartmentDeleteCommands = null
};
draw2d.CommandDelete.prototype = new draw2d.Command();
draw2d.CommandDelete.prototype.type = "draw2d.CommandDelete";
draw2d.CommandDelete.prototype.execute = function() {
	this.redo()
};
draw2d.CommandDelete.prototype.undo = function() {
	if (this.figure instanceof draw2d.CompartmentFigure) {
		for (var c = 0; c < this.compartmentDeleteCommands.getSize(); c++) {
			var d = this.compartmentDeleteCommands.get(c);
			this.figure.addChild(d.figure);
			this.workflow.getCommandStack().undo()
		}
	}
	this.workflow.addFigure(this.figure);
	if (this.figure instanceof draw2d.Connection) {
		this.figure.reconnect()
	}
	this.workflow.setCurrentSelection(this.figure);
	if (this.parent !== null) {
		this.parent.addChild(this.figure)
	}
	for (var c = 0; c < this.connections.getSize(); ++c) {
		this.workflow.addFigure(this.connections.get(c));
		this.connections.get(c).reconnect()
	}
};
draw2d.CommandDelete.prototype.redo = function() {
	if (this.figure instanceof draw2d.CompartmentFigure) {
		if (this.compartmentDeleteCommands === null) {
			this.compartmentDeleteCommands = new draw2d.ArrayList();
			var p = this.figure.getChildren().clone();
			for (var n = 0; n < p.getSize(); n++) {
				var k = p.get(n);
				this.figure.removeChild(k);
				var i = new draw2d.CommandDelete(k);
				this.compartmentDeleteCommands.add(i);
				this.workflow.getCommandStack().execute(i)
			}
		} else {
			for (var n = 0; n < this.compartmentDeleteCommands.getSize(); n++) {
				this.workflow.redo()
			}
		}
	}
	this.workflow.removeFigure(this.figure);
	this.workflow.setCurrentSelection(null);
	if (this.figure instanceof draw2d.Node && this.connections === null) {
		this.connections = new draw2d.ArrayList();
		var l = this.figure.getPorts();
		for (var n = 0; n < l.getSize(); n++) {
			var c = l.get(n);
			for (var m = 0, o = c.getConnections().getSize(); m < o; m++) {
				if (!this.connections.contains(c.getConnections().get(m))) {
					this.connections.add(c.getConnections().get(m))
				}
			}
		}
	}
	if (this.connections === null) {
		this.connections = new draw2d.ArrayList()
	}
	if (this.parent !== null) {
		this.parent.removeChild(this.figure)
	}
	for (var n = 0; n < this.connections.getSize(); ++n) {
		this.workflow.removeFigure(this.connections.get(n))
	}
};
draw2d.CommandMove = function(d, e, f) {
	draw2d.Command.call(this, "move figure");
	this.figure = d;
	if (e == undefined) {
		this.oldX = d.getX();
		this.oldY = d.getY()
	} else {
		this.oldX = e;
		this.oldY = f
	}
	this.oldCompartment = d.getParent()
};
draw2d.CommandMove.prototype = new draw2d.Command();
draw2d.CommandMove.prototype.type = "draw2d.CommandMove";
draw2d.CommandMove.prototype.setStartPosition = function(d, c) {
	this.oldX = d;
	this.oldY = c
};
draw2d.CommandMove.prototype.setPosition = function(d, c) {
	this.newX = d;
	this.newY = c;
	this.newCompartment = this.figure.workflow.getBestCompartmentFigure(d, c,
			this.figure)
};
draw2d.CommandMove.prototype.canExecute = function() {
	return this.newX != this.oldX || this.newY != this.oldY
};
draw2d.CommandMove.prototype.execute = function() {
	this.redo()
};
draw2d.CommandMove.prototype.undo = function() {
	this.figure.setPosition(this.oldX, this.oldY);
	if (this.newCompartment !== null) {
		this.newCompartment.removeChild(this.figure)
	}
	if (this.oldCompartment !== null) {
		this.oldCompartment.addChild(this.figure)
	}
	this.figure.workflow.moveResizeHandles(this.figure)
};
draw2d.CommandMove.prototype.redo = function() {
	this.figure.setPosition(this.newX, this.newY);
	if (this.oldCompartment !== null) {
		this.oldCompartment.removeChild(this.figure)
	}
	if (this.newCompartment !== null) {
		this.newCompartment.addChild(this.figure)
	}
	this.figure.workflow.moveResizeHandles(this.figure)
};
draw2d.CommandResize = function(f, d, e) {
	draw2d.Command.call(this, "resize figure");
	this.figure = f;
	if (d === undefined) {
		this.oldWidth = f.getWidth();
		this.oldHeight = f.getHeight()
	} else {
		this.oldWidth = d;
		this.oldHeight = e
	}
};
draw2d.CommandResize.prototype = new draw2d.Command();
draw2d.CommandResize.prototype.type = "draw2d.CommandResize";
draw2d.CommandResize.prototype.setDimension = function(c, d) {
	this.newWidth = c;
	this.newHeight = d
};
draw2d.CommandResize.prototype.canExecute = function() {
	return this.newWidth != this.oldWidth || this.newHeight != this.oldHeight
};
draw2d.CommandResize.prototype.execute = function() {
	this.redo()
};
draw2d.CommandResize.prototype.undo = function() {
	this.figure.setDimension(this.oldWidth, this.oldHeight);
	this.figure.workflow.moveResizeHandles(this.figure)
};
draw2d.CommandResize.prototype.redo = function() {
	this.figure.setDimension(this.newWidth, this.newHeight);
	this.figure.workflow.moveResizeHandles(this.figure)
};
draw2d.CommandSetText = function(c, d) {
	draw2d.Command.call(this, "set text");
	this.figure = c;
	this.newText = d;
	this.oldText = c.getText()
};
draw2d.CommandSetText.prototype = new draw2d.Command();
draw2d.CommandSetText.prototype.type = "draw2d.CommandSetText";
draw2d.CommandSetText.prototype.execute = function() {
	this.redo()
};
draw2d.CommandSetText.prototype.redo = function() {
	this.figure.setText(this.newText)
};
draw2d.CommandSetText.prototype.undo = function() {
	this.figure.setText(this.oldText)
};
draw2d.CommandSetColor = function(c, d) {
	draw2d.Command.call(this, "set color");
	this.figure = c;
	this.newColor = d;
	this.oldColor = c.getColor()
};
draw2d.CommandSetColor.prototype = new draw2d.Command();
draw2d.CommandSetColor.prototype.type = "draw2d.CommandSetColor";
draw2d.CommandSetColor.prototype.execute = function() {
	this.redo()
};
draw2d.CommandSetColor.prototype.undo = function() {
	this.figure.setColor(this.oldColor)
};
draw2d.CommandSetColor.prototype.redo = function() {
	this.figure.setColor(this.newColor)
};
draw2d.CommandSetBackgroundColor = function(c, d) {
	draw2d.Command.call(this, "set background color");
	this.figure = c;
	this.newColor = d;
	this.oldColor = c.getBackgroundColor()
};
draw2d.CommandSetBackgroundColor.prototype = new draw2d.Command();
draw2d.CommandSetBackgroundColor.prototype.type = "draw2d.CommandSetBackgroundColor";
draw2d.CommandSetBackgroundColor.prototype.execute = function() {
	this.redo()
};
draw2d.CommandSetBackgroundColor.prototype.undo = function() {
	this.figure.setBackgroundColor(this.oldColor)
};
draw2d.CommandSetBackgroundColor.prototype.redo = function() {
	this.figure.setBackgroundColor(this.newColor)
};
draw2d.CommandConnect = function(f, d, e) {
	draw2d.Command.call(this, "create connection");
	this.workflow = f;
	this.source = d;
	this.target = e;
	this.connection = null
};
draw2d.CommandConnect.prototype = new draw2d.Command();
draw2d.CommandConnect.prototype.type = "draw2d.CommandConnect";
draw2d.CommandConnect.prototype.setConnection = function(b) {
	this.connection = b
};
draw2d.CommandConnect.prototype.execute = function() {
	if (this.connection === null) {
		this.connection = new draw2d.Connection()
	}
	this.connection.setSource(this.source);
	this.connection.setTarget(this.target);
	this.workflow.addFigure(this.connection)
};
draw2d.CommandConnect.prototype.redo = function() {
	this.workflow.addFigure(this.connection);
	this.connection.reconnect()
};
draw2d.CommandConnect.prototype.undo = function() {
	this.workflow.removeFigure(this.connection)
};
draw2d.CommandReconnect = function(b) {
	draw2d.Command.call(this, "reconnect connection");
	this.con = b;
	this.oldSourcePort = b.getSource();
	this.oldTargetPort = b.getTarget();
	this.oldRouter = b.getRouter();
	this.con.setRouter(new draw2d.NullConnectionRouter())
};
draw2d.CommandReconnect.prototype = new draw2d.Command();
draw2d.CommandReconnect.prototype.type = "draw2d.CommandReconnect";
draw2d.CommandReconnect.prototype.canExecute = function() {
	return true
};
draw2d.CommandReconnect.prototype.setNewPorts = function(c, d) {
	this.newSourcePort = c;
	this.newTargetPort = d
};
draw2d.CommandReconnect.prototype.execute = function() {
	this.redo()
};
draw2d.CommandReconnect.prototype.cancel = function() {
	var c = this.con.sourceAnchor.getLocation(this.con.targetAnchor
			.getReferencePoint());
	var d = this.con.targetAnchor.getLocation(this.con.sourceAnchor
			.getReferencePoint());
	this.con.setStartPoint(c.x, c.y);
	this.con.setEndPoint(d.x, d.y);
	this.con.getWorkflow().showLineResizeHandles(this.con);
	this.con.setRouter(this.oldRouter)
};
draw2d.CommandReconnect.prototype.undo = function() {
	this.con.setSource(this.oldSourcePort);
	this.con.setTarget(this.oldTargetPort);
	this.con.setRouter(this.oldRouter);
	if (this.con.getWorkflow().getCurrentSelection() == this.con) {
		this.con.getWorkflow().showLineResizeHandles(this.con)
	}
};
draw2d.CommandReconnect.prototype.redo = function() {
	this.con.setSource(this.newSourcePort);
	this.con.setTarget(this.newTargetPort);
	this.con.setRouter(this.oldRouter);
	if (this.con.getWorkflow().getCurrentSelection() == this.con) {
		this.con.getWorkflow().showLineResizeHandles(this.con)
	}
};
draw2d.CommandMoveLine = function(g, j, f, h, i) {
	draw2d.Command.call(this, "move line");
	this.line = g;
	this.startX1 = j;
	this.startY1 = f;
	this.endX1 = h;
	this.endY1 = i
};
draw2d.CommandMoveLine.prototype = new draw2d.Command();
draw2d.CommandMoveLine.prototype.type = "draw2d.CommandMoveLine";
draw2d.CommandMoveLine.prototype.canExecute = function() {
	return this.startX1 != this.startX2 || this.startY1 != this.startY2
			|| this.endX1 != this.endX2 || this.endY1 != this.endY2
};
draw2d.CommandMoveLine.prototype.execute = function() {
	this.startX2 = this.line.getStartX();
	this.startY2 = this.line.getStartY();
	this.endX2 = this.line.getEndX();
	this.endY2 = this.line.getEndY();
	this.redo()
};
draw2d.CommandMoveLine.prototype.undo = function() {
	this.line.setStartPoint(this.startX1, this.startY1);
	this.line.setEndPoint(this.endX1, this.endY1);
	if (this.line.workflow.getCurrentSelection() == this.line) {
		this.line.workflow.showLineResizeHandles(this.line)
	}
};
draw2d.CommandMoveLine.prototype.redo = function() {
	this.line.setStartPoint(this.startX2, this.startY2);
	this.line.setEndPoint(this.endX2, this.endY2);
	if (this.line.workflow.getCurrentSelection() == this.line) {
		this.line.workflow.showLineResizeHandles(this.line)
	}
};
draw2d.CommandMovePort = function(b) {
	draw2d.Command.call(this, "move port");
	this.port = b
};
draw2d.CommandMovePort.prototype = new draw2d.Command();
draw2d.CommandMovePort.prototype.type = "draw2d.CommandMovePort";
draw2d.CommandMovePort.prototype.execute = function() {
	this.port.setAlpha(1);
	this.port.setPosition(this.port.originX, this.port.originY);
	this.port.parentNode.workflow.hideConnectionLine()
};
draw2d.CommandMovePort.prototype.undo = function() {
};
draw2d.CommandMovePort.prototype.redo = function() {
};
draw2d.CommandMovePort.prototype.setPosition = function(d, c) {
};
draw2d.Menu = function() {
	this.menuItems = new draw2d.ArrayList();
	draw2d.Figure.call(this);
	this.setSelectable(false);
	this.setDeleteable(false);
	this.setCanDrag(false);
	this.setResizeable(false);
	this.setSelectable(false);
	this.setZOrder(10000);
	this.dirty = false
};
draw2d.Menu.prototype = new draw2d.Figure();
draw2d.Menu.prototype.type = "draw2d.Menu";
draw2d.Menu.prototype.createHTMLElement = function() {
	var b = document.createElement("div");
	b.style.position = "absolute";
	b.style.left = this.x + "px";
	b.style.top = this.y + "px";
	b.style.margin = "0px";
	b.style.padding = "0px";
	b.style.zIndex = "" + draw2d.Figure.ZOrderBaseIndex;
	b.style.border = "1px solid gray";
	b.style.background = "lavender";
	b.style.cursor = "pointer";
	b.style.width = "auto";
	b.style.height = "auto";
	b.className = "Menu";
	return b
};
draw2d.Menu.prototype.setWorkflow = function(b) {
	this.workflow = b
};
draw2d.Menu.prototype.setDimension = function(d, c) {
};
draw2d.Menu.prototype.appendMenuItem = function(b) {
	this.menuItems.add(b);
	b.parentMenu = this;
	this.dirty = true
};
draw2d.Menu.prototype.getHTMLElement = function() {
	var b = draw2d.Figure.prototype.getHTMLElement.call(this);
	if (this.dirty) {
		this.createList()
	}
	return b
};
draw2d.Menu.prototype.createList = function() {
	this.dirty = false;
	this.html.innerHTML = "";
	var h = this;
	for (var e = 0; e < this.menuItems.getSize(); e++) {
		var g = this.menuItems.get(e);
		var f = document.createElement("a");
		f.innerHTML = g.getLabel();
		f.style.display = "block";
		f.style.fontFamily = "Verdana, Arial, Helvetica, sans-serif";
		f.style.fontSize = "9pt";
		f.style.color = "dimgray";
		f.style.borderBottom = "1px solid silver";
		f.style.paddingLeft = "5px";
		f.style.paddingRight = "5px";
		f.style.whiteSpace = "nowrap";
		f.style.cursor = "pointer";
		f.className = "MenuItem";
		this.html.appendChild(f);
		f.menuItem = g;
		if (f.addEventListener) {
			f.addEventListener("click", function(c) {
				var a = arguments[0] || window.event;
				a.cancelBubble = true;
				a.returnValue = false;
				var k = a.clientX;
				var l = a.clientY;
				var b = document.body.parentNode.scrollLeft;
				var d = document.body.parentNode.scrollTop;
				this.menuItem.execute(k + b, l + d)
			}, false);
			f.addEventListener("mouseup", function(a) {
				a.cancelBubble = true;
				a.returnValue = false
			}, false);
			f.addEventListener("mousedown", function(a) {
				a.cancelBubble = true;
				a.returnValue = false
			}, false);
			f.addEventListener("mouseover", function(a) {
				this.style.backgroundColor = "silver"
			}, false);
			f.addEventListener("mouseout", function(a) {
				this.style.backgroundColor = "transparent"
			}, false)
		} else {
			if (f.attachEvent) {
				f.attachEvent("onclick", function(a) {
					var l = arguments[0] || window.event;
					l.cancelBubble = true;
					l.returnValue = false;
					var b = l.clientX;
					var c = l.clientY;
					var d = document.body.parentNode.scrollLeft;
					var k = document.body.parentNode.scrollTop;
					a.srcElement.menuItem.execute(b + d, c + k)
				});
				f.attachEvent("onmousedown", function(a) {
					a.cancelBubble = true;
					a.returnValue = false
				});
				f.attachEvent("onmouseup", function(a) {
					a.cancelBubble = true;
					a.returnValue = false
				});
				f.attachEvent("onmouseover", function(a) {
					a.srcElement.style.backgroundColor = "silver"
				});
				f.attachEvent("onmouseout", function(a) {
					a.srcElement.style.backgroundColor = "transparent"
				})
			}
		}
	}
};
draw2d.MenuItem = function(e, f, d) {
	this.label = e;
	this.iconUrl = f;
	this.parentMenu = null;
	this.action = d
};
draw2d.MenuItem.prototype.type = "draw2d.MenuItem";
draw2d.MenuItem.prototype.isEnabled = function() {
	return true
};
draw2d.MenuItem.prototype.getLabel = function() {
	return this.label
};
draw2d.MenuItem.prototype.execute = function(d, c) {
	this.parentMenu.workflow.showMenu(null);
	this.action(d, c)
};
draw2d.Locator = function() {
};
draw2d.Locator.prototype.type = "draw2d.Locator";
draw2d.Locator.prototype.relocate = function(b) {
};
draw2d.ConnectionLocator = function(b) {
	draw2d.Locator.call(this);
	this.connection = b
};
draw2d.ConnectionLocator.prototype = new draw2d.Locator;
draw2d.ConnectionLocator.prototype.type = "draw2d.ConnectionLocator";
draw2d.ConnectionLocator.prototype.getConnection = function() {
	return this.connection
};
draw2d.ManhattanMidpointLocator = function(b) {
	draw2d.ConnectionLocator.call(this, b)
};
draw2d.ManhattanMidpointLocator.prototype = new draw2d.ConnectionLocator;
draw2d.ManhattanMidpointLocator.prototype.type = "draw2d.ManhattanMidpointLocator";
draw2d.ManhattanMidpointLocator.prototype.relocate = function(k) {
	var h = this.getConnection();
	var l = new draw2d.Point();
	var n = h.getPoints();
	var i = Math.floor((n.getSize() - 2) / 2);
	if (n.getSize() <= i + 1) {
		return
	}
	var j = n.get(i);
	var m = n.get(i + 1);
	l.x = (m.x - j.x) / 2 + j.x + 5;
	l.y = (m.y - j.y) / 2 + j.y + 5;
	k.setPosition(l.x, l.y)
};
draw2d.EditPartFactory = function() {
};
draw2d.EditPartFactory.prototype.type = "draw2d.EditPartFactory";
draw2d.EditPartFactory.prototype.createEditPart = function(b) {
};
draw2d.AbstractObjectModel = function() {
	this.listeners = new draw2d.ArrayList();
	this.id = draw2d.UUID.create()
};
draw2d.AbstractObjectModel.EVENT_ELEMENT_ADDED = "element added";
draw2d.AbstractObjectModel.EVENT_ELEMENT_REMOVED = "element removed";
draw2d.AbstractObjectModel.EVENT_CONNECTION_ADDED = "connection addedx";
draw2d.AbstractObjectModel.EVENT_CONNECTION_REMOVED = "connection removed";
draw2d.AbstractObjectModel.prototype.type = "draw2d.AbstractObjectModel";
draw2d.AbstractObjectModel.prototype.getModelChildren = function() {
	return new draw2d.ArrayList()
};
draw2d.AbstractObjectModel.prototype.getModelParent = function() {
	return this.modelParent
};
draw2d.AbstractObjectModel.prototype.setModelParent = function(b) {
	this.modelParent = b
};
draw2d.AbstractObjectModel.prototype.getId = function() {
	return this.id
};
draw2d.AbstractObjectModel.prototype.firePropertyChange = function(m, n, i) {
	var k = this.listeners.getSize();
	if (k === 0) {
		return
	}
	var l = new draw2d.PropertyChangeEvent(this, m, n, i);
	for (var e = 0; e < k; e++) {
		try {
			this.listeners.get(e).propertyChange(l)
		} catch (j) {
			alert("Method: draw2d.AbstractObjectModel.prototype.firePropertyChange\n"
					+ j
					+ "\nProperty: "
					+ m
					+ "\nListener Class:"
					+ this.listeners.get(e).type)
		}
	}
};
draw2d.AbstractObjectModel.prototype.addPropertyChangeListener = function(b) {
	if (b !== null) {
		this.listeners.add(b)
	}
};
draw2d.AbstractObjectModel.prototype.removePropertyChangeListener = function(b) {
	if (b !== null) {
		this.listeners.remove(b)
	}
};
draw2d.AbstractObjectModel.prototype.getPersistentAttributes = function() {
	return {
		id : this.id
	}
};
draw2d.AbstractConnectionModel = function() {
	draw2d.AbstractObjectModel.call(this)
};
draw2d.AbstractConnectionModel.prototype = new draw2d.AbstractObjectModel();
draw2d.AbstractConnectionModel.prototype.type = "draw2d.AbstractConnectionModel";
draw2d.AbstractConnectionModel.prototype.getSourceModel = function() {
	throw "you must override the method [AbstractConnectionModel.prototype.getSourceModel]"
};
draw2d.AbstractConnectionModel.prototype.getTargetModel = function() {
	throw "you must override the method [AbstractConnectionModel.prototype.getTargetModel]"
};
draw2d.AbstractConnectionModel.prototype.getSourcePortName = function() {
	throw "you must override the method [AbstractConnectionModel.prototype.getSourcePortName]"
};
draw2d.AbstractConnectionModel.prototype.getTargetPortName = function() {
	throw "you must override the method [AbstractConnectionModel.prototype.getTargetPortName]"
};
draw2d.AbstractConnectionModel.prototype.getSourcePortModel = function() {
	throw "you must override the method [AbstractConnectionModel.prototype.getSourcePortModel]"
};
draw2d.AbstractConnectionModel.prototype.getTargetPortModel = function() {
	throw "you must override the method [AbstractConnectionModel.prototype.getTargetPortModel]"
};
draw2d.PropertyChangeEvent = function(e, f, g, h) {
	this.model = e;
	this.property = f;
	this.oldValue = g;
	this.newValue = h
};
draw2d.PropertyChangeEvent.prototype.type = "draw2d.PropertyChangeEvent";
draw2d.GraphicalViewer = function(c) {
	try {
		draw2d.Workflow.call(this, c);
		this.factory = null;
		this.model = null;
		this.initDone = false
	} catch (d) {
		pushErrorStack(d, "draw2d.GraphicalViewer=function(/*:String*/ id)")
	}
};
draw2d.GraphicalViewer.prototype = new draw2d.Workflow();
draw2d.GraphicalViewer.prototype.type = "draw2d.GraphicalViewer";
draw2d.GraphicalViewer.prototype.setEditPartFactory = function(b) {
	this.factory = b;
	this.checkInit()
};
draw2d.GraphicalViewer.prototype.setModel = function(d) {
	try {
		if (d instanceof draw2d.AbstractObjectModel) {
			this.model = d;
			this.checkInit();
			this.model.addPropertyChangeListener(this)
		} else {
			alert("Invalid model class type:" + d.type)
		}
	} catch (c) {
		pushErrorStack(
				c,
				"draw2d.GraphicalViewer.prototype.setModel=function(/*:draw2d.AbstractObjectModel*/ model )")
	}
};
draw2d.GraphicalViewer.prototype.propertyChange = function(d) {
	switch (d.property) {
	case draw2d.AbstractObjectModel.EVENT_ELEMENT_REMOVED:
		var c = this.getFigure(d.oldValue.getId());
		this.removeFigure(c);
		break;
	case draw2d.AbstractObjectModel.EVENT_ELEMENT_ADDED:
		var c = this.factory.createEditPart(d.newValue);
		c.setId(d.newValue.getId());
		this.addFigure(c);
		this.setCurrentSelection(c);
		break
	}
};
draw2d.GraphicalViewer.prototype.checkInit = function() {
	if (this.factory !== null && this.model !== null && this.initDone == false) {
		try {
			var m = this.model.getModelChildren();
			var e = m.getSize();
			for (var i = 0; i < e; i++) {
				var j = m.get(i);
				var k = this.factory.createEditPart(j);
				k.setId(j.getId());
				this.addFigure(k)
			}
		} catch (l) {
			pushErrorStack(l,
					"draw2d.GraphicalViewer.prototype.checkInit=function()[addFigures]")
		}
		try {
			var n = this.getDocument().getFigures();
			var e = n.getSize();
			for (var i = 0; i < e; i++) {
				var k = n.get(i);
				if (k instanceof draw2d.Node) {
					this.refreshConnections(k)
				}
			}
		} catch (l) {
			pushErrorStack(l,
					"draw2d.GraphicalViewer.prototype.checkInit=function()[refreshConnections]")
		}
	}
};
draw2d.GraphicalViewer.prototype.refreshConnections = function(z) {
	try {
		var e = new draw2d.ArrayList();
		var i = z.getModelSourceConnections();
		var I = i.getSize();
		for (var x = 0; x < I; x++) {
			var D = i.get(x);
			e.add(D.getId());
			var G = this.getLine(D.getId());
			if (G === null) {
				G = this.factory.createEditPart(D);
				var J = D.getSourceModel();
				var K = D.getTargetModel();
				var L = this.getFigure(J.getId());
				var N = this.getFigure(K.getId());
				var O = L.getOutputPort(D.getSourcePortName());
				var P = N.getInputPort(D.getTargetPortName());
				G.setTarget(P);
				G.setSource(O);
				G.setId(D.getId());
				this.addFigure(G);
				this.setCurrentSelection(G)
			}
		}
		var y = z.getOutputPorts();
		I = y.getSize();
		for (var x = 0; x < I; x++) {
			var E = y.get(x).getConnections();
			var H = E.getSize();
			for (var B = 0; B < H; B++) {
				var M = E.get(B);
				if (!e.contains(M.getId())) {
					this.removeFigure(M);
					e.add(M.getId())
				}
			}
		}
	} catch (v) {
		pushErrorStack(
				v,
				"draw2d.GraphicalViewer.prototype.refreshConnections=function(/*:draw2d.Node*/ node )")
	}
};
draw2d.GraphicalEditor = function(c) {
	try {
		this.view = new draw2d.GraphicalViewer(c);
		this.initializeGraphicalViewer()
	} catch (d) {
		pushErrorStack(d, "draw2d.GraphicalEditor=function(/*:String*/ id)")
	}
};
draw2d.GraphicalEditor.prototype.type = "draw2d.GraphicalEditor";
draw2d.GraphicalEditor.prototype.initializeGraphicalViewer = function() {
};
draw2d.GraphicalEditor.prototype.getGraphicalViewer = function() {
	return this.view
};
var whitespace = "\n\r\t ";
XMLP = function(b) {
	b = SAXStrings.replace(b, null, null, "\r\n", "\n");
	b = SAXStrings.replace(b, null, null, "\r", "\n");
	this.m_xml = b;
	this.m_iP = 0;
	this.m_iState = XMLP._STATE_PROLOG;
	this.m_stack = new Stack();
	this._clearAttributes()
};
XMLP._NONE = 0;
XMLP._ELM_B = 1;
XMLP._ELM_E = 2;
XMLP._ELM_EMP = 3;
XMLP._ATT = 4;
XMLP._TEXT = 5;
XMLP._ENTITY = 6;
XMLP._PI = 7;
XMLP._CDATA = 8;
XMLP._COMMENT = 9;
XMLP._DTD = 10;
XMLP._ERROR = 11;
XMLP._CONT_XML = 0;
XMLP._CONT_ALT = 1;
XMLP._ATT_NAME = 0;
XMLP._ATT_VAL = 1;
XMLP._STATE_PROLOG = 1;
XMLP._STATE_DOCUMENT = 2;
XMLP._STATE_MISC = 3;
XMLP._errs = [];
XMLP._errs[XMLP.ERR_CLOSE_PI = 0] = "PI: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_DTD = 1] = "DTD: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_COMMENT = 2] = "Comment: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_CDATA = 3] = "CDATA: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_ELM = 4] = "Element: missing closing sequence";
XMLP._errs[XMLP.ERR_CLOSE_ENTITY = 5] = "Entity: missing closing sequence";
XMLP._errs[XMLP.ERR_PI_TARGET = 6] = "PI: target is required";
XMLP._errs[XMLP.ERR_ELM_EMPTY = 7] = "Element: cannot be both empty and closing";
XMLP._errs[XMLP.ERR_ELM_NAME = 8] = 'Element: name must immediatly follow "<"';
XMLP._errs[XMLP.ERR_ELM_LT_NAME = 9] = 'Element: "<" not allowed in element names';
XMLP._errs[XMLP.ERR_ATT_VALUES = 10] = "Attribute: values are required and must be in quotes";
XMLP._errs[XMLP.ERR_ATT_LT_NAME = 11] = 'Element: "<" not allowed in attribute names';
XMLP._errs[XMLP.ERR_ATT_LT_VALUE = 12] = 'Attribute: "<" not allowed in attribute values';
XMLP._errs[XMLP.ERR_ATT_DUP = 13] = "Attribute: duplicate attributes not allowed";
XMLP._errs[XMLP.ERR_ENTITY_UNKNOWN = 14] = "Entity: unknown entity";
XMLP._errs[XMLP.ERR_INFINITELOOP = 15] = "Infininte loop";
XMLP._errs[XMLP.ERR_DOC_STRUCTURE = 16] = "Document: only comments, processing instructions, or whitespace allowed outside of document element";
XMLP._errs[XMLP.ERR_ELM_NESTING = 17] = "Element: must be nested correctly";
XMLP.prototype._addAttribute = function(d, c) {
	this.m_atts[this.m_atts.length] = new Array(d, c)
};
XMLP.prototype._checkStructure = function(d) {
	if (XMLP._STATE_PROLOG == this.m_iState) {
		if ((XMLP._TEXT == d) || (XMLP._ENTITY == d)) {
			if (SAXStrings.indexOfNonWhitespace(this.getContent(), this
					.getContentBegin(), this.getContentEnd()) != -1) {
				return this._setErr(XMLP.ERR_DOC_STRUCTURE)
			}
		}
		if ((XMLP._ELM_B == d) || (XMLP._ELM_EMP == d)) {
			this.m_iState = XMLP._STATE_DOCUMENT
		}
	}
	if (XMLP._STATE_DOCUMENT == this.m_iState) {
		if ((XMLP._ELM_B == d) || (XMLP._ELM_EMP == d)) {
			this.m_stack.push(this.getName())
		}
		if ((XMLP._ELM_E == d) || (XMLP._ELM_EMP == d)) {
			var c = this.m_stack.pop();
			if ((c === null) || (c != this.getName())) {
				return this._setErr(XMLP.ERR_ELM_NESTING)
			}
		}
		if (this.m_stack.count() === 0) {
			this.m_iState = XMLP._STATE_MISC;
			return d
		}
	}
	if (XMLP._STATE_MISC == this.m_iState) {
		if ((XMLP._ELM_B == d) || (XMLP._ELM_E == d) || (XMLP._ELM_EMP == d)
				|| (XMLP.EVT_DTD == d)) {
			return this._setErr(XMLP.ERR_DOC_STRUCTURE)
		}
		if ((XMLP._TEXT == d) || (XMLP._ENTITY == d)) {
			if (SAXStrings.indexOfNonWhitespace(this.getContent(), this
					.getContentBegin(), this.getContentEnd()) != -1) {
				return this._setErr(XMLP.ERR_DOC_STRUCTURE)
			}
		}
	}
	return d
};
XMLP.prototype._clearAttributes = function() {
	this.m_atts = []
};
XMLP.prototype._findAttributeIndex = function(d) {
	for (var c = 0; c < this.m_atts.length; c++) {
		if (this.m_atts[c][XMLP._ATT_NAME] == d) {
			return c
		}
	}
	return -1
};
XMLP.prototype.getAttributeCount = function() {
	return this.m_atts ? this.m_atts.length : 0
};
XMLP.prototype.getAttributeName = function(b) {
	return ((b < 0) || (b >= this.m_atts.length)) ? null
			: this.m_atts[b][XMLP._ATT_NAME]
};
XMLP.prototype.getAttributeValue = function(b) {
	return ((b < 0) || (b >= this.m_atts.length)) ? null
			: __unescapeString(this.m_atts[b][XMLP._ATT_VAL])
};
XMLP.prototype.getAttributeValueByName = function(b) {
	return this.getAttributeValue(this._findAttributeIndex(b))
};
XMLP.prototype.getColumnNumber = function() {
	return SAXStrings.getColumnNumber(this.m_xml, this.m_iP)
};
XMLP.prototype.getContent = function() {
	return (this.m_cSrc == XMLP._CONT_XML) ? this.m_xml : this.m_cAlt
};
XMLP.prototype.getContentBegin = function() {
	return this.m_cB
};
XMLP.prototype.getContentEnd = function() {
	return this.m_cE
};
XMLP.prototype.getLineNumber = function() {
	return SAXStrings.getLineNumber(this.m_xml, this.m_iP)
};
XMLP.prototype.getName = function() {
	return this.m_name
};
XMLP.prototype.next = function() {
	return this._checkStructure(this._parse())
};
XMLP.prototype._parse = function() {
	if (this.m_iP == this.m_xml.length) {
		return XMLP._NONE
	}
	if (this.m_iP == this.m_xml.indexOf("<?", this.m_iP)) {
		return this._parsePI(this.m_iP + 2)
	} else {
		if (this.m_iP == this.m_xml.indexOf("<!DOCTYPE", this.m_iP)) {
			return this._parseDTD(this.m_iP + 9)
		} else {
			if (this.m_iP == this.m_xml.indexOf("<!--", this.m_iP)) {
				return this._parseComment(this.m_iP + 4)
			} else {
				if (this.m_iP == this.m_xml.indexOf("<![CDATA[", this.m_iP)) {
					return this._parseCDATA(this.m_iP + 9)
				} else {
					if (this.m_iP == this.m_xml.indexOf("<", this.m_iP)) {
						return this._parseElement(this.m_iP + 1)
					} else {
						if (this.m_iP == this.m_xml.indexOf("&", this.m_iP)) {
							return this._parseEntity(this.m_iP + 1)
						} else {
							return this._parseText(this.m_iP)
						}
					}
				}
			}
		}
	}
};
XMLP.prototype._parseAttribute = function(p, q) {
	var m, o, k, t, l;
	var r, s, n;
	this.m_cAlt = "";
	m = SAXStrings.indexOfNonWhitespace(this.m_xml, p, q);
	if ((m == -1) || (m >= q)) {
		return m
	}
	k = this.m_xml.indexOf("=", m);
	if ((k == -1) || (k > q)) {
		return this._setErr(XMLP.ERR_ATT_VALUES)
	}
	o = SAXStrings.lastIndexOfNonWhitespace(this.m_xml, m, k);
	t = SAXStrings.indexOfNonWhitespace(this.m_xml, k + 1, q);
	if ((t == -1) || (t > q)) {
		return this._setErr(XMLP.ERR_ATT_VALUES)
	}
	r = this.m_xml.charAt(t);
	if (SAXStrings.QUOTES.indexOf(r) == -1) {
		return this._setErr(XMLP.ERR_ATT_VALUES)
	}
	l = this.m_xml.indexOf(r, t + 1);
	if ((l == -1) || (l > q)) {
		return this._setErr(XMLP.ERR_ATT_VALUES)
	}
	s = this.m_xml.substring(m, o + 1);
	n = this.m_xml.substring(t + 1, l);
	if (s.indexOf("<") != -1) {
		return this._setErr(XMLP.ERR_ATT_LT_NAME)
	}
	if (n.indexOf("<") != -1) {
		return this._setErr(XMLP.ERR_ATT_LT_VALUE)
	}
	n = SAXStrings.replace(n, null, null, "\n", " ");
	n = SAXStrings.replace(n, null, null, "\t", " ");
	iRet = this._replaceEntities(n);
	if (iRet == XMLP._ERROR) {
		return iRet
	}
	n = this.m_cAlt;
	if (this._findAttributeIndex(s) == -1) {
		this._addAttribute(s, n)
	} else {
		return this._setErr(XMLP.ERR_ATT_DUP)
	}
	this.m_iP = l + 2;
	return XMLP._ATT
};
XMLP.prototype._parseCDATA = function(d) {
	var c = this.m_xml.indexOf("]]>", d);
	if (c == -1) {
		return this._setErr(XMLP.ERR_CLOSE_CDATA)
	}
	this._setContent(XMLP._CONT_XML, d, c);
	this.m_iP = c + 3;
	return XMLP._CDATA
};
XMLP.prototype._parseComment = function(d) {
	var c = this.m_xml.indexOf("-->", d);
	if (c == -1) {
		return this._setErr(XMLP.ERR_CLOSE_COMMENT)
	}
	this._setContent(XMLP._CONT_XML, d, c);
	this.m_iP = c + 3;
	return XMLP._COMMENT
};
XMLP.prototype._parseDTD = function(f) {
	var h, g, j, i;
	h = this.m_xml.indexOf(">", f);
	if (h == -1) {
		return this._setErr(XMLP.ERR_CLOSE_DTD)
	}
	j = this.m_xml.indexOf("[", f);
	g = ((j != -1) && (j < h)) ? "]>" : ">";
	while (true) {
		if (h == i) {
			return this._setErr(XMLP.ERR_INFINITELOOP)
		}
		i = h;
		h = this.m_xml.indexOf(g, f);
		if (h == -1) {
			return this._setErr(XMLP.ERR_CLOSE_DTD)
		}
		if (this.m_xml.substring(h - 1, h + 2) != "]]>") {
			break
		}
	}
	this.m_iP = h + g.length;
	return XMLP._DTD
};
XMLP.prototype._parseElement = function(i) {
	var l, k, m, p;
	var o, j, n;
	k = l = this.m_xml.indexOf(">", i);
	if (l == -1) {
		return this._setErr(XMLP.ERR_CLOSE_ELM)
	}
	if (this.m_xml.charAt(i) == "/") {
		o = XMLP._ELM_E;
		i++
	} else {
		o = XMLP._ELM_B
	}
	if (this.m_xml.charAt(l - 1) == "/") {
		if (o == XMLP._ELM_E) {
			return this._setErr(XMLP.ERR_ELM_EMPTY)
		}
		o = XMLP._ELM_EMP;
		k--
	}
	k = SAXStrings.lastIndexOfNonWhitespace(this.m_xml, i, k);
	if (l - i != 1) {
		if (SAXStrings.indexOfNonWhitespace(this.m_xml, i, k) != i) {
			return this._setErr(XMLP.ERR_ELM_NAME)
		}
	}
	this._clearAttributes();
	m = SAXStrings.indexOfWhitespace(this.m_xml, i, k);
	if (m == -1) {
		m = k + 1
	} else {
		this.m_iP = m;
		while (this.m_iP < k) {
			if (this.m_iP == n) {
				return this._setErr(XMLP.ERR_INFINITELOOP)
			}
			n = this.m_iP;
			p = this._parseAttribute(this.m_iP, k);
			if (p == XMLP._ERROR) {
				return p
			}
		}
	}
	j = this.m_xml.substring(i, m);
	if (j.indexOf("<") != -1) {
		return this._setErr(XMLP.ERR_ELM_LT_NAME)
	}
	this.m_name = j;
	this.m_iP = l + 1;
	return o
};
XMLP.prototype._parseEntity = function(d) {
	var c = this.m_xml.indexOf(";", d);
	if (c == -1) {
		return this._setErr(XMLP.ERR_CLOSE_ENTITY)
	}
	this.m_iP = c + 1;
	return this._replaceEntity(this.m_xml, d, c)
};
XMLP.prototype._parsePI = function(g) {
	var j, h, k, i, l;
	j = this.m_xml.indexOf("?>", g);
	if (j == -1) {
		return this._setErr(XMLP.ERR_CLOSE_PI)
	}
	h = SAXStrings.indexOfNonWhitespace(this.m_xml, g, j);
	if (h == -1) {
		return this._setErr(XMLP.ERR_PI_TARGET)
	}
	k = SAXStrings.indexOfWhitespace(this.m_xml, h, j);
	if (k == -1) {
		k = j
	}
	i = SAXStrings.indexOfNonWhitespace(this.m_xml, k, j);
	if (i == -1) {
		i = j
	}
	l = SAXStrings.lastIndexOfNonWhitespace(this.m_xml, i, j);
	if (l == -1) {
		l = j - 1
	}
	this.m_name = this.m_xml.substring(h, k);
	this._setContent(XMLP._CONT_XML, i, l + 1);
	this.m_iP = j + 2;
	return XMLP._PI
};
XMLP.prototype._parseText = function(d) {
	var f, e;
	f = this.m_xml.indexOf("<", d);
	if (f == -1) {
		f = this.m_xml.length
	}
	e = this.m_xml.indexOf("&", d);
	if ((e != -1) && (e <= f)) {
		f = e
	}
	this._setContent(XMLP._CONT_XML, d, f);
	this.m_iP = f;
	return XMLP._TEXT
};
XMLP.prototype._replaceEntities = function(i, g, k) {
	if (SAXStrings.isEmpty(i)) {
		return ""
	}
	g = g || 0;
	k = k || i.length;
	var l, h, j = "";
	l = i.indexOf("&", g);
	h = g;
	while ((l > 0) && (l < k)) {
		j += i.substring(h, l);
		h = i.indexOf(";", l) + 1;
		if ((h === 0) || (h > k)) {
			return this._setErr(XMLP.ERR_CLOSE_ENTITY)
		}
		iRet = this._replaceEntity(i, l + 1, h - 1);
		if (iRet == XMLP._ERROR) {
			return iRet
		}
		j += this.m_cAlt;
		l = i.indexOf("&", h)
	}
	if (h != k) {
		j += i.substring(h, k)
	}
	this._setContent(XMLP._CONT_ALT, j);
	return XMLP._ENTITY
};
XMLP.prototype._replaceEntity = function(f, e, d) {
	if (SAXStrings.isEmpty(f)) {
		return -1
	}
	e = e || 0;
	d = d || f.length;
	switch (f.substring(e, d)) {
	case "amp":
		strEnt = "&";
		break;
	case "lt":
		strEnt = "<";
		break;
	case "gt":
		strEnt = ">";
		break;
	case "apos":
		strEnt = "'";
		break;
	case "quot":
		strEnt = '"';
		break;
	default:
		if (f.charAt(e) == "#") {
			strEnt = String.fromCharCode(parseInt(f.substring(e + 1, d)))
		} else {
			return this._setErr(XMLP.ERR_ENTITY_UNKNOWN)
		}
		break
	}
	this._setContent(XMLP._CONT_ALT, strEnt);
	return XMLP._ENTITY
};
XMLP.prototype._setContent = function(c) {
	var d = arguments;
	if (XMLP._CONT_XML == c) {
		this.m_cAlt = null;
		this.m_cB = d[1];
		this.m_cE = d[2]
	} else {
		this.m_cAlt = d[1];
		this.m_cB = 0;
		this.m_cE = d[1].length
	}
	this.m_cSrc = c
};
XMLP.prototype._setErr = function(c) {
	var d = XMLP._errs[c];
	this.m_cAlt = d;
	this.m_cB = 0;
	this.m_cE = d.length;
	this.m_cSrc = XMLP._CONT_ALT;
	return XMLP._ERROR
};
SAXDriver = function() {
	this.m_hndDoc = null;
	this.m_hndErr = null;
	this.m_hndLex = null
};
SAXDriver.DOC_B = 1;
SAXDriver.DOC_E = 2;
SAXDriver.ELM_B = 3;
SAXDriver.ELM_E = 4;
SAXDriver.CHARS = 5;
SAXDriver.PI = 6;
SAXDriver.CD_B = 7;
SAXDriver.CD_E = 8;
SAXDriver.CMNT = 9;
SAXDriver.DTD_B = 10;
SAXDriver.DTD_E = 11;
SAXDriver.prototype.parse = function(c) {
	var d = new XMLP(c);
	if (this.m_hndDoc && this.m_hndDoc.setDocumentLocator) {
		this.m_hndDoc.setDocumentLocator(this)
	}
	this.m_parser = d;
	this.m_bErr = false;
	if (!this.m_bErr) {
		this._fireEvent(SAXDriver.DOC_B)
	}
	this._parseLoop();
	if (!this.m_bErr) {
		this._fireEvent(SAXDriver.DOC_E)
	}
	this.m_xml = null;
	this.m_iP = 0
};
SAXDriver.prototype.setDocumentHandler = function(b) {
	this.m_hndDoc = b
};
SAXDriver.prototype.setErrorHandler = function(b) {
	this.m_hndErr = b
};
SAXDriver.prototype.setLexicalHandler = function(b) {
	this.m_hndLex = b
};
SAXDriver.prototype.getColumnNumber = function() {
	return this.m_parser.getColumnNumber()
};
SAXDriver.prototype.getLineNumber = function() {
	return this.m_parser.getLineNumber()
};
SAXDriver.prototype.getMessage = function() {
	return this.m_strErrMsg
};
SAXDriver.prototype.getPublicId = function() {
	return null
};
SAXDriver.prototype.getSystemId = function() {
	return null
};
SAXDriver.prototype.getLength = function() {
	return this.m_parser.getAttributeCount()
};
SAXDriver.prototype.getName = function(b) {
	return this.m_parser.getAttributeName(b)
};
SAXDriver.prototype.getValue = function(b) {
	return this.m_parser.getAttributeValue(b)
};
SAXDriver.prototype.getValueByName = function(b) {
	return this.m_parser.getAttributeValueByName(b)
};
SAXDriver.prototype._fireError = function(b) {
	this.m_strErrMsg = b;
	this.m_bErr = true;
	if (this.m_hndErr && this.m_hndErr.fatalError) {
		this.m_hndErr.fatalError(this)
	}
};
SAXDriver.prototype._fireEvent = function(j) {
	var f, h, i = arguments, g = i.length - 1;
	if (this.m_bErr) {
		return
	}
	if (SAXDriver.DOC_B == j) {
		h = "startDocument";
		f = this.m_hndDoc
	} else {
		if (SAXDriver.DOC_E == j) {
			h = "endDocument";
			f = this.m_hndDoc
		} else {
			if (SAXDriver.ELM_B == j) {
				h = "startElement";
				f = this.m_hndDoc
			} else {
				if (SAXDriver.ELM_E == j) {
					h = "endElement";
					f = this.m_hndDoc
				} else {
					if (SAXDriver.CHARS == j) {
						h = "characters";
						f = this.m_hndDoc
					} else {
						if (SAXDriver.PI == j) {
							h = "processingInstruction";
							f = this.m_hndDoc
						} else {
							if (SAXDriver.CD_B == j) {
								h = "startCDATA";
								f = this.m_hndLex
							} else {
								if (SAXDriver.CD_E == j) {
									h = "endCDATA";
									f = this.m_hndLex
								} else {
									if (SAXDriver.CMNT == j) {
										h = "comment";
										f = this.m_hndLex
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if (f && f[h]) {
		if (0 == g) {
			f[h]()
		} else {
			if (1 == g) {
				f[h](i[1])
			} else {
				if (2 == g) {
					f[h](i[1], i[2])
				} else {
					if (3 == g) {
						f[h](i[1], i[2], i[3])
					}
				}
			}
		}
	}
};
SAXDriver.prototype._parseLoop = function(c) {
	var d, c;
	c = this.m_parser;
	while (!this.m_bErr) {
		d = c.next();
		if (d == XMLP._ELM_B) {
			this._fireEvent(SAXDriver.ELM_B, c.getName(), this)
		} else {
			if (d == XMLP._ELM_E) {
				this._fireEvent(SAXDriver.ELM_E, c.getName())
			} else {
				if (d == XMLP._ELM_EMP) {
					this._fireEvent(SAXDriver.ELM_B, c.getName(), this);
					this._fireEvent(SAXDriver.ELM_E, c.getName())
				} else {
					if (d == XMLP._TEXT) {
						this._fireEvent(SAXDriver.CHARS, c.getContent(), c
								.getContentBegin(), c.getContentEnd()
								- c.getContentBegin())
					} else {
						if (d == XMLP._ENTITY) {
							this._fireEvent(SAXDriver.CHARS, c.getContent(), c
									.getContentBegin(), c.getContentEnd()
									- c.getContentBegin())
						} else {
							if (d == XMLP._PI) {
								this._fireEvent(SAXDriver.PI, c.getName(), c
										.getContent().substring(
												c.getContentBegin(),
												c.getContentEnd()))
							} else {
								if (d == XMLP._CDATA) {
									this._fireEvent(SAXDriver.CD_B);
									this._fireEvent(SAXDriver.CHARS, c
											.getContent(), c.getContentBegin(),
											c.getContentEnd()
													- c.getContentBegin());
									this._fireEvent(SAXDriver.CD_E)
								} else {
									if (d == XMLP._COMMENT) {
										this._fireEvent(SAXDriver.CMNT, c
												.getContent(), c
												.getContentBegin(), c
												.getContentEnd()
												- c.getContentBegin())
									} else {
										if (d == XMLP._DTD) {
										} else {
											if (d == XMLP._ERROR) {
												this._fireError(c.getContent())
											} else {
												if (d == XMLP._NONE) {
													return
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
SAXStrings = function() {
};
SAXStrings.WHITESPACE = " \t\n\r";
SAXStrings.QUOTES = "\"'";
SAXStrings.getColumnNumber = function(h, i) {
	if (SAXStrings.isEmpty(h)) {
		return -1
	}
	i = i || h.length;
	var j = h.substring(0, i).split("\n");
	var f = j[j.length - 1];
	j.length--;
	var g = j.join("\n").length;
	return i - g
};
SAXStrings.getLineNumber = function(c, d) {
	if (SAXStrings.isEmpty(c)) {
		return -1
	}
	d = d || c.length;
	return c.substring(0, d).split("\n").length
};
SAXStrings.indexOfNonWhitespace = function(g, f, h) {
	if (SAXStrings.isEmpty(g)) {
		return -1
	}
	f = f || 0;
	h = h || g.length;
	for (var e = f; e < h; e++) {
		if (SAXStrings.WHITESPACE.indexOf(g.charAt(e)) == -1) {
			return e
		}
	}
	return -1
};
SAXStrings.indexOfWhitespace = function(g, f, h) {
	if (SAXStrings.isEmpty(g)) {
		return -1
	}
	f = f || 0;
	h = h || g.length;
	for (var e = f; e < h; e++) {
		if (SAXStrings.WHITESPACE.indexOf(g.charAt(e)) != -1) {
			return e
		}
	}
	return -1
};
SAXStrings.isEmpty = function(b) {
	return (b === null) || (b.length === 0)
};
SAXStrings.lastIndexOfNonWhitespace = function(g, f, h) {
	if (SAXStrings.isEmpty(g)) {
		return -1
	}
	f = f || 0;
	h = h || g.length;
	for (var e = h - 1; e >= f; e--) {
		if (SAXStrings.WHITESPACE.indexOf(g.charAt(e)) == -1) {
			return e
		}
	}
	return -1
};
SAXStrings.replace = function(h, g, i, j, f) {
	if (SAXStrings.isEmpty(h)) {
		return ""
	}
	g = g || 0;
	i = i || h.length;
	return h.substring(g, i).split(j).join(f)
};
Stack = function() {
	this.m_arr = []
};
Stack.prototype.clear = function() {
	this.m_arr = []
};
Stack.prototype.count = function() {
	return this.m_arr.length
};
Stack.prototype.destroy = function() {
	this.m_arr = null
};
Stack.prototype.peek = function() {
	if (this.m_arr.length === 0) {
		return null
	}
	return this.m_arr[this.m_arr.length - 1]
};
Stack.prototype.pop = function() {
	if (this.m_arr.length === 0) {
		return null
	}
	var b = this.m_arr[this.m_arr.length - 1];
	this.m_arr.length--;
	return b
};
Stack.prototype.push = function(b) {
	this.m_arr[this.m_arr.length] = b
};
function isEmpty(b) {
	return (b === null) || (b.length == 0)
}
function trim(h, j, i) {
	if (isEmpty(h)) {
		return ""
	}
	if (j === null) {
		j = true
	}
	if (i === null) {
		i = true
	}
	var k = 0;
	var l = 0;
	var m = 0;
	var n = 0;
	if (j == true) {
		while ((m < h.length) && (whitespace.indexOf(h.charAt(m++)) != -1)) {
			k++
		}
	}
	if (i == true) {
		n = h.length - 1;
		while ((n >= k) && (whitespace.indexOf(h.charAt(n--)) != -1)) {
			l++
		}
	}
	return h.substring(k, h.length - l)
}
function __escapeString(i) {
	var k = /&/g;
	var l = /</g;
	var g = />/g;
	var h = /"/g;
	var j = /'/g;
	i = i.replace(k, "&amp;");
	i = i.replace(l, "&lt;");
	i = i.replace(g, "&gt;");
	i = i.replace(h, "&quot;");
	i = i.replace(j, "&apos;");
	return i
}
function __unescapeString(i) {
	var j = /&amp;/g;
	var k = /&lt;/g;
	var l = /&gt;/g;
	var h = /&quot;/g;
	var g = /&apos;/g;
	i = i.replace(j, "&");
	i = i.replace(k, "<");
	i = i.replace(l, ">");
	i = i.replace(h, '"');
	i = i.replace(g, "'");
	return i
}
function addClass(c, d) {
	if (c) {
		if (c.indexOf("|" + d + "|") < 0) {
			c += d + "|"
		}
	} else {
		c = "|" + d + "|"
	}
	return c
}
DOMException = function(b) {
	this._class = addClass(this._class, "DOMException");
	this.code = b
};
DOMException.INDEX_SIZE_ERR = 1;
DOMException.DOMSTRING_SIZE_ERR = 2;
DOMException.HIERARCHY_REQUEST_ERR = 3;
DOMException.WRONG_DOCUMENT_ERR = 4;
DOMException.INVALID_CHARACTER_ERR = 5;
DOMException.NO_DATA_ALLOWED_ERR = 6;
DOMException.NO_MODIFICATION_ALLOWED_ERR = 7;
DOMException.NOT_FOUND_ERR = 8;
DOMException.NOT_SUPPORTED_ERR = 9;
DOMException.INUSE_ATTRIBUTE_ERR = 10;
DOMException.INVALID_STATE_ERR = 11;
DOMException.SYNTAX_ERR = 12;
DOMException.INVALID_MODIFICATION_ERR = 13;
DOMException.NAMESPACE_ERR = 14;
DOMException.INVALID_ACCESS_ERR = 15;
DOMImplementation = function() {
	this._class = addClass(this._class, "DOMImplementation");
	this._p = null;
	this.preserveWhiteSpace = false;
	this.namespaceAware = true;
	this.errorChecking = true
};
DOMImplementation.prototype.escapeString = function DOMNode__escapeString(b) {
	return __escapeString(b)
};
DOMImplementation.prototype.unescapeString = function DOMNode__unescapeString(b) {
	return __unescapeString(b)
};
DOMImplementation.prototype.hasFeature = function DOMImplementation_hasFeature(
		d, f) {
	var e = false;
	if (d.toLowerCase() == "xml") {
		e = (!f || (f == "1.0") || (f == "2.0"))
	} else {
		if (d.toLowerCase() == "core") {
			e = (!f || (f == "2.0"))
		}
	}
	return e
};
DOMImplementation.prototype.loadXML = function DOMImplementation_loadXML(e) {
	var f;
	try {
		f = new XMLP(e)
	} catch (g) {
		alert("Error Creating the SAX Parser. Did you include xmlsax.js or tinyxmlsax.js in your web page?\nThe SAX parser is needed to populate XML for <SCRIPT>'s W3C DOM Parser with data.")
	}
	var h = new DOMDocument(this);
	this._parseLoop(h, f);
	h._parseComplete = true;
	return h
};
DOMImplementation.prototype.translateErrCode = function DOMImplementation_translateErrCode(
		d) {
	var c = "";
	switch (d) {
	case DOMException.INDEX_SIZE_ERR:
		c = "INDEX_SIZE_ERR: Index out of bounds";
		break;
	case DOMException.DOMSTRING_SIZE_ERR:
		c = "DOMSTRING_SIZE_ERR: The resulting string is too long to fit in a DOMString";
		break;
	case DOMException.HIERARCHY_REQUEST_ERR:
		c = "HIERARCHY_REQUEST_ERR: The Node can not be inserted at this location";
		break;
	case DOMException.WRONG_DOCUMENT_ERR:
		c = "WRONG_DOCUMENT_ERR: The source and the destination Documents are not the same";
		break;
	case DOMException.INVALID_CHARACTER_ERR:
		c = "INVALID_CHARACTER_ERR: The string contains an invalid character";
		break;
	case DOMException.NO_DATA_ALLOWED_ERR:
		c = "NO_DATA_ALLOWED_ERR: This Node / NodeList does not support data";
		break;
	case DOMException.NO_MODIFICATION_ALLOWED_ERR:
		c = "NO_MODIFICATION_ALLOWED_ERR: This object cannot be modified";
		break;
	case DOMException.NOT_FOUND_ERR:
		c = "NOT_FOUND_ERR: The item cannot be found";
		break;
	case DOMException.NOT_SUPPORTED_ERR:
		c = "NOT_SUPPORTED_ERR: This implementation does not support function";
		break;
	case DOMException.INUSE_ATTRIBUTE_ERR:
		c = "INUSE_ATTRIBUTE_ERR: The Attribute has already been assigned to another Element";
		break;
	case DOMException.INVALID_STATE_ERR:
		c = "INVALID_STATE_ERR: The object is no longer usable";
		break;
	case DOMException.SYNTAX_ERR:
		c = "SYNTAX_ERR: Syntax error";
		break;
	case DOMException.INVALID_MODIFICATION_ERR:
		c = "INVALID_MODIFICATION_ERR: Cannot change the type of the object";
		break;
	case DOMException.NAMESPACE_ERR:
		c = "NAMESPACE_ERR: The namespace declaration is incorrect";
		break;
	case DOMException.INVALID_ACCESS_ERR:
		c = "INVALID_ACCESS_ERR: The object does not support this function";
		break;
	default:
		c = "UNKNOWN: Unknown Exception Code (" + d + ")"
	}
	return c
};
DOMImplementation.prototype._parseLoop = function DOMImplementation__parseLoop(
		K, P) {
	var Q, L, M, R;
	iNodeParent = K;
	var I = 0;
	var J = [];
	var N = [];
	if (this.namespaceAware) {
		var G = K.createNamespace("");
		G.setValue("http://www.w3.org/2000/xmlns/");
		K._namespaces.setNamedItem(G)
	}
	while (true) {
		Q = P.next();
		if (Q == XMLP._ELM_B) {
			var S = P.getName();
			S = trim(S, true, true);
			if (!this.namespaceAware) {
				L = K.createElement(P.getName());
				for (var H = 0; H < P.getAttributeCount(); H++) {
					R = P.getAttributeName(H);
					M = L.getAttributeNode(R);
					if (!M) {
						M = K.createAttribute(R)
					}
					M.setValue(P.getAttributeValue(H));
					L.setAttributeNode(M)
				}
			} else {
				L = K.createElementNS("", P.getName());
				L._namespaces = iNodeParent._namespaces._cloneNodes(L);
				for (var H = 0; H < P.getAttributeCount(); H++) {
					R = P.getAttributeName(H);
					if (this._isNamespaceDeclaration(R)) {
						var U = this._parseNSName(R);
						if (R != "xmlns") {
							G = K.createNamespace(R)
						} else {
							G = K.createNamespace("")
						}
						G.setValue(P.getAttributeValue(H));
						L._namespaces.setNamedItem(G)
					} else {
						M = L.getAttributeNode(R);
						if (!M) {
							M = K.createAttributeNS("", R)
						}
						M.setValue(P.getAttributeValue(H));
						L.setAttributeNodeNS(M);
						if (this._isIdDeclaration(R)) {
							L.id = P.getAttributeValue(H)
						}
					}
				}
				if (L._namespaces.getNamedItem(L.prefix)) {
					L.namespaceURI = L._namespaces.getNamedItem(L.prefix).value
				}
				for (var H = 0; H < L.attributes.length; H++) {
					if (L.attributes.item(H).prefix != "") {
						if (L._namespaces
								.getNamedItem(L.attributes.item(H).prefix)) {
							L.attributes.item(H).namespaceURI = L._namespaces
									.getNamedItem(L.attributes.item(H).prefix).value
						}
					}
				}
			}
			if (iNodeParent.nodeType == DOMNode.DOCUMENT_NODE) {
				iNodeParent.documentElement = L
			}
			iNodeParent.appendChild(L);
			iNodeParent = L
		} else {
			if (Q == XMLP._ELM_E) {
				iNodeParent = iNodeParent.parentNode
			} else {
				if (Q == XMLP._ELM_EMP) {
					S = P.getName();
					S = trim(S, true, true);
					if (!this.namespaceAware) {
						L = K.createElement(S);
						for (var H = 0; H < P.getAttributeCount(); H++) {
							R = P.getAttributeName(H);
							M = L.getAttributeNode(R);
							if (!M) {
								M = K.createAttribute(R)
							}
							M.setValue(P.getAttributeValue(H));
							L.setAttributeNode(M)
						}
					} else {
						L = K.createElementNS("", P.getName());
						L._namespaces = iNodeParent._namespaces._cloneNodes(L);
						for (var H = 0; H < P.getAttributeCount(); H++) {
							R = P.getAttributeName(H);
							if (this._isNamespaceDeclaration(R)) {
								var U = this._parseNSName(R);
								if (R != "xmlns") {
									G = K.createNamespace(R)
								} else {
									G = K.createNamespace("")
								}
								G.setValue(P.getAttributeValue(H));
								L._namespaces.setNamedItem(G)
							} else {
								M = L.getAttributeNode(R);
								if (!M) {
									M = K.createAttributeNS("", R)
								}
								M.setValue(P.getAttributeValue(H));
								L.setAttributeNodeNS(M);
								if (this._isIdDeclaration(R)) {
									L.id = P.getAttributeValue(H)
								}
							}
						}
						if (L._namespaces.getNamedItem(L.prefix)) {
							L.namespaceURI = L._namespaces
									.getNamedItem(L.prefix).value
						}
						for (var H = 0; H < L.attributes.length; H++) {
							if (L.attributes.item(H).prefix != "") {
								if (L._namespaces.getNamedItem(L.attributes
										.item(H).prefix)) {
									L.attributes.item(H).namespaceURI = L._namespaces
											.getNamedItem(L.attributes.item(H).prefix).value
								}
							}
						}
					}
					if (iNodeParent.nodeType == DOMNode.DOCUMENT_NODE) {
						iNodeParent.documentElement = L
					}
					iNodeParent.appendChild(L)
				} else {
					if (Q == XMLP._TEXT || Q == XMLP._ENTITY) {
						var V = P.getContent().substring(P.getContentBegin(),
								P.getContentEnd());
						if (!this.preserveWhiteSpace) {
							if (trim(V, true, true) == "") {
								V = ""
							}
						}
						if (V.length > 0) {
							var W = K.createTextNode(V);
							iNodeParent.appendChild(W);
							if (Q == XMLP._ENTITY) {
								J[J.length] = W
							} else {
								N[N.length] = W
							}
						}
					} else {
						if (Q == XMLP._PI) {
							iNodeParent.appendChild(K
									.createProcessingInstruction(P.getName(), P
											.getContent().substring(
													P.getContentBegin(),
													P.getContentEnd())))
						} else {
							if (Q == XMLP._CDATA) {
								V = P.getContent().substring(
										P.getContentBegin(), P.getContentEnd());
								if (!this.preserveWhiteSpace) {
									V = trim(V, true, true);
									V.replace(/ +/g, " ")
								}
								if (V.length > 0) {
									iNodeParent.appendChild(K
											.createCDATASection(V))
								}
							} else {
								if (Q == XMLP._COMMENT) {
									var V = P.getContent().substring(
											P.getContentBegin(),
											P.getContentEnd());
									if (!this.preserveWhiteSpace) {
										V = trim(V, true, true);
										V.replace(/ +/g, " ")
									}
									if (V.length > 0) {
										iNodeParent.appendChild(K
												.createComment(V))
									}
								} else {
									if (Q == XMLP._DTD) {
									} else {
										if (Q == XMLP._ERROR) {
											throw (new DOMException(
													DOMException.SYNTAX_ERR))
										} else {
											if (Q == XMLP._NONE) {
												if (iNodeParent == K) {
													break
												} else {
													throw (new DOMException(
															DOMException.SYNTAX_ERR))
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	var X = J.length;
	for (intLoop = 0; intLoop < X; intLoop++) {
		var Z = J[intLoop];
		var i = Z.getParentNode();
		if (i) {
			i.normalize();
			if (!this.preserveWhiteSpace) {
				var p = i.getChildNodes();
				var D = p.getLength();
				for (intLoop2 = 0; intLoop2 < D; intLoop2++) {
					var T = p.item(intLoop2);
					if (T.getNodeType() == DOMNode.TEXT_NODE) {
						var E = T.getData();
						E = trim(E, true, true);
						E.replace(/ +/g, " ");
						T.setData(E)
					}
				}
			}
		}
	}
	if (!this.preserveWhiteSpace) {
		var X = N.length;
		for (intLoop = 0; intLoop < X; intLoop++) {
			var O = N[intLoop];
			if (O.getParentNode() !== null) {
				var Y = O.getData();
				Y = trim(Y, true, true);
				Y.replace(/ +/g, " ");
				O.setData(Y)
			}
		}
	}
};
DOMImplementation.prototype._isNamespaceDeclaration = function DOMImplementation__isNamespaceDeclaration(
		b) {
	return (b.indexOf("xmlns") > -1)
};
DOMImplementation.prototype._isIdDeclaration = function DOMImplementation__isIdDeclaration(
		b) {
	return (b.toLowerCase() == "id")
};
DOMImplementation.prototype._isValidName = function DOMImplementation__isValidName(
		b) {
	return b.match(re_validName)
};
re_validName = /^[a-zA-Z_:][a-zA-Z0-9\.\-_:]*$/;
DOMImplementation.prototype._isValidString = function DOMImplementation__isValidString(
		b) {
	return (b.search(re_invalidStringChars) < 0)
};
re_invalidStringChars = /\x01|\x02|\x03|\x04|\x05|\x06|\x07|\x08|\x0B|\x0C|\x0E|\x0F|\x10|\x11|\x12|\x13|\x14|\x15|\x16|\x17|\x18|\x19|\x1A|\x1B|\x1C|\x1D|\x1E|\x1F|\x7F/;
DOMImplementation.prototype._parseNSName = function DOMImplementation__parseNSName(
		c) {
	var d = {};
	d.prefix = c;
	d.namespaceName = "";
	delimPos = c.indexOf(":");
	if (delimPos > -1) {
		d.prefix = c.substring(0, delimPos);
		d.namespaceName = c.substring(delimPos + 1, c.length)
	}
	return d
};
DOMImplementation.prototype._parseQName = function DOMImplementation__parseQName(
		c) {
	var d = {};
	d.localName = c;
	d.prefix = "";
	delimPos = c.indexOf(":");
	if (delimPos > -1) {
		d.prefix = c.substring(0, delimPos);
		d.localName = c.substring(delimPos + 1, c.length)
	}
	return d
};
DOMNodeList = function(c, d) {
	this._class = addClass(this._class, "DOMNodeList");
	this._nodes = [];
	this.length = 0;
	this.parentNode = d;
	this.ownerDocument = c;
	this._readonly = false
};
DOMNodeList.prototype.getLength = function DOMNodeList_getLength() {
	return this.length
};
DOMNodeList.prototype.item = function DOMNodeList_item(c) {
	var d = null;
	if ((c >= 0) && (c < this._nodes.length)) {
		d = this._nodes[c]
	}
	return d
};
DOMNodeList.prototype._findItemIndex = function DOMNodeList__findItemIndex(f) {
	var e = -1;
	if (f > -1) {
		for (var d = 0; d < this._nodes.length; d++) {
			if (this._nodes[d]._id == f) {
				e = d;
				break
			}
		}
	}
	return e
};
DOMNodeList.prototype._insertBefore = function DOMNodeList__insertBefore(f, d) {
	if ((d >= 0) && (d < this._nodes.length)) {
		var e = [];
		e = this._nodes.slice(0, d);
		if (f.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {
			e = e.concat(f.childNodes._nodes)
		} else {
			e[e.length] = f
		}
		this._nodes = e.concat(this._nodes.slice(d));
		this.length = this._nodes.length
	}
};
DOMNodeList.prototype._replaceChild = function DOMNodeList__replaceChild(f, g) {
	var e = null;
	if ((g >= 0) && (g < this._nodes.length)) {
		e = this._nodes[g];
		if (f.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {
			var h = [];
			h = this._nodes.slice(0, g);
			h = h.concat(f.childNodes._nodes);
			this._nodes = h.concat(this._nodes.slice(g + 1))
		} else {
			this._nodes[g] = f
		}
	}
	return e
};
DOMNodeList.prototype._removeChild = function DOMNodeList__removeChild(f) {
	var e = null;
	if (f > -1) {
		e = this._nodes[f];
		var d = [];
		d = this._nodes.slice(0, f);
		this._nodes = d.concat(this._nodes.slice(f + 1));
		this.length = this._nodes.length
	}
	return e
};
DOMNodeList.prototype._appendChild = function DOMNodeList__appendChild(b) {
	if (b.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {
		this._nodes = this._nodes.concat(b.childNodes._nodes)
	} else {
		this._nodes[this._nodes.length] = b
	}
	this.length = this._nodes.length
};
DOMNodeList.prototype._cloneNodes = function DOMNodeList__cloneNodes(f, g) {
	var e = new DOMNodeList(this.ownerDocument, g);
	for (var h = 0; h < this._nodes.length; h++) {
		e._appendChild(this._nodes[h].cloneNode(f))
	}
	return e
};
DOMNodeList.prototype.toString = function DOMNodeList_toString() {
	var d = "";
	for (var c = 0; c < this.length; c++) {
		d += this._nodes[c].toString()
	}
	return d
};
DOMNamedNodeMap = function(c, d) {
	this._class = addClass(this._class, "DOMNamedNodeMap");
	this.DOMNodeList = DOMNodeList;
	this.DOMNodeList(c, d)
};
DOMNamedNodeMap.prototype = new DOMNodeList;
DOMNamedNodeMap.prototype.getNamedItem = function DOMNamedNodeMap_getNamedItem(
		f) {
	var d = null;
	var e = this._findNamedItemIndex(f);
	if (e > -1) {
		d = this._nodes[e]
	}
	return d
};
DOMNamedNodeMap.prototype.setNamedItem = function DOMNamedNodeMap_setNamedItem(
		d) {
	if (this.ownerDocument.implementation.errorChecking) {
		if (this.ownerDocument != d.ownerDocument) {
			throw (new DOMException(DOMException.WRONG_DOCUMENT_ERR))
		}
		if (this._readonly || (this.parentNode && this.parentNode._readonly)) {
			throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
		}
		if (d.ownerElement && (d.ownerElement != this.parentNode)) {
			throw (new DOMException(DOMException.INUSE_ATTRIBUTE_ERR))
		}
	}
	var e = this._findNamedItemIndex(d.name);
	var f = null;
	if (e > -1) {
		f = this._nodes[e];
		if (this.ownerDocument.implementation.errorChecking && f._readonly) {
			throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
		} else {
			this._nodes[e] = d
		}
	} else {
		this._nodes[this.length] = d
	}
	this.length = this._nodes.length;
	d.ownerElement = this.parentNode;
	return f
};
DOMNamedNodeMap.prototype.removeNamedItem = function DOMNamedNodeMap_removeNamedItem(
		e) {
	var f = null;
	if (this.ownerDocument.implementation.errorChecking
			&& (this._readonly || (this.parentNode && this.parentNode._readonly))) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	var g = this._findNamedItemIndex(e);
	if (this.ownerDocument.implementation.errorChecking && (g < 0)) {
		throw (new DOMException(DOMException.NOT_FOUND_ERR))
	}
	var h = this._nodes[g];
	if (this.ownerDocument.implementation.errorChecking && h._readonly) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	return this._removeChild(g)
};
DOMNamedNodeMap.prototype.getNamedItemNS = function DOMNamedNodeMap_getNamedItemNS(
		h, e) {
	var f = null;
	var g = this._findNamedItemNSIndex(h, e);
	if (g > -1) {
		f = this._nodes[g]
	}
	return f
};
DOMNamedNodeMap.prototype.setNamedItemNS = function DOMNamedNodeMap_setNamedItemNS(
		e) {
	if (this.ownerDocument.implementation.errorChecking) {
		if (this._readonly || (this.parentNode && this.parentNode._readonly)) {
			throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
		}
		if (this.ownerDocument != e.ownerDocument) {
			throw (new DOMException(DOMException.WRONG_DOCUMENT_ERR))
		}
		if (e.ownerElement && (e.ownerElement != this.parentNode)) {
			throw (new DOMException(DOMException.INUSE_ATTRIBUTE_ERR))
		}
	}
	var f = this._findNamedItemNSIndex(e.namespaceURI, e.localName);
	var d = null;
	if (f > -1) {
		d = this._nodes[f];
		if (this.ownerDocument.implementation.errorChecking && d._readonly) {
			throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
		} else {
			this._nodes[f] = e
		}
	} else {
		this._nodes[this.length] = e
	}
	this.length = this._nodes.length;
	e.ownerElement = this.parentNode;
	return d
};
DOMNamedNodeMap.prototype.removeNamedItemNS = function DOMNamedNodeMap_removeNamedItemNS(
		i, h) {
	var j = null;
	if (this.ownerDocument.implementation.errorChecking
			&& (this._readonly || (this.parentNode && this.parentNode._readonly))) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	var f = this._findNamedItemNSIndex(i, h);
	if (this.ownerDocument.implementation.errorChecking && (f < 0)) {
		throw (new DOMException(DOMException.NOT_FOUND_ERR))
	}
	var g = this._nodes[f];
	if (this.ownerDocument.implementation.errorChecking && g._readonly) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	return this._removeChild(f)
};
DOMNamedNodeMap.prototype._findNamedItemIndex = function DOMNamedNodeMap__findNamedItemIndex(
		d) {
	var e = -1;
	for (var f = 0; f < this._nodes.length; f++) {
		if (this._nodes[f].name == d) {
			e = f;
			break
		}
	}
	return e
};
DOMNamedNodeMap.prototype._findNamedItemNSIndex = function DOMNamedNodeMap__findNamedItemNSIndex(
		g, h) {
	var f = -1;
	if (h) {
		for (var e = 0; e < this._nodes.length; e++) {
			if ((this._nodes[e].namespaceURI == g)
					&& (this._nodes[e].localName == h)) {
				f = e;
				break
			}
		}
	}
	return f
};
DOMNamedNodeMap.prototype._hasAttribute = function DOMNamedNodeMap__hasAttribute(
		d) {
	var e = false;
	var f = this._findNamedItemIndex(d);
	if (f > -1) {
		e = true
	}
	return e
};
DOMNamedNodeMap.prototype._hasAttributeNS = function DOMNamedNodeMap__hasAttributeNS(
		g, h) {
	var e = false;
	var f = this._findNamedItemNSIndex(g, h);
	if (f > -1) {
		e = true
	}
	return e
};
DOMNamedNodeMap.prototype._cloneNodes = function DOMNamedNodeMap__cloneNodes(e) {
	var f = new DOMNamedNodeMap(this.ownerDocument, e);
	for (var d = 0; d < this._nodes.length; d++) {
		f._appendChild(this._nodes[d].cloneNode(false))
	}
	return f
};
DOMNamedNodeMap.prototype.toString = function DOMNamedNodeMap_toString() {
	var d = "";
	for (var c = 0; c < this.length - 1; c++) {
		d += this._nodes[c].toString() + " "
	}
	if (this.length > 0) {
		d += this._nodes[this.length - 1].toString()
	}
	return d
};
DOMNamespaceNodeMap = function(c, d) {
	this._class = addClass(this._class, "DOMNamespaceNodeMap");
	this.DOMNamedNodeMap = DOMNamedNodeMap;
	this.DOMNamedNodeMap(c, d)
};
DOMNamespaceNodeMap.prototype = new DOMNamedNodeMap;
DOMNamespaceNodeMap.prototype._findNamedItemIndex = function DOMNamespaceNodeMap__findNamedItemIndex(
		f) {
	var e = -1;
	for (var d = 0; d < this._nodes.length; d++) {
		if (this._nodes[d].localName == f) {
			e = d;
			break
		}
	}
	return e
};
DOMNamespaceNodeMap.prototype._cloneNodes = function DOMNamespaceNodeMap__cloneNodes(
		f) {
	var d = new DOMNamespaceNodeMap(this.ownerDocument, f);
	for (var e = 0; e < this._nodes.length; e++) {
		d._appendChild(this._nodes[e].cloneNode(false))
	}
	return d
};
DOMNamespaceNodeMap.prototype.toString = function DOMNamespaceNodeMap_toString() {
	var f = "";
	for (var h = 0; h < this._nodes.length; h++) {
		var e = null;
		try {
			var e = this.parentNode.parentNode._namespaces
					.getNamedItem(this._nodes[h].localName)
		} catch (g) {
			break
		}
		if (!(e && ("" + e.nodeValue == "" + this._nodes[h].nodeValue))) {
			f += this._nodes[h].toString() + " "
		}
	}
	return f
};
DOMNode = function(b) {
	this._class = addClass(this._class, "DOMNode");
	if (b) {
		this._id = b._genId()
	}
	this.namespaceURI = "";
	this.prefix = "";
	this.localName = "";
	this.nodeName = "";
	this.nodeValue = "";
	this.nodeType = 0;
	this.parentNode = null;
	this.childNodes = new DOMNodeList(b, this);
	this.firstChild = null;
	this.lastChild = null;
	this.previousSibling = null;
	this.nextSibling = null;
	this.attributes = new DOMNamedNodeMap(b, this);
	this.ownerDocument = b;
	this._namespaces = new DOMNamespaceNodeMap(b, this);
	this._readonly = false
};
DOMNode.ELEMENT_NODE = 1;
DOMNode.ATTRIBUTE_NODE = 2;
DOMNode.TEXT_NODE = 3;
DOMNode.CDATA_SECTION_NODE = 4;
DOMNode.ENTITY_REFERENCE_NODE = 5;
DOMNode.ENTITY_NODE = 6;
DOMNode.PROCESSING_INSTRUCTION_NODE = 7;
DOMNode.COMMENT_NODE = 8;
DOMNode.DOCUMENT_NODE = 9;
DOMNode.DOCUMENT_TYPE_NODE = 10;
DOMNode.DOCUMENT_FRAGMENT_NODE = 11;
DOMNode.NOTATION_NODE = 12;
DOMNode.NAMESPACE_NODE = 13;
DOMNode.prototype.hasAttributes = function DOMNode_hasAttributes() {
	if (this.attributes.length === 0) {
		return false
	} else {
		return true
	}
};
DOMNode.prototype.getNodeName = function DOMNode_getNodeName() {
	return this.nodeName
};
DOMNode.prototype.getNodeValue = function DOMNode_getNodeValue() {
	return this.nodeValue
};
DOMNode.prototype.setNodeValue = function DOMNode_setNodeValue(b) {
	if (this.ownerDocument.implementation.errorChecking && this._readonly) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	this.nodeValue = b
};
DOMNode.prototype.getNodeType = function DOMNode_getNodeType() {
	return this.nodeType
};
DOMNode.prototype.getParentNode = function DOMNode_getParentNode() {
	return this.parentNode
};
DOMNode.prototype.getChildNodes = function DOMNode_getChildNodes() {
	return this.childNodes
};
DOMNode.prototype.getFirstChild = function DOMNode_getFirstChild() {
	return this.firstChild
};
DOMNode.prototype.getLastChild = function DOMNode_getLastChild() {
	return this.lastChild
};
DOMNode.prototype.getPreviousSibling = function DOMNode_getPreviousSibling() {
	return this.previousSibling
};
DOMNode.prototype.getNextSibling = function DOMNode_getNextSibling() {
	return this.nextSibling
};
DOMNode.prototype.getAttributes = function DOMNode_getAttributes() {
	return this.attributes
};
DOMNode.prototype.getOwnerDocument = function DOMNode_getOwnerDocument() {
	return this.ownerDocument
};
DOMNode.prototype.getNamespaceURI = function DOMNode_getNamespaceURI() {
	return this.namespaceURI
};
DOMNode.prototype.getPrefix = function DOMNode_getPrefix() {
	return this.prefix
};
DOMNode.prototype.setPrefix = function DOMNode_setPrefix(b) {
	if (this.ownerDocument.implementation.errorChecking) {
		if (this._readonly) {
			throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
		}
		if (!this.ownerDocument.implementation._isValidName(b)) {
			throw (new DOMException(DOMException.INVALID_CHARACTER_ERR))
		}
		if (!this.ownerDocument._isValidNamespace(this.namespaceURI, b + ":"
				+ this.localName)) {
			throw (new DOMException(DOMException.NAMESPACE_ERR))
		}
		if ((b == "xmlns")
				&& (this.namespaceURI != "http://www.w3.org/2000/xmlns/")) {
			throw (new DOMException(DOMException.NAMESPACE_ERR))
		}
		if ((b == "") && (this.localName == "xmlns")) {
			throw (new DOMException(DOMException.NAMESPACE_ERR))
		}
	}
	this.prefix = b;
	if (this.prefix != "") {
		this.nodeName = this.prefix + ":" + this.localName
	} else {
		this.nodeName = this.localName
	}
};
DOMNode.prototype.getLocalName = function DOMNode_getLocalName() {
	return this.localName
};
DOMNode.prototype.insertBefore = function DOMNode_insertBefore(i, j) {
	var k;
	if (this.ownerDocument.implementation.errorChecking) {
		if (this._readonly) {
			throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
		}
		if (this.ownerDocument != i.ownerDocument) {
			throw (new DOMException(DOMException.WRONG_DOCUMENT_ERR))
		}
		if (this._isAncestor(i)) {
			throw (new DOMException(DOMException.HIERARCHY_REQUEST_ERR))
		}
	}
	if (j) {
		var l = this.childNodes._findItemIndex(j._id);
		if (this.ownerDocument.implementation.errorChecking && (l < 0)) {
			throw (new DOMException(DOMException.NOT_FOUND_ERR))
		}
		var h = i.parentNode;
		if (h) {
			h.removeChild(i)
		}
		this.childNodes._insertBefore(i, this.childNodes._findItemIndex(j._id));
		k = j.previousSibling;
		if (i.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {
			if (i.childNodes._nodes.length > 0) {
				for (var g = 0; g < i.childNodes._nodes.length; g++) {
					i.childNodes._nodes[g].parentNode = this
				}
				j.previousSibling = i.childNodes._nodes[i.childNodes._nodes.length - 1]
			}
		} else {
			i.parentNode = this;
			j.previousSibling = i
		}
	} else {
		k = this.lastChild;
		this.appendChild(i)
	}
	if (i.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {
		if (i.childNodes._nodes.length > 0) {
			if (k) {
				k.nextSibling = i.childNodes._nodes[0]
			} else {
				this.firstChild = i.childNodes._nodes[0]
			}
			i.childNodes._nodes[0].previousSibling = k;
			i.childNodes._nodes[i.childNodes._nodes.length - 1].nextSibling = j
		}
	} else {
		if (k) {
			k.nextSibling = i
		} else {
			this.firstChild = i
		}
		i.previousSibling = k;
		i.nextSibling = j
	}
	return i
};
DOMNode.prototype.replaceChild = function DOMNode_replaceChild(i, j) {
	var g = null;
	if (this.ownerDocument.implementation.errorChecking) {
		if (this._readonly) {
			throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
		}
		if (this.ownerDocument != i.ownerDocument) {
			throw (new DOMException(DOMException.WRONG_DOCUMENT_ERR))
		}
		if (this._isAncestor(i)) {
			throw (new DOMException(DOMException.HIERARCHY_REQUEST_ERR))
		}
	}
	var h = this.childNodes._findItemIndex(j._id);
	if (this.ownerDocument.implementation.errorChecking && (h < 0)) {
		throw (new DOMException(DOMException.NOT_FOUND_ERR))
	}
	var l = i.parentNode;
	if (l) {
		l.removeChild(i)
	}
	g = this.childNodes._replaceChild(i, h);
	if (i.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {
		if (i.childNodes._nodes.length > 0) {
			for (var k = 0; k < i.childNodes._nodes.length; k++) {
				i.childNodes._nodes[k].parentNode = this
			}
			if (j.previousSibling) {
				j.previousSibling.nextSibling = i.childNodes._nodes[0]
			} else {
				this.firstChild = i.childNodes._nodes[0]
			}
			if (j.nextSibling) {
				j.nextSibling.previousSibling = i
			} else {
				this.lastChild = i.childNodes._nodes[i.childNodes._nodes.length - 1]
			}
			i.childNodes._nodes[0].previousSibling = j.previousSibling;
			i.childNodes._nodes[i.childNodes._nodes.length - 1].nextSibling = j.nextSibling
		}
	} else {
		i.parentNode = this;
		if (j.previousSibling) {
			j.previousSibling.nextSibling = i
		} else {
			this.firstChild = i
		}
		if (j.nextSibling) {
			j.nextSibling.previousSibling = i
		} else {
			this.lastChild = i
		}
		i.previousSibling = j.previousSibling;
		i.nextSibling = j.nextSibling
	}
	return g
};
DOMNode.prototype.removeChild = function DOMNode_removeChild(c) {
	if (this.ownerDocument.implementation.errorChecking
			&& (this._readonly || c._readonly)) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	var d = this.childNodes._findItemIndex(c._id);
	if (this.ownerDocument.implementation.errorChecking && (d < 0)) {
		throw (new DOMException(DOMException.NOT_FOUND_ERR))
	}
	this.childNodes._removeChild(d);
	c.parentNode = null;
	if (c.previousSibling) {
		c.previousSibling.nextSibling = c.nextSibling
	} else {
		this.firstChild = c.nextSibling
	}
	if (c.nextSibling) {
		c.nextSibling.previousSibling = c.previousSibling
	} else {
		this.lastChild = c.previousSibling
	}
	c.previousSibling = null;
	c.nextSibling = null;
	return c
};
DOMNode.prototype.appendChild = function DOMNode_appendChild(d) {
	if (this.ownerDocument.implementation.errorChecking) {
		if (this._readonly) {
			throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
		}
		if (this.ownerDocument != d.ownerDocument) {
			throw (new DOMException(DOMException.WRONG_DOCUMENT_ERR))
		}
		if (this._isAncestor(d)) {
			throw (new DOMException(DOMException.HIERARCHY_REQUEST_ERR))
		}
	}
	var e = d.parentNode;
	if (e) {
		e.removeChild(d)
	}
	this.childNodes._appendChild(d);
	if (d.nodeType == DOMNode.DOCUMENT_FRAGMENT_NODE) {
		if (d.childNodes._nodes.length > 0) {
			for (var f = 0; f < d.childNodes._nodes.length; f++) {
				d.childNodes._nodes[f].parentNode = this
			}
			if (this.lastChild) {
				this.lastChild.nextSibling = d.childNodes._nodes[0];
				d.childNodes._nodes[0].previousSibling = this.lastChild;
				this.lastChild = d.childNodes._nodes[d.childNodes._nodes.length - 1]
			} else {
				this.lastChild = d.childNodes._nodes[d.childNodes._nodes.length - 1];
				this.firstChild = d.childNodes._nodes[0]
			}
		}
	} else {
		d.parentNode = this;
		if (this.lastChild) {
			this.lastChild.nextSibling = d;
			d.previousSibling = this.lastChild;
			this.lastChild = d
		} else {
			this.lastChild = d;
			this.firstChild = d
		}
	}
	return d
};
DOMNode.prototype.hasChildNodes = function DOMNode_hasChildNodes() {
	return (this.childNodes.length > 0)
};
DOMNode.prototype.cloneNode = function DOMNode_cloneNode(d) {
	try {
		return this.ownerDocument.importNode(this, d)
	} catch (c) {
		return null
	}
};
DOMNode.prototype.normalize = function DOMNode_normalize() {
	var g;
	var h = new DOMNodeList();
	if (this.nodeType == DOMNode.ELEMENT_NODE
			|| this.nodeType == DOMNode.DOCUMENT_NODE) {
		var e = null;
		for (var f = 0; f < this.childNodes.length; f++) {
			g = this.childNodes.item(f);
			if (g.nodeType == DOMNode.TEXT_NODE) {
				if (g.length < 1) {
					h._appendChild(g)
				} else {
					if (e) {
						e.appendData(g.data);
						h._appendChild(g)
					} else {
						e = g
					}
				}
			} else {
				e = null;
				g.normalize()
			}
		}
		for (var f = 0; f < h.length; f++) {
			g = h.item(f);
			g.parentNode.removeChild(g)
		}
	}
};
DOMNode.prototype.isSupported = function DOMNode_isSupported(d, c) {
	return this.ownerDocument.implementation.hasFeature(d, c)
};
DOMNode.prototype.getElementsByTagName = function DOMNode_getElementsByTagName(
		b) {
	return this._getElementsByTagNameRecursive(b, new DOMNodeList(
			this.ownerDocument))
};
DOMNode.prototype._getElementsByTagNameRecursive = function DOMNode__getElementsByTagNameRecursive(
		f, d) {
	if (this.nodeType == DOMNode.ELEMENT_NODE
			|| this.nodeType == DOMNode.DOCUMENT_NODE) {
		if ((this.nodeName == f) || (f == "*")) {
			d._appendChild(this)
		}
		for (var e = 0; e < this.childNodes.length; e++) {
			d = this.childNodes.item(e)._getElementsByTagNameRecursive(f, d)
		}
	}
	return d
};
DOMNode.prototype.getXML = function DOMNode_getXML() {
	return this.toString()
};
DOMNode.prototype.getElementsByTagNameNS = function DOMNode_getElementsByTagNameNS(
		c, d) {
	return this._getElementsByTagNameNSRecursive(c, d, new DOMNodeList(
			this.ownerDocument))
};
DOMNode.prototype._getElementsByTagNameNSRecursive = function DOMNode__getElementsByTagNameNSRecursive(
		g, h, f) {
	if (this.nodeType == DOMNode.ELEMENT_NODE
			|| this.nodeType == DOMNode.DOCUMENT_NODE) {
		if (((this.namespaceURI == g) || (g == "*"))
				&& ((this.localName == h) || (h == "*"))) {
			f._appendChild(this)
		}
		for (var e = 0; e < this.childNodes.length; e++) {
			f = this.childNodes.item(e)._getElementsByTagNameNSRecursive(g, h,
					f)
		}
	}
	return f
};
DOMNode.prototype._isAncestor = function DOMNode__isAncestor(b) {
	return ((this == b) || ((this.parentNode) && (this.parentNode
			._isAncestor(b))))
};
DOMNode.prototype.importNode = function DOMNode_importNode(g, f) {
	var j;
	this.getOwnerDocument()._performingImportNodeOperation = true;
	try {
		if (g.nodeType == DOMNode.ELEMENT_NODE) {
			if (!this.ownerDocument.implementation.namespaceAware) {
				j = this.ownerDocument.createElement(g.tagName);
				for (var i = 0; i < g.attributes.length; i++) {
					j.setAttribute(g.attributes.item(i).name, g.attributes
							.item(i).value)
				}
			} else {
				j = this.ownerDocument.createElementNS(g.namespaceURI,
						g.nodeName);
				for (var i = 0; i < g.attributes.length; i++) {
					j.setAttributeNS(g.attributes.item(i).namespaceURI,
							g.attributes.item(i).name,
							g.attributes.item(i).value)
				}
				for (var i = 0; i < g._namespaces.length; i++) {
					j._namespaces._nodes[i] = this.ownerDocument
							.createNamespace(g._namespaces.item(i).localName);
					j._namespaces._nodes[i]
							.setValue(g._namespaces.item(i).value)
				}
			}
		} else {
			if (g.nodeType == DOMNode.ATTRIBUTE_NODE) {
				if (!this.ownerDocument.implementation.namespaceAware) {
					j = this.ownerDocument.createAttribute(g.name)
				} else {
					j = this.ownerDocument.createAttributeNS(g.namespaceURI,
							g.nodeName);
					for (var i = 0; i < g._namespaces.length; i++) {
						j._namespaces._nodes[i] = this.ownerDocument
								.createNamespace(g._namespaces.item(i).localName);
						j._namespaces._nodes[i]
								.setValue(g._namespaces.item(i).value)
					}
				}
				j.setValue(g.value)
			} else {
				if (g.nodeType == DOMNode.DOCUMENT_FRAGMENT) {
					j = this.ownerDocument.createDocumentFragment()
				} else {
					if (g.nodeType == DOMNode.NAMESPACE_NODE) {
						j = this.ownerDocument.createNamespace(g.nodeName);
						j.setValue(g.value)
					} else {
						if (g.nodeType == DOMNode.TEXT_NODE) {
							j = this.ownerDocument.createTextNode(g.data)
						} else {
							if (g.nodeType == DOMNode.CDATA_SECTION_NODE) {
								j = this.ownerDocument
										.createCDATASection(g.data)
							} else {
								if (g.nodeType == DOMNode.PROCESSING_INSTRUCTION_NODE) {
									j = this.ownerDocument
											.createProcessingInstruction(
													g.target, g.data)
								} else {
									if (g.nodeType == DOMNode.COMMENT_NODE) {
										j = this.ownerDocument
												.createComment(g.data)
									} else {
										throw (new DOMException(
												DOMException.NOT_SUPPORTED_ERR))
									}
								}
							}
						}
					}
				}
			}
		}
		if (f) {
			for (var i = 0; i < g.childNodes.length; i++) {
				j.appendChild(this.ownerDocument.importNode(g.childNodes
						.item(i), true))
			}
		}
		this.getOwnerDocument()._performingImportNodeOperation = false;
		return j
	} catch (h) {
		this.getOwnerDocument()._performingImportNodeOperation = false;
		throw h
	}
};
DOMNode.prototype.__escapeString = function DOMNode__escapeString(b) {
	return __escapeString(b)
};
DOMNode.prototype.__unescapeString = function DOMNode__unescapeString(b) {
	return __unescapeString(b)
};
DOMDocument = function(b) {
	this._class = addClass(this._class, "DOMDocument");
	this.DOMNode = DOMNode;
	this.DOMNode(this);
	this.doctype = null;
	this.implementation = b;
	this.documentElement = null;
	this.all = [];
	this.nodeName = "#document";
	this.nodeType = DOMNode.DOCUMENT_NODE;
	this._id = 0;
	this._lastId = 0;
	this._parseComplete = false;
	this.ownerDocument = this;
	this._performingImportNodeOperation = false
};
DOMDocument.prototype = new DOMNode;
DOMDocument.prototype.getDoctype = function DOMDocument_getDoctype() {
	return this.doctype
};
DOMDocument.prototype.getImplementation = function DOMDocument_implementation() {
	return this.implementation
};
DOMDocument.prototype.getDocumentElement = function DOMDocument_getDocumentElement() {
	return this.documentElement
};
DOMDocument.prototype.createElement = function DOMDocument_createElement(c) {
	if (this.ownerDocument.implementation.errorChecking
			&& (!this.ownerDocument.implementation._isValidName(c))) {
		throw (new DOMException(DOMException.INVALID_CHARACTER_ERR))
	}
	var d = new DOMElement(this);
	d.tagName = c;
	d.nodeName = c;
	this.all[this.all.length] = d;
	return d
};
DOMDocument.prototype.createDocumentFragment = function DOMDocument_createDocumentFragment() {
	var b = new DOMDocumentFragment(this);
	return b
};
DOMDocument.prototype.createTextNode = function DOMDocument_createTextNode(c) {
	var d = new DOMText(this);
	d.data = c;
	d.nodeValue = c;
	d.length = c.length;
	return d
};
DOMDocument.prototype.createComment = function DOMDocument_createComment(c) {
	var d = new DOMComment(this);
	d.data = c;
	d.nodeValue = c;
	d.length = c.length;
	return d
};
DOMDocument.prototype.createCDATASection = function DOMDocument_createCDATASection(
		c) {
	var d = new DOMCDATASection(this);
	d.data = c;
	d.nodeValue = c;
	d.length = c.length;
	return d
};
DOMDocument.prototype.createProcessingInstruction = function DOMDocument_createProcessingInstruction(
		e, f) {
	if (this.ownerDocument.implementation.errorChecking
			&& (!this.implementation._isValidName(e))) {
		throw (new DOMException(DOMException.INVALID_CHARACTER_ERR))
	}
	var d = new DOMProcessingInstruction(this);
	d.target = e;
	d.nodeName = e;
	d.data = f;
	d.nodeValue = f;
	d.length = f.length;
	return d
};
DOMDocument.prototype.createAttribute = function DOMDocument_createAttribute(d) {
	if (this.ownerDocument.implementation.errorChecking
			&& (!this.ownerDocument.implementation._isValidName(d))) {
		throw (new DOMException(DOMException.INVALID_CHARACTER_ERR))
	}
	var c = new DOMAttr(this);
	c.name = d;
	c.nodeName = d;
	return c
};
DOMDocument.prototype.createElementNS = function DOMDocument_createElementNS(e,
		f) {
	if (this.ownerDocument.implementation.errorChecking) {
		if (!this.ownerDocument._isValidNamespace(e, f)) {
			throw (new DOMException(DOMException.NAMESPACE_ERR))
		}
		if (!this.ownerDocument.implementation._isValidName(f)) {
			throw (new DOMException(DOMException.INVALID_CHARACTER_ERR))
		}
	}
	var h = new DOMElement(this);
	var g = this.implementation._parseQName(f);
	h.nodeName = f;
	h.namespaceURI = e;
	h.prefix = g.prefix;
	h.localName = g.localName;
	h.tagName = f;
	this.all[this.all.length] = h;
	return h
};
DOMDocument.prototype.createAttributeNS = function DOMDocument_createAttributeNS(
		f, g) {
	if (this.ownerDocument.implementation.errorChecking) {
		if (!this.ownerDocument._isValidNamespace(f, g, true)) {
			throw (new DOMException(DOMException.NAMESPACE_ERR))
		}
		if (!this.ownerDocument.implementation._isValidName(g)) {
			throw (new DOMException(DOMException.INVALID_CHARACTER_ERR))
		}
	}
	var e = new DOMAttr(this);
	var h = this.implementation._parseQName(g);
	e.nodeName = g;
	e.namespaceURI = f;
	e.prefix = h.prefix;
	e.localName = h.localName;
	e.name = g;
	e.nodeValue = "";
	return e
};
DOMDocument.prototype.createNamespace = function DOMDocument_createNamespace(d) {
	var e = new DOMNamespace(this);
	var f = this.implementation._parseQName(d);
	e.nodeName = d;
	e.prefix = f.prefix;
	e.localName = f.localName;
	e.name = d;
	e.nodeValue = "";
	return e
};
DOMDocument.prototype.getElementById = function DOMDocument_getElementById(d) {
	retNode = null;
	for (var e = 0; e < this.all.length; e++) {
		var f = this.all[e];
		if ((f.id == d) && (f._isAncestor(f.ownerDocument.documentElement))) {
			retNode = f;
			break
		}
	}
	return retNode
};
DOMDocument.prototype._genId = function DOMDocument__genId() {
	this._lastId += 1;
	return this._lastId
};
DOMDocument.prototype._isValidNamespace = function DOMDocument__isValidNamespace(
		i, f, g) {
	if (this._performingImportNodeOperation == true) {
		return true
	}
	var j = true;
	var h = this.implementation._parseQName(f);
	if (this._parseComplete == true) {
		if (h.localName.indexOf(":") > -1) {
			j = false
		}
		if ((j) && (!g)) {
			if (!i) {
				j = false
			}
		}
		if ((j) && (h.prefix == "")) {
			j = false
		}
	}
	if ((j) && (h.prefix == "xml")
			&& (i != "http://www.w3.org/XML/1998/namespace")) {
		j = false
	}
	return j
};
DOMDocument.prototype.toString = function DOMDocument_toString() {
	return "" + this.childNodes
};
DOMElement = function(b) {
	this._class = addClass(this._class, "DOMElement");
	this.DOMNode = DOMNode;
	this.DOMNode(b);
	this.tagName = "";
	this.id = "";
	this.nodeType = DOMNode.ELEMENT_NODE
};
DOMElement.prototype = new DOMNode;
DOMElement.prototype.getTagName = function DOMElement_getTagName() {
	return this.tagName
};
DOMElement.prototype.getAttribute = function DOMElement_getAttribute(f) {
	var d = "";
	var e = this.attributes.getNamedItem(f);
	if (e) {
		d = e.value
	}
	return d
};
DOMElement.prototype.setAttribute = function DOMElement_setAttribute(d, f) {
	var e = this.attributes.getNamedItem(d);
	if (!e) {
		e = this.ownerDocument.createAttribute(d)
	}
	var f = new String(f);
	if (this.ownerDocument.implementation.errorChecking) {
		if (e._readonly) {
			throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
		}
		if (!this.ownerDocument.implementation._isValidString(f)) {
			throw (new DOMException(DOMException.INVALID_CHARACTER_ERR))
		}
	}
	if (this.ownerDocument.implementation._isIdDeclaration(d)) {
		this.id = f
	}
	e.value = f;
	e.nodeValue = f;
	if (f.length > 0) {
		e.specified = true
	} else {
		e.specified = false
	}
	this.attributes.setNamedItem(e)
};
DOMElement.prototype.removeAttribute = function DOMElement_removeAttribute(b) {
	return this.attributes.removeNamedItem(b)
};
DOMElement.prototype.getAttributeNode = function DOMElement_getAttributeNode(b) {
	return this.attributes.getNamedItem(b)
};
DOMElement.prototype.setAttributeNode = function DOMElement_setAttributeNode(b) {
	if (this.ownerDocument.implementation._isIdDeclaration(b.name)) {
		this.id = b.value
	}
	return this.attributes.setNamedItem(b)
};
DOMElement.prototype.removeAttributeNode = function DOMElement_removeAttributeNode(
		c) {
	if (this.ownerDocument.implementation.errorChecking && c._readonly) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	var d = this.attributes._findItemIndex(c._id);
	if (this.ownerDocument.implementation.errorChecking && (d < 0)) {
		throw (new DOMException(DOMException.NOT_FOUND_ERR))
	}
	return this.attributes._removeChild(d)
};
DOMElement.prototype.getAttributeNS = function DOMElement_getAttributeNS(g, h) {
	var e = "";
	var f = this.attributes.getNamedItemNS(g, h);
	if (f) {
		e = f.value
	}
	return e
};
DOMElement.prototype.setAttributeNS = function DOMElement_setAttributeNS(h, e,
		g) {
	var f = this.attributes.getNamedItem(h, e);
	if (!f) {
		f = this.ownerDocument.createAttributeNS(h, e)
	}
	var g = new String(g);
	if (this.ownerDocument.implementation.errorChecking) {
		if (f._readonly) {
			throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
		}
		if (!this.ownerDocument._isValidNamespace(h, e)) {
			throw (new DOMException(DOMException.NAMESPACE_ERR))
		}
		if (!this.ownerDocument.implementation._isValidString(g)) {
			throw (new DOMException(DOMException.INVALID_CHARACTER_ERR))
		}
	}
	if (this.ownerDocument.implementation._isIdDeclaration(name)) {
		this.id = g
	}
	f.value = g;
	f.nodeValue = g;
	if (g.length > 0) {
		f.specified = true
	} else {
		f.specified = false
	}
	this.attributes.setNamedItemNS(f)
};
DOMElement.prototype.removeAttributeNS = function DOMElement_removeAttributeNS(
		c, d) {
	return this.attributes.removeNamedItemNS(c, d)
};
DOMElement.prototype.getAttributeNodeNS = function DOMElement_getAttributeNodeNS(
		c, d) {
	return this.attributes.getNamedItemNS(c, d)
};
DOMElement.prototype.setAttributeNodeNS = function DOMElement_setAttributeNodeNS(
		b) {
	if ((b.prefix == "")
			&& this.ownerDocument.implementation._isIdDeclaration(b.name)) {
		this.id = b.value
	}
	return this.attributes.setNamedItemNS(b)
};
DOMElement.prototype.hasAttribute = function DOMElement_hasAttribute(b) {
	return this.attributes._hasAttribute(b)
};
DOMElement.prototype.hasAttributeNS = function DOMElement_hasAttributeNS(d, c) {
	return this.attributes._hasAttributeNS(d, c)
};
DOMElement.prototype.toString = function DOMElement_toString() {
	var d = "";
	var f = this._namespaces.toString();
	if (f.length > 0) {
		f = " " + f
	}
	var e = this.attributes.toString();
	if (e.length > 0) {
		e = " " + e
	}
	d += "<" + this.nodeName + f + e + ">";
	d += this.childNodes.toString();
	d += "</" + this.nodeName + ">";
	return d
};
DOMAttr = function(b) {
	this._class = addClass(this._class, "DOMAttr");
	this.DOMNode = DOMNode;
	this.DOMNode(b);
	this.name = "";
	this.specified = false;
	this.value = "";
	this.nodeType = DOMNode.ATTRIBUTE_NODE;
	this.ownerElement = null;
	this.childNodes = null;
	this.attributes = null
};
DOMAttr.prototype = new DOMNode;
DOMAttr.prototype.getName = function DOMAttr_getName() {
	return this.nodeName
};
DOMAttr.prototype.getSpecified = function DOMAttr_getSpecified() {
	return this.specified
};
DOMAttr.prototype.getValue = function DOMAttr_getValue() {
	return this.nodeValue
};
DOMAttr.prototype.setValue = function DOMAttr_setValue(b) {
	if (this.ownerDocument.implementation.errorChecking && this._readonly) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	this.setNodeValue(b)
};
DOMAttr.prototype.setNodeValue = function DOMAttr_setNodeValue(b) {
	this.nodeValue = new String(b);
	this.value = this.nodeValue;
	this.specified = (this.value.length > 0)
};
DOMAttr.prototype.toString = function DOMAttr_toString() {
	var b = "";
	b += this.nodeName + '="' + this.__escapeString(this.nodeValue) + '"';
	return b
};
DOMAttr.prototype.getOwnerElement = function() {
	return this.ownerElement
};
DOMNamespace = function(b) {
	this._class = addClass(this._class, "DOMNamespace");
	this.DOMNode = DOMNode;
	this.DOMNode(b);
	this.name = "";
	this.specified = false;
	this.value = "";
	this.nodeType = DOMNode.NAMESPACE_NODE
};
DOMNamespace.prototype = new DOMNode;
DOMNamespace.prototype.getValue = function DOMNamespace_getValue() {
	return this.nodeValue
};
DOMNamespace.prototype.setValue = function DOMNamespace_setValue(b) {
	this.nodeValue = new String(b);
	this.value = this.nodeValue
};
DOMNamespace.prototype.toString = function DOMNamespace_toString() {
	var b = "";
	if (this.nodeName != "") {
		b += this.nodeName + '="' + this.__escapeString(this.nodeValue) + '"'
	} else {
		b += 'xmlns="' + this.__escapeString(this.nodeValue) + '"'
	}
	return b
};
DOMCharacterData = function(b) {
	this._class = addClass(this._class, "DOMCharacterData");
	this.DOMNode = DOMNode;
	this.DOMNode(b);
	this.data = "";
	this.length = 0
};
DOMCharacterData.prototype = new DOMNode;
DOMCharacterData.prototype.getData = function DOMCharacterData_getData() {
	return this.nodeValue
};
DOMCharacterData.prototype.setData = function DOMCharacterData_setData(b) {
	this.setNodeValue(b)
};
DOMCharacterData.prototype.setNodeValue = function DOMCharacterData_setNodeValue(
		b) {
	if (this.ownerDocument.implementation.errorChecking && this._readonly) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	this.nodeValue = new String(b);
	this.data = this.nodeValue;
	this.length = this.nodeValue.length
};
DOMCharacterData.prototype.getLength = function DOMCharacterData_getLength() {
	return this.nodeValue.length
};
DOMCharacterData.prototype.substringData = function DOMCharacterData_substringData(
		f, d) {
	var e = null;
	if (this.data) {
		if (this.ownerDocument.implementation.errorChecking
				&& ((f < 0) || (f > this.data.length) || (d < 0))) {
			throw (new DOMException(DOMException.INDEX_SIZE_ERR))
		}
		if (!d) {
			e = this.data.substring(f)
		} else {
			e = this.data.substring(f, f + d)
		}
	}
	return e
};
DOMCharacterData.prototype.appendData = function DOMCharacterData_appendData(b) {
	if (this.ownerDocument.implementation.errorChecking && this._readonly) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	this.setData("" + this.data + b)
};
DOMCharacterData.prototype.insertData = function DOMCharacterData_insertData(c,
		d) {
	if (this.ownerDocument.implementation.errorChecking && this._readonly) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	if (this.data) {
		if (this.ownerDocument.implementation.errorChecking
				&& ((c < 0) || (c > this.data.length))) {
			throw (new DOMException(DOMException.INDEX_SIZE_ERR))
		}
		this.setData(this.data.substring(0, c)
				.concat(d, this.data.substring(c)))
	} else {
		if (this.ownerDocument.implementation.errorChecking && (c != 0)) {
			throw (new DOMException(DOMException.INDEX_SIZE_ERR))
		}
		this.setData(d)
	}
};
DOMCharacterData.prototype.deleteData = function DOMCharacterData_deleteData(c,
		d) {
	if (this.ownerDocument.implementation.errorChecking && this._readonly) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	if (this.data) {
		if (this.ownerDocument.implementation.errorChecking
				&& ((c < 0) || (c > this.data.length) || (d < 0))) {
			throw (new DOMException(DOMException.INDEX_SIZE_ERR))
		}
		if (!d || (c + d) > this.data.length) {
			this.setData(this.data.substring(0, c))
		} else {
			this.setData(this.data.substring(0, c).concat(
					this.data.substring(c + d)))
		}
	}
};
DOMCharacterData.prototype.replaceData = function DOMCharacterData_replaceData(
		f, d, e) {
	if (this.ownerDocument.implementation.errorChecking && this._readonly) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	if (this.data) {
		if (this.ownerDocument.implementation.errorChecking
				&& ((f < 0) || (f > this.data.length) || (d < 0))) {
			throw (new DOMException(DOMException.INDEX_SIZE_ERR))
		}
		this.setData(this.data.substring(0, f).concat(e,
				this.data.substring(f + d)))
	} else {
		this.setData(e)
	}
};
DOMText = function(b) {
	this._class = addClass(this._class, "DOMText");
	this.DOMCharacterData = DOMCharacterData;
	this.DOMCharacterData(b);
	this.nodeName = "#text";
	this.nodeType = DOMNode.TEXT_NODE
};
DOMText.prototype = new DOMCharacterData;
DOMText.prototype.splitText = function DOMText_splitText(e) {
	var d, f;
	if (this.ownerDocument.implementation.errorChecking) {
		if (this._readonly) {
			throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
		}
		if ((e < 0) || (e > this.data.length)) {
			throw (new DOMException(DOMException.INDEX_SIZE_ERR))
		}
	}
	if (this.parentNode) {
		d = this.substringData(e);
		f = this.ownerDocument.createTextNode(d);
		if (this.nextSibling) {
			this.parentNode.insertBefore(f, this.nextSibling)
		} else {
			this.parentNode.appendChild(f)
		}
		this.deleteData(e)
	}
	return f
};
DOMText.prototype.toString = function DOMText_toString() {
	return this.__escapeString("" + this.nodeValue)
};
DOMCDATASection = function(b) {
	this._class = addClass(this._class, "DOMCDATASection");
	this.DOMCharacterData = DOMCharacterData;
	this.DOMCharacterData(b);
	this.nodeName = "#cdata-section";
	this.nodeType = DOMNode.CDATA_SECTION_NODE
};
DOMCDATASection.prototype = new DOMCharacterData;
DOMCDATASection.prototype.splitText = function DOMCDATASection_splitText(e) {
	var d, f;
	if (this.ownerDocument.implementation.errorChecking) {
		if (this._readonly) {
			throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
		}
		if ((e < 0) || (e > this.data.length)) {
			throw (new DOMException(DOMException.INDEX_SIZE_ERR))
		}
	}
	if (this.parentNode) {
		d = this.substringData(e);
		f = this.ownerDocument.createCDATASection(d);
		if (this.nextSibling) {
			this.parentNode.insertBefore(f, this.nextSibling)
		} else {
			this.parentNode.appendChild(f)
		}
		this.deleteData(e)
	}
	return f
};
DOMCDATASection.prototype.toString = function DOMCDATASection_toString() {
	var b = "";
	b += "<![CDATA[" + this.nodeValue + "]]>";
	return b
};
DOMComment = function(b) {
	this._class = addClass(this._class, "DOMComment");
	this.DOMCharacterData = DOMCharacterData;
	this.DOMCharacterData(b);
	this.nodeName = "#comment";
	this.nodeType = DOMNode.COMMENT_NODE
};
DOMComment.prototype = new DOMCharacterData;
DOMComment.prototype.toString = function DOMComment_toString() {
	var b = "";
	b += "<!--" + this.nodeValue + "-->";
	return b
};
DOMProcessingInstruction = function(b) {
	this._class = addClass(this._class, "DOMProcessingInstruction");
	this.DOMNode = DOMNode;
	this.DOMNode(b);
	this.target = "";
	this.data = "";
	this.nodeType = DOMNode.PROCESSING_INSTRUCTION_NODE
};
DOMProcessingInstruction.prototype = new DOMNode;
DOMProcessingInstruction.prototype.getTarget = function DOMProcessingInstruction_getTarget() {
	return this.nodeName
};
DOMProcessingInstruction.prototype.getData = function DOMProcessingInstruction_getData() {
	return this.nodeValue
};
DOMProcessingInstruction.prototype.setData = function DOMProcessingInstruction_setData(
		b) {
	this.setNodeValue(b)
};
DOMProcessingInstruction.prototype.setNodeValue = function DOMProcessingInstruction_setNodeValue(
		b) {
	if (this.ownerDocument.implementation.errorChecking && this._readonly) {
		throw (new DOMException(DOMException.NO_MODIFICATION_ALLOWED_ERR))
	}
	this.nodeValue = new String(b);
	this.data = this.nodeValue
};
DOMProcessingInstruction.prototype.toString = function DOMProcessingInstruction_toString() {
	var b = "";
	b += "<?" + this.nodeName + " " + this.nodeValue + " ?>";
	return b
};
DOMDocumentFragment = function(b) {
	this._class = addClass(this._class, "DOMDocumentFragment");
	this.DOMNode = DOMNode;
	this.DOMNode(b);
	this.nodeName = "#document-fragment";
	this.nodeType = DOMNode.DOCUMENT_FRAGMENT_NODE
};
DOMDocumentFragment.prototype = new DOMNode;
DOMDocumentFragment.prototype.toString = function DOMDocumentFragment_toString() {
	var d = "";
	var c = this.getChildNodes().getLength();
	for (intLoop = 0; intLoop < c; intLoop++) {
		d += this.getChildNodes().item(intLoop).toString()
	}
	return d
};
DOMDocumentType = function() {
	alert("DOMDocumentType.constructor(): Not Implemented")
};
DOMEntity = function() {
	alert("DOMEntity.constructor(): Not Implemented")
};
DOMEntityReference = function() {
	alert("DOMEntityReference.constructor(): Not Implemented")
};
DOMNotation = function() {
	alert("DOMNotation.constructor(): Not Implemented")
};
Strings = new Object();
Strings.WHITESPACE = " \t\n\r";
Strings.QUOTES = "\"'";
Strings.isEmpty = function Strings_isEmpty(b) {
	return (b === null) || (b.length === 0)
};
Strings.indexOfNonWhitespace = function Strings_indexOfNonWhitespace(g, f, h) {
	if (Strings.isEmpty(g)) {
		return -1
	}
	f = f || 0;
	h = h || g.length;
	for (var e = f; e < h; e++) {
		if (Strings.WHITESPACE.indexOf(g.charAt(e)) == -1) {
			return e
		}
	}
	return -1
};
Strings.lastIndexOfNonWhitespace = function Strings_lastIndexOfNonWhitespace(g,
		f, h) {
	if (Strings.isEmpty(g)) {
		return -1
	}
	f = f || 0;
	h = h || g.length;
	for (var e = h - 1; e >= f; e--) {
		if (Strings.WHITESPACE.indexOf(g.charAt(e)) == -1) {
			return e
		}
	}
	return -1
};
Strings.indexOfWhitespace = function Strings_indexOfWhitespace(g, f, h) {
	if (Strings.isEmpty(g)) {
		return -1
	}
	f = f || 0;
	h = h || g.length;
	for (var e = f; e < h; e++) {
		if (Strings.WHITESPACE.indexOf(g.charAt(e)) != -1) {
			return e
		}
	}
	return -1
};
Strings.replace = function Strings_replace(h, g, i, j, f) {
	if (Strings.isEmpty(h)) {
		return ""
	}
	g = g || 0;
	i = i || h.length;
	return h.substring(g, i).split(j).join(f)
};
Strings.getLineNumber = function Strings_getLineNumber(c, d) {
	if (Strings.isEmpty(c)) {
		return -1
	}
	d = d || c.length;
	return c.substring(0, d).split("\n").length
};
Strings.getColumnNumber = function Strings_getColumnNumber(h, i) {
	if (Strings.isEmpty(h)) {
		return -1
	}
	i = i || h.length;
	var g = h.substring(0, i).split("\n");
	var j = g[g.length - 1];
	g.length--;
	var f = g.join("\n").length;
	return i - f
};
StringBuffer = function() {
	this._a = []
};
StringBuffer.prototype.append = function StringBuffer_append(b) {
	this._a[this._a.length] = b
};
StringBuffer.prototype.toString = function StringBuffer_toString() {
	return this._a.join("")
};
draw2d.XMLSerializer = function() {
	alert("do not init this class. Use the static methods instead")
};
draw2d.XMLSerializer.toXML = function(p, n, q) {
	if (n == undefined) {
		n = "model"
	}
	q = q ? q : "";
	var k = draw2d.XMLSerializer.getTypeName(p);
	var i = q + "<" + n + ' type="' + k + '">';
	switch (k) {
	case "int":
	case "number":
	case "boolean":
		i += p;
		break;
	case "string":
		i += draw2d.XMLSerializer.xmlEncode(p);
		break;
	case "date":
		i += p.toLocaleString();
		break;
	case "Array":
	case "array":
		i += "\n";
		var l = q + "   ";
		for (var o = 0; o < p.length; o++) {
			i += draw2d.XMLSerializer.toXML(p[o], ("element"), l)
		}
		i += q;
		break;
	default:
		if (p !== null) {
			i += "\n";
			if (p instanceof draw2d.ArrayList) {
				p.trimToSize()
			}
			var m = p.getPersistentAttributes();
			var l = q + "   ";
			for ( var r in m) {
				i += draw2d.XMLSerializer.toXML(m[r], r, l)
			}
			i += q
		}
		break
	}
	i += "</" + n + ">\n";
	return i
};
draw2d.XMLSerializer.isSimpleVar = function(b) {
	switch (b) {
	case "int":
	case "string":
	case "String":
	case "Number":
	case "number":
	case "Boolean":
	case "boolean":
	case "bool":
	case "dateTime":
	case "Date":
	case "date":
	case "float":
		return true
	}
	return false
};
draw2d.XMLSerializer.getTypeName = function(c) {
	if (c === null) {
		return "undefined"
	}
	if (c instanceof Array) {
		return "Array"
	}
	if (c instanceof Date) {
		return "Date"
	}
	var d = typeof (c);
	if (d == "number") {
		return (parseInt(c).toString() == c) ? "int" : "number"
	}
	if (draw2d.XMLSerializer.isSimpleVar(d)) {
		return d
	}
	return c.type.replace("@NAMESPACE@", "")
};
draw2d.XMLSerializer.xmlEncode = function(r) {
	var s = r;
	var q = /&/gi;
	var x = />/gi;
	var o = /</gi;
	var p = /"/gi;
	var n = /'/gi;
	var m = "&#62;";
	var t = "&#38;#60;";
	var u = "&#38;#38;";
	var v = "&#34;";
	var y = "&#39;";
	s = s.replace(q, u);
	s = s.replace(p, v);
	s = s.replace(o, t);
	s = s.replace(x, m);
	s = s.replace(n, y);
	return s
};
draw2d.XMLDeserializer = function() {
	alert("do not init this class. Use the static methods instead")
};
draw2d.XMLDeserializer.fromXML = function(node, _4fe9) {
	var _4fea = "" + node.getAttributes().getNamedItem("type").getNodeValue();
	var value = node.getNodeValue();
	switch (_4fea) {
	case "int":
		try {
			return parseInt("" + node.getChildNodes().item(0).getNodeValue())
		} catch (e) {
			alert("Error:" + e + "\nDataType:" + _4fea + "\nXML Node:" + node)
		}
	case "string":
	case "String":
		try {
			if (node.getChildNodes().getLength() > 0) {
				return "" + node.getChildNodes().item(0).getNodeValue()
			}
			return ""
		} catch (e) {
			alert("Error:" + e + "\nDataType:" + _4fea + "\nXML Node:" + node)
		}
	case "Number":
	case "number":
		try {
			return parseFloat("" + node.getChildNodes().item(0).getNodeValue())
		} catch (e) {
			alert("Error:" + e + "\nDataType:" + _4fea + "\nXML Node:" + node)
		}
	case "Boolean":
	case "boolean":
	case "bool":
		try {
			return "true" == ("" + node.getChildNodes().item(0).getNodeValue())
					.toLowerCase()
		} catch (e) {
			alert("Error:" + e + "\nDataType:" + _4fea + "\nXML Node:" + node)
		}
	case "dateTime":
	case "Date":
	case "date":
		try {
			return new Date("" + node.getChildNodes().item(0).getNodeValue())
		} catch (e) {
			alert("Error:" + e + "\nDataType:" + _4fea + "\nXML Node:" + node)
		}
	case "float":
		try {
			return parseFloat("" + node.getChildNodes().item(0).getNodeValue())
		} catch (e) {
			alert("Error:" + e + "\nDataType:" + _4fea + "\nXML Node:" + node)
		}
		break
	}
	_4fea = _4fea.replace("@NAMESPACE@", "");
	var obj = eval("new " + _4fea + "()");
	if (_4fe9 != undefined && obj.setModelParent != undefined) {
		obj.setModelParent(_4fe9)
	}
	var _4fed = node.getChildNodes();
	for (var i = 0; i < _4fed.length; i++) {
		var child = _4fed.item(i);
		var _4ff0 = child.getNodeName();
		if (obj instanceof Array) {
			_4ff0 = i
		}
		obj[_4ff0] = draw2d.XMLDeserializer.fromXML(child,
				obj instanceof draw2d.AbstractObjectModel ? obj : _4fe9)
	}
	return obj
};
draw2d.EditPolicy = function(b) {
	this.policy = b
};
draw2d.EditPolicy.DELETE = "DELETE";
draw2d.EditPolicy.MOVE = "MOVE";
draw2d.EditPolicy.CONNECT = "CONNECT";
draw2d.EditPolicy.RESIZE = "RESIZE";
draw2d.EditPolicy.prototype.type = "draw2d.EditPolicy";
draw2d.EditPolicy.prototype.getPolicy = function() {
	return this.policy
};
draw2d.AbstractPalettePart = function() {
	this.x = 0;
	this.y = 0;
	this.html = null
};
draw2d.AbstractPalettePart.prototype.type = "draw2d.AbstractPalettePart";
draw2d.AbstractPalettePart.prototype = new draw2d.Draggable();
draw2d.AbstractPalettePart.prototype.createHTMLElement = function() {
	var b = document.createElement("div");
	b.id = this.id;
	b.style.position = "absolute";
	b.style.height = "24px";
	b.style.width = "24px";
	return b
};
draw2d.AbstractPalettePart.prototype.setEnviroment = function(c, d) {
	this.palette = d;
	this.workflow = c
};
draw2d.AbstractPalettePart.prototype.getHTMLElement = function() {
	if (this.html === null) {
		this.html = this.createHTMLElement();
		draw2d.Draggable.call(this, this.html)
	}
	return this.html
};
draw2d.AbstractPalettePart.prototype.onDrop = function(i, j) {
	var k = this.workflow.getScrollLeft();
	var l = this.workflow.getScrollTop();
	var g = this.workflow.getAbsoluteX();
	var h = this.workflow.getAbsoluteY();
	this.setPosition(this.x, this.y);
	this.execute(i + k - g, j + l - h)
};
draw2d.AbstractPalettePart.prototype.execute = function(d, c) {
	alert("inerited class should override the method 'draw2d.AbstractPalettePart.prototype.execute'")
};
draw2d.AbstractPalettePart.prototype.setTooltip = function(b) {
	this.tooltip = b;
	if (this.tooltip !== null) {
		this.html.title = this.tooltip
	} else {
		this.html.title = ""
	}
};
draw2d.AbstractPalettePart.prototype.setDimension = function(d, c) {
	this.width = d;
	this.height = c;
	if (this.html === null) {
		return
	}
	this.html.style.width = this.width + "px";
	this.html.style.height = this.height + "px"
};
draw2d.AbstractPalettePart.prototype.setPosition = function(c, d) {
	this.x = Math.max(0, c);
	this.y = Math.max(0, d);
	if (this.html === null) {
		return
	}
	this.html.style.left = this.x + "px";
	this.html.style.top = this.y + "px";
	this.html.style.cursor = "move"
};
draw2d.AbstractPalettePart.prototype.getWidth = function() {
	return this.width
};
draw2d.AbstractPalettePart.prototype.getHeight = function() {
	return this.height
};
draw2d.AbstractPalettePart.prototype.getY = function() {
	return this.y
};
draw2d.AbstractPalettePart.prototype.getX = function() {
	return this.x
};
draw2d.AbstractPalettePart.prototype.getPosition = function() {
	return new draw2d.Point(this.x, this.y)
};
draw2d.AbstractPalettePart.prototype.disableTextSelection = function(b) {
	if (typeof b.onselectstart != "undefined") {
		b.onselectstart = function() {
			return false
		}
	} else {
		if (typeof b.style.MozUserSelect != "undefined") {
			b.style.MozUserSelect = "none"
		}
	}
};
draw2d.ExternalPalette = function(c, d) {
	this.html = document.getElementById(d);
	this.workflow = c;
	this.parts = new draw2d.ArrayList()
};
draw2d.ExternalPalette.prototype.type = "draw2d.ExternalPalette";
draw2d.ExternalPalette.prototype.getHTMLElement = function() {
	return this.html
};
draw2d.ExternalPalette.prototype.addPalettePart = function(b) {
	if (!(b instanceof draw2d.AbstractPalettePart)) {
		throw "parameter is not instanceof [draw2d.AbstractPalettePart]"
	}
	this.parts.add(b);
	this.html.appendChild(b.getHTMLElement());
	b.setEnviroment(this.workflow, this)
};