
// dépendances
	
	var
		CST_DEP_Path = require('path'),
		CST_DEP_Log = require('logs'),
		CST_DEP_Conf = require(CST_DEP_Path.join(__dirname, '..', 'class', 'Conf.js'));
		
// module
	
	module.exports = function (p_clSocket) {

		// attributes
			
			var
				m_clLog = new CST_DEP_Log(CST_DEP_Path.join(__dirname, '..', 'logs', 'plugins', 'token'));
				
		// constructor
			
			p_clSocket.onConnection(function (socket) {

				socket.removeAllListeners('token_get');
				socket.removeAllListeners('token_set');

				socket
					.on('token_get', function () {

						var sToken = new CST_DEP_Conf().getConf().token;

						if (sToken) {
							socket.emit('token_get', sToken);
						}
						else {
							socket.emit('token_empty');
						}

					})
					.on('token_set', function (token) {

						new CST_DEP_Conf().setConfOption('token', token).save()
							.then(function () {
								socket.emit('token_get', token);
							})
							.catch(function (err) {
								socket.emit('token_error', err);
							});

					});
					
			});

	};