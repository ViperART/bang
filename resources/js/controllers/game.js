class GameController {

    constructor() {
        this.renderer = new GameRenderer();
    }

    onStart(message) {
        this.renderer.drawGameStart(message.response);
        app.gameState = message.response;
    }

    onChange(message) {
        this.renderer.drawGameChange(message.response);
        app.gameState = message.response;
    }

}
