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
        downloadTo: '',
        browserstack: {},
        waitTime: 0,
        statusDelay: 10,
        user: '',
        token: ''
      }),
      apiRoot = 'http://www.browserstack.com/screenshots',
      requestScreenshots,
      requestStatus,
      downloadScreenshot,
      taskStatus = {
        ready: {},
        quantity: 0,
        processed: 0,
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

        success(data);
      });
    };

    requestStatus = function(screenshots, success, delay, log) {
      setTimeout(function() {
        var jobId = screenshots.job_id || screenshots.id;

        request({
          url: apiRoot + '/' + jobId
        }, function(err, data) {
          if (err) {
            grunt.log.error('Can not fetch screenshots\' taskStatus.');
            done();
          }

          if (log !== false) {
            var response = JSON.parse(data),
                devices = response.screenshots.map(function(screenshot) {
                  var orientation = screenshot.orientation || 'portrait';

                  return screenshot.device + ' (' + orientation + ')';
                });

            grunt.log.ok(
              'Requests successfully made for: ' + devices + '.'
            );
          }

          success(data);
        });
      }, delay || options.waitTime * 1000);
    };

    pingStatus = function(request, log) {
      if (log !== false) {
        grunt.log.ok(
          'Pinging status of screenshot requests ' +
          '(every ' + options.statusDelay + ' secs).'
        );
      } else {
        grunt.log.write('...');
      }

      request.screenshots.forEach(function(screenshot) {
        if (taskStatus.ready[screenshot.id] === undefined && screenshot.state === 'done') {
          taskStatus.processed++;
          downloadScreenshot(screenshot);
        }
      });

      if (taskStatus.processed !== taskStatus.quantity) {
        setTimeout(function() {
          requestStatus(request, function(data) {
            pingStatus(JSON.parse(data), false);
          }, 0, false);
        }, options.statusDelay * 1000);
      }
    };

    downloadScreenshot = function(screenshot) {
      if (taskStatus.ready[screenshot.id] !== undefined) {
        return false;
      }

      taskStatus.ready[screenshot.id] = screenshot;

      grunt.log.subhead(
        'Status of screenshots changed: ' +
        taskStatus.processed + ' of ' +
        taskStatus.quantity +
        ' ready (' +
        screenshot.device +
        ').'
      );

      wget({
        url: screenshot.image_url,
        dest: options.downloadTo
      }, function() {
        taskStatus.done++;

        if (taskStatus.done === taskStatus.quantity) {
          grunt.log.ok('All screenshots downloaded!');
          done();
        }
      });
    };

    requestScreenshots(function(data) {
      try {
        var screenshotRequest = JSON.parse(data);
      } catch (exception) {
        grunt.log.errorlns(data);
        done();
        return false;
      }

      if (screenshotRequest.errors || screenshotRequest.message) {
        grunt.log.errorlns('BrowserStack request failed due to: ' +  screenshotRequest.message || screenshotRequest.errors);
        done();
        return false;
      }

      taskStatus.quantity = screenshotRequest.screenshots.length;

      requestStatus(screenshotRequest, function(data) {
        var request = JSON.parse(data);

        pingStatus(request);
      });
    });
  });
};
