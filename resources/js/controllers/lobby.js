class LobbyController {

    create(message) {
        let insert = '';
        message.response.forEach(element => {
            // TODO: mark host with color or icon
            insert += `<li class="lobby-player">${element.nickname}</li>`
        })
        
        $("#players-list").html(insert);
        $(".choose-action-set").hide();
        $(".lobby-set").show();
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
        // response -> list of lobby players
        let insert = '';
        message.response.forEach(element => {
            // TODO: mark host with color or icon
            insert += `<li class="lobby-player">${element.nickname}</li>`
        })
        
        $("#players-list").html(insert);
        $(".lobbies-list-set").hide();
        $(".lobby-set").show();
    }
}
