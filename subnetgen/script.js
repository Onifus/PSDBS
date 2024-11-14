document.getElementById('generateBtn').addEventListener('click', generateNetwork);

function generateNetwork() {
    const output = document.getElementById('output');
    output.innerHTML = '';

    const startingIP = generateRandomIP();
    const prefix = Math.floor(Math.random() * (30 - 24 + 1)) + 24;
    const subnets = generateSubnets(startingIP, prefix);

    let tableHTML = `<p>Starting IP: ${startingIP}/${prefix}</p>`;
    tableHTML += `<table><tr><th>Subnet</th><th>IP Address</th><th>Prefix</th><th>Hosts</th><th>Network Address</th><th>Broadcast Address</th></tr>`;

    subnets.forEach((subnet, index) => {
        const networkAddress = calculateNetworkAddress(subnet.ip, subnet.prefix);
        const broadcastAddress = calculateBroadcastAddress(subnet.ip, subnet.prefix);
        tableHTML += `<tr>
                        <td>${index + 1}</td>
                        <td>${subnet.ip}</td>
                        <td>${subnet.prefix}</td>
                        <td>${subnet.hosts}</td>
                        <td>${networkAddress}</td>
                        <td>${broadcastAddress}</td>
                      </tr>`;
    });

    tableHTML += `</table>`;
    output.innerHTML = tableHTML;
}

function generateRandomIP() {
    return `${randomOctet()}.${randomOctet()}.${randomOctet()}.0`;
}

function randomOctet() {
    return Math.floor(Math.random() * 256);
}

function generateSubnets(startingIP, startingPrefix) {
    const numSubnets = Math.floor(Math.random() * (6 - 2 + 1)) + 2;
    const subnets = [];
    let currentIP = ipToNumber(startingIP);

    // Předgenerování subnetů s hosty a prefixem
    for (let i = 0; i < numSubnets; i++) {
        const hosts = Math.floor(Math.random() * (300 - 5 + 1)) + 5;
        const subnetPrefix = 32 - Math.ceil(Math.log2(hosts + 2));
        subnets.push({ prefix: subnetPrefix, hosts });
    }

    // Seřadí subnety podle počtu hostů sestupně
    subnets.sort((a, b) => b.hosts - a.hosts);

    // Vypočítá správné adresy subnetů na základě seřazeného pořadí
    subnets.forEach(subnet => {
        const networkAddress = calculateNetworkAddress(numberToIP(currentIP), subnet.prefix);
        const broadcastAddress = calculateBroadcastAddress(numberToIP(currentIP), subnet.prefix);
        subnet.ip = networkAddress;

        // Aktualizuje currentIP na následující adresu po broadcastu
        currentIP = ipToNumber(broadcastAddress) + 1;
    });

    return subnets;
}

function ipToNumber(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
}

function numberToIP(num) {
    return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255
    ].join('.');
}

function calculateNetworkAddress(ip, prefix) {
    const ipNum = ipToNumber(ip);
    const mask = ~((1 << (32 - prefix)) - 1);
    return numberToIP(ipNum & mask);
}

function calculateBroadcastAddress(ip, prefix) {
    const ipNum = ipToNumber(ip);
    const mask = ~((1 << (32 - prefix)) - 1);
    return numberToIP(ipNum | ~mask);
}
