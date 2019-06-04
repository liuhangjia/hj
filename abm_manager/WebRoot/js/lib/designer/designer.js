var DefaultModelTypeEnum = [
                            draw2d.Start.prototype.type,
                            draw2d.End.prototype.type, 
                            draw2d.UserTask.prototype.type,
							draw2d.ExclusiveGateway.prototype.type,
                            draw2d.DecoratedConnection.prototype.type
//							draw2d.ManualTask.prototype.type, 
//							draw2d.ServiceTask.prototype.type,
//							draw2d.ParallelGateway.prototype.type,
//							draw2d.TimerBoundary.prototype.type,
//							draw2d.ErrorBoundary.prototype.type,
//							draw2d.CallActivity.prototype.type, 
//							draw2d.ScriptTask.prototype.type,
//							draw2d.MailTask.prototype.type, 
//							draw2d.BusinessRuleTask.prototype.type,
//							draw2d.ReceiveTask.prototype.type 
							]
;
draw2d.Random = function() {
};
draw2d.Random.create = function() {
	return new Date().getTime()
};
Sequence = draw2d.Random;
draw2d.Process = function() {
	this.id_ = '';
	this.enterpriseId = '';
	this.enterpriseName = '';
	this.id = null;
	this.name = null;
	this.category = null;
	this.type = null;
	this.documentation = null;
	this.forms = new draw2d.ArrayList();
	this.listeners = new draw2d.ArrayList();
	this.variables = new draw2d.ArrayList()
};
draw2d.Process.prototype.getForm = function(f) {
	for (var e = 0; e < this.forms.getSize(); e++) {
		var d = this.forms.get(e);
		if (d.getId() === f) {
			return d
		}
	}
};
draw2d.Process.prototype.deleteForm = function(c) {
	var d = this.getForm(c);
	this.forms.remove(d)
};
draw2d.Process.prototype.addForm = function(b) {
	this.forms.add(b)
};
draw2d.Process.prototype.setForms = function(b) {
	this.forms = b
};
draw2d.Process.prototype.getListener = function(f) {
	for (var e = 0; e < this.listeners.getSize(); e++) {
		var d = this.listeners.get(e);
		if (d.getId() === f) {
			return d
		}
	}
};
draw2d.Process.prototype.deleteListener = function(c) {
	var d = this.getListener(c);
	this.listeners.remove(d)
};
draw2d.Process.prototype.addListener = function(b) {
	this.listeners.add(b)
};
draw2d.Process.prototype.setListeners = function(b) {
	this.listeners = b
};
draw2d.Process.prototype.getVariable = function(f) {
	for (var d = 0; d < this.variables.getSize(); d++) {
		var e = this.variables.get(d);
		if (e.id === f) {
			return e
		}
	}
};
draw2d.Process.prototype.deleteVariable = function(c) {
	var d = this.getVariable(c);
	this.variables.remove(d)
};
draw2d.Process.prototype.addVariable = function(b) {
	this.variables.add(b)
};
draw2d.Process.prototype.getVariablesJSONObject = function() {
	return JSON.stringify(this.variables.data)
};
draw2d.Process.prototype.getListenersXML = function() {
	var e = "";
	for (var d = 0; d < this.listeners.getSize(); d++) {
		var f = this.listeners.get(d);
		e = e + f.toXML()
	}
	return e
};
draw2d.Process.prototype.getFormsXML = function() {
	var e = "";
	for (var d = 0; d < this.forms.getSize(); d++) {
		var f = this.forms.get(d);
		e = e + f.toXML()
	}
	return e
};
draw2d.Process.prototype.getExtensionElementsXML = function() {
	if (this.listeners.getSize() == 0 && this.forms.getSize() == 0) {
		return ""
	}
	var b = "<extensionElements>\n";
	b = b + this.getFormsXML();
	b = b + this.getListenersXML();
	b = b + "</extensionElements>\n";
	return b
};
draw2d.Process.prototype.getDocumentationXML = function() {
	var d = trim(this.documentation);
	if (d == null || d == "") {
		return ""
	}
	var c = "<documentation>";
	c = c + this.documentation;
	c = c + "</documentation>";
	return c
};
draw2d.Process.variable = function() {
	this.id = draw2d.UUID.create();
	this.name = null;
	this.type = null;
	this.scope = null;
	this.defaultValue = null;
	this.remark = null
};
draw2d.Process.Form = function() {
	this.id = draw2d.UUID.create();
	this.name = null;
	this.type = null;
	this.value = null;
	this.exp = null;
	this.remark = null
};
draw2d.Process.Form.prototype.setId = function(b) {
	this.id = b
};
draw2d.Process.Form.prototype.getId = function() {
	return this.id
};
draw2d.Process.Form.prototype.setName = function(b) {
	this.name = b
};
draw2d.Process.Form.prototype.getName = function() {
	return this.name
};
draw2d.Process.Form.prototype.setType = function(b) {
	this.type = b
};
draw2d.Process.Form.prototype.getType = function() {
	return this.type
};
draw2d.Process.Form.prototype.setValue = function(b) {
	this.value = b
};
draw2d.Process.Form.prototype.getValue = function() {
	return this.value
};
draw2d.Process.Listener = function() {
	this.id = draw2d.UUID.create();
	this.event = null;
	this.serviceType = null;
	this.serviceClass = null;
	this.serviceExpression = null;
	this.fields = new draw2d.ArrayList()
};
draw2d.Process.Listener.prototype.setId = function(b) {
	this.id = b
};
draw2d.Process.Listener.prototype.getId = function() {
	return this.id
};
draw2d.Process.Listener.prototype.setField = function(b) {
	this.fields.add(b)
};
draw2d.Process.Listener.prototype.getField = function(f) {
	for (var e = 0; e < this.fields.getSize(); e++) {
		var d = this.fields.get(e);
		if (d.id == f) {
			return d
		}
	}
};
draw2d.Process.Listener.prototype.deleteField = function(c) {
	var d = this.getField(c);
	this.fields.remove(d)
};
draw2d.Process.Listener.prototype.getServiceImplementation = function() {
	if (this.serviceType == "javaClass") {
		return this.serviceClass
	} else {
		if (this.serviceType == "expression") {
			return this.serviceExpression
		}
	}
};
draw2d.Process.Listener.prototype.getFieldsString = function() {
	var h = "";
	var f = "";
	for (var e = 0; e < this.fields.getSize(); e++) {
		var g = this.fields.get(e);
		h = h + g.name + ":" + g.value + ","
	}
	return h
};
draw2d.Process.Listener.prototype.toJSON = function() {
	var b = {
		id : this.id,
		event : this.event,
		serviceType : this.serviceType,
		serviceClass : this.serviceClass,
		serviceExpression : this.serviceExpression,
		fields : this.fields.data
	};
	return JSON.stringify(b)
};
draw2d.Process.Listener.prototype.parseJSON = function() {
	var b = this.toJSON();
	return JSON.parse(b)
};
draw2d.Process.Listener.prototype.getFieldsXML = function() {
	var e = "";
	for (var d = 0; d < this.fields.getSize(); d++) {
		var f = this.fields.get(d);
		e = e + f.toXML()
	}
	return e
};
draw2d.Process.Listener.prototype.toXML = function() {
	var b = '<activiti:executionListener id="' + this.id + '" event="'
			+ this.event + '" ';
	if (this.serviceType == "javaClass") {
		b = b + 'class="' + this.serviceClass + '" '
	} else {
		if (this.serviceType == "expression") {
			b = b + 'expression="' + this.serviceExpression + '" '
		}
	}
	b = b + ">\n";
	b = b + this.getFieldsXML();
	b = b + "</activiti:executionListener>\n";
	return b
};
draw2d.Process.Listener.Field = function() {
	this.id = draw2d.UUID.create();
	this.name = null;
	this.type = null;
	this.value = null
};
draw2d.Process.Listener.Field.prototype.toJSON = function() {
	var b = {
		id : this.id,
		name : this.name,
		type : this.type,
		value : this.value
	};
	return JSON.stringify(b)
};
draw2d.Process.Listener.Field.prototype.toXML = function() {
	var b = '<activiti:field name="' + this.name + '">\n';
	if (this.type == "string") {
		b = b + "<activiti:string>" + this.value + "</activiti:string>\n"
	} else {
		if (this.type = "expression") {
			b = b + "<activiti:expression>" + this.value
					+ "</activiti:expression>\n"
		}
	}
	b = b + "</activiti:field>\n";
	return b
};
draw2d.Task.Form = function() {
	draw2d.Process.Form.call(this)
};
draw2d.Task.Form.prototype = new draw2d.Process.Form();
draw2d.Task.Form.prototype.toXML = function() {
	var b = '<activiti:formProperty id="' + this.id + '" name="' + this.name
			+ '" type="' + this.type + '" value="' + this.value + '" exp="'
			+ this.exp + '" remark="' + this.remark + '" ';
	b = b + ">\n";
	b = b + "</activiti:formProperty>\n";
	return b
};
draw2d.Task.Listener = function() {
	draw2d.Process.Listener.call(this)
};
draw2d.Task.Listener.prototype = new draw2d.Process.Listener();
draw2d.Task.Listener.prototype.toXML = function() {
	var b = '<activiti:taskListener id="' + this.id + '" event="' + this.event
			+ '" ';
	if (this.serviceType == "javaClass") {
		b = b + 'class="' + this.serviceClass + '" '
	} else {
		if (this.serviceType == "expression") {
			b = b + 'delegateExpression="' + this.serviceExpression + '" '
		}
	}
	b = b + ">\n";
	b = b + this.getFieldsXML();
	b = b + "</activiti:taskListener>\n";
	return b
};
draw2d.Task.Listener.Field = function() {
	draw2d.Process.Listener.Field.call(this)
};
draw2d.Task.Listener.Field.prototype = new draw2d.Process.Listener.Field();
draw2d.DecoratedConnection.Listener = function() {
	draw2d.Process.Listener.call(this)
};
draw2d.DecoratedConnection.Listener.prototype = new draw2d.Process.Listener();
draw2d.DecoratedConnection.Listener.prototype.toXML = function() {
	var b = '<activiti:executionListener id="' + this.id + '" event="'+this.event+'" ';
	if (this.serviceType == "javaClass") {
		b = b + 'class="' + this.serviceClass + '" '
	} else {
		if (this.serviceType == "expression") {
			b = b + 'expression="' + this.serviceExpression + '" '
		}
	}
	b = b + ">\n";
	b = b + this.getFieldsXML();
	b = b + "</activiti:executionListener>\n";
	return b
};
draw2d.DecoratedConnection.Listener.Field = function() {
	draw2d.Process.Listener.Field.call(this)
};
draw2d.DecoratedConnection.Listener.Field.prototype = new draw2d.Process.Listener.Field();
draw2d.ContextMenu = function(d, c) {
	draw2d.Menu.call(this);
	this.setDimension(d, c);
	this.item = null;
	this.width = d;
	this.height = c
};
draw2d.ContextMenu.prototype = new draw2d.Menu();
draw2d.ContextMenu.prototype.type = "draw2d.ContextMenu";
draw2d.ContextMenu.prototype.setDimension = function(d, c) {
	this.item.style.width = d + "px";
	this.item.style.height = c + "px"
};
draw2d.ContextMenu.prototype.createHTMLElement = function() {
	this.item = document.createElement("div");
	this.item.style.left = this.x + "px";
	this.item.style.top = this.y + "px";
	this.item.style.cursor = "pointer";
	this.item.style.width = this.width + "px";
	this.item.style.height = this.height + "px";
	this.item.className = "context-menu";
	return this.item
};
draw2d.ContextMenu.prototype.createList = function() {
	this.dirty = false;
	this.html.innerHTML = "";
	var k = this;
	for (var l = 0; l < this.menuItems.getSize(); l++) {
		var j = this.menuItems.get(l);
		var h = document.createElement("div");
		h.className = "context-menu-item";
		var g = document.createElement("div");
		g.innerHTML = j.getLabel();
		g.className = "context-menu-text";
		h.appendChild(g);
		var i = document.createElement("div");
		i.className = "context-menu-icon " + j.iconCls;
		h.appendChild(i);
		h.menuItem = j;
		this.html.appendChild(h);
		if (h.addEventListener) {
			h.addEventListener("click", function(d) {
				var a = arguments[0] || window.event;
				a.cancelBubble = true;
				a.returnValue = false;
				var f = a.clientX;
				var n = a.clientY;
				var c = document.body.parentNode.scrollLeft;
				var e = document.body.parentNode.scrollTop;
				var b = d.srcElement ? d.srcElement : d.target;
				if (b.className.indexOf("context-menu-item") != -1) {
					b.menuItem.execute(f + c, n + e)
				} else {
					b.parentNode.menuItem.execute(f + c, n + e)
				}
			}, false);
			h.addEventListener("mouseup", function(a) {
				a.cancelBubble = true;
				a.returnValue = false
			}, false);
			h.addEventListener("mousedown", function(a) {
				a.cancelBubble = true;
				a.returnValue = false
			}, false);
			h.addEventListener(
							"mouseover",
							function(b) {
								var a = b.srcElement ? b.srcElement : b.target;
								if (a.className.indexOf("context-menu-item") != -1) {
									a.className = "context-menu-item context-menu-active"
								} else {
									a.parentNode.className = "context-menu-item context-menu-active"
								}
							}, false);
			h.addEventListener("mouseout", function(b) {
				var a = b.srcElement ? b.srcElement : b.target;
				if (a.className.indexOf("context-menu-active") != -1) {
					a.className = "context-menu-item"
				} else {
					a.parentNode.className = "context-menu-item"
				}
			}, false)
		} else {
			if (h.attachEvent) {
				h.attachEvent("onclick", function(b) {
					var n = arguments[0] || window.event;
					n.cancelBubble = true;
					n.returnValue = false;
					var c = n.clientX;
					var d = n.clientY;
					var e = document.body.parentNode.scrollLeft;
					var f = document.body.parentNode.scrollTop;
					var a = b.srcElement ? b.srcElement : b.target;
					if (a.className.indexOf("context-menu-item") != -1) {
						a.menuItem.execute(c + e, d + f)
					} else {
						a.parentNode.menuItem.execute(c + e, d + f)
					}
				});
				h.attachEvent("onmousedown", function(a) {
					a.cancelBubble = true;
					a.returnValue = false
				});
				h.attachEvent("onmouseup", function(a) {
					a.cancelBubble = true;
					a.returnValue = false
				});
				h.attachEvent(
								"onmouseover",
								function(b) {
									var a = b.srcElement ? b.srcElement
											: b.target;
									if (a.className
											.indexOf("context-menu-item") != -1) {
										a.className = "context-menu-item context-menu-active"
									} else {
										a.parentNode.className = "context-menu-item context-menu-active"
									}
								});
				h.attachEvent("onmouseout", function(b) {
					var a = b.srcElement ? b.srcElement : b.target;
					if (a.className.indexOf("context-menu-active") != -1) {
						a.className = "context-menu-item"
					} else {
						a.parentNode.className = "context-menu-item"
					}
				})
			}
		}
	}
};
draw2d.ContextMenuItem = function(f, e, g, h) {
	draw2d.MenuItem.call(this, f, "", h);
	this.data = g;
	this.iconCls = e
};
draw2d.ContextMenuItem.prototype = new draw2d.MenuItem();
draw2d.ContextMenuItem.prototype.type = "draw2d.ContextMenuItem";
draw2d.ContextMenuItem.prototype.setIconCls = function(b) {
	this.iconCls = b
};
draw2d.ContextMenuItem.prototype.setData = function(b) {
	this.data = b
};
draw2d.ContextMenuItem.prototype.getData = function() {
	return this.data
};
draw2d.ContextMenuItem.prototype.execute = function(e, f, d) {
	this.parentMenu.workflow.showMenu(null);
	this.action(e, f, d)
};
String.prototype.removeLineEnd = function() {
	return this.replace(/(<.+?\s+?)(?:\n\s*?(.+?=".*?"))/g, "$1 $2")
};
function formatXml(i) {
	i = "\n" + i.replace(/(<\w+)(\s.*?>)/g, function(c, b, a) {
		return b + " " + a.replace(/\s+(\w+=)/g, " $1")
	}).replace(/>\s*?</g, ">\n<");
	i = i.replace(/\n/g, "\r").replace(/<!--(.+?)-->/g, function(c, a) {
		var b = "<!--" + escape(a) + "-->";
		return b
	}).replace(/\r/g, "\n");
	var k = /\n(<(([^\?]).+?)(?:\s|\s*?>|\s*?(\/)>)(?:.*?(?:(?:(\/)>)|(?:<(\/)\2>)))?)/mg;
	var j = [];
	var l = i.replace(k, function(f, b, v, u, a, c, r, s) {
		var t = (a == "/") || (c == "/") || (r == "/") || (s == "/");
		var e = "";
		if (u == "!") {
			e = getPrefix(j.length)
		} else {
			if (u != "/") {
				e = getPrefix(j.length);
				if (!t) {
					j.push(v)
				}
			} else {
				j.pop();
				e = getPrefix(j.length)
			}
		}
		var d = "\n" + e + b;
		return d
	});
	var h = -1;
	var g = l.substring(1);
	g = g.replace(/\n/g, "\r").replace(/(\s*)<!--(.+?)-->/g, function(d, b, a) {
		if (b.charAt(0) == "\r") {
			b = b.substring(1)
		}
		a = unescape(a).replace(/\r/g, "\n");
		var c = "\n" + b + "<!--" + a.replace(/^\s*/mg, b) + "-->";
		return c
	});
	return g.replace(/\s+$/g, "").replace(/\r/g, "\r\n")
}
function getPrefix(g) {
	var h = "    ";
	var f = [];
	for (var e = 0; e < g; ++e) {
		f.push(h)
	}
	return f.join("")
};