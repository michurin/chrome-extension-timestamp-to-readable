/*
Copyright (c) 2016-2018 Alexey Michurin <a.michurin@gmail.com>.
All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
*/
/*jslint indent: 2, vars: true */
/*global window, alert, NodeFilter, config */

(function () {


  'use strict';


  function main() {

    if (!(config.local || config.utc)) {
      alert('You disable all labels. Visit options page to turn them on.');
      return;
    }

    var document = window.document;

    var magic = 'euzxcowosanvnnxsramwsamvumvnsrozavvcsmmnnrmsxruucrzsvvzsavrcamcem';

    var re = new RegExp(
      config.ms_mode ? '(?<!\\d)1\\d{9}(?:\\d{3})?(?!\\d)' : '(?<!\\d)1\\d{9}(?!\\d)',
      'g'
    );

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

    function get_all_timestamps(text) {
      var match, timestamps = [];
      re.lastIndex = 0;
      while (true) {
        match = re.exec(text);
        if (!match) {
          break;
        }
        timestamps.push(match[0]);
      }
      return timestamps;
    }

    function timestamp_to_readable(timestamp_text, long_mode) {
      var js_timestamp;
      var repr;
      if (timestamp_text.length < 13) {
        js_timestamp = timestamp_text * 1000;
        repr = timestamp_text;
      } else {
        js_timestamp = parseInt(timestamp_text, 10);
        repr = timestamp_text.slice(0, 10) + '.' + timestamp_text.slice(10);
      }
      var dt = new Date(js_timestamp);
      var title = [];
      if (config.utc) {
        title.push(fmt(dt, 'UTC') + ' UTC');
      }
      if (config.local) {
        title.push(fmt(dt, ''));
      }
      title = title.join(' | ');
      if (long_mode) {
        return repr + ' = ' + title;
      }
      return title;
    }

    function add_title(node, title) {
      var parent_node = node.parentNode;
      parent_node.setAttribute('title', title);
      if (config.highlight) {
        parent_node.classList.add(magic);
      }
    }

    function add_style() {
      if (config.highlight && !document.getElementById(magic)) {
        var node = document.createElement('style');
        node.textContent = '.' + magic + ':hover {background: ' + config.bg + '; color: ' + config.fg + ';}';
        node.id = magic;
        (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(node);
      }
    }

    function action(processor) {
      var walker = document.createTreeWalker(
        document.getElementsByTagName('body')[0] || document.documentElement,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      var nodes = [];
      while (walker.nextNode()) {
        nodes.push(walker.currentNode);
      }
      while (nodes.length) {
        processor(nodes.pop());
      }
    }

    function smart_mode_processor(node) {
      var self_wraped, text, m, m_len, m_text, node_next, wrapper;
      self_wraped = true;
      while (true) {
        text = node.textContent;
        re.lastIndex = 0;  // TODO: we use /g regexp only for backword compat; use just text.match(re) in future
        m = re.exec(text);
        if (!m) {
          break;
        }
        m_text = m[0];
        m_len = m_text.length;
        if (m.index !== 0) {
          node = node.splitText(m.index);
          self_wraped = false;
        }
        if (node.textContent.length === m_len) {
          node_next = undefined;
        } else {
          node_next = node.splitText(m_len);
          self_wraped = false;
        }
        if (!self_wraped) {
          wrapper = document.createElement(magic);
          node.parentNode.insertBefore(wrapper, node);
          wrapper.appendChild(node);
        }
        add_title(node, timestamp_to_readable(m_text, false));
        if (!node_next) {
          break;
        }
        node = node_next;
        self_wraped = false;
      }
    }

    function title_mode_processor(node) {
      var timestamps, title_text;
      timestamps = get_all_timestamps(node.textContent);
      if (timestamps.length === 0) {
        return;
      }
      if (timestamps.length === 1 && node.textContent.length < 200) {
        title_text = timestamp_to_readable(timestamps[0], false);
      } else {
        title_text = timestamps.map(function (ts) {
          return timestamp_to_readable(ts, true);
        }).join(';\n');
      }
      add_title(node, title_text);
    }

    function replace_mode_processor(node) {
      node.textContent = node.textContent.replace(re, function (str) {  // left params offset, orig_str
        return str + ' [' + timestamp_to_readable(str, false) + ']';
      });
    }

    if (config.title_mode) {
      if (config.individual_title_mode) {
        action(smart_mode_processor);
      } else {
        action(title_mode_processor);
      }
      add_style();
    } else {
      action(replace_mode_processor);
    }

  }


  try {
    main();
  } catch (err) {
    alert('Error ' + err.name + ':' + err.message + '\nTry to upgrade your browser\nDetails:\n' + err.stack);
  }


}());
