
// dépendances
	
	var
		path = require('path'),
		fs = require('fs'),
		q = require('q'),

		Container = require(path.join(__dirname, 'Container.js')),
		Logs = require(path.join(__dirname, 'Logs.js'));
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var m_clLog = new Logs(path.join(__dirname, '..', 'logs'));
				
		// methodes
			
			// public
				
				this.start = function () {

					var
						deferred = q.defer(),
						sPluginsPath = path.join(__dirname, '..', 'plugins');

						try {

							// plugins

								Container.get('plugins').getData()
									.then(function(p_tabData) {

										p_tabData.forEach(function(p_stPlugin) {

											try {
												require(p_stPlugin.main)(Container);
												m_clLog.success('-- [plugin] ' + p_stPlugin.name + ' loaded');
											}
											catch (e) {
												m_clLog.err((e.message) ? e.message : e);
											}

										});

									})
									.catch(deferred.reject);
											

							// start
								
								Container.get('server.socket.mia').start()
									.then(deferred.resolve)
									.catch(deferred.reject);
									
						}
						catch (e) {
							deferred.reject((e.message) ? e.message : e);
						}
						
					return deferred.promise;

				};
				
				this.stop = function () {
					return Container.get('server.socket.mia').stop();
				};
				
	};
	