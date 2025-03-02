import Component from '/core/component.js';

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
      const { default: Page } = await import(`/page/${window.router.route.segments[0]}.js`);
      this.element.appendChild((new Page()).element);
    } catch(error) {
      const { default: Page } = await import(`/page/404.js`);
      this.element.appendChild((new Page()).element);
    }
  }

  get template() {
    return /*html*/ ``;
  }
}