
// dépendances
	
	var
		path = require('path'),
		fs = require('fs'),
		q = require('q'),
		
		Container = require(path.join(__dirname, 'Container.js')),
		Logs = require(path.join(__dirname, 'Logs.js')),
		MIAChild = require(path.join(__dirname, 'MIA-Child.js'));
		
// module
	
	module.exports = function () {
		
		"use strict";
		
		// attributes
			
			var
				that = this,
				m_sCommandFile = path.join(__dirname, '../', 'command.tmp'),
				m_clLog = new Logs(path.join(__dirname, '..', 'logs'));
				
		// methodes
			
			// public

				this.start = function () {

					var deferred = q.defer();

						try {

							if (fs.existsSync(m_sCommandFile)) {
								deferred.reject('An another client is already running.');
							}
							else {

								fs.writeFile(m_sCommandFile, process.pid, function (err) {
									
									if (err) {
										deferred.reject((err.message) ? err.message : err);
									}
									else {

										m_clLog.log('[START ' + process.pid + ']');

										new MIAChild().start()
											.then(deferred.resolve)
											.catch(deferred.reject);

									}
									
								});

							}
							
						}
						catch (e) {
							deferred.reject((e.message) ? e.message : e);
						}
						
					return deferred.promise;

				};
				
				this.stop = function () {

					var deferred = q.defer();

						try {

							if (!fs.existsSync(m_sCommandFile)) {
								m_clLog.log('[END]');
								deferred.resolve();
							}
							else {
								
								fs.readFile(m_sCommandFile, function (err, p_sData) {

									if (err) {
										if (err.message) {
											deferred.reject(err.message);
										}
										else {
											deferred.reject(err);
										}
									}
									else {

										fs.unlink(m_sCommandFile, function (err) {

											if (err) {
												if (err.message) {
													deferred.reject(err.message);
												}
												else {
													deferred.reject(err);
												}
											}
											else {

												new MIAChild().stop()
													.then(function () {

														var sPID = p_sData.toString();

														try {
															process.kill(sPID);
														}
														catch (e) {}

														m_clLog.log('[END ' + sPID + ']');

														deferred.resolve();

													})
													.catch(deferred.reject);

											}
											
										});
										
									}

								});

							}
							
						}
						catch (e) {
							deferred.reject((e.message) ? e.message : e);
						}
						
					return deferred.promise;

				};
				
		// construct
			
			var sLaunchType = 'restart';

			for (var i = 2, l = process.argv.length; i < l; ++i) {

				var value = process.argv[i];

				switch (value) {
					
					case '--version' : case '-V' :
						console.log('0.0.2');
					break;
					
					case '--help' : case '-H' :
						
						console.log('--help | -H : get the commands');
						console.log('--debug | -D : initialize the debug mode');
						console.log('--version | -V : get the soft version');
						console.log('--start | -S : start child');
						console.log('--end | -E : stop child');
						console.log('--restart | -R : restart child');
						console.log('--miaip | -MI : configure the MIA IP');
						console.log('--miaport | -MP : configure the MIA port');

					break;
					
					case '--debug' : case '-D' :
						Container.get('conf').set('debug', true);
					break;
					case '--start' : case '-S' :
						sLaunchType = 'start';
					break;
					case '--end' : case '-E' :
						sLaunchType = 'stop';
					break;
					case '--restart' : case '-R' :
						sLaunchType = 'restart';
					break;
					
					case '--miaip' : case '-MI' :

						if (i + 1 < l) {
							Container.get('conf').set('miaip', parseInt(process.argv[i+1]));
						}

					break;
					
					case '--miaport' : case '-MP' :

						if (i + 1 < l) {
							Container.get('conf').set('miaport', parseInt(process.argv[i+1]));
						}

					break;
					
				}

			}
				
			switch (sLaunchType) {

				case 'start' :
					that.start().catch(function (err) { m_clLog.err(err); });
				break;
				
				case 'stop' :
					that.stop().catch(function (err) { m_clLog.err(err); });
				break;
				
				case 'restart' :

					that.stop()
						.then(function () {
							that.start().catch(function (err) { m_clLog.err(err); });
						})
						.catch(function (err) { m_clLog.err(err); });

				break;
					
			}
			
	};
	