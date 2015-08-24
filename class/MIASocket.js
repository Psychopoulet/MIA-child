
// dépendances
	
	var
		CST_DEP_DNS = require('dns'),
		CST_DEP_OS = require('os'),
		CST_DEP_Path = require('path'),
		CST_DEP_Log = require('logs'),
		CST_DEP_SocketIO = require('socket.io-client');
		
// module
	
	module.exports = function () {
	
		// attributes
			
			var m_clThis = this,
				m_clSocketClient,
				m_clLog = new CST_DEP_Log(CST_DEP_Path.join(__dirname, '..', 'logs')),
				m_tabOnConnection = [];
				
		// methodes
		
			// public
				
				this.start = function (p_nPort, p_fCallback, p_fCallbackOnConnection) {
					
					try {
						
						m_clSocketClient = CST_DEP_SocketIO.connect('http://localhost:' + p_nPort);

						m_clLog.success('-- [MIA socket] started');
						
						if ('function' === typeof p_fCallback) {
							p_fCallback();
						}

						m_clThis.onConnection(function (socket) {

							m_clLog.success('-- [MIA socket] connected');

							socket.on('disconnect', function () {
								m_clLog.info('-- [MIA socket] disconnected');
							});

						});
						
						m_clSocketClient.on('connect', function () {

							m_tabOnConnection.forEach(function (fOnConnection) {
								fOnConnection(m_clSocketClient);
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
				
				this.onConnection = function (p_fCallback) {

					if ('function' === typeof p_fCallback) {
						m_tabOnConnection.push(p_fCallback);
					}
							
					return m_clThis;
					
				};
				
	};
	