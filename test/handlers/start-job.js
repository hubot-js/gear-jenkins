const proxyquire = require('proxyquire').noPreserveCache();
const expect  = require('chai').expect;
const sinon = require('sinon');
require('sinon-as-promised');

describe('Call job', function() {
   let hubot;
   let speakSpy;
   let message;
   let task;
   
   beforeEach(function() {
      message = { "user": "hubot", "channel": "myChannel" }; 
      task = { "options": { "message": "Hello World" } };

      hubot = { 
         speak: function () {},
         logDetailedError: function() {}
      };      

      speakSpy = sinon.spy(hubot, "speak");
      logDetailedErrorSpy = sinon.spy(hubot, "logDetailedError");
   });

   describe('with correct parameter', function() {
      it("job name", function() {
         const callJobStub = sinon.stub().resolves();
         const callJobSpy = sinon.spy(callJobStub);

         const startJob = getStartJob(callJobSpy);
         
         return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
            expect(callJobSpy.calledWith('deploy-job')).to.be.true;
         });
      });
   })   

   describe('with success', function() {
      
      it("post message with task message", function() {
         const callJobStub = sinon.stub().resolves();
         const startJob = getStartJob(callJobStub);
         
         return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
            expect(speakSpy.calledWith(message, task.options.message)).to.be.true;
         }); 
      });
   
   });

   describe('with error', function() {

      describe('job does not exists', function() {
      
         it("post message with job not found message", function() {
            const callJobStub = sinon.stub().rejects( { notFound: true } );
            const startJob = getStartJob(callJobStub);
            
            return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
               expect(speakSpy.calledWith(message, 'Sorry I could not find the job *deploy-job*')).to.be.true;
            }); 
         });

      });

      describe('not known', function() {         

         it("post message with general error message", function() {
            const callJobStub = sinon.stub().rejects( {  } );
            const startJob = getStartJob(callJobStub);
            
            return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
               expect(speakSpy.calledWith(message, 'Sorry I could not start the job *deploy-job*. See the error in the logs.')).to.be.true;
            }); 
         });

         it("and log error", function() {
            const error = {};
            const callJobStub = sinon.stub().rejects(error);
            const startJob = getStartJob(callJobStub);
            
            return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
               expect(logDetailedErrorSpy.calledWith('Error on call Jenkins', error)).to.be.true;
            }); 
         });

      });
   
   });

   function getStartJob(callJobStub) {
      return proxyquire('../../src/handlers/start-job', { '../../src/jenkins': { 'callJob': callJobStub} } );
   }

});
