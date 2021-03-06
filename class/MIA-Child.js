
"use strict";

// dépendances
	
	const 	path = require('path'),
			exec = require('child_process').exec,

			SimpleTTS = require('simpletts');

// module

	module.exports = function (Container) {

		// attributes
			
			var that = this;
				
		// methodes

			// public
				
				this.start = function () {

					return new Promise(function(resolve, reject) {

						try {

							if (Container.get('conf').has('pid')) {

								try {

									process.kill(Container.get('conf').get('pid'));
									Container.get('logs').success('[END PROCESS ' + Container.get('conf').get('pid') + ']');

								}
								catch (e) { }

							}

							Container.get('conf').set('pid', process.pid).save().then(function() {

								Container.get('logs').success('[START ' + process.pid + ']');

								// start sockets
								return Container.get('miasocket').start();

							}).then(function() {

								// sockets
									
								Container.get('miasocket').onDisconnect(function (socket) {

									socket.removeAllListeners('login.error');
									socket.removeAllListeners('logged');

									socket.removeAllListeners('media.sound.play');
									socket.removeAllListeners('media.video.play');
									
								})

								.onConnection(function (socket) {

									var token = Container.get('conf').get('token');

									if (token) {
										socket.emit('login', { token : token });
									}

									socket.on('login.error', function(err) {
										Container.get('logs').error('-- [MIA-Child] : login failed (' + ((err.message) ? err.message : err) + ')');
									})

									.on('logged', function(child) {

										Container.get('conf').set('token', child.token).save().then(function() {

											Container.get('logs').success('-- [MIA-Child] : logged');

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
						
											})
											
											.on('tts.defaultvoice', function(defaultVoice) {

												try {
													Container.get('logs').log('tts.defaultvoice');
													SimpleTTS.setDefaultVoice(defaultVoice);
													socket.emit('tts.defaultvoice', defaultVoice);
												}
												catch(e) {
													Container.get('logs').err((e.message) ? e.message : e);
													socket.emit('tts.error', (e.message) ? e.message : e);
												}
						
											})
											.on('tts.voices', function() {

												try {

													Container.get('logs').log('tts.voices');

													SimpleTTS.getVoices().then(function(voices) {
														socket.emit('tts.voices', voices);
													}).catch(function(err) {
														Container.get('logs').err((err.message) ? err.message : err);
														socket.emit('tts.error', (err.message) ? err.message : err);
													});

												}
												catch(e) {
													Container.get('logs').err((e.message) ? e.message : e);
													socket.emit('tts.error', (e.message) ? e.message : e);
												}
						
											})
											.on('tts.read', function(text) {

												try {

													Container.get('logs').log('tts.read');

													if (!text) {
														Container.get('logs').err('Text missing');
														socket.emit('tts.error', 'Text missing');
													}
													else {

														SimpleTTS.read(text).then(function() {
															socket.emit('tts.read', text);
														}).catch(function(err) {
															Container.get('logs').err((err.message) ? err.message : err);
															socket.emit('tts.error', (err.message) ? err.message : err);
														});

													}

												}
												catch(e) {
													Container.get('logs').err((e.message) ? e.message : e);
													socket.emit('tts.error', (e.message) ? e.message : e);
												}
						
											});

										})
										.catch(function(e) {
											Container.get('logs').error('-- [conf] ' + ((e.message) ? e.message : e));
										});

									});

								});
				
							}).catch(reject);

						}
						catch (e) {
							reject((e.message) ? e.message : e);
						}

					});

				};
				
				this.stop = function () {
					return Container.get('miasocket').stop();
				};
				
	};
	