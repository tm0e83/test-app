import Component from '/core/component.js';
import css from './header.css' with { type: 'css' };

export default class Header extends Component {
  constructor(parent, element) {
    super(parent, element);

    this.element = element;
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];

    this.render();
  }

  addEvents() {
    this.toggleMenuButton.addEventListener('click', e => {
      e.preventDefault();
      localStorage.setItem('menu-open', this.isOpen ? 0 : 1);
      this.dispatchEvent(new CustomEvent('toggleMenu'));
      this.render();
    });

    window.router.addLinkEvents(this.element.querySelectorAll('[href]'));
  }

  render() {
    this.element.innerHTML = this.template;
    this.toggleMenuButton = this.element.querySelector('.button-toggle-menu');

    this.addEvents();
  }

  /**
   * @returns {boolean}
   */
  get isOpen() {
    return localStorage.getItem('menu-open') == 1;
  }

  get template() {
    return /*html*/ `
      <div class="header-menu">
        <a class="button-toggle-menu">
          <i class="fa-solid fa-${this.isOpen ? 'times' : 'bars'}"></i>
        </a>
        <a href="/dashboard"><i class="fa-solid fa-house"></i></a>
        <a class="button-toggle-notifications"><i class="fa-solid fa-bell"></i></a>
      </div>
      <a href="/dashboard">Logo</a>
    `;
  }
}