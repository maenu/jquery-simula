/**
 * jQuery user input simulation. The classes are exported to jQuery.simula.
 *
 * @author Manuel Leuenberger
 * @module jQuery
 * @module jQuery.simula
 */

(function ($, undefined) {
	
	var check = false;
	var isRelative = true;
	
	/**
	 * Gets the DOM element from point, as in the W3C description.
	 *
	 * @for .
	 * @method elementFromPoint
	 *
	 * @param {Number} clientX The clientX coordinate
	 * @param {Number} clientY The clientY coordinate
	 *
	 * @return {DOMElement} The DOM element, if present. Null if not supported
	 *     by browser
	 */
	$.elementFromPoint = function (clientX, clientY) {
		// return null for unsupported browsers
		if (!document.elementFromPoint) {
			return null;
		}
		// check behaviour of elementFromPoint
		if (!check) {
			check = true;
			var scrollTop = $(document).scrollTop();
			var scrollLeft = $(document).scrollLeft();
			if (scrollTop > 0) {
				isRelative = (document.elementFromPoint(
						0, scrollTop + $(window).height() - 1) == null);
			} else if (scrollLeft > 0) {
				isRelative = (document.elementFromPoint(
						scrollLeft + $(window).width() - 1, 0) == null);
			} else {
				check = false;
			}
		}
		// adjust if browser implements elementFromPoint incorrectly
		if (!isRelative) {
			clientX += $(document).scrollLeft();
			clientY += $(document).scrollTop();
		}
		return document.elementFromPoint(clientX, clientY);
	};
	
	/**
	 * Checks if the other's first DOM element is the same as the calling one.
	 *
	 * @for jQuery
	 * @method equals
	 *
	 * @param {jQuery} other A jQuery object
	 *
	 * @return {Boolean} true, if the first DOM element is the same, false
	 *     otherwise
	 */
	$.fn.equals = function (other) {
		return this[0] == $(other)[0];
	};
	
	/**
	 * Check if the specified child is a child.
	 *
	 * @for jQuery
	 * @method isParentOf
	 *
	 * @param {jQuery} child
	 *     A jQuery object that may be a child of the parent
	 *
	 * @return {Boolean} true, if the specified child is really a child of the
	 *     parent, false otherwise
	 */
	$.fn.isParentOf = function (child) {
		var current = $(child);
		while (current[0] && !this.equals(current)) {
			current = current.parent();
		}
		return !this.equals(child) && this.equals(current);
	};
	
	/**
	 * Creates an Observer.
	 *
	 * @for jQuery.simula
	 * @class Observer
	 * @constructor
	 */
	function Observer() {}
	/**
	 * Called whenever an Observable updates its Observers.
	 *
	 * @method updateObservable
	 *
	 * @param {Observable} observable The Observable
	 * @param {Object} args The arguments passed by the observable
	 */
	Observer.prototype.updateObservable = function () {};
	
	/**
	 * Creates an Observable.
	 *
	 * @for jQuery.simula
	 * @class Observable
	 * @constructor
	 */
	function Observable() {
		/**
		 * The Observers.
		 *
		 * @property observers
		 * @type {Array}
		 * @default []
		 */
		this.observers = [];
	}
	/**
	 * Updates all Observers this the specified arguments.
	 *
	 * @method updateObservers
	 *
	 * @param {Object} args The arguments to pass to the Observers
	 */
	Observable.prototype.updateObservers = function (args) {
		for (var i = 0; i < this.observers.length; i++) {
			this.observers[i].updateObservable(this, args);
		}
	};
	/**
	 * Adds an Observer. If it is already registered, it will not be added
	 * again.
	 *
	 * @method addObserver
	 *
	 * @param {Observer} observer The observer to add
	 */
	Observable.prototype.addObserver = function (observer) {
		for (var i = 0; i < this.observers.length; i++) {
			var registered = this.observers[i];
			if (registered == observer) {
				return;
			}
		}
		this.observers.push(observer);
	};
	/**
	 * Removes an Observer. If it is not already registered, it will not have no
	 * effect.
	 *
	 * @method removeObserver
	 *
	 * @param {Observer} observer The observer to remove
	 */
	Observable.prototype.removeObserver = function (observer) {
		for (var i = 0; i < this.observers.length; i++) {
			var registered = this.observers[i];
			if (registered == observer) {
				this.observers.splice(i, 1);
				return;
			}
		}
	};
	
	/**
	 * Creates a SimulaEvent. Properties are taken from
	 * http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event.
	 *
	 * @for jQuery.simula
	 * @class SimulaEvent
	 * @constructor
	 *
	 * @param {Object} options The options to use for the event. If some
	 *     properties are missing, the default values are used. It must contain
	 *     a type property
	 */
	function SimulaEvent(options) {
		var fullOptions = $.extend({}, {
			bubbles: true,
			cancelable: true
		}, options);
		
		/**
		 * The name of the event (case-insensitive). The name must be an XML
		 * name.
		 *
		 * @property type
		 * @type {String}
		 */
		this.type = fullOptions.type;
		/**
		 * Used to indicate whether or not an event is a bubbling event. If the
		 * event can bubble the value is true, else the value is false.
		 *
		 * @property bubbles
		 * @type {Boolean}
		 * @default true
		 */
		this.bubbles = fullOptions.bubbles;
		/**
		 * Used to indicate whether or not an event can have its default action
		 * prevented. If the default action can be prevented the value is true,
		 * else the value is false.
		 *
		 * @property cancelable
		 * @type {Boolean}
		 * @default true
		 */
		this.cancelable = fullOptions.cancelable;
	}
	SimulaEvent.PHASE = {
		/**
		 * Capturing phase.
		 *
		 * @static
		 * @property PHASE.CAPTURING
		 * @type {NUMBER}
		 * @default 1
		 */
		CAPTURING: 1,
		/**
		 * At target phase.
		 *
		 * @static
		 * @property PHASE.AT_TARGET
		 * @type {NUMBER}
		 * @default 2
		 */
		AT_TARGET: 2,
		/**
		 * Bubbling phase.
		 *
		 * @static
		 * @property PHASE.BUBBLING
		 * @type {NUMBER}
		 * @default 3
		 */
		BUBBLING: 3
	};
	
	/**
	 * Creates an SimulaUiEvent. Properties are taken from
	 * http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-SimulaUiEvent.
	 *
	 * @for jQuery.simula
	 * @class SimulaUiEvent
	 * @extends SimulaEvent
	 * @constructor
	 *
	 * @param {Object} options The options to use for the event. If some
	 *     properties are missing, the default values are used.
	 */
	function SimulaUiEvent(options) {
		SimulaEvent.apply(this, [options]);
		
		var fullOptions = $.extend({}, {
			view: window,
			detail: 0
		}, options);
		
		/**
		 * The view attribute identifies the AbstractView from which the event
		 * was generated.
		 *
		 * @property view
		 * @type {Object}
		 * @default window
		 */
		this.view = fullOptions.view;
		/**
		 * Specifies some detail information about the Event, depending on the
		 * type of event.
		 *
		 * @property detail
		 * @type {Number}
		 * @default 0
		 */
		this.detail = fullOptions.detail;
	}
	SimulaUiEvent.prototype = new SimulaEvent();
	SimulaUiEvent.prototype.constructor = SimulaUiEvent;
	
	/**
	 * Creates a SimulaMouseEvent. Properties are taken from
	 * http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-
	 * SimulaMouseEvent.
	 *
	 * @for jQuery.simula
	 * @class SimulaMouseEvent
	 * @extends SimulaUiEvent
	 * @constructor
	 *
	 * @param {Object} options The options to use for the event. If some
	 *     properties are missing, the default values are used.
	 */
	function SimulaMouseEvent(options) {
		SimulaUiEvent.apply(this, [options]);
		
		var fullOptions = $.extend({}, {
			screenX: 0,
			screenY: 0,
			clientX: 0,
			clientY: 0,
			ctrlKey: false,
			shiftKey: false,
			altKey: false,
			metaKey: false,
			button: $.simula.SimulaMouseEvent.BUTTON.LEFT,
			relatedTarget: document
		}, options);
		
		/**
		 * The horizontal coordinate at which the event occurred relative to the
		 * origin of the screen coordinate system.
		 *
		 * @property screenX
		 * @type {Number}
		 * @default 0
		 */
		this.screenX = fullOptions.screenX;
		/**
		 * The vertical coordinate at which the event occurred relative to the
		 * origin of the screen coordinate system.
		 *
		 * @property screenY
		 * @type {Number}
		 * @default 0
		 */
		this.screenY = fullOptions.screenY;
		/**
		 * The horizontal coordinate at which the event occurred relative to the
		 * DOM implementation's client area.
		 *
		 * @property clientX
		 * @type {Number}
		 * @default 0
		 */
		this.clientX = fullOptions.clientX;
		/**
		 * The vertical coordinate at which the event occurred relative to the
		 * DOM implementation's client area.
		 *
		 * @property client>
		 * @type {Number}
		 * @default 0
		 */
		this.clientY = fullOptions.clientY;
		/**
		 * Used to indicate whether the 'ctrl' key was depressed during the
		 * firing of the event.
		 *
		 * @property ctrlKey
		 * @type {Boolean}
		 * @default false
		 */
		this.ctrlKey = fullOptions.ctrlKey;
		/**
		 * Used to indicate whether the 'shift' key was depressed during the
		 * firing of the event.
		 *
		 * @property shiftKey
		 * @type {Boolean}
		 * @default false
		 */
		this.shiftKey = fullOptions.shiftKey;
		/**
		 * Used to indicate whether the 'alt' key was depressed during the
		 * firing of the event. On some platforms this key may map to an
		 * alternative key name.
		 *
		 * @property altKey
		 * @type {Boolean}
		 * @default false
		 */
		this.altKey = fullOptions.altKey;
		/**
		 * Used to indicate whether the 'meta' key was depressed during the
		 * firing of the event. On some platforms this key may map to an
		 * alternative key name.
		 *
		 * @property metaKey
		 * @type {Boolean}
		 * @default false
		 */
		this.metaKey = fullOptions.metaKey;
		/**
		 * During mouse events caused by the depression or release of a mouse
		 * button, button is used to indicate which mouse button changed state.
		 * The values for button range from zero to indicate the left button of
		 * the mouse, one to indicate the middle button if present, and two to
		 * indicate the right button. For mice configured for left handed use in
		 * which the button actions are reversed the values are instead read
		 * from right to left.
		 * Use $.simula.MOUSE.BUTTON.[LEFT | MIDDLE | RIGHT].
		 *
		 * @property button
		 * @type {Number}
		 * @default $.simula.MOUSE.BUTTON.LEFT
		 */
		this.button = fullOptions.button;
		/**
		 * Used to identify a secondary EventTarget related to a UI event.
		 * Currently this attribute is used with the mouseover event to indicate
		 * the EventTarget which the pointing device exited and with the
		 * mouseout event to indicate the EventTarget which the pointing device
		 * entered.
		 *
		 * @property relatedTarget
		 * @type {Object}
		 * @default document
		 */
		this.relatedTarget = fullOptions.relatedTarget;
	}
	SimulaMouseEvent.prototype = new SimulaUiEvent();
	SimulaMouseEvent.prototype.constructor = SimulaMouseEvent;
	SimulaMouseEvent.BUTTON = {
		/**
		 * Left mouse button.
		 *
		 * @static
		 * @property BUTTON.LEFT
		 * @type {NUMBER}
		 * @default 0
		 */
		LEFT: 0,
		/**
		 * Middle mouse button.
		 *
		 * @static
		 * @property BUTTON.MIDDLE
		 * @type {NUMBER}
		 * @default 1
		 */
		MIDDLE: 1,
		/**
		 * Right mouse button.
		 *
		 * @static
		 * @property BUTTON.RIGHT
		 * @type {NUMBER}
		 * @default 2
		 */
		RIGHT: 2
	};
	SimulaMouseEvent.TYPE = {
		/**
		 * Mouse click event.
		 *
		 * @static
		 * @property TYPE.CLICK
		 * @type {String}
		 * @default "click"
		 */
		CLICK: 'click',
		/**
		 * Mouse down event.
		 *
		 * @static
		 * @property TYPE.DOWN
		 * @type {String}
		 * @default "mousedown"
		 */
		DOWN: 'mousedown',
		/**
		 * Mouse up event.
		 *
		 * @static
		 * @property TYPE.UP
		 * @type {String}
		 * @default "mouseup"
		 */
		UP: 'mouseup',
		/**
		 * Mouse over event.
		 *
		 * @static
		 * @property TYPE.OVER
		 * @type {String}
		 * @default "mouseover"
		 */
		OVER: 'mouseover',
		/**
		 * Mouse out event.
		 *
		 * @static
		 * @property TYPE.OUT
		 * @type {String}
		 * @default "mouseout"
		 */
		OUT: 'mouseout',
		/**
		 * Mouse move event.
		 *
		 * @static
		 * @property TYPE.MOVE
		 * @type {String}
		 * @default "mousemove"
		 */
		MOVE: 'mousemove'
	};
	
	/**
	 * Creates a Simulator.
	 *
	 * @for jQuery.simula
	 * @class Simulator
	 * @extends Observable
	 * @constructor
	 */
	function Simulator() {
		Observable.apply(this);
		
		/**
		 * true, if it is running.
		 *
		 * @property running
		 * @type {Boolean}
		 * @default false
		 */
		this.running = false;
	}
	Simulator.prototype = new Observable();
	Simulator.prototype.constructor = Simulator;
	/**
	 * Updates all Observers with 'finish'.
	 *
	 * @method finish
	 */
	Simulator.prototype.finish = function () {
		this.running = false;
		this.updateObservers('finish');
	};
	/**
	 * Starts the the simulation, i.e. dispatches events. Must call finish, at
	 * the end.
	 *
	 * @method execute
	 *
	 * @throws {Error} If it is already running
	 */
	Simulator.prototype.execute = function () {
		if (this.isRunning()) {
			throw new Error('Simulator is already running');
		}
		this.running = true;
	};
	/**
	 * Finishes the simulation even if its running. Doesn't do anything if not.
	 *
	 * @method stop
	 */
	Simulator.prototype.stop = function () {
		if (this.isRunning()) {
			this.running = false;
			this.updateObservers('stop');
		}
	};
	/**
	 * Checks if it is running.
	 *
	 * @method isRunning
	 *
	 * @return {Boolean} true, if it is, false otherwise
	 */
	Simulator.prototype.isRunning = function () {
		return this.running;
	};
	
	/**
	 * Creates a SimulatorQueue.
	 *
	 * @for jQuery.simula
	 * @class SimulatorQueue
	 * @extends Simulator
	 * @constructor
	 *
	 * @param {Array} simulators An ordered Array of Simulators which will be
	 *     executed one after another
	 */
	function SimulatorQueue(simulators) {
		Simulator.apply(this);
		
		/**
		 * The Simulators.
		 *
		 * @property simulators
		 * @type {Array}
		 */
		this.simulators = simulators;
		/**
		 *	The index of the current Simulator.
		 *
		 * @property currentIndex
		 * @type {Number}
		 * @default -1
		 */
		this.currentIndex = -1;
	}
	SimulatorQueue.prototype = new Simulator();
	SimulatorQueue.prototype.constructor = SimulatorQueue;
	SimulatorQueue.prototype.updateObservable = function (observable, args) {
		if (args != 'finish' || this.currentIndex < 0
				|| this.currentIndex >= this.simulators.length
				|| observable != this.simulators[this.currentIndex]) {
			return;
		}
		var simulator = this.simulators[this.currentIndex];
		simulator.removeObserver(this);
		if (this.currentIndex <  this.simulators.length - 1) {
			this.proceed();
		} else {
			this.finish();
		}
	};
	SimulatorQueue.prototype.finish = function () {
		this.currentIndex = -1;
		Simulator.prototype.finish.apply(this);
	};
	SimulatorQueue.prototype.execute = function () {
		Simulator.prototype.execute.apply(this);
		if (this.simulators.length > 0) {
			this.proceed();
		} else {
			this.finish();
		}
	};
	SimulatorQueue.prototype.stop = function () {
		if (this.isRunning()) {
			var simulator = this.simulators[this.currentIndex];
			simulator.stop();
			this.currentIndex = -1;
		}
		Simulator.prototype.stop.apply(this);
	};
	/**
	 * Proceeds with the execution of the next Simulator.
	 *
	 * @method proceed
	 */
	SimulatorQueue.prototype.proceed = function () {
		this.currentIndex++;
		var simulator = this.simulators[this.currentIndex];
		simulator.addObserver(this);
		simulator.execute();
	};
	
	/**
	 * Creates a TimeSimulator.
	 *
	 * @for jQuery.simula
	 * @class TimeSimulator
	 * @extends Simulator
	 * @constructor
	 *
	 * @param {Number} time The amount of milliseconds to wait before the
	 *     Observers are updated
	 */
	function TimeSimulator(time) {
		Simulator.apply(this);
		
		/**
		 * The amount of milliseconds to wait before the Observers are updated.
		 *
		 * @property time
		 * @type {Number}
		 */
		this.time = time;
		/**
		 * The id of the timeout.
		 *
		 * @private
		 * @property relatedTarget
		 * @type {Object}
		 * @default null
		 */
		this.timeoutId = null;
	}
	TimeSimulator.prototype = new Simulator();
	TimeSimulator.prototype.constructor = TimeSimulator;
	TimeSimulator.prototype.execute = function () {
		Simulator.prototype.execute.apply(this);
		this.timeoutId = setTimeout($.proxy(function () {
			this.finish();
		}, this), this.time);
	};
	TimeSimulator.prototype.stop = function () {
		if (this.isRunning()) {
			clearTimeout(this.timeoutId);
		}
		Simulator.prototype.stop.apply(this);
	};
	
	/**
	 * Creates an EventSimulator.
	 *
	 * @for jQuery.simula
	 * @class EventSimulator
	 * @extends Simulator
	 * @constructor
	 *
	 * @param {jQuery} $element The jQuery element on which to dispatch the
	 *     event
	 * @param {SimulaEvent} simulaEvent The SimulaEvent to init and dispatch
	 */
	function EventSimulator($element, simulaEvent) {
		Simulator.apply(this);
		
		/**
		 * The jQuery element on which to dispatch the event.
		 *
		 * @property $element
		 * @type {jQuery}
		 */
		this.$element = $element;
		/**
		 * The SimulaEvent to init and dispatch.
		 *
		 * @property simulaEvent
		 * @type {SimulaEvent}
		 */
		this.simulaEvent = simulaEvent;
		/**
		 * The listener to add and remove.
		 *
		 * @property listener
		 * @type {Function}
		 * @default function () {}
		 */
		this.listener = function () {};
		/**
		 * The Event that is dispatched.
		 *
		 * @property event
		 * @type {Event}
		 * @default null
		 */
		this.event = null;
	}
	EventSimulator.prototype = new Simulator();
	EventSimulator.prototype.constructor = EventSimulator;
	/**
	 * Template method that builds the Event.
	 *
	 * @method buildEvent
	 *
	 * @return {Event} An Event that can be dispatched by dispatchEvent
	 */
	EventSimulator.prototype.buildEvent = function () {
		return null;
	};
	/**
	 * Template method to add an event listener for the specified Event.
	 *
	 * @method addEventListener
	 */
	EventSimulator.prototype.addEventListener = function () {
		
	};
	/**
	 * Template method to remove an event listener for the specified Event.
	 *
	 * @method removeEventListener
	 */
	EventSimulator.prototype.removeEventListener = function () {
		
	};
	/**
	 * Event listener that calls finish if the specified Event is the one that
	 * was dispatched.
	 *
	 * @method handleEvent
	 *
	 * @param {Event} event The Event that was found
	 */
	EventSimulator.prototype.handleEvent = function (event) {
		if (event == this.event) {
			this.removeEventListener(event);
			this.listener = function () {};
			this.event = null;
			this.finish();
		}
	};
	/**
	 * Template method that dispatches an Event.
	 *
	 * @method dispatchEvent
	 *
	 * @param {Event} event The event to be dispatched
	 */
	EventSimulator.prototype.dispatchEvent = function () {};
	EventSimulator.prototype.execute = function () {
		Simulator.prototype.execute.apply(this);
		this.event = this.buildEvent();
		this.listener = $.proxy(function (event) {
			this.handleEvent(event);
		}, this);
		this.addEventListener();
		this.dispatchEvent();
	};
	
	/**
	 * Creates an W3CMouseEventSimulator.
	 *
	 * @for jQuery.simula
	 * @class W3CMouseEventSimulator
	 * @extends EventSimulator
	 * @constructor
	 *
	 * @param {jQuery} $element The jQuery element on which to dispatch the
	 *     event
	 * @param {SimulaMouseEvent} mouseEvent The SimulaMouseEvent to init and
	 *     dispatch
	 */
	function W3CMouseEventSimulator($element, mouseEvent) {
		EventSimulator.apply(this, [$element, mouseEvent]);
	}
	W3CMouseEventSimulator.prototype = new EventSimulator();
	W3CMouseEventSimulator.prototype.constructor = W3CMouseEventSimulator;
	W3CMouseEventSimulator.prototype.buildEvent = function () {
		var mouseEvent = this.simulaEvent;
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent(
			mouseEvent.type,
			mouseEvent.bubbles,
			mouseEvent.cancelable,
			mouseEvent.view,
			mouseEvent.detail,
			mouseEvent.screenX,
			mouseEvent.screenY,
			mouseEvent.clientX,
			mouseEvent.clientY,
			mouseEvent.ctrlKey,
			mouseEvent.altKey,
			mouseEvent.shiftKey,
			mouseEvent.metaKey,
			mouseEvent.button,
			mouseEvent.relatedTarget
		);
		return event;
	};
	W3CMouseEventSimulator.prototype.addEventListener = function () {
		this.$element.get(0).addEventListener(this.event.type, this.listener,
			false);
	};
	W3CMouseEventSimulator.prototype.removeEventListener = function () {
		this.$element.get(0).removeEventListener(this.event.type, this.listener,
			false);
	};
	W3CMouseEventSimulator.prototype.dispatchEvent = function () {
		this.$element.get(0).dispatchEvent(this.event);
	};
	
	// TODO browser detection if non w3c compliant
	var MouseEventSimulator = W3CMouseEventSimulator;
	
	/**
	 * Creates a Simulation. Moves a pixel per millisecond. Note that the
	 * internal $element and elementPosition only reflect the current state
	 * during construction/chaining of the Simulation. This means that these
	 * stay the same during execution.
	 *
	 * @for jQuery.simula
	 * @class Simulation
	 * @extends Simulator
	 * @constructor
	 *
	 * @param {jQuery} $element The jQuery element over which the mouse is
	 * @param {Array} elementPosition The mouse position [x, y] relative to the
	 *     specified element
	 */
	function Simulation($element, elementPosition) {
		Simulator.apply(this);
		
		/**
		 * The internally used SimulatorQueue.
		 *
		 * @private
		 * @property simulatorQueue
		 * @type {SimulatorQueue}
		 * @default new SimulatorQueue([])
		 */
		this.simulatorQueue = new SimulatorQueue([]);
		/**
		 * The jQuery element over which the mouse is.
		 *
		 * @property $element
		 * @type {jQuery}
		 */
		this.$element = $element;
		/**
		 * The mouse position relative to the specified element.
		 *
		 * @property elementPosition
		 * @type {Array}
		 */
		this.elementPosition = [elementPosition[0], elementPosition[1]];
	}
	Simulation.prototype = new Simulator();
	Simulation.prototype.constructor = Simulation;
	Simulation.prototype.updateObservable = function (observable, args) {
		if (args != 'finish' || observable != this.simulatorQueue) {
			return;
		}
		this.simulatorQueue.removeObserver(this);
		this.finish();
	};
	Simulation.prototype.execute = function () {
		Simulator.prototype.execute.apply(this);
		this.simulatorQueue.addObserver(this);
		this.simulatorQueue.execute();
	};
	/**
	 * Waits for the specified duration before executing the next command.
	 *
	 * @method wait
	 *
	 * @param {Number} [duration=500] The duration in milliseconds
	 *
	 * @return {Simulation} The Simulation itself to allow chaining
	 */
	Simulation.prototype.wait = function (duration) {
		if (!duration) {
			duration = 50;
		}
		this.simulatorQueue.simulators.push(new TimeSimulator(duration));
		
		return this;
	};
	/**
	 * Adds exactly one mousemove with the specified options and element.
	 *
	 * @method mousemove
	 *
	 * @param {jQuery} [$element] The element to move on, must be added to the
	 *     DOM
	 * @param {Object} [options] The options to pass to the MouseEventSimulator
	 *
	 * @return {Simulation} The Simulation itself to allow chaining
	 */
	Simulation.prototype.mousemove = function ($element, options) {
		// init optional arguments
		if (!options) {
			options = {};
		}
		if (!$element) {
			$element = this.$element;
		}
		// setup event
		var event = new SimulaMouseEvent($.extend({}, options, {
			type: SimulaMouseEvent.TYPE.MOVE,
			cancelable: false
		}));
		this.simulatorQueue.simulators.push(
				new MouseEventSimulator($element, event));
		return this;
	};
	/**
	 * Adds exactly one mouseover with the specified options and element.
	 *
	 * @method mouseover
	 *
	 * @param {jQuery} [$element] The element to move over on, must be added to
	 *     the DOM
	 * @param {Object} [options] The options to pass to the MouseEventSimulator
	 *
	 * @return {Simulation} The Simulation itself to allow chaining
	 */
	Simulation.prototype.mouseover = function ($element, options) {
		// init optional arguments
		if (!options) {
			options = {};
		}
		if (!$element) {
			$element = this.$element;
		}
		// setup event
		var event = new SimulaMouseEvent($.extend({}, options, {
			type: SimulaMouseEvent.TYPE.OVER
		}));
		this.simulatorQueue.simulators.push(
				new MouseEventSimulator($element, event));
		return this;
	};
	/**
	 * Adds exactly one mouseout with the specified options and element.
	 *
	 * @method mouseout
	 *
	 * @param {jQuery} [$element] The element to move out, must be added to the
	 *     DOM
	 * @param {Object} [options] The options to pass to the MouseEventSimulator
	 *
	 * @return {Simulation} The Simulation itself to allow chaining
	 */
	Simulation.prototype.mouseout = function ($element, options) {
		// init optional arguments
		if (!options) {
			options = {};
		}
		if (!$element) {
			$element = this.$element;
		}
		// setup event
		var event = new SimulaMouseEvent($.extend({}, options, {
			type: SimulaMouseEvent.TYPE.OUT
		}));
		this.simulatorQueue.simulators.push(
				new MouseEventSimulator($element, event));
		return this;
	};
	/**
	 * Adds exactly one mousedown with the specified options and element.
	 *
	 * @method mousedown
	 *
	 * @param {jQuery} [$element] The element to press the mouse down, must be
	 *     added to the DOM
	 * @param {Object} [options] The options to pass to the MouseEventSimulator
	 *
	 * @return {Simulation} The Simulation itself to allow chaining
	 */
	Simulation.prototype.mousedown = function ($element, options) {
		// init optional arguments
		if (!options) {
			options = {};
		}
		if (!$element) {
			$element = this.$element;
		}
		// setup event
		var event = new SimulaMouseEvent($.extend({
			button: SimulaMouseEvent.BUTTON.LEFT
		}, options, {
			type: SimulaMouseEvent.TYPE.DOWN
		}));
		this.simulatorQueue.simulators.push(
				new MouseEventSimulator($element, event));
		return this;
	};
	/**
	 * Adds exactly one mouseup with the specified options and element.
	 *
	 * @method mouseup
	 *
	 * @param {jQuery} [$element] The element to release the mouse up, must be
	 *     added to the DOM
	 * @param {Object} [options] The options to pass to the MouseEventSimulator
	 *
	 * @return {Simulation} The Simulation itself to allow chaining
	 */
	Simulation.prototype.mouseup = function ($element, options) {
		// init optional arguments
		if (!options) {
			options = {};
		}
		if (!$element) {
			$element = this.$element;
		}
		// setup event
		var event = new SimulaMouseEvent($.extend({
			button: SimulaMouseEvent.BUTTON.LEFT
		}, options, {
			type: SimulaMouseEvent.TYPE.UP
		}));
		this.simulatorQueue.simulators.push(
				new MouseEventSimulator($element, event));
		return this;
	};
	/**
	 * Adds exactly one click with the specified options and element.
	 *
	 * @method mouseclick
	 *
	 * @param {jQuery} [$element] The element to click on, must be added to the
	 *     DOM
	 * @param {Object} [options] The options to pass to the MouseEventSimulator
	 *
	 * @return {Simulation} The Simulation itself to allow chaining
	 */
	Simulation.prototype.mouseclick = function ($element, options) {
		// init optional arguments
		if (!options) {
			options = {};
		}
		if (!$element) {
			$element = this.$element;
		}
		// setup event
		var event = new SimulaMouseEvent($.extend({
			button: SimulaMouseEvent.BUTTON.LEFT
		}, options, {
			type: SimulaMouseEvent.TYPE.CLICK
		}));
		this.simulatorQueue.simulators.push(
				new MouseEventSimulator($element, event));
		return this;
	};
	/**
	 * Moves the mouse to the specified position in the specified duration by
	 * dispatching a mousemove every 15 milliseconds.
	 *
	 * @method move
	 *
	 * @param {Array} elementPosition The mouse position [x, y] relative to the
	 *     current element
	 * @param {Number} [duration] The time to use to move to the specified
	 *     position in milliseconds
	 * @param {Object} [options] The options to pass to the MouseEventSimulator
	 * @param {Boolean} [auto=false] The mouse move mode. If true, whenever the
	 *     mouse moves over and out of an element, it dispatches the according
	 *     event and sets the internal $element and elementPosition
	 *
	 * @return {Simulation} The Simulation itself to allow chaining
	 */
	Simulation.prototype.move = function (elementPosition, duration, options,
		auto) {
		var dX = elementPosition[0] - this.elementPosition[0];
		var dY = elementPosition[1] - this.elementPosition[1];
			
		// init optional arguments
		if (!duration) {
			duration = Math.sqrt(dX * dX + dY * dY);
		}
		if (!options) {
			options = {};
		}
		
		// add intermediate moves
		var moves = [];
		var time = 15;
		while (time <= duration) {
			moves.push({
				wait: 15,
				dPosition: [time / duration * dX, time / duration * dY]
			});
			time += 15;
		}
		if (duration % 15 !== 0) {
			moves.push({
				wait: duration % 15,
				dPosition: [dX, dY]
			});
		}
		
		var startPosition = [this.$element.offset().left
				+ this.elementPosition[0], this.$element.offset().top
				+ this.elementPosition[1]];
		for (var i = 0; i < moves.length; i++) {
			var move = moves[i];
			var clientX = startPosition[0] + move.dPosition[0];
			var clientY = startPosition[1] + move.dPosition[1];
			this.wait(move.wait);
			var $elementUnderMouse = $($.elementFromPoint(clientX, clientY));
			if (auto && !this.$element.equals($elementUnderMouse)) {
				if ($elementUnderMouse.isParentOf(this.$element)
						|| !this.$element.isParentOf($elementUnderMouse)) {
					this.mouseout(this.$element, $.extend({}, options, {
						clientX: clientX,
						clientY: clientY,
						relatedTarget: $elementUnderMouse.get(0)
					}));
				}
				if (this.$element.isParentOf($elementUnderMouse)
						|| !$elementUnderMouse.isParentOf(this.$element)) {
					this.mouseover($elementUnderMouse, $.extend({}, options, {
						clientX: clientX,
						clientY: clientY,
						relatedTarget: this.$element.get(0)
					}));
				}
				this.$element = $elementUnderMouse;
			}
			this.mousemove(this.$element, $.extend({}, options, {
				clientX: clientX,
				clientY: clientY
			}));
			this.elementPosition = [clientX - this.$element.offset().left,
					clientY - this.$element.offset().top];
		}
		
		return this;
	};
	/**
	 * Moves the mouse over the specified element.
	 *
	 * @method enter
	 *
	 * @param {jQuery} $element The element to move over, must be added to the
	 *     DOM
	 * @param [options] The options to pass to the MouseEventSimulator
	 *
	 * @return {Simulation} The Simulation itself to allow chaining
	 */
	Simulation.prototype.enter = function ($element, options) {
		if (!options) {
			options = {};
		}
		if (this.$element.isParentOf($element)) {
			// base case
			var parents = [];
			$element.parents().each(function () {
				parents.push($(this));
			});
			var $toEnter = parents.pop();
			while (!$toEnter.equals(this.$element)) {
				$toEnter = parents.pop();
			}
			$toEnter = parents.pop() || $element;
			var pX = $toEnter.offset().left - this.$element.offset().left
					+ $toEnter.width() / 2;
			var pY = $toEnter.offset().top - this.$element.offset().top
					+ $toEnter.height() / 2;
			this.move([pX, pY]);
			this.mouseover($toEnter, $.extend({}, options, {
				clientX: this.$element.offset().left + pX,
				clientY: this.$element.offset().top + pY,
				relatedTarget: this.$element.get(0)
			}));
			this.$element = $toEnter;
			this.elementPosition = [$toEnter.width() / 2,
					$toEnter.height() / 2];
			// proceed in stack
			if (!this.$element.equals($element)) {
				this.enter($element);
			}
		} else {
			// leave current stack
			this.leave(this.$element);
			this.enter($element);
		}
		return this;
	};
	/**
	 * Moves the mouse out of the specified element.
	 *
	 * @method leave
	 *
	 * @param {jQuery} [$element] The element to move out, must be added to the
	 *     DOM
	 * @param {Object} [options] The options to pass to the MouseEventSimulator
	 *
	 * @return {Simulation} The Simulation itself to allow chaining
	 */
	Simulation.prototype.leave = function ($element, options) {
		if (!$element) {
			$element = this.$element;
		}
		if (!options) {
			options = {};
		}
		if ($element.isParentOf(this.$element)
				|| $element.equals(this.$element)) {
			// base case
			var $toLeave = this.$element;
			var $toLeaveParent = this.$element.parent();
			var pX = $toLeaveParent.width() / 2
					- ($toLeave.offset().left - $toLeaveParent.offset().left);
			var pY = $toLeaveParent.height() / 2
					- ($toLeave.offset().top - $toLeaveParent.offset().top);
			this.move([pX, pY]);
			this.mouseout($toLeave, $.extend({}, options, {
				clientX: $toLeave.offset().left + pX,
				clientY: $toLeave.offset().top + pY,
				relatedTarget: $toLeaveParent.get(0)
			}));
			this.$element = $toLeaveParent;
			this.elementPosition = [$toLeaveParent.width() / 2,
					$toLeaveParent.height() / 2];
			// leave current in stack
			if (!this.$element.equals($element.parent())) {
				this.leave($element);
			}
		} else {
			// proceed in stack
			this.enter($element);
			this.leave($element);
		}
		return this;
	};
	/**
	 * Presses a mouse button while over an element.
	 *
	 * @method press
	 *
	 * @param {jQuery} [$element] The element to press the mouse button on. It
	 *     will be entered, if it is not already on it
	 * @param {Object} [options] The options to pass to the MouseEventSimulator
	 *
	 * @return {Simulation} The Simulation itself to allow chaining
	 */
	Simulation.prototype.press = function ($element, options) {
		if (!$element) {
			$element = this.$element;
		}
		if (!options) {
			options = {};
		}
		if (!this.$element.equals($element)) {
			this.enter($element);
		}
		this.mousedown(this.$element, $.extend({}, options, {
			clientX: this.$element.offset().left + this.elementPosition[0],
			clientY: this.$element.offset().top + this.elementPosition[1]
		}));
		
		return this;
	};
	/**
	 * Releases a mouse button while over an element.
	 *
	 * @method release
	 *
	 * @param {jQuery} [$element] The element to release the mouse button on. It
	 *     will be entered, if it is not already on it
	 * @param {Object} [options] The options to pass to the MouseEventSimulator
	 *
	 * @return {Simulation} The Simulation itself to allow chaining
	 */
	Simulation.prototype.release = function ($element, options) {
		if (!$element) {
			$element = this.$element;
		}
		if (!options) {
			options = {};
		}
		if (!this.$element.equals($element)) {
			this.enter($element);
		}
		this.mouseup(this.$element, $.extend({}, options, {
			clientX: this.$element.offset().left + this.elementPosition[0],
			clientY: this.$element.offset().top + this.elementPosition[1]
		}));
		
		return this;
	};
	/**
	 * Clicks a mouse button while over an element.
	 *
	 * @method click
	 *
	 * @param {jQuery} [$element] The element to click the mouse button on. It
	 *     will be entered, if it is not already on it
	 * @param {Object} [options] The options to pass to the MouseEventSimulator
	 *
	 * @return {Simulation} The Simulation itself to allow chaining
	 */
	Simulation.prototype.click = function ($element, options) {
		if (!$element) {
			$element = this.$element;
		}
		if (!options) {
			options = {};
		}
		this.press($element);
		this.wait(5);
		this.release(this.$element);
		this.wait(5);
		this.mouseclick(this.$element, $.extend({}, options, {
			clientX: this.$element.offset().left + this.elementPosition[0],
			clientY: this.$element.offset().top + this.elementPosition[1]
		}));
		
		return this;
	};
	
	$.simula = {};
	$.simula.Observer = Observer;
	$.simula.Observable = Observable;
	$.simula.Simulator = Simulator;
	$.simula.SimulatorQueue = SimulatorQueue;
	$.simula.TimeSimulator = TimeSimulator;
	$.simula.EventSimulator = EventSimulator;
	$.simula.SimulaEvent = SimulaEvent;
	$.simula.SimulaUiEvent = SimulaUiEvent;
	$.simula.SimulaMouseEvent = SimulaMouseEvent;
	$.simula.MouseEventSimulator = MouseEventSimulator;
	$.simula.Simulation = Simulation;
	
}(jQuery));