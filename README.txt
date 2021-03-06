Simula is a JavaScript library that lets you simulate user interaction for use
in automated tests. It uses jQuery and is tested with jasmine (believe me, the
tests were once all green, damn asynchronous tests). It currently only simulates
mouse events.

What do I need to run it?:
	Simula runs in all W3C-DOM-compliant browsers (FireFox, Safari, Opera,
	Chrome) but NOT IE.
	Just include the jquery.maenulabs.extensions.js and
	jquery.maenulabs.simula.js after jQuery in that order.
	
How do I use it?:
	Most likely, you will only need $.simula.Simulation and its methods:
	
		// create a new Simulation
		var simulation = new $.simula.Simulation($("#someElement"), [0, 0]);
		// build execution chain
		simulation.move([10, 15]).click($("#someButton"));
		// execute
		simulation.execute();
	
	This will then trigger according mousemove events on #someElement and click
	on #someButton. There are more possibilities, as if you set the set the auto
	flag for the move method, it will automatically enter and leave elements by
	dispatching mouseover and mouseout on the affected elements, its magic!
	Note that the Simulation may run asynchronously, so you should not rely on
	synchronous execution, but you can always add an Observer to the Simulation
	that gets notified by the Simulation with a 'finish' argument:
	
		// create an Observer
		var observer = {
			updateObservable: function(observable, args) {
				if (args == "finish") {
					alert("Simulation is finished!");
				}
			}
		};
		simulation.addObserver(observer);
		simulation.execute();
	