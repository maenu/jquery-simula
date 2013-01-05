/*global
	$: true,
	jasmine: true,
	describe: true,
	it: true,
	expect: true,
	beforeEach: true,
	afterEach: true,
	spyOn: true,
	waits: true,
	waitsFor: true,
	runs: true
*/
/**
 * Tests the simula module for jQuery.
 *
 * @author Manuel Leuenberger
 */

describe('jquery.maenulabs.simula', function () {
	/*jshint maxlen: 200, maxstatements: 100*/
	
	describe('jquery extensions', function () {
	
		describe('equals', function () {
		
			var markup = '<div id="one"></div>'
					+ '<div id="two"></div>';
			var $markup;
		
			beforeEach(function () {
				$markup = $(markup);
				$('body').append($markup);
			});
		
			afterEach(function () {
				$markup.remove();
			});
		
			it('should be equal to itself', function () {
				var $one = $('#one');
				expect($one.equals($one)).toBeTruthy();
			});
		
			it('should be equal to another jQuery with same selector',
					function () {
				expect($('#one').equals($('#one'))).toBeTruthy();
			});
		
			it('should be equal to another DOM element with same selector',
					function () {
				expect($('#one').equals($('#one')[0])).toBeTruthy();
			});
		
			it('should not be equal to another', function () {
				var $one = $('#one');
				var $two = $('#two');
				expect($one.equals($two)).toBeFalsy();
			});
		
		});
	
		describe('elementFromPoint', function () {
		
			var markup = '<div id="spacer"></div>'
					+ '<div id="one" style="margin-left: 100px; width: 200px; height:200px;">'
					+ '<div id="two" style="width: 100px; height:100px;"></div>'
					+ '</div>'
					+ '<div id="three" style="margin-left: 100px; width: 100px; height:100px;"></div>';
			var $markup;
		
			beforeEach(function () {
				$markup = $(markup);
				$('body').prepend($markup);
			});
		
			afterEach(function () {
				$markup.remove();
			});
		
			it('should get elements when scrolled', function () {
				$('#spacer').css('height', '1000px');
				$('#spacer').css('width', '2000px');
				$(document).scrollLeft(50);
				$(document).scrollTop($('#one').offset().top - 23);
				var oneClientX = $('#one').offset().left + $('#one').width() - 2 - $(document).scrollLeft();
				var oneClientY = $('#one').offset().top + $('#one').height() - 2 - $(document).scrollTop();
				var atOnePosition = $.elementFromPoint(oneClientX, oneClientY);
				expect($('#one').equals($(atOnePosition))).toBeTruthy();
				var twoClientX = $('#two').offset().left + 2 - $(document).scrollLeft();
				var twoClientY = $('#two').offset().top + 2 - $(document).scrollTop();
				var atTwoPosition = $.elementFromPoint(twoClientX, twoClientY);
				expect($('#two').equals($(atTwoPosition))).toBeTruthy();
				var threeClientX = $('#three').offset().left + 2 - $(document).scrollLeft();
				var threeClientY = $('#three').offset().top + 2 - $(document).scrollTop();
				var atThreePosition = $.elementFromPoint(threeClientX, threeClientY);
				expect($('#three').equals($(atThreePosition))).toBeTruthy();
			});
		
			it('should get elements when not scrolled', function () {
				$(document).scrollLeft(0);
				$(document).scrollTop(0);
				var oneClientX = $('#one').offset().left + $('#one').width() - 2 - $(document).scrollLeft();
				var oneClientY = $('#one').offset().top + $('#one').height() - 2 - $(document).scrollTop();
				var atOnePosition = $.elementFromPoint(oneClientX, oneClientY);
				expect($('#one').equals($(atOnePosition))).toBeTruthy();
				var twoClientX = $('#two').offset().left + 2 - $(document).scrollLeft();
				var twoClientY = $('#two').offset().top + 2 - $(document).scrollTop();
				var atTwoPosition = $.elementFromPoint(twoClientX, twoClientY);
				expect($('#two').equals($(atTwoPosition))).toBeTruthy();
				var threeClientX = $('#three').offset().left + 2 - $(document).scrollLeft();
				var threeClientY = $('#three').offset().top + 2 - $(document).scrollTop();
				var atThreePosition = $.elementFromPoint(threeClientX, threeClientY);
				expect($('#three').equals($(atThreePosition))).toBeTruthy();
			});
		
		});
	
		describe('isParentOf', function () {
		
			var markup = '<div id="parent">'
					+ '<div id="child1">'
					+ '<div id="child1_1"></div>'
					+ '</div>'
					+ '<div id="child2"></div>'
					+ '</div>'
					+ '<div id="sibling"></div>';
			var $markup;
		
			beforeEach(function () {
				$markup = $(markup);
				$('body').append($markup);
			});
		
			afterEach(function () {
				$markup.remove();
			});
		
			it('should not be parent of sibling', function () {
				expect($('#parent').isParentOf($('#sibling'))).toBeFalsy();
				expect($('#sibling').isParentOf($('#parent'))).toBeFalsy();
			});
		
			it('should not be parent of parent', function () {
				expect($('#parent').isParentOf($('#parent'))).toBeFalsy();
			});
		
			it('should not be that a child is the parent of parent', function () {
				expect($('#child1').isParentOf($('#parent'))).toBeFalsy();
				expect($('#child2').isParentOf($('#parent'))).toBeFalsy();
			});
		
			it('should be the parent of children', function () {
				expect($('#parent').isParentOf($('#child1'))).toBeTruthy();
				expect($('#parent').isParentOf($('#child1_1'))).toBeTruthy();
				expect($('#parent').isParentOf($('#child2'))).toBeTruthy();
				expect($('#child1').isParentOf($('#child1_1'))).toBeTruthy();
			});
		
			it('should be the parent of children as DOM elements', function () {
				expect($('#parent').isParentOf($('#child1')[0])).toBeTruthy();
				expect($('#parent').isParentOf($('#child1_1')[0])).toBeTruthy();
				expect($('#parent').isParentOf($('#child2')[0])).toBeTruthy();
				expect($('#child1').isParentOf($('#child1_1')[0])).toBeTruthy();
			});
		
		});
	
	});
	
	describe('simula.Observer', function () {
		
		var observer;
		
		beforeEach(function () {
			observer = new $.simula.Observer();
		});
		
		it('should have an updateObservable method', function () {
			expect(observer.updateObservable).toBeDefined();
		});
		
	});
	
	describe('simula.Observable', function () {
		
		var observer1;
		var observer2;
		var observable;
		
		beforeEach(function () {
			observer1 = new $.simula.Observer();
			observer2 = new $.simula.Observer();
			observable = new $.simula.Observable();
		});
		
		it('should have no Observers at startup', function () {
			expect(observable.observers.length).toEqual(0);
		});
		
		describe('add and removing of Observers', function () {
		
			it('should add an Observer', function () {
				observable.addObserver(observer1);
				expect(observable.observers.length).toEqual(1);
				expect(observable.observers).toContain(observer1);
			});
		
			it('should remove an Observer', function () {
				observable.addObserver(observer1);
				observable.removeObserver(observer1);
				expect(observable.observers.length).toEqual(0);
			});
			
			it('should not add an Observer twice', function () {
				observable.addObserver(observer1);
				observable.addObserver(observer1);
				expect(observable.observers.length).toEqual(1);
				expect(observable.observers).toContain(observer1);
			});
			
			it('should forgive trying to remove an uncontained Observer', function () {
				observable.removeObserver(observer1);
				expect(observable.observers.length).toEqual(0);
			});
			
			it('should still contain registered Observers after a remove', function () {
				observable.addObserver(observer1);
				observable.addObserver(observer2);
				observable.removeObserver(observer1);
				expect(observable.observers.length).toEqual(1);
				expect(observable.observers).toContain(observer2);
			});
			
		});
		
		describe('updating Observers', function () {
			
			it('should update an added Observer', function () {
				spyOn(observer1, 'updateObservable');
				observable.addObserver(observer1);
				expect(observer1.updateObservable).not.toHaveBeenCalled();
				var args = 'update';
				observable.updateObservers(args);
				expect(observer1.updateObservable).toHaveBeenCalledWith(observable, args);
			});
			
			it('should update multiple added Observers', function () {
				spyOn(observer1, 'updateObservable');
				spyOn(observer2, 'updateObservable');
				observable.addObserver(observer1);
				observable.addObserver(observer2);
				expect(observer1.updateObservable).not.toHaveBeenCalled();
				expect(observer2.updateObservable).not.toHaveBeenCalled();
				var args = 'update';
				observable.updateObservers(args);
				expect(observer1.updateObservable).toHaveBeenCalledWith(observable, args);
				expect(observer2.updateObservable).toHaveBeenCalledWith(observable, args);
			});
			
			it('should not update a removed Observer', function () {
				spyOn(observer1, 'updateObservable');
				observable.addObserver(observer1);
				observable.removeObserver(observer1);
				expect(observer1.updateObservable).not.toHaveBeenCalled();
				var args = 'update';
				observable.updateObservers(args);
				expect(observer1.updateObservable).not.toHaveBeenCalled();
			});
			
			it('should not update a removed Observer but update an added Observer', function () {
				spyOn(observer1, 'updateObservable');
				spyOn(observer2, 'updateObservable');
				observable.addObserver(observer1);
				observable.addObserver(observer2);
				observable.removeObserver(observer2);
				expect(observer1.updateObservable).not.toHaveBeenCalled();
				expect(observer2.updateObservable).not.toHaveBeenCalled();
				var args = 'update';
				observable.updateObservers(args);
				expect(observer1.updateObservable).toHaveBeenCalledWith(observable, args);
				expect(observer2.updateObservable).not.toHaveBeenCalled();
			});
			
		});
		
	});
	
	describe('simula.Simulator', function () {
		
		var observer;
		var simulator;
		
		beforeEach(function () {
			observer = new $.simula.Observer();
			simulator = new $.simula.Simulator();
		});
		
		afterEach(function () {
			simulator.stop();
		});
		
		describe('execute', function () {
			
			it('should update its Observers on execute then finish', function () {
				spyOn(simulator, 'finish').andCallThrough();
				spyOn(observer, 'updateObservable').andCallThrough();
				simulator.addObserver(observer);
				expect(simulator.isRunning()).toBeFalsy();
				expect(simulator.finish).not.toHaveBeenCalled();
				expect(observer.updateObservable).not.toHaveBeenCalled();
				simulator.execute();
				expect(simulator.isRunning()).toBeTruthy();
				expect(simulator.finish).not.toHaveBeenCalled();
				expect(observer.updateObservable).not.toHaveBeenCalled();
				simulator.finish();
				expect(simulator.isRunning()).toBeFalsy();
				expect(simulator.finish).toHaveBeenCalled();
				expect(observer.updateObservable).toHaveBeenCalledWith(simulator, 'finish');
			});
			
			it('should throw an error when trying to execute while running', function () {
				spyOn(simulator, 'finish').andCallThrough();
				simulator.execute();
				expect(function () {
					simulator.execute();
				}).toThrow(new Error('Simulator is already running'));
			});
			
		});
		
		describe('stop', function () {
			
			it('should do nothing if not running', function () {
				spyOn(observer, 'updateObservable').andCallThrough();
				simulator.addObserver(observer);
				expect(simulator.isRunning()).toBeFalsy();
				expect(observer.updateObservable).not.toHaveBeenCalled();
				simulator.stop();
				expect(simulator.isRunning()).toBeFalsy();
				expect(observer.updateObservable).not.toHaveBeenCalled();
			});
			
			it('should update with stop if running', function () {
				spyOn(observer, 'updateObservable').andCallThrough();
				simulator.addObserver(observer);
				simulator.running = true;
				expect(simulator.isRunning()).toBeTruthy();
				expect(observer.updateObservable).not.toHaveBeenCalled();
				simulator.stop();
				expect(simulator.isRunning()).toBeFalsy();
				expect(observer.updateObservable).toHaveBeenCalledWith(simulator, 'stop');
			});
			
		});
		
	});
	
	describe('simula.TimeSimulator', function () {
		
		var timeSimulator;
		var beforeExecution;
		
		beforeEach(function () {
			timeSimulator = new $.simula.TimeSimulator(50);
		});
		
		afterEach(function () {
			timeSimulator.stop();
		});
		
		it('should finish after the interval', function () {
			runs(function () {
				spyOn(timeSimulator, 'finish').andCallThrough();
				expect(timeSimulator.finish).not.toHaveBeenCalled();
				expect(timeSimulator.isRunning()).toBeFalsy();
				beforeExecution = new Date();
				timeSimulator.execute();
				expect(timeSimulator.finish).not.toHaveBeenCalled();
				expect(timeSimulator.isRunning()).toBeTruthy();
			});
			waitsFor(function () {
				return timeSimulator.finish.callCount == 1;
			}, 'finish to be called', 100);
			runs(function () {
				expect((new Date()).getTime() - beforeExecution.getTime()).toBeGreaterThan(40);
				expect(timeSimulator.finish).toHaveBeenCalled();
				expect(timeSimulator.isRunning()).toBeFalsy();
			});
		});
			
		it('should clear the interval on stop', function () {
			runs(function () {
				this.observer = new $.simula.Observer();
				spyOn(this.observer, 'updateObservable').andCallThrough();
				timeSimulator.addObserver(this.observer);
				timeSimulator.execute();
				expect(timeSimulator.isRunning()).toBeTruthy();
				expect(this.observer.updateObservable).not.toHaveBeenCalled();
				timeSimulator.stop();
				expect(timeSimulator.isRunning()).toBeFalsy();
				expect(this.observer.updateObservable).toHaveBeenCalledWith(timeSimulator, 'stop');
				this.observer.updateObservable.reset();
			});
			waits(200);
			runs(function () {
				expect(this.observer.updateObservable).not.toHaveBeenCalled();
			});
		});
		
	});
	
	describe('simula.SimulatorQueue', function () {
		
		function TestSimulator() {
			$.simula.Simulator.apply(this);
		}
		TestSimulator.prototype = new $.simula.Simulator();
		TestSimulator.prototype.constructor = TestSimulator;
		TestSimulator.prototype.execute = function () {
			beforeExecution = new Date();
			$.simula.Simulator.prototype.execute.apply(this);
			this.finish();
		};
		
		function TestTimeSimulator(id, time) {
			$.simula.TimeSimulator.apply(this, [time]);
			this.id = id;
		}
		TestTimeSimulator.prototype = new $.simula.TimeSimulator();
		TestTimeSimulator.prototype.constructor = TestTimeSimulator;
		TestTimeSimulator.prototype.execute = function () {
			beforeExecution[this.id] = new Date();
			$.simula.TimeSimulator.prototype.execute.apply(this);
		};
		
		var observer;
		var simulatorQueue;
		var beforeExecution;
		
		beforeEach(function () {
			observer = new $.simula.Observer();
			simulatorQueue = new $.simula.SimulatorQueue([]);
			beforeExecution = {};
		});
		
		afterEach(function () {
			simulatorQueue.stop();
		});
		
		describe('empty SimulatorQueue', function () {
			
			it('should have an empty simulators Array', function () {
				expect(simulatorQueue.simulators.length).toEqual(0);
			});
			
			it('should just finish on execute', function () {
				spyOn(simulatorQueue, 'finish').andCallThrough();
				spyOn(observer, 'updateObservable').andCallThrough();
				simulatorQueue.addObserver(observer);
				expect(simulatorQueue.finish).not.toHaveBeenCalled();
				expect(observer.updateObservable).not.toHaveBeenCalled();
				simulatorQueue.execute();
				expect(simulatorQueue.finish).toHaveBeenCalled();
				expect(observer.updateObservable).toHaveBeenCalledWith(simulatorQueue, 'finish');
			});
			
		});
		
		describe('single element in SimulatorQueue', function () {
			
			var simulator;
			
			beforeEach(function () {
				simulator = new TestSimulator();
				simulatorQueue = new $.simula.SimulatorQueue([simulator]);
			});
			
			it('should have an one element simulators Array', function () {
				expect(simulatorQueue.simulators.length).toEqual(1);
				expect(simulatorQueue.simulators).toContain(simulator);
			});
			
			it('should update the Observers after executing Simulators', function () {
				spyOn(simulator, 'execute').andCallThrough();
				spyOn(simulator, 'finish').andCallThrough();
				spyOn(simulatorQueue, 'finish').andCallThrough();
				spyOn(observer, 'updateObservable').andCallThrough();
				simulatorQueue.addObserver(observer);
				expect(simulator.execute).not.toHaveBeenCalled();
				expect(simulator.finish).not.toHaveBeenCalled();
				expect(simulatorQueue.finish).not.toHaveBeenCalled();
				expect(observer.updateObservable).not.toHaveBeenCalled();
				simulatorQueue.execute();
				expect(simulator.execute).toHaveBeenCalled();
				expect(simulator.finish).toHaveBeenCalled();
				expect(simulatorQueue.finish).toHaveBeenCalled();
				expect(observer.updateObservable).toHaveBeenCalledWith(simulatorQueue, 'finish');
			});
			
		});
		
		describe('multiple elements in SimulatorQueue', function () {
			
			var simulator1;
			var simulator2;
			var simulator3;
			
			beforeEach(function () {
				simulator1 = new TestSimulator();
				simulator2 = new TestSimulator();
				simulator3 = new TestSimulator();
				simulatorQueue = new $.simula.SimulatorQueue([simulator1, simulator2, simulator3]);
			});
			
			it('should have an one element simulators Array', function () {
				expect(simulatorQueue.simulators.length).toEqual(3);
				expect(simulatorQueue.simulators[0]).toBe(simulator1);
				expect(simulatorQueue.simulators[1]).toBe(simulator2);
				expect(simulatorQueue.simulators[2]).toBe(simulator3);
			});
			
			it('should update the Observers after executing the Simulators', function () {
				spyOn(simulator1, 'execute').andCallThrough();
				spyOn(simulator1, 'finish').andCallThrough();
				spyOn(simulator2, 'execute').andCallThrough();
				spyOn(simulator2, 'finish').andCallThrough();
				spyOn(simulator3, 'execute').andCallThrough();
				spyOn(simulator3, 'finish').andCallThrough();
				spyOn(simulatorQueue, 'finish').andCallThrough();
				spyOn(observer, 'updateObservable').andCallThrough();
				simulatorQueue.addObserver(observer);
				expect(simulatorQueue.observers).toContain(observer);
				expect(simulator1.execute).not.toHaveBeenCalled();
				expect(simulator1.finish).not.toHaveBeenCalled();
				expect(simulator2.execute).not.toHaveBeenCalled();
				expect(simulator2.finish).not.toHaveBeenCalled();
				expect(simulator3.execute).not.toHaveBeenCalled();
				expect(simulator3.finish).not.toHaveBeenCalled();
				expect(simulatorQueue.finish).not.toHaveBeenCalled();
				expect(observer.updateObservable).not.toHaveBeenCalled();
				simulatorQueue.execute();
				expect(simulator1.execute).toHaveBeenCalled();
				expect(simulator1.finish).toHaveBeenCalled();
				expect(simulator2.execute).toHaveBeenCalled();
				expect(simulator2.finish).toHaveBeenCalled();
				expect(simulator3.execute).toHaveBeenCalled();
				expect(simulator3.finish).toHaveBeenCalled();
				expect(simulatorQueue.finish).toHaveBeenCalled();
				expect(observer.updateObservable).toHaveBeenCalledWith(simulatorQueue, 'finish');
			});
			
		});
		
		describe('asynchronous execution', function () {
			
			var simulator1;
			var simulator2;
			var simulator3;
			
			beforeEach(function () {
				simulator1 = new TestTimeSimulator('simulator1', 50);
				simulator2 = new TestTimeSimulator('simulator2', 50);
				simulator3 = new TestTimeSimulator('simulator3', 50);
				simulatorQueue = new $.simula.SimulatorQueue([simulator1, simulator2, simulator3]);
			});
			
			it('should clear the interval on stop', function () {
				runs(function () {
					this.observer = new $.simula.Observer();
					spyOn(this.observer, 'updateObservable').andCallThrough();
					simulatorQueue.addObserver(this.observer);
					spyOn(simulator1, 'execute').andCallThrough();
					spyOn(simulator1, 'finish').andCallThrough();
					spyOn(simulator2, 'execute').andCallThrough();
					spyOn(simulator3, 'execute').andCallThrough();
					simulatorQueue.execute();
					expect(simulatorQueue.isRunning()).toBeTruthy();
					expect(simulator1.execute).toHaveBeenCalled();
					expect(simulator1.finish).not.toHaveBeenCalled();
					expect(this.observer.updateObservable).not.toHaveBeenCalled();
					simulatorQueue.stop();
					expect(simulatorQueue.isRunning()).toBeFalsy();
					expect(this.observer.updateObservable).toHaveBeenCalledWith(simulatorQueue, 'stop');
					this.observer.updateObservable.reset();
				});
				waits(500);
				runs(function () {
					expect(simulator1.finish).not.toHaveBeenCalled();
					expect(simulator2.execute).not.toHaveBeenCalled();
					expect(simulator3.execute).not.toHaveBeenCalled();
					expect(this.observer.updateObservable).not.toHaveBeenCalled();
				});
			});
			
			it('should execute one after another', function () {
				runs(function () {
					spyOn(simulator1, 'execute').andCallThrough();
					spyOn(simulator1, 'finish').andCallThrough();
					spyOn(simulator2, 'execute').andCallThrough();
					spyOn(simulator2, 'finish').andCallThrough();
					spyOn(simulator3, 'execute').andCallThrough();
					spyOn(simulator3, 'finish').andCallThrough();
					spyOn(simulatorQueue, 'finish').andCallThrough();
					spyOn(observer, 'updateObservable').andCallThrough();
					simulatorQueue.addObserver(observer);
					expect(simulatorQueue.observers).toContain(observer);
					expect(simulatorQueue.isRunning()).toBeFalsy();
					simulatorQueue.execute();
					expect(simulatorQueue.isRunning()).toBeTruthy();
					expect(simulator1.execute).toHaveBeenCalled();
					expect(simulator1.finish).not.toHaveBeenCalled();
					expect(simulator2.execute).not.toHaveBeenCalled();
					expect(simulator2.finish).not.toHaveBeenCalled();
					expect(simulator3.execute).not.toHaveBeenCalled();
					expect(simulator3.finish).not.toHaveBeenCalled();
					expect(simulatorQueue.finish).not.toHaveBeenCalled();
					expect(observer.updateObservable).not.toHaveBeenCalled();
				});
				waitsFor(function () {
					return simulator1.finish.callCount == 1;
				}, 'step 1 to finish', 100);
				runs(function () {
					expect((new Date()).getTime() - beforeExecution[simulator1.id].getTime()).toBeGreaterThan(40);
					expect(simulatorQueue.isRunning()).toBeTruthy();
					expect(simulator1.execute).toHaveBeenCalled();
					expect(simulator1.finish).toHaveBeenCalled();
					expect(simulator2.execute).toHaveBeenCalled();
					expect(simulator2.finish).not.toHaveBeenCalled();
					expect(simulator3.execute).not.toHaveBeenCalled();
					expect(simulator3.finish).not.toHaveBeenCalled();
					expect(simulatorQueue.finish).not.toHaveBeenCalled();
					expect(observer.updateObservable).not.toHaveBeenCalled();
				});
				waitsFor(function () {
					return simulator2.finish.callCount == 1;
				}, 'step 2 to finish', 100);
				runs(function () {
					expect((new Date()).getTime() - beforeExecution[simulator2.id].getTime()).toBeGreaterThan(40);
					expect(simulatorQueue.isRunning()).toBeTruthy();
					expect(simulator1.execute).toHaveBeenCalled();
					expect(simulator1.finish).toHaveBeenCalled();
					expect(simulator2.execute).toHaveBeenCalled();
					expect(simulator2.finish).toHaveBeenCalled();
					expect(simulator3.execute).toHaveBeenCalled();
					expect(simulator3.finish).not.toHaveBeenCalled();
					expect(simulatorQueue.finish).not.toHaveBeenCalled();
					expect(observer.updateObservable).not.toHaveBeenCalled();
				});
				waitsFor(function () {
					return simulator3.finish.callCount == 1;
				}, 'step 3 to finish', 100);
				runs(function () {
					expect((new Date()).getTime() - beforeExecution[simulator3.id].getTime()).toBeGreaterThan(40);
					expect(simulatorQueue.isRunning()).toBeFalsy();
					expect(simulator1.execute).toHaveBeenCalled();
					expect(simulator1.finish).toHaveBeenCalled();
					expect(simulator2.execute).toHaveBeenCalled();
					expect(simulator2.finish).toHaveBeenCalled();
					expect(simulator3.execute).toHaveBeenCalled();
					expect(simulator3.finish).toHaveBeenCalled();
					expect(simulatorQueue.finish).toHaveBeenCalled();
					expect(observer.updateObservable).toHaveBeenCalledWith(simulatorQueue, 'finish');
				});
			});
			
			it('should work to rerun the queue', function () {
				runs(function () {
					spyOn(simulatorQueue, 'finish').andCallThrough();
					beforeExecution = new Date();
					simulatorQueue.execute();
				});
				waitsFor(function () {
					return simulatorQueue.finish.callCount == 1;
				}, 'queue to finish', 300);
				runs(function () {
					expect(((new Date()).getTime() - beforeExecution[simulator1.id].getTime())
						+ ((new Date()).getTime() - beforeExecution[simulator2.id].getTime())
						+ ((new Date()).getTime() - beforeExecution[simulator3.id].getTime())).toBeGreaterThan(140);
					expect(simulatorQueue.finish).toHaveBeenCalled();
					simulatorQueue.finish.reset();
					spyOn(simulator1, 'finish').andCallThrough();
					spyOn(simulator2, 'finish').andCallThrough();
					spyOn(simulator3, 'finish').andCallThrough();
					expect(simulatorQueue.isRunning()).toBeFalsy();
					simulatorQueue.execute();
					expect(simulatorQueue.isRunning()).toBeTruthy();
					expect(simulator1.finish).not.toHaveBeenCalled();
					expect(simulator2.finish).not.toHaveBeenCalled();
					expect(simulator3.finish).not.toHaveBeenCalled();
					expect(simulatorQueue.finish).not.toHaveBeenCalled();
				});
				waitsFor(function () {
					return simulator1.finish.callCount == 1;
				}, 'step 1 to finish', 100);
				runs(function () {
					expect((new Date()).getTime() - beforeExecution[simulator1.id].getTime()).toBeGreaterThan(40);
					expect(simulatorQueue.isRunning()).toBeTruthy();
					expect(simulator1.finish).toHaveBeenCalled();
					expect(simulator2.finish).not.toHaveBeenCalled();
					expect(simulator3.finish).not.toHaveBeenCalled();
					expect(simulatorQueue.finish).not.toHaveBeenCalled();
				});
				waitsFor(function () {
					return simulator2.finish.callCount == 1;
				}, 'step 2 to finish', 100);
				runs(function () {
					expect((new Date()).getTime() - beforeExecution[simulator2.id].getTime()).toBeGreaterThan(40);
					expect(simulatorQueue.isRunning()).toBeTruthy();
					expect(simulator1.finish).toHaveBeenCalled();
					expect(simulator2.finish).toHaveBeenCalled();
					expect(simulator3.finish).not.toHaveBeenCalled();
					expect(simulatorQueue.finish).not.toHaveBeenCalled();
				});
				waitsFor(function () {
					return simulator3.finish.callCount == 1;
				}, 'step 3 to finish', 100);
				runs(function () {
					expect((new Date()).getTime() - beforeExecution[simulator3.id].getTime()).toBeGreaterThan(40);
					expect(simulatorQueue.isRunning()).toBeFalsy();
					expect(simulator1.finish).toHaveBeenCalled();
					expect(simulator2.finish).toHaveBeenCalled();
					expect(simulator3.finish).toHaveBeenCalled();
					expect(simulatorQueue.finish).toHaveBeenCalled();
				});
			});
			
			it('should not care about unrelated updates', function () {
				runs(function () {
					spyOn(simulatorQueue, 'finish').andCallThrough();
					spyOn(simulator1, 'finish').andCallThrough();
					spyOn(simulator2, 'finish').andCallThrough();
					spyOn(simulator3, 'finish').andCallThrough();
					beforeExecution = new Date();
					simulatorQueue.execute();
					simulatorQueue.updateObservable(simulator1, 'somthing else');
					expect(simulatorQueue.finish).not.toHaveBeenCalled();
				});
				waitsFor(function () {
					return simulator1.finish.callCount == 1;
				}, 'step 1 to finish', 100);
				runs(function () {
					simulatorQueue.updateObservable(null, 'finish');
				});
				waitsFor(function () {
					return simulator2.finish.callCount == 1;
				}, 'step 2 to finish', 100);
				runs(function () {
					simulatorQueue.updateObservable(simulator1, 'finish');
					expect(simulatorQueue.finish).not.toHaveBeenCalled();
				});
				waitsFor(function () {
					return simulator3.finish.callCount == 1;
				}, 'step 3 to finish', 100);
				runs(function () {
					expect(simulatorQueue.finish).toHaveBeenCalled();
				});
			});
			
			it('should throw an error when trying to execute while running, but not interfere execution', function () {
				runs(function () {
					spyOn(simulatorQueue, 'finish').andCallThrough();
					spyOn(simulator1, 'finish').andCallThrough();
					spyOn(simulator2, 'finish').andCallThrough();
					spyOn(simulator3, 'finish').andCallThrough();
					simulatorQueue.execute();
					expect(function () {
						simulatorQueue.execute();
					}).toThrow(new Error('Simulator is already running'));
					expect(simulatorQueue.finish).not.toHaveBeenCalled();
				});
				waitsFor(function () {
					return simulator1.finish.callCount == 1;
				}, 'step 1 to finish', 100);
				runs(function () {
					expect(function () {
						simulatorQueue.execute();
					}).toThrow(new Error('Simulator is already running'));
					expect(simulatorQueue.finish).not.toHaveBeenCalled();
				});
				waitsFor(function () {
					return simulator2.finish.callCount == 1;
				}, 'step 2 to finish', 100);
				runs(function () {
					expect(function () {
						simulatorQueue.execute();
					}).toThrow(new Error('Simulator is already running'));
					expect(simulatorQueue.finish).not.toHaveBeenCalled();
				});
				waitsFor(function () {
					return simulator3.finish.callCount == 1;
				}, 'step 3 to finish', 100);
				runs(function () {
					expect(simulatorQueue.finish).toHaveBeenCalled();
				});
			});
		
		});
		
	});
	
	describe('simula.SimulaEvent', function () {
		
		var simulaEvent;
		
		beforeEach(function () {
			simulaEvent = new $.simula.SimulaEvent({});
		});
			
		it('should have PHASE set', function () {
			expect($.simula.SimulaEvent.PHASE).toBeDefined();
			expect($.simula.SimulaEvent.PHASE.CAPTURING).toEqual(1);
			expect($.simula.SimulaEvent.PHASE.AT_TARGET).toEqual(2);
			expect($.simula.SimulaEvent.PHASE.BUBBLING).toEqual(3);
		});
		
		describe('default options', function () {
			
			it('should set default options for non-overwritten properties', function () {
				expect(simulaEvent.type).not.toBeDefined();
				expect(simulaEvent.bubbles).toBeTruthy();
				expect(simulaEvent.cancelable).toBeTruthy();
			});
			
		});
		
		describe('partially overriden options', function () {
			
			beforeEach(function () {
				simulaEvent = new $.simula.SimulaEvent({
					cancelable: false
				});
			});
			
			it('should set default options for overwritten properties', function () {
				expect(simulaEvent.type).not.toBeDefined();
				expect(simulaEvent.bubbles).toBeTruthy();
				expect(simulaEvent.cancelable).toBeFalsy();
			});
			
		});
		
		describe('full overriden options', function () {
			
			beforeEach(function () {
				simulaEvent = new $.simula.SimulaEvent({
					type: '',
					bubbles: false,
					cancelable: false
				});
			});
			
			it('should set default options for overwritten properties', function () {
				expect(simulaEvent.type).toEqual('');
				expect(simulaEvent.bubbles).toBeFalsy();
				expect(simulaEvent.cancelable).toBeFalsy();
			});
			
		});
		
	});
	
	describe('simula.SimulaUIEvent', function () {
		
		var uiEvent;
		
		beforeEach(function () {
			uiEvent = new $.simula.SimulaUIEvent({});
		});
		
		describe('default options', function () {
			
			it('should set default options for non-overwritten properties', function () {
				expect(uiEvent.view).toEqual(window);
				expect(uiEvent.detail).toEqual(0);
			});
			
		});
		
		describe('partially overriden options', function () {
			
			beforeEach(function () {
				uiEvent = new $.simula.SimulaUIEvent({
					detail: 1
				});
			});
			
			it('should set default options for overwritten properties', function () {
				expect(uiEvent.view).toEqual(window);
				expect(uiEvent.detail).toEqual(1);
			});
			
		});
		
		describe('full overriden options', function () {
			
			beforeEach(function () {
				uiEvent = new $.simula.SimulaUIEvent({
					view: document,
					detail: 1
				});
			});
			
			it('should set default options for overwritten properties', function () {
				expect(uiEvent.view).toEqual(document);
				expect(uiEvent.detail).toEqual(1);
			});
			
		});
		
	});
	
	describe('simula.SimulaMouseEvent', function () {
		
		var mouseEvent;
		
		beforeEach(function () {
			mouseEvent = new $.simula.SimulaMouseEvent({});
		});
		
		it('should have TYPE set', function () {
			expect($.simula.SimulaMouseEvent.TYPE).toBeDefined();
			expect($.simula.SimulaMouseEvent.TYPE.CLICK).toEqual('click');
			expect($.simula.SimulaMouseEvent.TYPE.DOWN).toEqual('mousedown');
			expect($.simula.SimulaMouseEvent.TYPE.UP).toEqual('mouseup');
			expect($.simula.SimulaMouseEvent.TYPE.OVER).toEqual('mouseover');
			expect($.simula.SimulaMouseEvent.TYPE.OUT).toEqual('mouseout');
			expect($.simula.SimulaMouseEvent.TYPE.MOVE).toEqual('mousemove');
		});
		
		it('should have BUTTON set', function () {
			expect($.simula.SimulaMouseEvent.BUTTON).toBeDefined();
			expect($.simula.SimulaMouseEvent.BUTTON.LEFT).toEqual(0);
			expect($.simula.SimulaMouseEvent.BUTTON.MIDDLE).toEqual(1);
			expect($.simula.SimulaMouseEvent.BUTTON.RIGHT).toEqual(2);
		});
		
		describe('default options', function () {
			
			it('should set default options for non-overwritten properties', function () {
				expect(mouseEvent.screenX).toEqual(0);
				expect(mouseEvent.screenY).toEqual(0);
				expect(mouseEvent.clientX).toEqual(0);
				expect(mouseEvent.clientY).toEqual(0);
				expect(mouseEvent.ctrlKey).toBeFalsy();
				expect(mouseEvent.shiftKey).toBeFalsy();
				expect(mouseEvent.altKey).toBeFalsy();
				expect(mouseEvent.metaKey).toBeFalsy();
				expect(mouseEvent.button).toEqual($.simula.SimulaMouseEvent.BUTTON.LEFT);
				expect(mouseEvent.relatedTarget).toEqual(document);
			});
			
		});
		
		describe('partially overriden options', function () {
			
			beforeEach(function () {
				mouseEvent = new $.simula.SimulaMouseEvent({
					screenX: 1,
					altKey: true,
					relatedTarget: $('body').get(0)
				});
			});
			
			it('should set default options for overwritten properties', function () {
				expect(mouseEvent.screenX).toEqual(1);
				expect(mouseEvent.screenY).toEqual(0);
				expect(mouseEvent.clientX).toEqual(0);
				expect(mouseEvent.clientY).toEqual(0);
				expect(mouseEvent.ctrlKey).toBeFalsy();
				expect(mouseEvent.shiftKey).toBeFalsy();
				expect(mouseEvent.altKey).toBeTruthy();
				expect(mouseEvent.metaKey).toBeFalsy();
				expect(mouseEvent.button).toEqual($.simula.SimulaMouseEvent.BUTTON.LEFT);
				expect(mouseEvent.relatedTarget).toEqual($('body').get(0));
			});
			
		});
		
		describe('full overriden options', function () {
			
			beforeEach(function () {
				mouseEvent = new $.simula.SimulaMouseEvent({
					screenX: 1,
					screenY: 2,
					clientX: 3,
					clientY: 4,
					ctrlKey: true,
					shiftKey: true,
					altKey: true,
					metaKey: true,
					button: $.simula.SimulaMouseEvent.BUTTON.MIDDLE,
					relatedTarget: $('body').get(0)
				});
			});
			
			it('should set default options for overwritten properties', function () {
				expect(mouseEvent.screenX).toEqual(1);
				expect(mouseEvent.screenY).toEqual(2);
				expect(mouseEvent.clientX).toEqual(3);
				expect(mouseEvent.clientY).toEqual(4);
				expect(mouseEvent.ctrlKey).toBeTruthy();
				expect(mouseEvent.shiftKey).toBeTruthy();
				expect(mouseEvent.altKey).toBeTruthy();
				expect(mouseEvent.metaKey).toBeTruthy();
				expect(mouseEvent.button).toEqual($.simula.SimulaMouseEvent.BUTTON.MIDDLE);
				expect(mouseEvent.relatedTarget).toEqual($('body').get(0));
			});
			
		});
		
	});
	
	describe('simula.MouseEventSimulator', function () {
		
		var mouseSpy;
		var mouseEvent;
		var mouseEventSimulator;
		var markup = '<div id="one"></div>';
		var $markup;
		
		beforeEach(function () {
			$markup = $(markup);
			$('body').prepend($markup);
			mouseEvent = new $.simula.SimulaMouseEvent({
				type: $.simula.SimulaMouseEvent.TYPE.CLICK
			});
			mouseEventSimulator = new $.simula.MouseEventSimulator($('#one'), mouseEvent);
		});
		
		afterEach(function () {
			$markup.remove();
			mouseEventSimulator.stop();
		});
		
		it('should update observers when finished', function () {
			runs(function () {
				mouseEventSimulator = new $.simula.MouseEventSimulator($('#one'), mouseEvent);
				mouseSpy = jasmine.createSpy();
				$('#one').click(mouseSpy);
				spyOn(mouseEventSimulator, 'updateObservers').andCallThrough();
				mouseEventSimulator.execute();
			});
			waitsFor(function () {
				return mouseSpy.callCount == 1;
			}, 'mouse spy to be called', 50);
			runs(function () {
				expect(mouseEventSimulator.updateObservers).toHaveBeenCalled();
			});
		});
		
		it('should dispatch "click"', function () {
			runs(function () {
				mouseEvent = new $.simula.SimulaMouseEvent({
					type: $.simula.SimulaMouseEvent.TYPE.CLICK
				});
				mouseEventSimulator = new $.simula.MouseEventSimulator($('#one'), mouseEvent);
				mouseSpy = jasmine.createSpy();
				$('#one').click(mouseSpy);
				mouseEventSimulator.execute();
			});
			waitsFor(function () {
				return mouseSpy.callCount == 1;
			}, 'mouse spy to be called', 50);
			runs(function () {
				var event = mouseSpy.mostRecentCall.args[0].originalEvent;
				expect(mouseEvent.type).toEqual(event.type);
				expect(mouseEvent.bubbles).toEqual(event.bubbles);
				expect(mouseEvent.cancelable).toEqual(event.cancelable);
				expect(mouseEvent.view).toEqual(event.view);
				expect(mouseEvent.detail).toEqual(event.detail);
				expect(mouseEvent.screenX).toEqual(event.screenX);
				expect(mouseEvent.screenY).toEqual(event.screenY);
				expect(mouseEvent.clientX).toEqual(event.clientX);
				expect(mouseEvent.clientY).toEqual(event.clientY);
				expect(mouseEvent.ctrlKey).toEqual(event.ctrlKey);
				expect(mouseEvent.shiftKey).toEqual(event.shiftKey);
				expect(mouseEvent.altKey).toEqual(event.altKey);
				expect(mouseEvent.metaKey).toEqual(event.metaKey);
				expect(mouseEvent.button).toEqual(event.button);
				expect(mouseEvent.relatedTarget).toEqual(event.relatedTarget);
			});
		});
		
		it('should dispatch "mousedown"', function () {
			runs(function () {
				mouseEvent = new $.simula.SimulaMouseEvent({
					type: $.simula.SimulaMouseEvent.TYPE.DOWN
				});
				mouseEventSimulator = new $.simula.MouseEventSimulator($('#one'), mouseEvent);
				mouseSpy = jasmine.createSpy();
				$('#one').mousedown(mouseSpy);
				mouseEventSimulator.execute();
			});
			waitsFor(function () {
				return mouseSpy.callCount == 1;
			}, 'mouse spy to be called', 50);
			runs(function () {
				var event = mouseSpy.mostRecentCall.args[0].originalEvent;
				expect(mouseEvent.type).toEqual(event.type);
				expect(mouseEvent.bubbles).toEqual(event.bubbles);
				expect(mouseEvent.cancelable).toEqual(event.cancelable);
				expect(mouseEvent.view).toEqual(event.view);
				expect(mouseEvent.detail).toEqual(event.detail);
				expect(mouseEvent.screenX).toEqual(event.screenX);
				expect(mouseEvent.screenY).toEqual(event.screenY);
				expect(mouseEvent.clientX).toEqual(event.clientX);
				expect(mouseEvent.clientY).toEqual(event.clientY);
				expect(mouseEvent.ctrlKey).toEqual(event.ctrlKey);
				expect(mouseEvent.shiftKey).toEqual(event.shiftKey);
				expect(mouseEvent.altKey).toEqual(event.altKey);
				expect(mouseEvent.metaKey).toEqual(event.metaKey);
				expect(mouseEvent.button).toEqual(event.button);
				expect(mouseEvent.relatedTarget).toEqual(event.relatedTarget);
			});
		});
		
		it('should dispatch "mouseup"', function () {
			runs(function () {
				mouseEvent = new $.simula.SimulaMouseEvent({
					type: $.simula.SimulaMouseEvent.TYPE.UP
				});
				mouseEventSimulator = new $.simula.MouseEventSimulator($('#one'), mouseEvent);
				mouseSpy = jasmine.createSpy();
				$('#one').mouseup(mouseSpy);
				mouseEventSimulator.execute();
			});
			waitsFor(function () {
				return mouseSpy.callCount == 1;
			}, 'mouse spy to be called', 50);
			runs(function () {
				var event = mouseSpy.mostRecentCall.args[0].originalEvent;
				expect(mouseEvent.type).toEqual(event.type);
				expect(mouseEvent.bubbles).toEqual(event.bubbles);
				expect(mouseEvent.cancelable).toEqual(event.cancelable);
				expect(mouseEvent.view).toEqual(event.view);
				expect(mouseEvent.detail).toEqual(event.detail);
				expect(mouseEvent.screenX).toEqual(event.screenX);
				expect(mouseEvent.screenY).toEqual(event.screenY);
				expect(mouseEvent.clientX).toEqual(event.clientX);
				expect(mouseEvent.clientY).toEqual(event.clientY);
				expect(mouseEvent.ctrlKey).toEqual(event.ctrlKey);
				expect(mouseEvent.shiftKey).toEqual(event.shiftKey);
				expect(mouseEvent.altKey).toEqual(event.altKey);
				expect(mouseEvent.metaKey).toEqual(event.metaKey);
				expect(mouseEvent.button).toEqual(event.button);
				expect(mouseEvent.relatedTarget).toEqual(event.relatedTarget);
			});
		});
		
		it('should dispatch "mouseover"', function () {
			runs(function () {
				mouseEvent = new $.simula.SimulaMouseEvent({
					type: $.simula.SimulaMouseEvent.TYPE.OVER
				});
				mouseEventSimulator = new $.simula.MouseEventSimulator($('#one'), mouseEvent);
				mouseSpy = jasmine.createSpy();
				$('#one').mouseover(mouseSpy);
				mouseEventSimulator.execute();
			});
			waitsFor(function () {
				return mouseSpy.callCount == 1;
			}, 'mouse spy to be called', 50);
			runs(function () {
				var event = mouseSpy.mostRecentCall.args[0].originalEvent;
				expect(mouseEvent.type).toEqual(event.type);
				expect(mouseEvent.bubbles).toEqual(event.bubbles);
				expect(mouseEvent.cancelable).toEqual(event.cancelable);
				expect(mouseEvent.view).toEqual(event.view);
				expect(mouseEvent.detail).toEqual(event.detail);
				expect(mouseEvent.screenX).toEqual(event.screenX);
				expect(mouseEvent.screenY).toEqual(event.screenY);
				expect(mouseEvent.clientX).toEqual(event.clientX);
				expect(mouseEvent.clientY).toEqual(event.clientY);
				expect(mouseEvent.ctrlKey).toEqual(event.ctrlKey);
				expect(mouseEvent.shiftKey).toEqual(event.shiftKey);
				expect(mouseEvent.altKey).toEqual(event.altKey);
				expect(mouseEvent.metaKey).toEqual(event.metaKey);
				expect(mouseEvent.button).toEqual(event.button);
				expect(mouseEvent.relatedTarget).toEqual(event.relatedTarget);
			});
		});
		
		it('should dispatch "mouseout"', function () {
			runs(function () {
				mouseEvent = new $.simula.SimulaMouseEvent({
					type: $.simula.SimulaMouseEvent.TYPE.OUT
				});
				mouseEventSimulator = new $.simula.MouseEventSimulator($('#one'), mouseEvent);
				mouseSpy = jasmine.createSpy();
				$('#one').mouseout(mouseSpy);
				mouseEventSimulator.execute();
			});
			waitsFor(function () {
				return mouseSpy.callCount == 1;
			}, 'mouse spy to be called', 50);
			runs(function () {
				var event = mouseSpy.mostRecentCall.args[0].originalEvent;
				expect(mouseEvent.type).toEqual(event.type);
				expect(mouseEvent.bubbles).toEqual(event.bubbles);
				expect(mouseEvent.cancelable).toEqual(event.cancelable);
				expect(mouseEvent.view).toEqual(event.view);
				expect(mouseEvent.detail).toEqual(event.detail);
				expect(mouseEvent.screenX).toEqual(event.screenX);
				expect(mouseEvent.screenY).toEqual(event.screenY);
				expect(mouseEvent.clientX).toEqual(event.clientX);
				expect(mouseEvent.clientY).toEqual(event.clientY);
				expect(mouseEvent.ctrlKey).toEqual(event.ctrlKey);
				expect(mouseEvent.shiftKey).toEqual(event.shiftKey);
				expect(mouseEvent.altKey).toEqual(event.altKey);
				expect(mouseEvent.metaKey).toEqual(event.metaKey);
				expect(mouseEvent.button).toEqual(event.button);
				expect(mouseEvent.relatedTarget).toEqual(event.relatedTarget);
			});
		});
		
		it('should dispatch "mousemove"', function () {
			runs(function () {
				mouseEvent = new $.simula.SimulaMouseEvent({
					type: $.simula.SimulaMouseEvent.TYPE.MOVE
				});
				mouseEventSimulator = new $.simula.MouseEventSimulator($('#one'), mouseEvent);
				mouseSpy = jasmine.createSpy();
				$('#one').mousemove(mouseSpy);
				mouseEventSimulator.execute();
			});
			waitsFor(function () {
				return mouseSpy.callCount == 1;
			}, 'mouse spy to be called', 50);
			runs(function () {
				var event = mouseSpy.mostRecentCall.args[0].originalEvent;
				expect(mouseEvent.type).toEqual(event.type);
				expect(mouseEvent.bubbles).toEqual(event.bubbles);
				expect(mouseEvent.cancelable).toEqual(event.cancelable);
				expect(mouseEvent.view).toEqual(event.view);
				expect(mouseEvent.detail).toEqual(event.detail);
				expect(mouseEvent.screenX).toEqual(event.screenX);
				expect(mouseEvent.screenY).toEqual(event.screenY);
				expect(mouseEvent.clientX).toEqual(event.clientX);
				expect(mouseEvent.clientY).toEqual(event.clientY);
				expect(mouseEvent.ctrlKey).toEqual(event.ctrlKey);
				expect(mouseEvent.shiftKey).toEqual(event.shiftKey);
				expect(mouseEvent.altKey).toEqual(event.altKey);
				expect(mouseEvent.metaKey).toEqual(event.metaKey);
				expect(mouseEvent.button).toEqual(event.button);
				expect(mouseEvent.relatedTarget).toEqual(event.relatedTarget);
			});
		});
		
	});
	
	describe('simula.Simulation', function () {
		
		var simulation;
		var startClientPosition;
		var markup = '<div id="1" style="margin: 5px; padding: 5px; width: 200px; height: 100px; background-color: #EEEEEE">'
				+ '<div id="11" style="float:left; margin: 5px; padding: 5px; width: 80px; height: 80px; background-color: #DDDDDD">'
				+ '<div id="111" style="margin: 5px; padding: 5px; width: 50px; height: 50px; background-color: #CCCCCC">'
				+ '<div id="1111" style="margin: 5px; padding: 5px; width: 5px; height: 5px; background-color: #BBBBBB"></div>'
				+ '<div id="1112" style="margin: 5px; padding: 5px; width: 10px; height: 10px; background-color: #BBBBBB"></div>'
				+ '</div>'
				+ '</div>'
				+ '<div id="12" style="float: right; margin: 5px; padding: 5px; width: 50px; height: 30px; background-color: #DDDDDD">'
				+ '<div id="121" style="margin: 5px; padding: 5px; width: 20px; height: 5px; background-color: #CCCCCC"></div>'
				+ '</div>'
				+ '</div>';
		var $markup;
		
		beforeEach(function () {
			$markup = $(markup);
			$('body').prepend($markup);
			startClientPosition = [$('#11').offset().left, $('#11').offset().top];
			simulation = new $.simula.Simulation($('#11'), [0, 0]);
		});
		
		afterEach(function () {
			$markup.remove();
			simulation.stop();
		});
		
		it('should not be intercepted by other Observables', function () {
			runs(function () {
				spyOn(simulation, 'finish').andCallThrough();
				simulation.wait(50).wait(50).wait(50).execute();
				expect(simulation.finish).not.toHaveBeenCalled();
			});
			waits(55);
			runs(function () {
				simulation.updateObservable(simulation.simulatorQueue.simulators[0], 'somthing else');
				expect(simulation.finish).not.toHaveBeenCalled();
			});
			waits(10);
			runs(function () {
				simulation.updateObservable(null, 'finish');
				expect(simulation.finish).not.toHaveBeenCalled();
			});
			waits(45);
			runs(function () {
				simulation.updateObservable(simulation.simulatorQueue.simulators[0], 'finish');
				expect(simulation.finish).not.toHaveBeenCalled();
			});
			waits(55);
			runs(function () {
				expect(simulation.finish).toHaveBeenCalled();
			});
		});
		
		describe('wait', function () {
			
			it('should return itself', function () {
				var result = simulation.wait(100);
				expect(result).toBe(simulation);
			});
			
			it('should wait for the specified duration', function () {
				runs(function () {
					spyOn(simulation, 'finish').andCallThrough();
					simulation.wait(100).execute();
				});
				waits(80);
				runs(function () {
					expect(simulation.finish).not.toHaveBeenCalled();
				});
				waits(30);
				runs(function () {
					expect(simulation.finish).toHaveBeenCalled();
				});
			});
			
			it('should wait for the default duration (50 ms)', function () {
				runs(function () {
					spyOn(simulation, 'finish').andCallThrough();
					simulation.wait().execute();
				});
				waits(20);
				runs(function () {
					expect(simulation.finish).not.toHaveBeenCalled();
				});
				waits(40);
				runs(function () {
					expect(simulation.finish).toHaveBeenCalled();
				});
			});
			
		});
		
		describe('move, enter, leave, press, release, click', function () {
			
			var getDifference = function (start, target) {
				var x = target[0] - start[0];
				var y = target[1] - start[1];
				return [x, y];
			};
			var getLength = function (vector) {
				return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
			};
			
			var beforeExecution;
			var moveSpy1;
			var moveSpy11;
			var moveSpy12;
			var moveSpy111;
			var moveSpy121;
			var moveSpy1111;
			var moveSpy1112;
			var enterSpy1;
			var enterSpy11;
			var enterSpy12;
			var enterSpy111;
			var enterSpy121;
			var enterSpy1111;
			var enterSpy1112;
			var leaveSpy1;
			var leaveSpy11;
			var leaveSpy12;
			var leaveSpy111;
			var leaveSpy121;
			var leaveSpy1111;
			var leaveSpy1112;
			var pressSpy1;
			var pressSpy11;
			var pressSpy12;
			var pressSpy111;
			var pressSpy121;
			var pressSpy1111;
			var pressSpy1112;
			var releaseSpy1;
			var releaseSpy11;
			var releaseSpy12;
			var releaseSpy111;
			var releaseSpy121;
			var releaseSpy1111;
			var releaseSpy1112;
			var clickSpy1;
			var clickSpy11;
			var clickSpy12;
			var clickSpy111;
			var clickSpy121;
			var clickSpy1111;
			var clickSpy1112;
			
			beforeEach(function () {
				moveSpy1 = jasmine.createSpy();
				moveSpy11 = jasmine.createSpy();
				moveSpy12 = jasmine.createSpy();
				moveSpy111 = jasmine.createSpy();
				moveSpy121 = jasmine.createSpy();
				moveSpy1111 = jasmine.createSpy();
				moveSpy1112 = jasmine.createSpy();
				$('#1').mousemove(moveSpy1);
				$('#11').mousemove(moveSpy11);
				$('#12').mousemove(moveSpy12);
				$('#111').mousemove(moveSpy111);
				$('#121').mousemove(moveSpy121);
				$('#1111').mousemove(moveSpy1111);
				$('#1112').mousemove(moveSpy1112);
				enterSpy1 = jasmine.createSpy();
				enterSpy11 = jasmine.createSpy();
				enterSpy12 = jasmine.createSpy();
				enterSpy111 = jasmine.createSpy();
				enterSpy121 = jasmine.createSpy();
				enterSpy1111 = jasmine.createSpy();
				enterSpy1112 = jasmine.createSpy();
				$('#1').mouseover(enterSpy1);
				$('#11').mouseover(enterSpy11);
				$('#12').mouseover(enterSpy12);
				$('#111').mouseover(enterSpy111);
				$('#121').mouseover(enterSpy121);
				$('#1111').mouseover(enterSpy1111);
				$('#1112').mouseover(enterSpy1112);
				leaveSpy1 = jasmine.createSpy();
				leaveSpy11 = jasmine.createSpy();
				leaveSpy12 = jasmine.createSpy();
				leaveSpy111 = jasmine.createSpy();
				leaveSpy121 = jasmine.createSpy();
				leaveSpy1111 = jasmine.createSpy();
				leaveSpy1112 = jasmine.createSpy();
				$('#1').mouseout(leaveSpy1);
				$('#11').mouseout(leaveSpy11);
				$('#12').mouseout(leaveSpy12);
				$('#111').mouseout(leaveSpy111);
				$('#121').mouseout(leaveSpy121);
				$('#1111').mouseout(leaveSpy1111);
				$('#1112').mouseout(leaveSpy1112);
				pressSpy1 = jasmine.createSpy();
				pressSpy11 = jasmine.createSpy();
				pressSpy12 = jasmine.createSpy();
				pressSpy111 = jasmine.createSpy();
				pressSpy121 = jasmine.createSpy();
				pressSpy1111 = jasmine.createSpy();
				pressSpy1112 = jasmine.createSpy();
				$('#1').mousedown(pressSpy1);
				$('#11').mousedown(pressSpy11);
				$('#12').mousedown(pressSpy12);
				$('#111').mousedown(pressSpy111);
				$('#121').mousedown(pressSpy121);
				$('#1111').mousedown(pressSpy1111);
				$('#1112').mousedown(pressSpy1112);
				releaseSpy1 = jasmine.createSpy();
				releaseSpy11 = jasmine.createSpy();
				releaseSpy12 = jasmine.createSpy();
				releaseSpy111 = jasmine.createSpy();
				releaseSpy121 = jasmine.createSpy();
				releaseSpy1111 = jasmine.createSpy();
				releaseSpy1112 = jasmine.createSpy();
				$('#1').mouseup(releaseSpy1);
				$('#11').mouseup(releaseSpy11);
				$('#12').mouseup(releaseSpy12);
				$('#111').mouseup(releaseSpy111);
				$('#121').mouseup(releaseSpy121);
				$('#1111').mouseup(releaseSpy1111);
				$('#1112').mouseup(releaseSpy1112);
				clickSpy1 = jasmine.createSpy();
				clickSpy11 = jasmine.createSpy();
				clickSpy12 = jasmine.createSpy();
				clickSpy111 = jasmine.createSpy();
				clickSpy121 = jasmine.createSpy();
				clickSpy1111 = jasmine.createSpy();
				clickSpy1112 = jasmine.createSpy();
				$('#1').click(clickSpy1);
				$('#11').click(clickSpy11);
				$('#12').click(clickSpy12);
				$('#111').click(clickSpy111);
				$('#121').click(clickSpy121);
				$('#1111').click(clickSpy1111);
				$('#1112').click(clickSpy1112);
			});
			
			describe('move', function () {
				
				describe('mousemove', function () {
					
					it('should work with no arguments', function () {
						runs(function () {
							simulation.mousemove().execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).toHaveBeenCalled();
							expect(moveSpy11).toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
						});
					});
					
					it('should work with $element argument', function () {
						runs(function () {
							simulation.mousemove($('#121')).execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
						});
					});
					
					it('should work with full arguments', function () {
						runs(function () {
							simulation.mousemove($('#121'), {
								button: $.simula.SimulaMouseEvent.BUTTON.RIGHT
							}).execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							var event = moveSpy121.mostRecentCall.args[0];
							expect(event.button).toEqual($.simula.SimulaMouseEvent.BUTTON.RIGHT);
						});
					});
					
				});
				
				it('should set the element position after move and return itself', function () {
					var result = simulation.move([1, 1], 20);
					expect(simulation.elementPosition).toEqual([1, 1]);
					expect(result).toBe(simulation);
				});
				
				it('should dispatch move only to the current element and its parents', function () {
					runs(function () {
						simulation.move([1, 1]).execute();
					});
					waitsFor(function () {
						return !simulation.isRunning();
					}, 'Simulation to finish', 1000);
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
					});
				});
				
				it('should dispatch a mousemove every 15 milliseconds and whould move 1 pixel per ms average', function () {
					runs(function () {
						this.currentClientPosition = [startClientPosition[0], startClientPosition[1]];
						this.targetClientPosition = [startClientPosition[0] + 16, startClientPosition[1] + 63];
						// sqrt(16 * 16 + 63 * 63) = 65 pixels ~ 4 + 1 mousemove
						simulation.move([16, 63]).execute();
						expect(moveSpy11).not.toHaveBeenCalled();
					});
					waitsFor(function () {
						return moveSpy11.callCount == 1;
					}, 'another mousemove', 100);
					runs(function () {
						var event = moveSpy11.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(Math.abs(15 - d)).toBeLessThan(1.5);
						this.currentClientPosition = [event.clientX, event.clientY];
						moveSpy11.reset();
					});
					waitsFor(function () {
						return moveSpy11.callCount == 1;
					}, 'another mousemove', 100);
					runs(function () {
						var event = moveSpy11.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(Math.abs(15 - d)).toBeLessThan(1.5);
						this.currentClientPosition = [event.clientX, event.clientY];
						moveSpy11.reset();
					});
					waitsFor(function () {
						return moveSpy11.callCount == 1;
					}, 'another mousemove', 100);
					runs(function () {
						var event = moveSpy11.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(Math.abs(15 - d)).toBeLessThan(1.5);
						this.currentClientPosition = [event.clientX, event.clientY];
						moveSpy11.reset();
					});
					waitsFor(function () {
						return moveSpy11.callCount == 1;
					}, 'another mousemove', 100);
					runs(function () {
						var event = moveSpy11.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(Math.abs(15 - d)).toBeLessThan(1.5);
						this.currentClientPosition = [event.clientX, event.clientY];
						moveSpy11.reset();
					});
					// last one
					waitsFor(function () {
						return moveSpy11.callCount == 1;
					}, 'another mousemove', 100);
					runs(function () {
						var event = moveSpy11.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(d).toBeLessThan(15);
						this.currentClientPosition = [event.clientX, event.clientY];
						expect(getLength(getDifference(this.currentClientPosition, this.targetClientPosition))).toBeLessThan(1.5);
						expect(simulation.isRunning()).toBeFalsy();
					});
				});
				
				it('should work in auto mode', function () {
					runs(function () {
						this.currentClientPosition = [startClientPosition[0], startClientPosition[1]];
						// sqrt((90 * 90) + (90 * 90)) = 127.279221 ~ 8 + 1 moves
						this.targetClientPosition = [startClientPosition[0] + 90, startClientPosition[1] + 90];
						simulation.move([90, 90], undefined, undefined, true).execute();
					});
					waits(1);
					runs(function () {
						expect(moveSpy1).not.toHaveBeenCalled();
					});
					waitsFor(function () {
						return moveSpy1.callCount == 1;
					}, 'another mousemove', 100);
					// step 1: move over 111
					runs(function () {
						var event = moveSpy1.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(Math.abs(15 - d)).toBeLessThan(1.5);
						this.currentClientPosition = [event.clientX, event.clientY];
					});
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).toHaveBeenCalled();
						expect(enterSpy11).toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
					runs(function () {
						moveSpy1.reset();
						moveSpy11.reset();
						moveSpy12.reset();
						moveSpy111.reset();
						moveSpy121.reset();
						moveSpy1111.reset();
						moveSpy1112.reset();
						enterSpy1.reset();
						enterSpy11.reset();
						enterSpy12.reset();
						enterSpy111.reset();
						enterSpy121.reset();
						enterSpy1111.reset();
						enterSpy1112.reset();
						leaveSpy1.reset();
						leaveSpy11.reset();
						leaveSpy12.reset();
						leaveSpy111.reset();
						leaveSpy121.reset();
						leaveSpy1111.reset();
						leaveSpy1112.reset();
					});
					waitsFor(function () {
						return moveSpy1.callCount == 1;
					}, 'another mousemove', 100);
					// step 2: move over 1111
					runs(function () {
						var event = moveSpy1.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(Math.abs(15 - d)).toBeLessThan(1.5);
						this.currentClientPosition = [event.clientX, event.clientY];
					});
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).toHaveBeenCalled();
						expect(enterSpy11).toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
					runs(function () {
						moveSpy1.reset();
						moveSpy11.reset();
						moveSpy12.reset();
						moveSpy111.reset();
						moveSpy121.reset();
						moveSpy1111.reset();
						moveSpy1112.reset();
						enterSpy1.reset();
						enterSpy11.reset();
						enterSpy12.reset();
						enterSpy111.reset();
						enterSpy121.reset();
						enterSpy1111.reset();
						enterSpy1112.reset();
						leaveSpy1.reset();
						leaveSpy11.reset();
						leaveSpy12.reset();
						leaveSpy111.reset();
						leaveSpy121.reset();
						leaveSpy1111.reset();
						leaveSpy1112.reset();
					});
					waitsFor(function () {
						return moveSpy1.callCount == 1;
					}, 'another mousemove', 100);
					// step 3: move on 1111
					runs(function () {
						var event = moveSpy1.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(Math.abs(15 - d)).toBeLessThan(1.5);
						this.currentClientPosition = [event.clientX, event.clientY];
					});
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).not.toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
					runs(function () {
						moveSpy1.reset();
						moveSpy11.reset();
						moveSpy12.reset();
						moveSpy111.reset();
						moveSpy121.reset();
						moveSpy1111.reset();
						moveSpy1112.reset();
						enterSpy1.reset();
						enterSpy11.reset();
						enterSpy12.reset();
						enterSpy111.reset();
						enterSpy121.reset();
						enterSpy1111.reset();
						enterSpy1112.reset();
						leaveSpy1.reset();
						leaveSpy11.reset();
						leaveSpy12.reset();
						leaveSpy111.reset();
						leaveSpy121.reset();
						leaveSpy1111.reset();
						leaveSpy1112.reset();
					});
					waitsFor(function () {
						return moveSpy1.callCount == 1;
					}, 'another mousemove', 100);
					// step 4: leave 1111
					runs(function () {
						var event = moveSpy1.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(Math.abs(15 - d)).toBeLessThan(1.5);
						this.currentClientPosition = [event.clientX, event.clientY];
					});
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).not.toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).toHaveBeenCalled();
						expect(leaveSpy11).toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
					runs(function () {
						moveSpy1.reset();
						moveSpy11.reset();
						moveSpy12.reset();
						moveSpy111.reset();
						moveSpy121.reset();
						moveSpy1111.reset();
						moveSpy1112.reset();
						enterSpy1.reset();
						enterSpy11.reset();
						enterSpy12.reset();
						enterSpy111.reset();
						enterSpy121.reset();
						enterSpy1111.reset();
						enterSpy1112.reset();
						leaveSpy1.reset();
						leaveSpy11.reset();
						leaveSpy12.reset();
						leaveSpy111.reset();
						leaveSpy121.reset();
						leaveSpy1111.reset();
						leaveSpy1112.reset();
					});
					waitsFor(function () {
						return moveSpy1.callCount == 1;
					}, 'another mousemove', 100);
					// step 5: move on 111
					runs(function () {
						var event = moveSpy1.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(Math.abs(15 - d)).toBeLessThan(1.5);
						this.currentClientPosition = [event.clientX, event.clientY];
					});
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).not.toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
					runs(function () {
						moveSpy1.reset();
						moveSpy11.reset();
						moveSpy12.reset();
						moveSpy111.reset();
						moveSpy121.reset();
						moveSpy1111.reset();
						moveSpy1112.reset();
						enterSpy1.reset();
						enterSpy11.reset();
						enterSpy12.reset();
						enterSpy111.reset();
						enterSpy121.reset();
						enterSpy1111.reset();
						enterSpy1112.reset();
						leaveSpy1.reset();
						leaveSpy11.reset();
						leaveSpy12.reset();
						leaveSpy111.reset();
						leaveSpy121.reset();
						leaveSpy1111.reset();
						leaveSpy1112.reset();
					});
					waitsFor(function () {
						return moveSpy1.callCount == 1;
					}, 'another mousemove', 100);
					// step 6: move on 111
					runs(function () {
						var event = moveSpy1.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(Math.abs(15 - d)).toBeLessThan(1.5);
						this.currentClientPosition = [event.clientX, event.clientY];
					});
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).not.toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
					runs(function () {
						moveSpy1.reset();
						moveSpy11.reset();
						moveSpy12.reset();
						moveSpy111.reset();
						moveSpy121.reset();
						moveSpy1111.reset();
						moveSpy1112.reset();
						enterSpy1.reset();
						enterSpy11.reset();
						enterSpy12.reset();
						enterSpy111.reset();
						enterSpy121.reset();
						enterSpy1111.reset();
						enterSpy1112.reset();
						leaveSpy1.reset();
						leaveSpy11.reset();
						leaveSpy12.reset();
						leaveSpy111.reset();
						leaveSpy121.reset();
						leaveSpy1111.reset();
						leaveSpy1112.reset();
					});
					waitsFor(function () {
						return moveSpy1.callCount == 1;
					}, 'another mousemove', 100);
					// step 7: leave 111
					runs(function () {
						var event = moveSpy1.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(Math.abs(15 - d)).toBeLessThan(1.5);
						this.currentClientPosition = [event.clientX, event.clientY];
					});
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).not.toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).toHaveBeenCalled();
						expect(leaveSpy11).toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
					runs(function () {
						moveSpy1.reset();
						moveSpy11.reset();
						moveSpy12.reset();
						moveSpy111.reset();
						moveSpy121.reset();
						moveSpy1111.reset();
						moveSpy1112.reset();
						enterSpy1.reset();
						enterSpy11.reset();
						enterSpy12.reset();
						enterSpy111.reset();
						enterSpy121.reset();
						enterSpy1111.reset();
						enterSpy1112.reset();
						leaveSpy1.reset();
						leaveSpy11.reset();
						leaveSpy12.reset();
						leaveSpy111.reset();
						leaveSpy121.reset();
						leaveSpy1111.reset();
						leaveSpy1112.reset();
					});
					waitsFor(function () {
						return moveSpy1.callCount == 1;
					}, 'another mousemove', 100);
					// step 8: move on 11
					runs(function () {
						var event = moveSpy1.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(Math.abs(15 - d)).toBeLessThan(1.5);
						this.currentClientPosition = [event.clientX, event.clientY];
					});
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).not.toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
					runs(function () {
						moveSpy1.reset();
						moveSpy11.reset();
						moveSpy12.reset();
						moveSpy111.reset();
						moveSpy121.reset();
						moveSpy1111.reset();
						moveSpy1112.reset();
						enterSpy1.reset();
						enterSpy11.reset();
						enterSpy12.reset();
						enterSpy111.reset();
						enterSpy121.reset();
						enterSpy1111.reset();
						enterSpy1112.reset();
						leaveSpy1.reset();
						leaveSpy11.reset();
						leaveSpy12.reset();
						leaveSpy111.reset();
						leaveSpy121.reset();
						leaveSpy1111.reset();
						leaveSpy1112.reset();
					});
					// last one
					waitsFor(function () {
						return moveSpy1.callCount == 1;
					}, 'another mousemove', 100);
					// step 9: leave 11
					runs(function () {
						var event = moveSpy1.mostRecentCall.args[0];
						var d = getLength(getDifference(this.currentClientPosition, [event.clientX, event.clientY]));
						expect(d).toBeLessThan(15);
						this.currentClientPosition = [event.clientX, event.clientY];
						expect(getLength(getDifference(this.currentClientPosition, this.targetClientPosition))).toBeLessThan(1.5);
						expect(simulation.isRunning()).toBeFalsy();
					});
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).not.toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).not.toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).toHaveBeenCalled();
						expect(leaveSpy11).toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
				});
				
				it('should set options', function () {
					runs(function () {
						simulation.move([1, 1], 1, {
							button: $.simula.SimulaMouseEvent.BUTTON.RIGHT
						}).execute();
					});
					waitsFor(function () {
						return !simulation.isRunning();
					}, 'Simulation to finish', 1000);
					runs(function () {
						expect(moveSpy11).toHaveBeenCalled();
						var event = moveSpy11.mostRecentCall.args[0];
						expect(event.button).toEqual($.simula.SimulaMouseEvent.BUTTON.RIGHT);
					});
				});
				
				it('should set duration', function () {
					runs(function () {
						beforeExecution = new Date();
						simulation.move([1, 1], 20).execute();
						expect(moveSpy11).not.toHaveBeenCalled();
					});
					waitsFor(function () {
						return moveSpy11.callCount == 1;
					}, 'mousemove to be called', 100);
					runs(function () {
						expect((new Date()).getTime() - beforeExecution.getTime()).toBeGreaterThan(5);
					});
				});
				
			});
				
			describe('enter', function () {
				
				describe('mouseover', function () {
					
					it('should work with no arguments', function () {
						runs(function () {
							simulation.mouseover().execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).toHaveBeenCalled();
							expect(enterSpy11).toHaveBeenCalled();
							expect(enterSpy12).not.toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).not.toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).not.toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).not.toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).not.toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
						});
					});
					
					it('should work with $element argument', function () {
						runs(function () {
							simulation.mouseover($('#121')).execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).not.toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).not.toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).not.toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
						});
					});
					
					it('should work with full arguments', function () {
						runs(function () {
							simulation.mouseover($('#121'), {
								button: $.simula.SimulaMouseEvent.BUTTON.RIGHT
							}).execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).not.toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).not.toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).not.toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
							var event = enterSpy121.mostRecentCall.args[0];
							expect(event.button).toEqual($.simula.SimulaMouseEvent.BUTTON.RIGHT);
						});
					});
					
				});
				
				it('should set the element position and position after enter and return itself', function () {
					var result = simulation.enter($('#111'));
					expect(simulation.elementPosition).toEqual([$('#111').width() / 2, $('#111').height() / 2]);
					expect($('#111').equals(simulation.$element)).toBeTruthy();
					expect(result).toBe(simulation);
				});
				
				it('should be in the middle of the entered element and have the correct relatedTarget', function () {
					runs(function () {
						simulation.enter($('#111')).execute();
					});
					waitsFor(function () {
						return enterSpy11.callCount == 1;
					}, 'enterSpy11 to be called', 1000);
					runs(function () {
						var event = enterSpy11.mostRecentCall.args[0];
						expect(Math.abs(event.clientX - (simulation.$element.offset().left + simulation.elementPosition[0]))).toBeLessThan(1.5);
						expect(Math.abs(event.clientY - (simulation.$element.offset().top + simulation.elementPosition[1]))).toBeLessThan(1.5);
						expect(event.relatedTarget).toBe($('#11').get(0));
					});
				});
				
				it('should set options', function () {
					runs(function () {
						simulation.enter($('#111'), {
							button: $.simula.SimulaMouseEvent.BUTTON.RIGHT
						}).execute();
					});
					waitsFor(function () {
						return enterSpy11.callCount == 1;
					}, 'enterSpy11 to be called', 1000);
					runs(function () {
						var event = enterSpy11.mostRecentCall.args[0];
						expect(event.button).toEqual($.simula.SimulaMouseEvent.BUTTON.RIGHT);
					});
				});
				
				it('should enter direct child', function () {
					runs(function () {
						simulation.enter($('#111')).execute();
					});
					waitsFor(function () {
						return !simulation.isRunning();
					}, 'Simulation to finish', 1000);
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).toHaveBeenCalled();
						expect(enterSpy11).toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
				});
				
				it('should enter itself', function () {
					runs(function () {
						simulation.enter($('#11')).execute();
					});
					waitsFor(function () {
						return !simulation.isRunning();
					}, 'Simulation to finish', 1000);
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).toHaveBeenCalled();
						expect(enterSpy11).toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).toHaveBeenCalled();
						expect(leaveSpy11).toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
				});
				
				it('should enter distant child', function () {
					runs(function () {
						simulation.enter($('#1112')).execute();
					});
					waitsFor(function () {
						return !simulation.isRunning();
					}, 'Simulation to finish', 1000);
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).toHaveBeenCalled();
						expect(enterSpy11).toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
				});
				
				it('should enter parent', function () {
					runs(function () {
						simulation.enter($('#1')).execute();
					});
					waitsFor(function () {
						return !simulation.isRunning();
					}, 'Simulation to finish', 2000);
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).toHaveBeenCalled();
						expect(leaveSpy11).toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
				});
				
				it('should enter on element on different stack', function () {
					runs(function () {
						simulation.enter($('#121')).execute();
					});
					waitsFor(function () {
						return !simulation.isRunning();
					}, 'Simulation to finish', 1000);
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).toHaveBeenCalled();
						expect(leaveSpy11).toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
				});
				
			});
			
			describe('leave', function () {
				
				describe('mouseout', function () {
					
					it('should work with no arguments', function () {
						runs(function () {
							simulation.mouseout().execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).not.toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).not.toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).not.toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).toHaveBeenCalled();
							expect(leaveSpy11).toHaveBeenCalled();
							expect(leaveSpy12).not.toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).not.toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
						});
					});
					
					it('should work with $element argument', function () {
						runs(function () {
							simulation.mouseout($('#121')).execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).not.toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).not.toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).not.toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
						});
					});
					
					it('should work with full arguments', function () {
						runs(function () {
							simulation.mouseout($('#121'), {
								button: $.simula.SimulaMouseEvent.BUTTON.RIGHT
							}).execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).not.toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).not.toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).not.toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
							var event = leaveSpy121.mostRecentCall.args[0];
							expect(event.button).toEqual($.simula.SimulaMouseEvent.BUTTON.RIGHT);
						});
					});
					
				});
				
				it('should set the element position and position after leave and return itself', function () {
					var result = simulation.leave($('#11'));
					expect(simulation.elementPosition).toEqual([$('#1').width() / 2, $('#1').height() / 2]);
					expect($('#1').equals(simulation.$element)).toBeTruthy();
					expect(result).toBe(simulation);
				});
				
				it('should be in the middle of the left element\'s parent and have the correct relatedTarget', function () {
					runs(function () {
						simulation.leave($('#11')).execute();
					});
					waitsFor(function () {
						return leaveSpy11.callCount == 1;
					}, 'leaveSpy11 to be called', 1000);
					runs(function () {
						var event = leaveSpy11.mostRecentCall.args[0];
						expect(Math.abs(event.clientX - (simulation.$element.offset().left + simulation.elementPosition[0]))).toBeLessThan(1.5);
						expect(Math.abs(event.clientY - (simulation.$element.offset().top + simulation.elementPosition[1]))).toBeLessThan(1.5);
						expect(event.relatedTarget).toBe($('#1').get(0));
					});
				});
				
				it('should leave without argument', function () {
					runs(function () {
						simulation.leave().execute();
					});
					waitsFor(function () {
						return leaveSpy11.callCount == 1;
					}, 'leaveSpy11 to be called', 1000);
				});
				
				it('should set options', function () {
					runs(function () {
						simulation.leave($('#11'), {
							button: $.simula.SimulaMouseEvent.BUTTON.RIGHT
						}).execute();
					});
					waitsFor(function () {
						return leaveSpy11.callCount == 1;
					}, 'leaveSpy11 to be called', 1000);
					runs(function () {
						var event = leaveSpy11.mostRecentCall.args[0];
						expect(event.button).toEqual($.simula.SimulaMouseEvent.BUTTON.RIGHT);
					});
				});
				
				it('should leave distant child', function () {
					runs(function () {
						simulation.leave($('#1112')).execute();
					});
					waitsFor(function () {
						return !simulation.isRunning();
					}, 'Simulation to finish', 1000);
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).toHaveBeenCalled();
						expect(enterSpy1).toHaveBeenCalled();
						expect(enterSpy11).toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).toHaveBeenCalled();
						expect(leaveSpy1).toHaveBeenCalled();
						expect(leaveSpy11).toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).toHaveBeenCalled();
					});
				});
				
				it('should leave parent', function () {
					runs(function () {
						simulation.leave($('#1')).execute();
					});
					waitsFor(function () {
						return !simulation.isRunning();
					}, 'Simulation to finish', 2000);
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).not.toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).toHaveBeenCalled();
						expect(leaveSpy11).toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
				});
				
				it('should leave on element on different stack', function () {
					runs(function () {
						simulation.leave($('#121')).execute();
					});
					waitsFor(function () {
						return !simulation.isRunning();
					}, 'Simulation to finish', 1000);
					runs(function () {
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).toHaveBeenCalled();
						expect(leaveSpy11).toHaveBeenCalled();
						expect(leaveSpy12).toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
					});
				});
				
			});
				
			describe('press', function () {
				
				describe('mousedown', function () {
					
					it('should work with no arguments', function () {
						runs(function () {
							simulation.mousedown().execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).not.toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).not.toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).not.toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).not.toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).not.toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).not.toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
							expect(pressSpy1).toHaveBeenCalled();
							expect(pressSpy11).toHaveBeenCalled();
							expect(pressSpy12).not.toHaveBeenCalled();
							expect(pressSpy111).not.toHaveBeenCalled();
							expect(pressSpy121).not.toHaveBeenCalled();
							expect(pressSpy1111).not.toHaveBeenCalled();
							expect(pressSpy1112).not.toHaveBeenCalled();
							expect(releaseSpy1).not.toHaveBeenCalled();
							expect(releaseSpy11).not.toHaveBeenCalled();
							expect(releaseSpy12).not.toHaveBeenCalled();
							expect(releaseSpy111).not.toHaveBeenCalled();
							expect(releaseSpy121).not.toHaveBeenCalled();
							expect(releaseSpy1111).not.toHaveBeenCalled();
							expect(releaseSpy1112).not.toHaveBeenCalled();
						});
					});
					
					it('should work with $element argument', function () {
						runs(function () {
							simulation.mousedown($('#121')).execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).not.toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).not.toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).not.toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).not.toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).not.toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).not.toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
							expect(pressSpy1).toHaveBeenCalled();
							expect(pressSpy11).not.toHaveBeenCalled();
							expect(pressSpy12).toHaveBeenCalled();
							expect(pressSpy111).not.toHaveBeenCalled();
							expect(pressSpy121).toHaveBeenCalled();
							expect(pressSpy1111).not.toHaveBeenCalled();
							expect(pressSpy1112).not.toHaveBeenCalled();
							expect(releaseSpy1).not.toHaveBeenCalled();
							expect(releaseSpy11).not.toHaveBeenCalled();
							expect(releaseSpy12).not.toHaveBeenCalled();
							expect(releaseSpy111).not.toHaveBeenCalled();
							expect(releaseSpy121).not.toHaveBeenCalled();
							expect(releaseSpy1111).not.toHaveBeenCalled();
							expect(releaseSpy1112).not.toHaveBeenCalled();
						});
					});
					
					it('should work with full arguments', function () {
						runs(function () {
							simulation.mousedown($('#121'), {
								button: $.simula.SimulaMouseEvent.BUTTON.RIGHT
							}).execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).not.toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).not.toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).not.toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).not.toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).not.toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).not.toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
							expect(pressSpy1).toHaveBeenCalled();
							expect(pressSpy11).not.toHaveBeenCalled();
							expect(pressSpy12).toHaveBeenCalled();
							expect(pressSpy111).not.toHaveBeenCalled();
							expect(pressSpy121).toHaveBeenCalled();
							expect(pressSpy1111).not.toHaveBeenCalled();
							expect(pressSpy1112).not.toHaveBeenCalled();
							expect(releaseSpy1).not.toHaveBeenCalled();
							expect(releaseSpy11).not.toHaveBeenCalled();
							expect(releaseSpy12).not.toHaveBeenCalled();
							expect(releaseSpy111).not.toHaveBeenCalled();
							expect(releaseSpy121).not.toHaveBeenCalled();
							expect(releaseSpy1111).not.toHaveBeenCalled();
							expect(releaseSpy1112).not.toHaveBeenCalled();
							var event = pressSpy121.mostRecentCall.args[0];
							expect(event.button).toEqual($.simula.SimulaMouseEvent.BUTTON.RIGHT);
						});
					});
					
				});
				
				it('should set the element position and position after press and return itself', function () {
					var result = simulation.press($('#111'));
					expect(simulation.elementPosition).toEqual([$('#111').width() / 2, $('#111').height() / 2]);
					expect($('#111').equals(simulation.$element)).toBeTruthy();
					expect(result).toBe(simulation);
				});
				
				it('should press without argument', function () {
					runs(function () {
						simulation.press().execute();
					});
					waitsFor(function () {
						return pressSpy11.callCount == 1;
					}, 'pressSpy11 to be called', 1000);
					runs(function () {
						expect(moveSpy1).not.toHaveBeenCalled();
						expect(moveSpy11).not.toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).not.toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
						expect(pressSpy1).toHaveBeenCalled();
						expect(pressSpy11).toHaveBeenCalled();
						expect(pressSpy12).not.toHaveBeenCalled();
						expect(pressSpy111).not.toHaveBeenCalled();
						expect(pressSpy121).not.toHaveBeenCalled();
						expect(pressSpy1111).not.toHaveBeenCalled();
						expect(pressSpy1112).not.toHaveBeenCalled();
						expect(releaseSpy1).not.toHaveBeenCalled();
						expect(releaseSpy11).not.toHaveBeenCalled();
						expect(releaseSpy12).not.toHaveBeenCalled();
						expect(releaseSpy111).not.toHaveBeenCalled();
						expect(releaseSpy121).not.toHaveBeenCalled();
						expect(releaseSpy1111).not.toHaveBeenCalled();
						expect(releaseSpy1112).not.toHaveBeenCalled();
					});
				});
				
				it('should set options', function () {
					runs(function () {
						simulation.press($('#111'), {
							button: $.simula.SimulaMouseEvent.BUTTON.RIGHT
						}).execute();
					});
					waitsFor(function () {
						return pressSpy111.callCount == 1;
					}, 'pressSpy111 to be called', 1000);
					runs(function () {
						var event = pressSpy111.mostRecentCall.args[0];
						expect(event.button).toEqual($.simula.SimulaMouseEvent.BUTTON.RIGHT);
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).toHaveBeenCalled();
						expect(enterSpy11).toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
						expect(pressSpy1).toHaveBeenCalled();
						expect(pressSpy11).toHaveBeenCalled();
						expect(pressSpy12).not.toHaveBeenCalled();
						expect(pressSpy111).toHaveBeenCalled();
						expect(pressSpy121).not.toHaveBeenCalled();
						expect(pressSpy1111).not.toHaveBeenCalled();
						expect(pressSpy1112).not.toHaveBeenCalled();
						expect(releaseSpy1).not.toHaveBeenCalled();
						expect(releaseSpy11).not.toHaveBeenCalled();
						expect(releaseSpy12).not.toHaveBeenCalled();
						expect(releaseSpy111).not.toHaveBeenCalled();
						expect(releaseSpy121).not.toHaveBeenCalled();
						expect(releaseSpy1111).not.toHaveBeenCalled();
						expect(releaseSpy1112).not.toHaveBeenCalled();
					});
				});
				
			});
			
			describe('release', function () {
				
				describe('mouseup', function () {
					
					it('should work with no arguments', function () {
						runs(function () {
							simulation.mouseup().execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).not.toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).not.toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).not.toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).not.toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).not.toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).not.toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
							expect(pressSpy1).not.toHaveBeenCalled();
							expect(pressSpy11).not.toHaveBeenCalled();
							expect(pressSpy12).not.toHaveBeenCalled();
							expect(pressSpy111).not.toHaveBeenCalled();
							expect(pressSpy121).not.toHaveBeenCalled();
							expect(pressSpy1111).not.toHaveBeenCalled();
							expect(pressSpy1112).not.toHaveBeenCalled();
							expect(releaseSpy1).toHaveBeenCalled();
							expect(releaseSpy11).toHaveBeenCalled();
							expect(releaseSpy12).not.toHaveBeenCalled();
							expect(releaseSpy111).not.toHaveBeenCalled();
							expect(releaseSpy121).not.toHaveBeenCalled();
							expect(releaseSpy1111).not.toHaveBeenCalled();
							expect(releaseSpy1112).not.toHaveBeenCalled();
						});
					});
					
					it('should work with $element argument', function () {
						runs(function () {
							simulation.mouseup($('#121')).execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).not.toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).not.toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).not.toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).not.toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).not.toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).not.toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
							expect(pressSpy1).not.toHaveBeenCalled();
							expect(pressSpy11).not.toHaveBeenCalled();
							expect(pressSpy12).not.toHaveBeenCalled();
							expect(pressSpy111).not.toHaveBeenCalled();
							expect(pressSpy121).not.toHaveBeenCalled();
							expect(pressSpy1111).not.toHaveBeenCalled();
							expect(pressSpy1112).not.toHaveBeenCalled();
							expect(releaseSpy1).toHaveBeenCalled();
							expect(releaseSpy11).not.toHaveBeenCalled();
							expect(releaseSpy12).toHaveBeenCalled();
							expect(releaseSpy111).not.toHaveBeenCalled();
							expect(releaseSpy121).toHaveBeenCalled();
							expect(releaseSpy1111).not.toHaveBeenCalled();
							expect(releaseSpy1112).not.toHaveBeenCalled();
						});
					});
					
					it('should work with full arguments', function () {
						runs(function () {
							simulation.mouseup($('#121'), {
								button: $.simula.SimulaMouseEvent.BUTTON.RIGHT
							}).execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).not.toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).not.toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).not.toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).not.toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).not.toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).not.toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
							expect(pressSpy1).not.toHaveBeenCalled();
							expect(pressSpy11).not.toHaveBeenCalled();
							expect(pressSpy12).not.toHaveBeenCalled();
							expect(pressSpy111).not.toHaveBeenCalled();
							expect(pressSpy121).not.toHaveBeenCalled();
							expect(pressSpy1111).not.toHaveBeenCalled();
							expect(pressSpy1112).not.toHaveBeenCalled();
							expect(releaseSpy1).toHaveBeenCalled();
							expect(releaseSpy11).not.toHaveBeenCalled();
							expect(releaseSpy12).toHaveBeenCalled();
							expect(releaseSpy111).not.toHaveBeenCalled();
							expect(releaseSpy121).toHaveBeenCalled();
							expect(releaseSpy1111).not.toHaveBeenCalled();
							expect(releaseSpy1112).not.toHaveBeenCalled();
							var event = releaseSpy121.mostRecentCall.args[0];
							expect(event.button).toEqual($.simula.SimulaMouseEvent.BUTTON.RIGHT);
						});
					});
					
				});
				
				it('should set the element position and position after release and return itself', function () {
					var result = simulation.release($('#111'));
					expect(simulation.elementPosition).toEqual([$('#111').width() / 2, $('#111').height() / 2]);
					expect($('#111').equals(simulation.$element)).toBeTruthy();
					expect(result).toBe(simulation);
				});
				
				it('should press without argument', function () {
					runs(function () {
						simulation.release().execute();
					});
					waitsFor(function () {
						return releaseSpy11.callCount == 1;
					}, 'releaseSpy11 to be called', 1000);
					runs(function () {
						expect(moveSpy1).not.toHaveBeenCalled();
						expect(moveSpy11).not.toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).not.toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
						expect(pressSpy1).not.toHaveBeenCalled();
						expect(pressSpy11).not.toHaveBeenCalled();
						expect(pressSpy12).not.toHaveBeenCalled();
						expect(pressSpy111).not.toHaveBeenCalled();
						expect(pressSpy121).not.toHaveBeenCalled();
						expect(pressSpy1111).not.toHaveBeenCalled();
						expect(pressSpy1112).not.toHaveBeenCalled();
						expect(releaseSpy1).toHaveBeenCalled();
						expect(releaseSpy11).toHaveBeenCalled();
						expect(releaseSpy12).not.toHaveBeenCalled();
						expect(releaseSpy111).not.toHaveBeenCalled();
						expect(releaseSpy121).not.toHaveBeenCalled();
						expect(releaseSpy1111).not.toHaveBeenCalled();
						expect(releaseSpy1112).not.toHaveBeenCalled();
					});
				});
				
				it('should set options', function () {
					runs(function () {
						simulation.release($('#111'), {
							button: $.simula.SimulaMouseEvent.BUTTON.RIGHT
						}).execute();
					});
					waitsFor(function () {
						return releaseSpy111.callCount == 1;
					}, 'releaseSpy111 to be called', 1000);
					runs(function () {
						var event = releaseSpy111.mostRecentCall.args[0];
						expect(event.button).toEqual($.simula.SimulaMouseEvent.BUTTON.RIGHT);
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).toHaveBeenCalled();
						expect(enterSpy11).toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
						expect(pressSpy1).not.toHaveBeenCalled();
						expect(pressSpy11).not.toHaveBeenCalled();
						expect(pressSpy12).not.toHaveBeenCalled();
						expect(pressSpy111).not.toHaveBeenCalled();
						expect(pressSpy121).not.toHaveBeenCalled();
						expect(pressSpy1111).not.toHaveBeenCalled();
						expect(pressSpy1112).not.toHaveBeenCalled();
						expect(releaseSpy1).toHaveBeenCalled();
						expect(releaseSpy11).toHaveBeenCalled();
						expect(releaseSpy12).not.toHaveBeenCalled();
						expect(releaseSpy111).toHaveBeenCalled();
						expect(releaseSpy121).not.toHaveBeenCalled();
						expect(releaseSpy1111).not.toHaveBeenCalled();
						expect(releaseSpy1112).not.toHaveBeenCalled();
					});
				});
				
			});
			
			describe('click', function () {
				
				describe('mouseclick', function () {
					
					it('should work with no arguments', function () {
						runs(function () {
							simulation.mouseclick().execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).not.toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).not.toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).not.toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).not.toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).not.toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).not.toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
							expect(pressSpy1).not.toHaveBeenCalled();
							expect(pressSpy11).not.toHaveBeenCalled();
							expect(pressSpy12).not.toHaveBeenCalled();
							expect(pressSpy111).not.toHaveBeenCalled();
							expect(pressSpy121).not.toHaveBeenCalled();
							expect(pressSpy1111).not.toHaveBeenCalled();
							expect(pressSpy1112).not.toHaveBeenCalled();
							expect(releaseSpy1).not.toHaveBeenCalled();
							expect(releaseSpy11).not.toHaveBeenCalled();
							expect(releaseSpy12).not.toHaveBeenCalled();
							expect(releaseSpy111).not.toHaveBeenCalled();
							expect(releaseSpy121).not.toHaveBeenCalled();
							expect(releaseSpy1111).not.toHaveBeenCalled();
							expect(releaseSpy1112).not.toHaveBeenCalled();
							expect(clickSpy1).toHaveBeenCalled();
							expect(clickSpy11).toHaveBeenCalled();
							expect(clickSpy12).not.toHaveBeenCalled();
							expect(clickSpy111).not.toHaveBeenCalled();
							expect(clickSpy121).not.toHaveBeenCalled();
							expect(clickSpy1111).not.toHaveBeenCalled();
							expect(clickSpy1112).not.toHaveBeenCalled();
						});
					});
					
					it('should work with $element argument', function () {
						runs(function () {
							simulation.mouseclick($('#121')).execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).not.toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).not.toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).not.toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).not.toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).not.toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).not.toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
							expect(pressSpy1).not.toHaveBeenCalled();
							expect(pressSpy11).not.toHaveBeenCalled();
							expect(pressSpy12).not.toHaveBeenCalled();
							expect(pressSpy111).not.toHaveBeenCalled();
							expect(pressSpy121).not.toHaveBeenCalled();
							expect(pressSpy1111).not.toHaveBeenCalled();
							expect(pressSpy1112).not.toHaveBeenCalled();
							expect(releaseSpy1).not.toHaveBeenCalled();
							expect(releaseSpy11).not.toHaveBeenCalled();
							expect(releaseSpy12).not.toHaveBeenCalled();
							expect(releaseSpy111).not.toHaveBeenCalled();
							expect(releaseSpy121).not.toHaveBeenCalled();
							expect(releaseSpy1111).not.toHaveBeenCalled();
							expect(releaseSpy1112).not.toHaveBeenCalled();
							expect(clickSpy1).toHaveBeenCalled();
							expect(clickSpy11).not.toHaveBeenCalled();
							expect(clickSpy12).toHaveBeenCalled();
							expect(clickSpy111).not.toHaveBeenCalled();
							expect(clickSpy121).toHaveBeenCalled();
							expect(clickSpy1111).not.toHaveBeenCalled();
							expect(clickSpy1112).not.toHaveBeenCalled();
						});
					});
					
					it('should work with full arguments', function () {
						runs(function () {
							simulation.mouseclick($('#121'), {
								button: $.simula.SimulaMouseEvent.BUTTON.RIGHT
							}).execute();
						});
						waitsFor(function () {
							return !simulation.isRunning();
						}, 'Simulation to finish', 1000);
						runs(function () {
							expect(moveSpy1).not.toHaveBeenCalled();
							expect(moveSpy11).not.toHaveBeenCalled();
							expect(moveSpy12).not.toHaveBeenCalled();
							expect(moveSpy111).not.toHaveBeenCalled();
							expect(moveSpy121).not.toHaveBeenCalled();
							expect(moveSpy1111).not.toHaveBeenCalled();
							expect(moveSpy1112).not.toHaveBeenCalled();
							expect(enterSpy1).not.toHaveBeenCalled();
							expect(enterSpy11).not.toHaveBeenCalled();
							expect(enterSpy12).not.toHaveBeenCalled();
							expect(enterSpy111).not.toHaveBeenCalled();
							expect(enterSpy121).not.toHaveBeenCalled();
							expect(enterSpy1111).not.toHaveBeenCalled();
							expect(enterSpy1112).not.toHaveBeenCalled();
							expect(leaveSpy1).not.toHaveBeenCalled();
							expect(leaveSpy11).not.toHaveBeenCalled();
							expect(leaveSpy12).not.toHaveBeenCalled();
							expect(leaveSpy111).not.toHaveBeenCalled();
							expect(leaveSpy121).not.toHaveBeenCalled();
							expect(leaveSpy1111).not.toHaveBeenCalled();
							expect(leaveSpy1112).not.toHaveBeenCalled();
							expect(pressSpy1).not.toHaveBeenCalled();
							expect(pressSpy11).not.toHaveBeenCalled();
							expect(pressSpy12).not.toHaveBeenCalled();
							expect(pressSpy111).not.toHaveBeenCalled();
							expect(pressSpy121).not.toHaveBeenCalled();
							expect(pressSpy1111).not.toHaveBeenCalled();
							expect(pressSpy1112).not.toHaveBeenCalled();
							expect(releaseSpy1).not.toHaveBeenCalled();
							expect(releaseSpy11).not.toHaveBeenCalled();
							expect(releaseSpy12).not.toHaveBeenCalled();
							expect(releaseSpy111).not.toHaveBeenCalled();
							expect(releaseSpy121).not.toHaveBeenCalled();
							expect(releaseSpy1111).not.toHaveBeenCalled();
							expect(releaseSpy1112).not.toHaveBeenCalled();
							expect(clickSpy1).toHaveBeenCalled();
							expect(clickSpy11).not.toHaveBeenCalled();
							expect(clickSpy12).toHaveBeenCalled();
							expect(clickSpy111).not.toHaveBeenCalled();
							expect(clickSpy121).toHaveBeenCalled();
							expect(clickSpy1111).not.toHaveBeenCalled();
							expect(clickSpy1112).not.toHaveBeenCalled();
							var event = clickSpy121.mostRecentCall.args[0];
							expect(event.button).toEqual($.simula.SimulaMouseEvent.BUTTON.RIGHT);
						});
					});
					
				});
				
				it('should set the element position and position after click and return itself', function () {
					var result = simulation.click($('#111'));
					expect(simulation.elementPosition).toEqual([$('#111').width() / 2, $('#111').height() / 2]);
					expect($('#111').equals(simulation.$element)).toBeTruthy();
					expect(result).toBe(simulation);
				});
				
				it('should press without argument', function () {
					runs(function () {
						simulation.click().execute();
					});
					waitsFor(function () {
						return clickSpy11.callCount == 1;
					}, 'clickSpy11 to be called', 1000);
					runs(function () {
						expect(moveSpy1).not.toHaveBeenCalled();
						expect(moveSpy11).not.toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).not.toHaveBeenCalled();
						expect(enterSpy11).not.toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).not.toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
						expect(pressSpy1).toHaveBeenCalled();
						expect(pressSpy11).toHaveBeenCalled();
						expect(pressSpy12).not.toHaveBeenCalled();
						expect(pressSpy111).not.toHaveBeenCalled();
						expect(pressSpy121).not.toHaveBeenCalled();
						expect(pressSpy1111).not.toHaveBeenCalled();
						expect(pressSpy1112).not.toHaveBeenCalled();
						expect(releaseSpy1).toHaveBeenCalled();
						expect(releaseSpy11).toHaveBeenCalled();
						expect(releaseSpy12).not.toHaveBeenCalled();
						expect(releaseSpy111).not.toHaveBeenCalled();
						expect(releaseSpy121).not.toHaveBeenCalled();
						expect(releaseSpy1111).not.toHaveBeenCalled();
						expect(releaseSpy1112).not.toHaveBeenCalled();
						expect(clickSpy1).toHaveBeenCalled();
						expect(clickSpy11).toHaveBeenCalled();
						expect(clickSpy12).not.toHaveBeenCalled();
						expect(clickSpy111).not.toHaveBeenCalled();
						expect(clickSpy121).not.toHaveBeenCalled();
						expect(clickSpy1111).not.toHaveBeenCalled();
						expect(clickSpy1112).not.toHaveBeenCalled();
					});
				});
				
				it('should set options', function () {
					runs(function () {
						simulation.click($('#111'), {
							button: $.simula.SimulaMouseEvent.BUTTON.RIGHT
						}).execute();
					});
					waitsFor(function () {
						return clickSpy111.callCount == 1;
					}, 'clickSpy111 to be called', 1000);
					runs(function () {
						var event = clickSpy111.mostRecentCall.args[0];
						expect(event.button).toEqual(
								$.simula.SimulaMouseEvent.BUTTON.RIGHT);
						expect(moveSpy1).toHaveBeenCalled();
						expect(moveSpy11).toHaveBeenCalled();
						expect(moveSpy12).not.toHaveBeenCalled();
						expect(moveSpy111).not.toHaveBeenCalled();
						expect(moveSpy121).not.toHaveBeenCalled();
						expect(moveSpy1111).not.toHaveBeenCalled();
						expect(moveSpy1112).not.toHaveBeenCalled();
						expect(enterSpy1).toHaveBeenCalled();
						expect(enterSpy11).toHaveBeenCalled();
						expect(enterSpy12).not.toHaveBeenCalled();
						expect(enterSpy111).toHaveBeenCalled();
						expect(enterSpy121).not.toHaveBeenCalled();
						expect(enterSpy1111).not.toHaveBeenCalled();
						expect(enterSpy1112).not.toHaveBeenCalled();
						expect(leaveSpy1).not.toHaveBeenCalled();
						expect(leaveSpy11).not.toHaveBeenCalled();
						expect(leaveSpy12).not.toHaveBeenCalled();
						expect(leaveSpy111).not.toHaveBeenCalled();
						expect(leaveSpy121).not.toHaveBeenCalled();
						expect(leaveSpy1111).not.toHaveBeenCalled();
						expect(leaveSpy1112).not.toHaveBeenCalled();
						expect(pressSpy1).toHaveBeenCalled();
						expect(pressSpy11).toHaveBeenCalled();
						expect(pressSpy12).not.toHaveBeenCalled();
						expect(pressSpy111).toHaveBeenCalled();
						expect(pressSpy121).not.toHaveBeenCalled();
						expect(pressSpy1111).not.toHaveBeenCalled();
						expect(pressSpy1112).not.toHaveBeenCalled();
						expect(releaseSpy1).toHaveBeenCalled();
						expect(releaseSpy11).toHaveBeenCalled();
						expect(releaseSpy12).not.toHaveBeenCalled();
						expect(releaseSpy111).toHaveBeenCalled();
						expect(releaseSpy121).not.toHaveBeenCalled();
						expect(releaseSpy1111).not.toHaveBeenCalled();
						expect(releaseSpy1112).not.toHaveBeenCalled();
						expect(clickSpy1).toHaveBeenCalled();
						expect(clickSpy11).toHaveBeenCalled();
						expect(clickSpy12).not.toHaveBeenCalled();
						expect(clickSpy111).toHaveBeenCalled();
						expect(clickSpy121).not.toHaveBeenCalled();
						expect(clickSpy1111).not.toHaveBeenCalled();
						expect(clickSpy1112).not.toHaveBeenCalled();
					});
				});
				
			});
			
		});
		
	});
	
});