'use strict';

const db = require('./db');

exports.callJob = callJob;

function callJob(jobName) {
  const p1 = db.getDb();
  const p2 = p1.then(getConfig);
  const p3 = p2.then(getJenkinsInfo);

  return Promise.all([p1, p2, p3]).then(params => build(jobName, params[1], params[2]));
}

function getConfig(dataBase) {
  return dataBase.get('SELECT * FROM config');
}

function getJenkinsInfo(config) {
  const jenkins = requireJenkins(config.url);
  return jenkins.info();
}

function build(jobName, config, info) {
  const jenkins = requireJenkins(config.url, info.useCrumbs);
  return jenkins.job.build(jobName);
}

function requireJenkins(url, useCrumbs) {
  const jenkinsOptions = {
    baseUrl: url,
    promisify: true,
    crumbIssuer: useCrumbs
  };

  return require('jenkins')(jenkinsOptions);
}
