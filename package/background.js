const afterInstall = async ({ reason }) => {
	if (reason === 'install') {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL('options.html'));
		}
	}
};
if (typeof browser !== 'undefined') {
	browser.runtime.onInstalled.addListener(afterInstall);
} else {
	chrome.runtime.onInstalled.addListener(afterInstall);
}