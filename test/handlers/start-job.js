/* eslint-disable no-unused-expressions */

'use strict';

const chai = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire').noPreserveCache();

const expect = chai.expect;

describe('Call job', () => {
  let hubot;
  let speakSpy;
  let logDetailedErrorSpy;
  let message;
  let task;

  beforeEach(() => {
    message = { user: 'hubot', channel: 'myChannel' };
    task = { options: { message: 'Hello World' } };

    hubot = {
      speak () {},
      logDetailedError() {}
    };

    speakSpy = sinon.spy(hubot, 'speak');
    logDetailedErrorSpy = sinon.spy(hubot, 'logDetailedError');
  });

  describe('with correct parameter', () => {
    it('job name', () => {
      const callJobStub = sinon.stub().resolves();
      const callJobSpy = sinon.spy(callJobStub);

      const startJob = getStartJob(callJobSpy);

      return startJob.handle(hubot, message, task, ['deploy-job']).then(() => {
        expect(callJobSpy.calledWith('deploy-job')).to.be.true;
      });
    });
  });

  describe('with success', () => {
    it('post message with task message', () => {
      const callJobStub = sinon.stub().resolves();
      const startJob = getStartJob(callJobStub);

      return startJob.handle(hubot, message, task, ['deploy-job']).then(() => {
        expect(speakSpy.calledWith(message, task.options.message)).to.be.true;
      });
    });
  });

  describe('with error', () => {
    describe('job does not exists', () => {
      it('post message with job not found message', () => {
        const callJobStub = sinon.stub().rejects({ notFound: true });
        const startJob = getStartJob(callJobStub);

        return startJob.handle(hubot, message, task, ['deploy-job']).then(() => {
          expect(speakSpy.calledWith(message, 'jenkins:notFoundedJob')).to.be.true;
        });
      });
    });

    describe('not known', () => {
      it('post message with general error message', () => {
        const callJobStub = sinon.stub().rejects({ });
        const startJob = getStartJob(callJobStub);

        return startJob.handle(hubot, message, task, ['deploy-job']).then(() => {
          expect(speakSpy.calledWith(message, 'jenkins:errorOnStartJob')).to.be.true;
        });
      });

      it('and log error', () => {
        const error = {};
        const callJobStub = sinon.stub().rejects(error);
        const startJob = getStartJob(callJobStub);

        return startJob.handle(hubot, message, task, ['deploy-job']).then(() => {
          expect(logDetailedErrorSpy.calledWith('jenkins:log.error.onCall', error)).to.be.true;
        });
      });
    });
  });

  function getStartJob(callJobStub) {
    return proxyquire('../../src/handlers/start-job', { '../../src/jenkins': { callJob: callJobStub } });
  }
});
