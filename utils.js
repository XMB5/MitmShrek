const network = require('network');
const {promisify} = require('util');
const fs = require('fs');
const childProcess = require('child_process');

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

function simpleExec (command, args) {
    let addToTable = childProcess.spawn(command, args);

    addToTable.stdout.pipe(process.stdout);
    addToTable.stderr.pipe(process.stderr);

    return new Promise((resolve, reject) => {
        addToTable.on('error', err => {
            console.error('error running ' + command + ' ' + args, err);
            process.exit(7);
        });
        addToTable.on('exit', (status, signal) => {
            if (status === 0) {
                resolve();
            } else {
                let err = new Error('process ended with status code ' + status + ' from signal ' + signal);
                err.status = status;
                err.signal = signal;
                reject(err);
            }
        })
    });
}

module.exports = {
    getNetworkInfo,
    readFileRes,
    simpleExec
};