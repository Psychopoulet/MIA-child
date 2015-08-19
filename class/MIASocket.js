
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
			
			var m_clThis = this,
				m_clSocketClient,
				m_clLog = new CST_DEP_Log(CST_DEP_Path.join(__dirname, '..', 'logs'));
				
		// methodes
		
			// public
				
				this.start = function (p_nPort, p_fCallback, p_fCallbackOnConnection) {
					
					try {
						
						m_clSocketClient = CST_DEP_SocketIO.connect('http://localhost:' + p_nPort);

						if ('function' === typeof p_fCallback) {
							p_fCallback();
						}

						m_clSocketClient.on('connect', function () {

							m_clLog.success('-- [MIA socket] connected');

							if ('function' === typeof p_fCallbackOnConnection) {
								p_fCallbackOnConnection(m_clSocketClient);
							}

							m_clSocketClient.on('disconnect', function () {
								m_clLog.info('-- [MIA socket] disconnected');
							});

						});

					}
					catch (e) {
						m_clLog.err(e);
					}
					
					return m_clThis;
					
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
					
					return m_clThis;
					
				};
				
	};
	