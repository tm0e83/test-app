import Component from '/core/component.js';
import { isLoggedIn } from '/core/functions.js';
import Router from '/core/router.js';

// import i18next from 'https://deno.land/x/i18next/index.js'

window.state = {
  user: {
    name: '',
  },
  token: '',
  layout: ''
};

window.router;

window.addEventListener('DOMContentLoaded', () => {
  window.router = new Router();

  const app = new App();
});

class App extends Component {
  constructor() {
    super();
    this.element = document.querySelector('#app');
    this.render();
    this.addEvents();
  }

  addEvents() {
    window.router.addEventListener('routeChange', this.render.bind(this));
  }

  async render() {
    // console.log(window.router.route);

    // if (!isLoggedIn()) {
    //   return window.router.goTo('login');
    // }

    const layoutName = window?.router?.route?.config?.layout ?? 'empty';

    if (!window.router.route.config && isLoggedIn()) {
        return window.router.goTo('/invoice/overview?page=0');
    }


    const { default: Layout } = await import(`./layout/${layoutName}/index.js`);
    this.page = new Layout(this);

    this.element.innerHTML = '';
    this.css`#app {}`;
    this.element.appendChild(this.page.element);
  }
}