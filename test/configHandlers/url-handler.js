const proxyquire = require('proxyquire').noPreserveCache();
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Handle with url configuration', function() {
   let runSpy;
   let dbStub;
   let requestStub;
   
   beforeEach(function() {
      const runStub = sinon.stub().resolves();
      runSpy = sinon.spy(runStub);
      const db = { run: runSpy };
      dbStub = function() { return db; };
      requestStub = sinon.stub().resolves();
   });

   describe("Save option", function() {
      it("with first part when url have a pipe", function() {
         const urlHandler = getUrlHandler(dbStub, requestStub);
         const url = '<http://www.jenkins.com|www.jenkins.com>';

         return urlHandler.handle(url).then(function() {
            expect(runSpy.calledWithExactly('UPDATE config SET url = ?', 'http://www.jenkins.com')).to.be.true;
         });
      });

      it("remove arrows when url do not have a pipe", function() {
         const urlHandler = getUrlHandler(dbStub, requestStub);
         const url = '<http://jenkins.com>';
         
         return urlHandler.handle(url).then(function() {
            expect(runSpy.calledWithExactly('UPDATE config SET url = ?', 'http://jenkins.com')).to.be.true;
         });
      });
   });

   describe("Verify informed url", function() {
      it("and return error message when url do not respond", function() {
         const errorMessage = 'Não consegui verificar a url, algo está errado. :disappointed: Confira se a url está correta.';
         requestStub = sinon.stub().rejects(errorMessage);
         
         const urlHandler = getUrlHandler(dbStub, requestStub);
         
         const promise = urlHandler.handle('url');

         return expect(promise).to.be.rejectedWith(errorMessage);
      });

      it("and return success message when url respond", function() {
         const successMessage = 'A url responde, aparentemente está tudo certo. :champagne:';
         requestStub = sinon.stub().resolves(successMessage);
         
         const urlHandler = getUrlHandler(dbStub, requestStub);
         
         const promise = urlHandler.handle('url');

         return expect(promise).to.be.eventually.equal(successMessage);
      }); 
   });

   describe("Skip configuration", function() {
      it("when get skip word and do not save config", function() {
         const csrfHandler = getUrlHandler(dbStub, requestStub);

         const promise = csrfHandler.handle('pular').then(function() {
            expect(runSpy.called).to.be.false;
         });
         
         return expect(promise).to.be.fulfilled;
      });   
   });
});

function getUrlHandler(dbStub, requestStub) {
   const db = { 'getDb': dbStub };
   const request = { 'get': requestStub};

   const stubs = {
      '../../src/db': db,
      'request-promise': request
   }

   return proxyquire('../../src/configHandler/url-handler', stubs);
}
