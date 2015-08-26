
// dépendances
	
	var
		CST_DEP_W3VoicesManager = require('W3VoicesManager');
		
// module
	
	module.exports = function (p_clSocket) {
		
		// attributes
			
			var
				m_clW3VoicesManager = new CST_DEP_W3VoicesManager(),
				m_clMIASocket = new CST_DEP_MIASocket();
				
		// constructor
			
			p_clSocket.on('w3', function(data) {

				var sRace, sCharacter, sAction, sActionCode;

				if (data.order) {

					switch (data.order) {

						// races

							case 'get_races' :

								p_clSocket.emit('w3', {
									order : 'get_races',
									races : m_clW3VoicesManager.getRaces()
								});

							break;

						// musics

							case 'get_musics' :

								if (!data.race) {

									p_clSocket.emit('w3', {
										error : 'race missing'
									});

								}
								else {

									p_clSocket.emit('w3', {
										order : 'get_musics',
										musics : m_clW3VoicesManager.getMusics(data.race)
									});

								}

							break;

							case 'play_music' :

								if (!data.race) {

									p_clSocket.emit('w3', {
										error : 'race missing'
									});

								}
								else if (!data.music) {

									p_clSocket.emit('w3', {
										error : 'music missing'
									});

								}
								else {

									sRace = ('random' === data.race) ? m_clW3VoicesManager.getRandomRace() : data.race;

									m_clW3VoicesManager.playMusic(sRace, data.music)
										.then(function (e) {

											p_clSocket.emit('w3', {
												order : 'played_music',
												race : sRace,
												music : data.music
											});

										})
										.catch(function (e) {

											p_clSocket.emit('w3', {
												error : e
											});

										});

								}

							break;

						// warnings

							case 'get_warnings' :

								if (!data.race) {

									p_clSocket.emit('w3', {
										error : 'race missing'
									});

								}
								else {

									p_clSocket.emit('w3', {
										order : 'get_warnings',
										warnings : m_clW3VoicesManager.getWarnings(data.race)
									});

								}

							break;

							case 'play_warning' :

								if (!data.race) {

									p_clSocket.emit('w3', {
										error : 'race missing'
									});

								}
								else if (!data.warning) {

									p_clSocket.emit('w3', {
										error : 'warning missing'
									});

								}
								else {

									sRace = ('random' === data.race) ? m_clW3VoicesManager.getRandomRace() : data.race;

									m_clW3VoicesManager.playWarning(sRace, data.warning)
										.then(function (e) {

											p_clSocket.emit('w3', {
												order : 'played_warning',
												race : sRace,
												warning : data.warning
											});

										})
										.catch(function (e) {

											p_clSocket.emit('w3', {
												error : e
											});

										});

								}

							break;

						// characters

							case 'get_characters' :

								if (!data.race) {

									p_clSocket.emit('w3', {
										error : 'race missing'
									});

								}
								else {

									p_clSocket.emit('w3', {
										order : 'get_characters',
										characters : m_clW3VoicesManager.getCharacters(data.race)
									});

								}

							break;

							// actions

								case 'get_actions' :

									if (!data.race) {

										p_clSocket.emit('w3', {
											error : 'race missing'
										});

									}
									else if (!data.character) {

										p_clSocket.emit('w3', {
											error : 'character missing'
										});

									}
									else {

										p_clSocket.emit('w3', {
											order : 'get_actions',
											actions : m_clW3VoicesManager.getActions(data.race, data.character)
										});

									}

								break;

								// action codes

									case 'get_actioncodes' :

										if (!data.race) {

											p_clSocket.emit('w3', {
												error : 'race missing'
											});

										}
										else if (!data.character) {

											p_clSocket.emit('w3', {
												error : 'character missing'
											});

										}
										else if (!data.action) {

											p_clSocket.emit('w3', {
												error : 'action missing'
											});

										}
										else {

											p_clSocket.emit('w3', {
												order : 'get_actioncodes',
												action_codes : m_clW3VoicesManager.getActionCodes(data.race, data.character, data.action)
											});

										}

									break;

									case 'play_actioncode' :

										if (!data.race) {

											p_clSocket.emit('w3', {
												error : 'race missing'
											});

										}
										else if (!data.character) {

											p_clSocket.emit('w3', {
												error : 'character missing'
											});

										}
										else if (!data.action) {

											p_clSocket.emit('w3', {
												error : 'action missing'
											});

										}
										else if (!data.actioncode) {

											p_clSocket.emit('w3', {
												error : 'actioncode missing'
											});

										}
										else {

											sRace = ('random' === data.race) ? m_clW3VoicesManager.getRandomRace() : data.race;
											sCharacter = ('random' === data.character) ? m_clW3VoicesManager.getRandomCharacter(sRace) : data.character;
											sAction = ('random' === data.action) ? m_clW3VoicesManager.getRandomAction(sRace, sCharacter) : data.action;
											sActionCode = ('random' === data.actioncode) ? m_clW3VoicesManager.getRandomActionCode(sRace, sCharacter, sAction) : data.actioncode;

											m_clW3VoicesManager.playActionCode(sRace, sCharacter, sAction, sActionCode)
												.then(function () {

													p_clSocket.emit('w3', {
														order : 'played_actioncode',
														race : sRace,
														character : sCharacter,
														action : sAction,
														actioncode : sActionCode
													});

												})
												.catch(function (e) {

													p_clSocket.emit('w3', {
														error : e
													});

												});

										}

									break;

					}

				}

		});

	};
