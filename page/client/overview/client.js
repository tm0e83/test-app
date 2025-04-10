import Component from '/core/component.js';
import router from '/core/router.js';

export default class Client extends Component {
  constructor(parent, data) {
    super(parent);

    this.data = data;

    this.addCSS('/page/client/overview/client.css');
    this.element = document.createElement('div');
    this.element.classList.add('client');
    this.render = this.render.bind(this);
    this.render();
  }

  addEvents() {
    this.deleteButton.addEventListener('click', this.onDelete.bind(this));
  }

  /**
   * @param {Event} e
   */
  onDelete(e) {
    e.preventDefault();
    this.parent.onDelete(this.data.id);
  }

  render() {
    this.element.innerHTML = this.template;
    this.deleteButton = this.element.querySelector('.button-delete');

    this.addEvents();
  }

  /**
   * @returns {string} html template string
   */
  get template() {
    return /*html*/ `
      <div class="item-id">${this.data.id}</div>
      <div class="item-name">${this.data.name}</div>
      <div class="item-menu">
        <div class="dropdown">
          <a class="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item button-edit" href="/client/details/${this.data.id}" data-link>${i18next.t('edit')}</a></li>
            <li><a class="dropdown-item button-delete" href="#">${i18next.t('delete')}</a></li>
          </ul>
        </div>
      </div>
    `;
  }
}