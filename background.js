// Event listener for extension icon click
chrome.action.onClicked.addListener((tab) => {
    clearCache(tab);
});

// Function to clear session data for the given tab
function clearCache(tab) {
    if (!tab || !tab.url || isChromeInternalPage(tab.url)) {
        return;
    }

    const url = new URL(tab.url);
    const domain = url.hostname; // Get full domain/subdomain

    const removalOptions = {
        origins: [url.origin]
    };

    const dataToRemove = {
        cacheStorage: true,
        cookies: true,
        fileSystems: true,
        indexedDB: true,
        localStorage: true,
        pluginData: true,
        serviceWorkers: true,
        webSQL: true
    };

    chrome.browsingData.remove(removalOptions, dataToRemove, () => {
        if (chrome.runtime.lastError) {
        } else {
            // Show a notification to the user
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon128.png',
                title: 'Session Cleared',
                message: 'Session for ' + domain + ' has been cleared.'
            }, (notificationId) => {
                if (chrome.runtime.lastError) {
                }
            });

            // Reload the tab after data is cleared and notification is shown
            chrome.tabs.reload(tab.id);
        }
    });
}

// Function to check if the URL is a Chrome internal page
function isChromeInternalPage(url) {
    return url.startsWith('chrome://');
}
