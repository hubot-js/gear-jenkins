'use strict';

require('./db').startDb();
const db = require('./db');

exports.callJob = callJob;

function callJob(jobName) {
   return db.getDb().get('SELECT * FROM config').then(function(result) {
      const jenkinsOptions = {
         baseUrl: result.url,
         promisify: true,
         crumbIssuer: result.useCSRF == 1 
      }

      const jenkins = require('jenkins')(jenkinsOptions);
      
      return jenkins.job.build(jobName);
   });
}
