import Component from '/core/component.js';
import { formatDate } from '/core/functions.js';

export default class Invoice extends Component {
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

  onEdit(e) {
    e.preventDefault();
    window.router.goTo(e.currentTarget.href);
  }

  render() {
    this.element.classList.add('invoice');
    this.element.innerHTML = this.template;

    this.css`
      .invoice {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem 0;
        border-bottom: 1px dotted #e9e9e9;

        &>div {
          flex: 1;
        }
        &>.item-menu {
          flex: 0 1 auto;
        }
      }
    `;

    this.editButton = this.element.querySelector('.button-edit');

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <div class="item-date">${formatDate(this.data.date)}</div>
      <div class="item-name">${this.data.name}</div>
      <div class="item-type">Typ ${this.data.type}</div>
      <div class="item-menu">
        <a
          class="button-edit btn btn-sm"
          title="Bearbeiten"
          href="/invoice/details/${this.data.id}"
        >
          <i class="fas fa-edit"></i>
        </a></div>
    `;
  }
}