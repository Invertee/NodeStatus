function secondsToDays(seconds) {
  var days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  var hrs = Math.floor(seconds / 3600);
  seconds -= hrs * 3600;
  var mnts = Math.floor(seconds / 60);
  seconds -= mnts * 60;
  console.log(
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
    client.getNetworkInfo(val => (v.network = val)),
    client.getPeerInfo(val => (v.peers = val)),
    client.getNetTotals(val => v.nettotals = val),
    client.getBlockchainInformation(val => v.blockchain = val)
  ];

  Promise.all(promises)
    .then(data => {
      res.render("../views/index", {
        nickname: nickname,
        version: v[0].version,
        subversion: v[0].subversion,
        protversion: v[0].protocolversion
      });
    })
    .catch(err => console.log(err));
});

app.listen(3000, function(res, req) {
  console.log("Server running");
});
