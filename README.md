# MitmShrek
Attack a network and replace http websites with a pusling shrek.
[Here](https://xmb5.github.io/MitmShrek/site/example.html) is the shreked page (warning - turn down your speakers)

## How does it work?
1. find the network's gateway IP address
2. send fake ARP packets to the whole network (ARP broadcast address) or a specific address, instructing them that the gateway MAC address is our attacker MAC address
3. enable ip forwarding to allow the victim to make https and other connections, but capture port 80 (`http`)
4. run an http server that shows shrek

## Installation
1. Only works on linux currently
2. Install `nmap` and `arpspoof` and ensure they are on the `$PATH`
3. Make sure you have `node` and `npm` installed (I recommend [nvm](https://github.com/creationix/nvm))
4. `git clone https://github.com/XMB5/MitmShrek`
5. `cd MitmShrek`
6. `npm install`
7. `npm run dlshrek`

## arpspoof bug
Some versions of dsniff are floating around with partially broken arpspoofs.
These versions of arpspoof will successfully shrek one target, but fail to shrek the entire network.
To check if you have a broken version of arpspoof, run
```
GATEWAY_IP=$(/sbin/ip route | awk '/default/ { print $3 }')
sudo arpspoof -i wlp3s0 $GATEWAY_IP
```
You should see an output similar to
```
8c:c4:b1:a1:b9:1b ff:ff:ff:ff:ff:ff 0806 42: arp reply 10.0.0.1 is-at 8c:c4:b1:a1:b9:1b
8c:c4:b1:a1:b9:1b ff:ff:ff:ff:ff:ff 0806 42: arp reply 10.0.0.1 is-at 8c:c4:b1:a1:b9:1b
```
If there is no output or only `Cleaning up and re-arping targets...`, you have a broken version of arpspoof.
You can download an [almost working version](https://packages.ubuntu.com/bionic/dsniff) of arpspoof from ubuntu packages.
The ubuntu package does not re-ARP if attacking the LAN, but this is a minor problem apparent only after shreking.

## Execution
- You must `cd` in the `MitmShrek` directory
- All actions except `info` require superuser (`sudo`)
- To run the examples, replace `mitmshrek` with `npm run start`

### Examples
- `mitmshrek all`
  - shreks the entire network
- `mitmshrek target 10.0.0.9`
  - shreks the device with ip address 10.0.0.9
- `mitmshrek list`
  - lists shrekable targets on the network
- `mitmshrek info`
  - shows information about the connection to the network