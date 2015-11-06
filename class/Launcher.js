
// dépendances
	
	var
		path = require('path'),
		fs = require('fs'),
		q = require('q'),
		Logs = require(path.join(__dirname, 'Logs.js')),
		MIAChild = require(path.join(__dirname, 'MIA-Child.js')),
		Conf = require(path.join(__dirname, 'Conf.js'));
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var
				m_clThis = this,
				m_sCommandFile = path.join(__dirname, '../', 'command.tmp'),
				m_tabArgs = process.argv.slice(2),
				m_sLaunchType = (0 < m_tabArgs.length) ? m_tabArgs[0] : '',
				m_clLog = new Logs(path.join(__dirname, '..', 'logs')),
				m_clMIAChild = new MIAChild();
				
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
										if (err.message) {
											deferred.reject(err.message);
										}
										else {
											deferred.reject(err);
										}
									}
									else {

										m_clLog.log('[START ' + process.pid + ']');

										m_clMIAChild.start()
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

												m_clMIAChild.stop()
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
				
				this.help = function () {

					var deferred = q.defer();

						try {

							console.log('--help | -H : get the commands');
							console.log('--version | -V : get the soft version');
							console.log('--start | -S : start MIA');
							console.log('--end | -E : stop MIA');
							console.log('--restart | -R : restart MIA');
							console.log('--miaip | -MI : configure the MIA IP');
							console.log('--miaport | -MP : configure the MIA port');

						}
						catch (e) {
							deferred.reject((e.message) ? e.message : e);
						}
						
					return deferred.promise;

				};
				
				this.setMIAIP = function () {

					var deferred = q.defer();

						try {

							if (m_tabArgs[1]) {

								new Conf().setConfOption('miaip', m_tabArgs[1]).save()
									.then(deferred.resolve)
									.catch(deferred.reject);

							}
							else {
								deferred.reject('\'IP\' missing');
							}

						}
						catch (e) {
							deferred.reject((e.message) ? e.message : e);
						}
						
					return deferred.promise;

				};
				
				this.setMIAPort = function () {

					var deferred = q.defer();

						try {

							if (m_tabArgs[1]) {

								new Conf().setConfOption('miaport', parseInt(m_tabArgs[1])).save()
									.then(deferred.resolve)
									.catch(deferred.reject);

							}
							else {
								deferred.reject('\'port\' missing');
							}

						}
						catch (e) {
							deferred.reject((e.message) ? e.message : e);
						}
						
					return deferred.promise;

				};
				
		// construct
			
			switch (m_sLaunchType) {
				
				case '--version' :
				case '-V' :
					console.log(m_clMIAChild.getVersion());
				break;
				
				case '--help' :
				case '-H' :
					this.help().catch(function (err) { m_clLog.err(err); });
				break;
				
				case '--start' :
				case '-S' :
					this.start().catch(function (err) { m_clLog.err(err); });
				break;
				
				case '--end' :
				case '-E' :
					this.stop().catch(function (err) { m_clLog.err(err); });
				break;
				
				case '--restart' :
				case '-R' :

					this.stop()
						.then(function () {
							m_clThis.start().catch(function (err) { m_clLog.err(err); });
						})
						.catch(function (err) { m_clLog.err(err); });

				break;
				
				case '--miaip' :
				case '-MI' :
					this.setMIAIP().catch(function (err) { m_clLog.err(err); });
				break;
				
				case '--miaport' :
				case '-MP' :
					this.setMIAPort().catch(function (err) { m_clLog.err(err); });
				break;
				
				case '' :
					m_clLog.err('Arg empty');
				break;
				
				default :
					m_clLog.err('Unknown arg \'' + m_sLaunchType + '\'');
				break;
				
			}
			
	};
	