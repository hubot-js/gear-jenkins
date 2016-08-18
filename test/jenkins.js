var chai = require('chai');
var expect = chai.expect;

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var sinon = require('sinon');

var authUrl = 'http://jenkins-test.com/token';
var jenkins = require('../src/jenkins');

describe('Jenkins call job', function() {
   it("should return error because url doesn't exists", function() {
      var promisse = jenkins.callJob(authUrl, 'test');
      return expect(promisse).
         to.be.rejectedWith('Error: jenkins: job.build: getaddrinfo ENOTFOUND jenkins-test.com jenkins-test.com:80');
   });
});
