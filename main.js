/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */

/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

/* global chrome */


// things to store:
// username/pw, remember me checkbox for: tidepool
// information for individual devices is stored by device ID
// default server
// timezone

// these are the 'global' values we always want to be available
// you can also save/restore other values (and should, for device details)

var defaultStorage = {
  tidepool: {
    username: '',
    password: '',
    remember_me: false
  },
  defaultServer: 'local',
  timezone: 'America/Los_Angeles',
  dexcomPortPattern: '/dev/cu.usbmodem.+',
  FTDIPortPattern: '/dev/cu.usbserial.+',
  forceDeviceIDs: []
};

chrome.app.runtime.onLaunched.addListener(function(launchData) {
  // launchData.url, if it exists, contains the link clicked on by
  // the user in blip. We could use it for login if we wanted to.
  console.log('launchData: ', launchData);
  var token = null;
  if (launchData.id && launchData.id === 'open_uploader') {
    var pat = /^[^?]+\?(.*)/;
    var query = launchData.url.match(pat)[1];
    if (query) {
      var parms = query.split('&');
      for (var p=0; p<parms.length; ++p) {
        var s = parms[p].split('=');
        console.log(s);
        if (s[0] === 'token') {
          token = s[1];
          break;
        }
      }
    }
    if (token) {
      console.log('got a token ', token);
      // now save the token where we can use it
    }
  }
  // Center window on screen.
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = 650;
  var height = 680;

  chrome.app.window.create('index.html', {
    id: 'tidepoolUniversalUploader',
    innerBounds: {
      width: width,
      height: height,
      left: Math.round((screenWidth-width)/2),
      top: Math.round((screenHeight-height)/2),
      minWidth: width,
      minHeight: height
    }
  }, function(createdWindow) {
    createdWindow.show();
    createdWindow.contentWindow.localSave = function() {};
    createdWindow.contentWindow.localLoad = function() {};
  });
});
