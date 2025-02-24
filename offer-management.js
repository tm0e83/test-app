import Component from './core/component.js';

export default class OfferManagement extends Component {
  constructor(element) {
    super();

    this.element = document.createElement('div');
    this.element.classList.add('offer-management');

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
      <h1>Angebotsverwaltung</h1>
      <div>blablabla</div>
    `;
  }
}