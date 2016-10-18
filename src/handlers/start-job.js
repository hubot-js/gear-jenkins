'use strict';

const jenkins = require('../../src/jenkins');

exports.handle = handle;

function handle(hubot, message, task, params) {
  return start(hubot, message, task, params[0]);
}

function start(hubot, message, task, job) {
  return jenkins.callJob(job).then(() => {
    hubot.speak(message, task.options.message);
  }, (error) => {
    if (error.notFound) {
      hubot.speak(message, `Sorry I could not find the job *${job}*`);
    } else {
      hubot.logDetailedError('Error on call Jenkins', error);
      hubot.speak(message, `Sorry I could not start the job *${job}*. See the error in the logs.`);
    }
  });
}
