/*
* grunt-browsersnapsy
* https://github.com/tdeekens/grunt-browsersnapsy
*
* Copyright (c) 2014 tdeekens
* Licensed under the MIT license.
*/

'use strict';

var curl = require('curlrequest'),
    wget = require('wgetjs');

module.exports = function(grunt) {
  grunt.registerMultiTask('browsersnapsy', 'Take screenshots via BrowserStack.', function() {
    var
      options = this.options({
        urls: [
          'www.google.de'
        ],
        downloadTo: '',
        browserstack: {},
        waitTime: 0,
        statusDelay: 5,
        user: '',
        token: ''
      }),
      apiRoot = 'http://www.browserstack.com/screenshots',
      requestScreenshots,
      requestStatus,
      downloadScreenshot,
      taskStatus = {
        ready: [],
        quantity: 0,
        done: 0
      },
      pingStatus,
      done = this.async();

    var
      request = curl.request({
        url: apiRoot,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        user: options.user + ':' + options.token,
        verbose: true,
        stderr: true
      });

    requestScreenshots = function(success) {
      request({
        data: JSON.stringify(options.browserstack)
      }, function(err, data) {
        if (err) {
          grunt.log.error('Screenshots requested failed.');
          done();
        }

        grunt.log.subhead('Requesting screenshots finished.');

        success(data)
      });
    };

    requestStatus = function(screenshots, success, delay) {
      setTimeout(function() {
        var jobId = screenshots.job_id || screenshots.id;
        request({
          url: apiRoot + '/' + jobId
        }, function(err, data) {
          if (err) {
            grunt.log.error('Can not fetch screenshots\' taskStatus.');
            done();
          }

          success(data);
        });
      }, delay || options.waitTime * 1000);
    };

    pingStatus = function(request) {
      grunt.log.ok('Pinging status of screenshot requests...');

      request.screenshots.forEach(function(screenshot, idx) {
        if (screenshot.state === 'done') {
          downloadScreenshot(screenshot);
        } else {
          if (taskStatus.ready.length !== taskStatus.quantity) {
            setTimeout(function() {
              requestStatus(request, function(data) {
                pingStatus(JSON.parse(data));
              }, 0);
            }, options.statusDelay * 1000);
          }
        }
      });
    };

    downloadScreenshot = function(screenshot) {
      if (taskStatus.ready.indexOf(screenshot.id) >= 0) {
        return;
      }

      taskStatus.ready.push(screenshot);

      grunt.log.subhead(
        'Status of screenshots changed: ' +
        taskStatus.ready.length + ' of ' +
        taskStatus.quantity +
        ' ready!'
      );

      if (taskStatus.ready.length === taskStatus.quantity) {
        taskStatus.ready.forEach(function(screenshot) {
          wget({
            url: screenshot.image_url,
            dest: options.downloadTo
          }, function() {
            taskStatus.done++

            if (taskStatus.done === taskStatus.quantity) {
              grunt.log.ok('All screenshots downloaded!');
              done();
            }
          });
        });
      }
    };

    requestScreenshots(function(data) {
      var screenshotRequest = JSON.parse(data);

      if (screenshotRequest.errors) {
        grunt.log.errorlns('BrowserStack request failed due to: ' + screenshotRequest.errors);
      }

      taskStatus.quantity = screenshotRequest.screenshots.length;

      requestStatus(screenshotRequest, function(data) {
        var request = JSON.parse(data);

        pingStatus(request);
      });
    });
  });
};
