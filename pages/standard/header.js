import Component from '/core/component.js';

export default class Header extends Component {
  constructor(element) {
    super();

    this.element = element;
    this.render();
  }

  addEvents() {
    this.links.forEach(linkElement => {
      linkElement.addEventListener('click', e => {
        e.preventDefault();
        window.router.goTo(e.target.href);
      });
    });

    this.toggleMenuButton.addEventListener('click', e => {
      e.preventDefault();
      localStorage.setItem('menu-open', localStorage.getItem('menu-open') == 1 ? 0 : 1);
      this.dispatchEvent(new CustomEvent('toggleMenu'));
    });
  }

  render() {
    this.element.innerHTML = this.template;
    this.links = this.element.querySelectorAll('a[href]');
    this.toggleMenuButton = this.element.querySelector('.button-toggle-menu');

    this.css`
      header {
        border-bottom: 1px solid #c4c4c4;
        padding: 1rem;
        text-align: right;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 2;

        .header-menu {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          justify-content: space-between;
        }
      }
    `;

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <div class="header-menu">
        <a class="button-toggle-menu"><i class="fa-solid fa-bars"></i></a>
        <a href="/invoices"><i class="fa-solid fa-house"></i></a>
        <a class="button-toggle-notifications"><i class="fa-solid fa-bell"></i></a>
      </div>
      <a href="/invoices">Logo</a>
    `;
  }
}