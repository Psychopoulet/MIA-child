
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
				m_sSoundsPath = path.join(__dirname, 'sounds'),
				m_clLog = new Logs(path.join(__dirname, '..', 'logs', 'plugins', 'warcraftsounds'));
				
		// methods
		
			// private
			
				function _download(p_sUrl, p_sSoundPath) {
					
					var deferred = q.defer();

						try {

							try {

								if (fs.lstatSync(p_sSoundPath).isFile()) {
									deferred.resolve();
								}

							}
							catch (e) {

								mkdirp(path.dirname(p_sSoundPath), function (err) {

									if (err) {
										deferred.reject((err.message) ? err.message : err);
									}
									else {

										http.get(p_sUrl, function(res) {

											var sStatusCode = res.statusCode + '', sResponse = '';
											var clFile = fs.createWriteStream(p_sSoundPath);

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
			
				function _play(p_sUrl) {
					
					var deferred = q.defer();

						try {

							exec('cvlc "' + p_sUrl + '" --play-and-exit', function (err, stdout, stderr) {

								if (!err) {
									deferred.resolve();
								}
								else {

									exec('vlc "' + p_sUrl + '" --play-and-exit', function (err, stdout, stderr) {

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
			
			Container.getMIASocketInstance().onDisconnect(function(socket) {
				socket.removeAllListeners('w3');
				socket.removeAllListeners('child.warcraftsounds.action.play');
				socket.removeAllListeners('child.warcraftsounds.music.play');
				socket.removeAllListeners('child.warcraftsounds.warning.play');
			});

			Container.getMIASocketInstance().onConnection(function (socket) {
				
				socket
					.on('child.warcraftsounds.action.play', function(p_stData) {
						
						if (!p_stData) {
							m_clLog.err('Missing data');
							socket.emit('child.warcraftsounds.error', 'Missing data');
						}
						else if (!p_stData.url) {
							m_clLog.err('Missing \'data.url\' data');
							socket.emit('child.warcraftsounds.error', 'Missing \'data.url\' data');
						}
						else if (!p_stData.coderace) {
							m_clLog.err('Missing \'data.coderace\' data');
							socket.emit('child.warcraftsounds.error', 'Missing \'data.coderace\' data');
						}
						else if (!p_stData.codecharacter) {
							m_clLog.err('Missing \'data.codecharacter\' data');
							socket.emit('child.warcraftsounds.error', 'Missing \'data.codecharacter\' data');
						}
						else if (!p_stData.code) {
							m_clLog.err('Missing \'data.code\' data');
							socket.emit('child.warcraftsounds.error', 'Missing \'data.code\' data');
						}
						else {

							var sSoundPath = path.join(m_sSoundsPath, p_stData.coderace, 'actions', p_stData.codecharacter, p_stData.code + '.mp3');

							_download(p_stData.url, sSoundPath)
								.then(function () {

									_play(sSoundPath)
										.then(function () {
											m_clLog.log('child.warcraftsounds.action.played : ' + p_stData.name);
											socket.emit('child.warcraftsounds.action.played', p_stData);
										})
										.catch(function (e) {
											m_clLog.err(e);
											socket.emit('child.warcraftsounds.error', e);
										});

								})
								.catch(function (e) {
									m_clLog.err(e);
									socket.emit('child.warcraftsounds.error', e);
								});
								
						}
						
					})
					.on('child.warcraftsounds.music.play', function(p_stData) {
						
						if (!p_stData) {
							m_clLog.err('Missing data');
							socket.emit('child.warcraftsounds.error', 'Missing data');
						}
						else if (!p_stData.url) {
							m_clLog.err('Missing \'data.url\' data');
							socket.emit('child.warcraftsounds.error', 'Missing \'data.url\' data');
						}
						else if (!p_stData.coderace) {
							m_clLog.err('Missing \'data.coderace\' data');
							socket.emit('child.warcraftsounds.error', 'Missing \'data.coderace\' data');
						}
						else if (!p_stData.code) {
							m_clLog.err('Missing \'data.code\' data');
							socket.emit('child.warcraftsounds.error', 'Missing \'data.code\' data');
						}
						else {
							
							var sSoundPath = path.join(m_sSoundsPath, p_stData.coderace, 'musics', p_stData.code + '.mp3');

							_download(p_stData.url, sSoundPath)
								.then(function () {

									_play(sSoundPath)
										.then(function () {
											m_clLog.log('child.warcraftsounds.music.played : ' + p_stData.name);
											socket.emit('child.warcraftsounds.music.played', p_stData);
										})
										.catch(function (e) {
											m_clLog.err(e);
											socket.emit('child.warcraftsounds.error', e);
										});

								})
								.catch(function (e) {
									m_clLog.err(e);
									socket.emit('child.warcraftsounds.error', e);
								});
								
						}
						
					})
					.on('child.warcraftsounds.warning.play', function(p_stData) {
						
						if (!p_stData) {
							m_clLog.err('Missing data');
							socket.emit('child.warcraftsounds.error', 'Missing data');
						}
						else if (!p_stData.url) {
							m_clLog.err('Missing \'data.url\' data');
							socket.emit('child.warcraftsounds.error', 'Missing \'data.url\' data');
						}
						else if (!p_stData.coderace) {
							m_clLog.err('Missing \'data.coderace\' data');
							socket.emit('child.warcraftsounds.error', 'Missing \'data.coderace\' data');
						}
						else if (!p_stData.code) {
							m_clLog.err('Missing \'data.code\' data');
							socket.emit('child.warcraftsounds.error', 'Missing \'data.code\' data');
						}
						else {

							var sSoundPath = path.join(m_sSoundsPath, p_stData.coderace, 'warnings', p_stData.code + '.mp3');

							_download(p_stData.url, sSoundPath)
								.then(function () {

									_play(sSoundPath)
										.then(function () {
											m_clLog.log('child.warcraftsounds.warning.played : ' + p_stData.name);
											socket.emit('child.warcraftsounds.warning.played', p_stData);
										})
										.catch(function (e) {
											m_clLog.err(e);
											socket.emit('child.warcraftsounds.error', e);
										});

								})
								.catch(function (e) {
									m_clLog.err(e);
									socket.emit('child.warcraftsounds.error', e);
								});
								
						}
						
					});

			});

	};
