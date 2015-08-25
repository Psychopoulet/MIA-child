
// dépendances
	
// module
	
	module.exports = function (p_clSocket, p_clW3VoicesManager) {
		
		p_clSocket.on('w3', function(data) {

			var sRace, sCharacter, sAction, sActionCode;

			if (data.order) {

				switch (data.order) {

					// races

						case 'get_races' :

							p_clSocket.emit('w3', {
								order : 'get_races',
								races : p_clW3VoicesManager.getRaces()
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
									musics : p_clW3VoicesManager.getMusics(data.race)
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

								sRace = ('random' === data.race) ? p_clW3VoicesManager.getRandomRace() : data.race;
								p_clW3VoicesManager.playMusic(sRace, data.music);

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
									warnings : p_clW3VoicesManager.getWarnings(data.race)
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

								sRace = ('random' === data.race) ? p_clW3VoicesManager.getRandomRace() : data.race;
								p_clW3VoicesManager.playWarning(sRace, data.warning);

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
									characters : p_clW3VoicesManager.getCharacters(data.race)
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
										actions : p_clW3VoicesManager.getActions(data.race, data.character)
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
											action_codes : p_clW3VoicesManager.getActionCodes(data.race, data.character, data.action)
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

										sRace = ('random' === data.race) ? p_clW3VoicesManager.getRandomRace() : data.race;
										sCharacter = ('random' === data.character) ? p_clW3VoicesManager.getRandomCharacter(sRace) : data.character;
										sAction = ('random' === data.action) ? p_clW3VoicesManager.getRandomAction(sRace, sCharacter) : data.action;
										sActionCode = ('random' === data.actioncode) ? p_clW3VoicesManager.getRandomActionCode(sRace, sCharacter, sAction) : data.actioncode;

										p_clW3VoicesManager.playActionCode(sRace, sCharacter, sAction, sActionCode);

									}

								break;

				}

			}

		});

	};
