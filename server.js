const lib = require("./libs/servutils.js");
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
  host: config.host
});

app.get("/", function(req, res) {
  var nickname = config.nodenickname;
  let v = [];
  let promises = [
    client
      .listBanned()
      .then(val => (v.banned = val))
      .then(val => Promise.resolve(val)),
    client
      .getNetworkInfo()
      .then(val => (v.network = val))
      .then(val => Promise.resolve(val)),
    client
      .getPeerInfo()
      .then(val => (v.peers = val))
      .then(val => Promise.resolve(val)),
    client
      .getNetTotals()
      .then(val => (v.nettotals = val))
      .then(val => Promise.resolve(val)),
    client
      .upTime()
      .then(val => (v.uptime = val))
      .then(val => Promise.resolve(val)),
    client
      .getBlockchainInfo()
      .then(val => (v.blockc = val))
      .then(val => Promise.resolve(val)),
    client
      .getMempoolInfo()
      .then(val => (v.mempool = val))
      .then(val => Promise.resolve(val))
  ];

  Promise.all(promises)
    .then(data => {
      res.render("../views/index", {
        nickname: nickname,
        version: v.network.version,
        subversion: v.network.subversion,
        localservices:
          lib.decodeServices(v.network.services) +
          " (" +
          lib.formatHex(v.network.services) +
          ")",
        protversion: v.network.protocolversion,
        relayfee: v.network.relayfee,
        uptime: lib.formatSeconds(v.uptime),
        chain: v.blockc.chain,
        blocks: v.blockc.blocks,
        headers: v.blockc.headers,
        difficulty: v.blockc.difficulty,
        bestblockhash: v.blockc.bestblockhash,
        mediantime: v.blockc.mediantime,
        pruned: v.blockc.pruned,
        segwit: v.blockc.bip9_softforks.segwit.status,
        transactions: v.mempool.size,
        mempoolbytes: lib.formatBytes(v.mempool.bytes),
        maxmempool: lib.formatBytes(v.mempool.maxmempool),
        totalbytesrecv: lib.formatBytes(v.nettotals.totalbytesrecv),
        totalbytessent: lib.formatBytes(v.nettotals.totalbytessent),
        peers: v.peers,
        banned: v.banned
      });
    })
    .catch(err =>
      res.render("../views/error", {
        error: err
      })
    );
});

app.listen(config.webport, function(res, req) {
  console.log("Server running on port " + config.webport);
});
