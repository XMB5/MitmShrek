const http = require('http');
const {readFileRes} = require('./utils');

class Shreker {

    constructor() {
        this.server = http.createServer((req, res) => {
            if (req.url === '/shrek.jpg') {
                readFileRes('site/shrek.jpg', 'image/jpeg', res);
            } else if (req.url === '/shrek.mp3') {
                readFileRes('site/shrek.mp3', 'audio/mpeg', res);
            } else if (req.url === '/favicon.ico') {
                readFileRes('site/shrek-favicon.jpg', 'image/jpeg', res);
            } else if (req.url === '/sweetalert.min.js') {
                readFileRes('site/sweetalert.min.js', 'text/javascript', res);
            } else {
                readFileRes('site/shrek.html', 'text/html', res);
            }
        });
    }

    start() {
        this.server.listen(80);
    }

}

module.exports = Shreker;