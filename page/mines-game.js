import Component from '/core/component.js';
import store from '/core/store.js';
import { roundTo2Decimals } from '/core/functions.js';
import './games/mines/tile-item.js';

export default class MinesGame extends Component {
  cssFilePath = '/page/mines-game.css';
  #tileItems = [];
  #tileItemsData = [];
  #gameStarted = false;
  #gameEnded = false;
  #stake = 0;
  #numMines = 8;
  #winAmount = 0;

  constructor() {
    super();

    this.#tileItemsData = this.newTileItemsData;
  }

  get newTileItemsData() {
    return Array.from({ length: 25 }, () => ({ selected: false, type: null }));
  }

  addEvents() {
    this.stakeInput.addEventListener('input', e => {
      this.#stake = parseFloat(e.target.value);
      this.togglePlayButton();
    });

    this.halveButton.addEventListener('click', e => {
      this.stakeInput.value = roundTo2Decimals(parseFloat(this.stakeInput.value) / 2);
      this.setMaxBetAmount();
      this.togglePlayButton();
    });

    this.doubleButton.addEventListener('click', e => {
      this.stakeInput.value = parseFloat(this.stakeInput.value) * 2;
      this.setMaxBetAmount();
      this.togglePlayButton();
    });

    this.maxButton.addEventListener('click', e => {
      this.stakeInput.value = parseFloat(store.state.user.balance);
      this.setMaxBetAmount();
      this.togglePlayButton();
    });

    this.minesInput.addEventListener('input', e => {
      this.#numMines = parseInt(e.target.value);
      this.togglePlayButton();
    });

    if (this.playButton) {
      this.playButton.addEventListener('click', e => {
        this.#gameStarted = true;
        this.#gameEnded = false;
        this.#winAmount = 0;
        this.#tileItemsData = this.newTileItemsData;
        this.render();
      });
    }

    if (this.cashoutButton) {
      this.cashoutButton.addEventListener('click', e => {
        let baseWinFactor = this.#numMines * 0.08 * this.numSelectedTiles;
        let bonusWinFactor = this.numSelectedTiles * 0.02 * this.numSelectedTiles;

        this.totalWinFactor = baseWinFactor + bonusWinFactor;
        const totalWinAmount = this.#stake + this.totalWinFactor * this.#stake

        console.log('win ', this.totalWinFactor, totalWinAmount);
        this.#winAmount = roundTo2Decimals(totalWinAmount - this.#stake);
        store.dispatch('updateBalance', store.state.user.balance + totalWinAmount);

        this.#gameStarted = false;
        this.#gameEnded = true;
        this.reveal();
        this.render();
      });
    }

    this.#tileItems.forEach(tileItem => {
      tileItem.addEventListener('selectionChange', e => {
        const tileItemIndex = this.#tileItems.indexOf(e.target);

        this.#tileItemsData[tileItemIndex].selected = true;
        const isMine = this.isMine();
        this.#tileItemsData[tileItemIndex].type = isMine ? 'mine' : 'gem';

        if (isMine) {
          this.reveal();
          store.dispatch('updateBalance', store.state.user.balance - this.#stake);
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
    this.stakeInput.setAttribute('max', store.state.user.balance);
  }

  get isValidBetAmount() {
    if (!this.stakeInput) return false;
    return parseFloat(this.stakeInput.value) > 0 && parseFloat(this.stakeInput.value) <= store.state.user.balance;
  }

  render() {
    super.render();

    this.stakeInput = this.querySelector('input#stake-input');
    this.playButton = this.querySelector('button.button-play');
    this.cashoutButton = this.querySelector('button.button-cashout');
    this.halveButton = this.querySelector('button.button-halve');
    this.doubleButton = this.querySelector('button.button-double');
    this.maxButton = this.querySelector('button.button-max');
    this.minesInput = this.querySelector('input#mines-input');
    this.#tileItems = [...this.querySelectorAll('tile-item')];

    this.addEvents();
  }

  isMine() {
    const random = Math.random();
    const percentage = parseInt(this.minesInput.value || 0) / (this.#tileItems.length - this.numSelectedTiles)
    return random <= percentage;
  }

  togglePlayButton() {
    this.playButton.disabled = !this.isValidBetAmount;
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
                <input type="number"
                      id="stake-input"
                      class="form-control"
                      value="${this.#stake}"
                      min="0"
                      max="${store.state.user.balance}"
                      step="0.01">
                <button class="btn btn-light button-halve">&#189;</button>
                <button class="btn btn-light button-double">2&times;</button>
                <button class="btn btn-light button-max">Max</button>
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
                    step="1">
            </div>
          </div>

          ${!this.#gameStarted ? `
            <button class="btn btn-primary button-play" ${this.isValidBetAmount ? '' : 'disabled'}>
              Spielen
            </button>
          ` : `
            ${this.numSelectedTiles === 0 ? `
              <button class="btn btn-primary button-select" disabled>
                Auswählen
              </button>
            ` : `
              <button class="btn btn-primary button-cashout">
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
                         ${this.#gameStarted && !this.#gameEnded ? '' : 'disabled'}></tile-item>
            `).join('')}
          </div>

          ${!this.#gameStarted && this.#gameEnded && this.#winAmount > 0 ? `
            <div class="win-message">
                <strong>${this.totalWinFactor}x</strong>
                <span>${this.#winAmount}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}

customElements.define('mines-game', MinesGame);