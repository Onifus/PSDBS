function calculateSubnets() {
  const networkInput = document.getElementById("input_network").value;
  const numSubnets = parseInt(document.getElementById("input_num_of_subnets").value);

  // Validate network input (basic IPv4 format and CIDR check)
  const networkRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([1-9]|[1-2][0-9]|3[0-2])$/;
  if (!networkRegex.test(networkInput) || isNaN(numSubnets) || numSubnets < 1) {
    alert("Please enter a valid network address (e.g., 192.168.0.0/24) and a positive integer for the number of subnets.");
    return;
  }

  // Split network address and CIDR notation
  const [ipAddress, cidr] = networkInput.split("/");
  const subnetMaskBits = parseInt(cidr);

  // Calculate the number of hosts in the network
  const totalHosts = Math.pow(2, 32 - subnetMaskBits) - 2;
  if (totalHosts < numSubnets) {
    alert("The network does not have enough hosts for the requested number of subnets.");
    return;
  }

  // Convert IP to binary
  const ipSegments = ipAddress.split(".").map(seg => parseInt(seg, 10).toString(2).padStart(8, "0"));
  const binaryIP = ipSegments.join("");

  // Calculate the subnet mask based on CIDR
  const subnetMaskBinary = "1".repeat(subnetMaskBits).padEnd(32, "0");
  const subnetMaskSegments = [
    parseInt(subnetMaskBinary.slice(0, 8), 2),
    parseInt(subnetMaskBinary.slice(8, 16), 2),
    parseInt(subnetMaskBinary.slice(16, 24), 2),
    parseInt(subnetMaskBinary.slice(24, 32), 2)
  ];

  // Calculate each subnet range
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<h3>Subnet Ranges</h3>";
  let outputHTML = "<table><tr><th>Subnet #</th><th>Network Address</th><th>Usable Range</th><th>Broadcast</th></tr>";

  let currentSubnetBinary = binaryIP.slice(0, subnetMaskBits).padEnd(32, "0");

  for (let i = 0; i < numSubnets; i++) {
    // Calculate subnet addresses
    const networkAddressBinary = currentSubnetBinary.slice(0, subnetMaskBits) + "0".repeat(32 - subnetMaskBits);
    const broadcastAddressBinary = currentSubnetBinary.slice(0, subnetMaskBits) + "1".repeat(32 - subnetMaskBits);

    // Convert binary addresses to decimal
    const networkAddress = [
      parseInt(networkAddressBinary.slice(0, 8), 2),
      parseInt(networkAddressBinary.slice(8, 16), 2),
      parseInt(networkAddressBinary.slice(16, 24), 2),
      parseInt(networkAddressBinary.slice(24, 32), 2)
    ];

    const broadcastAddress = [
      parseInt(broadcastAddressBinary.slice(0, 8), 2),
      parseInt(broadcastAddressBinary.slice(8, 16), 2),
      parseInt(broadcastAddressBinary.slice(16, 24), 2),
      parseInt(broadcastAddressBinary.slice(24, 32), 2)
    ];

    // Usable IP range (excluding network and broadcast)
    const usableRange = `${networkAddress[0]}.${networkAddress[1]}.${networkAddress[2]}.${networkAddress[3] + 1} - ${broadcastAddress[0]}.${broadcastAddress[1]}.${broadcastAddress[2]}.${broadcastAddress[3] - 1}`;

    // Append each subnet's info to the HTML output
    outputHTML += `<tr><td>${i + 1}</td><td>${networkAddress.join(".")}</td><td>${usableRange}</td><td>${broadcastAddress.join(".")}</td></tr>`;

    // Move to the next subnet by incrementing the last subnet bit
    let nextSubnetDecimal = parseInt(currentSubnetBinary.slice(0, subnetMaskBits), 2) + 1;
    currentSubnetBinary = nextSubnetDecimal.toString(2).padStart(subnetMaskBits, "0").padEnd(32, "0");
  }

  outputHTML += "</table>";
  resultsDiv.innerHTML += outputHTML;
}
