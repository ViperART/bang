const app = {
    client: new Client('localhost', 8080),
    controllers: {
        lobby: new LobbyController()
    }
}

$(document).ready(() => {

    $('#login-button').on('click', () => {

        let inputUsername = $('input.username').val();

        app.client.connect(inputUsername).then(() => {
            $('.login-set').hide();
            $('.choose-action-set').show();
            console.log("Соединение установлено.");
        }).catch((error) => {
            console.log('Poshel nahui', error)
        });
    });

    $('#create-lobby-button').on('click', () => {
        app.client.send('lobby', 'create', []);
    });

    $('#show-lobbies-button').on('click', () => {
        app.client.send('lobby', 'list', []);
    });


    $(document).on('click', '.join-lobby', function (e) {
        app.client.send('lobby', 'join', {id: $(this).data('id')});
    })

});