var proxyquire = require('proxyquire').noPreserveCache();
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var authUrl = 'http://jenkins-test.com/token';

describe('Jenkins call job return', function() {
   it("error because url doesn't exists", function() {
      var config = { url: authUrl };

      var dbStub = getDbStub(config);    
      
      var jenkins = getJenkins(dbStub);

      var promisse = jenkins.callJob('test');

      return expect(promisse).
         to.be.rejectedWith('Error: jenkins: job.build: getaddrinfo ENOTFOUND jenkins-test.com jenkins-test.com:80');
   });

   it("error because url is null", function() {
      var config = { url: null };

      var dbStub = getDbStub(config);    
      
      var jenkins = getJenkins(dbStub);

      var promisse = jenkins.callJob('test');

      return expect(promisse).
         to.be.rejectedWith('Error: baseUrl required');
   });

   it("with crumbIssuer when useCSRF is true", function() {
      var config = { url: authUrl, useCSRF: 1 };

      var dbStub = getDbStub(config);    
      
      var jenkins = getJenkins(dbStub);    

      var promisse = jenkins.callJob('test');

      return expect(promisse).
         to.be.rejectedWith('Error: jenkins: job.build: jenkins: crumbIssuer.get: getaddrinfo ENOTFOUND jenkins-test.com jenkins-test.com:80');
   });

   it("without crumbIssuer when CRUMB_ISSUER process env is false", function() {
      var config = { url: authUrl, useCSRF: 0 };

      var dbStub = getDbStub(config);    
      
      var jenkins = getJenkins(dbStub);     

      var promisse = jenkins.callJob('test');

      return expect(promisse).
         to.be.rejectedWith('Error: jenkins: job.build: getaddrinfo ENOTFOUND jenkins-test.com jenkins-test.com:80');
   });

});

function getDbStub(config) {
   var db = {
      get: function() {}
   };
   
   sinon.stub(db, "get").resolves( config );

   var dbStub = function() {
      return db;
   } 

   return dbStub;
}

function getJenkins(dbStub) {
   return proxyquire('../src/jenkins', { './db': { 'getDb': dbStub } } );
}
