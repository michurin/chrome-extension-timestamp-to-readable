/*
Copyright (c) 2016-2017 Alexey Michurin <a.michurin@gmail.com>.
All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
*/
/*jslint indent: 2, vars: true, plusplus: true */
/*global chrome, window, get_state, checkbox_ids, color_ids */

(function () {

  'use strict';

  var document = window.document;

  function update_all() {
    get_state(function (v) {
      checkbox_ids.forEach(function (eid) {
        document.getElementById(eid).checked = v[eid];
      });
      color_ids.forEach(function (eid) {
        document.getElementById(eid).value = v[eid];
      });
    });
  }

  checkbox_ids.forEach(function (eid) {
    var e = document.getElementById(eid);
    e.onchange = function () {
      var v = {};
      v[eid] = !!e.checked;
      chrome.storage.local.set(v);
    };
  });

  color_ids.forEach(function (eid) {
    var e = document.getElementById(eid);
    e.onchange = function () {
      var v = {};
      v[eid] = e.value;
      chrome.storage.local.set(v);
    };
  });

  document.getElementById('reset').onclick = function () {
    chrome.storage.local.clear(update_all);
  };

  update_all();

}());
