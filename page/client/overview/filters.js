import Component from '/core/component.js';

export default class Filters extends Component {
  constructor(parent, element) {
    super(parent, element);

    this.element = element;

    this.render();
  }

  addEvents() {
    this.searchInput.addEventListener('input', this.onFilterChange.bind(this));
    this.typeSelect.addEventListener('change', this.onFilterChange.bind(this));
  }

  onFilterChange(e) {
    this.dispatchEvent(new CustomEvent('change', { detail: this.values }));
  }

  get values() {
    const values = {};

    if (this.searchInput.value) {
      values.search = this.searchInput.value;
    }

    if (this.typeSelect.value) {
      values.type = this.typeSelect.value;
    }

    return values;
  }

  render() {
    this.element.innerHTML = this.template;
    this.element.classList.add('filters');
    this.searchInput = this.element.querySelector('input');
    this.typeSelect = this.element.querySelector('select');

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
          placeholder="Suche"
          class="form-control mb-4"
          value="${window.router.route.params.search ?? ''}"
        >
      </div>
      <div>
        <select class="form-control mb-4">
          <option value="">Typ</option>
          <option value="1" ${window.router.route.params.type == 1 ? 'selected' : ''}>Typ 1</option>
          <option value="2" ${window.router.route.params.type == 2 ? 'selected' : ''}>Typ 2</option>
        </select>
      </div>
    `;
  }
}