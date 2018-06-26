const lib = require("./libs/servutils.js");
const perf = require("perf_hooks");
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
  let starttime = perf.performance.now()
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
          lib.decodeServices(v.network.localservices) +
          " (" +
          lib.formatHex(v.network.localservices) +
          ")",
        protversion: v.network.protocolversion,
        relayfee: v.network.relayfee,
        uptime: lib.formatSeconds(v.uptime),
        chain: v.blockc.chain,
        blocks: v.blockc.blocks,
        blockchainsize: lib.formatBytes(v.blockc.size_on_disk),
        headers: v.blockc.headers,
        difficulty: v.blockc.difficulty,
        bestblockhash: lib.formatHex(v.blockc.bestblockhash),
        mediantime: lib.convertEpoch(v.blockc.mediantime),
        pruned: v.blockc.pruned,
        segwit: v.blockc.bip9_softforks.segwit.status,
        transactions: v.mempool.size,
        mempoolbytes: lib.formatBytes(v.mempool.bytes),
        maxmempool: lib.formatBytes(v.mempool.maxmempool),
        totalbytesrecv: lib.formatBytes(v.nettotals.totalbytesrecv),
        totalbytessent: lib.formatBytes(v.nettotals.totalbytessent),
        peers: v.peers,
        banned: v.banned,
        time: (perf.performance.now() - starttime).toFixed()
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
