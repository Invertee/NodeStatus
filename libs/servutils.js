module.exports = {
formatSeconds: function formatSeconds(seconds) {
    var days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    var hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    var mnts = Math.floor(seconds / 60);
    seconds -= mnts * 60;
    return(
      days +
        " days, " +
        hrs +
        " Hrs, " +
        mnts +
        " Minutes, " +
        seconds +
        " Seconds"
    );
  },

formatBytes: function formatBytes(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  },

  toDec: function toDec(hexstr) {
    return parseInt("0x" + hexstr, 16);
  },
  
  decodeServices: function decodeServices(flags) {
    let flag = toDec(flags);
    let res = "";
    let services = [
      ["NONE", 0],
      ["NETWORK", 1 << 0],
      ["GETUTXO", 1 << 1],
      ["BLOOM", 1 << 2],
      ["WITNESS", 1 << 3],
      ["XTHIN", 1 << 4],
      ["NETWORK_LIMITED", 1 << 10]
    ];
  
    for (let i = 0; i < services.length; i++) {
      if ((flag & services[i][1]) != 0) {
        res += services[i][0] + ", ";
      }
    }
    return res.slice(0, -2);
  },
  
  formatHex: function formatHex(hex) {
    return "0x" + hex.replace(/^0+/, "");
  }
}
