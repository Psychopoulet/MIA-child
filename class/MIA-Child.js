
// dépendances
	
	var
		path = require('path'),
		fs = require('fs'),
		q = require('q'),

		Factory = require(path.join(__dirname, 'Factory.js')),
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

								Factory.getPluginsInstance().getData()
									.then(function(p_tabData) {

										p_tabData.forEach(function(p_stPlugin) {

											try {
												require(p_stPlugin.main)(Factory);
												m_clLog.success('-- [plugin] ' + p_stPlugin.name + ' loaded');
											}
											catch (e) {
												m_clLog.err((e.message) ? e.message : e);
											}

										});

									})
									.catch(deferred.reject);
											

							// start
								
								Factory.getMIASocketInstance().start(Factory.getConfInstance().getConf().miaip, Factory.getConfInstance().getConf().miaport)
									.then(deferred.resolve)
									.catch(deferred.reject);
									
						}
						catch (e) {
							deferred.reject((e.message) ? e.message : e);
						}
						
					return deferred.promise;

				};
				
				this.stop = function () {
					return Factory.getMIASocketInstance().stop();
				};
				
				this.getVersion = function () {
					return '0.0.1'
				};

	};
	