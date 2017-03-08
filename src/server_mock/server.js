'use strict';
var port = process.argv[2] || 8100;
var restify = require('restify');

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.requestLogger());
server.use(restify.bodyParser());

server.use(
  function crossOrigin(req, res, next) {
    'use strict';
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //console.log(req);
    return next();
  }
);
/*****serverInfo*****/
var serverInfo = require("./serverInfo/serverInfo.js");
server.get("/api/overview",serverInfo["GET overview"]);
server.get("/api/aggregateCPUUsage",serverInfo["GET aggregateCPUUsage"]);
server.get("/api/memoryUsage",serverInfo["GET memoryUsage"]);
server.get("/api/fileSystem",serverInfo["GET fileSystem"]);
server.get("/api/disk",serverInfo["GET disk"]);
server.get("/api/networkInterface",serverInfo["GET networkInterface"]);
server.get("/api/processInformation",serverInfo["GET processInformation"]);
/*****serverInfo*****/


server.listen(port, function( /*req, res*/ ) {
  console.log('PorjectManager api server listening on port ' + port);
});
