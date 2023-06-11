const parameters = (new URLSearchParams(location.search));
let query = parameters.get('q');
const interval = setInterval(() => {
	let main = document.querySelector('cib-serp');
	let bar;
	let input;
	if (main) {
		bar = main.shadowRoot.querySelector('cib-action-bar');
	}
	if (bar) {
		input = bar.shadowRoot.querySelector('#searchbox');
	}
	if (input) {
		clearInterval(interval);
		if (query && parameters.get('showconv')) {
			query = decodeURIComponent(query);
			input.value = query;
			input.dispatchEvent(new Event('input'));
			bar.shadowRoot.querySelector('.control.submit button.primary').click();
		}
		document.querySelector('#id_rh').setAttribute('style', 'display: none;');
		main.shadowRoot.querySelector('cib-action-bar').setAttribute('style', 'max-width: none;');
		main.shadowRoot.querySelector('cib-serp-feedback').setAttribute('style', 'display: none;');
		const conversation = main.shadowRoot.querySelector('cib-conversation').shadowRoot;
		conversation.querySelector('.scroller-positioner').setAttribute('style', 'max-width: none;');
		conversation.querySelector('cib-welcome-container').setAttribute('style', 'justify-content: end;');
		const welcome = conversation.querySelector('cib-welcome-container').shadowRoot;
		welcome.querySelector('.container-item').setAttribute('style', 'display: none;');
		welcome.querySelector('.learn-tog-item').setAttribute('style', 'display: none;');
		welcome.querySelector('.privacy-statement').setAttribute('style', 'display: none;');
		document.querySelector('#id_sc').insertAdjacentHTML(
			'beforebegin',
			'<svg id="activity" style="width: 34px; height: 34px; padding: 8px 0px 10px 20px; cursor: pointer;" viewBox="0 0 24 24"><g color="#71777d"><path fill="currentcolor" d="M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM22 12c0 5.51-4.49 10-10 10S2 17.51 2 12h1c0 4.96 4.04 9 9 9s9-4.04 9-9-4.04-9-9-9C8.81 3 5.92 4.64 4.28 7.38c-.11.18-.22.37-.31.56L3.94 8H8v1H1.96V3h1v4.74c.04-.09.07-.17.11-.25.11-.22.23-.42.35-.63C5.22 3.86 8.51 2 12 2c5.51 0 10 4.49 10 10z"></path></g></svg>'
		);
		const button = document.querySelector('#activity');
		main.setAttribute('style', '--side-panel-width: 0px;');
		document.querySelector('header').setAttribute('style', 'margin-right: 0px;');
		document.querySelector('#id_h').setAttribute('style', 'right: 10px;');
		button.addEventListener('click', () => {
			if (main.getAttribute('style')) {
				main.removeAttribute('style');
				document.querySelector('header').removeAttribute('style');
				document.querySelector('#id_h').removeAttribute('style');
			} else {
				main.setAttribute('style', '--side-panel-width: 0px;');
				document.querySelector('header').setAttribute('style', 'margin-right: 0px;');
				document.querySelector('#id_h').setAttribute('style', 'right: 10px;');
			}
		});
	}
}, 500);