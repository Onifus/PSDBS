function clear_form() {
    var b = document.getElementById("nets").innerHTML;
    for (var a = 1; a <= b; a++) {
        document.getElementById("name" + a).value = "Host" + a;
        document.getElementById("hosts" + a).value = "";
    }
}

function change_subnet_number() {
    var e = document.getElementById("nets").innerHTML;
    var c = document.getElementById("input_num_of_subnets").value;
    c = c.replace(/^\s+|\s+$/g, "");
    if (isNaN(c)) {
        alert("Please enter an integer between 2 and 999");
    } else {
        if (c % 1 !== 0) {
            alert("Please enter a whole integer - no decimals or commas, please");
        } else {
            if (c > 999 || c < 2) {
                alert("Please enter a positive integer between 2 and 999");
            } else {
                paragraph = "<span class='column'>Subnet Names:</span> <span class='column'>Number of hosts:</span><br>";
                for (var b = 1; b <= c; b++) {
                    var d = document.getElementById("name" + b) ? document.getElementById("name" + b).value : "Host" + b;
                    var a = document.getElementById("hosts" + b) ? document.getElementById("hosts" + b).value : "";
                    paragraph += "<input type='text' id='name" + b + "' value='" + d + "'> <input type='text' id='hosts" + b + "' tabindex='" + b + "' value='" + a + "'><br>";
                }
                document.getElementById("nets").innerHTML = c;
                document.getElementById("subnet_pargraph").innerHTML = paragraph;
            }
        }
    }
}

function vlsm() {
    var h = document.getElementById("input_network").value;
    h = h.replace(/^\s+|\s+$/g, "");
    if (!validate(h)) {
        document.getElementById("not_valid_ip").innerHTML = "<b>This does not seem like a valid network</b>";
        return;
    }
    document.getElementById("not_valid_ip").innerHTML = "";
    var n = return_slash(h);
    var g = find_hosts(n);
    var m = return_ip(h);
    var q = find_mask(n);
    var c = find_net_add(m, q);
    var f = find_wildcard(q);
    var p = find_broadcast(f, m);
    var o = document.getElementById("nets").innerHTML;
    var a = sum_hosts(o);
    var d = ordered_hosts(o);
    var s = `<p>The network ${c.join(".")}/${n} has ${g} hosts.<br>Your subnets need ${a} hosts.</p>`;
    var t = "<table border='1'><tr><td>Name</td><td>Hosts Needed</td><td>Hosts Available</td><td>Unused Hosts</td><td>Network Address</td><td>Slash</td><td>Mask</td><td>Usable Range</td><td>Broadcast</td><td>Wildcard</td></tr>";
    var b = c;
    var k = 0;

    for (var r = 0; r < d.length; r++) {
        var j = find_slash(d[r][0]);
        var u = find_mask(j);
        var e = find_net_add(b, u);
        var l = find_wildcard(u);
        k += find_hosts(j) + 2;
        t += `<tr><td>${d[r][1]}</td><td>${d[r][0]}</td><td>${find_hosts(j)}</td><td>${find_hosts(j) - d[r][0]}</td><td>${e.join(".")}</td><td>/${j}</td>`;
        b = find_broadcast(l, e);
        t += `<td>${u.join(".")}</td><td>${e[0]}.${e[1]}.${e[2]}.${e[3] + 1} - ${b[0]}.${b[1]}.${b[2]}.${b[3] - 1}</td><td>${b.join(".")}</td><td>${l.join(".")}</td></tr>`;
        b = next_net_add(b);
    }

    t += "</table>";
    if (k > g + 2) {
        s += "<span style='background-color:yellow;'>Looks like those subnets will not fit into that network, but here is something else that may work for you:</span><br>";
    }
    t = s + t;
    document.getElementById("ans").innerHTML = t;
}

function validate(b) {
    var a = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([1-9]|[1-2][0-9]|3[0-2])$/;
    return a.test(b);
}

function return_slash(a) {
    return parseInt(a.split("/")[1]);
}

function return_ip(a) {
    return a.split("/")[0].split(".").map(Number);
}

function find_hosts(a) {
    return Math.pow(2, 32 - a) - 2;
}

function find_mask(c) {
    var a = [0, 0, 0, 0];
    for (var b = 0; b < 4; b++) {
        if (c > b * 8) {
            a[b] = 256 - Math.pow(2, 8 - Math.min(8, c - b * 8));
        }
    }
    return a;
}

function find_net_add(a, b) {
    return a.map((val, index) => val & b[index]);
}

function find_wildcard(a) {
    return a.map(val => 255 - val);
}

function find_broadcast(b, a) {
    return b.map((val, index) => val | a[index]);
}

function ordered_hosts(a) {
    var c = [];
    for (var i = 1; i <= a; i++) {
        var e = document.getElementById("name" + i).value;
        var d = parseInt(document.getElementById("hosts" + i).value, 10);
        if (d >= 1) {
            c.push([d, e]);
        }
    }
    return c.sort((x, y) => y[0] - x[0]);
}

function sum_hosts(a) {
    var d = 0;
    for (var i = 1; i <= a; i++) {
        var b = parseInt(document.getElementById("hosts" + i).value, 10);
        if (b >= 1) {
            d += b;
        }
    }
    return d;
}

function next_net_add(a) {
    for (var i = 3; i >= 0; i--) {
        if (a[i] < 255) {
            a[i]++;
            return a;
        } else {
            a[i] = 0;
        }
    }
    return a;
}

function find_slash(hosts_needed) {
    for (var b = 2; b < 33; b++) {
        if (hosts_needed <= Math.pow(2, b) - 2) {
            return 32 - b;
        }
    }
    return "TOO BIG";
}
