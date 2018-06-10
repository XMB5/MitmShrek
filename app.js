const findHosts = require('./netscan');
const utils = require('./utils');
const Shreker = require('./shreker');

async function main() {

    let shreker = new Shreker();
    shreker.start();

    return 0;

    let networkInfo = await utils.getNetworkInfo();

    console.log('network info: ' + JSON.stringify(networkInfo));

    findHosts(networkInfo.cidr_block).then(hosts => {
        console.log(hosts);
    });

}

main();

require('readline').createInterface(process.stdin, process.stdout).on('line', line => {
    console.log('quitting from read line');
    process.exit(0);
});