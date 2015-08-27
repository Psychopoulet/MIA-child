
// dépendances
	
	var
		CST_DEP_Path = require('path'),
		CST_DEP_FileSystem = require('fs'),
		CST_DEP_Q = require('q'),
		CST_DEP_MIASocket = require(CST_DEP_Path.join(__dirname, 'MIASocket.js'));
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var
				m_clThis = this,
				m_sConfFile = CST_DEP_Path.join(__dirname, '..', 'conf.json'),
				m_clMIASocket = new CST_DEP_MIASocket();
				
		// methodes
			
			// protected

				function _saveConf(p_stConf) {

					var deferred = CST_DEP_Q.defer();

						try {

							CST_DEP_FileSystem.writeFile(m_sConfFile, JSON.stringify(p_stConf), 'utf8', function (err) {

								if (err) {
									if (err.message) {
										deferred.reject(err.message);
									}
									else {
										deferred.reject(err);
									}
								}
								else {
									deferred.resolve();
								}

							});

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

				}

			// public
				
				this.start = function () {

					var
						deferred = CST_DEP_Q.defer(),
						stConf = m_clThis.getConf(),
						sPluginsPath = CST_DEP_Path.join(__dirname, '..', 'plugins');

						try {

							CST_DEP_FileSystem.readdirSync(sPluginsPath).forEach(function (file) {
								require(CST_DEP_Path.join(sPluginsPath, file))(m_clMIASocket);
							});

							m_clMIASocket.onConnection(function (socket) {

								socket.on('token_get', function () {

									var sToken = m_clThis.getConf().token;

									if (sToken) {
										socket.emit('token_get', sToken);
									}
									else {
										socket.emit('token_empty');
									}

								});

								socket.on('token_set', function (token) {

									var stConf = m_clThis.getConf();

									stConf.token = token;

									_saveConf(stConf)
										.then(function () {
											socket.emit('token_get', token);
										})
										.catch(function (err) {
											socket.emit('token_error', err);
										});

								});

							});
							
							m_clMIASocket.start(stConf.miaip, stConf.miaport)
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

					return m_clMIASocket.stop()
							.then(deferred.resolve)
							.catch(deferred.reject);

				};
				
				this.getVersion = function () {
					return '0.0.1'
				};
				
				this.getConf = function () {
					return JSON.parse(CST_DEP_FileSystem.readFileSync(m_sConfFile), 'utf8');
				};
				
				this.setMIAIP = function (p_sIP) {

					var deferred = CST_DEP_Q.defer(), stConf;

						try {

							stConf = m_clThis.getConf();
							stConf.miaip = p_sIP;

							_saveConf(stConf)
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
				
				this.setMIAPort = function (p_nPort) {

					var deferred = CST_DEP_Q.defer(), stConf;

						try {

							stConf = m_clThis.getConf();
							stConf.miaport = p_nPort;

							_saveConf(stConf)
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
				
	};
	