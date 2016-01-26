"use strict";

// dépendances

	const 	path = require('path'),
			simplecontainer = require('simplecontainer'),
			simpleconfig = require('simpleconfig'),
			SimpleLogs = require('simplelogs'),
			
			MIASocket = require(path.join(__dirname, 'class', 'MIASocket.js')),
			Child = require(path.join(__dirname, 'class', 'MIA-Child.js'));

// run

	try {

		var Container = new simplecontainer();

		Container	.set('conf', new simpleconfig(path.join(__dirname, 'conf.json')))
					.set('logs', new SimpleLogs(path.join(__dirname, 'logs')))
					.set('miasocket', new MIASocket(Container));

		if (!Container.get('conf').fileExists()) {

			Container.get('conf')	.set('miaip', 'localhost').set('miaport', 1338)

									.set('debug', false)
									.set('ssl', false)
									.set('pid', -1)
									.set('token', '')
									.save().catch(function(e) {
										Container.get('logs').err('-- [conf] ' + ((e.message) ? e.message : e));
									});

		}

		Container.get('conf').load().then(function() {

			Container.get('logs').showInConsole = Container.get('conf').get('debug');
			Container.get('logs').showInFile = !Container.get('conf').get('debug');

			new Child(Container).start()
					.catch(function (err) { Container.get('logs').err('-- [MIA-Child] ' + ((err.message) ? err.message : err)); });
		
		})
		.catch(function(e) {
			Container.get('logs').err('-- [conf] ' + ((e.message) ? e.message : e));
		});

	}
	catch (e) {
		console.log('Global script failed : ' + ((e.message) ? e.message : e));
	}
	