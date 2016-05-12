var path = require('path');
var url = require('url');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var http = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    getRequest(req, res);
  }
  if (req.method === 'POST') {
    postRequest(req, res);
  }
  //res.end(archive.paths.list);
};

var getRequest = function(req, res) {
  var endpoint = url.parse(req.url).pathname;
  if (endpoint === '/' || endpoint === '/index.html') {
    endpoint = path.join(archive.paths.siteAssets, '/index.html');
  } else if (endpoint === '/styles.css') {
    endpoint = path.join(archive.paths.siteAssets, endpoint);
  } else {
    endpoint = path.join(archive.paths.archivedSites, endpoint);
  }

  http.serveAssets(res, endpoint, function(err, data, headers) {
    res.writeHead(200, headers);
    res.end(data, 'binary'); 
  });

};

var postRequest = function(req, res) {
  http.getData(req, archive.paths.list, (body, headers) => {
    http.appendAssets(archive.paths.list, body.slice(4) + '\n', (err, headers) => {
      res.writeHead(302, headers);
      res.end('');
    });
  });
};
