var proxyquire = require('proxyquire').noPreserveCache();
var expect  = require('chai').expect;
var sinon = require('sinon');
require('sinon-as-promised');

describe('Data base creation', function() {
   it("should open db and run migrations scripts", function() {
      var openStub = sinon.stub();
      var migrateStub = sinon.stub().resolves();
      
      var openSpy = sinon.spy(openStub);
      var migrateSpy = sinon.spy(migrateStub);

      var sqlite =  { 'open': openSpy, 'migrate': migrateSpy };

      var db = buildDb(sqlite);
      openStub.resolves(sqlite);
      
      db.getDb();
      expect(openSpy.calledWith(process.cwd() + '/node_modules/gear-jenkins/gear-jenkins.sqlite')).to.be.true;
      
      migrateSpy().then(function() {
         expect(migrateSpy.calledWithMatch( { migrationsPath: process.cwd() + '/node_modules/gear-jenkins/migrations' } )).to.be.true;
      });      
   });

   it("do nothing when error occurs on open", function() {
      var openStub = sinon.stub();
      var migrateStub = sinon.stub().resolves();
      
      var openSpy = sinon.spy(openStub);
      var migrateSpy = sinon.spy(migrateStub);

      var sqlite =  { 'open': openSpy, 'migrate': migrateSpy };

      var db = buildDb(sqlite);
      openStub.rejects();
      
      db.getDb();
      
      expect(openSpy.calledWith(process.cwd() + '/node_modules/gear-jenkins/gear-jenkins.sqlite')).to.be.true;
      expect(migrateSpy.calledWithMatch( { migrationsPath: process.cwd() + '/node_modules/gear-jenkins/migrations' } )).to.be.false;
   }); 

   it("do nothing when error occurs on migration", function() {
      var openStub = sinon.stub();
      var migrateStub = sinon.stub().rejects();
      
      var openSpy = sinon.spy(openStub);
      var migrateSpy = sinon.spy(migrateStub);

      var sqlite =  { 'open': openSpy, 'migrate': migrateSpy };

      var db = buildDb(sqlite);
      openStub.resolves(sqlite);
      
      db.getDb();
   });   
});

function buildDb(sqlite) {
   return proxyquire('../src/db', { 'sqlite': sqlite } );
}   
