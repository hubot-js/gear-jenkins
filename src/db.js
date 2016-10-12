'use strict';

let db = require('sqlite');
let path = require('path');

exports.startDb = startDb;
exports.getDb = getDb;

var database;

function startDb() {
   let gearPath = path.resolve(process.cwd(), 'node_modules/gear-jenkins/');
   let dbFile = gearPath + '/gear-jenkins.sqlite';
   let migrations = gearPath + '/migrations';

   function open(dbFile) {
      return db.open(dbFile);
   }

   function migrate(db) {
      return db.migrate({migrationsPath: migrations}).then(function(result) {
         database = result;
      });
   }
   
   return open(dbFile)
      .then(migrate)
      .catch(function() {
         //do nothing
      });
}

function getDb() {
   return database;
}
