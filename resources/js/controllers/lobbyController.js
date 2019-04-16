class LobbyController {

    create(message) {
        // response: id of room
        $(".choose-action-set").hide();
        $(".lobby-set").show();
    }

    list(message) {
        // {success: true, type: "lobby.list", "response": [{id, name}]}

        // {type: "shop.open"}
        $(".choose-action-set").hide()
        $(".lobbies-list-set").show();
    }

    start(message) {

        $(".lobby-panel").hide()
        $(".game-panel").show();

    }

}

