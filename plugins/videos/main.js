
// dépendances
	
	var
		path = require('path'),
		exec = require('child_process').exec,
		Logs = require(path.join(__dirname, '..', '..', 'class', 'Logs.js'));
		
// module
	
	module.exports = function (Container) {
		
		// attributes
			
			var
				m_clLog = new Logs(path.join(__dirname, '..', 'logs', 'plugins', 'videos'));
				
		// constructor
			
			Container.get('server.socket.mia').onDisconnect(function(socket) {
				socket.removeAllListeners('child.videos.play');
			});

			Container.get('server.socket.mia').onConnection(function (socket) {

				socket.on('child.videos.play', function(data) {
					
					exec('cvlc "' + data + '" --play-and-exit', function (error, stdout, stderr) {

						if (null == error) {
							socket.emit('child.videos.played');
						}
						else {

							exec('vlc "' + data + '" --play-and-exit', function (error, stdout, stderr) {

								if (null != error) {
									
									if (error.cmd) {
										socket.emit('child.videos.error', error.cmd);
									}
									else {
										socket.emit('child.videos.error', error);
									}

								}
								else {
									socket.emit('child.videos.played');
								}

							});

						}

					});

				});
				
			});

	};
