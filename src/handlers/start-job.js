'use strict';

exports.handle = handle;

var authUrl = process.env.JENKINS_AUTH_URL;

var jenkins = require('../../src/jenkins');

function handle(hubot, message, task, params) {
   return start(hubot, message, task, params[0]);
}

function start(hubot, message, task, job) {
   var recipient = hubot.getRecipient(message);

   return jenkins.callJob(authUrl, job).then(function() {
      hubot.postMessage(recipient, task.options.message, {as_user: true});  
   }, function(error) {
      if (error.notFound) {
         hubot.postMessage(recipient, `Sorry I could not find the job *${job}*`, {as_user: true});
      } else {
         hubot.postMessage(recipient, `Sorry I could not start the job *${job}*. See the error in the logs.`, {as_user: true});
      }
   });
};
