import { i18n } from '/i18n/i18n.js';
import Component from '/core/component.js';

export default class SelectDropdown extends Component {
  cssFilePath = '/core/select-dropdown/select-dropdown.css';

  constructor() {
    super();

    this.onSearch = this.onSearch.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addGlobalEvents();
    this.dropdownContent = this.innerHTML;
    this.render();
  }

  disconnectedCallback() {
    this.removeGlobalEvents();
    this.removeEvents();
    super.disconnectedCallback();
    this.dropdownContent = '';
    this.trigger = null;
    this.searchInput = null;
    this.innerHTML = '';
    this.removeAttribute('open');
  }

  render() {
    this.removeEvents();
    super.render();

    this.trigger = this.querySelector('.trigger');
    this.searchInput = this.querySelector('input');

    this.addEvents();
  }

  addGlobalEvents() {
    document.body?.addEventListener('click', this.onClickOutside);
  }

  removeGlobalEvents() {
    document.body?.removeEventListener('click', this.onClickOutside);
  }

  addEvents() {
    this.removeEvents();

    this.trigger?.addEventListener('click', this.onToggle);
    this.searchInput?.addEventListener('input', this.onSearch);
    this.querySelectorAll('.dropdown-content > a').forEach(item => {
      item.addEventListener('click', this.onItemClick);
    });
  }

  removeEvents() {
    this.trigger?.removeEventListener('click', this.onToggle);
    this.searchInput?.removeEventListener('input', this.onSearch);
    this.querySelectorAll('.dropdown-content > a').forEach(item => {
      item.removeEventListener('click', this.onItemClick);
    });
  }

  /**
   * @param {Event} event
   */
  onItemClick(event) {
    event.preventDefault();
    const item = /** @type {HTMLElement} */ (event.currentTarget);
    const value = item.getAttribute('data-value');
    if (value) {
      this.dispatchEvent(new CustomEvent('select', { detail: { value } }));
    }
    this.close();
  }

  /**
   * @param {Event} event
   */
  onSearch(event) {
    const target = /** @type {HTMLInputElement} */ (event.target);
    const searchValue = target && target.value ? target.value.toLowerCase() : '';
    const items = this.querySelectorAll('.dropdown-content > div');

    items.forEach(item => {
      const el = /** @type {HTMLElement} */ (item);
      if (el && (el.textContent ?? '').toLowerCase().includes(searchValue)) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });

    const noResults = /** @type {HTMLElement} */ (this.querySelector('.no-results'));
    if (noResults) {
      noResults.style.display = searchValue
        ? (Array.from(items).some(item => /** @type {HTMLElement} */(item).style.display !== 'none') ? 'none' : '')
        : 'none';
    }
  }

  /**
   * @param {Event} event
   */
  onClickOutside(event) {
    if (this.isOpen) {
      const target = /** @type {HTMLInputElement} */ (event.target);
      if (this.contains(target) ||target.closest('.select-dropdown')) {
        return; // Click is inside the dropdown
      }

      this.close();
    }
  }

  /**
   * @param {Event} event
   */
  onToggle(event) {
    !this.isOpen ? this.open() : this.close();
  }

  open() {
    this.setAttribute('open', '');
    this.searchInput?.focus();
  }

  close() {
     this.removeAttribute('open');
  }

  get isOpen() {
    return this.hasAttribute('open');
  }

  get template() {
    return /*html*/ `
      ${this.dropdownContent}
    `;
  }
}

customElements.define('select-dropdown', SelectDropdown);