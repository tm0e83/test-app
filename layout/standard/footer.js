import Component from '/core/component.js';

export default class Footer extends Component {
  constructor(element) {
    super(parent);

    this.addCSS('/layout/standard/footer.css');
    this.render = this.render.bind(this);
    this.element = document.createElement('footer');
    this.render();
  }

  addEvents() {
  }

  render() {
    this.element.innerHTML = this.template;
    this.addEvents();
  }

  get template() {
    return /*html*/ `
      &copy; eWorks GmbH
    `;
  }
}