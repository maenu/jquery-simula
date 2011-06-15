/**
 * jQuery user input simulation. Supports firefox only right now.
 *
 * @author
 *     Manuel Leuenberger
 */

(function($, undefined) {
	
	/**
	 * Creates an Observer.
	 */
	function Observer() {}
	/**
	 * Called whenever an Observable updates its Observers.
	 *
	 * @param observable
	 *     The Observable
	 * @param args
	 *     The arguments passed by the observable
	 */
	Observer.prototype.updateObservable = function(observable, args) {};
	
	/**
	 * Creates an Observable.
	 */
	function Observable() {
		/**
		 * The Observers.
		 */
		this.observers = [];
	}
	/**
	 * Updates all Observers this the specified arguments.
	 *
	 * @param args
	 *     The arguments to pass to the Observers
	 */
	Observable.prototype.updateObservers = function(args) {
		for (var i = 0; i < this.observers.length; i++) {
			this.observers[i].updateObservable(this, args);
		}
	};
	/**
	 * Adds an Observer. If it is already registered, it will not be added
	 * again.
	 *
	 * @param observer
	 *     The observer to add
	 */
	Observable.prototype.addObserver = function(observer) {
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
	 * @param observer
	 *     The observer to remove
	 */
	Observable.prototype.removeObserver = function(observer) {
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
	 * @param options
	 *     The options to use for the event. If some properties are missing, the
	 *     default values are used. It must contain a type property
	 */
	function SimulaEvent(options) {
		var fullOptions = $.extend(
			{},
			{
				bubbles: true,
				cancelable: true
			},
			options
		);
		
		/**
		 * The name of the event (case-insensitive). The name must be an XML
		 * name.
		 */
		this.type = fullOptions.type;
		/**
		 * Used to indicate whether or not an event is a bubbling event. If the
		 * event can bubble the value is true, else the value is false.
		 */
		this.bubbles = fullOptions.bubbles;
		/**
		 * Used to indicate whether or not an event can have its default action
		 * prevented. If the default action can be prevented the value is true,
		 * else the value is false.
		 */
		this.cancelable = fullOptions.cancelable;
	}
	SimulaEvent.PHASE = {
		CAPTURING: 1,
		AT_TARGET: 2,
		BUBBLING: 3
	};
	
	/**
	 * Creates an SimulaUIEvent. Properties are taken from
	 * http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-SimulaUIEvent.
	 *
	 * @param options
	 *     The options to use for the event. If some properties are missing, the
	 *     default values are used.
	 */
	function SimulaUIEvent(options) {
		SimulaEvent.apply(this, [options]);
		
		var fullOptions = $.extend(
			{},
			{
				view: window,
				detail: 0
			},
			options
		);
		
		/**
		 * The view attribute identifies the AbstractView from which the event
		 * was generated.
		 */
		this.view = fullOptions.view;
		/**
		 * Specifies some detail information about the Event, depending on the
		 * type of event.
		 */
		this.detail = fullOptions.detail;
	}
	SimulaUIEvent.prototype = new SimulaEvent();
	SimulaUIEvent.prototype.constructor = SimulaUIEvent;
	
	/**
	 * Creates a SimulaMouseEvent. Properties are taken from
	 * http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-
	 * SimulaMouseEvent.
	 *
	 * @param options
	 *     The options to use for the event. If some properties are missing, the
	 *     default values are used.
	 */
	function SimulaMouseEvent(options) {
		SimulaUIEvent.apply(this, [options]);
		
		var fullOptions = $.extend(
			{},
			{
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
			},
			options
		);
		
		/**
		 * The horizontal coordinate at which the event occurred relative to the
		 * origin of the screen coordinate system.
		 */
		this.screenX = fullOptions.screenX;
		/**
		 * The vertical coordinate at which the event occurred relative to the
		 * origin of the screen coordinate system.
		 */
		this.screenY = fullOptions.screenY;
		/**
		 * The horizontal coordinate at which the event occurred relative to the
		 * DOM implementation's client area.
		 */
		this.clientX = fullOptions.clientX;
		/**
		 * The vertical coordinate at which the event occurred relative to the
		 * DOM implementation's client area.
		 */
		this.clientY = fullOptions.clientY;
		/**
		 * Used to indicate whether the 'ctrl' key was depressed during the
		 * firing of the event.
		 */
		this.ctrlKey = fullOptions.ctrlKey;
		/**
		 * Used to indicate whether the 'shift' key was depressed during the
		 * firing of the event.
		 */
		this.shiftKey = fullOptions.shiftKey;
		/**
		 * Used to indicate whether the 'alt' key was depressed during the
		 * firing of the event. On some platforms this key may map to an
		 * alternative key name.
		 */
		this.altKey = fullOptions.altKey;
		/**
		 * Used to indicate whether the 'meta' key was depressed during the
		 * firing of the event. On some platforms this key may map to an
		 * alternative key name.
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
		 */
		this.button = fullOptions.button;
		/**
		 * Used to identify a secondary EventTarget related to a UI event.
		 * Currently this attribute is used with the mouseover event to indicate
		 * the EventTarget which the pointing device exited and with the
		 * mouseout event to indicate the EventTarget which the pointing device
		 * entered.
		 */
		this.relatedTarget = fullOptions.relatedTarget;
	}
	SimulaMouseEvent.prototype = new SimulaUIEvent();
	SimulaMouseEvent.prototype.constructor = SimulaMouseEvent;
	SimulaMouseEvent.BUTTON = {
		LEFT: 0,
		MIDDLE: 1,
		RIGHT: 2
	};
	SimulaMouseEvent.TYPE = {
		CLICK: "click",
		DOWN: "mousedown",
		UP: "mouseup",
		OVER: "mouseover",
		OUT: "mouseout",
		MOVE: "mousemove"
	};
	
	/**
	 * Creates a Simulator.
	 */
	function Simulator() {
		Observable.apply(this);
		
		/**
		 * true, if it is running.
		 */
		this.running = false;
	}
	Simulator.prototype = new Observable();
	Simulator.prototype.constructor = Simulator;
	/**
	 * Updates all Observers with 'finish'.
	 */
	Simulator.prototype.finish = function() {
		this.running = false;
		this.updateObservers("finish");
	};
	/**
	 * Starts the the simulation, i.e. dispatches events. Must call finish, at
	 * the end.
	 *
	 * @throws Error
	 *     If it is already running
	 */
	Simulator.prototype.execute = function() {
		if (this.isRunning()) {
			throw new Error("SimulatorQueue is already running");
		}
		this.running = true;
	};
	/**
	 * Checks if it is running.
	 *
	 * @return
	 *     true, if it is, false otherwise
	 */
	Simulator.prototype.isRunning = function() {
		return this.running;
	};
	
	/**
	 * Creates a SimulatorQueue.
	 *
	 * @param simulators
	 *     An ordered Array of Simulators which will be executed one after
	 *     another
	 */
	function SimulatorQueue(simulators) {
		Simulator.apply(this);
		
		/**
		 * The Simulators.
		 */
		this.simulators = simulators;
		/**
		 *	The index of the current Simulator.
		 */
		this.currentIndex = -1;
	}
	SimulatorQueue.prototype = new Simulator();
	SimulatorQueue.prototype.constructor = SimulatorQueue;
	SimulatorQueue.prototype.updateObservable = function(observable, args) {
		if (args != "finish"
			|| this.currentIndex < 0
			|| this.currentIndex >= this.simulators.length
			|| observable != this.simulators[this.currentIndex]) {
			return;
		}
		var simulator = this.simulators[this.currentIndex];
		simulator.removeObserver(this);
		this.proceed();
	};
	SimulatorQueue.prototype.execute = function() {
		Simulator.prototype.execute.apply(this);
		this.proceed();
	};
	/**
	 * Proceeds with the execution of the next Simulator.
	 */
	SimulatorQueue.prototype.proceed = function() {
		this.currentIndex++;
		if (this.currentIndex == this.simulators.length) {
			this.currentIndex = -1;
			this.finish();
			return;
		}
		var simulator = this.simulators[this.currentIndex];
		simulator.addObserver(this);
		simulator.execute();
	};
	
	/**
	 * Creates a TimeSimulator.
	 *
	 * @param time
	 *     The amount of milliseconds to wait before the Observers are updated
	 */
	function TimeSimulator(time) {
		Simulator.apply(this);
		
		/**
		 * The amount of milliseconds to wait before the Observers are updated.
		 */
		this.time = time;
	}
	TimeSimulator.prototype = new Simulator();
	TimeSimulator.prototype.constructor = TimeSimulator;
	TimeSimulator.prototype.execute = function() {
		Simulator.prototype.execute.apply(this);
		var self = this;
		setTimeout(
			function() {
				self.finish();
			},
			this.time
		);
	};
	
	/**
	 * Creates an EventSimulator.
	 *
	 * @param $element
	 *     The jQuery element on which to dispatch the event
	 * @param simulaEvent
	 *     The SimulaEvent to init and dispatch
	 */
	function EventSimulator($element, simulaEvent) {
		Simulator.apply(this);
		
		/**
		 * The jQuery element on which to dispatch the event.
		 */
		this.$element = $element;
		/**
		 * The SimulaEvent to init and dispatch.
		 */
		this.simulaEvent = simulaEvent;
		/**
		 * The listener to add and remove.
		 */
		this.listener = function() {};
		/**
		 * The Event that is dispatched.
		 */
		this.event = null;
	}
	EventSimulator.prototype = new Simulator();
	EventSimulator.prototype.constructor = EventSimulator;
	/**
	 * Template method that builds the Event.
	 *
	 * @return
	 *     An Event that can be dispatched by dispatchEvent
	 */
	EventSimulator.prototype.buildEvent = function() {
		return null;
	};
	/**
	 * Template method to add an event listener for the specified Event.
	 */
	EventSimulator.prototype.addEventListener = function() {
		
	};
	/**
	 * Template method to remove an event listener for the specified Event.
	 */
	EventSimulator.prototype.removeEventListener = function() {
		
	};
	/**
	 * Event listener that calls finish if the specified Event is the one that
	 * was dispatched.
	 *
	 * @param event
	 *     The Event that was found
	 */
	EventSimulator.prototype.handleEvent = function(event) {
		if (event == this.event) {
			this.removeEventListener(event);
			this.listener = function() {};
			this.event = null;
			this.finish();
		}
	};
	/**
	 * Template method that dispatches an Event.
	 *
	 * @param event
	 *     The event to be dispatched
	 */
	EventSimulator.prototype.dispatchEvent = function(event) {};
	EventSimulator.prototype.execute = function() {
		Simulator.prototype.execute.apply(this);
		this.event = this.buildEvent();
		var self = this;
		this.listener = function(event) {
			self.handleEvent(event);
		};
		this.addEventListener();
		this.dispatchEvent();
	};
	
	/**
	 * Creates an W3CMouseEventSimulator.
	 *
	 * @param $element
	 *     The jQuery element on which to dispatch the event
	 * @param mouseEvent
	 *     The SimulaMouseEvent to init and dispatch
	 */
	function W3CMouseEventSimulator($element, mouseEvent) {
		EventSimulator.apply(this, [$element, mouseEvent]);
	}
	W3CMouseEventSimulator.prototype = new EventSimulator();
	W3CMouseEventSimulator.prototype.constructor = W3CMouseEventSimulator;
	W3CMouseEventSimulator.prototype.buildEvent = function() {
		var mouseEvent = this.simulaEvent;
		var event = document.createEvent("MouseEvents");
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
	W3CMouseEventSimulator.prototype.addEventListener = function() {
		this.$element.get(0).addEventListener(this.event.type, this.listener,
			false);
	};
	W3CMouseEventSimulator.prototype.removeEventListener = function() {
		this.$element.get(0).removeEventListener(this.event.type, this.listener,
			false);
	};
	W3CMouseEventSimulator.prototype.dispatchEvent = function() {
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
	 * @param $element
	 *     The jQuery element over which the mouse is
	 * @param elementPosition
	 *     The mouse position relative to the specified element
	 */
	function Simulation($element, elementPosition) {
		Simulator.apply(this);
		
		/**
		 * The internally used SimulatorQueue.
		 */
		this.simulatorQueue = new SimulatorQueue([]);
		/**
		 * The jQuery element over which the mouse is.
		 */
		this.$element = $element;
		/**
		 * The mouse position relative to the specified element.
		 */
		this.elementPosition = [elementPosition[0], elementPosition[1]];
	}
	Simulation.prototype = new Simulator();
	Simulation.prototype.constructor = Simulation;
	Simulation.prototype.updateObservable = function(observable, args) {
		if (args != "finish"
			|| observable != this.simulatorQueue) {
			return;
		}
		this.simulatorQueue.removeObserver(this);
		this.finish();
	};
	Simulation.prototype.execute = function() {
		Simulator.prototype.execute.apply(this);
		this.simulatorQueue.addObserver(this);
		this.simulatorQueue.execute();
	};
	/**
	 * Waits for the specified duration before executing the next command.
	 *
	 * @param duration
	 *     The duration in milliseconds, optional
	 *
	 * @return
	 *     The Simulation itself to allow chaining
	 */
	Simulation.prototype.wait = function(duration) {
		if (!duration) {
			duration = 50;
		}
		this.simulatorQueue.simulators.push(new TimeSimulator(duration));
		
		return this;
	};
	/**
	 * Adds exactly one mousemove with the specified options and element.
	 *
	 * @param $element
	 *     The element to move on, must be added to the DOM, optional
	 * @param options
	 *     The options to pass to the MouseEventSimulator, optional
	 *
	 * @return
	 *     The Simulation itself to allow chaining
	 */
	Simulation.prototype.mousemove = function($element, options) {
		// init optional arguments
		if (!options) {
			options = {};
		}
		if (!$element) {
			$element = this.$element;
		}
		// setup event
		this.simulatorQueue.simulators.push(new MouseEventSimulator(
			$element,
			new SimulaMouseEvent($.extend(
				{},
				options,
				{
					type: SimulaMouseEvent.TYPE.MOVE,
					cancelable: false
				}
			))
		));
		return this;
	};
	/**
	 * Adds exactly one mouseover with the specified options and element.
	 *
	 * @param $element
	 *     The element to move over on, must be added to the DOM, optional
	 * @param options
	 *     The options to pass to the MouseEventSimulator, optional
	 *
	 * @return
	 *     The Simulation itself to allow chaining
	 */
	Simulation.prototype.mouseover = function($element, options) {
		// init optional arguments
		if (!options) {
			options = {};
		}
		if (!$element) {
			$element = this.$element;
		}
		// setup event
		this.simulatorQueue.simulators.push(new MouseEventSimulator(
			$element,
			new SimulaMouseEvent($.extend(
				{},
				options,
				{
					type: SimulaMouseEvent.TYPE.OVER
				}
			))
		));
		return this;
	};
	/**
	 * Adds exactly one mouseout with the specified options and element.
	 *
	 * @param $element
	 *     The element to move out, must be added to the DOM, optional
	 * @param options
	 *     The options to pass to the MouseEventSimulator, optional
	 *
	 * @return
	 *     The Simulation itself to allow chaining
	 */
	Simulation.prototype.mouseout = function($element, options) {
		// init optional arguments
		if (!options) {
			options = {};
		}
		if (!$element) {
			$element = this.$element;
		}
		// setup event
		this.simulatorQueue.simulators.push(new MouseEventSimulator(
			$element,
			new SimulaMouseEvent($.extend(
				{},
				options,
				{
					type: SimulaMouseEvent.TYPE.OUT
				}
			))
		));
		return this;
	};
	/**
	 * Adds exactly one mousedown with the specified options and element.
	 *
	 * @param $element
	 *     The element to press the mouse down, must be added to the DOM,
	 *     optional
	 * @param options
	 *     The options to pass to the MouseEventSimulator, optional
	 *
	 * @return
	 *     The Simulation itself to allow chaining
	 */
	Simulation.prototype.mousedown = function($element, options) {
		// init optional arguments
		if (!options) {
			options = {};
		}
		if (!$element) {
			$element = this.$element;
		}
		// setup event
		this.simulatorQueue.simulators.push(new MouseEventSimulator(
			$element,
			new SimulaMouseEvent($.extend(
				{
					button: SimulaMouseEvent.BUTTON.LEFT
				},
				options,
				{
					type: SimulaMouseEvent.TYPE.DOWN
				}
			))
		));
		return this;
	};
	/**
	 * Adds exactly one mouseup with the specified options and element.
	 *
	 * @param $element
	 *     The element to release the mouse up, must be added to the DOM,
	 *     optional
	 * @param options
	 *     The options to pass to the MouseEventSimulator, optional
	 *
	 * @return
	 *     The Simulation itself to allow chaining
	 */
	Simulation.prototype.mouseup = function($element, options) {
		// init optional arguments
		if (!options) {
			options = {};
		}
		if (!$element) {
			$element = this.$element;
		}
		// setup event
		this.simulatorQueue.simulators.push(new MouseEventSimulator(
			$element,
			new SimulaMouseEvent($.extend(
				{
					button: SimulaMouseEvent.BUTTON.LEFT
				},
				options,
				{
					type: SimulaMouseEvent.TYPE.UP
				}
			))
		));
		return this;
	};
	/**
	 * Adds exactly one click with the specified options and element.
	 *
	 * @param $element
	 *     The element to click on, must be added to the DOM, optional
	 * @param options
	 *     The options to pass to the MouseEventSimulator, optional
	 *
	 * @return
	 *     The Simulation itself to allow chaining
	 */
	Simulation.prototype.mouseclick = function($element, options) {
		// init optional arguments
		if (!options) {
			options = {};
		}
		if (!$element) {
			$element = this.$element;
		}
		// setup event
		this.simulatorQueue.simulators.push(new MouseEventSimulator(
			$element,
			new SimulaMouseEvent($.extend(
				{
					button: SimulaMouseEvent.BUTTON.LEFT
				},
				options,
				{
					type: SimulaMouseEvent.TYPE.CLICK
				}
			))
		));
		return this;
	};
	/**
	 * Moves the mouse to the specified position in the specified duration by
	 * dispatching a mousemove every 15 milliseconds.
	 *
	 * @param elementPosition
	 *     The mouse position relative to the current element
	 * @param duration
	 *     The time to use to move to the specified position in milliseconds,
	 *     optional
	 * @param options
	 *     The options to pass to the MouseEventSimulator, optional
	 * @param auto
	 *     The mouse move mode, optional. If true, whenever the mouse moves over
	 *     and out of an element, it dispatches the according event and sets the
	 *     internal $element and elementPosition
	 *
	 * @return
	 *     The Simulation itself to allow chaining
	 */
	Simulation.prototype.move = function(elementPosition, duration, options,
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
		if (duration % 15 != 0) {
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
					this.mouseout(
						this.$element,
						$.extend(
							{},
							options,
							{
								clientX: clientX,
								clientY: clientY,
								relatedTarget: $elementUnderMouse.get(0)
							}
						)
					);
				}
				if (this.$element.isParentOf($elementUnderMouse)
					|| !$elementUnderMouse.isParentOf(this.$element)) {
					this.mouseover(
						$elementUnderMouse,
						$.extend(
							{},
							options,
							{
								clientX: clientX,
								clientY: clientY,
								relatedTarget: this.$element.get(0)
							}
						)
					);
				}
				this.$element = $elementUnderMouse;
			}
			this.mousemove(
				this.$element,
				$.extend(
					{},
					options,
					{
						clientX: clientX,
						clientY: clientY
					}
				)
			);
			this.elementPosition = [clientX - this.$element.offset().left,
				clientY - this.$element.offset().top];
		}
		
		return this;
	};
	/**
	 * Moves the mouse over the specified element.
	 *
	 * @param $element
	 *     The element to move over, must be added to the DOM
	 * @param options
	 *     The options to pass to the MouseEventSimulator, optional
	 *
	 * @return
	 *     The Simulation itself to allow chaining
	 */
	Simulation.prototype.enter = function($element, options) {
		if (!options) {
			options = {};
		}
		if (this.$element.isParentOf($element)) {
			// base case
			var parents = [];
			$element.parents().each(function() {
				parents.push($(this));
			});
			while (!parents.pop().equals(this.$element)) {}
			var $toEnter = parents.pop() || $element;
			var pX = $toEnter.offset().left - this.$element.offset().left
				+ $toEnter.width() / 2;
			var pY = $toEnter.offset().top - this.$element.offset().top
				+ $toEnter.height() / 2;
			this.move([pX, pY]);
			this.mouseover(
				$toEnter,
				$.extend(
					{},
					options,
					{
						clientX: this.$element.offset().left + pX,
						clientY: this.$element.offset().top + pY,
						relatedTarget: this.$element.get(0)
					}
				)
			);
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
	 * @param $element
	 *     The element to move out, must be added to the DOM, optional
	 * @param options
	 *     The options to pass to the MouseEventSimulator, optional
	 *
	 * @return
	 *     The Simulation itself to allow chaining
	 */
	Simulation.prototype.leave = function($element, options) {
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
			this.mouseout(
				$toLeave,
				$.extend(
					{},
					options,
					{
						clientX: $toLeave.offset().left + pX,
						clientY: $toLeave.offset().top + pY,
						relatedTarget: $toLeaveParent.get(0)
					}
				)
			);
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
	 * @param $element
	 *     The element to press the mouse button on, optional. It will be
	 *     entered, if it is not already on it
	 * @param options
	 *     The options to pass to the MouseEventSimulator, optional
	 *
	 * @return
	 *     The Simulation itself to allow chaining
	 */
	Simulation.prototype.press = function($element, options) {
		if (!$element) {
			$element = this.$element;
		}
		if (!options) {
			options = {};
		}
		if (!this.$element.equals($element)) {
			this.enter($element);
		}
		this.mousedown(
			this.$element,
			$.extend(
				{},
				options,
				{
					clientX: this.$element.offset().left
						+ this.elementPosition[0],
					clientY: this.$element.offset().top
						+ this.elementPosition[1]
				}
			)
		);
		
		return this;
	};
	/**
	 * Releases a mouse button while over an element.
	 *
	 * @param $element
	 *     The element to release the mouse button on, optional. It will be
	 *     entered, if it is not already on it
	 * @param options
	 *     The options to pass to the MouseEventSimulator, optional
	 *
	 * @return
	 *     The Simulation itself to allow chaining
	 */
	Simulation.prototype.release = function($element, options) {
		if (!$element) {
			$element = this.$element;
		}
		if (!options) {
			options = {};
		}
		if (!this.$element.equals($element)) {
			this.enter($element);
		}
		this.mouseup(
			this.$element,
			$.extend(
				{},
				options,
				{
					clientX: this.$element.offset().left
						+ this.elementPosition[0],
					clientY: this.$element.offset().top
						+ this.elementPosition[1]
				}
			)
		);
		
		return this;
	};
	/**
	 * Clicks a mouse button while over an element.
	 *
	 * @param $element
	 *     The element to click the mouse button on, optional. It will be
	 *     entered, if it is not already on it
	 * @param options
	 *     The options to pass to the MouseEventSimulator, optional
	 *
	 * @return
	 *     The Simulation itself to allow chaining
	 */
	Simulation.prototype.click = function($element, options) {
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
		this.mouseclick(
			this.$element,
			$.extend(
				{},
				options,
				{
					clientX: this.$element.offset().left
						+ this.elementPosition[0],
					clientY: this.$element.offset().top
						+ this.elementPosition[1]
				}
			)
		);
		
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
	$.simula.SimulaUIEvent = SimulaUIEvent;
	$.simula.SimulaMouseEvent = SimulaMouseEvent;
	$.simula.MouseEventSimulator = MouseEventSimulator;
	$.simula.Simulation = Simulation;
	
}(jQuery));