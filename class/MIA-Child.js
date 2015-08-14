
// dépendances
	
	var
		CST_DEP_Path = require('path'),
		CST_DEP_Log = require(CST_DEP_Path.join(__dirname, 'Log.js')),
		CST_DEP_W3VoicesManager = require(CST_DEP_Path.join(__dirname, '..', 'node_modules', 'W3VoicesManager', 'W3VoicesManager.js')),
		CST_DEP_MIASocket = require(CST_DEP_Path.join(__dirname, 'MIASocket.js'));
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var m_stSIKYUser,
				m_clLog = new CST_DEP_Log(CST_DEP_Path.join(__dirname, '..', 'logs')),
				m_clW3VoicesManager = new CST_DEP_W3VoicesManager(),
				m_clMIASocket = new CST_DEP_MIASocket();
				
		// methodes
			
			// public
				
				this.start = function (p_fCallback) {

					try {
						
						m_clMIASocket.start(1338, p_fCallback);
						
						m_clMIASocket.emit('test');
						
						m_clMIASocket.on('test_ok', function () {
							m_clLog.success('ca marche !');
						});
						
						console.log(m_clW3VoicesManager.playRandomCharacter('ready'));

						setInterval(function() {
							
							m_clMIASocket.emit('temperature', 24.2);
							
						}, 5000);
						
					}
					catch (e) {
						m_clLog.err(e);
					}
					
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
					
				};
				
	};
	