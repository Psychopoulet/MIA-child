
// dépendances
	
	var
		path = require('path'),
		exec = require('child_process').exec,
		Logs = require(path.join(__dirname, '..', '..', 'class', 'Logs.js'));
		
// module
	
	module.exports = function (Factory) {
		
		// attributes
			
			var
				m_clLog = new Logs(path.join(__dirname, '..', 'logs', 'plugins', 'youtube'));
				
		// constructor
			
			Factory.getMIASocketInstance().onDisconnect(function(socket) {
				socket.removeAllListeners('child.youtube.play');
			});

			Factory.getMIASocketInstance().onConnection(function (socket) {

				socket.on('child.youtube.play', function(data) {
					
					exec('cvlc "' + data + '" --play-and-exit', function (error, stdout, stderr) {

						if (null == error) {
							socket.emit('child.youtube.played');
						}
						else {

							exec('vlc "' + data + '" --play-and-exit', function (error, stdout, stderr) {

								if (null != error) {
									
									if (error.cmd) {
										socket.emit('child.youtube.error', error.cmd);
									}
									else {
										socket.emit('child.youtube.error', error);
									}

								}
								else {
									socket.emit('child.youtube.played');
								}

							});

						}

					});

				});
				
			});

	};
