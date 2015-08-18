
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
				
				this.start = function (p_nPort, p_fCallback) {
					
					try {
						
						m_clSocketClient = CST_DEP_SocketIO.connect('http://localhost:' + p_nPort);
						
						if (m_clSocketClient) {
									
							m_clLog.success('-- [MIA socket client] listened');
							
							if ('function' === typeof p_fCallback) {
								p_fCallback(m_clSocketClient);
							}

						}
							
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
				
				this.on = function (p_sAction, p_fCallback) {

					try {
						
						if (m_clSocketClient && 'function' === typeof p_fCallback) {
							m_clSocketClient.on(p_sAction, p_fCallback);
						}
						
					}
					catch (e) {
						m_clLog.err(e);
					}
					
				};
				
				this.emit = function (p_sAction, p_stData) {

					try {

						if (m_clSocketClient) {
							
							if (p_stData) {
								m_clSocketClient.emit(p_sAction, p_stData);
							}
							else {
								m_clSocketClient.emit(p_sAction);
							}
							
						}
						
					}
					catch (e) {
						m_clLog.err(e);
					}
					
				};
				
	};
	