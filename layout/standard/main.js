import Component from '/core/component.js';

export default class Main extends Component {
  constructor(parent, element) {
    super(parent, element);

    this.element = element;

    this.render();
  }

  addEvents() {
    window.router.removeEventListener('routeChange', this.render);

    this.addEventListener('beforeDestroy', e => {
      window.router.removeEventListener('routeChange', this.render);
    });
  }

  async render() {
    this.element.innerHTML = this.template;

    this.css`
      main {
        padding: 1rem;
        flex: 1;
        min-height: 80vh;
      }
    `;

    const path = window.router.route.segments.join('/');

    const { default: Page } = await import(`/page/${path}.js`);
    this.element.appendChild((new Page(this)).element);

    this.addEvents();
  }

  get template() {
    return /*html*/ ``;
  }
}