const findHosts = require('./netscan');
const utils = require('./utils');
const Shreker = require('./shreker');
const readline = require('readline');

async function list () {
    let networkInfo = await utils.getNetworkInfo();
    let hosts = await findHosts(networkInfo.cidr_block);
    console.log(JSON.stringify(hosts, null, 2));
}

async function info () {
    let networkInfo = await utils.getNetworkInfo();
    console.log(JSON.stringify(networkInfo, null, 2));
}

async function main(target) {



    let shreker = new Shreker();
    shreker.start();

}

const usage = 'usage:\n\tmitmshrek target <ip address>\n\tmitmshrek all\n\tmitmshrek list\n\tmitmshrek info\n\tmitmshrek help';

if (process.platform !== 'linux') {
    console.error('only linux is supported currently');
    process.exit(1);
} else if (process.argv.length === 2) {
    console.error(usage);
    process.exit(2);
} else {
    let promise;

    let action = process.argv[2];
    if (action === 'list') {
        promise = list();
    } else if (action === 'info') {
        promise = info();
    } else if (action === 'all') {
        promise = main();
    } else if (action === 'help') {
        console.error(usage);
        process.exit(0);
    } else if (action === 'target') {
        if (process.argv.length === 4) {
            promise = main(process.argv[3]);
        } else {
            console.error(usage);
            process.exit(3);
        }
    }

    promise.then(() => process.exit(0)).catch(err => {
        console.error(err);
        process.exit(4);
    });
}


readline.createInterface(process.stdin, process.stdout).on('line', () => {
    console.log('quitting from read line');
    process.exit(0);
});