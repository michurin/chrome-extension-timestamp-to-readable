(function () {
  importScripts("common.js");

  chrome.action.onClicked.addListener(async (tab) => {
    const { url, id } = tab;
    if (url === undefined) { // url can be undefined for windows with another profile
      return;
    }
    const url4 = url.substr(0, 4);
    if (url4 === 'http' || url4 === 'file') { // cover both http(s)
      var v = await getState()
      await chrome.scripting.executeScript({target: {tabId: id}, files: ['do.js']});
      chrome.tabs.sendMessage(id, v);
    } else {
      chrome.tabs.update(id, { url: chrome.runtime.getURL('converter-page.html') });
    }
  });
}());
