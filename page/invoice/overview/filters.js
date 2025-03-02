import Component from '/core/component.js';

export default class Filters extends Component {
  constructor(parent, element) {
    super(parent, element);

    this.element = element;

    this.render();
  }

  addEvents() {
    this.searchInput.addEventListener('input', this.onSearchInput.bind(this));
    this.typeSelect.addEventListener('change', this.onTypeChange.bind(this));
  }

  onSearchInput(e) {
    this.dispatchEvent(new CustomEvent('change', { detail: this.filters }));
  }

  onTypeChange(e) {
    this.dispatchEvent(new CustomEvent('change', { detail: this.filters }));
  }

  get filters() {
    return {
      search: this.searchInput.value,
      type: this.typeSelect.value
    }
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
        <input type="text" placeholder="Suche" class="form-control mb-4">
      </div>
      <div>
        <select class="form-control mb-4">
          <option value="">Typ</option>
          <option value="1">Typ 1</option>
          <option value="2">Typ 2</option>
        </select>
      </div>
    `;
  }
}