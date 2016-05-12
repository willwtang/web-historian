var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var utility = require('../web/http-helpers');
var request = require('request');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  utility.serveAssets('', exports.paths.list, (err, data) => {
    var urls = data.split('\n');
    callback(urls);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls((urls) => {
    var result = urls.indexOf(url) !== -1;
    callback(result);
  });
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, (is) => {
    if (!is) {
      utility.appendAssets(exports.paths.list, url, callback);
    }
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.exists(exports.paths.archivedSites + '/' + url, callback);
};

exports.downloadUrls = function(urlArray, callback) {
  _.each(urlArray, (website) => {
    request('http://' + website, (err, response, body) => {
      var file = fs.createWriteStream(exports.paths.archivedSites + '/' + website + '.html');
      file.write(body);
      if (callback) {
        callback();
      }
    });
  });
};
