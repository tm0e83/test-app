import Component from '/core/component.js';

export default class Addresses extends Component {
  constructor(element) {
    super();

    this.element = document.createElement('div');
    this.element.classList.add('addresses');

    this.addressData = [];

    this.render();
    this.load()
      .then(response => response.json())
      .then(data => this.addressData = data)
      .then(_ => this.render())
      .catch(error => console.error('Fehler beim Abrufen von JSON:', error));
  }

  load() {
    return fetch('./data/addresses.json');
  }

  addEvents() {
  }

  render() {
    this.element.innerHTML = this.template;
    this.addressList = this.element.querySelector('div');
    this.css`
      .addresses>div {
        display: flex;
        gap: 1rem;
      }
    `;

    this.addressData.map(address => {
      const addressItem = document.createElement('div');
      this.addressList.appendChild(addressItem);

      new Address({
        data: address,
        element: addressItem
      });
    });

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <h1>Adressen</h1>
      <div></div>
    `;
  }
}

class Address extends Component {
  constructor(args) {
    super();

    this.element = args.element;
    this.data = args.data;

    this.render();
  }

  addEvents() {
  }

  render() {
    this.element.innerHTML = this.template;
    this.css`
      .address-item {
        max-width: 50%;
      }
    `;

    this.addEvents();
  }

  get template() {
    return /*html*/`
      <strong>${this.data.companyname}</strong>
      <div>${this.data.street} ${this.data.streetnr}</div>
      <div>${this.data.zip} ${this.data.city}</div>
      <div>${this.data.country}</div>
    `;
  }
}