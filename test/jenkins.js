/* eslint-disable no-unused-expressions */

'use strict';

require('sinon-as-promised');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire').noPreserveCache();

const expect = chai.expect;
chai.use(chaiAsPromised);

const authUrl = 'http://jenkins-test.com/token';

describe('Jenkins call job return', () => {
  it("error because url doesn't exists", () => {
    const config = { url: authUrl };

    const dbStub = getDbStub(config);

    const jenkins = getJenkins(dbStub);

    const promisse = jenkins.callJob('test');

    return expect(promisse)
         .to.be.rejectedWith('Error: jenkins: job.build: getaddrinfo ENOTFOUND jenkins-test.com jenkins-test.com:80');
  });

  it('error because url is null', () => {
    const config = { url: null };

    const dbStub = getDbStub(config);

    const jenkins = getJenkins(dbStub);

    const promisse = jenkins.callJob('test');

    return expect(promisse)
         .to.be.rejectedWith('Error: baseUrl required');
  });

  it('with crumbIssuer when useCSRF is true', () => {
    const config = { url: authUrl, useCSRF: 1 };

    const dbStub = getDbStub(config);

    const jenkins = getJenkins(dbStub);

    const promisse = jenkins.callJob('test');

    return expect(promisse)
         .to.be.rejectedWith('Error: jenkins: job.build: jenkins: crumbIssuer.get: getaddrinfo' +
                             ' ENOTFOUND jenkins-test.com jenkins-test.com:80');
  });

  it('without crumbIssuer when CRUMB_ISSUER process env is false', () => {
    const config = { url: authUrl, useCSRF: 0 };

    const dbStub = getDbStub(config);

    const jenkins = getJenkins(dbStub);

    const promisse = jenkins.callJob('test');

    return expect(promisse)
         .to.be.rejectedWith('Error: jenkins: job.build: getaddrinfo ENOTFOUND jenkins-test.com jenkins-test.com:80');
  });
});

function getDbStub(config) {
  const db = {
    get() {}
  };

  sinon.stub(db, 'get').resolves(config);

  const dbStub = function buildDbStub() {
    return db;
  };

  return dbStub;
}

function getJenkins(dbStub) {
  return proxyquire('../src/jenkins', { './db': { getDb: dbStub } });
}
