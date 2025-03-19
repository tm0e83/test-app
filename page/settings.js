import Component from '/core/component.js';
import store from '/core/store.js';

export default class PageNotFound extends Component {
  constructor() {
    super();

    this.element = document.createElement('div');
    this.element.classList.add('settings', 'loading');

    this.render();
    this.load()
      .then(_ => this.element.classList.remove('loading'))
      .then(_ => this.render())
  }

  async load() {
    return new Promise((resolve, reject) => {
      setTimeout(_ => resolve(), 300)
    })
  }

  addEvents() {
    this.saveButton.addEventListener('click', this.onSettingsSave.bind(this));
  }

  onSettingsSave(e) {
    store.state.language = this.languageSelect.value;
    window.dispatchEvent(new CustomEvent('settingsChange'));
  }

  render() {
    this.element.innerHTML = this.template;
    this.saveButton = this.element.querySelector('button');
    this.languageSelect = this.element.querySelector('select');

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>${i18next.t('settings')}</h1>
      <label for="language">${i18next.t('language')}</label>
      <select id="language" class="form-control mb-4">
        <option value="de" ${store.state.language == 'de' ? 'selected' : ''}>
          ${i18next.t('german')}
        </option>
        <option value="en" ${store.state.language == 'en' ? 'selected' : ''}>
          ${i18next.t('english')}
        </option>
      </select>
      <button class="btn btn-primary">${i18next.t('save')}</button>
    `;
  }
}