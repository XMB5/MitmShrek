# MitmShrek
Attack a network and replace http websites with pusling shrek.
[Here](https://xmb5.github.io/MitmShrek/site/example.html) is an example (warning - turn down your speakers)

## How does it work?
1. find the network's gateway IP address
2. send fake ARP packets to the whole network (ARP broadcast address) or a specific address, instructing them that the gateway MAC address is our attacker MAC address
3. enable ip forwarding to allow the victim to make https and other connections, but capture port 80 (`http`)
4. run an http server that shows shrek

## Installation
1. Only works on linux currently
2. Install `nmap` and `arpspoof` and ensure they are on the `PATH`
3. Make sure you have `node` and `npm` installed (I recommend [nvm](https://github.com/creationix/nvm))
4. `git clone https://github.com/XMB5/MitmShrek`
5. `cd MitmShrek`
6. `npm install`
7. `npm run dlshrek`

## Execution
Replace `mitmshrek` with `npm run start`

- `mitmshrek all`
  - shreks the entire network
- `mitmshrek target <ip address>`
  - shreks a specific ip address
- `mitmshrek list`
  - lists shrekable targets on the network
- `mitmshrek info`
  - shows information about the connection to the network