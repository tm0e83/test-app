import Component from '/core/component.js';
import router from '/core/router.js';
import { isLoggedIn } from '/core/functions.js';

export default class LayoutBlank extends Component {
  cssFilePath = '/layout/blank/index.css';

  constructor() {
    super();
  }

  onDestroy() {
    router.removeEventListener('routeChange', this.render);
  }

  addEvents() {
    router.removeEventListener('routeChange', this.render);
    router.addEventListener('routeChange', this.render);
    this.addEventListener('onDestroy', this.onDestroy.bind(this));
  }

  async render() {
    super.render();

    try {
      const { default: Page } = await import(`/page/${router.route?.config?.component}.js`);
      console.log(444);
      this.appendChild((new Page()));
    } catch(error) {
      console.log(`/page/${isLoggedIn() ? '404' : 'login'}-component.js`);
      const { default: Page } = await import(`/page/${isLoggedIn() ? '404' : 'login'}-component.js`);
      this.appendChild((new Page()));
    }

    this.addEvents();
  }

  get template() {
    return /*html*/ ``;
  }
}

customElements.define('layout-blank', LayoutBlank);