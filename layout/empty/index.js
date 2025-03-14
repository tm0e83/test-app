import Component from '/core/component.js';
import router from '/core/router.js';
import { isLoggedIn } from '/core/functions.js';

export default class LayoutEmpty extends Component {
  constructor() {
    super();

    this.render();
  }

  async render() {
    this.element = document.createElement('div');
    this.element.classList.add('layout', 'layout-empty');
    this.element.innerHTML = this.template;

    try {
      const { default: Page } = await import(`/page/${router.route.segments[0]}.js`);
      this.element.appendChild((new Page()).element);
    } catch(error) {
      const { default: Page } = await import(`/page/${isLoggedIn() ? '404' : 'login'}.js`);
      this.element.appendChild((new Page()).element);
    }
  }

  get template() {
    return /*html*/ ``;
  }
}