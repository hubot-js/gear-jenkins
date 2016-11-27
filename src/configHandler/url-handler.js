'use strict';

const Q = require('q');
const db = require('../../src/db');
const request = require('request-promise');

exports.handle = handle;

function handle(awnser) {
  const deferred = Q.defer();

  if (awnser === 'skip') {
    deferred.resolve();
    return deferred.promise;
  }

  const url = getUrl(awnser);
  const successMessage = 'Url responds. Apparently everything is alright. :champagne:';
  const errorMessage = 'I could not check the url. Something is wrong. :disappointed: Check if the url is correct.';

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
