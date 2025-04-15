import Component from '/core/component.js';
import router from '/core/router.js';

export default class Dashboard extends Component {
  constructor(element) {
    super();

    this.element = document.createElement('div');
    this.element.classList.add('dashboard');

    this.addCSS('/page/dashboard.css');
    this.render();
  }

  addEvents() {
  }

  render() {
    this.element.innerHTML = this.template;
    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>Dashboard</h1>
      <div class="row">
        <div class="col-12 col-md-6 col-lg-3 mb-4">
          <div class="card">
            <div class="card-body">
              <h2>lirum</h2>
              <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
              <a class="btn btn-primary btn-sm" href="/client/overview" data-link>
                ${i18next.t('clients')}
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-3 mb-4">
          <div class="card">
            <div class="card-body">
              <h2>larum</h2>
              <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
              <a class="btn btn-primary btn-sm" href="/invoice/overview" data-link>
                ${i18next.t('invoices')}
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-3 mb-4">
          <div class="card">
            <div class="card-body">
              <h2>löffel</h2>
              <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
              <a class="btn btn-primary btn-sm" href="/settings" data-link>
                ${i18next.t('settings')}
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-3 mb-4">
          <div class="card">
            <div class="card-body">
              <h2>stiel</h2>
              <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
              <a class="btn btn-primary btn-sm" href="/settings" data-link>
                ${i18next.t('settings')}
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}