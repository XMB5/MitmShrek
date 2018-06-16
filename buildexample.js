const fs = require('fs');

const fileToMime = {
    jpg: 'image/jpeg',
    js: 'text/javascript',
    mp3: 'audio/mpeg'
};

let data = {};

for (let file of fs.readdirSync(__dirname + '/site')) {
    if (file !== 'example.html') {
        data[file] = fs.readFileSync(__dirname + '/site/' + file);
    }
}

let shrekHtml = data['shrek.html'].toString('utf8');
delete data['shrek.html'];

//remove image preloading
shrekHtml = shrekHtml.replace(/new Image ?\( ?\)\.src ?= ?['"].+?['"];/g, '//preloading removed for example');

for (let resource in data) {
    if (data.hasOwnProperty(resource)) {
        let fileExtension = resource.split('.').pop();
        let base64content = data[resource].toString('base64');
        //convert to data uri
        let uri = 'data:' + fileToMime[fileExtension] + ';base64,' + base64content;
        let regex = new RegExp('(https?:\\/\\/[\\S]+)?\\/' + resource.replace('.', '\\.'), 'g');
        shrekHtml = shrekHtml.replace(regex, uri);
    }
}

let out = fs.createWriteStream(__dirname + '/site/example.html');
out.end(shrekHtml);

out.on('close', () => {
    console.log('done');
});