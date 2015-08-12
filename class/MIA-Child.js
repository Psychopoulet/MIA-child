
// dépendances
	
	var
		CST_DEP_Path = require('path'),
		CST_DEP_Log = require(CST_DEP_Path.join(__dirname, 'Log.js')),
		CST_DEP_MIASocket = require(CST_DEP_Path.join(__dirname, 'MIASocket.js'));
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var m_stSIKYUser,
				m_clLog = new CST_DEP_Log(CST_DEP_Path.join(__dirname, '..', 'logs')),
				m_clMIASocket = new CST_DEP_MIASocket();
				
		// methodes
			
			// public
				
				this.start = function (p_fCallback) {

					try {
						
						m_clMIASocket.start(function () {

							if ('function' === typeof p_fCallback) {
								p_fCallback();
							}

						});

					}
					catch (e) {
						m_clLog.err(e);
					}
					
				};
				
				this.stop = function (p_fCallback) {

					try {

						m_clMIASocket.stop(function () {

							if ('function' === typeof p_fCallback) {
								p_fCallback();
							}

						});

					}
					catch (e) {
						m_clLog.err(e);
					}
					
				};
				
	};
	