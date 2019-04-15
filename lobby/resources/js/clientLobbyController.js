$('button.show-lobbies').on('click', e => {

    ws.send('lobby.list');

    $('fieldset.choose-action-set').toggleClass('hidden');
    $('fieldset.lobbies-list-set').toggleClass('hidden');

    e.preventDefault();
});

$('button.join-lobby').on('click', e => {

    ws.send('lobby.join');

    $('fieldset.lobbies-list-set').toggleClass('hidden');
    $('fieldset.lobby-set').toggleClass('hidden');

    e.preventDefault();
});

$('button.start-game').on('click', e => {

    ws.send('game.start');

    e.preventDefault();
    location.href = './game/game.html';
});