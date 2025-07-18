import Component from '/core/component.js';
import store from '/core/store.js';
import { roundTo2Decimals } from '/core/functions.js';
import './tile-item.js';
// @ts-ignore
import { getDatabase, ref, runTransaction } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-database.js';

/**
 * @typedef {Object} TileItemData
 * @property {boolean} selected
 * @property {string | null} type
 * @property {boolean} current
 */

/**
 * @typedef {(currentBalance: number|null|undefined) => number} TransactionHandler
 */

export default class PageMinesGame extends Component {
  cssFilePath = '/components/pages/games/mines/page-mines-game.css';

  /** @type {Element[]} */
  #tileItems = [];

  /** @type {TileItemData[]} */
  #tileItemsData = [];

  /** @type {boolean} */
  #gameStarted = false;

  /** @type {boolean} */
  #gameEnded = false;

  /** @type {number} */
  #stake = 0;

  /** @type {number} */
  #numMines = 8;

  /** @type {number} */
  #winAmount = 0;

  /** @type {boolean} */
  #settingsEnabled = true;

  constructor() {
    super();
    this.#tileItemsData = this.newTileItemsData;
  }

  get newTileItemsData() {
    return Array.from({ length: 25 }, () => ({ selected: false, type: null, current: false }));
  }

  addEvents() {
    this.stakeInput?.addEventListener('input', event => {
      const eventTarget = /** @type {HTMLInputElement} */ (event.target);

      if (eventTarget) {
        // Preserve the cursor position
        const selectionStart = eventTarget.selectionStart;
        const selectionEnd = eventTarget.selectionEnd;

        // Parse the input value as an integer
        this.#stake = parseInt(eventTarget.value);

        // Update the stake input value
        eventTarget.value = this.#stake.toString();

        // Restore the cursor position
        eventTarget.setSelectionRange(selectionStart, selectionEnd);
      }

      this.togglePlayButton();
    });

    this.halveButton?.addEventListener('click', e => {
      if (this.stakeInput) {
        const stake = roundTo2Decimals(parseInt(this.stakeInput.value) / 2);
        this.stakeInput.value = stake.toString();
        this.#stake = stake;
        this.setMaxBetAmount();
        this.togglePlayButton();
      }
    });

    this.doubleButton?.addEventListener('click', e => {
      if (this.stakeInput) {
        const stake = parseInt(this.stakeInput.value) * 2;
        this.stakeInput.value = stake.toString();
        this.#stake = stake;
        this.setMaxBetAmount();
        this.togglePlayButton();
      }
    });

    this.maxButton?.addEventListener('click', e => {
      if (this.stakeInput) {
        const stake = store.state.user.balance;
        this.stakeInput.value = stake.toString();
        this.#stake = stake;
        this.setMaxBetAmount();
        this.togglePlayButton();
      }
    });

    this.minesInput?.addEventListener('input', e => {
      this.#numMines = parseInt((/** @type {HTMLInputElement} */(e.target)).value);
      this.togglePlayButton();
    });

    if (this.playButton) {
      this.playButton.addEventListener('click', e => {
        this.#gameStarted = true;
        this.#gameEnded = false;
        this.#winAmount = 0;
        this.#tileItemsData = this.newTileItemsData;
        this.#settingsEnabled = false;
        store.dispatch('UPDATE_BALANCE', store.state.user.balance - this.#stake);

        const db = getDatabase();
        const balanceRef = ref(db, `users/${store.state.user.uid}/balance`);

        runTransaction(
          balanceRef,
          /** @type {TransactionHandler} */
          (currentBalance) => (currentBalance ?? 0) - this.#stake
        );

        this.render();
      });
    }

    if (this.cashoutButton) {
      this.cashoutButton.addEventListener('click', e => {
        let baseWinFactor = this.#numMines * 0.08 * this.numSelectedTiles;
        let bonusWinFactor = this.numSelectedTiles * 0.02 * this.numSelectedTiles;

        this.totalWinFactor = baseWinFactor + bonusWinFactor;
        const totalWinAmount = this.#stake + this.totalWinFactor * this.#stake

        this.#winAmount = roundTo2Decimals(totalWinAmount - this.#stake);
        store.dispatch('UPDATE_BALANCE', store.state.user.balance + totalWinAmount);

        const db = getDatabase();
        const balanceRef = ref(db, `users/${store.state.user.uid}/balance`);

        runTransaction(
          balanceRef,
          /** @type {TransactionHandler} */
          (currentBalance) => (currentBalance ?? 0) + totalWinAmount
        );

        this.#gameStarted = false;
        this.#gameEnded = true;
        this.#settingsEnabled = true;
        this.reveal();
        this.render();
      });
    }

    this.#tileItems.forEach(tileItem => {
      tileItem.addEventListener('selectionChange', e => {
        const eventTarget = /** @type {HTMLElement} */ (e.target);
        const tileItemIndex = this.#tileItems.indexOf(eventTarget);

        this.#tileItemsData.forEach(tileItem => tileItem.current = false);

        this.#tileItemsData[tileItemIndex].selected = true;
        const isMine = this.isMine();
        this.#tileItemsData[tileItemIndex].type = isMine ? 'mine' : 'gem';
        this.#tileItemsData[tileItemIndex].current = true;

        if (isMine) {
          this.reveal();
          this.#gameStarted = false;
          this.#gameEnded = true;
        }

        this.render();
      });
    });
  }

  reveal() {
    this.#tileItemsData.forEach(tileItem => {
      if (!tileItem.selected) {
        tileItem.type = this.isMine() ? 'mine' : 'gem';
      }
    });
  }

  get numSelectedTiles() {
    return this.#tileItemsData.filter(tileItem => tileItem.selected).length;
  }

  setMaxBetAmount() {
    this.stakeInput?.setAttribute('max', store.state.user.balance.toString());
  }

  get isValidBetAmount() {
    if (!this.stakeInput) return false;
    return parseInt(this.stakeInput.value) > 0 && parseInt(this.stakeInput.value) <= store.state.user.balance;
  }

  render() {
    super.render();

    this.stakeInput = /** @type {HTMLInputElement} */ (this.querySelector('input#stake-input'));
    this.playButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-play'));
    this.cashoutButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-cashout'));
    this.halveButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-halve'));
    this.doubleButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-double'));
    this.maxButton = /** @type {HTMLButtonElement} */ (this.querySelector('button.button-max'));
    this.minesInput = /** @type {HTMLInputElement} */ (this.querySelector('input#mines-input'));
    this.#tileItems = [...this.querySelectorAll('tile-item')];

    this.addEvents();
  }

  isMine() {
    const random = Math.random();
    const numRevealedTileItems = this.#tileItemsData.filter(tileItem => !!tileItem.type).length;
    const numRevealedMines = this.#tileItemsData.filter(tileItem => tileItem.type === 'mine').length;
    const percentage = (parseInt(this.minesInput?.value || '') - numRevealedMines) / (this.#tileItems.length - (numRevealedTileItems === this.#tileItems.length ? 0 : numRevealedTileItems))

    return random <= percentage;
  }

  togglePlayButton() {
    if (this.playButton) {
      this.playButton.disabled = !this.isValidBetAmount;
    }
  }

  get template() {
    return /*html*/ `
      <h1>Mines</h1>
      <div class="game-container">
        <div class="game-menu">
          <div class="settings-container">
            <div class="flex-grow-1">
              <label for="stake-input">Einsatz</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  id="stake-input"
                  class="form-control"
                  value="${this.#stake}"
                  ${this.#settingsEnabled ? '' : 'disabled'}
                >
                <button class="btn secondary button-halve" ${this.#settingsEnabled ? '' : 'disabled'}>&#189;</button>
                <button class="btn secondary button-double" ${this.#settingsEnabled ? '' : 'disabled'}>2&times;</button>
                <button class="btn secondary button-max" ${this.#settingsEnabled ? '' : 'disabled'}>Max</button>
              </div>
            </div>
            <div>
              <label for="mines-input">Minen</label>
              <input type="number"
                    id="mines-input"
                    class="form-control"
                    value="${this.#numMines}"
                    min="1"
                    max="24"
                    step="1"
                    inputmode="numeric"
                    ${this.#settingsEnabled ? '' : 'disabled'}>
            </div>
          </div>

          ${!this.#gameStarted ? `
            <button class="btn primary button-play" ${this.isValidBetAmount ? '' : 'disabled'}>
              Spielen
            </button>
          ` : `
            ${this.numSelectedTiles === 0 ? `
              <button class="btn primary button-select" disabled>
                Auswählen
              </button>
            ` : `
              <button class="btn primary button-cashout">
                Auszahlen
              </button>
            `}
          `}
        </div>
        <div class="game-canvas">
          <div class="tiles">
            ${this.#tileItemsData.map((itemData, index) => `
              <tile-item selected="${itemData.selected}"
                         type="${itemData.type ? itemData.type : ''}"
                         ${itemData.current ? 'animate' : ''}
                         ${this.#gameStarted && !this.#gameEnded ? '' : 'disabled'}></tile-item>
            `).join('')}
          </div>

          ${!this.#gameStarted && this.#gameEnded && this.#winAmount > 0 ? `
            <div class="win-message">
                <strong>${this.totalWinFactor}x</strong>
                <span>+ ${this.#winAmount} <i class="fa-solid fa-gem"></i></span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('page-mines-game', PageMinesGame);