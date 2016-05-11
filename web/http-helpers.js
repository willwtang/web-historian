var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  fs.readFile(asset, 'binary', function(err, data) {
    if (err) {
      res.writeHead(404);
      res.end();
      console.error(err);
      return;
    }

    extension = asset.split('.').pop();
    extensions = {
      html: 'text/html',
      js: 'text/javascript',
      gif: 'image/gif',
      css: 'text/css'
    };
    
    var headers = _.extend(exports.headers, {'Content-Type': extensions[extension]});
    callback(err, data, headers);
  });
};

exports.appendAssets = function(req, path, callback, stringModifier) {
  var body = [];
  req.on('data', chunk => body.push(chunk.toString()));
  req.on('end', () => {

    body = body.join('');
    if (stringModifier) {
      body = stringModifier(body);
    }
    fs.appendFile(path, body, (err) => {
      if (err) {
        console.error(err);
        response.writeHead(401, headers);
        response.end('');
        return;
      }
      var headers = _.extend(exports.headers, {'Content-Type': 'text/plain'});
      callback(err, headers);
    });
  });
};


// As you progress, keep thinking about what helper functions you can put here!
