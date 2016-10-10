var proxyquire = require('proxyquire').noPreserveCache();
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Handle with url configuration', function() {
   var runSpy;
   var dbStub;
   var requestStub;
   
   beforeEach(function() {
      var runStub = sinon.stub().resolves();
      runSpy = sinon.spy(runStub);
      var db = { run: runSpy };
      dbStub = function() { return db; };
      requestStub = sinon.stub().resolves();
   });

   describe("Save option", function() {
      it("with first part when url have a pipe", function() {
         var urlHandler = getUrlHandler(dbStub, requestStub);
         var url = '<http://www.jenkins.com|www.jenkins.com>';

         return urlHandler.handle(url).then(function() {
            expect(runSpy.calledWithExactly('UPDATE config SET url = ?', 'http://www.jenkins.com')).to.be.true;
         });
      });

      it("remove arrows when url do not have a pipe", function() {
         var urlHandler = getUrlHandler(dbStub, requestStub);
         var url = '<http://jenkins.com>';
         
         return urlHandler.handle(url).then(function() {
            expect(runSpy.calledWithExactly('UPDATE config SET url = ?', 'http://jenkins.com')).to.be.true;
         });
      });
   });

   describe("Verify informed url", function() {
      it("and return error message when url do not respond", function() {
         var errorMessage = 'Não consegui verificar a url, algo está errado. :disappointed: Confira se a url está correta.';
         requestStub = sinon.stub().rejects(errorMessage);
         
         var urlHandler = getUrlHandler(dbStub, requestStub);
         
         var promise = urlHandler.handle('url');

         return expect(promise).to.be.rejectedWith(errorMessage);
      });

      it("and return success message when url respond", function() {
         var successMessage = 'A url responde, aparentemente está tudo certo. :champagne:';
         requestStub = sinon.stub().resolves(successMessage);
         
         var urlHandler = getUrlHandler(dbStub, requestStub);
         
         var promise = urlHandler.handle('url');

         return expect(promise).to.be.eventually.equal(successMessage);
      }); 
   });

   describe("Skip configuration", function() {
      it("when get skip word and do not save config", function() {
         var csrfHandler = getUrlHandler(dbStub, requestStub);

         var promise = csrfHandler.handle('pular').then(function() {
            expect(runSpy.called).to.be.false;
         });
         
         return expect(promise).to.be.fulfilled;
      });   
   });
});

function getUrlHandler(dbStub, requestStub) {
   let db = { 'getDb': dbStub };
   let request = { 'get': requestStub};

   let stubs = {
      '../../src/db': db,
      'request-promise': request
   }

   return proxyquire('../../src/configHandler/url-handler', stubs);
}
