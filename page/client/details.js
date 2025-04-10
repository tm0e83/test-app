import Component from '/core/component.js';
import router from '/core/router.js';

export default class Details extends Component {
  constructor(args) {
    super();

    this.id = router.route.routeParams.id;
    this.element = document.createElement('div');
    this.element.classList.add('client-details', 'loading');
    this.render = this.render.bind(this);

    this.load()
      .then(response => response.json())
      .then(data => this.data = data)
      .then(_ => this.render())
      .then(_ => this.element.classList.remove('loading'))
      .catch(error => console.error('Fehler beim Abrufen von JSON:', error));
  }

  load() {
    return fetch(`/data/client${this.id}.json`);
  }

  addEvents() {
  }

  get languageISO() {
    return 'de-DE';
  }

  render() {
    this.element.innerHTML = this.template;
    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>${i18next.t('client')} #${this.data.id}</h1>
      <a class="btn btn-primary" href="/client/edit/${this.data.id}" data-link>${i18next.t('edit')}</a>
    `;
  }
}