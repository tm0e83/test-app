import Component from '/core/component.js';
import { isLoggedIn } from '/core/functions.js';
import de from '/i18n/de.js';
import store from '/core/store.js';
import router from '/core/router.js';

window.addEventListener('DOMContentLoaded', async () => {
  new App();
});

window.addEventListener('error', (error) => {
  console.log('ERROR', error );
});

class App extends Component {
  constructor() {
    super();

    this.init();
  }

  async init() {
    this.element = document.querySelector('#app');

    try {
      await i18next
        .init({
          ns: ['app'],
          defaultNS: 'app',
          lng: 'de',
          resources: { de }
        });
    } catch(err) {
      console.log(err);
    }

    this.render();
    this.addEvents();
  }

  addEvents() {
    router.addEventListener('routeChange', this.onRouteChange.bind(this));
    window.addEventListener('settingsChange', this.onLanguageChange.bind(this));
  }

  onRouteChange() {
    this.render();
  }

  async onLanguageChange() {
    const {default: lang} = await import(`/i18n/${store.state.language}.js`);

    Object.entries(lang).map(([namespace, translations]) => {
      i18next.addResourceBundle(
        store.state.language,
        namespace,
        translations
      )
    });

    i18next.changeLanguage(store.state.language);
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
    if (this.layout) this.layout.destroy();
    this.layout = new Layout(this);
    this.element.innerHTML = '';
    this.element.appendChild(this.layout.element);
  }
}