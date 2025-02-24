import Component from './core/component.js';
import css from './main.css' assert { type: 'css' };
document.adoptedStyleSheets = [css];

export default class Main extends Component {
  constructor(element) {
    super();

    this.element = element;

    this.render();
  }

  addEvents() {
  }

  async render() {
    this.element.innerHTML = this.template;

    switch (window.router.routeSegments[0]) {
      case 'calendar':
        const { default: Calendar } = await import('./calendar.js');
        this.element.appendChild((new Calendar()).element);
        break;
      case 'download':
        const { default: Download } = await import('./download.js');
        this.element.appendChild((new Download()).element);
        break;
      case 'addresses':
        const { default: Addresses } = await import('./addresses.js');
        this.element.appendChild((new Addresses()).element);
        break;
      case 'invoices':
        const { default: Invoices } = await import('./invoices.js');
        this.element.appendChild((new Invoices()).element);
        break;
      case 'offer-management':
        const { default: OfferManagement } = await import('./offer-management.js');
        this.element.appendChild((new OfferManagement()).element);
        break;
      default:
        const { default: PageNotFound } = await import('./page-not-found.js');
        this.element.appendChild((new PageNotFound()).element);
    }

    this.addEvents();
  }

  get template() {
    return /*html*/ ``;
  }
}