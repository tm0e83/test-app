import Component from '/core/component.js';
import Invoice from './invoice.js';

export default class Overview extends Component {
  constructor(parent, data) {
    super(parent, data);

    this.data = data;
    this.element = document.createElement('div');
    this.element.classList.add('invoice-list');
    this.render = this.render.bind(this);

    this.render(this.data);
  }

  render(data) {
    this.data = data;
    this.element.innerHTML = this.template;

    this.data.map(invoiceData => {
      this.element.appendChild((new Invoice(this, invoiceData)).element);
    });
  }

  get template() {
    return /*html*/ `${this.data.length ? '': i18next.t('noResults')}`;
  }

  onDelete(id) {
    this.parent.onDelete(id);
  }
}