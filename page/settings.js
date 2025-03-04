import Component from '/core/component.js';

export default class PageNotFound extends Component {
  constructor(element) {
    super();

    this.element = document.createElement('div');
    this.element.classList.add('settings');

    this.render();
  }

  addEvents() {
    this.saveButton.addEventListener('click', this.onSettingsSave.bind(this));
    // this.languageSelect.addEventListener('change', this.onLanguageChange.bind(this));
  }

  onSettingsSave(e) {
    window.state.language = this.languageSelect.value;
    window.dispatchEvent(new CustomEvent('settingsChange'));
  }

  // onLanguageChange(e) {
  //   window.state.language = e.target.value;
  //   window.dispatchEvent(new CustomEvent('languageChange'));
  // }

  render() {
    this.element.innerHTML = this.template;
    this.saveButton = this.element.querySelector('button');
    this.languageSelect = this.element.querySelector('select');

    this.css`
      .settings {
      }
    `;

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>${i18next.t('settings')}</h1>
      <label for="language">${i18next.t('language')}</label>
      <select id="language" class="form-control mb-4">
        <option value="de" ${window.state.language == 'de' ? 'selected' : ''}>
          ${i18next.t('german')}
        </option>
        <option value="en" ${window.state.language == 'en' ? 'selected' : ''}>
          ${i18next.t('english')}
        </option>
      </select>
      <button class="btn btn-primary">${i18next.t('save')}</button>
    `;
  }
}