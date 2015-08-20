
// dépendances
	
	var
		CST_DEP_Path = require('path'),
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

			// protected

				function _runW3(socket) {

					socket.on('w3', function(data) {

						if (data.action) {

							switch (data.action) {

								// races

									case 'get_races' :

										socket.emit('w3', {
											action : 'get_musics',
											musics : m_clW3VoicesManager.getRaces()
										});

									break;

								// musics

									case 'get_musics' :

										if (!data.race) {

											socket.emit('w3', {
												error : 'race missing'
											});

										}
										else {

											socket.emit('w3', {
												action : 'get_musics',
												musics : m_clW3VoicesManager.getMusics(data.race)
											});

										}

									break;

									case 'play_music' :

										if (!data.race) {

											socket.emit('w3', {
												error : 'race missing'
											});

										}
										else if (!data.music) {

											socket.emit('w3', {
												error : 'music missing'
											});

										}
										else {

											m_clW3VoicesManager.playMusic(data.race, data.music);

										}

									break;

							}

						}

					});

				}

				function _runTemperature(socket) {

					setInterval(function() {
						socket.emit('temperature', 24.2);
					}, 5000);

				}
			
			// public
				
				this.start = function (p_fCallback) {

					try {

						m_clMIASocket.start(1338, function () {

							m_clW3VoicesManager.playRandomAction('ready');

						}, function (socket) {

							_runW3(socket);
							_runTemperature(socket);

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
				
	};
	