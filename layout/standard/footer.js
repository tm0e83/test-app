import Component from '/core/component.js';

export default class Footer extends Component {
  stylesheet = '/layout/standard/footer.css';

  constructor(element) {
    super(parent, element);

    this.element = element;

    this.addCSS().then(_ => this.render());
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