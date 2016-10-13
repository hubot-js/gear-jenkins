const proxyquire = require('proxyquire').noPreserveCache();
const expect  = require('chai').expect;
const sinon = require('sinon');
require('sinon-as-promised');

describe('Data base creation', function() {
   it("should open db and run migrations scripts", function() {
      const database = sinon.stub();
      const openStub = sinon.stub();
      const migrateStub = sinon.stub().resolves(database);
      
      const openSpy = sinon.spy(openStub);
      const migrateSpy = sinon.spy(migrateStub);

      const sqlite = { 'open': openSpy, 'migrate': migrateSpy };

      const db = buildDb(sqlite);
      openStub.resolves(sqlite);
      
      db.startDb();
      
      expect(openSpy.calledWith(process.cwd() + '/node_modules/gear-jenkins/gear-jenkins.sqlite')).to.be.true;
      
      migrateSpy().then(function() {
         expect(migrateSpy.calledWithMatch( { migrationsPath: process.cwd() + '/node_modules/gear-jenkins/migrations' } )).to.be.true;
      });      
   });

   it("do nothing when error occurs on open", function() {
      const openStub = sinon.stub().rejects();
      
      const openSpy = sinon.spy(openStub);
      const migrateSpy = sinon.spy();

      const sqlite = { 'open': openSpy, 'migrate': migrateSpy };

      const db = buildDb(sqlite);
      
      db.startDb();
      
      expect(openSpy.calledWith(process.cwd() + '/node_modules/gear-jenkins/gear-jenkins.sqlite')).to.be.true;
      expect(migrateSpy.calledWithMatch( { migrationsPath: process.cwd() + '/node_modules/gear-jenkins/migrations' } )).to.be.false;
   }); 

   it("do nothing when error occurs on migration", function() {
      const openStub = sinon.stub();
      const migrateStub = sinon.stub().rejects();
      
      const openSpy = sinon.spy(openStub);
      const migrateSpy = sinon.spy(migrateStub);

      const sqlite = { 'open': openSpy, 'migrate': migrateSpy };

      const db = buildDb(sqlite);
      openStub.resolves(sqlite);
      
      db.startDb();
   });   
});

describe('Get data base', function() {
   it("when call getDb", function() {
      const database = sinon.stub();
      const openStub = sinon.stub();
      const migrateStub = sinon.stub().resolves(database);
      
      const openSpy = sinon.spy(openStub);
      const migrateSpy = sinon.spy(migrateStub);

      const sqlite = { 'open': openSpy, 'migrate': migrateSpy };

      const db = buildDb(sqlite);
      openStub.resolves(sqlite);
      
      return db.startDb().then(function() {
         expect(db.getDb()).to.be.deep.equal(database);
      });
   });
});

function buildDb(sqlite) {
   return proxyquire('../src/db', { 'sqlite': sqlite } );
}   
