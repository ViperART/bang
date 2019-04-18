class LobbyController {

    create(message) {
        this._renderClientsList(message.response.clients);
        $(".choose-action-set").hide();
        $(".lobby-set").show();
        $("#back-from-lobby").attr("data-id", message.response.id);
        this._renderActionButton();
    }

    list(message) {
        let insert = '';
        message.response.forEach(element => {
            insert += `<li>${element.host} (${element.clientsCount}/7) |<button data-id=${element.id} class="join-lobby">Войти</button></li>`
        });
        
        $("#lobbies-list").html(insert);
        $(".choose-action-set").hide();
        $(".lobbies-list-set").show();
    }

    join(message) {
        $(".lobbies-list-set").hide();
        $(".lobby-set").show();
        $("#back-from-lobby").attr("data-id", message.response.id);
        this._renderActionButton();
    }

    leave(message) {
        $(".lobby-set").hide();
        $(".choose-action-set").show();
        $(".action-button").remove();
    }

    ready(message) {
        if ($("#ready-button").text().trim() === 'Готов') {
            $("#ready-button").text('Не готов')
        } else {
            $("#ready-button").text('Готов')
        }
    }

    onClientReady(message) {
        this._renderClientsList(message.response);
    }

    onClientLeft(message) {
        this._renderClientsList(message.response);
    }

    onClientJoin(message) {
        this._renderClientsList(message.response);
    }

    _renderClientsList(clients) {
        let insert = '';
        clients.forEach(element => {
            let isHost = element.isHost ? '(HOST) ': '';
            let isReady = element.isReady ? '✓' : '';
            insert += `<li class="lobby-player">${isHost}${element.nickname} ${isReady}</li>`
        });

        $("#players-list").html(insert);
    }

    _renderActionButton() {
        if (app.isInLobbyAsHost()) {
            $(`<button 
                class="action-button" 
                id="start-game-button">
                Начать игру</button>`).insertAfter('#players-list');
        }

        if (app.isInLobbyAsJoinedPlayer()) {
            $(`<button 
                class="action-button" 
                id="ready-button">
                Готов</button>`).insertAfter('#players-list');
        }
    }
}
