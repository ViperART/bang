const app = {
    client: new Client('localhost', 8080),
    controllers: {
        lobby: new LobbyController()
    }
}

$(document).ready(function() {

    $('button.login').on('click', e => {

        let inputUsername = $('input.username').val();
    
        app.client.connect(inputUsername).then(() => {
            $('fieldset.login-set').toggleClass('hidden');
            $('fieldset.choose-action-set').toggleClass('hidden');
            console.log("Соединение установлено.");
        }).catch((error) => {
            console.log('Poshel nahui', error)
        });
    
        // e.preventDefault();
    });

    $('button.create-lobby').on('click', () => {

        app.client.send('lobby', 'create', []);
    
    });

});