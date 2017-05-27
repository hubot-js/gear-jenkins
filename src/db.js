'use strict';

exports.getDb = getDb;

const path = require('path');
const sqlite = require('sqlite');

let database;

function getDb() {
  if (database) {
    return Promise.resolve(database);
  }

  return startDb();
}

function startDb() {
  return open()
        .then(migrate)
        .catch(() => { }); // do nothing
}

function open() {
  const dbFile = `${gearPath()}/gear-jenkins.sqlite`;

  return sqlite.open(dbFile);
}

function migrate(sqliteDb) {
  const migrations = `${gearPath()}/migrations`;

  return sqliteDb.migrate({ migrationsPath: migrations })
           .then((result) => {
             database = result;
             return database;
           });
}

function gearPath() {
  return path.resolve(__dirname, '../');
}
