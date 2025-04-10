//@ts-check

import Component from '/core/component.js';
import Breadcrumbs from '/core/breadcrumbs.js';
import router from '/core/router.js';
import LayoutStandard from '/layout/standard/index.js';

export default class Main extends Component {
  /**
   * @param {LayoutStandard} parent
   */
  constructor(parent) {
    super(parent);

    this.addCSS('/layout/standard/main.css');
    this.render = this.render.bind(this);
    this.element = document.createElement('main');
    this.render();
  }

  addEvents() {
    router.removeEventListener('routeChange', this.render);
    router.addEventListener('routeChange', this.render);
  }

  async render() {
    this.element.innerHTML = this.template;
    const path = router.route.segments.join('/');
    const { default: Page } = await import(`/page/${path}.js`);
    this.element.appendChild((new Breadcrumbs()).element);
    this.element.appendChild((new Page(this)).element);

    this.addEvents();
  }

  get template() {
    return /*html*/ `
    `;
  }
}