//@ts-check

import Component from '/core/component.js';
import { i18n } from '/i18n/i18n.js';
import store from '/core/store.js';
import router from '/core/router.js';

export default class LayoutSidebar extends Component {
  /** @type {boolean} */
  _isOpen = false;

  cssFilePath = '/layout/standard/layout-sidebar.css';

  constructor() {
    super();
  }

  onDestroy() {
    window.removeEventListener('resize', this.onResize);
  }

  addEvents() {
    window.removeEventListener('resize', this.onResize);
    window.addEventListener('resize', this.onResize.bind(this));

    this.addEventListener('onDestroy', this.onDestroy.bind(this));

    this.toggleMenuButton.addEventListener('click', e => {
      e.preventDefault();
      this.toggle();
    });

    this.logoutButton.addEventListener('click', this.onLogoutButtonClick.bind(this));

    this.querySelectorAll('[data-link]').forEach(element => {
      element.addEventListener('click', e => {
        if (this.isMobile) {
          this.close();
        }
      });
    });
  }

  onLogoutButtonClick(e) {
    e.preventDefault();
    store.state.token = '';
    localStorage.setItem('token', '');
    router.navigate('/login');
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
    console.log('toggle');
    if (!this.isMobile) {
      localStorage.setItem('menu-open', localStorage.getItem('menu-open') == '1' ? '0' : '1');
    } else {
      this._isOpen = !this._isOpen;
    }

    this.render();
  }

  render() {
    this.isOpen ? this.open() : this.close();
    this.innerHTML = this.template;
    this.toggleMenuButton = this.querySelector('.button-toggle-menu');
    this.logoutButton = this.querySelector('.button-logout');

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
    return this.isMobile ? this._isOpen : localStorage.getItem('menu-open') == '1';
  }

  open() {
    this.classList.remove('closed');
    this.classList.add('open');
  }

  close() {
    this.classList.remove('open');
    this.classList.add('closed');
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
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link active" href="/dashboard" data-link>
                <i class="fa-solid fa-table-cells"></i>
                <span>${i18n.t('dashboard')}</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/games/limbo" data-link>
                <i class="fa-solid fa-arrow-down-up-across-line"></i>
                <span>${i18n.t('limbo')}</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/games/mines" data-link>
                <i class="fa-solid fa-land-mine-on"></i>
                <span>${i18n.t('mines')}</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="inner">
          <hr>
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link active" href="/settings" data-link>
                <i class="fa-solid fa-gear"></i>
                <span>${i18n.t('settings')}</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link button-logout" href="/" data-link>
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>${i18n.t('logout')}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    `;
  }
}

customElements.define('layout-sidebar', LayoutSidebar);