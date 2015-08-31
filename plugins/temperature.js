
// dépendances
	
	var
		CST_DEP_Path = require('path');
		
// module
	
	module.exports = function (p_clSocket) {

		// constructor
			
			p_clSocket.onDisconnect(function(socket) {
				socket.removeAllListeners('temperature');
			});

			p_clSocket.onConnection(function (socket) {

				socket.emit('temperature', 24.2);

				setInterval(function() {
					socket.emit('temperature', 24.2);
				}, 5000);

			});

	};
