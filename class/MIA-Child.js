
// dépendances
	
	var
		CST_DEP_Path = require('path'),
		CST_DEP_FileSystem = require('fs'),
		CST_DEP_Q = require('q'),
		CST_DEP_MIASocket = require(CST_DEP_Path.join(__dirname, 'MIASocket.js')),
		CST_DEP_Conf = require(CST_DEP_Path.join(__dirname, 'Conf.js'));
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var
				m_clThis = this,
				m_clConf = new CST_DEP_Conf(),
				m_clMIASocket = new CST_DEP_MIASocket();
				
		// methodes
			
			// public
				
				this.start = function () {

					var
						deferred = CST_DEP_Q.defer(),
						sPluginsPath = CST_DEP_Path.join(__dirname, '..', 'plugins');

						try {

							// plugins
											
								CST_DEP_FileSystem.readdirSync(sPluginsPath).forEach(function (file) {
									require(CST_DEP_Path.join(sPluginsPath, file))(m_clMIASocket);
								});

							// start
								
								m_clMIASocket.start(m_clConf.getConf().miaip, m_clConf.getConf().miaport)
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
				
				this.stop = function () {
					return m_clMIASocket.stop();
				};
				
				this.getVersion = function () {
					return '0.0.1'
				};

	};
	