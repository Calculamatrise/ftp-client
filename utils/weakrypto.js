function weakode(string, radix = 10) {
    return Array.from(string.toString(10)).map(char => char.charCodeAt(0).toString(radix)).join(' ');
}

function deakode(weakrypted, radix = 10) {
    return weakrypted.toString(10).split(' ').map(bin => String.fromCharCode(parseInt(bin, radix))).join('');
}