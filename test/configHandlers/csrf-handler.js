/* eslint-disable no-unused-expressions */

'use strict';

const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const proxyquire = require('proxyquire').noPreserveCache();

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Handle with csrf configuration', () => {
  let runSpy;
  let dbStub;

  beforeEach(() => {
    const runStub = sinon.stub().resolves();
    runSpy = sinon.spy(runStub);
    const db = { run: runSpy };
    dbStub = function getDbStub() { return db; };
  });

  describe('Save option', () => {
    it('with true when csrf is used', () => {
      const csrfHandler = getCsrfHandler(dbStub);

      return csrfHandler.handle('Sim').then(() => {
        expect(runSpy.calledWithExactly('UPDATE config SET useCSRF = ?', true)).to.be.true;
      });
    });

    it('with false when csrf is not used', () => {
      const csrfHandler = getCsrfHandler(dbStub);

      return csrfHandler.handle('Não').then(() => {
        expect(runSpy.calledWithExactly('UPDATE config SET useCSRF = ?', false)).to.be.true;
      });
    });
  });

  describe('Skip configuration', () => {
    it('when get skip word and do not save config', () => {
      const csrfHandler = getCsrfHandler(dbStub);

      const promise = csrfHandler.handle('pular').then(() => {
        expect(runSpy.called).to.be.false;
      });

      return expect(promise).to.be.fulfilled;
    });
  });
});

function getCsrfHandler(dbStub) {
  return proxyquire('../../src/configHandler/csrf-handler', { '../../src/db': { getDb: dbStub } });
}
