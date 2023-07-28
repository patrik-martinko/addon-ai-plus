const getObject = (input, value, type) => {
	let option = {};
	if (type === 'radio') {
		option[input.getAttribute('name')] = value;
	} else {
		option[input.getAttribute('id')] = value;
	}
	return option;
};
for (const input of document.querySelectorAll('input[type=checkbox]')) {
	chrome.storage.sync.get(getObject(input, true), object => {
		input.checked = object[input.getAttribute('id')];
	});
	input.addEventListener('input', event => {
		chrome.storage.sync.set(getObject(event.target, event.target.checked));
	});
}
for (const input of document.querySelectorAll('input[type=radio]')) {
	chrome.storage.sync.get(getObject(input, 'default', 'radio'), object => {
		document.getElementById(object[input.getAttribute('name')]).checked = true;
	});
	input.addEventListener('input', event => {
		chrome.storage.sync.set(getObject(event.target, event.target.getAttribute('id'), 'radio'));
	});
}