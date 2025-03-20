import Component from '/core/component.js';
import Breadcrumbs from '/core/breadcrumbs.js';
import router from '/core/router.js';

export default class Main extends Component {
  stylesheet = '/layout/standard/main.css';

  constructor(parent, element) {
    super(parent, element);

    this.element = element;

    this.addCSS()
      .then(_ => this.render())
      .then(_ => this.addStaticEvents());
  }

  addStaticEvents() {
    router.removeEventListener('routeChange', this.render);
    router.addEventListener('routeChange', this.render.bind(this));
  }

  addEvents() {
  }

  async render() {
    this.element.innerHTML = '';
    const path = router.route.segments.join('/');
    const { default: Page } = await import(`/page/${path}.js`);
    this.element.appendChild((new Breadcrumbs()).element);
    this.element.appendChild((new Page(this)).element);

    this.addEvents();
  }
}