import Component from '/core/component.js';
import store from '/core/store.js';
import DatabaseAPI from '/firebase/database-api.js';
import LoadingBar from '/core/loading-bar.js';
import { i18n } from '/i18n/i18n.js';

/**
 * @typedef {Object} TileItemData
 * @property {boolean} selected
 * @property {string | null} type
 * @property {boolean} current
 */

/**
 * @typedef {(currentBalance: number|null|undefined) => number} TransactionHandler
 */

export default class PageBlockfallGame extends Component {
  cssFilePath = '/components/pages/games/blockfall/page-blockfall-game.css';

  // #options = {};

  #x = 0;						// carrier column position
  #y = 0;						// carries row position
  #busyChecking = false;		// ensures the brick can't be moved as long as the script runs
  #status = 'off';			// game is running or not
  #pause = false;				// is TRUE when game is paused
  #setLevelInterval  = '';	// interval for updating the level
  #moveInterval = '';			// interval for brick movement
  #score = 0;				// contains the current score points
  #currentBrick = ''; 		// contains active brick object at runtime
  #nextBrick = undefined;		// contains next chosen brick
  #currentCoordIndex = '';	// contains index of the current bricks turning sequence coordindates
  #nextCoords = '';			// contains the next array of coordingates (turning sequences)
  #level = 1;					// level number
  #brickStack = [];			// contains each brick type 4 times; 1 brick type occurance is removed when chosen --> ensures, that each block type can only recur 4 times in a row
  #deletedRows = [];			// row numbers of the rows marked for deletion
  #bricks = [					// brick types {color, turning sequence coordinates}
    { type: 'type_1', color: '#c0392b', coords: [[4,5,6,7],[1,5,9,13],[4,5,6,7],[1,5,9,13]] },
    { type: 'type_2', color: '#3498db', coords: [[1,2,5,6],[1,2,5,6],[1,2,5,6],[1,2,5,6]] },
    { type: 'type_3', color: '#f1c40f', coords: [[1,4,5,6],[1,5,6,9],[4,5,6,9],[1,4,5,9]] },
    { type: 'type_4', color: '#9b59b6', coords: [[1,5,8,9],[0,4,5,6],[1,2,5,9],[4,5,6,10]] },
    { type: 'type_5', color: '#2ecc71', coords: [[0,4,8,9],[8,4,5,6],[0,1,5,9],[6,8,9,10]] },
    { type: 'type_6', color: '#16a085', coords: [[8,9,5,6],[0,4,5,9],[8,9,5,6],[0,4,5,9]] },
    { type: 'type_7', color: '#e67e22', coords: [[4,5,9,10],[1,5,4,8],[4,5,9,10],[1,5,4,8]] }
  ];

  #speed = 3000;
  #levelUpSpeed = 10000;
  #numCols = 10; // number of columns in the game board
  #numRows = 20; // number of rows in the game board

  this.#touchStartX = 0;
  this.#touchStartY = 0;

  constructor() {
    super();

    this.onStartButtonClick = this.onStartButtonClick.bind(this);
    this.onPauseButtonClick = this.onPauseButtonClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.adjustSize = this.adjustSize.bind(this);
    this.render = this.render.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  addEvents() {
    this.board?.addEventListener('resize', this.adjustSize);
    this.window?.addEventListener('resize', this.adjustSize);
    this.startButton?.addEventListener('click', this.onStartButtonClick);
    this.pauseButton?.addEventListener('click', this.onPauseButtonClick);
    window.addEventListener('keydown', this.onKeyDown);
    this.board.addEventListener('touchstart', this.onTouchStart);
    this.board.addEventListener('touchend', this.onTouchEnd);
  }

  onTouchStart(event) {
    const touch = event.changedTouches[0];
    this.#touchStartX = touch.screenX;
    this.#touchStartY = touch.screenY;
  }

  onTouchEnd(event) {
    const touch = event.changedTouches[0];
    const deltaX = touch.screenX - this.#touchStartX;
    const deltaY = touch.screenY - this.#touchStartY;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    const swipeThreshold = 30; // Mindestbewegung in px

    if (absX > absY && absX > swipeThreshold) {
      // horizontaler Swipe
      if (deltaX > 0) {
        this.moveBrick('right');  // Funktion, die deinen Block nach rechts bewegt
      } else {
        this.moveBrick('left');   // Funktion, die deinen Block nach links bewegt
      }
    } else if (absY > swipeThreshold) {
      // vertikaler Swipe
      if (deltaY > 0) {
        // this.softDropPiece();   // Funktion, um schneller fallen zu lassen
      } else {
        // this.hardDropPiece();   // optional: harter Drop
      }
    } else {
      this.rotateBrick();        // kurzer Tap -> drehen
    }
  }

  /**
   * Handles keydown events for game controls.
   * Moves the brick left, right, down, or turns it based on arrow key inputs
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    switch(event.code) {
      case 'ArrowUp': {
        event.preventDefault();
        this.rotateBrick();
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        this.moveBrick('left');
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        this.moveBrick('right');
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        this.moveBrick('down');
        break;
      }
    }
  }

  /**
   * Handles the click event on the start button.
   * If the game is off, it starts a new game; if it's on, it resets and ends the game.
   * @param {Event} event
   */
  onStartButtonClick(event) {
    if(this.#status === 'off') {
      this.startNewGame();
    } else {
      this.resetGame();
      this.endGame();
    }
  }

  /**
   * Handles the click event on the pause button.
   * If the game is on, it toggles the pause state.
   * @param {Event} event
   */
  onPauseButtonClick(event) {
    if(this.#status === 'on') {
      if(this.#pause === false) {
        this.pauseGame();
      } else {
        this.continueGame();
      }
    }
  }

  startNewGame() {
    if (this.startButton) {
      this.startButton.textContent = 'End Game';
    }

    this.#status = 'on';
    this.resetGame();
    this.score = 0;

    if(this.#level === 0) {
      this.#level = 1;
    }

    if (this.scoreBoard) {
      this.scoreBoard.textContent = this.#score.toString();
    }
    if (this.levelDisplay) {
      this.levelDisplay.textContent = this.#level.toString();
    }

    this.gameRoutine();
    this.#setLevelInterval = setInterval(() => this.setLevel(), this.#levelUpSpeed);
  };

  // set to default values
  resetGame() {
    this.#score = 0;
    this.#level = 0;
    this.gameOver.style.display = 'none';
    this.scoreBoard.textContent = this.#score.toString();
    this.levelDisplay.textContent = this.#level.toString();

    this.carrier.querySelectorAll('.block').forEach(block => {
      block.style.top = '0';
      block.style.left = '0';
      block.style.background = 'transparent';
    });

    this.carrier.querySelectorAll('.block').forEach(block => {
      block.classList.remove('colored');
    });

    this.preview.querySelectorAll('.block').forEach(block => {
      block.removeAttribute('style');
    });

    this.board.querySelectorAll('.fixed').forEach(block => {
      block.classList.remove('fixed');
      block.style.background = 'transparent';
    });
  }

  endGame() {
    this.#status = 'off';
    clearInterval(this.moveInteral);
    clearInterval(this.#setLevelInterval);
    this.startButton.textContent = 'Start';
  }

  pauseGame() {
    clearInterval(this.#moveInterval);
    clearInterval(this.#setLevelInterval);
    this.#pause = true;
    this.pauseButton.textContent = 'Continue';
  }

  continueGame() {
    this.#pause = false;
    this.#moveInterval = setInterval(() => this.moveBrick('down'), this.#speed);
    this.#setLevelInterval = setInterval(() => this.setLevel(), this.#levelUpSpeed);
    this.pauseButton.textContent = 'Pause';
  }

  gameRoutine() {
    this.#x = 3;
    this.#y = 0;

    this.updateScore();

    this.#currentBrick = (this.#nextBrick === undefined) ? this.chooseBlock() : this.#nextBrick;
    this.#currentCoordIndex = this.getRandom(0, 3);

    // if block is not in the first row of the carrier
    if(this.#currentBrick.coords[this.#currentCoordIndex].filter(coord => coord / 4 < 1).length === 0) {
      this.#y = -1;
    }

    this.carrier.style.top = this.#y * 5 + '%';
    this.carrier.style.left = this.#x * 10 + '%';

    this.insertBrick();

    this.#nextBrick = this.chooseBlock();
    this.updatePreview();

    clearInterval(this.#moveInterval);
    this.#moveInterval = setInterval(() => this.moveBrick('down'), this.#speed);
  }

  // choose a random block type
  chooseBlock() {
    // ensures that a blocktype cannot recur more than 4 times in a row
    if(this.#brickStack.length === 0) {
      this.#bricks.forEach((bricktype) => {
        Array(4).fill(null).forEach(() => this.#brickStack.push(bricktype));
      });
    }

    // chooses a random block and removes it from stack
    const randomindex = this.getRandom(0, this.getLength(this.#brickStack) - 1);
    const currentBrick = this.#brickStack.splice(randomindex, 1);

    return currentBrick[0];
  }

  insertBrick() {
    this.change_x = 0;
    this.change_y = 0;

    if(this.checkNextStep()) {
      this.#currentBrick.coords[this.#currentCoordIndex].forEach((coord, index) => {
        const block = [...this.carrier.querySelectorAll('.block')][coord];
        block.classList.add('colored');
        block.style.background = this.#currentBrick.color;
      });
    } else {
      this.gameOver.style.display = 'block';
      this.endGame();
    }
  };

  updatePreview() {
    this.preview.querySelectorAll('.block').forEach(block => {
      block.style.background = 'none';
    });

    this.#nextCoords = this.#nextBrick.coords[this.getRandom(0, 3)];

    this.#nextCoords.forEach(coord => {
      this.preview.querySelectorAll('.block').forEach(block => {
        if (block.dataset.coord == coord) {
          block.style.background = this.#nextBrick.color;
        }
      });
    });
  }

  rotateBrick() {
    // which coordinate set would follow next
    const nextCoordsIndex = (this.#currentCoordIndex <= 2) ? this.#currentCoordIndex + 1 : 0;

    let blocked = false;
    let outside = false;

    this.#currentBrick.coords[nextCoordsIndex].forEach((coord, index) => {
      let block_y = (Math.floor(coord / 4)) + this.#y;
      let block_x = (Math.floor(coord % 4)) + this.#x;
      let blockIndex = block_y * this.#numCols + block_x;

      if(this.board?.querySelector(`.block-${blockIndex}`)?.classList.contains('fixed') === true) {
        blocked = true;
      }

      if(blockIndex < 0 || Math.floor(blockIndex / this.#numCols) < block_y || Math.floor(blockIndex / this.#numCols) > block_y) {
        outside = true;
      }
    });

    if(blocked === false && outside === false) {
      this.#currentBrick.coords[this.#currentCoordIndex].forEach((coord, index) => {
        [...this.carrier.querySelectorAll('.block')][coord].classList.remove('colored');
        [...this.carrier.querySelectorAll('.block')][coord].style.background = 'transparent';
      });

      // select the next set of coordinates
      this.#currentCoordIndex = (this.#currentCoordIndex <= 2) ? this.#currentCoordIndex + 1 : this.#currentCoordIndex = 0;

      // Remove blocks and add with new coordinates
      this.#currentBrick.coords[this.#currentCoordIndex].forEach((coord, index) => {
        this.carrier.querySelectorAll('.block').forEach(block => {
          [...this.carrier.querySelectorAll('.block')][coord].classList.add('colored');
          [...this.carrier.querySelectorAll('.block')][coord].style.background = this.#currentBrick.color;
        });
      });
    }
  }

  /**
   *
   * @param {string} dir
   */
  moveBrick(dir) {
    if(this.#status === 'on') {
      if(dir !== 'down') {
        if(dir === 'left') this.change_x = -1;
        if(dir === 'right') this.change_x = 1;
        this.change_y = 0;

        if(this.checkNextStep()) {
          this.#x = this.#x + this.change_x;
          this.carrier.style.left = this.#x * 10 + '%';
        }
      }

      if(dir === 'down') {
        this.change_x = 0;
        this.change_y = 1;

        if(this.checkNextStep()) {
          this.#y++;
          this.carrier.style.top = this.#y * 5 + '%';
          this.nextStep = [];
        } else {
          clearInterval(this.#moveInterval);

          this.nextStep?.forEach(coord => {
            const block = [...this.board.querySelectorAll(':scope>.block')][coord];
            block.style.background = this.#currentBrick.color;
            block.classList.add('fixed');
          });

          this.carrier.querySelectorAll(':scope>.block').forEach(block => {
            block.classList.remove('colored');
            block.style.background = 'transparent';
          });

          if(this.#busyChecking !== true) {
            this.checkRows();
          }
        }
      }
    }
  }

  checkNextStep() {
    this.openWay = true;
    this.outOfBoard = false;
    this.nextBlockIndex = -1;
    this.nextStep = [];

    this.#currentBrick.coords[this.#currentCoordIndex].forEach((coord, index) => {
      this.cur_y = (Math.floor(coord / 4)) + this.#y;
      this.cur_x = (Math.floor(coord % 4) + this.change_x) + this.#x;
      this.next_x = this.cur_x + this.change_x;
      this.next_y = this.cur_y + this.change_y;
      this.curBlockIndex = this.cur_y * this.#numCols + this.cur_x;
      this.nextBlockIndex = this.next_y * this.#numCols + this.cur_x;
      this.blockOnTheRight = this.board?.querySelectorAll(':scope>.block')?.[this.nextBlockIndex];
      this.nextStep.push(this.curBlockIndex);

      if(this.change_y !== 0 && !this.blockOnTheRight) {
        this.outOfBoard = true;
      }

      if(this.change_y === 0 && (Math.floor(this.nextBlockIndex / this.#numCols) < this.cur_y || Math.floor(this.nextBlockIndex / this.#numCols) > this.cur_y)) {
        this.outOfBoard = true;
      }
      if(!this.blockOnTheRight || this.blockOnTheRight?.classList.contains('fixed')) {
        this.openWay = false;
      }
    });

    if(this.openWay === true && this.outOfBoard === false) {
      return true;
    } else {
      return false;
    }
  }

  checkRows() {
    this.#busyChecking = true;
    this.#deletedRows = [];
    let removeRow = true;

    for(let row = 0; row <= this.#numRows; row++) {
      removeRow = true;
      this.board.querySelectorAll(':scope>.row_' + row).forEach((block, index) => {
        if(!block.classList.contains('fixed')) {
          removeRow = false;
        }

        if(index === this.#numCols - 1 && removeRow === true) {
          this.#deletedRows.push(row);
        }
      });
    }

    if(this.#deletedRows.length > 0) {
      this.rowBlink(0);
    } else {
      this.#busyChecking = false;
      if(this.#status === 'on') {
        this.gameRoutine();
      }
    }
  }

  removeRows() {
    this.#deletedRows?.forEach((row) => {
      this.board.querySelectorAll(`.row_${row}`).forEach(block => {
        block.classList.remove('fixed');
        block.style.background = 'transparent';

				for(var i = row-1; i >= 1; i--) {
          this.board.querySelectorAll('.row_' + i).forEach((block, index) => {
            if (block.classList.contains('fixed')) {
              const nextRowBlock = this.board.querySelector(`.row_${i + 1}`);
              nextRowBlock.style.background = block.style.background;
              nextRowBlock.classList.add('fixed');
              block.style.background = 'transparent';
              block.classList.remove('fixed');
            }
          });
				}
      });
    });
  }

  rowBlink(counter) {
    if(counter === 0 || counter === 2) {
      setTimeout(() => {
        this.#deletedRows.forEach(row => {
          this.board.querySelectorAll(`.row_${row}`).forEach(block => {
            block.style.opacity = '0.25';
          });
        });

        this.rowBlink(++counter);
      }, 100);
    }

    if(counter === 1 || counter === 3) {
      setTimeout(() => {
        this.#deletedRows.forEach(row => {
          this.board.querySelectorAll(`.row_${row}`).forEach(block => {
            block.style.opacity = '1';
          });
        });

        this.rowBlink(++counter);
      }, 100);
    }

    if(counter === 4) {
      this.removeRows();
      this.#busyChecking = false;
      if(this.#status === 'on') {
        this.gameRoutine();
      }
    }
  }

  updateScore() {
    this.#score += this.#deletedRows.length * (this.#level * 10 * this.#deletedRows.length);
    this.scoreBoard.textContent = this.#score;
  }

  setLevel() {
    this.#level += 1;
    this.levelDisplay.textContent = this.#level;
    this.#speed -= this.#speed * 0.05;
  }

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getLength(obj) {
    return Object.keys(obj).length;
  }

  render() {
    super.render();

    this.board = this.querySelector('#board');
    this.scoreBoard = this.querySelector('#scoreBoard');
    this.levelDisplay = this.querySelector('#levelDisplay');
    this.gameOver = this.querySelector('#gameOver');
    this.carrier = this.querySelector('#carrier');
    this.preview = this.querySelector('#preview');
    this.startButton = /** @type {HTMLButtonElement} */ (this.querySelector('#startButton'));
    this.pauseButton = /** @type {HTMLButtonElement} */ (this.querySelector('#pauseButton'));

    this.addEvents();
    this.adjustSize();
  };

  adjustSize() {
    const viewportHeight = document.documentElement.clientHeight;
    const boardRect = this.board.getBoundingClientRect();
    const boardPosY = boardRect.y;
    this.board.style.height = `${Math.floor(viewportHeight - boardPosY - 60)}px`;
  };

  get template() {
    return /*html*/`
      <div class="game-container">
        <div class="game-canvas">
          <div id="board">
            <div id="gameOver">Game Over</div>

            ${Array(20).fill(null).map((v, rowIndex) => `
              ${Array(10).fill(null).map((v, colIndex) => `
                <div class="block block-${rowIndex * 10 + colIndex} row_${rowIndex + 1} col_${colIndex + 1} ${colIndex + 1 === 10 ? 'last' : ''} ${colIndex + 1 === 1 ? 'first' : ''}"></div>
              `).join('')}
            `).join('')}

            <div id="carrier">
              ${Array(4).fill(null).map((v, rowIndex) => `
                ${Array(4).fill(null).map((v, colIndex) => `
                  <div class="block block-${rowIndex * 4 + colIndex} row_${rowIndex + 1} col_${colIndex + 1} ${colIndex + 1 === 4 ? 'last' : ''} ${colIndex + 1 === 1 ? 'first' : ''}"></div>
                `).join('')}
              `).join('')}
            </div>

          </div>
        </div>
        <div class="game-menu">
          <div id="menu">
            <div id="preview" class="clearfix">
              ${Array(4).fill(null).map((v, rowIndex) => `
                ${Array(4).fill(null).map((v, colIndex) => /*html*/`
                  <div class="block block-${rowIndex * 4 + colIndex} row_${rowIndex + 1} col_${colIndex + 1} ${colIndex + 1 === 4 ? 'last' : ''} ${colIndex + 1 === 1 ? 'first' : ''}"></div>
                `).join('')}
              `).join('')}
            </div>
            <ul id="scoreBoardWrapper" class="d-flex justify-content-between mb-4">
              <li id="scoreBoardLabel">Score</li>
              <li id="scoreBoard"></li>
            </ul>
            <ul id="levelDisplayWrapper" class="d-flex justify-content-between mb-4">
              <li id="levelDisplayLabel">Level</li>
              <li id="levelDisplay">0</li>
            </ul>
            <div id="startButton" class="btn primary w-100 mb-4">Start</div>
            <div id="pauseButton" class="btn primary w-100 mb-4">Pause</div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('page-blockfall-game', PageBlockfallGame);