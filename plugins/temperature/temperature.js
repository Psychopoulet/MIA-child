
// dépendances
	
// module
	
	module.exports = function (Container) {

		// constructor
			
			Container.getMIASocketInstance().onDisconnect(function(socket) {
				socket.removeAllListeners('child.temperature');
			});

			Container.getMIASocketInstance().onConnection(function (socket) {

				socket.emit('child.temperature', '24.' + (Math.floor(Math.random() * (9 - 0)) + 0));

				setInterval(function() {
					socket.emit('child.temperature', '24.' + (Math.floor(Math.random() * (9 - 0)) + 0));
				}, 5000);

			});

	};
