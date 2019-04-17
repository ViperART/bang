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
    }
};
//TODO Добавить смену стейтов, (две функции, app.setState, app.getState, + если хочется то вспомогательные ещё isInMainMenu(), isInLobbyList())
// кнопка начать игру у хоста, а у игрока Готов / Не готов
// сделать зеленую галочку ready напротив игрока

// TODO next
// глобальные события всем клиентам сервера: 1. новое лобби, 2. лобби пропало
$(document).ready(() => {

    $('#login-button').on('click', () => {

        let inputUsername = $('input.username').val();

        app.client.connect(inputUsername).then(() => {
            $('.login-set').hide();
            $('.choose-action-set').show();
        }).catch((error) => {
            console.log(error)
        });
    });

    $('#create-lobby-button').on('click', () => {
        app.client.send('lobby', 'create', []);
    });

    $('#show-lobbies-button').on('click', () => {
        app.client.send('lobby', 'list', []);
    });


    $(document).on('click', '.join-lobby', function() {
        app.client.send('lobby', 'join', {id: $(this).data('id')});
    })

    $('#back-from-lobbies-list').on('click', () => {
        $(".lobbies-list-set").hide();
        $(".choose-action-set").show();
    })

    $('#back-from-lobby').on('click', function() {
        app.client.send('lobby', 'leave', {id: $(this).attr('data-id')});
    })

});