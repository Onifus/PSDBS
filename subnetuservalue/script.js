document.getElementById('generateBtn').addEventListener('click', generateNetwork);

function generateNetwork() {
    const output = document.getElementById('output');
    output.innerHTML = '';

    // Načítání počáteční IP a seznamu hostů od uživatele
    const startingIP = document.getElementById('startingIP').value;
    const hostCounts = document.getElementById('hostCounts').value.split(',').map(Number);

    const subnets = generateSubnets(startingIP, hostCounts);

    let tableHTML = `<p>Starting IP: ${startingIP}</p>`;
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

function generateSubnets(startingIP, hostCounts) {
    const subnets = [];
    let currentIP = ipToNumber(startingIP);

    // Vytvoření subnetů podle zadaného počtu hostů
    hostCounts.forEach(hosts => {
        const subnetPrefix = 32 - Math.ceil(Math.log2(hosts + 2));
        const networkAddress = calculateNetworkAddress(numberToIP(currentIP), subnetPrefix);
        const broadcastAddress = calculateBroadcastAddress(numberToIP(currentIP), subnetPrefix);
        
        subnets.push({ ip: networkAddress, prefix: subnetPrefix, hosts });
        
        // Nastavení currentIP na další IP po broadcastu
        currentIP = ipToNumber(broadcastAddress) + 1;
    });

    // Seřazení subnetů podle počtu hostů sestupně
    subnets.sort((a, b) => b.hosts - a.hosts);

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
