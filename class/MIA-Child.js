
// dépendances
	
	var
		path = require('path'),
		fs = require('fs'),
		q = require('q'),
		exec = require('child_process').exec,

		Container = require(path.join(__dirname, 'Container.js')),
		Logs = require(path.join(__dirname, 'Logs.js'));
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var m_clLog = new Logs(path.join(__dirname, '..', 'logs'));
				
		// methodes
			
			// public
				
				this.start = function () {

					var deferred = q.defer();

						try {

							// start
								
								Container.get('server.socket.mia').start()
									.then(deferred.resolve)
									.catch(deferred.reject);

							// sockets
								
								Container.get('server.socket.mia')

									.onDisconnect(function (socket) {

										socket.removeAllListeners('child.sounds.play');
										socket.removeAllListeners('child.sounds.play');
										
									})

									.onConnection(function (socket) {

										

										socket.emit('child.temperature', '22.' + (Math.floor(Math.random() * (9 - 0)) + 0));

										setInterval(function() {
											socket.emit('child.temperature', '22.' + (Math.floor(Math.random() * (9 - 0)) + 0));
										}, 5000);



										socket.on('child.videos.play', function(video) {

											try {

												if (!video.url || '' == video.url) {
													socket.emit('child.videos.error', 'Url missing');
												}
												else {

													exec('vlc "' + video.url + '" --play-and-exit', function (err, stdout, stderr) {

														if (err) {
															socket.emit('child.videos.error', (err.message) ? err.message : err);
														}
														else {
															socket.emit('child.videos.played', video);
														}

													});

												}

											}
											catch(e) {
												socket.emit('child.videos.error', (e.message) ? e.message : e);
											}
					
										})
										.on('child.sounds.play', function(sound) {

											try {

												if (!sound.url || '' == sound.url) {
													socket.emit('child.sounds.error', 'Url missing');
												}
												else {

													exec('cvlc "' + sound.url + '" --play-and-exit', function (err, stdout, stderr) {

														if (!err) {
															socket.emit('child.sounds.played', sound);
														}
														else {

															exec('vlc "' + sound.url + '" --play-and-exit', function (err, stdout, stderr) {

																if (err) {
																	socket.emit('child.sounds.error', (err.message) ? err.message : err);
																}
																else {
																	socket.emit('child.sounds.played', sound);
																}

															});

														}
								
													});

												}

											}
											catch(e) {
												socket.emit('child.sounds.error', (e.message) ? e.message : e);
											}
					
										});

									});
									
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
	