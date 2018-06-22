function formatSeconds(seconds) {
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
}

function formatBytes(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return 'n/a';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i == 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

const path = require("path");
const config = require("./config.json");

const http = require("http");
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

const Client = require("bitcoin-core");
const client = new Client({
  username: config.username,
  password: config.password,
  port: config.port,
  host: config.host,
});

app.get("/", function(req, res) {
  var nickname = config.nodenickname;
  let v = [];
  let promises = [
    client.getNetworkInfo().then(val => v.network = val).then(val => Promise.resolve(val)),
    client.getPeerInfo().then(val => v.peers = val).then(val => Promise.resolve(val)),
    client.getNetTotals().then(val => v.nettotals = val).then(val => Promise.resolve(val)),
    client.upTime().then(val => v.uptime = val).then(val => Promise.resolve(val)),
    client.getBlockchainInfo().then(val => v.blockc = val).then(val => Promise.resolve(val)),
    client.getMempoolInfo().then(val => v.mempool = val).then(val => Promise.resolve(val))
  ];

  Promise.all(promises)
    .then(data => console.log(v.peers))
    .then(data => {
      res.render("../views/index", {
        nickname: nickname,
        version: v.network.version,
        subversion: v.network.subversion,
        protversion: v.network.protocolversion,
        relayfee: v.network.relayfee,
        uptime: formatSeconds(v.uptime),
        chain: v.blockc.chain,
        blocks: v.blockc.blocks,
        headers: v.blockc.headers,
        difficulty: v.blockc.difficulty,
        bestblockhash: v.blockc.bestblockhash,
        mediantime: v.blockc.mediantime,
        pruned: v.blockc.pruned,
        segwit: v.blockc.bip9_softforks.segwit.status,
        transactions: v.mempool.size,
        mempoolbytes: formatBytes(v.mempool.bytes),
        maxmempool: formatBytes(v.mempool.maxmempool),
        totalbytesrecv: formatBytes(v.nettotals.totalbytesrecv),
        totalbytessent: formatBytes(v.nettotals.totalbytessent),
        peerscount: v.peers.length
      });
    })
    .catch(err =>
      res.render("../views/error", {
        error: err
      })
    );
});

app.listen(3000, function(res, req) {
  console.log("Server running");
});
