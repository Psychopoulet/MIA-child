
// dépendances
	
	var
		CST_DEP_DNS = require('dns'),
		CST_DEP_OS = require('os'),
		CST_DEP_Path = require('path'),
		CST_DEP_Log = require(CST_DEP_Path.join(__dirname, 'Log.js')),
		CST_DEP_SocketIO = require('socket.io-client');
		
// module
	
	module.exports = function () {
	
		// attributes
			
			var m_clSocketClient,
				m_clLog = new CST_DEP_Log(CST_DEP_Path.join(__dirname, '..', 'logs'));
				
		// methodes
			
			// public
				
				this.start = function (p_nPort, p_clHTTPServer) {
					
					try {
						
						CST_DEP_DNS.lookup(CST_DEP_OS.hostname(), function (err, add, fam) {
							
							console.log(add);
							console.log(CST_DEP_SocketIO);
							console.log(CST_DEP_SocketIO.connect);
							
							m_clSocketClient = CST_DEP_SocketIO.connect('http://localhost:1338');
							
							m_clLog.success('-- [MIA socket client] listened');
							
							m_clSocketClient.emit('test');
							
							m_clSocketClient.on('test_ok', function () {
								m_clLog.success('ca marche !');
							})

							if ('function' === typeof p_fCallback) {
								p_fCallback();
							}

						});
						
					}
					catch (e) {
						m_clLog.err(e);
					}
					
				};
				
				this.stop = function (p_fCallback) {

					try {

						if ('function' === typeof p_fCallback) {
							p_fCallback();
						}
					
					}
					catch (e) {
						m_clLog.err(e);
					}
					
				};
				
	};
	