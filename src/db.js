'use strict';

let db = require('sqlite');
let path = require('path');

exports.getDb = getDb;

function getDb() {
   let gearPath = path.resolve(process.cwd(), 'node_modules/gear-jenkins/');
   let dbFile = gearPath + '/gear-jenkins.sqlite';
   let migrations = gearPath + '/migrations';

   function open(dbFile) {
      return db.open(dbFile);
   }

   function migrate(db) {
      return db.migrate({migrationsPath: migrations});
   }
   
   open(dbFile)
      .then(migrate)
      .catch(function() {
         //do nothing
      }) 

   return db; 
}
