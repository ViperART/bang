class LobbyController {

    create(message) {
        // TODO: get id from message.response and set it on "back" button
        this._renderClientsList(message.response.clients);
        $(".choose-action-set").hide();
        $(".lobby-set").show();
        $("#back-from-lobby").attr("data-id", message.response.id);
    }

    list(message) {
        let insert = '';
        message.response.forEach(element => {
            insert += `<li>${element.host} |<button data-id=${element.id} class="join-lobby">Войти</button></li>`
        });
        
        $("#lobbies-list").html(insert);
        $(".choose-action-set").hide();
        $(".lobbies-list-set").show();
    }

    join(message) {
        $(".lobbies-list-set").hide();
        $(".lobby-set").show();
    }

    leave(message) {
        $(".lobby-set").hide();
        $(".choose-action-set").show();
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
            insert += `<li class="lobby-player">${isHost}${element.nickname}</li>`
        });

        $("#players-list").html(insert);
    }
}
