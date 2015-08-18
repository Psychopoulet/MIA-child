
// dépendances
	
	var
		CST_DEP_Path = require('path'),
		CST_DEP_Log = require(CST_DEP_Path.join(__dirname, 'Log.js')),
		CST_DEP_W3VoicesManager = require('W3VoicesManager'),
		CST_DEP_MIASocket = require(CST_DEP_Path.join(__dirname, 'MIASocket.js'));
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var m_stSIKYUser,
				m_clLog = new CST_DEP_Log(CST_DEP_Path.join(__dirname, '..', 'logs')),
				m_clW3VoicesManager = new CST_DEP_W3VoicesManager(),
				m_clMIASocket = new CST_DEP_MIASocket();
				
		// methodes

			// protected

				function _runW3() {

					m_clMIASocket.on('w3', function(data) {

						if (data.action) {

							switch (data.action) {

								case 'play_music' :

									if (data.race && data.music) {
										m_clW3VoicesManager.playMusic(data.race, data.music);
									}

								break;

								case 'get_musics' :

									m_clMIASocket.emit('w3', {
										action : 'get_musics',
										musics : m_clW3VoicesManager.getMusics()
									});

								break;

							}

						}

					});

				}

				function _runTemperature() {

					setInterval(function() {
						m_clMIASocket.emit('temperature', 24.2);
					}, 5000);

				}
			
			// public
				
				this.start = function (p_fCallback) {

					try {

						m_clMIASocket.start(1338, function () {

							m_clW3VoicesManager.playRandomAction('ready', function() {
								
								_runW3();
								_runTemperature();

							});

						});

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
	