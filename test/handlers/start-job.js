var proxyquire = require('proxyquire').noPreserveCache();
var chai = require("chai");
var expect = chai.expect;
var sinon = require('sinon');
require('sinon-as-promised');

describe('Call job', function() {
   var hubot;
   var postMessageSpy;
   var message;
   var task;
   var authUrl = 'http://jenkins.test.com:8080';
   process.env.JENKINS_AUTH_URL = authUrl;

   beforeEach(function() {
      message = { "user": "hubot", "channel": "myChannel" }; 
      task = { "options": { "message": "Hello World" } };

      hubot = { 
         postMessage: function () {},
         detailedError: function() {},
         _isPrivateConversation: function () {},
         getRecipient: function() { return message.channel }
      };      

      postMessageSpy = sinon.spy(hubot, "postMessage");
      detailedErrorSpy = sinon.spy(hubot, "detailedError");
   });

   describe('with correct parameters', function() {
      it("authUrl and job name", function() {
         var callJobStub = sinon.stub().resolves();
         var callJobSpy = sinon.spy(callJobStub);

         var startJob = getStartJob(callJobSpy);
         
         return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
            expect(callJobSpy.calledWith(authUrl, 'deploy-job')).to.be.true;
         });
      });
   })   

   describe('with success', function() {
      
      it("post message with task message", function() {
         var callJobStub = sinon.stub().resolves();
         var startJob = getStartJob(callJobStub);
         
         return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
            expect(postMessageSpy.calledWith(message.channel, task.options.message, {as_user: true})).to.be.true;
         }); 
      });
   
   });

   describe('with error', function() {

      describe('job does not exists', function() {
      
         it("post message with job not found message", function() {
            var callJobStub = sinon.stub().rejects( { notFound: true } );
            var startJob = getStartJob(callJobStub);
            
            return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
               expect(postMessageSpy.calledWith(message.channel, 'Sorry I could not find the job *deploy-job*', {as_user: true})).to.be.true;
            }); 
         });

      });

      describe('not known', function() {         

         it("post message with general error message", function() {
            var callJobStub = sinon.stub().rejects( {  } );
            var startJob = getStartJob(callJobStub);
            
            return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
               expect(postMessageSpy.calledWith(message.channel, 'Sorry I could not start the job *deploy-job*. See the error in the logs.', {as_user: true})).to.be.true;
            }); 
         });

         it("and log error", function() {
            var error = {};
            var callJobStub = sinon.stub().rejects(error);
            var startJob = getStartJob(callJobStub);
            
            return startJob.handle(hubot, message, task, ['deploy-job']).then(function() {
               expect(detailedErrorSpy.calledWith('Error on call Jenkins', error)).to.be.true;
            }); 
         });

      });
   
   });

   function getStartJob(callJobStub) {
      return proxyquire('../../src/handlers/start-job', { '../../src/jenkins': { 'callJob': callJobStub} } );
   }

});
