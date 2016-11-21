'use strict';

const Q = require('q');
const db = require('../../src/db');

exports.handle = handle;

function handle(awnser) {
  const deferred = Q.defer();

  if (awnser === 'pular') {
    deferred.resolve();
    return deferred.promise;
  }

  db.getDb().then((database) => database.run('UPDATE config SET useCSRF = ?', getUseCSRF(awnser)));

  deferred.resolve();

  return deferred.promise;
}

function getUseCSRF(awnser) {
  return awnser === 'Sim';
}
