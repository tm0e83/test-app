import Component from '/core/component.js';

export default class Details extends Component {
  constructor(args) {
    super();

    this.id = window.router.route.routeParams.id;
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

  }

  get languageISO() {
    return 'de-DE';
  }

  formatDate(dateStr) {
    return new Intl.DateTimeFormat(this.languageISO, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateStr))
  }

  render() {
    this.element.classList.add('invoice-details');
    this.element.innerHTML = this.template;

    this.css`
    `;

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>${i18next.t('invoice')} #${this.data.id}</h1>
      <p class="item-date"><b>${i18next.t('date')}:</b><br>${this.formatDate(this.data.date)}</p>
      <p class="item-name"><b>${i18next.t('title')}:</b><br>${this.data.name}</p>
      <p class="item-description"><b>${i18next.t('description')}:</b><br>${this.data.description || 'N/A'}</p>
      <a class="btn btn-primary" href="/invoice/edit/${this.data.id}">Bearbeiten</a>
    `;
  }
}