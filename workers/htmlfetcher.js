// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var cron = require('node-cron');
var archive = require('../helpers/archive-helpers');

var fetch = function() {
  archive.readListOfUrls((arrayOfUrls) => {
    archive.downloadUrls(arrayOfUrls);
  });
};

module.exports = cron.schedule('1 * * * *', () => {
  console.log('every minute');
  fetch();
});
