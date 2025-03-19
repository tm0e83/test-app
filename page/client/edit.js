import Component from '/core/component.js';
import notify from '/core/notification.js';
import router from '/core/router.js';

export default class Edit extends Component {
  constructor(args) {
    super();

    this.id = router.route.routeParams.id;
    this.element = document.createElement('div');
    this.element.classList.add('client-edit', 'loading');

    // this.render();
    this.load()
      .then(response => response.json())
      .then(data => this.data = data)
      .then(_ => this.element.classList.remove('loading'))
      .then(_ => this.render())
      .catch(error => console.error('Fehler beim Abrufen von JSON:', error));
  }

  load() {
    return fetch(`/data/client${this.id}.json`);
  }

  addEvents() {
    this.form.addEventListener('submit', this.onFormSubmit.bind(this));
    this.backButton.addEventListener('click', e => history.back());
    router.addLinkEvents(this.element.querySelectorAll('[href]'));
  }

  async onFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this.form);
    this.element.classList.add('loading');
    await this.save(formData);
    // Object.fromEntries(formData);
    this.element.classList.remove('loading');
    router.goTo('/client/details/' + this.id);
    notify.send(i18next.t('saved'), 'success');
  }

  save(formData) {
    return new Promise((resolve, reject) => {
      setTimeout(_ => resolve(), 1000);
    });
  }

  render() {
    this.element.classList.add('client-details');
    this.element.innerHTML = this.template;
    this.form = this.element.querySelector('form');
    this.backButton = this.element.querySelector('.btn-secondary');
    this.links = this.element.querySelectorAll('[href]');

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>${i18next.t('editclient')}</h1>
      <strong>#${this.data.id}</strong><br><br>

      <form>
        <label for="client-title">${i18next.t('title')}</label>
        <input
          id="client-title"
          name="title"
          value="${this.data.name}"
          class="form-control mb-4"
          required
        >
        <a class="btn btn-secondary">${i18next.t('Abbrechen')}</a>
        <button class="btn btn-primary">${i18next.t('Save')}</button>
      </form>
    `;
  }
}