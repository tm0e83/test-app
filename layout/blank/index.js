import Component from '/core/component.js';
import router from '/core/router.js';
import { isLoggedIn } from '/core/functions.js';

export default class LayoutBlank extends Component {
  stylesheet = '/layout/blank/index.css';

  constructor() {
    super();

    this.addCSS()
      .then(_ => this.render())
      .then(_ => this.addStaticEvents())
      .then(_ => this.dispatchEvent(new CustomEvent('loaded')));
  }

  addStaticEvents() {
    router.removeEventListener('routeChange', this.render);
    router.addEventListener('routeChange', this.render.bind(this));
  }

  addEvents() {
  }

  async render() {
    this.element = document.createElement('div');
    this.element.classList.add('layout', 'layout-blank');
    this.element.innerHTML = this.template;

    try {
      const { default: Page } = await import(`/page/${router.route.segments[0]}.js`);
      this.element.appendChild((new Page()).element);
      this.addEvents();
    } catch(error) {
      const { default: Page } = await import(`/page/${isLoggedIn() ? '404' : 'login'}.js`);
      this.element.appendChild((new Page()).element);
      this.addEvents();
    }
  }

  get template() {
    return /*html*/ ``;
  }
}