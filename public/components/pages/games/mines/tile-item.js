import Component from '/core/component.js';

export default class TileItem extends Component {
  cssFilePath = '/components/pages/games/mines/tile-item.css';

  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  addEvents() {
    this.removeEventListener('click', this.onClick);
    this.addEventListener('click', this.onClick.bind(this));
  }

  onClick() {
    if (this.hasType) return;
    this.dispatchEvent(new CustomEvent('selectionChange'));
  }

  get isMine() {
    return this.getAttribute('type') === 'mine';
  }

  get hasType() {
    return this.getAttribute('type') !== '';
  }

  render() {
    super.render();
    this.addEvents();
  }

  get template() {
    return /*html*/ this.hasType ? `
      <i class="fa-solid ${this.isMine ? 'fa-bomb' : 'fa-gem'}"></i>
    ` : '';
  }
}

customElements.define('tile-item', TileItem);