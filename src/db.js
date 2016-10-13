'use strict';

exports.startDb = startDb;
exports.getDb = getDb;

const db = require('sqlite');
const path = require('path');

let database;

function startDb() {
   const gearPath = path.resolve(process.cwd(), 'node_modules/gear-jenkins/');
   const dbFile = gearPath + '/gear-jenkins.sqlite';
   const migrations = gearPath + '/migrations';

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
