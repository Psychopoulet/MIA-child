
// dépendances
	
	var
		path = require('path'),
		fs = require('fs'),
		q = require('q'),
		http = require('http'),
		mkdirp = require('mkdirp'),
		exec = require('child_process').exec,
		Logs = require(path.join(__dirname, '..', '..', 'class', 'Logs.js'));
		
// module
	
	module.exports = function (Container) {
		
		// attributes
			
			var
				m_sVideosPath = path.join(__dirname, 'videos'),
				m_clLog = new Logs(path.join(__dirname, '..', 'logs', 'plugins', 'videos'));
				
		// methods
		
			// private
			
				function _download(p_sUrl, p_sVideoPath) {
					
					var deferred = q.defer();

						try {

							try {

								if (fs.lstatSync(p_sVideoPath).isFile()) {
									deferred.resolve();
								}

							}
							catch (e) {

								mkdirp(path.dirname(p_sVideoPath), function (err) {

									if (err) {
										deferred.reject((err.message) ? err.message : err);
									}
									else {

										http.get(p_sUrl, function(res) {

											var sStatusCode = res.statusCode + '', sResponse = '';
											var clFile = fs.createWriteStream(p_sVideoPath);

											if (2 == sStatusCode.charAt(0)) {

												res.on('data', function (data) {
													clFile.write(data);
												})
										 		.on('end', function() {
										 			clFile.end();
										 			deferred.resolve();
												})
										 		.on('error', function(err) {
													deferred.reject((err.message) ? err.message : err);
												});

											}
											else {
												deferred.reject('error on ' + p_sUrl + ' : status code = ' + sStatusCode);
											}

										});

									}

								});

							}

						}
						catch(e) {
							deferred.reject((e.message) ? e.message : e);
						}
					
					return deferred.promise;

				}
				
				function _play(p_sVideo) {
					
					var deferred = q.defer();

						try {

							exec('cvlc "' + p_sVideo + '" --play-and-exit', function (err, stdout, stderr) {

								if (!err) {
									deferred.resolve();
								}
								else {

									exec('vlc "' + p_sVideo + '" --play-and-exit', function (err, stdout, stderr) {

										if (err) {
											deferred.reject(stderr);
										}
										else {
											deferred.resolve();
										}

									});

								}
		
							});

						}
						catch(e) {
							deferred.reject((e.message) ? e.message : e);
						}
					
					return deferred.promise;

				}
				
		// constructor
			
			Container.get('server.socket.mia').onDisconnect(function(socket) {
				socket.removeAllListeners('child.videos.play');
			});

			Container.get('server.socket.mia').onConnection(function (socket) {

				console.log('onConnection');

				socket.on('child.videos.play', function(p_stData) {

					console.log(p_stData);

					var sVideoPath = path.join(m_sSoundsPath, 'videos', 'youtube', p_stData.code + '.mp3');

					console.log(sVideoPath);

					try {

						if (fs.lstatSync(sVideoPath).isFile()) {

							_play(sVideoPath)
								.then(function () {
									m_clLog.log('child.videos.played : ' + p_stData.name);
									socket.emit('child.videos.played', p_stData);
								})
								.catch(function (e) {
									m_clLog.err(e);
									socket.emit('child.videos.error', e);
								});

						}

					}
					catch (e) {

						console.log('_download');

						_download(p_stData.url, sVideoPath)
							.then(function () {
								console.log('downloaded');
								socket.emit('child.videos.downloaded', p_stData);
							})
							.catch(function (e) {
								m_clLog.err(e);
								socket.emit('child.warcraftsounds.error', e);
							});

						_play(p_stData.urlembeded)
							.then(function () {
								console.log('played');
								m_clLog.log('child.videos.played : ' + p_stData.name);
								socket.emit('child.videos.played', p_stData);
							})
							.catch(function (e) {
								m_clLog.err(e);
								socket.emit('child.videos.error', e);
							});

					 }	
				
				});
				
			});

	};
