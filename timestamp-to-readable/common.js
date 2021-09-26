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

function getState() {
  return new Promise(function(resolve) {
    chrome.storage.local.get(defaults, resolve);
  });
}
