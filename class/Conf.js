
// dépendances
	
	var
		fs = require('fs'),
		q = require('q');
		
// module
	
	module.exports = function () {
		
		// attributes
			
			var
				m_clThis = this,
				m_sConfFile = require('path').join(__dirname, '..', 'conf.json'),
				m_stConf = JSON.parse(fs.readFileSync(m_sConfFile), 'utf8');
				
		// methodes
			
			// public

				this.getConf = function () {
					return m_stConf;
				};
				
				this.setConfOption = function (p_sKey, p_vValue) {
					m_stConf[p_sKey] = p_vValue;
					return m_clThis;
				};
				
				this.save = function() {

					var deferred = q.defer();

						try {

							fs.writeFile(m_sConfFile, JSON.stringify(m_stConf), 'utf8', function (e) {

								if (e) {
									deferred.reject((e.message) ? e.message : e);
								}
								else {
									deferred.resolve();
								}

							});

						}
						catch (e) {
							deferred.reject((e.message) ? e.message : e);
						}
						
					return deferred.promise;

				}

	};
	