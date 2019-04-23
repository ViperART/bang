const state = {
    MAIN_MENU: 0,
    LOBBY_HOST: 1,
    LOBBY_LIST: 2,
    LOBBY_JOINED: 3
};

const cardMarkup = `
<div class="local-player-card-wrap ui-draggable ui-draggable-handle" style="position: relative;">
    <img class="local-player-card" src="./resources/images/cards/full/dynamite_full.png" alt="">
</div>
`;

const app = {
    client: new Client('localhost', 8080),
    controllers: {
        lobby: new LobbyController()
    },
    currentState: state.MAIN_MENU,

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
};

$(document).ready(function () {

    $('#login-button').on('click', () => {

        let inputUsername = $('input.username').val();
        if (inputUsername.trim() === '' || inputUsername.trim().length > 24) {
            $.notify('Никнейм больше 24 символов или пуст', 'error');
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


    $(document).on('click', '.join-lobby', function() {
        app.client.send('lobby', 'join', {id: $(this).data('id')});
        app.setState(state.LOBBY_JOINED);
    });

    $(document).on('click', '#ready-button', function () {
        app.client.send('lobby', 'ready', {id: $('#back-from-lobby').attr('data-id')});
    });

    $(document).on('click', '#start-game-button', function () {
        app.client.send('lobby', 'gameStart', {id: $('#back-from-lobby').attr('data-id')})
    });

    $('#back-from-lobbies-list').on('click', () => {
        $(".lobbies-list-set").hide();
        $(".choose-action-set").show();
        app.setState(state.MAIN_MENU)
    });

    $('#back-from-lobby').on('click', function() {
        app.client.send('lobby', 'leave', {id: $(this).attr('data-id')});
        app.setState(state.MAIN_MENU);
    });

    $('.card-from-shop').on('click', function () {
       $(this).remove();
       $('#local-player-hand').append(cardMarkup);
    });

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

    $('.local-player-card-wrap').draggable({
        start: function(event, ui) {
            ui.helper.data('thrown', false);
            $(this).css({
                transition: ''
            })
        },

        stop: function (event, ui) {
            if (ui.helper.data('thrown')) {
                $(this).remove();
                $('#action-interface').css({display: 'block'})
            } else {
                $(this).css({
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

        }
    });
});

//TODO Запилить обновление списка лобби