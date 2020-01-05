/*
Copyright (c) 2016-2020 Alexey Michurin <a.michurin@gmail.com>.
All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
*/

(function () {
  function injectIntoTab(tabid) { // tabid closure
    getState((v) => {
      chrome.tabs.executeScript(tabid, { code: `var config = ${JSON.stringify(v)};` }, () => {
        chrome.tabs.executeScript(tabid, { file: 'do.js' });
      });
    });
  }

  chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.query({ active: true }, (tabs) => {
      let tab;
      let url;
      let url4;
      let i;
      for (i = 0; i < tabs.length; ++i) {
        tab = tabs[i];
        ({ url } = tab);
        if (url === undefined) { // url can be undefined for windows with another profile
          continue;
        }
        url4 = url.substr(0, 4);
        if (url4 === 'http' || url4 === 'file') { // cover both http(s)
          injectIntoTab(tab.id);
        } else {
          chrome.tabs.update(tab.id, { url: chrome.extension.getURL('converter-page.html') }); // use getURL for FF compat
        }
      }
    });
  });
}());
