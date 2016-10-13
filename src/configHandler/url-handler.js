'use strict';

const Q = require('q');
const db = require('../../src/db');
const request = require('request-promise');

exports.handle = handle;

function handle(awnser) {
   const deferred = Q.defer();

   if (awnser === 'pular') {
      deferred.resolve();
      return deferred.promise;
   }

   const url = getUrl(awnser);
   const successMessage = 'A url responde, aparentemente está tudo certo. :champagne:';
   const errorMessage = 'Não consegui verificar a url, algo está errado. :disappointed: Confira se a url está correta.';

   db.getDb().run('UPDATE config SET url = ?', url);

   request.get(url)
      .then(function() {
         deferred.resolve(successMessage); 
      }).catch(function() {
         deferred.reject(errorMessage);
      }); 
      
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
