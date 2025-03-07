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
    this.form.addEventListener('submit', this.onFormSubmit.bind(this));

    this.backButton.addEventListener('click', e => {
      history.back();
    });

    this.links.forEach(linkElement => {
      linkElement.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.href === '#') return;
        window.router.goTo(e.target.href);
      });
    });
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

  render() {
    this.element.classList.add('invoice-details');
    this.element.innerHTML = this.template;
    this.form = this.element.querySelector('form');
    this.backButton = this.element.querySelector('.btn-secondary');
    this.links = this.element.querySelectorAll('[href]');

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

        <a class="btn btn-secondary">${i18next.t('Abbrechen')}</a>
        <button class="btn btn-primary">${i18next.t('Save')}</button>
      </form>
    `;
  }
}