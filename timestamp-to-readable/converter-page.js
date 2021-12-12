/*
Copyright (c) 2016-2020 Alexey Michurin <a.michurin@gmail.com>.
All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
*/


const inputarea = document.getElementById('inputarea');
const cleanbutton = document.getElementById('cleanbutton');
const outputarea = document.getElementById('outputarea');
let timerID;


function zpad(v) {
  return (`0${v}`).slice(-2);
}


function fmt(dt, sfx) {
  const p = `get${sfx}`;
  return (
    `${dt[`${p}FullYear`]()}-${zpad(dt[`${p}Month`]() + 1)}-${zpad(dt[`${p}Date`]())} ${zpad(dt[`${p}Hours`]())}:${zpad(dt[`${p}Minutes`]())}:${zpad(dt[`${p}Seconds`]())}`
  );
}


function createTD(text) {
  const td = document.createElement('td');
  if (text) {
    td.innerText = text;
  } else {
    td.classList.add('wide');
  }
  return td;
}


function createTR(ts) {
  const tr = document.createElement('tr');
  tr.appendChild(createTD(Math.floor(ts / 1000)));
  tr.appendChild(createTD());
  tr.appendChild(createTD(`${fmt(new Date(ts), 'UTC')} UTC`));
  tr.appendChild(createTD());
  tr.appendChild(createTD(fmt(new Date(ts), '')));
  return tr;
}


function cleanOutputArea() {
  while (outputarea.firstChild) {
    outputarea.removeChild(outputarea.firstChild);
  }
}


function processInputArea(settings) {
  let timestamp;
  let i;
  let value;
  const values = inputarea.value.split(/[^0-9]+/);
  cleanOutputArea();
  for (i = 0; i < values.length; ++i) {
    value = values[i];
    timestamp = undefined;
    if (value.length === 10) {
      timestamp = parseInt(value, 10) * 1000;
    } else if (value.length === 13 && settings.ms_mode) {
      timestamp = parseInt(value, 10);
    } else if (value.length === 16 && settings.cs_mode) {
      timestamp = parseInt(value / 1000, 10);
    } else if (value.length === 19 && settings.ns_mode) {
      timestamp = parseInt(value / 1000000, 10);
    }
    if (timestamp) {
      outputarea.appendChild(createTR(timestamp));
    }
  }
}


inputarea.focus();
inputarea.addEventListener('input', () => {
  clearTimeout(timerID);
  timerID = setTimeout(async () => {
    processInputArea(await getState());
  }, 250);
}, false);

cleanbutton.addEventListener('click', () => {
  inputarea.value = '';
  cleanOutputArea();
  inputarea.focus();
}, false);
