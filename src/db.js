'use strict';

exports.startDb = startDb;
exports.getDb = getDb;

const sqlite = require('sqlite');
const path = require('path');

let database;

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
           .then((result) => { database = result; });
}

function getDb() {
  return database;
}

function gearPath() {
  return path.resolve(process.cwd(), 'node_modules/gear-jenkins/');
}
