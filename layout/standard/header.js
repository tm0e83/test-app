//@ts-check

import Component from '/core/component.js';
import LayoutStandard from '/layout/standard/index.js';

export default class Header extends Component {
  /** @type {boolean} */
  isMenuOpen = false;

  /**
   * @param {LayoutStandard} parent
   */
  constructor(parent) {
    super(parent);

    this.addCSS('/layout/standard/header.css');
    this.render = this.render.bind(this);
    this.element = document.createElement('header');
    this.render();
  }

  addEvents() {
    window.removeEventListener('resize', this.onResize);
    window.addEventListener('resize', this.onResize.bind(this));

    this.toggleMenuButton.addEventListener('click', e => {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent('toggleMenu'));
      this.render();
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

  render() {
    this.element.innerHTML = this.template;
    this.toggleMenuButton = this.element.querySelector('.button-toggle-menu');

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
    return this.isMobile ? this.isMenuOpen : localStorage.getItem('menu-open') == '1';
  }

  /**
   * @returns {string}
   */
  get template() {
    return /*html*/ `
      <div class="header-menu">
        <a class="button-toggle-menu">
          <i class="fa-solid fa-${this.isOpen ? 'times' : 'bars'}"></i>
        </a>
        <a href="/dashboard" data-link><i class="fa-solid fa-house"></i></a>
        <a class="button-toggle-notifications"><i class="fa-solid fa-bell"></i></a>
      </div>
      <a href="/dashboard" data-link>Logo</a>
    `;
  }
}