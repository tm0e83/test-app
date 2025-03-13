import Component from '/core/component.js';
import Pagination from '/core/pagination.js';
import Filters from './overview/filters.js';
import List from './overview/list.js';
import { getQueryParams } from '/core/functions.js';
import css from './overview.css' with { type: 'css' };

export default class Overview extends Component {
  constructor() {
    super();

    const params = getQueryParams();

    this.pageIndex = params.page ?? 0;
    this.itemPerPage = 10;
    this.clientData = [];
    this.element = document.createElement('div');
    this.element.classList.add('client-overview', 'loading');
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];

    this.render();

    this.load()
      .then(response => response.json())
      .then(data => this.clientData = data)
      .then(_ => this.element.classList.remove('loading'))
      .then(_ => this.render())
      .catch(error => console.error('Fehler beim Abrufen von JSON:', error));
  }

  async load() {
    await new Promise((resolve, reject) => {
      setTimeout(_ => resolve(), 300)
    })

    return fetch('/data/clients.json');
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
    const client = this.filteredItems;
    this.pagination.update(client.length, this.itemPerPage, this.pageIndex);
    this.list.render(this.pagination.getVisibleItems(client));
  }

  get filteredItems() {
    const searchVal = this.filters.values.search ?? '';
    const regex = searchVal.trim().length ? new RegExp(`${searchVal}`, 'gi') : new RegExp(/^.*$/);

    return this.clientData.reduce((items, item) => {
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

    this.filters = new Filters(
      this,
      this.element.querySelector('.filters'),
    );

    const filteredItems = this.filteredItems;

    this.pagination = new Pagination({
      targetContainer: this.element.querySelector('.invoice-footer'),
      totalEntriesAmount: filteredItems.length,
      entriesPerPage: this.itemPerPage,
      currentPageIndex: this.pageIndex
    });

    this.list = new List(
      this,
      this.element.querySelector('.invoice-list'),
      this.pagination.getVisibleItems(filteredItems)
    );

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>${i18next.t('clients')}</h1>
      <div class="filters"></div>
      <div class="invoice-head"></div>
      <div class="invoice-list"></div>
      <div class="invoice-footer"></div>
    `;
  }

  onDelete(id) {
    const modalElement = document.createElement('div');
    modalElement.classList.add('modal', 'fade');
    modalElement.innerHTML = /*html*/`
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">Löschen?</h5>
          </div>
          <div class="modal-body">
            <p>Soll die Rechnung wirklich gelöscht werden?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Abbrechen</button>
            <button type="button" class="btn btn-danger">Löschen</button>
          </div>
        </div>
      </div>
    `;

    this.element.appendChild(modalElement);
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    modalElement.querySelector('.btn-danger').addEventListener('click', e => {
      e.preventDefault();
      this.clientData = this.clientData.filter(invoice => invoice.id !== id);
      this.updateList();
      modal.hide();
    });

    modalElement.addEventListener('hidden.bs.modal', _ => {
      modal.dispose();
    });
  }
}