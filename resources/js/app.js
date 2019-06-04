const state = {
    MAIN_MENU: 0,
    LOBBY_HOST: 1,
    LOBBY_LIST: 2,
    LOBBY_JOINED: 3
};

// TODO: блокировать кнопку окончания хода (или затемнять), если твой id != game.currentPlayer

const app = {
    client: new Client('localhost', 8080),
    controllers: {
        lobby: new LobbyController(),
        game: new GameController()
    },
    gameState: null,
    currentState: state.MAIN_MENU,
    playerChooserCallback: null,

    isReceiverRequired(cardName) {
        let cardsRequireReceiver = ['Бах!', 'Тюрьма', 'Дуэль', 'Паника!', 'Плутовка Кэт'];

        for (let i = 0; i < cardsRequireReceiver.length; i++) {
            if (cardsRequireReceiver[i] === cardName) {
                return true;
            }
        }

        return false;
    },

    showPlayerChoose(callback) {
        app.playerChooserCallback = callback;
        // TODO: hide players (based on app.gameState) by distance checker from server (just copy paste server code to client code)
        $("#player_chooser").show();
    },

    setState: (state) => {
        app.currentState = state;
    },

    getState: () => {
        return app.currentState;
    },

    isInMainMenu: () => {
        return app.currentState === state.MAIN_MENU;
    },

    isInLobbyAsHost: () => {
        return app.currentState === state.LOBBY_HOST;
    },

    isInLobbyAsJoinedPlayer: () => {
        return app.currentState === state.LOBBY_JOINED;
    },

    isInLobbyList: () => {
        return app.currentState === state.LOBBY_LIST;
    },

    showCardTakeTable: (receiverId, cardIndex) => {
        let targetPlayer = null;
        let localPlayer = null;

        app.gameState.players.forEach((player) => {
            if (player.id === receiverId) {
                targetPlayer = player;
            }
        });

        app.gameState.players.forEach((player) => {
            if (player.cards) {
                localPlayer = player;
            }
        });

        app.controllers.game.renderer._renderCardsSelection(
            receiverId,
            cardIndex,
            localPlayer.cards[cardIndex],
            targetPlayer.cardsCount,
            targetPlayer.weapon,
            targetPlayer.buffs
        );
    },

    makeDraggable() {
        $('.local-player-card-wrap').draggable({
            start: function (event, ui) {
                ui.helper.data('thrown', false);
                ui.helper.data('discard', false);
                $(this).css({
                    transition: ''
                })
            },

            stop: function (event, ui) {
                if (ui.helper.data('thrown')) {
                    let cardName = $(this).attr('data-name');
                    let cardIndex = $(this).attr('data-index');
                    if (app.isReceiverRequired(cardName) && app.gameState.state === null) {

                        app.showPlayerChoose((receiverId) => {
                            if (cardName === 'Плутовка Кэт' || cardName === 'Паника!') {
                                // set app.inWithdrawState = true
                                if (cardName === 'Паника!' && app.gameState.defenseDistances[receiverId] !== 1) {
                                    $.notify("Вы не достаете до этого игрока.", "error");
                                } else {
                                    app.showCardTakeTable(receiverId, cardIndex);
                                    this.remove();
                                }
                            } else {
                                app.client.send('game', 'throw', {
                                    gameId: $(".game-panel").attr('data-id'),
                                    cardIndex: cardIndex,
                                    receiverPlayerId: receiverId
                                });
                            }
                        });


                    } else {
                        app.client.send('game', 'throw', {
                            gameId: $(".game-panel").attr('data-id'),
                            cardIndex: cardIndex
                        });
                    }
                } else if (ui.helper.data('discard')) {
                    app.client.send('game', 'throwCardToDiscard', {
                        cardIndex: $(this).attr('data-index'),
                        gameId: $(".game-panel").attr('data-id')
                    });
                }

                $('.local-player-card-wrap').css({
                    transition: 'all 0.2s linear',
                    left: 0,
                    top: 0
                });

                setTimeout(function () {
                    $('.local-player-card-wrap').css({
                        transition: ''
                    })
                }, 400)

            }
        });
    }
};

$(document).ready(function () {

    // DEBUG ONLY
    $('input.username').val('rand' + (Math.floor(Math.random() * 10000)));

    setTimeout(() => $("#login-button").click(), 500);

    $('#login-button').on('click', () => {

        let inputUsername = $('input.username').val();
        if (inputUsername.trim() === '' || inputUsername.trim().length > 16) {
            $.notify('Введите имя от 1 до 16 символов', 'error');
            return;
        }

        app.client.connect(inputUsername).then(() => {
            $('.login-set').hide();
            $('.choose-action-set').show();
        }).catch((error) => {
            console.log(error)
        });
    });

    $('#create-lobby-button').on('click', () => {
        app.client.send('lobby', 'create', []);
        app.setState(state.LOBBY_HOST);
    });

    $('#show-lobbies-button').on('click', () => {
        app.client.send('lobby', 'list', []);
        app.setState(state.LOBBY_LIST);
    });


    $(document).on('click', '.join-lobby', function () {
        app.client.send('lobby', 'join', {id: $(this).data('id')});
        app.setState(state.LOBBY_JOINED);
    });

    $(document).on('click', '#ready-button', function () {
        app.client.send('lobby', 'ready', {id: $('#back-from-lobby').attr('data-id')});
    });

    $(document).on('click', '#start-game-button', function () {
        app.client.send('lobby', 'gameStart', {id: $('#back-from-lobby').attr('data-id')});
    });

    $(document).on('click', '.player', function () {
        if (app.playerChooserCallback !== null) {
            app.playerChooserCallback($(this).attr('data-client-id'));
            app.playerChooserCallback = null;
            $("#player_chooser").hide();
        }
    });

    $('#back-from-lobbies-list').on('click', () => {
        $(".lobbies-list-set").hide();
        $(".choose-action-set").show();
        app.setState(state.MAIN_MENU)
    });

    $('#back-from-lobby').on('click', function () {
        app.client.send('lobby', 'leave', {id: $(this).attr('data-id')});
        app.setState(state.MAIN_MENU);
    });

    $('.card-from-shop').on('click', function () {
        $(this).remove();
        $('#local-player-hand').append(cardMarkup);
        app.makeDraggable();
    });

    $(document).on('click', '#reload', function () {
        app.client.send('lobby', 'list', []);
        app.setState(state.LOBBY_LIST);
    });

    $(document).on('click', '.end-turn-button-wrap', function () {
        app.client.send('game', 'turnEnd', {gameId: $(".game-panel").attr('data-id')});
        // $('#end-turn-button').attr('src', 'resources/images/misc/end_turn_inactive.png')
    });

    $(document).on('click', '#skip', function () {
        app.client.send('game', 'skip', {gameId: $(".game-panel").attr('data-id')});
    });

    $(document).on('click', '.card-aftermath', function () {
        if (app.gameState.state === null) {
            app.client.send('game', 'withdraw', {
                gameId: $(".game-panel").attr('data-id'),
                withdrawCardIndex: $(this).attr('data-index'),
                thrownCardIndex: $('#thrown-card').attr('data-index'),
                receiverPlayerId: $('#thrown-card').attr('data-receiver-id')
            });
            $('#action-interface').html('');
        } else if (app.gameState.state.type === 4) {
            // app.client.send('game', 'takeCardFromShop')
            app.client.send('game', 'takeCardFromShop', {
                gameId: $(".game-panel").attr('data-id'),
                withdrawCardIndex: $(this).attr('data-index')
            });

        }
    });

});