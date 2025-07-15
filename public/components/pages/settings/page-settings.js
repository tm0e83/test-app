import Component from '/core/component.js';
import store from '/core/store.js';

export default class PageSettings extends Component {
  constructor() {
    super();
  }

  async load() {
    return new Promise((resolve, reject) => {
      setTimeout(_ => resolve(null), 300)
    });
  }

  addEvents() {
    this.saveButton?.addEventListener('click', this.onSettingsSave.bind(this));
  }

  onSettingsSave(e) {
    store.state.language = this.languageSelect.value;
    store.dispatch('UPDATE_BALANCE', parseFloat(this.balanceInput.value));
  }

  render() {
    super.render();

    this.load()
      .then(_ => super.render())
      .then(_ => {
        this.saveButton = this.querySelector('button');
        this.languageSelect = this.querySelector('select');
        this.balanceInput = this.querySelector('input');

        this.addEvents();
      })
  }

  get template() {
    return /*html*/ `
      <h1>${i18next.t('settings')}</h1>
      <div class="card">
        <div class="mb-4">
          <label for="language">${i18next.t('language')}</label>
          <select id="language" class="mb-4">
            <option value="de" ${store.state.language == 'de' ? 'selected' : ''}>
              ${i18next.t('german')}
            </option>
            <option value="en" ${store.state.language == 'en' ? 'selected' : ''}>
              ${i18next.t('english')}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label for="language">${i18next.t('balance')}</label>
          <input type="number"
                id="balance"
                class="mb-4"
                min="0"
                max="1000"
                step="0.01"
                value="${store.state.user.balance}">
        </div>
        <button class="btn primary">${i18next.t('save')}</button>
      </div>
    `;
  }
}

customElements.define('page-settings', PageSettings);