"use strict";

// dépendances

	var 
		path = require('path'),
		simplecontainer = require('simplecontainer'),
		simpleconfig = require('simpleconfig'),
		
		Logs = require(path.join(__dirname, 'class', 'Logs.js')),
		MIASocket = require(path.join(__dirname, 'class', 'MIASocket.js')),
		Child = require(path.join(__dirname, 'class', 'MIA-Child.js'));

// run

	try {

		var Container = new simplecontainer();

		Container	.set('conf', new simpleconfig(path.join(__dirname, 'conf.json')))
					.set('logs', Logs)
					.set('miasocket', new MIASocket(Container));

		new Child(Container).start()
			.catch(function (err) { new Logs(__dirname).err(err); });
		
	}
	catch (e) {
		new Logs(__dirname).err('Global script failed : ' + ((e.message) ? e.message : e));
	}
	