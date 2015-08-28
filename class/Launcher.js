
// dépendances
	
	var
		CST_DEP_Path = require('path'),
		CST_DEP_FileSystem = require('fs'),
		CST_DEP_Q = require('q'),
		CST_DEP_Log = require('logs'),
		CST_DEP_MIA_CHILD = require(CST_DEP_Path.join(__dirname, 'MIA-Child.js')),
		CST_DEP_Conf = require(CST_DEP_Path.join(__dirname, 'Conf.js'));
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var
				m_clThis = this,
				m_sCommandFile = CST_DEP_Path.join(__dirname, '../', 'command.tmp'),
				m_tabArgs = process.argv.slice(2),
				m_sLaunchType = m_tabArgs[0],
				m_clLog = new CST_DEP_Log(CST_DEP_Path.join(__dirname, '..', 'logs')),
				m_clMIAChild = new CST_DEP_MIA_CHILD();
				
		// methodes
			
			// public

				this.start = function () {

					var deferred = CST_DEP_Q.defer();

						try {

							if (CST_DEP_FileSystem.existsSync(m_sCommandFile)) {
								deferred.reject('An another client is already running.');
							}
							else {

								CST_DEP_FileSystem.writeFile(m_sCommandFile, process.pid, function (err) {
									
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
							if (e.message) {
								deferred.reject(e.message);
							}
							else {
								deferred.reject(e);
							}
						}
						
					return deferred.promise;

				};
				
				this.stop = function () {

					var deferred = CST_DEP_Q.defer();

						try {

							if (!CST_DEP_FileSystem.existsSync(m_sCommandFile)) {
								m_clLog.log('[END]');
								deferred.resolve();
							}
							else {
								
								CST_DEP_FileSystem.readFile(m_sCommandFile, function (err, p_sData) {

									if (err) {
										if (err.message) {
											deferred.reject(err.message);
										}
										else {
											deferred.reject(err);
										}
									}
									else {

										CST_DEP_FileSystem.unlink(m_sCommandFile, function (err) {

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
							if (e.message) {
								deferred.reject(e.message);
							}
							else {
								deferred.reject(e);
							}
						}
						
					return deferred.promise;

				};
				
				this.help = function () {

					var deferred = CST_DEP_Q.defer();

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
							if (e.message) {
								deferred.reject(e.message);
							}
							else {
								deferred.reject(e);
							}
						}
						
					return deferred.promise;

				};
				
				this.setMIAIP = function () {

					var deferred = CST_DEP_Q.defer();

						try {

							if (m_tabArgs[1]) {

								new CST_DEP_Conf().setConfOption('miaip', m_tabArgs[1]).save()
									.then(deferred.resolve)
									.catch(deferred.reject);

							}
							else {
								deferred.reject('\'IP\' missing');
							}

						}
						catch (e) {
							if (e.message) {
								deferred.reject(e.message);
							}
							else {
								deferred.reject(e);
							}
						}
						
					return deferred.promise;

				};
				
				this.setMIAPort = function () {

					var deferred = CST_DEP_Q.defer();

						try {

							if (m_tabArgs[1]) {

								new CST_DEP_Conf().setConfOption('miaport', parseInt(m_tabArgs[1])).save()
									.then(deferred.resolve)
									.catch(deferred.reject);

							}
							else {
								deferred.reject('\'port\' missing');
							}

						}
						catch (e) {
							if (e.message) {
								deferred.reject(e.message);
							}
							else {
								deferred.reject(e);
							}
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
	