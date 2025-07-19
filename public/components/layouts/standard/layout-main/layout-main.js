import Component from '/core/component.js';
import '/core/breadcrumbs.js';
import router from '/core/router.js';

export default class LayoutMain extends Component {
  cssFilePath = '/components/layouts/standard/layout-main/layout-main.css';
  #isLoading = false;

  constructor() {
    super();

    this.render = this.render.bind(this);
  }

  disconnectedCallback() {
    router.removeEventListener('routeChange', this.render);
    super.disconnectedCallback();
  }

  connectedCallback() {
    router.addEventListener('routeChange', this.render);
    super.connectedCallback();
  }

  async render() {
    super.render();

    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;
    const { default: Page } = await import(`${router.route.config.component}.js`);
    this.page = new Page();
    this.appendChild(this.page);
    this.#isLoading = false;
  }

  get template() {
    return /*html*/ `
      <layout-breadcrumbs></layout-breadcrumbs>
    `;
  }
}

customElements.define('layout-main', LayoutMain);