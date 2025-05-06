import Component from '/core/component.js';
import { i18n } from '/i18n/i18n.js';

export default class DashboardComponent extends Component {
  cssFilePath = '/page/dashboard-component.css';

  constructor() {
    super();
  }

  get template() {
    return /*html*/ `
      <h1>${i18n.t('dashboard')}</h1>
      <div class="row">
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h2>${i18n.t('limbo')}</h2>
              <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
              <a class="btn btn-primary btn-sm" href="/games/limbo" data-link>
                ${i18n.t('play')}
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h2>${i18n.t('mines')}</h2>
              <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
              <a class="btn btn-primary btn-sm" href="/games/mines" data-link>
                ${i18n.t('play')}
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('dashboard-component', DashboardComponent);