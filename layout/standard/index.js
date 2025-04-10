import Component from '/core/component.js';
import Sidebar from './sidebar.js';
import Header from './header.js';
import Main from './main.js';
// import Footer from './standard/footer.js';

export default class LayoutStandard extends Component {
  constructor(parent) {
    super(parent);

    this.addCSS('/layout/standard/index.css');
    this.element = document.createElement('div');
    this.element.classList.add('layout', 'layout-standard');
    this.render = this.render.bind(this);
    this.render();
  }

  addEvents() {
    this.header.addEventListener('toggleMenu', _ => this.sidebar.toggle());
  }

  render() {
    this.element.innerHTML = this.template;

    this.header = new Header(this);
    this.element.querySelector('header').replaceWith(this.header.element);

    this.sidebar = new Sidebar(this);
    this.element.querySelector('aside').replaceWith(this.sidebar.element);

    this.main = new Main(this);
    this.element.querySelector('main').replaceWith(this.main.element);

    // this.footer = new Footer(this);
    // this.element.querySelector('footer').replaceWith(this.footer.element);

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