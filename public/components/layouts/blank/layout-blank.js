import Component from '/core/component.js';
import router from '/core/router.js';
import './layout-header/layout-blank-header.js';
import '/core/background-animation.js';

export default class LayoutBlank extends Component {
  cssFilePath = '/components/layouts/blank/layout-blank.css';

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

    // console.log(`${router.route?.config?.component}.js`);

    try {
      const { default: Page } = await import(`${router.route?.config?.component}.js`);
      this.appendChild((new Page()));
    } catch(error) {
      console.log(error);
      const { default: Page } = await import('/components/pages/404/page-404.js');
      this.appendChild((new Page()));
    }

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <background-animation></background-animation>
      <layout-blank-header></layout-blank-header>
    `;
  }
}

customElements.define('layout-blank', LayoutBlank);