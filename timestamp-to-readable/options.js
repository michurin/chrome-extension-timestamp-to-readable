/*
Copyright (c) 2016-2020 Alexey Michurin <a.michurin@gmail.com>.
All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
*/

(function () {
  const { document } = window;

  function updateAll() {
    getState((v) => {
      checkboxIDs.forEach((eid) => {
        document.getElementById(eid).checked = v[eid];
        if (eid === 'title_mode') { // slightly hakish
          document.getElementById('individual_title_mode').disabled = !v[eid];
        }
      });
      colorIDs.forEach((eid) => {
        document.getElementById(eid).value = v[eid];
      });
    });
  }

  checkboxIDs.forEach((eid) => {
    const e = document.getElementById(eid);
    e.onchange = function () {
      const v = {};
      v[eid] = !!e.checked;
      chrome.storage.local.set(v);
      updateAll(); // slightly overkill
    };
  });

  colorIDs.forEach((eid) => {
    const e = document.getElementById(eid);
    e.onchange = function () {
      const v = {};
      v[eid] = e.value;
      chrome.storage.local.set(v);
    };
  });

  document.getElementById('reset').onclick = function () {
    chrome.storage.local.clear(updateAll);
  };

  updateAll();
}());
