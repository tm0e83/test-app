import Component from '/core/component.js';
import store from '/core/store.js';
// import { formatCurrency } from '/core/functions.js';
import '/components/shared/language-selection/language-selection.js';

export default class LayoutBlankHeader extends Component {
  /** @type {boolean} */
  isMenuOpen = false;
  cssFilePath = '/components/layouts/blank/layout-header/layout-blank-header.css';

  constructor() {
    super();

    this.render = this.render.bind(this);
    // this.onResize = this.onResize.bind(this);
  }

  addEvents() {
    store.unsubscribe('UPDATE_BALANCE', 'layoutBlankHeader');
    store.subscribe('UPDATE_BALANCE', this.render.bind(this), { id: 'layoutBlankHeader' });

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
      this.waitTimeout = setTimeout(() => resolve(null), 100);
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
        <div class="header-left"></div>
        <div class="header-right">
          <div>
            <language-selection></language-selection>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('layout-blank-header', LayoutBlankHeader);