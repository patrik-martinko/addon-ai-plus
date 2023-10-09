const parameters = (new URLSearchParams(location.search));
const query = parameters.get('q') ? decodeURIComponent(parameters.get('q')) : false;
const hide = (root, selector) => {
	root.querySelector(selector) && root.querySelector(selector).setAttribute('style', 'display: none !important;');
};
const interval = setInterval(() => {
	let main = document.querySelector('cib-serp');
	let bar;
	let text;
	let input;
	let conversation;
	let welcome;
	if (main) {
		bar = main.shadowRoot.querySelector('cib-action-bar');
		conversation = main.shadowRoot.querySelector('cib-conversation').shadowRoot;
	}
	if (conversation) {
		welcome = conversation.querySelector('cib-welcome-container').shadowRoot;
	}
	if (bar) {
		text = bar.shadowRoot.querySelector('cib-text-input');
	}
	if (text) {
		input = text.shadowRoot.querySelector('#searchbox');
	}
	if (welcome && input) {
		clearInterval(interval);
		chrome.storage.sync.get({
			style: true,
			query: true,
			activity: true,
			limit: true,
			center: true,
			rewards: true,
			welcome: true,
			examples: true,
			feedback: true,
			terms: true,
			magnifier: true,
			theme: 'default'
		}, options => {
			if (options.style && parameters.get('style')) {
				welcome.querySelector('cib-tone-selector').shadowRoot.querySelector('button.tone-' + parameters.get('style')).click();
			}
			if (options.query && query && parameters.get('showconv') && query !== 'Bing AI') {
				input.value = query;
				input.dispatchEvent(new Event('input'));
				const button = bar.shadowRoot.querySelector('cib-icon-button[icon="send"]').shadowRoot.querySelector('button');
				button.removeAttribute('disabled');
				button.click();
				parameters.set('q', 'Bing AI');
				history.pushState({}, '', location.pathname + '?' + parameters.toString());
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
			if (options.center) {
				conversation.querySelector('.scroller-positioner').setAttribute('style', 'max-width: none;');
				conversation.querySelector('cib-welcome-container').setAttribute('style', 'justify-content: end;');
				main.shadowRoot.querySelector('cib-action-bar').setAttribute('style', 'max-width: none;');
			}
			if (options.rewards) {
				hide(document, '#id_rh');
			}
			if (options.welcome) {
				hide(welcome, '.header');
				hide(main, '.b_wlcmHdr');
			}
			if (options.examples) {
				hide(welcome, '.container-items');
				hide(main, '.b_wlcmTileCont');
			}
			if (options.feedback) {
				hide(welcome, '.preview-container .preview-label');
				hide(welcome, '.disclaimer');
				hide(main.shadowRoot, 'cib-serp-feedback');
			}
			if (options.terms) {
				hide(welcome, '.legal-items');
			}
			if (options.magnifier) {
				hide(document, '.mfa_rootchat');
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