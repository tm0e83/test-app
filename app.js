import Component from './core/component.js';
import { isLoggedIn } from './functions.js';
import PageLogin from './pages/login.js';
import PageDefault from './pages/default.js';
import Router from './router.js';

window.state = {
  user: {
    name: '',
  },
  token: ''
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
    window.router.addEventListener('login', (e) => {
      window.state.token = e.detail.token;
      localStorage.setItem('token', window.state.token);
      window.router.dispatchEvent(new CustomEvent('routeChange', { detail: '/invoices' }));
    });

    window.router.addEventListener('logout', (e) => {
      window.state.token = '';
      localStorage.setItem('token', '');
      history.replaceState(null, null, '/');
      this.render();
    });

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
