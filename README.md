# gear-jenkins
[![Build Status](https://travis-ci.org/hubot-js/gear-jenkins.svg?branch=master)](https://travis-ci.org/hubot-js/gear-jenkins)  [![npm](https://img.shields.io/npm/v/gear-jenkins.svg)](https://www.npmjs.com/package/gear-jenkins)   [![Coverage Status](https://coveralls.io/repos/github/hubot-js/gear-jenkins/badge.svg?branch=master)](https://coveralls.io/github/hubot-js/gear-jenkins?branch=master)   [![Code Climate](https://img.shields.io/codeclimate/github/hubot-js/gear-jenkins.svg)](https://codeclimate.com/github/hubot-js/gear-jenkins)  [![dependencies Status](https://david-dm.org/hubot-js/gear-jenkins/status.svg)](https://david-dm.org/hubot-js/gear-jenkins)  [![devDependencies Status](https://david-dm.org/hubot-js/gear-jenkins/dev-status.svg)](https://david-dm.org/hubot-js/gear-jenkins?type=dev)

> A Hubot Gear for handle Jenkins tasks

This is a gear to add to [hubot.js](https://github.com/hubot-js/hubot.js) the ability to interact with [Jenkins](https://jenkins.io/). If you do not know the hubot.js or do not know what they are gears like this [click here](https://github.com/hubot-js/hubot.js/blob/master/README.md) for more details.

![start-deploy-gif](https://s10.postimg.org/jl5ptldnt/hubot_start_deploy2.gif)

## Starting

To use this gear you must first activate it with the command:

```
activate jenkins
```
//gif

## Configurations

Some settings are required. They can be made by Slack using the following command:

```
configure jenkins
```
//gif

These settings are stored, so you just need to do them once. But if necessary can make them again.

Below are the details about each setting:

### Jenkins url

If you use Jenkins without security (authentication) the authorization link is simply the access url. For example: `http://your.jenkins.com:8080`

If you use the Jenkins authentication, you need to find your access token. It can be obtained from `yourJenkinsUrl/me/configure`. See more details [here](https://wiki.jenkins-ci.org/display/JENKINS/Authenticating+scripted+clients). In this case your authorization link should be in this format: `http://your_user:your_token@your_jenkins_url`

### CSRF Protection

If you use the Jenkins secure option ["Prevent Cross Site Request Forgery exploits"](https://wiki.jenkins-ci.org/display/JENKINS/Remote+access+API) you should inform this to the hubot.js. By default this configuration is false.

## Usage

When hubot.js starts you can call Jenkins of jobs writing the following sentence. Replace "my-deploy" with the name of your job. 

```
hubot start job my-deploy
```

![start-deploy](https://s9.postimg.org/g9dt1se9b/hubot_job.png)

## Development setup
- Fork and clone this project
- In the main directory run ```npm install```to install dependencies.
- Write your code. More Jenkins functions can be found [here](https://github.com/silas/node-jenkins).
- To run tests use ```npm test``` command

## Meta
Robson Bittencourt - @rluizv - robson.luizv@gmail.com

Distributed under the MIT license. See [LICENSE](LICENSE) for more information.

https://github.com/robsonbittencourt/gear-jenkins
