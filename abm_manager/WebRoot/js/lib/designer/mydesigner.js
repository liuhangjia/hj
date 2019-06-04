var workflow;
var processDefinitionId = "";
var processDefinitionName = "";
var processDefinitionVariables = "";
var nodeid = "";
var rows = "";
function openProcessDef(b) {
	$.ajax({
		url : "designerController.do?getProcessXml",
		dataType : "xml",
		data : {
			processId : b
		},
		error : function(a) {
			return ""
		},
		success : function(a) {
			parseProcessDescriptor(a)
		}
	})
}
function createCanvas(k, l) {
	processDefinitionId = k;
	try {
		workflow = new draw2d.MyCanvas("paintarea");
		workflow.scrollArea = document.getElementById("designer-area");
		if (l) {
			workflow.setDisabled()
		}
		if (typeof processDefinitionId != "undefined"
				&& processDefinitionId != "0") {
			openProcessDef(processDefinitionId)
		} else {
			var i = "process" + Sequence.create();
			workflow.process.category = "http://www.jeecg.org";
			workflow.process.id = i;
			workflow.process.name = i;
			workflow.process.documentation = "流程描述";
			var e = new draw2d.Start();
			e.setId("start");
			workflow.addFigure(e, 200, 50);
			var h = new draw2d.End();
			h.setId("end");
			workflow.addFigure(h, 200, 400)
		}
	} catch (j) {
		tip(j.message)
	}
}
function addModel(name, x, y, icon) {
	var model = null;
	if (icon != null && icon != undefined) {
		model = eval("new draw2d." + name + "('" + icon + "')")
	} else {
		model = eval("new draw2d." + name + "()")
	}
	model.generateId();
	workflow.addModel(model, x, y)
}
function deleteModel(c) {
	var d = workflow.getFigure(c);
	workflow.removeFigure(d)
}
function openProperties(g, e, f) {
	var h = workflow.process.id;
	$("#properties-panel").panel(
			"refresh",
			"designerController.do?processProperties&turn=" + e + "&id=" + g
					+ "&processId=" + h + "&processDefinitionId="
					+ processDefinitionId)
}
function redo() {
	workflow.getCommandStack().redo()
}
function undo() {
	workflow.getCommandStack().undo()
}
function saveProcessDef() {
	gridname = "processList";
	var n = $("#typeid").val();
	if (n == 0) {
		tip("请选择流程类型")
	} else {
		var r = "";
		var v = "";
		var p = workflow.toXML();
		var x = workflow.process.id;
		var w = $(p);
		var m = w.find("userTask");
		var o = w.find("manualTask");
		var s = w.find("serviceTask");
		var q = w.find("scriptTask");
		var u = w.find("receiveTask");
		var t = w.find("businessRuleTask");
		m.each(function(a) {
			var c = $(this).attr("id");
			var b = $(this).attr("name");
			v = v + "id=" + c + "###nodeName=" + b + "@@@"
		});
		o.each(function(a) {
			var c = $(this).attr("id");
			var b = $(this).attr("name");
			v = v + "id=" + c + "###nodeName=" + b + "@@@"
		});
		s.each(function(d) {
			var c = $(this).attr("id");
			var a = $(this).attr("activiti:type");
			var b = "";
			if (a == "mail") {
				b = "邮件任务"
			} else {
				b = $(this).attr("name")
			}
			v = v + "id=" + c + "###nodeName=" + b + "@@@"
		});
		q.each(function(a) {
			var c = $(this).attr("id");
			var b = $(this).attr("name");
			v = v + "id=" + c + "###nodeName=" + b + "@@@"
		});
		u.each(function(a) {
			var c = $(this).attr("id");
			var b = $(this).attr("name");
			v = v + "id=" + c + "###nodeName=" + b + "@@@"
		});
		t.each(function(a) {
			var c = $(this).attr("id");
			var b = "业务规则";
			v = v + "id=" + c + "###nodeName=" + b + "@@@"
		});
		if (r.length > 3) {
			r = r.substring(0, r.length - 3)
		}
		if (v.length > 3) {
			v = v.substring(0, v.length - 3)
		}
		$.ajax({
			url : "designerController.do?saveProcess",
			type : "POST",
			data : {
				processDescriptor : p,
				processName : workflow.process.name,
				processkey : workflow.process.id,
				typeid : n,
				params : r,
				nodes : v,
				processDefinitionId : processDefinitionId
			},
			dataType : "json",
			error : function(a) {
				tip(a.msg)
			},
			success : function(a) {
				var b = frameElement.api.opener;
				if (a.success) {
					b.reloadTable();
					tip(a.msg)
				}
			}
		})
	}
}
function exportProcessDef(b) {
}
var browserwebkit = false;
function parseProcessDescriptor(M) {
	var ac = $(M);
	if (ac.find("BPMNShape").length > 0) {
		browserwebkit = true
	} else {
		browserwebkit = false
	}
	var L = (browserwebkit) ? "BPMNShape" : "bpmndi\\:BPMNShape";
	var e = (browserwebkit) ? "BPMNEdge" : "bpmndi\\:BPMNEdge";
	var af = (browserwebkit) ? "executionListener"
			: "activiti\\:executionListener";
	var Y = (browserwebkit) ? "Bounds" : "omgdc\\:Bounds";
	var aa = (browserwebkit) ? "waypoint" : "omgdi\\:waypoint";
	var ag = (browserwebkit) ? "taskListener" : "activiti\\:taskListener";
	var ah = (browserwebkit) ? "formProperty" : "activiti\\:formProperty";
	var ao = (browserwebkit) ? "activiti\\:field" : "field";
	var ab = (browserwebkit) ? "expression" : "activiti\\:expression";
	var ai = (browserwebkit) ? "in" : "activiti\\:in";
	var an = (browserwebkit) ? "out" : "activiti\\:out";
	var P = ac.find("definitions");
	var V = ac.find("process");
	var N = ac.find("startEvent");
	var Z = ac.find("endEvent");
	var U = ac.find("manualTask");
	var ad = ac.find("userTask");
	var X = ac.find("serviceTask");
	var K = ac.find("scriptTask");
	var ak = ac.find("receiveTask");
	var W = ac.find("exclusiveGateway");
	var J = ac.find("parallelGateway");
	var ae = ac.find("boundaryEvent");
	var am = ac.find("callActivity");
	var O = ac.find("businessRuleTask");
	var ap = ac.find("sequenceFlow");
	var R = ac.find(L);
	var al = ac.find(e);
	workflow.process.category = P.attr("targetNamespace");
	workflow.process.id = V.attr("id");
	workflow.process.name = V.attr("name");
	var Q = trim(ac.find("process > documentation").text());
	if (Q != null && Q != "") {
		workflow.process.documentation = Q
	}
	var aj = ac.find("process > extensionElements");
	if (aj != null) {
		var T = aj.find(af);
		workflow.process.setListeners(parseListeners(T,
				"draw2d.Process.Listener", "draw2d.Process.Listener.Field"))
	}
	$.each(processDefinitionVariables, function(b, a) {
		var c = new draw2d.Process.variable();
		c.name = a.name;
		c.type = a.type;
		c.scope = a.scope;
		c.defaultValue = a.defaultValue;
		c.remark = a.remark;
		workflow.process.addVariable(c)
	});
	N.each(function(c) {
		var a = new draw2d.Start();
		a.id = $(this).attr("id");
		a.eventId = $(this).attr("id");
		a.eventName = $(this).attr("name");
		var b = $(this).attr("activiti:initiator");
		if (b == null || b == "null") {
			b = ""
		}
		a.expression = b;
		R.each(function(i) {
			var f = $(this).attr("bpmnElement");
			if (f == a.id) {
				var d = parseInt($(this).find(Y).attr("x"));
				var g = parseInt($(this).find(Y).attr("y"));
				var j = parseInt($(this).find(Y).attr("width"));
				var h = parseInt($(this).find(Y).attr("height"));
				a.setDimension(j, h);
				workflow.addFigure(a, d, g);
				return false
			}
		})
	});
	Z.each(function(a) {
		var b = new draw2d.End();
		b.id = $(this).attr("id");
		b.eventId = $(this).attr("id");
		b.eventName = $(this).attr("name");
		R.each(function(i) {
			var f = $(this).attr("bpmnElement");
			if (f == b.id) {
				var d = parseInt($(this).find(Y).attr("x"));
				var g = parseInt($(this).find(Y).attr("y"));
				var c = parseInt($(this).find(Y).attr("width"));
				var h = parseInt($(this).find(Y).attr("height"));
				b.setDimension(c, h);
				workflow.addFigure(b, d, g);
				return false
			}
		})
	});
	ad
			.each(function(h) {
				var f = new draw2d.UserTask();
				var g = $(this).attr("id");
				f.id = g;
				var m = $(this).attr("name");
				var c = $(this).attr("activiti:assignee");
				var q = $(this).attr("activiti:candidateUsers");
				var a = $(this).attr("activiti:candidateGroups");
				var b = $(this).attr("activiti:formKey");
				if (c != null && c != "") {
					f.isUseExpression = true;
					f.performerType = "assignee";
					f.expression = c
				} else {
					if (q != null && q != "") {
						f.isUseExpression = true;
						f.performerType = "candidateUsers";
						f.expression = q
					} else {
						if (a != null && a != "") {
							f.isUseExpression = true;
							f.performerType = "candidateGroups";
							f.expression = a
						}
					}
				}
				if (b != null && b != "") {
					f.formKey = b
				}
				var d = $(this).find("multiInstanceLoopCharacteristics");
				var o = $(d).attr("isSequential");
				var l = $(d).attr("activiti:collection");
				var p = $(d).attr("activiti:elementVariable");
				var i = $(this).find("loopCardinality").text();
				var j = $(this).find("completionCondition").text();
				if (o != null && o != "") {
					f.task_extend = o;
					f.isSequential = o;
					f.collection = l;
					f.elementVariable = p;
					f.completionCondition = j;
					f.loopCardinality = i
				}
				var t = trim($(this).find("documentation").text());
				if (t != null && t != "") {
					f.documentation = t
				}
				f.taskId = g;
				f.taskName = m;
				f.setContent(m);
				var k = $(this).find("extensionElements").find(ag);
				f.setListeners(parseListeners(k, "draw2d.Task.Listener",
						"draw2d.Task.Listener.Field"));
				var r = $(this).find("extensionElements").find(
						"activiti\\:formProperty");
				f.setForms(parseForms(r, "draw2d.Task.Form"));
				var n = $(this).find("potentialOwner").find(
						"resourceAssignmentExpression")
						.find("formalExpression").text();
				if (n.indexOf("user(") != -1) {
					f.performerType = "candidateUsers"
				} else {
					if (n.indexOf("group(") != -1) {
						f.performerType = "candidateGroups"
					}
				}
				var s = n.split(",");
				$.each(s, function(x, u) {
					var v = 0;
					var y = u.lastIndexOf(")");
					if (u.indexOf("user(") != -1) {
						v = "user(".length;
						var w = u.substring(v, y);
						f.addCandidateUser({
							sso : w
						})
					} else {
						if (u.indexOf("group(") != -1) {
							v = "group(".length;
							var w = u.substring(v, y);
							f.addCandidateGroup(w)
						}
					}
				});
				R.each(function(x) {
					var u = $(this).attr("bpmnElement");
					if (u == f.id) {
						var z = parseInt($(this).find(Y).attr("x"));
						var v = parseInt($(this).find(Y).attr("y"));
						var y = parseInt($(this).find(Y).attr("width"));
						var w = parseInt($(this).find(Y).attr("height"));
						f.setDimension(y, w);
						workflow.addModel(f, z, v);
						return false
					}
				})
			});
	U
			.each(function(j) {
				var m = new draw2d.ManualTask();
				var k = $(this).attr("id");
				m.id = k;
				var a = $(this).attr("name");
				var f = $(this).attr("activiti:assignee");
				var i = $(this).attr("activiti:candidateUsers");
				var l = $(this).attr("activiti:candidateGroups");
				var b = $(this).attr("activiti:formKey");
				if (f != null && f != "") {
					m.isUseExpression = true;
					m.performerType = "assignee";
					m.expression = f
				} else {
					if (i != null && i != "") {
						m.isUseExpression = true;
						m.performerType = "candidateUsers";
						m.expression = i
					} else {
						if (l != null && l != "") {
							m.isUseExpression = true;
							m.performerType = "candidateGroups";
							m.expression = l
						}
					}
				}
				if (b != null && b != "") {
					m.formKey = b
				}
				var d = trim($(this).find("documentation").text());
				if (d != null && d != "") {
					m.documentation = d
				}
				m.taskId = k;
				m.taskName = a;
				m.setContent(a);
				var c = $(this).find("extensionElements").find(
						"activiti\\:taskListener");
				m.setListeners(parseListeners(c, "draw2d.Task.Listener",
						"draw2d.Task.Listener.Field"));
				var g = $(this).find("potentialOwner").find(
						"resourceAssignmentExpression")
						.find("formalExpression").text();
				if (g.indexOf("user(") != -1) {
					m.performerType = "candidateUsers"
				} else {
					if (g.indexOf("group(") != -1) {
						m.performerType = "candidateGroups"
					}
				}
				var h = g.split(",");
				$.each(h, function(o, q) {
					var r = 0;
					var p = q.lastIndexOf(")");
					if (q.indexOf("user(") != -1) {
						r = "user(".length;
						var n = q.substring(r, p);
						m.addCandidateUser({
							sso : n
						})
					} else {
						if (q.indexOf("group(") != -1) {
							r = "group(".length;
							var n = q.substring(r, p);
							m.addCandidateGroup(n)
						}
					}
				});
				R.each(function(n) {
					var q = $(this).attr("bpmnElement");
					if (q == m.id) {
						var p = parseInt($(this).find(Y).attr("x"));
						var r = parseInt($(this).find(Y).attr("y"));
						var o = parseInt($(this).find(Y).attr("width"));
						var s = parseInt($(this).find(Y).attr("height"));
						m.setDimension(o, s);
						workflow.addModel(m, p, r);
						return false
					}
				})
			});
	X.each(function(i) {
		var j = $(this).attr("activiti:type");
		if (j == "mail") {
			var g = new draw2d.MailTask();
			var h = $(this).attr("id");
			g.id = h;
			var p = $(this).find("activiti\\:field");
			p.each(function(t) {
				if ($(this).attr("name") == "to") {
					g.toEmail = $(this).attr("expression")
				}
				if ($(this).attr("name") == "from") {
					g.fromEmail = $(this).attr("expression")
				}
				if ($(this).attr("name") == "subject") {
					g.subjectEmail = $(this).attr("expression")
				}
				if ($(this).attr("name") == "cc") {
					g.ccEmail = $(this).attr("expression")
				}
				if ($(this).attr("name") == "bcc") {
					g.bccEmail = $(this).attr("expression")
				}
				if ($(this).attr("name") == "charset") {
					g.charsetEmail = $(this).attr("expression")
				}
				if ($(this).attr("name") == "html") {
					g.htmlEmail = trim($(this).find("activiti\\:expression")
							.text())
				}
				if ($(this).attr("name") == "text") {
					g.textEmail = trim($(this).find("activiti\\:expression")
							.text())
				}
			});
			g.taskId = h;
			R.each(function(v) {
				var t = $(this).attr("bpmnElement");
				if (t == g.id) {
					var w = parseInt($(this).find(Y).attr("x"));
					var u = parseInt($(this).find(Y).attr("y"));
					workflow.addModel(g, w, u);
					return false
				}
			})
		} else {
			var g = new draw2d.ServiceTask();
			var h = $(this).attr("id");
			g.id = h;
			var n = $(this).attr("name");
			var f = $(this).attr("activiti:assignee");
			var r = $(this).attr("activiti:candidateUsers");
			var c = $(this).attr("activiti:candidateGroups");
			var d = $(this).attr("activiti:formKey");
			if (f != null && f != "") {
				g.isUseExpression = true;
				g.performerType = "assignee";
				g.expression = f
			} else {
				if (r != null && r != "") {
					g.isUseExpression = true;
					g.performerType = "candidateUsers";
					g.expression = r
				} else {
					if (c != null && c != "") {
						g.isUseExpression = true;
						g.performerType = "candidateGroups";
						g.expression = c
					}
				}
			}
			if (d != null && d != "") {
				g.formKey = d
			}
			var b = trim($(this).find("documentation").text());
			if (b != null && b != "") {
				g.documentation = b
			}
			g.taskId = h;
			g.taskName = n;
			g.setContent(n);
			var a = $(this).attr("activiti:class");
			var o = $(this).attr("activiti:expression");
			var l = $(this).attr("activiti:delegateExpression");
			if (a) {
				g.serviceType = "javaClass";
				g.expression = a
			} else {
				if (o) {
					g.serviceType = "expression";
					g.expression = o
				} else {
					if (l) {
						g.serviceType = "delegateExpression";
						g.expression = l
					}
				}
			}
			var k = $(this).attr("activiti:resultVariableName");
			if (k != null && k != "") {
				g.resultVariable = k
			}
			var m = $(this).find("extensionElements").find(
					"activiti\\:taskListener");
			g.setListeners(parseListeners(m, "draw2d.Task.Listener",
					"draw2d.Task.Listener.Field"));
			var q = $(this).find("potentialOwner").find(
					"resourceAssignmentExpression").find("formalExpression")
					.text();
			if (q.indexOf("user(") != -1) {
				g.performerType = "candidateUsers"
			} else {
				if (q.indexOf("group(") != -1) {
					g.performerType = "candidateGroups"
				}
			}
			var s = q.split(",");
			$.each(s, function(w, t) {
				var u = 0;
				var x = t.lastIndexOf(")");
				if (t.indexOf("user(") != -1) {
					u = "user(".length;
					var v = t.substring(u, x);
					g.addCandidateUser({
						sso : v
					})
				} else {
					if (t.indexOf("group(") != -1) {
						u = "group(".length;
						var v = t.substring(u, x);
						g.addCandidateGroup(v)
					}
				}
			});
			R.each(function(w) {
				var t = $(this).attr("bpmnElement");
				if (t == g.id) {
					var y = parseInt($(this).find(Y).attr("x"));
					var u = parseInt($(this).find(Y).attr("y"));
					var x = parseInt($(this).find(Y).attr("width"));
					var v = parseInt($(this).find(Y).attr("height"));
					g.setDimension(x, v);
					workflow.addModel(g, y, u);
					return false
				}
			})
		}
	});
	K.each(function(a) {
		var b = new draw2d.ScriptTask();
		var d = $(this).attr("id");
		b.id = d;
		var g = $(this).attr("name");
		var h = $(this).attr("scriptFormat");
		var i = $(this).attr("activiti:resultVariable");
		b.scriptFormat = h;
		b.resultVariable = i;
		var c = trim($(this).find("documentation").text());
		if (c != null && c != "") {
			b.documentation = c
		}
		var f = trim($(this).find("script").text());
		if (f != null && f != "") {
			b.expression = f
		}
		b.taskId = d;
		b.taskName = g;
		b.setContent(g);
		R.each(function(m) {
			var j = $(this).attr("bpmnElement");
			if (j == b.id) {
				var o = parseInt($(this).find(Y).attr("x"));
				var k = parseInt($(this).find(Y).attr("y"));
				var n = parseInt($(this).find(Y).attr("width"));
				var l = parseInt($(this).find(Y).attr("height"));
				b.setDimension(n, l);
				workflow.addModel(b, o, k);
				return false
			}
		})
	});
	ak.each(function(c) {
		var d = new draw2d.ReceiveTask();
		var a = $(this).attr("id");
		d.id = a;
		var b = $(this).attr("name");
		d.taskId = a;
		d.taskName = b;
		d.setContent(b);
		R.each(function(i) {
			var f = $(this).attr("bpmnElement");
			if (f == d.id) {
				var k = parseInt($(this).find(Y).attr("x"));
				var g = parseInt($(this).find(Y).attr("y"));
				var j = parseInt($(this).find(Y).attr("width"));
				var h = parseInt($(this).find(Y).attr("height"));
				d.setDimension(j, h);
				workflow.addModel(d, k, g);
				return false
			}
		})
	});
	W.each(function(b) {
		var a = new draw2d.ExclusiveGateway();
		var d = $(this).attr("id");
		var c = $(this).attr("name");
		a.id = d;
		a.gatewayId = d;
		a.gatewayName = c;
		R.each(function(i) {
			var f = $(this).attr("bpmnElement");
			if (f == a.id) {
				var k = parseInt($(this).find(Y).attr("x"));
				var g = parseInt($(this).find(Y).attr("y"));
				var j = parseInt($(this).find(Y).attr("width"));
				var h = parseInt($(this).find(Y).attr("height"));
				a.setDimension(j, h);
				workflow.addModel(a, k, g);
				return false
			}
		})
	});
	J.each(function(b) {
		var a = new draw2d.ParallelGateway();
		var d = $(this).attr("id");
		var c = $(this).attr("name");
		a.id = d;
		a.gatewayId = d;
		a.gatewayName = c;
		R.each(function(i) {
			var f = $(this).attr("bpmnElement");
			if (f == a.id) {
				var k = parseInt($(this).find(Y).attr("x"));
				var g = parseInt($(this).find(Y).attr("y"));
				var j = parseInt($(this).find(Y).attr("width"));
				var h = parseInt($(this).find(Y).attr("height"));
				a.setDimension(j, h);
				workflow.addModel(a, k, g);
				return false
			}
		})
	});
	ae
			.each(function(c) {
				if ($(this).find("timeDate").text() != "") {
					var b = new draw2d.TimerBoundary(
							"plug-in/designer/icons/timer.png");
					var a = $(this).attr("id");
					var f = $(this).attr("cancelActivity");
					var d = $(this).attr("attachedToRef");
					b.id = a;
					b.boundaryId = a;
					b.cancelActivity = f;
					b.attached = d;
					b.timeType = "timeDate";
					b.expression = $(this).find("timeDate").text()
				} else {
					if ($(this).find("timeDuration").text() != "") {
						var b = new draw2d.TimerBoundary(
								"plug-in/designer/icons/timer.png");
						var a = $(this).attr("id");
						var f = $(this).attr("cancelActivity");
						var d = $(this).attr("attachedToRef");
						b.id = a;
						b.boundaryId = a;
						b.cancelActivity = f;
						b.attached = d;
						b.timeType = "timeDuration";
						b.expression = $(this).find("timeDuration").text()
					} else {
						if ($(this).find("timeCycle").text() != "") {
							var b = new draw2d.TimerBoundary(
									"plug-in/designer/icons/timer.png");
							var a = $(this).attr("id");
							var f = $(this).attr("cancelActivity");
							var d = $(this).attr("attachedToRef");
							b.id = a;
							b.boundaryId = a;
							b.cancelActivity = f;
							b.attached = d;
							b.timeType = "timeCycle";
							b.expression = $(this).find("timeCycle").text()
						} else {
							var b = new draw2d.ErrorBoundary(
									"plug-in/designer/icons/error.png");
							var a = $(this).attr("id");
							var d = $(this).attr("attachedToRef");
							b.id = a;
							b.boundaryId = a;
							b.attached = d;
							b.expression = $(this).find("errorEventDefinition")
									.attr("errorRef")
						}
					}
				}
				R.each(function(j) {
					var g = $(this).attr("bpmnElement");
					if (g == b.id) {
						var l = parseInt($(this).find(Y).attr("x"));
						var h = parseInt($(this).find(Y).attr("y"));
						var k = parseInt($(this).find(Y).attr("width"));
						var i = parseInt($(this).find(Y).attr("height"));
						b.setDimension(k, i);
						workflow.addModel(b, l, h);
						return false
					}
				})
			});
	am.each(function(a) {
		var f = new draw2d.CallActivity(
				"plug-in/designer/icons/callactivity.png");
		var g = $(this).attr("id");
		var b = $(this).attr("name");
		var c = $(this).attr("calledElement");
		f.id = g;
		f.subProcessId = g;
		f.callSubProcess = c;
		f.name = b;
		var d = $(this).find("extensionElements");
		if (d != null) {
			f.insource = $(this).find(ai).attr("source");
			f.intarget = $(this).find(ai).attr("target");
			f.outsource = $(this).find(an).attr("source");
			f.outtarget = $(this).find(an).attr("target")
		}
		R.each(function(k) {
			var h = $(this).attr("bpmnElement");
			if (h == f.id) {
				var m = parseInt($(this).find(Y).attr("x"));
				var i = parseInt($(this).find(Y).attr("y"));
				var l = parseInt($(this).find(Y).attr("width"));
				var j = parseInt($(this).find(Y).attr("height"));
				f.setDimension(l, j);
				workflow.addModel(f, m, i);
				return false
			}
		})
	});
	O.each(function(a) {
		var b = new draw2d.BusinessRuleTask();
		var g = $(this).attr("id");
		var h = $(this).attr("activiti:ruleVariablesInput");
		var c = $(this).attr("activiti:resultVariables");
		var f = $(this).attr("activiti:rules");
		var d = $(this).attr("exclude");
		if (f != null && f != "") {
			b.rules = f;
			if (d != null && d != "") {
				b.isclude = "exclude"
			} else {
				b.isclude = "include"
			}
		} else {
			b.isclude = ""
		}
		b.id = g;
		b.taskId = g;
		b.rulesInput = h;
		b.rulesOutputs = c;
		R.each(function(l) {
			var i = $(this).attr("bpmnElement");
			if (i == b.id) {
				var n = parseInt($(this).find(Y).attr("x"));
				var j = parseInt($(this).find(Y).attr("y"));
				var m = parseInt($(this).find(Y).attr("width"));
				var k = parseInt($(this).find(Y).attr("height"));
				b.setDimension(m, k);
				workflow.addModel(b, n, j);
				return false
			}
		})
	});
	ap.each(function(h) {
		var d = $(this).attr("id");
		var k = $(this).attr("name");
		var j = $(this).find("conditionExpression").text();
		var c = $(this).attr("sourceRef");
		var i = $(this).attr("targetRef");
		var a = (browserwebkit) ? "executionListener"
				: "activiti\\:executionListener";
		var a = $(this).find("extensionElements").find(a);
		var b = parseListeners(a, "draw2d.DecoratedConnection.Listener",
				"draw2d.DecoratedConnection.Listener.Field");
		var g = workflow.getFigure(c);
		var f = workflow.getFigure(i);
		al.each(function(y) {
			var m = $(this).attr("bpmnElement");
			if (m == d) {
				var B = null;
				var q = null;
				var z = $(this).find(aa);
				var x = z.length;
				var v = $(z[0]).attr("x");
				var w = $(z[0]).attr("y");
				var r = $(z[x - 1]).attr("x");
				var s = $(z[x - 1]).attr("y");
				var u = g.getPorts();
				for (var y = 0; y < u.getSize(); y++) {
					var C = u.get(y);
					var o = parseInt(C.getAbsoluteX());
					var p = parseInt(C.getAbsoluteY());
					if (o == v && p == w) {
						B = C;
						break
					}
				}
				var t = f.getPorts();
				for (var y = 0; y < t.getSize(); y++) {
					var l = t.get(y);
					var o = parseInt(l.getAbsoluteX());
					var p = parseInt(l.getAbsoluteY());
					if (o == r && p == s) {
						q = l;
						break
					}
				}
				if (B != null && q != null) {
					var A = new draw2d.CommandConnect(workflow, B, q);
					var n = new draw2d.DecoratedConnection();
					n.id = d;
					n.lineId = d;
					n.lineName = k;
					n.setLabel(k);
					if (j != null && j != "") {
						n.condition = j
					}
					n.listeners = b;
					A.setConnection(n);
					workflow.getCommandStack().execute(A)
				}
				return false
			}
		})
	});
	if (typeof setHightlight != "undefined") {
		setHightlight()
	}
	try {
		populateProcessProperites()
	} catch (S) {
	}
}
function parseListeners(listeners, listenerType, fieldType) {
	var parsedListeners = new draw2d.ArrayList();
	listeners.each(function(i) {
		var listener = eval("new " + listenerType + "()");
		listener.event = $(this).attr("event");
		listener.id = $(this).attr("id");
		var expression = $(this).attr("delegateExpression");
		var clazz = $(this).attr("class");
		if (expression != null && expression != "") {
			listener.serviceType = "expression";
			listener.serviceExpression = expression
		} else {
			if (clazz != null && clazz != "") {
				listener.serviceType = "javaClass";
				listener.serviceClass = clazz
			}
		}
		var fields = $(this).find("activiti\\:field");
		fields.each(function(i) {
			var field = eval("new " + fieldType + "()");
			field.name = $(this).attr("name");
			var string = $(this).find("activiti\\:string").text();
			var expression = $(this).find("activiti\\:expression").text();
			if (string != null && string != "") {
				field.type = "string";
				field.value = string
			} else {
				if (expression != null && expression != "") {
					field.type = "expression";
					field.value = expression
				}
			}
			listener.setField(field)
		});
		parsedListeners.add(listener)
	});
	return parsedListeners
}
function parseForms(forms, formType) {
	var parsedForms = new draw2d.ArrayList();
	forms.each(function(i) {
		var form = eval("new " + formType + "()");
		form.id = $(this).attr("id");
		var name = $(this).attr("name");
		form.name = name;
		var type = $(this).attr("type");
		form.type = type;
		var value = $(this).attr("value");
		form.value = value;
		var exp = $(this).attr("exp");
		form.exp = exp;
		var remark = $(this).attr("remark");
		form.remark = remark;
		parsedForms.add(form)
	});
	return parsedForms
};