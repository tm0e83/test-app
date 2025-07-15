import { i18n } from '/i18n/i18n.js';
import Component from '/core/component.js';
import store from '/core/store.js';
import { roundTo2Decimals } from '/core/functions.js';

export default class PageLimboGame extends Component {
  cssFilePath = '/components/pages/games/limbo/page-limbo-game.css';
  #currentValue = 0;

  constructor() {
    super();
  }

  addEvents() {
    this.stakeInput?.addEventListener('input', e => {
      if (this.betButton) {
        const eventTarget = /** @type {HTMLInputElement} */ (e.target);
        this.betButton.disabled = !eventTarget.checkValidity();
      }
    });

    this.halveButton?.addEventListener('click', e => {
      if (this.stakeInput) {
        this.stakeInput.value = roundTo2Decimals(parseFloat(this.stakeInput.value) / 2).toString();
      }
      this.setMaxBetAmount();
      this.toggleBetButton();
    });

    this.doubleButton?.addEventListener('click', e => {
      if (this.stakeInput) {
        this.stakeInput.value = (parseFloat(this.stakeInput.value) * 2).toString();
      }
      this.setMaxBetAmount();
      this.toggleBetButton();
    });

    this.maxButton?.addEventListener('click', e => {
      if (this.stakeInput) {
        this.stakeInput.value = store.state.user.balance.toString();
      }
      this.setMaxBetAmount();
      this.toggleBetButton();
    });

    this.betButton?.addEventListener('click', e => {
      this.#currentValue = Math.random() * 100;

      if (this.valueContainer) {
        this.valueContainer.style.left = `${this.roundedValue}%`;
        this.valueContainer.textContent = this.roundedValue;
      }

      const stake = parseFloat(this.stakeInput?.value ?? '0');

      if (this.#currentValue > 52) {
        this.valueContainer?.classList.add('win');
        this.valueContainer?.classList.remove('lose');
        store.dispatch('UPDATE_BALANCE', store.state.user.balance + stake);
      } else {
        this.valueContainer?.classList.add('lose');
        this.valueContainer?.classList.remove('win');
        store.dispatch('UPDATE_BALANCE', store.state.user.balance - stake);
      }

      this.setMaxBetAmount();
      this.toggleBetButton();
    });
  }

  setMaxBetAmount() {
    this.stakeInput?.setAttribute('max', store.state.user.balance.toString());
  }

  get isValidBetAmount() {
    return parseFloat(this.stakeInput?.value ?? '0') > 0 && parseFloat(this.stakeInput?.value ?? '0') <= store.state.user.balance;
  }

  get roundedValue() {
    return this.#currentValue.toFixed(2);
  }

  render() {
    super.render();

    this.stakeInput = /** @type {HTMLInputElement} */ (this.querySelector('input#stake-input'));
    this.betButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-bet'));
    this.halveButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-halve'));
    this.doubleButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-double'));
    this.maxButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-max'));
    this.valueContainer = /** @type {HTMLElement} */ (this.querySelector('.value'));

    this.addEvents();
  }

  toggleBetButton() {
    if (this.betButton) {
      this.betButton.disabled = !this.isValidBetAmount;
    }
  }

  get template() {
    return /*html*/ `
      <h1>Limbo</h1>
      <div class="game-container">
        <div class="history"></div>
        <div class="game-menu">
          <label for="stake-input">Einsatz</label>
          <div class="input-wrapper">
            <input type="number"
                  id="stake-input"
                  class="form-control"
                  value="0"
                  min="0"
                  max="${store.state.user.balance}"
                  step="0.01">
            <button class="btn secondary button-halve">/2</button>
            <button class="btn secondary button-double">x2</button>
            <button class="btn secondary button-max">Max</button>
          </div>
          <button class="btn primary button-bet" ${parseFloat(this.stakeInput?.value ?? '0') > 0 ? '' : 'disabled'}>${i18n.t('bet')}</button>
        </div>
        <div class="game-canvas">
          <div class="bar">
            <div class="value" style="left: ${this.roundedValue}%">${this.roundedValue}</div>
            <div class="threshold"></div>
            <div class="ruler">
              <div class="ruler-item">0</div>
              <div class="ruler-item">25</div>
              <div class="ruler-item">50</div>
              <div class="ruler-item">75</div>
              <div class="ruler-item">100</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('page-limbo-game', PageLimboGame);