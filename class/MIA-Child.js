
// dépendances
	
	var
		CST_DEP_Path = require('path'),
		CST_DEP_FileSync = require('fs'),
		CST_DEP_Log = require('logs'),
		CST_DEP_W3VoicesManager = require('W3VoicesManager'),
		CST_DEP_MIASocket = require(CST_DEP_Path.join(__dirname, 'MIASocket.js'));
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var m_clThis = this,
				m_clLog = new CST_DEP_Log(CST_DEP_Path.join(__dirname, '..', 'logs')),
				m_clW3VoicesManager = new CST_DEP_W3VoicesManager(),
				m_clMIASocket = new CST_DEP_MIASocket();
				
		// methodes
			
			// public
				
				this.start = function (p_fCallback) {

					try {

						m_clMIASocket.start(1338, function () {
							m_clW3VoicesManager.playActionFromRandomCharacter('ready');
						});
						
						m_clMIASocket.onConnection(function (socket) {

							var sPluginsPath = CST_DEP_Path.join(__dirname, '..', 'plugins');

							CST_DEP_FileSync.readdirSync(sPluginsPath).forEach(function (file) {
								require(CST_DEP_Path.join(sPluginsPath, file))(socket, m_clW3VoicesManager);
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

						return;
						
						m_clMIASocket.stop(p_fCallback);

					}
					catch (e) {
						m_clLog.err(e);
					}
					
					return m_clThis;
					
				};
				
				this.getVersion = function () {
					return '0.0.1'
				};
				
	};
	