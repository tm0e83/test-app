import Component from '/core/component.js';
import router from '/core/router.js';

export default class Filters extends Component {
  constructor(parent, element) {
    super(parent, element);

    this.element = element;

    this.render();
  }

  addEvents() {
    this.searchInput.addEventListener('input', this.onFilterChange.bind(this));
  }

  onFilterChange(e) {
    this.dispatchEvent(new CustomEvent('change', { detail: this.values }));
  }

  get values() {
    const values = {};

    if (this.searchInput.value) {
      values.search = this.searchInput.value;
    }

    return values;
  }

  render() {
    this.element.innerHTML = this.template;
    this.element.classList.add('filters');
    this.searchInput = this.element.querySelector('input');

    this.css`
      .filters {
        display: flex;
        gap: 1rem;
      }
    `;

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
    `;
  }
}