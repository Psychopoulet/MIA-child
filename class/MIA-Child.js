
// dépendances
	
	var

		path = require('path'),
		q = require('q'),
		exec = require('child_process').exec,

		Container = require(path.join(__dirname, 'Container.js')),
		Logs = require(path.join(__dirname, 'Logs.js'));
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var 
				that = this,
				conf = Container.get('conf'),
				m_clLog = new Logs(path.join(__dirname, '..', 'child'));
				
		// methodes
			
			// public
				
				this.start = function () {

					var deferred = q.defer();

						try {

							if (!conf.initialized()) {

								conf.set('miaip', 'localhost')
									.set('miaport', 1338)
									.set('debug', false)
									.set('ssl', false)
									.set('pid', -1)
									.set('token', '')

									.save();

							}

							conf.load().then(function() {

								var nPreviousPID = conf.get('pid');

								if (-1 < nPreviousPID) {

									try {

										process.kill(nPreviousPID);
										m_clLog.log('[END ' + nPreviousPID + ']');

									}
									catch (e) { }

								}

								conf.set('pid', process.pid).save().then(function() {

									m_clLog.log('[START ' + process.pid + ']');

									// start
										
										Container.get('server.socket.mia').start()
											.then(deferred.resolve)
											.catch(deferred.reject);

									// sockets
										
										Container.get('server.socket.mia')

											.onDisconnect(function (socket) {

												socket.removeAllListeners('child.child.login.error');
												socket.removeAllListeners('child.child.logged');

												socket.removeAllListeners('child.sound.play');
												socket.removeAllListeners('child.video.play');
												
											})

											.onConnection(function (socket) {

												var token = conf.get('token');

												if (token) {
													socket.emit('child.child.login', { token : token });
												}

												socket.on('child.child.login.error', function(err) {
													m_clLog.err('[MIA] : login failed (' + err + ')');
												})

												.on('child.child.logged', function() {

													m_clLog.success('[MIA] : logged');

													socket.on('child.video.play', function(video) {

														try {

															if (!video.url || '' == video.url) {
																socket.emit('child.video.error', 'Url missing');
															}
															else {

																exec('vlc "' + video.url + '" --play-and-exit', function (err, stdout, stderr) {

																	if (err) {
																		socket.emit('child.video.error', (err.message) ? err.message : err);
																	}
																	else {
																		socket.emit('child.video.played', video);
																	}

																});

															}

														}
														catch(e) {
															socket.emit('child.video.error', (e.message) ? e.message : e);
														}
								
													})
													.on('child.sound.play', function(sound) {

														try {

															if (!sound.url || '' == sound.url) {
																socket.emit('child.sound.error', 'Url missing');
															}
															else {

																exec('cvlc "' + sound.url + '" --play-and-exit', function (err, stdout, stderr) {

																	if (!err) {
																		socket.emit('child.sound.played', sound);
																	}
																	else {

																		exec('vlc "' + sound.url + '" --play-and-exit', function (err, stdout, stderr) {

																			if (err) {
																				socket.emit('child.sound.error', (err.message) ? err.message : err);
																			}
																			else {
																				socket.emit('child.sound.played', sound);
																			}

																		});

																	}
											
																});

															}

														}
														catch(e) {
															socket.emit('child.sound.error', (e.message) ? e.message : e);
														}
								
													});

												})

											});
								
								})
								.catch(function(e) {
									deferred.reject('-- [conf] ' + ((e.message) ? e.message : e));
								});
								
							})
							.catch(deferred.reject);

						}
						catch (e) {
							deferred.reject((e.message) ? e.message : e);
						}
						
					return deferred.promise;

				};
				
				this.stop = function () {
					return Container.get('server.socket.mia').stop();
				};
				
	};
	