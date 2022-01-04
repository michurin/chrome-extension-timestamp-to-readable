(function() {
  chrome.runtime.onMessage.addListener(
    function(config, sender, sendResponse) {
      if (sender.tab) { // from a content script, not from the extension
        return
      }
      try {
        if (!(config.local || config.utc)) {
          alert('You disabled all labels. Visit options page to turn them on.');
          return;
        }

        const { document } = window;

        const magic = 'euzxcowosanvnnxsramwsamvumvnsrozavvcsmmnnrmsxruucrzsvvzsavrcamcem';

        let subRe = '';
        if (config.ms_mode) {
          subRe = `\\d{3}|${subRe}`;
        }
        if (config.cs_mode) {
          subRe = `\\d{6}|${subRe}`;
        }
        if (config.ns_mode) {
          subRe = `\\d{9}|${subRe}`;
        }
        const re = new RegExp(
          subRe ? `(?<!\\d)1\\d{9}(?:${subRe})(?!\\d)` : '(?<!\\d)1\\d{9}(?!\\d)',
          'g',
        );

        function zpad(v) {
          return (`0${v}`).slice(-2);
        }

        function fmt(dt, sfx) {
          const p = `get${sfx}`;
          return (
            `${dt[`${p}FullYear`]()}-${zpad(dt[`${p}Month`]() + 1)}-${zpad(dt[`${p}Date`]())} ${zpad(dt[`${p}Hours`]())}:${zpad(dt[`${p}Minutes`]())}:${zpad(dt[`${p}Seconds`]())}`
          );
        }

        function getAllTimestamps(text) {
          let match;
          const timestamps = [];
          re.lastIndex = 0;
          do {
            match = re.exec(text);
            if (match) {
              timestamps.push(match[0]);
            }
          } while (match);
          return timestamps;
        }

        function timestampToReadable(timestampText, longMode) {
          let jsTimestamp;
          let repr;
          if (timestampText.length === 10) {
            jsTimestamp = timestampText * 1000;
            repr = timestampText;
          } else if (timestampText.length === 13) {
            jsTimestamp = parseInt(timestampText, 10);
            repr = `${timestampText.slice(0, 10)}.${timestampText.slice(10)}`;
          } else if (timestampText.length === 16) {
            jsTimestamp = parseInt(timestampText / 1000, 10);
            repr = `${timestampText.slice(0, 10)}.${timestampText.slice(10)}`;
          } else { // 19
            jsTimestamp = parseInt(timestampText / 1000000, 10);
            repr = `${timestampText.slice(0, 10)}.${timestampText.slice(10)}`;
          }
          const dt = new Date(jsTimestamp);
          let title = [];
          if (config.utc) {
            title.push(`${fmt(dt, 'UTC')} UTC`);
          }
          if (config.local) {
            title.push(fmt(dt, ''));
          }
          title = title.join(' | ');
          if (longMode) {
            return `${repr} = ${title}`;
          }
          return title;
        }

        function addTitle(node, title) {
          const { parentNode } = node;
          parentNode.setAttribute('title', title);
          if (config.highlight) {
            parentNode.classList.add(magic);
          }
        }

        function addStyle() {
          if (config.highlight && !document.getElementById(magic)) {
            const node = document.createElement('style');
            node.textContent = `.${magic}:hover {background: ${config.bg}; color: ${config.fg};}`;
            node.id = magic;
            (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(node);
          }
        }

        function action(processor) {
          const walker = document.createTreeWalker(
            document.getElementsByTagName('body')[0] || document.documentElement,
            window.NodeFilter.SHOW_TEXT,
            null,
            false,
          );
          const nodes = [];
          while (walker.nextNode()) {
            nodes.push(walker.currentNode);
          }
          while (nodes.length) {
            processor(nodes.pop());
          }
        }

        function smartModeProcessor(node) {
          let selfWraped;
          let text;
          let m;
          let mLen;
          let mText;
          let nextNode;
          let wrapper;
          selfWraped = true;
          while (true) {
            text = node.textContent;
            re.lastIndex = 0; // TODO: we use /g regexp only for backword compat; use just text.match(re) in future
            m = re.exec(text);
            if (!m) {
              break;
            }
            [mText] = m;
            mLen = mText.length;
            if (m.index !== 0) {
              node = node.splitText(m.index);
              selfWraped = false;
            }
            if (node.textContent.length === mLen) {
              nextNode = undefined;
            } else {
              nextNode = node.splitText(mLen);
              selfWraped = false;
            }
            if (!selfWraped) {
              wrapper = document.createElement(magic);
              node.parentNode.insertBefore(wrapper, node);
              wrapper.appendChild(node);
            }
            addTitle(node, timestampToReadable(mText, false));
            if (!nextNode) {
              break;
            }
            node = nextNode;
            selfWraped = false;
          }
        }

        function titleModeProcessor(node) {
          let titleText;
          const timestamps = getAllTimestamps(node.textContent);
          if (timestamps.length === 0) {
            return;
          }
          if (timestamps.length === 1 && node.textContent.length < 200) {
            titleText = timestampToReadable(timestamps[0], false);
          } else {
            titleText = timestamps.map(ts => timestampToReadable(ts, true)).join(';\n');
          }
          addTitle(node, titleText);
        }

        function replaceModeProcessor(node) {
          // leave params offset, orig_str
          node.textContent = node.textContent.replace(
            re,
            str => `${str} [${timestampToReadable(str, false)}]`,
          );
        }

        if (config.title_mode) {
          if (config.individual_title_mode) {
            action(smartModeProcessor);
          } else {
            action(titleModeProcessor);
          }
          addStyle();
        } else {
          action(replaceModeProcessor);
        }
      } catch (err) {
        alert(`Error ${err.name}:${err.message}\nTry to upgrade your browser\nDetails:\n${err.stack}`);
      }
    }
  );
}());
