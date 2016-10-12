'use strict';

exports.handle = handle;

let Q = require('q');
var db = require('../../src/db');

function handle(awnser) {
   let deferred = Q.defer();

   if (awnser === 'pular') {
      deferred.resolve();
      return deferred.promise;
   }
   
   db.getDb().run('UPDATE config SET useCSRF = ?', getUseCSRF(awnser));

   deferred.resolve();
      
   return deferred.promise;
}

function getUseCSRF(awnser) {
   return awnser === 'Sim';
}
