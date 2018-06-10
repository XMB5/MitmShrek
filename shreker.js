const http = require('http');
const {readFileRes} = require('./utils');

class Shreker {

    constructor() {
        this.server = http.createServer((req, res) => {
            if (req.url === '/shrek.jpg') {
                readFileRes('shrek.jpg', 'image/jpeg', res);
            } else if (req.url === '/shrek.mp3') {
                readFileRes('shrek.mp3', 'audio/mpeg', res);
            } else {
                readFileRes('shrek.html', 'text/html', res);
            }
        });
    }

    start() {
        this.server.listen(80);
    }

}

module.exports = Shreker;