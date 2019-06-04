(function($){
	$.parser = {
		auto: true,
		onComplete: function(context){},
		plugins:['draggable','droppable','resizable','linkbutton','progressbar','tooltip','pagination','panel',
				'pagination','datagrid','treegrid','propertygrid','window','dialog','messager','layout','form',
				'menu','tabs','menubutton','splitbutton','accordion','calendar','validatebox','textbox','filebox',
				'combo','combobox','tree','combotree','combogrid','numberbox','searchbox','spinner','numberspinner',
				'timespinner','datetimespinner','datebox','datetimebox','slider'
		],
		parse: function(context){
			var aa = [];
			for(var i=0; i<$.parser.plugins.length; i++){
				var name = $.parser.plugins[i];
				var r = $('.mwsmartui-' + name, context);
				if (r.length){
					if (r[name]){
						r[name]();
					} else {
						aa.push({name:name,jq:r});
					}
				}
			}
			if (aa.length && window.mwsmartloader){
				var names = [];
				for(var i=0; i<aa.length; i++){
					names.push(aa[i].name);
				}
				mwsmartloader.load(names, function(){
					for(var i=0; i<aa.length; i++){
						var name = aa[i].name;
						var jq = aa[i].jq;
						jq[name]();
					}
					$.parser.onComplete.call($.parser, context);
				});
			} else {
				$.parser.onComplete.call($.parser, context);
			}
		},
		parseValue: function(property, value, parent, delta){
			delta = delta || 0;
			var v = $.trim(String(value||''));
			var endchar = v.substr(v.length-1, 1);
			if (endchar == '%'){
				v = parseInt(v.substr(0, v.length-1));
				if (property.toLowerCase().indexOf('width') >= 0){
					v = Math.floor((parent.width()-delta) * v / 100.0);
				} else {
					v = Math.floor((parent.height()-delta) * v / 100.0);
				}
			} else {
				v = parseInt(v) || undefined;
			}
			return v;
		},
		parseOptions: function(target, properties){
			var t = $(target);
			var options = {};
			var s = $.trim(t.attr('data-options'));
			if (s){
				if (s.substring(0, 1) != '{'){
					s = '{' + s + '}';
				}
				options = (new Function('return ' + s))();
			}
			$.map(['width','height','left','top','minWidth','maxWidth','minHeight','maxHeight'], function(p){
				var pv = $.trim(target.style[p] || '');
				if (pv){
					if (pv.indexOf('%') == -1){
						pv = parseInt(pv) || undefined;
					}
					options[p] = pv;
				}
			});
			if (properties){
				var opts = {};
				for(var i=0; i<properties.length; i++){
					var pp = properties[i];
					if (typeof pp == 'string'){
						opts[pp] = t.attr(pp);
					} else {
						for(var name in pp){
							var type = pp[name];
							if (type == 'boolean'){
								opts[name] = t.attr(name) ? (t.attr(name) == 'true') : undefined;
							} else if (type == 'number'){
								opts[name] = t.attr(name)=='0' ? 0 : parseFloat(t.attr(name)) || undefined;
							}
						}
					}
				}
				$.extend(options, opts);
			}
			return options;
		}
	};
	$(function(){
		var d = $('<div style="position:absolute;top:-1000px;width:100px;height:100px;padding:5px"></div>').appendTo('body');
		$._boxModel = d.outerWidth()!=100;
		d.remove();
		if (!window.mwsmartloader && $.parser.auto){
			$.parser.parse();
		}
	});
	$.fn._outerWidth = function(width){
		if (width == undefined){
			if (this[0] == window){
				//return this.width() || document.body.clientWidth;
				return Math.max(this.width() , document.body.clientWidth);
			}
			return this.outerWidth()||0;
		}
		return this._size('width', width);
	};
	$.fn._outerHeight = function(height){
		if (height == undefined){
			if (this[0] == window){
				//return this.height() || document.body.clientHeight;
				return Math.max(this.height() , document.body.clientHeight);
			}
			return this.outerHeight()||0;
		}
		return this._size('height', height);
	};
	$.fn._scrollLeft = function(left){
		if (left == undefined){
			return this.scrollLeft();
		} else {
			return this.each(function(){$(this).scrollLeft(left)});
		}
	};
	$.fn._propAttr = $.fn.prop || $.fn.attr;
	$.fn._size = function(options, parent){
		if (typeof options == 'string'){
			if (options == 'clear'){
				return this.each(function(){
					$(this).css({width:'',minWidth:'',maxWidth:'',height:'',minHeight:'',maxHeight:''});
				});
			} else if (options == 'unfit'){
				return this.each(function(){
					_fit(this, $(this).parent(), false);
				});
			} else {
				if (parent == undefined){
					return _css(this[0], options);
				} else {
					return this.each(function(){
						_css(this, options, parent);
					});
				}
			}
		} else {
			return this.each(function(){
				parent = parent || $(this).parent();
				$.extend(options, _fit(this, parent, options.fit)||{});
				var r1 = _setSize(this, 'width', parent, options);
				var r2 = _setSize(this, 'height', parent, options);
				if (r1 || r2){
					$(this).addClass('mwsmartui-fluid');
				} else {
					$(this).removeClass('mwsmartui-fluid');
				}
			});
		}
		function _fit(target, parent, fit){
			var t = $(target)[0];
			var p = parent[0];
			var fcount = p.fcount || 0;
			if (fit){
				if (!t.fitted){
					t.fitted = true;
					p.fcount = fcount + 1;
					$(p).addClass('panel-noscroll');
					if (p.tagName == 'BODY'){
						$('html').addClass('panel-fit');
					}
				}
				return {
					width: ($(p).width()||1),
					height: ($(p).height()||1)
				};
			} else {
				if (t.fitted){
					t.fitted = false;
					p.fcount = fcount - 1;
					if (p.fcount == 0){
						$(p).removeClass('panel-noscroll');
						if (p.tagName == 'BODY'){
							$('html').removeClass('panel-fit');
						}
					}
				}
				return false;
			}
		}
		function _setSize(target, property, parent, options){
			var t = $(target);
			var p = property;
			var p1 = p.substr(0,1).toUpperCase() + p.substr(1);
			var min = $.parser.parseValue('min'+p1, options['min'+p1], parent);// || 0;
			var max = $.parser.parseValue('max'+p1, options['max'+p1], parent);// || 99999;
			var val = $.parser.parseValue(p, options[p], parent);
			var fluid = (String(options[p]||'').indexOf('%') >= 0 ? true : false);
			if (!isNaN(val)){
				var v = Math.min(Math.max(val, min||0), max||99999);
				if (!fluid){
					options[p] = v;
				}
				t._size('min'+p1, '');
				t._size('max'+p1, '');
				t._size(p, v);
			} else {
				t._size(p, '');
				t._size('min'+p1, min);
				t._size('max'+p1, max);
			}
			return fluid || options.fit;
		}
		function _css(target, property, value){
			var t = $(target);
			if (value == undefined){
				value = parseInt(target.style[property]);
				if (isNaN(value)){return undefined;}
				if ($._boxModel){
					value += getDeltaSize();
				}
				return value;
			} else if (value === ''){
				t.css(property, '');
			} else {
				if ($._boxModel){
					value -= getDeltaSize();
					if (value < 0){value = 0;}
				}
				t.css(property, value+'px');
			}
			function getDeltaSize(){
				if (property.toLowerCase().indexOf('width') >= 0){
					return t.outerWidth() - t.width();
				} else {
					return t.outerHeight() - t.height();
				}
			}
		}
	};
})(jQuery);
(function($){
	var longTouchTimer = null;
	var dblTouchTimer = null;
	var isDblClick = false;
	function onTouchStart(e){
		if (e.touches.length != 1){return}
		if (!isDblClick){
			isDblClick = true;
			dblClickTimer = setTimeout(function(){
				isDblClick = false;
			}, 500);
		} else {
			clearTimeout(dblClickTimer);
			isDblClick = false;
			fire(e, 'dblclick');
//			e.preventDefault();
		}
		longTouchTimer = setTimeout(function(){
			fire(e, 'contextmenu', 3);
		}, 1000);
		fire(e, 'mousedown');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	function onTouchMove(e){
		if (e.touches.length != 1){return}
		if (longTouchTimer){
			clearTimeout(longTouchTimer);
		}
		fire(e, 'mousemove');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	function onTouchEnd(e){
//		if (e.touches.length > 0){return}
		if (longTouchTimer){
			clearTimeout(longTouchTimer);
		}
		fire(e, 'mouseup');
		if ($.fn.draggable.isDragging || $.fn.resizable.isResizing){
			e.preventDefault();
		}
	}
	function fire(e, name, which){
		var event = new $.Event(name);
		event.pageX = e.changedTouches[0].pageX;
		event.pageY = e.changedTouches[0].pageY;
		event.which = which || 1;
		$(e.target).trigger(event);
	}
	if (document.addEventListener){
		document.addEventListener("touchstart", onTouchStart, true);
		document.addEventListener("touchmove", onTouchMove, true);
		document.addEventListener("touchend", onTouchEnd, true);
	}
})(jQuery);
//draggable
(function($){
//	var isDragging = false;
	function drag(e){
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		var proxy = state.proxy;
		var dragData = e.data;
		var left = dragData.startLeft + e.pageX - dragData.startX;
		var top = dragData.startTop + e.pageY - dragData.startY;
		if (proxy){
			if (proxy.parent()[0] == document.body){
				if (opts.deltaX != null && opts.deltaX != undefined){
					left = e.pageX + opts.deltaX;
				} else {
					left = e.pageX - e.data.offsetWidth;
				}
				if (opts.deltaY != null && opts.deltaY != undefined){
					top = e.pageY + opts.deltaY;
				} else {
					top = e.pageY - e.data.offsetHeight;
				}
			} else {
				if (opts.deltaX != null && opts.deltaX != undefined){
					left += e.data.offsetWidth + opts.deltaX;
				}
				if (opts.deltaY != null && opts.deltaY != undefined){
					top += e.data.offsetHeight + opts.deltaY;
				}
			}
		}
//		if (opts.deltaX != null && opts.deltaX != undefined){
//			left = e.pageX + opts.deltaX;
//		}
//		if (opts.deltaY != null && opts.deltaY != undefined){
//			top = e.pageY + opts.deltaY;
//		}
		if (e.data.parent != document.body) {
			left += $(e.data.parent).scrollLeft();
			top += $(e.data.parent).scrollTop();
		}
		if (opts.axis == 'h') {
			dragData.left = left;
		} else if (opts.axis == 'v') {
			dragData.top = top;
		} else {
			dragData.left = left;
			dragData.top = top;
		}
	}
	function applyDrag(e){
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		var proxy = state.proxy;
		if (!proxy){
			proxy = $(e.data.target);
		}
//		if (proxy){
//			proxy.css('cursor', opts.cursor);
//		} else {
//			proxy = $(e.data.target);
//			$.data(e.data.target, 'draggable').handle.css('cursor', opts.cursor);
//		}
		proxy.css({
			left:e.data.left,
			top:e.data.top
		});
		$('body').css('cursor', opts.cursor);
	}
	function doDown(e){
//		isDragging = true;
		$.fn.draggable.isDragging = true;
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		var droppables = $('.droppable').filter(function(){
			return e.data.target != this;
		}).filter(function(){
			var accept = $.data(this, 'droppable').options.accept;
			if (accept){
				return $(accept).filter(function(){
					return this == e.data.target;
				}).length > 0;
			} else {
				return true;
			}
		});
		state.droppables = droppables;
		var proxy = state.proxy;
		if (!proxy){
			if (opts.proxy){
				if (opts.proxy == 'clone'){
					proxy = $(e.data.target).clone().insertAfter(e.data.target);
				} else {
					proxy = opts.proxy.call(e.data.target, e.data.target);
				}
				state.proxy = proxy;
			} else {
				proxy = $(e.data.target);
			}
		}
		proxy.css('position', 'absolute');
		drag(e);
		applyDrag(e);
		opts.onStartDrag.call(e.data.target, e);
		return false;
	}
	function doMove(e){
		var state = $.data(e.data.target, 'draggable');
		drag(e);
		if (state.options.onDrag.call(e.data.target, e) != false){
			applyDrag(e);
		}
		var source = e.data.target;
		state.droppables.each(function(){
			var dropObj = $(this);
			if (dropObj.droppable('options').disabled){return;}
			var p2 = dropObj.offset();
			if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
					&& e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
				if (!this.entered){
					$(this).trigger('_dragenter', [source]);
					this.entered = true;
				}
				$(this).trigger('_dragover', [source]);
			} else {
				if (this.entered){
					$(this).trigger('_dragleave', [source]);
					this.entered = false;
				}
			}
		});
		return false;
	}
	function doUp(e){
//		isDragging = false;
		$.fn.draggable.isDragging = false;
//		drag(e);
		doMove(e);
		var state = $.data(e.data.target, 'draggable');
		var proxy = state.proxy;
		var opts = state.options;
		if (opts.revert){
			if (checkDrop() == true){
				$(e.data.target).css({
					position:e.data.startPosition,
					left:e.data.startLeft,
					top:e.data.startTop
				});
			} else {
				if (proxy){
					var left, top;
					if (proxy.parent()[0] == document.body){
						left = e.data.startX - e.data.offsetWidth;
						top = e.data.startY - e.data.offsetHeight;
					} else {
						left = e.data.startLeft;
						top = e.data.startTop;
					}
					proxy.animate({
						left: left,
						top: top
					}, function(){
						removeProxy();
					});
				} else {
					$(e.data.target).animate({
						left:e.data.startLeft,
						top:e.data.startTop
					}, function(){
						$(e.data.target).css('position', e.data.startPosition);
					});
				}
			}
		} else {
			$(e.data.target).css({
				position:'absolute',
				left:e.data.left,
				top:e.data.top
			});
			checkDrop();
		}
		opts.onStopDrag.call(e.data.target, e);
		$(document).unbind('.draggable');
		setTimeout(function(){
			$('body').css('cursor','');
		},100);
		function removeProxy(){
			if (proxy){
				proxy.remove();
			}
			state.proxy = null;
		}
		function checkDrop(){
			var dropped = false;
			state.droppables.each(function(){
				var dropObj = $(this);
				if (dropObj.droppable('options').disabled){return;}
				var p2 = dropObj.offset();
				if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
						&& e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
					if (opts.revert){
						$(e.data.target).css({
							position:e.data.startPosition,
							left:e.data.startLeft,
							top:e.data.startTop
						});
					}
					$(this).trigger('_drop', [e.data.target]);
					removeProxy();
					dropped = true;
					this.entered = false;
					return false;
				}
			});
			if (!dropped && !opts.revert){
				removeProxy();
			}
			return dropped;
		}
		return false;
	}
	$.fn.draggable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.draggable.methods[options](this, param);
		}
		return this.each(function(){
			var opts;
			var state = $.data(this, 'draggable');
			if (state) {
				state.handle.unbind('.draggable');
				opts = $.extend(state.options, options);
			} else {
				opts = $.extend({}, $.fn.draggable.defaults, $.fn.draggable.parseOptions(this), options || {});
			}
			var handle = opts.handle ? (typeof opts.handle=='string' ? $(opts.handle, this) : opts.handle) : $(this);
			$.data(this, 'draggable', {
				options: opts,
				handle: handle
			});
			if (opts.disabled) {
				$(this).css('cursor', '');
				return;
			}
			handle.unbind('.draggable').bind('mousemove.draggable', {target:this}, function(e){
//				if (isDragging) return;
				if ($.fn.draggable.isDragging){return}
				var opts = $.data(e.data.target, 'draggable').options;
				if (checkArea(e)){
					$(this).css('cursor', opts.cursor);
				} else {
					$(this).css('cursor', '');
				}
			}).bind('mouseleave.draggable', {target:this}, function(e){
				$(this).css('cursor', '');
			}).bind('mousedown.draggable', {target:this}, function(e){
				if (checkArea(e) == false) return;
				$(this).css('cursor', '');
				var position = $(e.data.target).position();
				var offset = $(e.data.target).offset();
				var data = {
					startPosition: $(e.data.target).css('position'),
					startLeft: position.left,
					startTop: position.top,
					left: position.left,
					top: position.top,
					startX: e.pageX,
					startY: e.pageY,
					offsetWidth: (e.pageX - offset.left),
					offsetHeight: (e.pageY - offset.top),
					target: e.data.target,
					parent: $(e.data.target).parent()[0]
				};
				$.extend(e.data, data);
				var opts = $.data(e.data.target, 'draggable').options;
				if (opts.onBeforeDrag.call(e.data.target, e) == false) return;
				$(document).bind('mousedown.draggable', e.data, doDown);
				$(document).bind('mousemove.draggable', e.data, doMove);
				$(document).bind('mouseup.draggable', e.data, doUp);
//				$('body').css('cursor', opts.cursor);
			});
			// check if the handle can be dragged
			function checkArea(e) {
				var state = $.data(e.data.target, 'draggable');
				var handle = state.handle;
				var offset = $(handle).offset();
				var width = $(handle).outerWidth();
				var height = $(handle).outerHeight();
				var t = e.pageY - offset.top;
				var r = offset.left + width - e.pageX;
				var b = offset.top + height - e.pageY;
				var l = e.pageX - offset.left;
				return Math.min(t,r,b,l) > state.options.edge;
			}
		});
	};
	$.fn.draggable.methods = {
		options: function(jq){
			return $.data(jq[0], 'draggable').options;
		},
		proxy: function(jq){
			return $.data(jq[0], 'draggable').proxy;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).draggable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).draggable({disabled:true});
			});
		}
	};
	$.fn.draggable.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, 
				$.parser.parseOptions(target, ['cursor','handle','axis',
				       {'revert':'boolean','deltaX':'number','deltaY':'number','edge':'number'}]), {
			disabled: (t.attr('disabled') ? true : undefined)
		});
	};
	$.fn.draggable.defaults = {
		proxy:null,	// 'clone' or a function that will create the proxy object, 
					// the function has the source parameter that indicate the source object dragged.
		revert:false,
		cursor:'move',
		deltaX:null,
		deltaY:null,
		handle: null,
		disabled: false,
		edge:0,
		axis:null,	// v or h
		onBeforeDrag: function(e){},
		onStartDrag: function(e){},
		onDrag: function(e){},
		onStopDrag: function(e){}
	};
	$.fn.draggable.isDragging = false;
//	$(function(){
//		function touchHandler(e) {
//			var touches = e.changedTouches, first = touches[0], type = "";
//
//			switch(e.type) {
//				case "touchstart": type = "mousedown"; break;
//				case "touchmove":  type = "mousemove"; break;        
//				case "touchend":   type = "mouseup";   break;
//				default: return;
//			}
//			var simulatedEvent = document.createEvent("MouseEvent");
//			simulatedEvent.initMouseEvent(type, true, true, window, 1,
//									  first.screenX, first.screenY,
//									  first.clientX, first.clientY, false,
//									  false, false, false, 0/*left*/, null);
//
//			first.target.dispatchEvent(simulatedEvent);
//			if (isDragging){
//				e.preventDefault();
//			}
//		}
//		
//		if (document.addEventListener){
//			document.addEventListener("touchstart", touchHandler, true);
//			document.addEventListener("touchmove", touchHandler, true);
//			document.addEventListener("touchend", touchHandler, true);
//			document.addEventListener("touchcancel", touchHandler, true); 
//		}
//	});
})(jQuery);
//droppable
(function($){
	function init(target){
		$(target).addClass('droppable');
		$(target).bind('_dragenter', function(e, source){
			$.data(target, 'droppable').options.onDragEnter.apply(target, [e, source]);
		});
		$(target).bind('_dragleave', function(e, source){
			$.data(target, 'droppable').options.onDragLeave.apply(target, [e, source]);
		});
		$(target).bind('_dragover', function(e, source){
			$.data(target, 'droppable').options.onDragOver.apply(target, [e, source]);
		});
		$(target).bind('_drop', function(e, source){
			$.data(target, 'droppable').options.onDrop.apply(target, [e, source]);
		});
	}
	$.fn.droppable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.droppable.methods[options](this, param);
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'droppable');
			if (state){
				$.extend(state.options, options);
			} else {
				init(this);
				$.data(this, 'droppable', {
					options: $.extend({}, $.fn.droppable.defaults, $.fn.droppable.parseOptions(this), options)
				});
			}
		});
	};
	$.fn.droppable.methods = {
		options: function(jq){
			return $.data(jq[0], 'droppable').options;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).droppable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).droppable({disabled:true});
			});
		}
	};
	$.fn.droppable.parseOptions = function(target){
		var t = $(target);
		return $.extend({},	$.parser.parseOptions(target, ['accept']), {
			disabled: (t.attr('disabled') ? true : undefined)
		});
	};
	$.fn.droppable.defaults = {
		accept:null,
		disabled:false,
		onDragEnter:function(e, source){},
		onDragOver:function(e, source){},
		onDragLeave:function(e, source){},
		onDrop:function(e, source){}
	};
})(jQuery);
//resizable
(function($){
//	var isResizing = false;
	$.fn.resizable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.resizable.methods[options](this, param);
		}
		function resize(e){
			var resizeData = e.data;
			var options = $.data(resizeData.target, 'resizable').options;
			if (resizeData.dir.indexOf('e') != -1) {
				var width = resizeData.startWidth + e.pageX - resizeData.startX;
				width = Math.min(
							Math.max(width, options.minWidth),
							options.maxWidth
						);
				resizeData.width = width;
			}
			if (resizeData.dir.indexOf('s') != -1) {
				var height = resizeData.startHeight + e.pageY - resizeData.startY;
				height = Math.min(
						Math.max(height, options.minHeight),
						options.maxHeight
				);
				resizeData.height = height;
			}
			if (resizeData.dir.indexOf('w') != -1) {
				var width = resizeData.startWidth - e.pageX + resizeData.startX;
				width = Math.min(
							Math.max(width, options.minWidth),
							options.maxWidth
						);
				resizeData.width = width;
				resizeData.left = resizeData.startLeft + resizeData.startWidth - resizeData.width;
//				resizeData.width = resizeData.startWidth - e.pageX + resizeData.startX;
//				if (resizeData.width >= options.minWidth && resizeData.width <= options.maxWidth) {
//					resizeData.left = resizeData.startLeft + e.pageX - resizeData.startX;
//				}
			}
			if (resizeData.dir.indexOf('n') != -1) {
				var height = resizeData.startHeight - e.pageY + resizeData.startY;
				height = Math.min(
							Math.max(height, options.minHeight),
							options.maxHeight
						);
				resizeData.height = height;
				resizeData.top = resizeData.startTop + resizeData.startHeight - resizeData.height;
//				resizeData.height = resizeData.startHeight - e.pageY + resizeData.startY;
//				if (resizeData.height >= options.minHeight && resizeData.height <= options.maxHeight) {
//					resizeData.top = resizeData.startTop + e.pageY - resizeData.startY;
//				}
			}
		}
		function applySize(e){
			var resizeData = e.data;
			var t = $(resizeData.target);
			t.css({
				left: resizeData.left,
				top: resizeData.top
			});
			if (t.outerWidth() != resizeData.width){t._outerWidth(resizeData.width)}
			if (t.outerHeight() != resizeData.height){t._outerHeight(resizeData.height)}
//			t._outerWidth(resizeData.width)._outerHeight(resizeData.height);
		}
		function doDown(e){
//			isResizing = true;
			$.fn.resizable.isResizing = true;
			$.data(e.data.target, 'resizable').options.onStartResize.call(e.data.target, e);
			return false;
		}
		function doMove(e){
			resize(e);
			if ($.data(e.data.target, 'resizable').options.onResize.call(e.data.target, e) != false){
				applySize(e)
			}
			return false;
		}
		function doUp(e){
//			isResizing = false;
			$.fn.resizable.isResizing = false;
			resize(e, true);
			applySize(e);
			$.data(e.data.target, 'resizable').options.onStopResize.call(e.data.target, e);
			$(document).unbind('.resizable');
			$('body').css('cursor','');
//			$('body').css('cursor','auto');
			return false;
		}
		return this.each(function(){
			var opts = null;
			var state = $.data(this, 'resizable');
			if (state) {
				$(this).unbind('.resizable');
				opts = $.extend(state.options, options || {});
			} else {
				opts = $.extend({}, $.fn.resizable.defaults, $.fn.resizable.parseOptions(this), options || {});
				$.data(this, 'resizable', {
					options:opts
				});
			}
			if (opts.disabled == true) {
				return;
			}
			// bind mouse event using namespace resizable
			$(this).bind('mousemove.resizable', {target:this}, function(e){
//				if (isResizing) return;
				if ($.fn.resizable.isResizing){return}
				var dir = getDirection(e);
				if (dir == '') {
					$(e.data.target).css('cursor', '');
				} else {
					$(e.data.target).css('cursor', dir + '-resize');
				}
			}).bind('mouseleave.resizable', {target:this}, function(e){
				$(e.data.target).css('cursor', '');
			}).bind('mousedown.resizable', {target:this}, function(e){
				var dir = getDirection(e);
				if (dir == '') return;
				function getCssValue(css) {
					var val = parseInt($(e.data.target).css(css));
					if (isNaN(val)) {
						return 0;
					} else {
						return val;
					}
				}
				var data = {
					target: e.data.target,
					dir: dir,
					startLeft: getCssValue('left'),
					startTop: getCssValue('top'),
					left: getCssValue('left'),
					top: getCssValue('top'),
					startX: e.pageX,
					startY: e.pageY,
					startWidth: $(e.data.target).outerWidth(),
					startHeight: $(e.data.target).outerHeight(),
					width: $(e.data.target).outerWidth(),
					height: $(e.data.target).outerHeight(),
					deltaWidth: $(e.data.target).outerWidth() - $(e.data.target).width(),
					deltaHeight: $(e.data.target).outerHeight() - $(e.data.target).height()
				};
				$(document).bind('mousedown.resizable', data, doDown);
				$(document).bind('mousemove.resizable', data, doMove);
				$(document).bind('mouseup.resizable', data, doUp);
				$('body').css('cursor', dir+'-resize');
			});
			// get the resize direction
			function getDirection(e) {
				var tt = $(e.data.target);
				var dir = '';
				var offset = tt.offset();
				var width = tt.outerWidth();
				var height = tt.outerHeight();
				var edge = opts.edge;
				if (e.pageY > offset.top && e.pageY < offset.top + edge) {
					dir += 'n';
				} else if (e.pageY < offset.top + height && e.pageY > offset.top + height - edge) {
					dir += 's';
				}
				if (e.pageX > offset.left && e.pageX < offset.left + edge) {
					dir += 'w';
				} else if (e.pageX < offset.left + width && e.pageX > offset.left + width - edge) {
					dir += 'e';
				}
				var handles = opts.handles.split(',');
				for(var i=0; i<handles.length; i++) {
					var handle = handles[i].replace(/(^\s*)|(\s*$)/g, '');
					if (handle == 'all' || handle == dir) {
						return dir;
					}
				}
				return '';
			}
		});
	};
	$.fn.resizable.methods = {
		options: function(jq){
			return $.data(jq[0], 'resizable').options;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).resizable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).resizable({disabled:true});
			});
		}
	};
	$.fn.resizable.parseOptions = function(target){
		var t = $(target);
		return $.extend({},
				$.parser.parseOptions(target, [
					'handles',{minWidth:'number',minHeight:'number',maxWidth:'number',maxHeight:'number',edge:'number'}
				]), {
			disabled: (t.attr('disabled') ? true : undefined)
		})
	};
	$.fn.resizable.defaults = {
		disabled:false,
		handles:'n, e, s, w, ne, se, sw, nw, all',
		minWidth: 10,
		minHeight: 10,
		maxWidth: 10000,//$(document).width(),
		maxHeight: 10000,//$(document).height(),
		edge:5,
		onStartResize: function(e){},
		onResize: function(e){},
		onStopResize: function(e){}
	};
	$.fn.resizable.isResizing = false;
})(jQuery);
//linkbutton
(function($){
	function setSize(target, param){
		var opts = $.data(target, 'linkbutton').options;
		if (param){
			$.extend(opts, param);
		}
		if (opts.width || opts.height || opts.fit){
			var spacer = $('<div style="display:none"></div>').insertBefore(target);
			var btn = $(target);
			var parent = btn.parent();
			btn.appendTo('body');
			btn._size(opts, parent);
			var left = btn.find('.l-btn-left');
			left.css('margin-top', parseInt((btn.height()-left.height())/2)+'px');
			btn.insertAfter(spacer);
			spacer.remove();
		}
	}
	function createButton(target) {
		var opts = $.data(target, 'linkbutton').options;
		var t = $(target).empty();
		t.addClass('l-btn').removeClass('l-btn-plain l-btn-selected l-btn-plain-selected');
		t.removeClass('l-btn-small l-btn-medium l-btn-large').addClass('l-btn-'+opts.size);
		if (opts.plain){t.addClass('l-btn-plain')}
		if (opts.selected){
			t.addClass(opts.plain ? 'l-btn-selected l-btn-plain-selected' : 'l-btn-selected');
		}
		t.attr('group', opts.group || '');
		t.attr('id', opts.id || '');
		var inner = $('<span class="l-btn-left"></span>').appendTo(t);
		if (opts.text){
			$('<span class="l-btn-text"></span>').html(opts.text).appendTo(inner);
		} else {
			$('<span class="l-btn-text l-btn-empty">&nbsp;</span>').appendTo(inner);
		}
		if (opts.iconCls){
			$('<span class="l-btn-icon">&nbsp;</span>').addClass(opts.iconCls).appendTo(inner);
			inner.addClass('l-btn-icon-'+opts.iconAlign);
		}
		t.unbind('.linkbutton').bind('focus.linkbutton',function(){
			if (!opts.disabled){
				$(this).addClass('l-btn-focus');
			}
		}).bind('blur.linkbutton',function(){
			$(this).removeClass('l-btn-focus');
		}).bind('click.linkbutton',function(){
			if (!opts.disabled){
				if (opts.toggle){
					if (opts.selected){
						$(this).linkbutton('unselect');
					} else {
						$(this).linkbutton('select');
					}
				}
				opts.onClick.call(this);
			}
//			return false;
		});
//		if (opts.toggle && !opts.disabled){
//			t.bind('click.linkbutton', function(){
//				if (opts.selected){
//					$(this).linkbutton('unselect');
//				} else {
//					$(this).linkbutton('select');
//				}
//			});
//		}
		setSelected(target, opts.selected)
		setDisabled(target, opts.disabled);
	}
	function setSelected(target, selected){
		var opts = $.data(target, 'linkbutton').options;
		if (selected){
			if (opts.group){
				$('a.l-btn[group="'+opts.group+'"]').each(function(){
					var o = $(this).linkbutton('options');
					if (o.toggle){
						$(this).removeClass('l-btn-selected l-btn-plain-selected');
						o.selected = false;
					}
				});
			}
			$(target).addClass(opts.plain ? 'l-btn-selected l-btn-plain-selected' : 'l-btn-selected');
			opts.selected = true;
		} else {
			if (!opts.group){
				$(target).removeClass('l-btn-selected l-btn-plain-selected');
				opts.selected = false;
			}
		}
	}
	function setDisabled(target, disabled){
		var state = $.data(target, 'linkbutton');
		var opts = state.options;
		$(target).removeClass('l-btn-disabled l-btn-plain-disabled');
		if (disabled){
			opts.disabled = true;
			var href = $(target).attr('href');
			if (href){
				state.href = href;
				$(target).attr('href', 'javascript:void(0)');
			}
			if (target.onclick){
				state.onclick = target.onclick;
				target.onclick = null;
			}
			opts.plain ? $(target).addClass('l-btn-disabled l-btn-plain-disabled') : $(target).addClass('l-btn-disabled');
		} else {
			opts.disabled = false;
			if (state.href) {
				$(target).attr('href', state.href);
			}
			if (state.onclick) {
				target.onclick = state.onclick;
			}
		}
	}
	$.fn.linkbutton = function(options, param){
		if (typeof options == 'string'){
			return $.fn.linkbutton.methods[options](this, param);
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'linkbutton');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'linkbutton', {
					options: $.extend({}, $.fn.linkbutton.defaults, $.fn.linkbutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
				$(this).bind('_resize', function(e, force){
					if ($(this).hasClass('mwsmartui-fluid') || force){
						setSize(this);
					}
					return false;
				});
			}
			createButton(this);
			setSize(this);
		});
	};
	$.fn.linkbutton.methods = {
		options: function(jq){
			return $.data(jq[0], 'linkbutton').options;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
			});
		},
		select: function(jq){
			return jq.each(function(){
				setSelected(this, true);
			});
		},
		unselect: function(jq){
			return jq.each(function(){
				setSelected(this, false);
			});
		}
	};
	$.fn.linkbutton.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, 
			['id','iconCls','iconAlign','group','size',{plain:'boolean',toggle:'boolean',selected:'boolean'}]
		), {
			disabled: (t.attr('disabled') ? true : undefined),
			text: $.trim(t.html()),
			iconCls: (t.attr('icon') || t.attr('iconCls'))
		});
	};
	$.fn.linkbutton.defaults = {
		id: null,
		disabled: false,
		toggle: false,
		selected: false,
		group: null,
		plain: false,
		text: '',
		iconCls: null,
		iconAlign: 'left',
		size: 'small',	// small,large
		onClick: function(){}
	};
})(jQuery);
//progressbar
(function($){
	function init(target){
		$(target).addClass('progressbar');
		$(target).html('<div class="progressbar-text"></div><div class="progressbar-value"><div class="progressbar-text"></div></div>');
		$(target).bind('_resize', function(e,force){
			if ($(this).hasClass('mwsmartui-fluid') || force){
				setSize(target);
			}
			return false;
		});
		return $(target);
	}
	function setSize(target,width){
		var opts = $.data(target, 'progressbar').options;
		var bar = $.data(target, 'progressbar').bar;
		if (width) opts.width = width;
		bar._size(opts);
		bar.find('div.progressbar-text').css('width', bar.width());
		bar.find('div.progressbar-text,div.progressbar-value').css({
			height: bar.height()+'px',
			lineHeight: bar.height()+'px'
		});
	}
	$.fn.progressbar = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.progressbar.methods[options];
			if (method){
				return method(this, param);
			}
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'progressbar');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'progressbar', {
					options: $.extend({}, $.fn.progressbar.defaults, $.fn.progressbar.parseOptions(this), options),
					bar: init(this)
				});
			}
			$(this).progressbar('setValue', state.options.value);
			setSize(this);
		});
	};
	$.fn.progressbar.methods = {
		options: function(jq){
			return $.data(jq[0], 'progressbar').options;
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		},
		getValue: function(jq){
			return $.data(jq[0], 'progressbar').options.value;
		},
		setValue: function(jq, value){
			if (value < 0) value = 0;
			if (value > 100) value = 100;
			return jq.each(function(){
				var opts = $.data(this, 'progressbar').options;
				var text = opts.text.replace(/{value}/, value);
				var oldValue = opts.value;
				opts.value = value;
				$(this).find('div.progressbar-value').width(value+'%');
				$(this).find('div.progressbar-text').html(text);
				if (oldValue != value){
					opts.onChange.call(this, value, oldValue);
				}
			});
		}
	};
	$.fn.progressbar.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, ['width','height','text',{value:'number'}]));
	};
	$.fn.progressbar.defaults = {
		width: 'auto',
		height: 22,
		value: 0,	// percentage value
		text: '{value}%',
		onChange:function(newValue,oldValue){}
	};
})(jQuery);
//tooltip
(function($){
	function init(target){
		$(target).addClass("tooltip-f");
	};
	function bindEvents(target){
		var opts=$.data(target,"tooltip").options;
		$(target).unbind(".tooltip").bind(opts.showEvent+".tooltip",function(e){
			$(target).tooltip("show",e);
		}).bind(opts.hideEvent+".tooltip",function(e){
			$(target).tooltip("hide",e);
		}).bind("mousemove.tooltip",function(e){
			if(opts.trackMouse){
				opts.trackMouseX=e.pageX;
				opts.trackMouseY=e.pageY;
				$(target).tooltip("reposition");
			}
		});
	};
	function clearTimer(target){
		var tooltip=$.data(target,"tooltip");
		if(tooltip.showTimer){
			clearTimeout(tooltip.showTimer);
			tooltip.showTimer=null;
		}
		if(tooltip.hideTimer){
			clearTimeout(tooltip.hideTimer);
			tooltip.hideTimer=null;
		}
	};
	function reposition(target){
		var tooltip=$.data(target,"tooltip");
		if(!tooltip||!tooltip.tip){
			return;
		}
		var opts=tooltip.options;
		var tip=tooltip.tip;
		var position={left:-100000,top:-100000};
		if($(target).is(":visible")){
			position=calculatePosition(opts.position);
			if(opts.position=="top"&&position.top<0){
			position=calculatePosition("bottom");
			}else{
				if((opts.position=="bottom")&&(position.top+tip._outerHeight()>$(window)._outerHeight()+$(document).scrollTop())){
					position=calculatePosition("top");
				}
			}
			if(position.left<0){
				if(opts.position=="left"){
					position=calculatePosition("right");
				}else{
					$(target).tooltip("arrow").css("left",tip._outerWidth()/2+position.left);
					position.left=0;
				}
			}else{
				if(position.left+tip._outerWidth()>$(window)._outerWidth()+$(document)._scrollLeft()){
					if(opts.position=="right"){
						position=calculatePosition("left");
					}else{
						var _10=position.left;
						position.left=$(window)._outerWidth()+$(document)._scrollLeft()-tip._outerWidth();
						$(target).tooltip("arrow").css("left",tip._outerWidth()/2-(position.left-_10));
					}
				}
			}
		}
		tip.css({left:position.left,top:position.top,zIndex:(opts.zIndex!=undefined?opts.zIndex:($.fn.window?$.fn.window.defaults.zIndex++:""))});
		opts.onPosition.call(target,position.left,position.top);
		function calculatePosition(location){
			opts.position=location||"bottom";
			tip.removeClass("tooltip-top tooltip-bottom tooltip-left tooltip-right").addClass("tooltip-"+opts.position);
			var left,top;
			if(opts.trackMouse){
				t=$();
				left=opts.trackMouseX+opts.deltaX;
				top=opts.trackMouseY+opts.deltaY;
			}else{
				var t=$(target);
				left=t.offset().left+opts.deltaX;
				top=t.offset().top+opts.deltaY;
			}
			switch(opts.position){
				case "right":
				left+=t._outerWidth()+12+(opts.trackMouse?12:0);
				top-=(tip._outerHeight()-t._outerHeight())/2;
				break;
				case "left":
				left-=tip._outerWidth()+12+(opts.trackMouse?12:0);
				top-=(tip._outerHeight()-t._outerHeight())/2;
				break;
				case "top":
				left-=(tip._outerWidth()-t._outerWidth())/2;
				top-=tip._outerHeight()+12+(opts.trackMouse?12:0);
				break;
				case "bottom":
				left-=(tip._outerWidth()-t._outerWidth())/2;
				top+=t._outerHeight()+12+(opts.trackMouse?12:0);
				break;
			}
			return {left:left,top:top};
		};
	};
	function show(target,e){
		var tooltip=$.data(target,"tooltip");
		var opts=tooltip.options;
		var tip=tooltip.tip;
		if(!tip){
			tip=$("<div tabindex=\"-1\" class=\"tooltip\">"+"<div class=\"tooltip-content\"></div>"+"<div class=\"tooltip-arrow-outer\"></div>"+"<div class=\"tooltip-arrow\"></div>"+"</div>").appendTo("body");
			tooltip.tip=tip;
			update(target);
		}
		clearTimer(target);
		tooltip.showTimer=setTimeout(function(){
			$(target).tooltip("reposition");
			tip.show();
			opts.onShow.call(target,e);
			var arrowOuter=tip.children(".tooltip-arrow-outer");
			var arrow=tip.children(".tooltip-arrow");
			var bc="border-"+opts.position+"-color";
			arrowOuter.add(arrow).css({borderTopColor:"",borderBottomColor:"",borderLeftColor:"",borderRightColor:""});
			arrowOuter.css(bc,tip.css(bc));
			arrow.css(bc,tip.css("backgroundColor"));
		},opts.showDelay);
	};
	function hide(target,e){
		var tooltip=$.data(target,"tooltip");
		if(tooltip&&tooltip.tip){
			clearTimer(target);
			tooltip.hideTimer=setTimeout(function(){
				tooltip.tip.hide();
				tooltip.options.onHide.call(target,e);
			},tooltip.options.hideDelay);
		}
	};
	function update(target,content){
		var tooltip=$.data(target,"tooltip");
		var opts=tooltip.options;
		if(content){
			opts.content=content;
		}
		if(!tooltip.tip){
			return;
		}
		var cc=typeof opts.content=="function"?opts.content.call(target):opts.content;
		tooltip.tip.children(".tooltip-content").html(cc);
		opts.onUpdate.call(target,cc);
	};
	function destroyTooltip(target){
		var tooltip=$.data(target,"tooltip");
		if(tooltip){
			clearTimer(target);
			var opts=tooltip.options;
			if(tooltip.tip){
				tooltip.tip.remove();
			}
			if(opts._title){
				$(target).attr("title",opts._title);
			}
			$.removeData(target,"tooltip");
			$(target).unbind(".tooltip").removeClass("tooltip-f");
			opts.onDestroy.call(target);
		}
	};
	$.fn.tooltip=function(options,param){
		if(typeof options=="string"){
			return $.fn.tooltip.methods[options](this,param);
		}
		options=options||{};
		return this.each(function(){
			var state=$.data(this,"tooltip");
			if(state){
				$.extend(state.options,options);
			}else{
				$.data(this,"tooltip",{options:$.extend({},$.fn.tooltip.defaults,$.fn.tooltip.parseOptions(this),options)});
				init(this);
			}
			bindEvents(this);
			update(this);
		});
	};
	$.fn.tooltip.methods={
		options:function(jq){
			return $.data(jq[0],"tooltip").options;
		},
		tip:function(jq){
			return $.data(jq[0],"tooltip").tip;
		},
		arrow:function(jq){
			return jq.tooltip("tip").children(".tooltip-arrow-outer,.tooltip-arrow");
		},
		show:function(jq,e){
			return jq.each(function(){
				show(this,e);
			});
		},
		hide:function(jq,e){
			return jq.each(function(){
				hide(this,e);
			});
		},
		update:function(jq,content){
			return jq.each(function(){
				update(this,content);
			});
		},
		reposition:function(jq){
			return jq.each(function(){
				reposition(this);
			});
		},
		destroy:function(jq){
			return jq.each(function(){
				destroyTooltip(this);
			});
		}
	};
	$.fn.tooltip.parseOptions=function(target){
		var t=$(target);
		var opts=$.extend({},$.parser.parseOptions(target,["position","showEvent","hideEvent","content",{trackMouse:"boolean",deltaX:"number",deltaY:"number",showDelay:"number",hideDelay:"number"}]),{_title:t.attr("title")});
		t.attr("title","");
		if(!opts.content){
			opts.content=opts._title;
		}
		return opts;
	};
	$.fn.tooltip.defaults={
		position:"bottom",
		content:null,
		trackMouse:false,
		deltaX:0,
		deltaY:0,
		showEvent:"mouseenter",
		hideEvent:"mouseleave",
		showDelay:200,
		hideDelay:100,
		onShow:function(e){},
		onHide:function(e){},
		onUpdate:function(content){},
		onPosition:function(left,top){},
		onDestroy:function(){}
	};
})(jQuery);
//pagination
(function($){
	function buildToolbar(target){
		var opts=$.data(target,"pagination").options;
		var bb=$.data(target,"pagination").bb={};
		var t=$(target).addClass("pagination").html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tr></tr></table>");
		var tr=t.find("tr");
		var aa=$.extend([],opts.layout);
		if(!opts.showPageList){
			removeFromArray(aa,"list");
		}
		if(!opts.showRefresh){
			removeFromArray(aa,"refresh");
		}
		if(aa[0]=="sep"){
			aa.shift();
		}
		if(aa[aa.length-1]=="sep"){
			aa.pop();
		}
		for(var index=0;index<aa.length;index++){
			var navName=aa[index];
			if(navName=="list"){
				var ps=$("<select class=\"pagination-page-list\"></select>");
				ps.bind("change",function(){
					opts.pageSize=parseInt($(this).val());
					opts.onChangePageSize.call(target,opts.pageSize);
					selectPage(target,opts.pageNumber);
				});
				for(var i=0;i<opts.pageList.length;i++){
					$("<option></option>").text(opts.pageList[i]).appendTo(ps);
				}
				$("<td></td>").append(ps).appendTo(tr);
			}else{
				if(navName=="sep"){
					$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
				}else{
					if(navName=="first"){
						bb.first=initNavigator("first");
					}else{
						if(navName=="prev"){
							bb.prev=initNavigator("prev");
						}else{
							if(navName=="next"){
								bb.next=initNavigator("next");
							}else{
								if(navName=="last"){
									bb.last=initNavigator("last");
								}else{
									if(navName=="manual"){
										$("<span style=\"padding-left:6px;\"></span>").html(opts.beforePageText).appendTo(tr).wrap("<td></td>");
										bb.num=$("<input class=\"pagination-num\" type=\"text\" value=\"1\" size=\"2\">").appendTo(tr).wrap("<td></td>");
										bb.num.unbind(".pagination").bind("keydown.pagination",function(e){
												if(e.keyCode==13){
													var pagenum=parseInt($(this).val())||1;
													selectPage(target,pagenum);
													return false;
												}
										});
										bb.after=$("<span style=\"padding-right:6px;\"></span>").appendTo(tr).wrap("<td></td>");
									}else{
										if(navName=="refresh"){
											bb.refresh=initNavigator("refresh");
										}else{
											if(navName=="links"){
												$("<td class=\"pagination-links\"></td>").appendTo(tr);
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
		if(opts.buttons){
			$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
			if($.isArray(opts.buttons)){
				for(var i=0;i<opts.buttons.length;i++){
					var btn=opts.buttons[i];
					if(btn=="-"){
						$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
					}else{
						var td=$("<td></td>").appendTo(tr);
						var a=$("<a href=\"javascript:void(0)\"></a>").appendTo(td);
						a[0].onclick=eval(btn.handler||function(){});
						a.linkbutton($.extend({},btn,{plain:true}));
					}
				}
			}else{
				var td=$("<td></td>").appendTo(tr);
				$(opts.buttons).appendTo(td).show();
			}
		}
		$("<div class=\"pagination-info\"></div>").appendTo(t);
		$("<div style=\"clear:both;\"></div>").appendTo(t);
		function initNavigator(name){
			var navigator=opts.nav[name];
			var a=$("<a href=\"javascript:void(0)\"></a>").appendTo(tr);
			a.wrap("<td></td>");
			a.linkbutton({iconCls:navigator.iconCls,plain:true}).unbind(".pagination").bind("click.pagination",function(){
				navigator.handler.call(target);
			});
			return a;
		};
		function removeFromArray(arra,ele){
			var index=$.inArray(ele,arra);
			if(index>=0){
				arra.splice(index,1);
			}
			return arra;
		};
	};
	function selectPage(target,page){
		var opts=$.data(target,"pagination").options;
		showInfo(target,{pageNumber:page});
		opts.onSelectPage.call(target,opts.pageNumber,opts.pageSize);
	};
	function showInfo(target,param){
		var opts=$.data(target,"pagination").options;
		var bb=$.data(target,"pagination").bb;
		$.extend(opts,param||{});
		var ps=$(target).find("select.pagination-page-list");
		if(ps.length){
			ps.val(opts.pageSize+"");
			opts.pageSize=parseInt(ps.val());
		}
		var pageCount=Math.ceil(opts.total/opts.pageSize)||1;
		if(opts.pageNumber<1){
			opts.pageNumber=1;
		}
		if(opts.pageNumber>pageCount){
			opts.pageNumber=pageCount;
		}
		if(opts.total==0){
			opts.pageNumber=0;
			pageCount=0;
		}
		if(bb.num){
			bb.num.val(opts.pageNumber);
		}
		if(bb.after){
			bb.after.html(opts.afterPageText.replace(/{pages}/,pageCount));
		}
		var td=$(target).find("td.pagination-links");
		if(td.length){
			td.empty();
			var start=opts.pageNumber-Math.floor(opts.links/2);
			if(start<1){
				start=1;
			}
			var end=start+opts.links-1;
			if(end>pageCount){
				end=pageCount;
			}
			start=end-opts.links+1;
			if(start<1){
				start=1;
			}
			for(var i=start;i<=end;i++){
				var a=$("<a class=\"pagination-link\" href=\"javascript:void(0)\"></a>").appendTo(td);
				a.linkbutton({plain:true,text:i});
				if(i==opts.pageNumber){
					a.linkbutton("select");
				}else{
					a.unbind(".pagination").bind("click.pagination",{pageNumber:i},function(e){
						selectPage(target,e.data.pageNumber);
					});
				}
			}
		}
		var msg=opts.displayMsg;
		msg=msg.replace(/{from}/,opts.total==0?0:opts.pageSize*(opts.pageNumber-1)+1);
		msg=msg.replace(/{to}/,Math.min(opts.pageSize*(opts.pageNumber),opts.total));
		msg=msg.replace(/{total}/,opts.total);
		$(target).find("div.pagination-info").html(msg);
		if(bb.first){
			bb.first.linkbutton({disabled:((!opts.total)||opts.pageNumber==1)});
		}
		if(bb.prev){
			bb.prev.linkbutton({disabled:((!opts.total)||opts.pageNumber==1)});
		}
		if(bb.next){
			bb.next.linkbutton({disabled:(opts.pageNumber==pageCount)});
		}
		if(bb.last){
			bb.last.linkbutton({disabled:(opts.pageNumber==pageCount)});
		}
		showLoading(target,opts.loading);
	};
	function showLoading(target,isloading){
		var pagination=$.data(target,"pagination");
		var opts=pagination.options;
		opts.loading=isloading;
		if(opts.showRefresh&&pagination.bb.refresh){
			pagination.bb.refresh.linkbutton({iconCls:(opts.isloading?"pagination-loading":"pagination-load")});
		}
	};
	$.fn.pagination=function(options,param){
		if(typeof options=="string"){
			return $.fn.pagination.methods[options](this,param);
		}
		options=options||{};
		return this.each(function(){
			var opts;
			var state=$.data(this,"pagination");
			if(state){
				opts=$.extend(state.options,options);
			}else{
				opts=$.extend({},$.fn.pagination.defaults,$.fn.pagination.parseOptions(this),options);
				$.data(this,"pagination",{options:opts});
			}
			buildToolbar(this);
			showInfo(this);
		});
	};
	$.fn.pagination.methods={
		options:function(jq){
			return $.data(jq[0],"pagination").options;
		},
		loading:function(jq){
			return jq.each(function(){
				showLoading(this,true);
			});
		},
		loaded:function(jq){
			return jq.each(function(){
				showLoading(this,false);
			});
		},
		refresh:function(jq,param){
			return jq.each(function(){
				showInfo(this,param);
			});
		},
		select:function(jq,pageNumber){
			return jq.each(function(){
				selectPage(this,pageNumber);
			});
		}};
	$.fn.pagination.parseOptions=function(target){
		var t=$(target);
		return $.extend({},$.parser.parseOptions(target,
				[
					{
						total:"number",
						pageSize:"number",
						pageNumber:"number",
						links:"number"
					},
					{
						loading:"boolean",
						showPageList:"boolean",
						showRefresh:"boolean"
					}
				]),
				{
					pageList:(t.attr("pageList")?eval(t.attr("pageList")):undefined)
				}
			);
	};
	$.fn.pagination.defaults={
		total:1,
		pageSize:10,
		pageNumber:1,
		pageList:[10,20,30,50],
		loading:false,
		buttons:null,
		showPageList:true,
		showRefresh:true,
		links:10,
		layout:["list","sep","first","prev","sep","manual","sep","next","last","sep","refresh"],
		onSelectPage:function(pageNumber,pageSize){},
		onBeforeRefresh:function(pageNumber, pageSize){},
		onRefresh:function(pageNumber, pageSize){},
		onChangePageSize:function( pageSize){},
		beforePageText:"Page",
		afterPageText:"of {pages}",
		displayMsg:"Displaying {from} to {to} of {total} items",
		nav:{
			first:{
				iconCls:"pagination-first",
				handler:function(){
					var opts=$(this).pagination("options");
					if(opts.pageNumber>1){
						$(this).pagination("select",1);
					}
				}
			},
			prev:{
				iconCls:"pagination-prev",
				handler:function(){
					var opts=$(this).pagination("options");
					if(opts.pageNumber>1){
						$(this).pagination("select",opts.pageNumber-1);
					}
				}
			},
			next:{
				iconCls:"pagination-next",
				handler:function(){
					var opts=$(this).pagination("options");
					var totalPages=Math.ceil(opts.total/opts.pageSize);
					if(opts.pageNumber<totalPages){
						$(this).pagination("select",opts.pageNumber+1);
					}
				}
			},
			last:{
				iconCls:"pagination-last",
				handler:function(){
					var opts=$(this).pagination("options");
					var totalPages=Math.ceil(opts.total/opts.pageSize);
					if(opts.pageNumber<totalPages){
						$(this).pagination("select",totalPages);
					}
				}
			},
			refresh:{
				iconCls:"pagination-refresh",
				handler:function(){
					var opts=$(this).pagination("options");
					if(opts.onBeforeRefresh.call(this,opts.pageNumber,opts.pageSize)!=false){
						$(this).pagination("select",opts.pageNumber);
						opts.onRefresh.call(this,opts.pageNumber,opts.pageSize);
					}
				}
			}
		}
	};
})(jQuery);
//panel
(function($){
	$.fn._remove=function(){
		return this.each(function(){
			$(this).remove();
			try{
				this.outerHTML="";
			}
			catch(err){
			}
		});
	};
	function removeNode(target){
		target._remove();
	};
	function setSize(target,param){
		var opts=$.data(target,"panel").options;
		var panel=$.data(target,"panel").panel;
		var header=panel.children("div.panel-header");
		var body=panel.children("div.panel-body");
		var footer=panel.children("div.panel-footer");
		if(param){
			$.extend(opts,{width:param.width,height:param.height,minWidth:param.minWidth,maxWidth:param.maxWidth,minHeight:param.minHeight,maxHeight:param.maxHeight,left:param.left,top:param.top});
		}
		panel._size(opts);
		header.add(body)._outerWidth(panel.width());
		if(!isNaN(parseInt(opts.height))){
			body._outerHeight(panel.height()-header._outerHeight()-footer._outerHeight());
		}else{
			body.css("height","");
			var minHeight=$.parser.parseValue("minHeight",opts.minHeight,panel.parent());
			var maxHeight=$.parser.parseValue("maxHeight",opts.maxHeight,panel.parent());
			var offSet=header._outerHeight()+footer._outerHeight()+panel._outerHeight()-panel.height();
			body._size("minHeight",minHeight?(minHeight-offSet):"");
			body._size("maxHeight",maxHeight?(maxHeight-offSet):"");
		}
		panel.css({height:"",minHeight:"",maxHeight:"",left:opts.left,top:opts.top});
		opts.onResize.apply(target,[opts.width,opts.height]);
		$(target).panel("doLayout");
	};
	function movePanel(target,param){
		var opts=$.data(target,"panel").options;
		var panel=$.data(target,"panel").panel;
		if(param){
			if(param.left!=null){
				opts.left=param.left;
			}
			if(param.top!=null){
				opts.top=param.top;
			}
		}
		panel.css({left:opts.left,top:opts.top});
		opts.onMove.apply(target,[opts.left,opts.top]);
	};
	function wrapPanel(target){
		$(target).addClass("panel-body")._size("clear");
		var panel=$("<div class=\"panel\"></div>").insertBefore(target);
		panel[0].appendChild(target);
		panel.bind("_resize",function(e,isALL){
			if($(this).hasClass("mwsmartui-fluid")||isALL){
				setSize(target);
			}
			return false;
		});
		return panel;
	};
	function setBorder(target){
		var opts=$.data(target,"panel").options;
		var panel=$.data(target,"panel").panel;
		panel.css(opts.style);
		panel.addClass(opts.cls);
		addHeader();
		addFooter();
		var header=$(target).panel("header");
		var body=$(target).panel("body");
		var footer=$(target).siblings("div.panel-footer");
		if(opts.border){
			header.removeClass("panel-header-noborder");
			body.removeClass("panel-body-noborder");
			footer.removeClass("panel-footer-noborder");
		}else{
			header.addClass("panel-header-noborder");
			body.addClass("panel-body-noborder");
			footer.addClass("panel-footer-noborder");
		}
		header.addClass(opts.headerCls);
		body.addClass(opts.bodyCls);
		$(target).attr("id",opts.id||"");
		if(opts.content){
			$(target).panel("clear");
			$(target).html(opts.content);
			$.parser.parse($(target));
		}
		function addHeader(){
			if(opts.tools&&typeof opts.tools=="string"){
				panel.find(">div.panel-header>div.panel-tool .panel-tool-a").appendTo(opts.tools);
			}
			removeNode(panel.children("div.panel-header"));
			if(opts.title&&!opts.noheader){
				var jqHeader=$("<div class=\"panel-header\"></div>").prependTo(panel);
				var jqTitle=$("<div class=\"panel-title\"></div>").html(opts.title).appendTo(jqHeader);
				if(opts.iconCls){
					jqTitle.addClass("panel-with-icon");
					$("<div class=\"panel-icon\"></div>").addClass(opts.iconCls).appendTo(jqHeader);
				}
				var tool=$("<div class=\"panel-tool\"></div>").appendTo(jqHeader);
				tool.bind("click",function(e){
					e.stopPropagation();
				});
				if(opts.tools){
					if($.isArray(opts.tools)){
						for(var i=0;i<opts.tools.length;i++){
							var t=$("<a href=\"javascript:void(0)\"></a>").addClass(opts.tools[i].iconCls).appendTo(tool);
							if(opts.tools[i].handler){
								t.bind("click",eval(opts.tools[i].handler));
							}
						}
					}else{
						$(opts.tools).children().each(function(){
							$(this).addClass($(this).attr("iconCls")).addClass("panel-tool-a").appendTo(tool);
						});
					}
				}
				if(opts.collapsible){
					$("<a class=\"panel-tool-collapse\" href=\"javascript:void(0)\"></a>").appendTo(tool).bind("click",function(){
						if(opts.collapsed==true){
							expandPanel(target,true);
						}else{
							collapsePanel(target,true);
						}
						return false;
					});
				}
				if(opts.minimizable){
					$("<a class=\"panel-tool-min\" href=\"javascript:void(0)\"></a>").appendTo(tool).bind("click",function(){
						minimizePanel(target);
						return false;
					});
				}
				if(opts.maximizable){
					$("<a class=\"panel-tool-max\" href=\"javascript:void(0)\"></a>").appendTo(tool).bind("click",function(){
						if(opts.maximized==true){
							restorePanel(target);
						}else{
							maximizePanel(target);
						}
						return false;
					});
				}
				if(opts.closable){
					$("<a class=\"panel-tool-close\" href=\"javascript:void(0)\"></a>").appendTo(tool).bind("click",function(){
						closePanel(target);
						return false;
					});
				}
				panel.children("div.panel-body").removeClass("panel-body-noheader");
			}else{
				panel.children("div.panel-body").addClass("panel-body-noheader");
			}
		};
		function addFooter(){
			if(opts.footer){
				$(opts.footer).addClass("panel-footer").appendTo(panel);
				$(target).addClass("panel-body-nobottom");
			}else{
				panel.children("div.panel-footer").remove();
				$(target).removeClass("panel-body-nobottom");
			}
		};
	};
	function loadData(target,param){
		var panel=$.data(target,"panel");
		var opts=panel.options;
		if(queryParam){
			opts.queryParams=param;
		}
		if(!opts.href){
			return;
		}
		if(!panel.isLoaded||!opts.cache){
			var queryParam=$.extend({},opts.queryParams);
			if(opts.onBeforeLoad.call(target,queryParam)==false){
				return;
			}
			panel.isLoaded=false;
			$(target).panel("clear");
			if(opts.loadingMessage){
				$(target).html($("<div class=\"panel-loading\"></div>").html(opts.loadingMessage));
			}
			opts.loader.call(target,queryParam,function(data){
				var content=opts.extractor.call(target,data);
				$(target).html(content);
				$.parser.parse($(target));
				opts.onLoad.apply(target,arguments);
				panel.isLoaded=true;
			},function(){
				opts.onLoadError.apply(target,arguments);
			});
		}
	};
	function clear(target){
		var t=$(target);
		t.find(".combo-f").each(function(){
			$(this).combo("destroy");
		});
		t.find(".m-btn").each(function(){
			$(this).menubutton("destroy");
		});
		t.find(".s-btn").each(function(){
			$(this).splitbutton("destroy");
		});
		t.find(".tooltip-f").each(function(){
			$(this).tooltip("destroy");
		});
		t.children("div").each(function(){
			$(this)._size("unfit");
		});
		t.empty();
	};
	function layout(target){
		$(target).panel("doLayout",true);
	};
	function openPanel(target,forceOpen){
		var opts=$.data(target,"panel").options;
		var panel=$.data(target,"panel").panel;
		if(forceOpen!=true){
			if(opts.onBeforeOpen.call(target)==false){
				return;
			}
		}
		panel.show();
		opts.closed=false;
		opts.minimized=false;
		var tool=panel.children("div.panel-header").find("a.panel-tool-restore");
		if(tool.length){
			opts.maximized=true;
		}
		opts.onOpen.call(target);
		if(opts.maximized==true){
			opts.maximized=false;
			maximizePanel(target);
		}
		if(opts.collapsed==true){
			opts.collapsed=false;
			collapsePanel(target);
		}
		if(!opts.collapsed){
			loadData(target);
			layout(target);
		}
	};
	function closePanel(target,forceClose){
		var opts=$.data(target,"panel").options;
		var panel=$.data(target,"panel").panel;
		if(forceClose!=true){
			if(opts.onBeforeClose.call(target)==false){
				return;
			}
		}
		panel._size("unfit");
		panel.hide();
		opts.closed=true;
		opts.onClose.call(target);
	};
	function destroyPanel(target,forceDestroy){
		var opts=$.data(target,"panel").options;
		var panel=$.data(target,"panel").panel;
		if(forceDestroy!=true){
			if(opts.onBeforeDestroy.call(target)==false){
				return;
			}
		}
		$(target).panel("clear").panel("clear","footer");
		removeNode(panel);
		opts.onDestroy.call(target);
	};
	function collapsePanel(target,animate){
		var opts=$.data(target,"panel").options;
		var panel=$.data(target,"panel").panel;
		var body=panel.children("div.panel-body");
		var header=panel.children("div.panel-header").find("a.panel-tool-collapse");
		if(opts.collapsed==true){
			return;
		}
		body.stop(true,true);
		if(opts.onBeforeCollapse.call(target)==false){
			return;
		}
		header.addClass("panel-tool-expand");
		if(animate==true){
			body.slideUp("normal",function(){
				opts.collapsed=true;
				opts.onCollapse.call(target);
			});
		}else{
			body.hide();
			opts.collapsed=true;
			opts.onCollapse.call(target);
		}
	};
	function expandPanel(target,animate){
		var opts=$.data(target,"panel").options;
		var panel=$.data(target,"panel").panel;
		var body=panel.children("div.panel-body");
		var header=panel.children("div.panel-header").find("a.panel-tool-collapse");
		if(opts.collapsed==false){
			return;
		}
		body.stop(true,true);
		if(opts.onBeforeExpand.call(target)==false){
			return;
		}
		header.removeClass("panel-tool-expand");
		if(animate==true){
			body.slideDown("normal",function(){
				opts.collapsed=false;
				opts.onExpand.call(target);
				loadData(target);
				layout(target);
			});
		}else{
			body.show();
			opts.collapsed=false;
			opts.onExpand.call(target);
			loadData(target);
			layout(target);
		}
	};
	function maximizePanel(target){
		var opts=$.data(target,"panel").options;
		var panel=$.data(target,"panel").panel;
		var header=panel.children("div.panel-header").find("a.panel-tool-max");
		if(opts.maximized==true){
			return;
		}
		header.addClass("panel-tool-restore");
		if(!$.data(target,"panel").original){
			$.data(target,"panel").original={width:opts.width,height:opts.height,left:opts.left,top:opts.top,fit:opts.fit};
		}
		opts.left=0;
		opts.top=0;
		opts.fit=true;
		setSize(target);
		opts.minimized=false;
		opts.maximized=true;
		opts.onMaximize.call(target);
	};
	function minimizePanel(target){
		var opts=$.data(target,"panel").options;
		var panel=$.data(target,"panel").panel;
		panel._size("unfit");
		panel.hide();
		opts.minimized=true;
		opts.maximized=false;
		opts.onMinimize.call(target);
	};
	function restorePanel(target){
		var opts=$.data(target,"panel").options;
		var panel=$.data(target,"panel").panel;
		var header=panel.children("div.panel-header").find("a.panel-tool-max");
		if(opts.maximized==false){
			return;
		}
		panel.show();
		header.removeClass("panel-tool-restore");
		$.extend(opts,$.data(target,"panel").original);
		setSize(target);
		opts.minimized=false;
		opts.maximized=false;
		$.data(target,"panel").original=null;
		opts.onRestore.call(target);
	};
	function setTitle(target,title){
		$.data(target,"panel").options.title=title;
		$(target).panel("header").find("div.panel-title").html(title);
	};
	var layoutTimer=null;
	$(window).unbind(".panel").bind("resize.panel",function(){
		if(layoutTimer){
			clearTimeout(layoutTimer);
		}
		layoutTimer=setTimeout(function(){
				var bodies=$("body.layout");
				if(bodies.length){
					bodies.layout("resize");
				}else{
					$("body").panel("doLayout");
				}
				layoutTimer=null;
			},100);
	});
	$.fn.panel=function(options,param){
		if(typeof options=="string"){
			return $.fn.panel.methods[options](this,param);
		}
		options=options||{};
		return this.each(function(){
			var state=$.data(this,"panel");
			var opts;
			if(state){
				opts=$.extend(state.options,options);
				state.isLoaded=false;
			}else{
				opts=$.extend({},$.fn.panel.defaults,$.fn.panel.parseOptions(this),options);
				$(this).attr("title","");
				state=$.data(this,"panel",{options:opts,panel:wrapPanel(this),isLoaded:false});
			}
			setBorder(this);
			if(opts.doSize==true){
				state.panel.css("display","block");
				setSize(this);
			}
			if(opts.closed==true||opts.minimized==true){
				state.panel.hide();
			}else{
				openPanel(this);
			}
		});
	};
	$.fn.panel.methods={
		options:function(jq){
			return $.data(jq[0],"panel").options;
		},
		panel:function(jq){
			return $.data(jq[0],"panel").panel;
		},
		header:function(jq){
			return $.data(jq[0],"panel").panel.find(">div.panel-header");
		},
		body:function(jq){
			return $.data(jq[0],"panel").panel.find(">div.panel-body");
		},
		footer:function(jq){
			return jq.panel("panel").children(".panel-footer");
		},
		setTitle:function(jq,title){
			return jq.each(function(){
				setTitle(this,title);
			});
		},
		open:function(jq,forceOpen){
			return jq.each(function(){
				openPanel(this,forceOpen);
			});
		},
		close:function(jq,forceClose){
			return jq.each(function(){
				closePanel(this,forceClose);
			});
		},
		destroy:function(jq,forceDestroy){
			return jq.each(function(){
				destroyPanel(this,forceDestroy);
			});
		},
		clear:function(jq,type){
			return jq.each(function(){
				clear(type=="footer"?$(this).panel("footer"):this);
			});
		},
		refresh:function(jq,param){
			return jq.each(function(){
				var panel=$.data(this,"panel");
				panel.isLoaded=false;
				if(param){
					if(typeof param=="string"){
						panel.options.href=param;
					}else{
						panel.options.queryParams=param;
					}
				}
				loadData(this);
			});
		},
		resize:function(jq,param){
			return jq.each(function(){
				setSize(this,param);
			});
		},
		doLayout:function(jq,all){
			return jq.each(function(){
				doDomLayout(this,"body");
				doDomLayout($(this).siblings("div.panel-footer")[0],"footer");
				function doDomLayout(dom,type){
					if(!dom){
						return;
					}
					var isBody=dom==$("body")[0];
					var s=$(dom).find("div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible,.mwsmartui-fluid:visible").	filter(function(_6c,el){
						var p=$(el).parents("div.panel-"+type+":first");
						if(isBody){
							return p.length==0;
						}else{
							return p[0]==dom;
						}
					});
					s.trigger("_resize",[all||false]);
				}
			});
		},
		move:function(jq,param){
			return jq.each(function(){
				movePanel(this,param);
			});
		},
		maximize:function(jq){
			return jq.each(function(){
				maximizePanel(this);
			});
		},
		minimize:function(jq){
			return jq.each(function(){
				minimizePanel(this);
			});
		},
		restore:function(jq){
			return jq.each(function(){
				restorePanel(this);
			});
		},
		collapse:function(jq,animate){
			return jq.each(function(){
				collapsePanel(this,animate);
			});
		},
		expand:function(jq,animate){
			return jq.each(function(){
				expandPanel(this,animate);
			});
		}
	};
	$.fn.panel.parseOptions=function(target){
		var t=$(target);
		return $.extend({},$.parser.parseOptions(target,["id","width","height","left","top","title","iconCls","cls","headerCls","bodyCls","tools","href","method",{cache:"boolean",fit:"boolean",border:"boolean",noheader:"boolean"},{collapsible:"boolean",minimizable:"boolean",maximizable:"boolean"},{closable:"boolean",collapsed:"boolean",minimized:"boolean",maximized:"boolean",closed:"boolean"}]),{loadingMessage:(t.attr("loadingMessage")!=undefined?t.attr("loadingMessage"):undefined)});
	};
	$.fn.panel.defaults={
		id:null,
		title:null,
		iconCls:null,
		width:"auto",
		height:"auto",
		left:null,
		top:null,
		cls:null,
		headerCls:null,
		bodyCls:null,
		style:{},
		href:null,
		cache:true,
		fit:false,
		border:true,
		doSize:true,
		noheader:false,
		content:null,
		collapsible:false,
		minimizable:false,
		maximizable:false,
		closable:false,
		collapsed:false,
		minimized:false,
		maximized:false,
		closed:false,
		tools:[],
		footer:null,
		queryParams:{},
		method:"get",
		loadingMessage:"Loading...",
		loader:function(queryParam,success,error){
			var opts=$(this).panel("options");
			if(!opts.href){
				return false;
			}
			$.ajax({type:opts.method,url:opts.href,cache:false,data:queryParam,dataType:"html",success:function(data){
					success(data);
				},error:function(){
					error.apply(this,arguments);
				}
			});
		},
		extractor:function(data){
			var quickExpr=/<body[^>]*>((.|[\n\r])*)<\/body>/im;
			var match=quickExpr.exec(data);
			if(match){
				return match[1];
			}else{
				return data;
			}
		},
		onBeforeLoad:function(param){},
		onLoad:function(){},
		onLoadError:function(){},
		onBeforeOpen:function(){},
		onOpen:function(){},
		onBeforeClose:function(){},
		onClose:function(){},
		onBeforeDestroy:function(){},
		onDestroy:function(){},
		onResize:function(width,height){},
		onMove:function(left,top){},
		onMaximize:function(){},
		onRestore:function(){},
		onMinimize:function(){},
		onBeforeCollapse:function(){},
		onBeforeExpand:function(){},
		onCollapse:function(){},
		onExpand:function(){}
	};
})(jQuery);
//pagination
(function($){
	function buildToolbar(target){
		var opts=$.data(target,"pagination").options;
		var bb=$.data(target,"pagination").bb={};
		var t=$(target).addClass("pagination").html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tr></tr></table>");
		var tr=t.find("tr");
		var aa=$.extend([],opts.layout);
		if(!opts.showPageList){
			removeFromArray(aa,"list");
		}
		if(!opts.showRefresh){
			removeFromArray(aa,"refresh");
		}
		if(aa[0]=="sep"){
			aa.shift();
		}
		if(aa[aa.length-1]=="sep"){
			aa.pop();
		}
		for(var index=0;index<aa.length;index++){
			var navName=aa[index];
			if(navName=="list"){
				var ps=$("<select class=\"pagination-page-list\"></select>");
				ps.bind("change",function(){
					opts.pageSize=parseInt($(this).val());
					opts.onChangePageSize.call(target,opts.pageSize);
					selectPage(target,opts.pageNumber);
				});
				for(var i=0;i<opts.pageList.length;i++){
					$("<option></option>").text(opts.pageList[i]).appendTo(ps);
				}
				$("<td></td>").append(ps).appendTo(tr);
			}else{
				if(navName=="sep"){
					$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
				}else{
					if(navName=="first"){
						bb.first=initNavigator("first");
					}else{
						if(navName=="prev"){
							bb.prev=initNavigator("prev");
						}else{
							if(navName=="next"){
								bb.next=initNavigator("next");
							}else{
								if(navName=="last"){
									bb.last=initNavigator("last");
								}else{
									if(navName=="manual"){
										$("<span style=\"padding-left:6px;\"></span>").html(opts.beforePageText).appendTo(tr).wrap("<td></td>");
										bb.num=$("<input class=\"pagination-num\" type=\"text\" value=\"1\" size=\"2\">").appendTo(tr).wrap("<td></td>");
										bb.num.unbind(".pagination").bind("keydown.pagination",function(e){
												if(e.keyCode==13){
													var pagenum=parseInt($(this).val())||1;
													selectPage(target,pagenum);
													return false;
												}
										});
										bb.after=$("<span style=\"padding-right:6px;\"></span>").appendTo(tr).wrap("<td></td>");
									}else{
										if(navName=="refresh"){
											bb.refresh=initNavigator("refresh");
										}else{
											if(navName=="links"){
												$("<td class=\"pagination-links\"></td>").appendTo(tr);
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
		if(opts.buttons){
			$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
			if($.isArray(opts.buttons)){
				for(var i=0;i<opts.buttons.length;i++){
					var btn=opts.buttons[i];
					if(btn=="-"){
						$("<td><div class=\"pagination-btn-separator\"></div></td>").appendTo(tr);
					}else{
						var td=$("<td></td>").appendTo(tr);
						var a=$("<a href=\"javascript:void(0)\"></a>").appendTo(td);
						a[0].onclick=eval(btn.handler||function(){});
						a.linkbutton($.extend({},btn,{plain:true}));
					}
				}
			}else{
				var td=$("<td></td>").appendTo(tr);
				$(opts.buttons).appendTo(td).show();
			}
		}
		$("<div class=\"pagination-info\"></div>").appendTo(t);
		$("<div style=\"clear:both;\"></div>").appendTo(t);
		function initNavigator(name){
			var navigator=opts.nav[name];
			var a=$("<a href=\"javascript:void(0)\"></a>").appendTo(tr);
			a.wrap("<td></td>");
			a.linkbutton({iconCls:navigator.iconCls,plain:true}).unbind(".pagination").bind("click.pagination",function(){
				navigator.handler.call(target);
			});
			return a;
		};
		function removeFromArray(arra,ele){
			var index=$.inArray(ele,arra);
			if(index>=0){
				arra.splice(index,1);
			}
			return arra;
		};
	};
	function selectPage(target,page){
		var opts=$.data(target,"pagination").options;
		showInfo(target,{pageNumber:page});
		opts.onSelectPage.call(target,opts.pageNumber,opts.pageSize);
	};
	function showInfo(target,param){
		var opts=$.data(target,"pagination").options;
		var bb=$.data(target,"pagination").bb;
		$.extend(opts,param||{});
		var ps=$(target).find("select.pagination-page-list");
		if(ps.length){
			ps.val(opts.pageSize+"");
			opts.pageSize=parseInt(ps.val());
		}
		var pageCount=Math.ceil(opts.total/opts.pageSize)||1;
		if(opts.pageNumber<1){
			opts.pageNumber=1;
		}
		if(opts.pageNumber>pageCount){
			opts.pageNumber=pageCount;
		}
		if(opts.total==0){
			opts.pageNumber=0;
			pageCount=0;
		}
		if(bb.num){
			bb.num.val(opts.pageNumber);
		}
		if(bb.after){
			bb.after.html(opts.afterPageText.replace(/{pages}/,pageCount));
		}
		var td=$(target).find("td.pagination-links");
		if(td.length){
			td.empty();
			var start=opts.pageNumber-Math.floor(opts.links/2);
			if(start<1){
				start=1;
			}
			var end=start+opts.links-1;
			if(end>pageCount){
				end=pageCount;
			}
			start=end-opts.links+1;
			if(start<1){
				start=1;
			}
			for(var i=start;i<=end;i++){
				var a=$("<a class=\"pagination-link\" href=\"javascript:void(0)\"></a>").appendTo(td);
				a.linkbutton({plain:true,text:i});
				if(i==opts.pageNumber){
					a.linkbutton("select");
				}else{
					a.unbind(".pagination").bind("click.pagination",{pageNumber:i},function(e){
						selectPage(target,e.data.pageNumber);
					});
				}
			}
		}
		var msg=opts.displayMsg;
		msg=msg.replace(/{from}/,opts.total==0?0:opts.pageSize*(opts.pageNumber-1)+1);
		msg=msg.replace(/{to}/,Math.min(opts.pageSize*(opts.pageNumber),opts.total));
		msg=msg.replace(/{total}/,opts.total);
		$(target).find("div.pagination-info").html(msg);
		if(bb.first){
			bb.first.linkbutton({disabled:((!opts.total)||opts.pageNumber==1)});
		}
		if(bb.prev){
			bb.prev.linkbutton({disabled:((!opts.total)||opts.pageNumber==1)});
		}
		if(bb.next){
			bb.next.linkbutton({disabled:(opts.pageNumber==pageCount)});
		}
		if(bb.last){
			bb.last.linkbutton({disabled:(opts.pageNumber==pageCount)});
		}
		showLoading(target,opts.loading);
	};
	function showLoading(target,isloading){
		var pagination=$.data(target,"pagination");
		var opts=pagination.options;
		opts.loading=isloading;
		if(opts.showRefresh&&pagination.bb.refresh){
			pagination.bb.refresh.linkbutton({iconCls:(opts.isloading?"pagination-loading":"pagination-load")});
		}
	};
	$.fn.pagination=function(options,param){
		if(typeof options=="string"){
			return $.fn.pagination.methods[options](this,param);
		}
		options=options||{};
		return this.each(function(){
			var opts;
			var state=$.data(this,"pagination");
			if(state){
				opts=$.extend(state.options,options);
			}else{
				opts=$.extend({},$.fn.pagination.defaults,$.fn.pagination.parseOptions(this),options);
				$.data(this,"pagination",{options:opts});
			}
			buildToolbar(this);
			showInfo(this);
		});
	};
	$.fn.pagination.methods={
		options:function(jq){
			return $.data(jq[0],"pagination").options;
		},
		loading:function(jq){
			return jq.each(function(){
				showLoading(this,true);
			});
		},
		loaded:function(jq){
			return jq.each(function(){
				showLoading(this,false);
			});
		},
		refresh:function(jq,param){
			return jq.each(function(){
				showInfo(this,param);
			});
		},
		select:function(jq,pageNumber){
			return jq.each(function(){
				selectPage(this,pageNumber);
			});
		}};
	$.fn.pagination.parseOptions=function(target){
		var t=$(target);
		return $.extend({},$.parser.parseOptions(target,
				[
					{
						total:"number",
						pageSize:"number",
						pageNumber:"number",
						links:"number"
					},
					{
						loading:"boolean",
						showPageList:"boolean",
						showRefresh:"boolean"
					}
				]),
				{
					pageList:(t.attr("pageList")?eval(t.attr("pageList")):undefined)
				}
			);
	};
	$.fn.pagination.defaults={
		total:1,
		pageSize:10,
		pageNumber:1,
		pageList:[10,20,30,50],
		loading:false,
		buttons:null,
		showPageList:true,
		showRefresh:true,
		links:10,
		layout:["list","sep","first","prev","sep","manual","sep","next","last","sep","refresh"],
		onSelectPage:function(pageNumber,pageSize){},
		onBeforeRefresh:function(pageNumber, pageSize){},
		onRefresh:function(pageNumber, pageSize){},
		onChangePageSize:function( pageSize){},
		beforePageText:"Page",
		afterPageText:"of {pages}",
		displayMsg:"Displaying {from} to {to} of {total} items",
		nav:{
			first:{
				iconCls:"pagination-first",
				handler:function(){
					var opts=$(this).pagination("options");
					if(opts.pageNumber>1){
						$(this).pagination("select",1);
					}
				}
			},
			prev:{
				iconCls:"pagination-prev",
				handler:function(){
					var opts=$(this).pagination("options");
					if(opts.pageNumber>1){
						$(this).pagination("select",opts.pageNumber-1);
					}
				}
			},
			next:{
				iconCls:"pagination-next",
				handler:function(){
					var opts=$(this).pagination("options");
					var totalPages=Math.ceil(opts.total/opts.pageSize);
					if(opts.pageNumber<totalPages){
						$(this).pagination("select",opts.pageNumber+1);
					}
				}
			},
			last:{
				iconCls:"pagination-last",
				handler:function(){
					var opts=$(this).pagination("options");
					var totalPages=Math.ceil(opts.total/opts.pageSize);
					if(opts.pageNumber<totalPages){
						$(this).pagination("select",totalPages);
					}
				}
			},
			refresh:{
				iconCls:"pagination-refresh",
				handler:function(){
					var opts=$(this).pagination("options");
					if(opts.onBeforeRefresh.call(this,opts.pageNumber,opts.pageSize)!=false){
						$(this).pagination("select",opts.pageNumber);
						opts.onRefresh.call(this,opts.pageNumber,opts.pageSize);
					}
				}
			}
		}
	};
})(jQuery);
//datagrid
(function($){
	var gridid=0;
	function indexOf(arra,ele){
		for(var i=0,len=arra.length;i<len;i++){
			if(arra[i]==ele){
				return i;
			}
		}
		return -1;
	};
	function removeRow(arra,key,val){
		if(typeof key=="string"){
			for(var i=0;i<arra.length;i++){
				if(arra[i][key]==val){
					arra.splice(i,1);
					return;
				}
			}
		}else{
			var index=indexOf(arra,key);
			if(index!=-1){
				arra.splice(index,1);
			}
		}
	};
	function addRow(arra,id,row){
		for(var i=0;i<arra.length;i++){
			if(arra[i][id]==row[id]){
				return;
			}
		}
		arra.push(row);
	};
	function createStyleSheet(target){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var panel=datagrid.panel;
		var dc=datagrid.dc;
		var ss=null;
		if(opts.sharedStyleSheet){
			ss=typeof opts.sharedStyleSheet=="boolean"?"head":opts.sharedStyleSheet;
		}else{
			ss=panel.closest("div.datagrid-view");
			if(!ss.length){
				ss=dc.view;
			}
		}
		var cc=$(ss);
		var state=$.data(cc[0],"ss");
		if(!state){
			state=$.data(cc[0],"ss",{cache:{},dirty:[]});
		}
		return {
			add:function(styles){
				var ss=["<style type=\"text/css\" mwsmartui=\"true\">"];
				for(var i=0;i<styles.length;i++){
					state.cache[styles[i][0]]={width:styles[i][1]};
				}
				var index=0;
				for(var s in state.cache){
					var clsname=state.cache[s];
					clsname.index=index++;
					ss.push(s+"{width:"+clsname.width+"}");
				}
				ss.push("</style>");
				$(ss.join("\n")).appendTo(cc);
				cc.children("style[mwsmartui]:not(:last)").remove();
			},
			getRule:function(index){
				var style=cc.children("style[mwsmartui]:last")[0];
				var styleSheet=style.styleSheet?style.styleSheet:(style.sheet||document.styleSheets[document.styleSheets.length-1]);
				var rules=styleSheet.cssRules||styleSheet.rules;
				return rules[index];
			},
			set:function(cls,width){
				var s=state.cache[cls];
				if(s){
					s.width=width;
					var rule=this.getRule(s.index);
					if(rule){
						rule.style["width"]=width;
					}
				}
			},
			remove:function(cls){
				var tmp=[];
				for(var s in state.cache){
					if(s.indexOf(cls)==-1){
						tmp.push([s,state.cache[s].width]);
					}
				}
				state.cache={};
				this.add(tmp);
			},
			dirty:function(style){
				if(style){
					state.dirty.push(style);
				}
			},
			clean:function(){
				for(var i=0;i<state.dirty.length;i++){
					this.remove(state.dirty[i]);
				}
				state.dirty=[];
			}
		};
	};
	function resize(target,options){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var gridpanel=datagrid.panel;
		if(options){
			$.extend(opts,options);
		}
		if(opts.fit==true){
			var p=gridpanel.panel("panel").parent();
			opts.width=p.width();
			opts.height=p.height();
		}
		gridpanel.panel("resize",opts);
	};
	function setSize(target){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var dc=datagrid.dc;
		var gridpanel=datagrid.panel;
		var width=gridpanel.width();
		var height=gridpanel.height();
		var view=dc.view;
		var view1=dc.view1;
		var view2=dc.view2;
		var header1=view1.children("div.datagrid-header");
		var header2=view2.children("div.datagrid-header");
		var theader1=header1.find("table");
		var theader2=header2.find("table");
		view.width(width);
		var iheader1=header1.children("div.datagrid-header-inner").show();
		view1.width(iheader1.find("table").width());
		if(!opts.showHeader){
			iheader1.hide();
		}
		view2.width(width-view1._outerWidth());
		view1.children("div.datagrid-header,div.datagrid-body,div.datagrid-footer").width(view1.width());
		view2.children("div.datagrid-header,div.datagrid-body,div.datagrid-footer").width(view2.width());
		var hh;
		header1.add(header2).css("height","");
		theader1.add(theader2).css("height","");
		hh=Math.max(theader1.height(),theader2.height());
		theader1.add(theader2).height(hh);
		header1.add(header2)._outerHeight(hh);
		dc.body1.add(dc.body2).children("table.datagrid-btable-frozen").css({position:"absolute",top:dc.header2._outerHeight()});
		var mt=dc.body2.children("table.datagrid-btable-frozen")._outerHeight();
		var view2leftheight=mt+view2.children("div.datagrid-header")._outerHeight()+view2.children("div.datagrid-footer")._outerHeight()+gridpanel.children("div.datagrid-toolbar")._outerHeight();
		gridpanel.children("div.datagrid-pager").each(function(){
			view2leftheight+=$(this)._outerHeight();
		});
		var margin=gridpanel.outerHeight()-gridpanel.height();
		var minHeight=gridpanel._size("minHeight")||"";
		var maxHeight=gridpanel._size("maxHeight")||"";
		view1.add(view2).children("div.datagrid-body").css(
			{
				marginTop:mt,
				height:(isNaN(parseInt(opts.height))?"":(height-view2leftheight)),
				minHeight:(minHeight?minHeight-margin-view2leftheight:""),
				maxHeight:(maxHeight?maxHeight-margin-view2leftheight:"")
			}
		);
		view.height(view2.height());
	};
	function fixRowHeight(target,index,hasEditor){
		var rows=$.data(target,"datagrid").data.rows;
		var opts=$.data(target,"datagrid").options;
		var dc=$.data(target,"datagrid").dc;
		if(!dc.body1.is(":empty")&&(!opts.nowrap||opts.autoRowHeight||hasEditor)){
			if(index!=undefined){
				var tr1=opts.finder.getTr(target,index,"body",1);
				var tr2=opts.finder.getTr(target,index,"body",2);
				setRowHeight(tr1,tr2);
			}else{
				var tr1=opts.finder.getTr(target,0,"allbody",1);
				var tr2=opts.finder.getTr(target,0,"allbody",2);
				setRowHeight(tr1,tr2);
				if(opts.showFooter){
					var tr1=opts.finder.getTr(target,0,"allfooter",1);
					var tr2=opts.finder.getTr(target,0,"allfooter",2);
					setRowHeight(tr1,tr2);
				}
			}
		}
		setSize(target);
		if(opts.height=="auto"){
			var view1=dc.body1.parent();
			var body2=dc.body2;
			var body2Size=getActualSize(body2);
			var body2Height=body2Size.height;
			if(body2Size.width>body2.width()){
				body2Height+=18;
			}
			body2Height-=parseInt(body2.css("marginTop"))||0;
			view1.height(body2Height);
			body2.height(body2Height);
			dc.view.height(dc.view2.height());
		}
		dc.body2.triggerHandler("scroll");
		function setRowHeight(trs1,trs2){
			for(var i=0;i<trs2.length;i++){
				var tr1=$(trs1[i]);
				var tr2=$(trs2[i]);
				tr1.css("height","");
				tr2.css("height","");
				var maxHeight=Math.max(tr1.height(),tr2.height());
				tr1.css("height",maxHeight);
				tr2.css("height",maxHeight);
			}
		};
		function getActualSize(cc){
			var width=0;
			var height=0;
			$(cc).children().each(function(){
				var c=$(this);
				if(c.is(":visible")){
					height+=c._outerHeight();
					if(width<c._outerWidth()){
						width=c._outerWidth();
					}
				}
			});
			return {width:width,height:height};
		};
	};
	function freezeRow(target,index){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var dc=datagrid.dc;
		if(!dc.body2.children("table.datagrid-btable-frozen").length){
			dc.body1.add(dc.body2).prepend("<table class=\"datagrid-btable datagrid-btable-frozen\" cellspacing=\"0\" cellpadding=\"0\"></table>");
		}
		doFreezeRow(true);
		doFreezeRow(false);
		setSize(target);
		function doFreezeRow(isFrozen){
			var frozen=isFrozen?1:2;
			var tr=opts.finder.getTr(target,index,"body",frozen);
			(isFrozen?dc.body1:dc.body2).children("table.datagrid-btable-frozen").append(tr);
		};
	};
	function wrapGrid(target,rownumbers){
		function getColumns(){
			var frozenColumns=[];
			var columns=[];
			$(target).children("thead").each(function(){
				var opt=$.parser.parseOptions(this,[{frozen:"boolean"}]);
				$(this).find("tr").each(function(){
					var thColumns=[];
					$(this).find("th").each(function(){
						var th=$(this);
						var col=$.extend(
									{},
									$.parser.parseOptions(this,
										["field","align","halign","order","width",
											{
												sortable:"boolean",
												checkbox:"boolean",
												resizable:"boolean",
												fixed:"boolean"
											},
											{
												rowspan:"number",
												colspan:"number"
											}
										]
									),
									{
										title:(th.html()||undefined),
										hidden:(th.attr("hidden")?true:undefined),
										formatter:(th.attr("formatter")?eval(th.attr("formatter")):undefined),
										styler:(th.attr("styler")?eval(th.attr("styler")):undefined),
										sorter:(th.attr("sorter")?eval(th.attr("sorter")):undefined)
									}
								);
						if(col.width&&String(col.width).indexOf("%")==-1){
							col.width=parseInt(col.width);
						}
						if(th.attr("editor")){
							var s=$.trim(th.attr("editor"));
							if(s.substr(0,1)=="{"){
								col.editor=eval("("+s+")");
							}else{
								col.editor=s;
							}
						}
						thColumns.push(col);
					});
					opt.frozen?frozenColumns.push(thColumns):columns.push(thColumns);
				});
			});
			return [frozenColumns,columns];
		};
		var gridpanel=$("<div class=\"datagrid-wrap\">"+"<div class=\"datagrid-view\" style=\"-moz-user-select:none;\" onselectstart=\"return false;\">"+"<div class=\"datagrid-view1\">"+"<div class=\"datagrid-header\">"+"<div class=\"datagrid-header-inner\"></div>"+"</div>"+"<div class=\"datagrid-body\">"+"<div class=\"datagrid-body-inner\"></div>"+"</div>"+"<div class=\"datagrid-footer\">"+"<div class=\"datagrid-footer-inner\"></div>"+"</div>"+"</div>"+"<div class=\"datagrid-view2\">"+"<div class=\"datagrid-header\">"+"<div class=\"datagrid-header-inner\"></div>"+"</div>"+"<div class=\"datagrid-body\"></div>"+"<div class=\"datagrid-footer\">"+"<div class=\"datagrid-footer-inner\"></div>"+"</div>"+"</div>"+"</div>"+"</div>").insertAfter(target);
		gridpanel.panel({doSize:false,cls:"datagrid"});
		$(target).hide().appendTo(gridpanel.children("div.datagrid-view"));
		var cc=getColumns();
		var view=gridpanel.children("div.datagrid-view");
		//added by tpan,to guantee the view has width as table's width by default
		if(view.width()==0){
			view.width($(target).width());
		}
		var view1=view.children("div.datagrid-view1");
		var view2=view.children("div.datagrid-view2");
		return {
				panel:gridpanel,
				frozenColumns:cc[0],
				columns:cc[1],
				dc:{
					view:view,
					view1:view1,
					view2:view2,
					header1:view1.children("div.datagrid-header").children("div.datagrid-header-inner"),
					header2:view2.children("div.datagrid-header").children("div.datagrid-header-inner"),
					body1:view1.children("div.datagrid-body").children("div.datagrid-body-inner"),
					body2:view2.children("div.datagrid-body"),
					footer1:view1.children("div.datagrid-footer").children("div.datagrid-footer-inner"),
					footer2:view2.children("div.datagrid-footer").children("div.datagrid-footer-inner")
				}
		};
	};
	function initGrid(target){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var dc=datagrid.dc;
		var gridpanel=datagrid.panel;
		datagrid.ss=$(target).datagrid("createStyleSheet");
		gridpanel.panel($.extend({},opts,
				{
					id:null,
					doSize:false,
					onResize:function(width,height){
						setTimeout(function(){
							if($.data(target,"datagrid")){
								setSize(target);
								fitColumns(target);
								opts.onResize.call(gridpanel,width,height);
							}
						},0);
					},
					onExpand:function(){
						fixRowHeight(target);
						opts.onExpand.call(gridpanel);
					}
				})
		);
		datagrid.rowIdPrefix="datagrid-row-r"+(++gridid);
		datagrid.cellClassPrefix="datagrid-cell-c"+gridid;
		createColumnHeader(dc.header1,opts.frozenColumns,true);
		createColumnHeader(dc.header2,opts.columns,false);
		initStyles();
		dc.header1.add(dc.header2).css("display",opts.showHeader?"block":"none");
		dc.footer1.add(dc.footer2).css("display",opts.showFooter?"block":"none");
		if(opts.toolbar){
			if($.isArray(opts.toolbar)){
				$("div.datagrid-toolbar",gridpanel).remove();
				var tb=$("<div class=\"datagrid-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(gridpanel);
				var tr=tb.find("tr");
				for(var i=0;i<opts.toolbar.length;i++){
					var btn=opts.toolbar[i];
					if(btn=="-"){
						$("<td><div class=\"datagrid-btn-separator\"></div></td>").appendTo(tr);
					}else{
						var td=$("<td></td>").appendTo(tr);
						var abtn=$("<a href=\"javascript:void(0)\"></a>").appendTo(td);
						abtn[0].onclick=eval(btn.handler||function(){});
						abtn.linkbutton($.extend({},btn,{plain:true}));
					}
				}
			}else{
				$(opts.toolbar).addClass("datagrid-toolbar").prependTo(gridpanel);
				$(opts.toolbar).show();
			}
		}else{
			$("div.datagrid-toolbar",gridpanel).remove();
		}
		$("div.datagrid-pager",gridpanel).remove();
		if(opts.pagination){
			var pager=$("<div class=\"datagrid-pager\"></div>");
			if(opts.pagePosition=="bottom"){
				pager.appendTo(gridpanel);
			}else{
				if(opts.pagePosition=="top"){
					pager.addClass("datagrid-pager-top").prependTo(gridpanel);
				}else{
					var tmp=$("<div class=\"datagrid-pager datagrid-pager-top\"></div>").prependTo(gridpanel);
					pager.appendTo(gridpanel);
					pager=pager.add(tmp);
				}
			}
			pager.pagination(
				{
					total:(opts.pageNumber*opts.pageSize),
					pageNumber:opts.pageNumber,
					pageSize:opts.pageSize,
					pageList:opts.pageList,
					onSelectPage:function(pageNumber,pageSize){
						opts.pageNumber=pageNumber;
						opts.pageSize=pageSize;
						pager.pagination("refresh",{pageNumber:pageNumber,pageSize:pageSize});
						request(target);
					}
				}
			);
			opts.pageSize=pager.pagination("options").pageSize;
		}
		function createColumnHeader(header,columns,frozen){
			if(!columns){
				return;
			}
			$(header).show();
			$(header).empty();
			var sorters=[];
			var orders=[];
			if(opts.sortName){
				sorters=opts.sortName.split(",");
				orders=opts.sortOrder.split(",");
			}
			var t=$("<table class=\"datagrid-htable\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody></tbody></table>").appendTo(header);
			for(var i=0;i<columns.length;i++){
				var tr=$("<tr class=\"datagrid-header-row\"></tr>").appendTo($("tbody",t));
				var rcolumns=columns[i];
				for(var j=0;j<rcolumns.length;j++){
					var col=rcolumns[j];
					var tdcontent="";
					if(col.rowspan){
						tdcontent+="rowspan=\""+col.rowspan+"\" ";
					}
					if(col.colspan){
						tdcontent+="colspan=\""+col.colspan+"\" ";
					}
					var td=$("<td "+tdcontent+"></td>").appendTo(tr);
					if(col.checkbox){
						td.attr("field",col.field);
						$("<div class=\"datagrid-header-check\"></div>").html("<input type=\"checkbox\"/>").appendTo(td);
					}else{
						if(col.field){
							td.attr("field",col.field);
							td.append("<div class=\"datagrid-cell\"><span></span><span class=\"datagrid-sort-icon\"></span></div>");
							$("span",td).html(col.title);
							$("span.datagrid-sort-icon",td).html("&nbsp;");
							var tdCell=td.find("div.datagrid-cell");
							var pos=indexOf(sorters,col.field);
							if(pos>=0){
								tdCell.addClass("datagrid-sort-"+orders[pos]);
							}
							if(col.resizable==false){
								tdCell.attr("resizable","false");
							}
							if(col.width){
								var wid=$.parser.parseValue("width",col.width,dc.view,opts.scrollbarSize);
								tdCell._outerWidth(wid-1);
								col.boxWidth=parseInt(tdCell[0].style.width);
								col.deltaWidth=wid-col.boxWidth;
							}else{
								col.auto=true;
							}
							tdCell.css("text-align",(col.halign||col.align||""));
							col.cellClass=datagrid.cellClassPrefix+"-"+col.field.replace(/[\.|\s]/g,"-");
							tdCell.addClass(col.cellClass).css("width","");
						}else{
							$("<div class=\"datagrid-cell-group\"></div>").html(col.title).appendTo(td);
						}
					}
					if(col.hidden){
						td.hide();
					}
				}
			}
			if(frozen&&opts.rownumbers){
				var td=$("<td rowspan=\""+opts.frozenColumns.length+"\"><div class=\"datagrid-header-rownumber\"></div></td>");
				if($("tr",t).length==0){
					td.wrap("<tr class=\"datagrid-header-row\"></tr>").parent().appendTo($("tbody",t));
				}else{
					td.prependTo($("tr:first",t));
				}
			}
		};
		function initStyles(){
			var styles=[];
			var fields=getColumnFields(target,true).concat(getColumnFields(target));
			for(var i=0;i<fields.length;i++){
				var col=getColumnOption(target,fields[i]);
				if(col&&!col.checkbox){
					styles.push(["."+col.cellClass,col.boxWidth?col.boxWidth+"px":"auto"]);
				}
			}
			datagrid.ss.add(styles);
			datagrid.ss.dirty(datagrid.cellSelectorPrefix);
			datagrid.cellSelectorPrefix="."+datagrid.cellClassPrefix;
		};
	};
	function bindEvents(target){
		var datagrid=$.data(target,"datagrid");
		var gridpanel=datagrid.panel;
		var opts=datagrid.options;
		var dc=datagrid.dc;
		var headers=dc.header1.add(dc.header2);
		headers.find("input[type=checkbox]").unbind(".datagrid").bind("click.datagrid",
			function(e){
				if(opts.singleSelect&&opts.selectOnCheck){
					return false;
				}
				if($(this).is(":checked")){
					checkAll(target);
				}else{
					uncheckAll(target);
				}
				e.stopPropagation();
			}
		);
		var headerCells=headers.find("div.datagrid-cell");
		headerCells.closest("td").unbind(".datagrid").bind("mouseenter.datagrid",
			function(){
				if(datagrid.resizing){
					return;
				}
				$(this).addClass("datagrid-header-over");
			}
		).bind("mouseleave.datagrid",
			function(){
				$(this).removeClass("datagrid-header-over");
			}
		).bind("contextmenu.datagrid",
			function(e){
				var field=$(this).attr("field");
				opts.onHeaderContextMenu.call(target,e,field);
			}
		);
		headerCells.unbind(".datagrid").bind("click.datagrid",
			function(e){
				var p1=$(this).offset().left+5;
				var p2=$(this).offset().left+$(this)._outerWidth()-5;
				if(e.pageX<p2&&e.pageX>p1){
					sort(target,$(this).parent().attr("field"));
				}
			}
		).bind("dblclick.datagrid",
			function(e){
				var p1=$(this).offset().left+5;
				var p2=$(this).offset().left+$(this)._outerWidth()-5;
				var autoResize=opts.resizeHandle=="right"?(e.pageX>p2):(opts.resizeHandle=="left"?(e.pageX<p1):(e.pageX<p1||e.pageX>p2));
				if(autoResize){
					var field=$(this).parent().attr("field");
					var col=getColumnOption(target,field);
					if(col.resizable==false){
						return;
					}
					$(target).datagrid("autoSizeColumn",field);
					col.auto=false;
				}
			}
		);
		var handles=opts.resizeHandle=="right"?"e":(opts.resizeHandle=="left"?"w":"e,w");
		headerCells.each(function(){
			$(this).resizable(
				{
					handles:handles,
					disabled:($(this).attr("resizable")?$(this).attr("resizable")=="false":false),
					minWidth:25,
					onStartResize:function(e){
						datagrid.resizing=true;
						headers.css("cursor",$("body").css("cursor"));
						if(!datagrid.proxy){
							datagrid.proxy=$("<div class=\"datagrid-resize-proxy\"></div>").appendTo(dc.view);
						}
						datagrid.proxy.css({left:e.pageX-$(gridpanel).offset().left-1,display:"none"});
						setTimeout(function(){
							if(datagrid.proxy){
								datagrid.proxy.show();
							}
						},500);
					},
					onResize:function(e){
						datagrid.proxy.css({left:e.pageX-$(gridpanel).offset().left-1,display:"block"});
						return false;
					},
					onStopResize:function(e){
						headers.css("cursor","");
						$(this).css("height","");
						var field=$(this).parent().attr("field");
						var col=getColumnOption(target,field);
						col.width=$(this)._outerWidth();
						col.boxWidth=col.width-col.deltaWidth;
						col.auto=undefined;
						$(this).css("width","");
						fixColumnSize(target,field);
						datagrid.proxy.remove();
						datagrid.proxy=null;
						if($(this).parents("div:first.datagrid-header").parent().hasClass("datagrid-view1")){
							setSize(target);
						}
						fitColumns(target);
						opts.onResizeColumn.call(target,field,col.width);
						setTimeout(function(){
							datagrid.resizing=false;
						},0);
					}
				}
			);
		});
		dc.body1.add(dc.body2).unbind().bind("mouseover",
			function(e){
				if(datagrid.resizing){
					return;
				}
				var tr=$(e.target).closest("tr.datagrid-row");
				if(!exists(tr)){
					return;
				}
				var index=getTrIndex(tr);
				highlightRow(target,index);
			}
		).bind("mouseout",
			function(e){
				var tr=$(e.target).closest("tr.datagrid-row");
				if(!exists(tr)){
					return;
				}
				var index=getTrIndex(tr);
				opts.finder.getTr(target,index).removeClass("datagrid-row-over");
			}
		).bind("click",
			function(e){
				var tt=$(e.target);
				var tr=tt.closest("tr.datagrid-row");
				if(!exists(tr)){
					return;
				}
				var index=getTrIndex(tr);
				if(tt.parent().hasClass("datagrid-cell-check")){
					if(opts.singleSelect&&opts.selectOnCheck){
						if(!opts.checkOnSelect){
							uncheckAll(target,true);
						}
						checkRow(target,index);
					}else{
						if(tt.is(":checked")){
							checkRow(target,index);
						}else{
							uncheckRow(target,index);
						}
					}
				}else{
					var row=opts.finder.getRow(target,index);
					var td=tt.closest("td[field]",tr);
					if(td.length){
						var field=td.attr("field");
						opts.onClickCell.call(target,index,field,row[field]);
					}
					if(opts.singleSelect==true){
						selectRow(target,index);
					}else{
						if(opts.ctrlSelect){
							if(e.ctrlKey){
								if(tr.hasClass("datagrid-row-selected")){
									unselectRow(target,index);
								}else{
									selectRow(target,index);
								}
							}else{
								$(target).datagrid("clearSelections");
								selectRow(target,index);
							}
						}else{
							if(tr.hasClass("datagrid-row-selected")){
								unselectRow(target,index);
							}else{
								selectRow(target,index);
							}
						}
					}
					opts.onClickRow.call(target,index,row);
				}
			}
		).bind("dblclick",
			function(e){
				var tt=$(e.target);
				var tr=tt.closest("tr.datagrid-row");
				if(!exists(tr)){
					return;
				}
				var index=getTrIndex(tr);
				var row=opts.finder.getRow(target,index);
				var td=tt.closest("td[field]",tr);
				if(td.length){
					var field=td.attr("field");
					opts.onDblClickCell.call(target,index,field,row[field]);
				}
				opts.onDblClickRow.call(target,index,row);
			}
		).bind("contextmenu",
			function(e){
				var tr=$(e.target).closest("tr.datagrid-row");
				if(!exists(tr)){
					return;
				}
				var index=getTrIndex(tr);
				var row=opts.finder.getRow(target,index);
				opts.onRowContextMenu.call(target,e,index,row);
			}
		);
		dc.body2.bind("scroll",function(){
			var b1=dc.view1.children("div.datagrid-body");
			b1.scrollTop($(this).scrollTop());
			var c1=dc.body1.children(":first");
			var c2=dc.body2.children(":first");
			if(c1.length&&c2.length){
				var _8a=c1.offset().top;
				var _8b=c2.offset().top;
				if(_8a!=_8b){
					b1.scrollTop(b1.scrollTop()+_8a-_8b);
				}
			}
			dc.view2.children("div.datagrid-header,div.datagrid-footer")._scrollLeft($(this)._scrollLeft());
			dc.body2.children("table.datagrid-btable-frozen").css("left",-$(this)._scrollLeft());
		});
		function getTrIndex(tr){
			if(tr.attr("datagrid-row-index")){
				return parseInt(tr.attr("datagrid-row-index"));
			}else{
				return tr.attr("node-id");
			}
		};
		function exists(tr){
			return tr.length&&tr.parent().length;
		};
	};
	function sort(target,param){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		param=param||{};
		var ps={sortName:opts.sortName,sortOrder:opts.sortOrder};
		if(typeof param=="object"){
			$.extend(ps,param);
		}
		var sorters=[];
		var orders=[];
		if(ps.sortName){
			sorters=ps.sortName.split(",");
			orders=ps.sortOrder.split(",");
		}
		if(typeof param=="string"){
			var field=param;
			var col=getColumnOption(target,field);
			if(!col.sortable||datagrid.resizing){
				return;
			}
			var corder=col.order||"asc";
			var pos=indexOf(sorters,field);
			if(pos>=0){
				var oldcorder=orders[pos]=="asc"?"desc":"asc";
				if(opts.multiSort&&oldcorder==corder){
					sorters.splice(pos,1);
					orders.splice(pos,1);
				}else{
					orders[pos]=oldcorder;
				}
			}else{
				if(opts.multiSort){
					sorters.push(field);
					orders.push(corder);
				}else{
					sorters=[field];
					orders=[corder];
				}
			}
			ps.sortName=sorters.join(",");
			ps.sortOrder=orders.join(",");
		}
		if(opts.onBeforeSortColumn.call(target,ps.sortName,ps.sortOrder)==false){
			return;
		}
		$.extend(opts,ps);
		var dc=datagrid.dc;
		var headers=dc.header1.add(dc.header2);
		headers.find("div.datagrid-cell").removeClass("datagrid-sort-asc datagrid-sort-desc");
		for(var i=0;i<sorters.length;i++){
			var col=getColumnOption(target,sorters[i]);
			headers.find("div."+col.cellClass).addClass("datagrid-sort-"+orders[i]);
		}
		if(opts.remoteSort){
			request(target);
		}else{
			loadData(target,$(target).datagrid("getData"));
		}
		opts.onSortColumn.call(target,opts.sortName,opts.sortOrder);
	};
	function fitColumns(target){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var dc=datagrid.dc;
		var header2=dc.view2.children("div.datagrid-header");
		dc.body2.css("overflow-x","");
		setColumnWidth();
		setLeftWidth();
		if(header2.width()>=header2.find("table").width()){
			dc.body2.css("overflow-x","hidden");
		}
		function setLeftWidth(){
			if(!opts.fitColumns){
				return;
			}
			if(!datagrid.leftWidth){
				datagrid.leftWidth=0;
			}
			var totalColWidth=0;
			var cc=[];
			var fields=getColumnFields(target,false);
			for(var i=0;i<fields.length;i++){
				var col=getColumnOption(target,fields[i]);
				if(hasWidth(col)){
					totalColWidth+=col.width;
					cc.push({field:col.field,col:col,addingWidth:0});
				}
			}
			if(!totalColWidth){
				return;
			}
			cc[cc.length-1].addingWidth-=datagrid.leftWidth;
			var innerHeader2=header2.children("div.datagrid-header-inner").show();
			var leftWidth=header2.width()-header2.find("table").width()-opts.scrollbarSize+datagrid.leftWidth;
			var pct=leftWidth/totalColWidth;
			if(!opts.showHeader){
				innerHeader2.hide();
			}
			for(var i=0;i<cc.length;i++){
				var c=cc[i];
				var dta=parseInt(c.col.width*pct);
				c.addingWidth+=dta;
				leftWidth-=dta;
			}
			cc[cc.length-1].addingWidth+=leftWidth;
			for(var i=0;i<cc.length;i++){
				var c=cc[i];
				if(c.col.boxWidth+c.addingWidth>0){
					c.col.boxWidth+=c.addingWidth;
					c.col.width+=c.addingWidth;
				}
			}
			datagrid.leftWidth=leftWidth;
			fixColumnSize(target);
		};
		function setColumnWidth(){
			var needFix=false;
			var fields=getColumnFields(target,true).concat(getColumnFields(target,false));
			$.map(fields,function(fd){
				var col=getColumnOption(target,fd);
				if(String(col.width||"").indexOf("%")>=0){
					var wid=$.parser.parseValue("width",col.width,dc.view,opts.scrollbarSize)-col.deltaWidth;
					if(wid>0){
						col.boxWidth=wid;
						needFix=true;
					}
				}
			});
			if(needFix){
				fixColumnSize(target);
			}
		};
		function hasWidth(col){
			if(String(col.width||"").indexOf("%")>=0){
				return false;
			}
			if(!col.hidden&&!col.checkbox&&!col.auto&&!col.fixed){
				return true;
			}
		};
	};
	function autoSizeColumn(target,field){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var dc=datagrid.dc;
		var tmp=$("<div class=\"datagrid-cell\" style=\"position:absolute;left:-9999px\"></div>").appendTo("body");
		if(field){
			resize(field);
			if(opts.fitColumns){
				setSize(target);
				fitColumns(target);
			}
		}else{
			var hasAuto=false;
			var fields=getColumnFields(target,true).concat(getColumnFields(target,false));
			for(var i=0;i<fields.length;i++){
				var field=fields[i];
				var col=getColumnOption(target,field);
				if(col.auto){
					resize(field);
					hasAuto=true;
				}
			}
			if(hasAuto&&opts.fitColumns){
				setSize(target);
				fitColumns(target);
			}
		}
		tmp.remove();
		function resize(fd){
			var headerCell=dc.view.find("div.datagrid-header td[field=\""+fd+"\"] div.datagrid-cell");
			headerCell.css("width","");
			var col=$(target).datagrid("getColumnOption",fd);
			col.width=undefined;
			col.boxWidth=undefined;
			col.auto=true;
			$(target).datagrid("fixColumnSize",fd);
			var maxColWidth=Math.max(getColWidth("header"),getColWidth("allbody"),getColWidth("allfooter"))+1;
			headerCell._outerWidth(maxColWidth-1);
			col.width=maxColWidth;
			col.boxWidth=parseInt(headerCell[0].style.width);
			col.deltaWidth=maxColWidth-col.boxWidth;
			headerCell.css("width","");
			$(target).datagrid("fixColumnSize",fd);
			opts.onResizeColumn.call(target,fd,col.width);
			function getColWidth(p){
				var ret=0;
				if(p=="header"){
					ret=getOuterwidth(headerCell);
				}else{
					opts.finder.getTr(target,0,p).find("td[field=\""+fd+"\"] div.datagrid-cell").each(function(){
						var w=getOuterwidth($(this));
						if(ret<w){
							ret=w;
						}
					});
				}
				return ret;
				function getOuterwidth(h){
					return h.is(":visible")?h._outerWidth():tmp.html(h.html())._outerWidth();
				};
			};
		};
	};
	function fixColumnSize(target,field){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var dc=datagrid.dc;
		var tables=dc.view.find("table.datagrid-btable,table.datagrid-ftable");
		tables.css("table-layout","fixed");
		if(field){
			fix(field);
		}else{
			var ff=getColumnFields(target,true).concat(getColumnFields(target,false));
			for(var i=0;i<ff.length;i++){
				fix(ff[i]);
			}
		}
		tables.css("table-layout","auto");
		resizeColumnSize(target);
		fixRowHeight(target);
		resizeEditor(target);
		function fix(fld){
			var col=getColumnOption(target,fld);
			if(col.cellClass){
				datagrid.ss.set("."+col.cellClass,col.boxWidth?col.boxWidth+"px":"auto");
			}
		};
	};
	function resizeColumnSize(target){
		var dc=$.data(target,"datagrid").dc;
		dc.view.find("td.datagrid-td-merged").each(function(){
			var td=$(this);
			var colspan=td.attr("colspan")||1;
			var col=getColumnOption(target,td.attr("field"));
			var newWidth=col.boxWidth+col.deltaWidth-1;
			for(var i=1;i<colspan;i++){
				td=td.next();
				col=getColumnOption(target,td.attr("field"));
				newWidth+=col.boxWidth+col.deltaWidth;
			}
			$(this).children("div.datagrid-cell")._outerWidth(newWidth);
		});
	};
	function resizeEditor(target){
		var dc=$.data(target,"datagrid").dc;
		dc.view.find("div.datagrid-editable").each(function(){
			var me=$(this);
			var field=me.parent().attr("field");
			var col=$(target).datagrid("getColumnOption",field);
			me._outerWidth(col.boxWidth+col.deltaWidth-1);
			var ed=$.data(this,"datagrid.editor");
			if(ed.actions.resize){
				ed.actions.resize(ed.target,me.width());
			}
		});
	};
	function getColumnOption(target,field){
		function getColumnOptionFromCols(columns){
			if(columns){
				for(var i=0;i<columns.length;i++){
					var cc=columns[i];
					for(var j=0;j<cc.length;j++){
						var c=cc[j];
						if(c.field==field){
							return c;
						}
					}
				}
			}
			return null;
		};
		var opts=$.data(target,"datagrid").options;
		var col=getColumnOptionFromCols(opts.columns);
		if(!col){
			col=getColumnOptionFromCols(opts.frozenColumns);
		}
		return col;
	};
	function getColumnFields(target,frozen){
		var opts=$.data(target,"datagrid").options;
		var columns=(frozen==true)?(opts.frozenColumns||[[]]):opts.columns;
		if(columns.length==0){
			return [];
		}
		var aa=[];
		var cn=getColNumber();
		for(var i=0;i<columns.length;i++){
			aa[i]=new Array(cn);
		}
		for(var i=0;i<columns.length;i++){
			$.map(columns[i],function(col){
				var io=indexOfFirstEmpty(aa[i]);
				if(io>=0){
					var field=col.field||"";
					for(var c=0;c<(col.colspan||1);c++){
						for(var r=0;r<(col.rowspan||1);r++){
							aa[i+r][io]=field;
						}
						io++;
					}
				}
			});
		}
		return aa[aa.length-1];
		function getColNumber(){
			var ret=0;
			$.map(columns[0],function(col){
				ret+=col.colspan||1;
			});
			return ret;
		};
		function indexOfFirstEmpty(a){
			for(var i=0;i<a.length;i++){
				if(a[i]==undefined){
					return i;
				}
			}
			return -1;
		};
	};
	function loadData(target,data){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var dc=datagrid.dc;
		data=opts.loadFilter.call(target,data);
		data.total=parseInt(data.total);
		datagrid.data=data;
		if(data.footer){
			datagrid.footer=data.footer;
		}
		if(!opts.remoteSort&&opts.sortName){
			var sorters=opts.sortName.split(",");
			var orders=opts.sortOrder.split(",");
			data.rows.sort(function(r1,r2){
				var r=0;
				for(var i=0;i<sorters.length;i++){
					var sn=sorters[i];
					var so=orders[i];
					var col=getColumnOption(target,sn);
					var sorter=col.sorter||function(a,b){
						return a==b?0:(a>b?1:-1);
					};
					r=sorter(r1[sn],r2[sn])*(so=="asc"?1:-1);
					if(r!=0){
						return r;
					}
				}
				return r;
			});
		}
		if(opts.view.onBeforeRender){
			opts.view.onBeforeRender.call(opts.view,target,data.rows);
		}
		opts.view.render.call(opts.view,target,dc.body2,false);
		opts.view.render.call(opts.view,target,dc.body1,true);
		if(opts.showFooter){
			opts.view.renderFooter.call(opts.view,target,dc.footer2,false);
			opts.view.renderFooter.call(opts.view,target,dc.footer1,true);
		}
		if(opts.view.onAfterRender){
			opts.view.onAfterRender.call(opts.view,target);
		}
		datagrid.ss.clean();
		var pagers=$(target).datagrid("getPager");
		if(pagers.length){
			var pageOpts=pagers.pagination("options");
			if(pageOpts.total!=data.total){
				pagers.pagination("refresh",{total:data.total});
				if(opts.pageNumber!=pageOpts.pageNumber){
					opts.pageNumber=pageOpts.pageNumber;
					//modified by tpan,if the data is null and request will be executed twice when load grid data
					if(opts.pageNumber>0){
						request(target);
					}
				}
			}
		}
		fixRowHeight(target);
		dc.body2.triggerHandler("scroll");
		$(target).datagrid("setSelectionState");
		$(target).datagrid("autoSizeColumn");
		opts.onLoadSuccess.call(target,data);
	};
	function setSelectionState(target){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var dc=datagrid.dc;
		dc.header1.add(dc.header2).find("input[type=checkbox]")._propAttr("checked",false);
		if(opts.idField){
			var isTree=$.data(target,"treegrid")?true:false;
			var selectHandler=opts.onSelect;
			var checkHandler=opts.onCheck;
			opts.onSelect=opts.onCheck=function(){};
			var rows=opts.finder.getRows(target);
			for(var i=0;i<rows.length;i++){
				var row=rows[i];
				var index=isTree?row[opts.idField]:i;
				if(contained(datagrid.selectedRows,row)){
					selectRow(target,index,true);
				}
				if(contained(datagrid.checkedRows,row)){
					checkRow(target,index,true);
				}
			}
			opts.onSelect=selectHandler;
			opts.onCheck=checkHandler;
		}
		function contained(arra,r){
			for(var i=0;i<arra.length;i++){
				if(arra[i][opts.idField]==r[opts.idField]){
					arra[i]=r;
					return true;
				}
			}
			return false;
		};
	};
	function getRowIndex(target,row){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var rows=datagrid.data.rows;
		if(typeof row=="object"){
			return indexOf(rows,row);
		}else{
			for(var i=0;i<rows.length;i++){
				if(rows[i][opts.idField]==row){
					return i;
				}
			}
			return -1;
		}
	};
	function getSelections(target){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		//var data=datagrid.data;
		if(opts.idField){
			return datagrid.selectedRows;
		}else{
			var tmp=[];
			opts.finder.getTr(target,"","selected",2).each(function(){
				tmp.push(opts.finder.getRow(target,$(this)));
			});
			return tmp;
		}
	};
	function getChecked(target){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		if(opts.idField){
			return datagrid.checkedRows;
		}else{
			var tmp=[];
			opts.finder.getTr(target,"","checked",2).each(function(){
				tmp.push(opts.finder.getRow(target,$(this)));
			});
			return tmp;
		}
	};
	function scrollTo(target,index){
		var datagrid=$.data(target,"datagrid");
		var dc=datagrid.dc;
		var opts=datagrid.options;
		var tr=opts.finder.getTr(target,index);
		if(tr.length){
			if(tr.closest("table").hasClass("datagrid-btable-frozen")){
				return;
			}
			var headerHeight=dc.view2.children("div.datagrid-header")._outerHeight();
			var body2=dc.body2;
			var body2Height=body2.outerHeight(true)-body2.outerHeight();
			var top=tr.position().top-headerHeight-body2Height;
			if(top<0){
				body2.scrollTop(body2.scrollTop()+top);
			}else{
				if(top+tr._outerHeight()>body2.height()-18){
					body2.scrollTop(body2.scrollTop()+top+tr._outerHeight()-body2.height()+18);
				}
			}
		}
	};
	function highlightRow(target,index){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		opts.finder.getTr(target,datagrid.highlightIndex).removeClass("datagrid-row-over");
		opts.finder.getTr(target,index).addClass("datagrid-row-over");
		datagrid.highlightIndex=index;
	};
	function selectRow(target,index,isChecked){
		var datagrid=$.data(target,"datagrid");
		var dc=datagrid.dc;
		var opts=datagrid.options;
		var selectedRows=datagrid.selectedRows;
		if(opts.singleSelect){
			unselectAll(target);
			selectedRows.splice(0,selectedRows.length);
		}
		if(!isChecked&&opts.checkOnSelect){
			checkRow(target,index,true);
		}
		var row=opts.finder.getRow(target,index);
		if(opts.idField){
			addRow(selectedRows,opts.idField,row);
		}
		opts.finder.getTr(target,index).addClass("datagrid-row-selected");
		opts.onSelect.call(target,index,row);
		scrollTo(target,index);
	};
	function unselectRow(target,index,isUnchecked){
		var datagrid=$.data(target,"datagrid");
		//var dc=datagrid.dc;
		var opts=datagrid.options;
		var selectedRows=$.data(target,"datagrid").selectedRows;
		if(!isUnchecked&&opts.checkOnSelect){
			uncheckRow(target,index,true);
		}
		opts.finder.getTr(target,index).removeClass("datagrid-row-selected");
		var row=opts.finder.getRow(target,index);
		if(opts.idField){
			removeRow(selectedRows,opts.idField,row[opts.idField]);
		}
		opts.onUnselect.call(target,index,row);
	};
	function selectAll(target,isChecked){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var rows=opts.finder.getRows(target);
		var selectedRows=$.data(target,"datagrid").selectedRows;
		if(!isChecked&&opts.checkOnSelect){
			checkAll(target,true);
		}
		opts.finder.getTr(target,"","allbody").addClass("datagrid-row-selected");
		if(opts.idField){
			for(var i=0;i<rows.length;i++){
				addRow(selectedRows,opts.idField,rows[i]);
			}
		}
		opts.onSelectAll.call(target,rows);
	};
	function unselectAll(target,isUnchecked){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var rows=opts.finder.getRows(target);
		var selectedRows=$.data(target,"datagrid").selectedRows;
		if(!isUnchecked&&opts.checkOnSelect){
			uncheckAll(target,true);
		}
		opts.finder.getTr(target,"","selected").removeClass("datagrid-row-selected");
		if(opts.idField){
			for(var i=0;i<rows.length;i++){
				removeRow(selectedRows,opts.idField,rows[i][opts.idField]);
			}
		}
		opts.onUnselectAll.call(target,rows);
	};
	function checkRow(target,index,isSelected){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		if(!isSelected&&opts.selectOnCheck){
			selectRow(target,index,true);
		}
		var tr=opts.finder.getTr(target,index).addClass("datagrid-row-checked");
		var ck=tr.find("div.datagrid-cell-check input[type=checkbox]");
		ck._propAttr("checked",true);
		tr=opts.finder.getTr(target,"","checked",2);
		if(tr.length==opts.finder.getRows(target).length){
			var dc=datagrid.dc;
			var headers=dc.header1.add(dc.header2);
			headers.find("input[type=checkbox]")._propAttr("checked",true);
		}
		var row=opts.finder.getRow(target,index);
		if(opts.idField){
			addRow(datagrid.checkedRows,opts.idField,row);
		}
		opts.onCheck.call(target,index,row);
	};
	function uncheckRow(target,index,isUnselected){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		if(!isUnselected&&opts.selectOnCheck){
			unselectRow(target,index,true);
		}
		var tr=opts.finder.getTr(target,index).removeClass("datagrid-row-checked");
		var ck=tr.find("div.datagrid-cell-check input[type=checkbox]");
		ck._propAttr("checked",false);
		var dc=datagrid.dc;
		var headers=dc.header1.add(dc.header2);
		headers.find("input[type=checkbox]")._propAttr("checked",false);
		var row=opts.finder.getRow(target,index);
		if(opts.idField){
			removeRow(datagrid.checkedRows,opts.idField,row[opts.idField]);
		}
		opts.onUncheck.call(target,index,row);
	};
	function checkAll(target,isSelected){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var rows=opts.finder.getRows(target);
		if(!isSelected&&opts.selectOnCheck){
			selectAll(target,true);
		}
		var dc=datagrid.dc;
		var hck=dc.header1.add(dc.header2).find("input[type=checkbox]");
		var bck=opts.finder.getTr(target,"","allbody").addClass("datagrid-row-checked").find("div.datagrid-cell-check input[type=checkbox]");
		hck.add(bck)._propAttr("checked",true);
		if(opts.idField){
			for(var i=0;i<rows.length;i++){
				addRow(datagrid.checkedRows,opts.idField,rows[i]);
			}
		}
		opts.onCheckAll.call(target,rows);
	};
	function uncheckAll(target,isUnselected){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var rows=opts.finder.getRows(target);
		if(!isUnselected&&opts.selectOnCheck){
			unselectAll(target,true);
		}
		var dc=datagrid.dc;
		var hck=dc.header1.add(dc.header2).find("input[type=checkbox]");
		var bck=opts.finder.getTr(target,"","checked").removeClass("datagrid-row-checked").find("div.datagrid-cell-check input[type=checkbox]");
		hck.add(bck)._propAttr("checked",false);
		if(opts.idField){
			for(var i=0;i<rows.length;i++){
				removeRow(datagrid.checkedRows,opts.idField,rows[i][opts.idField]);
			}
		}
		opts.onUncheckAll.call(target,rows);
	};
	function beginEdit(target,index){
		var opts=$.data(target,"datagrid").options;
		var tr=opts.finder.getTr(target,index);
		var row=opts.finder.getRow(target,index);
		if(tr.hasClass("datagrid-row-editing")){
			return;
		}
		if(opts.onBeforeEdit.call(target,index,row)==false){
			return;
		}
		tr.addClass("datagrid-row-editing");
		initEditor(target,index);
		resizeEditor(target);
		tr.find("div.datagrid-editable").each(function(){
			var field=$(this).parent().attr("field");
			var ed=$.data(this,"datagrid.editor");
			ed.actions.setValue(ed.target,row[field]);
		});
		validateRow(target,index);
		opts.onBeginEdit.call(target,index,row);
	};
	function endEdit(target,index,ignoreChange){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var updatedRows=datagrid.updatedRows;
		var insertedRows=datagrid.insertedRows;
		var tr=opts.finder.getTr(target,index);
		var row=opts.finder.getRow(target,index);
		if(!tr.hasClass("datagrid-row-editing")){
			return;
		}
		if(!ignoreChange){
			if(!validateRow(target,index)){
				return;
			}
			var changed=false;
			var changedVal={};
			tr.find("div.datagrid-editable").each(function(){
				var field=$(this).parent().attr("field");
				var ed=$.data(this,"datagrid.editor");
				var newVal=ed.actions.getValue(ed.target);
				if(row[field]!=newVal){
					row[field]=newVal;
					changed=true;
					changedVal[field]=newVal;
				}
			});
			if(changed){
				if(indexOf(insertedRows,row)==-1){
					if(indexOf(updatedRows,row)==-1){
						updatedRows.push(row);
					}
				}
			}
			opts.onEndEdit.call(target,index,row,changedVal);
		}
		tr.removeClass("datagrid-row-editing");
		stopEdit(target,index);
		$(target).datagrid("refreshRow",index);
		if(!ignoreChange){
			opts.onAfterEdit.call(target,index,row,changedVal);
		}else{
			opts.onCancelEdit.call(target,index,row);
		}
	};
	function getEditors(target,index){
		var opts=$.data(target,"datagrid").options;
		var tr=opts.finder.getTr(target,index);
		var editors=[];
		tr.children("td").each(function(){
			var cell=$(this).find("div.datagrid-editable");
			if(cell.length){
				var ed=$.data(cell[0],"datagrid.editor");
				editors.push(ed);
			}
		});
		return editors;
	};
	function getEditor(target,options){
		var editors=getEditors(target,options.index!=undefined?options.index:options.id);
		for(var i=0;i<editors.length;i++){
			if(editors[i].field==options.field){
				return editors[i];
			}
		}
		return null;
	};
	function initEditor(target,index){
		var opts=$.data(target,"datagrid").options;
		var tr=opts.finder.getTr(target,index);
		tr.children("td").each(function(){
			var cell=$(this).find("div.datagrid-cell");
			var field=$(this).attr("field");
			var col=getColumnOption(target,field);
			if(col&&col.editor){
				var editorType,editorOpts;
				if(typeof col.editor=="string"){
					editorType=col.editor;
				}else{
					editorType=col.editor.type;
					editorOpts=col.editor.options;
				}
				var ed=opts.editors[editorType];
				if(ed){
					var oldHtml=cell.html();
					var wid=cell._outerWidth();
					cell.addClass("datagrid-editable");
					cell._outerWidth(wid);
					cell.html("<table border=\"0\" cellspacing=\"0\" cellpadding=\"1\"><tr><td></td></tr></table>");
					cell.children("table").bind("click dblclick contextmenu",function(e){
						e.stopPropagation();
					});
					$.data(cell[0],"datagrid.editor",
						{
							actions:ed,
							target:ed.init(cell.find("td"),editorOpts),
							field:field,
							type:editorType,
							oldHtml:oldHtml
						}
					);
				}
			}
		});
		fixRowHeight(target,index,true);
	};
	function stopEdit(target,index){
		var opts=$.data(target,"datagrid").options;
		var tr=opts.finder.getTr(target,index);
		tr.children("td").each(function(){
		var cell=$(this).find("div.datagrid-editable");
			if(cell.length){
				var ed=$.data(cell[0],"datagrid.editor");
				if(ed.actions.destroy){
					ed.actions.destroy(ed.target);
				}
				cell.html(ed.oldHtml);
				$.removeData(cell[0],"datagrid.editor");
				cell.removeClass("datagrid-editable");
				cell.css("width","");
			}
		});
	};
	function validateRow(target,index){
		var tr=$.data(target,"datagrid").options.finder.getTr(target,index);
		if(!tr.hasClass("datagrid-row-editing")){
			return true;
		}
		var vbox=tr.find(".validatebox-text");
		vbox.validatebox("validate");
		vbox.trigger("mouseleave");
		var invalid=tr.find(".validatebox-invalid");
		return invalid.length==0;
	};
	function getChanges(target,changeType){
		var insertedRows=$.data(target,"datagrid").insertedRows;
		var deletedRows=$.data(target,"datagrid").deletedRows;
		var updatedRows=$.data(target,"datagrid").updatedRows;
		if(!changeType){
			var rows=[];
			rows=rows.concat(insertedRows);
			rows=rows.concat(deletedRows);
			rows=rows.concat(updatedRows);
			return rows;
		}else{
			if(changeType=="inserted"){
				return insertedRows;
			}else{
				if(changeType=="deleted"){
					return deletedRows;
				}else{
					if(changeType=="updated"){
						return updatedRows;
					}
				}
			}
		}
		return [];
	};
	function deleteRow(target,index){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var data=datagrid.data;
		var insertedRows=datagrid.insertedRows;
		var deletedRows=datagrid.deletedRows;
		$(target).datagrid("cancelEdit",index);
		var row=opts.finder.getRow(target,index);
		if(indexOf(insertedRows,row)>=0){
			removeRow(insertedRows,row);
		}else{
			deletedRows.push(row);
		}
		removeRow(datagrid.selectedRows,opts.idField,row[opts.idField]);
		removeRow(datagrid.checkedRows,opts.idField,row[opts.idField]);
		opts.view.deleteRow.call(opts.view,target,index);
		if(opts.height=="auto"){
			fixRowHeight(target);
		}
		$(target).datagrid("getPager").pagination("refresh",{total:data.total});
	};
	function insertRow(target,param){
		var data=$.data(target,"datagrid").data;
		var view=$.data(target,"datagrid").options.view;
		var insertedRows=$.data(target,"datagrid").insertedRows;
		view.insertRow.call(view,target,param.index,param.row);
		insertedRows.push(param.row);
		$(target).datagrid("getPager").pagination("refresh",{total:data.total});
	};
	function appendRow(target,row){
		var data=$.data(target,"datagrid").data;
		var view=$.data(target,"datagrid").options.view;
		var insertedRows=$.data(target,"datagrid").insertedRows;
		view.insertRow.call(view,target,null,row);
		insertedRows.push(row);
		$(target).datagrid("getPager").pagination("refresh",{total:data.total});
	};
	function updateBuffer(target){
		var datagrid=$.data(target,"datagrid");
		var data=datagrid.data;
		var rows=data.rows;
		var tmp=[];
		for(var i=0;i<rows.length;i++){
			tmp.push($.extend({},rows[i]));
		}
		datagrid.originalRows=tmp;
		datagrid.updatedRows=[];
		datagrid.insertedRows=[];
		datagrid.deletedRows=[];
	};
	function acceptChanges(target){
		var data=$.data(target,"datagrid").data;
		var ok=true;
		for(var i=0,len=data.rows.length;i<len;i++){
			if(validateRow(target,i)){
				$(target).datagrid("endEdit",i);
			}else{
				ok=false;
			}
		}
		if(ok){
			updateBuffer(target);
		}
	};
	function rejectChanges(target){
		var datagrid=$.data(target,"datagrid");
		var opts=datagrid.options;
		var originalRows=datagrid.originalRows;
		var insertedRows=datagrid.insertedRows;
		var deletedRows=datagrid.deletedRows;
		var selectedRows=datagrid.selectedRows;
		var checkedRows=datagrid.checkedRows;
		var data=datagrid.data;
		function getIds(arra){
			var ids=[];
			for(var i=0;i<arra.length;i++){
				ids.push(arra[i][opts.idField]);
			}
			return ids;
		};
		function selectOrCheck(ids,type){
			for(var i=0;i<ids.length;i++){
				var rowIndex=getRowIndex(target,ids[i]);
				if(rowIndex>=0){
					(type=="s"?selectRow:checkRow)(target,rowIndex,true);
				}
			}
		};
		for(var i=0;i<data.rows.length;i++){
			$(target).datagrid("cancelEdit",i);
		}
		var selectIds=getIds(selectedRows);
		var checkedIds=getIds(checkedRows);
		selectedRows.splice(0,selectedRows.length);
		checkedRows.splice(0,checkedRows.length);
		data.total+=deletedRows.length-insertedRows.length;
		data.rows=originalRows;
		loadData(target,data);
		selectOrCheck(selectIds,"s");
		selectOrCheck(checkedIds,"c");
		updateBuffer(target);
	};
	function request(target,queryParam){
		var opts=$.data(target,"datagrid").options;
		if(queryParam){
			opts.queryParams=queryParam;
		}
		var qParam=$.extend({},opts.queryParams);
		if(opts.pagination){
			$.extend(qParam,{page:opts.pageNumber,rows:opts.pageSize});
		}
		if(opts.sortName){
			$.extend(qParam,{sort:opts.sortName,order:opts.sortOrder});
		}
		if(opts.onBeforeLoad.call(target,qParam)==false){
			return;
		}
		$(target).datagrid("loading");
		setTimeout(function(){
			loaderCall();
		},0);
		function loaderCall(){
			var success=opts.loader.call(target,qParam,function(data){
					setTimeout(function(){
						$(target).datagrid("loaded");
					},0);
					loadData(target,data);
					setTimeout(function(){
						updateBuffer(target);
					},0);
				},
				function(){
					setTimeout(function(){
						$(target).datagrid("loaded");
					},0);
					opts.onLoadError.apply(target,arguments);
				}
			);
			if(success==false){
				$(target).datagrid("loaded");
			}
		};
	};
	function mergeCells(target,options){
		var opts=$.data(target,"datagrid").options;
		options.type=options.type||"body";
		options.rowspan=options.rowspan||1;
		options.colspan=options.colspan||1;
		if(options.rowspan==1&&options.colspan==1){
			return;
		}
		var tr=opts.finder.getTr(target,(options.index!=undefined?options.index:options.id),options.type);
		if(!tr.length){
			return;
		}
		var td=tr.find("td[field=\""+options.field+"\"]");
		td.attr("rowspan",options.rowspan).attr("colspan",options.colspan);
		td.addClass("datagrid-td-merged");
		hideTds(td.next(),options.colspan-1);
		for(var i=1;i<options.rowspan;i++){
			tr=tr.next();
			if(!tr.length){
				break;
			}
			td=tr.find("td[field=\""+options.field+"\"]");
			hideTds(td,options.colspan);
		}
		resizeColumnSize(target);
		function hideTds(td,size){
			for(var i=0;i<size;i++){
				td.hide();
				td=td.next();
			}
		};
	};
	$.fn.datagrid=function(options,param){
		if(typeof options=="string"){
			return $.fn.datagrid.methods[options](this,param);
		}
		options=options||{};
		return this.each(function(){
			var state=$.data(this,"datagrid");
			var opts;
			if(state){
				opts=$.extend(state.options,options);
				state.options=opts;
			}else{
				opts=$.extend({},$.extend({},$.fn.datagrid.defaults,{queryParams:{}}),$.fn.datagrid.parseOptions(this),options);
				$(this).css("width","").css("height","");
				var wrapResult=wrapGrid(this,opts.rownumbers);
				if(!opts.columns){
					opts.columns=wrapResult.columns;
				}
				if(!opts.frozenColumns){
					opts.frozenColumns=wrapResult.frozenColumns;
				}
				opts.columns=$.extend(true,[],opts.columns);
				opts.frozenColumns=$.extend(true,[],opts.frozenColumns);
				opts.view=$.extend({},opts.view);
				$.data(this,"datagrid",
					{
						options:opts,
						panel:wrapResult.panel,
						dc:wrapResult.dc,
						ss:null,
						selectedRows:[],
						checkedRows:[],
						data:{
							total:0,
							rows:[]},
							originalRows:[],
							updatedRows:[],
							insertedRows:[],
							deletedRows:[]
						}
				);
			}
			initGrid(this);
			bindEvents(this);
			resize(this);
			if(opts.data){
				loadData(this,opts.data);
				updateBuffer(this);
			}else{
				var data=$.fn.datagrid.parseData(this);
				if(data.total>0){
					loadData(this,data);
					updateBuffer(this);
				}
			}
			request(this);
		});
	};
	function getDefaultEditors(arra){
		var ret={};
		$.map(arra,function(name){
			ret[name]=getDefaultEditor(name);
		});
		return ret;
		function getDefaultEditor(name){
			function hasInited(target){
				return $.data($(target)[0],name)!=undefined;
			};
			return {
					init:function(container,options){
						var target=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(container);
						if(target[name]&&name!="text"){
							return target[name](options);
						}else{
							return target;
						}
					},
					destroy:function(target){
						if(hasInited(target,name)){
							$(target)[name]("destroy");
						}
					},
					getValue:function(target){
						if(hasInited(target,name)){
							var opts=$(target)[name]("options");
							if(opts.multiple){
								return $(target)[name]("getValues").join(opts.separator);
							}else{
								return $(target)[name]("getValue");
							}
						}else{
							return $(target).val();
						}
					},
					setValue:function(target,value){
						if(hasInited(target,name)){
							var opts=$(target)[name]("options");
							if(opts.multiple){
								if(value){
									$(target)[name]("setValues",value.split(opts.separator));
								}else{
									$(target)[name]("clear");
								}
							}else{
								$(target)[name]("setValue",value);
							}
						}else{
							$(target).val(value);
						}
					},
					resize:function(target,width){
						if(hasInited(target,name)){
							$(target)[name]("resize",width);
						}else{
							$(target)._outerWidth(width)._outerHeight(22);
						}
					}
				};
		};
	};
	var defaultEditors=$.extend({},
		getDefaultEditors(["text","textbox","numberbox","numberspinner","combobox","combotree","combogrid","datebox","datetimebox","timespinner","datetimespinner"]),
		{
			textarea:{
				init:function(container,options){
					var target=$("<textarea class=\"datagrid-editable-input\"></textarea>").appendTo(container);
					return target;
				},
				getValue:function(target){
					return $(target).val();
				},
				setValue:function(target,value){
					$(target).val(value);
				},
				resize:function(target,width){
					$(target)._outerWidth(width);
				}
			},
			checkbox:{
				init:function(container,options){
					var target=$("<input type=\"checkbox\">").appendTo(container);
					target.val(options.on);
					target.attr("offval",options.off);
					return target;
				},
				getValue:function(target){
					if($(target).is(":checked")){
						return $(target).val();
					}else{
						return $(target).attr("offval");
					}
				},
				setValue:function(target,value){
					var checked=false;
					if($(target).val()==value){
						checked=true;
					}
					$(target)._propAttr("checked",checked);
				}
			},
			validatebox:{
				init:function(container,options){
					var target=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(container);
					target.validatebox(options);
					return target;
				},
				destroy:function(target){
					$(target).validatebox("destroy");
				},
				getValue:function(target){
					return $(target).val();
				},
				setValue:function(target,value){
					$(target).val(value);
				},
				resize:function(target,width){
					$(target)._outerWidth(width)._outerHeight(22);
				}
			}
		}
	);
	$.fn.datagrid.methods={
		options:function(jq){
			var datagridOpts=$.data(jq[0],"datagrid").options;
			var gridPanelOpts=$.data(jq[0],"datagrid").panel.panel("options");
			var opts=$.extend(datagridOpts,
						{
							width:gridPanelOpts.width,
							height:gridPanelOpts.height,
							closed:gridPanelOpts.closed,
							collapsed:gridPanelOpts.collapsed,
							minimized:gridPanelOpts.minimized,
							maximized:gridPanelOpts.maximized
						}
			);
			return opts;
		},
		setSelectionState:function(jq){
			return jq.each(function(){
				setSelectionState(this);
			});
		},
		createStyleSheet:function(jq){
			return createStyleSheet(jq[0]);
		},
		getPanel:function(jq){
			return $.data(jq[0],"datagrid").panel;
		},
		getPager:function(jq){
			return $.data(jq[0],"datagrid").panel.children("div.datagrid-pager");
		},
		getColumnFields:function(jq,frozen){
			return getColumnFields(jq[0],frozen);
		},
		getColumnOption:function(jq,field){
			return getColumnOption(jq[0],field);
		},
		resize:function(jq,param){
			return jq.each(function(){
				resize(this,param);
			});
		},
		load:function(jq,param){
			return jq.each(function(){
					var opts=$(this).datagrid("options");
					if(typeof param=="string"){
						opts.url=param;
						param=null;
					}
					opts.pageNumber=1;
					var pager=$(this).datagrid("getPager");
					pager.pagination("refresh",{pageNumber:1});
					request(this,param);
			});
		},
		reload:function(jq,param){
			return jq.each(function(){
					var opts=$(this).datagrid("options");
					if(typeof param=="string"){
						opts.url=param;
						param=null;
					}
					request(this,param);
			});
		},
		reloadFooter:function(jq,footer){
			return jq.each(function(){
				var opts=$.data(this,"datagrid").options;
				var dc=$.data(this,"datagrid").dc;
				if(footer){
					$.data(this,"datagrid").footer=footer;
				}
				if(opts.showFooter){
					opts.view.renderFooter.call(opts.view,this,dc.footer2,false);
					opts.view.renderFooter.call(opts.view,this,dc.footer1,true);
					if(opts.view.onAfterRender){
						opts.view.onAfterRender.call(opts.view,this);
					}
					$(this).datagrid("fixRowHeight");
				}
			});
		},
		loading:function(jq){
			return jq.each(function(){
				var opts=$.data(this,"datagrid").options;
				$(this).datagrid("getPager").pagination("loading");
				if(opts.loadMsg){
					var panel=$(this).datagrid("getPanel");
					if(!panel.children("div.datagrid-mask").length){
						$("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(panel);
						var msg=$("<div class=\"datagrid-mask-msg\" style=\"display:block;left:50%\"></div>").html(opts.loadMsg).appendTo(panel);
						msg._outerHeight(40);
						msg.css({marginLeft:(-msg.outerWidth()/2),lineHeight:(msg.height()+"px")});
					}
				}
			});
		},
		loaded:function(jq){
			return jq.each(function(){
				$(this).datagrid("getPager").pagination("loaded");
				var panel=$(this).datagrid("getPanel");
				panel.children("div.datagrid-mask-msg").remove();
				panel.children("div.datagrid-mask").remove();
			});
		},
		fitColumns:function(jq){
			return jq.each(function(){
				fitColumns(this);
			});
		},
		fixColumnSize:function(jq,field){
			return jq.each(function(){
				fixColumnSize(this,field);
			});
		},
		fixRowHeight:function(jq,index){
			return jq.each(function(){
				fixRowHeight(this,index);
			});
		},
		freezeRow:function(jq,index){
			return jq.each(function(){
				freezeRow(this,index);
			});
		},
		autoSizeColumn:function(jq,field){
			return jq.each(function(){
				autoSizeColumn(this,field);
			});
		},
		request:function(jq,data,notClearBuffer){
			return jq.each(function(){
				loadData(this,data);
				if(notClearBuffer){
					updateBuffer(this);
				}
			});
		},
		getData:function(jq){
			return $.data(jq[0],"datagrid").data;
		},
		getRows:function(jq){
			return $.data(jq[0],"datagrid").data.rows;
		},
		getFooterRows:function(jq){
			return $.data(jq[0],"datagrid").footer;
		},
		getRowIndex:function(jq,row){
			return getRowIndex(jq[0],row);
		},
		getChecked:function(jq){
			return getChecked(jq[0]);
		},
		getSelected:function(jq){
			var rows=getSelections(jq[0]);
			return rows.length>0?rows[0]:null;
		},
		getSelections:function(jq){
			return getSelections(jq[0]);
		},
		clearSelections:function(jq){
			return jq.each(function(){
				var datagrid=$.data(this,"datagrid");
				var selectedRows=datagrid.selectedRows;
				var checkedRows=datagrid.checkedRows;
				selectedRows.splice(0,selectedRows.length);
				unselectAll(this);
				if(datagrid.options.checkOnSelect){
					checkedRows.splice(0,checkedRows.length);
				}
			});
		},
		clearChecked:function(jq){
			return jq.each(function(){
				var datagrid=$.data(this,"datagrid");
				var selectedRows=datagrid.selectedRows;
				var checkedRows=datagrid.checkedRows;
				checkedRows.splice(0,checkedRows.length);
				uncheckAll(this);
				if(datagrid.options.selectOnCheck){
					selectedRows.splice(0,selectedRows.length);
				}
			});
		},
		scrollTo:function(jq,index){
			return jq.each(function(){
				scrollTo(this,index);
			});
		},
		highlightRow:function(jq,index){
			return jq.each(function(){
				highlightRow(this,index);
				scrollTo(this,index);
			});
		},
		selectAll:function(jq){
			return jq.each(function(){
				selectAll(this);
			});
		},
		unselectAll:function(jq){
			return jq.each(function(){
				unselectAll(this);
			});
		},
		selectRow:function(jq,index){
			return jq.each(function(){
				selectRow(this,index);
			});
		},
		selectRecord:function(jq,idVal){
			return jq.each(function(){
				var opts=$.data(this,"datagrid").options;
				if(opts.idField){
					var rowIndex=getRowIndex(this,idVal);
					if(rowIndex>=0){
						$(this).datagrid("selectRow",rowIndex);
					}
				}
			});
		},
		unselectRow:function(jq,index){
			return jq.each(function(){
				unselectRow(this,index);
			});
		},
		checkRow:function(jq,index){
			return jq.each(function(){
				checkRow(this,index);
			});
		},
		uncheckRow:function(jq,index){
			return jq.each(function(){
				uncheckRow(this,index);
			});
		},
		checkAll:function(jq){
			return jq.each(function(){
				checkAll(this);
			});
		},
		uncheckAll:function(jq){
			return jq.each(function(){
				uncheckAll(this);
			});
		},
		beginEdit:function(jq,index){
			return jq.each(function(){
				beginEdit(this,index);
			});
		},
		endEdit:function(jq,index){
			return jq.each(function(){
				endEdit(this,index,false);
			});
		},
		cancelEdit:function(jq,index){
			return jq.each(function(){
				endEdit(this,index,true);
			});
		},
		getEditors:function(jq,index){
			return getEditors(jq[0],index);
		},
		getEditor:function(jq,options){
			return getEditor(jq[0],options);
		},
		refreshRow:function(jq,index){
			return jq.each(function(){
				var opts=$.data(this,"datagrid").options;
				opts.view.refreshRow.call(opts.view,this,index);
			});
		},
		validateRow:function(jq,index){
			return validateRow(jq[0],index);
		},
		updateRow:function(jq,param){
			return jq.each(function(){
				var opts=$.data(this,"datagrid").options;
				opts.view.updateRow.call(opts.view,this,param.index,param.row);
			});
		},
		appendRow:function(jq,row){
			return jq.each(function(){
				appendRow(this,row);
			});
		},
		insertRow:function(jq,param){
			return jq.each(function(){
				insertRow(this,param);
			});
		},
		deleteRow:function(jq,index){
			return jq.each(function(){
				deleteRow(this,index);
			});
		},
		getChanges:function(jq,changeType){
			return getChanges(jq[0],changeType);
		},
		acceptChanges:function(jq){
			return jq.each(function(){
				acceptChanges(this);
			});
		},
		rejectChanges:function(jq){
			return jq.each(function(){
				rejectChanges(this);
			});
		},
		mergeCells:function(jq,options){
			return jq.each(function(){
				mergeCells(this,options);
			});
		},
		showColumn:function(jq,field){
			return jq.each(function(){
				var panel=$(this).datagrid("getPanel");
				panel.find("td[field=\""+field+"\"]").show();
				$(this).datagrid("getColumnOption",field).hidden=false;
				$(this).datagrid("fitColumns");
			});
		},
		hideColumn:function(jq,field){
			return jq.each(function(){
				var panel=$(this).datagrid("getPanel");
				panel.find("td[field=\""+field+"\"]").hide();
				$(this).datagrid("getColumnOption",field).hidden=true;
				$(this).datagrid("fitColumns");
			});
		},
		sort:function(jq,param){
			return jq.each(function(){
				sort(this,param);
			});
		}
	};
	$.fn.datagrid.parseOptions=function(target){
		var t=$(target);
		return $.extend(
			{},
			$.fn.panel.parseOptions(target),
			$.parser.parseOptions(
				target,["url","toolbar","idField","sortName","sortOrder","pagePosition","resizeHandle",
						{
							sharedStyleSheet:"boolean",
							fitColumns:"boolean",
							autoRowHeight:"boolean",
							striped:"boolean",
							nowrap:"boolean"
						},
						{
							rownumbers:"boolean",
							singleSelect:"boolean",
							ctrlSelect:"boolean",
							checkOnSelect:"boolean",
							selectOnCheck:"boolean"
						},
						{
							pagination:"boolean",
							pageSize:"number",
							pageNumber:"number"
						},
						{
							multiSort:"boolean",
							remoteSort:"boolean",
							showHeader:"boolean",
							showFooter:"boolean"
						},
						{
							scrollbarSize:"number"
						}
					]
			),
			{
				pageList:(t.attr("pageList")?eval(t.attr("pageList")):undefined),
				loadMsg:(t.attr("loadMsg")!=undefined?t.attr("loadMsg"):undefined),
				rowStyler:(t.attr("rowStyler")?eval(t.attr("rowStyler")):undefined)
			}
		);
	};
	$.fn.datagrid.parseData=function(target){
		var t=$(target);
		var data={total:0,rows:[]};
		var fields=t.datagrid("getColumnFields",true).concat(t.datagrid("getColumnFields",false));
		t.find("tbody tr").each(function(){
			data.total++;
			var row={};
			$.extend(row,$.parser.parseOptions(this,["iconCls","state"]));
			for(var i=0;i<fields.length;i++){
				row[fields[i]]=$(this).find("td:eq("+i+")").html();
			}
			data.rows.push(row);
		});
		return data;
	};
	var defaultView={
		render:function(target,container,frozen){
			var datagrid=$.data(target,"datagrid");
			var opts=datagrid.options;
			var rows=datagrid.data.rows;
			var fields=$(target).datagrid("getColumnFields",frozen);
			if(frozen){
				if(!(opts.rownumbers||(opts.frozenColumns&&opts.frozenColumns.length))){
					return;
				}
			}
			var tableData=["<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
			for(var i=0;i<rows.length;i++){
				var css=opts.rowStyler?opts.rowStyler.call(target,i,rows[i]):"";
				var cls="";
				var stl="";
				if(typeof css=="string"){
					stl=css;
				}else{
					if(css){
						cls=css["class"]||"";
						stl=css["style"]||"";
					}
				}
				var cls="class=\"datagrid-row "+(i%2&&opts.striped?"datagrid-row-alt ":" ")+cls+"\"";
				var trStl=stl?"style=\""+stl+"\"":"";
				var rowId=datagrid.rowIdPrefix+"-"+(frozen?1:2)+"-"+i;
				tableData.push("<tr id=\""+rowId+"\" datagrid-row-index=\""+i+"\" "+cls+" "+trStl+">");
				tableData.push(this.renderRow.call(this,target,fields,frozen,i,rows[i]));
				tableData.push("</tr>");
			}
			tableData.push("</tbody></table>");
			$(container).html(tableData.join(""));
		},
		renderFooter:function(target,container,frozen){
			var opts=$.data(target,"datagrid").options;
			var rows=$.data(target,"datagrid").footer||[];
			var fields=$(target).datagrid("getColumnFields",frozen);
			var footerhtml=["<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"];
			for(var i=0;i<rows.length;i++){
				footerhtml.push("<tr class=\"datagrid-row\" datagrid-row-index=\""+i+"\">");
				footerhtml.push(this.renderRow.call(this,target,fields,frozen,i,rows[i]));
				footerhtml.push("</tr>");
			}
			footerhtml.push("</tbody></table>");
			$(container).html(footerhtml.join(""));
		},
		renderRow:function(target,fields,frozen,index,row){
			var opts=$.data(target,"datagrid").options;
			var cc=[];
			if(frozen&&opts.rownumbers){
				var rownum=index+1;
				if(opts.pagination){
					rownum+=(opts.pageNumber-1)*opts.pageSize;
				}
				cc.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">"+rownum+"</div></td>");
			}
			for(var i=0;i<fields.length;i++){
				var field=fields[i];
				var col=$(target).datagrid("getColumnOption",field);
				if(col){
					var val=row[field];
					var css=col.styler?(col.styler(val,row,index)||""):"";
					var cls="";
					var stl="";
					if(typeof css=="string"){
						stl=css;
					}else{
						if(css){
							cls=css["class"]||"";
							stl=css["style"]||"";
						}
					}
					var cls=cls?"class=\""+cls+"\"":"";
					var tdStl=col.hidden?"style=\"display:none;"+stl+"\"":(stl?"style=\""+stl+"\"":"");
					cc.push("<td field=\""+field+"\" "+cls+" "+tdStl+">");
					var tdStl="";
					if(!col.checkbox){
						if(col.align){
							tdStl+="text-align:"+col.align+";";
						}
						if(!opts.nowrap){
							tdStl+="white-space:normal;height:auto;";
						}else{
							if(opts.autoRowHeight){
								tdStl+="height:auto;";
							}
						}
					}
					cc.push("<div style=\""+tdStl+"\" ");
					cc.push(col.checkbox?"class=\"datagrid-cell-check\"":"class=\"datagrid-cell "+col.cellClass+"\"");
					cc.push(">");
					if(col.checkbox){
						cc.push("<input type=\"checkbox\" "+(row.checked?"checked=\"checked\"":""));
						cc.push(" name=\""+field+"\" value=\""+(val!=undefined?val:"")+"\">");
					}else{
						if(col.formatter){
							cc.push(col.formatter(val,row,index));
						}else{
							cc.push(val);
						}
					}
					cc.push("</div>");
					cc.push("</td>");
				}
			}
			return cc.join("");
		},
		refreshRow:function(target,index){
			this.updateRow.call(this,target,index,{});
		},
		updateRow:function(target,index,row){
			var opts=$.data(target,"datagrid").options;
			var rows=$(target).datagrid("getRows");
			$.extend(rows[index],row);
			var css=opts.rowStyler?opts.rowStyler.call(target,index,rows[index]):"";
			var cls="";
			var stl="";
			if(typeof css=="string"){
				stl=css;
			}else{
				if(css){
					cls=css["class"]||"";
					stl=css["style"]||"";
				}
			}
			var cls="datagrid-row "+(index%2&&opts.striped?"datagrid-row-alt ":" ")+cls;
			function renderAndSelectRow(frozen){
				var fields=$(target).datagrid("getColumnFields",frozen);
				var tr=opts.finder.getTr(target,index,"body",(frozen?1:2));
				var ischecked=tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
				tr.html(this.renderRow.call(this,target,fields,frozen,index,rows[index]));
				tr.attr("style",stl).attr("class",tr.hasClass("datagrid-row-selected")?cls+" datagrid-row-selected":cls);
				if(ischecked){
					tr.find("div.datagrid-cell-check input[type=checkbox]")._propAttr("checked",true);
				}
			};
			renderAndSelectRow.call(this,true);
			renderAndSelectRow.call(this,false);
			$(target).datagrid("fixRowHeight",index);
		},
		insertRow:function(target,index,row){
			var datagrid=$.data(target,"datagrid");
			var opts=datagrid.options;
			var dc=datagrid.dc;
			var data=datagrid.data;
			if(index==undefined||index==null){
				index=data.rows.length;
			}
			if(index>data.rows.length){
				index=data.rows.length;
			}
			function updateRowNumber(frozen){
				var tmp=frozen?1:2;
				for(var i=data.rows.length-1;i>=index;i--){
					var tr=opts.finder.getTr(target,i,"body",tmp);
					tr.attr("datagrid-row-index",i+1);
					tr.attr("id",datagrid.rowIdPrefix+"-"+tmp+"-"+(i+1));
					if(frozen&&opts.rownumbers){
						var rownum=i+2;
						if(opts.pagination){
							rownum+=(opts.pageNumber-1)*opts.pageSize;
						}
						tr.find("div.datagrid-cell-rownumber").html(rownum);
					}
					if(opts.striped){
						tr.removeClass("datagrid-row-alt").addClass((i+1)%2?"datagrid-row-alt":"");
					}
				}
			};
			function insertTr(frozen){
				var tmp=frozen?1:2;
				var fields=$(target).datagrid("getColumnFields",frozen);
				var rowid=datagrid.rowIdPrefix+"-"+tmp+"-"+index;
				var tr="<tr id=\""+rowid+"\" class=\"datagrid-row\" datagrid-row-index=\""+index+"\"></tr>";
				if(index>=data.rows.length){
					if(data.rows.length){
						opts.finder.getTr(target,"","last",tmp).after(tr);
					}else{
						var cc=frozen?dc.body1:dc.body2;
						cc.html("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>"+tr+"</tbody></table>");
					}
				}else{
					opts.finder.getTr(target,index+1,"body",tmp).before(tr);
				}
			};
			updateRowNumber.call(this,true);
			updateRowNumber.call(this,false);
			insertTr.call(this,true);
			insertTr.call(this,false);
			data.total+=1;
			data.rows.splice(index,0,row);
			this.refreshRow.call(this,target,index);
		},
		deleteRow:function(target,index){
			var datagrid=$.data(target,"datagrid");
			var opts=datagrid.options;
			var data=datagrid.data;
			function updateRowNumber(frozen){
				var tmp=frozen?1:2;
				for(var i=index+1;i<data.rows.length;i++){
					var tr=opts.finder.getTr(target,i,"body",tmp);
					tr.attr("datagrid-row-index",i-1);
					tr.attr("id",datagrid.rowIdPrefix+"-"+tmp+"-"+(i-1));
					if(frozen&&opts.rownumbers){
						var rownum=i;
						if(opts.pagination){
							rownum+=(opts.pageNumber-1)*opts.pageSize;
						}
						tr.find("div.datagrid-cell-rownumber").html(rownum);
					}
					if(opts.striped){
						tr.removeClass("datagrid-row-alt").addClass((i-1)%2?"datagrid-row-alt":"");
					}
				}
			};
			opts.finder.getTr(target,index).remove();
			updateRowNumber.call(this,true);
			updateRowNumber.call(this,false);
			data.total-=1;
			data.rows.splice(index,1);
		},
		onBeforeRender:function(target,rows){},
		onAfterRender:function(target){
			var opts=$.data(target,"datagrid").options;
			if(opts.showFooter){
				var footer=$(target).datagrid("getPanel").find("div.datagrid-footer");
				footer.find("div.datagrid-cell-rownumber,div.datagrid-cell-check").css("visibility","hidden");
			}
		}
	};
	$.fn.datagrid.defaults=$.extend({},$.fn.panel.defaults,
		{
			sharedStyleSheet:false,
			frozenColumns:undefined,
			columns:undefined,
			fitColumns:false,
			resizeHandle:"right",
			autoRowHeight:true,
			toolbar:null,
			striped:false,
			method:"post",
			nowrap:true,
			idField:null,
			url:null,
			data:null,
			loadMsg:"Processing, please wait ...",
			rownumbers:false,
			singleSelect:false,
			ctrlSelect:false,
			selectOnCheck:true,
			checkOnSelect:true,
			pagination:false,
			pagePosition:"bottom",
			pageNumber:1,
			pageSize:10,
			pageList:[10,20,30,40,50],
			queryParams:{},
			sortName:null,
			sortOrder:"asc",
			multiSort:false,
			remoteSort:true,
			showHeader:true,
			showFooter:false,
			scrollbarSize:18,
			rowStyler:function(index,row){},
			loader:function(queryParam,successHandler,errorHandler){
				var opts=$(this).datagrid("options");
				if(!opts.url){
					return false;
				}
				//add by tpan
				if(typeof queryParam=='object'){
					if(queryParam['filter']){
						queryParam['filter'] = $.MingwenJSON.encode(queryParam['filter']);
					}	
				}
				$.ajax({
					type:opts.method,
					url:opts.url,
					data:queryParam,
					dataType:"json",
					success:function(data){
						successHandler(data);
					},
					error:function(){
						errorHandler.apply(this,arguments);
					}
				});
			},
			loadFilter:function(data){
				if(typeof data.length=="number"&&typeof data.splice=="function"){
					return {
							total:data.length,
							rows:data
							};
				}else{
					return data;
				}
			},
			editors:defaultEditors,
			finder:{
				getTr:function(target,index,type,frozen){
						type=type||"body";
						frozen=frozen||0;
						var datagrid=$.data(target,"datagrid");
						var dc=datagrid.dc;
						var opts=datagrid.options;
						if(frozen==0){
							var tr1=opts.finder.getTr(target,index,type,1);
							var tr2=opts.finder.getTr(target,index,type,2);
							return tr1.add(tr2);
						}else{
							if(type=="body"){
								var tr=$("#"+datagrid.rowIdPrefix+"-"+frozen+"-"+index);
								if(!tr.length){
									tr=(frozen==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index="+index+"]");
								}
								return tr;
							}else{
								if(type=="footer"){
									return (frozen==1?dc.footer1:dc.footer2).find(">table>tbody>tr[datagrid-row-index="+index+"]");
								}else{
									if(type=="selected"){
										return (frozen==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-selected");
									}else{
										if(type=="highlight"){
											return (frozen==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-over");
										}else{
											if(type=="checked"){
												return (frozen==1?dc.body1:dc.body2).find(">table>tbody>tr.datagrid-row-checked");
											}else{
												if(type=="last"){
													return (frozen==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index]:last");
												}else{
													if(type=="allbody"){
														return (frozen==1?dc.body1:dc.body2).find(">table>tbody>tr[datagrid-row-index]");
													}else{
														if(type=="allfooter"){
															return (frozen==1?dc.footer1:dc.footer2).find(">table>tbody>tr[datagrid-row-index]");
														}
													}
												}
											}
										}
									}
								}
							}
						}
				},
				getRow:function(target,p){
					var rowIndex=(typeof p=="object")?p.attr("datagrid-row-index"):p;
					return $.data(target,"datagrid").data.rows[parseInt(rowIndex)];
				},
				getRows:function(target){
					return $(target).datagrid("getRows");
				}
			},
			view:defaultView,
			onBeforeLoad:function(queryParam){},
			onLoadSuccess:function(){},
			onLoadError:function(){},
			onClickRow:function(index, row){},
			onDblClickRow:function(index, row){},
			onClickCell:function(index,field,td){},
			onDblClickCell:function(index,field,td){},
			onBeforeSortColumn:function(sort,order){},
			onSortColumn:function(sort,order){},
			onResizeColumn:function(field,width){},
			onSelect:function(index, row){},
			onUnselect:function(index, row){},
			onSelectAll:function(rows){},
			onUnselectAll:function(rows){},
			onCheck:function(index,row){},
			onUncheck:function(index,row){},
			onCheckAll:function(rows){},
			onUncheckAll:function(rows){},
			onBeforeEdit:function(index,row){},
			onBeginEdit:function(index,row){},
			onEndEdit:function(index,row,changedVal){},
			onAfterEdit:function(index,row,changedVal){},
			onCancelEdit:function(index,row){},
			onHeaderContextMenu:function(e,field){},
			onRowContextMenu:function(e,index,row){}
		}
	);
})(jQuery);
//treegrid
(function($) {
	function buildTreeGrid(target) {
		var treegrid = $.data(target, "treegrid");
		var opts = treegrid.options;
		$(target).datagrid($.extend( {}, opts, {
			url : null,
			data : null,
			loader : function() {
				return false;
			},
			onBeforeLoad : function() {
				return false;
			},
			onLoadSuccess : function() {
			},
			onResizeColumn : function(field, width) {
				fixTreegridRowHeight(target);
				opts.onResizeColumn.call(target, field, width);
			},
			onSortColumn : function(sort, order) {
				opts.sortName = sort;
				opts.sortOrder = order;
				if (opts.remoteSort) {
					loadRemoteTreegridData(target);
				} else {
					var data = $(target).treegrid("getData");
					loadTreegridData(target, 0, data);
				}
				opts.onSortColumn.call(target, sort, order);
			},
			onBeforeEdit : function(index, row) {
				if (opts.onBeforeEdit.call(target, row) == false) {
					return false;
				}
			},
			onAfterEdit : function(index, row, changedVal) {
				opts.onAfterEdit.call(target, row, changedVal);
			},
			onCancelEdit : function(index, row) {
				opts.onCancelEdit.call(target, row);
			},
			onSelect : function(id) {
				opts.onSelect.call(target, findTreegridRow(target, id));
			},
			onUnselect : function(id) {
				opts.onUnselect.call(target, findTreegridRow(target, id));
			},
			onCheck : function(id) {
				opts.onCheck.call(target, findTreegridRow(target, id));
			},
			onUncheck : function(id) {
				opts.onUncheck.call(target, findTreegridRow(target, id));
			},
			onClickRow : function(id) {
				opts.onClickRow.call(target, findTreegridRow(target, id));
			},
			onDblClickRow : function(id) {
				opts.onDblClickRow.call(target, findTreegridRow(target, id));
			},
			onClickCell : function(id, field) {
				opts.onClickCell.call(target, field, findTreegridRow(target, id));
			},
			onDblClickCell : function(id, field) {
				opts.onDblClickCell.call(target, field, findTreegridRow(target, id));
			},
			onRowContextMenu : function(e, id) {
				opts.onContextMenu.call(target, e, findTreegridRow(target, id));
			}
		}));
		if (!opts.columns) {
			var dopts = $.data(target, "datagrid").options;
			opts.columns = dopts.columns;
			opts.frozenColumns = dopts.frozenColumns;
		}
		treegrid.dc = $.data(target, "datagrid").dc;
		if (opts.pagination) {
			var pager = $(target).datagrid("getPager");
			pager.pagination( {
				pageNumber : opts.pageNumber,
				pageSize : opts.pageSize,
				pageList : opts.pageList,
				onSelectPage : function(pageNumber, pageSize) {
					opts.pageNumber = pageNumber;
					opts.pageSize = pageSize;
					loadRemoteTreegridData(target);
				}
			});
			opts.pageSize = pager.pagination("options").pageSize;
		}
	}
	;
	function fixTreegridRowHeight(target, id) {
		var dgopts = $.data(target, "datagrid").options;
		var dc = $.data(target, "datagrid").dc;
		if (!dc.body1.is(":empty") && (!dgopts.nowrap || dgopts.autoRowHeight)) {
			if (id != undefined) {
				var childRows = getChildrenRows(target, id);
				for ( var i = 0; i < childRows.length; i++) {
					//adjustRowHeight(childRows[i][dgopts.idField]);
				}
			}
		}
		$(target).datagrid("fixRowHeight", id);
		function adjustRowHeight(id) {
			var tr1 = dgopts.finder.getTr(target, id, "body", 1);
			var tr2 = dgopts.finder.getTr(target, id, "body", 2);
			tr1.css("height", "");
			tr2.css("height", "");
			var maxHeight = Math.max(tr1.height(), tr2.height());
			tr1.css("height", maxHeight);
			tr2.css("height", maxHeight);
		}
		;
	}
	;
	function updateTreegridRownum(target) {
		var dc = $.data(target, "datagrid").dc;
		var opts = $.data(target, "treegrid").options;
		if (!opts.rownumbers) {
			return;
		}
		dc.body1.find("div.datagrid-cell-rownumber").each(function(i) {
			$(this).html(i + 1);
		});
	}
	;
	function bindTreegridEvents(target) {
		var dc = $.data(target, "datagrid").dc;
		var bodys = dc.body1.add(dc.body2);
		var clickHandler = ($.data(bodys[0], "events") || $._data(bodys[0], "events")).click[0].handler;
		dc.body1.add(dc.body2).bind(
				"mouseover",
				function(e) {
					var tt = $(e.target);
					var tr = tt.closest("tr.datagrid-row");
					if (!tr.length) {
						return;
					}
					if (tt.hasClass("tree-hit")) {
						tt.hasClass("tree-expanded") ? tt
								.addClass("tree-expanded-hover") : tt
								.addClass("tree-collapsed-hover");
					}
				}).bind(
				"mouseout",
				function(e) {
					var tt = $(e.target);
					var tr = tt.closest("tr.datagrid-row");
					if (!tr.length) {
						return;
					}
					if (tt.hasClass("tree-hit")) {
						tt.hasClass("tree-expanded") ? tt
								.removeClass("tree-expanded-hover") : tt
								.removeClass("tree-collapsed-hover");
					}
				}).unbind("click").bind("click", function(e) {
			var tt = $(e.target);
			var tr = tt.closest("tr.datagrid-row");
			if (!tr.length) {
				return;
			}
			if (tt.hasClass("tree-hit")) {
				toggleTreegridRow(target, tr.attr("node-id"));
			} else {
				clickHandler(e);
			}
		});
	}
	;
	function newTreegridRow(target, parentId) {
		var opts = $.data(target, "treegrid").options;
		var tr1 = opts.finder.getTr(target, parentId, "body", 1);
		var tr2 = opts.finder.getTr(target, parentId, "body", 2);
		var frozenColumnSize = $(target).datagrid("getColumnFields", true).length
				+ (opts.rownumbers ? 1 : 0);
		var unfrozenColumnSize = $(target).datagrid("getColumnFields", false).length;
		newTr(tr1, frozenColumnSize);
		newTr(tr2, unfrozenColumnSize);
		function newTr(tr, s) {
			$(
					"<tr class=\"treegrid-tr-tree\">"
							+ "<td style=\"border:0px\" colspan=\"" + s
							+ "\">" + "<div></div>" + "</td>" + "</tr>")
					.insertAfter(tr);
		}
		;
	}
	;
	function loadTreegridData(target, parentId, data, isAppend) {
		var treegrid = $.data(target, "treegrid");
		var opts = treegrid.options;
		var dc = treegrid.dc;
		data = opts.loadFilter.call(target, data, parentId);
		var parentRow = findTreegridRow(target, parentId);
		if (parentRow) {
			var tr1 = opts.finder.getTr(target, parentId, "body", 1);
			var tr2 = opts.finder.getTr(target, parentId, "body", 2);
			var cc1 = tr1.next("tr.treegrid-tr-tree").children("td").children(
					"div");
			var cc2 = tr2.next("tr.treegrid-tr-tree").children("td").children(
					"div");
			if (!isAppend) {
				parentRow.children = [];
			}
		} else {
			var cc1 = dc.body1;
			var cc2 = dc.body2;
			if (!isAppend) {
				treegrid.data = [];
			}
		}
		if (!isAppend) {
			cc1.empty();
			cc2.empty();
		}
		if (opts.view.onBeforeRender) {
			opts.view.onBeforeRender.call(opts.view, target, parentId, data);
		}
		opts.view.render.call(opts.view, target, cc1, true);
		opts.view.render.call(opts.view, target, cc2, false);
		if (opts.showFooter) {
			opts.view.renderFooter.call(opts.view, target, dc.footer1, true);
			opts.view.renderFooter.call(opts.view, target, dc.footer2, false);
		}
		if (opts.view.onAfterRender) {
			opts.view.onAfterRender.call(opts.view, target);
		}
		if (!parentId && opts.pagination) {
			var newtotal = $.data(target, "treegrid").total;
			var pager = $(target).datagrid("getPager");
			if (pager.pagination("options").total != newtotal) {
				pager.pagination( {
					total : newtotal
				});
			}
		}
		fixTreegridRowHeight(target);
		updateTreegridRownum(target);
		$(target).treegrid("showLines");
		$(target).treegrid("setSelectionState");
		$(target).treegrid("autoSizeColumn");
		opts.onLoadSuccess.call(target, parentRow, data);
	}
	;
	function loadRemoteTreegridData(target, parentId, queryParams, onSuccess, onError) {
		var opts = $.data(target, "treegrid").options;
		var gridbody = $(target).datagrid("getPanel").find("div.datagrid-body");
		if (queryParams) {
			opts.queryParams = queryParams;
		}
		var params = $.extend( {}, opts.queryParams);
		if (opts.pagination) {
			$.extend(params, {
				page : opts.pageNumber,
				rows : opts.pageSize
			});
		}
		if (opts.sortName) {
			$.extend(params, {
				sort : opts.sortName,
				order : opts.sortOrder
			});
		}
		var row = findTreegridRow(target, parentId);
		if (opts.onBeforeLoad.call(target, row, params) == false) {
			return;
		}
		var rowSpan = gridbody.find("tr[node-id=\"" + parentId + "\"] span.tree-folder");
		rowSpan.addClass("tree-loading");
		$(target).treegrid("loading");
		var success = opts.loader.call(target, params, function(data) {
			rowSpan.removeClass("tree-loading");
			$(target).treegrid("loaded");
			loadTreegridData(target, parentId, data, onSuccess);
			if (onError) {
				onError();
			}
		}, function() {
			rowSpan.removeClass("tree-loading");
			$(target).treegrid("loaded");
			opts.onLoadError.apply(target, arguments);
			if (onError) {
				onError();
			}
		});
		if (success == false) {
			rowSpan.removeClass("tree-loading");
			$(target).treegrid("loaded");
		}
	}
	;
	function getRootRow(target) {
		var rootRows = getRootRows(target);
		if (rootRows.length) {
			return rootRows[0];
		} else {
			return null;
		}
	}
	;
	function getRootRows(target) {
		return $.data(target, "treegrid").data;
	}
	;
	function getParentRow(target, id) {
		var row = findTreegridRow(target, id);
		if (row._parentId) {
			return findTreegridRow(target, row._parentId);
		} else {
			return null;
		}
	}
	;
	function getChildrenRows(target, id) {
		var opts = $.data(target, "treegrid").options;
//		var _5c = $(target).datagrid("getPanel").find(
//				"div.datagrid-view2 div.datagrid-body");
		var result = [];
		if (id) {
			collectChildrenRows(id);
		} else {
			var rootRows = getRootRows(target);
			for ( var i = 0; i < rootRows.length; i++) {
				result.push(rootRows[i]);
				collectChildrenRows(rootRows[i][opts.idField]);
			}
		}
		function collectChildrenRows(pid) {
			var row = findTreegridRow(target, pid);
			if (row && row.children) {
				for ( var i = 0, len = row.children.length; i < len; i++) {
					var child = row.children[i];
					result.push(child);
					collectChildrenRows(child[opts.idField]);
				}
			}
		}
		;
		return result;
	}
	;
	function getRowLevel(target, id) {
		if (!id) {
			return 0;
		}
		var opts = $.data(target, "treegrid").options;
		var dv = $(target).datagrid("getPanel").children("div.datagrid-view");
		var cell = dv.find("div.datagrid-body tr[node-id=\"" + id + "\"]")
				.children("td[field=\"" + opts.treeField + "\"]");
		return cell.find("span.tree-indent,span.tree-hit").length;
	}
	;
	function findTreegridRow(target, id) {
		var opts = $.data(target, "treegrid").options;
		var datas = $.data(target, "treegrid").data;
		var cc = [ datas ];
		while (cc.length) {
			var c = cc.shift();
			for ( var i = 0; i < c.length; i++) {
				var row = c[i];
				if (row[opts.idField] == id) {
					return row;
				} else {
					if (row["children"]) {
						cc.push(row["children"]);
					}
				}
			}
		}
		return null;
	}
	;
	function collapseTreegridRow(target, id) {
		var opts = $.data(target, "treegrid").options;
		var row = findTreegridRow(target, id);
		var tr = opts.finder.getTr(target, id);
		var hit = tr.find("span.tree-hit");
		if (hit.length == 0) {
			return;
		}
		if (hit.hasClass("tree-collapsed")) {
			return;
		}
		if (opts.onBeforeCollapse.call(target, row) == false) {
			return;
		}
		hit.removeClass("tree-expanded tree-expanded-hover").addClass(
				"tree-collapsed");
		hit.next().removeClass("tree-folder-open");
		row.state = "closed";
		tr = tr.next("tr.treegrid-tr-tree");
		var cc = tr.children("td").children("div");
		if (opts.animate) {
			cc.slideUp("normal", function() {
				$(target).treegrid("autoSizeColumn");
				fixTreegridRowHeight(target, id);
				opts.onCollapse.call(target, row);
			});
		} else {
			cc.hide();
			$(target).treegrid("autoSizeColumn");
			fixTreegridRowHeight(target, id);
			opts.onCollapse.call(target, row);
		}
	}
	;
	function expandTreegridRow(target, id) {
		var opts = $.data(target, "treegrid").options;
		var tr = opts.finder.getTr(target, id);
		var hit = tr.find("span.tree-hit");
		var row = findTreegridRow(target, id);
		if (hit.length == 0) {
			return;
		}
		if (hit.hasClass("tree-expanded")) {
			return;
		}
		if (opts.onBeforeExpand.call(target, row) == false) {
			return;
		}
		hit.removeClass("tree-collapsed tree-collapsed-hover").addClass(
				"tree-expanded");
		hit.next().addClass("tree-folder-open");
		var childTr = tr.next("tr.treegrid-tr-tree");
		if (childTr.length) {
			var cc = childTr.children("td").children("div");
			showChildRows(cc);
		} else {
			newTreegridRow(target, row[opts.idField]);
			var childTr = tr.next("tr.treegrid-tr-tree");
			var cc = childTr.children("td").children("div");
			cc.hide();
			var queryParams = $.extend( {}, opts.queryParams || {});
			queryParams.id = row[opts.idField];
			loadRemoteTreegridData(target, row[opts.idField], queryParams, true, function() {
				if (cc.is(":empty")) {
					childTr.remove();
				} else {
					showChildRows(cc);
				}
			});
		}
		function showChildRows(cc) {
			row.state = "open";
			if (opts.animate) {
				cc.slideDown("normal", function() {
					$(target).treegrid("autoSizeColumn");
					fixTreegridRowHeight(target, id);
					opts.onExpand.call(target, row);
				});
			} else {
				cc.show();
				$(target).treegrid("autoSizeColumn");
				fixTreegridRowHeight(target, id);
				opts.onExpand.call(target, row);
			}
		}
		;
	}
	;
	function toggleTreegridRow(target, id) {
		var opts = $.data(target, "treegrid").options;
		var tr = opts.finder.getTr(target, id);
		var hit = tr.find("span.tree-hit");
		if (hit.hasClass("tree-expanded")) {
			collapseTreegridRow(target, id);
		} else {
			expandTreegridRow(target, id);
		}
	}
	;
	function collapseAllTreegridRow(target, id) {
		var opts = $.data(target, "treegrid").options;
		var childRows = getChildrenRows(target, id);
		if (id) {
			childRows.unshift(findTreegridRow(target, id));
		}
		for ( var i = 0; i < childRows.length; i++) {
			collapseTreegridRow(target, childRows[i][opts.idField]);
		}
	}
	;
	function expandAllTreegridRow(target, id) {
		var opts = $.data(target, "treegrid").options;
		var childRows = getChildrenRows(target, id);
		if (id) {
			childRows.unshift(findTreegridRow(target, id));
		}
		for ( var i = 0; i < childRows.length; i++) {
			expandTreegridRow(target, childRows[i][opts.idField]);
		}
	}
	;
	function expandToTreegridRow(target, id) {
		var opts = $.data(target, "treegrid").options;
		var ids = [];
		var p = getParentRow(target, id);
		while (p) {
			var id = p[opts.idField];
			ids.unshift(id);
			p = getParentRow(target, id);
		}
		for ( var i = 0; i < ids.length; i++) {
			expandTreegridRow(target, ids[i]);
		}
	}
	;
	function appendTreegridRow(target, param) {
		var opts = $.data(target, "treegrid").options;
		if (param.parent) {
			var tr = opts.finder.getTr(target, param.parent);
			if (tr.next("tr.treegrid-tr-tree").length == 0) {
				newTreegridRow(target, param.parent);
			}
			var cell = tr.children("td[field=\"" + opts.treeField + "\"]")
					.children("div.datagrid-cell");
			var icon = cell.children("span.tree-icon");
			if (icon.hasClass("tree-file")) {
				icon.removeClass("tree-file").addClass(
						"tree-folder tree-folder-open");
				var hit = $("<span class=\"tree-hit tree-expanded\"></span>")
						.insertBefore(icon);
				if (hit.prev().length) {
					hit.prev().remove();
				}
			}
		}
		loadTreegridData(target, param.parent, param.data, true);
	}
	;
	function insertTreegridRow(target, param) {
		var ref = param.before || param.after;
		var opts = $.data(target, "treegrid").options;
		var parentRow = getParentRow(target, ref);
		appendTreegridRow(target, {
			parent : (parentRow ? parentRow[opts.idField] : null),
			data : [ param.data ]
		});
		var childRows = parentRow ? parentRow.children : $(target).treegrid("getRoots");
		for ( var i = 0; i < childRows.length; i++) {
			if (childRows[i][opts.idField] == ref) {
				var _96 = childRows[childRows.length - 1];
				childRows.splice(param.before ? i : (i + 1), 0, _96);
				childRows.splice(childRows.length - 1, 1);
				break;
			}
		}
		insertTr(true);
		insertTr(false);
		updateTreegridRownum(target);
		$(target).treegrid("showLines");
		function insertTr(frozen) {
			var type = frozen ? 1 : 2;
			var tr = opts.finder.getTr(target, param.data[opts.idField], "body", type);
			var btable = tr.closest("table.datagrid-btable");
			tr = tr.parent().children();
			var refTr = opts.finder.getTr(target, ref, "body", type);
			if (param.before) {
				tr.insertBefore(refTr);
			} else {
				var sub = refTr.next("tr.treegrid-tr-tree");
				tr.insertAfter(sub.length ? sub : refTr);
			}
			btable.remove();
		}
		;
	}
	;
	function removeTreegridRow(target, id) {
		var treegrid = $.data(target, "treegrid");
		$(target).datagrid("deleteRow", id);
		updateTreegridRownum(target);
		treegrid.total -= 1;
		$(target).datagrid("getPager").pagination("refresh", {
			total : treegrid.total
		});
		$(target).treegrid("showLines");
	}
	;
	function showTreegridLines(target) {
		var t = $(target);
		var opts = t.treegrid("options");
		if (opts.lines) {
			t.treegrid("getPanel").addClass("tree-lines");
		} else {
			t.treegrid("getPanel").removeClass("tree-lines");
			return;
		}
		t.treegrid("getPanel").find("span.tree-indent").removeClass(
				"tree-line tree-join tree-joinbottom");
		t.treegrid("getPanel").find("div.datagrid-cell").removeClass(
				"tree-node-last tree-root-first tree-root-one");
		var rootRows = t.treegrid("getRoots");
		if (rootRows.length > 1) {
			getTreeFieldCell(rootRows[0]).addClass("tree-root-first");
		} else {
			if (rootRows.length == 1) {
				getTreeFieldCell(rootRows[0]).addClass("tree-root-one");
			}
		}
		setJoinLine(rootRows);
		setTreeLine(rootRows);
		function setJoinLine(rows) {
			$.map(rows, function(row) {
				if (row.children && row.children.length) {
					setJoinLine(row.children);
				} else {
					var cell = getTreeFieldCell(row);
					cell.find(".tree-icon").prev().addClass("tree-join");
				}
			});
			var lastCell = getTreeFieldCell(rows[rows.length - 1]);
			lastCell.addClass("tree-node-last");
			lastCell.find(".tree-join").removeClass("tree-join").addClass(
					"tree-joinbottom");
		}
		;
		function setTreeLine(rows) {
			$.map(rows, function(row) {
				if (row.children && row.children.length) {
					setTreeLine(row.children);
				}
			});
			for ( var i = 0; i < rows.length - 1; i++) {
				var row = rows[i];
				var level = t.treegrid("getLevel", row[opts.idField]);
				var tr = opts.finder.getTr(target, row[opts.idField]);
				var cc = tr.next().find(
						"tr.datagrid-row td[field=\"" + opts.treeField
								+ "\"] div.datagrid-cell");
				cc.find("span:eq(" + (level - 1) + ")").addClass("tree-line");
			}
		}
		;
		function getTreeFieldCell(r) {
			var tr = opts.finder.getTr(target, r[opts.idField]);
			var cell = tr.find("td[field=\"" + opts.treeField
					+ "\"] div.datagrid-cell");
			return cell;
		}
		;
	}
	;
	$.fn.treegrid = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.treegrid.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "treegrid");
			if (state) {
				$.extend(state.options, options);
			} else {
				state = $.data(this, "treegrid", {
					options : $.extend( {}, $.fn.treegrid.defaults,
							$.fn.treegrid.parseOptions(this), options),
					data : []
				});
			}
			buildTreeGrid(this);
			if (state.options.data) {
				$(this).treegrid("loadData", state.options.data);
			}
			loadRemoteTreegridData(this);
			bindTreegridEvents(this);
		});
	};
	$.fn.treegrid.methods = {
		options : function(jq) {
			return $.data(jq[0], "treegrid").options;
		},
		resize : function(jq, options) {
			return jq.each(function() {
				$(this).datagrid("resize", options);
			});
		},
		fixRowHeight : function(jq, id) {
			return jq.each(function() {
				fixTreegridRowHeight(this, id);
			});
		},
		loadData : function(jq, data) {
			return jq.each(function() {
				loadTreegridData(this, data.parent, data);
			});
		},
		load : function(jq, param) {
			return jq.each(function() {
				$(this).treegrid("options").pageNumber = 1;
				$(this).treegrid("getPager").pagination( {
					pageNumber : 1
				});
				$(this).treegrid("reload", param);
			});
		},
		reload : function(jq, id) {
			return jq.each(function() {
				var opts = $(this).treegrid("options");
				var param = {};
				if (typeof id == "object") {
					param = id;
				} else {
					param = $.extend( {}, opts.queryParams);
					param.id = id;
				}
				if (param.id) {
					var row = $(this).treegrid("find", param.id);
					if (row.children) {
						row.children.splice(0, row.children.length);
					}
					opts.queryParams = param;
					var tr = opts.finder.getTr(this, param.id);
					tr.next("tr.treegrid-tr-tree").remove();
					tr.find("span.tree-hit").removeClass(
							"tree-expanded tree-expanded-hover").addClass(
							"tree-collapsed");
					expandTreegridRow(this, param.id);
				} else {
					loadRemoteTreegridData(this, null, param);
				}
			});
		},
		reloadFooter : function(jq, footer) {
			return jq.each(function() {
				var opts = $.data(this, "treegrid").options;
				var dc = $.data(this, "datagrid").dc;
				if (footer) {
					$.data(this, "treegrid").footer = footer;
				}
				if (opts.showFooter) {
					opts.view.renderFooter
							.call(opts.view, this, dc.footer1, true);
					opts.view.renderFooter.call(opts.view, this, dc.footer2,
							false);
					if (opts.view.onAfterRender) {
						opts.view.onAfterRender.call(opts.view, this);
					}
					$(this).treegrid("fixRowHeight");
				}
			});
		},
		getData : function(jq) {
			return $.data(jq[0], "treegrid").data;
		},
		getFooterRows : function(jq) {
			return $.data(jq[0], "treegrid").footer;
		},
		getRoot : function(jq) {
			return getRootRow(jq[0]);
		},
		getRoots : function(jq) {
			return getRootRows(jq[0]);
		},
		getParent : function(jq, id) {
			return getParentRow(jq[0], id);
		},
		getChildren : function(jq, id) {
			return getChildrenRows(jq[0], id);
		},
		getLevel : function(jq, id) {
			return getRowLevel(jq[0], id);
		},
		find : function(jq, id) {
			return findTreegridRow(jq[0], id);
		},
		isLeaf : function(jq, id) {
			var _be = $.data(jq[0], "treegrid").options;
			var tr = _be.finder.getTr(jq[0], id);
			var hit = tr.find("span.tree-hit");
			return hit.length == 0;
		},
		select : function(jq, id) {
			return jq.each(function() {
				$(this).datagrid("selectRow", id);
			});
		},
		unselect : function(jq, id) {
			return jq.each(function() {
				$(this).datagrid("unselectRow", id);
			});
		},
		collapse : function(jq, id) {
			return jq.each(function() {
				collapseTreegridRow(this, id);
			});
		},
		expand : function(jq, id) {
			return jq.each(function() {
				expandTreegridRow(this, id);
			});
		},
		toggle : function(jq, id) {
			return jq.each(function() {
				toggleTreegridRow(this, id);
			});
		},
		collapseAll : function(jq, id) {
			return jq.each(function() {
				collapseAllTreegridRow(this, id);
			});
		},
		expandAll : function(jq, id) {
			return jq.each(function() {
				expandAllTreegridRow(this, id);
			});
		},
		expandTo : function(jq, id) {
			return jq.each(function() {
				expandToTreegridRow(this, id);
			});
		},
		append : function(jq, param) {
			return jq.each(function() {
				appendTreegridRow(this, param);
			});
		},
		insert : function(jq, param) {
			return jq.each(function() {
				insertTreegridRow(this, param);
			});
		},
		remove : function(jq, id) {
			return jq.each(function() {
				removeTreegridRow(this, id);
			});
		},
		pop : function(jq, id) {
			var row = jq.treegrid("find", id);
			jq.treegrid("remove", id);
			return row;
		},
		refresh : function(jq, id) {
			return jq.each(function() {
				var opts = $.data(this, "treegrid").options;
				opts.view.refreshRow.call(opts.view, this, id);
			});
		},
		update : function(jq, param) {
			return jq.each(function() {
				var opts = $.data(this, "treegrid").options;
				opts.view.updateRow.call(opts.view, this, param.id, param.row);
			});
		},
		beginEdit : function(jq, id) {
			return jq.each(function() {
				$(this).datagrid("beginEdit", id);
				$(this).treegrid("fixRowHeight", id);
			});
		},
		endEdit : function(jq, id) {
			return jq.each(function() {
				$(this).datagrid("endEdit", id);
			});
		},
		cancelEdit : function(jq, id) {
			return jq.each(function() {
				$(this).datagrid("cancelEdit", id);
			});
		},
		showLines : function(jq) {
			return jq.each(function() {
				showTreegridLines(this);
			});
		}
	};
	$.fn.treegrid.parseOptions = function(target) {
		return $.extend( {}, $.fn.datagrid.parseOptions(target), $.parser
				.parseOptions(target, [ "treeField", {
					animate : "boolean"
				} ]));
	};
	var defaultTreegridView = $
			.extend(
					{},
					$.fn.datagrid.defaults.view,
					{
						render : function(target, container, frozen) {
							var opts = $.data(target, "treegrid").options;
							var fields = $(target).datagrid("getColumnFields", frozen);
							var rowIdPrefix = $.data(target, "datagrid").rowIdPrefix;
							if (frozen) {
								if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))) {
									return;
								}
							}
							var me = this;
							if (this.treeNodes && this.treeNodes.length) {
								var content = renderTreeNode(frozen, this.treeLevel,
										this.treeNodes);
								$(container).append(content.join(""));
							}
							function renderTreeNode(pFrozen, tLevel, tNodes) {
								var parentNode = $(target).treegrid("getParent",
										tNodes[0][opts.idField]);
								var start = (parentNode ? parentNode.children.length : $(target)
										.treegrid("getRoots").length)
										- tNodes.length;
								var table = [ "<table class=\"datagrid-btable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>" ];
								for ( var i = 0; i < tNodes.length; i++) {
									var row = tNodes[i];
									if (row.state != "open"
											&& row.state != "closed") {
										row.state = "open";
									}
									var css = opts.rowStyler ? opts.rowStyler
											.call(target, row) : "";
									var cls = "";
									var stl = "";
									if (typeof css == "string") {
										stl = css;
									} else {
										if (css) {
											cls = css["class"] || "";
											stl = css["style"] || "";
										}
									}
									var cls = "class=\"datagrid-row "
											+ (start++ % 2 && opts.striped ? "datagrid-row-alt "
													: " ") + cls + "\"";
									var rowStl = stl ? "style=\"" + stl + "\""
											: "";
									var rowId = rowIdPrefix + "-" + (pFrozen ? 1 : 2) + "-"
											+ row[opts.idField];
									table.push("<tr id=\"" + rowId
											+ "\" node-id=\""
											+ row[opts.idField] + "\" " + cls
											+ " " + rowStl + ">");
									table = table.concat(me.renderRow.call(me,
											target, fields, pFrozen, tLevel, row));
									table.push("</tr>");
									if (row.children && row.children.length) {
										var tt = renderTreeNode(pFrozen, tLevel + 1, row.children);
										var v = row.state == "closed" ? "none"
												: "block";
										table
												.push("<tr class=\"treegrid-tr-tree\"><td style=\"border:0px\" colspan="
														+ (fields.length + (opts.rownumbers ? 1
																: 0))
														+ "><div style=\"display:"
														+ v + "\">");
										table = table.concat(tt);
										table.push("</div></td></tr>");
									}
								}
								table.push("</tbody></table>");
								return table;
							}
							;
						},
						renderFooter : function(target, footer, frozen) {
							var opts = $.data(target, "treegrid").options;
							var footers = $.data(target, "treegrid").footer || [];
							var fields = $(target).datagrid("getColumnFields", frozen);
							var content = [ "<table class=\"datagrid-ftable\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody>" ];
							for ( var i = 0; i < footers.length; i++) {
								var row = footers[i];
								row[opts.idField] = row[opts.idField]
										|| ("foot-row-id" + i);
								content
										.push("<tr class=\"datagrid-row\" node-id=\""
												+ row[opts.idField] + "\">");
								content.push(this.renderRow.call(this, target, fields,
										frozen, 0, row));
								content.push("</tr>");
							}
							content.push("</tbody></table>");
							$(footer).html(content.join(""));
						},
						renderRow : function(target, fields, frozen, level, row) {
							var opts = $.data(target, "treegrid").options;
							var cc = [];
							if (frozen && opts.rownumbers) {
								cc
										.push("<td class=\"datagrid-td-rownumber\"><div class=\"datagrid-cell-rownumber\">0</div></td>");
							}
							for ( var i = 0; i < fields.length; i++) {
								var field = fields[i];
								var col = $(target).datagrid("getColumnOption",
										field);
								if (col) {
									var css = col.styler ? (col.styler(
											row[field], row) || "") : "";
									var cls = "";
									var stl = "";
									if (typeof css == "string") {
										stl = css;
									} else {
										if (cc) {
											cls = css["class"] || "";
											stl = css["style"] || "";
										}
									}
									var cls = cls ? "class=\"" + cls + "\""
											: "";
									var colStl = col.hidden ? "style=\"display:none;"
											+ stl + "\""
											: (stl ? "style=\"" + stl + "\""
													: "");
									cc.push("<td field=\"" + field + "\" " + cls
											+ " " + colStl + ">");
									var colStl = "";
									if (!col.checkbox) {
										if (col.align) {
											colStl += "text-align:" + col.align
													+ ";";
										}
										if (!opts.nowrap) {
											colStl += "white-space:normal;height:auto;";
										} else {
											if (opts.autoRowHeight) {
												colStl += "height:auto;";
											}
										}
									}
									cc.push("<div style=\"" + colStl + "\" ");
									if (col.checkbox) {
										cc.push("class=\"datagrid-cell-check ");
									} else {
										cc.push("class=\"datagrid-cell "
												+ col.cellClass);
									}
									cc.push("\">");
									if (col.checkbox) {
										if (row.checked) {
											cc
													.push("<input type=\"checkbox\" checked=\"checked\"");
										} else {
											cc.push("<input type=\"checkbox\"");
										}
										cc
												.push(" name=\""
														+ field
														+ "\" value=\""
														+ (row[field] != undefined ? row[field]
																: "") + "\">");
									} else {
										var val = null;
										if (col.formatter) {
											val = col.formatter(row[field], row);
										} else {
											val = row[field];
										}
										if (field == opts.treeField) {
											for ( var j = 0; j < level; j++) {
												cc
														.push("<span class=\"tree-indent\"></span>");
											}
											if (row.state == "closed") {
												cc
														.push("<span class=\"tree-hit tree-collapsed\"></span>");
												cc
														.push("<span class=\"tree-icon tree-folder "
																+ (row.iconCls ? row.iconCls
																		: "")
																+ "\"></span>");
											} else {
												if (row.children
														&& row.children.length) {
													cc
															.push("<span class=\"tree-hit tree-expanded\"></span>");
													cc
															.push("<span class=\"tree-icon tree-folder tree-folder-open "
																	+ (row.iconCls ? row.iconCls
																			: "")
																	+ "\"></span>");
												} else {
													cc
															.push("<span class=\"tree-indent\"></span>");
													cc
															.push("<span class=\"tree-icon tree-file "
																	+ (row.iconCls ? row.iconCls
																			: "")
																	+ "\"></span>");
												}
											}
											cc
													.push("<span class=\"tree-title\">"
															+ val + "</span>");
										} else {
											cc.push(val);
										}
									}
									cc.push("</div>");
									cc.push("</td>");
								}
							}
							return cc.join("");
						},
						refreshRow : function(target, id) {
							this.updateRow.call(this, target, id, {});
						},
						updateRow : function(target, id, row) {
							var opts = $.data(target, "treegrid").options;
							var oldRow = $(target).treegrid("find", id);
							$.extend(oldRow, row);
							var level = $(target).treegrid("getLevel", id) - 1;
							var rowStyle = opts.rowStyler ? opts.rowStyler.call(target,
									oldRow) : "";
							var rowIdPrefix = $.data(target, "datagrid").rowIdPrefix;
							var newid = oldRow[opts.idField];
							function updateRowWithFrozen(frozen) {
								var fields = $(target).treegrid("getColumnFields",
										frozen);
								var tr = opts.finder.getTr(target, id, "body",
										(frozen ? 1 : 2));
								var rowNum = tr
										.find("div.datagrid-cell-rownumber")
										.html();
								var isChecked = tr
										.find(
												"div.datagrid-cell-check input[type=checkbox]")
										.is(":checked");
								tr
										.html(this.renderRow(target, fields, frozen,
												level, oldRow));
								tr.attr("style", rowStyle || "");
								tr.find("div.datagrid-cell-rownumber")
										.html(rowNum);
								if (isChecked) {
									tr
											.find(
													"div.datagrid-cell-check input[type=checkbox]")
											._propAttr("checked", true);
								}
								if (newid != id) {
									tr.attr("id", rowIdPrefix + "-" + (frozen ? 1 : 2)
											+ "-" + newid);
									tr.attr("node-id", newid);
								}
							}
							;
							updateRowWithFrozen.call(this, true);
							updateRowWithFrozen.call(this, false);
							$(target).treegrid("fixRowHeight", id);
						},
						deleteRow : function(target, id) {
							var opts = $.data(target, "treegrid").options;
							var tr = opts.finder.getTr(target, id);
							tr.next("tr.treegrid-tr-tree").remove();
							tr.remove();
							var pRow = del(id);
							if (pRow) {
								if (pRow.children.length == 0) {
									tr = opts.finder
											.getTr(target, pRow[opts.idField]);
									tr.next("tr.treegrid-tr-tree").remove();
									var cell = tr.children(
											"td[field=\"" + opts.treeField
													+ "\"]").children(
											"div.datagrid-cell");
									cell.find(".tree-icon").removeClass(
											"tree-folder")
											.addClass("tree-file");
									cell.find(".tree-hit").remove();
									$("<span class=\"tree-indent\"></span>")
											.prependTo(cell);
								}
							}
							function del(id) {
								var cc;
								var parentRow = $(target).treegrid("getParent", id);
								if (parentRow) {
									cc = parentRow.children;
								} else {
									cc = $(target).treegrid("getData");
								}
								for ( var i = 0; i < cc.length; i++) {
									if (cc[i][opts.idField] == id) {
										cc.splice(i, 1);
										break;
									}
								}
								return parentRow;
							}
							;
						},
						onBeforeRender : function(target, parentId, data) {
							if ($.isArray(parentId)) {
								data = {
									total : parentId.length,
									rows : parentId
								};
								parentId = null;
							}
							if (!data) {
								return false;
							}
							var treegrid = $.data(target, "treegrid");
							var opts = treegrid.options;
							if (data.length == undefined) {
								if (data.footer) {
									treegrid.footer = data.footer;
								}
								if (data.total) {
									treegrid.total = data.total;
								}
								data = this.transfer(target, parentId, data.rows);
							} else {
								function setParentForRow(dt, pid) {
									for ( var i = 0; i < dt.length; i++) {
										var row = dt[i];
										row._parentId = pid;
										if (row.children && row.children.length) {
											setParentForRow(row.children, row[opts.idField]);
										}
									}
								}
								;
								setParentForRow(data, parentId);
							}
							var row = findTreegridRow(target, parentId);
							if (row) {
								if (row.children) {
									row.children = row.children.concat(data);
								} else {
									row.children = data;
								}
							} else {
								treegrid.data = treegrid.data.concat(data);
							}
							this.sort(target, data);
							this.treeNodes = data;
							this.treeLevel = $(target).treegrid("getLevel", parentId);
						},
						sort : function(target, data) {
							var opts = $.data(target, "treegrid").options;
							if (!opts.remoteSort && opts.sortName) {
								var sorters = opts.sortName.split(",");
								var orders = opts.sortOrder.split(",");
								sortRows(data);
							}
							function sortRows(rows) {
								rows.sort(function(r1, r2) {
									var r = 0;
									for ( var i = 0; i < sorters.length; i++) {
										var sn = sorters[i];
										var so = orders[i];
										var col = $(target).treegrid(
												"getColumnOption", sn);
										var st = col.sorter
												|| function(a, b) {
													return a == b ? 0
															: (a > b ? 1 : -1);
												};
										r = st(r1[sn], r2[sn])
												* (so == "asc" ? 1 : -1);
										if (r != 0) {
											return r;
										}
									}
									return r;
								});
								for ( var i = 0; i < rows.length; i++) {
									var childrenRow = rows[i].children;
									if (childrenRow && childrenRow.length) {
										sortRows(childrenRow);
									}
								}
							}
							;
						},
						transfer : function(target, parentId, data) {
							var opts = $.data(target, "treegrid").options;
							var rows = [];
							for ( var i = 0; i < data.length; i++) {
								rows.push(data[i]);
							}
							var resultRows = [];
							for ( var i = 0; i < rows.length; i++) {
								var row = rows[i];
								if (!parentId) {
									if (!row._parentId) {
										resultRows.push(row);
										rows.splice(i, 1);
										i--;
									}
								} else {
									if (row._parentId == parentId) {
										resultRows.push(row);
										rows.splice(i, 1);
										i--;
									}
								}
							}
							var toDo = [];
							for ( var i = 0; i < resultRows.length; i++) {
								toDo.push(resultRows[i]);
							}
							while (toDo.length) {
								var node = toDo.shift();
								for ( var i = 0; i < rows.length; i++) {
									var row = rows[i];
									if (row._parentId == node[opts.idField]) {
										if (node.children) {
											node.children.push(row);
										} else {
											node.children = [ row ];
										}
										toDo.push(row);
										rows.splice(i, 1);
										i--;
									}
								}
							}
							return resultRows;
						}
					});
	$.fn.treegrid.defaults = $
			.extend(
					{},
					$.fn.datagrid.defaults,
					{
						treeField : null,
						lines : false,
						animate : false,
						singleSelect : true,
						view : defaultTreegridView,
						loader : function(queryParam, onSuccess, onError) {
							var opts = $(this).treegrid("options");
							if (!opts.url) {
								return false;
							}
							$.ajax( {
								type : opts.method,
								url : opts.url,
								data : queryParam,
								dataType : "json",
								success : function(data) {
									onSuccess(data);
								},
								error : function() {
									onError.apply(this, arguments);
								}
							});
						},
						loadFilter : function(data, parentId) {
							return data;
						},
						finder : {
							getTr : function(target, id, type, frozen) {
								type = type || "body";
								frozen = frozen || 0;
								var dc = $.data(target, "datagrid").dc;
								if (frozen == 0) {
									var opts = $.data(target, "treegrid").options;
									var tr1 = opts.finder.getTr(target, id, type,
											1);
									var tr2 = opts.finder.getTr(target, id, type,
											2);
									return tr1.add(tr2);
								} else {
									if (type == "body") {
										var tr = $("#"
												+ $.data(target, "datagrid").rowIdPrefix
												+ "-" + frozen + "-" + id);
										if (!tr.length) {
											tr = (frozen == 1 ? dc.body1
													: dc.body2)
													.find("tr[node-id=\"" + id
															+ "\"]");
										}
										return tr;
									} else {
										if (type == "footer") {
											return (frozen == 1 ? dc.footer1
													: dc.footer2)
													.find("tr[node-id=\"" + id
															+ "\"]");
										} else {
											if (type == "selected") {
												return (frozen == 1 ? dc.body1
														: dc.body2)
														.find("tr.datagrid-row-selected");
											} else {
												if (type == "highlight") {
													return (frozen == 1 ? dc.body1
															: dc.body2)
															.find("tr.datagrid-row-over");
												} else {
													if (type == "checked") {
														return (frozen == 1 ? dc.body1
																: dc.body2)
																.find("tr.datagrid-row-checked");
													} else {
														if (type == "last") {
															return (frozen == 1 ? dc.body1
																	: dc.body2)
																	.find("tr:last[node-id]");
														} else {
															if (type == "allbody") {
																return (frozen == 1 ? dc.body1
																		: dc.body2)
																		.find("tr[node-id]");
															} else {
																if (type == "allfooter") {
																	return (frozen == 1 ? dc.footer1
																			: dc.footer2)
																			.find("tr[node-id]");
																}
															}
														}
													}
												}
											}
										}
									}
								}
							},
							getRow : function(target, p) {
								var id = (typeof p == "object") ? p
										.attr("node-id") : p;
								return $(target).treegrid("find", id);
							},
							getRows : function(target) {
								return $(target).treegrid("getChildren");
							}
						},
						onBeforeLoad : function(row, param) {
						},
						onLoadSuccess : function(row, data) {
						},
						onLoadError : function() {
						},
						onBeforeCollapse : function(row) {
						},
						onCollapse : function(row) {
						},
						onBeforeExpand : function(row) {
						},
						onExpand : function(row) {
						},
						onClickRow : function(row) {
						},
						onDblClickRow : function(row) {
						},
						onClickCell : function(field, row) {
						},
						onDblClickCell : function(field, row) {
						},
						onContextMenu : function(e, row) {
						},
						onBeforeEdit : function(row) {
						},
						onAfterEdit : function(row, changes) {
						},
						onCancelEdit : function(row) {
						}
					});
})(jQuery);
//propertygrid
(function($){
	var currTarget;
	function buildGrid(target){
		var state = $.data(target, 'propertygrid');
		var opts = $.data(target, 'propertygrid').options;
		$(target).datagrid($.extend({}, opts, {
			cls:'propertygrid',
			view:(opts.showGroup ? opts.groupView : opts.view),
			onClickCell:function(index, field, value){
				if (currTarget != this){
					stopEditing(currTarget);
					currTarget = this;
				}
				var row = $(this).datagrid('getRows')[index];
				if (opts.editIndex != index && row.editor){
					var col = $(this).datagrid('getColumnOption', 'value');
					col.editor = row.editor;
					stopEditing(currTarget);
					$(this).datagrid('beginEdit', index);
					var ed = $(this).datagrid('getEditor', {index:index,field:field});
					if (!ed){
						ed = $(this).datagrid('getEditor', {index:index,field:'value'});
					}
					if (ed){
						getInputBox(ed.target).focus();
						opts.editIndex = index;
					}
				}
				opts.onClickCell.call(target, index, field, value);
			},
			loadFilter:function(data){
				stopEditing(this);
				return opts.loadFilter.call(this, data);
			}
		}));
		$(document).unbind('.propertygrid').bind('mousedown.propertygrid', function(e){
			var p = $(e.target).closest('div.datagrid-view,div.combo-panel');
			if (p.length){return;}
			stopEditing(currTarget);
			currTarget = undefined;
		});
	}
	function getInputBox(t){
		return $(t).data('textbox') ? $(t).textbox('textbox') : $(t);
	}
	function stopEditing(target){
		var t = $(target);
		if (!t.length){return}
		var opts = $.data(target, 'propertygrid').options;
		var index = opts.editIndex;
		if (index == undefined){return;}
		var editors = t.datagrid('getEditors', index);
		if (editors.length){
			$.map(editors, function(ed){
				getInputBox(ed.target).blur();
			});
			if (t.datagrid('validateRow', index)){
				t.datagrid('endEdit', index);
			} else {
				t.datagrid('cancelEdit', index);
			}
		}
		opts.editIndex = undefined;
	}
	$.fn.propertygrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.propertygrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'propertygrid');
			if (state){
				$.extend(state.options, options);
			} else {
				var opts = $.extend({}, $.fn.propertygrid.defaults, $.fn.propertygrid.parseOptions(this), options);
				opts.frozenColumns = $.extend(true, [], opts.frozenColumns);
				opts.columns = $.extend(true, [], opts.columns);
				$.data(this, 'propertygrid', {
					options: opts
				});
			}
			buildGrid(this);
		});
	}
	$.fn.propertygrid.methods = {
		options: function(jq){
			return $.data(jq[0], 'propertygrid').options;
		}
	};
	$.fn.propertygrid.parseOptions = function(target){
		return $.extend({}, $.fn.datagrid.parseOptions(target), $.parser.parseOptions(target,[{showGroup:'boolean'}]));
	};
	// the group view definition
	var groupview = $.extend({}, $.fn.datagrid.defaults.view, {
		render: function(target, container, frozen){
			var table = [];
			var groups = this.groups;
			for(var i=0; i<groups.length; i++){
				table.push(this.renderGroup.call(this, target, i, groups[i], frozen));
			}
			$(container).html(table.join(''));
		},
		renderGroup: function(target, groupIndex, group, frozen){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var fields = $(target).datagrid('getColumnFields', frozen);
			var table = [];
			table.push('<div class="datagrid-group" group-index=' + groupIndex + '>');
			table.push('<table cellspacing="0" cellpadding="0" border="0" style="height:100%"><tbody>');
			table.push('<tr>');
			if ((frozen && (opts.rownumbers || opts.frozenColumns.length)) ||
					(!frozen && !(opts.rownumbers || opts.frozenColumns.length))){
				table.push('<td style="border:0;text-align:center;width:25px"><span class="datagrid-row-expander datagrid-row-collapse" style="display:inline-block;width:16px;height:16px;cursor:pointer">&nbsp;</span></td>');
			}
			table.push('<td style="border:0;">');
			if (!frozen){
				table.push('<span class="datagrid-group-title">');
				table.push(opts.groupFormatter.call(target, group.value, group.rows));
				table.push('</span>');
			}
			table.push('</td>');
			table.push('</tr>');
			table.push('</tbody></table>');
			table.push('</div>');
			table.push('<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>');
			var index = group.startIndex;
			for(var j=0; j<group.rows.length; j++) {
				var css = opts.rowStyler ? opts.rowStyler.call(target, index, group.rows[j]) : '';
				var classValue = '';
				var styleValue = '';
				if (typeof css == 'string'){
					styleValue = css;
				} else if (css){
					classValue = css['class'] || '';
					styleValue = css['style'] || '';
				}
				var cls = 'class="datagrid-row ' + (index % 2 && opts.striped ? 'datagrid-row-alt ' : ' ') + classValue + '"';
				var style = styleValue ? 'style="' + styleValue + '"' : '';
				var rowId = state.rowIdPrefix + '-' + (frozen?1:2) + '-' + index;
				table.push('<tr id="' + rowId + '" datagrid-row-index="' + index + '" ' + cls + ' ' + style + '>');
				table.push(this.renderRow.call(this, target, fields, frozen, index, group.rows[j]));
				table.push('</tr>');
				index++;
			}
			table.push('</tbody></table>');
			return table.join('');
		},
		bindEvents: function(target){
			var state = $.data(target, 'datagrid');
			var dc = state.dc;
			var body = dc.body1.add(dc.body2);
			var clickHandler = ($.data(body[0],'events')||$._data(body[0],'events')).click[0].handler;
			body.unbind('click').bind('click', function(e){
				var tt = $(e.target);
				var expander = tt.closest('span.datagrid-row-expander');
				if (expander.length){
					var gindex = expander.closest('div.datagrid-group').attr('group-index');
					if (expander.hasClass('datagrid-row-collapse')){
						$(target).datagrid('collapseGroup', gindex);
					} else {
						$(target).datagrid('expandGroup', gindex);
					}
				} else {
					clickHandler(e);
				}
				e.stopPropagation();
			});
		},
		onBeforeRender: function(target, rows){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			initCss();
			var groups = [];
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				var group = getGroup(row[opts.groupField]);
				if (!group){
					group = {
						value: row[opts.groupField],
						rows: [row]
					};
					groups.push(group);
				} else {
					group.rows.push(row);
				}
			}
			var index = 0;
			var newRows = [];
			for(var i=0; i<groups.length; i++){
				var group = groups[i];
				group.startIndex = index;
				index += group.rows.length;
				newRows = newRows.concat(group.rows);
			}
			state.data.rows = newRows;
			this.groups = groups;
			var that = this;
			setTimeout(function(){
				that.bindEvents(target);
			},0);
			function getGroup(value){
				for(var i=0; i<groups.length; i++){
					var group = groups[i];
					if (group.value == value){
						return group;
					}
				}
				return null;
			}
			function initCss(){
				if (!$('#datagrid-group-style').length){
					$('head').append(
						'<style id="datagrid-group-style">' +
						'.datagrid-group{height:25px;overflow:hidden;font-weight:bold;border-bottom:1px solid #ccc;}' +
						'</style>'
					);
				}
			}
		}
	});
	$.extend($.fn.datagrid.methods, {
	    expandGroup:function(jq, groupIndex){
	        return jq.each(function(){
	            var view = $.data(this, 'datagrid').dc.view;
	            var group = view.find(groupIndex!=undefined ? 'div.datagrid-group[group-index="'+groupIndex+'"]' : 'div.datagrid-group');
	            var expander = group.find('span.datagrid-row-expander');
	            if (expander.hasClass('datagrid-row-expand')){
	                expander.removeClass('datagrid-row-expand').addClass('datagrid-row-collapse');
	                group.next('table').show();
	            }
	            $(this).datagrid('fixRowHeight');
	        });
	    },
	    collapseGroup:function(jq, groupIndex){
	        return jq.each(function(){
	            var view = $.data(this, 'datagrid').dc.view;
	            var group = view.find(groupIndex!=undefined ? 'div.datagrid-group[group-index="'+groupIndex+'"]' : 'div.datagrid-group');
	            var expander = group.find('span.datagrid-row-expander');
	            if (expander.hasClass('datagrid-row-collapse')){
	                expander.removeClass('datagrid-row-collapse').addClass('datagrid-row-expand');
	                group.next('table').hide();
	            }
	            $(this).datagrid('fixRowHeight');
	        });
	    }
	});
	// end of group view definition
	$.fn.propertygrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		singleSelect:true,
		remoteSort:false,
		fitColumns:true,
		loadMsg:'',
		frozenColumns:[[
		    {field:'f',width:16,resizable:false}
		]],
		columns:[[
		    {field:'name',title:'Name',width:100,sortable:true},
		    {field:'value',title:'Value',width:100,resizable:false}
		]],
		showGroup:false,
		groupView:groupview,
		groupField:'group',
		groupFormatter:function(fvalue,rows){return fvalue}
	});
})(jQuery);
//window
(function($){
	function moveWindow(target, param){
		var state = $.data(target, 'window');
		if (param){
			if (param.left != null) state.options.left = param.left;
			if (param.top != null) state.options.top = param.top;
		}
		$(target).panel('move', state.options);
		if (state.shadow){
			state.shadow.css({
				left: state.options.left,
				top: state.options.top
			});
		}
	}
	function hcenter(target, tomove){
		var opts = $.data(target, 'window').options;
		var pp = $(target).window('panel');
		var width = pp._outerWidth();
		if (opts.inline){
			var parent = pp.parent();
			opts.left = Math.ceil((parent.width() - width) / 2 + parent.scrollLeft());
		} else {
			opts.left = Math.ceil(($(window)._outerWidth() - width) / 2 + $(document).scrollLeft());
		}
		if (tomove){moveWindow(target);}
	}
	function vcenter(target, tomove){
		var opts = $.data(target, 'window').options;
		var pp = $(target).window('panel');
		var height = pp._outerHeight();
		if (opts.inline){
			var parent = pp.parent();
			opts.top = Math.ceil((parent.height() - height) / 2 + parent.scrollTop());
		} else {
			opts.top = Math.ceil(($(window)._outerHeight() - height) / 2 + $(document).scrollTop());
		}
		if (tomove){moveWindow(target);}
	}
	function create(target){
		var state = $.data(target, 'window');
		var opts = state.options;
		var win = $(target).panel($.extend({}, state.options, {
			border: false,
			doSize: true,	// size the panel, the property undefined in window component
			closed: true,	// close the panel
			cls: 'window',
			headerCls: 'window-header',
			bodyCls: 'window-body ' + (opts.noheader ? 'window-body-noheader' : ''),
			onBeforeDestroy: function(){
				if (opts.onBeforeDestroy.call(target) == false){return false;}
				if (state.shadow){state.shadow.remove();}
				if (state.mask){state.mask.remove();}
			},
			onClose: function(){
				if (state.shadow){state.shadow.hide();}
				if (state.mask){state.mask.hide();}
				opts.onClose.call(target);
			},
			onOpen: function(){
				if (state.mask){
					state.mask.css({
						display:'block',
						zIndex: $.fn.window.defaults.zIndex++
					});
				}
				if (state.shadow){
					state.shadow.css({
						display:'block',
						zIndex: $.fn.window.defaults.zIndex++,
						left: opts.left,
						top: opts.top,
						width: state.window._outerWidth(),
						height: state.window._outerHeight()
					});
				}
				state.window.css('z-index', $.fn.window.defaults.zIndex++);
				opts.onOpen.call(target);
			},
			onResize: function(width, height){
				var popts = $(this).panel('options');
				$.extend(opts, {
					width: popts.width,
					height: popts.height,
					left: popts.left,
					top: popts.top
				});
				if (state.shadow){
					state.shadow.css({
						left: opts.left,
						top: opts.top,
						width: state.window._outerWidth(),
						height: state.window._outerHeight()
					});
				}
				opts.onResize.call(target, width, height);
			},
			onMinimize: function(){
				if (state.shadow){state.shadow.hide();}
				if (state.mask){state.mask.hide();}
				state.options.onMinimize.call(target);
			},
			onBeforeCollapse: function(){
				if (opts.onBeforeCollapse.call(target) == false){return false;}
				if (state.shadow){state.shadow.hide();}
			},
			onExpand: function(){
				if (state.shadow){state.shadow.show();}
				opts.onExpand.call(target);
			}
		}));
		state.window = win.panel('panel');
		// create mask
		if (state.mask){state.mask.remove();}
		if (opts.modal == true){
			state.mask = $('<div class="window-mask"></div>').insertAfter(state.window);
			state.mask.css({
				width: (opts.inline ? state.mask.parent().width() : getPageArea().width),
				height: (opts.inline ? state.mask.parent().height() : getPageArea().height),
				display: 'none'
			});
		}
		// create shadow
		if (state.shadow){state.shadow.remove();}
		if (opts.shadow == true){
			state.shadow = $('<div class="window-shadow"></div>').insertAfter(state.window);
			state.shadow.css({
				display: 'none'
			});
		}
		// if require center the window
		if (opts.left == null){hcenter(target);}
		if (opts.top == null){vcenter(target);}
		moveWindow(target);
		if (!opts.closed){
			win.window('open');	// open the window
		}
	}
	function setProperties(target){
		var state = $.data(target, 'window');
		state.window.draggable({
			handle: '>div.panel-header>div.panel-title',
			disabled: state.options.draggable == false,
			onStartDrag: function(e){
				if (state.mask) state.mask.css('z-index', $.fn.window.defaults.zIndex++);
				if (state.shadow) state.shadow.css('z-index', $.fn.window.defaults.zIndex++);
				state.window.css('z-index', $.fn.window.defaults.zIndex++);
				if (!state.proxy){
					state.proxy = $('<div class="window-proxy"></div>').insertAfter(state.window);
				}
				state.proxy.css({
					display:'none',
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top
				});
				state.proxy._outerWidth(state.window._outerWidth());
				state.proxy._outerHeight(state.window._outerHeight());
				setTimeout(function(){
					if (state.proxy) state.proxy.show();
				}, 500);
			},
			onDrag: function(e){
				state.proxy.css({
					display:'block',
					left: e.data.left,
					top: e.data.top
				});
				return false;
			},
			onStopDrag: function(e){
				state.options.left = e.data.left;
				state.options.top = e.data.top;
				$(target).window('move');
				state.proxy.remove();
				state.proxy = null;
			}
		});
		state.window.resizable({
			disabled: state.options.resizable == false,
			onStartResize:function(e){
				if (state.pmask){state.pmask.remove();}
				state.pmask = $('<div class="window-proxy-mask"></div>').insertAfter(state.window);
				state.pmask.css({
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top,
					width: state.window._outerWidth(),
					height: state.window._outerHeight()
				});
				if (state.proxy){state.proxy.remove();}
				state.proxy = $('<div class="window-proxy"></div>').insertAfter(state.window);
				state.proxy.css({
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top
				});
				state.proxy._outerWidth(e.data.width)._outerHeight(e.data.height);
			},
			onResize: function(e){
				state.proxy.css({
					left: e.data.left,
					top: e.data.top
				});
				state.proxy._outerWidth(e.data.width);
				state.proxy._outerHeight(e.data.height);
				return false;
			},
			onStopResize: function(e){
				$(target).window('resize', e.data);
				state.pmask.remove();
				state.pmask = null;
				state.proxy.remove();
				state.proxy = null;
			}
		});
	}
	function getPageArea() {
		if (document.compatMode == 'BackCompat') {
			return {
				width: Math.max(document.body.scrollWidth, document.body.clientWidth),
				height: Math.max(document.body.scrollHeight, document.body.clientHeight)
			}
		} else {
			return {
				width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
				height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
			}
		}
	}
	// when window resize, reset the width and height of the window's mask
	$(window).resize(function(){
		$('body>div.window-mask').css({
			width: $(window)._outerWidth(),
			height: $(window)._outerHeight()
		});
		setTimeout(function(){
			$('body>div.window-mask').css({
				width: getPageArea().width,
				height: getPageArea().height
			});
		}, 50);
	});
	$.fn.window = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.window.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.panel(options, param);
			}
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'window');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'window', {
					options: $.extend({}, $.fn.window.defaults, $.fn.window.parseOptions(this), options)
				});
				if (!state.options.inline){
//					$(this).appendTo('body');
					document.body.appendChild(this);
				}
			}
			create(this);
			setProperties(this);
		});
	};
	$.fn.window.methods = {
		options: function(jq){
			var popts = jq.panel('options');
			var wopts = $.data(jq[0], 'window').options;
			return $.extend(wopts, {
				closed: popts.closed,
				collapsed: popts.collapsed,
				minimized: popts.minimized,
				maximized: popts.maximized
			});
		},
		window: function(jq){
			return $.data(jq[0], 'window').window;
		},
		move: function(jq, param){
			return jq.each(function(){
				moveWindow(this, param);
			});
		},
		hcenter: function(jq){
			return jq.each(function(){
				hcenter(this, true);
			});
		},
		vcenter: function(jq){
			return jq.each(function(){
				vcenter(this, true);
			});
		},
		center: function(jq){
			return jq.each(function(){
				hcenter(this);
				vcenter(this);
				moveWindow(this);
			});
		}
	};
	$.fn.window.parseOptions = function(target){
		return $.extend({}, $.fn.panel.parseOptions(target), $.parser.parseOptions(target, [
			{draggable:'boolean',resizable:'boolean',shadow:'boolean',modal:'boolean',inline:'boolean'}
		]));
	};
	// Inherited from $.fn.panel.defaults
	$.fn.window.defaults = $.extend({}, $.fn.panel.defaults, {
		zIndex: 9000,
		draggable: true,
		resizable: true,
		shadow: true,
		modal: false,
		inline: false,	// true to stay inside its parent, false to go on top of all elements
		// window's property which difference from panel
		title: 'New Window',
		collapsible: true,
		minimizable: true,
		maximizable: true,
		closable: true,
		closed: false
	});
})(jQuery);
//dialog
(function($) {
	function buildDialog(target) {
		var opts = $.data(target, "dialog").options;
		opts.inited = false;
		$(target).window($.extend( {}, opts, {
			onResize : function(w, h) {
				if (opts.inited) {
					resizeDialog(this);
					opts.onResize.call(this, w, h);
				}
			}
		}));
		var win = $(target).window("window");
		if (opts.toolbar) {
			if ($.isArray(opts.toolbar)) {
				$(target).siblings("div.dialog-toolbar").remove();
				var tbcontainer = $(
						"<div class=\"dialog-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>")
						.appendTo(win);
				var tr = tbcontainer.find("tr");
				for ( var i = 0; i < opts.toolbar.length; i++) {
					var tb = opts.toolbar[i];
					if (tb == "-") {
						$(
								"<td><div class=\"dialog-tool-separator\"></div></td>")
								.appendTo(tr);
					} else {
						var td = $("<td></td>").appendTo(tr);
						var tbb = $("<a href=\"javascript:void(0)\"></a>")
								.appendTo(td);
						tbb[0].onclick = eval(tb.handler || function() {
						});
						tbb.linkbutton($.extend( {}, tb, {
							plain : true
						}));
					}
				}
			} else {
				$(opts.toolbar).addClass("dialog-toolbar").appendTo(win);
				$(opts.toolbar).show();
			}
		} else {
			$(target).siblings("div.dialog-toolbar").remove();
		}
		if (opts.buttons) {
			if ($.isArray(opts.buttons)) {
				$(target).siblings("div.dialog-button").remove();
				var btcontainer = $("<div class=\"dialog-button\"></div>").appendTo(win);
				for ( var i = 0; i < opts.buttons.length; i++) {
					var p = opts.buttons[i];
					var btn = $("<a href=\"javascript:void(0)\"></a>").appendTo(
							btcontainer);
					if (p.handler) {
						btn[0].onclick = p.handler;
					}
					btn.linkbutton(p);
				}
			} else {
				$(opts.buttons).addClass("dialog-button").appendTo(win);
				$(opts.buttons).show();
			}
		} else {
			$(target).siblings("div.dialog-button").remove();
		}
		opts.inited = true;
		win.show();
		$(target).window("resize");
		if (opts.closed) {
			win.hide();
		}
	}
	;
	function resizeDialog(target) {
		var t = $(target);
		var opts = t.dialog("options");
		var noheader = opts.noheader;
		var tb = t.siblings(".dialog-toolbar");
		var bb = t.siblings(".dialog-button");
		tb.insertBefore(target).css( {
			position : "relative",
			borderTopWidth : (noheader ? 1 : 0),
			top : (noheader ? tb.length : 0)
		});
		bb.insertAfter(target).css( {
			position : "relative",
			top : -1
		});
		if (!isNaN(parseInt(opts.height))) {
			t._outerHeight(t._outerHeight() - tb._outerHeight()
					- bb._outerHeight());
		}
		tb.add(bb)._outerWidth(t._outerWidth());
		var shadow = $.data(target, "window").shadow;
		if (shadow) {
			var cc = t.panel("panel");
			shadow.css( {
				width : cc._outerWidth(),
				height : cc._outerHeight()
			});
		}
	}
	;
	$.fn.dialog = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.dialog.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.window(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "dialog");
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, "dialog", {
					options : $.extend( {}, $.fn.dialog.defaults, $.fn.dialog
							.parseOptions(this), options)
				});
			}
			buildDialog(this);
		});
	};
	$.fn.dialog.methods = {
		options : function(jq) {
			var opts = $.data(jq[0], "dialog").options;
			var popts = jq.panel("options");
			$.extend(opts, {
				width : popts.width,
				height : popts.height,
				left : popts.left,
				top : popts.top,
				closed : popts.closed,
				collapsed : popts.collapsed,
				minimized : popts.minimized,
				maximized : popts.maximized
			});
			return opts;
		},
		dialog : function(jq) {
			return jq.window("window");
		}
	};
	$.fn.dialog.parseOptions = function(target) {
		return $.extend( {}, $.fn.window.parseOptions(target), $.parser
				.parseOptions(target, [ "toolbar", "buttons" ]));
	};
	$.fn.dialog.defaults = $.extend( {}, $.fn.window.defaults, {
		title : "New Dialog",
		collapsible : false,
		minimizable : false,
		maximizable : false,
		resizable : false,
		toolbar : null,
		buttons : null
	});
})(jQuery);
//messager
(function($) {
	function openWindow(target, showType, showSpeed, timeout) {
		var win = $(target).window("window");
		if (!win) {
			return;
		}
		switch (showType) {
		case null:
			win.show();
			break;
		case "slide":
			win.slideDown(showSpeed);
			break;
		case "fade":
			win.fadeIn(showSpeed);
			break;
		case "show":
			win.show(showSpeed);
			break;
		}
		var timer = null;
		if (timeout > 0) {
			timer = setTimeout(function() {
				closeWindow(target, showType, showSpeed);
			}, timeout);
		}
		win.hover(function() {
			if (timer) {
				clearTimeout(timer);
			}
		}, function() {
			if (timeout > 0) {
				timer = setTimeout(function() {
					closeWindow(target, showType, showSpeed);
				}, timeout);
			}
		});
	}
	;
	function closeWindow(target, showType, showSpeed) {
		if (target.locked == true) {
			return;
		}
		target.locked = true;
		var win = $(target).window("window");
		if (!win) {
			return;
		}
		switch (showType) {
		case null:
			win.hide();
			break;
		case "slide":
			win.slideUp(showSpeed);
			break;
		case "fade":
			win.fadeOut(showSpeed);
			break;
		case "show":
			win.hide(showSpeed);
			break;
		}
		setTimeout(function() {
			$(target).window("destroy");
		}, showSpeed);
	}
	;
	function showMessage(options) {
		var opts = $.extend( {}, $.fn.window.defaults, {
			collapsible : false,
			minimizable : false,
			maximizable : false,
			shadow : false,
			draggable : false,
			resizable : false,
			closed : true,
			style : {
				left : "",
				top : "",
				right : 0,
				zIndex : $.fn.window.defaults.zIndex++,
				bottom : -document.body.scrollTop
						- document.documentElement.scrollTop
			},
			onBeforeOpen : function() {
				openWindow(this, opts.showType, opts.showSpeed, opts.timeout);
				return false;
			},
			onBeforeClose : function() {
				closeWindow(this, opts.showType, opts.showSpeed);
				return false;
			}
		}, {
			title : "",
			width : 250,
			height : 100,
			showType : "slide",
			showSpeed : 600,
			msg : "",
			timeout : 4000
		}, options);
		opts.style.zIndex = $.fn.window.defaults.zIndex++;
		var win = $("<div class=\"messager-body\"></div>").html(opts.msg)
				.appendTo("body");
		win.window(opts);
		win.window("window").css(opts.style);
		win.window("open");
		return win;
	}
	;
	function openWindowWithButton(title, msgContent, btns) {
		var win = $("<div class=\"messager-body\"></div>").appendTo("body");
		win.append(msgContent);
		if (btns) {
			var tb = $("<div class=\"messager-button\"></div>").appendTo(win);
			for ( var btn in btns) {
				$("<a></a>").attr("href", "javascript:void(0)").text(btn).css(
						"margin-left", 10).bind("click", eval(btns[btn]))
						.appendTo(tb).linkbutton();
			}
		}
		win.window( {
			title : title,
			noheader : (title ? false : true),
			width : 300,
			height : "auto",
			modal : true,
			collapsible : false,
			minimizable : false,
			maximizable : false,
			resizable : false,
			onClose : function() {
				setTimeout(function() {
					win.window("destroy");
				}, 100);
			}
		});
		win.window("window").addClass("messager-window");
		win.children("div.messager-button").children("a:first").focus();
		return win;
	}
	;
	$.messager = {
		show : function(options) {
			return showMessage(options);
		},
		alert : function(title, msg, icon, fn) {
			var msgContent = "<div>" + msg + "</div>";
			switch (icon) {
			case "error":
				msgContent = "<div class=\"messager-icon messager-error\"></div>"
						+ msgContent;
				break;
			case "info":
				msgContent = "<div class=\"messager-icon messager-info\"></div>" + msgContent;
				break;
			case "question":
				msgContent = "<div class=\"messager-icon messager-question\"></div>"
						+ msgContent;
				break;
			case "warning":
				msgContent = "<div class=\"messager-icon messager-warning\"></div>"
						+ msgContent;
				break;
			}
			msgContent += "<div style=\"clear:both;\"/>";
			var btns = {};
			btns[$.messager.defaults.ok] = function() {
				win.window("close");
				if (fn) {
					fn();
					return false;
				}
			};
			var win = openWindowWithButton(title, msgContent, btns);
			return win;
		},
		confirm : function(title, msg, fn) {
			var msgContent = "<div class=\"messager-icon messager-question\"></div>"
					+ "<div>" + msg + "</div>" + "<div style=\"clear:both;\"/>";
			var btns = {};
			btns[$.messager.defaults.ok] = function() {
				win.window("close");
				if (fn) {
					fn(true);
					return false;
				}
			};
			btns[$.messager.defaults.cancel] = function() {
				win.window("close");
				if (fn) {
					fn(false);
					return false;
				}
			};
			var win = openWindowWithButton(title, msgContent, btns);
			return win;
		},
		prompt : function(title, msg, fn) {
			var msgContent = "<div class=\"messager-icon messager-question\"></div>"
					+ "<div>"
					+ msg
					+ "</div>"
					+ "<br/>"
					+ "<div style=\"clear:both;\"/>"
					+ "<div><input class=\"messager-input\" type=\"text\"/></div>";
			var btns = {};
			btns[$.messager.defaults.ok] = function() {
				win.window("close");
				if (fn) {
					fn($(".messager-input", win).val());
					return false;
				}
			};
			btns[$.messager.defaults.cancel] = function() {
				win.window("close");
				if (fn) {
					fn();
					return false;
				}
			};
			var win = openWindowWithButton(title, msgContent, btns);
			win.children("input.messager-input").focus();
			return win;
		},
		progress : function(param) {
			var methods = {
				bar : function() {
					return $("body>div.messager-window").find(
							"div.messager-p-bar");
				},
				close : function() {
					var win = $("body>div.messager-window>div.messager-body:has(div.messager-progress)");
					if (win.length) {
						win.window("close");
					}
				}
			};
			if (typeof param == "string") {
				var method = methods[param];
				return method();
			}
			var opts = $.extend( {
				title : "",
				msg : "",
				text : undefined,
				interval : 300
			}, param || {});
			var msgContent = "<div class=\"messager-progress\"><div class=\"messager-p-msg\"></div><div class=\"messager-p-bar\"></div></div>";
			var win = openWindowWithButton(opts.title, msgContent, null);
			win.find("div.messager-p-msg").html(opts.msg);
			var bar = win.find("div.messager-p-bar");
			bar.progressbar( {
				text : opts.text
			});
			win.window( {
				closable : false,
				onClose : function() {
					if (this.timer) {
						clearInterval(this.timer);
					}
					$(this).window("destroy");
				}
			});
			if (opts.interval) {
				win[0].timer = setInterval(function() {
					var v = bar.progressbar("getValue");
					v += 10;
					if (v > 100) {
						v = 0;
					}
					bar.progressbar("setValue", v);
				}, opts.interval);
			}
			return win;
		}
	};
	$.messager.defaults = {
		ok : "Ok",
		cancel : "Cancel"
	};
})(jQuery);
//layout
(function($){
	var resizing=false;
	function setSize(container,size){
		var opts=$.data(container,"layout").options;
		var panels=$.data(container,"layout").panels;
		var cc=$(container);
		if(size){
			$.extend(opts,{width:size.width,height:size.height});
		}
		if(container.tagName.toLowerCase()=="body"){
			opts.fit=true;
			cc._size(opts,$("body"))._size("clear");
		}else{
			cc._size(opts);
		}
		var cpos={
			top:0,
			left:0,
			width:cc.width(),
			height:cc.height()
		};
		setVerticalSize(isVisible(panels.expandNorth)?panels.expandNorth:panels.north,"n");
		setVerticalSize(isVisible(panels.expandSouth)?panels.expandSouth:panels.south,"s");
		setHorizontalSize(isVisible(panels.expandEast)?panels.expandEast:panels.east,"e");
		setHorizontalSize(isVisible(panels.expandWest)?panels.expandWest:panels.west,"w");
		panels.center.panel("resize",cpos);
		function setVerticalSize(pp,location){
			if(!pp.length||!isVisible(pp)){
				return;
			}
			var panelOpts=pp.panel("options");
			pp.panel("resize",{
				width:cc.width(),
				height:panelOpts.height
			});
			var panelHeight=pp.panel("panel").outerHeight();
			pp.panel("move",{
				left:0,
				top:(location=="n"?0:cc.height()-panelHeight)
			});
			cpos.height-=panelHeight;
			if(location=="n"){
				cpos.top+=panelHeight;
				if(!panelOpts.split&&panelOpts.border){
					cpos.top--;
				}
			}
			if(!panelOpts.split&&panelOpts.border){
				cpos.height++;
			}
		};
		function setHorizontalSize(pp,location){
			if(!pp.length||!isVisible(pp)){
				return;
			}
			var panelOpts=pp.panel("options");
			pp.panel("resize",{
				width:panelOpts.width,
				height:cpos.height
			});
			var panelWidth=pp.panel("panel").outerWidth();
			pp.panel("move",{
				left:(location=="e"?cc.width()-panelWidth:0),
				top:cpos.top
			});
			cpos.width-=panelWidth;
			if(location=="w"){
				cpos.left+=panelWidth;
				if(!panelOpts.split&&panelOpts.border){
					cpos.left--;
				}
			}
			if(!panelOpts.split&&panelOpts.border){
				cpos.width++;
			}
		};
	};
	function init(container){
		var cc=$(container);
		cc.addClass("layout");
		function createPanels(cc){
			cc.children("div").each(function(){
				var panelOpts=$.fn.layout.parsePanelOptions(this);
				if("north,south,east,west,center".indexOf(panelOpts.region)>=0){
					createPanel(container,panelOpts,this);
				}
			});
		};
		cc.children("form").length?createPanels(cc.children("form")):createPanels(cc);
		cc.append("<div class=\"layout-split-proxy-h\"></div><div class=\"layout-split-proxy-v\"></div>");
		cc.bind("_resize",function(e,width){
			if($(this).hasClass("mwsmartui-fluid")||width){
				setSize(container);
			}
			return false;
		});
	};
	function createPanel(container,panelOpts,el){
		panelOpts.region=panelOpts.region||"center";
		var panels=$.data(container,"layout").panels;
		var cc=$(container);
		var dir=panelOpts.region;
		if(panels[dir].length){
			return;
		}
		var pp=$(el);
		if(!pp.length){
			pp=$("<div></div>").appendTo(cc);
		}
		var ppOpts=$.extend({},$.fn.layout.paneldefaults,
			{
				width:(pp.length?parseInt(pp[0].style.width)||pp.outerWidth():"auto"),
				height:(pp.length?parseInt(pp[0].style.height)||pp.outerHeight():"auto"),
				doSize:false,
				collapsible:true,
				cls:("layout-panel layout-panel-"+dir),
				bodyCls:"layout-body",
				onOpen:function(){
					var tools=$(this).panel("header").children("div.panel-tool");
					tools.children("a.panel-tool-collapse").hide();
					var dirs={
						north:"up",
						south:"down",
						east:"right",
						west:"left"
					};
					if(!dirs[dir]){
						return;
					}
					var btnCls="layout-button-"+dirs[dir];
					var t=tools.children("a."+btnCls);
					if(!t.length){
						t=$("<a href=\"javascript:void(0)\"></a>").addClass(btnCls).appendTo(tools);
						t.bind("click",{dir:dir},function(e){
							collapsePanel(container,e.data.dir);
							return false;
						});
					}
					$(this).panel("options").collapsible?t.show():t.hide();
				}
			},panelOpts);
		pp.panel(ppOpts);
		panels[dir]=pp;
		if(pp.panel("options").split){
			var panel=pp.panel("panel");
			panel.addClass("layout-split-"+dir);
			var handles="";
			if(dir=="north"){
				handles="s";
			}
			if(dir=="south"){
				handles="n";
			}
			if(dir=="east"){
				handles="w";
			}
			if(dir=="west"){
				handles="e";
			}
			panel.resizable($.extend({},
				{
					handles:handles,
					onStartResize:function(e){
						resizing=true;
						if(dir=="north"||dir=="south"){
							var proxy=$(">div.layout-split-proxy-v",container);
						}else{
							var proxy=$(">div.layout-split-proxy-h",container);
						}
						var top=0,_22=0,_23=0,_24=0;
						var pos={display:"block"};
						if(dir=="north"){
							pos.top=parseInt(panel.css("top"))+panel.outerHeight()-proxy.height();
							pos.left=parseInt(panel.css("left"));
							pos.width=panel.outerWidth();
							pos.height=proxy.height();
						}else{
							if(dir=="south"){
								pos.top=parseInt(panel.css("top"));
								pos.left=parseInt(panel.css("left"));
								pos.width=panel.outerWidth();
								pos.height=proxy.height();
							}else{
								if(dir=="east"){
									pos.top=parseInt(panel.css("top"))||0;
									pos.left=parseInt(panel.css("left"))||0;
									pos.width=proxy.width();
									pos.height=panel.outerHeight();
								}else{
									if(dir=="west"){
										pos.top=parseInt(panel.css("top"))||0;
										pos.left=panel.outerWidth()-proxy.width();
										pos.width=proxy.width();
										pos.height=panel.outerHeight();
									}
								}
							}
						}
						proxy.css(pos);
						$("<div class=\"layout-mask\"></div>").css({left:0,top:0,width:cc.width(),height:cc.height()}).appendTo(cc);
					},
					onResize:function(e){
						if(dir=="north"||dir=="south"){
							var proxy=$(">div.layout-split-proxy-v",container);
							proxy.css("top",e.pageY-$(container).offset().top-proxy.height()/2);
						}else{
							var proxy=$(">div.layout-split-proxy-h",container);
							proxy.css("left",e.pageX-$(container).offset().left-proxy.width()/2);
						}
						return false;
					},
					onStopResize:function(e){
						cc.children("div.layout-split-proxy-v,div.layout-split-proxy-h").hide();
						pp.panel("resize",e.data);
						setSize(container);
						resizing=false;
						cc.find(">div.layout-mask").remove();
					}
				},panelOpts));
		}
	};
	function removePanel(container,dir){
		var panels=$.data(container,"layout").panels;
		if(panels[dir].length){
			panels[dir].panel("destroy");
			panels[dir]=$();
			var expandDir="expand"+dir.substring(0,1).toUpperCase()+dir.substring(1);
			if(panels[expandDir]){
				panels[expandDir].panel("destroy");
				panels[expandDir]=undefined;
			}
		}
	};
	function collapsePanel(container,dir,duration){
		if(duration==undefined){
			duration="normal";
		}
		var panels=$.data(container,"layout").panels;
		var p=panels[dir];
		var panelOpts=p.panel("options");
		if(panelOpts.onBeforeCollapse.call(p)==false){
			return;
		}
		var expandDir="expand"+dir.substring(0,1).toUpperCase()+dir.substring(1);
		if(!panels[expandDir]){
			panels[expandDir]=createExpandPanel(dir);
			panels[expandDir].panel("panel").bind("click",function(){
				p.panel("expand",false).panel("open");
				var animateParams=initCollapsAnimateParams();
				p.panel("resize",animateParams.collapse);
				p.panel("panel").animate(animateParams.expand,function(){
					$(this).unbind(".layout").bind("mouseleave.layout",{region:dir},function(e){
						if(resizing==true){
							return;
						}
						if($("body>div.combo-p>div.combo-panel:visible").length){
							return;
						}
						collapsePanel(container,e.data.region);
					});
				});
				return false;
			});
		}
		var animateParams=initCollapsAnimateParams();
		if(!isVisible(panels[expandDir])){
			panels.center.panel("resize",animateParams.resizeC);
		}
		p.panel("panel").animate(animateParams.collapse,duration,function(){
			p.panel("collapse",false).panel("close");
			panels[expandDir].panel("open").panel("resize",animateParams.expandP);
			$(this).unbind(".layout");
		});
		function createExpandPanel(dir){
			var iconCls;
			if(dir=="east"){
				iconCls="layout-button-left";
			}else{
				if(dir=="west"){
					iconCls="layout-button-right";
				}else{
					if(dir=="north"){
					iconCls="layout-button-down";
					}else{
						if(dir=="south"){
							iconCls="layout-button-up";
						}
					}
				}
			}
			var p=$("<div></div>").appendTo(container);
			p.panel($.extend({},$.fn.layout.paneldefaults,
				{
					cls:("layout-expand layout-expand-"+dir),
					title:"&nbsp;",
					closed:true,
					minWidth:0,
					minHeight:0,
					doSize:false,
					tools:[
						{
							iconCls:iconCls,
							handler:function(){
								expandPanel(container,dir);
								return false;
							}
						}
					]
				}));
			p.panel("panel").hover(function(){
				$(this).addClass("layout-expand-over");
			},
			function(){
				$(this).removeClass("layout-expand-over");
			});
			return p;
		};
		function initCollapsAnimateParams(){
			var cc=$(container);
			var centerOpts=panels.center.panel("options");
			var destSize=panelOpts.collapsedSize;
			if(dir=="east"){
				var currentSize=p.panel("panel")._outerWidth();
				var centerSize=centerOpts.width+currentSize-destSize;
				if(panelOpts.split||!panelOpts.border){
					centerSize++;
				}
				return {
						resizeC:{
							width:centerSize
						},
						expand:{
							left:cc.width()-currentSize
						},
						expandP:{
							top:centerOpts.top,
							left:cc.width()-destSize,
							width:destSize,
							height:centerOpts.height
						},
						collapse:{
							left:cc.width(),
							top:centerOpts.top,
							height:centerOpts.height
						}
					};
			}else{
				if(dir=="west"){
					var currentSize=p.panel("panel")._outerWidth();
					var centerSize=centerOpts.width+currentSize-destSize;
					if(panelOpts.split||!panelOpts.border){
						centerSize++;
					}
					return {
							resizeC:{
								width:centerSize,
								left:destSize-1
							},
							expand:{
								left:0
							},
							expandP:{
								left:0,
								top:centerOpts.top,
								width:destSize,
								height:centerOpts.height
							},
							collapse:{
								left:-currentSize,
								top:centerOpts.top,
								height:centerOpts.height
							}
						};
				}else{
					if(dir=="north"){
						var currentSize=p.panel("panel")._outerHeight();
						var hh=centerOpts.height;
						if(!isVisible(panels.expandNorth)){
							hh+=currentSize-destSize+((panelOpts.split||!panelOpts.border)?1:0);
						}
						panels.east.add(panels.west).add(panels.expandEast).add(panels.expandWest).panel("resize",{
							top:destSize-1,
							height:hh
						});
						return {
								resizeC:{
									top:destSize-1,
									height:hh
								},
								expand:{
									top:0
								},
								expandP:{
									top:0,
									left:0,
									width:cc.width(),
									height:destSize
								},
								collapse:{
									top:-currentSize,
									width:cc.width()
								}
							};
					}else{
						if(dir=="south"){
							var currentSize=p.panel("panel")._outerHeight();
							var hh=centerOpts.height;
							if(!isVisible(panels.expandSouth)){
								hh+=currentSize-destSize+((panelOpts.split||!panelOpts.border)?1:0);
							}
							panels.east.add(panels.west).add(panels.expandEast).add(panels.expandWest).panel("resize",{height:hh});
							return {
									resizeC:{
										height:hh
									},
									expand:{
										top:cc.height()-currentSize
									},
									expandP:{
										top:cc.height()-destSize,
										left:0,
										width:cc.width(),
										height:destSize
									},
									collapse:{
										top:cc.height(),
										width:cc.width()
									}
								};
						}
					}
				}
			}
		};
	};
	function expandPanel(container,dir){
		var panels=$.data(container,"layout").panels;
		var p=panels[dir];
		var panelOpts=p.panel("options");
		if(panelOpts.onBeforeExpand.call(p)==false){
			return;
		}
		var expandDir="expand"+dir.substring(0,1).toUpperCase()+dir.substring(1);
		if(panels[expandDir]){
			panels[expandDir].panel("close");
			p.panel("panel").stop(true,true);
			p.panel("expand",false).panel("open");
			var animateParams=initExpandAnimateParams();
			p.panel("resize",animateParams.collapse);
			p.panel("panel").animate(animateParams.expand,function(){
				setSize(container);
			});
		}
		function initExpandAnimateParams(){
			var cc=$(container);
			var centerOpts=panels.center.panel("options");
			if(dir=="east"&&panels.expandEast){
				return {
						collapse:{
							left:cc.width(),
							top:centerOpts.top,
							height:centerOpts.height
						},
						expand:{
							left:cc.width()-p.panel("panel")._outerWidth()
						}
					};
			}else{
				if(dir=="west"&&panels.expandWest){
					return {
							collapse:{
								left:-p.panel("panel")._outerWidth(),
								top:centerOpts.top,
								height:centerOpts.height
							},
							expand:{
								left:0
							}
						};
				}else{
					if(dir=="north"&&panels.expandNorth){
						return {
								collapse:{
									top:-p.panel("panel")._outerHeight(),
									width:cc.width()
								},
								expand:{
									top:0
								}
							};
					}else{
						if(dir=="south"&&panels.expandSouth){
							return {
									collapse:{
										top:cc.height(),
										width:cc.width()
									},
									expand:{
										top:cc.height()-p.panel("panel")._outerHeight()
									}
								};
						}
					}
				}
			}
		};
	};
	function isVisible(pp){
		if(!pp){
			return false;
		}
		if(pp.length){
			return pp.panel("panel").is(":visible");
		}else{
			return false;
		}
	};
	function collapsePanels(container){
		var panels=$.data(container,"layout").panels;
		if(panels.east.length&&panels.east.panel("options").collapsed){
			collapsePanel(container,"east",0);
		}
		if(panels.west.length&&panels.west.panel("options").collapsed){
			collapsePanel(container,"west",0);
		}
		if(panels.north.length&&panels.north.panel("options").collapsed){
			collapsePanel(container,"north",0);
		}
		if(panels.south.length&&panels.south.panel("options").collapsed){
			collapsePanel(container,"south",0);
		}
	};
	$.fn.layout=function(options,param){
		if(typeof options=="string"){
			return $.fn.layout.methods[options](this,param);
		}
		options=options||{};
		return this.each(function(){
			var state=$.data(this,"layout");
			if(state){
				$.extend(state.options,options);
			}else{
				var opts=$.extend({},$.fn.layout.defaults,$.fn.layout.parseOptions(this),options);
				$.data(this,"layout",
					{
						options:opts,
						panels:{
							center:$(),
							north:$(),
							south:$(),
							east:$(),
							west:$()
						}
					});
				init(this);
			}
			setSize(this);
			collapsePanels(this);
		});
	};
	$.fn.layout.methods={
		resize:function(jq,size){
			return jq.each(function(){
				setSize(this,size);
			});
		},
		panel:function(jq,dir){
			return $.data(jq[0],"layout").panels[dir];
		},
		collapse:function(jq,dir){
			return jq.each(function(){
				collapsePanel(this,dir);
			});
		},
		expand:function(jq,dir){
			return jq.each(function(){
				expandPanel(this,dir);
			});
		},
		add:function(jq,panelOpts){
			return jq.each(function(){
				createPanel(this,panelOpts);
				setSize(this);
				if($(this).layout("panel",panelOpts.region).panel("options").collapsed){
					collapsePanel(this,panelOpts.region,0);
				}
			});
		},
		remove:function(jq,dir){
			return jq.each(function(){
				removePanel(this,dir);
				setSize(this);
			});
		}};
	$.fn.layout.parseOptions=function(target){
		return $.extend({},$.parser.parseOptions(target,[{fit:"boolean"}]));
	};
	$.fn.layout.defaults={fit:false};
	$.fn.layout.parsePanelOptions=function(target){
		var t=$(target);
		return $.extend({},$.fn.panel.parseOptions(target),$.parser.parseOptions(target,["region",
			{
				split:"boolean",
				collpasedSize:"number",
				minWidth:"number",
				minHeight:"number",
				maxWidth:"number",
				maxHeight:"number"
			}]));
	};
	$.fn.layout.paneldefaults=$.extend({},$.fn.panel.defaults,{
		region:null,
		split:false,
		collapsedSize:28,
		minWidth:10,
		minHeight:10,
		maxWidth:10000,
		maxHeight:10000
	});
})(jQuery);
//form
(function($){
	function ajaxSubmit(target, options){
		var opts = $.data(target, 'form').options;
		$.extend(opts, options||{});
		var param = $.extend({}, opts.queryParams);
		if (opts.onSubmit.call(target, param) == false){return;}
		var frameId = 'mwsmartui_frame_' + (new Date().getTime());
		var frame = $('<iframe id='+frameId+' name='+frameId+'></iframe>').appendTo('body')
		frame.attr('src', window.ActiveXObject ? 'javascript:false' : 'about:blank');
//		frame.attr('src','about:blank');
		frame.css({
			position:'absolute',
			top:-1000,
			left:-1000
		});
		frame.bind('load', cb);
		submit(param);
		function submit(param){
			var form = $(target);
			if (opts.url){
				form.attr('action', opts.url);
			}
			var t = form.attr('target'), a = form.attr('action');
			form.attr('target', frameId);
			var paramFields = $();
			try {
				for(var n in param){
					var field = $('<input type="hidden" name="' + n + '">').val(param[n]).appendTo(form);
					paramFields = paramFields.add(field);
				}
				checkState();
				form[0].submit();
			} finally {
				form.attr('action', a);
				t ? form.attr('target', t) : form.removeAttr('target');
				paramFields.remove();
			}
		}
		function checkState(){
			var f = $('#'+frameId);
			if (!f.length){return}
			try{
				var s = f.contents()[0].readyState;
				if (s && s.toLowerCase() == 'uninitialized'){
					setTimeout(checkState, 100);
				}
			} catch(e){
				cb();
			}
		}
		var checkCount = 10;
		function cb(){
			var f = $('#'+frameId);
			if (!f.length){return}
			f.unbind();
			var data = '';
			try{
				var body = f.contents().find('body');
				data = body.html();
				if (data == ''){
					if (--checkCount){
						setTimeout(cb, 100);
						return;
					}
				}
				var ta = body.find('>textarea');
				if (ta.length){
					data = ta.val();
				} else {
					var pre = body.find('>pre');
					if (pre.length){
						data = pre.html();
					}
				}
			} catch(e){
			}
			//modified by tpan,transfer form target to success
			opts.success.call(target,data);
			setTimeout(function(){
				f.unbind();
				f.remove();
			}, 100);
		}
	}
	function load(target, data){
		var opts = $.data(target, 'form').options;
		if (typeof data == 'string'){
			var param = {};
			if (opts.onBeforeLoad.call(target, param) == false) return;
			$.ajax({
				url: data,
				data: param,
				dataType: 'json',
				success: function(data){
					_load(data);
				},
				error: function(){
					opts.onLoadError.apply(target, arguments);
				}
			});
		} else {
			_load(data);
		}
		function _load(data){
			var form = $(target);
			for(var name in data){
				var val = data[name];
				var rr = _checkField(name, val);
				if (!rr.length){
					var count = _loadOther(name, val);
					if (!count){
						$('input[name="'+name+'"]', form).val(val);
						$('textarea[name="'+name+'"]', form).val(val);
						$('select[name="'+name+'"]', form).val(val);
					}
				}
				_loadCombo(name, val);
			}
			opts.onLoadSuccess.call(target, data);
			validate(target);
		}
		function _checkField(name, val){
			var rr = $(target).find('input[name="'+name+'"][type=radio], input[name="'+name+'"][type=checkbox]');
			rr._propAttr('checked', false);
			rr.each(function(){
				var f = $(this);
				if (f.val() == String(val) || $.inArray(f.val(), $.isArray(val)?val:[val]) >= 0){
					f._propAttr('checked', true);
				}
			});
			return rr;
		}
		function _loadOther(name, val){
			var count = 0;
			var pp = ['textbox','numberbox','slider'];
			for(var i=0; i<pp.length; i++){
				var p = pp[i];
				var f = $(target).find('input['+p+'Name="'+name+'"]');
				if (f.length){
					f[p]('setValue', val);
					count += f.length;
				}
			}
			return count;
		}
		function _loadCombo(name, val){
			var form = $(target);
			var cc = ['combobox','combotree','combogrid','datetimebox','datebox','combo'];
			var c = form.find('[comboName="' + name + '"]');
			if (c.length){
				for(var i=0; i<cc.length; i++){
					var type = cc[i];
					if (c.hasClass(type+'-f')){
						if (c[type]('options').multiple){
							c[type]('setValues', val);
						} else {
							c[type]('setValue', val);
						}
						return;
					}
				}
			}
		}
	}
	function clear(target){
		$('input,select,textarea', target).each(function(){
			var t = this.type, tag = this.tagName.toLowerCase();
			if (t == 'text' || t == 'hidden' || t == 'password' || tag == 'textarea'){
				this.value = '';
			} else if (t == 'file'){
				var file = $(this);
				var newfile = file.clone().val('');
				newfile.insertAfter(file);
				if (file.data('validatebox')){
					file.validatebox('destroy');
					newfile.validatebox();
				} else {
					file.remove();
				}
			} else if (t == 'checkbox' || t == 'radio'){
				this.checked = false;
			} else if (tag == 'select'){
				this.selectedIndex = -1;
			}
		});
		var t = $(target);
		var plugins = ['textbox','combo','combobox','combotree','combogrid','slider'];
		for(var i=0; i<plugins.length; i++){
			var plugin = plugins[i];
			var r = t.find('.'+plugin+'-f');
			if (r.length && r[plugin]){
				r[plugin]('clear');
			}
		}
		validate(target);
	}
	function reset(target){
		target.reset();
		var t = $(target);
		var plugins = ['textbox','combo','combobox','combotree','combogrid','datebox','datetimebox','spinner','timespinner','numberbox','numberspinner','slider'];
		for(var i=0; i<plugins.length; i++){
			var plugin = plugins[i];
			var r = t.find('.'+plugin+'-f');
			if (r.length && r[plugin]){
				r[plugin]('reset');
			}
		}
		validate(target);
	}
	function setForm(target){
		var options = $.data(target, 'form').options;
		$(target).unbind('.form');
		if (options.ajax){
			$(target).bind('submit.form', function(){
				setTimeout(function(){
					ajaxSubmit(target, options);
				}, 0);
				return false;
			});
		}
		setValidation(target, options.novalidate);
	}
	function initForm(target, options){
		options = options || {};
		var state = $.data(target, 'form');
		if (state){
			$.extend(state.options, options);
		} else {
			$.data(target, 'form', {
				options: $.extend({}, $.fn.form.defaults, $.fn.form.parseOptions(target), options)
			});
		}
	}
	function validate(target){
		if ($.fn.validatebox){
			var t = $(target);
			t.find('.validatebox-text:not(:disabled)').validatebox('validate');
			var invalidbox = t.find('.validatebox-invalid');
			invalidbox.filter(':not(:disabled):first').focus();
			return invalidbox.length == 0;
		}
		return true;
	}
	function setValidation(target, novalidate){
		var opts = $.data(target, 'form').options;
		opts.novalidate = novalidate;
		$(target).find('.validatebox-text:not(:disabled)').validatebox(novalidate ? 'disableValidation' : 'enableValidation');
	}
	$.fn.form = function(options, param){
		if (typeof options == 'string'){
			this.each(function(){
				initForm(this);
			});
			return $.fn.form.methods[options](this, param);
		}
		return this.each(function(){
			initForm(this, options);
			setForm(this);
		});
	};
	$.fn.form.methods = {
		options: function(jq){
			return $.data(jq[0], 'form').options;
		},
		submit: function(jq, options){
			return jq.each(function(){
				ajaxSubmit(this, options);
			});
		},
		load: function(jq, data){
			return jq.each(function(){
				load(this, data);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				clear(this);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				reset(this);
			});
		},
		validate: function(jq){
			return validate(jq[0]);
		},
		disableValidation: function(jq){
			return jq.each(function(){
				setValidation(this, true);
			});
		},
		enableValidation: function(jq){
			return jq.each(function(){
				setValidation(this, false);
			});
		}
	};
	$.fn.form.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [{ajax:'boolean'}]), {
			url: (t.attr('action') ? t.attr('action') : undefined)
		});
	};
	$.fn.form.defaults = {
		novalidate: false,
		ajax: true,
		url: null,
		queryParams: {},
		onSubmit: function(param){return $(this).form('validate');},
		success: function(data){},
		onBeforeLoad: function(param){},
		onLoadSuccess: function(data){},
		onLoadError: function(){}
	};
})(jQuery);
//menu
(function($){
	function init(target){
		$(target).appendTo('body');
		$(target).addClass('menu-top');	// the top menu
		$(document).unbind('.menu').bind('mousedown.menu', function(e){
//			var allMenu = $('body>div.menu:visible');
//			var m = $(e.target).closest('div.menu', allMenu);
			var m = $(e.target).closest('div.menu,div.combo-p');
			if (m.length){return}
			$('body>div.menu-top:visible').menu('hide');
		});
		var menus = splitMenu($(target));
		for(var i=0; i<menus.length; i++){
			createMenu(menus[i]);
		}
		function splitMenu(menu){
			var menus = [];
			menu.addClass('menu');
			menus.push(menu);
			if (!menu.hasClass('menu-content')){
				menu.children('div').each(function(){
					var submenu = $(this).children('div');
					if (submenu.length){
						submenu.insertAfter(target);
						this.submenu = submenu;		// point to the sub menu
						var mm = splitMenu(submenu);
						menus = menus.concat(mm);
					}
				});
			}
			return menus;
		}
		function createMenu(menu){
			var wh = $.parser.parseOptions(menu[0], ['width','height']);
			menu[0].originalHeight = wh.height || 0;
			if (menu.hasClass('menu-content')){
				menu[0].originalWidth = wh.width || menu._outerWidth();
			} else {
				menu[0].originalWidth = wh.width || 0;
				menu.children('div').each(function(){
					var item = $(this);
					var itemOpts = $.extend({}, $.parser.parseOptions(this,['name','iconCls','href',{separator:'boolean'}]), {
						disabled: (item.attr('disabled') ? true : undefined)
					});
					if (itemOpts.separator){
						item.addClass('menu-sep');
					}
					if (!item.hasClass('menu-sep')){
						item[0].itemName = itemOpts.name || '';
						item[0].itemHref = itemOpts.href || '';
						var text = item.addClass('menu-item').html();
						item.empty().append($('<div class="menu-text"></div>').html(text));
						if (itemOpts.iconCls){
							$('<div class="menu-icon"></div>').addClass(itemOpts.iconCls).appendTo(item);
						}
						if (itemOpts.disabled){
							setDisabled(target, item[0], true);
						}
						if (item[0].submenu){
							$('<div class="menu-rightarrow"></div>').appendTo(item);	// has sub menu
						}
						bindMenuItemEvent(target, item);
					}
				});
				$('<div class="menu-line"></div>').prependTo(menu);
			}
			setMenuSize(target, menu);
			menu.hide();
			bindMenuEvent(target, menu);
		}
	}
	function setMenuSize(target, menu){
		var opts = $.data(target, 'menu').options;
		var style = menu.attr('style') || '';
		menu.css({
			display: 'block',
			left:-10000,
			height: 'auto',
			overflow: 'hidden'
		});
		var el = menu[0];
		var width = el.originalWidth || 0;
		if (!width){
			width = 0;
			menu.find('div.menu-text').each(function(){
				if (width < $(this)._outerWidth()){
					width = $(this)._outerWidth();
				}
				$(this).closest('div.menu-item')._outerHeight($(this)._outerHeight()+2);
			});
			width += 40;
		}
		width = Math.max(width, opts.minWidth);
//		var height = el.originalHeight || menu.outerHeight();
		var height = el.originalHeight || 0;
		if (!height){
			height = menu.outerHeight();
			if (menu.hasClass('menu-top') && opts.alignTo){
				var at = $(opts.alignTo);
				var h1 = at.offset().top - $(document).scrollTop();
				var h2 = $(window)._outerHeight() + $(document).scrollTop() - at.offset().top - at._outerHeight();
				height = Math.min(height, Math.max(h1, h2));
			} else if (height > $(window)._outerHeight()){
				height = $(window).height();
				style += ';overflow:auto';
			} else {
				style += ';overflow:hidden';
			}
//			if (height > $(window).height()-5){
//				height = $(window).height()-5;
//				style += ';overflow:auto';
//			} else {
//				style += ';overflow:hidden';
//			}
		}
		var lineHeight = Math.max(el.originalHeight, menu.outerHeight()) - 2;
		menu._outerWidth(width)._outerHeight(height);
		menu.children('div.menu-line')._outerHeight(lineHeight);
		style += ';width:' + el.style.width + ';height:' + el.style.height;
		menu.attr('style', style);
	}
	function bindMenuEvent(target, menu){
		var state = $.data(target, 'menu');
		menu.unbind('.menu').bind('mouseenter.menu', function(){
			if (state.timer){
				clearTimeout(state.timer);
				state.timer = null;
			}
		}).bind('mouseleave.menu', function(){
			if (state.options.hideOnUnhover){
				state.timer = setTimeout(function(){
					hideAll(target);
				}, state.options.duration);
			}
		});
	}
	function bindMenuItemEvent(target, item){
		if (!item.hasClass('menu-item')){return}
		item.unbind('.menu');
		item.bind('click.menu', function(){
			if ($(this).hasClass('menu-item-disabled')){
				return;
			}
			// only the sub menu clicked can hide all menus
			if (!this.submenu){
				hideAll(target);
				var href = this.itemHref;
				if (href){
					location.href = href;
				}
			}
			var item = $(target).menu('getItem', this);
			$.data(target, 'menu').options.onClick.call(target, item);
		}).bind('mouseenter.menu', function(e){
			// hide other menu
			item.siblings().each(function(){
				if (this.submenu){
					hideMenu(this.submenu);
				}
				$(this).removeClass('menu-active');
			});
			// show this menu
			item.addClass('menu-active');
			if ($(this).hasClass('menu-item-disabled')){
				item.addClass('menu-active-disabled');
				return;
			}
			var submenu = item[0].submenu;
			if (submenu){
				$(target).menu('show', {
					menu: submenu,
					parent: item
				});
			}
		}).bind('mouseleave.menu', function(e){
			item.removeClass('menu-active menu-active-disabled');
			var submenu = item[0].submenu;
			if (submenu){
				if (e.pageX>=parseInt(submenu.css('left'))){
					item.addClass('menu-active');
				} else {
					hideMenu(submenu);
				}
			} else {
				item.removeClass('menu-active');
			}
		});
	}
	function hideAll(target){
		var state = $.data(target, 'menu');
		if (state){
			if ($(target).is(':visible')){
				hideMenu($(target));
				state.options.onHide.call(target);
			}
		}
		return false;
	}
	function showMenu(target, param){
		var left,top;
		param = param || {};
		var menu = $(param.menu || target);
		$(target).menu('resize', menu[0]);
		if (menu.hasClass('menu-top')){
			var opts = $.data(target, 'menu').options;
			$.extend(opts, param);
			left = opts.left;
			top = opts.top;
			if (opts.alignTo){
				var at = $(opts.alignTo);
				left = at.offset().left;
				top = at.offset().top + at._outerHeight();
				if (opts.align == 'right'){
					left += at.outerWidth() - menu.outerWidth();
				}
			}
			if (left + menu.outerWidth() > $(window)._outerWidth() + $(document)._scrollLeft()){
				left = $(window)._outerWidth() + $(document).scrollLeft() - menu.outerWidth() - 5;
			}
			if (left < 0){left = 0;}
			top = _fixTop(top, opts.alignTo);
		} else {
			var parent = param.parent;	// the parent menu item
			left = parent.offset().left + parent.outerWidth() - 2;
			if (left + menu.outerWidth() + 5 > $(window)._outerWidth() + $(document).scrollLeft()){
				left = parent.offset().left - menu.outerWidth() + 2;
			}
			top = _fixTop(parent.offset().top - 3);
		}
		function _fixTop(top, alignTo){
			if (top + menu.outerHeight() > $(window)._outerHeight() + $(document).scrollTop()){
				if (alignTo){
					top = $(alignTo).offset().top - menu._outerHeight();
				} else {
					top = $(window)._outerHeight() + $(document).scrollTop() - menu.outerHeight();
				}
			}
			if (top < 0){top = 0;}
			return top;
		}
		menu.css({left:left,top:top});
		menu.show(0, function(){
			if (!menu[0].shadow){
				menu[0].shadow = $('<div class="menu-shadow"></div>').insertAfter(menu);
			}
			menu[0].shadow.css({
				display:'block',
				zIndex:$.fn.menu.defaults.zIndex++,
				left:menu.css('left'),
				top:menu.css('top'),
				width:menu.outerWidth(),
				height:menu.outerHeight()
			});
			menu.css('z-index', $.fn.menu.defaults.zIndex++);
			if (menu.hasClass('menu-top')){
				$.data(menu[0], 'menu').options.onShow.call(menu[0]);
			}
		});
	}
	function hideMenu(menu){
		if (!menu) return;
		hideit(menu);
		menu.find('div.menu-item').each(function(){
			if (this.submenu){
				hideMenu(this.submenu);
			}
			$(this).removeClass('menu-active');
		});
		function hideit(m){
			m.stop(true,true);
			if (m[0].shadow){
				m[0].shadow.hide();
			}
			m.hide();
		}
	}
	function findItem(target, text){
		var result = null;
		var tmp = $('<div></div>');
		function find(menu){
			menu.children('div.menu-item').each(function(){
				var item = $(target).menu('getItem', this);
				var s = tmp.empty().html(item.text).text();
				if (text == $.trim(s)) {
					result = item;
				} else if (this.submenu && !result){
					find(this.submenu);
				}
			});
		}
		find($(target));
		tmp.remove();
		return result;
	}
	function setDisabled(target, itemEl, disabled){
		var t = $(itemEl);
		if (!t.hasClass('menu-item')){return}
		if (disabled){
			t.addClass('menu-item-disabled');
			if (itemEl.onclick){
				itemEl.onclick1 = itemEl.onclick;
				itemEl.onclick = null;
			}
		} else {
			t.removeClass('menu-item-disabled');
			if (itemEl.onclick1){
				itemEl.onclick = itemEl.onclick1;
				itemEl.onclick1 = null;
			}
		}
	}
	function appendItem(target, param){
		var menu = $(target);
		if (param.parent){
			if (!param.parent.submenu){
				var submenu = $('<div class="menu"><div class="menu-line"></div></div>').appendTo('body');
				submenu.hide();
				param.parent.submenu = submenu;
				$('<div class="menu-rightarrow"></div>').appendTo(param.parent);
			}
			menu = param.parent.submenu;
		}
		if (param.separator){
			var item = $('<div class="menu-sep"></div>').appendTo(menu);
		} else {
			var item = $('<div class="menu-item"></div>').appendTo(menu);
			$('<div class="menu-text"></div>').html(param.text).appendTo(item);
		}
		if (param.iconCls) $('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(item);
		if (param.id) item.attr('id', param.id);
		if (param.name){item[0].itemName = param.name}
		if (param.href){item[0].itemHref = param.href}
		if (param.onclick){
			if (typeof param.onclick == 'string'){
				item.attr('onclick', param.onclick);
			} else {
				item[0].onclick = eval(param.onclick);
			}
		}
		if (param.handler){item[0].onclick = eval(param.handler)}
		if (param.disabled){setDisabled(target, item[0], true)}
		bindMenuItemEvent(target, item);
		bindMenuEvent(target, menu);
		setMenuSize(target, menu);
	}
	function removeItem(target, itemEl){
		function removeit(el){
			if (el.submenu){
				el.submenu.children('div.menu-item').each(function(){
					removeit(this);
				});
				var shadow = el.submenu[0].shadow;
				if (shadow) shadow.remove();
				el.submenu.remove();
			}
			$(el).remove();
		}
		var menu = $(itemEl).parent();
		removeit(itemEl);
		setMenuSize(target, menu);
	}
	function setVisible(target, itemEl, visible){
		var menu = $(itemEl).parent();
		if (visible){
			$(itemEl).show();
		} else {
			$(itemEl).hide();
		}
		setMenuSize(target, menu);
	}
	function destroyMenu(target){
		$(target).children('div.menu-item').each(function(){
			removeItem(target, this);
		});
		if (target.shadow) target.shadow.remove();
		$(target).remove();
	}
	$.fn.menu = function(options, param){
		if (typeof options == 'string'){
			return $.fn.menu.methods[options](this, param);
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'menu');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'menu', {
					options: $.extend({}, $.fn.menu.defaults, $.fn.menu.parseOptions(this), options)
				});
				init(this);
			}
			$(this).css({
				left: state.options.left,
				top: state.options.top
			});
		});
	};
	$.fn.menu.methods = {
		options: function(jq){
			return $.data(jq[0], 'menu').options;
		},
		show: function(jq, pos){
			return jq.each(function(){
				showMenu(this, pos);
			});
		},
		hide: function(jq){
			return jq.each(function(){
				hideAll(this);
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				destroyMenu(this);
			});
		},
		setText: function(jq, param){
			return jq.each(function(){
				$(param.target).children('div.menu-text').html(param.text);
			});
		},
		setIcon: function(jq, param){
			return jq.each(function(){
				$(param.target).children('div.menu-icon').remove();
				if (param.iconCls){
					$('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(param.target);
				}
			});
		},
		getItem: function(jq, itemEl){
			var t = $(itemEl);
			var item = {
				target: itemEl,
				id: t.attr('id'),
				text: $.trim(t.children('div.menu-text').html()),
				disabled: t.hasClass('menu-item-disabled'),
//				href: t.attr('href'),
//				name: t.attr('name'),
				name: itemEl.itemName,
				href: itemEl.itemHref,
				onclick: itemEl.onclick
			}
			var icon = t.children('div.menu-icon');
			if (icon.length){
				var cc = [];
				var aa = icon.attr('class').split(' ');
				for(var i=0; i<aa.length; i++){
					if (aa[i] != 'menu-icon'){
						cc.push(aa[i]);
					}
				}
				item.iconCls = cc.join(' ');
			}
			return item;
		},
		findItem: function(jq, text){
			return findItem(jq[0], text);
		},
		appendItem: function(jq, param){
			return jq.each(function(){
				appendItem(this, param);
			});
		},
		removeItem: function(jq, itemEl){
			return jq.each(function(){
				removeItem(this, itemEl);
			});
		},
		enableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, false);
			});
		},
		disableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, true);
			});
		},
		showItem: function(jq, itemEl){
			return jq.each(function(){
				setVisible(this, itemEl, true);
			});
		},
		hideItem: function(jq, itemEl){
			return jq.each(function(){
				setVisible(this, itemEl, false);
			});
		},
		resize: function(jq, menuEl){
			return jq.each(function(){
				setMenuSize(this, $(menuEl));
			});
		}
	};
	$.fn.menu.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, [{minWidth:'number',duration:'number',hideOnUnhover:'boolean'}]));
	};
	$.fn.menu.defaults = {
		zIndex:110000,
		left: 0,
		top: 0,
		alignTo: null,
		align: 'left',
		minWidth: 120,
		duration: 100,	// Defines duration time in milliseconds to hide when the mouse leaves the menu.
		hideOnUnhover: true,	// Automatically hides the menu when mouse exits it
		onShow: function(){},
		onHide: function(){},
		onClick: function(item){}
	};
})(jQuery);
//tabs
(function($){
	function setScrollers(container) {
		var opts = $.data(container, 'tabs').options;
		if (opts.tabPosition == 'left' || opts.tabPosition == 'right' || !opts.showHeader){return}
		var header = $(container).children('div.tabs-header');
		var tool = header.children('div.tabs-tool');
		var sLeft = header.children('div.tabs-scroller-left');
		var sRight = header.children('div.tabs-scroller-right');
		var wrap = header.children('div.tabs-wrap');
		// set the tool height
		var tHeight = header.outerHeight();
		if (opts.plain){
			tHeight -= tHeight - header.height();
		}
		tool._outerHeight(tHeight);
		var tabsWidth = 0;
		$('ul.tabs li', header).each(function(){
			tabsWidth += $(this).outerWidth(true);
		});
		var cWidth = header.width() - tool._outerWidth();
		if (tabsWidth > cWidth) {
			sLeft.add(sRight).show()._outerHeight(tHeight);
			if (opts.toolPosition == 'left'){
				tool.css({
					left: sLeft.outerWidth(),
					right: ''
				});
				wrap.css({
					marginLeft: sLeft.outerWidth() + tool._outerWidth(),
					marginRight: sRight._outerWidth(),
					width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
				});
			} else {
				tool.css({
					left: '',
					right: sRight.outerWidth()
				});
				wrap.css({
					marginLeft: sLeft.outerWidth(),
					marginRight: sRight.outerWidth() + tool._outerWidth(),
					width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
				});
			}
		} else {
			sLeft.add(sRight).hide();
			if (opts.toolPosition == 'left'){
				tool.css({
					left: 0,
					right: ''
				});
				wrap.css({
					marginLeft: tool._outerWidth(),
					marginRight: 0,
					width: cWidth
				});
			} else {
				tool.css({
					left: '',
					right: 0
				});
				wrap.css({
					marginLeft: 0,
					marginRight: tool._outerWidth(),
					width: cWidth
				});
			}
		}
	}
	function addTools(container){
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		if (opts.tools) {
			if (typeof opts.tools == 'string'){
				$(opts.tools).addClass('tabs-tool').appendTo(header);
				$(opts.tools).show();
			} else {
				header.children('div.tabs-tool').remove();
				var tools = $('<div class="tabs-tool"><table cellspacing="0" cellpadding="0" style="height:100%"><tr></tr></table></div>').appendTo(header);
				var tr = tools.find('tr');
				for(var i=0; i<opts.tools.length; i++){
					var td = $('<td></td>').appendTo(tr);
					var tool = $('<a href="javascript:void(0);"></a>').appendTo(td);
					tool[0].onclick = eval(opts.tools[i].handler || function(){});
					tool.linkbutton($.extend({}, opts.tools[i], {
						plain: true
					}));
				}
			}
		} else {
			header.children('div.tabs-tool').remove();
		}
	}
	function setSize(container, param) {
		var state = $.data(container, 'tabs');
		var opts = state.options;
		var cc = $(container);
		if (param){
			$.extend(opts, {
				width: param.width,
				height: param.height
			});
		}
		cc._size(opts);
		var header = cc.children('div.tabs-header');
		var panels = cc.children('div.tabs-panels');
		var wrap = header.find('div.tabs-wrap');
		var ul = wrap.find('.tabs');
		for(var i=0; i<state.tabs.length; i++){
			var p_opts = state.tabs[i].panel('options');
			var p_t = p_opts.tab.find('a.tabs-inner');
			var width = parseInt(p_opts.tabWidth || opts.tabWidth) || undefined;
			if (width){
				p_t._outerWidth(width);
			} else {
				p_t.css('width', '');
			}
			p_t._outerHeight(opts.tabHeight);
			p_t.css('lineHeight', p_t.height()+'px');
		}
		if (opts.tabPosition == 'left' || opts.tabPosition == 'right'){
			header._outerWidth(opts.showHeader ? opts.headerWidth : 0);
//			header._outerWidth(opts.headerWidth);
			panels._outerWidth(cc.width() - header.outerWidth());
			header.add(panels)._outerHeight(opts.height);
			wrap._outerWidth(header.width());
			ul._outerWidth(wrap.width()).css('height','');
		} else {
			var lrt = header.children('div.tabs-scroller-left,div.tabs-scroller-right,div.tabs-tool');
			header._outerWidth(opts.width).css('height','');
			if (opts.showHeader){
				header.css('background-color','');
				wrap.css('height','');
				lrt.show();
			} else {
				header.css('background-color','transparent');
				header._outerHeight(0);
				wrap._outerHeight(0);
				lrt.hide();
			}
			ul._outerHeight(opts.tabHeight).css('width','');
			setScrollers(container);
			panels._size('height', isNaN(opts.height) ? '' : (opts.height-header.outerHeight()));
			panels._size('width', isNaN(opts.width) ? '' : opts.width);
		}
	}
	function setSelectedSize(container){
		var opts = $.data(container, 'tabs').options;
		var tab = getSelectedTab(container);
		if (tab){
			var panels = $(container).children('div.tabs-panels');
			var width = opts.width=='auto' ? 'auto' : panels.width();
			var height = opts.height=='auto' ? 'auto' : panels.height();
			tab.panel('resize', {
				width: width,
				height: height
			});
		}
	}
	function wrapTabs(container) {
		var tabs = $.data(container, 'tabs').tabs;
		var cc = $(container);
		cc.addClass('tabs-container');
		var pp = $('<div class="tabs-panels"></div>').insertBefore(cc);
		cc.children('div').each(function(){
			pp[0].appendChild(this);
		});
		cc[0].appendChild(pp[0]);
//		cc.wrapInner('<div class="tabs-panels"/>');
		$('<div class="tabs-header">'
				+ '<div class="tabs-scroller-left"></div>'
				+ '<div class="tabs-scroller-right"></div>'
				+ '<div class="tabs-wrap">'
				+ '<ul class="tabs"></ul>'
				+ '</div>'
				+ '</div>').prependTo(container);
		cc.children('div.tabs-panels').children('div').each(function(i){
			var opts = $.extend({}, $.parser.parseOptions(this), {
				selected: ($(this).attr('selected') ? true : undefined)
			});
			var pp = $(this);
			tabs.push(pp);
			createTab(container, pp, opts);
		});
		cc.children('div.tabs-header').find('.tabs-scroller-left, .tabs-scroller-right').hover(
				function(){$(this).addClass('tabs-scroller-over');},
				function(){$(this).removeClass('tabs-scroller-over');}
		);
		cc.bind('_resize', function(e,force){
			if ($(this).hasClass('mwsmartui-fluid') || force){
				setSize(container);
				setSelectedSize(container);
			}
			return false;
		});
	}
	function bindEvents(container){
		var state = $.data(container, 'tabs')
		var opts = state.options;
		$(container).children('div.tabs-header').unbind().bind('click', function(e){
			if ($(e.target).hasClass('tabs-scroller-left')){
				$(container).tabs('scrollBy', -opts.scrollIncrement);
			} else if ($(e.target).hasClass('tabs-scroller-right')){
				$(container).tabs('scrollBy', opts.scrollIncrement);
			} else {
				var li = $(e.target).closest('li');
				if (li.hasClass('tabs-disabled')){return;}
				var a = $(e.target).closest('a.tabs-close');
				if (a.length){
					closeTab(container, getLiIndex(li));
				} else if (li.length){
//					selectTab(container, getLiIndex(li));
					var index = getLiIndex(li);
					var popts = state.tabs[index].panel('options');
					if (popts.collapsible){
						popts.closed ? selectTab(container, index) : unselectTab(container, index);
					} else {
						selectTab(container, index);
					}
				}
			}
		}).bind('contextmenu', function(e){
			var li = $(e.target).closest('li');
			if (li.hasClass('tabs-disabled')){return;}
			if (li.length){
				opts.onContextMenu.call(container, e, li.find('span.tabs-title').html(), getLiIndex(li));
			}
		});
		function getLiIndex(li){
			var index = 0;
			li.parent().children('li').each(function(i){
				if (li[0] == this){
					index = i;
					return false;
				}
			});
			return index;
		}
	}
	function setProperties(container){
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		var panels = $(container).children('div.tabs-panels');
		header.removeClass('tabs-header-top tabs-header-bottom tabs-header-left tabs-header-right');
		panels.removeClass('tabs-panels-top tabs-panels-bottom tabs-panels-left tabs-panels-right');
		if (opts.tabPosition == 'top'){
			header.insertBefore(panels);
		} else if (opts.tabPosition == 'bottom'){
			header.insertAfter(panels);
			header.addClass('tabs-header-bottom');
			panels.addClass('tabs-panels-top');
		} else if (opts.tabPosition == 'left'){
			header.addClass('tabs-header-left');
			panels.addClass('tabs-panels-right');
		} else if (opts.tabPosition == 'right'){
			header.addClass('tabs-header-right');
			panels.addClass('tabs-panels-left');
		}
		if (opts.plain == true) {
			header.addClass('tabs-header-plain');
		} else {
			header.removeClass('tabs-header-plain');
		}
		if (opts.border == true){
			header.removeClass('tabs-header-noborder');
			panels.removeClass('tabs-panels-noborder');
		} else {
			header.addClass('tabs-header-noborder');
			panels.addClass('tabs-panels-noborder');
		}
	}
	function createTab(container, pp, options) {
		var state = $.data(container, 'tabs');
		options = options || {};
		// create panel
		pp.panel($.extend({}, options, {
			border: false,
			noheader: true,
			closed: true,
			doSize: false,
			iconCls: (options.icon ? options.icon : undefined),
			onLoad: function(){
				if (options.onLoad){
					options.onLoad.call(this, arguments);
				}
				state.options.onLoad.call(container, $(this));
			}
		}));
		var opts = pp.panel('options');
		var tabs = $(container).children('div.tabs-header').find('ul.tabs');
		opts.tab = $('<li></li>').appendTo(tabs);	// set the tab object in panel options
		opts.tab.append(
				'<a href="javascript:void(0)" class="tabs-inner">' +
				'<span class="tabs-title"></span>' +
				'<span class="tabs-icon"></span>' +
				'</a>'
		);
		$(container).tabs('update', {
			tab: pp,
			options: opts
		});
	}
	function addTab(container, options) {
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		if (options.selected == undefined) options.selected = true;
		var pp = $('<div></div>').appendTo($(container).children('div.tabs-panels'));
		tabs.push(pp);
		createTab(container, pp, options);
		opts.onAdd.call(container, options.title, tabs.length-1);
//		setScrollers(container);
		setSize(container);
		if (options.selected){
			selectTab(container, tabs.length-1);	// select the added tab panel
		}
	}
	function updateTab(container, param){
		var selectHis = $.data(container, 'tabs').selectHis;
		var pp = param.tab;	// the tab panel
		var oldTitle = pp.panel('options').title; 
		pp.panel($.extend({}, param.options, {
			iconCls: (param.options.icon ? param.options.icon : undefined)
		}));
		var opts = pp.panel('options');	// get the tab panel options
		var tab = opts.tab;
		var s_title = tab.find('span.tabs-title');
		var s_icon = tab.find('span.tabs-icon');
		s_title.html(opts.title);
		s_icon.attr('class', 'tabs-icon');
		tab.find('a.tabs-close').remove();
		if (opts.closable){
			s_title.addClass('tabs-closable');
			$('<a href="javascript:void(0)" class="tabs-close"></a>').appendTo(tab);
		} else{
			s_title.removeClass('tabs-closable');
		}
		if (opts.iconCls){
			s_title.addClass('tabs-with-icon');
			s_icon.addClass(opts.iconCls);
		} else {
			s_title.removeClass('tabs-with-icon');
		}
		if (oldTitle != opts.title){
			for(var i=0; i<selectHis.length; i++){
				if (selectHis[i] == oldTitle){
					selectHis[i] = opts.title;
				}
			}
		}
		tab.find('span.tabs-p-tool').remove();
		if (opts.tools){
			var p_tool = $('<span class="tabs-p-tool"></span>').insertAfter(tab.find('a.tabs-inner'));
			if ($.isArray(opts.tools)){
				for(var i=0; i<opts.tools.length; i++){
					var t = $('<a href="javascript:void(0)"></a>').appendTo(p_tool);
					t.addClass(opts.tools[i].iconCls);
					if (opts.tools[i].handler){
						t.bind('click', {handler:opts.tools[i].handler}, function(e){
							if ($(this).parents('li').hasClass('tabs-disabled')){return;}
							e.data.handler.call(this);
						});
					}
				}
			} else {
				$(opts.tools).children().appendTo(p_tool);
			}
			var pr = p_tool.children().length * 12;
			if (opts.closable) {
				pr += 8;
			} else {
				pr -= 3;
				p_tool.css('right','5px');
			}
			s_title.css('padding-right', pr+'px');
		}
//		setProperties(container);
//		setScrollers(container);
		setSize(container);
		$.data(container, 'tabs').options.onUpdate.call(container, opts.title, getTabIndex(container, pp));
	}
	function closeTab(container, which) {
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		var selectHis = $.data(container, 'tabs').selectHis;
		if (!exists(container, which)) return;
		var tab = getTab(container, which);
		var title = tab.panel('options').title;
		var index = getTabIndex(container, tab);
		if (opts.onBeforeClose.call(container, title, index) == false) return;
		var tab = getTab(container, which, true);
		tab.panel('options').tab.remove();
		tab.panel('destroy');
		opts.onClose.call(container, title, index);
//		setScrollers(container);
		setSize(container);
		// remove the select history item
		for(var i=0; i<selectHis.length; i++){
			if (selectHis[i] == title){
				selectHis.splice(i, 1);
				i --;
			}
		}
		// select the nearest tab panel
		var hisTitle = selectHis.pop();
		if (hisTitle){
			selectTab(container, hisTitle);
		} else if (tabs.length){
			selectTab(container, 0);
		}
	}
	function getTab(container, which, removeit){
		var tabs = $.data(container, 'tabs').tabs;
		if (typeof which == 'number'){
			if (which < 0 || which >= tabs.length){
				return null;
			} else {
				var tab = tabs[which];
				if (removeit) {
					tabs.splice(which, 1);
				}
				return tab;
			}
		}
		for(var i=0; i<tabs.length; i++){
			var tab = tabs[i];
			if (tab.panel('options').title == which){
				if (removeit){
					tabs.splice(i, 1);
				}
				return tab;
			}
		}
		return null;
	}
	function getTabIndex(container, tab){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			if (tabs[i][0] == $(tab)[0]){
				return i;
			}
		}
		return -1;
	}
	function getSelectedTab(container){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			var tab = tabs[i];
			if (tab.panel('options').closed == false){
				return tab;
			}
		}
		return null;
	}
	function doFirstSelect(container){
		var state = $.data(container, 'tabs')
		var tabs = state.tabs;
		for(var i=0; i<tabs.length; i++){
			if (tabs[i].panel('options').selected){
				selectTab(container, i);
				return;
			}
		}
//		if (tabs.length){
//			selectTab(container, 0);
//		}
		selectTab(container, state.options.selected);
	}
	function selectTab(container, which){
		var state = $.data(container, 'tabs');
		var opts = state.options;
		var tabs = state.tabs;
		var selectHis = state.selectHis;
		if (tabs.length == 0) {return;}
		var panel = getTab(container, which); // get the panel to be activated
		if (!panel){return}
		var selected = getSelectedTab(container);
		if (selected){
			if (panel[0] == selected[0]){
				setSelectedSize(container);
				return;
			}
			unselectTab(container, getTabIndex(container, selected));
			if (!selected.panel('options').closed){return}
		}
		panel.panel('open');
		var title = panel.panel('options').title;	// the panel title
		selectHis.push(title);	// push select history
		var tab = panel.panel('options').tab;	// get the tab object
		tab.addClass('tabs-selected');
		// scroll the tab to center position if required.
		var wrap = $(container).find('>div.tabs-header>div.tabs-wrap');
		var left = tab.position().left;
		var right = left + tab.outerWidth();
		if (left < 0 || right > wrap.width()){
			var deltaX = left - (wrap.width()-tab.width()) / 2;
			$(container).tabs('scrollBy', deltaX);
		} else {
			$(container).tabs('scrollBy', 0);
		}
		setSelectedSize(container);
		opts.onSelect.call(container, title, getTabIndex(container, panel));
	}
	function unselectTab(container, which){
		var state = $.data(container, 'tabs');
		var p = getTab(container, which);
		if (p){
			var opts = p.panel('options');
			if (!opts.closed){
				p.panel('close');
				if (opts.closed){
					opts.tab.removeClass('tabs-selected');
					state.options.onUnselect.call(container, opts.title, getTabIndex(container, p));
				}
			}
		}
	}
	function exists(container, which){
		return getTab(container, which) != null;
	}
	function showHeader(container, visible){
		var opts = $.data(container, 'tabs').options;
		opts.showHeader = visible;
		$(container).tabs('resize');
	}
	$.fn.tabs = function(options, param){
		if (typeof options == 'string') {
			return $.fn.tabs.methods[options](this, param);
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'tabs');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'tabs', {
					options: $.extend({},$.fn.tabs.defaults, $.fn.tabs.parseOptions(this), options),
					tabs: [],
					selectHis: []
				});
				wrapTabs(this);
			}
			addTools(this);
			setProperties(this);
			setSize(this);
			bindEvents(this);
			doFirstSelect(this);
		});
	};
	$.fn.tabs.methods = {
		options: function(jq){
			var cc = jq[0];
			var opts = $.data(cc, 'tabs').options;
			var s = getSelectedTab(cc);
			opts.selected = s ? getTabIndex(cc, s) : -1;
			return opts;
		},
		tabs: function(jq){
			return $.data(jq[0], 'tabs').tabs;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
				setSelectedSize(this);
			});
		},
		add: function(jq, options){
			return jq.each(function(){
				addTab(this, options);
			});
		},
		close: function(jq, which){
			return jq.each(function(){
				closeTab(this, which);
			});
		},
		getTab: function(jq, which){
			return getTab(jq[0], which);
		},
		getTabIndex: function(jq, tab){
			return getTabIndex(jq[0], tab);
		},
		getSelected: function(jq){
			return getSelectedTab(jq[0]);
		},
		select: function(jq, which){
			return jq.each(function(){
				selectTab(this, which);
			});
		},
		unselect: function(jq, which){
			return jq.each(function(){
				unselectTab(this, which);
			});
		},
		exists: function(jq, which){
			return exists(jq[0], which);
		},
		update: function(jq, options){
			return jq.each(function(){
				updateTab(this, options);
			});
		},
		enableTab: function(jq, which){
			return jq.each(function(){
				$(this).tabs('getTab', which).panel('options').tab.removeClass('tabs-disabled');
			});
		},
		disableTab: function(jq, which){
			return jq.each(function(){
				$(this).tabs('getTab', which).panel('options').tab.addClass('tabs-disabled');
			});
		},
		showHeader: function(jq){
			return jq.each(function(){
				showHeader(this, true);
			});
		},
		hideHeader: function(jq){
			return jq.each(function(){
				showHeader(this, false);
			});
		},
		scrollBy: function(jq, deltaX){	// scroll the tab header by the specified amount of pixels
			return jq.each(function(){
				var opts = $(this).tabs('options');
				var wrap = $(this).find('>div.tabs-header>div.tabs-wrap');
				var pos = Math.min(wrap._scrollLeft() + deltaX, getMaxScrollWidth());
				wrap.animate({scrollLeft: pos}, opts.scrollDuration);
				function getMaxScrollWidth(){
					var w = 0;
					var ul = wrap.children('ul');
					ul.children('li').each(function(){
						w += $(this).outerWidth(true);
					});
					return w - wrap.width() + (ul.outerWidth() - ul.width());
				}
			});
		}
	};
	$.fn.tabs.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, [
			'tools','toolPosition','tabPosition',
			{fit:'boolean',border:'boolean',plain:'boolean',headerWidth:'number',tabWidth:'number',tabHeight:'number',selected:'number',showHeader:'boolean'}
		]));
	};
	$.fn.tabs.defaults = {
		width: 'auto',
		height: 'auto',
		headerWidth: 150,	// the tab header width, it is valid only when tabPosition set to 'left' or 'right' 
		tabWidth: 'auto',	// the tab width
		tabHeight: 27,		// the tab height
		selected: 0,		// the initialized selected tab index
		showHeader: true,
		plain: false,
		fit: false,
		border: true,
		tools: null,
		toolPosition: 'right',	// left,right
		tabPosition: 'top',		// possible values: top,bottom
		scrollIncrement: 100,
		scrollDuration: 400,
		onLoad: function(data){},
		onSelect: function(title, index){},
		onUnselect: function(title, index){},
		onBeforeClose: function(title, index){},
		onClose: function(title, index){},
		onAdd: function(title, index){},
		onUpdate: function(title, index){},
		onContextMenu: function(e, title, index){}
	};
})(jQuery);
//menubutton
(function($){
	function initMenubutton(target){
		var opts=$.data(target,"menubutton").options;
		var jqTarget=$(target);
		jqTarget.linkbutton(opts);
		jqTarget.removeClass(opts.cls.btn1+" "+opts.cls.btn2).addClass("m-btn");
		jqTarget.removeClass("m-btn-small m-btn-medium m-btn-large").addClass("m-btn-"+opts.size);
		var sp=jqTarget.find(".l-btn-left");
		$("<span></span>").addClass(opts.cls.arrow).appendTo(sp);
		$("<span></span>").addClass("m-btn-line").appendTo(sp);
		if(opts.menu){
			$(opts.menu).menu({duration:opts.duration});
			var menuOpts=$(opts.menu).menu("options");
			var monShow=menuOpts.onShow;
			var monHide=menuOpts.onHide;
			$.extend(menuOpts,{
					onShow:function(){
						var mopts=$(this).menu("options");
						var at=$(mopts.alignTo);
						var bopts=at.menubutton("options");
						at.addClass((bopts.plain==true)?bopts.cls.btn2:bopts.cls.btn1);
						monShow.call(this);
					},
					onHide:function(){
						var mopts=$(this).menu("options");
						var at=$(mopts.alignTo);
						var bopts=at.menubutton("options");
						at.removeClass((bopts.plain==true)?bopts.cls.btn2:bopts.cls.btn1);
						monHide.call(this);
					}
				}
			);
		}
	};
	function bindEvents(target){
		var opts=$.data(target,"menubutton").options;
		var btn=$(target);
		var t=btn.find("."+opts.cls.trigger);
		if(!t.length){
			t=btn;
		}
		t.unbind(".menubutton");
		var timer=null;
		t.bind("click.menubutton",function(){
			if(!isDisable()){
				showMenu(target);
				return false;
			}
		})
		.bind("mouseenter.menubutton",function(){
			if(!isDisable()){
				timer=setTimeout(function(){
						showMenu(target);
					},opts.duration);
				return false;
			}
		})
		.bind("mouseleave.menubutton",function(){
			if(timer){
				clearTimeout(timer);
			}
			$(opts.menu).triggerHandler("mouseleave");
		});
		function isDisable(){
			return $(target).linkbutton("options").disabled;
		}
	};
	function showMenu(target){
		var opts=$.data(target,"menubutton").options;
		if(opts.disabled||!opts.menu){
			return;
		}
		$("body>div.menu-top").menu("hide");
		var btn=$(target);
		var mm=$(opts.menu);
		if(mm.length){
			mm.menu("options").alignTo=btn;
			mm.menu("show",{alignTo:btn,align:opts.menuAlign});
		}
		btn.blur();
	};
	$.fn.menubutton=function(options,param){
		if(typeof options=="string"){
			var mtd=$.fn.menubutton.methods[options];
			if(mtd){
				return mtd(this,param);
			}else{
				return this.linkbutton(options,param);
			}
		}
		options=options||{};
		return this.each(function(){
			var state=$.data(this,"menubutton");
			if(state){
				$.extend(state.options,options);
			}else{
				$.data(this,"menubutton",{
						options:$.extend({},$.fn.menubutton.defaults,$.fn.menubutton.parseOptions(this),options)
					}
				);
				$(this).removeAttr("disabled");
			}
			initMenubutton(this);
			bindEvents(this);
		});
	};
	$.fn.menubutton.methods={
		options:function(jq){
			var opts=jq.linkbutton("options");
			return $.extend($.data(jq[0],"menubutton").options,{
						toggle:opts.toggle,
						selected:opts.selected,
						disabled:opts.disabled
					});
		},
		destroy:function(jq){
			return jq.each(function(){
				var opts=$(this).menubutton("options");
				if(opts.menu){
					$(opts.menu).menu("destroy");
				}
				$(this).remove();
			});
		}
	};
	$.fn.menubutton.parseOptions=function(target){
		var t=$(target);
		return $.extend({},$.fn.linkbutton.parseOptions(target),$.parser.parseOptions(target,["menu",{plain:"boolean",duration:"number"}]));
	};
	$.fn.menubutton.defaults=$.extend({},$.fn.linkbutton.defaults,{
			plain:true,
			menu:null,
			menuAlign:"left",
			duration:100,
			cls:{
				btn1:"m-btn-active",
				btn2:"m-btn-plain-active",
				arrow:"m-btn-downarrow",
				trigger:"m-btn"
			}
		}
	);
})(jQuery);
//splitbutton
(function($) {
	function buildSplitButton(target) {
		var opts = $.data(target, "splitbutton").options;
		$(target).menubutton(opts);
		$(target).addClass("s-btn");
	}
	;
	$.fn.splitbutton = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.splitbutton.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.menubutton(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "splitbutton");
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, "splitbutton", {
					options : $.extend( {}, $.fn.splitbutton.defaults,
							$.fn.splitbutton.parseOptions(this), options)
				});
				$(this).removeAttr("disabled");
			}
			buildSplitButton(this);
		});
	};
	$.fn.splitbutton.methods = {
		options : function(jq) {
			var mopts = jq.menubutton("options");
			var opts = $.data(jq[0], "splitbutton").options;
			$.extend(opts, {
				disabled : mopts.disabled,
				toggle : mopts.toggle,
				selected : mopts.selected
			});
			return opts;
		}
	};
	$.fn.splitbutton.parseOptions = function(target) {
		var t = $(target);
		return $.extend( {}, $.fn.linkbutton.parseOptions(target), $.parser
				.parseOptions(target, [ "menu", {
					plain : "boolean",
					duration : "number"
				} ]));
	};
	$.fn.splitbutton.defaults = $.extend( {}, $.fn.linkbutton.defaults, {
		plain : true,
		menu : null,
		duration : 100,
		cls : {
			btn1 : "m-btn-active s-btn-active",
			btn2 : "m-btn-plain-active s-btn-plain-active",
			arrow : "m-btn-downarrow",
			trigger : "m-btn-line"
		}
	});
})(jQuery);
//accordion
(function($){
	function setSize(container, param){
		var state = $.data(container, 'accordion');
		var opts = state.options;
		var panels = state.panels;
		var cc = $(container);
		if (param){
			$.extend(opts, {
				width: param.width,
				height: param.height
			});
		}
		cc._size(opts);
		var headerHeight = 0;
		var bodyHeight = 'auto';
		var headers = cc.find('>div.panel>div.accordion-header');
		if (headers.length){
			headerHeight = $(headers[0]).css('height', '')._outerHeight();
		}
		if (!isNaN(parseInt(opts.height))){
			bodyHeight = cc.height() - headerHeight*headers.length;
		}
		_resize(true, bodyHeight - _resize(false) + 1);
		function _resize(collapsible, height){
			var totalHeight = 0;
			for(var i=0; i<panels.length; i++){
				var p = panels[i];
				var h = p.panel('header')._outerHeight(headerHeight);
				if (p.panel('options').collapsible == collapsible){
					var pheight = isNaN(height) ? undefined : (height+headerHeight*h.length);
					p.panel('resize', {
						width: cc.width(),
						height: (collapsible ? pheight : undefined)
					});
					totalHeight += p.panel('panel').outerHeight()-headerHeight*h.length;
				}
			}
			return totalHeight;
		}
	}
	function findBy(container, property, value, all){
		var panels = $.data(container, 'accordion').panels;
		var pp = [];
		for(var i=0; i<panels.length; i++){
			var p = panels[i];
			if (property){
				if (p.panel('options')[property] == value){
					pp.push(p);
				}
			} else {
				if (p[0] == $(value)[0]){
					return i;
				}
			}
		}
		if (property){
			return all ? pp : (pp.length ? pp[0] : null);
		} else {
			return -1;
		}
	}
	function getSelections(container){
		return findBy(container, 'collapsed', false, true);
	}
	function getSelected(container){
		var pp = getSelections(container);
		return pp.length ? pp[0] : null;
	}
	function getPanelIndex(container, panel){
		return findBy(container, null, panel);
	}
	function getPanel(container, which){
		var panels = $.data(container, 'accordion').panels;
		if (typeof which == 'number'){
			if (which < 0 || which >= panels.length){
				return null;
			} else {
				return panels[which];
			}
		}
		return findBy(container, 'title', which);
	}
	function setProperties(container){
		var opts = $.data(container, 'accordion').options;
		var cc = $(container);
		if (opts.border){
			cc.removeClass('accordion-noborder');
		} else {
			cc.addClass('accordion-noborder');
		}
	}
	function init(container){
		var state = $.data(container, 'accordion');
		var cc = $(container);
		cc.addClass('accordion');
		state.panels = [];
		cc.children('div').each(function(){
			var opts = $.extend({}, $.parser.parseOptions(this), {
				selected: ($(this).attr('selected') ? true : undefined)
			});
			var pp = $(this);
			state.panels.push(pp);
			createPanel(container, pp, opts);
		});
		cc.bind('_resize', function(e,force){
			if ($(this).hasClass('mwsmartui-fluid') || force){
				setSize(container);
			}
			return false;
		});
	}
	function createPanel(container, pp, options){
		var opts = $.data(container, 'accordion').options;
		pp.panel($.extend({}, {
			collapsible: true,
			minimizable: false,
			maximizable: false,
			closable: false,
			doSize: false,
			collapsed: true,
			headerCls: 'accordion-header',
			bodyCls: 'accordion-body'
		}, options, {
			onBeforeExpand: function(){
				if (options.onBeforeExpand){
					if (options.onBeforeExpand.call(this) == false){return false}
				}
				if (!opts.multiple){
					// get all selected panel
					var all = $.grep(getSelections(container), function(p){
						return p.panel('options').collapsible;
					});
					for(var i=0; i<all.length; i++){
						unselect(container, getPanelIndex(container, all[i]));
					}
				}
				var header = $(this).panel('header');
				header.addClass('accordion-header-selected');
				header.find('.accordion-collapse').removeClass('accordion-expand');
			},
			onExpand: function(){
				if (options.onExpand){options.onExpand.call(this)}
				opts.onSelect.call(container, $(this).panel('options').title, getPanelIndex(container, this));
			},
			onBeforeCollapse: function(){
				if (options.onBeforeCollapse){
					if (options.onBeforeCollapse.call(this) == false){return false}
				}
				var header = $(this).panel('header');
				header.removeClass('accordion-header-selected');
				header.find('.accordion-collapse').addClass('accordion-expand');
			},
			onCollapse: function(){
				if (options.onCollapse){options.onCollapse.call(this)}
				opts.onUnselect.call(container, $(this).panel('options').title, getPanelIndex(container, this));
			}
		}));
		var header = pp.panel('header');
		var tool = header.children('div.panel-tool');
		tool.children('a.panel-tool-collapse').hide();	// hide the old collapse button
		var t = $('<a href="javascript:void(0)"></a>').addClass('accordion-collapse accordion-expand').appendTo(tool);
		t.bind('click', function(){
			var index = getPanelIndex(container, pp);
			if (pp.panel('options').collapsed){
				select(container, index);
			} else {
				unselect(container, index);
			}
			return false;
		});
		pp.panel('options').collapsible ? t.show() : t.hide();
		header.click(function(){
			$(this).find('a.accordion-collapse:visible').triggerHandler('click');
			return false;
		});
	}
	function select(container, which){
		var p = getPanel(container, which);
		if (!p){return}
		stopAnimate(container);
		var opts = $.data(container, 'accordion').options;
		p.panel('expand', opts.animate);
	}
	function unselect(container, which){
		var p = getPanel(container, which);
		if (!p){return}
		stopAnimate(container);
		var opts = $.data(container, 'accordion').options;
		p.panel('collapse', opts.animate);
	}
	function doFirstSelect(container){
		var opts = $.data(container, 'accordion').options;
		var p = findBy(container, 'selected', true);
		if (p){
			_select(getPanelIndex(container, p));
		} else {
			_select(opts.selected);
		}
		function _select(index){
			var animate = opts.animate;
			opts.animate = false;
			select(container, index);
			opts.animate = animate;
		}
	}
	function stopAnimate(container){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			panels[i].stop(true,true);
		}
	}
	function add(container, options){
		var state = $.data(container, 'accordion');
		var opts = state.options;
		var panels = state.panels;
		if (options.selected == undefined) options.selected = true;
		stopAnimate(container);
		var pp = $('<div></div>').appendTo(container);
		panels.push(pp);
		createPanel(container, pp, options);
		setSize(container);
		opts.onAdd.call(container, options.title, panels.length-1);
		if (options.selected){
			select(container, panels.length-1);
		}
	}
	function remove(container, which){
		var state = $.data(container, 'accordion');
		var opts = state.options;
		var panels = state.panels;
		stopAnimate(container);
		var panel = getPanel(container, which);
		var title = panel.panel('options').title;
		var index = getPanelIndex(container, panel);
		if (!panel){return}
		if (opts.onBeforeRemove.call(container, title, index) == false){return}
		panels.splice(index, 1);
		panel.panel('destroy');
		if (panels.length){
			setSize(container);
			var curr = getSelected(container);
			if (!curr){
				select(container, 0);
			}
		}
		opts.onRemove.call(container, title, index);
	}
	$.fn.accordion = function(options, param){
		if (typeof options == 'string'){
			return $.fn.accordion.methods[options](this, param);
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'accordion');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'accordion', {
					options: $.extend({}, $.fn.accordion.defaults, $.fn.accordion.parseOptions(this), options),
					accordion: $(this).addClass('accordion'),
					panels: []
				});
				init(this);
			}
			setProperties(this);
			setSize(this);
			doFirstSelect(this);
		});
	};
	$.fn.accordion.methods = {
		options: function(jq){
			return $.data(jq[0], 'accordion').options;
		},
		panels: function(jq){
			return $.data(jq[0], 'accordion').panels;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		getSelections: function(jq){
			return getSelections(jq[0]);
		},
		getSelected: function(jq){
			return getSelected(jq[0]);
		},
		getPanel: function(jq, which){
			return getPanel(jq[0], which);
		},
		getPanelIndex: function(jq, panel){
			return getPanelIndex(jq[0], panel);
		},
		select: function(jq, which){
			return jq.each(function(){
				select(this, which);
			});
		},
		unselect: function(jq, which){
			return jq.each(function(){
				unselect(this, which);
			});
		},
		add: function(jq, options){
			return jq.each(function(){
				add(this, options);
			});
		},
		remove: function(jq, which){
			return jq.each(function(){
				remove(this, which);
			});
		}
	};
	$.fn.accordion.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height',
			{fit:'boolean',border:'boolean',animate:'boolean',multiple:'boolean',selected:'number'}
		]));
	};
	$.fn.accordion.defaults = {
		width: 'auto',
		height: 'auto',
		fit: false,
		border: true,
		animate: true,
		multiple: false,
		selected: 0,
		onSelect: function(title, index){},
		onUnselect: function(title, index){},
		onAdd: function(title, index){},
		onBeforeRemove: function(title, index){},
		onRemove: function(title, index){}
	};
})(jQuery);
//calendar
(function($){
	function setSize(target, param){
		var opts = $.data(target, 'calendar').options;
		var t = $(target);
		if (param){
			$.extend(opts, {
				width: param.width,
				height: param.height
			});
		}
		t._size(opts, t.parent());
		t.find('.calendar-body')._outerHeight(t.height() - t.find('.calendar-header')._outerHeight());
		if (t.find('.calendar-menu').is(':visible')){
			showSelectMenus(target);
		}
	}
	function init(target){
		$(target).addClass('calendar').html(
				'<div class="calendar-header">' +
					'<div class="calendar-prevmonth"></div>' +
					'<div class="calendar-nextmonth"></div>' +
					'<div class="calendar-prevyear"></div>' +
					'<div class="calendar-nextyear"></div>' +
					'<div class="calendar-title">' +
						'<span>Aprial 2010</span>' +
					'</div>' +
				'</div>' +
				'<div class="calendar-body">' +
					'<div class="calendar-menu">' +
						'<div class="calendar-menu-year-inner">' +
							'<span class="calendar-menu-prev"></span>' +
							'<span><input class="calendar-menu-year" type="text"></input></span>' +
							'<span class="calendar-menu-next"></span>' +
						'</div>' +
						'<div class="calendar-menu-month-inner">' +
						'</div>' +
					'</div>' +
				'</div>'
		);
		$(target).find('.calendar-title span').hover(
			function(){$(this).addClass('calendar-menu-hover');},
			function(){$(this).removeClass('calendar-menu-hover');}
		).click(function(){
			var menu = $(target).find('.calendar-menu');
			if (menu.is(':visible')){
				menu.hide();
			} else {
				showSelectMenus(target);
			}
		});
		$('.calendar-prevmonth,.calendar-nextmonth,.calendar-prevyear,.calendar-nextyear', target).hover(
			function(){$(this).addClass('calendar-nav-hover');},
			function(){$(this).removeClass('calendar-nav-hover');}
		);
		$(target).find('.calendar-nextmonth').click(function(){
			showMonth(target, 1);
		});
		$(target).find('.calendar-prevmonth').click(function(){
			showMonth(target, -1);
		});
		$(target).find('.calendar-nextyear').click(function(){
			showYear(target, 1);
		});
		$(target).find('.calendar-prevyear').click(function(){
			showYear(target, -1);
		});
		$(target).bind('_resize', function(e,force){
			if ($(this).hasClass('mwsmartui-fluid') || force){
				setSize(target);
			}
			return false;
		});
	}
	function showMonth(target, delta){
		var opts = $.data(target, 'calendar').options;
		opts.month += delta;
		if (opts.month > 12){
			opts.year++;
			opts.month = 1;
		} else if (opts.month < 1){
			opts.year--;
			opts.month = 12;
		}
		show(target);
		var menu = $(target).find('.calendar-menu-month-inner');
		menu.find('td.calendar-selected').removeClass('calendar-selected');
		menu.find('td:eq(' + (opts.month-1) + ')').addClass('calendar-selected');
	}
	function showYear(target, delta){
		var opts = $.data(target, 'calendar').options;
		opts.year += delta;
		show(target);
		var menu = $(target).find('.calendar-menu-year');
		menu.val(opts.year);
	}
	function showSelectMenus(target){
		var opts = $.data(target, 'calendar').options;
		$(target).find('.calendar-menu').show();
		if ($(target).find('.calendar-menu-month-inner').is(':empty')){
			$(target).find('.calendar-menu-month-inner').empty();
			var t = $('<table class="calendar-mtable"></table>').appendTo($(target).find('.calendar-menu-month-inner'));
			var idx = 0;
			for(var i=0; i<3; i++){
				var tr = $('<tr></tr>').appendTo(t);
				for(var j=0; j<4; j++){
					$('<td class="calendar-menu-month"></td>').html(opts.months[idx++]).attr('abbr',idx).appendTo(tr);
				}
			}
			$(target).find('.calendar-menu-prev,.calendar-menu-next').hover(
					function(){$(this).addClass('calendar-menu-hover');},
					function(){$(this).removeClass('calendar-menu-hover');}
			);
			$(target).find('.calendar-menu-next').click(function(){
				var y = $(target).find('.calendar-menu-year');
				if (!isNaN(y.val())){
					y.val(parseInt(y.val()) + 1);
					setDate();
				}
			});
			$(target).find('.calendar-menu-prev').click(function(){
				var y = $(target).find('.calendar-menu-year');
				if (!isNaN(y.val())){
					y.val(parseInt(y.val() - 1));
					setDate();
				}
			});
			$(target).find('.calendar-menu-year').keypress(function(e){
				if (e.keyCode == 13){
					setDate(true);
				}
			});
			$(target).find('.calendar-menu-month').hover(
					function(){$(this).addClass('calendar-menu-hover');},
					function(){$(this).removeClass('calendar-menu-hover');}
			).click(function(){
				var menu = $(target).find('.calendar-menu');
				menu.find('.calendar-selected').removeClass('calendar-selected');
				$(this).addClass('calendar-selected');
				setDate(true);
			});
		}
		function setDate(hideMenu){
			var menu = $(target).find('.calendar-menu');
			var year = menu.find('.calendar-menu-year').val();
			var month = menu.find('.calendar-selected').attr('abbr');
			if (!isNaN(year)){
				opts.year = parseInt(year);
				opts.month = parseInt(month);
				show(target);
			}
			if (hideMenu){menu.hide()}
		}
		var body = $(target).find('.calendar-body');
		var sele = $(target).find('.calendar-menu');
		var seleYear = sele.find('.calendar-menu-year-inner');
		var seleMonth = sele.find('.calendar-menu-month-inner');
		seleYear.find('input').val(opts.year).focus();
		seleMonth.find('td.calendar-selected').removeClass('calendar-selected');
		seleMonth.find('td:eq('+(opts.month-1)+')').addClass('calendar-selected');
		sele._outerWidth(body._outerWidth());
		sele._outerHeight(body._outerHeight());
		seleMonth._outerHeight(sele.height() - seleYear._outerHeight());
	}
	function getWeeks(target, year, month){
		var opts = $.data(target, 'calendar').options;
		var dates = [];
		var lastDay = new Date(year, month, 0).getDate();
		for(var i=1; i<=lastDay; i++) dates.push([year,month,i]);
		// group date by week
		var weeks = [], week = [];
//		var memoDay = 0;
		var memoDay = -1;
		while(dates.length > 0){
			var date = dates.shift();
			week.push(date);
			var day = new Date(date[0],date[1]-1,date[2]).getDay();
			if (memoDay == day){
				day = 0;
			} else if (day == (opts.firstDay==0 ? 7 : opts.firstDay) - 1){
				weeks.push(week);
				week = [];
			}
			memoDay = day;
		}
		if (week.length){
			weeks.push(week);
		}
		var firstWeek = weeks[0];
		if (firstWeek.length < 7){
			while(firstWeek.length < 7){
				var firstDate = firstWeek[0];
				var date = new Date(firstDate[0],firstDate[1]-1,firstDate[2]-1)
				firstWeek.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
		} else {
			var firstDate = firstWeek[0];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(firstDate[0], firstDate[1]-1, firstDate[2]-i);
				week.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.unshift(week);
		}
		var lastWeek = weeks[weeks.length-1];
		while(lastWeek.length < 7){
			var lastDate = lastWeek[lastWeek.length-1];
			var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+1);
			lastWeek.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
		}
		if (weeks.length < 6){
			var lastDate = lastWeek[lastWeek.length-1];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+i);
				week.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.push(week);
		}
		return weeks;
	}
	function show(target){
		var opts = $.data(target, 'calendar').options;
		if (opts.current && !opts.validator.call(target, opts.current)){
			opts.current = null;
		}
		var now = new Date();
		var todayInfo = now.getFullYear()+','+(now.getMonth()+1)+','+now.getDate();
		var currentInfo = opts.current ? (opts.current.getFullYear()+','+(opts.current.getMonth()+1)+','+opts.current.getDate()) : '';
		// calulate the saturday and sunday index
		var saIndex = 6 - opts.firstDay;
		var suIndex = saIndex + 1;
		if (saIndex >= 7) saIndex -= 7;
		if (suIndex >= 7) suIndex -= 7;
		$(target).find('.calendar-title span').html(opts.months[opts.month-1] + ' ' + opts.year);
		var body = $(target).find('div.calendar-body');
		body.children('table').remove();
		var data = ['<table class="calendar-dtable" cellspacing="0" cellpadding="0" border="0">'];
		data.push('<thead><tr>');
		for(var i=opts.firstDay; i<opts.weeks.length; i++){
			data.push('<th>'+opts.weeks[i]+'</th>');
		}
		for(var i=0; i<opts.firstDay; i++){
			data.push('<th>'+opts.weeks[i]+'</th>');
		}
		data.push('</tr></thead>');
		data.push('<tbody>');
		var weeks = getWeeks(target, opts.year, opts.month);
		for(var i=0; i<weeks.length; i++){
			var week = weeks[i];
			var cls = '';
			if (i == 0){cls = 'calendar-first';}
			else if (i == weeks.length - 1){cls = 'calendar-last';}
			data.push('<tr class="' + cls + '">');
			for(var j=0; j<week.length; j++){
				var day = week[j];
				var s = day[0]+','+day[1]+','+day[2];
				var dvalue = new Date(day[0], parseInt(day[1])-1, day[2]);
				var d = opts.formatter.call(target, dvalue);
				var css = opts.styler.call(target, dvalue);
				var classValue = '';
				var styleValue = '';
				if (typeof css == 'string'){
					styleValue = css;
				} else if (css){
					classValue = css['class'] || '';
					styleValue = css['style'] || '';
				}
				var cls = 'calendar-day';
				if (!(opts.year == day[0] && opts.month == day[1])){
					cls += ' calendar-other-month';
				}
				if (s == todayInfo){cls += ' calendar-today';}
				if (s == currentInfo){cls += ' calendar-selected';}
				if (j == saIndex){cls += ' calendar-saturday';}
				else if (j == suIndex){cls += ' calendar-sunday';}
				if (j == 0){cls += ' calendar-first';}
				else if (j == week.length-1){cls += ' calendar-last';}
				cls += ' ' + classValue;
				if (!opts.validator.call(target, dvalue)){
					cls += ' calendar-disabled';
				}
				data.push('<td class="' + cls + '" abbr="' + s + '" style="' + styleValue + '">' + d + '</td>');
			}
			data.push('</tr>');
		}
		data.push('</tbody>');
		data.push('</table>');
		body.append(data.join(''));
		var t = body.children('table.calendar-dtable').prependTo(body);
		t.find('td.calendar-day:not(.calendar-disabled)').hover(
			function(){$(this).addClass('calendar-hover');},
			function(){$(this).removeClass('calendar-hover');}
		).click(function(){
			var oldValue = opts.current;
			t.find('.calendar-selected').removeClass('calendar-selected');
			$(this).addClass('calendar-selected');
			var parts = $(this).attr('abbr').split(',');
			opts.current = new Date(parts[0], parseInt(parts[1])-1, parts[2]);
			opts.onSelect.call(target, opts.current);
			if (!oldValue || oldValue.getTime() != opts.current.getTime()){
				opts.onChange.call(target, opts.current, oldValue);
			}
		});
	}
	$.fn.calendar = function(options, param){
		if (typeof options == 'string'){
			return $.fn.calendar.methods[options](this, param);
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'calendar');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'calendar', {
					options:$.extend({}, $.fn.calendar.defaults, $.fn.calendar.parseOptions(this), options)
				});
				init(this);
			}
			if (state.options.border == false){
				$(this).addClass('calendar-noborder');
			}
			setSize(this);
			show(this);
			$(this).find('div.calendar-menu').hide();	// hide the calendar menu
		});
	};
	$.fn.calendar.methods = {
		options: function(jq){
			return $.data(jq[0], 'calendar').options;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		moveTo: function(jq, date){
			return jq.each(function(){
				var opts = $(this).calendar('options');
				if (opts.validator.call(this, date)){
					var oldValue = opts.current;
					$(this).calendar({
						year: date.getFullYear(),
						month: date.getMonth()+1,
						current: date
					});
					if (!oldValue || oldValue.getTime() != date.getTime()){
						opts.onChange.call(this, opts.current, oldValue);
					}
				}
			});
		}
	};
	$.fn.calendar.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			{firstDay:'number',fit:'boolean',border:'boolean'}
		]));
	};
	$.fn.calendar.defaults = {
		width:180,
		height:180,
		fit:false,
		border:true,
		firstDay:0,
		weeks:['S','M','T','W','T','F','S'],
		months:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		year:new Date().getFullYear(),
		month:new Date().getMonth()+1,
		current:(function(){
			var d = new Date();
			return new Date(d.getFullYear(), d.getMonth(), d.getDate());
		})(),
		formatter:function(date){return date.getDate()},
		styler:function(date){return ''},
		validator:function(date){return true},
		onSelect: function(date){},
		onChange: function(newDate, oldDate){}
	};
})(jQuery);
//validatebox
(function($){
	function init(target){
		$(target).addClass("validatebox-text");
	};
	function destroyBox(target){
		var box=$.data(target,"validatebox");
		box.validating=false;
		if(box.timer){
			clearTimeout(box.timer);
		}
		$(target).tooltip("destroy");
		$(target).unbind();
		$(target).remove();
	};
	function bindEvents(target){
		var opts=$.data(target,"validatebox").options;
		var box=$(target);
		box.unbind(".validatebox");
		if(opts.novalidate||box.is(":disabled")){
			return;
		}
		for(var event in opts.events){
			$(target).bind(event+".validatebox",{target:target},opts.events[event]);
		}
	};
	function onFocus(e){
		var target=e.data.target;
		var box=$.data(target,"validatebox");
		var jTarget=$(target);
		if($(target).attr("readonly")){
			return;
		}
		box.validating=true;
		box.value=undefined;
		(function(){
			if(box.validating){
				if(box.value!=jTarget.val()){
					box.value=jTarget.val();
					if(box.timer){
						clearTimeout(box.timer);
					}
					box.timer=setTimeout(function(){
						$(target).validatebox("validate");
					},box.options.delay);
				}else{
					moveTip(target);
				}
				setTimeout(arguments.callee,200);
			}
		})();
	};
	function onBlur(e){
		var target=e.data.target;
		var box=$.data(target,"validatebox");
		if(box.timer){
			clearTimeout(box.timer);
			box.timer=undefined;
		}
		box.validating=false;
		hideTip(target);
	};
	function onMouseEnter(e){
		var target=e.data.target;
		if($(target).hasClass("validatebox-invalid")){
			showTip(target);
		}
	};
	function onMouseLeave(e){
		var target=e.data.target;
		var box=$.data(target,"validatebox");
		if(!box.validating){
			hideTip(target);
		}
	};
	function showTip(target){
		var box=$.data(target,"validatebox");
		var opts=box.options;
		$(target).tooltip($.extend({},opts.tipOptions,{content:box.message,position:opts.tipPosition,deltaX:opts.deltaX})).tooltip("show");
		box.tip=true;
	};
	function moveTip(target){
		var box=$.data(target,"validatebox");
		if(box&&box.tip){
			$(target).tooltip("reposition");
		}
	};
	function hideTip(target){
		var box=$.data(target,"validatebox");
		box.tip=false;
		$(target).tooltip("hide");
	};
	function validate(target){
		var box=$.data(target,"validatebox");
		var opts=box.options;
		var jTarget=$(target);
		opts.onBeforeValidate.call(target);
		var isValid=doValidate();
		opts.onValidate.call(target,isValid);
		return isValid;
		function setTipMsg(msg){
			box.message=msg;
		};
		function validateRule(ruleType,validParam){
			var value=jTarget.val();
			var match=/([a-zA-Z_]+)(.*)/.exec(ruleType);
			var rule=opts.rules[match[1]];
			if(rule&&value){
				var bounds=validParam||opts.validParams||eval(match[2]);
				if(!rule["validator"].call(target,value,bounds)){
					jTarget.addClass("validatebox-invalid");
					var msg=rule["message"];
					if(bounds){
						for(var i=0;i<bounds.length;i++){
							msg=msg.replace(new RegExp("\\{"+i+"\\}","g"),bounds[i]);
						}
					}
					setTipMsg(opts.invalidMessage||msg);
					if(box.validating){
						showTip(target);
					}
					return false;
				}
			}
			return true;
		};
		function doValidate(){
			jTarget.removeClass("validatebox-invalid");
			hideTip(target);
			if(opts.novalidate||jTarget.is(":disabled")){
				return true;
			}
			if(opts.required){
				if(jTarget.val()==""){
					jTarget.addClass("validatebox-invalid");
					setTipMsg(opts.missingMessage);
					if(box.validating){
						showTip(target);
					}
					return false;
				}
			}
			if(opts.validType){
				if($.isArray(opts.validType)){
					for(var i=0;i<opts.validType.length;i++){
						if(!validateRule(opts.validType[i])){
							return false;
						}
					}
				}else{
					if(typeof opts.validType=="string"){
						if(!validateRule(opts.validType)){
							return false;
						}
					}else{
						for(var key in opts.validType){
							var value=opts.validType[key];
							if(!validateRule(key,value)){
								return false;
							}
						}
					}
				}
			}
			return true;
		};
	};
	function enableValidation(target,novalidate){
		var opts=$.data(target,"validatebox").options;
		if(novalidate!=undefined){
			opts.novalidate=novalidate;
		}
		if(opts.novalidate){
			$(target).removeClass("validatebox-invalid");
			hideTip(target);
		}
		validate(target);
		bindEvents(target);
	};
	$.fn.validatebox=function(options,param){
		if(typeof options=="string"){
			return $.fn.validatebox.methods[options](this,param);
		}
		options=options||{};
		return this.each(function(){
			var state=$.data(this,"validatebox");
			if(state){
				$.extend(state.options,options);
			}else{
				init(this);
				$.data(this,"validatebox",{options:$.extend({},$.fn.validatebox.defaults,$.fn.validatebox.parseOptions(this),options)});
			}
			enableValidation(this);
			validate(this);
		});
	};
	$.fn.validatebox.methods={
		options:function(jq){
			return $.data(jq[0],"validatebox").options;
		},
		destroy:function(jq){
			return jq.each(function(){
				destroyBox(this);
			});
		},
		validate:function(jq){
			return jq.each(function(){
				validate(this);
			});
		},
		isValid:function(jq){
			return validate(jq[0]);
		},
		enableValidation:function(jq){
			return jq.each(function(){
				enableValidation(this,false);
			});
		},
		disableValidation:function(jq){
			return jq.each(function(){
				enableValidation(this,true);
			});
		}
	};
	$.fn.validatebox.parseOptions=function(target){
		var t=$(target);
		return $.extend({},$.parser.parseOptions(target,["validType","missingMessage","invalidMessage","tipPosition",{delay:"number",deltaX:"number"}]),{required:(t.attr("required")?true:undefined),novalidate:(t.attr("novalidate")!=undefined?true:undefined)});
	};
	$.fn.validatebox.defaults={
		required:false,
		validType:null,
		validParams:null,
		delay:200,
		missingMessage:"This field is required.",
		invalidMessage:null,
		tipPosition:"right",
		deltaX:0,
		novalidate:false,
		events:{
			focus:onFocus,
			blur:onBlur,
			mouseenter:onMouseEnter,
			mouseleave:onMouseLeave,
			click:function(e){
				var t=$(e.data.target);
				if(!t.is(":focus")){
					t.trigger("focus");
				}
			}
		},
		tipOptions:{
			showEvent:"none",
			hideEvent:"none",
			showDelay:0,
			hideDelay:0,
			zIndex:"",
			onShow:function(){
				$(this).tooltip("tip").css({color:"#000",borderColor:"#CC9933",backgroundColor:"#FFFFCC"});
			},
			onHide:function(){
				$(this).tooltip("destroy");
			}
		},
		rules:{
			CHS : {
				validator : function(value, param) {
					return /^[\u0391-\uFFE5]+$/.test(value);
				},
				message : '请输入汉字'
			},
			english : {// 验证英语
				validator : function(value) {
					return /^[A-Za-z]+$/i.test(value);
				},
				message : '请输入英文'
			},
			ip : {// 验证IP地址
				validator : function(value) {
					return /\d+\.\d+\.\d+\.\d+/.test(value);
				},
				message : 'IP地址格式不正确'
			},
			ZIP : {
				validator : function(value, param) {
					return /^[0-9]\d{5}$/.test(value);
				},
				message : '邮政编码不存在'
			},
			QQ : {
				validator : function(value, param) {
					return /^[1-9]\d{4,10}$/.test(value);
				},
				message : 'QQ号码不正确'
			},
			mobile : {
				validator : function(value, param) {
					return /^(?:13\d|15\d|18\d|14\d)-?\d{5}(\d{3}|\*{3})$/
							.test(value);
				},
				message : '手机号码不正确'
			},
			tel : {
				validator : function(value, param) {
					return /^(\d{3}-|\d{4}-)?(\d{8}|\d{7})?(-\d{1,6})?$/
							.test(value);
				},
				message : '电话号码不正确'
			},
			mobileAndTel : {
				validator : function(value, param) {
					return /(^([0\+]\d{2,3})\d{3,4}\-\d{3,8}$)|(^([0\+]\d{2,3})\d{3,4}\d{3,8}$)|(^([0\+]\d{2,3}){0,1}13\d{9}$)|(^\d{3,4}\d{3,8}$)|(^\d{3,4}\-\d{3,8}$)/
							.test(value);
				},
				message : '请正确输入电话号码'
			},
			number : {
				validator : function(value, param) {
					return /^[0-9]+.?[0-9]*$/.test(value);
				},
				message : '请输入数字'
			},
			money : {
				validator : function(value, param) {
					return (/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(value);
				},
				message : '请输入正确的金额'
			},
			moneyTwo : {
				validator : function(value, param) {
					return (/^((\-?)([0-9]\d*)|\d)(\.\d{1,2})?$/).test(value);
				},
				message : '请输入正确的金额'
			},
			mone : {
				validator : function(value, param) {
					return (/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(value);
				},
				message : '请输入整数或小数'
			},
			integer : {
				validator : function(value, param) {
					return /^[+]?[1-9]\d*$/.test(value);
				},
				message : '请输入最小为1的整数'
			},
			integ : {
				validator : function(value, param) {
					return /^[+]?[0-9]\d*$/.test(value);
				},
				message : '请输入整数'
			},
			range : {
				validator : function(value, param) {
					if (/^[1-9]\d*$/.test(value)) {
						return value >= param[0] && value <= param[1]
					} else {
						return false;
					}
				},
				message : '输入的数字在{0}到{1}之间'
			},
			idCode : {
				validator : function(value, param) {
					return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
							.test(value);
				},
				message : '请输入正确的身份证号'
			},
			loginName : {
				validator : function(value, param) {
					return /^[\u0391-\uFFE5\w]+$/.test(value);
				},
				message : '登录名称只允许汉字、英文字母、数字及下划线。'
			},
			equalTo : {
				validator : function(value, param) {
					return value == $(param[0]).val();
				},
				message : '两次输入的字符不一致'
			},
			englishOrNum : {// 只能输入英文和数字
				validator : function(value) {
					return /^[a-zA-Z0-9_ ]{1,}$/.test(value);
				},
				message : '请输入英文、数字、下划线或者空格'
			},
			xiaoshu : {
				validator : function(value) {
					return /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/.test(value);
				},
				message : '最多保留两位小数！'
			},
			ddPrice : {
				validator : function(value, param) {
					if (/^[1-9]\d*$/.test(value)) {
						return value >= param[0] && value <= param[1];
					} else {
						return false;
					}
				},
				message : '请输入1到100之间正整数'
			},
			jretailUpperLimit : {
				validator : function(value, param) {
					if (/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)) {
						return parseFloat(value) > parseFloat(param[0])
								&& parseFloat(value) <= parseFloat(param[1]);
					} else {
						return false;
					}
				},
				message : '请输入0到100之间的最多俩位小数的数字'
			},
			rateCheck : {
				validator : function(value, param) {
					if (/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)) {
						return parseFloat(value) > parseFloat(param[0])
								&& parseFloat(value) <= parseFloat(param[1]);
					} else {
						return false;
					}
				},
				message : '请输入0到1000之间的最多俩位小数的数字'
			},
			email:{
				validator:function(value){
					return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
				},
				message:"Please enter a valid email address."
			},
			url:{
				validator:function(value){
					return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
				},
				message:"Please enter a valid URL."
			},
			length:{
				validator:function(value,bounds){
					var len=$.trim(value).length;
					return len>=bounds[0]&&len<=bounds[1];
				},
				message:"Please enter a value between {0} and {1}."
			},
			remote:{
				validator:function(value,remoteKey){
					var me = this;
					var queryParam={};
					queryParam[remoteKey[1]]=value;
					var ret = true;
					$.ajax({url:remoteKey[0],dataType:"json",data:queryParam,async:false,cache:false,type:"post",
						success:function(data){
							ret = data.success;
							var box=$.data(me,"validatebox");
							var opts=box.options;
							opts.rules.remote.message = data.msg;
						}});
					return ret;
				},
				message:"Please fix this field."
			}
		},
		onBeforeValidate:function(){},
		onValidate:function(isValid){}
	};
})(jQuery);
//textbox
(function($){
	function init(target){
		$(target).addClass("textbox-f").hide();
		var textbox=$("<span class=\"textbox\">"+"<input class=\"textbox-text\" autocomplete=\"off\">"+"<span class=\"textbox-addon\"><span class=\"textbox-icon\"></span></span>"+"<input type=\"hidden\" class=\"textbox-value\">"+"</span>").insertAfter(target);
		var name=$(target).attr("name");
		if(name){
			textbox.find("input.textbox-value").attr("name",name);
			$(target).removeAttr("name").attr("textboxName",name);
		}
		textbox.bind("_resize",function(e,width){
			if($(this).hasClass("mwsmartui-fluid")||width){
				resizeTextbox(target);
			}
			return false;
		});
		return textbox;
	};
	function applyOptions(target){
		var textbox = $.data(target,"textbox");
		var opts=textbox.options;
		var tb=textbox.textbox;
		tb.find(".textbox-text").remove();
		if(opts.multiline){
			$("<textarea class=\"textbox-text\" autocomplete=\"off\"></textarea>").prependTo(tb);
		}else{
			$("<input type=\""+opts.type+"\" class=\"textbox-text\" autocomplete=\"off\">").prependTo(tb);
		}
		tb.find(".textbox-addon").remove();
		var bb=opts.icons?$.extend(true,[],opts.icons):[];
		if(opts.iconCls){
			bb.push({iconCls:opts.iconCls,disabled:true});
		}
		if(bb.length){
			var bc=$("<span class=\"textbox-addon\"></span>").prependTo(tb);
			bc.addClass("textbox-addon-"+opts.iconAlign);
			for(var i=0;i<bb.length;i++){
				bc.append("<a href=\"javascript:void(0)\" class=\"textbox-icon "+bb[i].iconCls+"\" icon-index=\""+i+"\"></a>");
			}
		}
		tb.find(".textbox-button").remove();
		if(opts.buttonText||opts.buttonIcon){
			var btn=$("<a href=\"javascript:void(0)\" class=\"textbox-button\"></a>").prependTo(tb);
			btn.addClass("textbox-button-"+opts.buttonAlign).linkbutton({text:opts.buttonText,iconCls:opts.buttonIcon,onClick:function(){
				opts.onClickButton.call(target);
			}});
		}
		disableTextbox(target,opts.disabled);
		readonlyTextbox(target,opts.readonly);
	};
	function destroyTextbox(target){
		var tb=$.data(target,"textbox").textbox;
		tb.find(".textbox-text").validatebox("destroy");
		tb.remove();
		$(target).remove();
	};
	function resizeTextbox(target,width){
		var textbox=$.data(target,"textbox");
		var opts=textbox.options;
		var tb=textbox.textbox;
		var parent=tb.parent();
		if(width){
			opts.width=width;
		}
		if(isNaN(parseInt(opts.width))){
			var c=$(target).clone();
			c.css("visibility","hidden");
			c.insertAfter(target);
			opts.width=c.outerWidth();
			c.remove();
		}
		tb.appendTo("body");
		var textboxText=tb.find(".textbox-text");
		var btn=tb.find(".textbox-button");
		var textboxAddon=tb.find(".textbox-addon");
		var textboxIcon=textboxAddon.find(".textbox-icon");
		tb._size(opts,parent);
		btn.linkbutton("resize",{height:tb.height()});
		btn.css({left:(opts.buttonAlign=="left"?0:""),right:(opts.buttonAlign=="right"?0:"")});
		textboxAddon.css({left:(opts.iconAlign=="left"?(opts.buttonAlign=="left"?btn._outerWidth():0):""),right:(opts.iconAlign=="right"?(opts.buttonAlign=="right"?btn._outerWidth():0):"")});
		textboxIcon.css({width:opts.iconWidth+"px",height:tb.height()+"px"});
		textboxText.css({paddingLeft:(target.style.paddingLeft||""),paddingRight:(target.style.paddingRight||""),marginLeft:calculateMargin("left"),marginRight:calculateMargin("right")});
		if(opts.multiline){
			textboxText.css({paddingTop:(target.style.paddingTop||""),paddingBottom:(target.style.paddingBottom||"")});
			textboxText._outerHeight(tb.height());
		}else{
			var paddings=Math.floor((tb.height()-textboxText.height())/2);
			textboxText.css({paddingTop:paddings+"px",paddingBottom:paddings+"px"});
		}
		textboxText._outerWidth(tb.width()-textboxIcon.length*opts.iconWidth-btn._outerWidth());
		tb.insertAfter(target);
		opts.onResize.call(target,opts.width,opts.height);
		function calculateMargin(alignType){
			return (opts.iconAlign==alignType?textboxAddon._outerWidth():0)+(opts.buttonAlign==alignType?btn._outerWidth():0);
		};
	};
	function initValidate(target){
		var opts=$(target).textbox("options");
		var textbox=$(target).textbox("textbox");
		textbox.validatebox($.extend({},opts,{
			deltaX:$(target).textbox("getTipX"),
			onBeforeValidate:function(){
				var box=$(this);
				if(!box.is(":focus")){
					opts.oldInputValue=box.val();
					box.val(opts.value);
				}
			},
			onValidate:function(isValid){
				var box=$(this);
				if(opts.oldInputValue!=undefined){
					box.val(opts.oldInputValue);
					opts.oldInputValue=undefined;
				}
				var tb=box.parent();
				if(isValid){
					tb.removeClass("textbox-invalid");
				}else{
					tb.addClass("textbox-invalid");
				}
			}
		}));
	};
	function bindEvents(target){
		var textbox=$.data(target,"textbox");
		var opts=textbox.options;
		var tb=textbox.textbox;
		var textboxText=tb.find(".textbox-text");
		textboxText.attr("placeholder",opts.prompt);
		textboxText.unbind(".textbox");
		if(!opts.disabled&&!opts.readonly){
			textboxText.bind("blur.textbox",function(e){
				if(!tb.hasClass("textbox-focused")){
					return;
				}
				opts.value=$(this).val();
				if(opts.value==""){
					$(this).val(opts.prompt).addClass("textbox-prompt");
				}else{
					$(this).removeClass("textbox-prompt");
				}
				tb.removeClass("textbox-focused");
			}).bind("focus.textbox",function(e){
				if($(this).val()!=opts.value){
					$(this).val(opts.value);
				}
				$(this).removeClass("textbox-prompt");
				tb.addClass("textbox-focused");
			});
			for(var event in opts.inputEvents){
				textboxText.bind(event+".textbox",{target:target},opts.inputEvents[event]);
			}
		}
		var textboxAddon=tb.find(".textbox-addon");
		textboxAddon.unbind().bind("click",{target:target},function(e){
			var enableTextboxIcon=$(e.target).closest("a.textbox-icon:not(.textbox-icon-disabled)");
			if(enableTextboxIcon.length){
				var iconIndex=parseInt(enableTextboxIcon.attr("icon-index"));
				var icon=opts.icons[iconIndex];
				if(icon&&icon.handler){
					icon.handler.call(enableTextboxIcon[0],e);
					opts.onClickIcon.call(target,iconIndex);
				}
			}
		});
		textboxAddon.find(".textbox-icon").each(function(iconIndex){
			var icon=opts.icons[iconIndex];
			var textboxIcon=$(this);
			if(!icon||icon.disabled||opts.disabled||opts.readonly){
				textboxIcon.addClass("textbox-icon-disabled");
			}else{
				textboxIcon.removeClass("textbox-icon-disabled");
			}
		});
		tb.find(".textbox-button").linkbutton((opts.disabled||opts.readonly)?"disable":"enable");
	};
	function disableTextbox(target,disable){
		var textbox=$.data(target,"textbox");
		var opts=textbox.options;
		var tb=textbox.textbox;
		if(disable){
			opts.disabled=true;
			$(target).attr("disabled","disabled");
			tb.find(".textbox-text,.textbox-value").attr("disabled","disabled");
		}else{
			opts.disabled=false;
			$(target).removeAttr("disabled");
			tb.find(".textbox-text,.textbox-value").removeAttr("disabled");
		}
	};
	function readonlyTextbox(target,isReadonly){
		var textbox=$.data(target,"textbox");
		var opts=textbox.options;
		opts.readonly=isReadonly==undefined?true:isReadonly;
		var textboxText=textbox.textbox.find(".textbox-text");
		textboxText.removeAttr("readonly").removeClass("textbox-text-readonly");
		if(opts.readonly||!opts.editable){
			textboxText.attr("readonly","readonly").addClass("textbox-text-readonly");
		}
	};
	$.fn.textbox=function(options,param){
		if(typeof options=="string"){
			var method=$.fn.textbox.methods[options];
			if(method){
				return method(this,param);
			}else{
				return this.each(function(){
					var textbox=$(this).textbox("textbox");
					textbox.validatebox(options,param);
				});
			}
		}
		options=options||{};
		return this.each(function(){
			var state=$.data(this,"textbox");
			if(state){
				$.extend(state.options,options);
				if(options.value!=undefined){
					state.options.originalValue=options.value;
				}
			}else{
				state=$.data(this,"textbox",{options:$.extend({},$.fn.textbox.defaults,$.fn.textbox.parseOptions(this),options),textbox:init(this)});
				state.options.originalValue=state.options.value;
			}
			applyOptions(this);
			bindEvents(this);
			resizeTextbox(this);
			initValidate(this);
			$(this).textbox("initValue",state.options.value);
		});
	};
	$.fn.textbox.methods={
		options:function(jq){
			return $.data(jq[0],"textbox").options;
		},
		textbox:function(jq){
			return $.data(jq[0],"textbox").textbox.find(".textbox-text");
		},
		button:function(jq){
			return $.data(jq[0],"textbox").textbox.find(".textbox-button");
		},
		destroy:function(jq){
			return jq.each(function(){
				destroyTextbox(this);
			});
		},
		resize:function(jq,width){
			return jq.each(function(){
				resizeTextbox(this,width);
			});
		},
		disable:function(jq){
			return jq.each(function(){
				disableTextbox(this,true);
				bindEvents(this);
			});
		},
		enable:function(jq){
			return jq.each(function(){
				disableTextbox(this,false);
				bindEvents(this);
			});
		},
		readonly:function(jq,isReadonly){
			return jq.each(function(){
				readonlyTextbox(this,isReadonly);
				bindEvents(this);
			});
		},
		isValid:function(jq){
			return jq.textbox("textbox").validatebox("isValid");
		},
		clear:function(jq){
			return jq.each(function(){
				$(this).textbox("setValue","");
			});
		},
		setText:function(jq,newvalue){
			return jq.each(function(){
				var opts=$(this).textbox("options");
				var textbox=$(this).textbox("textbox");
				if($(this).textbox("getText")!=newvalue){
					opts.value=newvalue;
					textbox.val(newvalue);
				}
				if(!textbox.is(":focus")){
					if(newvalue){
						textbox.removeClass("textbox-prompt");
					}else{
						textbox.val(opts.prompt).addClass("textbox-prompt");
					}
				}
				$(this).textbox("validate");
			});
		},
		initValue:function(jq,value){
			return jq.each(function(){
				var textbox=$.data(this,"textbox");
				textbox.options.value="";
				$(this).textbox("setText",value);
				textbox.textbox.find(".textbox-value").val(value);
				$(this).val(value);
			});
		},
		setValue:function(jq,value){
			return jq.each(function(){
				var opts=$.data(this,"textbox").options;
				var oldvalue=$(this).textbox("getValue");
				$(this).textbox("initValue",value);
				if(oldvalue!=value){
					opts.onChange.call(this,value,oldvalue);
				}
			});
		},
		getText:function(jq){
			var textbox=jq.textbox("textbox");
			if(textbox.is(":focus")){
				return textbox.val();
			}else{
				return jq.textbox("options").value;
			}
		},
		getValue:function(jq){
			return jq.data("textbox").textbox.find(".textbox-value").val();
		},
		reset:function(jq){
			return jq.each(function(){
				var opts=$(this).textbox("options");
				$(this).textbox("setValue",opts.originalValue);
			});
		},
		getIcon:function(jq,iconIndex){
			return jq.data("textbox").textbox.find(".textbox-icon:eq("+iconIndex+")");
		},
		getTipX:function(jq){
			var opts=jq.data("textbox").options;
			var tb=jq.data("textbox").textbox;
			//var _4a=tb.find(".textbox-text");
			var aWidth=tb.find(".textbox-addon")._outerWidth();
			var bWidth=tb.find(".textbox-button")._outerWidth();
			if(opts.tipPosition=="right"){
				return (opts.iconAlign=="right"?aWidth:0)+(opts.buttonAlign=="right"?bWidth:0)+1;
			}else{
				if(opts.tipPosition=="left"){
					return (opts.iconAlign=="left"?-aWidth:0)+(opts.buttonAlign=="left"?-bWidth:0)-1;
				}else{
					return aWidth/2*(opts.iconAlign=="right"?1:-1);
				}
			}
		}
	};
	$.fn.textbox.parseOptions=function(target){
		var t=$(target);
		return $.extend({},$.fn.validatebox.parseOptions(target),$.parser.parseOptions(target,["prompt","iconCls","iconAlign","buttonText","buttonIcon","buttonAlign",{multiline:"boolean",editable:"boolean",iconWidth:"number"}]),{value:(t.val()||undefined),type:(t.attr("type")?t.attr("type"):undefined),disabled:(t.attr("disabled")?true:undefined),readonly:(t.attr("readonly")?true:undefined)});
	};
	$.fn.textbox.defaults=$.extend({},$.fn.validatebox.defaults,{
		width:"auto",
		height:22,
		prompt:"",
		value:"",
		type:"text",
		multiline:false,
		editable:true,
		disabled:false,
		readonly:false,
		icons:[],
		iconCls:null,
		iconAlign:"right",
		iconWidth:18,
		buttonText:"",
		buttonIcon:null,
		buttonAlign:"right",
		inputEvents:{
			blur:function(e){
				var t=$(e.data.target);
				var opts=t.textbox("options");
				t.textbox("setValue",opts.value);
			}
		},
		onChange:function(newvalue,oldvalue){},
		onResize:function(width,height){},
		onClickButton:function(){},
		onClickIcon:function(iconIndex){}
	});
})(jQuery);
//filebox
(function($) {
	function buildFilebox(target) {
		var fbox = $.data(target, "filebox");
		var opts = fbox.options;
		$(target).addClass("filebox-f").textbox($.extend( {}, opts, {
			onClickButton : function() {
				fbox.filebox.find(".textbox-value").click();
				opts.onClickButton.call(target);
			}
		}));
		$(target).textbox("textbox").attr("readonly", "readonly");
		fbox.filebox = $(target).next().addClass("filebox");
		fbox.filebox.find(".textbox-value").remove();
		opts.oldValue = "";
		var fileChooser = $("<input type=\"file\" class=\"textbox-value\">").appendTo(
				fbox.filebox);
		fileChooser.attr("name", $(target).attr("textboxName") || "").change(function() {
			$(target).filebox("setText", this.value);
			opts.onChange.call(target, this.value, opts.oldValue);
			opts.oldValue = this.value;
		});
	}
	;
	$.fn.filebox = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.filebox.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.textbox(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "filebox");
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, "filebox", {
					options : $.extend( {}, $.fn.filebox.defaults, $.fn.filebox
							.parseOptions(this), options)
				});
			}
			buildFilebox(this);
		});
	};
	$.fn.filebox.methods = {
		options : function(jq) {
			var opts = jq.textbox("options");
			return $.extend($.data(jq[0], "filebox").options, {
				width : opts.width,
				value : opts.value,
				originalValue : opts.originalValue,
				disabled : opts.disabled,
				readonly : opts.readonly
			});
		}
	};
	$.fn.filebox.parseOptions = function(target) {
		return $.extend( {}, $.fn.textbox.parseOptions(target), {});
	};
	$.fn.filebox.defaults = $.extend( {}, $.fn.textbox.defaults, {
		buttonIcon : null,
		buttonText : "Choose File",
		buttonAlign : "right"
	});
})(jQuery);
//combo
(function($) {
	function initCombo(target) {
		var cb = $.data(target, "combo");
		var opts = cb.options;
		if (!cb.panel) {
			cb.panel = $("<div class=\"combo-panel\"></div>").appendTo("body");
			cb.panel.panel( {
				minWidth : opts.panelMinWidth,
				maxWidth : opts.panelMaxWidth,
				minHeight : opts.panelMinHeight,
				maxHeight : opts.panelMaxHeight,
				doSize : false,
				closed : true,
				cls : "combo-p",
				style : {
					position : "absolute",
					zIndex : 10
				},
				onOpen : function() {
					var p = $(this).panel("panel");
					if ($.fn.menu) {
						p.css("z-index", $.fn.menu.defaults.zIndex++);
					} else {
						if ($.fn.window) {
							p.css("z-index", $.fn.window.defaults.zIndex++);
						}
					}
					$(this).panel("resize");
				},
				onBeforeClose : function() {
					closeComboInPanel(this);
				},
				onClose : function() {
					var cbb = $.data(target, "combo");
					if (cbb) {
						cbb.options.onHidePanel.call(target);
					}
				}
			});
		}
		var icons = $.extend(true, [], opts.icons);
		if (opts.hasDownArrow) {
			icons.push( {
				iconCls : "combo-arrow",
				handler : function(e) {
					toogleComboPanel(e.data.target);
				}
			});
		}
		$(target).addClass("combo-f").textbox($.extend( {}, opts, {
			icons : icons,
			onChange : function() {
			}
		}));
		$(target).attr("comboName", $(target).attr("textboxName"));
		cb.combo = $(target).next();
		cb.combo.addClass("combo");
	}
	;
	function destroyCombo(target) {
		var cb = $.data(target, "combo");
		cb.panel.panel("destroy");
		$(target).textbox("destroy");
	}
	;
	function toogleComboPanel(target) {
		var panel = $.data(target, "combo").panel;
		if (panel.is(":visible")) {
			hideComboPanel(target);
		} else {
			var p = $(target).closest("div.combo-panel");
			$("div.combo-panel:visible").not(panel).not(p).panel("close");
			$(target).combo("showPanel");
		}
		$(target).combo("textbox").focus();
	}
	;
	function closeComboInPanel(target) {
		$(target).find(".combo-f").each(function() {
			var p = $(this).combo("panel");
			if (p.is(":visible")) {
				p.panel("close");
			}
		});
	}
	;
	function bindEvents(target) {
		$(document).unbind(".combo").bind("mousedown.combo", function(e) {
			var p = $(e.target).closest("span.combo,div.combo-p");
			if (p.length) {
				closeComboInPanel(p);
				return;
			}
			$("body>div.combo-p>div.combo-panel:visible").panel("close");
		});
	}
	;
	function comboClickHander(e) {
		var target = e.data.target;
		var cb = $.data(target, "combo");
		var opts = cb.options;
		var panel = cb.panel;
		if (!opts.editable) {
			toogleComboPanel(target);
		} else {
			var p = $(target).closest("div.combo-panel");
			$("div.combo-panel:visible").not(panel).not(p).panel("close");
		}
	}
	;
	function comboKeyHandler(e) {
		var target = e.data.target;
		var t = $(target);
		var cb = t.data("combo");
		var opts = t.combo("options");
		switch (e.keyCode) {
		case 38:
			opts.keyHandler.up.call(target, e);
			break;
		case 40:
			opts.keyHandler.down.call(target, e);
			break;
		case 37:
			opts.keyHandler.left.call(target, e);
			break;
		case 39:
			opts.keyHandler.right.call(target, e);
			break;
		case 13:
			e.preventDefault();
			opts.keyHandler.enter.call(target, e);
			return false;
		case 9:
		case 27:
			hideComboPanel(target);
			break;
		default:
			if (opts.editable) {
				if (cb.timer) {
					clearTimeout(cb.timer);
				}
				cb.timer = setTimeout(function() {
					var q = t.combo("getText");
					if (cb.previousText != q) {
						cb.previousText = q;
						t.combo("showPanel");
						opts.keyHandler.query.call(target, q, e);
						t.combo("validate");
					}
				}, opts.delay);
			}
		}
	}
	;
	function showComboPanel(target) {
		var cb = $.data(target, "combo");
		var cbb = cb.combo;
		var cbp = cb.panel;
		var opts = $(target).combo("options");
		cbp.panel("move", {
			left : getPanelLeft(),
			top : getPanelTop()
		});
		if (cbp.panel("options").closed) {
			cbp.panel("open").panel("resize", {
				width : (opts.panelWidth ? opts.panelWidth : cbb._outerWidth()),
				height : opts.panelHeight
			});
			opts.onShowPanel.call(target);
		}
		(function() {
			if (cbp.is(":visible")) {
				cbp.panel("move", {
					left : getPanelLeft(),
					top : getPanelTop()
				});
				setTimeout(arguments.callee, 200);
			}
		})();
		function getPanelLeft() {
			var left = cbb.offset().left;
			if (opts.panelAlign == "right") {
				left += cbb._outerWidth() - cbp._outerWidth();
			}
			if (left + cbp._outerWidth() > $(window)._outerWidth()
					+ $(document).scrollLeft()) {
				left = $(window)._outerWidth() + $(document).scrollLeft()
						- cbp._outerWidth();
			}
			if (left < 0) {
				left = 0;
			}
			return left;
		}
		;
		function getPanelTop() {
			var top = cbb.offset().top + cbb._outerHeight();
			if (top + cbp._outerHeight() > $(window)._outerHeight()
					+ $(document).scrollTop()) {
				top = cbb.offset().top - cbp._outerHeight();
			}
			if (top < $(document).scrollTop()) {
				top = cbb.offset().top + cbb._outerHeight();
			}
			return top;
		}
		;
	}
	;
	function hideComboPanel(target) {
		var p = $.data(target, "combo").panel;
		p.panel("close");
	}
	;
	function clearCombo(target) {
		var cb = $.data(target, "combo");
		var opts = cb.options;
		var cbb = cb.combo;
		$(target).textbox("clear");
		if (opts.multiple) {
			cbb.find(".textbox-value").remove();
		} else {
			cbb.find(".textbox-value").val("");
		}
	}
	;
	function setComboText(target, text) {
		var cb = $.data(target, "combo");
		var oldText = $(target).textbox("getText");
		if (oldText != text) {
			$(target).textbox("setText", text);
			cb.previousText = text;
		}
	}
	;
	function getComboValues(target) {
		var values = [];
		var textbox = $.data(target, "combo").combo;
		textbox.find(".textbox-value").each(function() {
			values.push($(this).val());
		});
		return values;
	}
	;
	function setComboValues(target, values) {
		if (!$.isArray(values)) {
			values = [ values ];
		}
		var cb = $.data(target, "combo");
		var opts = cb.options;
		var cbb = cb.combo;
		var oldValues = getComboValues(target);
		cbb.find(".textbox-value").remove();
		var tname = $(target).attr("textboxName") || "";
		for ( var i = 0; i < values.length; i++) {
			var tvalue = $("<input type=\"hidden\" class=\"textbox-value\">")
					.appendTo(cbb);
			tvalue.attr("name", tname);
			if (opts.disabled) {
				tvalue.attr("disabled", "disabled");
			}
			tvalue.val(values[i]);
		}
		var changed = (function() {
			if (oldValues.length != values.length) {
				return true;
			}
			var a1 = $.extend(true, [], oldValues);
			var a2 = $.extend(true, [], values);
			a1.sort();
			a2.sort();
			for ( var i = 0; i < a1.length; i++) {
				if (a1[i] != a2[i]) {
					return true;
				}
			}
			return false;
		})();
		if (changed) {
			if (opts.multiple) {
				opts.onChange.call(target, values, oldValues);
			} else {
				opts.onChange.call(target, values[0], oldValues[0]);
			}
		}
	}
	;
	function getComboValue(target) {
		var values = getComboValues(target);
		return values[0];
	}
	;
	function setComboValue(target, value) {
		setComboValues(target, [ value ]);
	}
	;
	function initComboValue(target) {
		var opts = $.data(target, "combo").options;
		var onChange = opts.onChange;
		opts.onChange = function() {
		};
		if (opts.multiple) {
			setComboValues(target, opts.value ? opts.value : []);
		} else {
			setComboValue(target, opts.value);
		}
		opts.onChange = onChange;
	}
	;
	$.fn.combo = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.combo.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.textbox(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "combo");
			if (state) {
				$.extend(state.options, options);
				if (options.value != undefined) {
					state.options.originalValue = options.value;
				}
			} else {
				state = $.data(this, "combo", {
					options : $.extend( {}, $.fn.combo.defaults, $.fn.combo
							.parseOptions(this), options),
					previousText : ""
				});
				state.options.originalValue = state.options.value;
			}
			initCombo(this);
			bindEvents(this);
			initComboValue(this);
		});
	};
	$.fn.combo.methods = {
		options : function(jq) {
			var topts = jq.textbox("options");
			return $.extend($.data(jq[0], "combo").options, {
				width : topts.width,
				height : topts.height,
				disabled : topts.disabled,
				readonly : topts.readonly
			});
		},
		panel : function(jq) {
			return $.data(jq[0], "combo").panel;
		},
		destroy : function(jq) {
			return jq.each(function() {
				destroyCombo(this);
			});
		},
		showPanel : function(jq) {
			return jq.each(function() {
				showComboPanel(this);
			});
		},
		hidePanel : function(jq) {
			return jq.each(function() {
				hideComboPanel(this);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				clearCombo(this);
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var opts = $.data(this, "combo").options;
				if (opts.multiple) {
					$(this).combo("setValues", opts.originalValue);
				} else {
					$(this).combo("setValue", opts.originalValue);
				}
			});
		},
		setText : function(jq, text) {
			return jq.each(function() {
				setComboText(this, text);
			});
		},
		getValues : function(jq) {
			return getComboValues(jq[0]);
		},
		setValues : function(jq, values) {
			return jq.each(function() {
				setComboValues(this, values);
			});
		},
		getValue : function(jq) {
			return getComboValue(jq[0]);
		},
		setValue : function(jq, value) {
			return jq.each(function() {
				setComboValue(this, value);
			});
		}
	};
	$.fn.combo.parseOptions = function(target) {
		var t = $(target);
		return $.extend( {}, $.fn.textbox.parseOptions(target), $.parser
				.parseOptions(target, [ "separator", "panelAlign", {
					panelWidth : "number",
					hasDownArrow : "boolean",
					delay : "number",
					selectOnNavigation : "boolean"
				}, {
					panelMinWidth : "number",
					panelMaxWidth : "number",
					panelMinHeight : "number",
					panelMaxHeight : "number"
				} ]), {
			panelHeight : (t.attr("panelHeight") == "auto" ? "auto"
					: parseInt(t.attr("panelHeight")) || undefined),
			multiple : (t.attr("multiple") ? true : undefined)
		});
	};
	$.fn.combo.defaults = $.extend( {}, $.fn.textbox.defaults, {
		inputEvents : {
			click : comboClickHander,
			keydown : comboKeyHandler,
			paste : comboKeyHandler,
			drop : comboKeyHandler
		},
		panelWidth : null,
		panelHeight : 200,
		panelMinWidth : null,
		panelMaxWidth : null,
		panelMinHeight : null,
		panelMaxHeight : null,
		panelAlign : "left",
		multiple : false,
		selectOnNavigation : true,
		separator : ",",
		hasDownArrow : true,
		delay : 200,
		keyHandler : {
			up : function(e) {
			},
			down : function(e) {
			},
			left : function(e) {
			},
			right : function(e) {
			},
			enter : function(e) {
			},
			query : function(q, e) {
			}
		},
		onShowPanel : function() {
		},
		onHidePanel : function() {
		},
		onChange : function(newvalue, oldvalue) {
		}
	});
})(jQuery);
//combobox
(function($){
	var COMBOBOX_SERNO = 0;
	function getRowIndex(target, value){
		var state = $.data(target, 'combobox');
		var opts = state.options;
		var data = state.data;
		for(var i=0; i<data.length; i++){
			if (data[i][opts.valueField] == value){
				return i;
			}
		}
		return -1;
	}
	function scrollTo(target, value){
		var opts = $.data(target, 'combobox').options;
		var panel = $(target).combo('panel');
		var item = opts.finder.getEl(target, value);
		if (item.length){
			if (item.position().top <= 0){
				var h = panel.scrollTop() + item.position().top;
				panel.scrollTop(h);
			} else if (item.position().top + item.outerHeight() > panel.height()){
				var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
				panel.scrollTop(h);
			}
		}
	}
	function nav(target, dir){
		var opts = $.data(target, 'combobox').options;
		var panel = $(target).combobox('panel');
		var item = panel.children('div.combobox-item-hover');
		if (!item.length){
			item = panel.children('div.combobox-item-selected');
		}
		item.removeClass('combobox-item-hover');
		var firstSelector = 'div.combobox-item:visible:not(.combobox-item-disabled):first';
		var lastSelector = 'div.combobox-item:visible:not(.combobox-item-disabled):last';
		if (!item.length){
			item = panel.children(dir=='next' ? firstSelector : lastSelector);
//			item = panel.children('div.combobox-item:visible:' + (dir=='next'?'first':'last'));
		} else {
			if (dir == 'next'){
				item = item.nextAll(firstSelector);
//				item = item.nextAll('div.combobox-item:visible:first');
				if (!item.length){
					item = panel.children(firstSelector);
//					item = panel.children('div.combobox-item:visible:first');
				}
			} else {
				item = item.prevAll(firstSelector);
//				item = item.prevAll('div.combobox-item:visible:first');
				if (!item.length){
					item = panel.children(lastSelector);
//					item = panel.children('div.combobox-item:visible:last');
				}
			}
		}
		if (item.length){
			item.addClass('combobox-item-hover');
			var row = opts.finder.getRow(target, item);
			if (row){
				scrollTo(target, row[opts.valueField]);
				if (opts.selectOnNavigation){
					select(target, row[opts.valueField]);
				}
			}
		}
	}
	function select(target, value){
		var opts = $.data(target, 'combobox').options;
		var values = $(target).combo('getValues');
		if ($.inArray(value+'', values) == -1){
			if (opts.multiple){
				values.push(value);
			} else {
				values = [value];
			}
			setValues(target, values);
			opts.onSelect.call(target, opts.finder.getRow(target, value));
		}
	}
	function unselect(target, value){
		var opts = $.data(target, 'combobox').options;
		var values = $(target).combo('getValues');
		var index = $.inArray(value+'', values);
		if (index >= 0){
			values.splice(index, 1);
			setValues(target, values);
			opts.onUnselect.call(target, opts.finder.getRow(target, value));
		}
	}
	function setValues(target, values, remainText){
		var opts = $.data(target, 'combobox').options;
		var panel = $(target).combo('panel');
		panel.find('div.combobox-item-selected').removeClass('combobox-item-selected');
		var vv = [], ss = [];
		for(var i=0; i<values.length; i++){
			var v = values[i];
			var s = v;
			opts.finder.getEl(target, v).addClass('combobox-item-selected');
			var row = opts.finder.getRow(target, v);
			if (row){
				s = row[opts.textField];
			}
			vv.push(v);
			ss.push(s);
		}
		$(target).combo('setValues', vv);
		if (!remainText){
			$(target).combo('setText', ss.join(opts.separator));
		}
	}
	function loadData(target, data, remainText){
		var state = $.data(target, 'combobox');
		var opts = state.options;
		state.data = opts.loadFilter.call(target, data);
		state.groups = [];
		data = state.data;
		var selected = $(target).combobox('getValues');
		var dd = [];
		var group = undefined;
		for(var i=0; i<data.length; i++){
			var row = data[i];
			var v = row[opts.valueField]+'';
			var s = row[opts.textField];
			var g = row[opts.groupField];
			if (g){
				if (group != g){
					group = g;
					state.groups.push(g);
					dd.push('<div id="' + (state.groupIdPrefix+'_'+(state.groups.length-1)) + '" class="combobox-group">');
					dd.push(opts.groupFormatter ? opts.groupFormatter.call(target, g) : g);
					dd.push('</div>');
				}
			} else {
				group = undefined;
			}
			var cls = 'combobox-item' + (row.disabled ? ' combobox-item-disabled' : '') + (g ? ' combobox-gitem' : '');
			dd.push('<div id="' + (state.itemIdPrefix+'_'+i) + '" class="' + cls + '">');
			dd.push(opts.formatter ? opts.formatter.call(target, row) : s);
			dd.push('</div>');
//			if (item['selected']){
//				(function(){
//					for(var i=0; i<selected.length; i++){
//						if (v == selected[i]) return;
//					}
//					selected.push(v);
//				})();
//			}
			if (row['selected'] && $.inArray(v, selected) == -1){
				selected.push(v);
			}
		}
		$(target).combo('panel').html(dd.join(''));
		if (opts.multiple){
			setValues(target, selected, remainText);
		} else {
			setValues(target, selected.length ? [selected[selected.length-1]] : [], remainText);
		}
		opts.onLoadSuccess.call(target, data);
	}
	function request(target, url, param, remainText){
		var opts = $.data(target, 'combobox').options;
		if (url){
			opts.url = url;
		}
//		if (!opts.url) return;
		param = param || {};
		if (opts.onBeforeLoad.call(target, param) == false) return;
		opts.loader.call(target, param, function(data){
			loadData(target, data, remainText);
		}, function(){
			opts.onLoadError.apply(this, arguments);
		});
	}
	function doQuery(target, q){
		var state = $.data(target, 'combobox');
		var opts = state.options;
		if (opts.multiple && !q){
			setValues(target, [], true);
		} else {
			setValues(target, [q], true);
		}
		if (opts.mode == 'remote'){
			request(target, null, {q:q}, true);
		} else {
			var panel = $(target).combo('panel');
			panel.find('div.combobox-item-selected,div.combobox-item-hover').removeClass('combobox-item-selected combobox-item-hover');
			panel.find('div.combobox-item,div.combobox-group').hide();
			var data = state.data;
			var vv = [];
			var qq = opts.multiple ? q.split(opts.separator) : [q];
			$.map(qq, function(q){
				q = $.trim(q);
				var group = undefined;
				for(var i=0; i<data.length; i++){
					var row = data[i];
					if (opts.filter.call(target, q, row)){
						var v = row[opts.valueField];
						var s = row[opts.textField];
						var g = row[opts.groupField];
						var item = opts.finder.getEl(target, v).show();
						if (s.toLowerCase() == q.toLowerCase()){
							vv.push(v);
							item.addClass('combobox-item-selected');
						}
						if (opts.groupField && group != g){
							$('#'+state.groupIdPrefix+'_'+$.inArray(g, state.groups)).show();
							group = g;
						}
					}
				}
			});
			setValues(target, vv, true);
		}
	}
	function doEnter(target){
		var t = $(target);
		var opts = t.combobox('options');
		var panel = t.combobox('panel');
		var item = panel.children('div.combobox-item-hover');
		if (item.length){
			var row = opts.finder.getRow(target, item);
			var value = row[opts.valueField];
			if (opts.multiple){
				if (item.hasClass('combobox-item-selected')){
					t.combobox('unselect', value);
				} else {
					t.combobox('select', value);
				}
			} else {
				t.combobox('select', value);
			}
		}
		var vv = [];
		$.map(t.combobox('getValues'), function(v){
			if (getRowIndex(target, v) >= 0){
				vv.push(v);
			}
		});
		t.combobox('setValues', vv);
		if (!opts.multiple){
			t.combobox('hidePanel');
		}
	}
	function create(target){
		var state = $.data(target, 'combobox');
		var opts = state.options;
		COMBOBOX_SERNO++;
		state.itemIdPrefix = '_mwsmartui_combobox_i' + COMBOBOX_SERNO;
		state.groupIdPrefix = '_mwsmartui_combobox_g' + COMBOBOX_SERNO;
		$(target).addClass('combobox-f');
		$(target).combo($.extend({}, opts, {
			onShowPanel: function(){
				$(target).combo('panel').find('div.combobox-item,div.combobox-group').show();
				scrollTo(target, $(target).combobox('getValue'));
				opts.onShowPanel.call(target);
			}
		}));
		$(target).combo('panel').unbind().bind('mouseover', function(e){
			$(this).children('div.combobox-item-hover').removeClass('combobox-item-hover');
			var item = $(e.target).closest('div.combobox-item');
			if (!item.hasClass('combobox-item-disabled')){
				item.addClass('combobox-item-hover');
			}
			e.stopPropagation();
		}).bind('mouseout', function(e){
			$(e.target).closest('div.combobox-item').removeClass('combobox-item-hover');
			e.stopPropagation();
		}).bind('click', function(e){
			var item = $(e.target).closest('div.combobox-item');
			if (!item.length || item.hasClass('combobox-item-disabled')){return}
			var row = opts.finder.getRow(target, item);
			if (!row){return}
			var value = row[opts.valueField];
			if (opts.multiple){
				if (item.hasClass('combobox-item-selected')){
					unselect(target, value);
				} else {
					select(target, value);
				}
			} else {
				select(target, value);
				$(target).combo('hidePanel');
			}
			e.stopPropagation();
		});
	}
	$.fn.combobox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combobox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combobox');
			if (state){
				$.extend(state.options, options);
				create(this);
			} else {
				state = $.data(this, 'combobox', {
					options: $.extend({}, $.fn.combobox.defaults, $.fn.combobox.parseOptions(this), options),
					data: []
				});
				create(this);
				var data = $.fn.combobox.parseData(this);
				if (data.length){
					loadData(this, data);
				}
			}
			if (state.options.data){
				loadData(this, state.options.data);
			}
			request(this);
		});
	};
	$.fn.combobox.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'combobox').options, {
				width: copts.width,
				height: copts.height,
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		getData: function(jq){
			return $.data(jq[0], 'combobox').data;
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValues(this, [value]);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				$(this).combo('clear');
				var panel = $(this).combo('panel');
				panel.find('div.combobox-item-selected').removeClass('combobox-item-selected');
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).combobox('options');
				if (opts.multiple){
					$(this).combobox('setValues', opts.originalValue);
				} else {
					$(this).combobox('setValue', opts.originalValue);
				}
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, data);
			});
		},
		reload: function(jq, url){
			return jq.each(function(){
				request(this, url);
			});
		},
		select: function(jq, value){
			return jq.each(function(){
				select(this, value);
			});
		},
		unselect: function(jq, value){
			return jq.each(function(){
				unselect(this, value);
			});
		}
	};
	$.fn.combobox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.combo.parseOptions(target), $.parser.parseOptions(target,[
			'valueField','textField','groupField','mode','method','url'
		]));
	};
	$.fn.combobox.parseData = function(target){
		var data = [];
		var opts = $(target).combobox('options');
		$(target).children().each(function(){
			if (this.tagName.toLowerCase() == 'optgroup'){
				var group = $(this).attr('label');
				$(this).children().each(function(){
					_parseItem(this, group);
				});
			} else {
				_parseItem(this);
			}
		});
		return data;
		function _parseItem(el, group){
			var t = $(el);
			var row = {};
			row[opts.valueField] = t.attr('value')!=undefined ? t.attr('value') : t.text();
			row[opts.textField] = t.text();
			row['selected'] = t.is(':selected');
			row['disabled'] = t.is(':disabled');
			if (group){
				opts.groupField = opts.groupField || 'group';
				row[opts.groupField] = group;
			}
			data.push(row);
		}
	};
	$.fn.combobox.defaults = $.extend({}, $.fn.combo.defaults, {
		valueField: 'value',
		textField: 'text',
		groupField: null,
		groupFormatter: function(group){return group;},
		mode: 'local',	// or 'remote'
		method: 'post',
		url: null,
		data: null,
		keyHandler: {
			up: function(e){nav(this,'prev');e.preventDefault()},
			down: function(e){nav(this,'next');e.preventDefault()},
			left: function(e){},
			right: function(e){},
			enter: function(e){doEnter(this)},
			query: function(q,e){doQuery(this, q)}
		},
		filter: function(q, row){
			var opts = $(this).combobox('options');
			return row[opts.textField].toLowerCase().indexOf(q.toLowerCase()) == 0;
		},
		formatter: function(row){
			var opts = $(this).combobox('options');
			return row[opts.textField];
		},
		loader: function(param, success, error){
			var opts = $(this).combobox('options');
			if (!opts.url) return false;
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					success(data);
				},
				error: function(){
					error.apply(this, arguments);
				}
			});
		},
		loadFilter: function(data){
			return data;
		},
		finder:{
			getEl:function(target, value){
				var index = getRowIndex(target, value);
				var id = $.data(target, 'combobox').itemIdPrefix + '_' + index;
				return $('#'+id);
			},
			getRow:function(target, p){
				var state = $.data(target, 'combobox');
				var index = (p instanceof jQuery) ? p.attr('id').substr(state.itemIdPrefix.length+1) : getRowIndex(target, p);
				return state.data[parseInt(index)];
			}
		},
		onBeforeLoad: function(param){},
		onLoadSuccess: function(){},
		onLoadError: function(){},
		onSelect: function(record){},
		onUnselect: function(record){}
	});
})(jQuery);
//tree
(function($) {
	function wrapTree(target) {
		var tree = $(target);
		tree.addClass("tree");
		return tree;
	}
	;
	function bindEvents(target) {
		var opts = $.data(target, "tree").options;
		$(target).unbind().bind("mouseover", function(e) {
			var tt = $(e.target);
			var ndom = tt.closest("div.tree-node");
			if (!ndom.length) {
				return;
			}
			ndom.addClass("tree-node-hover");
			if (tt.hasClass("tree-hit")) {
				if (tt.hasClass("tree-expanded")) {
					tt.addClass("tree-expanded-hover");
				} else {
					tt.addClass("tree-collapsed-hover");
				}
			}
			e.stopPropagation();
		}).bind("mouseout", function(e) {
			var tt = $(e.target);
			var ndom = tt.closest("div.tree-node");
			if (!ndom.length) {
				return;
			}
			ndom.removeClass("tree-node-hover");
			if (tt.hasClass("tree-hit")) {
				if (tt.hasClass("tree-expanded")) {
					tt.removeClass("tree-expanded-hover");
				} else {
					tt.removeClass("tree-collapsed-hover");
				}
			}
			e.stopPropagation();
		}).bind("click", function(e) {
			var tt = $(e.target);
			var ndom = tt.closest("div.tree-node");
			if (!ndom.length) {
				return;
			}
			if (tt.hasClass("tree-hit")) {
				toogleNode(target, ndom[0]);
				return false;
			} else {
				if (tt.hasClass("tree-checkbox")) {
					checkNode(target, ndom[0], !tt.hasClass("tree-checkbox1"));
					return false;
				} else {
					selectNode(target, ndom[0]);
					opts.onClick.call(target, getNode(target, ndom[0]));
				}
			}
			e.stopPropagation();
		}).bind("dblclick", function(e) {
			var ndom = $(e.target).closest("div.tree-node");
			if (!ndom.length) {
				return;
			}
			selectNode(target, ndom[0]);
			opts.onDblClick.call(target, getNode(target, ndom[0]));
			e.stopPropagation();
		}).bind("contextmenu", function(e) {
			var ndom = $(e.target).closest("div.tree-node");
			if (!ndom.length) {
				return;
			}
			opts.onContextMenu.call(target, e, getNode(target, ndom[0]));
			e.stopPropagation();
		});
	}
	;
	function disableDnd(target) {
		var opts = $.data(target, "tree").options;
		opts.dnd = false;
		var nodes = $(target).find("div.tree-node");
		nodes.draggable("disable");
		nodes.css("cursor", "pointer");
	}
	;
	function enableDnd(target) {
		var tree = $.data(target, "tree");
		var opts = tree.options;
		var jqTree = tree.tree;
		tree.disabledNodes = [];
		opts.dnd = true;
		jqTree
				.find("div.tree-node")
				.draggable(
						{
							disabled : false,
							revert : true,
							cursor : "pointer",
							proxy : function(source) {
								var p = $(
										"<div class=\"tree-node-proxy\"></div>")
										.appendTo("body");
								p
										.html("<span class=\"tree-dnd-icon tree-dnd-no\">&nbsp;</span>"
												+ $(source).find(".tree-title")
														.html());
								p.hide();
								return p;
							},
							deltaX : 15,
							deltaY : 15,
							onBeforeDrag : function(e) {
								if (opts.onBeforeDrag.call(target, getNode(target, this)) == false) {
									return false;
								}
								if ($(e.target).hasClass("tree-hit")
										|| $(e.target)
												.hasClass("tree-checkbox")) {
									return false;
								}
								if (e.which != 1) {
									return false;
								}
								$(this).next("ul").find("div.tree-node")
										.droppable( {
											accept : "no-accept"
										});
								var indents = $(this).find("span.tree-indent");
								if (indents.length) {
									e.data.offsetWidth -= indents.length
											* indents.width();
								}
							},
							onStartDrag : function() {
								$(this).draggable("proxy").css( {
									left : -10000,
									top : -10000
								});
								opts.onStartDrag.call(target, getNode(target, this));
								var node = getNode(target, this);
								if (node.id == undefined) {
									node.id = "mwsmartui_tree_node_id_temp";
									updateNode(target, node);
								}
								tree.draggingNodeId = node.id;
							},
							onDrag : function(e) {
								var x1 = e.pageX, y1 = e.pageY, x2 = e.data.startX, y2 = e.data.startY;
								var d = Math.sqrt((x1 - x2) * (x1 - x2)
										+ (y1 - y2) * (y1 - y2));
								if (d > 3) {
									$(this).draggable("proxy").show();
								}
								this.pageY = e.pageY;
							},
							onStopDrag : function() {
								$(this).next("ul").find("div.tree-node")
										.droppable( {
											accept : "div.tree-node"
										});
								for ( var i = 0; i < tree.disabledNodes.length; i++) {
									$(tree.disabledNodes[i]).droppable("enable");
								}
								tree.disabledNodes = [];
								var dragNode = findNode(target, tree.draggingNodeId);
								if (dragNode && dragNode.id == "mwsmartui_tree_node_id_temp") {
									dragNode.id = "";
									updateNode(target, dragNode);
								}
								opts.onStopDrag.call(target, dragNode);
							}
						})
				.droppable(
						{
							accept : "div.tree-node",
							onDragEnter : function(e, source) {
								if (opts.onDragEnter.call(target, this, popOrGetData(source)) == false) {
									setDndCls(source, false);
									$(this)
											.removeClass(
													"tree-node-append tree-node-top tree-node-bottom");
									$(this).droppable("disable");
									tree.disabledNodes.push(this);
								}
							},
							onDragOver : function(e, source) {
								if ($(this).droppable("options").disabled) {
									return;
								}
								var sy = source.pageY;
								var top = $(this).offset().top;
								var dy = top + $(this).outerHeight();
								setDndCls(source, true);
								$(this)
										.removeClass(
												"tree-node-append tree-node-top tree-node-bottom");
								if (sy > top + (dy - top) / 2) {
									if (dy - sy < 5) {
										$(this).addClass("tree-node-bottom");
									} else {
										$(this).addClass("tree-node-append");
									}
								} else {
									if (sy - top < 5) {
										$(this).addClass("tree-node-top");
									} else {
										$(this).addClass("tree-node-append");
									}
								}
								if (opts.onDragOver.call(target, this, popOrGetData(source)) == false) {
									setDndCls(source, false);
									$(this)
											.removeClass(
													"tree-node-append tree-node-top tree-node-bottom");
									$(this).droppable("disable");
									tree.disabledNodes.push(this);
								}
							},
							onDragLeave : function(e, source) {
								setDndCls(source, false);
								$(this)
										.removeClass(
												"tree-node-append tree-node-top tree-node-bottom");
								opts.onDragLeave.call(target, this, popOrGetData(source));
							},
							onDrop : function(e, source) {
								var me = this;
								var doDrop, point;
								if ($(this).hasClass("tree-node-append")) {
									doDrop = appendForDnd;
									point = "append";
								} else {
									doDrop = insertForDnd;
									point = $(this).hasClass("tree-node-top") ? "top"
											: "bottom";
								}
								if (opts.onBeforeDrop.call(target, me, popOrGetData(source),
										point) == false) {
									$(this)
											.removeClass(
													"tree-node-append tree-node-top tree-node-bottom");
									return;
								}
								doDrop(source, me, point);
								$(this)
										.removeClass(
												"tree-node-append tree-node-top tree-node-bottom");
							}
						});
		function popOrGetData(dom, pop) {
			return $(dom).closest("ul.tree").tree(pop ? "pop" : "getData", dom);
		}
		;
		function setDndCls(dom, canDrop) {
			var pxy = $(dom).draggable("proxy").find("span.tree-dnd-icon");
			pxy.removeClass("tree-dnd-yes tree-dnd-no").addClass(
					canDrop ? "tree-dnd-yes" : "tree-dnd-no");
		}
		;
		function appendForDnd(srcDom, dstDom) {
			if (getNode(target, dstDom).state == "closed") {
				expandNode(target, dstDom, function() {
					doAppend();
				});
			} else {
				doAppend();
			}
			function doAppend() {
				var srcData = popOrGetData(srcDom, true);
				$(target).tree("append", {
					parent : dstDom,
					data : [ srcData ]
				});
				opts.onDrop.call(target, dstDom, srcData, "append");
			}
			;
		}
		;
		function insertForDnd(srcDom, dstDom, p) {
			var param = {};
			if (p == "top") {
				param.before = dstDom;
			} else {
				param.after = dstDom;
			}
			var srcData = popOrGetData(srcDom, true);
			param.data = srcData;
			$(target).tree("insert", param);
			opts.onDrop.call(target, dstDom, srcData, p);
		}
		;
	}
	;
	function checkNode(target, dom, isChecked) {
		var opts = $.data(target, "tree").options;
		if (!opts.checkbox) {
			return;
		}
		var node = getNode(target, dom);
		if (opts.onBeforeCheck.call(target, node, isChecked) == false) {
			return;
		}
		var jqDom = $(dom);
		var ck = jqDom.find(".tree-checkbox");
		ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
		if (isChecked) {
			ck.addClass("tree-checkbox1");
		} else {
			ck.addClass("tree-checkbox0");
		}
		if (opts.cascadeCheck) {
			checkParent(jqDom);
			_3c(jqDom);
		}
		opts.onCheck.call(target, node, isChecked);
		function _3c(jqd) {
			var _3e = jqd.next().find(".tree-checkbox");
			_3e.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
			if (jqd.find(".tree-checkbox").hasClass("tree-checkbox1")) {
				_3e.addClass("tree-checkbox1");
			} else {
				_3e.addClass("tree-checkbox0");
			}
		}
		;
		function checkParent(jqd) {
			var pNode = getParentNode(target, jqd[0]);
			if (pNode) {
				var ck = $(pNode.target).find(".tree-checkbox");
				ck.removeClass("tree-checkbox0 tree-checkbox1 tree-checkbox2");
				if (allChildrenChecked(jqd)) {
					ck.addClass("tree-checkbox1");
				} else {
					if (allChildrenUnChecked(jqd)) {
						ck.addClass("tree-checkbox0");
					} else {
						ck.addClass("tree-checkbox2");
					}
				}
				checkParent($(pNode.target));
			}
			function allChildrenChecked(n) {
				var ck = n.find(".tree-checkbox");
				if (ck.hasClass("tree-checkbox0")
						|| ck.hasClass("tree-checkbox2")) {
					return false;
				}
				var b = true;
				n.parent().siblings().each(
						function() {
							if (!$(this).children("div.tree-node").children(
									".tree-checkbox")
									.hasClass("tree-checkbox1")) {
								b = false;
							}
						});
				return b;
			}
			;
			function allChildrenUnChecked(n) {
				var ck = n.find(".tree-checkbox");
				if (ck.hasClass("tree-checkbox1")
						|| ck.hasClass("tree-checkbox2")) {
					return false;
				}
				var b = true;
				n.parent().siblings().each(
						function() {
							if (!$(this).children("div.tree-node").children(
									".tree-checkbox")
									.hasClass("tree-checkbox0")) {
								b = false;
							}
						});
				return b;
			}
			;
		}
		;
	}
	;
	function reCheckNode(target, dom) {
		var opts = $.data(target, "tree").options;
		if (!opts.checkbox) {
			return;
		}
		var jqdom = $(dom);
		if (isLeaf(target, dom)) {
			var ck = jqdom.find(".tree-checkbox");
			if (ck.length) {
				if (ck.hasClass("tree-checkbox1")) {
					checkNode(target, dom, true);
				} else {
					checkNode(target, dom, false);
				}
			} else {
				if (opts.onlyLeafCheck) {
					$("<span class=\"tree-checkbox tree-checkbox0\"></span>")
							.insertBefore(jqdom.find(".tree-title"));
				}
			}
		} else {
			var ck = jqdom.find(".tree-checkbox");
			if (opts.onlyLeafCheck) {
				ck.remove();
			} else {
				if (ck.hasClass("tree-checkbox1")) {
					checkNode(target, dom, true);
				} else {
					if (ck.hasClass("tree-checkbox2")) {
						var allChecked = true;
						var allUnchecked = true;
						var childNodes = getChildrenNodes(target, dom);
						for ( var i = 0; i < childNodes.length; i++) {
							if (childNodes[i].checked) {
								allUnchecked = false;
							} else {
								allChecked = false;
							}
						}
						if (allChecked) {
							checkNode(target, dom, true);
						}
						if (allUnchecked) {
							checkNode(target, dom, false);
						}
					}
				}
			}
		}
	}
	;
	function loadData(target, ul, data, isAppend) {
		var tree = $.data(target, "tree");
		var opts = tree.options;
		var divs = $(ul).prevAll("div.tree-node:first");
		data = opts.loadFilter.call(target, data, divs[0]);
		var node = findNodeByAttr(target, "domId", divs.attr("id"));
		if (!isAppend) {
			node ? node.children = data : tree.data = data;
			$(ul).empty();
		} else {
			if (node) {
				node.children ? node.children = node.children.concat(data)
						: node.children = data;
			} else {
				tree.data = tree.data.concat(data);
			}
		}
		opts.view.render.call(opts.view, target, ul, data);
		if (opts.dnd) {
			enableDnd(target);
		}
		if (node) {
			updateNode(target, node);
		}
		var uncheckedItem = [];
		var checkedItem = [];
		for ( var i = 0; i < data.length; i++) {
			var item = data[i];
			if (!item.checked) {
				uncheckedItem.push(item);
			}
		}
		traverse(data, function(dt) {
			if (dt.checked) {
				checkedItem.push(dt);
			}
		});
		var oncheck = opts.onCheck;
		opts.onCheck = function() {
		};
		if (uncheckedItem.length) {
			checkNode(target, $("#" + uncheckedItem[0].domId)[0], false);
		}
		for ( var i = 0; i < checkedItem.length; i++) {
			checkNode(target, $("#" + checkedItem[i].domId)[0], true);
		}
		opts.onCheck = oncheck;
		setTimeout(function() {
			setLine(target, target);
		}, 0);
		opts.onLoadSuccess.call(target, node, data);
	}
	;
	function setLine(target, ul, ignoreRoot) {
		var opts = $.data(target, "tree").options;
		if (opts.lines) {
			$(target).addClass("tree-lines");
		} else {
			$(target).removeClass("tree-lines");
			return;
		}
		if (!ignoreRoot) {
			ignoreRoot = true;
			$(target).find("span.tree-indent").removeClass(
					"tree-line tree-join tree-joinbottom");
			$(target).find("div.tree-node").removeClass(
					"tree-node-last tree-root-first tree-root-one");
			var rootNodes = $(target).tree("getRoots");
			if (rootNodes.length > 1) {
				$(rootNodes[0].target).addClass("tree-root-first");
			} else {
				if (rootNodes.length == 1) {
					$(rootNodes[0].target).addClass("tree-root-one");
				}
			}
		}
		$(ul).children("li").each(function() {
			var divs = $(this).children("div.tree-node");
			var ul = divs.next("ul");
			if (ul.length) {
				if ($(this).next().length) {
					setChildNodeLine(divs);
				}
				setLine(target, ul, ignoreRoot);
			} else {
				setNodeLine(divs);
			}
		});
		var lastNode = $(ul).children("li:last").children("div.tree-node").addClass(
				"tree-node-last");
		lastNode.children("span.tree-join").removeClass("tree-join").addClass(
				"tree-joinbottom");
		function setNodeLine(dv) {
			var t = dv.find("span.tree-icon");
			t.prev("span.tree-indent").addClass("tree-join");
		}
		;
		function setChildNodeLine(dv) {
			var indents = dv.find("span.tree-indent, span.tree-hit").length;
			dv.next().find("div.tree-node").each(
					function() {
						$(this).children("span:eq(" + (indents - 1) + ")")
								.addClass("tree-line");
					});
		}
		;
	}
	;
	function loadRemoteData(target, ul, queryParam, onFinished) {
		var opts = $.data(target, "tree").options;
		queryParam = $.extend( {}, opts.queryParams, queryParam || {});
		var node = null;
		if (target != ul) {
			var dom = $(ul).prev();
			node = getNode(target, dom[0]);
		}
		if (opts.onBeforeLoad.call(target, node, queryParam) == false) {
			return;
		}
		var fs = $(ul).prev().children("span.tree-folder");
		fs.addClass("tree-loading");
		var result = opts.loader.call(target, queryParam, function(data) {
			fs.removeClass("tree-loading");
			loadData(target, ul, data);
			if (onFinished) {
				onFinished();
			}
		}, function() {
			fs.removeClass("tree-loading");
			opts.onLoadError.apply(target, arguments);
			if (onFinished) {
				onFinished();
			}
		});
		if (result == false) {
			fs.removeClass("tree-loading");
		}
	}
	;
	function expandNode(target, dom, callback) {
		var opts = $.data(target, "tree").options;
		var hit = $(dom).children("span.tree-hit");
		if (hit.length == 0) {
			return;
		}
		if (hit.hasClass("tree-expanded")) {
			return;
		}
		var node = getNode(target, dom);
		if (opts.onBeforeExpand.call(target, node) == false) {
			return;
		}
		hit.removeClass("tree-collapsed tree-collapsed-hover").addClass(
				"tree-expanded");
		hit.next().addClass("tree-folder-open");
		var ul = $(dom).next();
		if (ul.length) {
			if (opts.animate) {
				ul.slideDown("normal", function() {
					node.state = "open";
					opts.onExpand.call(target, node);
					if (callback) {
						callback();
					}
				});
			} else {
				ul.css("display", "block");
				node.state = "open";
				opts.onExpand.call(target, node);
				if (callback) {
					callback();
				}
			}
		} else {
			var nul = $("<ul style=\"display:none\"></ul>").insertAfter(dom);
			loadRemoteData(target, nul[0], {
				id : node.id
			}, function() {
				if (nul.is(":empty")) {
					nul.remove();
				}
				if (opts.animate) {
					nul.slideDown("normal", function() {
						node.state = "open";
						opts.onExpand.call(target, node);
						if (callback) {
							callback();
						}
					});
				} else {
					nul.css("display", "block");
					node.state = "open";
					opts.onExpand.call(target, node);
					if (callback) {
						callback();
					}
				}
			});
		}
	}
	;
	function collapseNode(target, dom) {
		var opts = $.data(target, "tree").options;
		var hit = $(dom).children("span.tree-hit");
		if (hit.length == 0) {
			return;
		}
		if (hit.hasClass("tree-collapsed")) {
			return;
		}
		var node = getNode(target, dom);
		if (opts.onBeforeCollapse.call(target, node) == false) {
			return;
		}
		hit.removeClass("tree-expanded tree-expanded-hover").addClass(
				"tree-collapsed");
		hit.next().removeClass("tree-folder-open");
		var ul = $(dom).next();
		if (opts.animate) {
			ul.slideUp("normal", function() {
				node.state = "closed";
				opts.onCollapse.call(target, node);
			});
		} else {
			ul.css("display", "none");
			node.state = "closed";
			opts.onCollapse.call(target, node);
		}
	}
	;
	function toogleNode(target, dom) {
		var hit = $(dom).children("span.tree-hit");
		if (hit.length == 0) {
			return;
		}
		if (hit.hasClass("tree-expanded")) {
			collapseNode(target, dom);
		} else {
			expandNode(target, dom);
		}
	}
	;
	function expandAllNodes(target, dom) {
		var childNodes = getChildrenNodes(target, dom);
		if (dom) {
			childNodes.unshift(getNode(target, dom));
		}
		for ( var i = 0; i < childNodes.length; i++) {
			expandNode(target, childNodes[i].target);
		}
	}
	;
	function expandToNode(target, dom) {
		var ancestorNodes = [];
		var p = getParentNode(target, dom);
		while (p) {
			ancestorNodes.unshift(p);
			p = getParentNode(target, p.target);
		}
		for ( var i = 0; i < ancestorNodes.length; i++) {
			expandNode(target, ancestorNodes[i].target);
		}
	}
	;
	function scrollToNode(target, dom) {
		var c = $(target).parent();
		while (c[0].tagName != "BODY" && c.css("overflow-y") != "auto") {
			c = c.parent();
		}
		var n = $(dom);
		var nodeTop = n.offset().top;
		if (c[0].tagName != "BODY") {
			var parentTop = c.offset().top;
			if (nodeTop < parentTop) {
				c.scrollTop(c.scrollTop() + nodeTop - parentTop);
			} else {
				if (nodeTop + n.outerHeight() > parentTop + c.outerHeight() - 18) {
					c.scrollTop(c.scrollTop() + nodeTop + n.outerHeight() - parentTop
							- c.outerHeight() + 18);
				}
			}
		} else {
			c.scrollTop(nodeTop);
		}
	}
	;
	function collapseAllNodes(target, dom) {
		var childNodes = getChildrenNodes(target, dom);
		if (dom) {
			childNodes.unshift(getNode(target, dom));
		}
		for ( var i = 0; i < childNodes.length; i++) {
			collapseNode(target, childNodes[i].target);
		}
	}
	;
	function appendNode(target, param) {
		var pdom = $(param.parent);
		var data = param.data;
		if (!data) {
			return;
		}
		data = $.isArray(data) ? data : [ data ];
		if (!data.length) {
			return;
		}
		var ul;
		if (pdom.length == 0) {
			ul = $(target);
		} else {
			if (isLeaf(target, pdom[0])) {
				var sti = pdom.find("span.tree-icon");
				sti.removeClass("tree-file").addClass(
						"tree-folder tree-folder-open");
				var hit = $("<span class=\"tree-hit tree-expanded\"></span>")
						.insertBefore(sti);
				if (hit.prev().length) {
					hit.prev().remove();
				}
			}
			ul = pdom.next();
			if (!ul.length) {
				ul = $("<ul></ul>").insertAfter(pdom);
			}
		}
		loadData(target, ul[0], data, true);
		reCheckNode(target, ul.prev());
	}
	;
	function insertNode(target, param) {
		var ref = param.before || param.after;
		var pNode = getParentNode(target, ref);
		var data = param.data;
		if (!data) {
			return;
		}
		data = $.isArray(data) ? data : [ data ];
		if (!data.length) {
			return;
		}
		appendNode(target, {
			parent : (pNode ? pNode.target : null),
			data : data
		});
		var siblingNodes = pNode ? pNode.children : $(target).tree("getRoots");
		for ( var i = 0; i < siblingNodes.length; i++) {
			if (siblingNodes[i].domId == $(ref).attr("id")) {
				for ( var j = data.length - 1; j >= 0; j--) {
					siblingNodes.splice((param.before ? i : (i + 1)), 0, data[j]);
				}
				siblingNodes.splice(siblingNodes.length - data.length, data.length);
				break;
			}
		}
		var li = $();
		for ( var i = 0; i < data.length; i++) {
			li = li.add($("#" + data[i].domId).parent());
		}
		if (param.before) {
			li.insertBefore($(ref).parent());
		} else {
			li.insertAfter($(ref).parent());
		}
	}
	;
	function removeNode(target, dom) {
		var parentNode = del(dom);
		$(dom).parent().remove();
		if (parentNode) {
			if (!parentNode.children || !parentNode.children.length) {
				var parentDom = $(parentNode.target);
				parentDom.find(".tree-icon").removeClass("tree-folder").addClass(
						"tree-file");
				parentDom.find(".tree-hit").remove();
				$("<span class=\"tree-indent\"></span>").prependTo(parentDom);
				parentDom.next().remove();
			}
			updateNode(target, parentNode);
			reCheckNode(target, parentNode.target);
		}
		setLine(target, target);
		function del(dv) {
			var id = $(dv).attr("id");
			var pNode = getParentNode(target, dv);
			var cc = pNode ? pNode.children : $.data(target, "tree").data;
			for ( var i = 0; i < cc.length; i++) {
				if (cc[i].domId == id) {
					cc.splice(i, 1);
					break;
				}
			}
			return pNode;
		}
		;
	}
	;
	function updateNode(target, param) {
		var opts = $.data(target, "tree").options;
		var jqDom = $(param.target);
		var node = getNode(target, param.target);
		var originChecked = node.checked;
		if (node.iconCls) {
			jqDom.find(".tree-icon").removeClass(node.iconCls);
		}
		$.extend(node, param);
		jqDom.find(".tree-title").html(opts.formatter.call(target, node));
		if (node.iconCls) {
			jqDom.find(".tree-icon").addClass(node.iconCls);
		}
		if (originChecked != node.checked) {
			checkNode(target, param.target, node.checked);
		}
	}
	;
	function getRootNode(target, dom) {
		if (dom) {
			var p = getParentNode(target, dom);
			while (p) {
				dom = p.target;
				p = getParentNode(target, dom);
			}
			return getNode(target, dom);
		} else {
			var roots = getRootNodes(target);
			return roots.length ? roots[0] : null;
		}
	}
	;
	function getRootNodes(target) {
		var datas = $.data(target, "tree").data;
		for ( var i = 0; i < datas.length; i++) {
			wrapNode(datas[i]);
		}
		return datas;
	}
	;
	function getChildrenNodes(target, dom) {
		var ret = [];
		var n = getNode(target, dom);
		var datas = n ? n.children : $.data(target, "tree").data;
		traverse(datas, function(dt) {
			ret.push(wrapNode(dt));
		});
		return ret;
	}
	;
	function getParentNode(target, dom) {
		var p = $(dom).closest("ul").prevAll("div.tree-node:first");
		return getNode(target, p[0]);
	}
	;
	function getCheckedNodes(target, state) {
		state = state || "checked";
		if (!$.isArray(state)) {
			state = [ state ];
		}
		var cs = [];
		for ( var i = 0; i < state.length; i++) {
			var s = state[i];
			if (s == "checked") {
				cs.push("span.tree-checkbox1");
			} else {
				if (s == "unchecked") {
					cs.push("span.tree-checkbox0");
				} else {
					if (s == "indeterminate") {
						cs.push("span.tree-checkbox2");
					}
				}
			}
		}
		var nodes = [];
		$(target).find(cs.join(",")).each(function() {
			var dom = $(this).parent();
			nodes.push(getNode(target, dom[0]));
		});
		return nodes;
	}
	;
	function getSelectedNode(target) {
		var dom = $(target).find("div.tree-node-selected");
		return dom.length ? getNode(target, dom[0]) : null;
	}
	;
	function getData(target, dom) {
		var node = getNode(target, dom);
		if (node && node.children) {
			traverse(node.children, function(data) {
				wrapNode(data);
			});
		}
		return node;
	}
	;
	function getNode(target, dom) {
		return findNodeByAttr(target, "domId", $(dom).attr("id"));
	}
	;
	function findNode(target, id) {
		return findNodeByAttr(target, "id", id);
	}
	;
	function findNodeByAttr(target, attr, val) {
		var datas = $.data(target, "tree").data;
		var ret = null;
		traverse(datas, function(data) {
			if (data[attr] == val) {
				ret = wrapNode(data);
				return false;
			}
		});
		return ret;
	}
	;
	function wrapNode(data) {
		var d = $("#" + data.domId);
		data.target = d[0];
		data.checked = d.find(".tree-checkbox").hasClass("tree-checkbox1");
		return data;
	}
	;
	function traverse(nodes, onMatch) {
		var tmp = [];
		for ( var i = 0; i < nodes.length; i++) {
			tmp.push(nodes[i]);
		}
		while (tmp.length) {
			var node = tmp.shift();
			if (onMatch(node) == false) {
				return;
			}
			if (node.children) {
				for ( var i = node.children.length - 1; i >= 0; i--) {
					tmp.unshift(node.children[i]);
				}
			}
		}
	}
	;
	function selectNode(target, dom) {
		var opts = $.data(target, "tree").options;
		var node = getNode(target, dom);
		if (opts.onBeforeSelect.call(target, node) == false) {
			return;
		}
		$(target).find("div.tree-node-selected").removeClass("tree-node-selected");
		$(dom).addClass("tree-node-selected");
		opts.onSelect.call(target, node);
	}
	;
	function isLeaf(target, dom) {
		return $(dom).children("span.tree-hit").length == 0;
	}
	;
	function beginEditNode(target, dom) {
		var opts = $.data(target, "tree").options;
		var node = getNode(target, dom);
		if (opts.onBeforeEdit.call(target, node) == false) {
			return;
		}
		$(dom).css("position", "relative");
		var nt = $(dom).find(".tree-title");
		var wid = nt.outerWidth();
		nt.empty();
		var editor = $("<input class=\"tree-editor\">").appendTo(nt);
		editor.val(node.text).focus();
		editor.width(wid + 20);
		editor.height(document.compatMode == "CSS1Compat" ? (18 - (editor
				.outerHeight() - editor.height())) : 18);
		editor.bind("click", function(e) {
			return false;
		}).bind("mousedown", function(e) {
			e.stopPropagation();
		}).bind("mousemove", function(e) {
			e.stopPropagation();
		}).bind("keydown", function(e) {
			if (e.keyCode == 13) {
				endEditNode(target, dom);
				return false;
			} else {
				if (e.keyCode == 27) {
					cancelEditNode(target, dom);
					return false;
				}
			}
		}).bind("blur", function(e) {
			e.stopPropagation();
			endEditNode(target, dom);
		});
	}
	;
	function endEditNode(target, dom) {
		var opts = $.data(target, "tree").options;
		$(dom).css("position", "");
		var editor = $(dom).find("input.tree-editor");
		var val = editor.val();
		editor.remove();
		var node = getNode(target, dom);
		node.text = val;
		updateNode(target, node);
		opts.onAfterEdit.call(target, node);
	}
	;
	function cancelEditNode(target, dom) {
		var opts = $.data(target, "tree").options;
		$(dom).css("position", "");
		$(dom).find("input.tree-editor").remove();
		var node = getNode(target, dom);
		updateNode(target, node);
		opts.onCancelEdit.call(target, node);
	}
	;
	$.fn.tree = function(options, param) {
		if (typeof options == "string") {
			return $.fn.tree.methods[options](this, param);
		}
		var options = options || {};
		return this.each(function() {
			var tree = $.data(this, "tree");
			var opts;
			if (tree) {
				opts = $.extend(tree.options, options);
				tree.options = opts;
			} else {
				opts = $.extend( {}, $.fn.tree.defaults, $.fn.tree
						.parseOptions(this), options);
				$.data(this, "tree", {
					options : opts,
					tree : wrapTree(this),
					data : []
				});
				var data = $.fn.tree.parseData(this);
				if (data.length) {
					loadData(this, this, data);
				}
			}
			bindEvents(this);
			if (opts.data) {
				loadData(this, this, $.extend(true, [], opts.data));
			}
			loadRemoteData(this, this);
		});
	};
	$.fn.tree.methods = {
		options : function(jq) {
			return $.data(jq[0], "tree").options;
		},
		loadData : function(jq, data) {
			return jq.each(function() {
				loadData(this, this, data);
			});
		},
		getNode : function(jq, dom) {
			return getNode(jq[0], dom);
		},
		getData : function(jq, dom) {
			return getData(jq[0], dom);
		},
		reload : function(jq, dom) {
			return jq.each(function() {
				if (dom) {
					var jqdom = $(dom);
					var hit = jqdom.children("span.tree-hit");
					hit.removeClass("tree-expanded tree-expanded-hover")
							.addClass("tree-collapsed");
					jqdom.next().remove();
					expandNode(this, dom);
				} else {
					$(this).empty();
					loadRemoteData(this, this);
				}
			});
		},
		getRoot : function(jq, dom) {
			return getRootNode(jq[0], dom);
		},
		getRoots : function(jq) {
			return getRootNodes(jq[0]);
		},
		getParent : function(jq, dom) {
			return getParentNode(jq[0], dom);
		},
		getChildren : function(jq, dom) {
			return getChildrenNodes(jq[0], dom);
		},
		getChecked : function(jq, state) {
			return getCheckedNodes(jq[0], state);
		},
		getSelected : function(jq) {
			return getSelectedNode(jq[0]);
		},
		isLeaf : function(jq, dom) {
			return isLeaf(jq[0], dom);
		},
		find : function(jq, id) {
			return findNode(jq[0], id);
		},
		select : function(jq, dom) {
			return jq.each(function() {
				selectNode(this, dom);
			});
		},
		check : function(jq, dom) {
			return jq.each(function() {
				checkNode(this, dom, true);
			});
		},
		uncheck : function(jq, dom) {
			return jq.each(function() {
				checkNode(this, dom, false);
			});
		},
		collapse : function(jq, dom) {
			return jq.each(function() {
				collapseNode(this, dom);
			});
		},
		expand : function(jq, dom) {
			return jq.each(function() {
				expandNode(this, dom);
			});
		},
		collapseAll : function(jq, dom) {
			return jq.each(function() {
				collapseAllNodes(this, dom);
			});
		},
		expandAll : function(jq, dom) {
			return jq.each(function() {
				expandAllNodes(this, dom);
			});
		},
		expandTo : function(jq, dom) {
			return jq.each(function() {
				expandToNode(this, dom);
			});
		},
		scrollTo : function(jq, dom) {
			return jq.each(function() {
				scrollToNode(this, dom);
			});
		},
		toggle : function(jq, dom) {
			return jq.each(function() {
				toogleNode(this, dom);
			});
		},
		append : function(jq, param) {
			return jq.each(function() {
				appendNode(this, param);
			});
		},
		insert : function(jq, param) {
			return jq.each(function() {
				insertNode(this, param);
			});
		},
		remove : function(jq, dom) {
			return jq.each(function() {
				removeNode(this, dom);
			});
		},
		pop : function(jq, dom) {
			var node = jq.tree("getData", dom);
			jq.tree("remove", dom);
			return node;
		},
		update : function(jq, param) {
			return jq.each(function() {
				updateNode(this, param);
			});
		},
		enableDnd : function(jq) {
			return jq.each(function() {
				enableDnd(this);
			});
		},
		disableDnd : function(jq) {
			return jq.each(function() {
				disableDnd(this);
			});
		},
		beginEdit : function(jq, dom) {
			return jq.each(function() {
				beginEditNode(this, dom);
			});
		},
		endEdit : function(jq, dom) {
			return jq.each(function() {
				endEditNode(this, dom);
			});
		},
		cancelEdit : function(jq, dom) {
			return jq.each(function() {
				cancelEditNode(this, dom);
			});
		}
	};
	$.fn.tree.parseOptions = function(target) {
		var t = $(target);
		return $.extend( {}, $.parser.parseOptions(target, [ "url", "method", {
			checkbox : "boolean",
			cascadeCheck : "boolean",
			onlyLeafCheck : "boolean"
		}, {
			animate : "boolean",
			lines : "boolean",
			dnd : "boolean"
		} ]));
	};
	$.fn.tree.parseData = function(target) {
		var data = [];
		initData(data, $(target));
		return data;
		function initData(aa, tree) {
			tree.children("li").each(
					function() {
						var node = $(this);
						var item = $.extend( {}, $.parser.parseOptions(this, [
								"id", "iconCls", "state" ]), {
							checked : (node.attr("checked") ? true : undefined)
						});
						item.text = node.children("span").html();
						if (!item.text) {
							item.text = node.html();
						}
						var childNodes = node.children("ul");
						if (childNodes.length) {
							item.children = [];
							initData(item.children, childNodes);
						}
						aa.push(item);
					});
		}
		;
	};
	var idGenerator = 1;
	var defaultView = {
		render : function(target, ul, data) {
			var opts = $.data(target, "tree").options;
			var indents = $(ul).prev("div.tree-node").find(
					"span.tree-indent, span.tree-hit").length;
			var cc = renderNode(indents, data);
			$(ul).append(cc.join(""));
			function renderNode(indnts, nodes) {
				var cc = [];
				for ( var i = 0; i < nodes.length; i++) {
					var item = nodes[i];
					if (item.state != "open" && item.state != "closed") {
						item.state = "open";
					}
					item.domId = "_mwsmartui_tree_" + idGenerator++;
					cc.push("<li>");
					cc.push("<div id=\"" + item.domId
							+ "\" class=\"tree-node\">");
					for ( var j = 0; j < indnts; j++) {
						cc.push("<span class=\"tree-indent\"></span>");
					}
					var leafOpen = false;
					if (item.state == "closed") {
						cc
								.push("<span class=\"tree-hit tree-collapsed\"></span>");
						cc.push("<span class=\"tree-icon tree-folder "
								+ (item.iconCls ? item.iconCls : "")
								+ "\"></span>");
					} else {
						if (item.children && item.children.length) {
							cc
									.push("<span class=\"tree-hit tree-expanded\"></span>");
							cc
									.push("<span class=\"tree-icon tree-folder tree-folder-open "
											+ (item.iconCls ? item.iconCls : "")
											+ "\"></span>");
						} else {
							cc.push("<span class=\"tree-indent\"></span>");
							cc.push("<span class=\"tree-icon tree-file "
									+ (item.iconCls ? item.iconCls : "")
									+ "\"></span>");
							leafOpen = true;
						}
					}
					if (opts.checkbox) {
						// modify by : minghui.wang
						// 20151111
						if (!item.hiddenCheckBox && ( (!opts.onlyLeafCheck) || leafOpen) ) {
							cc
									.push("<span class=\"tree-checkbox tree-checkbox0\"></span>");
						}
					}
					cc.push("<span class=\"tree-title\">"
							+ opts.formatter.call(target, item) + "</span>");
					cc.push("</div>");
					if (item.children && item.children.length) {
						var tmp = renderNode(indnts + 1, item.children);
						cc.push("<ul style=\"display:"
								+ (item.state == "closed" ? "none" : "block")
								+ "\">");
						cc = cc.concat(tmp);
						cc.push("</ul>");
					}
					cc.push("</li>");
				}
				return cc;
			}
			;
		}
	};
	$.fn.tree.defaults = {
		url : null,
		method : "post",
		animate : false,
		checkbox : false,
		cascadeCheck : true,
		onlyLeafCheck : false,
		lines : false,
		dnd : false,
		data : null,
		queryParams : {},
		formatter : function(node) {
			return node.text;
		},
		loader : function(queryParam, onSuccess, onError) {
			var opts = $(this).tree("options");
			if (!opts.url) {
				return false;
			}
			$.ajax( {
				type : opts.method,
				url : opts.url,
				data : queryParam,
				dataType : "json",
				success : function(data) {
					onSuccess(data);
				},
				error : function() {
					onError.apply(this, arguments);
				}
			});
		},
		loadFilter : function(data, dom) {
			return data;
		},
		view : defaultView,
		onBeforeLoad : function(node, queryParam) {
		},
		onLoadSuccess : function(node, data) {
		},
		onLoadError : function() {
		},
		onClick : function(node) {
		},
		onDblClick : function(node) {
		},
		onBeforeExpand : function(node) {
		},
		onExpand : function(node) {
		},
		onBeforeCollapse : function(node) {
		},
		onCollapse : function(node) {
		},
		onBeforeCheck : function(node, isChecked) {
		},
		onCheck : function(node, isChecked) {
		},
		onBeforeSelect : function(node) {
		},
		onSelect : function(node) {
		},
		onContextMenu : function(e, node) {
		},
		onBeforeDrag : function(node) {
		},
		onStartDrag : function(node) {
		},
		onStopDrag : function(node) {
		},
		onDragEnter : function(target, source) {
		},
		onDragOver : function(target, source) {
		},
		onDragLeave : function(target, source) {
		},
		onBeforeDrop : function(target, source,point) {
		},
		onDrop : function(target, source,point) {
		},
		onBeforeEdit : function(node) {
		},
		onAfterEdit : function(node) {
		},
		onCancelEdit : function(node) {
		}
	};
})(jQuery);
//combotree
(function($) {
	function buildComboTree(target) {
		var combotree = $.data(target, "combotree");
		var opts = combotree.options;
		var cbtree = combotree.tree;
		$(target).addClass("combotree-f");
		$(target).combo(opts);
		var cbpanel = $(target).combo("panel");
		if (!cbtree) {
			cbtree = $("<ul></ul>").appendTo(cbpanel);
			$.data(target, "combotree").tree = cbtree;
		}
		cbtree.tree($.extend( {}, opts, {
			checkbox : opts.multiple,
			onLoadSuccess : function(node, data) {
				var values = $(target).combotree("getValues");
				if (opts.multiple) {
					var checkedNodes = cbtree.tree("getChecked");
					for ( var i = 0; i < checkedNodes.length; i++) {
						var id = checkedNodes[i].id;
						(function() {
							for ( var i = 0; i < values.length; i++) {
								if (id == values[i]) {
									return;
								}
							}
							values.push(id);
						})();
					}
				}
				var topts = $(this).tree("options");
				var onCheck = topts.onCheck;
				var onSelect = topts.onSelect;
				topts.onCheck = topts.onSelect = function() {
				};
				$(target).combotree("setValues", values);
				topts.onCheck = onCheck;
				topts.onSelect = onSelect;
				opts.onLoadSuccess.call(this, node, data);
			},
			onClick : function(node) {
				if (opts.multiple) {
					$(this).tree(node.checked ? "uncheck" : "check", node.target);
				} else {
					$(target).combo("hidePanel");
				}
				updateComboValuesFromTree(target);
				opts.onClick.call(this, node);
			},
			onCheck : function(node, checked) {
				updateComboValuesFromTree(target);
				opts.onCheck.call(this, node, checked);
			}
		}));
	}
	;
	function updateComboValuesFromTree(target) {
		var combotree = $.data(target, "combotree");
		var opts = combotree.options;
		var cbtree = combotree.tree;
		var vv = [], ss = [];
		if (opts.multiple) {
			var checkedNodes = cbtree.tree("getChecked");
			for ( var i = 0; i < checkedNodes.length; i++) {
				vv.push(checkedNodes[i].id);
				ss.push(checkedNodes[i].text);
			}
		} else {
			var selectedNodes = cbtree.tree("getSelected");
			if (selectedNodes) {
				vv.push(selectedNodes.id);
				ss.push(selectedNodes.text);
			}
		}
		$(target).combo("setValues", vv).combo("setText", ss.join(opts.separator));
	}
	;
	function setComboTreeValues(target, values) {
		var opts = $.data(target, "combotree").options;
		var tree = $.data(target, "combotree").tree;
		tree.find("span.tree-checkbox").addClass("tree-checkbox0").removeClass(
				"tree-checkbox1 tree-checkbox2");
		var vv = [], ss = [];
		for ( var i = 0; i < values.length; i++) {
			var v = values[i];
			var s = v;
			var node = tree.tree("find", v);
			if (node) {
				s = node.text;
				tree.tree("check", node.target);
				tree.tree("select", node.target);
			}
			vv.push(v);
			ss.push(s);
		}
		$(target).combo("setValues", vv).combo("setText", ss.join(opts.separator));
	}
	;
	$.fn.combotree = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.combotree.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "combotree");
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, "combotree", {
					options : $.extend( {}, $.fn.combotree.defaults,
							$.fn.combotree.parseOptions(this), options)
				});
			}
			buildComboTree(this);
		});
	};
	$.fn.combotree.methods = {
		options : function(jq) {
			var copts = jq.combo("options");
			return $.extend($.data(jq[0], "combotree").options, {
				width : copts.width,
				height : copts.height,
				originalValue : copts.originalValue,
				disabled : copts.disabled,
				readonly : copts.readonly
			});
		},
		tree : function(jq) {
			return $.data(jq[0], "combotree").tree;
		},
		loadData : function(jq, data) {
			return jq.each(function() {
				var opts = $.data(this, "combotree").options;
				opts.data = data;
				var cbtree = $.data(this, "combotree").tree;
				cbtree.tree("loadData", data);
			});
		},
		reload : function(jq, url) {
			return jq.each(function() {
				var opts = $.data(this, "combotree").options;
				var cbtree = $.data(this, "combotree").tree;
				if (url) {
					opts.url = url;
				}
				cbtree.tree( {
					url : opts.url
				});
			});
		},
		setValues : function(jq, values) {
			return jq.each(function() {
				setComboTreeValues(this, values);
			});
		},
		setValue : function(jq, value) {
			return jq.each(function() {
				setComboTreeValues(this, [ value ]);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				var cbtree = $.data(this, "combotree").tree;
				cbtree.find("div.tree-node-selected").removeClass(
						"tree-node-selected");
				var cc = cbtree.tree("getChecked");
				for ( var i = 0; i < cc.length; i++) {
					cbtree.tree("uncheck", cc[i].target);
				}
				$(this).combo("clear");
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var opts = $(this).combotree("options");
				if (opts.multiple) {
					$(this).combotree("setValues", opts.originalValue);
				} else {
					$(this).combotree("setValue", opts.originalValue);
				}
			});
		}
	};
	$.fn.combotree.parseOptions = function(target) {
		return $.extend( {}, $.fn.combo.parseOptions(target), $.fn.tree
				.parseOptions(target));
	};
	$.fn.combotree.defaults = $.extend( {}, $.fn.combo.defaults,
			$.fn.tree.defaults, {
				editable : false
			});
})(jQuery);
//combogrid
(function($) {
	function buildComboGrid(target) {
		var combogrid = $.data(target, "combogrid");
		var opts = combogrid.options;
		var cbgrid = combogrid.grid;
		$(target)
				.addClass("combogrid-f")
				.combo(
						$
								.extend(
										{},
										opts,
										{
											onShowPanel : function() {
												var p = $(this).combogrid(
														"panel");
												var pmarginHeight = p.outerHeight()
														- p.height();
												var pminHeight = p._size("minHeight");
												var pmaxHeight = p._size("maxHeight");
												$(this)
														.combogrid("grid")
														.datagrid(
																"resize",
																{
																	width : "100%",
																	height : (isNaN(parseInt(opts.panelHeight)) ? "auto"
																			: "100%"),
																	minHeight : (pminHeight ? pminHeight
																			- pmarginHeight
																			: ""),
																	maxHeight : (pmaxHeight ? pmaxHeight
																			- pmarginHeight
																			: "")
																});
												opts.onShowPanel.call(this);
											}
										}));
		var cbpanel = $(target).combo("panel");
		if (!cbgrid) {
			cbgrid = $("<table></table>").appendTo(cbpanel);
			combogrid.grid = cbgrid;
		}
		cbgrid.datagrid($.extend( {}, opts, {
			border : false,
			singleSelect : (!opts.multiple),
			onLoadSuccess : function(data) {
				var values = $(target).combo("getValues");
				var onSelect = opts.onSelect;
				opts.onSelect = function() {
				};
				setCombogridValues(target, values, combogrid.remainText);
				opts.onSelect = onSelect;
				opts.onLoadSuccess.apply(target, arguments);
			},
			onClickRow : cbgridClickRowHander,
			onSelect : function(indx, row) {
				updateComboValuesFromGrid();
				opts.onSelect.call(this, indx, row);
			},
			onUnselect : function(index, row) {
				updateComboValuesFromGrid();
				opts.onUnselect.call(this, index, row);
			},
			onSelectAll : function(rows) {
				updateComboValuesFromGrid();
				opts.onSelectAll.call(this, rows);
			},
			onUnselectAll : function(rows) {
				if (opts.multiple) {
					updateComboValuesFromGrid();
				}
				opts.onUnselectAll.call(this, rows);
			}
		}));
		function cbgridClickRowHander(index, row) {
			combogrid.remainText = false;
			updateComboValuesFromGrid();
			if (!opts.multiple) {
				$(target).combo("hidePanel");
			}
			opts.onClickRow.call(this, index, row);
		}
		;
		function updateComboValuesFromGrid() {
			var selections = cbgrid.datagrid("getSelections");
			var vv = [], ss = [];
			for ( var i = 0; i < selections.length; i++) {
				vv.push(selections[i][opts.idField]);
				ss.push(selections[i][opts.textField]);
			}
			if (!opts.multiple) {
				$(target).combo("setValues", (vv.length ? vv : [ "" ]));
			} else {
				$(target).combo("setValues", vv);
			}
			if (!combogrid.remainText) {
				$(target).combo("setText", ss.join(opts.separator));
			}
		}
		;
	}
	;
	function nav(target, dir) {
		var combogrid = $.data(target, "combogrid");
		var opts = combogrid.options;
		var cbgrid = combogrid.grid;
		var rowSize = cbgrid.datagrid("getRows").length;
		if (!rowSize) {
			return;
		}
		var tr = opts.finder.getTr(cbgrid[0], null, "highlight");
		if (!tr.length) {
			tr = opts.finder.getTr(cbgrid[0], null, "selected");
		}
		var rowIndex;
		if (!tr.length) {
			rowIndex = (dir == "next" ? 0 : rowSize - 1);
		} else {
			var rowIndex = parseInt(tr.attr("datagrid-row-index"));
			rowIndex += (dir == "next" ? 1 : -1);
			if (rowIndex < 0) {
				rowIndex = rowSize - 1;
			}
			if (rowIndex >= rowSize) {
				rowIndex = 0;
			}
		}
		cbgrid.datagrid("highlightRow", rowIndex);
		if (opts.selectOnNavigation) {
			combogrid.remainText = false;
			cbgrid.datagrid("selectRow", rowIndex);
		}
	}
	;
	function setCombogridValues(target, values, remainText) {
		var combogrid = $.data(target, "combogrid");
		var opts = combogrid.options;
		var cbgrid = combogrid.grid;
		var rows = cbgrid.datagrid("getRows");
		var ss = [];
		var oldValues = $(target).combo("getValues");
		var copts = $(target).combo("options");
		var onChange = copts.onChange;
		copts.onChange = function() {
		};
		cbgrid.datagrid("clearSelections");
		for ( var i = 0; i < values.length; i++) {
			var index = cbgrid.datagrid("getRowIndex", values[i]);
			if (index >= 0) {
				cbgrid.datagrid("selectRow", index);
				ss.push(rows[index][opts.textField]);
			} else {
				ss.push(values[i]);
			}
		}
		$(target).combo("setValues", oldValues);
		copts.onChange = onChange;
		$(target).combo("setValues", values);
		if (!remainText) {
			var s = ss.join(opts.separator);
			if ($(target).combo("getText") != s) {
				$(target).combo("setText", s);
			}
		}
	}
	;
	function combogridQuery(target, q) {
		var combogrid = $.data(target, "combogrid");
		var opts = combogrid.options;
		var cbgrid = combogrid.grid;
		combogrid.remainText = true;
		if (opts.multiple && !q) {
			setCombogridValues(target, [], true);
		} else {
			setCombogridValues(target, [ q ], true);
		}
		if (opts.mode == "remote") {
			cbgrid.datagrid("clearSelections");
			cbgrid.datagrid("load", $.extend( {}, opts.queryParams, {
				q : q
			}));
		} else {
			if (!q) {
				return;
			}
			cbgrid.datagrid("clearSelections").datagrid("highlightRow", -1);
			var rows = cbgrid.datagrid("getRows");
			var qq = opts.multiple ? q.split(opts.separator) : [ q ];
			$.map(qq, function(q) {
				q = $.trim(q);
				if (q) {
					$.map(rows, function(row, i) {
						if (q == row[opts.textField]) {
							cbgrid.datagrid("selectRow", i);
						} else {
							if (opts.filter.call(target, q, row)) {
								cbgrid.datagrid("highlightRow", i);
							}
						}
					});
				}
			});
		}
	}
	;
	function combogridKeyHandler(target) {
		var combogrid = $.data(target, "combogrid");
		var opts = combogrid.options;
		var cbgrid = combogrid.grid;
		var tr = opts.finder.getTr(cbgrid[0], null, "highlight");
		combogrid.remainText = false;
		if (tr.length) {
			var rowIndex = parseInt(tr.attr("datagrid-row-index"));
			if (opts.multiple) {
				if (tr.hasClass("datagrid-row-selected")) {
					cbgrid.datagrid("unselectRow", rowIndex);
				} else {
					cbgrid.datagrid("selectRow", rowIndex);
				}
			} else {
				cbgrid.datagrid("selectRow", rowIndex);
			}
		}
		var vv = [];
		$.map(cbgrid.datagrid("getSelections"), function(row) {
			vv.push(row[opts.idField]);
		});
		$(target).combogrid("setValues", vv);
		if (!opts.multiple) {
			$(target).combogrid("hidePanel");
		}
	}
	;
	$.fn.combogrid = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.combogrid.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "combogrid");
			if (state) {
				$.extend(state.options, options);
			} else {
				state = $.data(this, "combogrid", {
					options : $.extend( {}, $.fn.combogrid.defaults,
							$.fn.combogrid.parseOptions(this), options)
				});
			}
			buildComboGrid(this);
		});
	};
	$.fn.combogrid.methods = {
		options : function(jq) {
			var opts = jq.combo("options");
			return $.extend($.data(jq[0], "combogrid").options, {
				width : opts.width,
				height : opts.height,
				originalValue : opts.originalValue,
				disabled : opts.disabled,
				readonly : opts.readonly
			});
		},
		grid : function(jq) {
			return $.data(jq[0], "combogrid").grid;
		},
		setValues : function(jq, values) {
			return jq.each(function() {
				setCombogridValues(this, values);
			});
		},
		setValue : function(jq, value) {
			return jq.each(function() {
				setCombogridValues(this, [ value ]);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				$(this).combogrid("grid").datagrid("clearSelections");
				$(this).combo("clear");
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var opts = $(this).combogrid("options");
				if (opts.multiple) {
					$(this).combogrid("setValues", opts.originalValue);
				} else {
					$(this).combogrid("setValue", opts.originalValue);
				}
			});
		}
	};
	$.fn.combogrid.parseOptions = function(target) {
		var t = $(target);
		return $.extend( {}, $.fn.combo.parseOptions(target), $.fn.datagrid
				.parseOptions(target), $.parser.parseOptions(target, [ "idField",
				"textField", "mode" ]));
	};
	$.fn.combogrid.defaults = $.extend( {}, $.fn.combo.defaults,
			$.fn.datagrid.defaults, {
				loadMsg : null,
				idField : null,
				textField : null,
				mode : "local",
				keyHandler : {
					up : function(e) {
						nav(this, "prev");
						e.preventDefault();
					},
					down : function(e) {
						nav(this, "next");
						e.preventDefault();
					},
					left : function(e) {
					},
					right : function(e) {
					},
					enter : function(e) {
						combogridKeyHandler(this);
					},
					query : function(q, e) {
						combogridQuery(this, q);
					}
				},
				filter : function(q, row) {
					var opts = $(this).combogrid("options");
					return row[opts.textField].toLowerCase().indexOf(
							q.toLowerCase()) == 0;
				}
			});
})(jQuery);
//numberbox
(function($) {
	function buildNumberbox(target) {
		var nbbox = $.data(target, "numberbox");
		var opts = nbbox.options;
		$(target).addClass("numberbox-f").textbox(opts);
		$(target).textbox("textbox").css( {
			imeMode : "disabled"
		});
		$(target).attr("numberboxName", $(target).attr("textboxName"));
		nbbox.numberbox = $(target).next();
		nbbox.numberbox.addClass("numberbox");
		var val = opts.parser.call(target, opts.value);
		var fmtval = opts.formatter.call(target, val);
		$(target).numberbox("initValue", val).numberbox("setText", fmtval);
	}
	;
	function setNumberboxValue(target, val) {
		var nbox = $.data(target, "numberbox");
		var opts = nbox.options;
		var val = opts.parser.call(target, val);
		var fmtval = opts.formatter.call(target, val);
		opts.value = val;
		$(target).textbox("setValue", val).textbox("setText", fmtval);
	}
	;
	$.fn.numberbox = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.numberbox.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.textbox(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "numberbox");
			if (state) {
				$.extend(state.options, options);
			} else {
				state = $.data(this, "numberbox", {
					options : $.extend( {}, $.fn.numberbox.defaults,
							$.fn.numberbox.parseOptions(this), options)
				});
			}
			buildNumberbox(this);
		});
	};
	$.fn.numberbox.methods = {
		options : function(jq) {
			var topts = jq.data("textbox") ? jq.textbox("options") : {};
			return $.extend($.data(jq[0], "numberbox").options, {
				width : topts.width,
				originalValue : topts.originalValue,
				disabled : topts.disabled,
				readonly : topts.readonly
			});
		},
		fix : function(jq) {
			return jq.each(function() {
				$(this).numberbox("setValue", $(this).numberbox("getText"));
			});
		},
		setValue : function(jq, val) {
			return jq.each(function() {
				setNumberboxValue(this, val);
			});
		},
		clear : function(jq) {
			return jq.each(function() {
				$(this).textbox("clear");
				$(this).numberbox("options").value = "";
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				$(this).textbox("reset");
				$(this).numberbox("setValue", $(this).numberbox("getValue"));
			});
		}
	};
	$.fn.numberbox.parseOptions = function(target) {
		var t = $(target);
		return $.extend( {}, $.fn.textbox.parseOptions(target), $.parser
				.parseOptions(target, [ "decimalSeparator", "groupSeparator",
						"suffix", {
							min : "number",
							max : "number",
							precision : "number"
						} ]), {
			prefix : (t.attr("prefix") ? t.attr("prefix") : undefined)
		});
	};
	$.fn.numberbox.defaults = $
			.extend(
					{},
					$.fn.textbox.defaults,
					{
						inputEvents : {
							keypress : function(e) {
								var target = e.data.target;
								var opts = $(target).numberbox("options");
								return opts.filter.call(target, e);
							},
							blur : function(e) {
								var target = e.data.target;
								$(target).numberbox("setValue",
										$(target).numberbox("getText"));
							}
						},
						min : null,
						max : null,
						precision : 0,
						decimalSeparator : ".",
						groupSeparator : "",
						prefix : "",
						suffix : "",
						filter : function(e) {
							var opts = $(this).numberbox("options");
							if (e.which == 45) {
								return ($(this).val().indexOf("-") == -1 ? true
										: false);
							}
							var c = String.fromCharCode(e.which);
							if (c == opts.decimalSeparator) {
								return ($(this).val().indexOf(c) == -1 ? true
										: false);
							} else {
								if (c == opts.groupSeparator) {
									return true;
								} else {
									if ((e.which >= 48 && e.which <= 57
											&& e.ctrlKey == false && e.shiftKey == false)
											|| e.which == 0 || e.which == 8) {
										return true;
									} else {
										if (e.ctrlKey == true
												&& (e.which == 99 || e.which == 118)) {
											return true;
										} else {
											return false;
										}
									}
								}
							}
						},
						formatter : function(val) {
							if (!val) {
								return val;
							}
							val = val + "";
							var opts = $(this).numberbox("options");
							var s1 = val, s2 = "";
							var dotindex = val.indexOf(".");
							if (dotindex >= 0) {
								s1 = val.substring(0, dotindex);
								s2 = val.substring(dotindex + 1, val.length);
							}
							if (opts.groupSeparator) {
								var p = /(\d+)(\d{3})/;
								while (p.test(s1)) {
									s1 = s1.replace(p, "$1"
											+ opts.groupSeparator + "$2");
								}
							}
							if (s2) {
								return opts.prefix + s1 + opts.decimalSeparator
										+ s2 + opts.suffix;
							} else {
								return opts.prefix + s1 + opts.suffix;
							}
						},
						parser : function(s) {
							s = s + "";
							var opts = $(this).numberbox("options");
							if (parseFloat(s) != s) {
								if (opts.prefix) {
									s = $.trim(s.replace(new RegExp("\\"
											+ $.trim(opts.prefix), "g"), ""));
								}
								if (opts.suffix) {
									s = $.trim(s.replace(new RegExp("\\"
											+ $.trim(opts.suffix), "g"), ""));
								}
								if (opts.groupSeparator) {
									s = $.trim(s.replace(new RegExp("\\"
											+ opts.groupSeparator, "g"), ""));
								}
								if (opts.decimalSeparator) {
									s = $.trim(s.replace(new RegExp("\\"
											+ opts.decimalSeparator, "g"), "."));
								}
								s = s.replace(/\s/g, "");
							}
							var val = parseFloat(s).toFixed(opts.precision);
							if (isNaN(val)) {
								val = "";
							} else {
								if (typeof (opts.min) == "number"
										&& val < opts.min) {
									val = opts.min.toFixed(opts.precision);
								} else {
									if (typeof (opts.max) == "number"
											&& val > opts.max) {
										val = opts.max.toFixed(opts.precision);
									}
								}
							}
							return val;
						}
					});
})(jQuery);
//searchbox
(function($) {
	function buildSearchbox(target) {
		var srchbox = $.data(target, "searchbox");
		var opts = srchbox.options;
		var icons = $.extend(true, [], opts.icons);
		icons.push( {
			iconCls : "searchbox-button",
			handler : function(e) {
				var t = $(e.data.target);
				t.searchbox("options").searcher.call(e.data.target, t.searchbox("getValue"), t
						.searchbox("getName"));
			}
		});
		initSearchboxMenu();
		var item = getSelectedMenuItem();
		$(target).addClass("searchbox-f").textbox($.extend( {}, opts, {
			icons : icons,
			buttonText : (item ? item.text : "")
		}));
		$(target).attr("searchboxName", $(target).attr("textboxName"));
		srchbox.searchbox = $(target).next();
		srchbox.searchbox.addClass("searchbox");
		updateSearchbox(item);
		function initSearchboxMenu() {
			if (opts.menu) {
				srchbox.menu = $(opts.menu).menu();
				var mopts = srchbox.menu.menu("options");
				var onclick = mopts.onClick;
				mopts.onClick = function(menuItem) {
					updateSearchbox(menuItem);
					onclick.call(this, menuItem);
				};
			} else {
				if (srchbox.menu) {
					srchbox.menu.menu("destroy");
				}
				srchbox.menu = null;
			}
		}
		;
		function getSelectedMenuItem() {
			if (srchbox.menu) {
				var ret = srchbox.menu.children("div.menu-item:first");
				srchbox.menu.children("div.menu-item").each(
						function() {
							var i = $
									.extend( {}, $.parser.parseOptions(this),
											{
												selected : ($(this).attr(
														"selected") ? true
														: undefined)
											});
							if (i.selected) {
								ret = $(this);
								return false;
							}
						});
				return srchbox.menu.menu("getItem", ret[0]);
			} else {
				return null;
			}
		}
		;
		function updateSearchbox(menuItem) {
			if (!menuItem) {
				return;
			}
			$(target).textbox("button").menubutton( {
				text : menuItem.text,
				iconCls : (menuItem.iconCls || null),
				menu : srchbox.menu,
				menuAlign : opts.buttonAlign,
				plain : false
			});
			srchbox.searchbox.find("input.textbox-value").attr("name",
					menuItem.name || menuItem.text);
			$(target).searchbox("resize");
		}
		;
	}
	;
	$.fn.searchbox = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.searchbox.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.textbox(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "searchbox");
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, "searchbox", {
					options : $.extend( {}, $.fn.searchbox.defaults,
							$.fn.searchbox.parseOptions(this), options)
				});
			}
			buildSearchbox(this);
		});
	};
	$.fn.searchbox.methods = {
		options : function(jq) {
			var opts = jq.textbox("options");
			return $.extend($.data(jq[0], "searchbox").options, {
				width : opts.width,
				value : opts.value,
				originalValue : opts.originalValue,
				disabled : opts.disabled,
				readonly : opts.readonly
			});
		},
		menu : function(jq) {
			return $.data(jq[0], "searchbox").menu;
		},
		getName : function(jq) {
			return $.data(jq[0], "searchbox").searchbox.find(
					"input.textbox-value").attr("name");
		},
		selectName : function(jq, name) {
			return jq.each(function() {
				var m = $.data(this, "searchbox").menu;
				if (m) {
					m.children("div.menu-item").each(function() {
						var i = m.menu("getItem", this);
						if (i.name == name) {
							$(this).triggerHandler("click");
							return false;
						}
					});
				}
			});
		},
		destroy : function(jq) {
			return jq.each(function() {
				var m = $(this).searchbox("menu");
				if (m) {
					m.menu("destroy");
				}
				$(this).textbox("destroy");
			});
		}
	};
	$.fn.searchbox.parseOptions = function(target) {
		var t = $(target);
		return $.extend( {}, $.fn.textbox.parseOptions(target), $.parser
				.parseOptions(target, [ "menu" ]), {
			searcher : (t.attr("searcher") ? eval(t.attr("searcher"))
					: undefined)
		});
	};
	$.fn.searchbox.defaults = $.extend( {}, $.fn.textbox.defaults, {
		inputEvents : $.extend( {}, $.fn.textbox.defaults.inputEvents, {
			keydown : function(e) {
				if (e.keyCode == 13) {
					e.preventDefault();
					var t = $(e.data.target);
					var opts = t.searchbox("options");
					t.searchbox("setValue", $(this).val());
					opts.searcher.call(e.data.target, t.searchbox("getValue"), t
							.searchbox("getName"));
					return false;
				}
			}
		}),
		buttonAlign : "left",
		menu : null,
		searcher : function(value, name) {
		}
	});
})(jQuery);
//spinner
(function($) {
	function buildSpinner(target) {
		var spn = $.data(target, "spinner");
		var opts = spn.options;
		var icons = $.extend(true, [], opts.icons);
		icons.push( {
			iconCls : "spinner-arrow",
			handler : function(e) {
				doSpin(e);
			}
		});
		$(target).addClass("spinner-f").textbox($.extend( {}, opts, {
			icons : icons
		}));
		var icon = $(target).textbox("getIcon", icons.length - 1);
		icon
				.append("<a href=\"javascript:void(0)\" class=\"spinner-arrow-up\"></a>");
		icon
				.append("<a href=\"javascript:void(0)\" class=\"spinner-arrow-down\"></a>");
		$(target).attr("spinnerName", $(target).attr("textboxName"));
		spn.spinner = $(target).next();
		spn.spinner.addClass("spinner");
	}
	;
	function doSpin(e) {
		var target = e.data.target;
		var opts = $(target).spinner("options");
		var up = $(e.target).closest("a.spinner-arrow-up");
		if (up.length) {
			opts.spin.call(target, false);
			opts.onSpinUp.call(target);
			$(target).spinner("validate");
		}
		var down = $(e.target).closest("a.spinner-arrow-down");
		if (down.length) {
			opts.spin.call(target, true);
			opts.onSpinDown.call(target);
			$(target).spinner("validate");
		}
	}
	;
	$.fn.spinner = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.spinner.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.textbox(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "spinner");
			if (state) {
				$.extend(state.options, options);
			} else {
				state = $.data(this, "spinner", {
					options : $.extend( {}, $.fn.spinner.defaults, $.fn.spinner
							.parseOptions(this), options)
				});
			}
			buildSpinner(this);
		});
	};
	$.fn.spinner.methods = {
		options : function(jq) {
			var opts = jq.textbox("options");
			return $.extend($.data(jq[0], "spinner").options, {
				width : opts.width,
				value : opts.value,
				originalValue : opts.originalValue,
				disabled : opts.disabled,
				readonly : opts.readonly
			});
		}
	};
	$.fn.spinner.parseOptions = function(target) {
		return $.extend( {}, $.fn.textbox.parseOptions(target), $.parser
				.parseOptions(target, [ "min", "max", {
					increment : "number"
				} ]));
	};
	$.fn.spinner.defaults = $.extend( {}, $.fn.textbox.defaults, {
		min : null,
		max : null,
		increment : 1,
		spin : function(isDown) {
		},
		onSpinUp : function() {
		},
		onSpinDown : function() {
		}
	});
})(jQuery);
//numberspinner
(function($) {
	function buildNumberSpinner(target) {
		$(target).addClass("numberspinner-f");
		var opts = $.data(target, "numberspinner").options;
		$(target).numberbox(opts).spinner(opts);
		$(target).numberbox("setValue", opts.value);
	}
	;
	function doNumberSpin(target, isDown) {
		var opts = $.data(target, "numberspinner").options;
		var v = parseFloat($(target).numberbox("getValue") || opts.value) || 0;
		if (isDown) {
			v -= opts.increment;
		} else {
			v += opts.increment;
		}
		$(target).numberbox("setValue", v);
	}
	;
	$.fn.numberspinner = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.numberspinner.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.numberbox(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "numberspinner");
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, "numberspinner", {
					options : $.extend( {}, $.fn.numberspinner.defaults,
							$.fn.numberspinner.parseOptions(this), options)
				});
			}
			buildNumberSpinner(this);
		});
	};
	$.fn.numberspinner.methods = {
		options : function(jq) {
			var opts = jq.numberbox("options");
			return $.extend($.data(jq[0], "numberspinner").options, {
				width : opts.width,
				value : opts.value,
				originalValue : opts.originalValue,
				disabled : opts.disabled,
				readonly : opts.readonly
			});
		}
	};
	$.fn.numberspinner.parseOptions = function(target) {
		return $.extend( {}, $.fn.spinner.parseOptions(target), $.fn.numberbox
				.parseOptions(target), {});
	};
	$.fn.numberspinner.defaults = $.extend( {}, $.fn.spinner.defaults,
			$.fn.numberbox.defaults, {
				spin : function(isDown) {
					doNumberSpin(this, isDown);
				}
			});
})(jQuery);
//timespinner
(function($) {
	function getSelectionIndex(target) {
		var index = 0;
		if (target.selectionStart) {
			index = target.selectionStart;
		} else {
			if (target.createTextRange) {
				var range = target.createTextRange();
				var s = document.selection.createRange();
				s.setEndPoint("StartToStart", range);
				index = s.text.length;
			}
		}
		return index;
	}
	;
	function tbSelectRange(target, begin, end) {
		if (target.selectionStart) {
			target.setSelectionRange(begin, end);
		} else {
			if (target.createTextRange) {
				var range = target.createTextRange();
				range.collapse();
				range.moveEnd("character", end);
				range.moveStart("character", begin);
				range.select();
			}
		}
	}
	;
	function buildTimeSpinner(target) {
		var opts = $.data(target, "timespinner").options;
		$(target).addClass("timespinner-f").spinner(opts);
		var tval = opts.formatter.call(target, opts.parser.call(target, opts.value));
		$(target).timespinner("initValue", tval);
	}
	;
	function highlightForClick(e) {
		var target = e.data.target;
		var opts = $.data(target, "timespinner").options;
		var sindex = getSelectionIndex(this);
		for ( var i = 0; i < opts.selections.length; i++) {
			var selection = opts.selections[i];
			if (sindex >= selection[0] && sindex <= selection[1]) {
				highlightSelection(target, i);
				return;
			}
		}
	}
	;
	function highlightSelection(target, highlight) {
		var opts = $.data(target, "timespinner").options;
		if (highlight != undefined) {
			opts.highlight = highlight;
		}
		var tunit = opts.selections[opts.highlight];
		if (tunit) {
			var tb = $(target).timespinner("textbox");
			tbSelectRange(tb[0], tunit[0], tunit[1]);
			tb.focus();
		}
	}
	;
	function setTimeSpinnerValue(target, val) {
		var opts = $.data(target, "timespinner").options;
		var val = opts.parser.call(target, val);
		var fval = opts.formatter.call(target, val);
		$(target).spinner("setValue", fval);
	}
	;
	function doTimeSpin(target, isDown) {
		var opts = $.data(target, "timespinner").options;
		var s = $(target).timespinner("getValue");
		var tunit = opts.selections[opts.highlight];
		var s1 = s.substring(0, tunit[0]);
		var s2 = s.substring(tunit[0], tunit[1]);
		var s3 = s.substring(tunit[1]);
		var v = s1 + ((parseInt(s2) || 0) + opts.increment * (isDown ? -1 : 1))
				+ s3;
		$(target).timespinner("setValue", v);
		highlightSelection(target);
	}
	;
	$.fn.timespinner = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.timespinner.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.spinner(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "timespinner");
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, "timespinner", {
					options : $.extend( {}, $.fn.timespinner.defaults,
							$.fn.timespinner.parseOptions(this), options)
				});
			}
			buildTimeSpinner(this);
		});
	};
	$.fn.timespinner.methods = {
		options : function(jq) {
			var sopts = jq.data("spinner") ? jq.spinner("options") : {};
			return $.extend($.data(jq[0], "timespinner").options, {
				width : sopts.width,
				value : sopts.value,
				originalValue : sopts.originalValue,
				disabled : sopts.disabled,
				readonly : sopts.readonly
			});
		},
		setValue : function(jq, value) {
			return jq.each(function() {
				setTimeSpinnerValue(this, value);
			});
		},
		getHours : function(jq) {
			var opts = $.data(jq[0], "timespinner").options;
			var vv = jq.timespinner("getValue").split(opts.separator);
			return parseInt(vv[0], 10);
		},
		getMinutes : function(jq) {
			var opts = $.data(jq[0], "timespinner").options;
			var vv = jq.timespinner("getValue").split(opts.separator);
			return parseInt(vv[1], 10);
		},
		getSeconds : function(jq) {
			var opts = $.data(jq[0], "timespinner").options;
			var vv = jq.timespinner("getValue").split(opts.separator);
			return parseInt(vv[2], 10) || 0;
		}
	};
	$.fn.timespinner.parseOptions = function(target) {
		return $.extend( {}, $.fn.spinner.parseOptions(target), $.parser
				.parseOptions(target, [ "separator", {
					showSeconds : "boolean",
					highlight : "number"
				} ]));
	};
	$.fn.timespinner.defaults = $.extend( {}, $.fn.spinner.defaults, {
		inputEvents : $.extend( {}, $.fn.spinner.defaults.inputEvents, {
			click : function(e) {
				highlightForClick.call(this, e);
			},
			blur : function(e) {
				var t = $(e.data.target);
				t.timespinner("setValue", t.timespinner("getText"));
			}
		}),
		formatter : function(dt) {
			if (!dt) {
				return "";
			}
			var opts = $(this).timespinner("options");
			var tt = [ twoDigits(dt.getHours()), twoDigits(dt.getMinutes()) ];
			if (opts.showSeconds) {
				tt.push(twoDigits(dt.getSeconds()));
			}
			return tt.join(opts.separator);
			function twoDigits(v) {
				return (v < 10 ? "0" : "") + v;
			}
			;
		},
		parser : function(s) {
			var opts = $(this).timespinner("options");
			var dt = toDate(s);
			if (dt) {
				var min = toDate(opts.min);
				var max = toDate(opts.max);
				if (min && min > dt) {
					dt = min;
				}
				if (max && max < dt) {
					dt = max;
				}
			}
			return dt;
			function toDate(s) {
				if (!s) {
					return null;
				}
				var tt = s.split(opts.separator);
				return new Date(1900, 0, 0, parseInt(tt[0], 10) || 0, parseInt(
						tt[1], 10) || 0, parseInt(tt[2], 10) || 0);
			}
			;
			if (!s) {
				return null;
			}
			var tt = s.split(opts.separator);
			return new Date(1900, 0, 0, parseInt(tt[0], 10) || 0, parseInt(
					tt[1], 10) || 0, parseInt(tt[2], 10) || 0);
		},
		selections : [ [ 0, 2 ], [ 3, 5 ], [ 6, 8 ] ],
		separator : ":",
		showSeconds : false,
		highlight : 0,
		spin : function(isDown) {
			doTimeSpin(this, isDown);
		}
	});
})(jQuery);
//datetimespinner
(function($) {
	function buildDatetimeSpinner(target) {
		var opts = $.data(target, "datetimespinner").options;
		$(target).addClass("datetimespinner-f").timespinner(opts);
	}
	;
	$.fn.datetimespinner = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.datetimespinner.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.timespinner(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "datetimespinner");
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, "datetimespinner", {
					options : $.extend( {}, $.fn.datetimespinner.defaults,
							$.fn.datetimespinner.parseOptions(this), options)
				});
			}
			buildDatetimeSpinner(this);
		});
	};
	$.fn.datetimespinner.methods = {
		options : function(jq) {
			var topts = jq.timespinner("options");
			return $.extend($.data(jq[0], "datetimespinner").options, {
				width : topts.width,
				value : topts.value,
				originalValue : topts.originalValue,
				disabled : topts.disabled,
				readonly : topts.readonly
			});
		}
	};
	$.fn.datetimespinner.parseOptions = function(target) {
		return $.extend( {}, $.fn.timespinner.parseOptions(target), $.parser
				.parseOptions(target, []));
	};
	$.fn.datetimespinner.defaults = $.extend( {}, $.fn.timespinner.defaults, {
		formatter : function(date) {
			if (!date) {
				return "";
			}
			return $.fn.datebox.defaults.formatter.call(this, date) + " "
					+ $.fn.timespinner.defaults.formatter.call(this, date);
		},
		parser : function(s) {
			s = $.trim(s);
			if (!s) {
				return null;
			}
			var dt = s.split(" ");
			var date = $.fn.datebox.defaults.parser.call(this, dt[0]);
			if (dt.length < 2) {
				return date;
			}
			var time = $.fn.timespinner.defaults.parser.call(this, dt[1]);
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time
					.getHours(), time.getMinutes(), time.getSeconds());
		},
		selections : [ [ 0, 2 ], [ 3, 5 ], [ 6, 10 ], [ 11, 13 ], [ 14, 16 ],
				[ 17, 19 ] ]
	});
})(jQuery);
//datebox
(function($){
	function createBox(target){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		$(target).addClass('datebox-f').combo($.extend({}, opts, {
			onShowPanel:function(){
				setCalendar();
				setValue(target, $(target).datebox('getText'), true);
//				setValue(target, $(target).datebox('getText'));
				opts.onShowPanel.call(target);
			}
		}));
		$(target).combo('textbox').parent().addClass('datebox');
		if (!state.calendar){
			createCalendar();
		}
		setValue(target, opts.value);
		function createCalendar(){
			var panel = $(target).combo('panel').css('overflow','hidden');
			panel.panel('options').onBeforeDestroy = function(){
				var sc = $(this).find('.calendar-shared');
				if (sc.length){
					sc.insertBefore(sc[0].pholder);
				}
			};
			var cc = $('<div class="datebox-calendar-inner"></div>').appendTo(panel);
			if (opts.sharedCalendar){
				var sc = $(opts.sharedCalendar);
				if (!sc[0].pholder){
					sc[0].pholder = $('<div class="calendar-pholder" style="display:none"></div>').insertAfter(sc);
				}
				sc.addClass('calendar-shared').appendTo(cc);
				if (!sc.hasClass('calendar')){
					sc.calendar();
				}
				state.calendar = sc;
//				state.calendar = $(opts.sharedCalendar).appendTo(cc);
//				if (!state.calendar.hasClass('calendar')){
//					state.calendar.calendar();
//				}
			} else {
				state.calendar = $('<div></div>').appendTo(cc).calendar();
			}
			$.extend(state.calendar.calendar('options'), {
				fit:true,
				border:false,
				onSelect:function(date){
					var opts = $(this.target).datebox('options');
					setValue(this.target, opts.formatter.call(this.target, date));
					$(this.target).combo('hidePanel');
					opts.onSelect.call(target, date);
				}
			});
//			setValue(target, opts.value);
			var button = $('<div class="datebox-button"><table cellspacing="0" cellpadding="0" style="width:100%"><tr></tr></table></div>').appendTo(panel);
			var tr = button.find('tr');
			for(var i=0; i<opts.buttons.length; i++){
				var td = $('<td></td>').appendTo(tr);
				var btn = opts.buttons[i];
				var t = $('<a href="javascript:void(0)"></a>').html($.isFunction(btn.text) ? btn.text(target) : btn.text).appendTo(td);
				t.bind('click', {target: target, handler: btn.handler}, function(e){
					e.data.handler.call(this, e.data.target);
				});
			}
			tr.find('td').css('width', (100/opts.buttons.length)+'%');
		}
		function setCalendar(){
			var panel = $(target).combo('panel');
			var cc = panel.children('div.datebox-calendar-inner');
			panel.children()._outerWidth(panel.width());
			state.calendar.appendTo(cc);
			state.calendar[0].target = target;
			if (opts.panelHeight != 'auto'){
				var height = panel.height();
				panel.children().not(cc).each(function(){
					height -= $(this).outerHeight();
				});
				cc._outerHeight(height);
			}
			state.calendar.calendar('resize');
		}
	}
	function doQuery(target, q){
		setValue(target, q, true);
	}
	function doEnter(target){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		var current = state.calendar.calendar('options').current;
		if (current){
			setValue(target, opts.formatter.call(target, current));
			$(target).combo('hidePanel');
		}
	}
	function setValue(target, value, remainText){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		var calendar = state.calendar;
		$(target).combo('setValue', value);
		calendar.calendar('moveTo', opts.parser.call(target, value));
		if (!remainText){
			if (value){
				value = opts.formatter.call(target, calendar.calendar('options').current);
				$(target).combo('setValue', value).combo('setText', value);
			} else {
				$(target).combo('setText', value);
			}
		}
	}
	$.fn.datebox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.datebox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datebox');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'datebox', {
					options: $.extend({}, $.fn.datebox.defaults, $.fn.datebox.parseOptions(this), options)
				});
			}
			createBox(this);
		});
	};
	$.fn.datebox.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'datebox').options, {
				width: copts.width,
				height: copts.height,
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		calendar: function(jq){	// get the calendar object
			return $.data(jq[0], 'datebox').calendar;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).datebox('options');
				$(this).datebox('setValue', opts.originalValue);
			});
		}
	};
	$.fn.datebox.parseOptions = function(target){
		return $.extend({}, $.fn.combo.parseOptions(target), $.parser.parseOptions(target, ['sharedCalendar']));
	};
	$.fn.datebox.defaults = $.extend({}, $.fn.combo.defaults, {
		panelWidth:180,
		panelHeight:'auto',
		sharedCalendar:null,
		keyHandler: {
			up:function(e){},
			down:function(e){},
			left: function(e){},
			right: function(e){},
			enter:function(e){doEnter(this)},
			query:function(q,e){doQuery(this, q)}
		},
		currentText:'Today',
		closeText:'Close',
		okText:'Ok',
		buttons:[{
			text: function(target){return $(target).datebox('options').currentText;},
			handler: function(target){
				$(target).datebox('calendar').calendar({
					year:new Date().getFullYear(),
					month:new Date().getMonth()+1,
					current:new Date()
				});
				doEnter(target);
			}
		},{
			text: function(target){return $(target).datebox('options').closeText;},
			handler: function(target){
				$(this).closest('div.combo-panel').panel('close');
			}
		}],
		formatter:function(date){
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			var d = date.getDate();
			return (m<10?('0'+m):m)+'/'+(d<10?('0'+d):d)+'/'+y;
//			return m+'/'+d+'/'+y;
		},
		parser:function(s){
			if (!s) return new Date();
			var ss = s.split('/');
			var m = parseInt(ss[0],10);
			var d = parseInt(ss[1],10);
			var y = parseInt(ss[2],10);
			if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
				return new Date(y,m-1,d);
			} else {
				return new Date();
			}
		},
		onSelect:function(date){}
	});
})(jQuery);
//datetimebox
(function($) {
	function buildDatetimeBox(target) {
		var datetimebox = $.data(target, "datetimebox");
		var opts = datetimebox.options;
		$(target).datebox($.extend( {}, opts, {
			onShowPanel : function() {
				var value = $(target).datetimebox("getValue");
				setDatetimeBoxValue(target, value, true);
				opts.onShowPanel.call(target);
			},
			formatter : $.fn.datebox.defaults.formatter,
			parser : $.fn.datebox.defaults.parser
		}));
		$(target).removeClass("datebox-f").addClass("datetimebox-f");
		$(target).datebox("calendar").calendar( {
			onSelect : function(date) {
				opts.onSelect.call(target, date);
			}
		});
		var dbpanel = $(target).datebox("panel");
		if (!datetimebox.spinner) {
			var p = $(
					"<div style=\"padding:2px\"><input style=\"width:80px\"></div>")
					.insertAfter(dbpanel.children("div.datebox-calendar-inner"));
			datetimebox.spinner = p.children("input");
		}
		datetimebox.spinner.timespinner( {
			width : opts.spinnerWidth,
			showSeconds : opts.showSeconds,
			separator : opts.timeSeparator
		}).unbind(".datetimebox").bind("mousedown.datetimebox", function(e) {
			e.stopPropagation();
		});
		setDatetimeBoxValue(target, opts.value);
	}
	;
	function getSelectedTime(target) {
		var c = $(target).datetimebox("calendar");
		var t = $(target).datetimebox("spinner");
		var d = c.calendar("options").current;
		return new Date(d.getFullYear(), d.getMonth(), d.getDate(), t
				.timespinner("getHours"), t.timespinner("getMinutes"), t
				.timespinner("getSeconds"));
	}
	;
	function datetimeboxQuery(target, q) {
		setDatetimeBoxValue(target, q, true);
	}
	;
	function saveDatetimeBoxValue(target) {
		var opts = $.data(target, "datetimebox").options;
		var time = getSelectedTime(target);
		setDatetimeBoxValue(target, opts.formatter.call(target, time));
		$(target).combo("hidePanel");
	}
	;
	function setDatetimeBoxValue(target, value, remainText) {
		var opts = $.data(target, "datetimebox").options;
		$(target).combo("setValue", value);
		if (!remainText) {
			if (value) {
				var pvalue = opts.parser.call(target, value);
				$(target).combo("setValue", opts.formatter.call(target, pvalue));
				$(target).combo("setText", opts.formatter.call(target, pvalue));
			} else {
				$(target).combo("setText", value);
			}
		}
		var pvalue = opts.parser.call(target, value);
		$(target).datetimebox("calendar").calendar("moveTo", pvalue);
		$(target).datetimebox("spinner").timespinner("setValue", getTime(pvalue));
		function getTime(v) {
			function twoDigits(x) {
				return (x < 10 ? "0" : "") + x;
			}
			;
			var tt = [ twoDigits(v.getHours()), twoDigits(v.getMinutes()) ];
			if (opts.showSeconds) {
				tt.push(twoDigits(v.getSeconds()));
			}
			return tt
					.join($(target).datetimebox("spinner").timespinner("options").separator);
		}
		;
	}
	;
	$.fn.datetimebox = function(options, param) {
		if (typeof options == "string") {
			var method = $.fn.datetimebox.methods[options];
			if (method) {
				return method(this, param);
			} else {
				return this.datebox(options, param);
			}
		}
		options = options || {};
		return this.each(function() {
			var state = $.data(this, "datetimebox");
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, "datetimebox", {
					options : $.extend( {}, $.fn.datetimebox.defaults,
							$.fn.datetimebox.parseOptions(this), options)
				});
			}
			buildDatetimeBox(this);
		});
	};
	$.fn.datetimebox.methods = {
		options : function(jq) {
			var dopts = jq.datebox("options");
			return $.extend($.data(jq[0], "datetimebox").options, {
				originalValue : dopts.originalValue,
				disabled : dopts.disabled,
				readonly : dopts.readonly
			});
		},
		spinner : function(jq) {
			return $.data(jq[0], "datetimebox").spinner;
		},
		setValue : function(jq, value) {
			return jq.each(function() {
				setDatetimeBoxValue(this, value);
			});
		},
		reset : function(jq) {
			return jq.each(function() {
				var opts = $(this).datetimebox("options");
				$(this).datetimebox("setValue", opts.originalValue);
			});
		}
	};
	$.fn.datetimebox.parseOptions = function(target) {
		var t = $(target);
		return $.extend( {}, $.fn.datebox.parseOptions(target), $.parser
				.parseOptions(target, [ "timeSeparator", "spinnerWidth", {
					showSeconds : "boolean"
				} ]));
	};
	$.fn.datetimebox.defaults = $.extend( {}, $.fn.datebox.defaults,
			{
				spinnerWidth : "100%",
				showSeconds : true,
				timeSeparator : ":",
				keyHandler : {
					up : function(e) {
					},
					down : function(e) {
					},
					left : function(e) {
					},
					right : function(e) {
					},
					enter : function(e) {
						saveDatetimeBoxValue(this);
					},
					query : function(q, e) {
						datetimeboxQuery(this, q);
					}
				},
				buttons : [ {
					text : function(target) {
						return $(target).datetimebox("options").currentText;
					},
					handler : function(target) {
						$(target).datetimebox("calendar").calendar( {
							year : new Date().getFullYear(),
							month : new Date().getMonth() + 1,
							current : new Date()
						});
						saveDatetimeBoxValue(target);
					}
				}, {
					text : function(target) {
						return $(target).datetimebox("options").okText;
					},
					handler : function(target) {
						saveDatetimeBoxValue(target);
					}
				}, {
					text : function(target) {
						return $(target).datetimebox("options").closeText;
					},
					handler : function(_28) {
						$(this).closest("div.combo-panel").panel("close");
					}
				} ],
				formatter : function(time) {
					var h = time.getHours();
					var M = time.getMinutes();
					var s = time.getSeconds();
					function twoDigits(x) {
						return (x < 10 ? "0" : "") + x;
					}
					;
					var sep = $(this).datetimebox("spinner").timespinner(
							"options").separator;
					var r = $.fn.datebox.defaults.formatter(time) + " " + twoDigits(h)
							+ sep + twoDigits(M);
					if ($(this).datetimebox("options").showSeconds) {
						r += sep + twoDigits(s);
					}
					return r;
				},
				parser : function(time) {
					if ($.trim(time) == "") {
						return new Date();
					}
					var dt = time.split(" ");
					var d = $.fn.datebox.defaults.parser(dt[0]);
					if (dt.length < 2) {
						return d;
					}
					var sep = $(this).datetimebox("spinner").timespinner(
							"options").separator;
					var tt = dt[1].split(sep);
					var h = parseInt(tt[0], 10) || 0;
					var M = parseInt(tt[1], 10) || 0;
					var s = parseInt(tt[2], 10) || 0;
					return new Date(d.getFullYear(), d.getMonth(), d.getDate(),
							h, M, s);
				}
			});
})(jQuery);
//slider
(function($){
	function init(target){
		var slider = $('<div class="slider">' +
				'<div class="slider-inner">' +
				'<a href="javascript:void(0)" class="slider-handle"></a>' +
				'<span class="slider-tip"></span>' +
				'</div>' +
				'<div class="slider-rule"></div>' +
				'<div class="slider-rulelabel"></div>' +
				'<div style="clear:both"></div>' +
				'<input type="hidden" class="slider-value">' +
				'</div>').insertAfter(target);
		var t = $(target);
		t.addClass('slider-f').hide();
		var name = t.attr('name');
		if (name){
			slider.find('input.slider-value').attr('name', name);
			t.removeAttr('name').attr('sliderName', name);
		}
		slider.bind('_resize', function(e,force){
			if ($(this).hasClass('mwsmartui-fluid') || force){
				setSize(target);
			}
			return false;
		});
		return slider;
	}
	function setSize(target, param){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		if (param){
			if (param.width) opts.width = param.width;
			if (param.height) opts.height = param.height;
		}
		slider._size(opts);
		if (opts.mode == 'h'){
			slider.css('height', '');
			slider.children('div').css('height', '');
		} else {
			slider.css('width', '');
			slider.children('div').css('width', '');
			slider.children('div.slider-rule,div.slider-rulelabel,div.slider-inner')._outerHeight(slider._outerHeight());
		}
		initValue(target);
	}
	function showRule(target){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		var aa = opts.mode == 'h' ? opts.rule : opts.rule.slice(0).reverse();
		if (opts.reversed){
			aa = aa.slice(0).reverse();
		}
		_build(aa);
		function _build(aa){
			var rule = slider.find('div.slider-rule');
			var label = slider.find('div.slider-rulelabel');
			rule.empty();
			label.empty();
			for(var i=0; i<aa.length; i++){
				var distance = i*100/(aa.length-1)+'%';
				var span = $('<span></span>').appendTo(rule);
				span.css((opts.mode=='h'?'left':'top'), distance);
				// show the labels
				if (aa[i] != '|'){
					span = $('<span></span>').appendTo(label);
					span.html(aa[i]);
					if (opts.mode == 'h'){
						span.css({
							left: distance,
							marginLeft: -Math.round(span.outerWidth()/2)
						});
					} else {
						span.css({
							top: distance,
							marginTop: -Math.round(span.outerHeight()/2)
						});
					}
				}
			}
		}
	}
	function buildSlider(target){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		slider.removeClass('slider-h slider-v slider-disabled');
		slider.addClass(opts.mode == 'h' ? 'slider-h' : 'slider-v');
		slider.addClass(opts.disabled ? 'slider-disabled' : '');
		slider.find('a.slider-handle').draggable({
			axis:opts.mode,
			cursor:'pointer',
			disabled: opts.disabled,
			onDrag:function(e){
				var left = e.data.left;
				var width = slider.width();
				if (opts.mode!='h'){
					left = e.data.top;
					width = slider.height();
				}
				if (left < 0 || left > width) {
					return false;
				} else {
					var value = pos2value(target, left);
					adjustValue(value);
					return false;
				}
			},
			onBeforeDrag:function(){
				state.isDragging = true;
			},
			onStartDrag:function(){
				opts.onSlideStart.call(target, opts.value);
			},
			onStopDrag:function(e){
				var value = pos2value(target, (opts.mode=='h'?e.data.left:e.data.top));
				adjustValue(value);
				opts.onSlideEnd.call(target, opts.value);
				opts.onComplete.call(target, opts.value);
				state.isDragging = false;
			}
		});
		slider.find('div.slider-inner').unbind('.slider').bind('mousedown.slider', function(e){
			if (state.isDragging || opts.disabled){return}
			var pos = $(this).offset();
			var value = pos2value(target, (opts.mode=='h'?(e.pageX-pos.left):(e.pageY-pos.top)));
			adjustValue(value);
			opts.onComplete.call(target, opts.value);
		});
		function adjustValue(value){
			var s = Math.abs(value % opts.step);
			if (s < opts.step/2){
				value -= s;
			} else {
				value = value - s + opts.step;
			}
			setValue(target, value);
		}
	}
	function setValue(target, value){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		var oldValue = opts.value;
		if (value < opts.min) value = opts.min;
		if (value > opts.max) value = opts.max;
		opts.value = value;
		$(target).val(value);
		slider.find('input.slider-value').val(value);
		var pos = value2pos(target, value);
		var tip = slider.find('.slider-tip');
		if (opts.showTip){
			tip.show();
			tip.html(opts.tipFormatter.call(target, opts.value));
		} else {
			tip.hide();
		}
		if (opts.mode == 'h'){
			var style = 'left:'+pos+'px;';
			slider.find('.slider-handle').attr('style', style);
			tip.attr('style', style +  'margin-left:' + (-Math.round(tip.outerWidth()/2)) + 'px');
		} else {
			var style = 'top:' + pos + 'px;';
			slider.find('.slider-handle').attr('style', style);
			tip.attr('style', style + 'margin-left:' + (-Math.round(tip.outerWidth())) + 'px');
		}
		if (oldValue != value){
			opts.onChange.call(target, value, oldValue);
		}
	}
	function initValue(target){
		var opts = $.data(target, 'slider').options;
		var fn = opts.onChange;
		opts.onChange = function(){};
		setValue(target, opts.value);
		opts.onChange = fn;
	}
//	function value2pos(target, value){
//		var state = $.data(target, 'slider');
//		var opts = state.options;
//		var slider = state.slider;
//		if (opts.mode == 'h'){
//			var pos = (value-opts.min)/(opts.max-opts.min)*slider.width();
//			if (opts.reversed){
//				pos = slider.width() - pos;
//			}
//		} else {
//			var pos = slider.height() - (value-opts.min)/(opts.max-opts.min)*slider.height();
//			if (opts.reversed){
//				pos = slider.height() - pos;
//			}
//		}
//		return pos.toFixed(0);
//	}
	function value2pos(target, value){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		var size = opts.mode == 'h' ? slider.width() : slider.height();
		var pos = opts.converter.toPosition.call(target, value, size);
		if (opts.mode == 'v'){
			pos = slider.height() - pos;
		}
		if (opts.reversed){
			pos = size - pos;
		}
		return pos.toFixed(0);
	}
//	function pos2value(target, pos){
//		var state = $.data(target, 'slider');
//		var opts = state.options;
//		var slider = state.slider;
//		if (opts.mode == 'h'){
//			var value = opts.min + (opts.max-opts.min)*(pos/slider.width());
//		} else {
//			var value = opts.min + (opts.max-opts.min)*((slider.height()-pos)/slider.height());
//		}
//		return opts.reversed ? opts.max - value.toFixed(0) : value.toFixed(0);
//	}
	function pos2value(target, pos){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		var size = opts.mode == 'h' ? slider.width() : slider.height();
		var value = opts.converter.toValue.call(target, opts.mode=='h'?(opts.reversed?(size-pos):pos):(size-pos), size);
		return value.toFixed(0);
//		var value = opts.converter.toValue.call(target, opts.mode=='h'?pos:(size-pos), size);
//		return opts.reversed ? opts.max - value.toFixed(0) : value.toFixed(0);
	}
	$.fn.slider = function(options, param){
		if (typeof options == 'string'){
			return $.fn.slider.methods[options](this, param);
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'slider');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'slider', {
					options: $.extend({}, $.fn.slider.defaults, $.fn.slider.parseOptions(this), options),
					slider: init(this)
				});
				$(this).removeAttr('disabled');
			}
			var opts = state.options;
			opts.min = parseFloat(opts.min);
			opts.max = parseFloat(opts.max);
			opts.value = parseFloat(opts.value);
			opts.step = parseFloat(opts.step);
			opts.originalValue = opts.value;
			buildSlider(this);
			showRule(this);
			setSize(this);
		});
	};
	$.fn.slider.methods = {
		options: function(jq){
			return $.data(jq[0], 'slider').options;
		},
		destroy: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').slider.remove();
				$(this).remove();
			});
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		getValue: function(jq){
			return jq.slider('options').value;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				var opts = $(this).slider('options');
				setValue(this, opts.min);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).slider('options');
				setValue(this, opts.originalValue);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').options.disabled = false;
				buildSlider(this);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').options.disabled = true;
				buildSlider(this);
			});
		}
	};
	$.fn.slider.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height','mode',{reversed:'boolean',showTip:'boolean',min:'number',max:'number',step:'number'}
		]), {
			value: (t.val() || undefined),
			disabled: (t.attr('disabled') ? true : undefined),
			rule: (t.attr('rule') ? eval(t.attr('rule')) : undefined)
		});
	};
	$.fn.slider.defaults = {
		width: 'auto',
		height: 'auto',
		mode: 'h',	// 'h'(horizontal) or 'v'(vertical)
		reversed: false,
		showTip: false,
		disabled: false,
		value: 0,
		min: 0,
		max: 100,
		step: 1,
		rule: [],	// [0,'|',100]
		tipFormatter: function(value){return value},
		converter:{
			toPosition:function(value, size){
				var opts = $(this).slider('options');
				return (value-opts.min)/(opts.max-opts.min)*size;
			},
			toValue:function(pos, size){
				var opts = $(this).slider('options');
				return opts.min + (opts.max-opts.min)*(pos/size);
			}
		},
		onChange: function(value, oldValue){},
		onSlideStart: function(value){},
		onSlideEnd: function(value){},
		onComplete: function(value){}
	};
})(jQuery);
