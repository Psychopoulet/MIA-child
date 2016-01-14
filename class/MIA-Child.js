
// d�pendances
	
	var

		path = require('path'),
		q = require('q'),
		exec = require('child_process').exec;
		
// module
	
	module.exports = function (Container) {

		// attributes
			
			var 
				that = this,
				conf = Container.get('conf'),
				logs = Container.get('logs'),
				m_clLog = new logs(path.join(__dirname, '..', 'child'));
				
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
										
										Container.get('miasocket').start()
											.then(deferred.resolve)
											.catch(deferred.reject);

									// sockets
										
										Container.get('miasocket').onDisconnect(function (socket) {

											socket.removeAllListeners('login.error');
											socket.removeAllListeners('logged');

											socket.removeAllListeners('media.sound.play');
											socket.removeAllListeners('media.video.play');
											
										})

										.onConnection(function (socket) {

											var token = conf.get('token');

											if (token) {
												socket.emit('login', { token : token });
											}

											socket.on('login.error', function(err) {
												deferred.reject('[MIA] : login failed (' + ((err.message) ? err.message : err) + ')');
											})

											.on('logged', function(child) {

												conf.set('token', child.token).save().then(function() {

													m_clLog.success('[MIA] : logged');

													socket.on('media.sound.play', function(sound) {

														try {

															if (!sound.url || '' == sound.url) {
																socket.emit('media.sound.error', 'Url missing');
															}
															else {

																exec('cvlc "' + sound.url + '" --play-and-exit', function (err, stdout, stderr) {

																	if (!err) {
																		socket.emit('media.sound.played', sound);
																	}
																	else {

																		exec('vlc "' + sound.url + '" --play-and-exit', function (err, stdout, stderr) {

																			if (err) {
																				socket.emit('media.sound.error', (err.message) ? err.message : err);
																			}
																			else {
																				socket.emit('media.sound.played', sound);
																			}

																		});

																	}
											
																});

															}

														}
														catch(e) {
															socket.emit('media.sound.error', (e.message) ? e.message : e);
														}
								
													})
													.on('media.video.play', function(video) {

														try {

															if (!video.url || '' == video.url) {
																socket.emit('media.video.error', 'Url missing');
															}
															else {

																exec('vlc "' + video.url + '" --fullscreen --overlay --video-on-top --play-and-exit', function (err, stdout, stderr) {

																	if (err) {
																		socket.emit('media.video.error', (err.message) ? err.message : err);
																	}
																	else {
																		socket.emit('media.video.played', video);
																	}

																});

															}

														}
														catch(e) {
															socket.emit('media.video.error', (e.message) ? e.message : e);
														}
								
													});

												})
												.catch(function(e) {
													deferred.reject('-- [conf] ' + ((e.message) ? e.message : e));
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
					return Container.get('miasocket').stop();
				};
				
	};
	