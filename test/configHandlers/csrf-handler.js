var proxyquire = require('proxyquire').noPreserveCache();
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Handle with csrf configuration', function() {
   var runSpy;
   var dbStub;
   
   beforeEach(function() {
      var runStub = sinon.stub().resolves();
      runSpy = sinon.spy(runStub);
      var db = { run: runSpy };
      dbStub = function() { return db; }
   });

   describe("Save option", function() {
      it("with true when csrf is used", function() {
         var csrfHandler = getCsrfHandler(dbStub);

         return csrfHandler.handle('Sim').then(function() {
            expect(runSpy.calledWithExactly('UPDATE config SET useCSRF = ?', true)).to.be.true;
         });
      });

      it("with false when csrf is not used", function() {
         var csrfHandler = getCsrfHandler(dbStub);

         return csrfHandler.handle('Não').then(function() {
            expect(runSpy.calledWithExactly('UPDATE config SET useCSRF = ?', false)).to.be.true;
         });
      });
   });

   describe("Skip configuration", function() {
      it("when get skip word and do not save config", function() {
      var csrfHandler = getCsrfHandler(dbStub);

      var promise = csrfHandler.handle('pular').then(function() {
         expect(runSpy.called).to.be.false;
      });
      
      return expect(promise).to.be.fulfilled;
      });   
   });
});

function getCsrfHandler(dbStub) {
   return proxyquire('../../src/configHandler/csrf-handler', { '../../src/db': { 'getDb': dbStub } } );
}
