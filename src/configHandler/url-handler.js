'use strict';

const Q = require('q');
const db = require('../../src/db');
const request = require('request-promise');

exports.handle = handle;

function handle(hubot, awnser) {
  const deferred = Q.defer();

  if (awnser === hubot.i18n('jenkins:configuration.skip')) {
    deferred.resolve();
    return deferred.promise;
  }

  const url = getUrl(awnser);
  const successMessage = 'jenkins:configuration.url.responds';
  const errorMessage = 'jenkins:configuration.url.notResponds';

  db.getDb().then(database => database.run('UPDATE config SET url = ?', url));

  request.get(url)
         .then(() => deferred.resolve(successMessage))
         .catch(() => deferred.reject(errorMessage));

  return deferred.promise;
}

function getUrl(awnser) {
  let url = awnser;

  if (url.includes('|')) {
    url = url.replace('<', '').substring(0, url.indexOf('|') - 1);
  } else {
    url = url.replace('<', '').replace('>', '');
  }

  return url;
}
