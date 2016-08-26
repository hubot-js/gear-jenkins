'use strict';

exports.callJob = callJob;

var authUrl = process.env.JENKINS_AUTH_URL;

function callJob(jobName) {
   var jenkins = buildJenkins();

   return jenkins.job.build(jobName);     
}

function buildJenkins() {
   var jenkinsOptions = {
      baseUrl: authUrl,
      promisify: true,
      crumbIssuer: useCrumb()   
   }

   return require('jenkins')(jenkinsOptions);
}

function useCrumb() {
   return process.env.CRUMB_ISSUER === 'true';
}
