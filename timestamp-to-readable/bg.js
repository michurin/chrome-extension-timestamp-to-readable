/*
Copyright (c) 2016-2018 Alexey Michurin <a.michurin@gmail.com>.
All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
*/
/*jslint indent: 2, vars: true, plusplus: true */
/*global chrome, JSON, get_state */

(function () {

  'use strict';

  function inject_into_tab(tabid) {  // tabid closure
    get_state(function (v) {
      chrome.tabs.executeScript(tabid, {code: 'var config = ' + JSON.stringify(v) + ';'}, function () {
        chrome.tabs.executeScript(tabid, {file: 'do.js'});
      });
    });
  }

  chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.query({active: true}, function (tabs) {
      var tab, url, i;
      for (i = 0; i < tabs.length; ++i) {
        tab = tabs[i];
        url = tab.url;
        if (url.substr(0, 4) === 'http') {  // cover both http(s)
          inject_into_tab(tab.id);
        } else {
          chrome.tabs.update(tab.id, {url: chrome.extension.getURL('converter-page.html')});  // use getURL for FF compat
        }
      }
    });
  });

}());
