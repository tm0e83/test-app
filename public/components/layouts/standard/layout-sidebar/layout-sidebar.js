import Component from '/core/component.js';
import { i18n } from '/i18n/i18n.js';
import store from '/core/store.js';
import router from '/core/router.js';

// @ts-ignore
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { expireCookie } from '/core/functions.js';

export default class LayoutSidebar extends Component {
  /** @type {boolean} */
  _isOpen = false;

  cssFilePath = '/components/layouts/standard/layout-sidebar/layout-sidebar.css';

  constructor() {
    super();

    this.onResize = this.onResize.bind(this);
    this.onLogoutButtonClick = this.onLogoutButtonClick.bind(this);
    this.render = this.render.bind(this);
  }

  onDestroy() {
    window.removeEventListener('resize', this.onResize);
    router.removeEventListener('routeChange', this.render);
  }

  addEvents() {
    window.removeEventListener('resize', this.onResize);
    window.addEventListener('resize', this.onResize);

    this.addEventListener('onDestroy', this.onDestroy.bind(this));

    this.toggleMenuButton?.addEventListener('click', e => {
      e.preventDefault();
      this.toggle();
    });

    this.logoutButton?.addEventListener('click', this.onLogoutButtonClick);

    this.querySelectorAll('[data-link]').forEach(element => {
      element.addEventListener('click', e => {
        if (this.isMobile) {
          this.close();
        }
      });
    });

    router.addEventListener('routeChange', this.render);
  }

  /**
   * @param {Event} event
   */
  onLogoutButtonClick(event) {
    event.preventDefault();
    const auth = getAuth();
    signOut(auth);
    expireCookie('idToken');
  }

  wait() {
    if (this.waitTimeout) clearTimeout(this.waitTimeout);
    return new Promise((resolve, reject) => {
      this.waitTimeout = setTimeout(() => resolve(null), 100);
    });
  }

  async onResize() {
    await this.wait();
    this.render();
  }

  toggle() {
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
   * Checks if the screen is mobile.
   * A screen is considered mobile if its width is less than 800 pixels.
   * @returns {boolean}
   */
  get isMobile() {
    return window.innerWidth < 800;
  }

  /**
   * Checks if the menu is open.
   * If the screen is mobile, it uses the internal state.
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
          <ul class="nav flex-col">
            <li class="nav-item">
              <a class="nav-link ${router.route.config.path === 'dashboard' ? 'active' : ''}" href="/dashboard" data-link>
                <i class="fa-solid fa-table-cells"></i>
                <span>${i18n.t('dashboard')}</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link ${router.route.config.path === 'games/limbo' ? 'active' : ''}" href="/games/limbo" data-link>
                <i class="fa-solid fa-arrow-down-up-across-line"></i>
                <span>${i18n.t('limbo')}</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link ${router.route.config.path === 'games/mines' ? 'active' : ''}" href="/games/mines" data-link>
                <i class="fa-solid fa-land-mine-on"></i>
                <span>${i18n.t('mines')}</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="inner">
          <hr>
          <ul class="nav flex-column">
            ${store.state.user.role === 'admin' ? /*html*/ `
              <li class="nav-item">
                <a class="nav-link ${router.route.config.path === 'styleguide' ? 'active' : ''}" href="/styleguide" data-link>
                  <i class="fa-solid fa-code"></i>
                  <span>${i18n.t('Styleguide')}</span>
                </a>
              </li>
            ` : ''}
            <li class="nav-item">
              <a class="nav-link ${router.route.config.path === 'settings' ? 'active' : ''}" href="/settings" data-link>
                <i class="fa-solid fa-gear"></i>
                <span>${i18n.t('settings')}</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link button-logout" href="/">
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