const buttons = {
    login: document.querySelector('.login'),
    createLobby: document.querySelector('.create-lobby'),
    showLobbies: document.querySelector('.show-lobbies'),
    startGame: document.querySelector('.start-game')
}

const fieldSets = {
    loginSet: document.querySelector('.login-set'),
    chooseActionSet: document.querySelector('.choose-action-set'),
    lobbiesListSet: document.querySelector('.lobbies-list-set'),
    lobbySet: document.querySelector('.lobby-set')
} 

buttons.login.addEventListener('click', event => {
    event.preventDefault();
    fieldSets.loginSet.classList.toggle('hidden');
    fieldSets.chooseActionSet.classList.toggle('hidden');
    return false;
});

buttons.showLobbies.addEventListener('click', event => {
    event.preventDefault();
    fieldSets.chooseActionSet.classList.toggle('hidden');
    fieldSets.lobbiesListSet.classList.toggle('hidden');
    return false;
})

buttons.createLobby.addEventListener('click', event => {
    event.preventDefault();
    fieldSets.chooseActionSet.classList.toggle('hidden');
    fieldSets.lobbySet.classList.toggle('hidden');
    return false;
})

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('join-lobby')) {
        event.preventDefault();
        fieldSets.lobbiesListSet.classList.toggle('hidden');
        fieldSets.lobbySet.classList.toggle('hidden');
        return false;
    }
})

buttons.startGame.addEventListener('click', event => {
    event.preventDefault();
    location.href = "./game/game.html";
})