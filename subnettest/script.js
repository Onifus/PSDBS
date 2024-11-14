document.addEventListener('DOMContentLoaded', generateSubnets);
document.getElementById('checkBtn').addEventListener('click', checkAnswers);

function generateSubnets() {
    const output = document.getElementById('questions');
    output.innerHTML = ''; 

    const startingIP = generateRandomIP();
    const startingPrefix = Math.floor(Math.random() * (30 - 24 + 1)) + 24;
    document.getElementById('startingIP').innerText = `${startingIP}/${startingPrefix}`;

    const numHosts = Array.from({ length: Math.floor(Math.random() * 4) + 2 }, () => Math.floor(Math.random() * 250) + 5);
    numHosts.sort((a, b) => b - a); 

    let currentIP = ipToNumber(startingIP);

    let htmlContent = '';
    numHosts.forEach((hosts, index) => {
        const requiredPrefix = 32 - Math.ceil(Math.log2(hosts + 2));
        htmlContent += `
            <div class="subnet">
                <h3>Subnet ${index + 1} - Hosts: ${hosts}</h3>
                <label>IP Address: <input type="text" class="user-ip" placeholder="Enter IP"></label>
                <label>Prefix: <input type="text" class="user-prefix" placeholder="Enter Prefix"></label>
                <label>Network Address: <input type="text" class="user-network" placeholder="Enter Network Address"></label>
                <label>Broadcast Address: <input type="text" class="user-broadcast" placeholder="Enter Broadcast Address"></label>
                <div class="feedback"></div>
            </div>
        `;
        currentIP += Math.pow(2, 32 - requiredPrefix);
    });
    output.innerHTML = htmlContent;

    output.dataset.startingIp = startingIP;
    output.dataset.startingPrefix = startingPrefix;
    output.dataset.numHosts = JSON.stringify(numHosts);
}

function checkAnswers() {
    const startingIP = document.getElementById('questions').dataset.startingIp;
    let currentIP = ipToNumber(startingIP);

    document.querySelectorAll('.subnet').forEach((subnetDiv, index) => {
        const hosts = JSON.parse(document.getElementById('questions').dataset.numHosts)[index];
        const requiredPrefix = 32 - Math.ceil(Math.log2(hosts + 2));
        const requiredNetwork = calculateNetworkAddress(numberToIP(currentIP), requiredPrefix);
        const requiredBroadcast = calculateBroadcastAddress(numberToIP(currentIP), requiredPrefix);

        const userIP = subnetDiv.querySelector('.user-ip');
        const userPrefix = subnetDiv.querySelector('.user-prefix');
        const userNetwork = subnetDiv.querySelector('.user-network');
        const userBroadcast = subnetDiv.querySelector('.user-broadcast');
        const feedback = subnetDiv.querySelector('.feedback');

        const isIPCorrect = userIP.value.trim() === numberToIP(currentIP);
        const isPrefixCorrect = parseInt(userPrefix.value.trim()) === requiredPrefix;
        const isNetworkCorrect = userNetwork.value.trim() === requiredNetwork;
        const isBroadcastCorrect = userBroadcast.value.trim() === requiredBroadcast;

        feedback.innerHTML = ''; 
        userIP.style.color = isIPCorrect ? 'white' : 'red';
        userPrefix.style.color = isPrefixCorrect ? 'white' : 'red';
        userNetwork.style.color = isNetworkCorrect ? 'white' : 'red';
        userBroadcast.style.color = isBroadcastCorrect ? 'white' : 'red';

        if (!isIPCorrect) feedback.innerHTML += `<p>IP Address: Chyba - správně: ${numberToIP(currentIP)}</p>`;
        if (!isPrefixCorrect) feedback.innerHTML += `<p>Prefix: Chyba - správně: ${requiredPrefix}</p>`;
        if (!isNetworkCorrect) feedback.innerHTML += `<p>Network Address: Chyba - správně: ${requiredNetwork}</p>`;
        if (!isBroadcastCorrect) feedback.innerHTML += `<p>Broadcast Address: Chyba - správně: ${requiredBroadcast}</p>`;

        currentIP += Math.pow(2, 32 - requiredPrefix);
    });
}

function generateRandomIP() {
    return `${randomOctet()}.${randomOctet()}.${randomOctet()}.0`;
}

function randomOctet() {
    return Math.floor(Math.random() * 256);
}

function ipToNumber(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
}

function numberToIP(num) {
    return [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.');
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
