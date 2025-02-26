import Component from './core/component.js';
import { isLoggedIn } from './functions.js';
import PageLogin from './pages/login.js';
import PageDefault from './pages/default.js';
import Router from './router.js';


// import i18next from 'https://deno.land/x/i18next/index.js'

window.state = {
  user: {
    name: '',
  },
  token: ''
};

window.router;
window.mainRouter;

window.addEventListener('DOMContentLoaded', () => {
  window.router = new Router();
  window.mainRouter = new Router();

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
    this.page = await isLoggedIn() ? new PageDefault() : new PageLogin();
    this.element.innerHTML = '';
    this.css`
      #app {
      }
    `;
    this.element.appendChild(this.page.element);
  }
}
