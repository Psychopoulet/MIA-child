
// dépendances
	
	var
		path = require('path'),
		q = require('q'),
		
		Factory = require(path.join(__dirname, 'Factory.js')),
		Logs = require(path.join(__dirname, 'Logs.js'));
		
// module
	
	module.exports = function () {

		// attributes
			
			var
				m_clThis = this,
				m_clLog = new Logs(path.join(__dirname, '..', 'logs')),
				m_tabOnConnection = [],
				m_tabOnDisconnect = [];

		// methodes
		
			// public
				
				this.start = function (p_sIP, p_nPort) {
					
					var deferred = q.defer();

						try {

							var clSocketClient = require('socket.io-client').connect('http://' + p_sIP + ':' + p_nPort);

							clSocketClient.on('connect', function () {

								m_clLog.success('-- [MIA socket] connected');

								clSocketClient.on('disconnect', function () {

									m_clLog.info('-- [MIA socket] disconnected');

									clSocketClient.removeAllListeners('child.token.get');
									clSocketClient.removeAllListeners('child.token.set');

									m_tabOnDisconnect.forEach(function (fOnDisconnect) {
										fOnDisconnect(clSocketClient);
									});

								});

								clSocketClient
									.on('child.token.get', function () {

										var sToken = Factory.getConfInstance().getConf().token;

										if (sToken) {

											m_clLog.success('-- [MIA socket] get token \'' + sToken + '\'');

											clSocketClient.emit('child.token.get', sToken);

											m_tabOnConnection.forEach(function (fOnConnection) {
												fOnConnection(clSocketClient);
											});

										}
										else {
											clSocketClient.emit('child.token.empty');
										}

									})
									.on('child.token.set', function (token) {

										Factory.getConfInstance().setConfOption('token', token).save()
											.then(function () {
												clSocketClient.emit('child.token.get', token);
											})
											.catch(function (err) {
												clSocketClient.emit('child.token.error', err);
											});

									});
					
							});

							m_clLog.success('-- [MIA socket] started');
							
							deferred.resolve();

						}
						catch (e) {
							deferred.reject((e.message) ? e.message : e);
						}
						
					return deferred.promise;

				};
				
				this.stop = function () {

					var deferred = q.defer();

						try {
							deferred.resolve();
						}
						catch (e) {
							deferred.reject((e.message) ? e.message : e);	deferred.reject(e);
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
	