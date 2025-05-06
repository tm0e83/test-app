import Component from '/core/component.js';
import './layout-sidebar.js';
import './layout-header.js';
import './layout-main.js';
// import Footer from './standard/footer.js';

export default class LayoutStandard extends Component {
  cssFilePath = '/layout/standard/index.css';

  constructor() {
    super();
  }

  addEvents() {
    // this.header.addEventListener('toggleMenu', _ => this.sidebar.toggle());
  }

  render() {
    this.innerHTML = this.template;

    this.header = this.querySelector('layout-header');
    this.sidebar = this.querySelector('layout-sidebar');
    this.main = this.querySelector('layout-main')
    // this.footer = this.querySelector('layout-footer');

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <layout-sidebar></layout-sidebar>
      <div>
        <layout-header></layout-header>
        <layout-main></layout-main>
      </div>
    `;
    // <footer></footer>
  }
}

customElements.define('layout-standard', LayoutStandard);