const parameters = (new URLSearchParams(location.search));
const query = parameters.get('query') ? decodeURIComponent(parameters.get('query')) : false;
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
			sidebar: true,
			sidebarInit: true,
			limit: true,
			center: true,
			background: true,
			logo: true,
			welcome: true,
			examples: true,
			mobile: true,
			feedback: true,
			terms: true,
			rewards: true,
			pro: true
		}, options => {
			if (options.style && parameters.get('style')) {
				welcome.querySelector('cib-tone-selector').shadowRoot.querySelector('button.tone-' + parameters.get('style')).click();
			}
			if (options.query && query && ((parameters.get('showconv') && query !== 'Bing AI') || location.host !== 'www.bing.com')) {
				input.value = query;
				input.dispatchEvent(new Event('input'));
				let button = bar.shadowRoot.querySelector('[description="Submit"]');
				if (button.shadowRoot) {
					button = button.shadowRoot.querySelector('button');
				}
				button.removeAttribute('disabled');
				button.click();
			}
			if (options.sidebar) {
				const icon = '<g color="#71777d"><path fill="currentcolor" d="M14.97 16.95 10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM22 12c0 5.51-4.49 10-10 10S2 17.51 2 12h1c0 4.96 4.04 9 9 9s9-4.04 9-9-4.04-9-9-9C8.81 3 5.92 4.64 4.28 7.38c-.11.18-.22.37-.31.56L3.94 8H8v1H1.96V3h1v4.74c.04-.09.07-.17.11-.25.11-.22.23-.42.35-.63C5.22 3.86 8.51 2 12 2c5.51 0 10 4.49 10 10z"></path></g>';
				if (location.host === 'www.bing.com') {
					document.querySelector('#id_sc').insertAdjacentHTML('beforebegin', `<svg id="sidebar-button" style="width: 34px; height: 34px; padding: 8px 0px 10px 20px; cursor: pointer;" viewBox="0 0 24 24">${icon}</svg>`);
				} else {
					document.querySelector('#id_h').insertAdjacentHTML('afterbegin', `<svg id="sidebar-button" style="width: 24px; height: 24px; padding: 13px; cursor: pointer;">${icon}</svg>`);
				}
				const button = document.querySelector('#sidebar-button');
				const panel = main.shadowRoot.querySelector('cib-side-panel');
				const hidePanel = () => {
					main.setAttribute('style', '--side-panel-width: 0px;');
					panel.setAttribute('style', 'display: none;');
					if (location.host === 'www.bing.com') {
						document.querySelector('header').setAttribute('style', 'margin-right: 0px;');
						document.querySelector('#id_h').setAttribute('style', 'right: 10px;');
					}
				}
				if (!options.sidebarInit || (options.sidebarInit && query)) {
					hidePanel();
				}
				button.addEventListener('click', () => {
					if (main.getAttribute('style')) {
						main.removeAttribute('style');
						panel.removeAttribute('style');
						if (location.host === 'www.bing.com') {
							document.querySelector('header').removeAttribute('style');
							document.querySelector('#id_h').removeAttribute('style');
						}
					} else {
						hidePanel();
					}
				});
			}
			if (options.limit) {
				const removeLimit = () => {
					input.removeAttribute('maxlength');
					input.removeAttribute('aria-description');
				}
				removeLimit();
				const observer = new MutationObserver(list => {
					for (const mutation of list) {
						if (mutation.attributeName === 'maxlength' && input.getAttribute('maxlength')) {
							removeLimit();
						}
					}
				});
				observer.observe(input, { attributes: true });
			}
			if (options.logo) {
				hide(document, '#sb_form');
				document.querySelector('.b_scopebar') && document.querySelector('.b_scopebar').setAttribute('style', 'padding-left: 32px;');
			}
			if (options.mobile) {
				hide(document, '#id_mobile');
				hide(document, '#copilot_app_cta');
			}
			if (options.rewards) {
				hide(document, '#id_rh');
			}
			const setMain = () => {
				if (main.getAttribute('mode') === 'conversation') {
					bar = main.shadowRoot.querySelector('cib-action-bar');
					conversation = main.shadowRoot.querySelector('cib-conversation').shadowRoot;
					welcome = conversation.querySelector('cib-welcome-container').shadowRoot;
					if (options.center) {
						conversation.querySelector('.scroller-positioner').setAttribute('style', 'max-width: none;');
						conversation.querySelector('cib-welcome-container').setAttribute('style', 'justify-content: end;');
						main.shadowRoot.querySelector('cib-action-bar').setAttribute('style', 'max-width: none;');
					}
					if (options.background) {
						const side = main.shadowRoot.querySelector('cib-side-panel');
						const setBackground = (element, selectorRoot, selector) => {
							if (selectorRoot) {
								element.shadowRoot.querySelector(selectorRoot).shadowRoot.querySelectorAll(selector).forEach(element => element.setAttribute('style', 'background: white;'));
							} else {
								element.shadowRoot.querySelectorAll(selector).forEach(element => element.setAttribute('style', 'background: white;'));
							}
						};
						setBackground(side, null, '.scroller');
						setObserver(side, 'selected-panel');
						setBackground(main, null, 'cib-background');
						setBackground(main, 'cib-conversation', 'cib-background');
					}
					if (options.welcome) {
						hide(welcome, '.header');
						hide(main, '.b_wlcmHdr');
					}
					if (options.examples) {
						hide(welcome, '.container-items');
						hide(main, '.b_wlcmTileCont');
						hide(main, '.b_wlcmCont');
					}
					if (options.feedback) {
						hide(welcome, '.preview-container .preview-label');
						hide(welcome, '.disclaimer');
						hide(main.shadowRoot, 'cib-serp-feedback');
					}
					if (options.terms) {
						hide(welcome, '.legal-items');
					}
					if (options.pro) {
						hide(welcome, '.get-ccp-button');
					}
				}
			};
			const setObserver = (element, attribute) => {
				const observer = new MutationObserver(records => {
					for (const record of records) {
						if (record.attributeName === attribute) {
							setMain();
						}
					}
				});
				observer.observe(element, { attributes: true });
			};
			setMain();
			setObserver(main, 'mode');
		});
	}
}, 500);