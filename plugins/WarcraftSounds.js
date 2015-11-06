
// dépendances
	
	var
		path = require('path'),
		q = require('q'),
		exec = require('child_process').exec,
		Logs = require(path.join(__dirname, '..', 'class', 'Logs.js'));
		
// module
	
	module.exports = function (p_clSocket) {
		
		// attributes
			
			var
				m_clLog = new Logs(path.join(__dirname, '..', 'logs', 'plugins', 'warcraftsounds'));
				
		// methods
		
			// private
			
				function _play(p_sUrl) {
					
					var deferred = q.defer();

						try {

							exec('cvlc "' + p_sUrl + '" --play-and-exit', function (error, stdout, stderr) {

								if (!error) {
									deferred.resolve();
								}
								else {

									exec('vlc "' + p_sUrl + '" --play-and-exit', function (error, stdout, stderr) {
										
										if (error) {
											
											if (error.cmd) {
												deferred.reject(error.cmd);
											}
											else {
												deferred.reject(error);
											}

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
			
			p_clSocket.onDisconnect(function(socket) {
				socket.removeAllListeners('w3');
				socket.removeAllListeners('child.warcraftsounds.action.play');
				socket.removeAllListeners('child.warcraftsounds.music.play');
				socket.removeAllListeners('child.warcraftsounds.warning.play');
			});

			p_clSocket.onConnection(function (socket) {
				
				socket
					.on('child.warcraftsounds.action.play', function(p_stData) {
						
						if (!p_stData) {
							m_clLog.err('Missing data');
							socket.emit('child.warcraftsounds.error', 'Missing data');
						}
						else if (!p_stData.url) {
							m_clLog.err('Missing \'data.url\' data');
							p_clSocket.emit('child.warcraftsounds.error', 'Missing \'data.url\' data');
						}
						else {
							
							_play(p_stData.url)
								.then(function (e) {
									m_clLog.success('child.warcraftsounds.action.played : ' + p_stData.name);
									socket.emit('child.warcraftsounds.action.played', p_stData);
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
							p_clSocket.emit('child.warcraftsounds.error', 'Missing \'data.url\' data');
						}
						else {
							
							_play(p_stData.url)
								.then(function (e) {
									m_clLog.success('child.warcraftsounds.music.played : ' + p_stData.name);
									socket.emit('child.warcraftsounds.music.played', p_stData);
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
							p_clSocket.emit('child.warcraftsounds.error', 'Missing \'data.url\' data');
						}
						else {
							
							_play(p_stData.url)
								.then(function (e) {
									m_clLog.success('child.warcraftsounds.warning.played : ' + p_stData.name);
									socket.emit('child.warcraftsounds.warning.played', p_stData);
								})
								.catch(function (e) {
									m_clLog.err(e);
									socket.emit('child.warcraftsounds.error', e);
								});
								
						}
						
					});

			});

	};
