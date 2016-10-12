var proxyquire = require('proxyquire').noPreserveCache();
var expect  = require('chai').expect;
var sinon = require('sinon');
require('sinon-as-promised');

describe('Call job', function() {
   var hubot;
   var speakSpy;
   var message;
   var task;
   
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
         var callJobStub = sinon.stub().resolves();
         var callJobSpy = sinon.spy(callJobStub);

         var startJob = getStartJob(callJobSpy);
         
         return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
            expect(callJobSpy.calledWith('deploy-job')).to.be.true;
         });
      });
   })   

   describe('with success', function() {
      
      it("post message with task message", function() {
         var callJobStub = sinon.stub().resolves();
         var startJob = getStartJob(callJobStub);
         
         return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
            expect(speakSpy.calledWith(message, task.options.message)).to.be.true;
         }); 
      });
   
   });

   describe('with error', function() {

      describe('job does not exists', function() {
      
         it("post message with job not found message", function() {
            var callJobStub = sinon.stub().rejects( { notFound: true } );
            var startJob = getStartJob(callJobStub);
            
            return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
               expect(speakSpy.calledWith(message, 'Sorry I could not find the job *deploy-job*')).to.be.true;
            }); 
         });

      });

      describe('not known', function() {         

         it("post message with general error message", function() {
            var callJobStub = sinon.stub().rejects( {  } );
            var startJob = getStartJob(callJobStub);
            
            return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
               expect(speakSpy.calledWith(message, 'Sorry I could not start the job *deploy-job*. See the error in the logs.')).to.be.true;
            }); 
         });

         it("and log error", function() {
            var error = {};
            var callJobStub = sinon.stub().rejects(error);
            var startJob = getStartJob(callJobStub);
            
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
