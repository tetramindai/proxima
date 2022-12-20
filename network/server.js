const net = require('net');

const BLOCK_ERRORS = [456, 418];
const port = 1969;


class Bridge {
    constructor(name, socket) {
        this._name = name;
        this._socket = socket;
    }

    destroy() {
        this._socket.close();
    }
}

class Server {

    constructor() {

        this._bridges = [];

        this._server = net.createServer((socket) => {
            this.receive(socket)
        });
    }

    receive(socket) {

        const bridge = new Bridge();

        socket.write('Echo instance');
        socket.pipe(socket);

        socket.close();
    }

    start() {
        this._server.listen(port);
    }

    stop() {
        this._server.close();
    }


    requestProcessing(req, res, next) {

    }
}

const instance = new Server();

module.exports = instance;