chrome.contextMenus.onClicked.addListener(onClickHandler);

// A generic onclick callback function.
function onClickHandler(info) {
  self?.[info.menuItemId]?.(info.selectionText);
}

function createNewTab(url) {
  chrome.tabs.create({ url: url });
}

function createNewIncognitoTab(url) {
  chrome.windows.getAll(
    { populate: false, windowTypes: ["normal"] },
    function (windows) {
      // Find incognito window from latest opened window.
      const incognitoWindow = windows.reverse().find((w) => w.incognito);
      if (incognitoWindow) {
        // Use this window.
        chrome.tabs.create(
          { url: url, windowId: incognitoWindow.id },
          function () {
            chrome.windows.update(incognitoWindow.id, { focused: true });
          }
        );
        return;
      }

      // No incognito window found, open a new one.
      chrome.windows.create({ url: url, incognito: true });
    }
  );
}

function searchMeaningOnGoogle(text) {
  const url = "https://www.google.com/search?q=dictionary " + text;
  createNewIncognitoTab(url);
}

function searchMeaningAsSoftwareOnGoogle(text) {
  const url = "https://www.google.com/search?q=" + text + " in software";
  createNewIncognitoTab(url);
}

function translateTextInPapago(text) {
  const url = "https://papago.naver.com/?sk=auto&tk=en&st=" + text;
  createNewIncognitoTab(url);
}

function searchMeaningAsKoreanOnGoogle(text) {
  const url = "https://www.google.com/search?q=" + text + " 무슨 뜻인가요?";
  createNewIncognitoTab(url);
}

function seeHowPeopleUseThisWordOnTwitter(text) {
  const url = "https://twitter.com/search?q=" + text + "&f=live";
  createNewTab(url);
}

chrome.runtime.onInstalled.addListener(function () {
  // Create one test item for each context type.
  let contexts = [
    {
      id: "searchMeaningOnGoogle",
      title: "Search meaning on Google",
    },
    {
      id: "searchMeaningAsSoftwareOnGoogle",
      title: "Search meaning as software on Google",
    },
    {
      id: "searchMeaningAsKoreanOnGoogle",
      title: "Search meaning as Korean on Google",
    },
    {
      id: "translateTextInPapago",
      title: "Translate text in Papago",
    },
    {
      id: "seeHowPeopleUseThisWordOnTwitter",
      title: "See how people use this word on Twitter",
    },
  ];

  for (const context of contexts) {
    chrome.contextMenus.create({
      title: context.title,
      contexts: ["selection"],
      id: context.id,
    });
  }
});
