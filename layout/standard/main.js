import Component from '/core/component.js';
import Breadcrumbs from '/core/breadcrumbs.js';
import css from './main.css' with { type: 'css' };

export default class Main extends Component {
  constructor(parent, element) {
    super(parent, element);

    this.element = element;
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];

    this.render();
  }

  addEvents() {
    // window.router.removeEventListener('routeChange', this.render);

    // this.addEventListener('beforeDestroy', e => {
    //   window.router.removeEventListener('routeChange', this.render);
    // });
  }

  async render() {
    this.element.innerHTML = '';
    const path = window.router.route.segments.join('/');
    const { default: Page } = await import(`/page/${path}.js`);
    this.element.appendChild((new Breadcrumbs()).element);
    this.element.appendChild((new Page(this)).element);

    this.addEvents();
  }
}