const parameters = (new URLSearchParams(location.search));
const query = parameters.get('q') ? decodeURIComponent(parameters.get('q')) : false;
const interval = setInterval(() => {
	let main = document.querySelector('cib-serp');
	let bar;
	let text;
	let input;
	if (main) {
		bar = main.shadowRoot.querySelector('cib-action-bar');
	}
	if (bar) {
		text = bar.shadowRoot.querySelector('cib-text-input');
	}
	if (text) {
		input = text.shadowRoot.querySelector('#searchbox');
	}
	if (input) {
		clearInterval(interval);
		chrome.storage.sync.get({
			query: true,
			activity: true,
			limit: true,
			center: true,
			rewards: true,
			welcome: true,
			examples: true,
			feedback: true,
			terms: true,
			theme: 'default'
		}, options => {
			if (options.query && query && parameters.get('showconv') && query !== 'Bing AI') {
				input.value = query;
				input.dispatchEvent(new Event('input'));
				bar.shadowRoot.querySelector('.control.submit button.primary').click();
			}
			if (options.activity) {
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
			if (options.limit) {
				input.removeAttribute('maxlength');
				bar.shadowRoot.querySelector('.letter-counter').innerHTML = '';
			}
			const conversation = main.shadowRoot.querySelector('cib-conversation').shadowRoot;
			const welcome = conversation.querySelector('cib-welcome-container').shadowRoot;
			if (options.center) {
				conversation.querySelector('.scroller-positioner').setAttribute('style', 'max-width: none;');
				conversation.querySelector('cib-welcome-container').setAttribute('style', 'justify-content: end;');
				main.shadowRoot.querySelector('cib-action-bar').setAttribute('style', 'max-width: none;');
			}
			if (options.rewards) {
				document.querySelector('#id_rh') && document.querySelector('#id_rh').setAttribute('style', 'display: none;');
			}
			if (options.welcome) {
				welcome.querySelector('.header') && welcome.querySelector('.header').setAttribute('style', 'display: none;');
			}
			if (options.examples) {
				welcome.querySelector('.container-items') && welcome.querySelector('.container-items').setAttribute('style', 'display: none;');
			}
			if (options.feedback) {
				welcome.querySelector('.disclaimer') && welcome.querySelector('.disclaimer').setAttribute('style', 'display: none;');
				main.shadowRoot.querySelector('cib-serp-feedback') && main.shadowRoot.querySelector('cib-serp-feedback').setAttribute('style', 'display: none;');
			}
			if (options.terms) {
				welcome.querySelector('.legal-items') && welcome.querySelector('.legal-items').setAttribute('style', 'display: none;');
			}
			if (options.theme === 'light-app') {
				const setColor = element => {
					element.setAttribute('style', 'background: #f5f5f5;');
				};
				setColor(main.shadowRoot.querySelector('cib-background'));
				conversation.querySelectorAll('cib-background').forEach(element => setColor(element));
			}
		});
	}
}, 500);