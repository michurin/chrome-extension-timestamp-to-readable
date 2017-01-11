/*
Copyright (c) 2016-2017 Alexey Michurin <a.michurin@gmail.com>.
All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
*/
/*jslint indent: 2, vars: true, plusplus: true, node: true */
/*global chrome */

'use strict';

var defaults = {
  local: true,
  utc: true,
  highlight: true,
  fg: '#000000',
  bg: '#ffff00',
  title_mode: true,
  ms_mode: false,
};

var checkbox_ids = ['local', 'utc', 'highlight', 'title_mode', 'ms_mode'];
var color_ids = ['bg', 'fg'];

function get_state(callback) {
  chrome.storage.local.get(defaults, callback);
}
