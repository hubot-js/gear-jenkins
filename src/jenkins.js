'use strict';

const db = require('./db');

db.startDb();

exports.callJob = callJob;

function callJob(jobName) {
  return db.getDb().get('SELECT * FROM config').then((result) => {
    const jenkinsOptions = {
      baseUrl: result.url,
      promisify: true,
      crumbIssuer: result.useCSRF === 1
    };

    const jenkins = require('jenkins')(jenkinsOptions);

    return jenkins.job.build(jobName);
  });
}
