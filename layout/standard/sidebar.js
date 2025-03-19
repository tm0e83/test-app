import Component from '/core/component.js';
import store from '/core/store.js';
import router from '/core/router.js';
import LayoutStandard from '.';

export default class Sidebar extends Component {
  /** @type {string} */
  stylesheet = '/layout/standard/sidebar.css';

  /** @type {boolean} */
  #isOpen = false;

  /**
   * @param {LayoutStandard} parent
   * @param {HTMLElement} element
   */
  constructor(parent, element) {
    super(parent, element);

    /** @type {HTMLElement} */
    this.element = element;

    this.addCSS().then(_ => this.render());
  }

  addEvents() {
    window.removeEventListener('resize', this.onResize);
    window.addEventListener('resize', this.onResize.bind(this));

    this.toggleMenuButton.addEventListener('click', e => {
      e.preventDefault();
      this.toggle();
    });

    this.logoutButton.addEventListener('click', e => {
      e.preventDefault();
      store.state.token = '';
      localStorage.setItem('token', '');
      router.goTo('/');
    });

    router.addLinkEvents(this.element.querySelectorAll('[href]'));

    this.element.querySelectorAll('[href]').forEach(element => {
      element.addEventListener('click', e => {
        if (this.isMobile) {
          this.toggle();
        }
      });
    });
  }

  wait() {
    if (this.waitTimeout) clearTimeout(this.waitTimeout);
    return new Promise((resolve, reject) => {
      this.waitTimeout = setTimeout(_ => resolve(), 100);
    });
  }

  async onResize() {
    await this.wait();
    this.render();
  }

  toggle() {
    if (!this.isMobile) {
      localStorage.setItem('menu-open', localStorage.getItem('menu-open') == 1 ? 0 : 1);
    } else {
      this.#isOpen = !this.#isOpen;
    }

    this.render();
  }

  render() {
    this.isOpen ? this.open() : this.close();
    this.element.innerHTML = this.template;
    this.toggleMenuButton = this.element.querySelector('.button-toggle-menu');
    this.logoutButton = this.element.querySelector('.button-logout');

    this.addEvents();
  }

  /**
   * @returns {boolean}
   */
  get isMobile() {
    return window.innerWidth < 800;
  }

  /**
   * @returns {boolean}
   */
  get isOpen() {
    return this.isMobile ? this.#isOpen : localStorage.getItem('menu-open') == 1;
  }

  open() {
    this.element.classList.remove('closed');
    this.element.classList.add('open');
  }

  close() {
    this.element.classList.remove('open');
    this.element.classList.add('closed');
  }

  /**
   * @returns {string}
   */
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