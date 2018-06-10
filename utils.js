const network = require('network');
const {promisify} = require('util');
const fs = require('fs');

//netmask to cidr converter from https://stackoverflow.com/a/42991012
function countCharOccurences(string, char) {
    return string.split(char).length - 1;
}

function decimalToBinary(dec) {
    return (dec >>> 0).toString(2);
}

function getNetMaskParts(nmask) {
    return nmask.split('.').map(Number);
}

function netmask2CIDR(netmask) {
    return countCharOccurences(
        getNetMaskParts(netmask)
            .map(part => decimalToBinary(part))
            .join(''),
        '1'
    );
}

async function getNetworkInfo () {
    let networkInfo = await promisify(network.get_active_interface)();
    networkInfo.cidr_block = networkInfo.ip_address + '/' + netmask2CIDR(networkInfo.netmask);
    return networkInfo;
}

function readFileRes (filename, mimeType, res) {
    fs.readFile(filename, 'binary', (err, file) => {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.write(err + "\n");
            res.end();
            console.error('error reading ' + filename, err);
            return;
        }

        res.writeHead(200, {
            'Content-Type': mimeType,
            'Cache-Control': 'max-age=31556926'
        });
        res.write(file, 'binary');
        res.end();
    });
}

module.exports = {
    getNetworkInfo,
    readFileRes
};