import Component from '/core/component.js';
import router from '/core/router.js';

export default class Client extends Component {
  stylesheet = '/page/client/overview/client.css';
  constructor(args) {
    super();

    this.parent = args.parent;
    this.data = args.data;
    this.element = args.element;

    this.addCSS().then(_ => this.render());
  }

  addEvents() {
    this.editButton.addEventListener('click', this.onEdit.bind(this));
    this.deleteButton.addEventListener('click', this.onDelete.bind(this));
  }

  /**
   * @param {Event} e
   */
  onEdit(e) {
    e.preventDefault();
    router.goTo(e.currentTarget.href);
  }

  /**
   * @param {Event} e
   */
  onDelete(e) {
    e.preventDefault();
    this.parent.onDelete(this.data.id);
  }

  render() {
    this.element.classList.add('client');
    this.element.innerHTML = this.template;
    this.editButton = this.element.querySelector('.button-edit');
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
            <li><a class="dropdown-item button-edit" href="/client/details/${this.data.id}">${i18next.t('edit')}</a></li>
            <li><a class="dropdown-item button-delete" href="#">${i18next.t('delete')}</a></li>
          </ul>
        </div>
      </div>
    `;
  }
}