'use strict';

exports.callJob = callJob;

require('./db').startDb();
var db = require('./db');

function callJob(jobName) {
   return db.getDb().get('SELECT * FROM config').then(function(result) {
      var jenkinsOptions = {
         baseUrl: result.url,
         promisify: true,
         crumbIssuer: result.useCSRF == 1 
      }

      var jenkins = require('jenkins')(jenkinsOptions);
      
      return jenkins.job.build(jobName);
   });
}
