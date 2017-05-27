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
      hubot.speak(message, 'jenkins:notFoundedJob', { job });
    } else {
      hubot.logDetailedError('jenkins:log.error.onCall', error);
      hubot.speak(message, 'jenkins:errorOnStartJob', { job });
    }
  });
}
