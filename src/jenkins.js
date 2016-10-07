'use strict';

exports.callJob = callJob;

var db = require('./db').getDb();

function callJob(jobName) {
   return db.get('SELECT * FROM config').then(function(result) {
      var jenkinsOptions = {
         baseUrl: result.url,
         promisify: true,
         crumbIssuer: result.useCSRF == 1 
      }

      var jenkins = require('jenkins')(jenkinsOptions);
      
      return jenkins.job.build(jobName);
   });
}
