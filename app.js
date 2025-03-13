import Component from '/core/component.js';
import { isLoggedIn } from '/core/functions.js';
import Router from '/core/router.js';
import de from '/i18n/de.js';
import store from '/core/store.js';
import Notifications from '/core/notifications.js';
import css from './app.css' with { type: 'css' };
import router from '/core/router2.js';

store.state = {
  user: {
    name: '',
  },
  token: '',
  layout: '',
  language: 'de',
};

window.router;
window.notify = new Notifications();

window.addEventListener('DOMContentLoaded', async () => {
  window.router = new Router();
  new App();
});

class App extends Component {
  constructor() {
    super();
    this.init();
  }

  async init() {
    this.element = document.querySelector('#app');
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];

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
    window.router.addEventListener('routeChange', this.render.bind(this));
    router.addEventListener('routeChange', this.render.bind(this));
    window.addEventListener('settingsChange', this.onLanguageChange.bind(this));
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
    this.render();
  }

  async render() {
    const layoutName = window?.router?.route?.config?.layout ?? 'empty';

    if (!window.router.route.config && isLoggedIn()) {
      return window.router.goTo('/dashboard');
    }

    const { default: Layout } = await import(`./layout/${layoutName}/index.js`);
    this.page = new Layout(this);

    this.element.innerHTML = '';
    this.css`

    `;
    this.element.appendChild(this.page.element);
  }
}