import Component from '/core/component.js';
import Sidebar from './sidebar.js';
import Header from './header.js';
import Main from './main.js';
import css from './index.css' with { type: 'css' };
// import Footer from './standard/footer.js';

export default class LayoutStandard extends Component {
  constructor(parent, element) {
    super(parent, element);

    this.render();
  }

  addEvents() {
    this.header.addEventListener('toggleMenu', _ => this.sidebar.render());
  }

  render() {
    this.element = document.createElement('div');
    this.element.classList.add('layout', 'layout-standard');
    this.element.innerHTML = this.template;
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, css];

    this.sidebar = new Sidebar(this, this.element.querySelector('aside'));
    this.header = new Header(this, this.element.querySelector('header'));
    this.main = new Main(this, this.element.querySelector('main'));

    // this.registerChildComponents([this.main]);
    // new Footer(this, this.element.querySelector('footer'));

    this.addEvents();
  }

  get template() {
    return /*html*/ `
      <header></header>
      <div>
        <aside></aside>
        <main></main>
      </div>
    `;
    // <footer></footer>
  }
}