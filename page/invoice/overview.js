import Component from '/core/component.js';
import Pagination from '/core/pagination.js';
import Filters from './overview/filters.js';
import List from './overview/list.js';
import { getQueryParams } from '/core/functions.js';

export default class Overview extends Component {
  constructor() {
    super();

    const params = getQueryParams();

    this.pageIndex = params.page ?? 0;
    this.invoiceData = [];
    this.element = document.createElement('div');
    this.element.classList.add('invoice-overview');

    this.render();
    this.load()
      .then(response => response.json())
      .then(data => this.invoiceData = data)
      .then(_ => this.render())
      .catch(error => console.error('Fehler beim Abrufen von JSON:', error));
  }

  load() {
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
      Object.assign({ page: this.pageIndex }, this.filters.filters)
    );

    var path = window.location.pathname + `?${queryParams}`;
    history.pushState({ path: window.location.pathname }, null, path);
  }

  updateList() {
    const invoices = this.filteredItems;
    this.pagination.update(invoices.length);
    this.list.render(this.pagination.getVisibleItems(invoices));
  }

  get filteredItems() {
    const searchVal = this.filters.filters.search ?? '';
    const regex = searchVal.trim().length ? new RegExp(`${searchVal}`, 'gi') : new RegExp(/^.*$/);

    return this.invoiceData.reduce((items, item) => {
      if (item.name.match(regex) === null) return items;
      if (this.filters.filters.type && item.type != this.filters.filters.type) return items;
      items.push(item);
      return items;
    }, []);
  }

  render() {
    this.element.innerHTML = this.template;

    this.css`
      .invoice-head {
        border-bottom: 1px dotted #e9e9e9;
      }
    `
    this.invoiceList = this.element.querySelector('.invoice-list');
    this.list = this.element.querySelector('.invoice-list');

    this.pagination = new Pagination({
      targetContainer: this.element.querySelector('.invoice-footer'),
      totalEntriesAmount: this.invoiceData.length,
      entriesPerPage: 2,
      currentPageIndex: this.pageIndex
    });

    this.filters = new Filters(
      this,
      this.element.querySelector('.filters'),
    );

    this.list = new List(
      this.visibleItems,
      this.element.querySelector('.invoice-list'),
      this.pagination.getVisibleItems(this.filteredItems)
    );

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>Rechnungen</h1>
      <div class="filters"></div>
      <div class="invoice-head"></div>
      <div class="invoice-list"></div>
      <div class="invoice-footer"></div>
    `;
  }
}