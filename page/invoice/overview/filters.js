import Component from '/core/component.js';
import router from '/core/router.js';

export default class Filters extends Component {
  stylesheet = '/page/invoice/overview/filters.css';

  constructor(parent, element) {
    super(parent, element);

    this.element = element;

    this.addCSS().then(_ => this.render());
  }

  addEvents() {
    this.searchInput.addEventListener('input', this.onFilterChange.bind(this));
    this.typeSelect.addEventListener('change', this.onFilterChange.bind(this));
  }

  onFilterChange(e) {
    this.dispatchEvent(new CustomEvent('change', { detail: this.values }));
  }

  get values() {
    const values = {
      search: '',
      type: ''
    };

    if (this.searchInput?.value) {
      values.search = this.searchInput.value;
    }

    if (this.typeSelect?.value) {
      values.type = this.typeSelect.value;
    }

    return values;
  }

  render() {
    this.element.innerHTML = this.template;
    this.element.classList.add('filters');
    this.searchInput = this.element.querySelector('input');
    this.typeSelect = this.element.querySelector('select');

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <div>
        <input
          type="text"
          placeholder="${i18next.t('search')}"
          class="form-control mb-4"
          value="${router.route.params.search ?? ''}"
        >
      </div>
      <div>
        <select class="form-control mb-4">
          <option value="">${i18next.t('type')}</option>
          <option value="1" ${router.route.params.type == 1 ? 'selected' : ''}>${i18next.t('type')} 1</option>
          <option value="2" ${router.route.params.type == 2 ? 'selected' : ''}>${i18next.t('type')} 2</option>
        </select>
      </div>
    `;
  }
}