'use strict';

exports.handle = handle;

var jenkins = require('../../src/jenkins');

function handle(hubot, message, task, params) {
   return start(hubot, message, task, params[0]);
}

function start(hubot, message, task, job) {
   return jenkins.callJob(job).then(function() {
      hubot.talk(message, task.options.message);  
   }, function(error) {
      if (error.notFound) {
         hubot.talk(message, `Sorry I could not find the job *${job}*`);
      } else {
         hubot.detailedError('Error on call Jenkins', error);
         hubot.talk(message, `Sorry I could not start the job *${job}*. See the error in the logs.`);
      }
   });
};    
