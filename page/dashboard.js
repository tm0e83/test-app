import Component from '/core/component.js';

export default class Dashboard extends Component {
  constructor(element) {
    super();

    this.element = document.createElement('div');
    this.element.classList.add('dashboard');

    this.render();
  }

  addEvents() {
    window.router.addLinkEvents(this.element.querySelectorAll('[href]'));
  }

  render() {
    this.element.innerHTML = this.template;
    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>Dashboard</h1>
      <div class="row">
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h2>abc</h2>
              <p>abc</p>
              <a class="btn btn-primary btn-sm" href="/invoice/overview">
                Rechnungen
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h2>abc</h2>
              <p>abc</p>
              <a class="btn btn-primary btn-sm" href="/settings">
                Einstellungen
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h2>abc</h2>
              <p>abc</p>
              <a class="btn btn-primary btn-sm" href="/dashboard">
                Blub
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}