const state = {
    MAIN_MENU: 0,
    LOBBY_HOST: 1,
    LOBBY_LIST: 2,
    LOBBY_JOINED: 3
};

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

$(document).ready(() => {

    $('#login-button').on('click', () => {

        let inputUsername = $('input.username').val();
        if (inputUsername.trim() == '' || inputUsername.trim().length > 24) {
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

    $('#back-from-lobbies-list').on('click', () => {
        $(".lobbies-list-set").hide();
        $(".choose-action-set").show();
        app.setState(state.MAIN_MENU)
    });

    $('#back-from-lobby').on('click', function() {
        app.client.send('lobby', 'leave', {id: $(this).attr('data-id')});
        app.setState(state.MAIN_MENU);
    })

    $(document).on('click', '#ready-button', function () {
        app.client.send('lobby', 'ready', {id: $('#back-from-lobby').attr('data-id')});
    })
});

//TODO Запилить обновление списка лобби