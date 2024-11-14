function clearForm() {
    document.getElementById("input_network").value = "";
    document.getElementById("input_num_of_subnets").value = "";
    document.getElementById("subnet_input").innerHTML = "";
    document.getElementById("results").innerHTML = "";
}

function changeSubnetNumber() {
    const subnetCount = parseInt(document.getElementById("input_num_of_subnets").value);
    if (isNaN(subnetCount) || subnetCount < 1) {
        alert("Zadejte prosím platný počet subnetů.");
        return;
    }

    let inputFields = "<h3>Zadejte počet hostů pro každý subnet:</h3>";
    for (let i = 1; i <= subnetCount; i++) {
        inputFields += `<label for="hosts${i}">Subnet ${i} - Počet hostů:</label>`;
        inputFields += `<input type="number" id="hosts${i}" placeholder="Např. 50"><br><br>`;
    }
    document.getElementById("subnet_input").innerHTML = inputFields;
}

function validateIP(ip) {
    const pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([1-9]|[1-2][0-9]|3[0-2])$/;
    return pattern.test(ip);
}

function calculateSubnets() {
    const network = document.getElementById("input_network").value.trim();
    if (!validateIP(network)) {
        document.getElementById("results").innerHTML = "<b>Neplatná IP adresa nebo maska sítě.</b>";
        return;
    }

    const [baseIP, mask] = network.split("/");
    const numHostsPerSubnet = [];
    const subnetCount = parseInt(document.getElementById("input_num_of_subnets").value);

    for (let i = 1; i <= subnetCount; i++) {
        const hosts = parseInt(document.getElementById(`hosts${i}`).value);
        if (isNaN(hosts) || hosts < 1) {
            alert(`Zadejte platný počet hostů pro subnet ${i}`);
            return;
        }
        numHostsPerSubnet.push(hosts);
    }

    numHostsPerSubnet.sort((a, b) => b - a);

    let resultsTable = "<table><tr><th>Subnet</th><th>Počet hostů</th><th>IP Rozsah</th><th>Broadcast</th><th>Maska</th></tr>";
    let currentIP = baseIP.split('.').map(Number);

    numHostsPerSubnet.forEach((hostsNeeded, index) => {
        const subnetMask = 32 - Math.ceil(Math.log2(hostsNeeded + 2));
        const hostsAvailable = Math.pow(2, 32 - subnetMask) - 2;

        const maskArray = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            if (subnetMask > i * 8) {
                maskArray[i] = 256 - Math.pow(2, 8 - Math.min(8, subnetMask - i * 8));
            }
        }

        const networkAddress = currentIP.join(".");
        const broadcastAddress = currentIP.slice();
        broadcastAddress[3] += hostsAvailable + 1;
        
        resultsTable += `<tr><td>Subnet ${index + 1}</td><td>${hostsNeeded}</td><td>${networkAddress}</td><td>${broadcastAddress.join(".")}</td><td>${maskArray.join(".")}</td></tr>`;
        
        currentIP[3] += hostsAvailable + 1;
        if (currentIP[3] > 255) { currentIP[2] += Math.floor(currentIP[3] / 256); currentIP[3] %= 256; }
        if (currentIP[2] > 255) { currentIP[1] += Math.floor(currentIP[2] / 256); currentIP[2] %= 256; }
        if (currentIP[1] > 255) { currentIP[0] += Math.floor(currentIP[1] / 256); currentIP[1] %= 256; }
    });

    resultsTable += "</table>";
    document.getElementById("results").innerHTML = resultsTable;
}
