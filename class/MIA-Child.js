
// dépendances
	
	var
		CST_DEP_Path = require('path'),
		CST_DEP_FileSync = require('fs'),
		CST_DEP_Q = require('q'),
		CST_DEP_MIASocket = require(CST_DEP_Path.join(__dirname, 'MIASocket.js'));
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var
				m_clThis = this,
				m_clMIASocket = new CST_DEP_MIASocket();
				
		// methodes
			
			// public
				
				this.start = function (p_stConf) {

					var deferred = CST_DEP_Q.defer();

						try {

							m_clMIASocket.start(p_stConf.miaip, p_stConf.miaport)
								.then(function() {

									m_clMIASocket.onConnection(function (socket) {

										var sPluginsPath = CST_DEP_Path.join(__dirname, '..', 'plugins');

										CST_DEP_FileSync.readdirSync(sPluginsPath).forEach(function (file) {
											require(CST_DEP_Path.join(sPluginsPath, file))(socket);
										});

									});

									deferred.resolve();

								})
								.catch(deferred.reject);
							
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

							m_clMIASocket.stop()
								.then(deferred.resolve)
								.catch(deferred.reject);

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
				
				this.getVersion = function () {
					return '0.0.1'
				};
				
	};
	