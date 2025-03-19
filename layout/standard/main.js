import Component from '/core/component.js';
import Breadcrumbs from '/core/breadcrumbs.js';
import router from '/core/router.js';

export default class Main extends Component {
  stylesheet = '/layout/standard/main.css';

  constructor(parent, element) {
    super(parent, element);

    this.element = element;

    this.addCSS().then(_ => this.render());
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