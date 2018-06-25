function formatBytes(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "n/a";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i == 0) return bytes + " " + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

function convertEpoch(seconds) {
  var timestamp = seconds;
  var date = new Date(timestamp * 1000);

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  return (
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  );
}

function replaceBytes(itemclass) {
  let items = document.getElementsByClassName(itemclass);
  for (let i = 0; i < items.length; i++) {
    let split = items[i].innerHTML.split(" / ");
    let sent = formatBytes(split[0]);
    let recv = formatBytes(split[1]);
    let com = sent + " / " + recv;
    items[i].innerHTML = com;
  }
}

function replaceDates(itemclass) {
  let items = document.getElementsByClassName(itemclass);
  for (let i = 0; i < items.length; i++) {
    let split = items[i].innerHTML.split(" / ");
    let com = convertEpoch(items[i].innerHTML);
    items[i].innerHTML = com;
  }
}

function toDec(hexstr) {
  return parseInt("0x" + hexstr, 16);
}

function decodeServices(flags) {
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
}

function replaceServices(itemclass) {
  let items = document.getElementsByClassName(itemclass);
  for (let i = 0; i < items.length; i++) {
    let com = decodeServices(items[i].innerHTML);
    if (!com) {com = '0x0'}
    items[i].innerHTML = com;
  }
}

function formatHex(hex) {
  return "0x" + hex.replace(/^0+/, "");
}


function onLoad() {
  replaceBytes("bytes");
  replaceDates("connectiontime");
  replaceDates("banneduntil");
  replaceDates("bannedcreation");
  replaceServices("peerservices")
}
