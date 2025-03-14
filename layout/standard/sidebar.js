import Component from '/core/component.js';
import store from '/core/store.js';
import css from './sidebar.css' with { type: 'css' };
import router from '/core/router.js';

export default class Sidebar extends Component {
  constructor(parent, element) {
    super(parent, element);

    this.element = element;
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];

    this.render();
  }

  addEvents() {
    this.toggleMenuButton.addEventListener('click', e => {
      e.preventDefault();

      if (window.innerWidth < 800) {
        localStorage.setItem('menu-open', this.isOpen == 1 ? 0 : 1);
        this.render();
      }
    });

    this.logoutButton.addEventListener('click', e => {
      e.preventDefault();
      store.state.token = '';
      localStorage.setItem('token', '');
      router.goTo('/');
    });

    router.addLinkEvents(this.element.querySelectorAll('[href]'));
  }

  render() {
    this.isOpen ? this.close() : this.open();
    this.element.innerHTML = this.template;
    this.toggleMenuButton = this.element.querySelector('.button-toggle-menu');
    this.logoutButton = this.element.querySelector('.button-logout');

    this.addEvents();
  }

  /**
   * @returns {boolean}
   */
  get isOpen() {
    return localStorage.getItem('menu-open') == 1;
  }

  open() {
    this.element.classList.remove('closed');
    this.element.classList.add('open');
  }

  close() {
    this.element.classList.remove('open');
    this.element.classList.add('closed');
  }

  get template() {
    return /*html*/ `
      <div class="menu-head">
        <a class="button-toggle-menu">
          <i class="fa-solid fa-${this.isOpen ? 'times' : 'bars'}"></i>
        </a>
      </div>
      <div class="menu-body">
        <div class="inner">
          <strong>${i18next.t('menu')}</strong>
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link active" href="/dashboard">${i18next.t('Dashboard')}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" href="/client/overview">${i18next.t('clients')}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" href="/invoice/overview">${i18next.t('invoices')}</a>
            </li>
          </ul>
        </div>
        <div class="inner">
            <hr>
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link active" href="/settings">${i18next.t('settings')}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link button-logout" href="/"><i class="fa-solid fa-arrow-right-from-bracket"></i> ${i18next.t('logout')}</a>
            </li>
          </ul>
        </div>
      </div>
    `;
  }
}