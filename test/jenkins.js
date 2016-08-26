var chai = require('chai');
var expect = chai.expect;

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var sinon = require('sinon');

var authUrl = 'http://jenkins-test.com/token';
process.env.JENKINS_AUTH_URL = authUrl;

var jenkins = require('../src/jenkins');

describe('Jenkins call job return', function() {
   it("error because url doesn't exists", function() {
      var promisse = jenkins.callJob(authUrl, 'test');
      return expect(promisse).
         to.be.rejectedWith('Error: jenkins: job.build: getaddrinfo ENOTFOUND jenkins-test.com jenkins-test.com:80');
   });

   it("with crumbIssuer when CRUMB_ISSUER process env is true", function() {
      process.env.CRUMB_ISSUER = 'true';
      var promisse = jenkins.callJob(authUrl, 'test');

      return expect(promisse).
         to.be.rejectedWith('Error: jenkins: job.build: jenkins: crumbIssuer.get: getaddrinfo ENOTFOUND jenkins-test.com jenkins-test.com:80');
   });

   it("without crumbIssuer when CRUMB_ISSUER process env is false", function() {
      process.env.CRUMB_ISSUER = 'false';
      var promisse = jenkins.callJob(authUrl, 'test');

      return expect(promisse).
         to.be.rejectedWith('Error: jenkins: job.build: getaddrinfo ENOTFOUND jenkins-test.com jenkins-test.com:80');
   });

   it("without crumbIssuer when CRUMB_ISSUER process env does not exists", function() {
      var promisse = jenkins.callJob(authUrl, 'test');

      return expect(promisse).
         to.be.rejectedWith('Error: jenkins: job.build: getaddrinfo ENOTFOUND jenkins-test.com jenkins-test.com:80');
   });

});
