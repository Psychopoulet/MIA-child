
"use strict";

// module
	
	module.exports = function (Container) {

		// attributes
			
			var that = this,
				m_tabOnConnection = [],
				m_tabOnDisconnect = [];

		// methodes
		
			// public
				
				this.start = function () {

					return new Promise(function(resolve, reject) {
					
						var sAddress = Container.get('conf').get('miaip') + ':' + Container.get('conf').get('miaport'), clSocketClient;

						try {

							if (Container.get('conf').get('ssl')) {
								require('https').globalAgent.options.rejectUnauthorized = false;
								sAddress = 'https://' + sAddress;
								clSocketClient = require('socket.io-client').connect(sAddress, { secure: true });
							}
							else {
								sAddress = 'http://' + sAddress;
								clSocketClient = require('socket.io-client').connect(sAddress);
							}

							clSocketClient.on('connect', function () {

								Container.get('logs').success('-- [MIA socket] connected');

								clSocketClient.on('disconnect', function () {

									Container.get('logs').info('-- [MIA socket] disconnected');

									m_tabOnDisconnect.forEach(function (fOnDisconnect) {
										fOnDisconnect(clSocketClient);
									});

								});

								m_tabOnConnection.forEach(function (fOnConnection) {
									fOnConnection(clSocketClient);
								});
								
							});

							Container.get('logs').success('-- [MIA socket] started on ' + sAddress);
							
							resolve();

						}
						catch (e) {
							reject((e.message) ? e.message : e);
						}

					});

				};
				
				this.stop = function () {

					return new Promise(function(resolve, reject) {

						try {
							resolve();
						}
						catch (e) {
							reject((e.message) ? e.message : e);
						}

					});

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
	