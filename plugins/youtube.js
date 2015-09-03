
// dépendances
	
	var
		CST_DEP_Path = require('path'),
		CST_DEP_Log = require('logs'),
		CST_DEP_EXEC = require('child_process').exec;
		
// module
	
	module.exports = function (p_clSocket) {
		
		// attributes
			
			var
				m_clLog = new CST_DEP_Log(CST_DEP_Path.join(__dirname, '..', 'logs', 'plugins', 'youtube'));
				
		// constructor
			
			p_clSocket.onDisconnect(function(socket) {
				socket.removeAllListeners('youtube.play');
			});

			p_clSocket.onConnection(function (socket) {

				socket.on('youtube.play', function(data) {
					
					CST_DEP_EXEC('cvlc "' + data + '" --play-and-exit', function (error, stdout, stderr) {

						if (null == error) {
							socket.emit('youtube.played');
						}
						else {

							CST_DEP_EXEC('vlc "' + data + '" --play-and-exit', function (error, stdout, stderr) {

								if (null != error) {
									
									if (error.cmd) {
										socket.emit('youtube.error', error.cmd);
									}
									else {
										socket.emit('youtube.error', error);
									}

								}
								else {
									socket.emit('youtube.played');
								}

							});

						}

					});

				});
				
			});

	};
