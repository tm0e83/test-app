import Component from '/core/component.js';

export default class Footer extends Component {
  constructor(element) {
    super(parent, element);

    this.element = element;
    this.render();
  }

  addEvents() {
  }

  render() {
    this.element.innerHTML = this.template;
    this.css`
      footer {
        padding: 1rem;
        height: 60px;
        border-top: 1px solid #c4c4c4;
        text-align: right;
      }
    `

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      &copy; eWorks GmbH
    `;
  }
}