const getObject = (input, value) => {
	let option = {};
	option[input.getAttribute('id')] = value;
	return option;
};
for (const input of document.getElementsByTagName('input')) {
	chrome.storage.sync.get(getObject(input, true), object => {
		input.checked = object[input.getAttribute('id')];
	});
	input.addEventListener('input', event => {
		chrome.storage.sync.set(getObject(event.target, event.target.checked));
	});
}