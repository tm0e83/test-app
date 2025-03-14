import Component from '/core/component.js';
import router from '/core/router.js';
import { formatDate } from '/core/functions.js';

export default class Details extends Component {
  constructor(args) {
    super();

    this.id = router.route.routeParams.id;
    this.element = document.createElement('div');
    this.element.classList.add('invoice-details');

    // this.render();
    this.load()
      .then(response => response.json())
      .then(data => this.data = data)
      .then(_ => this.render())
      .catch(error => console.error('Fehler beim Abrufen von JSON:', error));
  }

  load() {
    return fetch(`/data/invoice${this.id}.json`);
  }

  addEvents() {
    this.links.forEach(linkElement => {
      linkElement.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.href === '#') return;
        router.goTo(e.target.href);
      });
    });
  }

  get languageISO() {
    return 'de-DE';
  }

  render() {
    this.element.classList.add('invoice-details');
    this.element.innerHTML = this.template;
    this.links = this.element.querySelectorAll('[href]');

    this.css`
    `;

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>${i18next.t('invoice')} #${this.data.id}</h1>
      <p class="item-date"><b>${i18next.t('date')}:</b><br>${formatDate(this.data.date)}</p>
      <p class="item-name"><b>${i18next.t('title')}:</b><br>${this.data.name}</p>
      <p class="item-description"><b>${i18next.t('description')}:</b><br>${this.data.description || 'N/A'}</p>
      <a class="btn btn-primary" href="/invoice/edit/${this.data.id}">${i18next.t('edit')}</a>
    `;
  }
}