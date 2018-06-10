const http = require('http');

class Shreker {

    start() {

        let server = http.createServer((req, res) => {
            if (req.url.equals('shrek.'))
        });

    }

}

module.exports = Shreker;