import Component from '/core/component.js';
import store from '/core/store.js';
import { roundTo2Decimals } from '/core/functions.js';

export default class LimboGame extends Component {
  cssFilePath = '/page/limbo-game.css';
  #currentValue = 0;

  constructor() {
    super();
  }

  addEvents() {
    this.stakeInput.addEventListener('input', e => {
      this.betButton.disabled = !e.target.checkValidity();
    });

    this.halveButton.addEventListener('click', e => {
      this.stakeInput.value = roundTo2Decimals(parseFloat(this.stakeInput.value) / 2);
      this.setMaxBetAmount();
      this.toggleBetButton();
    });

    this.doubleButton.addEventListener('click', e => {
      this.stakeInput.value = parseFloat(this.stakeInput.value) * 2;
      this.setMaxBetAmount();
      this.toggleBetButton();
    });

    this.maxButton.addEventListener('click', e => {
      this.stakeInput.value = parseFloat(store.state.user.balance);
      this.setMaxBetAmount();
      this.toggleBetButton();
    });

    this.betButton.addEventListener('click', e => {
      this.#currentValue = Math.random() * 100;
      this.valueContainer.style.left = `${this.roundedValue}%`;
      this.valueContainer.textContent = this.roundedValue;

      const stake = parseFloat(this.stakeInput.value);

      if (this.#currentValue > 52) {
        this.valueContainer.classList.add('win');
        this.valueContainer.classList.remove('lose');
        store.dispatch('updateBalance', store.state.user.balance + stake);
      } else {
        this.valueContainer.classList.add('lose');
        this.valueContainer.classList.remove('win');
        store.dispatch('updateBalance', store.state.user.balance - stake);
      }

      this.setMaxBetAmount();
      this.toggleBetButton();
    });
  }

  setMaxBetAmount() {
    this.stakeInput.setAttribute('max', store.state.user.balance);
  }

  get isValidBetAmount() {
    return parseFloat(this.stakeInput.value) > 0 && parseFloat(this.stakeInput.value) <= store.state.user.balance;
  }

  get roundedValue() {
    return this.#currentValue.toFixed(2);
  }

  render() {
    super.render();

    this.stakeInput = this.querySelector('input#stake-input');
    this.betButton = this.querySelector('button.button-bet');
    this.halveButton = this.querySelector('button.button-halve');
    this.doubleButton = this.querySelector('button.button-double');
    this.maxButton = this.querySelector('button.button-max');
    this.valueContainer = this.querySelector('.value');

    this.addEvents();
  }

  toggleBetButton() {
    this.betButton.disabled = !this.isValidBetAmount;
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
            <button class="btn btn-light button-halve">/2</button>
            <button class="btn btn-light button-double">x2</button>
            <button class="btn btn-light button-max">Max</button>
          </div>
          <button class="btn btn-primary button-bet" ${this.stakeInput?.value > 0 ? '' : 'disabled'}>Setzen</button>
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

customElements.define('limbo-game', LimboGame);