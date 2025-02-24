import Component from './core/component.js';

export default class Download extends Component {
  constructor(element) {
    super();

    this.element = document.createElement('div');
    this.element.classList.add('download');

    this.addressData = [];

    this.render();
    // this.load()
    //   .then(response => response.json())
    //   .then(data => this.addressData = data)
    //   .then(_ => this.render())
    //   .catch(error => console.error('Fehler beim Abrufen von JSON:', error));
  }

  // load() {
  //   return fetch('./data/addresses.json');
  // }

  addEvents() {
  }

  render() {
    this.element.innerHTML = this.template;

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>Download</h1>
      <div>file 1</div>
      <div>file 2</div>
    `;
  }
}