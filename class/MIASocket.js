
// d�pendances
	
	var
		CST_DEP_Path = require('path'),
		CST_DEP_Q = require('q'),
		CST_DEP_Log = require('logs'),
		CST_DEP_Conf = require(CST_DEP_Path.join(__dirname, 'Conf.js')),
		CST_DEP_SocketIO = require('socket.io-client');
		
// module
	
	module.exports = function () {

		// attributes
			
			var
				m_clThis = this,
				m_clLog = new CST_DEP_Log(CST_DEP_Path.join(__dirname, '..', 'logs')),
				m_clConf = new CST_DEP_Conf(),
				m_tabOnConnection = [],
				m_tabOnDisconnect = [];

		// methodes
		
			// public
				
				this.start = function (p_sIP, p_nPort) {
					
					var deferred = CST_DEP_Q.defer();

						try {

							var clSocketClient = CST_DEP_SocketIO.connect('http://' + p_sIP + ':' + p_nPort);

							clSocketClient.on('connect', function () {

								m_clLog.success('-- [MIA socket] connected');

								clSocketClient.on('disconnect', function () {

									m_clLog.info('-- [MIA socket] disconnected');

									clSocketClient.removeAllListeners('token_get');
									clSocketClient.removeAllListeners('token_set');

									m_tabOnDisconnect.forEach(function (fOnDisconnect) {
										fOnDisconnect(clSocketClient);
									});

								});

								clSocketClient
									.on('token_get', function () {

										var sToken = m_clConf.getConf().token;

										if (sToken) {

											m_clLog.success('-- [MIA socket] get token \'' + sToken + '\'');

											clSocketClient.emit('token_get', sToken);

											m_tabOnConnection.forEach(function (fOnConnection) {
												fOnConnection(clSocketClient);
											});

										}
										else {
											clSocketClient.emit('token_empty');
										}

									})
									.on('token_set', function (token) {

										new m_clConf.setConfOption('token', token).save()
											.then(function () {
												clSocketClient.emit('token_get', token);
											})
											.catch(function (err) {
												clSocketClient.emit('token_error', err);
											});

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
				
				this.onDisconnect = function (p_fCallback) {

					if ('function' === typeof p_fCallback) {
						m_tabOnDisconnect.push(p_fCallback);
					}
							
					return m_clThis;
					
				};
				
	};
	