/*
Copyright (c) 2016-2020 Alexey Michurin <a.michurin@gmail.com>.
All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
*/


const defaults = {
  local: true,
  utc: true,
  highlight: true,
  fg: '#000000',
  bg: '#ffff00',
  title_mode: true,
  individual_title_mode: true,
  ms_mode: false,
  cs_mode: false,
  ns_mode: false,
};

const checkboxIDs = ['local', 'utc', 'highlight', 'title_mode', 'individual_title_mode', 'ms_mode', 'cs_mode', 'ns_mode'];
const colorIDs = ['bg', 'fg'];

function getState(callback) {
  chrome.storage.local.get(defaults, callback);
}
