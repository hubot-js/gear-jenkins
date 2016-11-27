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

describe('Jenkins call job', () => {
  it('with the the correct job name', () => {
    const config = { url: authUrl };

    const dbStub = getDbStub(config);
    const buildStub = sinon.stub().resolves();
    const buildSpy = sinon.spy(buildStub);
    const jobStub = { build: buildSpy };
    const infoStub = sinon.stub().resolves({ useCrumbs: true });

    const jenkins = getJenkins(dbStub, jobStub, infoStub);

    return jenkins.callJob('build-test').then(() => {
      expect(buildSpy.calledWith('build-test')).to.be.true;
    });
  });
});

function getDbStub(config) {
  const db = { get() {} };

  sinon.stub(db, 'get').resolves(config);

  const dbStub = function buildDbStub() {
    return Promise.resolve(db);
  };

  return dbStub;
}

function getJenkins(dbStub, jobStub, infoStub) {
  function jenkinsStub() {
    return {
      job: jobStub,
      info: infoStub
    };
  }

  return proxyquire('../src/jenkins', {
    './db': { getDb: dbStub },
    jenkins: jenkinsStub
  });
}
