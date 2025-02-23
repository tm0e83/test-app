import Component from './core/component.js';

export default class Sidebar extends Component {
  constructor(element) {
    super();

    this.element = element;
    this.render();
  }

  addEvents() {
    this.logoutButton.addEventListener('click', () => {
      window.router.dispatchEvent(new CustomEvent('logout'));
    });

    this.links.forEach(linkElement => {
      linkElement.addEventListener('click', e => {
        e.preventDefault();
        history.replaceState(null, null, e.target.href);
        window.router.dispatchEvent(new CustomEvent('routeChange', { detail: e.target.href }));
      });
    });
  }

  render() {
    this.element.innerHTML = this.template;
    this.css`
      aside {
        background-color: #fff;
        padding: 1rem;
        width: 200px;

        strong {
          display: block;
          padding: 0 1rem 0;
          margin-bottom: 0.5rem;
        }
      }
    `
    this.logoutButton = this.element.querySelector('.button-logout');
    this.links = this.element.querySelectorAll('[href="/invoices"], [href="/addresses"]');

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <strong>Menü</strong>
      <ul class="nav flex-column">
        <li class="nav-item">
          <a class="nav-link active" href="/invoices">Rechnungen</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/addresses">Adressen</a>
        </li>
        <li class="nav-item">
          <a class="nav-link button-logout"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
        </li>
      </ul>
    `;
  }
}