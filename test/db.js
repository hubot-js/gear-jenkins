/* eslint-disable no-unused-expressions */

'use strict';

require('sinon-as-promised');
const sinon = require('sinon');
const expect = require('chai').expect;
const proxyquire = require('proxyquire').noPreserveCache();

describe('Data base creation', () => {
  it('should open db and run migrations scripts', () => {
    const database = sinon.stub();
    const openStub = sinon.stub();
    const migrateStub = sinon.stub().resolves(database);

    const openSpy = sinon.spy(openStub);
    const migrateSpy = sinon.spy(migrateStub);

    const sqlite = { open: openSpy, migrate: migrateSpy };

    const db = buildDb(sqlite);
    openStub.resolves(sqlite);

    db.getDb();

    expect(openSpy.calledWith(`${process.cwd()}/node_modules/gear-jenkins/gear-jenkins.sqlite`)).to.be.true;

    migrateSpy().then(() => {
      expect(migrateSpy.calledWithMatch(
            { migrationsPath: `${process.cwd()}/node_modules/gear-jenkins/migrations` })).to.be.true;
    });
  });

  it('do nothing when error occurs on open', () => {
    const openStub = sinon.stub().rejects();

    const openSpy = sinon.spy(openStub);
    const migrateSpy = sinon.spy();

    const sqlite = { open: openSpy, migrate: migrateSpy };

    const db = buildDb(sqlite);

    db.getDb();

    expect(openSpy.calledWith(`${process.cwd()}/node_modules/gear-jenkins/gear-jenkins.sqlite`)).to.be.true;
    expect(migrateSpy.calledWithMatch(
          { migrationsPath: `${process.cwd()}/node_modules/gear-jenkins/migrations` })).to.be.false;
  });

  it('do nothing when error occurs on migration', () => {
    const openStub = sinon.stub();
    const migrateStub = sinon.stub().rejects();

    const openSpy = sinon.spy(openStub);
    const migrateSpy = sinon.spy(migrateStub);

    const sqlite = { open: openSpy, migrate: migrateSpy };

    const db = buildDb(sqlite);
    openStub.resolves(sqlite);

    db.getDb();
  });
});

describe('Get data base', () => {
  it('when call getDb', () => {
    const database = sinon.stub();
    const openStub = sinon.stub();
    const migrateStub = sinon.stub().resolves(database);

    const openSpy = sinon.spy(openStub);
    const migrateSpy = sinon.spy(migrateStub);

    const sqlite = { open: openSpy, migrate: migrateSpy };

    const db = buildDb(sqlite);
    openStub.resolves(sqlite);

    return db.getDb().then((result) => {
      expect(result).to.be.deep.equal(database);
    });
  });
});

function buildDb(sqlite) {
  return proxyquire('../src/db', { sqlite });
}
