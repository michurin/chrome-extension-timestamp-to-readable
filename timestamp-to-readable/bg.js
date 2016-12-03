/*
Copyright (c) 2016 Alexey Michurin <a.michurin@gmail.com>.
All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
*/
/*jslint indent: 2, vars: true */
/*global chrome, JSON, get_state */

(function () {

  'use strict';

  chrome.browserAction.onClicked.addListener(function () {
    get_state(function (v) {
      chrome.tabs.executeScript(null, {code: 'var config = ' + JSON.stringify(v) + ';'}, function () {
        chrome.tabs.executeScript(null, {file: 'do.js'});
      });
    });
  });

}());
