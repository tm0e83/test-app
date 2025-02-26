import Component from './core/component.js';

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

    this.css`
      main {
        padding: 1rem;
        flex: 1;
        min-height: 80vh;
      }
    `;

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
        if (window.router.routeSegments[1] === 'details' && !isNaN(window.router.routeSegments[2])) {
          const { default: InvoiceDetails } = await import('./invoice-details.js');
          this.element.appendChild((new InvoiceDetails({
            id: window.router.routeSegments[2]
          })).element);
        } else {
          const { default: Invoices } = await import('./invoices.js');
          this.element.appendChild((new Invoices()).element);
        }
        break;
      case 'offer-management':
        const { default: OfferManagement } = await import('./offer-management.js');
        this.element.appendChild((new OfferManagement()).element);
        break;
      case 'manage-users':
        const { default: ManageUsers } = await import('./manage-users.js');
        this.element.appendChild((new ManageUsers()).element);
        break;
      default:
        window.router.goTo('/invoices');
    }

    this.addEvents();
  }

  get template() {
    return /*html*/ ``;
  }
}