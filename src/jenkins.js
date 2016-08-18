'use strict';

exports.callJob = callJob;

function callJob(authUrl, jobName) {
   var jenkins = buildJenkins(authUrl);

   return jenkins.job.build(jobName);     
}

function buildJenkins(authUrl) {
   var jenkinsOptions = {
      baseUrl: authUrl,
      promisify: true      
   }

   return require('jenkins')(jenkinsOptions);
}
