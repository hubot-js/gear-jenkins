'use strict';

exports.handle = handle;

let Q = require('q');
var db = require('../../src/db');
var request = require('request-promise');

function handle(awnser) {
   let deferred = Q.defer();

   if (awnser === 'pular') {
      deferred.resolve();
      return deferred.promise;
   }

   let url = getUrl(awnser);
   let successMessage = 'A url responde, aparentemente está tudo certo. :champagne:';
   let errorMessage = 'Não consegui verificar a url, algo está errado. :disappointed: Confira se a url está correta.';

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
