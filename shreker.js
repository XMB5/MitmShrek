const http = require('http');
const {readFileRes} = require('./utils');

class Shreker {

    constructor() {
        this.server = http.createServer((req, res) => {
            if (req.url === '/shrek.jpg') {
                readFileRes(__dirname + '/site/shrek.jpg', 'image/jpeg', res);

            } else if (req.url === '/shrek.mp3') {
                readFileRes(__dirname + '/site/shrek.mp3', 'audio/mpeg', res);

            } else if (req.url === '/shrek-favicon.ico') {
                readFileRes(__dirname + '/site/shrek-favicon.jpg', 'image/jpeg', res);

            } else if (req.url === '/sweetalert.min.js') {
                readFileRes(__dirname + '/site/sweetalert.min.js', 'text/javascript', res);

            } else if (req.url === '/favicon.ico') {
                res.writeHead(404);
                res.end();

            } else {
                readFileRes(__dirname + '/site/shrek.html', 'text/html', res);
            }
        });
    }

    start() {
        this.server.listen(80);
    }

}

module.exports = Shreker;