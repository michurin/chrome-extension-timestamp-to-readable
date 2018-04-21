/*
Copyright (c) 2016-2018 Alexey Michurin <a.michurin@gmail.com>.
All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
*/
/*jslint indent: 2, vars: true, plusplus: true, regexp: true */
/*global document, get_state */


'use strict';


var inputarea = document.getElementById('inputarea');
var cleanbutton = document.getElementById('cleanbutton');
var outputarea = document.getElementById('outputarea');
var timestamp_re = /[0-9]{13,16}/g;
var timer_id;


function zpad(v) {
  return ('0' + v).slice(-2);
}


function fmt(dt, sfx) {
  var p = 'get' + sfx;
  return (
    dt[p + 'FullYear']() + '-' +
    zpad(dt[p + 'Month']() + 1) + '-' +
    zpad(dt[p + 'Date']()) + ' ' +
    zpad(dt[p + 'Hours']()) + ':' +
    zpad(dt[p + 'Minutes']()) + ':' +
    zpad(dt[p + 'Seconds']())
  );
}


function create_td(text) {
  var td = document.createElement('td');
  if (text) {
    td.innerText = text;
  } else {
    td.classList.add('wide');
  }
  return td;
}


function create_tr(ts) {
  var tr = document.createElement('tr');
  tr.appendChild(create_td(Math.floor(ts / 1000)));
  tr.appendChild(create_td());
  tr.appendChild(create_td(fmt(new Date(ts), 'UTC') + ' UTC'));
  tr.appendChild(create_td());
  tr.appendChild(create_td(fmt(new Date(ts), '')));
  return tr;
}


function clean_outputarea() {
  while (outputarea.firstChild) {
    outputarea.removeChild(outputarea.firstChild);
  }
}


function process_inputarea(settings) {
  var timestamp, i, value, values = inputarea.value.split(/[^0-9]+/);
  clean_outputarea();
  for (i = 0; i < values.length; ++i) {
    value = values[i];
    timestamp = undefined;
    if (value.length === 10) {
      timestamp = parseInt(value, 10) * 1000;
    } else if (value.length === 13 && settings.ms_mode) {
      timestamp = parseInt(value, 10);
    }
    if (timestamp) {
      outputarea.appendChild(create_tr(timestamp));
    }
  }
}


inputarea.focus();
inputarea.addEventListener('input', function () {
  clearTimeout(timer_id);
  timer_id = setTimeout(function () {
    get_state(process_inputarea);
  }, 250);
}, false);

cleanbutton.addEventListener('click', function () {
  inputarea.value = '';
  clean_outputarea();
  inputarea.focus();
}, false);
