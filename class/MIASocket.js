
// dépendances
	
	var
		path = require('path'),
		q = require('q'),
		
		Container = require(path.join(__dirname, 'Container.js')),
		Logs = require(path.join(__dirname, 'Logs.js'));
		
// module
	
	module.exports = function () {

		// attributes
			
			var
				that = this,
				conf = Container.get('conf'),
				m_clLog = new Logs(path.join(__dirname, '..', 'socket')),
				m_tabOnConnection = [],
				m_tabOnDisconnect = [];

		// methodes
		
			// public
				
				this.start = function () {
					
					var deferred = q.defer(), sAddress = 'http' + ((conf.get('ssl')) ? 's' : '') + '://' + conf.get('miaip') + ':' + conf.get('miaport');

						try {

							var clSocketClient = require('socket.io-client').connect(sAddress);

							clSocketClient.on('connect', function () {

								m_clLog.success('-- [MIA socket] connected');

								clSocketClient.on('disconnect', function () {

									m_clLog.info('-- [MIA socket] disconnected');

									m_tabOnDisconnect.forEach(function (fOnDisconnect) {
										fOnDisconnect(clSocketClient);
									});

								});

							});

							m_clLog.success('-- [MIA socket] started on ' + sAddress);
							
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
					
					return that;
					
				};
				
				this.onDisconnect = function (p_fCallback) {

					if ('function' === typeof p_fCallback) {
						m_tabOnDisconnect.push(p_fCallback);
					}
					
					return that;
					
				};
				
	};
	