
// dépendances
	
// module
	
	module.exports = function (Factory) {

		// constructor
			
			Factory.getMIASocketInstance().onDisconnect(function(socket) {
				socket.removeAllListeners('child.temperature');
			});

			Factory.getMIASocketInstance().onConnection(function (socket) {

				socket.emit('child.temperature', '24.' + (Math.floor(Math.random() * (9 - 0)) + 0));

				setInterval(function() {
					socket.emit('child.temperature', '24.' + (Math.floor(Math.random() * (9 - 0)) + 0));
				}, 5000);

			});

	};
