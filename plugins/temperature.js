
// dépendances
	
	var
		CST_DEP_Path = require('path');
		
// module
	
	module.exports = function (p_clSocket, p_clW3VoicesManager) {

		setInterval(function() {
			p_clSocket.emit('temperature', 24.2);
		}, 5000);

	};