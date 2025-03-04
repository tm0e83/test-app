import Component from '/core/component.js';
import Invoice from './invoice.js';

export default class Overview extends Component {
  constructor(parent, element, data) {
    super(parent, element, data);

    this.data = data;
    this.element = element;

    this.render(this.data);
  }

  render(data) {
    this.data = data;
    this.element.innerHTML = this.template;

    this.data.map(invoiceData => {
      const invoiceElement = document.createElement('div');
      this.element.appendChild(invoiceElement);

      new Invoice({
        parent: this,
        data: invoiceData,
        element: invoiceElement
      });
    });
  }

  get template() {
    return /*html*/ `${this.data.length ? '': i18next.t('noResults')}`;
  }
}