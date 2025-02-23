import Component from './core/component.js';

export default class Header extends Component {
  constructor(element) {
    super();

    this.element = element;
    this.render();
  }

  addEvents() {
  }

  render() {
    this.element.innerHTML = this.template;
    this.css`
      header {
        border-bottom: 1px solid #c4c4c4;
        padding: 1rem;
        text-align: right;
        height: 60px;
      }
    `

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <strong>eWMS</strong>
    `;
  }
}