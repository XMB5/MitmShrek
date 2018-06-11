const childProcess = require('child_process');
const xml2js = require('xml2js');

function findHosts(subnet) {
    return new Promise((resolve, reject) => {
        childProcess.exec(`nmap ${subnet} -PR -sn -n -oX -`, (err, stdout) => {
            if (err) {
                reject(err);
            } else {
                xml2js.parseString(stdout, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        let hosts = [];

                        let hostsRaw = res['nmaprun']['host'];

                        if (hostsRaw) {
                            hostsRaw.forEach(hostRaw => {
                                let host = {};

                                hostRaw['address'].forEach(address => {
                                    let data = address['$'];
                                    let type = data['addrtype'];
                                    if (type === 'mac') {
                                        host.mac = data['addr'];
                                        let vendor = data['vendor'];
                                        if (vendor) {
                                            host.vendor = vendor;
                                        }
                                    } else if (type === 'ipv4') {
                                        host.ip = data['addr']
                                    } else {
                                        console.warn('unknown address type ' + type);
                                    }
                                });

                                hosts.push(host);
                            });
                        }

                        resolve(hosts);
                    }
                });
            }
        });
    });
}

module.exports = findHosts;