import Component from './core/component.js';
import Addresses from './addresses.js';
import Invoices from './invoices.js';

export default class Main extends Component {
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
      main {
        padding: 1rem;
        flex: 1;
        min-height: 80vh;
      }
    `

    if (location.pathname.match(/^\/addresses/)) {
      this.element.appendChild((new Addresses()).element);
    } else {
      this.element.appendChild((new Invoices()).element);
    }

    this.addEvents();
  }

  get template() {
    return /*html*/ ``;
  }
}