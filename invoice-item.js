import Component from './core/component.js';

export default class InvoiceItem extends Component {
  constructor(args) {
    super();

    this.parent = args.parent;
    this.data = args.data;
    this.element = args.element;

    this.render();
  }

  addEvents() {
    this.editButton.addEventListener('click', this.onEdit.bind(this));
  }

  onEdit() {

  }

  get languageISO() {
    return 'de-DE';
  }

  formatDate(dateStr) {
    return new Intl.DateTimeFormat(this.languageISO, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateStr))
  }

  render() {
    this.element.classList.add('invoice-item');
    this.element.innerHTML = this.template;

    this.css`
      .invoice-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem 0;
        border-bottom: 1px dotted #e9e9e9;

        .item-name {
          flex: 1;
        }
      }
    `;

    this.editButton = this.element.querySelector('.button-edit');

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <div class="item-date">${this.formatDate(this.data.date)}</div>
      <div class="item-name">${this.data.name}</div>
      <div class="item-menu"><a class="button-edit btn btn-sm" title="Bearbeiten"><i class="fas fa-edit"></i></a></div>
    `;
  }
}