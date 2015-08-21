
// dépendances
	
// module
	
	module.exports = function (p_clSocket, p_clW3VoicesManager) {

		p_clSocket.on('w3', function(data) {

			if (data.action) {

				switch (data.action) {

					// races

						case 'get_races' :

							p_clSocket.emit('w3', {
								action : 'get_musics',
								musics : p_clW3VoicesManager.getRaces()
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
									action : 'get_musics',
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

								p_clW3VoicesManager.playMusic(data.race, data.music);

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
									action : 'get_warnings',
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

								p_clW3VoicesManager.playWarning(data.race, data.warning);

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
									action : 'get_characters',
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
										action : 'get_actions',
										actions : p_clW3VoicesManager.getActions(data.race, data.character)
									});

								}

							break;

							case 'play_action_from_random_character' :

								if (!data.action) {

									p_clSocket.emit('w3', {
										error : 'action missing'
									});

								}
								else {

									p_clW3VoicesManager.playActionFromRandomCharacter(data.action);

								}

							break;

							// action codes

								case 'get_action_codes' :

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
											action : 'get_action_codes',
											action_codes : p_clW3VoicesManager.getActionCodes(data.race, data.character, data.action)
										});

									}

								break;

								case 'play_action_code' :

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
									else if (!data.code) {

										p_clSocket.emit('w3', {
											error : 'code missing'
										});

									}
									else {

										p_clW3VoicesManager.playActionCode(data.race, data.character, data.action, data.code);

									}

								break;

								case 'play_randomed_action_code' :

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

										p_clW3VoicesManager.playRandomedActionCode(data.race, data.character, data.action);

									}

								break;

				}

			}

		});

	};
