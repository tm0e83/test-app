import Component from '/core/component.js';
import Breadcrumbs from '/core/breadcrumbs.js';
import router from '/core/router.js';

export default class LayoutMain extends Component {
  cssFilePath = '/components/layouts/standard/layout-main/layout-main.css';

  constructor() {
    super();
  }

  addEvents() {
    router.removeEventListener('routeChange', this.render);
    router.addEventListener('routeChange', this.render);
  }

  async render() {
    super.render();

    const { default: Page } = await import(`${router.route.config.component}.js`);
    this.page = new Page();
    this.appendChild(this.page);

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <layout-breadcrumbs></layout-breadcrumbs>
    `;
  }
}

customElements.define('layout-main', LayoutMain);