'use strict';

exports.handle = handle;

var db = require('../../src/db').getDb();

function handle(configs) {
   db.run('UPDATE config SET url = ?, useCSRF = ?', getUrl(configs), getUseCSRF(configs));
}

function getUrl(configs) {
   let url = answer(configs, 1);

   if (url.includes('|')) {
      url = url.replace('<', '').substring(0, url.indexOf('|') - 1);
   } else {
      url = url.replace('<', '').replace('>', '');
   }

   return url;
}

function getUseCSRF(configs) {
   return answer(configs, 2) === 'Sim';
}

function answer(configs, id) {
   return configs.find(c => c.id === id).answer;
}
