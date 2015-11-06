
// dépendances
	
// module
	
	module.exports = function (p_clSocket) {

		// constructor
			
			p_clSocket.onDisconnect(function(socket) {
				socket.removeAllListeners('child.temperature');
			});

			p_clSocket.onConnection(function (socket) {

				socket.emit('child.temperature', '24.' + (Math.floor(Math.random() * (9 - 0)) + 0));

				setInterval(function() {
					socket.emit('child.temperature', '24.' + (Math.floor(Math.random() * (9 - 0)) + 0));
				}, 5000);

			});

	};
