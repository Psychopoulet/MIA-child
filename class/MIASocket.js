
// dépendances
	
	var
		CST_DEP_Path = require('path'),
		CST_DEP_Log = require('logs'),
		CST_DEP_Q = require('q'),
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
				
				this.start = function (p_sIP, p_nPort) {
					
					var deferred = CST_DEP_Q.defer();

						try {

							m_clSocketClient = CST_DEP_SocketIO.connect('http://' + p_sIP + ':' + p_nPort);

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

							m_clLog.success('-- [MIA socket] started');
							
							deferred.resolve();

						}
						catch (e) {
							if (e.message) {
								deferred.reject(e.message);
							}
							else {
								deferred.reject(e);
							}
						}
						
					return deferred.promise;

				};
				
				this.stop = function () {

					var deferred = CST_DEP_Q.defer();

						try {

							deferred.resolve();
					
						}
						catch (e) {
							if (e.message) {
								deferred.reject(e.message);
							}
							else {
								deferred.reject(e);
							}
						}
						
					return deferred.promise;

				};
				
				this.onConnection = function (p_fCallback) {

					if ('function' === typeof p_fCallback) {
						m_tabOnConnection.push(p_fCallback);
					}
							
					return m_clThis;
					
				};
				
	};
	