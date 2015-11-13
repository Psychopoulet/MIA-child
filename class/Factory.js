
// dépendances
	
	var path = require('path');
		
// attributes

	var
		m_clConfInstance = false,
		m_clPluginsInstance = false,
		m_clMIASocketInstance = false;

// module
	
	module.exports = {

		getConfInstance : function () {

			if (!m_clConfInstance) {
				var Conf = require(path.join(__dirname, 'Conf.js'));
				m_clConfInstance = new Conf();
			}

			return m_clConfInstance;

		},

		getPluginsInstance : function () {

			if (!m_clPluginsInstance) {
				var Plugins = require(path.join(__dirname, 'Plugins.js'));
				m_clPluginsInstance = new Plugins();
			}

			return m_clPluginsInstance;

		},

		getMIASocketInstance : function () {

			if (!m_clMIASocketInstance) {
				var MIASocket = require(path.join(__dirname, 'MIASocket.js'));
				m_clMIASocketInstance = new MIASocket();
			}

			return m_clMIASocketInstance;

		}
	
	};
	