import Component from './core/component.js';
import Pagination from './pagination.js';
import InvoiceItem from './invoice-item.js';

export default class Invoices extends Component {
  constructor(element) {
    super();

    this.pageIndex = 0;
    this.invoiceData = [];
    this.element = document.createElement('div');
    this.element.classList.add('invoices');

    this.render();
    this.load()
      .then(response => response.json())
      .then(data => this.invoiceData = data)
      .then(_ => this.render())
      .catch(error => console.error('Fehler beim Abrufen von JSON:', error));
  }

  load() {
    return fetch('./data/invoices.json');
  }

  addEvents() {
    this.pagination.addEventListener('pageChange', e => {
      this.pageIndex = e.detail;
      this.render();
    });
  }

  render() {
    this.element.innerHTML = this.template;

    this.css`
      .invoice-head {
        border-bottom: 1px dotted #e9e9e9;
      }
    `
    this.invoiceList = this.element.querySelector('.invoice-list');

    this.pagination = new Pagination({
      targetContainer: this.element.querySelector('.invoice-footer'),
      totalEntriesAmount: this.invoiceData.length,
      entriesPerPage: 2,
      currentPageIndex: this.pageIndex
    });

    this.pagination.getVisibleItems(this.invoiceData).map(invoice => {
      const invoiceItem = document.createElement('div');
      this.invoiceList.appendChild(invoiceItem);

      new InvoiceItem({
        parent: this,
        data: invoice,
        element: invoiceItem
      });
    });

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>Rechnungen</h1>
      <div class="invoice-head"></div>
      <div class="invoice-list"></div>
      <div class="invoice-footer"></div>
    `;
  }
}