//@ts-check

import Component from '/core/component.js';
import store from '/core/store.js';
import { formatCurrency } from '/core/functions.js';

export default class LayoutHeader extends Component {
  /** @type {boolean} */
  isMenuOpen = false;
  cssFilePath = '/layout/standard/layout-header.css';

  constructor() {
    super();

    this.render = this.render.bind(this);
    // this.onResize = this.onResize.bind(this);
  }

  addEvents() {
    store.unsubscribe('updateBalance', 'layoutHeader');
    store.subscribe('updateBalance', this.render.bind(this), { id: 'layoutHeader' });

    // window.removeEventListener('resize', this.onResize);
    // window.addEventListener('resize', this.onResize.bind(this));

    // this.toggleMenuButton.addEventListener('click', e => {
    //   e.preventDefault();
    //   this.dispatchEvent(new CustomEvent('toggleMenu'));
    //   this.render();
    // });
  }

  wait() {
    if (this.waitTimeout) clearTimeout(this.waitTimeout);
    return new Promise((resolve, reject) => {
      this.waitTimeout = setTimeout(_ => resolve(), 100);
    });
  }

  // async onResize() {
  //   await this.wait();
  //   this.render();
  // }

  render() {
    super.render();
    // this.toggleMenuButton = this.querySelector('.button-toggle-menu');
    this.addEvents();
  }

  /**
   * @returns {string}
   */
  get template() {
    return /*html*/ `
      <header>
        <div class="header-left"><a href="/dashboard" data-link>Logo</a></div>
        <div class="header-right">
          <div>${formatCurrency(store.state.user.balance)}</div>
          <div>
            <a href="/dashboard" data-link>
              <i class="fa-solid fa-user"></i>
            </a>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('layout-header', LayoutHeader);