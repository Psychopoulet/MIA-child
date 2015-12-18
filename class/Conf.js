
// dépendances
	
	var
		fs = require('fs'),
		q = require('q');
		
// module
	
	module.exports = function () {
		
		"use strict";
		
		// attributes
			
			var
				that = this,
				m_sConfFile = require('path').join(__dirname, '..', 'conf.json'),
				m_stConf = { };
				
		// methodes
			
			// public

				this.get = function (p_sKey, p_vValue) {
					return (m_stConf[p_sKey]) ? m_stConf[p_sKey] : '';
				};

				this.set = function (p_sKey, p_vValue) {
					m_stConf[p_sKey] = p_vValue;
					return that;
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

		// constructor

			try {

				if (fs.lstatSync(m_sConfFile).isFile()) {
					m_stConf = JSON.parse(fs.readFileSync(m_sConfFile, 'utf8'));
				}

			}
			catch (e) { }

			m_stConf.miaip = (m_stConf.miaip) ? m_stConf.miaip : '127.0.0.1';
			m_stConf.miaport = (m_stConf.miaport) ? m_stConf.miaport : 1338;
			m_stConf.debug = false;

	};
	