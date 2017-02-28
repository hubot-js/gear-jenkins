/* eslint-disable no-unused-expressions */

'use strict';

const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire').noPreserveCache();

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Handle with url configuration', () => {
  let runSpy;
  let dbStub;
  let requestStub;

  const hubot = {
    i18n() {}
  };

  const hubotStub = sinon.stub(hubot, 'i18n');

  beforeEach(() => {
    const runStub = sinon.stub().resolves();
    runSpy = sinon.spy(runStub);
    const db = { run: runSpy };
    dbStub = function getDbStub() { return Promise.resolve(db); };
    requestStub = sinon.stub().resolves();
  });

  describe('Save option', () => {
    it('with first part when url have a pipe', () => {
      const urlHandler = getUrlHandler(dbStub, requestStub);
      const url = '<http://www.jenkins.com|www.jenkins.com>';

      return urlHandler.handle(hubot, url).then(() => {
        expect(runSpy.calledWithExactly('UPDATE config SET url = ?', 'http://www.jenkins.com')).to.be.true;
      });
    });

    it('remove arrows when url do not have a pipe', () => {
      const urlHandler = getUrlHandler(dbStub, requestStub);
      const url = '<http://jenkins.com>';

      return urlHandler.handle(hubot, url).then(() => {
        expect(runSpy.calledWithExactly('UPDATE config SET url = ?', 'http://jenkins.com')).to.be.true;
      });
    });
  });

  describe('Verify informed url', () => {
    it('and return error message when url do not respond', () => {
      const errorMessage = 'jenkins:configuration.url.notResponds';

      requestStub = sinon.stub().rejects(errorMessage);

      const urlHandler = getUrlHandler(dbStub, requestStub);

      const promise = urlHandler.handle(hubot, 'url');

      return expect(promise).to.be.rejectedWith(errorMessage);
    });

    it('and return success message when url respond', () => {
      const successMessage = 'jenkins:configuration.url.responds';
      requestStub = sinon.stub().resolves(successMessage);

      const urlHandler = getUrlHandler(dbStub, requestStub);

      const promise = urlHandler.handle(hubot, 'url');

      return expect(promise).to.be.eventually.equal(successMessage);
    });
  });

  describe('Skip configuration', () => {
    it('when get skip word and do not save config', () => {
      const csrfHandler = getUrlHandler(dbStub, requestStub);

      hubotStub.withArgs('jenkins:configuration.skip').returns('skip');

      const promise = csrfHandler.handle(hubot, 'skip').then(() => {
        expect(runSpy.called).to.be.false;
      });

      return expect(promise).to.be.fulfilled;
    });
  });
});

function getUrlHandler(dbStub, requestStub) {
  const db = { getDb: dbStub };
  const request = { get: requestStub };

  const stubs = {
    '../../src/db': db,
    'request-promise': request
  };

  return proxyquire('../../src/configHandler/url-handler', stubs);
}
