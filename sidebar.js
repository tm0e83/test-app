import Component from './core/component.js';

export default class Sidebar extends Component {
  constructor(element) {
    super();

    this.element = element;
    this.render();
  }

  addEvents() {
    this.logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.state.token = '';
      localStorage.setItem('token', '');
      window.router.goTo('/');
    });

    this.links.forEach(linkElement => {
      linkElement.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.href === '#') return;
        window.mainRouter.goTo(e.target.href);
      });
    });
  }

  render() {
    this.element.classList.add(localStorage.getItem('menu-open') != 0 ? 'open' : 'closed');
    this.element.classList.remove(localStorage.getItem('menu-open') != 0 ? 'closed' : 'open');

    this.element.innerHTML = this.template;

    this.css`
      aside {
        background-color: #fff;
        padding: 1rem 0;
        width: 200px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-right: 1px solid #ccc;
        position: absolute;
        z-index: 1;
        box-shadow: 2px 0 3px 0px rgba(0, 0, 0, 0.15);

        &.closed {
          display: none;
        }

        strong {
          display: block;
          padding: 0 1rem 0;
          margin-bottom: 0.5rem;
        }
      }

      @media (min-width: 800px) {
        aside {
          position: relative;
          box-shadow: none;

          &.closed {
            width: 50px;

            .inner {
              display: none;
            }
          }
        }
      }
    `
    this.logoutButton = this.element.querySelector('.button-logout');
    this.links = this.element.querySelectorAll('[href]');

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <div class="inner">
        <strong>Menü</strong>
        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link active" href="/calendar">Kalender</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="/download">Download</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="/invoices">Rechnungen</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/addresses">Adressen</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/offer-management">Angebotsverwaltung</a>
          </li>
        </ul>
      </div>
      <div class="inner">
          <hr>
        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link active" href="/manage-users">Benutzerverwaltung</a>
          </li>
          <li class="nav-item">
            <a class="nav-link button-logout" href="/"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
          </li>
        </ul>
      </div>
    `;
  }
}