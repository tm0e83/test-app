//@ts-check

import Component from '/core/component.js';
import ModalConfirm from '/core/modal-confirm.js';
import Pagination from '/core/pagination.js';
import Filters from './overview/filters.js';
import List from './overview/list.js';
import { getQueryParams } from '/core/functions.js';

export default class Overview extends Component {
  constructor() {
    super();

    this.addCSS('/page/client/overview.css');

    /** @type {object} */
    const params = getQueryParams();

    /** @type {number} */
    this.pageIndex = params.page ?? 0;

    /** @type {number} */
    this.itemPerPage = 10;

    /** @type {array} */
    this.clientData = [];

    this.element = document.createElement('div');
    this.element.classList.add('client-overview', 'loading');

    this.render = this.render.bind(this);
    this.render();

    this.load()
      .then(response => response.json())
      .then(data => this.clientData = data)
      .then(_ => this.render())
      .then(_ => this.element.classList.remove('loading'))
      .catch(error => console.error('Fehler beim Abrufen von JSON:', error));
  }

  async load() {
    return fetch('/data/clients.json');
  }

  toQueryString(obj) {
    const searchParams = new URLSearchParams();
    Object.keys(obj).forEach(key => searchParams.append(key, obj[key]));
    return searchParams;
  }

  addEvents() {
    this.pagination.addEventListener('pageChange', e => {
      this.pageIndex = /** @type {CustomEvent} */ (e).detail;
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
    const queryParams = this.toQueryString(Object.assign({ page: this.pageIndex }, this.filters.values));
    const path = window.location.pathname + `?${queryParams}`;
    history.pushState({ path: window.location.pathname }, null, path);
  }

  updateList() {
    const client = this.filteredItems;
    this.pagination.update(client.length, this.itemPerPage, this.pageIndex);
    this.list.render(this.pagination.getVisibleItems(client));
  }

  /**
   * Filter items based on the search value and type.
   * @returns {Array} Filtered items.
   */
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
    this.clientList = this.element.querySelector('.client-list');

    this.filters = new Filters(this);
    this.element.querySelector('client-filters').replaceWith(this.filters.element);

    const filteredItems = this.filteredItems;

    this.pagination = new Pagination({
      targetContainer: this.element.querySelector('client-footer'),
      totalEntriesAmount: filteredItems.length,
      entriesPerPage: this.itemPerPage,
      currentPageIndex: this.pageIndex
    });

    this.list = new List(this, this.pagination.getVisibleItems(filteredItems));
    this.element.querySelector('client-list').replaceWith(this.list.element);

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>${i18next.t('clients')}</h1>
      <client-filters></client-filters>
      <client-list></client-list>
      <client-footer></client-footer>
    `;
  }

  /**
   * display a modal confirm dialog to delete a client
   * @param {Number} id
   */
  onDelete(id) {
    ModalConfirm.show({
      title: i18next.t('delete'),
      message: i18next.t('reallyDeleteClient'),
      onConfirm: e => {
        e.preventDefault();
        this.clientData = this.clientData.filter(invoice => invoice.id !== id);
        this.updateList();
        ModalConfirm.hide();
      }
    });
  }
}