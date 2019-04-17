class Client {
    constructor(host, port) {

        this.HOST = host;
        this.PORT = port;

        this.ws = null;
    }

    connect(username) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.ws = new WebSocket(`ws://${self.HOST}:${self.PORT}?username=${username}`);

            self.ws.onmessage = function (message) {
                self.handleMessage(message);
            }

            self.ws.onclose = (event) => {
                self.handleClose(event);
            }
    
            self.ws.onopen = () => {
                resolve();
            }

            self.ws.onerror = (error) => {
                reject(error);
            }
        })
    }

    send(controller, method, params) {
        let type = controller + '.' + method;
        let payload = {
            type,
            params
        };

        this.ws.send(JSON.stringify(payload));
    }

    handleMessage(message) {
        message = JSON.parse(message.data);
        if (!message.success) {
            console.log('[Client] ERROR MESSAGE FROM SERVER: ' + message.error)
        } else {
            let type = message.type.split('.');
            
            let controller = app.controllers[type[0]];
            let method = controller[type[1]];
            
            if (controller && method) {
                app.controllers[type[0]][type[1]](message);
            }
        }
    }

    handleClose(event) {
        console.log('[Client] CLOSED: ', event)
    }
}