import Component from '/core/component.js';
import { isLoggedIn } from '/core/functions.js';
import { initializeI18nAsync } from '/i18n/i18n.js';
import store from '/core/store.js';
import router from '/core/router.js';

window.addEventListener('error', (error) => {
  console.log('ERROR', error );
});

class AppComponent extends Component {
  constructor() {
    super();

    this.onRouteChange = this.onRouteChange.bind(this);
    this.onLanguageChange = this.onLanguageChange.bind(this);
  }

  connectedCallback() {
    this.init();
  }

  async init() {
    await initializeI18nAsync();
    this.render();
    this.addEvents();
  }

  addEvents() {
    router.addEventListener('routeChange', this.onRouteChange.bind(this));
    window.addEventListener('settingsChange', this.onLanguageChange.bind(this));
  }

  removeEvents() {
    router.removeEventListener('routeChange', this.onRouteChange);
    window.removeEventListener('settingsChange', this.onLanguageChange);
  }

  onRouteChange() {
    this.render();
  }

  async onLanguageChange() {
    const {default: lang} = await import(`/i18n/${store.state.language}.js`);

    Object.entries(lang).map(([namespace, translations]) => {
      i18n.addResourceBundle(
        store.state.language,
        namespace,
        translations
      )
    });

    i18n.changeLanguage(store.state.language);
    this.layout.render();
  }

  async render() {
    const nextLayout = router?.route?.config?.layout ?? 'blank';
    const layoutChanged = nextLayout !== store.state.layout;

    if (!layoutChanged) {
      return;
    }

    store.state.layout = nextLayout;

    if (!router.route.config && isLoggedIn()) {
      return router.navigate('/dashboard');
    }

    const { default: Layout } = await import(`./layout/${store.state.layout}/index.js`);
    this.layout = new Layout(this);
    this.innerHTML = '';
    this.appendChild(this.layout);
  }
}

customElements.define('app-component', AppComponent);