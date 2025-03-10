import Component from '/core/component.js';
import store from '/core/store.js';

export default class Sidebar extends Component {
  constructor(parent, element) {
    super(parent, element);

    this.element = element;
    this.render();
  }

  addEvents() {
    this.logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      store.state.token = '';
      localStorage.setItem('token', '');
      window.router.goTo('/');
    });

    this.links.forEach(linkElement => {
      linkElement.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.href === '#') return;
        window.router.goTo(e.target.href);

        if (window.innerWidth < 800) {
          localStorage.setItem('menu-open', 0);
          this.render();
        }
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
        width: 100%;
        display: flex;
        flex-direction: column;
        min-height: 100%;
        border-right: 1px solid #ccc;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 3;
        box-shadow: 2px 0 3px 0px rgba(0, 0, 0, 0.15);

        .menu-head {
          padding: 0 1rem 1rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid #ccc;
        }

        .menu-body {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
        }

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
          width: 200px;

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
      <div class="menu-head">
        <a href="#" class="button-toggle-menu">
          ${localStorage.getItem('menu-open') == 1 ? `
            <i class="fa-solid fa-times"></i>
          ` : `
            <i class="fa-solid fa-bars"></i>
          `}
        </a>
      </div>
      <div class="menu-body">
        <div class="inner">
          <strong>${i18next.t('menu')}</strong>
          <ul class="nav flex-column">
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
              <a class="nav-link button-logout" href="/"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
            </li>
          </ul>
        </div>
      </div>
    `;
  }
}