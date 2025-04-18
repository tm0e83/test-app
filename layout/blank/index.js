import Component from '/core/component.js';
import router from '/core/router.js';
import { isLoggedIn } from '/core/functions.js';

export default class LayoutBlank extends Component {
  constructor() {
    super(parent);

    this.addCSS('/layout/blank/index.css');
    this.element = document.createElement('div');
    this.element.classList.add('layout', 'layout-blank');
    this.render = this.render.bind(this);
    this.render();
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
    this.element.innerHTML = this.template;

    try {
      const { default: Page } = await import(`/page/${router.route.segments[0]}.js`);
      this.element.appendChild((new Page()).element);
    } catch(error) {
      const { default: Page } = await import(`/page/${isLoggedIn() ? '404' : 'login'}.js`);
      this.element.appendChild((new Page()).element);
    }

    this.addEvents();
  }

  get template() {
    return /*html*/ ``;
  }
}