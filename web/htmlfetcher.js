// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var cron = require('cron').CronJob;
var archive = require('../helpers/archive-helpers');

var fetch = function() {
  archive.readListOfUrls((arrayOfUrls) => {
    archive.downloadUrls(arrayOfUrls);
  });
};

new cron('* * * * *', () => {
  console.log('every minute');
  fetch();
}, null, true, 'America/Los_Angeles');
