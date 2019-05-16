class GameRenderer {

    drawGameStart(game) {
        this._drawPlayers(game.players, game.currentPlayerId);
        this._renderPacks(game.cardsLeft, game.cardsUsed);
        this._addDroppable();
        app.makeDraggable();

        $(".game-panel").attr('data-id', game.gameId);
        $(".lobby-panel").hide();
        $(".game-panel").show();
    }

    drawGameChange(game) {
        this._drawPlayers(game.players, game.currentPlayerId);
        this._renderPacks(game.cardsLeft, game.cardsUsed);
        if (game.state !== null) {
            console.log('DRAWING TABLE WITH CARDS', game.state.cards);
            this._renderStateCards(game.state.cards);
            if (game.state.isEnd) {
                setTimeout(() =>  {
                    $("#action-interface").fadeOut(300, () => {
                        $("#action-interface").html('').show();
                    });
                }, 1000);
            }
        }

        app.makeDraggable();
    }

    _findLocalPlayer(players) {
        let localPlayer;

        for (let i in players) {
            if ([players.hasOwnProperty(i)]) {
                if (players[i].cards !== undefined) {
                    localPlayer = players[i];
                }
            }
        }

        return localPlayer;
    }

    _drawPlayers(players, currentPlayerId) {
        let localPlayer = this._findLocalPlayer(players);
        $("#players_list").html('');
        $("#local_player_hub").html('');
        for (let i in players) {
            if (players[i].cards !== undefined) {
                $("#local_player_hub").append(this._getPlayerTemplate(players[i], currentPlayerId, localPlayer, true));
            } else {
                $("#players_list").append(this._getPlayerTemplate(players[i], currentPlayerId, localPlayer, false));
            }
        }
    }

    _getPlayerTemplate(player, currentPlayerId, localPlayer, isLocalPlayer) {
        let currentPlayerClass = currentPlayerId === player.id ? 'player-active' : '';
        return `
            <div class="player ${isLocalPlayer ? 'local-player' : ''}" data-client-id="${player.id}">
                ${isLocalPlayer ? '<div class="local-player-role"><p>'+this._resolveRoleName(player.role)+'</p></div>' : ''}
                <div class="nickname"><p class="${player.color}">${player.nickname}</p></div>
                <div class="hp-bar" data-rendered-hp="${player.hp}">${this._renderHP(player.hp)}</div>
                <div class="portait-wrap">
                    <img 
                        class="portait ${currentPlayerClass}" 
                        src="${this.getHeroImagePath(player.hero.type, true)}"
                        onmouseover="this.src='${this.getHeroImagePath(player.hero.type, false)}'"
                        onmouseout="this.src='${this.getHeroImagePath(player.hero.type, true)}'"
                    >
                        
                    <div class="weapon-wrap">
                        <img 
                            class="weapon" 
                            data-weapon="${player.weapon.type}" 
                            src="${this.getCardImagePath(player.weapon.suit, player.weapon.rank, player.weapon.type, true)}"
                            onmouseover="this.src='${this.getCardImagePath(player.weapon.suit, player.weapon.rank, player.weapon.type, false)}'"
                            onmouseout="this.src='${this.getCardImagePath(player.weapon.suit, player.weapon.rank, player.weapon.type, true)}' "
                        >
                    </div>
                    <div class="card-counter-wrap"><div class="card-counter"><p>${player.cardsCount}</p></div></div>
                    <div class="range-tracker-wrap">
                        ${isLocalPlayer ? '' : '<div class="range-tracker"><p class="defense-range">' + localPlayer.defenseDistances[player.id] + '</p><p class="attack-range">' + localPlayer.attackDistances[player.id] + '</p></div>'}
                    </div>
                    ${player.isSheriff ? '<div class="badge-wrap"><img class="badge" src="./resources/images/roles/sheriff.png" alt="Шериф"></div>' : ''}
                </div>
                <div class="buff-list">${this._renderBuffs(player.buffs)}</div>
                <div class="speech-cloud" style="display: none"><p></p></div>
            </div>
                ${isLocalPlayer ? '<div id="local-player-hand">'+this._renderCards(player.cards)+'</div>' : ''}
                ${isLocalPlayer ? '<div class="take-damage-button-wrap"><img id="skip" class="take-damage-button" src="./resources/images/misc/take_damage.png" alt="">' : ''}
                ${isLocalPlayer ? '<div class="end-turn-button-wrap"><img class="end-turn-button" src="./resources/images/misc/end_turn.png" alt="">' : ''}
                
        `;
    }

    _resolveRoleName(roleId) {
        const roles = ['Шериф', 'Помощник шерифа', 'Ренегат', 'Бандит'];
        return roles[roleId];
    }

    getCardImagePath(suit, rank, type, isCropped, actionType = null) {
        let path = isCropped ? 'cropped': 'full';
        let isAction = type === 0 ? `-${actionType}` : '';
        return `./resources/images/cards/${path}/${type}-${suit}-${rank}${isAction}.png`;
    }

    getHeroImagePath(type, isCropped) {
        let path = isCropped ? 'cropped': 'full';
        return `./resources/images/heroes/${path}/${type}.png`;
    }

    _renderStateCards(cards) {
        $('#action-interface').html('');

        let html = '';

        cards.forEach((card, index) => {
            if (index === 0) {
                html +=
                    `
                    <div class="thrown-card-wrap">
                        <img id="thrown-card" src="${this.getCardImagePath(card.suit, card.rank, card.type, false, card.actionType)}" alt="">
                    </div>
                    `
            } else {
                html +=
                    `
                    <p id="divider">></p>
                    <div class="card-aftermath-wrap">
                        <img class="card-aftermath" src="${this.getCardImagePath(card.suit, card.rank, card.type, false, card.actionType)}" alt="">
                    </div>
                    `
            }
        });

        $('#action-interface').html(html);
    }


    _renderHP(hp) {
        let html = '';
        for (let i = 0; i < hp; ++i) {
            html += '<div class="hp"></div>';
        }

        return html;
    }

    _renderPacks(cardsLeft, cardsUsed) {
        $("#packs_hub").html('').append(
            `
            <div class="ingame-pack-wrap">
                <span>В ИГРЕ</span>
                <div class="ingame-pack">
                    <p>${cardsLeft}</p>
                </div>
            </div>
            <div class="out-of-game-pack-wrap">
                <span>ОТБОЙ</span>
                <div class="out-of-game-pack">
                    <p>${cardsUsed}</p>
                </div>
            </div>
            `
        )

    }

    _renderCards(cards) {
        return cards.map((card, index) => {
           return `<div class="local-player-card-wrap" data-name="${card.name}" data-index="${index}"><img class="local-player-card" src="${this.getCardImagePath(card.suit, card.rank, card.type, false, card.actionType)}"></div>`;
        }).join('');
    }

    _renderBuffs(buffs) {
        return buffs.map(card => {
            return `<div class="buff-wrap">
                        <img 
                            src="${this.getCardImagePath(card.suit, card.rank, card.type, true)}"
                            onmouseover="this.src='${this.getCardImagePath(card.suit, card.rank, card.type, false)}'"
                            onmouseout="this.src='${this.getCardImagePath(card.suit, card.rank, card.type, true)}' "
                            class="buff" alt="">
                    </div>`;
        }).join('');
    }

    _renderSpeechCloud(id, text) {
        let speechCloud = $(`.player[data-client-id*=${id}]`).children('.speech-cloud');
        text = text.replace(/@(.*?)\{(.*?)\}/, '<span class="$1">$2</span>');
        speechCloud.html(text);
        speechCloud.fadeIn(300);

        setTimeout(() => {
            speechCloud.fadeOut(300, () => {
                speechCloud.children('p').html('')
            });
        }, 2500);
    }

    _createTextForSpeechCloud(initiatorNickname, initiatorColor, receiverNickname, receiverColor, cardName) {
        let html = '';
        switch (cardName) {
            case 'Бах!':
                html = `<p>Получай пулю в лоб, <span class="${receiverColor}">${receiverNickname}</span>!</p>`;
                break;
            case 'Винчестер':
            case 'Ярость':
            case 'Ремингтон':
            case 'Скофилд':
            case 'Карабин':
                html = '<p>Пожалуй, возьму ствол посерьезнее.</p>';
                break;
            case 'Промах!':
                html = '<p>Ха, тебе бы прицел поправить! Мимо!</p>';
                break;
            case 'Мустанг':
                html = '<p>С моей новой лошадкой вам меня не достать!</p>';
                break;
            case 'Динамит':
                html = '<p>Пора сыграть во взрывоопасную игру, ребята.</p>';
                break;
            case 'Аппалуза':
                html = '<p>Теперь вам от меня не уйти, подонки!</p>';
                break;
            case 'Тюрьма':
                html = `<p>Отдохни-ка пока за решеткой, <span class="${receiverColor}">${receiverNickname}</span></p>`;
                break;
            case 'Бочка':
                html = '<p>Теперь вам меня не взять!</p>';
                break;
            case 'Дилижанс':
                html = '<p>Именно то, что было нужно!</p>';
                break;
            case 'Уэллс-Фарго':
                html = '<p>Да у меня тут настоящий джек-пот!</p>';
                break;
            case 'Гатлинг':
                html = '<p>Вот это я понимаю - ствол! Танцуйте, ребята!</p>';
                break;
            case 'Салун':
                html = '<p>Всем выпивки за мой счет!</p>';
                break;
            case 'Индейцы':
                html = '<p>Снова аборигены? Эти ребята так просто не отстанут.</p>';
                break;
            case 'Дуэль':
                html = `<p>Решим наши вопросы прямо здесь и сейчас, <span class="${receiverColor}">${receiverNickname}</span>!</p>`;
                break;
            case 'Паника!':
                html = `<p>У тебя есть то, что мне нужно, <span class="${receiverColor}">${receiverNickname}</span>!</p>`;
                break;
            case 'Плутовка Кэт':
                html = `<p>Эта красотка уже многих облапошила, <span class="${receiverColor}">${receiverNickname}</span>!</p>`;
                break;
            case 'Пиво':
                html = `<p>Что может быть лучше пива в столь жаркий день?</p>`;
                break;
            case 'Магазин':
                html = `<p>Подвоз нового товара? То, что нужно!</p>`;
                break;
            case 'Принять урон':
                html = `<p>Черт, больно же!</p>`;
                break;
        }

        return html;
    }

    _addDroppable() {
        $('.play-field').droppable({
            // accept: '.local-player-card-wrap',

            drop: function(event, ui)
            {
                ui.helper.data('thrown', true);
            },

            activate: function () {
                $('.play-field').css({
                    border: '#b5d7ff 1px solid',
                    borderRadius: '10px'
                })
            },

            deactivate: function() {
                $('.play-field').css({
                    border: '',
                    backgroundColor: ''
                })
            },

            over: function() {
                $('.play-field').css({
                    backgroundColor: "hsla(212, 100%, 85%, 0.27)"
                });
            },

            out: function() {
                $('.play-field').css("background-color", "");
            }

        });
    }




}




