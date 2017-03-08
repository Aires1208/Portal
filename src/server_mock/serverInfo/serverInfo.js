var _ = require("underscore");
var overview = require('./overview.json');
var memoryUsage = require('./memoryUsage.json');
var aggregateCPUUsage = require('./aggregateCPUUsage.json');
var fileSystem = require('./fileSystem.json');
var disk = require('./disk.json');
var networkInterface = require('./networkInterface.json');
var processInformation = require('./processInformation.json');

var opt = {};

opt["GET overview"] = function(req, res) {
    res.send(200, overview);
}

opt["GET memoryUsage"] = function(req, res) {
    res.send(200, memoryUsage);
}
opt["GET aggregateCPUUsage"] = function(req, res) {
    res.send(200, aggregateCPUUsage);
}
opt["GET fileSystem"] = function(req, res) {
    res.send(200, fileSystem);
}
opt["GET disk"] = function(req, res) {
    res.send(200, disk);
}
opt["GET networkInterface"] = function(req, res) {
    res.send(200, networkInterface);
}
opt["GET processInformation"] = function(req, res) {
    res.send(200, processInformation);
}
module.exports = opt;
