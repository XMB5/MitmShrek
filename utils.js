const network = require('network');
const {promisify} = require('util');


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

module.exports = {
    getNetworkInfo
};