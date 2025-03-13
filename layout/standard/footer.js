import Component from '/core/component.js';
import css from './footer.css' with { type: 'css' };

export default class Footer extends Component {
  constructor(element) {
    super(parent, element);

    this.element = element;
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];

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