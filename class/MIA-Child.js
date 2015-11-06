
// dépendances
	
	var
		path = require('path'),
		fs = require('fs'),
		q = require('q'),
		MIASocket = require(path.join(__dirname, 'MIASocket.js')),
		Conf = require(path.join(__dirname, 'Conf.js'));
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var
				m_clThis = this,
				m_clConf = new Conf(),
				m_clMIASocket = new MIASocket();
				
		// methodes
			
			// public
				
				this.start = function () {

					var
						deferred = q.defer(),
						sPluginsPath = path.join(__dirname, '..', 'plugins');

						try {

							// plugins
							
								require('fs').readdirSync(sPluginsPath).forEach(function (file) {
									
									try {
										require(path.join(sPluginsPath, file))(m_clMIASocket);
									}
									catch (e) {
										m_clLog.err((e.message) ? e.message : e);
									}

								});

							// start
								
								m_clMIASocket.start(m_clConf.getConf().miaip, m_clConf.getConf().miaport)
									.then(deferred.resolve)
									.catch(deferred.reject);
									
						}
						catch (e) {
							deferred.reject((e.message) ? e.message : e);
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
	