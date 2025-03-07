import Component from '/core/component.js';

export default class Edit extends Component {
  constructor(args) {
    super();

    this.id = window.router.route.routeParams.id;
    this.element = document.createElement('div');
    this.element.classList.add('invoice-edit', 'loading');

    // this.render();
    this.load()
      .then(response => response.json())
      .then(data => this.data = data)
      .then(_ => this.element.classList.remove('loading'))
      .then(_ => this.render())
      .catch(error => console.error('Fehler beim Abrufen von JSON:', error));
  }

  load() {
    return fetch(`/data/invoice${this.id}.json`);
  }

  addEvents() {
    this.form.addEventListener('submit', this.onFormSubmit.bind(this))
  }

  async onFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);

    this.element.classList.add('loading');

    await this.save(formData);

    // Object.fromEntries(formData);
    this.element.classList.remove('loading');

    window.notify.send(i18next.t('saved'), 'success');
  }

  save(formData) {
    return new Promise((resolve, reject) => {
      setTimeout(_ => resolve(), 1000);
    });
  }

  formatDate(dateStr, locale = 'de-DE') {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateStr))
  }

  render() {
    this.element.classList.add('invoice-details');
    this.element.innerHTML = this.template;
    this.form = this.element.querySelector('form');

    this.css`
    `;

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>${i18next.t('editInvoice')}</h1>
      <strong>#${this.data.id}</strong><br><br>

      <form>
        <label for="invoice-title">${i18next.t('title')}</label>
        <input
          id="invoice-title"
          name="title"
          value="${this.data.name}"
          class="form-control mb-4"
          required
        >
        <label for="invoice-date">${i18next.t('Datum')}</label>
        <input
          type="datetime-local"
          id="invoice-date"
          name="date"
          value="${new Date(this.data.date).toISOString().slice(0, 16)}"
          class="form-control mb-4"
          required
        >
        <label for="invoice-description">${i18next.t('Beschreibung')}</label>
        <textarea
          id="invoice-description"
          name="description"
          class="form-control mb-4"
        >${this.data.description}</textarea>

        <button class="btn btn-primary">${i18next.t('Save')}</button>
      </form>
    `;
  }
}