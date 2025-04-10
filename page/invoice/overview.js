import Component from '/core/component.js';
import ModalConfirm from '/core/modal-confirm.js';
import Pagination from '/core/pagination.js';
import Filters from './overview/filters.js';
import List from './overview/list.js';
import { getQueryParams } from '/core/functions.js';

export default class Overview extends Component {
  constructor(parent) {
    super(parent);

    this.pageIndex = getQueryParams().page ?? 0;
    this.itemPerPage = 10;
    this.invoiceData = [];
    this.element = document.createElement('div');
    this.element.classList.add('invoice-overview', 'loading');
    this.render = this.render.bind(this);

    this.render();
    this.addCSS('/page/invoice/overview.css')
      .then(_ => this.load())
      .then(response => response.json())
      .then(data => this.invoiceData = data)
      .then(_ => this.render())
      .then(_ => this.element.classList.remove('loading'))
      .catch(error => console.error('Fehler beim Abrufen von JSON:', error));
  }

  async load() {
    await new Promise((resolve, reject) => {
      setTimeout(_ => resolve(), 300)
    })

    return fetch('/data/invoices.json');
  }

  toQueryString(obj) {
    const searchParams = new URLSearchParams();
    Object.keys(obj).forEach(key => searchParams.append(key, obj[key]));
    return searchParams;
  }

  addEvents() {
    this.pagination.addEventListener('pageChange', e => {
      this.pageIndex = e.detail;
      this.updatePath();
      this.updateList();
    });

    this.filters.addEventListener('change', e => {
      this.pageIndex = 0;
      this.updatePath();
      this.updateList();
    });
  }

  updatePath() {
    const queryParams = this.toQueryString(
      Object.assign({ page: this.pageIndex }, this.filters.values)
    );

    var path = window.location.pathname + `?${queryParams}`;
    history.pushState({ path: window.location.pathname }, null, path);
  }

  updateList() {
    const invoices = this.filteredItems;
    this.pagination.update(invoices.length, this.itemPerPage, this.pageIndex);
    this.list.render(this.pagination.getVisibleItems(invoices));
  }

  get filteredItems() {
    const searchVal = this.filters.values.search ?? '';
    const regex = searchVal.trim().length ? new RegExp(`${searchVal}`, 'gi') : new RegExp(/^.*$/);

    return this.invoiceData.reduce((items, item) => {
      if (item.name.match(regex) === null) return items;
      if (this.filters.values.type && item.type != this.filters.values.type) return items;
      items.push(item);
      return items;
    }, []);
  }

  render() {
    this.element.innerHTML = this.template;
    this.invoiceList = this.element.querySelector('.invoice-list');
    this.list = this.element.querySelector('.invoice-list');

    this.filters = new Filters(this);
    this.element.querySelector('.filters').replaceWith(this.filters.element);

    const filteredItems = this.filteredItems;

    this.pagination = new Pagination({
      targetContainer: this.element.querySelector('.invoice-footer'),
      totalEntriesAmount: filteredItems.length,
      entriesPerPage: this.itemPerPage,
      currentPageIndex: this.pageIndex
    });

    this.list = new List(this, this.pagination.getVisibleItems(filteredItems));
    this.element.querySelector('.invoice-list').replaceWith(this.list.element);

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>${i18next.t('invoices')}</h1>
      <div class="filters"></div>
      <div class="invoice-head"></div>
      <div class="invoice-list"></div>
      <div class="invoice-footer"></div>
    `;
  }

  onDelete(id) {
    ModalConfirm.show({
      title: i18next.t('delete'),
      message: i18next.t('reallyDeleteInvoice'),
      onConfirm: e => {
        e.preventDefault();
        this.invoiceData = this.invoiceData.filter(invoice => invoice.id !== id);
        this.updateList();
        ModalConfirm.hide();
      }
    });
  }
}