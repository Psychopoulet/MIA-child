
// dépendances
	
	var path = require('path');
		
// attributes

	var
		m_clConfInstance = false,
		m_clPluginsInstance = false,
		m_clMIASocketInstance = false;

// module
	
	module.exports = {

		get : function(p_sInstanceName) {

			switch(p_sInstanceName) {

				case 'conf':

					if (!m_clConfInstance) {
						var Conf = require(path.join(__dirname, 'Conf.js'));
						m_clConfInstance = new Conf();
					}

					return m_clConfInstance;

				break;

				case 'plugins':

					if (!m_clPluginsInstance) {
						var Plugins = require(path.join(__dirname, 'Plugins.js'));
						m_clPluginsInstance = new Plugins();
					}

					return m_clPluginsInstance;

				break;

				case 'server.socket.mia':

					if (!m_clMIASocketInstance) {
						var MIASocket = require(path.join(__dirname, 'MIASocket.js'));
						m_clMIASocketInstance = new MIASocket();
					}

					return m_clMIASocketInstance;

				break;

				// errors

				case '':
					throw "Container : empty module";
				break;
				default:
					throw "Container : unknown module '" + p_sInstanceName + "'";
				break;
				
			}

		}
	
	};
	