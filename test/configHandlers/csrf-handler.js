const proxyquire = require('proxyquire').noPreserveCache();
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Handle with csrf configuration', function() {
   let runSpy;
   let dbStub;
   
   beforeEach(function() {
      const runStub = sinon.stub().resolves();
      runSpy = sinon.spy(runStub);
      const db = { run: runSpy };
      dbStub = function() { return db; }
   });

   describe("Save option", function() {
      it("with true when csrf is used", function() {
         const csrfHandler = getCsrfHandler(dbStub);

         return csrfHandler.handle('Sim').then(function() {
            expect(runSpy.calledWithExactly('UPDATE config SET useCSRF = ?', true)).to.be.true;
         });
      });

      it("with false when csrf is not used", function() {
         const csrfHandler = getCsrfHandler(dbStub);

         return csrfHandler.handle('Não').then(function() {
            expect(runSpy.calledWithExactly('UPDATE config SET useCSRF = ?', false)).to.be.true;
         });
      });
   });

   describe("Skip configuration", function() {
      it("when get skip word and do not save config", function() {
      const csrfHandler = getCsrfHandler(dbStub);

      const promise = csrfHandler.handle('pular').then(function() {
         expect(runSpy.called).to.be.false;
      });
      
      return expect(promise).to.be.fulfilled;
      });   
   });
});

function getCsrfHandler(dbStub) {
   return proxyquire('../../src/configHandler/csrf-handler', { '../../src/db': { 'getDb': dbStub } } );
}
